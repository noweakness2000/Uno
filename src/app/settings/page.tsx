"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthControls } from "@/components/auth/auth-controls";
import { DailyGoalPicker } from "@/components/settings/daily-goal-picker";
import { UNITS } from "@/lib/mock-data";
import {
  LEVEL_START_UNIT,
  recommendedUnitForLevel,
  skippedUnitsForLevel,
} from "@/lib/placement";
import { useUserStore } from "@/store/user-store";
import { cn } from "@/lib/utils";
import { STARTING_LEVELS, type StartingLevel } from "@/lib/types";

const LEVEL_COPY: Record<StartingLevel, { title: string; blurb: string }> = {
  absolute_beginner: {
    title: "Brand new",
    blurb: "Start from the very beginning.",
  },
  some_words: {
    title: "I know a little",
    blurb: "Greetings and a few words. Unit 1 becomes optional review.",
  },
  conversational_basics: {
    title: "I've been practicing",
    blurb: "Present tense and everyday phrases. Units 1–3 become optional review.",
  },
  past_tense: {
    title: "I can talk about the past",
    blurb: "You can say what you did yesterday. Units 1–6 become optional review.",
  },
};

const SECTION =
  "rounded-3xl border-2 border-slate-200 bg-white p-4 shadow-sm sm:p-5";

function unitNumber(unitId: string): number | undefined {
  return UNITS.find((u) => u.id === unitId)?.number;
}

export default function SettingsPage() {
  const user = useUserStore((s) => s.user);
  const updateName = useUserStore((s) => s.updateName);
  const setDailyGoal = useUserStore((s) => s.setDailyGoal);
  const setStartingLevel = useUserStore((s) => s.setStartingLevel);
  const resetDemo = useUserStore((s) => s.resetDemo);

  const [draftName, setDraftName] = useState(user.name);
  const [nameSaved, setNameSaved] = useState(false);
  const [pendingLevel, setPendingLevel] = useState<StartingLevel | null>(null);

  const saveName = () => {
    updateName(draftName);
    setNameSaved(true);
    window.setTimeout(() => setNameSaved(false), 1500);
  };

  const applyLevel = (level: StartingLevel) => {
    setStartingLevel(level);
    setPendingLevel(null);
  };

  const pendingSkips = pendingLevel ? skippedUnitsForLevel(pendingLevel) : [];
  const pendingStart = pendingLevel
    ? unitNumber(recommendedUnitForLevel(pendingLevel))
    : undefined;

  return (
    <div className="mx-auto min-h-dvh max-w-lg px-4 pb-16 pt-6">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/home">
          <Button variant="ghost" size="icon" aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <Image
          src="/images/mascot-square.png"
          alt=""
          width={40}
          height={40}
          className="h-10 w-10 rounded-xl object-cover"
        />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-extrabold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500">Your name, goal and level.</p>
        </div>
        <AuthControls />
      </div>

      <div className="flex flex-col gap-4">
        <section className={SECTION}>
          <label
            htmlFor="display-name"
            className="text-xs font-bold uppercase tracking-wide text-slate-500"
          >
            Display name
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="display-name"
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              className="h-11 min-w-0 flex-1 rounded-xl border-2 border-slate-200 px-3 text-base outline-none focus:border-emerald-400"
              maxLength={40}
            />
            <Button
              onClick={saveName}
              disabled={!draftName.trim() || draftName.trim() === user.name}
              className="shrink-0"
            >
              {nameSaved ? <Check className="h-4 w-4" /> : "Save"}
            </Button>
          </div>
        </section>

        <section className={SECTION}>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Daily XP goal
          </p>
          <p className="mt-1 mb-3 text-sm text-slate-500">
            Motivation only — it never locks a lesson.
          </p>
          <DailyGoalPicker value={user.dailyGoal} onChange={setDailyGoal} />
        </section>

        <section className={SECTION}>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Starting level
          </p>
          <p className="mt-1 mb-3 text-sm text-slate-500">
            Changes where Continue starts and which units count as optional
            review. Lessons you’ve finished stay finished.
          </p>
          <div className="grid gap-2">
            {STARTING_LEVELS.map((level) => {
              const current = user.startingLevel === level;
              const copy = LEVEL_COPY[level];
              return (
                <button
                  key={level}
                  type="button"
                  aria-pressed={current}
                  onClick={() => (current ? setPendingLevel(null) : setPendingLevel(level))}
                  className={cn(
                    "flex min-h-12 touch-manipulation items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-colors",
                    current
                      ? "border-emerald-500 bg-emerald-50"
                      : pendingLevel === level
                        ? "border-violet-400 bg-violet-50"
                        : "border-slate-200 bg-white hover:border-emerald-300"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900">{copy.title}</p>
                    <p className="text-xs text-slate-500">{copy.blurb}</p>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    {current ? "Current" : `Unit ${unitNumber(LEVEL_START_UNIT[level])}`}
                  </span>
                </button>
              );
            })}
          </div>

          {pendingLevel && (
            <div className="mt-3 rounded-2xl border border-violet-200 bg-violet-50 p-3 text-sm text-violet-900">
              <p className="font-bold">
                Continue will start at Unit {pendingStart}.
              </p>
              <p className="mt-1 text-violet-800/90">
                {pendingSkips.length > 0
                  ? `Units ${unitNumber(pendingSkips[0])}–${unitNumber(
                      pendingSkips[pendingSkips.length - 1]
                    )} are marked complete as optional review — you can still open any of them.`
                  : "Nothing is skipped. Any lessons already marked complete stay that way."}
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setPendingLevel(null)}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={() => applyLevel(pendingLevel)}>
                  Change level
                </Button>
              </div>
            </div>
          )}
        </section>

        <footer className="flex flex-col items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              resetDemo();
              window.location.href = "/onboarding";
            }}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-600"
          >
            <RotateCcw className="h-3 w-3" />
            Reset demo progress
          </button>
          <p className="text-xs text-slate-400">
            <Link href="/privacy" className="hover:text-emerald-700 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
