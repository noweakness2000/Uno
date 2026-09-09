"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Layers,
  RotateCcw,
  ThumbsDown,
  ThumbsUp,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getAllWordCards, getWordCard } from "@/lib/mock-data";
import { audioSrcFor, playSpanishAudio } from "@/lib/audio";
import { countDue, getDueSrsCardIds, type SrsCards } from "@/lib/srs";
import { useUserStore } from "@/store/user-store";
import { cn } from "@/lib/utils";
import type { WordCard } from "@/lib/types";

type Mode = "es-en" | "en-es";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Default deck: due SRS first, then weak (not already due), then a small
 * sample of other learned cards. Motivational only — never locks lessons.
 */
function buildDeck(
  weakIds: string[],
  srsCards: SrsCards | undefined,
  now: Date = new Date()
): WordCard[] {
  const all = getAllWordCards();
  const byId = new Map(all.map((c) => [c.id, c]));
  const seen = new Set<string>();
  const out: WordCard[] = [];

  const push = (id: string) => {
    if (seen.has(id)) return;
    const card = byId.get(id) ?? getWordCard(id);
    if (!card) return;
    seen.add(id);
    out.push(card);
  };

  for (const id of getDueSrsCardIds(srsCards, now)) push(id);
  for (const id of weakIds) push(id);

  const rest = shuffle(all.filter((c) => !seen.has(c.id))).slice(0, 12);
  for (const c of rest) {
    seen.add(c.id);
    out.push(c);
  }

  // Keep due+weak order stable at front; lightly shuffle within tiers already done via rest
  return out;
}

export default function FlashcardsPage() {
  const weakWordIds = useUserStore((s) => s.user.weakWordIds);
  const srsCards = useUserStore((s) => s.user.srsCards);
  const srsAgain = useUserStore((s) => s.srsAgain);
  const srsGood = useUserStore((s) => s.srsGood);

  const dueToday = countDue(srsCards);

  const [mode, setMode] = useState<Mode>("es-en");
  const [deck, setDeck] = useState<WordCard[]>(() =>
    buildDeck(weakWordIds, srsCards)
  );
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [unknown, setUnknown] = useState(0);

  const card = deck[index];
  const progress = deck.length
    ? Math.round(((index + (flipped ? 0.5 : 0)) / deck.length) * 100)
    : 0;
  const done = index >= deck.length;

  const front = useMemo(() => {
    if (!card) return "";
    return mode === "es-en" ? card.lemma : card.gloss;
  }, [card, mode]);

  const back = useMemo(() => {
    if (!card) return "";
    return mode === "es-en" ? card.gloss : card.lemma;
  }, [card, mode]);

  const spanishSideShowing =
    (mode === "es-en" && !flipped) || (mode === "en-es" && flipped);

  const resetDeck = () => {
    const u = useUserStore.getState().user;
    setDeck(buildDeck(u.weakWordIds, u.srsCards));
    setIndex(0);
    setFlipped(false);
    setKnown(0);
    setUnknown(0);
  };

  const grade = (know: boolean) => {
    if (!card) return;
    if (know) {
      setKnown((n) => n + 1);
      srsGood(card.id);
    } else {
      setUnknown((n) => n + 1);
      srsAgain(card.id);
    }
    setFlipped(false);
    setIndex((i) => i + 1);
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col overflow-x-hidden px-3 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-4">
      <div className="mb-4 flex items-center gap-3">
        <Link href="/home">
          <Button variant="ghost" size="icon" aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-extrabold text-slate-900">Flashcards</h1>
          <p className="text-sm text-slate-500">
            {dueToday > 0
              ? `${dueToday} due today · optional practice`
              : "Due cards first · tap to flip"}
          </p>
        </div>
        <Layers className="h-5 w-5 text-emerald-500" />
      </div>

      <p className="mb-3 rounded-2xl border border-teal-100 bg-teal-50 px-3 py-2 text-xs text-teal-900">
        Review is motivational only — it never locks lessons. Wrong answers still
        explain, mark weak, and continue.
      </p>

      <div className="mb-4 flex gap-2">
        <Button
          variant={mode === "es-en" ? "default" : "secondary"}
          className="flex-1"
          size="sm"
          onClick={() => {
            setMode("es-en");
            setFlipped(false);
          }}
        >
          ES → EN
        </Button>
        <Button
          variant={mode === "en-es" ? "default" : "secondary"}
          className="flex-1"
          size="sm"
          onClick={() => {
            setMode("en-es");
            setFlipped(false);
          }}
        >
          EN → ES
        </Button>
      </div>

      <div className="mb-3">
        <div className="mb-1 flex justify-between text-xs font-medium text-slate-500">
          <span>
            {done ? deck.length : index + 1} / {deck.length}
          </span>
          <span>
            ✓ {known} · ? {unknown}
          </span>
        </div>
        <Progress value={Math.min(100, progress)} />
      </div>

      {done ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-3xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-8 text-center shadow-sm">
          <p className="text-3xl">✨</p>
          <h2 className="text-xl font-extrabold text-slate-900">Deck complete</h2>
          <p className="text-sm text-slate-500">
            Knew {known} · Still learning {unknown}. Due cards resurface when
            it&apos;s time — lessons stay open.
          </p>
          <Button size="lg" className="w-full" onClick={resetDeck}>
            <RotateCcw className="h-4 w-4" />
            Shuffle again
          </Button>
          <Link href="/review" className="w-full">
            <Button variant="secondary" className="w-full" size="lg">
              Open review list
            </Button>
          </Link>
        </div>
      ) : card ? (
        <>
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className={cn(
              "relative flex min-h-[240px] w-full touch-manipulation flex-col items-center justify-center gap-3 rounded-3xl border-2 p-6 text-center shadow-md transition active:scale-[0.99] sm:min-h-[280px]",
              flipped
                ? "border-teal-300 bg-gradient-to-b from-teal-50 to-white"
                : "border-emerald-200 bg-gradient-to-b from-emerald-50 to-white"
            )}
          >
            <Badge variant="soft">{flipped ? "Answer" : "Tap to flip"}</Badge>
            <p className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              {flipped ? back : front}
            </p>
            {flipped && mode === "es-en" && (
              <p className="max-w-sm text-sm text-slate-500">
                {card.meaningSummary.slice(0, 120)}
                {card.meaningSummary.length > 120 ? "…" : ""}
              </p>
            )}
            {flipped && mode === "en-es" && card.examples[0] && (
              <p className="max-w-sm text-sm text-slate-500">
                {card.examples[0].es}
              </p>
            )}
          </button>

          <div className="mt-4 flex items-center justify-center gap-3">
            {spanishSideShowing && (
              <Button
                variant="soft"
                size="lg"
                className="min-h-12 flex-1"
                onClick={() =>
                  playSpanishAudio(
                    card.lemma,
                    audioSrcFor(card.lemma, "f")
                  )
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
                onClick={() => setFlipped(true)}
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
                onClick={() => grade(false)}
              >
                <ThumbsDown className="h-5 w-5" />
                Again
              </Button>
              <Button
                size="lg"
                className="min-h-14"
                onClick={() => grade(true)}
              >
                <ThumbsUp className="h-5 w-5" />
                Good
              </Button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-slate-500">No cards available.</p>
      )}
    </div>
  );
}
