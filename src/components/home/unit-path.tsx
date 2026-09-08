"use client";

import Link from "next/link";
import { Check, Lock, Play, RotateCcw } from "lucide-react";
import { UNITS, getLesson } from "@/lib/mock-data";
import { isUnit1QuickReview, unitBadgeLabel } from "@/lib/placement";
import { useUserStore } from "@/store/user-store";
import { cn } from "@/lib/utils";
import type { Unit } from "@/lib/types";

/** Units 1–3 browse + play for every starting level; 4+ stay locked. */
function isUnitUnlocked(unit: Unit): boolean {
  if (!unit.unlocked) return false;
  return unit.number <= 3;
}

export function UnitPath() {
  const user = useUserStore((s) => s.user);
  const completed = user.completedLessonIds;

  return (
    <div className="space-y-10">
      {UNITS.map((unit) => {
        const unlocked = isUnitUnlocked(unit);
        const badge = unitBadgeLabel(user, unit);
        const quickReview = unit.id === "unit-1" && isUnit1QuickReview(user);
        return (
          <section key={unit.id} className="relative">
            <div
              className={cn(
                "mb-4 rounded-3xl px-5 py-4",
                unlocked
                  ? quickReview
                    ? "bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-500/20"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20"
                  : "bg-slate-100 text-slate-400"
              )}
            >
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
                      : "text-emerald-50"
                    : "text-slate-400"
                )}
              >
                {quickReview
                  ? "Optional review — greetings & polite basics."
                  : unit.description}
              </p>
            </div>

            {!unlocked && (
              <div className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-8 text-sm font-medium text-slate-400">
                <Lock className="h-4 w-4" />
                Coming soon
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
                              practice · {lesson.xpReward} XP
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
