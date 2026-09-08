"use client";

import { Button } from "@/components/ui/button";
import { SpeakButton } from "@/components/speak-button";
import { CheckCircle2, XCircle, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { looksSpanish } from "@/lib/audio";

interface WrongAnswerPanelProps {
  correct: boolean;
  explanation: string;
  correctAnswer?: string;
  onContinue: () => void;
  onOpenWordCard?: () => void;
  hasWordCard?: boolean;
}

export function FeedbackPanel({
  correct,
  explanation,
  correctAnswer,
  onContinue,
  onOpenWordCard,
  hasWordCard,
}: WrongAnswerPanelProps) {
  const answerIsSpanish = Boolean(correctAnswer && looksSpanish(correctAnswer));

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t px-4 pt-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]",
        "pb-[max(1.5rem,env(safe-area-inset-bottom))]",
        correct
          ? "border-emerald-200 bg-emerald-50"
          : "border-rose-200 bg-rose-50"
      )}
    >
      <div className="mx-auto flex w-full max-w-xl flex-col gap-3">
        <div className="flex items-start gap-3">
          {correct ? (
            <CheckCircle2 className="mt-0.5 h-7 w-7 shrink-0 text-emerald-600" />
          ) : (
            <XCircle className="mt-0.5 h-7 w-7 shrink-0 text-rose-600" />
          )}
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "text-lg font-bold",
                correct ? "text-emerald-800" : "text-rose-800"
              )}
            >
              {correct ? "Nice!" : "Not quite"}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">
              {explanation}
            </p>
            {!correct && correctAnswer && (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-800">
                <span>
                  Correct answer:{" "}
                  <strong className="font-extrabold break-words">{correctAnswer}</strong>
                </span>
                {answerIsSpanish && (
                  <SpeakButton text={correctAnswer} label={`Play: ${correctAnswer}`} />
                )}
              </div>
            )}
            {!correct && (
              <p className="mt-2 text-xs font-medium text-rose-700/80">
                Marked for review — keep going.
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {hasWordCard && onOpenWordCard && (
            <Button
              variant="outline"
              className="min-h-12 flex-1 touch-manipulation border-slate-300 bg-white"
              onClick={onOpenWordCard}
            >
              <BookOpen className="h-4 w-4" />
              Word card
            </Button>
          )}
          <Button
            className="min-h-12 flex-[2] touch-manipulation"
            variant={correct ? "correct" : "wrong"}
            onClick={onContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
