"use client";

import Link from "next/link";
import { Check, Lock, Play } from "lucide-react";
import { UNITS, getLesson } from "@/lib/mock-data";
import { useUserStore } from "@/store/user-store";
import { cn } from "@/lib/utils";
import type { StartingLevel, Unit } from "@/lib/types";

function isUnitUnlocked(unit: Unit, startingLevel: StartingLevel): boolean {
  if (!unit.unlocked) return false;
  // Absolute / some_words: Unit 1 only for now.
  // Conversational basics: Units 1-2 visually unlocked (no content skip yet).
  if (unit.number >= 3) return false;
  if (unit.number === 2) {
    return startingLevel === "conversational_basics";
  }
  return true;
}

export function UnitPath() {
  const completed = useUserStore((s) => s.user.completedLessonIds);
  const startingLevel = useUserStore(
    (s) => s.user.startingLevel ?? "absolute_beginner"
  );

  return (
    <div className="space-y-10">
      {UNITS.map((unit) => {
        const unlocked = isUnitUnlocked(unit, startingLevel);
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
                {unit.number === 2
                  ? "Pick Conversational basics in onboarding to unlock Unit 2 visually"
                  : "Visually locked — finish earlier units to unlock"}
              </div>
            )}

            {unlocked && (
              <ol className="relative mx-auto flex max-w-xs flex-col items-center gap-6 py-2">
                <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded-full bg-emerald-100" />
                {unit.lessonIds.map((lessonId, i) => {
                  const lesson = getLesson(lessonId);
                  if (!lesson) return null;
                  const done = completed.includes(lessonId);
                  const offset = i % 2 === 0 ? "-translate-x-8" : "translate-x-8";
                  return (
                    <li
                      key={lessonId}
                      className={cn("relative z-10", offset)}
                    >
                      <Link
                        href={`/lesson/${lessonId}`}
                        className={cn(
                          "group flex h-16 w-16 items-center justify-center rounded-full border-4 shadow-md transition-transform hover:scale-105",
                          done
                            ? "border-emerald-300 bg-emerald-500 text-white"
                            : "border-amber-200 bg-amber-400 text-white"
                        )}
                      >
                        {done ? (
                          <Check className="h-7 w-7" strokeWidth={3} />
                        ) : (
                          <Play className="h-7 w-7 fill-current" />
                        )}
                      </Link>
                      <div className="mt-2 w-36 -translate-x-1/2 left-1/2 relative text-center">
                        <p className="text-sm font-bold text-slate-800">
                          {lesson.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {lesson.exercises.length} exercises · {lesson.xpReward}{" "}
                          XP
                        </p>
                      </div>
                    </li>
                  );
                })}
                {unit.lessonIds.length === 0 && (
                  <p className="relative z-10 text-sm text-slate-400">
                    Lessons coming soon
                  </p>
                )}
              </ol>
            )}
          </section>
        );
      })}
    </div>
  );
}
