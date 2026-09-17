import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WordTranslator } from "@/components/translator/word-translator";

export const metadata: Metadata = {
  title: "Word Translator — Broto",
};

/** Standalone translator for browsing outside a lesson. */
export default function TranslatorPage() {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-lg px-4 pb-[max(3rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/home">
          <Button variant="ghost" size="icon" aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-extrabold text-slate-900">Word Translator</h1>
          <p className="text-sm text-slate-500">
            Spanish ⇄ English for every word this course teaches
          </p>
        </div>
        <Languages className="h-5 w-5 text-emerald-500" aria-hidden />
      </div>
      <WordTranslator autoFocus />
    </div>
  );
}
