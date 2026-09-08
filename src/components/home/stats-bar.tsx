"use client";

import { Flame, Star, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useUserStore } from "@/store/user-store";

export function StatsBar() {
  const user = useUserStore((s) => s.user);
  const goalPct = Math.min(
    100,
    Math.round((user.dailyXp / Math.max(user.dailyGoal, 1)) * 100)
  );

  return (
    <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Streak</p>
            <p className="text-lg font-extrabold text-slate-900">
              {user.streak} day{user.streak === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
            <Star className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total XP</p>
            <p className="text-lg font-extrabold text-slate-900">{user.xp}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Daily goal</p>
            <p className="text-lg font-extrabold text-slate-900">
              {user.dailyXp}/{user.dailyGoal}
            </p>
          </div>
        </div>
      </div>
      <div>
        <div className="mb-1 flex justify-between text-xs font-medium text-slate-500">
          <span>Today&apos;s progress</span>
          <span>{goalPct}%</span>
        </div>
        <Progress value={goalPct} />
      </div>
      <p className="text-center text-[11px] text-slate-400">
        Motivational only — no energy drain or lockouts
      </p>
    </div>
  );
}
