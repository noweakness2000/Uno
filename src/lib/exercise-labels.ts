import type { ExerciseType } from "./types";

/** Learner-facing labels — never show raw exercise.type in the UI. */
export const EXERCISE_LABELS: Record<ExerciseType, string> = {
  teach: "New word",
  select: "Choose",
  "tap-chips": "Build the sentence",
  translate: "Translate",
  "listening-choose": "Listen",
  "situational-choose": "What would you say?",
  "match-pairs": "Match",
  "fill-blank": "Fill in the blank",
  cloze: "From the story",
  "story-listen": "Story",
  dictation: "Write what you hear",
  conjugate: "Conjugate",
  dialogue: "Conversation",
};

export function exerciseLabel(type: ExerciseType): string {
  return EXERCISE_LABELS[type] ?? type;
}
