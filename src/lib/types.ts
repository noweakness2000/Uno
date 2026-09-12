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

/** Persisted SM-2-ish state for one Word Card. */
export interface SrsCardState {
  intervalDays: number;
  ease: number;
  dueAt: string;
  reps: number;
}

export type SrsCards = Record<string, SrsCardState>;

export type ExerciseType =
  | "teach"
  | "select"
  | "tap-chips"
  | "translate"
  | "listening-choose"
  | "situational-choose"
  | "match-pairs"
  | "fill-blank"
  | "cloze"
  | "story-listen"
  | "dictation"
  | "conjugate"
  | "dialogue";

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
  /** Prefetched Neural2 practice MP3 under /audio/es-mx/ */
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
  /** Full English sentence shown above the Spanish blank (preferred cue). */
  englishPrompt?: string;
  /** Optional Spanish listen-target (Neural2) as alternate/additional cue. */
  audioText?: string;
  audioSrc?: string;
}

/** Cloze from story: blank a content word in a story sentence. */
export interface ClozeExercise extends ExerciseBase {
  type: "cloze";
  /** Sentence with ___ for the blank. */
  template: string;
  acceptedAnswers: string[];
  hint?: string;
  /** Full English sentence shown above the Spanish blank. */
  englishPrompt?: string;
  /** Full sentence for optional Neural2 playback. */
  audioText?: string;
  audioSrc?: string;
  /** Soft chrome, e.g. "From the story". */
  storyLabel?: string;
}

/** Follow-along story listening with comprehension questions (no STT). */
export interface StoryListenExercise extends ExerciseBase {
  type: "story-listen";
  title?: string;
  /** Ordered Spanish lines shown while listening (Neural2 voice per line). */
  lines: { text: string; en?: string; voice?: "f" | "m" | "c" }[];
  /** Optional full-story audio; else play line-by-line. */
  audioSrc?: string;
  questions: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
  }[];
}

/** Play Neural2 line → type what you heard (near-miss soft retry). */
export interface DictationExercise extends ExerciseBase {
  type: "dictation";
  audioText: string;
  audioSrc?: string;
  acceptedAnswers: string[];
  hint?: string;
}

/** Pronoun + infinitive + tense → type the conjugated form. */
export interface ConjugateExercise extends ExerciseBase {
  type: "conjugate";
  infinitive: string;
  pronoun: string;
  tense: string;
  acceptedAnswers: string[];
  hint?: string;
}

/** One learner choice inside a dialogue turn, with the NPC's reply to it. */
export interface DialogueOption {
  /** What the learner says, in Spanish. */
  es: string;
  en?: string;
  /** A natural, situation-appropriate reply. Wrong picks still continue. */
  correct: boolean;
  /** How the NPC answers this specific choice. */
  reply: string;
  replyEn?: string;
  /** Baked clip for the reply; omitted when no clip exists. */
  replyAudioSrc?: string;
  /** Shown after a wrong pick — short, never scolding. */
  explanation?: string;
}

/** NPC line plus the replies the learner can choose from. */
export interface DialogueTurn {
  /** The NPC's opening line for this turn, in Spanish. */
  npc: string;
  npcEn?: string;
  /** Baked clip under /audio/es-mx/; omitted when no clip exists. */
  audioSrc?: string;
  options: DialogueOption[];
}

/**
 * Scripted multi-turn conversation. Fully local: no AI, no microphone.
 *
 * Graded like situational-choose — the learner picks a valid reply rather
 * than typing. A wrong pick still gets an in-character answer, marks the
 * words weak and moves on; the conversation never dead-ends.
 */
export interface DialogueExercise extends ExerciseBase {
  type: "dialogue";
  /** Sets the scene in English, e.g. "You're ordering at a cafe". */
  scenario: string;
  /** What counts as success, e.g. "Order a coffee and ask for the bill". */
  goal?: string;
  /** Who the learner is talking to, e.g. "Mesero". */
  npcName?: string;
  turns: DialogueTurn[];
}

export type Exercise =
  | TeachExercise
  | SelectExercise
  | TapChipsExercise
  | TranslateExercise
  | ListeningChooseExercise
  | SituationalChooseExercise
  | MatchPairsExercise
  | FillBlankExercise
  | ClozeExercise
  | StoryListenExercise
  | DictationExercise
  | ConjugateExercise
  | DialogueExercise;

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
  /** Local calendar day (YYYY-MM-DD) of the last lesson that counted for streak. */
  lastStreakDate?: string | null;
  completedLessonIds: string[];
  weakWordIds: string[];
  /** Lightweight SRS schedule keyed by wordCardId. */
  srsCards: SrsCards;
  onboardingComplete: boolean;
  startingLevel: StartingLevel;
  /** Units treated as optional review / skipped for path progress. */
  skippedUnitIds: string[];
  /** Preferred unit for Continue / recommended path. */
  recommendedUnitId: string;
}
