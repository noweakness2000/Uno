"use client";

/** Short UI sounds. Web Audio — no files, no lesson MP3s. */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  return ctx;
}

/** One enveloped note: quick attack, exponential release. */
function tone(
  c: AudioContext,
  freq: number,
  at: number,
  opts: { type?: OscillatorType; peak?: number; length?: number; slideTo?: number } = {}
): void {
  const { type = "triangle", peak = 0.18, length = 0.18, slideTo } = opts;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, at + length);
  gain.gain.setValueAtTime(0, at);
  gain.gain.linearRampToValueAtTime(peak, at + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, at + length);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(at);
  osc.stop(at + length + 0.02);
}

/** Correct answer: bright ascending run C5 E5 G5 C6. */
export function playCorrectChime(): void {
  const c = getCtx();
  if (!c) return;
  void c.resume();
  const now = c.currentTime;
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
    tone(c, freq, now + i * 0.055);
  });
}

/** One pair matched: a soft two-note tick (G5 → C6), quieter than the chime. */
export function playMatchChime(): void {
  const c = getCtx();
  if (!c) return;
  void c.resume();
  const now = c.currentTime;
  tone(c, 783.99, now, { type: "sine", peak: 0.1, length: 0.09 });
  tone(c, 1046.5, now + 0.07, { type: "sine", peak: 0.1, length: 0.12 });
}

/**
 * "Gentle aw" — the one wrong-answer sound, everywhere. Two soft sine notes
 * stepping down a minor third (E4 → C4), each ~150 ms, the second starting
 * ~130 ms in so it overlaps the first's tail. Warm, never a buzzer.
 */
export function playWrongTone(): void {
  const c = getCtx();
  if (!c) return;
  void c.resume();
  const now = c.currentTime;
  tone(c, 329.63, now, { type: "sine", peak: 0.14, length: 0.15 });
  tone(c, 261.63, now + 0.13, { type: "sine", peak: 0.14, length: 0.15 });
}

/** Mistake-free lesson: a longer, brighter fanfare with a held top chord. */
export function playPerfectFanfare(): void {
  const c = getCtx();
  if (!c) return;
  void c.resume();
  const now = c.currentTime;
  // C5 E5 G5 C6 E6, then C6+E6+G6 held.
  [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((freq, i) => {
    tone(c, freq, now + i * 0.07, { peak: 0.16, length: 0.16 });
  });
  const hold = now + 0.42;
  [1046.5, 1318.5, 1568].forEach((freq) => {
    tone(c, freq, hold, { peak: 0.12, length: 0.6 });
  });
}
