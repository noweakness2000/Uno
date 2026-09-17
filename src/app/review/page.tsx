"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Award, BookOpen, Check, Layers, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WordCardDrawer } from "@/components/word-card-drawer";
import { XpToast, type XpToastEvent } from "@/components/xp-toast";
import { getWordCard } from "@/lib/mock-data";
import { countDue } from "@/lib/srs";
import { useUserStore } from "@/store/user-store";
import type { WordCard } from "@/lib/types";

/** XP per "Got it" — small next to a ~30 XP lesson; "Review again" earns nothing. */
const GOT_IT_XP = 2;

export default function ReviewPage() {
  const weakWordIds = useUserStore((s) => s.user.weakWordIds);
  const archivedWordIds = useUserStore((s) => s.user.archivedWordIds);
  const gotItAt = useUserStore((s) => s.user.gotItAt);
  const srsCards = useUserStore((s) => s.user.srsCards);
  const archiveWeak = useUserStore((s) => s.archiveWeak);
  const markWeak = useUserStore((s) => s.markWeak);
  const awardActivityXp = useUserStore((s) => s.awardActivityXp);
  const [xpToast, setXpToast] = useState<XpToastEvent | null>(null);
  const dueCount = countDue(srsCards);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<WordCard | null>(null);

  const cards = useMemo(
    () =>
      weakWordIds
        .map((id) => getWordCard(id))
        .filter((c): c is WordCard => Boolean(c)),
    [weakWordIds]
  );
  const mastered = useMemo(
    () =>
      (archivedWordIds ?? [])
        .map((id) => getWordCard(id))
        .filter((c): c is WordCard => Boolean(c)),
    [archivedWordIds]
  );
  /** Second "Got it" within a week graduates the word. */
  const willGraduate = (id: string) => {
    const last = gotItAt?.[id];
    return (
      last !== undefined &&
      Date.now() - new Date(last).getTime() <= 7 * 24 * 60 * 60 * 1000
    );
  };

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
            Weak words + optional SRS — never locks lessons
          </p>
        </div>
      </div>

      {dueCount > 0 && (
        <Link href="/flashcards" className="mb-4 block">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <span className="font-bold">
              {dueCount} {dueCount === 1 ? "word" : "words"} ready for review
            </span>
            {" — "}optional flashcard practice. Lessons stay open.
          </div>
        </Link>
      )}

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
                    <p className="text-lg font-bold text-emerald-700">
                      {card.lemma}
                    </p>
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
                    onClick={() => {
                      archiveWeak(card.id);
                      awardActivityXp(GOT_IT_XP);
                      setXpToast({ amount: GOT_IT_XP, nonce: Date.now() });
                    }}
                    title={
                      willGraduate(card.id)
                        ? "Got it again this week — moves to Mastered"
                        : "Clear from review"
                    }
                  >
                    {willGraduate(card.id) ? (
                      <Award className="h-4 w-4" />
                    ) : null}
                    Got it
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
        </>
      )}

      {mastered.length > 0 && (
        <section className="mt-8">
          <div className="mb-3 flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Mastered
            </h2>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">
              {mastered.length}
            </span>
          </div>
          <p className="mb-3 text-xs text-slate-400">
            Got it twice in one week. Missing one in a lesson brings it back.
          </p>
          <ul className="space-y-2">
            {mastered.map((card) => (
              <li key={card.id}>
                <div className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50/50 px-4 py-3">
                  <button
                    type="button"
                    className="min-w-0 flex-1 text-left"
                    onClick={() => {
                      setActive(card);
                      setOpen(true);
                    }}
                  >
                    <p className="font-bold text-slate-800">{card.lemma}</p>
                    <p className="text-xs text-slate-500">{card.gloss}</p>
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-500"
                    onClick={() => markWeak([card.id])}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Review again
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <WordCardDrawer card={active} open={open} onOpenChange={setOpen} />
      <XpToast event={xpToast} />
    </div>
  );
}
