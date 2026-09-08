"use client";

import { create } from "zustand";
import type { Exercise } from "@/lib/types";

interface LessonSessionState {
  lessonId: string | null;
  index: number;
  correctCount: number;
  wrongCount: number;
  earnedXp: number;
  weakWordIds: string[];
  showFeedback: boolean;
  lastCorrect: boolean | null;
  lastExplanation: string;
  finished: boolean;
  startLesson: (lessonId: string) => void;
  recordAnswer: (opts: {
    correct: boolean;
    explanation: string;
    xp: number;
    wordCardIds?: string[];
  }) => void;
  continueAfterFeedback: (totalExercises: number) => void;
  reset: () => void;
}

const initial = {
  lessonId: null as string | null,
  index: 0,
  correctCount: 0,
  wrongCount: 0,
  earnedXp: 0,
  weakWordIds: [] as string[],
  showFeedback: false,
  lastCorrect: null as boolean | null,
  lastExplanation: "",
  finished: false,
};

export const useLessonStore = create<LessonSessionState>((set, get) => ({
  ...initial,
  startLesson: (lessonId) => set({ ...initial, lessonId }),
  recordAnswer: ({ correct, explanation, xp, wordCardIds }) => {
    const weak = wordCardIds ?? [];
    set((s) => ({
      showFeedback: true,
      lastCorrect: correct,
      lastExplanation: explanation,
      correctCount: s.correctCount + (correct ? 1 : 0),
      wrongCount: s.wrongCount + (correct ? 0 : 1),
      earnedXp: s.earnedXp + (correct ? xp : Math.max(1, Math.floor(xp / 2))),
      weakWordIds: correct
        ? s.weakWordIds
        : Array.from(new Set([...s.weakWordIds, ...weak])),
    }));
  },
  continueAfterFeedback: (totalExercises) => {
    const { index } = get();
    const next = index + 1;
    if (next >= totalExercises) {
      set({ showFeedback: false, finished: true, index: next });
    } else {
      set({ showFeedback: false, index: next, lastCorrect: null });
    }
  },
  reset: () => set({ ...initial }),
}));

export type { Exercise };
