"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DemoUser } from "@/lib/types";
import { DEMO_USER as DEFAULT_USER } from "@/lib/mock-data";

interface UserState {
  user: DemoUser;
  setDailyGoal: (goal: number) => void;
  completeOnboarding: (goal: number) => void;
  addXp: (amount: number) => void;
  completeLesson: (lessonId: string, earnedXp: number) => void;
  markWeak: (wordIds: string[]) => void;
  clearWeak: (wordId: string) => void;
  resetDemo: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: { ...DEFAULT_USER },
      setDailyGoal: (goal) =>
        set((s) => ({ user: { ...s.user, dailyGoal: goal } })),
      completeOnboarding: (goal) =>
        set((s) => ({
          user: {
            ...s.user,
            dailyGoal: goal,
            onboardingComplete: true,
            streak: Math.max(s.user.streak, 1),
          },
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
      resetDemo: () => set({ user: { ...DEFAULT_USER } }),
    }),
    { name: "uno-demo-user" }
  )
);
