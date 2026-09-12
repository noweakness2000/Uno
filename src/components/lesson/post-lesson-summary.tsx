"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ConfettiBurst } from "@/components/confetti-burst";
import { Flame, Star, Target, BookMarked } from "lucide-react";
import { dailyGoalPercent, isDailyGoalMet } from "@/lib/daily-goal";
import { effectiveDailyXp, effectiveStreak } from "@/lib/streak";
import { useUserStore } from "@/store/user-store";

interface Props {
  lessonTitle: string;
  correctCount: number;
  wrongCount: number;
  earnedXp: number;
  weakCount: number;
  onContinue: () => void;
  onReview: () => void;
}

export function PostLessonSummary({
  lessonTitle,
  correctCount,
  wrongCount,
  earnedXp,
  weakCount,
  onContinue,
  onReview,
}: Props) {
  const user = useUserStore((s) => s.user);
  const streak = effectiveStreak(user);
  const todayXp = effectiveDailyXp(user);
  const total = correctCount + wrongCount;
  const accuracy = total ? Math.round((correctCount / total) * 100) : 0;
  const goalPct = dailyGoalPercent(user);
  const goalMet = isDailyGoalMet(user);

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center gap-6 px-4 py-10">
      <ConfettiBurst />
      <div className="text-center">
        <div className="relative mx-auto mb-4 h-24 w-24 animate-bounce-in">
          <Image
            src="/images/mascot-square.png"
            alt=""
            width={96}
            height={96}
            priority
            className="h-24 w-24 rounded-full object-cover shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-100"
          />
          <span
            aria-hidden
            className="absolute -right-1 -bottom-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-lg shadow-md ring-2 ring-white"
          >
            🎉
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 animate-slide-up">
          Lesson complete
        </h1>
        <p className="mt-2 text-slate-500">{lessonTitle}</p>
      </div>

      <div className="rounded-3xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white p-4 text-center shadow-sm">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white">
          <Flame className="h-6 w-6" />
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
          Streak
        </p>
        <p className="text-3xl font-extrabold text-slate-900">
          {streak} day{streak === 1 ? "" : "s"}
        </p>
        <p className="mt-1 text-sm text-slate-600">
          {goalMet
            ? "Daily goal met — nice work keeping the flame lit."
            : `Today ${todayXp}/${user.dailyGoal} XP — a little more keeps your streak happy.`}
        </p>
        <div className="mx-auto mt-3 max-w-xs">
          <Progress value={goalPct} fillIn />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-500">
              <Star className="h-4 w-4 text-amber-500" /> XP earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-extrabold text-slate-900">+{earnedXp}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-500">
              <Target className="h-4 w-4 text-emerald-500" /> Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-extrabold text-slate-900">{accuracy}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-500">
              <Flame className="h-4 w-4 text-orange-500" /> Correct
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-extrabold text-slate-900">
              {correctCount}/{total}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-500">
              <BookMarked className="h-4 w-4 text-rose-500" /> To review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-extrabold text-slate-900">{weakCount}</p>
          </CardContent>
        </Card>
      </div>

      <p className="text-center text-sm text-slate-500">
        XP, streak, and daily goal are motivational only — no hearts or lockouts.
      </p>

      <div className="flex flex-col gap-2">
        {weakCount > 0 && (
          <Button variant="outline" size="lg" onClick={onReview}>
            Review weak items
          </Button>
        )}
        <Button size="lg" onClick={onContinue}>
          Continue path
        </Button>
      </div>
    </div>
  );
}
