"use client";

import { ThumbsDown, ThumbsUp, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { audioSrcFor, playSpanishAudio } from "@/lib/audio";
import { cn } from "@/lib/utils";
import type { WordCard } from "@/lib/types";

export type FlashcardMode = "es-en" | "en-es";

interface Props {
  card: WordCard;
  mode: FlashcardMode;
  flipped: boolean;
  onFlip: (flipped: boolean) => void;
  /** true = Good, false = Revisit. */
  onGrade: (know: boolean) => void;
}

/**
 * One flip card plus its Hear / Reveal / Revisit / Good controls. Shared by
 * the Flashcards page and the post-lesson quick review so both stay identical.
 */
export function Flashcard({ card, mode, flipped, onFlip, onGrade }: Props) {
  const front = mode === "es-en" ? card.lemma : card.gloss;
  const back = mode === "es-en" ? card.gloss : card.lemma;
  const spanishSideShowing =
    (mode === "es-en" && !flipped) || (mode === "en-es" && flipped);

  return (
    <>
      {/* Both faces stay mounted; the inner wrapper rotates in 3D. */}
      <button
        type="button"
        onClick={() => onFlip(!flipped)}
        className="flip-card w-full touch-manipulation text-center transition active:scale-[0.99] motion-reduce:transition-none"
      >
        <div className={cn("flip-card-inner", flipped && "is-flipped")}>
          <div
            aria-hidden={flipped}
            className="flip-face flex min-h-[240px] w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-6 shadow-md sm:min-h-[280px]"
          >
            <Badge variant="soft">Tap to flip</Badge>
            <p className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              {front}
            </p>
          </div>
          <div
            aria-hidden={!flipped}
            className="flip-face flip-face-back flex min-h-[240px] w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-teal-300 bg-gradient-to-b from-teal-50 to-white p-6 shadow-md sm:min-h-[280px]"
          >
            <Badge variant="soft">Answer</Badge>
            <p className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              {back}
            </p>
            {mode === "es-en" && (
              <p className="max-w-sm text-sm text-slate-500">
                {card.meaningSummary.slice(0, 120)}
                {card.meaningSummary.length > 120 ? "…" : ""}
              </p>
            )}
            {mode === "en-es" && card.examples[0] && (
              <p className="max-w-sm text-sm text-slate-500">
                {card.examples[0].es}
              </p>
            )}
          </div>
        </div>
      </button>

      <div className="mt-4 flex items-center justify-center gap-3">
        {spanishSideShowing && (
          <Button
            variant="soft"
            size="lg"
            className="min-h-12 flex-1"
            onClick={() =>
              playSpanishAudio(card.lemma, audioSrcFor(card.lemma, "f"))
            }
          >
            <Volume2 className="h-5 w-5" />
            Hear Spanish
          </Button>
        )}
        {!flipped && (
          <Button
            className="min-h-12 flex-1"
            size="lg"
            onClick={() => onFlip(true)}
          >
            Reveal
          </Button>
        )}
      </div>

      {flipped && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            size="lg"
            className="min-h-14 border-2 border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100"
            onClick={() => onGrade(false)}
          >
            <ThumbsDown className="h-5 w-5" />
            Revisit
          </Button>
          <Button size="lg" className="min-h-14" onClick={() => onGrade(true)}>
            <ThumbsUp className="h-5 w-5" />
            Good
          </Button>
        </div>
      )}
    </>
  );
}
