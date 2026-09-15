"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AnswerConfidence,
  DemoUser,
  StartingLevel,
  SyncDirtyField,
} from "@/lib/types";
import { DEMO_USER as DEFAULT_USER } from "@/lib/mock-data";
import {
  ensureDueSoon,
  gradeAgain,
  gradeGood,
  gradeGoodUnsure,
  type SrsCards,
} from "@/lib/srs";
import {
  beginnerLessonIds,
  BEGINNER_UNIT_IDS,
  FIRST_INTERMEDIATE_UNIT_ID,
  recommendedUnitForLevel,
  skippedLessonsForLevel,
  skippedUnitsForLevel,
  UNIT_1_ID,
  UNIT_2_ID,
  unit1LessonIds,
} from "@/lib/placement";
import { applyLessonDay, applyStreakRollover } from "@/lib/streak";

interface UserState {
  user: DemoUser;
  setDailyGoal: (goal: number) => void;
  completeOnboarding: (
    goal: number,
    name: string,
    startingLevel: StartingLevel
  ) => void;
  updateName: (name: string) => void;
  /**
   * Re-pick the self-claimed level from Settings. Re-runs the same placement
   * as completeOnboarding (recommended unit, skipped units, auto-marked
   * lessons) but never removes completed lessons.
   */
  setStartingLevel: (startingLevel: StartingLevel) => void;
  addXp: (amount: number) => void;
  completeLesson: (lessonId: string, earnedXp: number) => void;
  markWeak: (wordIds: string[]) => void;
  clearWeak: (wordId: string) => void;
  /**
   * Review "Got it": first click within 7 days clears the word; the second
   * graduates it to archivedWordIds ("Mastered").
   */
  archiveWeak: (wordId: string) => void;
  /**
   * Lesson result for words that already have an SRS card (i.e. were weak
   * once). Never creates cards, so lessons don't flood the flashcard queue.
   */
  reinforceWords: (wordIds: string[], confidence: AnswerConfidence) => void;
  /** Flashcard Again — short interval + stay weak. */
  srsAgain: (wordId: string) => void;
  /** Flashcard Good — grow interval + clear weak. */
  srsGood: (wordId: string) => void;
  /** Mark Unit 1 skipped/complete and aim Continue at Unit 2. */
  skipUnit1: () => void;
  /** Jump absolute beginners to Intermediate (Unit 4+). */
  jumpToIntermediate: () => void;
  resetDemo: () => void;
  /** Break stale streaks / zero yesterday's daily XP after midnight. */
  rolloverStreak: () => void;
  /** Server confirmed these settings — stop pushing them until edited again. */
  clearDirtyFields: (fields: SyncDirtyField[]) => void;
}

function markDirty(
  user: DemoUser,
  ...fields: SyncDirtyField[]
): SyncDirtyField[] {
  return Array.from(new Set([...(user.dirtyFields ?? []), ...fields]));
}

/** Two "Got it" clicks this close together graduate a word. */
const GOT_IT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

