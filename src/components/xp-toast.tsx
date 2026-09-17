"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

/** One award to announce; a new `nonce` restarts the toast even for the same amount. */
export interface XpToastEvent {
  amount: number;
  nonce: number;
}

/**
 * Small "+N XP" pill that slides up near the bottom of the screen and fades
 * after a moment. Purely informational (aria-live polite) — it never blocks.
 */
export function XpToast({ event }: { event: XpToastEvent | null }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!event) return;
    setVisible(true);
    const t = window.setTimeout(() => setVisible(false), 1400);
    return () => window.clearTimeout(t);
  }, [event]);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-40 flex justify-center"
    >
      {event && visible ? (
        <span
          key={event.nonce}
          className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/90 px-4 py-2 text-sm font-extrabold text-amber-300 shadow-lg animate-slide-up"
        >
          <Star className="h-4 w-4 fill-current" aria-hidden />
          +{event.amount} XP
        </span>
      ) : null}
    </div>
  );
}
