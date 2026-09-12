"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pencil, RotateCcw } from "lucide-react";
import { AudioWorkoutCard } from "@/components/home/audio-workout-card";
import { ContinueHero } from "@/components/home/continue-hero";
import { NavRail } from "@/components/home/nav-rail";
import { QuickActions } from "@/components/home/quick-actions";
import { StatusRibbon } from "@/components/home/status-ribbon";
import { UnitPath } from "@/components/home/unit-path";
import { WordOfTheDayCard } from "@/components/home/word-of-the-day-card";
import { AuthControls } from "@/components/auth/auth-controls";
import { Button } from "@/components/ui/button";
import { getPlacementBanner } from "@/lib/placement";
import { useUserStore } from "@/store/user-store";

interface HomeViewProps {
  /** Unit ids with art under public/images/units (read server-side in page.tsx). */
  unitImageIds: string[];
}

export function HomeView({ unitImageIds }: HomeViewProps) {
  const user = useUserStore((s) => s.user);
  const resetDemo = useUserStore((s) => s.resetDemo);
  const updateName = useUserStore((s) => s.updateName);
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(user.name);

  const banner = getPlacementBanner(user);

  const saveName = () => {
    updateName(draftName);
    setEditing(false);
  };

  return (
    <div
      className={[
        "mx-auto flex min-h-dvh w-full max-w-lg flex-col gap-4 overflow-x-hidden",
        "px-3 pb-[max(4rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]",
        "sm:max-w-2xl sm:px-4",
        "lg:grid lg:max-w-5xl lg:grid-cols-[13rem_minmax(0,1fr)]",
        "lg:items-start lg:gap-x-6 lg:gap-y-4 lg:px-6",
      ].join(" ")}
    >
      <NavRail />

      {/* Identity + today's status */}
      <header className="flex flex-col gap-3 rounded-3xl border-2 border-slate-200 bg-white p-4 shadow-sm lg:col-start-2 lg:row-start-1 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
        <div className="flex items-center gap-3">
          <Image
            src="/images/mascot-square.png"
            alt="Uno mascot"
            width={72}
            height={72}
            className="h-14 w-14 shrink-0 rounded-2xl object-cover animate-float sm:h-16 sm:w-16"
            priority
          />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-600 lg:hidden">
              Uno
            </p>
            <h1 className="truncate text-2xl font-extrabold text-slate-900 sm:text-[26px] lg:text-3xl">
              Hola, {user.name || "Learner"}
            </h1>
            <button
              type="button"
              onClick={() => {
                setDraftName(user.name);
                setEditing((v) => !v);
              }}
              className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-emerald-600"
            >
              <Pencil className="h-3 w-3" />
              Edit profile
            </button>
          </div>
          <div className="shrink-0 lg:hidden">
            <AuthControls />
          </div>
        </div>

        <div className="lg:rounded-2xl lg:border-2 lg:border-slate-200 lg:bg-white lg:p-4 lg:shadow-sm">
          <StatusRibbon />
        </div>

        {editing && (
          <div className="rounded-2xl border-2 border-slate-200 bg-white p-4">
            <label
              htmlFor="display-name"
              className="text-xs font-bold uppercase tracking-wide text-slate-500"
            >
              Display name
            </label>
            <input
              id="display-name"
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border-2 border-slate-200 px-3 text-base outline-none focus:border-emerald-400"
              maxLength={40}
              autoFocus
            />
            <div className="mt-3 flex gap-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
              <Button className="flex-1" onClick={saveName}>
                Save
              </Button>
            </div>
          </div>
        )}

        {banner && (
          <div className="rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">
            {banner}
          </div>
        )}
      </header>

      {/* The anchor */}
      <div className="lg:col-start-2 lg:row-start-3">
        <ContinueHero />
      </div>

      {/* Shortcuts — the rail replaces these at lg */}
      <div className="lg:hidden">
        <QuickActions />
      </div>

      {/* Optional extras: stacked on phone, paired on tablet, sidebar at lg */}
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:items-start lg:col-start-2 lg:row-start-2">
        <WordOfTheDayCard />
        <AudioWorkoutCard />
      </div>

      <section className="lg:col-start-2 lg:row-start-4">
        <h2 className="mb-4 text-lg font-bold text-slate-800">Your path</h2>
        <UnitPath unitImageIds={unitImageIds} />
      </section>

      <footer className="flex flex-col items-center gap-3 pt-2 lg:col-start-2 lg:row-start-5 lg:items-start">
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
  );
}
