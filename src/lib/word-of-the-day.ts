/**
 * Word of the Day — one Spanish lemma per America/Chicago calendar day.
 * Pot ≈500: existing Word Cards first, then curated A1–B1 padding.
 * Selection: stable seeded shuffle, then dayIndex % pot.length (no repeats
 * until the pot cycles).
 */

import { getAllWordCards } from "@/lib/mock-data";
import { WOTD_PAD } from "@/lib/wotd-pad";

export interface WotdEntry {
  /** Word Card id when the entry came from a card. */
  wordCardId?: string;
  lemma: string;
  gloss: string;
  exampleEs: string;
  exampleEn: string;
}

/** Fixed epoch (Chicago) for dayIndex — day 0 = 2024-01-01. */
const EPOCH = "2024-01-01";

/** Stable shuffle seed so the cycle order never drifts across deploys. */
const SHUFFLE_SEED = 0x554e4f31; // "UNO1"

const TARGET_POT_SIZE = 500;

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  const rand = mulberry32(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** YYYY-MM-DD in America/Chicago. */
export function chicagoDateString(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Whole calendar days since EPOCH in America/Chicago. */
export function chicagoDayIndex(date: Date = new Date()): number {
  const today = chicagoDateString(date);
  const [y, m, d] = today.split("-").map(Number);
  const [ey, em, ed] = EPOCH.split("-").map(Number);
  const utcToday = Date.UTC(y, m - 1, d);
  const utcEpoch = Date.UTC(ey, em - 1, ed);
  return Math.floor((utcToday - utcEpoch) / 86_400_000);
}

function normalizeLemma(lemma: string): string {
  return lemma
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

let cachedPot: WotdEntry[] | null = null;

/** Build once: Word Cards first, pad to ~500 unique lemmas, then seed-shuffle. */
export function getWotdPot(): WotdEntry[] {
  if (cachedPot) return cachedPot;

  const seen = new Set<string>();
  const entries: WotdEntry[] = [];

  for (const card of getAllWordCards()) {
    const key = normalizeLemma(card.lemma);
    if (!key || seen.has(key)) continue;
    const ex = card.examples[0];
    if (!ex?.es || !ex?.en) continue;
    seen.add(key);
    entries.push({
      wordCardId: card.id,
      lemma: card.lemma,
      gloss: card.gloss,
      exampleEs: ex.es,
      exampleEn: ex.en,
    });
  }

  for (const pad of WOTD_PAD) {
    if (entries.length >= TARGET_POT_SIZE) break;
    const key = normalizeLemma(pad.lemma);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    entries.push({
      lemma: pad.lemma,
      gloss: pad.gloss,
      exampleEs: pad.exampleEs,
      exampleEn: pad.exampleEn,
    });
  }

  cachedPot = seededShuffle(entries, SHUFFLE_SEED);
  return cachedPot;
}

export function getWordOfTheDay(date: Date = new Date()): {
  entry: WotdEntry;
  date: string;
  dayIndex: number;
  potSize: number;
  potIndex: number;
} {
  const pot = getWotdPot();
  const dayIndex = chicagoDayIndex(date);
  const potIndex = ((dayIndex % pot.length) + pot.length) % pot.length;
  return {
    entry: pot[potIndex],
    date: chicagoDateString(date),
    dayIndex,
    potSize: pot.length,
    potIndex,
  };
}
