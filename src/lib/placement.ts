import { LESSONS, UNITS } from "./mock-data";
import type { DemoUser, StartingLevel, Unit } from "./types";

export const UNIT_1_ID = "unit-1";
export const UNIT_2_ID = "unit-2";
export const UNIT_3_ID = "unit-3";
export const UNIT_4_ID = "unit-4";
export const UNIT_7_ID = "unit-7";

export const BEGINNER_UNIT_IDS = [UNIT_1_ID, UNIT_2_ID, UNIT_3_ID];
export const FIRST_INTERMEDIATE_UNIT_ID = UNIT_4_ID;
/** Units 4–6 are present tense; the preterite starts here. */
export const PAST_TENSE_UNIT_ID = UNIT_7_ID;

/** Where Continue starts for each self-claimed level. */
export const LEVEL_START_UNIT: Record<StartingLevel, string> = {
  absolute_beginner: UNIT_1_ID,
  some_words: UNIT_2_ID,
  conversational_basics: FIRST_INTERMEDIATE_UNIT_ID,
  past_tense: PAST_TENSE_UNIT_ID,
};

/** Levels that land inside the intermediate track. */
export function levelStartsIntermediate(level: StartingLevel): boolean {
  return level === "conversational_basics" || level === "past_tense";
}

/** Every unit id in path order, beginner first. */
export function allUnitIdsInOrder(): string[] {
  return UNITS.map((u) => u.id);
}

/** Unit ids that come before `unitId` on the path. */
export function unitIdsBefore(unitId: string): string[] {
  const ids = allUnitIdsInOrder();
  const idx = ids.indexOf(unitId);
  return idx <= 0 ? [] : ids.slice(0, idx);
}

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
  return LEVEL_START_UNIT[level] ?? UNIT_1_ID;
}

/**
 * Units treated as skipped (optional review) for a level. `some_words` keeps
 * Unit 1 as a quick review rather than a skip, so only intermediate starts
 * skip anything.
 */
export function skippedUnitsForLevel(level: StartingLevel): string[] {
  if (!levelStartsIntermediate(level)) return [];
  return unitIdsBefore(recommendedUnitForLevel(level));
}

/** Lessons auto-marked complete when stronger learners skip early units. */
export function skippedLessonsForLevel(level: StartingLevel): string[] {
  return skippedUnitsForLevel(level).flatMap((id) => unitLessonIds(id));
}

export function isUnitSkipped(user: DemoUser, unitId: string): boolean {
  return (user.skippedUnitIds ?? []).includes(unitId);
}

/** Unit 1 is optional quick review for false beginners + stronger. */
export function isUnit1QuickReview(user: DemoUser): boolean {
  return (
    user.startingLevel === "some_words" ||
    levelStartsIntermediate(user.startingLevel) ||
    isUnitSkipped(user, UNIT_1_ID)
  );
}

/** Beginner units marked optional review for intermediate starts. */
export function isBeginnerOptionalReview(user: DemoUser, unitId: string): boolean {
  if (!BEGINNER_UNIT_IDS.includes(unitId)) return false;
  return (
    levelStartsIntermediate(user.startingLevel) ||
    isUnitSkipped(user, unitId)
  );
}

/**
 * Any unit the learner has been placed past — beginner units for an
 * intermediate start, plus Units 4–6 for `past_tense`.
 */
export function isOptionalReviewUnit(user: DemoUser, unitId: string): boolean {
  return isBeginnerOptionalReview(user, unitId) || isUnitSkipped(user, unitId);
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
    levelStartsIntermediate(user.startingLevel)
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
 * - conversational_basics / past_tense → their start unit onward, then any
 *   earlier intermediate unit, then beginner (all optional review)
 */
export function getRecommendedLessonId(user: DemoUser): string {
  const completed = user.completedLessonIds;
  const preferred =
    user.recommendedUnitId || recommendedUnitForLevel(user.startingLevel);
  const intermediateIds = intermediateUnitIds();
  const allIds = [...BEGINNER_UNIT_IDS, ...intermediateIds];

  if (
    intermediateIds.includes(preferred) ||
    levelStartsIntermediate(user.startingLevel)
  ) {
    const startIdx = Math.max(0, intermediateIds.indexOf(preferred));
    const path = [
      ...intermediateIds.slice(startIdx),
      ...intermediateIds.slice(0, startIdx),
      ...BEGINNER_UNIT_IDS,
    ];
    const hit = firstIncompleteAlong(path, completed);
    if (hit) return hit;
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
  if (user.startingLevel === "past_tense") {
    return "Intermediate track unlocked — Units 1–6 are optional review. Continue starts at Unit 7.";
  }
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
    if (isUnitSkipped(user, unit.id)) {
      return "Optional review";
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
