"use client";

import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { playSpanishAudio } from "@/lib/audio";

interface SpeakButtonProps {
  text: string;
  /** Prefetched path under /audio/es-mx/; derived from text if omitted. */
  src?: string;
  className?: string;
  size?: "sm" | "md";
  label?: string;
  /** Stop click from selecting a parent option row. */
  stopPropagation?: boolean;
}

/** Compact speaker control — min ~44px tap target for phones/iPads. */
export function SpeakButton({
  text,
  src,
  className,
  size = "sm",
  label = "Play Spanish audio",
  stopPropagation = true,
}: SpeakButtonProps) {
  const dim = size === "sm" ? "h-11 w-11" : "h-12 w-12";
  const icon = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 hover:text-emerald-900 active:scale-95 touch-manipulation",
        dim,
        className
      )}
      onClick={(e) => {
        if (stopPropagation) {
          e.preventDefault();
          e.stopPropagation();
        }
        playSpanishAudio(text, src);
      }}
    >
      <Volume2 className={icon} strokeWidth={2.25} />
    </button>
  );
}
