"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { preferRealName, isPlaceholderName } from "@/lib/display-name";
import { useUserStore } from "@/store/user-store";
import {
  isStartingLevel,
  type DemoUser,
  type StartingLevel,
  type SyncDirtyField,
} from "@/lib/types";
import { mergeStreakFields } from "@/lib/streak";

const DEBOUNCE_MS = 750;


type ProgressPayload = {
  /** Only when "name" is dirty — otherwise the server's value stands. */
  displayName?: string;
  xp: number;
  streak: number;
  /** Only when "dailyGoal" is dirty. */
  dailyGoal?: number;
  dailyXp: number;
  lastStreakDate: string | null;
  /** The placement trio travels together, only when "placement" is dirty. */
  startingLevel?: StartingLevel;
  skippedUnitIds?: string[];
  recommendedUnitId?: string | null;
  onboardingComplete: boolean;
  completedLessonIds: string[];
  weakWordIds: string[];
  archivedWordIds: string[];
  gotItAt: Record<string, string>;
  srsCards: DemoUser["srsCards"];
};

/**
 * Progress always travels; hand-picked settings travel only when this device
 * edited them (see DemoUser.dirtyFields). Otherwise a stale cache would win
 * on the server and every device would just see its own value echoed back.
 */
function buildProgressPayload(
  user: DemoUser
): { payload: ProgressPayload; sent: SyncDirtyField[] } {
  const dirty = new Set(user.dirtyFields ?? []);
  const sent: SyncDirtyField[] = [];
  const payload: ProgressPayload = {
    xp: user.xp,
    streak: user.streak,
    dailyXp: user.dailyXp,
    lastStreakDate: user.lastStreakDate ?? null,
    onboardingComplete: user.onboardingComplete,
    completedLessonIds: user.completedLessonIds,
    weakWordIds: user.weakWordIds,
    archivedWordIds: user.archivedWordIds ?? [],
    gotItAt: user.gotItAt ?? {},
    srsCards: user.srsCards ?? {},
  };
  // A placeholder is never an edit worth pushing, even if flagged.
  if (dirty.has("name") && !isPlaceholderName(user.name)) {
    payload.displayName = user.name.trim();
    sent.push("name");
  }
  if (dirty.has("dailyGoal")) {
    payload.dailyGoal = user.dailyGoal;
    sent.push("dailyGoal");
  }
  if (dirty.has("placement")) {
    payload.startingLevel = user.startingLevel;
    payload.skippedUnitIds = user.skippedUnitIds ?? [];
    payload.recommendedUnitId = user.recommendedUnitId ?? null;
    sent.push("placement");
  }
  return { payload, sent };
}

/**
 * Dirty flags to clear after a successful PUT: only those whose value is
 * still what went over the wire. An edit made while the request was in
 * flight stays dirty so it gets its own PUT.
 */
function confirmedFields(
  sentUser: DemoUser,
  sent: SyncDirtyField[]
): SyncDirtyField[] {
  const now = useUserStore.getState().user;
  const sameIds = (a: string[] = [], b: string[] = []) =>
    a.length === b.length && a.every((id, i) => id === b[i]);
  return sent.filter((f) => {
    if (f === "name") return now.name === sentUser.name;
    if (f === "dailyGoal") return now.dailyGoal === sentUser.dailyGoal;
    return (
      now.startingLevel === sentUser.startingLevel &&
      now.recommendedUnitId === sentUser.recommendedUnitId &&
      sameIds(now.skippedUnitIds, sentUser.skippedUnitIds)
    );
  });
}

/**
 * Stable fingerprint of fields that must reach Postgres for leaderboard/sync.
 * dirtyFields is deliberately left out: clearing a flag after a successful
 * PUT must not itself schedule another PUT.
 */
