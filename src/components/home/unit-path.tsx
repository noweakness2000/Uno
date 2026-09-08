"use client";

import Link from "next/link";
import { Check, Lock, Play, RotateCcw } from "lucide-react";
import { UNITS, getLesson } from "@/lib/mock-data";
import { useUserStore } from "@/store/user-store";
import { cn } from "@/lib/utils";
import type { Unit } from "@/lib/types";

/** Units 1–2 browse + play for every starting level; 3+ stay locked. */
function isUnitUnlocked(unit: Unit): boolean {
  if (!unit.unlocked) return false;
  return unit.number <= 2;
}

export function UnitPath() {
  const completed = useUserStore((s) => s.user.completedLessonIds);

  return (
    <div className="space-y-10">
      {UNITS.map((unit) => {
        const unlocked = isUnitUnlocked(unit);
        return (
          <section key={unit.id} className="relative">
            <div
              className={cn(
                "mb-4 rounded-3xl px-5 py-4",
                unlocked
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20"
                  : "bg-slate-100 text-slate-400"
              )}
            >
              <p className="text-xs font-bold uppercase tracking-wider opacity-80">
                Unit {unit.number}
              </p>
              <h2 className="text-xl font-extrabold">{unit.title}</h2>
              <p
                className={cn(
                  "mt-1 text-sm",
                  unlocked ? "text-emerald-50" : "text-slate-400"
                )}
              >
                {unit.description}
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
                            "group flex items-stretch gap-4 rounded-2xl border-2 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
                            done
                              ? "border-emerald-200 hover:border-emerald-400"
                              : "border-amber-200 hover:border-amber-400"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-inner",
                              done ? "bg-emerald-500" : "bg-amber-400"
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
                                    : "bg-amber-100 text-amber-800"
                                )}
                              >
                                {done ? "Review" : "Play"}
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
