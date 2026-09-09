/**
 * Unit 9 — Opinions, imperfect intro & deeper travel (~12 lessons). Early B1 Spanish.
 * Merged via intermediate.ts into mock-data.
 */
import type { Lesson, WordCard } from "../types";
import { audioSrcFor, voiceForIndex, type AudioVoice } from "../audio";

const LATAM_IMPERFECT = (forms: [string, string, string, string, string]) => [
  {
    label: "Imperfect",
    forms: [
      { person: "yo", form: forms[0] },
      { person: "tú", form: forms[1] },
      { person: "él/ella/usted", form: forms[2] },
      { person: "nosotros/as", form: forms[3] },
      { person: "ustedes", form: forms[4] },
    ],
  },
];

function teach(
  id: string,
  wordCardId: string
): import("../types").TeachExercise {
  return {
    id,
    type: "teach",
    prompt: "New word — learn it, then practice.",
    explanation: "",
    wordCardId,
    wordCardIds: [wordCardId],
    xp: 0,
  };
}

let listenVoiceIndex = 900;

function listen(
  id: string,
  audioText: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  wordCardIds: string[],
  xp = 3
): import("../types").ListeningChooseExercise {
  const voice = voiceForIndex(listenVoiceIndex);
  listenVoiceIndex += 1;
  return {
    id,
    type: "listening-choose",
    prompt: "What did you hear?",
    audioText,
    audioSrc: audioSrcFor(audioText, voice),
    options,
    correctIndex,
    explanation,
    wordCardIds,
    xp,
  };
}

function cloze(
  id: string,
  template: string,
  acceptedAnswers: string[],
  explanation: string,
  wordCardIds: string[],
  opts: {
    hint?: string;
    audioText: string;
    voice?: AudioVoice;
    storyLabel?: string;
    xp?: number;
  }
): import("../types").ClozeExercise {
  const voice = opts.voice ?? "f";
  return {
    id,
    type: "cloze",
    prompt: "Fill the blank from the story",
    template,
    acceptedAnswers,
    hint: opts.hint,
    explanation,
    wordCardIds,
    audioText: opts.audioText,
    audioSrc: audioSrcFor(opts.audioText, voice),
    storyLabel: opts.storyLabel ?? "From the story",
    xp: opts.xp ?? 3,
  };
}

function storyListen(
  id: string,
  title: string,
  lines: { text: string; en?: string; voice?: AudioVoice }[],
  questions: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
  }[],
  wordCardIds: string[],
  explanation = "Story comprehension — replay anytime.",
  xp = 10
): import("../types").StoryListenExercise {
  const withVoices = lines.map((line, i) => ({
    text: line.text,
    en: line.en,
    voice: line.voice ?? voiceForIndex(i),
  }));
  return {
    id,
    type: "story-listen",
    prompt: "Listen to the story, then answer",
    title,
    lines: withVoices,
    questions,
    explanation,
    wordCardIds,
    xp,
  };
}

function dictation(
  id: string,
  audioText: string,
  acceptedAnswers: string[],
  explanation: string,
  wordCardIds: string[],
  opts: { hint?: string; voice?: AudioVoice; xp?: number } = {}
): import("../types").DictationExercise {
  const voice = opts.voice ?? "f";
  return {
    id,
    type: "dictation",
    prompt: "Type what you hear",
    audioText,
    audioSrc: audioSrcFor(audioText, voice),
    acceptedAnswers,
    hint: opts.hint,
    explanation,
    wordCardIds,
    xp: opts.xp ?? 4,
  };
}

function conjugate(
  id: string,
  infinitive: string,
  pronoun: string,
  tense: string,
  acceptedAnswers: string[],
  explanation: string,
  wordCardIds: string[],
  opts: { hint?: string; xp?: number } = {}
): import("../types").ConjugateExercise {
  return {
    id,
    type: "conjugate",
    prompt: `Conjugate: ${pronoun} + ${infinitive} (${tense})`,
    infinitive,
    pronoun,
    tense,
    acceptedAnswers,
    hint: opts.hint,
    explanation,
    wordCardIds,
    xp: opts.xp ?? 3,
  };
}


