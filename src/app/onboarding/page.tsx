"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DAILY_GOAL_OPTIONS } from "@/lib/mock-data";
import { useUserStore } from "@/store/user-store";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);
  const [goal, setGoal] = useState<number>(20);

  const start = () => {
    completeOnboarding(goal);
    router.push("/home");
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4 py-10">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 text-2xl font-black text-white shadow-lg shadow-emerald-500/30">
          U
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Welcome to Uno
        </h1>
        <p className="mt-2 text-slate-500">
          LatAm-neutral Spanish. Explanations first. No hearts, no lockouts.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            Pick a daily XP goal
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          {DAILY_GOAL_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setGoal(opt)}
              className={cn(
                "rounded-2xl border-2 px-4 py-5 text-left transition-all",
                goal === opt
                  ? "border-emerald-500 bg-emerald-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300"
              )}
            >
              <p className="text-2xl font-extrabold text-slate-900">{opt}</p>
              <p className="text-xs font-medium text-slate-500">XP / day</p>
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-800">Demo learner</p>
        <p className="mt-1">
          You&apos;ll continue as <strong>Alex</strong> — no account needed.
          Progress is saved in this browser only.
        </p>
      </div>

      <Button size="lg" className="w-full" onClick={start}>
        Start learning
      </Button>
    </div>
  );
}