function withPlacementDefaults(user: DemoUser): DemoUser {
  return applyStreakRollover({
    ...user,
    skippedUnitIds: user.skippedUnitIds ?? [],
    srsCards: user.srsCards ?? {},
    archivedWordIds: user.archivedWordIds ?? [],
    gotItAt: user.gotItAt ?? {},
    lastStreakDate: user.lastStreakDate ?? null,
    dirtyFields: user.dirtyFields ?? [],
    recommendedUnitId:
      user.recommendedUnitId ??
      recommendedUnitForLevel(user.startingLevel ?? "absolute_beginner"),
  });
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: withPlacementDefaults({ ...DEFAULT_USER }),
      setDailyGoal: (goal) =>
        set((s) => ({
          user: {
            ...s.user,
            dailyGoal: goal,
            dirtyFields: markDirty(s.user, "dailyGoal"),
          },
        })),
      completeOnboarding: (goal, name, startingLevel) => {
        const skippedLessons = skippedLessonsForLevel(startingLevel);
        const skippedUnitIds = skippedUnitsForLevel(startingLevel);
        const recommendedUnitId = recommendedUnitForLevel(startingLevel);
        set((s) => {
          const completed = new Set([
            ...s.user.completedLessonIds,
            ...skippedLessons,
          ]);
          // Goal and level are always chosen here; the name only if typed.
          const dirty: SyncDirtyField[] = ["dailyGoal", "placement"];
          if (name.trim()) dirty.push("name");
          return {
            user: {
              ...s.user,
              dailyGoal: goal,
              name: name.trim() || "Learner",
              startingLevel,
              onboardingComplete: true,
              skippedUnitIds,
              recommendedUnitId,
              completedLessonIds: Array.from(completed),
              dirtyFields: markDirty(s.user, ...dirty),
            },
          };
        });
      },
      updateName: (name) =>
        set((s) =>
          name.trim()
            ? {
                user: {
                  ...s.user,
                  name: name.trim(),
                  dirtyFields: markDirty(s.user, "name"),
                },
              }
            : s
        ),
      setStartingLevel: (startingLevel) =>
        set((s) => {
          const completed = new Set([
            ...s.user.completedLessonIds,
            ...skippedLessonsForLevel(startingLevel),
          ]);
          return {
            user: {
              ...s.user,
              startingLevel,
              skippedUnitIds: skippedUnitsForLevel(startingLevel),
              recommendedUnitId: recommendedUnitForLevel(startingLevel),
              completedLessonIds: Array.from(completed),
              dirtyFields: markDirty(s.user, "placement"),
            },
          };
        }),
      addXp: (amount) =>
        set((s) => ({
          user: {
            ...s.user,
            xp: s.user.xp + amount,
            dailyXp: s.user.dailyXp + amount,
          },
        })),
      completeLesson: (lessonId, earnedXp) => {
        const { user } = get();
        const already = user.completedLessonIds.includes(lessonId);
        const day = applyLessonDay(user, earnedXp);
        set({
          user: {
            ...user,
            xp: user.xp + earnedXp,
            dailyXp: day.dailyXp,
            streak: day.streak,
            lastStreakDate: day.lastStreakDate,
            completedLessonIds: already
              ? user.completedLessonIds
              : [...user.completedLessonIds, lessonId],
          },
        });
      },
      markWeak: (wordIds) =>
        set((s) => {
          const setIds = new Set([...s.user.weakWordIds, ...wordIds]);
          const now = new Date();
          const srsCards: SrsCards = { ...(s.user.srsCards ?? {}) };
          for (const id of wordIds) {
            srsCards[id] = ensureDueSoon(srsCards[id], now);
          }
          // Wrong again → no longer mastered.
          const wrong = new Set(wordIds);
          return {
            user: {
              ...s.user,
              weakWordIds: Array.from(setIds),
              archivedWordIds: (s.user.archivedWordIds ?? []).filter(
                (id) => !wrong.has(id)
              ),
              srsCards,
            },
          };
        }),
      archiveWeak: (wordId) =>
        set((s) => {
          const now = new Date();
          const last = s.user.gotItAt?.[wordId];
          const recent =
            last !== undefined &&
            now.getTime() - new Date(last).getTime() <= GOT_IT_WINDOW_MS;
          const weakWordIds = s.user.weakWordIds.filter((id) => id !== wordId);
          if (recent) {
            const { [wordId]: _spent, ...gotItAt } = s.user.gotItAt ?? {};
            void _spent;
            return {
              user: {
                ...s.user,
                weakWordIds,
                archivedWordIds: Array.from(
                  new Set([...(s.user.archivedWordIds ?? []), wordId])
                ),
                gotItAt,
              },
            };
          }
          return {
            user: {
              ...s.user,
              weakWordIds,
              gotItAt: { ...(s.user.gotItAt ?? {}), [wordId]: now.toISOString() },
            },
          };
        }),
      reinforceWords: (wordIds, confidence) =>
        set((s) => {
          const now = new Date();
          const srsCards: SrsCards = { ...(s.user.srsCards ?? {}) };
          let touched = false;
          for (const id of wordIds) {
            const prev = srsCards[id];
            if (!prev) continue;
            srsCards[id] =
              confidence === "unsure"
                ? gradeGoodUnsure(prev, now)
                : gradeGood(prev, now);
            touched = true;
          }
          return touched ? { user: { ...s.user, srsCards } } : {};
        }),
      clearWeak: (wordId) =>
        set((s) => ({
          user: {
            ...s.user,
            weakWordIds: s.user.weakWordIds.filter((id) => id !== wordId),
          },
        })),
      srsAgain: (wordId) =>
        set((s) => {
          const now = new Date();
          const srsCards = {
            ...(s.user.srsCards ?? {}),
            [wordId]: gradeAgain(s.user.srsCards?.[wordId], now),
          };
          const weak = new Set([...s.user.weakWordIds, wordId]);
          return {
            user: {
              ...s.user,
              srsCards,
              weakWordIds: Array.from(weak),
            },
          };
        }),
      srsGood: (wordId) =>
        set((s) => {
          const now = new Date();
          const srsCards = {
            ...(s.user.srsCards ?? {}),
            [wordId]: gradeGood(s.user.srsCards?.[wordId], now),
          };
          return {
            user: {
              ...s.user,
              srsCards,
              weakWordIds: s.user.weakWordIds.filter((id) => id !== wordId),
            },
          };
        }),
      skipUnit1: () =>
        set((s) => {
          const completed = new Set([
            ...s.user.completedLessonIds,
            ...unit1LessonIds(),
          ]);
          const skipped = new Set([
            ...(s.user.skippedUnitIds ?? []),
            UNIT_1_ID,
          ]);
          return {
            user: {
              ...s.user,
              completedLessonIds: Array.from(completed),
              skippedUnitIds: Array.from(skipped),
              recommendedUnitId: UNIT_2_ID,
              dirtyFields: markDirty(s.user, "placement"),
            },
          };
        }),
      jumpToIntermediate: () =>
        set((s) => {
          const completed = new Set([
            ...s.user.completedLessonIds,
            ...beginnerLessonIds(),
          ]);
          const skipped = new Set([
            ...(s.user.skippedUnitIds ?? []),
            ...BEGINNER_UNIT_IDS,
          ]);
          return {
            user: {
              ...s.user,
              completedLessonIds: Array.from(completed),
              skippedUnitIds: Array.from(skipped),
              recommendedUnitId: FIRST_INTERMEDIATE_UNIT_ID,
              dirtyFields: markDirty(s.user, "placement"),
            },
          };
        }),
      resetDemo: () => set({ user: withPlacementDefaults({ ...DEFAULT_USER }) }),
      clearDirtyFields: (fields) =>
        set((s) => {
          const drop = new Set(fields);
          const dirtyFields = (s.user.dirtyFields ?? []).filter(
            (f) => !drop.has(f)
          );
          if (dirtyFields.length === (s.user.dirtyFields ?? []).length) return s;
          return { user: { ...s.user, dirtyFields } };
        }),
      rolloverStreak: () =>
        set((s) => {
          const next = applyStreakRollover(s.user);
          if (
            next.streak === s.user.streak &&
            next.dailyXp === s.user.dailyXp
          ) {
            return s;
          }
          return { user: next };
        }),
    }),
    {
      name: "uno-demo-user",
      merge: (persisted, current) => {
        const p = (persisted as { user?: DemoUser } | undefined)?.user;
        if (!p) return current;
        return {
          ...current,
          user: withPlacementDefaults({ ...current.user, ...p }),
        };
      },
    }
  )
);
