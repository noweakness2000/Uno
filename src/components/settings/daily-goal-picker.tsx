"use client";

import { DAILY_GOAL_OPTIONS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface Props {
  value: number;
  onChange: (goal: number) => void;
  disabled?: boolean;
}

/** Roughly how many perfect lessons each goal is (median lesson ≈ 32 XP). */
function lessonsHint(goal: number): string {
  const n = Math.max(1, Math.round(goal / 32));
  return `~${n} lesson${n === 1 ? "" : "s"}`;
}

/**
 * The four daily-goal chips, shared by the Home ribbon editor and Settings.
 * A goal that isn't in DAILY_GOAL_OPTIONS (older persisted users) still
 * shows as selected nowhere, which is fine — picking any chip fixes it.
 */
export function DailyGoalPicker({ value, onChange, disabled }: Props) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {DAILY_GOAL_OPTIONS.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            disabled={disabled}
            aria-pressed={active}
            onClick={() => onChange(opt)}
            className={cn(
              "flex min-h-12 touch-manipulation flex-col items-center justify-center rounded-2xl border-2 px-2 py-2 transition-colors",
              active
                ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300"
            )}
          >
            <span className="text-base font-extrabold leading-none tabular-nums">
              {opt}
            </span>
            <span className="mt-1 text-[10px] font-semibold text-slate-400">
              {lessonsHint(opt)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
