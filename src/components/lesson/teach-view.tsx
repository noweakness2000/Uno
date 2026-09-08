"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  WordCardBody,
} from "@/components/word-card-drawer";
import type { TeachExercise, WordCard } from "@/lib/types";

const POS_LABEL: Record<WordCard["pos"], string> = {
  interjection: "interjection",
  noun: "noun",
  verb: "verb",
  adjective: "adjective",
  adverb: "adverb",
  phrase: "phrase",
  pronoun: "pronoun",
  preposition: "preposition",
};

export function TeachView({
  exercise,
  card,
  onContinue,
}: {
  exercise: TeachExercise;
  card: WordCard;
  onContinue: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-3xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-5 shadow-sm">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
          New word · learn first
        </p>
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-extrabold text-emerald-800">
            {card.lemma}
          </h2>
          <Badge>{card.cefr}</Badge>
          <Badge variant="secondary">{POS_LABEL[card.pos]}</Badge>
        </div>
        <p className="mb-4 text-base font-medium text-slate-600">{card.gloss}</p>
        <WordCardBody card={card} compact />
      </div>
      <p className="text-center text-xs text-slate-400">
        {exercise.prompt || "Read this, then practice."} · 0 XP
      </p>
      <Button className="w-full" size="lg" onClick={onContinue}>
        Got it — practice
      </Button>
    </div>
  );
}
