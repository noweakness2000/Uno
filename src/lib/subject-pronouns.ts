/**
 * Optional subject pronouns in typed Spanish answers.
 *
 * Spanish drops subject pronouns freely: "Quiero un café" and "Yo quiero un
 * café" are both right. Grading accepts either form in both directions — the
 * learner may add a pronoun the answer omits, or omit one the answer
 * includes — but only when:
 *
 *  1. The rest of the sentence matches exactly (after the usual accent /
 *     punctuation / case normalization). Nothing else becomes optional —
 *     articles, object pronouns and word order still count.
 *  2. A conjugated verb that agrees with the pronoun follows it (optionally
 *     after "no", an object/reflexive pronoun or a short adverb). So
 *     "yo quieres" never matches "quieres", and "Yo también" never matches
 *     "También" (no verb, so the pronoun is the whole meaning).
 *  3. The pronoun is dropped from only one side at any one spot, so swapping
 *     persons ("Él come" vs "Ella come") is still wrong.
 *
 * "el" and "tu" are also the article / possessive. Accented "él" / "tú" are
 * always pronouns. Learners often skip accents, so unaccented "el" / "tu"
 * count as pronouns only at the start of a sentence or clause (after a
 * comma, "y", "pero", "que", …) and only before a verb form the course
 * actually tables (for "el"), or a tabled / clearly second-person form (for
 * "tu"). "Tu casa" and "El café" are never touched.
 */

import { isNearMiss, normalizeAnswer } from "@/lib/grading";
import { WORD_CARDS } from "@/lib/mock-data";

/** Grammatical person of a subject pronoun or verb form. */
export type Person = "1s" | "2s" | "3s" | "1p" | "2p" | "3p";

const PRONOUN_PERSON: Record<string, Person> = {
  yo: "1s",
  tu: "2s",
  el: "3s",
  ella: "3s",
  usted: "3s",
  ud: "3s",
  nosotros: "1p",
  nosotras: "1p",
  vosotros: "2p",
  vosotras: "2p",
  ellos: "3p",
  ellas: "3p",
  ustedes: "3p",
  uds: "3p",
};

/** Ambiguous without an accent: article "el", possessive "tu". */
const AMBIGUOUS = new Set(["el", "tu"]);

/** Words allowed between the pronoun and its verb ("yo no te quiero"). */
const BETWEEN = new Set([
  "no", "nunca", "ya", "siempre", "casi", "solo", "todavia", "aun",
  "me", "te", "se", "lo", "la", "le", "nos", "os", "los", "las", "les",
]);
const MAX_BETWEEN = 3;

/** Words that open a clause, so an unaccented "el"/"tu" after them may be a subject. */
const CLAUSE_OPENERS = new Set([
  "y", "e", "o", "u", "pero", "que", "porque", "cuando", "si", "pues",
  "aunque", "mientras", "donde", "ni", "entonces", "luego",
]);

/** Common words with verb-like endings that are never the verb after a pronoun. */
const NOT_VERBS = new Set([
  "y", "e", "o", "u", "que", "de", "a", "en", "con", "para", "por", "sin",
  "el", "la", "lo", "los", "las", "un", "una", "unos", "unas", "mi", "tu",
  "su", "mis", "tus", "sus", "tambien", "tampoco", "mismo", "misma",
  "mismos", "mismas", "si", "aqui", "alli", "ahi", "aca", "alla", "mas",
  "menos", "muy", "bien", "mal", "hoy", "ayer", "manana", "ahora",
  "antes", "despues", "tambien", "solamente", "solo", "sola",
  // Nouns ending in -s/-es that can follow possessive "tu".
  "mes", "pais", "ingles", "frances", "interes", "autobus", "cumpleanos",
  // Other pronouns ("yo" ends in -o like a verb).
  ...Object.keys(PRONOUN_PERSON),
  "mi", "ti", "conmigo", "contigo",
]);

/** High-frequency forms the word cards don't table (estar, haber). */
const EXTRA_FORMS: Array<[string, Person[]]> = [
  ["estoy", ["1s"]], ["estas", ["2s"]], ["esta", ["3s"]], ["estamos", ["1p"]],
  ["estais", ["2p"]], ["estan", ["3p"]],
  ["he", ["1s"]], ["has", ["2s"]], ["ha", ["3s"]], ["hemos", ["1p"]],
  ["habeis", ["2p"]], ["han", ["3p"]],
];