function progressFingerprint(user: DemoUser): string {
  return JSON.stringify({
    name: user.name,
    xp: user.xp,
    streak: user.streak,
    dailyXp: user.dailyXp,
    lastStreakDate: user.lastStreakDate ?? null,
    dailyGoal: user.dailyGoal,
    startingLevel: user.startingLevel,
    onboardingComplete: user.onboardingComplete,
    completedLessonIds: user.completedLessonIds,
    weakWordIds: user.weakWordIds,
    archivedWordIds: user.archivedWordIds ?? [],
    gotItAt: user.gotItAt ?? {},
    srsCards: user.srsCards ?? {},
    skippedUnitIds: user.skippedUnitIds ?? [],
    recommendedUnitId: user.recommendedUnitId ?? null,
  });
}

function progressFieldsChanged(a: DemoUser, b: DemoUser): boolean {
  return progressFingerprint(a) !== progressFingerprint(b);
}

/**
 * Weak vs mastered are exclusive: union both, then mastered wins over weak,
 * except that a word the remote side marked weak again is un-mastered.
 */
function mergeReviewLists(
  local: DemoUser,
  remote: Partial<DemoUser>
): Pick<DemoUser, "weakWordIds" | "archivedWordIds" | "gotItAt"> {
  const remoteWeak = new Set(remote.weakWordIds ?? []);
  const archived = Array.from(
    new Set([...(remote.archivedWordIds ?? []), ...(local.archivedWordIds ?? [])])
  ).filter((id) => !remoteWeak.has(id));
  const archivedSet = new Set(archived);
  const weak = Array.from(
    new Set([...(remote.weakWordIds ?? []), ...local.weakWordIds])
  ).filter((id) => !archivedSet.has(id));
  const gotItAt: Record<string, string> = { ...(local.gotItAt ?? {}) };
  for (const [id, iso] of Object.entries(remote.gotItAt ?? {})) {
    if (!gotItAt[id] || new Date(iso) > new Date(gotItAt[id])) gotItAt[id] = iso;
  }
  return { weakWordIds: weak, archivedWordIds: archived, gotItAt };
}

function applyMergedProgress(
  p: Partial<DemoUser> & { name?: string; startingLevel?: string },
  sessionName: string | undefined
) {
  useUserStore.setState((s) => {
    const mergeIds = (local: string[] = [], remote?: string[]) =>
      Array.from(new Set([...(remote ?? []), ...local]));

    // Settings this device edited since the last confirmed PUT keep their
    // local value; everything else takes the server's, which is now genuinely
    // the server's because the request didn't echo our cache.
    const dirty = new Set(s.user.dirtyFields ?? []);

    return {
      user: {
        ...s.user,
        id: typeof p.id === "string" ? p.id : s.user.id,
        name: dirty.has("name")
          ? s.user.name
          : preferRealName(p.name, sessionName) || s.user.name,
        // Never clobber newer local XP/streak/dailyXp with a stale response.
        xp: typeof p.xp === "number" ? Math.max(p.xp, s.user.xp) : s.user.xp,
        dailyGoal:
          !dirty.has("dailyGoal") && typeof p.dailyGoal === "number"
            ? p.dailyGoal
            : s.user.dailyGoal,
        ...mergeStreakFields(s.user, {
          streak: typeof p.streak === "number" ? p.streak : s.user.streak,
          dailyXp: typeof p.dailyXp === "number" ? p.dailyXp : s.user.dailyXp,
          lastStreakDate:
            p.lastStreakDate !== undefined
              ? p.lastStreakDate
              : s.user.lastStreakDate,
        }),
        startingLevel:
          !dirty.has("placement") && isStartingLevel(p.startingLevel)
            ? p.startingLevel
            : s.user.startingLevel,
        onboardingComplete: Boolean(
          p.onboardingComplete || s.user.onboardingComplete
        ),
        completedLessonIds: mergeIds(
          s.user.completedLessonIds,
          p.completedLessonIds
        ),
        ...mergeReviewLists(s.user, p),
        // Server PUT already merged SRS; prefer that, fall back to local.
        srsCards:
          (p as { srsCards?: DemoUser["srsCards"] }).srsCards ??
          s.user.srsCards ??
          {},
        // Replace, not union: the server holds the latest explicit choice and
        // a union could only ever grow the skipped set back.
        skippedUnitIds:
          !dirty.has("placement") && Array.isArray(p.skippedUnitIds)
            ? p.skippedUnitIds
            : s.user.skippedUnitIds,
        recommendedUnitId:
          !dirty.has("placement") && p.recommendedUnitId
            ? p.recommendedUnitId
            : s.user.recommendedUnitId,
      },
    };
  });
}

