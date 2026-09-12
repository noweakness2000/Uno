"use client";

import { useMemo } from "react";

const COLORS = [
  "#10b981", // emerald
  "#14b8a6", // teal
  "#f59e0b", // amber
  "#f43f5e", // rose
  "#8b5cf6", // violet
  "#38bdf8", // sky
];

interface Props {
  /** Number of particles. */
  count?: number;
}

/**
 * One-shot CSS confetti burst. Renders nothing interactive, is hidden from
 * assistive tech, and the pieces are `display: none` under
 * prefers-reduced-motion (see globals.css), so it degrades to nothing.
 *
 * Positions come from a small LCG rather than Math.random so server and
 * client render the same markup.
 */
export function ConfettiBurst({ count = 28 }: Props) {
  const pieces = useMemo(() => {
    let seed = 7;
    const rand = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      cx: `${Math.round(rand() * 100)}%`,
      drift: `${Math.round(rand() * 160 - 80)}px`,
      spin: `${Math.round(360 + rand() * 540)}deg`,
      delay: `${(rand() * 0.45).toFixed(2)}s`,
      color: COLORS[i % COLORS.length],
      round: rand() > 0.7,
    }));
  }, [count]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={
            {
              "--cx": p.cx,
              "--drift": p.drift,
              "--spin": p.spin,
              "--delay": p.delay,
              backgroundColor: p.color,
              borderRadius: p.round ? "9999px" : undefined,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
