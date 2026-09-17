/**
 * Hint lint: a hint may never contain, or simply be the English of, its own
 * answer. Runs on every exercise's effective hint (authored, or the generated
 * verb hint from src/lib/hints.ts) so a content drop can't reintroduce
 * answer-as-hint.
 *
 * Rules
 *   contains-answer  a free-text exercise's hint contains a whole accepted
 *                    answer (accents/punctuation ignored)
 *   is-translation   the hint is exactly the gloss of the word card whose
 *                    lemma is the answer (e.g. hint "milk" for "leche")
 *
 * Pre-existing violations are listed in scripts/hint-lint-baseline.json and
 * tolerated until the content passes rewrite them; anything not in that file
 * fails the build. Shrink the baseline as hints get fixed — never grow it.
 *
 *   bun run scripts/check-hints.ts             # or via `bun run lint`
 *   node --experimental-strip-types --import ./scripts/register-ts-alias.mjs scripts/check-hints.ts
 *   ... --update-baseline                      # rewrite the baseline (review the diff!)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { hintFor } from "../src/lib/hints";
import { LESSONS, WORD_CARDS } from "../src/lib/mock-data";
import type { Exercise } from "../src/lib/types";

const FREE_TEXT = new Set(["translate", "fill-blank", "cloze", "conjugate", "dictation"]);
const BASELINE = join(dirname(fileURLToPath(import.meta.url)), "hint-lint-baseline.json");

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9ñ ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function glossOf(gloss: string): string {
  return norm(gloss.split(" / ")[0].replace(/\([^)]*\)/g, ""));
}

interface Violation {
  id: string;
  lesson: string;
  type: string;
  rule: "contains-answer" | "is-translation";
  hint: string;
  answer: string;
}

function check(lessonId: string, exercise: Exercise): Violation | null {
  const hint = hintFor(exercise);
  if (!hint) return null;
  const h = norm(hint);
  const answers: string[] = "acceptedAnswers" in exercise ? exercise.acceptedAnswers : [];

  if (FREE_TEXT.has(exercise.type)) {
    for (const answer of answers) {
      const a = norm(answer);
      if (a.length >= 3 && new RegExp(`(^| )${a}( |$)`).test(h)) {
        return { id: exercise.id, lesson: lessonId, type: exercise.type, rule: "contains-answer", hint, answer };
      }
    }
  }

  for (const cardId of exercise.wordCardIds ?? []) {
    const card = WORD_CARDS[cardId];
    if (!card) continue;
    const lemma = norm(card.lemma.split(" (")[0].split(" / ")[0]);
    if (!answers.some((a) => norm(a) === lemma)) continue;
    const gloss = glossOf(card.gloss);
    if (h === gloss || h === `to ${gloss}` || `to ${h}` === gloss) {
      return { id: exercise.id, lesson: lessonId, type: exercise.type, rule: "is-translation", hint, answer: card.lemma };
    }
  }
  return null;
}

const violations: Violation[] = [];
let checked = 0;
for (const lesson of Object.values(LESSONS)) {
  for (const exercise of lesson.exercises) {
    if (hintFor(exercise)) checked++;
    const v = check(lesson.id, exercise);
    if (v) violations.push(v);
  }
}

const updateBaseline = process.argv.includes("--update-baseline");
if (updateBaseline) {
  writeFileSync(BASELINE, JSON.stringify(violations.map((v) => v.id).sort(), null, 2) + "\n");
  console.log(`hint-lint: wrote ${violations.length} known violations to ${BASELINE}`);
  process.exit(0);
}

let baseline: string[] = [];
try {
  baseline = JSON.parse(readFileSync(BASELINE, "utf8"));
} catch {
  /* no baseline: everything counts */
}
const known = new Set(baseline);
const fresh = violations.filter((v) => !known.has(v.id));
const fixed = baseline.filter((id) => !violations.some((v) => v.id === id));

console.log(
  `hint-lint: ${checked} hints checked, ${violations.length - fresh.length} known giveaways still in the baseline, ${fresh.length} new`
);
for (const v of fresh) {
  console.error(`  ✖ ${v.lesson} ${v.id} (${v.type}) ${v.rule}: hint "${v.hint}" → answer "${v.answer}"`);
}
if (fixed.length) {
  console.log(`  ${fixed.length} baseline entries are fixed — remove them: ${fixed.join(", ")}`);
}
if (fresh.length) {
  console.error("hint-lint: a hint gives away its answer. Rewrite it (see src/lib/hints.ts for the pattern).");
  process.exit(1);
}
