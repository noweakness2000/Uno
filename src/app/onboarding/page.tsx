"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DAILY_GOAL_OPTIONS } from "@/lib/mock-data";
import { useUserStore } from "@/store/user-store";
import { cn } from "@/lib/utils";
import type { StartingLevel } from "@/lib/types";
import { Sparkles, User } from "lucide-react";

const LEVEL_OPTIONS: {
  id: StartingLevel;
  title: string;
  blurb: string;
}[] = [
  {
    id: "absolute_beginner",
    title: "Brand new",
    blurb:
      "I barely know any Spanish. Start me with the basics from the beginning.",
  },
  {
    id: "some_words",
    title: "I know a little",
    blurb:
      "I know greetings and a few words, but conversations are still hard. Ease me in past the very first lessons.",
  },
  {
    id: "conversational_basics",
    title: "I've been practicing",
    blurb:
      "I've studied for a while (apps, class, or travel). Skip the beginner path and put me in the harder practice units.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);
  const [goal, setGoal] = useState<number>(20);
  const [name, setName] = useState("");
  const [startingLevel, setStartingLevel] =
    useState<StartingLevel>("absolute_beginner");

  const start = () => {
    completeOnboarding(goal, name, startingLevel);
    router.push("/home");
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center overflow-x-hidden px-3 py-8 sm:px-4 sm:py-10">
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

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-emerald-500" />
            What should we call you?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Display name (optional)"
            className="h-12 w-full rounded-2xl border-2 border-slate-200 px-4 text-base font-medium outline-none focus:border-emerald-400"
            autoComplete="nickname"
            maxLength={40}
          />
          <p className="mt-2 text-xs text-slate-500">
            No account needed — progress stays in this browser. Leave blank to
            use “Learner.”
          </p>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">Where are you starting?</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {LEVEL_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setStartingLevel(opt.id)}
              className={cn(
                "rounded-2xl border-2 px-4 py-4 text-left transition-all",
                startingLevel === opt.id
                  ? "border-emerald-500 bg-emerald-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300"
              )}
            >
              <p className="font-bold text-slate-900">{opt.title}</p>
              <p className="mt-1 text-sm text-slate-500">{opt.blurb}</p>
            </button>
          ))}
        </CardContent>
      </Card>

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

      <Button size="lg" className="w-full" onClick={start}>
        Start learning
      </Button>
    </div>
  );
}
