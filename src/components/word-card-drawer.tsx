"use client";

import type { WordCard } from "@/lib/types";
import { SpeakButton } from "@/components/speak-button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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

const GENDER_LABEL: Record<WordCard["gender"], string> = {
  m: "masculine",
  f: "feminine",
  mf: "masc./fem.",
  "n/a": "—",
};

interface WordCardDrawerProps {
  card: WordCard | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Shared body used by drawer + inline Teach step. */
export function WordCardBody({
  card,
  compact = false,
}: {
  card: WordCard;
  /** Teach step: meaning + conjugations + 2 examples only. */
  compact?: boolean;
}) {
  return (
    <div className={compact ? "space-y-4" : "mt-6 space-y-5"}>
      <section>
        <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
          Meaning
        </h4>
        <p className="text-sm leading-relaxed text-slate-700">
          {card.meaningSummary}
        </p>
      </section>

      {card.conjugations && card.conjugations.length > 0 && (
        <section>
          <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            Conjugations
          </h4>
          <div className="space-y-3">
            {card.conjugations.map((group) => (
              <div
                key={group.label}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="border-b border-slate-100 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
                  {group.label}
                </div>
                <div className="grid grid-cols-2 gap-px bg-slate-100 sm:grid-cols-3">
                  {group.forms.map((row) => (
                    <div
                      key={`${group.label}-${row.person}`}
                      className="bg-white px-3 py-2"
                    >
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        {row.person}
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {row.form}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
          Examples
        </h4>
        <ul className="space-y-2">
          {card.examples.map((ex) => (
            <li
              key={ex}
              className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3"
            >
              <span className="min-w-0 flex-1 break-words text-sm font-medium leading-snug text-slate-800">
                {ex}
              </span>
              <SpeakButton text={ex} label={`Play: ${ex}`} />
            </li>
          ))}
        </ul>
      </section>

      {!compact && (
        <>
          <Separator />

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
              <h4 className="mb-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
                Use when
              </h4>
              <p className="text-sm text-slate-700">{card.useWhen}</p>
            </div>
            <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
              <h4 className="mb-1 text-xs font-bold uppercase tracking-wide text-rose-700">
                Don&apos;t use when
              </h4>
              <p className="text-sm text-slate-700">{card.dontUseWhen}</p>
            </div>
          </section>

          {card.contrast && (
            <section>
              <h4 className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                Contrast
              </h4>
              <p className="text-sm text-slate-700">{card.contrast}</p>
            </section>
          )}

          {card.region && (
            <section>
              <h4 className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                Region
              </h4>
              <p className="text-sm text-slate-700">{card.region}</p>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export function WordCardHeaderMeta({ card }: { card: WordCard }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-2xl font-bold text-emerald-700">{card.lemma}</span>
      <SpeakButton text={card.lemma} size="md" label={`Play: ${card.lemma}`} />
      <Badge>{card.cefr}</Badge>
      <Badge variant="secondary">{POS_LABEL[card.pos]}</Badge>
      {card.gender !== "n/a" && (
        <Badge variant="outline">{GENDER_LABEL[card.gender]}</Badge>
      )}
      <Badge variant="soft">{card.formality}</Badge>
    </div>
  );
}

export function WordCardDrawer({
  card,
  open,
  onOpenChange,
}: WordCardDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="overflow-y-auto">
        {card && (
          <>
            <SheetHeader className="pr-8">
              <div className="flex flex-wrap items-center gap-2">
                <SheetTitle className="text-2xl text-emerald-700">
                  {card.lemma}
                </SheetTitle>
                <SpeakButton text={card.lemma} size="md" label={`Play: ${card.lemma}`} />
                <Badge>{card.cefr}</Badge>
                <Badge variant="secondary">{POS_LABEL[card.pos]}</Badge>
                {card.gender !== "n/a" && (
                  <Badge variant="outline">{GENDER_LABEL[card.gender]}</Badge>
                )}
                <Badge variant="soft">{card.formality}</Badge>
              </div>
              <SheetDescription className="text-base text-slate-700">
                {card.gloss}
              </SheetDescription>
            </SheetHeader>

            <WordCardBody card={card} />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
