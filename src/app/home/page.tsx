"use client";

import { useState } from "react";
import Link from "next/link";
import { BookMarked, Layers, Pencil, Play, RotateCcw, SkipForward } from "lucide-react";
import { StatsBar } from "@/components/home/stats-bar";
import { StreakPanel } from "@/components/home/streak-panel";
import { UnitPath } from "@/components/home/unit-path";
import { Button } from "@/components/ui/button";
import { getLesson } from "@/lib/mock-data";
import {
  canSkipAhead,
  getPlacementBanner,
  getRecommendedLessonId,
} from "@/lib/placement";
import { useUserStore } from "@/store/user-store";

export default function HomePage() {
  const user = useUserStore((s) => s.user);
  const resetDemo = useUserStore((s) => s.resetDemo);
  const updateName = useUserStore((s) => s.updateName);
  const skipUnit1 = useUserStore((s) => s.skipUnit1);
  const weakCount = user.weakWordIds.length;
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(user.name);

  const recommendedId = getRecommendedLessonId(user);
  const recommended = getLesson(recommendedId);
  const banner = getPlacementBanner(user);
  const showSkip = canSkipAhead(user);

  const saveName = () => {
    updateName(draftName);
    setEditing(false);
  };

  return (
    <div className="mx-auto min-h-dvh w-full max-w-lg overflow-x-hidden px-3 pb-[max(4rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-4">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Uno
          </p>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Hola, {user.name || "Learner"}
          </h1>
          <button
            type="button"
            onClick={() => {
              setDraftName(user.name);
              setEditing((v) => !v);
            }}
            className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-emerald-600"
          >
            <Pencil className="h-3 w-3" />
            Edit profile
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Link href="/flashcards">
            <Button variant="soft" size="sm">
              <Layers className="h-4 w-4" />
              Cards
            </Button>
          </Link>
          <Link href="/review">
            <Button variant="soft" size="sm">
              <BookMarked className="h-4 w-4" />
              Review
              {weakCount > 0 && (
                <span className="ml-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] text-white">
                  {weakCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </header>

      {editing && (
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Display name
          </label>
          <input
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

      <StatsBar />

      <StreakPanel />

      {banner && (
        <div className="mt-4 rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">
          {banner}
        </div>
      )}

      {recommended && (
        <div className="mt-4 rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
            Continue
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-slate-900">
            {recommended.title}
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {recommended.description}
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Link href={`/lesson/${recommended.id}`} className="flex-1">
              <Button className="w-full min-h-11" size="lg">
                <Play className="h-4 w-4 fill-current" />
                Continue
              </Button>
            </Link>
            {user.startingLevel === "conversational_basics" && (
              <Link href="/lesson/u2-l3" className="flex-1">
                <Button variant="secondary" className="w-full min-h-11" size="lg">
                  I&apos;m comfortable — Unit 2 check
                </Button>
              </Link>
            )}
          </div>
          {showSkip && (
            <button
              type="button"
              onClick={() => skipUnit1()}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 hover:border-emerald-400 hover:text-emerald-700"
            >
              <SkipForward className="h-4 w-4" />
              Skip ahead — start Unit 2
            </button>
          )}
        </div>
      )}

      <div className="my-8">
        <h2 className="mb-4 text-lg font-bold text-slate-800">Your path</h2>
        <UnitPath />
      </div>

      <button
        type="button"
        onClick={() => {
          resetDemo();
          window.location.href = "/onboarding";
        }}
        className="mx-auto flex items-center gap-2 text-xs text-slate-400 hover:text-slate-600"
      >
        <RotateCcw className="h-3 w-3" />
        Reset demo progress
      </button>
    </div>
  );
}
