"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Headphones, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  narratorVoiceFor,
  playStoryLines,
  stopSpanishAudio,
  type AudioVoice,
  type PlaybackRate,
} from "@/lib/audio";
import { SpeedToggle } from "@/components/lesson/speed-toggle";
import { useLessonStore } from "@/store/lesson-store";
import { normalizeAnswer } from "@/lib/grading";
import { playCorrectChime, playWrongTone } from "@/lib/sfx";
import { cn, stripTrailingPeriod } from "@/lib/utils";
import type { AnswerConfidence, StoryListenExercise } from "@/lib/types";
import type { SubmitDetail } from "@/components/lesson/exercise-views";

interface Props {
  exercise: StoryListenExercise;
  disabled?: boolean;
  onSubmit: (
    correct: boolean,
    confidence?: AnswerConfidence,
    detail?: SubmitDetail
  ) => void;
}

/** Where the highlight sits: a word inside a line. */
interface WordPos {
  line: number;
  word: number;
}

/**
 * Heuristic word timing: each word's share of its clip is proportional to
 * its letter count, with a little extra for a punctuation pause. Clips carry
 * no real timestamps yet; this is the "good enough?" trial before investing
 * in SSML timepoints.
 */
function wordStarts(words: string[]): number[] {
  const weights = words.map((w) => {
    const letters = (w.match(/[\p{L}\p{N}]/gu) ?? []).length;
    const pause = /[.,;:!?…]$/.test(w) ? 1.2 : 0;
    return Math.max(1, letters) + pause;
  });
  const total = weights.reduce((a, b) => a + b, 0) || 1;
  const starts: number[] = [];
  let acc = 0;
  for (const w of weights) {
    starts.push(acc / total);
    acc += w;
  }
  return starts;
}

/** Neural2 clips open and close on a breath of silence; trim it out. */
const LEAD_S = 0.06;
const TRAIL_S = 0.12;

