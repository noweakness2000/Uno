"use client";

import { Flame, Sparkles, Star, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  dailyGoalPercent,
  isDailyGoalMet,
  xpToDailyGoal,
} from "@/lib/daily-goal";
import { useUserStore } from "@/store/user-store";
import { cn } from "@/lib/utils";

/**
 * Streak, total XP and today's goal — motivational only, never blocks lessons.
 *
 * Deliberately has no button of its own: the lesson CTA lives on the home
 * page's Continue card, and a second button pointing at the same lesson only
 * split the learner's attention.
 */
export function StreakPanel() {
  const user = useUserStore((s) => s.user);
  const goalMet = isDailyGoalMet(user);
  const goalPct = dailyGoalPercent(user);
  const remaining = xpToDailyGoal(user);
  const hot = user.streak >= 3;

  return (
    <div
      className={cn(
        "mt-4 overflow-hidden rounded-3xl border-2 p-4 shadow-sm",
        goalMet
          ? "border-orange-200 bg-gradient-to-br from-orange-50 via-amber-50 to-white"
          : "border-orange-100 bg-gradient-to-br from-orange-50/80 to-white"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-inner",
            hot
              ? "bg-gradient-to-br from-orange-500 to-rose-500"
              : "bg-gradient-to-br from-orange-400 to-amber-500"
          )}
        >
          <Flame className="h-7 w-7" strokeWidth={2.5} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
            Streak
          </p>
          <p className="text-2xl font-extrabold text-slate-900">
            {user.streak} day{user.streak === 1 ? "" : "s"}
            {hot ? " 🔥" : ""}
          </p>
          {goalMet ? (
            <p className="mt-1 flex items-center gap-1 text-sm font-medium text-emerald-700">
              <Sparkles className="h-4 w-4" />
              Daily goal crushed — streak looking strong!
            </p>
          ) : (
            <p className="mt-1 text-sm text-slate-600">
              Keep your streak alive — {remaining} XP to today&apos;s goal.
            </p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <p className="flex items-center justify-end gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-600">
            <Star className="h-3.5 w-3.5" />
            Total XP
          </p>
          <p className="text-2xl font-extrabold tabular-nums text-slate-900">
            {user.xp}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Target className="h-3.5 w-3.5" />
            Today {user.dailyXp}/{user.dailyGoal} XP
          </span>
          <span>{goalPct}%</span>
        </div>
        <Progress value={goalPct} />
      </div>

      <p className="mt-3 text-center text-[11px] text-slate-400">
        Motivational only — lessons never lock. No streak freeze needed.
      </p>
    </div>
  );
}