/**
 * PUT current Zustand progress to `/api/progress`.
 * Used by ProgressSync (debounced) and leaderboard flush-before-fetch.
 */
export async function flushProgressToServer(opts?: {
  /** Apply merged server response into the store (initial sync). */
  applyResponse?: boolean;
  /** Prefer keepalive for pagehide / beforeunload. */
  keepalive?: boolean;
  sessionName?: string | null;
}): Promise<boolean> {
  const user = useUserStore.getState().user;
  const sessionName = opts?.sessionName ?? undefined;
  const { payload, sent } = buildProgressPayload(user);

  try {
    const res = await fetch("/api/progress", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: opts?.keepalive === true,
    });
    if (!res.ok) return false;
    // Only now: a failed or offline PUT leaves the flags set so the edit is
    // retried on the next sync instead of being silently dropped.
    if (sent.length) {
      useUserStore.getState().clearDirtyFields(confirmedFields(user, sent));
    }
    if (!opts?.applyResponse) return true;

    const data = (await res.json()) as {
      progress?: Partial<DemoUser> & {
        name?: string;
        startingLevel?: string;
      };
    };
    if (data.progress) {
      applyMergedProgress(data.progress, sessionName);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Best-effort: when a session appears, push localStorage demo progress to DB
 * and pull the merged result back into the Zustand store. Demo mode still works
 * without login.
 *
 * After the initial merge, debounced re-PUTs keep Postgres (and the leaderboard)
 * in sync when lesson XP / streak / SRS / etc. change mid-session.
 *
 * Placeholder local names ("Learner", empty, etc.) yield to Google/session name
 * so the home greeting shows the OAuth profile name after sign-in.
 */
export function ProgressSync() {
  const { data: session, status } = useSession();
  const syncedFor = useRef<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const applyingRef = useRef(false);
  const rolloverStreak = useUserStore((s) => s.rolloverStreak);

  useEffect(() => {
    rolloverStreak();
    const onVisible = () => {
      if (document.visibilityState === "visible") rolloverStreak();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [rolloverStreak]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;

    const userId = session.user.id;
    const sessionName = session.user.name ?? undefined;
    let cancelled = false;

    const clearDebounce = () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };

    const schedulePut = () => {
      clearDebounce();
      debounceRef.current = setTimeout(() => {
        if (cancelled || syncedFor.current !== userId) return;
        void flushProgressToServer({ sessionName });
      }, DEBOUNCE_MS);
    };

    // Snappy UI: swap placeholder for Google name before the round-trip finishes.
    const user = useUserStore.getState().user;
    const resolvedName = preferRealName(user.name, sessionName);
    if (resolvedName !== user.name && !isPlaceholderName(resolvedName)) {
      useUserStore.setState((s) => ({
        user: { ...s.user, name: resolvedName },
      }));
    }

    // Initial merge sync once per authenticated user id this mount cycle.
    if (syncedFor.current !== userId) {
      applyingRef.current = true;
      void (async () => {
        const ok = await flushProgressToServer({
          applyResponse: true,
          sessionName,
        });
        if (cancelled) return;
        if (ok) syncedFor.current = userId;
        applyingRef.current = false;
      })();
    }

    const unsub = useUserStore.subscribe((state, prev) => {
      if (cancelled) return;
      if (syncedFor.current !== userId) return;
      if (applyingRef.current) return;
      if (!progressFieldsChanged(state.user, prev.user)) return;
      schedulePut();
    });

    const flushKeepalive = () => {
      if (syncedFor.current !== userId) return;
      clearDebounce();
      void flushProgressToServer({ keepalive: true, sessionName });
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") flushKeepalive();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", flushKeepalive);

    return () => {
      cancelled = true;
      clearDebounce();
      unsub();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flushKeepalive);
    };
  }, [session?.user?.id, session?.user?.name, status]);

  return null;
}
