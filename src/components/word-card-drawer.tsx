"use client";

import type { WordCard } from "@/lib/types";
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

            <div className="mt-6 space-y-5">
              <section>
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Examples
                </h4>
                <ul className="space-y-2">
                  {card.examples.map((ex) => (
                    <li
                      key={ex}
                      className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800"
                    >
                      {ex}
                    </li>
                  ))}
                </ul>
              </section>

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
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
