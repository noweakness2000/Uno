/**
 * Generated hints for exercises whose answer is a verb form.
 *
 * An authored `hint` always wins. These defaults only fill the gap, and they
 * are built so they can never contain the answer: they name the infinitive,
 * its English meaning, and the tense/person to aim for — the learner still
 * has to produce the form. (`scripts/check-hints.ts` enforces that rule for
 * every hint, authored or generated.)
 */

import { normalizeAnswer } from "@/lib/grading";
import { getWordCard, WORD_CARDS } from "@/lib/mock-data";
import { lemmaBase, verbFormsFor } from "@/lib/verb-forms";
import type {
  ClozeExercise,
  ConjugateExercise,
  Exercise,
  FillBlankExercise,
  WordCard,
} from "@/lib/types";

/** Content tense labels → learner-facing wording. */
const TENSE_LABEL: Record<string, string> = {
  "Present indicative": "present tense",
  "Past tense": "past tense",
  "Past (ongoing)": "past tense (ongoing — the imperfect)",
  "Simple future": "future tense",
  "Present with me/te/le…": "present tense with me/te/le in front",
};

export function tenseLabel(label: string): string {
  return TENSE_LABEL[label] ?? label.toLowerCase();
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** "to speak / to talk" → "to speak"; "to be (identity / essence)" → "to be". */
function glossOf(card: WordCard): string {
  return card.gloss.replace(/\s*\([^)]*\)/g, "").split(" / ")[0].trim();
}

/** Gustar-type tables label persons "me gusta(n)" — that would leak the form. */
const PRONOUN_ONLY_TENSE = "Present with me/te/le…";

function formClause(tense: string, person: string): string {
  if (tense === PRONOUN_ONLY_TENSE) {
    return `${tenseLabel(tense)} — singular or plural to match what is liked`;
  }
  return `${tenseLabel(tense)}, the ${person} form`;
}

/**
 * The verb card behind an infinitive: a linked card first, else any verb
 * card with that lemma. Prefers the base card ("hablar") over tense variants
 * ("hablar (past tense)") so the gloss reads as the plain meaning.
 */
function verbCardFor(infinitive: string, wordCardIds: string[] = []): WordCard | undefined {
  const want = normalizeAnswer(infinitive);
  const candidates: WordCard[] = [];
  for (const id of wordCardIds) {
    const card = getWordCard(id);
    if (card?.pos === "verb" && lemmaBase(card.lemma) === want) candidates.push(card);
  }
  for (const card of Object.values(WORD_CARDS)) {
    if (card.pos === "verb" && lemmaBase(card.lemma) === want) candidates.push(card);
  }
  return (
    candidates.find((c) => !c.lemma.includes("(")) ?? candidates[0]
  );
}

function meaningClause(infinitive: string, card: WordCard | undefined): string {
  const inf = capitalize(infinitive);
  const gloss = card ? glossOf(card) : "";
  return gloss ? `${inf} means '${gloss}'` : inf;
}

/** "Descansar means 'to rest' — present tense, the yo form." */
export function conjugationHint(exercise: ConjugateExercise): string {
  const card = verbCardFor(exercise.infinitive, exercise.wordCardIds);
  return `${meaningClause(exercise.infinitive, card)} — ${formClause(exercise.tense, exercise.pronoun)}.`;
}

/**
 * For a blank whose answer is a form of a linked verb. With a table hit the
 * hint names tense + person; otherwise (irregular form the tables don't
 * list, or a card without a table) it stops at the meaning. A blank whose
 * answer is the bare infinitive gets nothing — there the vocabulary is the
 * whole task, and naming its meaning would just be the answer in English.
 */
export function verbBlankHint(
  exercise: FillBlankExercise | ClozeExercise
): string | undefined {
  const answers = exercise.acceptedAnswers.map(normalizeAnswer);
  const verbCards = (exercise.wordCardIds ?? [])
    .map((id) => getWordCard(id))
    .filter((c): c is WordCard => c?.pos === "verb");

  for (const card of verbCards) {
    const base = lemmaBase(card.lemma);
    if (answers.includes(base)) return undefined;
    const hit = verbFormsFor(base, exercise.wordCardIds).find((f) => {
      const form = normalizeAnswer(f.form);
      // Reflexive tables list "me llamo"; the blank may want just "llamo".
      return answers.some((a) => a === form || form.endsWith(` ${a}`));
    });
    if (hit) {
      return `${meaningClause(base, verbCardFor(base, exercise.wordCardIds))} — ${formClause(hit.tense, hit.person)}.`;
    }
  }

  // No table match: still a form of this verb if it shares the stem.
  for (const card of verbCards) {
    const base = lemmaBase(card.lemma);
    const stem = base.replace(/(ar|er|ir)(se)?$/, "");
    if (stem.length >= 3 && answers.some((a) => a !== base && a.startsWith(stem))) {
      return `${meaningClause(base, verbCardFor(base, exercise.wordCardIds))} — pick the form that fits this sentence.`;
    }
  }
  return undefined;
}

/** The hint to show: authored if present, else a generated verb hint. */
export function hintFor(exercise: Exercise): string | undefined {
  if ("hint" in exercise && exercise.hint) return exercise.hint;
  switch (exercise.type) {
    case "conjugate":
      return conjugationHint(exercise);
    case "fill-blank":
    case "cloze":
      return verbBlankHint(exercise);
    default:
      return undefined;
  }
}
