import { LESSONS, UNITS } from "./mock-data";
import type { DemoUser, StartingLevel, Unit } from "./types";

export const UNIT_1_ID = "unit-1";
export const UNIT_2_ID = "unit-2";
export const UNIT_3_ID = "unit-3";

export function unit1LessonIds(): string[] {
  return UNITS.find((u) => u.id === UNIT_1_ID)?.lessonIds ?? [];
}

export function unit2LessonIds(): string[] {
  return UNITS.find((u) => u.id === UNIT_2_ID)?.lessonIds ?? [];
}

export function unit3LessonIds(): string[] {
  return UNITS.find((u) => u.id === UNIT_3_ID)?.lessonIds ?? [];
}

/** Default recommended unit after onboarding by self-claimed level. */
export function recommendedUnitForLevel(level: StartingLevel): string {
  if (level === "absolute_beginner") return UNIT_1_ID;
  return UNIT_2_ID;
}

/** Lessons auto-marked complete when stronger learners skip Unit 1. */
export function skippedLessonsForLevel(level: StartingLevel): string[] {
  if (level === "conversational_basics") return unit1LessonIds();
  return [];
}

export function skippedUnitsForLevel(level: StartingLevel): string[] {
  if (level === "conversational_basics") return [UNIT_1_ID];
  return [];
}

export function isUnitSkipped(user: DemoUser, unitId: string): boolean {
  return (user.skippedUnitIds ?? []).includes(unitId);
}

/** Unit 1 is optional quick review for false beginners + stronger. */
export function isUnit1QuickReview(user: DemoUser): boolean {
  return (
    user.startingLevel === "some_words" ||
    user.startingLevel === "conversational_basics" ||
    isUnitSkipped(user, UNIT_1_ID)
  );
}

export function firstIncompleteInUnit(
  unitId: string,
  completed: string[]
): string | null {
  const unit = UNITS.find((u) => u.id === unitId);
  if (!unit) return null;
  for (const id of unit.lessonIds) {
    if (!completed.includes(id) && LESSONS[id]) return id;
  }
  return null;
}

/**
 * Home Continue / recommended lesson:
 * - absolute_beginner → first incomplete U1, then U2
 * - some_words → first incomplete U2 (U1 optional); fall back to U1 if U2 done
 * - conversational_basics → first incomplete U2 (U1 marked skipped/complete)
 */
export function getRecommendedLessonId(user: DemoUser): string {
  const completed = user.completedLessonIds;
  const preferred =
    user.recommendedUnitId || recommendedUnitForLevel(user.startingLevel);

  if (preferred === UNIT_2_ID || isUnitSkipped(user, UNIT_1_ID)) {
    const u2 = firstIncompleteInUnit(UNIT_2_ID, completed);
    if (u2) return u2;
    const u3 = firstIncompleteInUnit(UNIT_3_ID, completed);
    if (u3) return u3;
    const u1 = firstIncompleteInUnit(UNIT_1_ID, completed);
    if (u1) return u1;
  } else {
    const u1 = firstIncompleteInUnit(UNIT_1_ID, completed);
    if (u1) return u1;
    const u2 = firstIncompleteInUnit(UNIT_2_ID, completed);
    if (u2) return u2;
    const u3 = firstIncompleteInUnit(UNIT_3_ID, completed);
    if (u3) return u3;
  }

  // Everything done — last playable lesson
  const all = [...unit1LessonIds(), ...unit2LessonIds(), ...unit3LessonIds()];
  return all[all.length - 1] ?? "u1-l1";
}

export function getPlacementBanner(user: DemoUser): string | null {
  if (user.startingLevel === "some_words" && !isUnitSkipped(user, UNIT_1_ID)) {
    return "Based on your level, we recommend Unit 2 — Unit 1 is optional review.";
  }
  if (
    user.startingLevel === "conversational_basics" ||
    isUnitSkipped(user, UNIT_1_ID)
  ) {
    return "Unit 1 is optional review. Continue starts in Unit 2.";
  }
  return null;
}

/** Show skip-ahead when Unit 1 still has incomplete lessons. */
export function canSkipAhead(user: DemoUser): boolean {
  const remaining = unit1LessonIds().some(
    (id) => !user.completedLessonIds.includes(id)
  );
  return remaining && !isUnitSkipped(user, UNIT_1_ID);
}

export function unitBadgeLabel(user: DemoUser, unit: Unit): string | null {
  if (unit.id === UNIT_1_ID && isUnit1QuickReview(user)) {
    return "Quick review";
  }
  return null;
}
