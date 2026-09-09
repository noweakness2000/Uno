"use client";

import Link from "next/link";
import { Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pickAudioWorkoutLesson } from "@/lib/mock-data";
import { isIntermediateUnlockedFor } from "@/lib/placement";
import { useUserStore } from "@/store/user-store";

export function AudioWorkoutCard() {
  const user = useUserStore((s) => s.user);
  const intermediateOpen = isIntermediateUnlockedFor(user);
  const lesson = pickAudioWorkoutLesson({
    completedLessonIds: user.completedLessonIds,
    intermediateOpen,
  });

  if (!lesson) return null;

  return (
    <div className="mt-4 rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-md shadow-violet-500/30">
          <Headphones className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-violet-600">
            Audio workout
          </p>
          <h2 className="mt-0.5 text-lg font-extrabold text-slate-900">
            Listen · {lesson.title.replace(/^Story:\s*/i, "")}
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Hands-free podcast play with transcript follow-along.
          </p>
          <Link href={`/lesson/${lesson.id}`} className="mt-3 block">
            <Button
              className="min-h-12 w-full touch-manipulation bg-violet-600 hover:bg-violet-700"
              size="lg"
            >
              <Headphones className="h-4 w-4" />
              Start listen workout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