export const UNIT9_WORD_CARDS: Record<string, WordCard> = {
  "creo-que": {
    id: "creo-que",
    lemma: "creo que",
    pos: "phrase",
    gender: "n/a",
    gloss: "I think that… / I believe…",
    meaningSummary:
      "Everyday opinion opener: Creo que es una buena idea / Creo que el hotel está cerca. Soften with no creo que… when you disagree lightly.",
    examples: [
      { es: "Creo que el vuelo sale temprano.", en: "I think the flight leaves early." },
      { es: "Creo que es una buena idea.", en: "I think it's a good idea." },
    ],
    useWhen: "Sharing what you think or believe.",
    dontUseWhen: "For soft agreement with a plan, me parece bien is very natural too.",
    contrast: "pienso que… / me parece…",
    formality: "neutral",
    cefr: "A2",
  },
  "pienso-que": {
    id: "pienso-que",
    lemma: "pienso que",
    pos: "phrase",
    gender: "n/a",
    gloss: "I think that…",
    meaningSummary:
      "Close cousin of creo que. Pienso que… often sounds a bit more reflective: Pienso que debemos reservar hoy.",
    examples: [
      { es: "Pienso que el hotel es bueno.", en: "I think the hotel is good." },
      { es: "¿Qué piensas tú?", en: "What do you think?" },
    ],
    useWhen: "Giving an opinion or asking someone else's.",
    dontUseWhen: "n/a",
    contrast: "creo que… / me parece…",
    formality: "neutral",
    cefr: "A2",
  },
  "de-acuerdo": {
    id: "de-acuerdo",
    lemma: "de acuerdo / estoy de acuerdo",
    pos: "phrase",
    gender: "n/a",
    gloss: "agreed / I agree",
    meaningSummary:
      "Clear agreement: De acuerdo / Estoy de acuerdo. Pair with contigo: Estoy de acuerdo contigo.",
    examples: [
      { es: "Estoy de acuerdo contigo.", en: "I agree with you." },
      { es: "De acuerdo. Vamos al aeropuerto.", en: "Agreed. Let's go to the airport." },
    ],
    useWhen: "Agreeing with someone's idea or plan.",
    dontUseWhen: "To disagree, use No estoy de acuerdo.",
    contrast: "no estoy de acuerdo / me parece bien",
    formality: "neutral",
    cefr: "A2",
  },
  "no-estoy-de-acuerdo": {
    id: "no-estoy-de-acuerdo",
    lemma: "no estoy de acuerdo",
    pos: "phrase",
    gender: "n/a",
    gloss: "I disagree",
    meaningSummary:
      "Polite but clear disagreement. Soften with creo que… after: No estoy de acuerdo. Creo que es tarde.",
    examples: [
      { es: "No estoy de acuerdo.", en: "I disagree." },
      { es: "No estoy de acuerdo — es muy caro.", en: "I disagree — it's too expensive." },
    ],
    useWhen: "Disagreeing without sounding rude.",
    dontUseWhen: "For a soft maybe, me parece… can feel gentler.",
    contrast: "estoy de acuerdo / me parece",
    formality: "neutral",
    cefr: "A2",
  },
  "en-mi-opinion": {
    id: "en-mi-opinion",
    lemma: "en mi opinión",
    pos: "phrase",
    gender: "n/a",
    gloss: "in my opinion",
    meaningSummary:
      "Frames a personal view: En mi opinión, este restaurante es mejor. A bit more deliberate than creo que.",
    examples: [
      { es: "En mi opinión, debemos salir temprano.", en: "In my opinion, we should leave early." },
      { es: "En mi opinión, el centro es más interesante.", en: "In my opinion, downtown is more interesting." },
    ],
    useWhen: "Marking that something is your view.",
    dontUseWhen: "n/a",
    contrast: "creo que… / para mí…",
    formality: "neutral",
    cefr: "B1",
  },
  "para-mi": {
    id: "para-mi",
    lemma: "para mí",
    pos: "phrase",
    gender: "n/a",
    gloss: "for me / to me",
    meaningSummary:
      "Personal take: Para mí, es fácil / Para mí, el hotel está lejos. Accent on mí matters in writing.",
    examples: [
      { es: "Para mí, es una buena idea.", en: "For me, it's a good idea." },
      { es: "Para mí, el vuelo es largo.", en: "To me, the flight is long." },
    ],
    useWhen: "Framing a personal judgment.",
    dontUseWhen: "Don't confuse with por mí (on my behalf).",
    contrast: "en mi opinión / creo que",
    formality: "neutral",
    cefr: "A2",
  },
  "que-opinas": {
    id: "que-opinas",
    lemma: "¿qué opinas?",
    pos: "phrase",
    gender: "n/a",
    gloss: "what do you think?",
    meaningSummary:
      "Invite someone's opinion (tú): ¿Qué opinas del hotel? / ¿Qué opinas tú?",
    examples: [
      { es: "¿Qué opinas del restaurante?", en: "What do you think of the restaurant?" },
      { es: "¿Qué opinas? ¿Reservamos hoy?", en: "What do you think? Should we book today?" },
    ],
    useWhen: "Asking a friend for their view.",
    dontUseWhen: "With usted, prefer ¿Qué opina usted?",
    contrast: "¿qué piensas? / ¿te parece?",
    formality: "informal",
    cefr: "A2",
  },
  "ser-imperfect": {
    id: "ser-imperfect",
    lemma: "ser (imperfect)",
    pos: "verb",
    gender: "n/a",
    gloss: "to be — was / used to be (description)",
    meaningSummary:
      "Imperfect of ser describes background and identity in the past: Era amable / Éramos estudiantes. Not a single finished event.",
    conjugations: LATAM_IMPERFECT(["era", "eras", "era", "éramos", "eran"]),
    examples: [
      { es: "Cuando era niño, vivía cerca del parque.", en: "When I was a kid, I lived near the park." },
      { es: "El hotel era pequeño pero bonito.", en: "The hotel was small but nice." },
    ],
    useWhen: "Describing how things/people were, or habitual identity in the past.",
    dontUseWhen: "For a finished one-time event (fui / fue) use preterite.",
    contrast: "fui (preterite) vs era (imperfect)",
    formality: "neutral",
    cefr: "B1",
  },
  "tener-imperfect": {
    id: "tener-imperfect",
    lemma: "tener (imperfect)",
    pos: "verb",
    gender: "n/a",
    gloss: "to have — had / used to have",
    meaningSummary:
      "Imperfect of tener for ongoing possession or age in the past: Tenía un carro / Tenía diez años.",
    conjugations: LATAM_IMPERFECT(["tenía", "tenías", "tenía", "teníamos", "tenían"]),
    examples: [
      { es: "Antes tenía un departamento pequeño.", en: "I used to have a small apartment." },
      { es: "¿Tenías pasaporte?", en: "Did you have a passport? (ongoing / background)" },
    ],
    useWhen: "Past possession, age, or ongoing states.",
    dontUseWhen: "For a one-time got/received, preterite (tuve) is often better.",
    contrast: "tuve (preterite) vs tenía (imperfect)",
    formality: "neutral",
    cefr: "B1",
  },
  "ir-imperfect": {
    id: "ir-imperfect",
    lemma: "ir (imperfect)",
    pos: "verb",
    gender: "n/a",
    gloss: "to go — was going / used to go",
    meaningSummary:
      "Imperfect of ir for habits and background movement: Iba al trabajo en metro / Íbamos al centro los sábados.",
    conjugations: LATAM_IMPERFECT(["iba", "ibas", "iba", "íbamos", "iban"]),
    examples: [
      { es: "Antes iba al aeropuerto en taxi.", en: "I used to go to the airport by taxi." },
      { es: "Íbamos al cine cada viernes.", en: "We used to go to the movies every Friday." },
    ],
    useWhen: "Habitual going or background motion in the past.",
    dontUseWhen: "For a single trip that finished, use fui (preterite).",
    contrast: "fui (preterite) vs iba (imperfect)",
    formality: "neutral",
    cefr: "B1",
  },
  "hablar-imperfect": {
    id: "hablar-imperfect",
    lemma: "hablar (imperfect)",
    pos: "verb",
    gender: "n/a",
    gloss: "to speak — was speaking / used to speak",
    meaningSummary:
      "Regular -ar imperfect: hablaba, hablabas, hablaba, hablábamos, hablaban. Great for habits: Hablaba español en casa.",
    conjugations: LATAM_IMPERFECT(["hablaba", "hablabas", "hablaba", "hablábamos", "hablaban"]),
    examples: [
      { es: "Cuando era niño, hablaba con mis abuelos todos los días.", en: "When I was a kid, I used to talk with my grandparents every day." },
      { es: "Ellos hablaban muy rápido.", en: "They were speaking / used to speak very fast." },
    ],
    useWhen: "Habitual speaking or background description.",
    dontUseWhen: "For a finished conversation, preterite may fit better.",
    formality: "neutral",
    cefr: "B1",
  },
  "comer-imperfect": {
    id: "comer-imperfect",
    lemma: "comer (imperfect)",
    pos: "verb",
    gender: "n/a",
    gloss: "to eat — was eating / used to eat",
    meaningSummary:
      "Regular -er imperfect: comía, comías, comía, comíamos, comían. Habits and scenes: Comíamos juntos los domingos.",
    conjugations: LATAM_IMPERFECT(["comía", "comías", "comía", "comíamos", "comían"]),
    examples: [
      { es: "Antes comía mucho jugo con el desayuno.", en: "I used to drink a lot of juice with breakfast." },
      { es: "Comíamos en ese restaurante siempre.", en: "We always used to eat at that restaurant." },
    ],
    useWhen: "Habitual eating or scene-setting in the past.",
    dontUseWhen: "For a finished meal yesterday, comí (preterite) is typical.",
    contrast: "comí (preterite) vs comía (imperfect)",
    formality: "neutral",
    cefr: "B1",
  },
  imperfecto: {
    id: "imperfecto",
    lemma: "el imperfecto",
    pos: "noun",
    gender: "m",
    gloss: "the imperfect (past tense)",
    meaningSummary:
      "Spanish past for habits and descriptions: used to… / was …ing / was (background). Contrast with preterite for finished one-time events.",
    examples: [
      { es: "El imperfecto describe hábitos: Yo iba al parque.", en: "The imperfect describes habits: I used to go to the park." },
      { es: "Era tarde y llovía.", en: "It was late and it was raining." },
    ],
    useWhen: "Talking about how the imperfect works.",
    dontUseWhen: "Don't use this label with learners as a quiz answer — use real verb forms.",
    contrast: "preterite (completed events)",
    formality: "neutral",
    cefr: "B1",
  },
  antes: {
    id: "antes",
    lemma: "antes",
    pos: "adverb",
    gender: "n/a",
    gloss: "before / used to (in the past)",
    meaningSummary:
      "Time anchor for former habits: Antes vivía aquí / Antes iba en metro. Also before an event: Antes del vuelo.",
    examples: [
      { es: "Antes tenía un carro viejo.", en: "I used to have an old car." },
      { es: "Llegamos antes del vuelo.", en: "We arrive before the flight." },
    ],
    useWhen: "Contrasting past habits with now, or sequencing before something.",
    dontUseWhen: "n/a",
    contrast: "ahora / después",
    formality: "neutral",
    cefr: "A2",
  },
  "cuando-era": {
    id: "cuando-era",
    lemma: "cuando era…",
    pos: "phrase",
    gender: "n/a",
    gloss: "when I/he/she was…",
    meaningSummary:
      "Classic imperfect frame: Cuando era niño… / Cuando era estudiante… Sets a past background for habits.",
    examples: [
      { es: "Cuando era niño, iba al parque.", en: "When I was a kid, I used to go to the park." },
      { es: "Cuando era estudiante, no tenía carro.", en: "When I was a student, I didn't have a car." },
    ],
    useWhen: "Opening a childhood or past-life description.",
    dontUseWhen: "For a finished one-time moment, when + preterite may fit better.",
    formality: "neutral",
    cefr: "B1",
  },
  aeropuerto: {
    id: "aeropuerto",
    lemma: "el aeropuerto",
    pos: "noun",
    gender: "m",
    gloss: "airport",
    meaningSummary:
      "Travel hub: ¿Cómo llego al aeropuerto? / El aeropuerto está lejos del centro.",
    examples: [
      { es: "¿Cómo llego al aeropuerto?", en: "How do I get to the airport?" },
      { es: "El aeropuerto está lejos.", en: "The airport is far." },
    ],
    useWhen: "Asking about or describing the airport.",
    dontUseWhen: "n/a",
    contrast: "estación / hotel",
    formality: "neutral",
    cefr: "A2",
  },
  vuelo: {
    id: "vuelo",
    lemma: "el vuelo",
    pos: "noun",
    gender: "m",
    gloss: "flight",
    meaningSummary:
      "Plane trip: Mi vuelo sale a las ocho / El vuelo está retrasado. Pair with aeropuerto.",
    examples: [
      { es: "Mi vuelo sale a las seis.", en: "My flight leaves at six." },
      { es: "¿Dónde está la puerta del vuelo?", en: "Where is the gate for the flight?" },
    ],
    useWhen: "Talking about a plane trip.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "A2",
  },
  pasaporte: {
    id: "pasaporte",
    lemma: "el pasaporte",
    pos: "noun",
    gender: "m",
    gloss: "passport",
    meaningSummary:
      "Travel document: ¿Tienes tu pasaporte? / Necesito mi pasaporte en el aeropuerto.",
    examples: [
      { es: "¿Tienes tu pasaporte?", en: "Do you have your passport?" },
      { es: "Olvidé el pasaporte en el hotel.", en: "I forgot the passport at the hotel." },
    ],
    useWhen: "Airport and border situations.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "A2",
  },
  equipaje: {
    id: "equipaje",
    lemma: "el equipaje",
    pos: "noun",
    gender: "m",
    gloss: "luggage / baggage",
    meaningSummary:
      "Bags for a trip: ¿Dónde está el equipaje? / Tengo mucho equipaje.",
    examples: [
      { es: "¿Dónde recojo el equipaje?", en: "Where do I pick up the luggage?" },
      { es: "Mi equipaje es negro.", en: "My luggage is black." },
    ],
    useWhen: "Airport baggage claim or packing talk.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "A2",
  },
  habitacion: {
    id: "habitacion",
    lemma: "la habitación",
    pos: "noun",
    gender: "f",
    gloss: "room (hotel)",
    meaningSummary:
      "Hotel room: Quiero una habitación / La habitación está en el segundo piso.",
    examples: [
      { es: "Quiero una habitación para dos.", en: "I want a room for two." },
      { es: "¿La habitación tiene Wi-Fi?", en: "Does the room have Wi-Fi?" },
    ],
    useWhen: "Checking in or describing lodging.",
    dontUseWhen: "For apartment rooms day-to-day, cuarto is also common.",
    contrast: "hotel / departamento",
    formality: "neutral",
    cefr: "A2",
  },
  reserva: {
    id: "reserva",
    lemma: "la reserva",
    pos: "noun",
    gender: "f",
    gloss: "reservation / booking",
    meaningSummary:
      "Booking for hotel or flight: Tengo una reserva / Quiero hacer una reserva.",
    examples: [
      { es: "Tengo una reserva a nombre de Ana.", en: "I have a reservation under Ana's name." },
      { es: "¿Puedo hacer una reserva?", en: "Can I make a reservation?" },
    ],
    useWhen: "Hotels, restaurants, or travel bookings.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "A2",
  },
  reservar: {
    id: "reservar",
    lemma: "reservar",
    pos: "verb",
    gender: "n/a",
    gloss: "to book / to reserve",
    meaningSummary:
      "Action of booking: Quiero reservar una habitación / Reservamos el vuelo ayer.",
    examples: [
      { es: "Quiero reservar una habitación.", en: "I want to book a room." },
      { es: "¿Reservamos el hotel hoy?", en: "Should we book the hotel today?" },
    ],
    useWhen: "Making lodging or travel bookings.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "A2",
  },
  "te-recomiendo": {
    id: "te-recomiendo",
    lemma: "te recomiendo",
    pos: "phrase",
    gender: "n/a",
    gloss: "I recommend (to you)",
    meaningSummary:
      "Friendly recommendation (tú): Te recomiendo este hotel / Te recomiendo llegar temprano.",
    examples: [
      { es: "Te recomiendo este restaurante.", en: "I recommend this restaurant." },
      { es: "Te recomiendo ir en metro.", en: "I recommend going by metro." },
    ],
    useWhen: "Giving travel or food advice to a friend.",
    dontUseWhen: "With usted, use le recomiendo…",
    contrast: "¿me recomienda…? (asking)",
    formality: "informal",
    cefr: "A2",
  },
  recepcion: {
    id: "recepcion",
    lemma: "la recepción",
    pos: "noun",
    gender: "f",
    gloss: "front desk / reception",
    meaningSummary:
      "Hotel front desk: Pregunta en la recepción / La recepción está a la derecha.",
    examples: [
      { es: "La llave está en la recepción.", en: "The key is at the front desk." },
      { es: "¿Dónde está la recepción?", en: "Where is the front desk?" },
    ],
    useWhen: "Hotel check-in and help.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "A2",
  },
  taxi: {
    id: "taxi",
    lemma: "el taxi",
    pos: "noun",
    gender: "m",
    gloss: "taxi",
    meaningSummary:
      "Cab: Tomo un taxi al aeropuerto / ¿Cuánto cuesta el taxi?",
    examples: [
      { es: "Tomo un taxi al hotel.", en: "I'm taking a taxi to the hotel." },
      { es: "El taxi está afuera.", en: "The taxi is outside." },
    ],
    useWhen: "Getting a ride in the city or to the airport.",
    dontUseWhen: "n/a",
    contrast: "metro / autobús",
    formality: "neutral",
    cefr: "A2",
  },
};

