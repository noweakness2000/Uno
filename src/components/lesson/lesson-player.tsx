"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Languages, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FeedbackPanel } from "@/components/wrong-answer-panel";
import { WordCardDrawer } from "@/components/word-card-drawer";
import { WordTranslatorSheet } from "@/components/translator/word-translator-sheet";
import { PostLessonSummary } from "@/components/lesson/post-lesson-summary";
import { ExerciseRenderer } from "@/components/lesson/exercise-views";
import { TeachView } from "@/components/lesson/teach-view";
import { getLesson, getWordCard } from "@/lib/mock-data";
import { getCorrectAnswerDisplay } from "@/lib/correct-answer";
import { enrichWrongExplanation } from "@/lib/feedback-coach";
import { useLessonStore, withInjected } from "@/store/lesson-store";
import { useUserStore } from "@/store/user-store";
import { exerciseLabel } from "@/lib/exercise-labels";
import { playCorrectChime, playPerfectFanfare, playWrongTone } from "@/lib/sfx";
import { getDueSrsCardIds } from "@/lib/srs";
import { buildStoryReinforcement } from "@/lib/story-reinforcement";
import type { TeachExercise, WordCard } from "@/lib/types";

/** Flat bonus for a mistake-free lesson (~15% of a typical 30 XP lesson). */
const PERFECT_BONUS_XP = 5;

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
    reinforcedWordIds,
    unsureWordIds,
    injected,
    startLesson,
    recordAnswer,
    continueTeach,
    continueAfterFeedback,
    injectExercise,
    reset,
  } = useLessonStore();
  const completeLesson = useUserStore((s) => s.completeLesson);
  const markWeak = useUserStore((s) => s.markWeak);
  const reinforceWords = useUserStore((s) => s.reinforceWords);

  const [wordOpen, setWordOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<WordCard | null>(null);
  const [persisted, setPersisted] = useState(false);
  // Lives in the header chrome, outside ExerciseRenderer, so opening it never
  // touches exercise state. Locked while the feedback sheet is up rather than
  // stacking two sheets.
  const [translatorOpen, setTranslatorOpen] = useState(false);
  // Due words for the summary's quick review, picked after this lesson's
  // weak/SRS writes land so the list reflects them.
  const [reviewCardIds, setReviewCardIds] = useState<string[]>([]);

  useEffect(() => {
    startLesson(lessonId);
    return () => reset();
  }, [lessonId, startLesson, reset]);

  // Mistake-free run. A near-miss soft retry never records a wrong answer,
  // so it still counts; replays count too — XP is motivational only.
  const perfect = finished && wrongCount === 0 && correctCount > 0;
  const bonusXp = perfect ? PERFECT_BONUS_XP : 0;
  const totalXp = earnedXp + bonusXp;

  useEffect(() => {
    if (finished && !persisted && lesson) {
      completeLesson(lesson.id, totalXp);
      if (perfect) playPerfectFanfare();
      if (weakWordIds.length) markWeak(weakWordIds);
      // Only words that already carry an SRS card get credit (see store).
      if (reinforcedWordIds.length) reinforceWords(reinforcedWordIds, "certain");
      if (unsureWordIds.length) reinforceWords(unsureWordIds, "unsure");
      setReviewCardIds(
        getDueSrsCardIds(useUserStore.getState().user.srsCards).slice(0, 2)
      );
      setPersisted(true);
    }
  }, [
    finished,
    persisted,
    lesson,
    totalXp,
    perfect,
    weakWordIds,
    reinforcedWordIds,
    unsureWordIds,
    completeLesson,
    markWeak,
    reinforceWords,
  ]);

  // Lesson content plus anything generated mid-session (story follow-ups).
  const exercises = useMemo(
    () => withInjected(lesson?.exercises ?? [], injected),
    [lesson, injected]
  );
  const exercise = exercises[index];
  const progress = useMemo(() => {
    if (!exercises.length) return 0;
    return Math.min(100, (index / exercises.length) * 100);
  }, [index, exercises.length]);

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
        earnedXp={totalXp}
        bonusXp={bonusXp}
        perfect={perfect}
        weakCount={weakWordIds.length}
        reviewCardIds={reviewCardIds}
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
          {index + 1}/{exercises.length}
        </span>
        <button
          type="button"
          aria-label="Word Translator"
          title={showFeedback ? "Continue first, then look up words" : "Word Translator"}
          disabled={showFeedback}
          onClick={() => setTranslatorOpen(true)}
          className="flex h-11 w-11 touch-manipulation items-center justify-center rounded-full text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Languages className="h-5 w-5" />
        </button>
      </div>

      {isTeach && teachCard ? (
        // Keyed so each new card slides in (enter only; no exit choreography).
        <div key={exercise.id} className="animate-slide-in">
          <TeachView
            exercise={exercise as TeachExercise}
            card={teachCard}
            onContinue={() => continueTeach(exercises.length)}
          />
        </div>
      ) : (
        <>
          {/* Keyed wrapper slides each exercise in. The feedback sheet stays
              outside it: a transformed ancestor would re-anchor `fixed`. */}
          <div key={exercise.id} className="animate-slide-in">
            <div className="mb-6">
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-emerald-600">
                {exerciseLabel(exercise.type)}
              </p>
              <h1 className="text-xl font-bold leading-snug text-slate-900 sm:text-2xl">
                {exercise.prompt}
              </h1>
            </div>

            <ExerciseRenderer
              exercise={exercise}
              disabled={showFeedback}
              onSubmit={(correct, confidence, detail) => {
                // The one place every exercise's verdict passes through, so
                // the right/wrong sounds stay consistent across all types.
                if (correct) playCorrectChime();
                else playWrongTone();
                // Missed the story → one cloze from its own transcript, right
                // after, for a word that just went weak. Skipped when no line
                // holds a usable word.
                if (!correct && exercise.type === "story-listen") {
                  const followUp = buildStoryReinforcement(
                    exercise,
                    detail?.missedLineIndices
                  );
                  if (followUp) injectExercise(index + 1, followUp);
                }
                const correctAnswer = getCorrectAnswerDisplay(exercise);
                const explanation = correct
                  ? exercise.explanation
                  : enrichWrongExplanation(
                      exercise,
                      exercise.explanation,
                      correctAnswer,
                    );
                recordAnswer({
                  correct,
                  explanation,
                  xp: exercise.xp,
                  wordCardIds: exercise.wordCardIds,
                  correctAnswer,
                  confidence,
                });
              }}
            />
          </div>

          {showFeedback && lastCorrect !== null && (
            <FeedbackPanel
              correct={lastCorrect}
              explanation={lastExplanation}
              correctAnswer={lastCorrectAnswer}
              hasWordCard={Boolean(exercise.wordCardIds?.length)}
              onOpenWordCard={openWord}
              onContinue={() => continueAfterFeedback(exercises.length)}
            />
          )}
        </>
      )}

      <WordCardDrawer
        card={activeCard}
        open={wordOpen}
        onOpenChange={setWordOpen}
      />
      <WordTranslatorSheet open={translatorOpen} onOpenChange={setTranslatorOpen} />
    </div>
  );
}
