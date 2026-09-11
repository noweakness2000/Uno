"use client";

import { useState } from "react";

/** Hint is opt-in so it does not give away the answer on first look. */
export function HintReveal({ hint }: { hint?: string }) {
  const [open, setOpen] = useState(false);
  if (!hint) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="min-h-11 rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
        aria-expanded={open}
      >
        {open ? "Hide hint" : "Show hint"}
      </button>
      {open ? (
        <p className="mt-2 text-sm text-slate-500">Hint: {hint}</p>
      ) : null}
    </div>
  );
}