export const UNIT9_LESSONS: Record<string, Lesson> = {
  "u9-l1": {
    id: "u9-l1", unitId: "unit-9", title: "Opinions: creo / pienso / me parece",
    description: "Word Cards first — saying what you think.", xpReward: 44,
    exercises: [
      teach("teach-u9l1-creo", "creo-que"),
      { id: "u9l1-1", type: "select", prompt: "‘I think it is a good idea’ starts with…", options: ["Creo que…", "Fui que…", "Comí que…", "La cuenta que…"], correctIndex: 0, explanation: "Creo que es una buena idea.", wordCardIds: ["creo-que"], xp: 3 },
      teach("teach-u9l1-pienso", "pienso-que"),
      { id: "u9l1-2", type: "tap-chips", prompt: "Build: ‘I think the hotel is good.’", chips: ["Pienso", "que", "el", "hotel", "es", "bueno.", "fui", "metro"], correctOrder: ["Pienso", "que", "el", "hotel", "es", "bueno."], explanation: "Pienso que el hotel es bueno.", wordCardIds: ["pienso-que", "hotel"], xp: 3 },
      teach("teach-u9l1-parece", "me-parece"),
      { id: "u9l1-3", type: "translate", prompt: "Translate: ‘Sounds good to me.’", acceptedAnswers: ["Me parece bien.", "Me parece bien"], hint: "me parece…", explanation: "Me parece bien.", wordCardIds: ["me-parece"], xp: 4 },
      listen("u9l1-4", "Creo que es una buena idea.", ["I think it's a good idea.", "I ate a good idea.", "Where is the idea?", "I booked the idea."], 0, "Creo que es una buena idea.", ["creo-que"]),
      { id: "u9l1-5", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "I think the flight leaves early.", template: "Creo ___ el vuelo sale temprano.", acceptedAnswers: ["que", "Que"], hint: "creo que…", explanation: "Creo que el vuelo sale temprano.", wordCardIds: ["creo-que", "vuelo", "temprano"], xp: 3 },
      { id: "u9l1-6", type: "match-pairs", prompt: "Match opinion phrases.", pairs: [{ left: "Creo que…", right: "I think that…" }, { left: "Pienso que…", right: "I think that… (reflective)" }, { left: "Me parece bien.", right: "Sounds good to me." }, { left: "¿Qué piensas tú?", right: "What do you think?" }], explanation: "Core opinion openers.", wordCardIds: ["creo-que", "pienso-que", "me-parece"], xp: 4 },
      conjugate("u9l1-conj-1", "creer", "yo", "Present indicative", ["creo", "Creo"], "yo + creer → creo.", ["creo-que"], { hint: "creo" }),
      conjugate("u9l1-conj-2", "pensar", "yo", "Present indicative", ["pienso", "Pienso"], "yo + pensar → pienso.", ["pienso-que"], { hint: "pienso" }),
    ],
  },
  "u9-l2": {
    id: "u9-l2", unitId: "unit-9", title: "Agree & disagree",
    description: "De acuerdo, no estoy de acuerdo, en mi opinión.", xpReward: 44,
    exercises: [
      teach("teach-u9l2-acuerdo", "de-acuerdo"),
      { id: "u9l2-1", type: "select", prompt: "‘I agree with you’ is…", options: ["Estoy de acuerdo contigo.", "Estoy de aeropuerto contigo.", "Comí de acuerdo.", "Reservé contigo."], correctIndex: 0, explanation: "Estoy de acuerdo contigo.", wordCardIds: ["de-acuerdo"], xp: 3 },
      teach("teach-u9l2-no", "no-estoy-de-acuerdo"),
      { id: "u9l2-2", type: "situational-choose", prompt: "Pick the clear disagreement.", situation: "A friend wants a very expensive hotel.", options: ["No estoy de acuerdo — es muy caro.", "De acuerdo siempre caro.", "El pasaporte no está de acuerdo.", "Fui de acuerdo al metro."], correctIndex: 0, explanation: "No estoy de acuerdo — es muy caro.", wordCardIds: ["no-estoy-de-acuerdo"], xp: 4 },
      teach("teach-u9l2-opinion", "en-mi-opinion"),
      { id: "u9l2-3", type: "tap-chips", prompt: "Build: ‘In my opinion, we should leave early.’", chips: ["En", "mi", "opinión,", "debemos", "salir", "temprano.", "fui"], correctOrder: ["En", "mi", "opinión,", "debemos", "salir", "temprano."], explanation: "En mi opinión, debemos salir temprano.", wordCardIds: ["en-mi-opinion", "temprano"], xp: 3 },
      teach("teach-u9l2-parami", "para-mi"),
      { id: "u9l2-4", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "For me, it is a good idea.", template: "Para ___, es una buena idea.", acceptedAnswers: ["mí", "mi", "Mí", "Mi"], hint: "mí", explanation: "Para mí, es una buena idea.", wordCardIds: ["para-mi"], xp: 3 },
      listen("u9l2-5", "Estoy de acuerdo contigo.", ["I agree with you.", "I disagree with you.", "I booked with you.", "I forgot the passport."], 0, "Estoy de acuerdo contigo.", ["de-acuerdo"]),
      { id: "u9l2-6", type: "match-pairs", prompt: "Match agree / disagree.", pairs: [{ left: "Estoy de acuerdo", right: "I agree" }, { left: "No estoy de acuerdo", right: "I disagree" }, { left: "En mi opinión", right: "In my opinion" }, { left: "Para mí", right: "For me / to me" }], explanation: "Agreement toolkit.", wordCardIds: ["de-acuerdo", "no-estoy-de-acuerdo", "en-mi-opinion", "para-mi"], xp: 4 },
      { id: "u9l2-7", type: "translate", prompt: "Translate: ‘Agreed. Let's go to the airport.’", acceptedAnswers: ["De acuerdo. Vamos al aeropuerto.", "De acuerdo, vamos al aeropuerto."], hint: "De acuerdo…", explanation: "De acuerdo. Vamos al aeropuerto.", wordCardIds: ["de-acuerdo", "aeropuerto"], xp: 4 },
    ],
  },
  "u9-l3": {
    id: "u9-l3", unitId: "unit-9", title: "Asking opinions",
    description: "¿Qué opinas?, mixes, and soft replies.", xpReward: 44,
    exercises: [
      teach("teach-u9l3-opinas", "que-opinas"),
      { id: "u9l3-1", type: "select", prompt: "Ask a friend: ‘What do you think of the restaurant?’", options: ["¿Qué opinas del restaurante?", "¿Qué reservaste del restaurante?", "¿Dónde está el pasaporte?", "Fui del restaurante."], correctIndex: 0, explanation: "¿Qué opinas del restaurante?", wordCardIds: ["que-opinas"], xp: 3 },
      { id: "u9l3-2", type: "tap-chips", prompt: "Build: ‘What do you think? Should we book today?’", chips: ["¿Qué", "opinas?", "¿Reservamos", "hoy?", "fui", "jugo"], correctOrder: ["¿Qué", "opinas?", "¿Reservamos", "hoy?"], explanation: "¿Qué opinas? ¿Reservamos hoy?", wordCardIds: ["que-opinas", "reservar"], xp: 3 },
      { id: "u9l3-3", type: "situational-choose", prompt: "Pick the best reply.", situation: "Someone asks ¿Qué opinas del hotel?", options: ["Creo que es bueno.", "El equipaje soy bueno.", "De acuerdo el vuelo negro.", "Comí la recepción."], correctIndex: 0, explanation: "Creo que es bueno.", wordCardIds: ["creo-que", "hotel"], xp: 3 },
      listen("u9l3-4", "¿Qué opinas del restaurante?", ["What do you think of the restaurant?", "Where is the restaurant?", "I booked the restaurant.", "I disagree with juice."], 0, "¿Qué opinas del restaurante?", ["que-opinas"]),
      { id: "u9l3-5", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "What do you think?", template: "¿Qué ___?", acceptedAnswers: ["opinas", "Opinas", "piensas", "Piensas"], hint: "opinas / piensas", explanation: "¿Qué opinas?", wordCardIds: ["que-opinas", "pienso-que"], xp: 3 },
      { id: "u9l3-6", type: "match-pairs", prompt: "Match question → reply.", pairs: [{ left: "¿Qué opinas?", right: "Creo que sí." }, { left: "¿Te parece bien?", right: "Me parece bien." }, { left: "¿Reservamos hoy?", right: "De acuerdo." }, { left: "¿Es caro?", right: "Para mí, sí." }], explanation: "Opinion Q&A pairs.", wordCardIds: ["que-opinas", "me-parece", "de-acuerdo", "para-mi"], xp: 4 },
      { id: "u9l3-7", type: "translate", prompt: "Translate: ‘What do you think of the hotel?’ (tú)", acceptedAnswers: ["¿Qué opinas del hotel?", "¿Qué piensas del hotel?", "Qué opinas del hotel?"], hint: "¿Qué opinas…?", explanation: "¿Qué opinas del hotel?", wordCardIds: ["que-opinas", "hotel"], xp: 4 },
      conjugate("u9l3-conj-1", "pensar", "tú", "Present indicative", ["piensas", "Piensas"], "tú + pensar → piensas.", ["pienso-que"], { hint: "piensas" }),
    ],
  },

  "u9-l4": {
    id: "u9-l4", unitId: "unit-9", title: "Imperfect intro",
    description: "Habitual past & description — era, tenía, iba…", xpReward: 46,
    exercises: [
      teach("teach-u9l4-imp", "imperfecto"),
      { id: "u9l4-1", type: "select", prompt: "The imperfect is great for…", options: ["Habits and descriptions in the past", "Only future plans", "Only ordering juice", "Only saying hello"], correctIndex: 0, explanation: "Used to… / was …ing / was (background).", wordCardIds: ["imperfecto"], xp: 3 },
      teach("teach-u9l4-ser", "ser-imperfect"),
      { id: "u9l4-2", type: "select", prompt: "‘When I was a kid…’ uses imperfect ser:", options: ["Cuando era niño…", "Cuando fui niño siempre", "Cuando soy niño", "Cuando comí niño"], correctIndex: 0, explanation: "Cuando era niño… — background identity.", wordCardIds: ["ser-imperfect", "cuando-era"], xp: 3 },
      teach("teach-u9l4-tener", "tener-imperfect"),
      { id: "u9l4-3", type: "tap-chips", prompt: "Build: ‘I used to have a small apartment.’", chips: ["Antes", "tenía", "un", "departamento", "pequeño.", "tuve", "jugo"], correctOrder: ["Antes", "tenía", "un", "departamento", "pequeño."], explanation: "Antes tenía un departamento pequeño.", wordCardIds: ["tener-imperfect", "antes", "departamento"], xp: 3 },
      teach("teach-u9l4-ir", "ir-imperfect"),
      { id: "u9l4-4", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "I used to go to the airport by taxi.", template: "Antes ___ al aeropuerto en taxi.", acceptedAnswers: ["iba", "Iba"], hint: "ir imperfect — yo", explanation: "Antes iba al aeropuerto en taxi.", wordCardIds: ["ir-imperfect", "antes", "aeropuerto", "taxi"], xp: 3 },
      teach("teach-u9l4-cuando", "cuando-era"),
      listen("u9l4-5", "Cuando era niño, iba al parque.", ["When I was a kid, I used to go to the park.", "I went once only.", "Book the park passport.", "I disagree with the park."], 0, "Cuando era niño, iba al parque.", ["cuando-era", "ser-imperfect", "ir-imperfect"]),
      { id: "u9l4-6", type: "match-pairs", prompt: "Match imperfect forms.", pairs: [{ left: "era", right: "was (description)" }, { left: "tenía", right: "had / used to have" }, { left: "iba", right: "used to go" }, { left: "antes", right: "before / in the past" }], explanation: "High-frequency imperfect starters.", wordCardIds: ["ser-imperfect", "tener-imperfect", "ir-imperfect", "antes"], xp: 4 },
      { id: "u9l4-7", type: "situational-choose", prompt: "Pick the best line.", situation: "Describe a hotel from a past trip (background).", options: ["El hotel era pequeño pero bonito.", "El hotel fui pequeño.", "El hotel reservar pequeño.", "El hotel estoy de acuerdo."], correctIndex: 0, explanation: "El hotel era pequeño pero bonito.", wordCardIds: ["ser-imperfect", "hotel"], xp: 3 },
      teach("teach-u9l4-antes", "antes"),
      { id: "u9l4-8", type: "translate", prompt: "Translate: ‘When I was a student, I didn't have a car.’", acceptedAnswers: ["Cuando era estudiante, no tenía carro.", "Cuando era estudiante no tenía carro.", "Cuando era estudiante, no tenía un carro."], hint: "era… tenía…", explanation: "Cuando era estudiante, no tenía carro.", wordCardIds: ["cuando-era", "ser-imperfect", "tener-imperfect", "carro"], xp: 4 },
    ],
  },
  "u9-l5": {
    id: "u9-l5", unitId: "unit-9", title: "Imperfect drills: -aba / -ía",
    description: "Hablar & comer habits + more ser/tener/ir.", xpReward: 46,
    exercises: [
      teach("teach-u9l5-hablar", "hablar-imperfect"),
      { id: "u9l5-1", type: "select", prompt: "yo + hablar (imperfect) is…", options: ["hablaba", "hablé", "hablo ayer", "hablaré"], correctIndex: 0, explanation: "hablaba — regular -ar imperfect.", wordCardIds: ["hablar-imperfect"], xp: 3 },
      teach("teach-u9l5-comer", "comer-imperfect"),
      { id: "u9l5-2", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "We used to eat at that restaurant all the time.", template: "___ en ese restaurante siempre.", acceptedAnswers: ["Comíamos", "comíamos", "Comiamos", "comiamos"], hint: "nosotros + comer imperfect", explanation: "Comíamos en ese restaurante siempre.", wordCardIds: ["comer-imperfect"], xp: 3 },
      { id: "u9l5-3", type: "tap-chips", prompt: "Build: ‘They used to speak very fast.’", chips: ["Ellos", "hablaban", "muy", "rápido.", "hablaron", "jugo"], correctOrder: ["Ellos", "hablaban", "muy", "rápido."], explanation: "Ellos hablaban muy rápido.", wordCardIds: ["hablar-imperfect"], xp: 3 },
      listen("u9l5-4", "Antes comía mucho con el desayuno.", ["I used to eat a lot with breakfast.", "I booked breakfast.", "I disagree with breakfast.", "The flight is breakfast."], 0, "Antes comía mucho con el desayuno.", ["comer-imperfect", "antes"]),
      { id: "u9l5-5", type: "match-pairs", prompt: "Match person → imperfect.", pairs: [{ left: "yo hablaba", right: "I used to speak" }, { left: "tú comías", right: "you used to eat" }, { left: "nosotros íbamos", right: "we used to go" }, { left: "ustedes tenían", right: "you all used to have" }], explanation: "-aba / -ía patterns.", wordCardIds: ["hablar-imperfect", "comer-imperfect", "ir-imperfect", "tener-imperfect"], xp: 4 },
      { id: "u9l5-6", type: "situational-choose", prompt: "Pick the habitual past.", situation: "Every Friday you used to go to the movies.", options: ["Íbamos al cine cada viernes.", "Fuimos al cine una vez.", "Vamos al cine ayer.", "Reservamos el cine pasaporte."], correctIndex: 0, explanation: "Íbamos al cine cada viernes.", wordCardIds: ["ir-imperfect", "el-cine"], xp: 3 },
      { id: "u9l5-7", type: "translate", prompt: "Translate: ‘When I was a kid, I used to talk with my grandparents every day.’", acceptedAnswers: ["Cuando era niño, hablaba con mis abuelos todos los días.", "Cuando era niño hablaba con mis abuelos todos los días.", "Cuando era niño, hablaba con mis abuelos todos los dias."], hint: "era… hablaba…", explanation: "Cuando era niño, hablaba con mis abuelos todos los días.", wordCardIds: ["cuando-era", "hablar-imperfect"], xp: 4 },
      conjugate("u9l5-conj-1", "hablar", "yo", "Imperfect", ["hablaba", "Hablaba"], "yo + hablar → hablaba.", ["hablar-imperfect"], { hint: "hablaba" }),
      conjugate("u9l5-conj-2", "comer", "nosotros/as", "Imperfect", ["comíamos", "comiamos", "Comíamos"], "nosotros + comer → comíamos.", ["comer-imperfect"], { hint: "comíamos" }),
    ],
  },
  "u9-l6": {
    id: "u9-l6", unitId: "unit-9", title: "Imperfect conjugations",
    description: "Drill ser, tener, ir, hablar, comer in imperfect.", xpReward: 48,
    exercises: [
      conjugate("u9l6-1", "ser", "yo", "Imperfect", ["era", "Era"], "yo + ser → era.", ["ser-imperfect"], { hint: "era" }),
      conjugate("u9l6-2", "ser", "tú", "Imperfect", ["eras", "Eras"], "tú + ser → eras.", ["ser-imperfect"], { hint: "eras" }),
      conjugate("u9l6-3", "tener", "yo", "Imperfect", ["tenía", "tenia", "Tenía"], "yo + tener → tenía.", ["tener-imperfect"], { hint: "tenía" }),
      conjugate("u9l6-4", "tener", "ustedes", "Imperfect", ["tenían", "tenian", "Tenían"], "ustedes + tener → tenían.", ["tener-imperfect"], { hint: "tenían" }),
      conjugate("u9l6-5", "ir", "yo", "Imperfect", ["iba", "Iba"], "yo + ir → iba.", ["ir-imperfect"], { hint: "iba" }),
      conjugate("u9l6-6", "ir", "nosotros/as", "Imperfect", ["íbamos", "ibamos", "Íbamos"], "nosotros + ir → íbamos.", ["ir-imperfect"], { hint: "íbamos" }),
      conjugate("u9l6-7", "hablar", "tú", "Imperfect", ["hablabas", "Hablabas"], "tú + hablar → hablabas.", ["hablar-imperfect"], { hint: "hablabas" }),
      conjugate("u9l6-8", "comer", "él/ella/usted", "Imperfect", ["comía", "comia", "Comía"], "él/ella/usted + comer → comía.", ["comer-imperfect"], { hint: "comía" }),
      { id: "u9l6-9", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "You (tú) used to have a passport.", template: "Tú ___ un pasaporte.", acceptedAnswers: ["tenías", "tenias", "Tenías"], hint: "tener imperfect", explanation: "Tú tenías un pasaporte.", wordCardIds: ["tener-imperfect", "pasaporte"], xp: 3 },
      listen("u9l6-10", "Antes tenía un departamento pequeño.", ["I used to have a small apartment.", "I booked an apartment.", "I disagree with apartments.", "The flight is an apartment."], 0, "Antes tenía un departamento pequeño.", ["tener-imperfect", "antes", "departamento"]),
      { id: "u9l6-11", type: "match-pairs", prompt: "Imperfect check.", pairs: [{ left: "yo era", right: "I was" }, { left: "tú ibas", right: "you used to go" }, { left: "nosotros hablábamos", right: "we used to speak" }, { left: "ustedes comían", right: "you all used to eat" }], explanation: "Keep imperfect forms warm.", wordCardIds: ["ser-imperfect", "ir-imperfect", "hablar-imperfect", "comer-imperfect"], xp: 4 },
    ],
  },

  "u9-l7": {
    id: "u9-l7", unitId: "unit-9", title: "Airport & flights",
    description: "Aeropuerto, vuelo, pasaporte, equipaje.", xpReward: 44,
    exercises: [
      teach("teach-u9l7-aero", "aeropuerto"),
      { id: "u9l7-1", type: "select", prompt: "‘How do I get to the airport?’", options: ["¿Cómo llego al aeropuerto?", "¿Cómo como el aeropuerto?", "¿Estoy de acuerdo al aeropuerto?", "Hablaba el aeropuerto."], correctIndex: 0, explanation: "¿Cómo llego al aeropuerto?", wordCardIds: ["aeropuerto", "como-llego"], xp: 3 },
      teach("teach-u9l7-vuelo", "vuelo"),
      { id: "u9l7-2", type: "tap-chips", prompt: "Build: ‘My flight leaves at six.’", chips: ["Mi", "vuelo", "sale", "a", "las", "seis.", "iba", "jugo"], correctOrder: ["Mi", "vuelo", "sale", "a", "las", "seis."], explanation: "Mi vuelo sale a las seis.", wordCardIds: ["vuelo", "a-las"], xp: 3 },
      teach("teach-u9l7-pasaporte", "pasaporte"),
      { id: "u9l7-3", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "Do you have your passport?", template: "¿Tienes tu ___?", acceptedAnswers: ["pasaporte", "Pasaporte"], hint: "passport", explanation: "¿Tienes tu pasaporte?", wordCardIds: ["pasaporte", "tener"], xp: 3 },
      teach("teach-u9l7-equipaje", "equipaje"),
      listen("u9l7-4", "¿Dónde recojo el equipaje?", ["Where do I pick up the luggage?", "Where is the room?", "I disagree with luggage.", "I used to eat luggage."], 0, "¿Dónde recojo el equipaje?", ["equipaje"]),
      teach("teach-u9l7-taxi", "taxi"),
      { id: "u9l7-5", type: "situational-choose", prompt: "Pick the best line.", situation: "You need a ride to the airport.", options: ["Tomo un taxi al aeropuerto.", "Como un taxi al aeropuerto.", "Era un taxi al jugo.", "Estoy de acuerdo el equipaje."], correctIndex: 0, explanation: "Tomo un taxi al aeropuerto.", wordCardIds: ["taxi", "aeropuerto"], xp: 3 },
      { id: "u9l7-6", type: "match-pairs", prompt: "Match travel nouns.", pairs: [{ left: "el aeropuerto", right: "the airport" }, { left: "el vuelo", right: "the flight" }, { left: "el pasaporte", right: "the passport" }, { left: "el equipaje", right: "the luggage" }], explanation: "Airport toolkit.", wordCardIds: ["aeropuerto", "vuelo", "pasaporte", "equipaje"], xp: 4 },
      { id: "u9l7-7", type: "translate", prompt: "Translate: ‘The airport is far.’", acceptedAnswers: ["El aeropuerto está lejos.", "El aeropuerto está lejos", "Está lejos el aeropuerto."], hint: "está lejos", explanation: "El aeropuerto está lejos.", wordCardIds: ["aeropuerto", "lejos"], xp: 4 },
      listen("u9l7-8", "Mi vuelo sale a las seis.", ["My flight leaves at six.", "My room is six.", "I disagree at six.", "I used to speak at six."], 0, "Mi vuelo sale a las seis.", ["vuelo", "a-las"]),
    ],
  },
  "u9-l8": {
    id: "u9-l8", unitId: "unit-9", title: "Lodging & recommendations",
    description: "Habitación, reserva, recepción, te recomiendo + directions reuse.", xpReward: 44,
    exercises: [
      teach("teach-u9l8-hab", "habitacion"),
      { id: "u9l8-1", type: "select", prompt: "‘I want a room for two’ is…", options: ["Quiero una habitación para dos.", "Quiero un vuelo para dos.", "Era una habitación para jugo.", "Estoy de acuerdo una habitación."], correctIndex: 0, explanation: "Quiero una habitación para dos.", wordCardIds: ["habitacion"], xp: 3 },
      teach("teach-u9l8-reserva", "reserva"),
      teach("teach-u9l8-reservar", "reservar"),
      { id: "u9l8-2", type: "tap-chips", prompt: "Build: ‘I have a reservation under Ana's name.’", chips: ["Tengo", "una", "reserva", "a", "nombre", "de", "Ana.", "vuelo"], correctOrder: ["Tengo", "una", "reserva", "a", "nombre", "de", "Ana."], explanation: "Tengo una reserva a nombre de Ana.", wordCardIds: ["reserva"], xp: 3 },
      teach("teach-u9l8-rec", "te-recomiendo"),
      { id: "u9l8-3", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "I recommend this restaurant.", template: "Te ___ este restaurante.", acceptedAnswers: ["recomiendo", "Recomiendo"], hint: "recomiendo", explanation: "Te recomiendo este restaurante.", wordCardIds: ["te-recomiendo"], xp: 3 },
      teach("teach-u9l8-recep", "recepcion"),
      listen("u9l8-4", "¿Dónde está la recepción?", ["Where is the front desk?", "Where is the flight?", "I used to eat reception.", "I disagree with reception."], 0, "¿Dónde está la recepción?", ["recepcion", "donde-esta"]),
      { id: "u9l8-5", type: "situational-choose", prompt: "Pick the best line.", situation: "Friend asks how to get downtown from the hotel.", options: ["Te recomiendo ir en metro. El centro está cerca.", "Te recomiendo el imperfecto.", "No estoy de acuerdo el equipaje.", "Hablaba la recepción mañana."], correctIndex: 0, explanation: "Te recomiendo ir en metro. El centro está cerca.", wordCardIds: ["te-recomiendo", "metro", "el-centro", "cerca"], xp: 4 },
      { id: "u9l8-6", type: "match-pairs", prompt: "Match lodging phrases.", pairs: [{ left: "la habitación", right: "the room" }, { left: "la reserva", right: "the reservation" }, { left: "la recepción", right: "the front desk" }, { left: "te recomiendo", right: "I recommend" }], explanation: "Hotel toolkit.", wordCardIds: ["habitacion", "reserva", "recepcion", "te-recomiendo"], xp: 4 },
      { id: "u9l8-7", type: "translate", prompt: "Translate: ‘Can I make a reservation?’", acceptedAnswers: ["¿Puedo hacer una reserva?", "Puedo hacer una reserva?", "¿Puedo hacer una reserva"], hint: "hacer una reserva", explanation: "¿Puedo hacer una reserva?", wordCardIds: ["reserva", "reservar"], xp: 4 },
      listen("u9l8-8", "Quiero reservar una habitación.", ["I want to book a room.", "I used to book a flight.", "I disagree with rooms.", "Where is the passport?"], 0, "Quiero reservar una habitación.", ["reservar", "habitacion"]),
      { id: "u9l8-9", type: "select", prompt: "Directions reuse: ‘Turn right’ is…", options: ["a la derecha", "a la habitación", "de acuerdo derecha", "iba derecha"], correctIndex: 0, explanation: "a la derecha — from Unit 6.", wordCardIds: ["a-la-derecha"], xp: 3 },
    ],
  },

  "u9-l9": {
    id: "u9-l9", unitId: "unit-9", title: "Story: Trip opinions",
    description: "Story-listen + comprehension — opinions, imperfect, travel.", xpReward: 48,
    exercises: [
      storyListen(
        "u9l9-story", "Opiniones del viaje",
        [
          { text: "Antes, yo iba al aeropuerto en taxi.", en: "Before, I used to go to the airport by taxi." },
          { text: "Ahora creo que el metro es mejor.", en: "Now I think the metro is better." },
          { text: "Ana dice: ¿Qué opinas del hotel?", en: "Ana says: What do you think of the hotel?" },
          { text: "Me parece bien. Tiene una habitación grande.", en: "Sounds good to me. It has a big room." },
          { text: "De acuerdo. Reservamos hoy y llegamos temprano al vuelo.", en: "Agreed. We'll book today and arrive early for the flight." },
        ],
        [
          { prompt: "How did the narrator used to get to the airport?", options: ["By taxi", "By swimming", "Never traveled", "By juice"], correctIndex: 0, explanation: "Antes, yo iba al aeropuerto en taxi." },
          { prompt: "What does the narrator think now?", options: ["The metro is better", "Skip the passport", "Nothing", "The taxi is food"], correctIndex: 0, explanation: "Ahora creo que el metro es mejor." },
          { prompt: "What does Ana ask?", options: ["What do you think of the hotel?", "Where is the imperfect?", "Only the tip", "Nothing"], correctIndex: 0, explanation: "¿Qué opinas del hotel?" },
          { prompt: "What do they decide?", options: ["Book today and arrive early", "Wash dishes", "Cancel Spanish", "Eat the passport"], correctIndex: 0, explanation: "Reservamos hoy y llegamos temprano al vuelo." },
        ],
        ["antes", "ir-imperfect", "aeropuerto", "taxi", "creo-que", "metro", "que-opinas", "hotel", "me-parece", "habitacion", "de-acuerdo", "reservar", "vuelo", "temprano"],
        "Trip-opinions story — Neural2 voice rotation.", 12
      ),
      { id: "u9l9-1", type: "select", prompt: "From the story — soft agreement was…", options: ["Me parece bien.", "Comí bien.", "Todo recto bien.", "La cuenta bien."], correctIndex: 0, explanation: "Me parece bien.", wordCardIds: ["me-parece"], xp: 3 },
      { id: "u9l9-2", type: "match-pairs", prompt: "Match story details.", pairs: [{ left: "antes", right: "by taxi" }, { left: "ahora", right: "the metro is better" }, { left: "hotel", right: "a big room" }, { left: "today", right: "they book" }], explanation: "Story comprehension.", wordCardIds: ["antes", "taxi", "metro", "habitacion", "reservar"], xp: 4 },
      listen("u9l9-3", "De acuerdo. Reservamos hoy y llegamos temprano al vuelo.", ["They agree to book today and arrive early.", "They cancel the hotel.", "They eat the passport.", "They disagree forever."], 0, "The final decision.", ["de-acuerdo", "reservar", "vuelo", "temprano"]),
    ],
  },
  "u9-l10": {
    id: "u9-l10", unitId: "unit-9", title: "Cloze & dictation from the trip",
    description: "Story lines — cloze, dictation, and listen.", xpReward: 48,
    exercises: [
      dictation("u9l10-dict-1", "Antes, yo iba al aeropuerto en taxi.", ["Antes, yo iba al aeropuerto en taxi.", "Antes yo iba al aeropuerto en taxi.", "Antes, yo iba al aeropuerto en taxi"], "Type the line you heard.", ["antes", "ir-imperfect", "aeropuerto", "taxi"], { hint: "Replay if needed", voice: "f" }),
      cloze("u9l10-cloze-1", "Antes, yo ___ al aeropuerto en taxi.", ["iba", "Iba"], "Antes, yo iba al aeropuerto en taxi.", ["ir-imperfect", "aeropuerto", "taxi"], { hint: "ir imperfect", audioText: "Antes, yo iba al aeropuerto en taxi.", voice: "f" }),
      dictation("u9l10-dict-2", "Ahora creo que el metro es mejor.", ["Ahora creo que el metro es mejor.", "Ahora creo que el metro es mejor"], "Type the line you heard.", ["creo-que", "metro"], { hint: "Replay if needed", voice: "m" }),
      cloze("u9l10-cloze-2", "Ahora creo ___ el metro es mejor.", ["que", "Que"], "Ahora creo que el metro es mejor.", ["creo-que", "metro"], { hint: "creo que…", audioText: "Ahora creo que el metro es mejor.", voice: "m" }),
      dictation("u9l10-dict-3", "Ana dice: ¿Qué opinas del hotel?", ["Ana dice: ¿Qué opinas del hotel?", "Ana dice: Qué opinas del hotel?"], "Type the line you heard.", ["que-opinas", "hotel"], { hint: "Replay if needed", voice: "c" }),
      cloze("u9l10-cloze-3", "Ana dice: ¿Qué ___ del hotel?", ["opinas", "Opinas"], "Ana dice: ¿Qué opinas del hotel?", ["que-opinas", "hotel"], { hint: "what do you think", audioText: "Ana dice: ¿Qué opinas del hotel?", voice: "c" }),
      dictation("u9l10-dict-4", "Me parece bien. Tiene una habitación grande.", ["Me parece bien. Tiene una habitación grande.", "Me parece bien, tiene una habitación grande."], "Type the line you heard.", ["me-parece", "habitacion"], { hint: "Replay if needed", voice: "f" }),
      cloze("u9l10-cloze-4", "Me parece bien. Tiene una ___ grande.", ["habitación", "habitacion", "Habitación"], "Me parece bien. Tiene una habitación grande.", ["me-parece", "habitacion"], { hint: "room", audioText: "Me parece bien. Tiene una habitación grande.", voice: "f" }),
      dictation("u9l10-dict-5", "De acuerdo. Reservamos hoy y llegamos temprano al vuelo.", ["De acuerdo. Reservamos hoy y llegamos temprano al vuelo.", "De acuerdo, reservamos hoy y llegamos temprano al vuelo."], "Type the line you heard.", ["de-acuerdo", "reservar", "vuelo"], { hint: "Replay if needed", voice: "m" }),
      cloze("u9l10-cloze-5", "De acuerdo. ___ hoy y llegamos temprano al vuelo.", ["Reservamos", "reservamos"], "De acuerdo. Reservamos hoy y llegamos temprano al vuelo.", ["de-acuerdo", "reservar", "vuelo"], { hint: "we book", audioText: "De acuerdo. Reservamos hoy y llegamos temprano al vuelo.", voice: "m" }),
    ],
  },

  "u9-l11": {
    id: "u9-l11", unitId: "unit-9", title: "Situations: travel talk",
    description: "Dialogue-style practice — opinions + airport + hotel.", xpReward: 46,
    exercises: [
      { id: "u9l11-1", type: "situational-choose", prompt: "Pick the best line.", situation: "The hotel near downtown costs a lot.", options: ["Creo que es caro, pero me parece bien si está cerca.", "Creo que el pasaporte come jugo.", "Íbamos de acuerdo el equipaje.", "Hablaba la recepción mañana."], correctIndex: 0, explanation: "Opinion + soft judgment.", wordCardIds: ["creo-que", "me-parece", "cerca", "el-centro"], xp: 4 },
      { id: "u9l11-2", type: "situational-choose", prompt: "Pick the best line.", situation: "You need directions to baggage claim.", options: ["Disculpe, ¿dónde recojo el equipaje?", "Disculpe, ¿dónde como el imperfecto?", "Estoy de acuerdo el equipaje izquierda.", "Cuando era niño el equipaje."], correctIndex: 0, explanation: "Disculpe, ¿dónde recojo el equipaje?", wordCardIds: ["disculpe", "equipaje"], xp: 3 },
      { id: "u9l11-3", type: "tap-chips", prompt: "Build: ‘I recommend going by taxi.’", chips: ["Te", "recomiendo", "ir", "en", "taxi.", "iba", "jugo"], correctOrder: ["Te", "recomiendo", "ir", "en", "taxi."], explanation: "Te recomiendo ir en taxi.", wordCardIds: ["te-recomiendo", "taxi"], xp: 3 },
      listen("u9l11-4", "¿Cómo llego al aeropuerto?", ["How do I get to the airport?", "How do I eat the airport?", "I used to book the airport.", "I disagree with airports."], 0, "¿Cómo llego al aeropuerto?", ["como-llego", "aeropuerto"]),
      { id: "u9l11-5", type: "translate", prompt: "Translate: ‘In my opinion, we should book today.’", acceptedAnswers: ["En mi opinión, debemos reservar hoy.", "En mi opinión debemos reservar hoy.", "En mi opinion, debemos reservar hoy."], hint: "En mi opinión…", explanation: "En mi opinión, debemos reservar hoy.", wordCardIds: ["en-mi-opinion", "reservar"], xp: 4 },
      { id: "u9l11-6", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "When I was a kid, I used to go to the park.", template: "Cuando ___ niño, iba al parque.", acceptedAnswers: ["era", "Era"], hint: "ser imperfect", explanation: "Cuando era niño, iba al parque.", wordCardIds: ["cuando-era", "ser-imperfect", "ir-imperfect"], xp: 3 },
      { id: "u9l11-7", type: "select", prompt: "Friend wants a plan you do not like. Soft disagree?", options: ["No estoy de acuerdo. ¿Qué tal otro hotel?", "Nunca hables.", "El vuelo come.", "Íbamos no forever."], correctIndex: 0, explanation: "Disagree, then offer an alternative.", wordCardIds: ["no-estoy-de-acuerdo", "hotel"], xp: 3 },
      listen("u9l11-8", "Tengo una reserva a nombre de Ana.", ["I have a reservation under Ana's name.", "I used to have Ana's passport.", "I disagree with Ana.", "Where is Ana's imperfect?"], 0, "Tengo una reserva a nombre de Ana.", ["reserva"]),
      { id: "u9l11-9", type: "match-pairs", prompt: "Situation phrases.", pairs: [{ left: "¿Cómo llego…?", right: "How do I get…?" }, { left: "Te recomiendo…", right: "I recommend…" }, { left: "Tengo una reserva", right: "I have a reservation" }, { left: "Antes iba…", right: "I used to go…" }], explanation: "Travel + opinion glue.", wordCardIds: ["como-llego", "te-recomiendo", "reserva", "ir-imperfect"], xp: 4 },
      conjugate("u9l11-conj-1", "tener", "yo", "Imperfect", ["tenía", "tenia", "Tenía"], "yo tenía… for past possession.", ["tener-imperfect"], { hint: "tenía" }),
    ],
  },
  "u9-l12": {
    id: "u9-l12", unitId: "unit-9", title: "Unit 9 check",
    description: "Mixed review — opinions, imperfect, airport & lodging.", xpReward: 48,
    exercises: [
      { id: "u9l12-1", type: "select", prompt: "‘I think that…’ is…", options: ["Creo que…", "Fui que…", "Equipaje que…", "Recepción que…"], correctIndex: 0, explanation: "Creo que…", wordCardIds: ["creo-que"], xp: 3 },
      { id: "u9l12-2", type: "select", prompt: "yo + ir imperfect =", options: ["iba", "fui", "voy ayer", "iré"], correctIndex: 0, explanation: "iba.", wordCardIds: ["ir-imperfect"], xp: 3 },
      { id: "u9l12-3", type: "tap-chips", prompt: "Build: ‘I agree with you.’", chips: ["Estoy", "de", "acuerdo", "contigo.", "iba", "vuelo"], correctOrder: ["Estoy", "de", "acuerdo", "contigo."], explanation: "Estoy de acuerdo contigo.", wordCardIds: ["de-acuerdo"], xp: 3 },
      { id: "u9l12-4", type: "translate", prompt: "Translate: ‘My flight leaves at six.’", acceptedAnswers: ["Mi vuelo sale a las seis.", "Mi vuelo sale a las seis", "El vuelo sale a las seis."], hint: "Mi vuelo sale…", explanation: "Mi vuelo sale a las seis.", wordCardIds: ["vuelo", "a-las"], xp: 4 },
      listen("u9l12-5", "Cuando era niño, iba al parque.", ["When I was a kid, I used to go to the park.", "I booked the park.", "I disagree with parks.", "Where is the passport?"], 0, "Cuando era niño, iba al parque.", ["cuando-era", "ser-imperfect", "ir-imperfect"]),
      { id: "u9l12-6", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "I want to book a room.", template: "Quiero ___ una habitación.", acceptedAnswers: ["reservar", "Reservar"], hint: "to book", explanation: "Quiero reservar una habitación.", wordCardIds: ["reservar", "habitacion"], xp: 3 },
      { id: "u9l12-7", type: "match-pairs", prompt: "Final Unit 9 match.", pairs: [{ left: "el aeropuerto", right: "the airport" }, { left: "me parece bien", right: "sounds good to me" }, { left: "tenía", right: "used to have" }, { left: "te recomiendo", right: "I recommend" }], explanation: "Core Unit 9 lemmas.", wordCardIds: ["aeropuerto", "me-parece", "tener-imperfect", "te-recomiendo"], xp: 4 },
      { id: "u9l12-8", type: "situational-choose", prompt: "Pick the best line.", situation: "You are lost in the hotel lobby.", options: ["¿Dónde está la recepción?", "¿Dónde como la recepción?", "Íbamos la recepción jugo.", "No estoy de acuerdo el imperfecto."], correctIndex: 0, explanation: "¿Dónde está la recepción?", wordCardIds: ["recepcion", "donde-esta"], xp: 3 },
      { id: "u9l12-9", type: "select", prompt: "‘In my opinion…’ is…", options: ["En mi opinión", "En mi equipaje", "En mi vuelo", "En mi pasaporte"], correctIndex: 0, explanation: "En mi opinión.", wordCardIds: ["en-mi-opinion"], xp: 3 },
      conjugate("u9l12-conj-1", "ser", "nosotros/as", "Imperfect", ["éramos", "eramos", "Éramos"], "nosotros + ser → éramos.", ["ser-imperfect"], { hint: "éramos" }),
      conjugate("u9l12-conj-2", "comer", "yo", "Imperfect", ["comía", "comia", "Comía"], "yo + comer → comía.", ["comer-imperfect"], { hint: "comía" }),
      { id: "u9l12-10", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "Do you have your passport?", template: "¿Tienes tu ___?", acceptedAnswers: ["pasaporte", "Pasaporte"], hint: "passport", explanation: "¿Tienes tu pasaporte?", wordCardIds: ["pasaporte"], xp: 3 },
    ],
  },
};
