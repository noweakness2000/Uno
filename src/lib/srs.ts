/**
 * Lightweight SM-2-ish SRS for Word Cards.
 * Motivational only — never locks lessons.
 */

export interface SrsCardState {
  /** Days until next review after last grade. */
  intervalDays: number;
  /** Ease factor (SM-2 style); default 2.5. */
  ease: number;
  /** ISO timestamp when the card becomes due. */
  dueAt: string;
  /** Successful Good grades in a row (resets on Again). */
  reps: number;
}

export type SrsCards = Record<string, SrsCardState>;

export const DEFAULT_EASE = 2.5;
const MIN_EASE = 1.3;

/** New / weak cards are due immediately. */
export function defaultSrsCard(now: Date = new Date()): SrsCardState {
  return {
    intervalDays: 0,
    ease: DEFAULT_EASE,
    dueAt: now.toISOString(),
    reps: 0,
  };
}

function addDays(isoOrDate: Date, days: number): string {
  const d = new Date(isoOrDate.getTime());
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString();
}

/** Interval ladder: 1 → 3 → 7 → 14 → 30 → grow by ease. */
export function nextGoodInterval(prevInterval: number, reps: number): number {
  if (reps <= 0 || prevInterval < 1) return 1;
  if (prevInterval < 3) return 3;
  if (prevInterval < 7) return 7;
  if (prevInterval < 14) return 14;
  if (prevInterval < 30) return 30;
  return Math.max(30, Math.round(prevInterval * 1.8));
}

/** Thumbs down / Again → short interval (≤1 day), requeue soon. */
export function gradeAgain(
  prev: SrsCardState | undefined,
  now: Date = new Date()
): SrsCardState {
  const ease = Math.max(MIN_EASE, (prev?.ease ?? DEFAULT_EASE) - 0.2);
  return {
    intervalDays: 0,
    ease,
    dueAt: now.toISOString(),
    reps: 0,
  };
}

/** Thumbs up / Good → grow interval, light ease bump. */
export function gradeGood(
  prev: SrsCardState | undefined,
  now: Date = new Date()
): SrsCardState {
  const ease = Math.min(3.0, (prev?.ease ?? DEFAULT_EASE) + 0.05);
  const reps = (prev?.reps ?? 0) + 1;
  const intervalDays = nextGoodInterval(prev?.intervalDays ?? 0, reps - 1);
  return {
    intervalDays,
    ease,
    dueAt: addDays(now, intervalDays),
    reps,
  };
}

/** Lesson miss → ensure card is due today (do not wipe progress). */
export function ensureDueSoon(
  prev: SrsCardState | undefined,
  now: Date = new Date()
): SrsCardState {
  if (!prev) return defaultSrsCard(now);
  const due = new Date(prev.dueAt);
  if (due.getTime() <= now.getTime()) return prev;
  // Pull forward to now so it shows in today's queue
  return { ...prev, dueAt: now.toISOString(), intervalDays: Math.min(prev.intervalDays, 1) };
}

export function isDue(card: SrsCardState, now: Date = new Date()): boolean {
  return new Date(card.dueAt).getTime() <= now.getTime();
}

export function countDue(
  srsCards: SrsCards | undefined,
  now: Date = new Date()
): number {
  if (!srsCards) return 0;
  let n = 0;
  for (const id of Object.keys(srsCards)) {
    if (isDue(srsCards[id], now)) n += 1;
  }
  return n;
}

/**
 * Merge server + local SRS maps: keep the more practiced entry
 * (higher reps, else later dueAt, else higher interval).
 */
export function mergeSrsCards(
  a: SrsCards | undefined,
  b: SrsCards | undefined
): SrsCards {
  const out: SrsCards = { ...(a ?? {}) };
  for (const [id, card] of Object.entries(b ?? {})) {
    const existing = out[id];
    if (!existing) {
      out[id] = card;
      continue;
    }
    if (card.reps > existing.reps) {
      out[id] = card;
    } else if (card.reps === existing.reps) {
      const aDue = new Date(existing.dueAt).getTime();
      const bDue = new Date(card.dueAt).getTime();
      if (bDue > aDue || card.intervalDays > existing.intervalDays) {
        out[id] = card;
      }
    }
  }
  return out;
}

export function getDueSrsCardIds(
  srsCards: SrsCards | undefined,
  now: Date = new Date()
): string[] {
  if (!srsCards) return [];
  return Object.entries(srsCards)
    .filter(([, c]) => isDue(c, now))
    .sort(
      (a, b) =>
        new Date(a[1].dueAt).getTime() - new Date(b[1].dueAt).getTime()
    )
    .map(([id]) => id);
}
