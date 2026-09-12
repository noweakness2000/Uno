"use client";

import { useState } from "react";
import { ArrowRight, MessageCircle, Target } from "lucide-react";
import { SpeakButton } from "@/components/speak-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DialogueExercise, DialogueOption } from "@/lib/types";

interface Props {
  exercise: DialogueExercise;
  disabled?: boolean;
  onSubmit: (correct: boolean) => void;
}

type Entry = {
  /** NPC line that opened the turn. */
  npc: string;
  npcEn?: string;
  npcAudio?: string;
  /** What the learner picked. */
  choice: DialogueOption;
};

/**
 * Scripted multi-turn conversation.
 *
 * The learner picks a reply, the NPC answers that specific choice, and the
 * conversation moves on — a wrong pick is explained and still continues, so
 * nobody gets stuck mid-conversation. The whole dialogue reports a single
 * correct/incorrect to the lesson, true only when every turn was right.
 */
export function DialogueView({ exercise, disabled, onSubmit }: Props) {
  const [history, setHistory] = useState<Entry[]>([]);
  const [step, setStep] = useState(0);
  const [pending, setPending] = useState<DialogueOption | null>(null);
  const [wrongTurns, setWrongTurns] = useState(0);
  const [done, setDone] = useState(false);

  const turn = exercise.turns[step];
  const isLastTurn = step === exercise.turns.length - 1;

  const choose = (option: DialogueOption) => {
    if (disabled || pending) return;
    setPending(option);
    if (!option.correct) setWrongTurns((n) => n + 1);
    setHistory((h) => [
      ...h,
      { npc: turn.npc, npcEn: turn.npcEn, npcAudio: turn.audioSrc, choice: option },
    ]);
  };

  const advance = () => {
    if (!pending) return;
    if (isLastTurn) {
      setDone(true);
      onSubmit(wrongTurns === 0);
      return;
    }
    setPending(null);
    setStep((s) => s + 1);
  };

  return (
    <div className="space-y-4">
      {/* Scene */}
      <div className="rounded-2xl border-2 border-sky-100 bg-sky-50/70 p-4">
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-700">
          <MessageCircle className="h-3.5 w-3.5" />
          {exercise.npcName ? `Talking with ${exercise.npcName}` : "Conversation"}
        </p>
        <p className="mt-1 text-sm font-medium text-slate-700">
          {exercise.scenario}
        </p>
        {exercise.goal && (
          <p className="mt-2 flex items-start gap-1.5 text-xs font-semibold text-sky-800">
            <Target className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {exercise.goal}
          </p>
        )}
      </div>

      {/* Transcript */}
      <div className="space-y-3">
        {history.map((entry, i) => (
          <div key={`${entry.npc}-${i}`} className="space-y-3">
            <NpcBubble
              text={entry.npc}
              en={entry.npcEn}
              src={entry.npcAudio}
              name={exercise.npcName}
            />
            <LearnerBubble text={entry.choice.es} en={entry.choice.en} />
            {/* The NPC answers this particular choice. */}
            {(i < history.length - 1 || pending) && (
              <NpcBubble
                text={entry.choice.reply}
                en={entry.choice.replyEn}
                src={entry.choice.replyAudioSrc}
                name={exercise.npcName}
              />
            )}
          </div>
        ))}

        {/* Current, unanswered turn */}
        {!pending && !done && turn && (
          <NpcBubble
            text={turn.npc}
            en={turn.npcEn}
            src={turn.audioSrc}
            name={exercise.npcName}
          />
        )}
      </div>

      {/* Reply options */}
      {!pending && !done && turn && (
        <div className="space-y-2">
          <p className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Your reply
          </p>
          {turn.options.map((option, i) => (
            <button
              key={`${option.es}-${i}`}
              type="button"
              disabled={disabled}
              onClick={() => choose(option)}
              className={cn(
                "w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-left transition-all",
                "min-h-12 hover:border-emerald-400 hover:bg-emerald-50/50",
                "disabled:pointer-events-none disabled:opacity-50"
              )}
            >
              <span className="block font-bold text-slate-900">{option.es}</span>
              {option.en && (
                <span className="mt-0.5 block text-xs text-slate-500">
                  {option.en}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Coaching after a wrong pick — never blocks, always continues. */}
      {pending && !pending.correct && pending.explanation && (
        <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
            Worth knowing
          </p>
          <p className="mt-1 text-sm text-amber-900">{pending.explanation}</p>
        </div>
      )}

      {pending && !done && (
        <Button size="lg" className="w-full" onClick={advance}>
          {isLastTurn ? "Finish conversation" : "Keep going"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

function NpcBubble({
  text,
  en,
  src,
  name,
}: {
  text: string;
  en?: string;
  src?: string;
  name?: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span
        aria-hidden
        className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-200 text-xs font-extrabold text-slate-600"
      >
        {(name ?? "?").slice(0, 1).toUpperCase()}
      </span>
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm border-2 border-slate-200 bg-white px-3.5 py-2.5">
        <div className="flex items-start gap-2">
          <p className="font-bold text-slate-900">{text}</p>
          {/* Only when a baked clip exists — dialogues never generate audio. */}
          {src && <SpeakButton text={text} src={src} label={`Play: ${text}`} />}
        </div>
        {en && <p className="mt-0.5 text-xs text-slate-500">{en}</p>}
      </div>
    </div>
  );
}

function LearnerBubble({ text, en }: { text: string; en?: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-emerald-600 px-3.5 py-2.5 text-white">
        <p className="font-bold">{text}</p>
        {en && <p className="mt-0.5 text-xs text-emerald-100">{en}</p>}
      </div>
    </div>
  );
}
