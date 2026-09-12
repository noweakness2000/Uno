"use client";

import { useState } from "react";

interface Props {
  hint?: string;
  /** Closed-state label. Default "Show hint". */
  label?: string;
  /** Fires the first time the hint is opened (e.g. to soften SRS credit). */
  onReveal?: () => void;
}

/** Hint is opt-in so it does not give away the answer on first look. */
export function HintReveal({ hint, label = "Show hint", onReveal }: Props) {
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  if (!hint) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (!revealed) {
            setRevealed(true);
            onReveal?.();
          }
        }}
        className="min-h-11 rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
        aria-expanded={open}
      >
        {open ? "Hide hint" : label}
      </button>
      {open ? (
        <p className="mt-2 text-sm text-slate-500">Hint: {hint}</p>
      ) : null}
    </div>
  );
}
