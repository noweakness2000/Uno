"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Check, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WordCardDrawer } from "@/components/word-card-drawer";
import { getWordCard } from "@/lib/mock-data";
import { useUserStore } from "@/store/user-store";
import type { WordCard } from "@/lib/types";

export default function ReviewPage() {
  const weakWordIds = useUserStore((s) => s.user.weakWordIds);
  const clearWeak = useUserStore((s) => s.clearWeak);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<WordCard | null>(null);

  const cards = useMemo(
    () =>
      weakWordIds
        .map((id) => getWordCard(id))
        .filter((c): c is WordCard => Boolean(c)),
    [weakWordIds]
  );

  return (
    <div className="mx-auto min-h-dvh max-w-lg px-4 pb-16 pt-6">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/home">
          <Button variant="ghost" size="icon" aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Review</h1>
          <p className="text-sm text-slate-500">
            Words marked weak from wrong answers
          </p>
        </div>
      </div>

      {cards.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Check className="h-7 w-7" />
            </div>
            <p className="font-bold text-slate-800">All clear</p>
            <p className="max-w-xs text-sm text-slate-500">
              Miss an exercise and we&apos;ll park the related word here — no
              lockouts, just a chance to revisit.
            </p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <Link href="/flashcards">
                <Button variant="secondary">
                  <Layers className="h-4 w-4" />
                  Practice flashcards
                </Button>
              </Link>
              <Link href="/home">
                <Button>Back to path</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
        <Link href="/flashcards" className="mb-4 block">
          <Button className="w-full min-h-11" size="lg">
            <Layers className="h-4 w-4" />
            Practice with flashcards
          </Button>
        </Link>
        <ul className="space-y-3">
          {cards.map((card) => (
            <li key={card.id}>
              <Card className="overflow-hidden">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-bold text-emerald-700">
                        {card.lemma}
                      </p>
                      <Badge variant="secondary">{card.cefr}</Badge>
                    </div>
                    <p className="text-sm text-slate-600">{card.gloss}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setActive(card);
                      setOpen(true);
                    }}
                  >
                    <BookOpen className="h-4 w-4" />
                    Card
                  </Button>
                  <Button
                    variant="soft"
                    size="sm"
                    onClick={() => clearWeak(card.id)}
                  >
                    Got it
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
        </>
      )}

      <WordCardDrawer card={active} open={open} onOpenChange={setOpen} />
    </div>
  );
}