function personFromLabel(label: string): Person | null {
  switch (normalizeAnswer(label)) {
    case "yo":
      return "1s";
    case "tu":
      return "2s";
    case "el/ella/usted":
    case "el":
    case "ella":
    case "usted":
      return "3s";
    case "nosotros/as":
    case "nosotros":
    case "nosotras":
      return "1p";
    case "vosotros/as":
    case "vosotros":
      return "2p";
    case "ustedes":
    case "ellos/ustedes":
    case "ellos/ellas/ustedes":
    case "ellos":
      return "3p";
    default:
      return null;
  }
}

/** Normalized verb token → persons it is listed under (empty set = only non-subject rows, e.g. "me gusta"). */
export type VerbLookup = (token: string) => ReadonlySet<Person> | undefined;

let tabled: Map<string, Set<Person>> | null = null;

function buildTabled(): Map<string, Set<Person>> {
  const map = new Map<string, Set<Person>>();
  const add = (token: string, person: Person | null) => {
    if (!token) return;
    let set = map.get(token);
    if (!set) map.set(token, (set = new Set()));
    if (person) set.add(person);
  };
  for (const card of Object.values(WORD_CARDS)) {
    if (card.pos !== "verb") continue;
    for (const group of card.conjugations ?? []) {
      for (const { person, form } of group.forms) {
        const p = personFromLabel(person);
        for (const single of form.split(" / ")) {
          const words = normalizeAnswer(single).split(" ").filter(Boolean);
          // "me llamo" → index the verb word "llamo".
          add(words[words.length - 1] ?? "", p);
        }
      }
    }
  }
  for (const [form, persons] of EXTRA_FORMS) {
    for (const p of persons) add(form, p);
  }
  return map;
}

/** Verb forms tabled on the course's word cards (plus a few estar/haber forms). */
export const courseVerbLookup: VerbLookup = (token) => {
  tabled ??= buildTabled();
  return tabled.get(token);
};

/** Ending-based guess for verbs the course doesn't table. */
function endingAgrees(token: string, person: Person): boolean {
  if (NOT_VERBS.has(token) || token.length < 2) return false;
  const endsVowelOrY = /[aeiouy]$/.test(token);
  switch (person) {
    case "1s":
    case "3s":
      // quiero, hablé, comí, era, tenía, voy, soy · habla, come, fue, dio.
      // Never -s / -n / -mos / -ste (those belong to other persons).
      return endsVowelOrY && !/ste$/.test(token);
    case "2s":
      return /s$/.test(token) && !/mos$|is$/.test(token) || /ste$/.test(token);
    case "1p":
      return /mos$/.test(token);
    case "2p":
      return /is$/.test(token);
    case "3p":
      return /n$/.test(token);
  }
}

interface Tok {
  norm: string;
  /** Raw word was written with an accent: "tú", "él". */
  accented: boolean;
  /** Start of the sentence or a clause (after , ; : . ! ? or a clause opener). */
  clauseStart: boolean;
}

