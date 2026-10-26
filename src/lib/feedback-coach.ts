import { normalizeAnswer } from "@/lib/grading";
import type { Exercise } from "@/lib/types";

/** Expand thin wrong-answer copy into clearer 1–3 sentence coaching. */
export function enrichWrongExplanation(
  exercise: Exercise,
  explanation: string,
  correctAnswer: string
): string {
  let base = (explanation || "").trim();
  const answerNorm = correctAnswer ? normalizeAnswer(correctAnswer) : "";
  // Some explanations are just the answer itself ("Quiero un café, por
  // favor.") — the panel already shows it under "Correct answer", so use the
  // coaching fallback instead of repeating it.
  if (answerNorm && normalizeAnswer(base) === answerNorm) base = "";
  const sentenceCount = base
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean).length;

  if (sentenceCount >= 2 && base.length >= 40) {
    return base;
  }

  // Skip when the explanation already quotes the answer; never end on “….”.
  const answerBit =
    correctAnswer && !normalizeAnswer(base).includes(answerNorm)
      ? ` The expected answer is “${correctAnswer.trim().replace(/[.]+$/, "")}”${/[!?]$/.test(correctAnswer.trim()) ? "" : "."}`
      : "";

  switch (exercise.type) {
    case "dictation":
      return `${base || "Listen once more and type the Spanish you hear."}${answerBit} Accents are optional — focus on the words in order.`;
    case "conjugate": {
      const c = exercise;
      return `${base || `For ${c.pronoun} + ${c.infinitive} in the ${c.tense}, use the matching person ending.`}${answerBit} Say it out loud once, then type the form.`;
    }
    case "translate":
      return `${base || "Picture the meaning first, then build the Spanish word by word."}${answerBit} Word order and little words (el/la, me/te) often trip people up.`;
    case "fill-blank":
    case "cloze":
      return `${base || "Re-read the full sentence and decide which word fits the blank."}${answerBit} Check gender/number endings if it is a noun or adjective.`;
    case "tap-chips":
      return `${base || "You were close — rebuild the phrase in natural Spanish order."}${answerBit} Try saying it aloud before tapping Check.`;
    case "select":
    case "situational-choose":
    case "listening-choose":
      return `${base || "Compare each option to the prompt and pick the one that fits the situation."}${answerBit} Eliminate anything that changes the meaning.`;
    case "match-pairs":
      return `${base || "Match each Spanish item to its English meaning — look for roots you already know."}${answerBit}`;
    case "dialogue":
      return `${base || "One of your replies did not fit the situation."} Replay the conversation and watch how the other person answers each choice.`;
    case "story-listen":
      return `${base || "Replay the story and listen for the line that answers the question."}${answerBit}`;
    default:
      return base || `Not quite.${answerBit} Review the correct answer, then continue.`;
  }
}
