"use client";

import Link from "next/link";
import { Flame, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getLesson } from "@/lib/mock-data";
import { getRecommendedLessonId } from "@/lib/placement";
import { useUserStore } from "@/store/user-store";
import { cn } from "@/lib/utils";

/** Duo-like streak celebration — motivational only, never blocks lessons. */
export function StreakPanel() {
  const user = useUserStore((s) => s.user);
  const goalMet = user.dailyXp >= user.dailyGoal;
  const goalPct = Math.min(
    100,
    Math.round((user.dailyXp / Math.max(user.dailyGoal, 1)) * 100)
  );
  const recommendedId = getRecommendedLessonId(user);
  const recommended = getLesson(recommendedId);
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
              Keep your streak alive — {user.dailyGoal - user.dailyXp} XP to
              today&apos;s goal.
            </p>
          )}
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

      {!goalMet && recommended && (
        <Link href={`/lesson/${recommended.id}`} className="mt-3 block">
          <Button className="w-full min-h-11" size="lg">
            <Flame className="h-4 w-4" />
            Keep your streak alive
          </Button>
        </Link>
      )}

      <p className="mt-3 text-center text-[11px] text-slate-400">
        Motivational only — lessons never lock. No streak freeze needed.
      </p>
    </div>
  );
}
