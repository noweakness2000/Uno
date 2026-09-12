"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Lock, Play, RotateCcw } from "lucide-react";
import { UNITS, getLesson, lessonCreditedXp } from "@/lib/mock-data";
import {
  isOptionalReviewUnit,
  isIntermediateUnit,
  isIntermediateUnlockedFor,
  isUnit1QuickReview,
  unitBadgeLabel,
} from "@/lib/placement";
import { useUserStore } from "@/store/user-store";
import { cn } from "@/lib/utils";
import type { Unit } from "@/lib/types";


const UNIT_IMAGE_IDS = new Set([
  "unit-1",
  "unit-2",
  "unit-3",
  "unit-4",
  "unit-5",
  "unit-6",
  "unit-7",
  "unit-8",
]);

function unitImageSrc(unitId: string): string | null {
  return UNIT_IMAGE_IDS.has(unitId) ? `/images/units/${unitId}.png` : null;
}

function isUnitUnlocked(unit: Unit, intermediateOpen: boolean): boolean {
  if (!unit.unlocked) return false;
  if (unit.number <= 3) return true;
  if (isIntermediateUnit(unit)) return intermediateOpen;
  return false;
}

export function UnitPath() {
  const user = useUserStore((s) => s.user);
  const completed = user.completedLessonIds;
  const intermediateOpen = isIntermediateUnlockedFor(user);
  let lastTrack: string | null = null;

  return (
    <div className="space-y-10">
      {UNITS.map((unit) => {
        const unlocked = isUnitUnlocked(unit, intermediateOpen);
        const badge = unitBadgeLabel(user, unit);
        const quickReview =
          (unit.id === "unit-1" && isUnit1QuickReview(user)) ||
          isOptionalReviewUnit(user, unit.id);
        const intermediate = isIntermediateUnit(unit);
        const track = intermediate ? "intermediate" : "beginner";
        const showTrackDivider = track !== lastTrack;
        lastTrack = track;
        const imgSrc = unitImageSrc(unit.id);
        return (
          <section key={unit.id} className="relative">
            {showTrackDivider && (
              <div className="mb-4 flex items-center gap-3 px-1">
                <div className={"h-px flex-1 " + (intermediate ? "bg-violet-200" : "bg-emerald-200")} />
                <span className={"rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider " + (intermediate ? "bg-violet-100 text-violet-700" : "bg-emerald-100 text-emerald-700")}>
                  {intermediate ? "Intermediate" : "Beginner"}
                </span>
                <div className={"h-px flex-1 " + (intermediate ? "bg-violet-200" : "bg-emerald-200")} />
              </div>
            )}
            <div
              className={cn(
                "mb-4 rounded-3xl px-5 py-4",
                unlocked
                  ? quickReview
                    ? "bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-500/20"
                    : intermediate
                      ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/20"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20"
                  : "bg-slate-100 text-slate-400"
              )}
            >
              <div className="flex items-start gap-3">
                {imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt={`Unit ${unit.number} art`}
                    width={64}
                    height={64}
                    className={cn(
                      "h-14 w-14 shrink-0 rounded-2xl object-cover shadow-md ring-2 ring-white/30 sm:h-[72px] sm:w-[72px]",
                      !unlocked && "grayscale opacity-70"
                    )}
                  />
                ) : (
                  <div
                    className={cn(
                      "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-extrabold shadow-md ring-2 ring-white/30 sm:h-[72px] sm:w-[72px]",
                      unlocked ? "bg-white/20 text-white" : "bg-slate-200 text-slate-400"
                    )}
                    aria-hidden
                  >
                    {unit.number}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-bold uppercase tracking-wider opacity-80">
                      Unit {unit.number}
                    </p>
                    {badge && (
                      <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                        {badge}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-extrabold">{unit.title}</h2>
                  <p
                    className={cn(
                      "mt-1 text-sm",
                      unlocked
                        ? quickReview
                          ? "text-slate-200"
                          : intermediate
                            ? "text-violet-50"
                            : "text-emerald-50"
                        : "text-slate-400"
                    )}
                  >
                    {quickReview
                      ? "Optional review — beginner path."
                      : !unlocked && intermediate
                        ? "Intermediate — jump here if ready, or finish Units 1–3 first."
                        : unit.description}
                  </p>
                </div>
              </div>
            </div>

            {!unlocked && (
              <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-violet-200 bg-violet-50/50 py-8 text-sm font-medium text-violet-400">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Intermediate — jump here if ready
                </div>
                <p className="max-w-xs text-center text-xs text-violet-400/80">
                  Finish beginner units, or use Jump to Intermediate on Home if they already feel easy.
                </p>
              </div>
            )}

            {unlocked && (
              <div className="space-y-3">
                <div className="mb-1 flex items-center gap-2 px-1">
                  <div className="h-1 flex-1 rounded-full bg-emerald-100" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                    {unit.lessonIds.length} lesson
                    {unit.lessonIds.length === 1 ? "" : "s"}
                  </span>
                  <div className="h-1 flex-1 rounded-full bg-emerald-100" />
                </div>

                <ul className="grid gap-3">
                  {unit.lessonIds.map((lessonId, i) => {
                    const lesson = getLesson(lessonId);
                    if (!lesson) return null;
                    const done = completed.includes(lessonId);
                    return (
                      <li key={lessonId}>
                        <Link
                          href={`/lesson/${lessonId}`}
                          className={cn(
                            "group flex min-h-[72px] touch-manipulation items-stretch gap-3 rounded-2xl border-2 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:gap-4 sm:p-4",
                            done
                              ? "border-emerald-200 hover:border-emerald-400"
                              : quickReview
                                ? "border-slate-200 hover:border-slate-400"
                                : intermediate
                                  ? "border-violet-200 hover:border-violet-400"
                                  : "border-amber-200 hover:border-amber-400"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-inner sm:h-14 sm:w-14",
                              done
                                ? "bg-emerald-500"
                                : quickReview
                                  ? "bg-slate-400"
                                  : intermediate
                                    ? "bg-violet-500"
                                    : "bg-amber-400"
                            )}
                          >
                            {done ? (
                              <Check className="h-7 w-7" strokeWidth={3} />
                            ) : (
                              <span className="text-lg font-extrabold">
                                {i + 1}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700">
                                {lesson.title}
                              </h3>
                              <span
                                className={cn(
                                  "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                                  done
                                    ? "bg-emerald-100 text-emerald-700"
                                    : quickReview
                                      ? "bg-slate-100 text-slate-600"
                                      : intermediate
                                        ? "bg-violet-100 text-violet-800"
                                        : "bg-amber-100 text-amber-800"
                                )}
                              >
                                {done
                                  ? "Review"
                                  : quickReview
                                    ? "Optional"
                                    : "Play"}
                              </span>
                            </div>
                            <p className="mt-0.5 line-clamp-2 text-sm text-slate-500">
                              {lesson.description}
                            </p>
                            <p className="mt-2 text-xs font-semibold text-slate-400">
                              {lesson.exercises.filter((e) => e.type !== "teach")
                                .length}{" "}
                              practice · {lessonCreditedXp(lesson)} XP
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center text-slate-300 group-hover:text-emerald-500">
                            {done ? (
                              <RotateCcw className="h-5 w-5" />
                            ) : (
                              <Play className="h-5 w-5 fill-current" />
                            )}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                {unit.lessonIds.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-6 text-center text-sm text-slate-400">
                    Lessons coming soon
                  </p>
                )}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
