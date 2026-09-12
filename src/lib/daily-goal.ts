/**
 * Daily XP goal maths — shared by the home streak panel and the post-lesson
 * summary so the same numbers can never drift apart between screens.
 *
 * Motivational only: the goal never gates a lesson.
 */
import type { DemoUser } from "./types";
import { effectiveDailyXp } from "./streak";

/** XP + goal + last practice day so "today" resets after midnight. */
type DailyGoalFields = Pick<DemoUser, "dailyXp" | "dailyGoal" | "lastStreakDate">;

/** Percent of today's XP goal reached, clamped to 0–100. */
export function dailyGoalPercent(user: DailyGoalFields): number {
  return Math.min(
    100,
    Math.round((effectiveDailyXp(user) / Math.max(user.dailyGoal, 1)) * 100)
  );
}

/** True once today's XP goal is reached. */
export function isDailyGoalMet(user: DailyGoalFields): boolean {
  return effectiveDailyXp(user) >= user.dailyGoal;
}

/** XP still needed today — never negative once the goal is passed. */
export function xpToDailyGoal(user: DailyGoalFields): number {
  return Math.max(0, user.dailyGoal - effectiveDailyXp(user));
}
