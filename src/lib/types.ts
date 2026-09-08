export type PartOfSpeech =
  | "interjection"
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "phrase"
  | "pronoun"
  | "preposition";

export type Gender = "m" | "f" | "mf" | "n/a";

export type CEFR = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

/** Self-claimed placement — true placement test comes later. */
export type StartingLevel =
  | "absolute_beginner"
  | "some_words"
  | "conversational_basics";

export type UnitTrack = "beginner" | "intermediate";

export interface ConjugationGroup {
  label: string;
  forms: { person: string; form: string }[];
}

export interface ExamplePair {
  es: string;
  en: string;
}

export interface WordCard {
  id: string;
  lemma: string;
  pos: PartOfSpeech;
  gender: Gender;
  gloss: string;
  /** 1–3 sentence plain-English meaning / nuance (Rosetta-style teach). */
  meaningSummary: string;
  /** Present (etc.) tables for verbs; omit for fixed phrases. */
  conjugations?: ConjugationGroup[];
  /** Spanish example + English translation (prefer 2+). */
  examples: ExamplePair[];
  useWhen: string;
  dontUseWhen: string;
  contrast?: string;
  formality: "neutral" | "formal" | "informal";
  region?: string;
  cefr: CEFR;
}

export type ExerciseType =
  | "teach"
  | "select"
  | "tap-chips"
  | "translate"
  | "listening-choose"
  | "situational-choose"
  | "match-pairs"
  | "fill-blank";

export interface ExerciseBase {
  id: string;
  type: ExerciseType;
  prompt: string;
  explanation: string;
  wordCardIds?: string[];
  xp: number;
}

/** Inline word-card teach moment before practice. 0 XP, no hearts. */
export interface TeachExercise extends ExerciseBase {
  type: "teach";
  wordCardId: string;
}

export interface SelectExercise extends ExerciseBase {
  type: "select";
  options: string[];
  correctIndex: number;
}

export interface TapChipsExercise extends ExerciseBase {
  type: "tap-chips";
  chips: string[];
  correctOrder: string[];
}

export interface TranslateExercise extends ExerciseBase {
  type: "translate";
  acceptedAnswers: string[];
  hint?: string;
}

export interface ListeningChooseExercise extends ExerciseBase {
  type: "listening-choose";
  audioText: string;
  /** Prefetched Neural2 LatAm practice MP3 under /audio/es-mx/ */
  audioSrc?: string;
  options: string[];
  correctIndex: number;
}

export interface SituationalChooseExercise extends ExerciseBase {
  type: "situational-choose";
  situation: string;
  options: string[];
  correctIndex: number;
}

/** Match Spanish ↔ English pairs (order shuffled in UI). */
export interface MatchPairsExercise extends ExerciseBase {
  type: "match-pairs";
  pairs: { left: string; right: string }[];
}

/** Type the missing Spanish word/phrase in a sentence. */
export interface FillBlankExercise extends ExerciseBase {
  type: "fill-blank";
  /** Sentence with ___ for the blank. */
  template: string;
  acceptedAnswers: string[];
  hint?: string;
}

export type Exercise =
  | TeachExercise
  | SelectExercise
  | TapChipsExercise
  | TranslateExercise
  | ListeningChooseExercise
  | SituationalChooseExercise
  | MatchPairsExercise
  | FillBlankExercise;

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  description: string;
  exercises: Exercise[];
  xpReward: number;
}

export interface Unit {
  id: string;
  number: number;
  title: string;
  description: string;
  lessonIds: string[];
  unlocked: boolean;
  /** Beginner path (1–3) vs Intermediate (4+). */
  track?: UnitTrack;
}

export interface DemoUser {
  id: string;
  name: string;
  xp: number;
  streak: number;
  dailyGoal: number;
  dailyXp: number;
  completedLessonIds: string[];
  weakWordIds: string[];
  onboardingComplete: boolean;
  startingLevel: StartingLevel;
  /** Units treated as optional review / skipped for path progress. */
  skippedUnitIds: string[];
  /** Preferred unit for Continue / recommended path. */
  recommendedUnitId: string;
}
