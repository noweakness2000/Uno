import { WORD_CARDS, getWordCard } from "@/lib/mock-data";
import { normalizeAnswer, type VerbForm } from "@/lib/grading";
import type { WordCard } from "@/lib/types";

/** "hablar (past tense)" → "hablar"; "gira / girar" → "gira". */
function lemmaBase(lemma: string): string {
  return normalizeAnswer(lemma.split(" (")[0].split(" / ")[0]);
}

/**
 * Every conjugated form the content lists for an infinitive, across all the
 * verb's cards (present, past, future… live on separate cards). Only forms
 * that are actually written down — no generated guesses — so a hit really is
 * a valid form of the verb.
 */
export function verbFormsFor(
  infinitive: string,
  wordCardIds: string[] = []
): VerbForm[] {
  const want = normalizeAnswer(infinitive);
  const cards = new Map<string, WordCard>();
  for (const id of wordCardIds) {
    const card = getWordCard(id);
    if (card) cards.set(card.id, card);
  }
  for (const card of Object.values(WORD_CARDS)) {
    if (card.pos === "verb" && lemmaBase(card.lemma) === want) {
      cards.set(card.id, card);
    }
  }

  const out: VerbForm[] = [];
  for (const card of cards.values()) {
    for (const group of card.conjugations ?? []) {
      for (const { person, form } of group.forms) {
        out.push({ tense: group.label, person, form });
      }
    }
  }
  return out;
}
