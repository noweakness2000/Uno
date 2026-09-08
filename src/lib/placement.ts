import { LESSONS, UNITS } from "./mock-data";
import type { DemoUser, StartingLevel, Unit } from "./types";

export const UNIT_1_ID = "unit-1";
export const UNIT_2_ID = "unit-2";
export const UNIT_3_ID = "unit-3";
export const UNIT_4_ID = "unit-4";

export const BEGINNER_UNIT_IDS = [UNIT_1_ID, UNIT_2_ID, UNIT_3_ID];
export const FIRST_INTERMEDIATE_UNIT_ID = UNIT_4_ID;

export function unitLessonIds(unitId: string): string[] {
  return UNITS.find((u) => u.id === unitId)?.lessonIds ?? [];
}

export function unit1LessonIds(): string[] {
  return unitLessonIds(UNIT_1_ID);
}

export function unit2LessonIds(): string[] {
  return unitLessonIds(UNIT_2_ID);
}

export function unit3LessonIds(): string[] {
  return unitLessonIds(UNIT_3_ID);
}

export function beginnerLessonIds(): string[] {
  return BEGINNER_UNIT_IDS.flatMap((id) => unitLessonIds(id));
}

export function intermediateUnitIds(): string[] {
  return UNITS.filter((u) => u.track === "intermediate").map((u) => u.id);
}

/** Default recommended unit after onboarding by self-claimed level. */
export function recommendedUnitForLevel(level: StartingLevel): string {
  if (level === "absolute_beginner") return UNIT_1_ID;
  if (level === "conversational_basics") return FIRST_INTERMEDIATE_UNIT_ID;
  return UNIT_2_ID;
}

/** Lessons auto-marked complete when stronger learners skip early units. */
export function skippedLessonsForLevel(level: StartingLevel): string[] {
  if (level === "conversational_basics") return beginnerLessonIds();
  return [];
}

export function skippedUnitsForLevel(level: StartingLevel): string[] {
  if (level === "conversational_basics") return [...BEGINNER_UNIT_IDS];
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

/** Beginner units marked optional review for conversational_basics. */
export function isBeginnerOptionalReview(user: DemoUser, unitId: string): boolean {
  if (!BEGINNER_UNIT_IDS.includes(unitId)) return false;
  return (
    user.startingLevel === "conversational_basics" ||
    isUnitSkipped(user, unitId)
  );
}

export function isIntermediateUnit(unit: Unit): boolean {
  return unit.track === "intermediate" || unit.number >= 4;
}

/**
 * Unlock rules:
 * - conversational_basics + some_words: intermediate open
 * - absolute_beginner: intermediate locked until beginner units done,
 *   unless they jumped ahead (recommendedUnitId is intermediate / skipped beginners)
 */
export function isIntermediateUnlockedFor(user: DemoUser): boolean {
  if (
    user.startingLevel === "some_words" ||
    user.startingLevel === "conversational_basics"
  ) {
    return true;
  }
  // absolute_beginner: unlock after finishing Units 1–3, or after jumping ahead
  if (user.recommendedUnitId === FIRST_INTERMEDIATE_UNIT_ID) return true;
  return beginnerLessonIds().every((id) =>
    user.completedLessonIds.includes(id)
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

function firstIncompleteAlong(unitIds: string[], completed: string[]): string | null {
  for (const uid of unitIds) {
    const hit = firstIncompleteInUnit(uid, completed);
    if (hit) return hit;
  }
  return null;
}

/**
 * Home Continue / recommended lesson:
 * - absolute_beginner → U1→U2→U3→intermediate
 * - some_words → U2 first (U1 optional), then U3→intermediate; U1 fallback
 * - conversational_basics → first intermediate (beginner optional review)
 */
export function getRecommendedLessonId(user: DemoUser): string {
  const completed = user.completedLessonIds;
  const preferred =
    user.recommendedUnitId || recommendedUnitForLevel(user.startingLevel);
  const intermediateIds = intermediateUnitIds();
  const allIds = [...BEGINNER_UNIT_IDS, ...intermediateIds];

  if (preferred === FIRST_INTERMEDIATE_UNIT_ID || user.startingLevel === "conversational_basics") {
    const mid = firstIncompleteAlong(intermediateIds, completed);
    if (mid) return mid;
    const beg = firstIncompleteAlong(BEGINNER_UNIT_IDS, completed);
    if (beg) return beg;
  } else if (preferred === UNIT_2_ID || isUnitSkipped(user, UNIT_1_ID)) {
    const path = [UNIT_2_ID, UNIT_3_ID, ...intermediateIds, UNIT_1_ID];
    const hit = firstIncompleteAlong(path, completed);
    if (hit) return hit;
  } else {
    const hit = firstIncompleteAlong(allIds, completed);
    if (hit) return hit;
  }

  const allLessons = allIds.flatMap((id) => unitLessonIds(id));
  return allLessons[allLessons.length - 1] ?? "u1-l1";
}

export function getPlacementBanner(user: DemoUser): string | null {
  if (user.startingLevel === "conversational_basics") {
    return "Intermediate track unlocked — Units 1–3 are optional review. Continue starts at Unit 4.";
  }
  if (user.startingLevel === "some_words" && !isUnitSkipped(user, UNIT_1_ID)) {
    return "Based on your level, we recommend Unit 2 — Unit 1 is optional review. Intermediate (Unit 4+) is unlocked when you're ready.";
  }
  if (isUnitSkipped(user, UNIT_1_ID)) {
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

/** Absolute beginners can jump to Intermediate if ready. */
export function canJumpToIntermediate(user: DemoUser): boolean {
  return (
    user.startingLevel === "absolute_beginner" &&
    user.recommendedUnitId !== FIRST_INTERMEDIATE_UNIT_ID &&
    !beginnerLessonIds().every((id) => user.completedLessonIds.includes(id))
  );
}

export function unitBadgeLabel(user: DemoUser, unit: Unit): string | null {
  if (isIntermediateUnit(unit)) {
    if (!isIntermediateUnlockedFor(user) && user.startingLevel === "absolute_beginner") {
      return "Intermediate — jump if ready";
    }
    return "Intermediate";
  }
  if (unit.id === UNIT_1_ID && isUnit1QuickReview(user)) {
    return "Quick review";
  }
  if (isBeginnerOptionalReview(user, unit.id)) {
    return "Optional review";
  }
  if (unit.track === "beginner" || unit.number <= 3) {
    return "Beginner";
  }
  return null;
}
