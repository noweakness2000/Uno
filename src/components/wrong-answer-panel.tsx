"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface WrongAnswerPanelProps {
  correct: boolean;
  explanation: string;
  onContinue: () => void;
  onOpenWordCard?: () => void;
  hasWordCard?: boolean;
}

export function FeedbackPanel({
  correct,
  explanation,
  onContinue,
  onOpenWordCard,
  hasWordCard,
}: WrongAnswerPanelProps) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t px-4 pb-6 pt-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]",
        correct
          ? "border-emerald-200 bg-emerald-50"
          : "border-rose-200 bg-rose-50"
      )}
    >
      <div className="mx-auto flex max-w-xl flex-col gap-3">
        <div className="flex items-start gap-3">
          {correct ? (
            <CheckCircle2 className="mt-0.5 h-7 w-7 shrink-0 text-emerald-600" />
          ) : (
            <XCircle className="mt-0.5 h-7 w-7 shrink-0 text-rose-600" />
          )}
          <div className="flex-1">
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
            {!correct && (
              <p className="mt-2 text-xs font-medium text-rose-700/80">
                Marked for review — keep going.
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {hasWordCard && onOpenWordCard && (
            <Button
              variant="outline"
              className="flex-1 border-slate-300 bg-white"
              onClick={onOpenWordCard}
            >
              <BookOpen className="h-4 w-4" />
              Word card
            </Button>
          )}
          <Button
            className="flex-[2]"
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
