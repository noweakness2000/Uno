"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DemoUser, StartingLevel } from "@/lib/types";
import { DEMO_USER as DEFAULT_USER } from "@/lib/mock-data";
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

interface UserState {
  user: DemoUser;
  setDailyGoal: (goal: number) => void;
  completeOnboarding: (
    goal: number,
    name: string,
    startingLevel: StartingLevel
  ) => void;
  updateName: (name: string) => void;
  addXp: (amount: number) => void;
  completeLesson: (lessonId: string, earnedXp: number) => void;
  markWeak: (wordIds: string[]) => void;
  clearWeak: (wordId: string) => void;
  /** Mark Unit 1 skipped/complete and aim Continue at Unit 2. */
  skipUnit1: () => void;
  /** Jump absolute beginners to Intermediate (Unit 4+). */
  jumpToIntermediate: () => void;
  resetDemo: () => void;
}

function withPlacementDefaults(user: DemoUser): DemoUser {
  return {
    ...user,
    skippedUnitIds: user.skippedUnitIds ?? [],
    recommendedUnitId:
      user.recommendedUnitId ??
      recommendedUnitForLevel(user.startingLevel ?? "absolute_beginner"),
  };
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: withPlacementDefaults({ ...DEFAULT_USER }),
      setDailyGoal: (goal) =>
        set((s) => ({ user: { ...s.user, dailyGoal: goal } })),
      completeOnboarding: (goal, name, startingLevel) => {
        const skippedLessons = skippedLessonsForLevel(startingLevel);
        const skippedUnitIds = skippedUnitsForLevel(startingLevel);
        const recommendedUnitId = recommendedUnitForLevel(startingLevel);
        set((s) => {
          const completed = new Set([
            ...s.user.completedLessonIds,
            ...skippedLessons,
          ]);
          return {
            user: {
              ...s.user,
              dailyGoal: goal,
              name: name.trim() || "Learner",
              startingLevel,
              onboardingComplete: true,
              streak: Math.max(s.user.streak, 1),
              skippedUnitIds,
              recommendedUnitId,
              completedLessonIds: Array.from(completed),
            },
          };
        });
      },
      updateName: (name) =>
        set((s) => ({
          user: { ...s.user, name: name.trim() || s.user.name },
        })),
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
        set({
          user: {
            ...user,
            xp: user.xp + earnedXp,
            dailyXp: user.dailyXp + earnedXp,
            streak: user.streak || 1,
            completedLessonIds: already
              ? user.completedLessonIds
              : [...user.completedLessonIds, lessonId],
          },
        });
      },
      markWeak: (wordIds) =>
        set((s) => {
          const setIds = new Set([...s.user.weakWordIds, ...wordIds]);
          return { user: { ...s.user, weakWordIds: Array.from(setIds) } };
        }),
      clearWeak: (wordId) =>
        set((s) => ({
          user: {
            ...s.user,
            weakWordIds: s.user.weakWordIds.filter((id) => id !== wordId),
          },
        })),
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
            },
          };
        }),
      resetDemo: () => set({ user: withPlacementDefaults({ ...DEFAULT_USER }) }),
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
