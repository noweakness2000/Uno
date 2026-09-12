"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, Target, User } from "lucide-react";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { DAILY_GOAL_OPTIONS, DEFAULT_DAILY_GOAL } from "@/lib/mock-data";
import { useUserStore } from "@/store/user-store";
import { cn } from "@/lib/utils";
import type { StartingLevel } from "@/lib/types";

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
      "I've studied for a while (apps, class, or travel). I can handle the present tense and everyday phrases. Skip the beginner path.",
  },
  {
    id: "past_tense",
    title: "I can talk about the past",
    blurb:
      "I can say what I did yesterday and get around in Spanish. Start me at the past-tense units (Unit 7).",
  },
];

/** Shared card shell so onboarding reads as the same product as Home. */
const CARD = "rounded-3xl border-2 border-slate-200 bg-white p-4 shadow-sm sm:p-5";

export function OnboardingFlow({ googleReady }: { googleReady: boolean }) {
  const router = useRouter();
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);
  const [goal, setGoal] = useState<number>(DEFAULT_DAILY_GOAL);
  const [name, setName] = useState("");
  const [startingLevel, setStartingLevel] =
    useState<StartingLevel>("absolute_beginner");

  const start = () => {
    completeOnboarding(goal, name, startingLevel);
    router.push("/home");
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col gap-4 overflow-x-hidden px-3 pb-[max(3rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:max-w-2xl sm:px-4">
      <header className="flex flex-col items-center gap-3 pt-4 text-center">
        <Image
          src="/images/mascot-square.png"
          alt="Uno mascot"
          width={88}
          height={88}
          className="h-20 w-20 rounded-3xl object-cover shadow-md shadow-emerald-500/20"
          priority
        />
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-600">
            Uno
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome to Uno
          </h1>
          <p className="mt-2 text-slate-500">
            Latin American Spanish, explanations first. No hearts, no lockouts.
          </p>
        </div>
      </header>

      {googleReady && (
        <>
          <section className="rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm sm:p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-emerald-700">
              Fastest way in
            </p>
            <h2 className="mt-1 text-lg font-extrabold text-slate-900">
              Continue with Google
            </h2>
            <p className="mt-1 mb-4 text-sm text-slate-600">
              Skip the questions and start at the beginning — you can change
              your level and daily goal any time from Home.
            </p>
            <GoogleSignInButton
              label="Continue with Google"
              callbackUrl="/home"
              onBeforeSignIn={() =>
                completeOnboarding(goal, name, startingLevel)
              }
            />
          </section>

          <div className="flex items-center gap-3 px-1">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              or set up manually
            </span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>
        </>
      )}

      <section className={CARD}>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold text-slate-900">
          <User className="h-5 w-5 text-emerald-500" />
          What should we call you?
        </h2>
        <input
          id="onboarding-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Display name (optional)"
          className="h-12 w-full rounded-2xl border-2 border-slate-200 px-4 text-base font-medium outline-none focus:border-emerald-400"
          autoComplete="nickname"
          maxLength={40}
        />
        <p className="mt-2 text-xs text-slate-500">
          No account needed — progress stays in this browser. Leave blank to use
          “Learner.”
        </p>
      </section>

      <section className={CARD}>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold text-slate-900">
          <Target className="h-5 w-5 text-emerald-500" />
          Where are you starting?
        </h2>
        <div className="grid gap-3">
          {LEVEL_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              aria-pressed={startingLevel === opt.id}
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
        </div>
      </section>

      <section className={CARD}>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold text-slate-900">
          <Sparkles className="h-5 w-5 text-emerald-500" />
          Pick a daily XP goal
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {DAILY_GOAL_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              aria-pressed={goal === opt}
              onClick={() => setGoal(opt)}
              className={cn(
                "rounded-2xl border-2 px-4 py-5 text-left transition-all sm:text-center",
                goal === opt
                  ? "border-emerald-500 bg-emerald-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300"
              )}
            >
              <p className="text-2xl font-extrabold tabular-nums text-slate-900">
                {opt}
              </p>
              <p className="text-xs font-medium text-slate-500">XP / day</p>
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Motivational only — missing a day never locks a lesson.
        </p>
      </section>

      <button
        type="button"
        onClick={start}
        className={cn(
          "group flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl",
          "bg-gradient-to-br from-emerald-600 to-emerald-700 px-5",
          "text-lg font-extrabold text-white shadow-lg shadow-emerald-900/25",
          "transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.985]"
        )}
      >
        Start learning
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
}
