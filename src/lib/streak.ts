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

export type DailyXpFields = Pick<StreakFields, "dailyXp" | "lastStreakDate">;

/** True if the last practice day still counts as an active streak. */
export function streakIsAlive(
  lastStreakDate: string | null | undefined,
  now = new Date()
): boolean {
  const last = lastStreakDate || "";
  if (!last) return false;
  const today = localDateKey(now);
  return last === today || last === shiftDateKey(today, -1);
}

/** Streak to show: stored value if last practice was today or yesterday, else 0. */
export function effectiveStreak(user: StreakFields, now = new Date()): number {
  if (!streakIsAlive(user.lastStreakDate, now)) return 0;
  return Math.max(0, user.streak);
}

/** Today's XP — 0 unless last practice was this local calendar day. */
export function effectiveDailyXp(user: DailyXpFields, now = new Date()): number {
  const last = user.lastStreakDate || "";
  if (!last || last !== localDateKey(now)) return 0;
  return Math.max(0, user.dailyXp);
}

/**
 * Persist midnight rollover: keep streak overnight (until a missed day),
 * zero today's XP on a new morning, and break the streak after a gap.
 */
export function applyStreakRollover<T extends StreakFields>(
  user: T,
  now = new Date()
): T {
  const today = localDateKey(now);
  const last = user.lastStreakDate || "";
  if (last === today) return user;
  if (last && last === shiftDateKey(today, -1)) {
    if (user.dailyXp === 0) return user;
    return { ...user, dailyXp: 0 };
  }
  if (user.streak === 0 && user.dailyXp === 0) return user;
  return { ...user, streak: 0, dailyXp: 0 };
}

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
    streak: last === yesterday ? Math.max(user.streak, 0) + 1 : 1,
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
    if (da > db)
      return applyStreakRollover({
        streak: a.streak,
        dailyXp: a.dailyXp,
        lastStreakDate: da,
      });
    if (db > da)
      return applyStreakRollover({
        streak: b.streak,
        dailyXp: b.dailyXp,
        lastStreakDate: db,
      });
    return applyStreakRollover({
      streak: Math.max(a.streak, b.streak),
      dailyXp: Math.max(a.dailyXp, b.dailyXp),
      lastStreakDate: da,
    });
  }
  if (da) return applyStreakRollover({ streak: a.streak, dailyXp: a.dailyXp, lastStreakDate: da });
  if (db) return applyStreakRollover({ streak: b.streak, dailyXp: b.dailyXp, lastStreakDate: db });
  return applyStreakRollover({
    streak: Math.max(a.streak, b.streak),
    dailyXp: Math.max(a.dailyXp, b.dailyXp),
    lastStreakDate: null,
  });
}
