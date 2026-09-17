"use client";

import type { PlaybackRate } from "@/lib/audio";

interface Props {
  rate: PlaybackRate;
  onChange: (rate: PlaybackRate) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * The 1× / 0.7× listening-speed pill shared by every exercise that plays a
 * sentence. Callers own the rate (it lives in the lesson session store) and
 * decide whether a change restarts a clip that is already playing.
 */
export function SpeedToggle({ rate, onChange, disabled, className }: Props) {
  const slow = rate !== 1;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(slow ? 1 : 0.7)}
      aria-pressed={slow}
      aria-label={slow ? "Listening speed: slow. Switch to normal" : "Listening speed: normal. Switch to slow"}
      className={[
        "min-h-11 rounded-full border border-violet-200 bg-white px-4 text-xs font-bold text-violet-800 hover:bg-violet-50 disabled:opacity-50",
        className ?? "",
      ].join(" ")}
    >
      {slow ? "Slow 0.7×" : "Speed 1×"}
    </button>
  );
}
