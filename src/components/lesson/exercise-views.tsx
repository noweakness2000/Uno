"use client";

import { useEffect, useMemo, useState } from "react";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpeakButton } from "@/components/speak-button";
import { cn } from "@/lib/utils";
import { hasSpanishVoice } from "@/lib/tts";
import {
  looksSpanish,
  playSpanishAudio,
  playStoryLines,
  stopSpanishAudio,
  voiceForIndex,
  type AudioVoice,
} from "@/lib/audio";
import {
  answersMatch,
  chipSequencesMatch,
  isChipNearMiss,
  isNearMiss,
} from "@/lib/grading";
import type {
  Exercise,
  FillBlankExercise,
  ListeningChooseExercise,
  MatchPairsExercise,
  SelectExercise,
  SituationalChooseExercise,
  StoryListenExercise,
  TapChipsExercise,
  TranslateExercise,
} from "@/lib/types";

interface CommonProps {
  disabled?: boolean;
  onSubmit: (correct: boolean) => void;
}

export function SelectView({
  exercise,
  disabled,
  onSubmit,
}: CommonProps & { exercise: SelectExercise | SituationalChooseExercise }) {
  const [selected, setSelected] = useState<number | null>(null);
  const isSituational = exercise.type === "situational-choose";

  return (
    <div className="space-y-4">
      {isSituational && (
        <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-900">
          <span className="font-bold">Situation: </span>
          {(exercise as SituationalChooseExercise).situation}
        </div>
      )}
      <div className="grid gap-3">
        {exercise.options.map((opt, i) => {
          const spanish = looksSpanish(opt);
          return (
            <div
              key={`${opt}-${i}`}
              className={cn(
                "flex min-h-12 items-stretch gap-1 rounded-2xl border-2 transition-all",
                selected === i
                  ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm"
                  : "border-slate-200 bg-white text-slate-800"
              )}
            >
              <button
                type="button"
                disabled={disabled}
                onClick={() => setSelected(i)}
                className="min-h-12 min-w-0 flex-1 touch-manipulation rounded-2xl px-4 py-3.5 text-left text-base font-semibold"
              >
                <span className="break-words">{opt}</span>
              </button>
              {spanish && (
                <div className="flex items-center pr-2">
                  <SpeakButton text={opt} label={`Play: ${opt}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Button
        className="min-h-12 w-full touch-manipulation"
        size="lg"
        disabled={selected === null || disabled}
        onClick={() =>
          selected !== null && onSubmit(selected === exercise.correctIndex)
        }
      >
        Check
      </Button>
    </div>
  );
}

export function TapChipsView({
  exercise,
  disabled,
  onSubmit,
}: CommonProps & { exercise: TapChipsExercise }) {
  const [built, setBuilt] = useState<string[]>([]);
  const [nearMissUsed, setNearMissUsed] = useState(false);
  const remaining = useMemo(() => {
    const used = [...built];
    return exercise.chips.filter((chip) => {
      const idx = used.indexOf(chip);
      if (idx === -1) return true;
      used.splice(idx, 1);
      return false;
    });
  }, [built, exercise.chips]);

  useEffect(() => {
    setBuilt([]);
    setNearMissUsed(false);
  }, [exercise.id]);

  const phrase = exercise.correctOrder.join(" ");
  const builtPhrase = built.join(" ");

  const check = () => {
    const ok = chipSequencesMatch(built, exercise.correctOrder);
    if (ok) {
      setNearMissUsed(false);
      onSubmit(true);
      return;
    }
    if (!nearMissUsed && isChipNearMiss(built, exercise.correctOrder)) {
      setNearMissUsed(true);
      return;
    }
    onSubmit(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <span className="text-xs font-medium text-slate-400">Hear target</span>
        <SpeakButton text={phrase} label={`Play: ${phrase}`} />
      </div>
      <div className="min-h-[64px] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-3">
        <div className="flex flex-wrap gap-2">
          {built.length === 0 && (
            <span className="text-sm text-slate-400">Tap chips to build…</span>
          )}
          {built.map((chip, i) => (
            <button
              key={`${chip}-${i}`}
              type="button"
              disabled={disabled}
              onClick={() =>
                setBuilt((b) => b.filter((_, idx) => idx !== i))
              }
              className="min-h-11 touch-manipulation rounded-xl border-2 border-emerald-300 bg-white px-3 py-2.5 text-sm font-bold text-emerald-800"
            >
              {chip}
            </button>
          ))}
        </div>
        {built.length > 0 && looksSpanish(builtPhrase) && (
          <div className="mt-2 flex justify-end">
            <SpeakButton text={builtPhrase} label={`Play: ${builtPhrase}`} />
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {remaining.map((chip, i) => (
          <button
            key={`${chip}-r-${i}`}
            type="button"
            disabled={disabled}
            onClick={() => setBuilt((b) => [...b, chip])}
            className="min-h-11 touch-manipulation rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-800 hover:border-emerald-300"
          >
            {chip}
          </button>
        ))}
      </div>
      {nearMissUsed && (
        <div
          role="status"
          className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          <p className="font-semibold">Close, but not quite.</p>
          <p className="mt-0.5 text-amber-800/90">
            Check your chips or try again.
          </p>
        </div>
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          variant="secondary"
          className="min-h-12 flex-1 touch-manipulation"
          disabled={disabled || built.length === 0}
          onClick={() => setBuilt([])}
        >
          Clear
        </Button>
        <Button
          className="min-h-12 flex-[2] touch-manipulation"
          size="lg"
          disabled={disabled || built.length === 0}
          onClick={check}
        >
          {nearMissUsed ? "Check again" : "Check"}
        </Button>
      </div>
    </div>
  );
}

export function TranslateView({
  exercise,
  disabled,
  onSubmit,
}: CommonProps & { exercise: TranslateExercise }) {
  const [value, setValue] = useState("");
  const [nearMissUsed, setNearMissUsed] = useState(false);

  useEffect(() => {
    setValue("");
    setNearMissUsed(false);
  }, [exercise.id]);

  const check = () => {
    const ok = exercise.acceptedAnswers.some((a) => answersMatch(a, value));
    if (ok) {
      setNearMissUsed(false);
      onSubmit(true);
      return;
    }
    if (!nearMissUsed && isNearMiss(value, exercise.acceptedAnswers)) {
      setNearMissUsed(true);
      return;
    }
    onSubmit(false);
  };

  return (
    <div className="space-y-4">
      {exercise.hint && (
        <p className="text-sm text-slate-500">Hint: {exercise.hint}</p>
      )}
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && value.trim() && !disabled) check();
        }}
        placeholder="Type in Spanish…"
        className="h-14 w-full max-w-full rounded-2xl border-2 border-slate-200 px-4 text-lg font-medium outline-none focus:border-emerald-400"
        autoCapitalize="off"
        autoCorrect="off"
      />
      <p className="text-xs text-slate-500">
        Accents are optional (e.g. perdón = perdon).
      </p>
      {nearMissUsed && (
        <div
          role="status"
          className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          <p className="font-semibold">Close, but not quite.</p>
          <p className="mt-0.5 text-amber-800/90">
            Check spelling or try again.
          </p>
        </div>
      )}
      <Button
        className="min-h-12 w-full touch-manipulation"
        size="lg"
        disabled={disabled || !value.trim()}
        onClick={check}
      >
        {nearMissUsed ? "Check again" : "Check"}
      </Button>
    </div>
  );
}

export function ListeningChooseView({
  exercise,
  disabled,
  onSubmit,
}: CommonProps & { exercise: ListeningChooseExercise }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showVoiceTip, setShowVoiceTip] = useState(false);
  const hasMp3 = Boolean(exercise.audioSrc);

  useEffect(() => {
    if (hasMp3) {
      setShowVoiceTip(false);
      return;
    }
    let cancelled = false;
    void hasSpanishVoice().then((ok) => {
      if (!cancelled) setShowVoiceTip(!ok);
    });
    return () => {
      cancelled = true;
    };
  }, [hasMp3]);

  const playAudio = () => {
    // Always resolve baked Neural2 first (audioSrc / slug); browser TTS only if missing.
    playSpanishAudio(exercise.audioText, exercise.audioSrc);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-2 rounded-3xl border border-violet-100 bg-violet-50 px-4 py-6">
        {exercise.audioSrc ? (
          <audio src={exercise.audioSrc} preload="auto" className="hidden" />
        ) : null}
        <Button
          type="button"
          variant="soft"
          size="lg"
          disabled={disabled}
          onClick={playAudio}
          className="min-h-12 touch-manipulation bg-violet-100 text-violet-900 hover:bg-violet-200"
        >
          <Volume2 className="h-5 w-5" />
          Play practice audio
        </Button>
        <p className="text-xs text-violet-700/80">
          {hasMp3
            ? "LatAm practice audio (Mexico)"
            : "Browser TTS stub · practice audio (not studio quality)"}
        </p>
        {showVoiceTip && (
          <p className="max-w-sm text-center text-[11px] leading-snug text-violet-600/90">
            Tip: install a Spanish voice pack (Windows/macOS) for clearer
            LatAm-sounding practice audio.
          </p>
        )}
      </div>
      <div className="grid gap-3">
        {exercise.options.map((opt, i) => {
          const spanish = looksSpanish(opt);
          return (
            <div
              key={`${opt}-${i}`}
              className={cn(
                "flex min-h-12 items-stretch gap-1 rounded-2xl border-2 transition-all",
                selected === i
                  ? "border-violet-500 bg-violet-50 text-violet-900"
                  : "border-slate-200 bg-white text-slate-800"
              )}
            >
              <button
                type="button"
                disabled={disabled}
                onClick={() => setSelected(i)}
                className="min-h-12 min-w-0 flex-1 touch-manipulation rounded-2xl px-4 py-3.5 text-left text-base font-semibold"
              >
                <span className="break-words">{opt}</span>
              </button>
              {spanish && (
                <div className="flex items-center pr-2">
                  <SpeakButton text={opt} label={`Play: ${opt}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Button
        className="min-h-12 w-full touch-manipulation"
        size="lg"
        disabled={selected === null || disabled}
        onClick={() =>
          selected !== null && onSubmit(selected === exercise.correctIndex)
        }
      >
        Check
      </Button>
    </div>
  );
}


export function MatchPairsView({
  exercise,
  disabled,
  onSubmit,
}: CommonProps & { exercise: MatchPairsExercise }) {
  const leftItems = useMemo(
    () => exercise.pairs.map((p, i) => ({ id: i, text: p.left })),
    [exercise.pairs]
  );
  const rightItems = useMemo(() => {
    const items = exercise.pairs.map((p, i) => ({ id: i, text: p.right }));
    // Stable shuffle by pairing text length hash so SSR/client match less critical — shuffle once on mount
    return items;
  }, [exercise.pairs]);
  const [rightOrder, setRightOrder] = useState<number[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrongFlash, setWrongFlash] = useState<number | null>(null);

  useEffect(() => {
    const ids = exercise.pairs.map((_, i) => i);
    // Fisher–Yates with seeded-ish shuffle from pair texts for variety
    let seed = exercise.pairs.reduce((a, p) => a + p.left.length * 7 + p.right.length, exercise.id.length);
    const arr = [...ids];
    for (let i = arr.length - 1; i > 0; i--) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      const j = seed % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setRightOrder(arr);
    setMatched(new Set());
    setSelectedLeft(null);
  }, [exercise.id, exercise.pairs]);

  const tryMatch = (rightId: number) => {
    if (disabled || matched.has(rightId) || selectedLeft === null) return;
    if (selectedLeft === rightId) {
      const next = new Set(matched);
      next.add(rightId);
      setMatched(next);
      setSelectedLeft(null);
      if (next.size === exercise.pairs.length) {
        onSubmit(true);
      }
    } else {
      setWrongFlash(rightId);
      setTimeout(() => setWrongFlash(null), 450);
      setSelectedLeft(null);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Tap a Spanish word, then its English match.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          {leftItems.map((item) => {
            const done = matched.has(item.id);
            return (
              <button
                key={`L-${item.id}`}
                type="button"
                disabled={disabled || done}
                onClick={() => !done && setSelectedLeft(item.id)}
                className={cn(
                  "flex min-h-12 w-full touch-manipulation items-center justify-between gap-2 rounded-2xl border-2 px-3 py-3 text-left text-sm font-semibold",
                  done
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                    : selectedLeft === item.id
                      ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                      : "border-slate-200 bg-white text-slate-800"
                )}
              >
                <span className="min-w-0 break-words">{item.text}</span>
                {looksSpanish(item.text) && (
                  <SpeakButton text={item.text} label={`Play: ${item.text}`} />
                )}
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          {rightOrder.map((id) => {
            const item = rightItems.find((r) => r.id === id)!;
            const done = matched.has(id);
            return (
              <button
                key={`R-${id}`}
                type="button"
                disabled={disabled || done || selectedLeft === null}
                onClick={() => tryMatch(id)}
                className={cn(
                  "min-h-12 w-full touch-manipulation rounded-2xl border-2 px-3 py-3 text-left text-sm font-semibold",
                  done
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                    : wrongFlash === id
                      ? "border-rose-400 bg-rose-50 text-rose-800"
                      : "border-slate-200 bg-white text-slate-800"
                )}
              >
                {item.text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function FillBlankView({
  exercise,
  disabled,
  onSubmit,
}: CommonProps & { exercise: FillBlankExercise }) {
  const [value, setValue] = useState("");
  const [nearMissUsed, setNearMissUsed] = useState(false);
  const parts = exercise.template.split("___");

  useEffect(() => {
    setValue("");
    setNearMissUsed(false);
  }, [exercise.id]);

  const check = () => {
    const ok = exercise.acceptedAnswers.some((a) => answersMatch(a, value));
    if (ok) {
      setNearMissUsed(false);
      onSubmit(true);
      return;
    }
    if (!nearMissUsed && isNearMiss(value, exercise.acceptedAnswers)) {
      setNearMissUsed(true);
      return;
    }
    onSubmit(false);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-medium leading-relaxed text-slate-800">
        {parts[0]}
        <span className="mx-1 inline-block min-w-[5rem] border-b-2 border-emerald-400 px-1 text-emerald-700">
          {value || "…"}
        </span>
        {parts.slice(1).join("___")}
      </div>
      {exercise.hint && (
        <p className="text-xs text-slate-500">Hint: {exercise.hint}</p>
      )}
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && value.trim() && !disabled) check();
        }}
        placeholder="Type the missing Spanish…"
        className="h-12 w-full rounded-2xl border-2 border-slate-200 px-4 text-base outline-none focus:border-emerald-400"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
      />
      {nearMissUsed && (
        <div
          role="status"
          className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          <p className="font-semibold">Close, but not quite.</p>
          <p className="mt-0.5 text-amber-800/90">
            Check spelling or try again.
          </p>
        </div>
      )}
      <Button
        className="min-h-12 w-full touch-manipulation"
        size="lg"
        disabled={!value.trim() || disabled}
        onClick={check}
      >
        {nearMissUsed ? "Check again" : "Check"}
      </Button>
    </div>
  );
}



export function StoryListenView({
  exercise,
  disabled,
  onSubmit,
}: CommonProps & { exercise: StoryListenExercise }) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [activeLine, setActiveLine] = useState<number>(-1);
  const [localFeedback, setLocalFeedback] = useState<{
    correct: boolean;
    explanation: string;
  } | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  const questions = exercise.questions;
  const question = questions[qIndex];
  const lines = exercise.lines;

  useEffect(() => {
    setQIndex(0);
    setSelected(null);
    setLocalFeedback(null);
    setCorrectCount(0);
    setDone(false);
    setActiveLine(-1);
    stopSpanishAudio();
    return () => stopSpanishAudio();
  }, [exercise.id]);

  const playStory = async () => {
    if (disabled || playing) return;
    setPlaying(true);
    try {
      await playStoryLines(
        lines.map((line, i) => ({
          text: line.text,
          voice: (line.voice ?? voiceForIndex(i)) as AudioVoice,
        })),
        (i) => setActiveLine(i)
      );
    } finally {
      setPlaying(false);
      setActiveLine(-1);
    }
  };

  const checkQuestion = () => {
    if (selected === null || !question || localFeedback) return;
    const correct = selected === question.correctIndex;
    const explanation =
      question.explanation ??
      (correct
        ? "Nice — that matches the story."
        : `The answer is: ${question.options[question.correctIndex]}`);
    setLocalFeedback({ correct, explanation });
    if (correct) setCorrectCount((c) => c + 1);
  };

  const advance = () => {
    if (!localFeedback) return;
    const next = qIndex + 1;
    if (next >= questions.length) {
      const totalCorrect = correctCount;
      setDone(true);
      onSubmit(totalCorrect === questions.length);
      return;
    }
    setQIndex(next);
    setSelected(null);
    setLocalFeedback(null);
  };

  return (
    <div className="space-y-5">
      {exercise.title ? (
        <h2 className="text-lg font-bold text-violet-900">{exercise.title}</h2>
      ) : null}

      <div className="rounded-3xl border border-violet-100 bg-violet-50/80 px-4 py-5">
        <div className="mb-4 flex flex-col items-center gap-2">
          <Button
            type="button"
            variant="soft"
            size="lg"
            disabled={disabled || playing}
            onClick={() => void playStory()}
            className="min-h-14 w-full max-w-xs touch-manipulation bg-violet-600 text-base font-bold text-white hover:bg-violet-700"
          >
            <Volume2 className="h-6 w-6" />
            {playing ? "Playing…" : "Play / Replay story"}
          </Button>
          <p className="text-xs text-violet-700/80">
            LatAm Neural2 · follow along in Spanish
          </p>
        </div>

        <div className="space-y-3">
          {lines.map((line, i) => (
            <p
              key={`${line.text}-${i}`}
              className={cn(
                "rounded-2xl px-3 py-2.5 text-xl font-semibold leading-snug transition-colors sm:text-2xl",
                activeLine === i
                  ? "bg-violet-200/80 text-violet-950"
                  : "text-slate-800"
              )}
            >
              {line.text}
            </p>
          ))}
        </div>
      </div>

      {question && !done ? (
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-wide text-violet-600">
            Question {qIndex + 1} of {questions.length}
          </p>
          <p className="text-base font-semibold text-slate-900">{question.prompt}</p>
          <div className="grid gap-3">
            {question.options.map((opt, i) => (
              <button
                key={`${opt}-${i}`}
                type="button"
                disabled={disabled || Boolean(localFeedback)}
                onClick={() => setSelected(i)}
                className={cn(
                  "min-h-12 w-full touch-manipulation rounded-2xl border-2 px-4 py-3.5 text-left text-base font-semibold",
                  selected === i
                    ? "border-violet-500 bg-violet-50 text-violet-900"
                    : "border-slate-200 bg-white text-slate-800"
                )}
              >
                {opt}
              </button>
            ))}
          </div>

          {localFeedback ? (
            <div
              className={cn(
                "rounded-2xl border px-4 py-3 text-sm",
                localFeedback.correct
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-rose-200 bg-rose-50 text-rose-900"
              )}
            >
              <p className="font-bold">
                {localFeedback.correct ? "Correct!" : "Not quite"}
              </p>
              <p className="mt-1">{localFeedback.explanation}</p>
              <Button
                className="mt-3 min-h-12 w-full touch-manipulation"
                size="lg"
                disabled={disabled}
                onClick={advance}
              >
                {qIndex + 1 >= questions.length ? "Finish story" : "Next question"}
              </Button>
            </div>
          ) : (
            <Button
              className="min-h-12 w-full touch-manipulation"
              size="lg"
              disabled={selected === null || disabled}
              onClick={checkQuestion}
            >
              Check
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}

export function ExerciseRenderer({
  exercise,
  disabled,
  onSubmit,
}: {
  exercise: Exercise;
  disabled?: boolean;
  onSubmit: (correct: boolean) => void;
}) {
  switch (exercise.type) {
    case "teach":
      return null;
    case "select":
      return (
        <SelectView
          exercise={exercise}
          disabled={disabled}
          onSubmit={onSubmit}
        />
      );
    case "situational-choose":
      return (
        <SelectView
          exercise={exercise}
          disabled={disabled}
          onSubmit={onSubmit}
        />
      );
    case "tap-chips":
      return (
        <TapChipsView
          exercise={exercise}
          disabled={disabled}
          onSubmit={onSubmit}
        />
      );
    case "translate":
      return (
        <TranslateView
          exercise={exercise}
          disabled={disabled}
          onSubmit={onSubmit}
        />
      );
    case "listening-choose":
      return (
        <ListeningChooseView
          exercise={exercise}
          disabled={disabled}
          onSubmit={onSubmit}
        />
      );
    case "match-pairs":
      return (
        <MatchPairsView
          exercise={exercise}
          disabled={disabled}
          onSubmit={onSubmit}
        />
      );
    case "fill-blank":
      return (
        <FillBlankView
          exercise={exercise}
          disabled={disabled}
          onSubmit={onSubmit}
        />
      );
    case "story-listen":
      return (
        <StoryListenView
          exercise={exercise}
          disabled={disabled}
          onSubmit={onSubmit}
        />
      );
    default:
      return null;
  }
}
