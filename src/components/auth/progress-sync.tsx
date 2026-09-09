"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { preferRealName, isPlaceholderName } from "@/lib/display-name";
import { useUserStore } from "@/store/user-store";
import type { DemoUser, StartingLevel } from "@/lib/types";

function isStartingLevel(v: unknown): v is StartingLevel {
  return (
    v === "absolute_beginner" ||
    v === "some_words" ||
    v === "conversational_basics"
  );
}

/**
 * Best-effort: when a session appears, push localStorage demo progress to DB
 * and pull the merged result back into the Zustand store. Demo mode still works
 * without login.
 *
 * Placeholder local names ("Learner", empty, etc.) yield to Google/session name
 * so the home greeting shows the OAuth profile name after sign-in.
 */
export function ProgressSync() {
  const { data: session, status } = useSession();
  const syncedFor = useRef<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;
    if (syncedFor.current === session.user.id) return;

    const user = useUserStore.getState().user;
    const sessionName = session.user.name ?? undefined;
    const resolvedName = preferRealName(user.name, sessionName);

    // Snappy UI: swap placeholder for Google name before the round-trip finishes.
    if (resolvedName !== user.name && !isPlaceholderName(resolvedName)) {
      useUserStore.setState((s) => ({
        user: { ...s.user, name: resolvedName },
      }));
    }

    const payload = {
      displayName: resolvedName,
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

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/progress", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as {
          progress?: Partial<DemoUser> & {
            name?: string;
            startingLevel?: string;
          };
        };
        const p = data.progress;
        if (!p || cancelled) return;

        useUserStore.setState((s) => ({
          user: {
            ...s.user,
            id: typeof p.id === "string" ? p.id : s.user.id,
            name: preferRealName(p.name, sessionName) || s.user.name,
            xp: typeof p.xp === "number" ? p.xp : s.user.xp,
            streak: typeof p.streak === "number" ? p.streak : s.user.streak,
            dailyGoal:
              typeof p.dailyGoal === "number" ? p.dailyGoal : s.user.dailyGoal,
            dailyXp:
              typeof p.dailyXp === "number" ? p.dailyXp : s.user.dailyXp,
            startingLevel: isStartingLevel(p.startingLevel)
              ? p.startingLevel
              : s.user.startingLevel,
            onboardingComplete: Boolean(
              p.onboardingComplete ?? s.user.onboardingComplete
            ),
            completedLessonIds:
              p.completedLessonIds ?? s.user.completedLessonIds,
            weakWordIds: p.weakWordIds ?? s.user.weakWordIds,
            srsCards: (p as { srsCards?: DemoUser["srsCards"] }).srsCards ?? s.user.srsCards ?? {},
            skippedUnitIds: p.skippedUnitIds ?? s.user.skippedUnitIds ?? [],
            recommendedUnitId:
              p.recommendedUnitId ?? s.user.recommendedUnitId,
          },
        }));
        syncedFor.current = session.user.id;
      } catch {
        // Keep local demo state if sync fails.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id, session?.user?.name, status]);

  return null;
}
