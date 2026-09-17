/**
 * Word Translator lookup — Word Cards plus their conjugation tables, nothing
 * else. A query either resolves to something the course actually teaches or
 * reports "not in this course yet"; nothing is guessed or generated.
 *
 * Spanish input matches lemmas and an inverted index of every tabled form.
 * English input matches glosses. Both sides use normalizeAnswer (accents and
 * punctuation optional) and whole-phrase matching — "speak" finds hablar,
 * but never a card that merely contains the word.
 */

import { normalizeAnswer } from "@/lib/grading";
import { tenseLabel } from "@/lib/hints";
import { WORD_CARDS } from "@/lib/mock-data";
import { lemmaBase } from "@/lib/verb-forms";
import type { WordCard } from "@/lib/types";

export interface FormHit {
  kind: "form";
  /** The tabled form as written in the course. */
  form: string;
  tense: string;
  /** "yo", or "yo / él/ella/usted" when one form serves several persons. */
  person: string;
  infinitive: string;
  /** The base card for the infinitive (tense variants dedupe onto it). */
  card: WordCard;
  /** One learner-facing sentence, e.g. "Hablo means 'I speak', from hablar (to speak)." */
  phrasing: string;
}

export interface CardHit {
  kind: "card";
  card: WordCard;
  /** Which side of the card matched the query. */
  matched: "spanish" | "english";
}

export type TranslatorHit = FormHit | CardHit;

export interface TranslatorResult {
  query: string;
  hits: TranslatorHit[];
}

/* ------------------------------------------------------------------ index */

interface FormEntry {
  form: string;
  tense: string;
  person: string;
  infinitive: string;
  card: WordCard;
  /** Indexed under its last word only ("llamo" for "me llamo"). */
  bare?: boolean;
}

interface Index {
  /** normalized lemma alternative → cards (base card first). */
  lemmas: Map<string, WordCard[]>;
  /** normalized gloss alternative (with and without "to ") → cards. */
  glosses: Map<string, WordCard[]>;
  /** normalized tabled form (and its bare verb for pronoun forms) → entries. */
  forms: Map<string, FormEntry[]>;
}

let index: Index | null = null;

/** "to be (identity / essence)" → ["to be"]; "to work — will work" → ["to work", "will work"]. */
function glossAlternatives(gloss: string): string[] {
  return gloss
    .replace(/\s*\([^)]*\)/g, "")
    .split(/\s*[/—]\s*/)
    .map((g) => g.trim())
    .filter(Boolean);
}

/** "uno / una" → ["uno", "una"]; "trabajar (past tense)" → ["trabajar"]. */
function lemmaAlternatives(lemma: string): string[] {
  return lemma
    .replace(/\s*\([^)]*\)/g, "")
    .split(" / ")
    .map((l) => l.trim())
    .filter(Boolean);
}

function push<K, V>(map: Map<K, V[]>, key: K, value: V): void {
  const list = map.get(key);
  if (list) {
    if (!list.includes(value)) list.push(value);
  } else {
    map.set(key, [value]);
  }
}

/** The card to show for an infinitive: the one without a tense qualifier. */
function baseCardFor(infinitive: string): WordCard | undefined {
  const want = normalizeAnswer(infinitive);
  let fallback: WordCard | undefined;
  for (const card of Object.values(WORD_CARDS)) {
    if (card.pos !== "verb" || lemmaBase(card.lemma) !== want) continue;
    if (!card.lemma.includes("(")) return card;
    fallback ??= card;
  }
  return fallback;
}

function buildIndex(): Index {
  const lemmas = new Map<string, WordCard[]>();
  const glosses = new Map<string, WordCard[]>();
  const forms = new Map<string, FormEntry[]>();

  // Base cards first so a lemma hit shows "hablar" before "hablar (past tense)".
  const cards = Object.values(WORD_CARDS).sort(
    (a, b) => Number(a.lemma.includes("(")) - Number(b.lemma.includes("("))
  );

  for (const card of cards) {
    for (const alt of lemmaAlternatives(card.lemma)) {
      push(lemmas, normalizeAnswer(alt), card);
    }
    for (const alt of glossAlternatives(card.gloss)) {
      const n = normalizeAnswer(alt);
      push(glosses, n, card);
      if (n.startsWith("to ")) push(glosses, n.slice(3), card);
    }
    if (card.pos !== "verb") continue;
    const infinitive = lemmaBase(card.lemma);
    const base = baseCardFor(infinitive) ?? card;
    for (const group of card.conjugations ?? []) {
      for (const { person, form } of group.forms) {
        // "me gusta / me gustan" lists two forms in one cell.
        for (const single of form.split(" / ")) {
          const entry: FormEntry = {
            form: single.trim(),
            tense: group.label,
            person,
            infinitive,
            card: base,
          };
          const n = normalizeAnswer(single);
          push(forms, n, entry);
          // "me llamo" should also answer to "llamo".
          const words = n.split(" ");
          if (words.length > 1) {
            push(forms, words[words.length - 1], { ...entry, bare: true });
          }
        }
      }
    }
  }
  return { lemmas, glosses, forms };
}

function getIndex(): Index {
  index ??= buildIndex();
  return index;
}

/* --------------------------------------------------------------- phrasing */

