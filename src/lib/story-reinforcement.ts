import { audioSrcFor, voiceForIndex, type AudioVoice } from "@/lib/audio";
import { normalizeAnswer } from "@/lib/grading";
import { getWordCard } from "@/lib/mock-data";
import type { ClozeExercise, StoryListenExercise, WordCard } from "@/lib/types";

/** Leading / trailing punctuation kept around the blank, e.g. "¿" and "?". */
const EDGE_PUNCT = /^([¡¿"'(]*)(.*?)([!?.,;:"')]*)$/u;

/** Spanish strings a card can appear as in running text: lemma + any listed forms. */
function surfaceForms(card: WordCard): string[] {
  const lemma = card.lemma.split(" (")[0].split(" / ")[0];
  const forms = (card.conjugations ?? []).flatMap((g) =>
    g.forms.map((f) => f.form)
  );
  return Array.from(new Set([lemma, ...forms].map(normalizeAnswer))).filter(
    Boolean
  );
}

interface Blank {
  template: string;
  answer: string;
}

/**
 * Blank the first whole-token run in `text` that matches one of `forms`.
 * Returns null when nothing matches or the blank would swallow the whole
 * line (no context left to fill from).
 */
function blankLine(text: string, forms: string[]): Blank | null {
  const tokens = text.split(/\s+/).filter(Boolean);
  const norm = tokens.map((t) => normalizeAnswer(t));
  for (const form of forms) {
    const want = form.split(" ");
    if (want.length >= tokens.length) continue;
    for (let i = 0; i + want.length <= tokens.length; i++) {
      let hit = true;
      for (let k = 0; k < want.length; k++) {
        if (norm[i + k] !== want[k]) {
          hit = false;
          break;
        }
      }
      if (!hit) continue;
      const span = tokens.slice(i, i + want.length);
      const first = EDGE_PUNCT.exec(span[0]);
      const last = EDGE_PUNCT.exec(span[span.length - 1]);
      const lead = first?.[1] ?? "";
      const trail = last?.[3] ?? "";
      // Strip the outer punctuation off the answer but keep inner words intact.
      const inner = [...span];
      inner[0] = inner[0].slice(lead.length);
      const tail = inner.length - 1;
      inner[tail] = trail ? inner[tail].slice(0, -trail.length) : inner[tail];
      const answer = inner.join(" ").trim();
      if (!answer) continue;
      const template = [
        ...tokens.slice(0, i),
        `${lead}___${trail}`,
        ...tokens.slice(i + want.length),
      ].join(" ");
      return { template, answer };
    }
  }
  return null;
}

/**
 * After a story is missed, one cloze built from the story's own transcript
 * for a word the learner just went weak on. Prefers lines tied to the
 * questions they missed; null when no line holds a usable word.
 */
export function buildStoryReinforcement(
  story: StoryListenExercise,
  missedLineIndices: number[] = []
): ClozeExercise | null {
  const cards = (story.wordCardIds ?? [])
    .map((id) => getWordCard(id))
    .filter((c): c is WordCard => Boolean(c));
  if (!cards.length) return null;

  const preferred = new Set(missedLineIndices);
  const lineOrder = [
    ...story.lines.map((_, i) => i).filter((i) => preferred.has(i)),
    ...story.lines.map((_, i) => i).filter((i) => !preferred.has(i)),
  ];

  for (const lineIndex of lineOrder) {
    const line = story.lines[lineIndex];
    for (const card of cards) {
      const blank = blankLine(line.text, surfaceForms(card));
      if (!blank) continue;
      const voice = (line.voice ?? voiceForIndex(lineIndex)) as AudioVoice;
      return {
        id: `${story.id}-reinforce-${card.id}`,
        type: "cloze",
        prompt: "Fill in the word from the story",
        template: blank.template,
        acceptedAnswers: [blank.answer],
        englishPrompt: line.en,
        hint: card.gloss,
        audioText: line.text,
        audioSrc: audioSrcFor(line.text, voice),
        storyLabel: story.title ? `From “${story.title}”` : "From the story",
        explanation: `${card.lemma} — ${card.gloss}. ${card.meaningSummary}`,
        wordCardIds: [card.id],
        xp: 3,
      };
    }
  }
  return null;
}
