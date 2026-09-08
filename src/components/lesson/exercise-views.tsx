"use client";

import { useMemo, useState } from "react";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { speakPracticeAudio } from "@/lib/tts";
import type {
  Exercise,
  ListeningChooseExercise,
  SelectExercise,
  SituationalChooseExercise,
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
        {exercise.options.map((opt, i) => (
          <button
            key={opt}
            type="button"
            disabled={disabled}
            onClick={() => setSelected(i)}
            className={cn(
              "rounded-2xl border-2 px-4 py-4 text-left text-base font-semibold transition-all",
              selected === i
                ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm"
                : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
      <Button
        className="w-full"
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
  const remaining = useMemo(() => {
    const used = [...built];
    return exercise.chips.filter((chip) => {
      const idx = used.indexOf(chip);
      if (idx === -1) return true;
      used.splice(idx, 1);
      return false;
    });
  }, [built, exercise.chips]);

  const check = () => {
    const ok =
      built.length === exercise.correctOrder.length &&
      built.every((w, i) => w === exercise.correctOrder[i]);
    onSubmit(ok);
  };

  return (
    <div className="space-y-4">
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
              className="rounded-xl border-2 border-emerald-300 bg-white px-3 py-2 text-sm font-bold text-emerald-800"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {remaining.map((chip, i) => (
          <button
            key={`${chip}-r-${i}`}
            type="button"
            disabled={disabled}
            onClick={() => setBuilt((b) => [...b, chip])}
            className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-800 hover:border-emerald-300"
          >
            {chip}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          className="flex-1"
          disabled={disabled || built.length === 0}
          onClick={() => setBuilt([])}
        >
          Clear
        </Button>
        <Button
          className="flex-[2]"
          size="lg"
          disabled={disabled || built.length === 0}
          onClick={check}
        >
          Check
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

  const normalize = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .replace(/[¡!¿?.,]/g, "")
      .replace(/\s+/g, " ");

  const check = () => {
    const answer = normalize(value);
    const ok = exercise.acceptedAnswers.some((a) => normalize(a) === answer);
    onSubmit(ok);
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
        className="h-14 w-full rounded-2xl border-2 border-slate-200 px-4 text-lg font-medium outline-none focus:border-emerald-400"
        autoCapitalize="off"
        autoCorrect="off"
      />
      <Button
        className="w-full"
        size="lg"
        disabled={disabled || !value.trim()}
        onClick={check}
      >
        Check
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-2 rounded-3xl border border-violet-100 bg-violet-50 px-4 py-6">
        <Button
          type="button"
          variant="soft"
          size="lg"
          disabled={disabled}
          onClick={() => speakPracticeAudio(exercise.audioText)}
          className="bg-violet-100 text-violet-900 hover:bg-violet-200"
        >
          <Volume2 className="h-5 w-5" />
          Play practice audio
        </Button>
        <p className="text-xs text-violet-700/80">
          Browser TTS stub · practice audio (not studio quality)
        </p>
      </div>
      <div className="grid gap-3">
        {exercise.options.map((opt, i) => (
          <button
            key={opt}
            type="button"
            disabled={disabled}
            onClick={() => setSelected(i)}
            className={cn(
              "rounded-2xl border-2 px-4 py-4 text-left text-base font-semibold transition-all",
              selected === i
                ? "border-violet-500 bg-violet-50 text-violet-900"
                : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
      <Button
        className="w-full"
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
    default:
      return null;
  }
}
