import type { Exercise } from "./types";

/** Display form of the correct answer for feedback UI. */
export function getCorrectAnswerDisplay(exercise: Exercise): string {
  switch (exercise.type) {
    case "teach":
      return "";
    case "select":
    case "situational-choose":
    case "listening-choose":
      return exercise.options[exercise.correctIndex] ?? "";
    case "tap-chips":
      return exercise.correctOrder.join(" ");
    case "translate":
      return exercise.acceptedAnswers[0] ?? "";
    default:
      return "";
  }
}
