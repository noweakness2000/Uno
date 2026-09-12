"use client";

import { create } from "zustand";
import type { AnswerConfidence } from "@/lib/types";
import type { Exercise } from "@/lib/types";

interface LessonSessionState {
  lessonId: string | null;
  index: number;
  correctCount: number;
  wrongCount: number;
  earnedXp: number;
  weakWordIds: string[];
  reinforcedWordIds: string[];
  unsureWordIds: string[];
  showFeedback: boolean;
  lastCorrect: boolean | null;
  lastExplanation: string;
  lastCorrectAnswer: string;
  finished: boolean;
  startLesson: (lessonId: string) => void;
  recordAnswer: (opts: {
    correct: boolean;
    explanation: string;
    xp: number;
    wordCardIds?: string[];
    correctAnswer?: string;
    /** "unsure" = the learner pressed Not sure; defaults to "certain". */
    confidence?: AnswerConfidence;
  }) => void;
  /** Advance past a Teach step — 0 XP, no wrong count, no feedback panel. */
  continueTeach: (totalExercises: number) => void;
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
  /** Word cards answered correctly with confidence — SRS "good" at the end. */
  reinforcedWordIds: [] as string[],
  /** Word cards answered correctly but flagged Not sure — softer SRS credit. */
  unsureWordIds: [] as string[],
  showFeedback: false,
  lastCorrect: null as boolean | null,
  lastExplanation: "",
  lastCorrectAnswer: "",
  finished: false,
};

export const useLessonStore = create<LessonSessionState>((set, get) => ({
  ...initial,
  startLesson: (lessonId) => set({ ...initial, lessonId }),
  recordAnswer: ({
    correct,
    explanation,
    xp,
    wordCardIds,
    correctAnswer,
    confidence = "certain",
  }) => {
    const ids = wordCardIds ?? [];
    const union = (a: string[], b: string[]) => Array.from(new Set([...a, ...b]));
    set((s) => ({
      showFeedback: true,
      lastCorrect: correct,
      lastExplanation: explanation,
      lastCorrectAnswer: correctAnswer ?? "",
      correctCount: s.correctCount + (correct ? 1 : 0),
      wrongCount: s.wrongCount + (correct ? 0 : 1),
      earnedXp: s.earnedXp + (correct ? xp : Math.max(1, Math.floor(xp / 2))),
      weakWordIds: correct ? s.weakWordIds : union(s.weakWordIds, ids),
      reinforcedWordIds:
        correct && confidence === "certain"
          ? union(s.reinforcedWordIds, ids)
          : s.reinforcedWordIds,
      unsureWordIds:
        correct && confidence === "unsure"
          ? union(s.unsureWordIds, ids)
          : s.unsureWordIds,
    }));
  },
  continueTeach: (totalExercises) => {
    const { index } = get();
    const next = index + 1;
    if (next >= totalExercises) {
      set({ finished: true, index: next, showFeedback: false });
    } else {
      set({
        index: next,
        showFeedback: false,
        lastCorrect: null,
        lastCorrectAnswer: "",
      });
    }
  },
  continueAfterFeedback: (totalExercises) => {
    const { index } = get();
    const next = index + 1;
    if (next >= totalExercises) {
      set({ showFeedback: false, finished: true, index: next });
    } else {
      set({
        showFeedback: false,
        index: next,
        lastCorrect: null,
        lastCorrectAnswer: "",
      });
    }
  },
  reset: () => set({ ...initial }),
}));

export type { Exercise };
