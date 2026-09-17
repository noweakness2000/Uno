"use client";

import { useMemo, useState } from "react";
import { Languages, Search } from "lucide-react";
import { SpeakButton } from "@/components/speak-button";
import { WordCardDrawer } from "@/components/word-card-drawer";
import { Badge } from "@/components/ui/badge";
import { audioSrcFor } from "@/lib/audio";
import {
  lookupWord,
  translatorCoverage,
  type TranslatorHit,
} from "@/lib/translator";
import type { WordCard } from "@/lib/types";

/**
 * The translator panel body: one search box, results from lookupWord, and an
 * "Open Word Card" path into the full drawer. Shared by the in-lesson sheet
 * and the standalone /translator page.
 */
export function WordTranslator({
  autoFocus = false,
  compact = false,
}: {
  autoFocus?: boolean;
  /** Tighter spacing for the in-lesson sheet. */
  compact?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [card, setCard] = useState<WordCard | null>(null);
  const result = useMemo(() => lookupWord(query), [query]);
  const coverage = useMemo(() => translatorCoverage(), []);
  const searched = result.query.length > 0;

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      <label className="relative block">
        <span className="sr-only">Word to translate</span>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Spanish or English — hablo, soy, to rest…"
          autoFocus={autoFocus}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          className="h-12 w-full rounded-2xl border-2 border-slate-200 bg-white pl-11 pr-4 text-base font-medium outline-none focus:border-emerald-400"
        />
      </label>

      {!searched ? (
        <p className="text-sm text-slate-500">
          Looks up the {coverage.cards} words this course teaches and the{" "}
          {coverage.forms} verb forms in their tables. Accents are optional.
        </p>
      ) : result.hits.length === 0 ? (
        <div
          role="status"
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
        >
          <p className="font-semibold text-slate-800">
            “{result.query}” isn&apos;t in this course yet.
          </p>
          <p className="mt-1">
            The translator only knows words and verb forms that lessons teach,
            so it never guesses. Check the spelling, or try the English.
          </p>
        </div>
      ) : (
        <ul className="space-y-2" aria-label="Results">
          {result.hits.map((hit) => (
            <li key={hitKey(hit)}>
              <HitRow hit={hit} onOpenCard={setCard} />
            </li>
          ))}
        </ul>
      )}

      <WordCardDrawer
        card={card}
        open={card !== null}
        onOpenChange={(open) => {
          if (!open) setCard(null);
        }}
      />
    </div>
  );
}

function hitKey(hit: TranslatorHit): string {
  return hit.kind === "form"
    ? `form:${hit.infinitive}:${hit.tense}:${hit.form}`
    : `card:${hit.card.id}`;
}

function HitRow({
  hit,
  onOpenCard,
}: {
  hit: TranslatorHit;
  onOpenCard: (card: WordCard) => void;
}) {
  const card = hit.card;
  const spanish = hit.kind === "form" ? hit.form : card.lemma;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-lg font-extrabold text-emerald-700">{spanish}</span>
        <SpeakButton
          text={spanish}
          src={audioSrcFor(spanish, "f")}
          label={`Play: ${spanish}`}
        />
        <Badge variant="secondary">
          {hit.kind === "form" ? "verb form" : card.pos}
        </Badge>
        {hit.kind === "form" && (
          <Badge variant="outline">{hit.person}</Badge>
        )}
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
        {hit.kind === "form" ? (
          hit.phrasing
        ) : (
          <>
            <span className="font-semibold text-slate-900">{card.gloss}</span>
            {" — "}
            {card.meaningSummary}
          </>
        )}
      </p>
      {hit.kind === "card" && card.examples[0] ? (
        <p className="mt-1.5 text-sm text-slate-500">
          <span className="text-slate-800">{card.examples[0].es}</span>{" "}
          <span>· {card.examples[0].en}</span>
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => onOpenCard(card)}
        className="mt-2 inline-flex min-h-9 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 text-xs font-bold text-emerald-800 hover:bg-emerald-100"
      >
        <Languages className="h-3.5 w-3.5" aria-hidden />
        Open Word Card{hit.kind === "form" ? `: ${card.lemma}` : ""}
      </button>
    </div>
  );
}