/**
 * Verbs whose English can't be built as "<person> <gloss verb>" — either
 * the English verb is irregular in a way the pattern can't produce, or the
 * Spanish meaning doesn't map onto a plain English subject + verb.
 */
const TABLE_STYLE_INFINITIVES = new Set([
  "ser",
  "estar",
  "ir",
  "haber",
  "gustar",
  "llamarse",
  "tener",
]);

const PERSON_EN: Record<string, string> = {
  yo: "I",
  tú: "you",
  "él/ella/usted": "he/she",
  "nosotros/as": "we",
  ustedes: "you all",
  "ellos/ustedes": "they",
  "ellos/ellas/ustedes": "they",
};

/** "to speak" → "speak"; anything that isn't a clean "to X" → null. */
function glossVerb(card: WordCard): string | null {
  const first = glossAlternatives(card.gloss)[0] ?? "";
  const m = /^to ([a-z][a-z ]*)$/i.exec(first);
  return m ? m[1].trim() : null;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Plain "he/she" form of a regular English verb (speaks, eats, studies). */
function thirdPerson(verb: string): string {
  const [head, ...rest] = verb.split(" ");
  let s: string;
  if (/(s|x|z|ch|sh|o)$/.test(head)) s = `${head}es`;
  else if (/[^aeiou]y$/.test(head)) s = `${head.slice(0, -1)}ies`;
  else s = `${head}s`;
  return [s, ...rest].join(" ");
}

function phrase(entry: FormEntry, query: string): string {
  const inf = entry.infinitive;
  const glossFirst = glossAlternatives(entry.card.gloss)[0] ?? entry.card.gloss;
  const verb = glossVerb(entry.card);
  const subject = PERSON_EN[entry.person];
  const friendly =
    !entry.bare &&
    verb !== null &&
    subject !== undefined &&
    entry.tense === "Present indicative" &&
    !TABLE_STYLE_INFINITIVES.has(inf) &&
    !inf.includes(" "); // multi-word lemmas ("vamos a") aren't plain verbs

  if (friendly) {
    const english =
      subject === "he/she" ? `he/she ${thirdPerson(verb)}` : `${subject} ${verb}`;
    return `${capitalize(entry.form)} means '${english}', from ${inf} (${glossFirst}).`;
  }
  if (entry.bare) {
    // The learner typed the verb without its pronoun: point at the full form.
    return `${capitalize(query)} comes from ${inf} (${glossFirst}), ${tenseLabel(entry.tense)} — as in "${entry.form}".`;
  }
  return `${capitalize(entry.form)} is the ${entry.person} form of ${inf} (${glossFirst}), ${tenseLabel(entry.tense)}.`;
}

/* ----------------------------------------------------------------- lookup */

export function lookupWord(rawQuery: string): TranslatorResult {
  const query = rawQuery.trim();
  const n = normalizeAnswer(query);
  const hits: TranslatorHit[] = [];
  if (!n) return { query, hits };
  const { lemmas, glosses, forms } = getIndex();
  const seenCards = new Set<string>();
  const exact = query.toLowerCase();

  // Tense-variant verb cards ("hablar (past tense)") collapse onto the base card.
  const addCard = (card: WordCard, matched: CardHit["matched"]) => {
    const shown =
      card.pos === "verb" ? (baseCardFor(lemmaBase(card.lemma)) ?? card) : card;
    if (seenCards.has(shown.id)) return;
    seenCards.add(shown.id);
    hits.push({ kind: "card", card: shown, matched });
  };

  for (const card of lemmas.get(n) ?? []) addCard(card, "spanish");

  // One form can serve several persons ("era": yo and él/ella/usted) — merge
  // them; bare-word matches collapse per verb + tense ("gustan" → one hit).
  const merged = new Map<string, FormEntry & { persons: string[] }>();
  for (const entry of forms.get(n) ?? []) {
    // A form that is also its own infinitive ("gira / girar") is already a card hit.
    if (normalizeAnswer(entry.infinitive) === n) continue;
    const key = entry.bare
      ? `bare|${entry.infinitive}|${entry.tense}`
      : `${entry.form}|${entry.infinitive}|${entry.tense}`;
    const prev = merged.get(key);
    if (prev) {
      if (!prev.persons.includes(entry.person)) prev.persons.push(entry.person);
    } else {
      merged.set(key, { ...entry, persons: [entry.person] });
    }
  }
  const formHits: FormHit[] = [];
  for (const entry of merged.values()) {
    const person = entry.persons.join(" / ");
    const forPhrase = entry.persons.length === 1 ? entry : { ...entry, person };
    formHits.push({
      kind: "form",
      form: entry.form,
      tense: entry.tense,
      person,
      infinitive: entry.infinitive,
      card: entry.card,
      phrasing: phrase(forPhrase, query),
    });
  }
  // Accents are optional in the query, but a form spelled exactly as typed comes first.
  formHits.sort(
    (a, b) =>
      Number(b.form.toLowerCase() === exact) - Number(a.form.toLowerCase() === exact)
  );
  hits.push(...formHits);

  for (const card of glosses.get(n) ?? []) addCard(card, "english");
  return { query, hits };
}

/** Rough size of what the translator knows, for the empty state. */
export function translatorCoverage(): { cards: number; forms: number } {
  const { forms } = getIndex();
  let count = 0;
  for (const list of forms.values()) count += list.length;
  return { cards: Object.keys(WORD_CARDS).length, forms: count };
}