function tokenize(s: string): Tok[] {
  const out: Tok[] = [];
  let boundary = true;
  for (const raw of s.trim().split(/\s+/)) {
    if (/^[¿¡]/.test(raw)) boundary = true;
    const norm = normalizeAnswer(raw);
    const bare = raw
      .normalize("NFC")
      .toLowerCase()
      .replace(/[¡!¿?.,;:"'`´()]/g, "");
    if (norm) {
      const prev = out[out.length - 1];
      out.push({
        norm,
        accented: bare === "tú" || bare === "él",
        clauseStart: boundary || (prev ? CLAUSE_OPENERS.has(prev.norm) : true),
      });
      boundary = false;
    }
    if (/[.,;:!?…]$/.test(raw)) boundary = true;
  }
  return out;
}

/**
 * True when toks[i] is a subject pronoun that can be dropped: a verb agreeing
 * with it follows (after at most a few "no"/object-pronoun/adverb words).
 */
function isDroppable(toks: Tok[], i: number, lookup: VerbLookup): boolean {
  const t = toks[i];
  const person = PRONOUN_PERSON[t.norm];
  if (!person) return false;
  const ambiguous = AMBIGUOUS.has(t.norm) && !t.accented;
  if (ambiguous && !t.clauseStart) return false;

  for (let k = i + 1; k < toks.length && k <= i + 1 + MAX_BETWEEN; k++) {
    const next = toks[k].norm;
    const known = lookup(next);
    if (known) {
      // A tabled form: it must be listed for this person. Forms listed only
      // under "me gusta(n)"-style rows never take a subject pronoun.
      if (known.has(person)) return true;
      if (!BETWEEN.has(next)) return false;
      continue;
    }
    if (BETWEEN.has(next)) continue;
    if (ambiguous) {
      // Unaccented "el" must be followed by a tabled verb; "tu" by a clear
      // second-person form ("tu hablas", "tu quieres", "tu hablaste").
      return t.norm === "tu" && endingAgrees(next, "2s");
    }
    return endingAgrees(next, person);
  }
  return false;
}

/**
 * Do two answers match once optional subject pronouns are accounted for?
 * `a` and `b` are symmetric (learner / accepted answer either way round).
 */
export function matchIgnoringSubjectPronouns(
  a: string,
  b: string,
  lookup: VerbLookup = courseVerbLookup
): boolean {
  const ta = tokenize(a);
  const tb = tokenize(b);
  if (!ta.length || !tb.length) return false;
  const da = ta.map((_, i) => isDroppable(ta, i, lookup));
  const db = tb.map((_, i) => isDroppable(tb, i, lookup));

  // gap: 0 = aligned, 1 = currently skipping in a, 2 = currently skipping in b.
  // Skipping on both sides in the same gap would let "él" stand in for "ella".
  const memo = new Map<number, boolean>();
  const go = (i: number, j: number, gap: 0 | 1 | 2): boolean => {
    if (i === ta.length && j === tb.length) return true;
    const key = (i * (tb.length + 1) + j) * 3 + gap;
    const hit = memo.get(key);
    if (hit !== undefined) return hit;
    let ok = false;
    if (i < ta.length && j < tb.length && ta[i].norm === tb[j].norm) {
      ok = go(i + 1, j + 1, 0);
    }
    if (!ok && i < ta.length && da[i] && gap !== 2) ok = go(i + 1, j, 1);
    if (!ok && j < tb.length && db[j] && gap !== 1) ok = go(i, j + 1, 2);
    memo.set(key, ok);
    return ok;
  };
  return go(0, 0, 0);
}

/** The answer with every droppable subject pronoun removed, normalized (for near-miss checks). */
export function withoutSubjectPronouns(
  s: string,
  lookup: VerbLookup = courseVerbLookup
): string {
  const toks = tokenize(s);
  return toks
    .filter((_, i) => !isDroppable(toks, i, lookup))
    .map((t) => t.norm)
    .join(" ");
}

/**
 * Typed-answer grading: the usual normalized match, or a match once optional
 * subject pronouns are allowed ("Yo quiero…" = "Quiero…").
 */
export function typedAnswerMatches(
  accepted: string,
  user: string,
  lookup: VerbLookup = courseVerbLookup
): boolean {
  return (
    normalizeAnswer(accepted) === normalizeAnswer(user) ||
    matchIgnoringSubjectPronouns(user, accepted, lookup)
  );
}

/**
 * Near-miss ("Close, but not quite") that also looks past optional subject
 * pronouns, so "yo quiero cafe por favor" is a near miss of
 * "Quiero un café, por favor" (one word missing) rather than a flat miss.
 */
export function isNearMissIgnoringSubjectPronouns(
  user: string,
  acceptedAnswers: string[],
  lookup: VerbLookup = courseVerbLookup
): boolean {
  if (acceptedAnswers.some((a) => typedAnswerMatches(a, user, lookup))) {
    return false;
  }
  if (isNearMiss(user, acceptedAnswers)) return true;
  const bare = withoutSubjectPronouns(user, lookup);
  if (!bare) return false;
  return isNearMiss(
    bare,
    acceptedAnswers.map((a) => withoutSubjectPronouns(a, lookup))
  );
}