export function StoryListenView({ exercise, disabled, onSubmit }: Props) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "playing" | "paused">("idle");
  const [active, setActive] = useState<WordPos | null>(null);
  const [resumeFrom, setResumeFrom] = useState(0);
  // Shared with the other listening exercises for the rest of the lesson.
  const rate = useLessonStore((s) => s.playbackRate);
  const setRate = useLessonStore((s) => s.setPlaybackRate);
  const [showEn, setShowEn] = useState(false);
  const [localFeedback, setLocalFeedback] = useState<{
    correct: boolean;
    explanation: string;
  } | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  // Lines a missed question was about (its explanation quotes the line), so
  // the follow-up cloze can come from the part they didn't catch.
  const [missedLines, setMissedLines] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [displayOptions, setDisplayOptions] = useState<
    { text: string; originalIndex: number }[]
  >([]);
  const abortRef = useRef<AbortController | null>(null);
  const generationRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const wordRefs = useRef<Map<string, HTMLSpanElement>>(new Map());

  const questions = exercise.questions;
  const question = questions[qIndex];
  const lines = exercise.lines;
  const playing = status === "playing";

  // One narrator for the whole story; a line's own voice (a second
  // character) wins when set.
  const narrator = useMemo(() => narratorVoiceFor(exercise.id), [exercise.id]);
  const tokens = useMemo(
    () =>
      lines.map((line) => {
        const words = line.text.trim().split(/\s+/);
        return { words, starts: wordStarts(words) };
      }),
    [lines]
  );

  const stopTracking = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const stopPlayback = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    stopTracking();
    stopSpanishAudio();
  };

  useEffect(() => {
    setQIndex(0);
    setSelected(null);
    setLocalFeedback(null);
    setCorrectCount(0);
    setMissedLines([]);
    setDone(false);
    setActive(null);
    setResumeFrom(0);
    setStatus("idle");
    stopPlayback();
    return () => stopPlayback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id]);

  useEffect(() => {
    if (!active) return;
    const el = wordRefs.current.get(`${active.line}:${active.word}`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [active]);

  useEffect(() => {
    if (!question) {
      setDisplayOptions([]);
      return;
    }
    const items = question.options.map((text, originalIndex) => ({
      text,
      originalIndex,
    }));
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    setDisplayOptions(items);
    setSelected(null);
  }, [exercise.id, qIndex, question]);

  /**
   * Follow one line's clip: map media time to a word via the heuristic
   * starts. Media time already runs at playbackRate, so no extra scaling.
   * With no element (browser TTS fallback) the words are paced against the
   * same wall-clock estimate audio.ts waits on, scaled by 1/rate.
   */
  const trackLine = (
    gen: number,
    lineIndex: number,
    audio: HTMLAudioElement | null,
    playbackRate: number
  ) => {
    stopTracking();
    const { words, starts } = tokens[lineIndex];
    const text = lines[lineIndex].text;
    const fallbackMs = Math.min(4000, 400 + text.length * 60) / playbackRate;
    const startedAt = performance.now();
    let lastWord = -1;

    const tick = () => {
      if (generationRef.current !== gen) return;
      let frac: number;
      if (audio && Number.isFinite(audio.duration) && audio.duration > 0) {
        const span = Math.max(0.2, audio.duration - LEAD_S - TRAIL_S);
        frac = (audio.currentTime - LEAD_S) / span;
      } else {
        frac = (performance.now() - startedAt) / fallbackMs;
      }
      frac = Math.min(0.999, Math.max(0, frac));
      let w = 0;
      for (let i = 0; i < starts.length; i++) if (starts[i] <= frac) w = i;
      if (w !== lastWord) {
        lastWord = w;
        setActive({ line: lineIndex, word: w });
      }
      if (w < words.length - 1 || (audio && !audio.ended)) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const runPlayback = async (startIndex: number, playbackRate: PlaybackRate) => {
    if (disabled) return;
    stopPlayback();
    const gen = ++generationRef.current;
    const ac = new AbortController();
    abortRef.current = ac;
    setStatus("playing");
    setResumeFrom(startIndex);
    try {
      await playStoryLines(
        lines.map((line) => ({
          text: line.text,
          voice: (line.voice ?? narrator) as AudioVoice,
        })),
        {
          startIndex,
          gapMs: 600,
          rate: playbackRate,
          signal: ac.signal,
          onLine: (i) => {
            if (generationRef.current !== gen) return;
            setActive({ line: i, word: 0 });
            setResumeFrom(i);
          },
          onLineAudio: (i, audio) => {
            if (generationRef.current !== gen) return;
            trackLine(gen, i, audio, playbackRate);
          },
        }
      );
      if (generationRef.current !== gen || ac.signal.aborted) return;
      stopTracking();
      setStatus("idle");
      setActive(null);
      setResumeFrom(0);
    } catch {
      if (generationRef.current === gen) {
        stopTracking();
        setStatus("idle");
      }
    }
  };

  const togglePlayPause = () => {
    if (disabled || done) return;
    if (status === "playing") {
      const keep = active ? active.line : resumeFrom;
      stopPlayback();
      setResumeFrom(keep);
      setActive({ line: keep, word: 0 });
      setStatus("paused");
      return;
    }
    const start = status === "paused" ? resumeFrom : 0;
    void runPlayback(start, rate);
  };

  const restart = () => {
    if (disabled || done) return;
    void runPlayback(0, rate);
  };

  const changeRate = (next: PlaybackRate) => {
    setRate(next);
    if (status === "playing") {
      const start = active ? active.line : resumeFrom;
      void runPlayback(start, next);
    }
  };

  const checkQuestion = () => {
    if (selected === null || !question || localFeedback) return;
    const correct =
      displayOptions[selected]?.originalIndex === question.correctIndex;
    const explanation =
      question.explanation ??
      (correct
        ? "Nice — that matches the story."
        : `The answer is: ${question.options[question.correctIndex]}`);
    setLocalFeedback({ correct, explanation });
    if (correct) {
      playCorrectChime();
      setCorrectCount((c) => c + 1);
      return;
    }
    playWrongTone();
    const quoted = normalizeAnswer(question.explanation ?? "");
    if (!quoted) return;
    const lineIndex = lines.findIndex((l) => {
      const text = normalizeAnswer(l.text);
      return text.includes(quoted) || quoted.includes(text);
    });
    if (lineIndex >= 0) {
      setMissedLines((m) => (m.includes(lineIndex) ? m : [...m, lineIndex]));
    }
  };

  const advance = () => {
    if (!localFeedback) return;
    const next = qIndex + 1;
    if (next >= questions.length) {
      setDone(true);
      onSubmit(correctCount === questions.length, undefined, {
        missedLineIndices: missedLines,
      });
      return;
    }
    setQIndex(next);
    setSelected(null);
    setLocalFeedback(null);
  };

  const activeLine = active?.line ?? -1;

  return (
    <div className="space-y-5">
      {exercise.title ? (
        <h2 className="text-lg font-bold text-violet-900">{exercise.title}</h2>
      ) : null}

      <div className="rounded-3xl border border-violet-100 bg-gradient-to-b from-violet-50 to-white px-4 py-5 shadow-sm">
        <div className="mb-1 flex items-center justify-center gap-2 text-violet-700">
          <Headphones className="h-4 w-4" />
          <p className="text-[11px] font-bold uppercase tracking-wider">
            Listen workout
          </p>
        </div>
        <p className="mb-4 text-center text-xs text-violet-700/80">
          Hands-free · press play and follow along
        </p>

        <div className="mb-4 flex flex-col items-center gap-3">
          <div className="flex w-full max-w-sm items-stretch gap-2">
            <Button
              type="button"
              variant="soft"
              size="lg"
              disabled={disabled || done}
              onClick={togglePlayPause}
              className="min-h-14 flex-1 touch-manipulation bg-violet-600 text-base font-bold text-white hover:bg-violet-700"
            >
              {playing ? (
                <>
                  <Pause className="h-6 w-6" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-6 w-6 fill-current" />
                  {status === "paused" ? "Resume" : "Play"}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="soft"
              size="lg"
              disabled={disabled || done}
              onClick={restart}
              className="min-h-14 min-w-14 touch-manipulation border border-violet-200 bg-white px-3 text-violet-800 hover:bg-violet-50"
              aria-label="Restart from beginning"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <SpeedToggle rate={rate} onChange={changeRate} disabled={disabled || done} />
            {lines.some((l) => l.en) ? (
              <button
                type="button"
                disabled={disabled}
                onClick={() => setShowEn((v) => !v)}
                className="min-h-11 rounded-full border border-violet-200 bg-white px-4 text-xs font-bold text-violet-800 hover:bg-violet-50 disabled:opacity-50"
              >
                {showEn ? "Hide English" : "Show English"}
              </button>
            ) : null}
          </div>
        </div>

        {/* One flowing paragraph; each word is its own span so the narration
            can light it up as it goes. */}
        <div className="max-h-[50vh] overflow-y-auto overscroll-contain rounded-2xl bg-white/60 px-3 py-3 sm:max-h-none sm:overflow-visible">
          <p
            lang="es"
            className="text-xl font-medium leading-relaxed text-slate-800 sm:text-2xl sm:leading-relaxed"
          >
            {tokens.map(({ words }, li) => {
              const lineState =
                li === activeLine ? "active" : li < activeLine ? "past" : "future";
              return (
                <span
                  key={`${lines[li].text}-${li}`}
                  className={cn(
                    lineState === "past" && "text-slate-400",
                    lineState === "active" && "font-semibold text-violet-950"
                  )}
                >
                  {words.map((word, wi) => {
                    const isActive =
                      active !== null && active.line === li && active.word === wi;
                    const spoken =
                      lineState === "active" && active !== null && wi < active.word;
                    return (
                      <span key={`${word}-${wi}`}>
                        <span
                          ref={(el) => {
                            const key = `${li}:${wi}`;
                            if (el) wordRefs.current.set(key, el);
                            else wordRefs.current.delete(key);
                          }}
                          className={cn(
                            "rounded-md px-0.5 transition-colors duration-100",
                            isActive && "bg-violet-300/90 text-violet-950",
                            spoken && "text-violet-800"
                          )}
                        >
                          {word}
                        </span>
                        {wi < words.length - 1 ? " " : null}
                      </span>
                    );
                  })}
                  {li < tokens.length - 1 ? " " : null}
                </span>
              );
            })}
          </p>
          {showEn ? (
            <p className="mt-3 border-t border-violet-100 pt-3 text-sm leading-relaxed text-slate-500">
              {lines.map((line, li) =>
                line.en ? (
                  <span
                    key={`${line.en}-${li}`}
                    className={cn(
                      li === activeLine && "font-semibold text-violet-800"
                    )}
                  >
                    {line.en}
                    {li < lines.length - 1 ? " " : null}
                  </span>
                ) : null
              )}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          disabled={disabled || done}
          onClick={() => {
            stopPlayback();
            setStatus("idle");
            setActive(null);
            setResumeFrom(0);
            setDone(true);
            onSubmit(true);
          }}
          className="mt-4 min-h-11 w-full touch-manipulation text-center text-sm font-semibold text-slate-500 hover:text-emerald-700 disabled:opacity-50"
        >
          Can&apos;t listen now? Skip
        </button>
      </div>

      {question && !done ? (
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-wide text-violet-600">
            Question {qIndex + 1} of {questions.length}
          </p>
          <p className="text-base font-semibold text-slate-900">{question.prompt}</p>
          <div className="grid gap-3">
            {displayOptions.map((opt, i) => (
              <button
                key={`${opt.text}-${opt.originalIndex}`}
                type="button"
                disabled={disabled || Boolean(localFeedback)}
                onClick={() => setSelected(i)}
                className={cn(
                  "min-h-12 w-full touch-manipulation rounded-2xl border-2 px-4 py-3.5 text-left text-base font-semibold transition-colors motion-reduce:transition-none",
                  selected === i
                    ? localFeedback
                      ? localFeedback.correct
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900 animate-pop-glow"
                        : "border-rose-400 bg-rose-50 text-rose-900 animate-shake"
                      : "border-violet-500 bg-violet-50 text-violet-900"
                    : "border-slate-200 bg-white text-slate-800"
                )}
              >
                {stripTrailingPeriod(opt.text)}
              </button>
            ))}
          </div>

          {localFeedback ? (
            <div
              className={cn(
                "rounded-2xl border px-4 py-3 text-sm animate-slide-up",
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
