"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { preferRealName, isPlaceholderName } from "@/lib/display-name";
import { useUserStore } from "@/store/user-store";
import type { DemoUser, StartingLevel } from "@/lib/types";

const DEBOUNCE_MS = 750;

function isStartingLevel(v: unknown): v is StartingLevel {
  return (
    v === "absolute_beginner" ||
    v === "some_words" ||
    v === "conversational_basics"
  );
}

type ProgressPayload = {
  displayName: string;
  xp: number;
  streak: number;
  dailyGoal: number;
  dailyXp: number;
  startingLevel: StartingLevel;
  onboardingComplete: boolean;
  completedLessonIds: string[];
  weakWordIds: string[];
  srsCards: DemoUser["srsCards"];
  skippedUnitIds: string[];
  recommendedUnitId: string | null;
};

function buildProgressPayload(
  user: DemoUser,
  displayName: string
): ProgressPayload {
  return {
    displayName,
    xp: user.xp,
    streak: user.streak,
    dailyGoal: user.dailyGoal,
    dailyXp: user.dailyXp,
    startingLevel: user.startingLevel,
    onboardingComplete: user.onboardingComplete,
    completedLessonIds: user.completedLessonIds,
    weakWordIds: user.weakWordIds,
    srsCards: user.srsCards ?? {},
    skippedUnitIds: user.skippedUnitIds ?? [],
    recommendedUnitId: user.recommendedUnitId ?? null,
  };
}

/** Stable fingerprint of fields that must reach Postgres for leaderboard/sync. */
function progressFingerprint(user: DemoUser): string {
  return JSON.stringify({
    name: user.name,
    xp: user.xp,
    streak: user.streak,
    dailyXp: user.dailyXp,
    dailyGoal: user.dailyGoal,
    startingLevel: user.startingLevel,
    onboardingComplete: user.onboardingComplete,
    completedLessonIds: user.completedLessonIds,
    weakWordIds: user.weakWordIds,
    srsCards: user.srsCards ?? {},
    skippedUnitIds: user.skippedUnitIds ?? [],
    recommendedUnitId: user.recommendedUnitId ?? null,
  });
}

function progressFieldsChanged(a: DemoUser, b: DemoUser): boolean {
  return progressFingerprint(a) !== progressFingerprint(b);
}

function applyMergedProgress(
  p: Partial<DemoUser> & { name?: string; startingLevel?: string },
  sessionName: string | undefined
) {
  useUserStore.setState((s) => {
    const mergeIds = (local: string[] = [], remote?: string[]) =>
      Array.from(new Set([...(remote ?? []), ...local]));

    return {
      user: {
        ...s.user,
        id: typeof p.id === "string" ? p.id : s.user.id,
        name: preferRealName(p.name, sessionName) || s.user.name,
        // Never clobber newer local XP/streak/dailyXp with a stale response.
        xp: typeof p.xp === "number" ? Math.max(p.xp, s.user.xp) : s.user.xp,
        streak:
          typeof p.streak === "number"
            ? Math.max(p.streak, s.user.streak)
            : s.user.streak,
        dailyGoal:
          typeof p.dailyGoal === "number" ? p.dailyGoal : s.user.dailyGoal,
        dailyXp:
          typeof p.dailyXp === "number"
            ? Math.max(p.dailyXp, s.user.dailyXp)
            : s.user.dailyXp,
        startingLevel: isStartingLevel(p.startingLevel)
          ? p.startingLevel
          : s.user.startingLevel,
        onboardingComplete: Boolean(
          p.onboardingComplete || s.user.onboardingComplete
        ),
        completedLessonIds: mergeIds(
          s.user.completedLessonIds,
          p.completedLessonIds
        ),
        weakWordIds: mergeIds(s.user.weakWordIds, p.weakWordIds),
        // Server PUT already merged SRS; prefer that, fall back to local.
        srsCards:
          (p as { srsCards?: DemoUser["srsCards"] }).srsCards ??
          s.user.srsCards ??
          {},
        skippedUnitIds: mergeIds(s.user.skippedUnitIds, p.skippedUnitIds),
        recommendedUnitId:
          p.recommendedUnitId ?? s.user.recommendedUnitId,
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
  const resolvedName = preferRealName(user.name, sessionName);
  const payload = buildProgressPayload(user, resolvedName);

  try {
    const res = await fetch("/api/progress", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: opts?.keepalive === true,
    });
    if (!res.ok) return false;
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
