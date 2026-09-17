"use client";

import { WordTranslator } from "@/components/translator/word-translator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

/**
 * In-lesson translator. Rendered from LessonPlayer's header chrome — outside
 * ExerciseRenderer — and portalled by Sheet, so opening it never remounts the
 * exercise underneath: story audio keeps playing, half-made matches and
 * typed answers stay put.
 */
export function WordTranslatorSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader className="pr-8 text-left">
          <SheetTitle className="text-xl text-slate-900">Word Translator</SheetTitle>
          <SheetDescription>
            Look up any word from the course without leaving the lesson.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <WordTranslator autoFocus compact />
        </div>
      </SheetContent>
    </Sheet>
  );
}
