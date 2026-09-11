/** Local-calendar streak helpers. Dates are YYYY-MM-DD in the device timezone. */

export function localDateKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function shiftDateKey(key: string, days: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return localDateKey(dt);
}

export type StreakFields = {
  streak: number;
  dailyXp: number;
  lastStreakDate?: string | null;
};

/** Apply a completed lesson to streak / today's XP. */
export function applyLessonDay(
  user: StreakFields,
  earnedXp: number,
  now = new Date()
): StreakFields {
  const today = localDateKey(now);
  const last = user.lastStreakDate || "";
  if (last === today) {
    return {
      streak: Math.max(user.streak, 1),
      dailyXp: user.dailyXp + earnedXp,
      lastStreakDate: today,
    };
  }
  const yesterday = shiftDateKey(today, -1);
  return {
    streak: last === yesterday ? user.streak + 1 : 1,
    dailyXp: earnedXp,
    lastStreakDate: today,
  };
}

/**
 * Pick streak/dailyXp from the newer calendar day.
 * Same day: take the higher counters. Never revive a broken streak via max().
 */
export function mergeStreakFields(a: StreakFields, b: StreakFields): StreakFields {
  const da = a.lastStreakDate || "";
  const db = b.lastStreakDate || "";
  if (da && db) {
    if (da > db) return { streak: a.streak, dailyXp: a.dailyXp, lastStreakDate: da };
    if (db > da) return { streak: b.streak, dailyXp: b.dailyXp, lastStreakDate: db };
    return {
      streak: Math.max(a.streak, b.streak),
      dailyXp: Math.max(a.dailyXp, b.dailyXp),
      lastStreakDate: da,
    };
  }
  if (da) return { streak: a.streak, dailyXp: a.dailyXp, lastStreakDate: da };
  if (db) return { streak: b.streak, dailyXp: b.dailyXp, lastStreakDate: db };
  return {
    streak: Math.max(a.streak, b.streak),
    dailyXp: Math.max(a.dailyXp, b.dailyXp),
    lastStreakDate: null,
  };
}
