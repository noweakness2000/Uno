"use client";

import { useState } from "react";
import { Flame, Pencil, Sparkles, Star, X } from "lucide-react";
import { DailyGoalPicker } from "@/components/settings/daily-goal-picker";
import { Progress } from "@/components/ui/progress";
import {
  dailyGoalPercent,
  isDailyGoalMet,
  xpToDailyGoal,
} from "@/lib/daily-goal";
import { useUserStore } from "@/store/user-store";
import { effectiveDailyXp, effectiveStreak } from "@/lib/streak";
import { cn } from "@/lib/utils";

/**
 * Streak, total XP and today's goal as one glanceable strip.
 *
 * Status, not an action: the only lesson CTA on Home is the Continue card, so
 * the one control here is the pencil that lets the learner change their goal.
 */
export function StatusRibbon() {
  const user = useUserStore((s) => s.user);
  const setDailyGoal = useUserStore((s) => s.setDailyGoal);
  const [editingGoal, setEditingGoal] = useState(false);
  const streak = effectiveStreak(user);
  const todayXp = effectiveDailyXp(user);
  const goalMet = isDailyGoalMet(user);
  const goalPct = dailyGoalPercent(user);
  const remaining = xpToDailyGoal(user);
  const hot = streak >= 3;

  return (
    <div className="flex flex-col gap-3 border-t-2 border-slate-100 pt-3">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border-2 py-1.5 pl-2 pr-3",
            hot
              ? "border-orange-200 bg-gradient-to-br from-orange-100 to-amber-50"
              : "border-orange-100 bg-orange-50/80"
          )}
        >
          <Flame
            className={cn("h-4 w-4", hot ? "text-orange-500" : "text-orange-400")}
            strokeWidth={2.5}
          />
          <span className="text-base font-extrabold leading-none tabular-nums text-orange-700">
            {streak}
          </span>
          <span className="text-[11px] font-semibold leading-none text-orange-600">
            day{streak === 1 ? "" : "s"}
          </span>
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-amber-100 bg-amber-50/80 py-1.5 pl-2 pr-3">
          <Star className="h-4 w-4 text-amber-500" strokeWidth={2.5} />
          <span className="text-base font-extrabold leading-none tabular-nums text-amber-700">
            {user.xp}
          </span>
          <span className="text-[11px] font-semibold leading-none text-amber-600">
            XP
          </span>
        </span>

        {goalMet && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            Goal met
          </span>
        )}
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-500">
            {goalMet
              ? "Today’s goal crushed"
              : `${remaining} XP to today’s goal`}
          </span>
          <span className="flex items-center gap-1">
            <span className="text-xs font-bold tabular-nums text-slate-600">
              <span className="text-sm text-emerald-700">{todayXp}</span>
              <span className="text-slate-400">/{user.dailyGoal} XP</span>
            </span>
            <button
              type="button"
              aria-label={editingGoal ? "Close goal editor" : "Change daily goal"}
              aria-expanded={editingGoal}
              onClick={() => setEditingGoal((v) => !v)}
              className="-mr-2 flex h-11 w-11 touch-manipulation items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              {editingGoal ? (
                <X className="h-4 w-4" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}
            </button>
          </span>
        </div>
        <Progress value={goalPct} />
        {editingGoal && (
          <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p className="mb-2 text-xs font-semibold text-slate-500">
              Daily XP goal
            </p>
            <DailyGoalPicker
              value={user.dailyGoal}
              onChange={(goal) => {
                setDailyGoal(goal);
                setEditingGoal(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
