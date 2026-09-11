"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, SkipForward, Sparkles } from "lucide-react";
import { getLesson, UNITS } from "@/lib/mock-data";
import {
  canJumpToIntermediate,
  canSkipAhead,
  getRecommendedLessonId,
} from "@/lib/placement";
import { useUserStore } from "@/store/user-store";
import { cn } from "@/lib/utils";

/** Rough reading time so the learner knows what they're committing to. */
function estimateMinutes(exerciseCount: number): number {
  return Math.max(2, Math.round(exerciseCount * 0.6));
}

/**
 * The one filled surface on Home. Hierarchy here is carried by fill weight
 * rather than position, so Continue still reads as primary at every
 * breakpoint — including desktop, where it is no longer first on screen.
 */
export function ContinueHero() {
  const user = useUserStore((s) => s.user);
  const skipUnit1 = useUserStore((s) => s.skipUnit1);
  const jumpToIntermediate = useUserStore((s) => s.jumpToIntermediate);

  const lesson = getLesson(getRecommendedLessonId(user));
  const showSkip = canSkipAhead(user);
  const showJumpIntermediate = canJumpToIntermediate(user);
  const showIntermediateButton =
    user.startingLevel === "conversational_basics";

  // Every lesson complete, or a content id that no longer resolves.
  if (!lesson) {
    return (
      <section className="rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
          Nothing queued
        </p>
        <h2 className="mt-1 text-xl font-extrabold text-slate-900">
          You’re all caught up
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Pick any unit below to practice again — nothing is ever locked.
        </p>
      </section>
    );
  }

  const unit = UNITS.find((u) => u.id === lesson.unitId);
  const lessonIndex = unit ? unit.lessonIds.indexOf(lesson.id) : -1;
  const teachCount = lesson.exercises.filter((e) => e.type === "teach").length;
  const minutes = estimateMinutes(lesson.exercises.length);

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl p-5 sm:p-6",
        "bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800",
        "shadow-lg shadow-emerald-900/25"
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-emerald-400/30 blur-2xl"
      />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-emerald-200">
              Pick up where you left off
            </p>
            {unit && (
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[11px] font-bold text-white">
                <BookOpen className="h-3 w-3" />
                Unit {unit.number}
                {lessonIndex >= 0 ? ` · Lesson ${lessonIndex + 1}` : ""}
              </span>
            )}
          </div>

          <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">
            {lesson.title}
          </h2>

          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-emerald-100">
            <span>{lesson.exercises.length} exercises</span>
            <span aria-hidden className="text-emerald-300/70">
              ·
            </span>
            <span>about {minutes} min</span>
            {teachCount > 0 && (
              <>
                <span aria-hidden className="text-emerald-300/70">
                  ·
                </span>
                <span>
                  {teachCount} new word{teachCount === 1 ? "" : "s"}
                </span>
              </>
            )}
          </p>

          {unit && lessonIndex >= 0 && (
            <div
              className="flex items-center gap-1"
              role="img"
              aria-label={`Lesson ${lessonIndex + 1} of ${unit.lessonIds.length} in this unit`}
            >
              {unit.lessonIds.map((id, i) => (
                <span
                  key={id}
                  className={cn(
                    "h-1.5 flex-1 rounded-full",
                    i < lessonIndex && "bg-emerald-300",
                    i === lessonIndex && "bg-white ring-2 ring-white/30",
                    i > lessonIndex && "bg-white/25"
                  )}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:w-56">
          <Link href={`/lesson/${lesson.id}`} className="block">
            <span
              className={cn(
                "group flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white px-5",
                "text-lg font-extrabold text-emerald-700 shadow-md shadow-emerald-950/25",
                "transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.985]"
              )}
            >
              Continue
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          {showIntermediateButton && (
            <Link href="/lesson/u4-l1" className="block">
              <span className="flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-4 text-sm font-bold text-white transition-colors hover:bg-white/20">
                Intermediate — Unit 4
              </span>
            </Link>
          )}
        </div>
      </div>

      {(showSkip || showJumpIntermediate) && (
        <div className="relative mt-4 flex flex-col gap-2 border-t border-white/15 pt-4 sm:flex-row">
          {showSkip && (
            <button
              type="button"
              onClick={() => skipUnit1()}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl border border-dashed border-white/40 px-3 text-sm font-semibold text-emerald-50 transition-colors hover:border-white hover:bg-white/10"
            >
              <SkipForward className="h-4 w-4" />
              Skip ahead — start Unit 2
            </button>
          )}
          {showJumpIntermediate && (
            <button
              type="button"
              onClick={() => jumpToIntermediate()}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl border border-dashed border-white/40 px-3 text-sm font-semibold text-emerald-50 transition-colors hover:border-white hover:bg-white/10"
            >
              <Sparkles className="h-4 w-4" />
              Jump to Intermediate (Unit 4)
            </button>
          )}
        </div>
      )}
    </section>
  );
}
