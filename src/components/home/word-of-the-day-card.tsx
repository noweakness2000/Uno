"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { SpeakButton } from "@/components/speak-button";
import { WordCardDrawer } from "@/components/word-card-drawer";
import { audioSrcFor, voiceForIndex } from "@/lib/audio";
import { getWordCard } from "@/lib/mock-data";
import { getWordOfTheDay } from "@/lib/word-of-the-day";

/** Mobile-friendly Word of the Day near the home greeting. */
export function WordOfTheDayCard() {
  const { entry, date } = useMemo(() => getWordOfTheDay(), []);
  const card = entry.wordCardId ? getWordCard(entry.wordCardId) : undefined;
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <section
        className="mt-4 rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-4 shadow-sm"
        aria-label="Word of the Day"
      >
        <div className="flex items-center justify-between gap-2">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-700">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Word of the Day
          </p>
          <p className="text-[11px] font-medium text-slate-400">{date}</p>
        </div>

        <div className="mt-2 flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <p className="break-words text-2xl font-extrabold leading-tight text-slate-900">
              {entry.lemma}
            </p>
            <p className="mt-0.5 break-words text-sm font-medium text-slate-600">
              {entry.gloss}
            </p>
          </div>
          <SpeakButton
            text={entry.lemma}
            src={audioSrcFor(entry.lemma, "f")}
            size="md"
            label={`Play: ${entry.lemma}`}
          />
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-2xl bg-white/80 px-3 py-2.5 ring-1 ring-slate-100">
          <div className="min-w-0 flex-1">
            <p className="break-words text-sm font-semibold leading-snug text-slate-800">
              {entry.exampleEs}
            </p>
            <p className="mt-0.5 break-words text-xs leading-snug text-slate-500">
              {entry.exampleEn}
            </p>
          </div>
          <SpeakButton
            text={entry.exampleEs}
            src={audioSrcFor(entry.exampleEs, voiceForIndex(1))}
            label={`Play: ${entry.exampleEs}`}
          />
        </div>

        {card && (
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="mt-3 w-full rounded-2xl border border-emerald-200 bg-emerald-50/80 px-3 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
          >
            Open Word Card
          </button>
        )}
      </section>

      {card && (
        <WordCardDrawer
          card={card}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
        />
      )}
    </>
  );
}
