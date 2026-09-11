"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FeedbackPanel } from "@/components/wrong-answer-panel";
import { WordCardDrawer } from "@/components/word-card-drawer";
import { PostLessonSummary } from "@/components/lesson/post-lesson-summary";
import { ExerciseRenderer } from "@/components/lesson/exercise-views";
import { TeachView } from "@/components/lesson/teach-view";
import { getLesson, getWordCard } from "@/lib/mock-data";
import { getCorrectAnswerDisplay } from "@/lib/correct-answer";
import { enrichWrongExplanation } from "@/lib/feedback-coach";
import { useLessonStore } from "@/store/lesson-store";
import { useUserStore } from "@/store/user-store";
import { exerciseLabel } from "@/lib/exercise-labels";
import type { TeachExercise, WordCard } from "@/lib/types";

export function LessonPlayer({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const lesson = getLesson(lessonId);
  const {
    index,
    showFeedback,
    lastCorrect,
    lastExplanation,
    lastCorrectAnswer,
    finished,
    correctCount,
    wrongCount,
    earnedXp,
    weakWordIds,
    startLesson,
    recordAnswer,
    continueTeach,
    continueAfterFeedback,
    reset,
  } = useLessonStore();
  const completeLesson = useUserStore((s) => s.completeLesson);
  const markWeak = useUserStore((s) => s.markWeak);

  const [wordOpen, setWordOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<WordCard | null>(null);
  const [persisted, setPersisted] = useState(false);

  useEffect(() => {
    startLesson(lessonId);
    return () => reset();
  }, [lessonId, startLesson, reset]);

  useEffect(() => {
    if (finished && !persisted && lesson) {
      completeLesson(lesson.id, earnedXp);
      if (weakWordIds.length) markWeak(weakWordIds);
      setPersisted(true);
    }
  }, [
    finished,
    persisted,
    lesson,
    earnedXp,
    weakWordIds,
    completeLesson,
    markWeak,
  ]);

  const exercise = lesson?.exercises[index];
  const progress = useMemo(() => {
    if (!lesson) return 0;
    return Math.min(100, (index / lesson.exercises.length) * 100);
  }, [index, lesson]);

  if (!lesson) {
    return (
      <div className="mx-auto max-w-lg p-8 text-center">
        <p className="text-lg font-semibold">Lesson not found</p>
        <Button className="mt-4" onClick={() => router.push("/home")}>
          Back home
        </Button>
      </div>
    );
  }

  if (finished) {
    return (
      <PostLessonSummary
        lessonTitle={lesson.title}
        correctCount={correctCount}
        wrongCount={wrongCount}
        earnedXp={earnedXp}
        weakCount={weakWordIds.length}
        onContinue={() => router.push("/home")}
        onReview={() => router.push("/review")}
      />
    );
  }

  if (!exercise) return null;

  const isTeach = exercise.type === "teach";
  const teachCard = isTeach
    ? getWordCard((exercise as TeachExercise).wordCardId)
    : undefined;

  const openWord = () => {
    const id = exercise.wordCardIds?.[0];
    if (!id) return;
    const card = getWordCard(id);
    if (card) {
      setActiveCard(card);
      setWordOpen(true);
    }
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-3 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(11rem,calc(env(safe-area-inset-bottom)+9rem))] sm:px-4">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          aria-label="Exit lesson"
          onClick={() => router.push("/home")}
          className="flex h-11 w-11 touch-manipulation items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>
        <Progress value={progress} className="flex-1" />
        <span className="text-xs font-bold tabular-nums text-slate-400">
          {index + 1}/{lesson.exercises.length}
        </span>
      </div>

      {isTeach && teachCard ? (
        <TeachView
          exercise={exercise as TeachExercise}
          card={teachCard}
          onContinue={() => continueTeach(lesson.exercises.length)}
        />
      ) : (
        <>
          <div className="mb-6">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-emerald-600">
              {exerciseLabel(exercise.type)}
            </p>
            <h1 className="text-xl font-bold leading-snug text-slate-900 sm:text-2xl">
              {exercise.prompt}
            </h1>
          </div>

          <ExerciseRenderer
            key={exercise.id}
            exercise={exercise}
            disabled={showFeedback}
            onSubmit={(correct) => {
              const correctAnswer = getCorrectAnswerDisplay(exercise);
              const explanation = correct
                ? exercise.explanation
                : enrichWrongExplanation(
                    exercise,
                    exercise.explanation,
                    correctAnswer
                  );
              recordAnswer({
                correct,
                explanation,
                xp: exercise.xp,
                wordCardIds: exercise.wordCardIds,
                correctAnswer,
              });
            }}
          />

          {showFeedback && lastCorrect !== null && (
            <FeedbackPanel
              correct={lastCorrect}
              explanation={lastExplanation}
              correctAnswer={lastCorrectAnswer}
              hasWordCard={Boolean(exercise.wordCardIds?.length)}
              onOpenWordCard={openWord}
              onContinue={() => continueAfterFeedback(lesson.exercises.length)}
            />
          )}
        </>
      )}

      <WordCardDrawer
        card={activeCard}
        open={wordOpen}
        onOpenChange={setWordOpen}
      />
    </div>
  );
}
