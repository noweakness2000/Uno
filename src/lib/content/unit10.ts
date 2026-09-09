/**
 * Unit 10 — Plans, work & wellbeing (~12 lessons). Early–mid B1 Spanish.
 * Merged via intermediate.ts into mock-data.
 */
import type { Lesson, WordCard } from "../types";
import { audioSrcFor, voiceForIndex, type AudioVoice } from "../audio";

const LATAM_PRESENT = (forms: [string, string, string, string, string]) => [
  {
    label: "Present indicative",
    forms: [
      { person: "yo", form: forms[0] },
      { person: "tú", form: forms[1] },
      { person: "él/ella/usted", form: forms[2] },
      { person: "nosotros/as", form: forms[3] },
      { person: "ustedes", form: forms[4] },
    ],
  },
];

const LATAM_FUTURE = (forms: [string, string, string, string, string]) => [
  {
    label: "Simple future",
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

let listenVoiceIndex = 1000;

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

export const UNIT10_WORD_CARDS: Record<string, WordCard> = {
  reunion: {
    id: "reunion",
    lemma: "la reunión",
    pos: "noun",
    gender: "f",
    gloss: "meeting",
    meaningSummary:
      "Work or school meeting. Tengo una reunión a las diez / La reunión es por la mañana. Accent on ó in reunión.",
    examples: [
      { es: "Tengo una reunión a las diez.", en: "I have a meeting at ten." },
      { es: "¿A qué hora es la reunión?", en: "What time is the meeting?" },
    ],
    useWhen: "Talking about scheduled meetings at work or school.",
    dontUseWhen: "Not for a casual hangout — that is más like salir / vernos.",
    formality: "neutral",
    cefr: "B1",
  },
  proyecto: {
    id: "proyecto",
    lemma: "el proyecto",
    pos: "noun",
    gender: "m",
    gloss: "project",
    meaningSummary:
      "Work or school project. Trabajo en un proyecto nuevo / Terminamos el proyecto la próxima semana.",
    examples: [
      { es: "Trabajo en un proyecto importante.", en: "I work on an important project." },
      { es: "El proyecto termina el viernes.", en: "The project ends on Friday." },
    ],
    useWhen: "Jobs, classes, and team work.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "B1",
  },
  colega: {
    id: "colega",
    lemma: "el/la colega",
    pos: "noun",
    gender: "mf",
    gloss: "colleague / coworker",
    meaningSummary:
      "Someone you work with. Mi colega llega temprano / Hablo con mis colegas todos los días.",
    examples: [
      { es: "Mi colega trabaja desde casa.", en: "My colleague works from home." },
      { es: "Voy a hablar con un colega.", en: "I'm going to talk with a colleague." },
    ],
    useWhen: "Workplace peers.",
    dontUseWhen: "For close friends outside work, amigo/a is more natural.",
    contrast: "amigo/a (friend)",
    formality: "neutral",
    cefr: "B1",
  },
  universidad: {
    id: "universidad",
    lemma: "la universidad",
    pos: "noun",
    gender: "f",
    gloss: "university / college",
    meaningSummary:
      "Higher education. Estudio en la universidad / Voy a la universidad en metro.",
    examples: [
      { es: "Estudio en la universidad.", en: "I study at the university." },
      { es: "¿Estudias en la universidad o trabajas?", en: "Do you study at university or work?" },
    ],
    useWhen: "School after high school / college life.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "A2",
  },
  carrera: {
    id: "carrera",
    lemma: "la carrera",
    pos: "noun",
    gender: "f",
    gloss: "degree / major (also race/career)",
    meaningSummary:
      "Here: university major/degree. Estudio una carrera de diseño / Terminé mi carrera. Context matters — also means race or career path.",
    examples: [
      { es: "Estudio una carrera de ingeniería.", en: "I'm studying an engineering degree." },
      { es: "¿Qué carrera estudias?", en: "What major / degree are you studying?" },
    ],
    useWhen: "Talking about university majors.",
    dontUseWhen: "If you only mean 'job career' long-term, trayectoria profesional is clearer — but carrera is still heard.",
    formality: "neutral",
    cefr: "B1",
  },
  entrevista: {
    id: "entrevista",
    lemma: "la entrevista",
    pos: "noun",
    gender: "f",
    gloss: "interview",
    meaningSummary:
      "Job (or media) interview. Tengo una entrevista mañana / La entrevista es a las nueve.",
    examples: [
      { es: "Tengo una entrevista mañana.", en: "I have an interview tomorrow." },
      { es: "La entrevista fue bien.", en: "The interview went well." },
    ],
    useWhen: "Job hunting and hiring conversations.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "B1",
  },
  correo: {
    id: "correo",
    lemma: "el correo / el correo electrónico",
    pos: "noun",
    gender: "m",
    gloss: "email / mail",
    meaningSummary:
      "Often email at work: Te envío un correo / Reviso el correo por la mañana. Also mail in general.",
    examples: [
      { es: "Te envío un correo hoy.", en: "I'll send you an email today." },
      { es: "¿Revisaste el correo?", en: "Did you check the email?" },
    ],
    useWhen: "Workplace messages and email.",
    dontUseWhen: "For texting friends, mensaje is more common.",
    contrast: "mensaje (text/message)",
    formality: "neutral",
    cefr: "B1",
  },
  "desde-casa": {
    id: "desde-casa",
    lemma: "desde casa / trabajo remoto",
    pos: "phrase",
    gender: "n/a",
    gloss: "from home / remote work",
    meaningSummary:
      "Remote work phrase: Trabajo desde casa / Hoy trabajo desde casa. Natural small-talk about modern jobs.",
    examples: [
      { es: "Trabajo desde casa tres días.", en: "I work from home three days." },
      { es: "Mi colega trabaja desde casa.", en: "My colleague works from home." },
    ],
    useWhen: "Describing remote or hybrid work.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "B1",
  },
  "la-proxima-semana": {
    id: "la-proxima-semana",
    lemma: "la próxima semana",
    pos: "phrase",
    gender: "n/a",
    gloss: "next week",
    meaningSummary:
      "Future time frame. Voy a viajar la próxima semana / La reunión es la próxima semana.",
    examples: [
      { es: "Voy a terminar el proyecto la próxima semana.", en: "I'm going to finish the project next week." },
      { es: "¿Qué haces la próxima semana?", en: "What are you doing next week?" },
    ],
    useWhen: "Plans about one week ahead.",
    dontUseWhen: "For 'this week' use esta semana.",
    contrast: "esta semana / el próximo mes",
    formality: "neutral",
    cefr: "A2",
  },
  "el-proximo-mes": {
    id: "el-proximo-mes",
    lemma: "el próximo mes",
    pos: "phrase",
    gender: "n/a",
    gloss: "next month",
    meaningSummary:
      "Future time frame a bit further out. El próximo mes voy a cambiar de trabajo.",
    examples: [
      { es: "El próximo mes empiezo un proyecto nuevo.", en: "Next month I start a new project." },
      { es: "Viajamos el próximo mes.", en: "We're traveling next month." },
    ],
    useWhen: "Plans about a month ahead.",
    dontUseWhen: "n/a",
    contrast: "la próxima semana / mañana",
    formality: "neutral",
    cefr: "A2",
  },
  "ir-a-deep": {
    id: "ir-a-deep",
    lemma: "ir a + infinitive (plans)",
    pos: "phrase",
    gender: "n/a",
    gloss: "going to + verb (near future)",
    meaningSummary:
      "Everyday near-future plans: Voy a trabajar / Vas a estudiar / Vamos a descansar. Deepen with time phrases like mañana and la próxima semana.",
    conjugations: LATAM_PRESENT([
      "voy a…",
      "vas a…",
      "va a…",
      "vamos a…",
      "van a…",
    ]),
    examples: [
      { es: "Voy a enviar un correo mañana.", en: "I'm going to send an email tomorrow." },
      { es: "¿Vas a ir a la reunión?", en: "Are you going to go to the meeting?" },
    ],
    useWhen: "Concrete near-future intentions.",
    dontUseWhen: "For distant/formal predictions, simple future also appears.",
    contrast: "simple future (hablaré…)",
    formality: "neutral",
    cefr: "A2",
  },
  "futuro-simple": {
    id: "futuro-simple",
    lemma: "el futuro simple",
    pos: "noun",
    gender: "m",
    gloss: "the simple future tense",
    meaningSummary:
      "Spanish future for will / shall: hablaré, trabajarás, irá… Often plans, promises, or predictions. Ir a + infinitive is more everyday for near plans.",
    examples: [
      { es: "Mañana trabajaré desde casa.", en: "Tomorrow I will work from home." },
      { es: "El próximo mes viajaré.", en: "Next month I will travel." },
    ],
    useWhen: "Talking about the future tense itself or using -é / -ás forms.",
    dontUseWhen: "Don't quiz the label — use real forms like trabajaré.",
    contrast: "ir a + infinitive",
    formality: "neutral",
    cefr: "B1",
  },
  "hablar-future": {
    id: "hablar-future",
    lemma: "hablar (future)",
    pos: "verb",
    gender: "n/a",
    gloss: "to speak — will speak",
    meaningSummary:
      "Regular -ar future: hablaré, hablarás, hablará, hablaremos, hablarán.",
    conjugations: LATAM_FUTURE([
      "hablaré",
      "hablarás",
      "hablará",
      "hablaremos",
      "hablarán",
    ]),
    examples: [
      { es: "Hablaré con mi colega mañana.", en: "I will talk with my colleague tomorrow." },
      { es: "¿Hablarás con el médico?", en: "Will you talk with the doctor?" },
    ],
    useWhen: "Future conversations and promises.",
    dontUseWhen: "For right-now plans, voy a hablar is often more natural.",
    formality: "neutral",
    cefr: "B1",
  },
  "trabajar-future": {
    id: "trabajar-future",
    lemma: "trabajar (future)",
    pos: "verb",
    gender: "n/a",
    gloss: "to work — will work",
    meaningSummary:
      "Regular -ar future: trabajaré, trabajarás, trabajará, trabajaremos, trabajarán.",
    conjugations: LATAM_FUTURE([
      "trabajaré",
      "trabajarás",
      "trabajará",
      "trabajaremos",
      "trabajarán",
    ]),
    examples: [
      { es: "Trabajaré desde casa mañana.", en: "I will work from home tomorrow." },
      { es: "Ellos trabajarán en el proyecto.", en: "They will work on the project." },
    ],
    useWhen: "Future work plans.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "B1",
  },
  "ir-future": {
    id: "ir-future",
    lemma: "ir (future)",
    pos: "verb",
    gender: "n/a",
    gloss: "to go — will go",
    meaningSummary:
      "Irregular future stem ir-: iré, irás, irá, iremos, irán.",
    conjugations: LATAM_FUTURE(["iré", "irás", "irá", "iremos", "irán"]),
    examples: [
      { es: "Iré al médico la próxima semana.", en: "I will go to the doctor next week." },
      { es: "¿Irás a la universidad mañana?", en: "Will you go to the university tomorrow?" },
    ],
    useWhen: "Future movement / appointments.",
    dontUseWhen: "Near plans often use voy a ir.",
    formality: "neutral",
    cefr: "B1",
  },
  "tener-future": {
    id: "tener-future",
    lemma: "tener (future)",
    pos: "verb",
    gender: "n/a",
    gloss: "to have — will have",
    meaningSummary:
      "Irregular future stem tendr-: tendré, tendrás, tendrá, tendremos, tendrán.",
    conjugations: LATAM_FUTURE([
      "tendré",
      "tendrás",
      "tendrá",
      "tendremos",
      "tendrán",
    ]),
    examples: [
      { es: "Tendré una reunión a las once.", en: "I will have a meeting at eleven." },
      { es: "¿Tendrás tiempo mañana?", en: "Will you have time tomorrow?" },
    ],
    useWhen: "Future possession, meetings, time.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "B1",
  },
  deberia: {
    id: "deberia",
    lemma: "debería…",
    pos: "phrase",
    gender: "n/a",
    gloss: "I/you should… (soft advice)",
    meaningSummary:
      "Light conditional advice: Debería descansar / Deberías ir al médico. Softer than tienes que.",
    examples: [
      { es: "Debería descansar hoy.", en: "I should rest today." },
      { es: "Deberías tomar la medicina.", en: "You should take the medicine." },
    ],
    useWhen: "Gentle advice about health or plans.",
    dontUseWhen: "For a hard rule, tienes que / hay que is stronger.",
    contrast: "tienes que… / me gustaría…",
    formality: "neutral",
    cefr: "B1",
  },
  "me-gustaria": {
    id: "me-gustaria",
    lemma: "me gustaría…",
    pos: "phrase",
    gender: "n/a",
    gloss: "I would like…",
    meaningSummary:
      "Soft want / conditional preference: Me gustaría trabajar desde casa / Me gustaría descansar. Polite plans and wishes.",
    examples: [
      { es: "Me gustaría terminar el proyecto pronto.", en: "I would like to finish the project soon." },
      { es: "Me gustaría ir al médico mañana.", en: "I would like to go to the doctor tomorrow." },
    ],
    useWhen: "Polite wishes and soft plans.",
    dontUseWhen: "For a firm order, quiero is more direct.",
    contrast: "quiero… / te gustaría…",
    formality: "neutral",
    cefr: "A2",
  },
  "me-duele": {
    id: "me-duele",
    lemma: "me duele…",
    pos: "phrase",
    gender: "n/a",
    gloss: "… hurts me / I have a pain in…",
    meaningSummary:
      "Body pain with doler: Me duele la cabeza / Me duelen los pies. Singular duele / plural duelen with the body part.",
    examples: [
      { es: "Me duele la cabeza.", en: "My head hurts." },
      { es: "Me duelen los pies después del trabajo.", en: "My feet hurt after work." },
    ],
    useWhen: "Saying what hurts.",
    dontUseWhen: "Don't say mi cabeza duele — prefer Me duele la cabeza.",
    formality: "neutral",
    cefr: "A2",
  },
  enfermo: {
    id: "enfermo",
    lemma: "enfermo/a",
    pos: "adjective",
    gender: "mf",
    gloss: "sick / ill",
    meaningSummary:
      "Feeling sick: Estoy enfermo / Estoy enferma. Pair with descansar and médico.",
    examples: [
      { es: "Hoy estoy enfermo.", en: "Today I'm sick." },
      { es: "Mi colega está enferma.", en: "My colleague is sick." },
    ],
    useWhen: "Health status.",
    dontUseWhen: "For 'I feel bad emotionally', mal / triste may fit better.",
    contrast: "bien / mal",
    formality: "neutral",
    cefr: "A2",
  },
  "estoy-bien": {
    id: "estoy-bien",
    lemma: "estoy bien / estoy mal",
    pos: "phrase",
    gender: "n/a",
    gloss: "I'm well / I'm unwell",
    meaningSummary:
      "Health check-in: Estoy bien / No estoy bien / Estoy mal. Common reply to ¿Cómo estás?",
    examples: [
      { es: "Estoy bien, gracias.", en: "I'm well, thanks." },
      { es: "Hoy no estoy bien.", en: "Today I'm not well." },
    ],
    useWhen: "Answering how you feel.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "A1",
  },
  medico: {
    id: "medico",
    lemma: "el médico / la médica",
    pos: "noun",
    gender: "mf",
    gloss: "doctor",
    meaningSummary:
      "Doctor visit talk: Voy al médico / Hablo con la médica. Also doctora is common.",
    examples: [
      { es: "Voy al médico mañana.", en: "I'm going to the doctor tomorrow." },
      { es: "El médico me dio una receta.", en: "The doctor gave me a prescription." },
    ],
    useWhen: "Appointments and health advice.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "A2",
  },
  cita: {
    id: "cita",
    lemma: "la cita",
    pos: "noun",
    gender: "f",
    gloss: "appointment (also date)",
    meaningSummary:
      "Scheduled appointment: Tengo una cita con el médico / ¿Puedo hacer una cita? Context also means a romantic date — here focus on appointments.",
    examples: [
      { es: "Tengo una cita a las tres.", en: "I have an appointment at three." },
      { es: "Quiero hacer una cita.", en: "I want to make an appointment." },
    ],
    useWhen: "Doctor, office, or service appointments.",
    dontUseWhen: "If you mean a romantic date, say so clearly — same word, different context.",
    formality: "neutral",
    cefr: "B1",
  },
  farmacia: {
    id: "farmacia",
    lemma: "la farmacia",
    pos: "noun",
    gender: "f",
    gloss: "pharmacy",
    meaningSummary:
      "Where you buy medicine: Voy a la farmacia / ¿Dónde está la farmacia?",
    examples: [
      { es: "Voy a la farmacia por la medicina.", en: "I'm going to the pharmacy for the medicine." },
      { es: "La farmacia está cerca.", en: "The pharmacy is nearby." },
    ],
    useWhen: "Buying medicine or asking for a pharmacy.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "A2",
  },
  medicina: {
    id: "medicina",
    lemma: "la medicina",
    pos: "noun",
    gender: "f",
    gloss: "medicine / medication",
    meaningSummary:
      "Medication: Tomo la medicina / Necesito medicina para la fiebre.",
    examples: [
      { es: "Debo tomar la medicina.", en: "I should take the medicine." },
      { es: "¿Tienes medicina para el dolor?", en: "Do you have medicine for the pain?" },
    ],
    useWhen: "Talking about medication.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "A2",
  },
  fiebre: {
    id: "fiebre",
    lemma: "la fiebre",
    pos: "noun",
    gender: "f",
    gloss: "fever",
    meaningSummary:
      "Fever symptom: Tengo fiebre / No tengo fiebre, solo me duele la cabeza.",
    examples: [
      { es: "Tengo fiebre y me duele la cabeza.", en: "I have a fever and my head hurts." },
      { es: "¿Tienes fiebre?", en: "Do you have a fever?" },
    ],
    useWhen: "Describing illness symptoms.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "A2",
  },
  dolor: {
    id: "dolor",
    lemma: "el dolor",
    pos: "noun",
    gender: "m",
    gloss: "pain / ache",
    meaningSummary:
      "Pain noun: Tengo dolor de cabeza / El dolor es fuerte. Pairs with me duele…",
    examples: [
      { es: "Tengo dolor de cabeza.", en: "I have a headache." },
      { es: "El dolor pasó después de la medicina.", en: "The pain went away after the medicine." },
    ],
    useWhen: "Naming pain types.",
    dontUseWhen: "Me duele… is often more natural than tengo un dolor in casual talk.",
    contrast: "me duele…",
    formality: "neutral",
    cefr: "A2",
  },
  resfriado: {
    id: "resfriado",
    lemma: "el resfriado",
    pos: "noun",
    gender: "m",
    gloss: "cold (illness)",
    meaningSummary:
      "Common cold: Tengo un resfriado / Estoy resfriado/a. Everyday travel and work excuse.",
    examples: [
      { es: "Tengo un resfriado.", en: "I have a cold." },
      { es: "No voy a la reunión — tengo un resfriado.", en: "I'm not going to the meeting — I have a cold." },
    ],
    useWhen: "Mild illness talk.",
    dontUseWhen: "For flu, gripe is the usual word.",
    contrast: "gripe (flu)",
    formality: "neutral",
    cefr: "A2",
  },
};

export const UNIT10_LESSONS: Record<string, Lesson> = {
  "u10-l1": {
    id: "u10-l1", unitId: "unit-10", title: "Work & studies: meetings and projects",
    description: "Word Cards first — reunión, proyecto, colega, universidad.", xpReward: 44,
    exercises: [
      teach("teach-u10l1-reunion", "reunion"),
      { id: "u10l1-1", type: "select", prompt: "‘I have a meeting at ten’ is…", options: ["Tengo una reunión a las diez.", "Tengo un resfriado a las diez.", "Me duele una reunión.", "Iré un proyecto."], correctIndex: 0, explanation: "Tengo una reunión a las diez.", wordCardIds: ["reunion", "a-las"], xp: 3 },
      teach("teach-u10l1-proyecto", "proyecto"),
      { id: "u10l1-2", type: "tap-chips", prompt: "Build: ‘I work on an important project.’", chips: ["Trabajo", "en", "un", "proyecto", "importante.", "fiebre", "farmacia"], correctOrder: ["Trabajo", "en", "un", "proyecto", "importante."], explanation: "Trabajo en un proyecto importante.", wordCardIds: ["proyecto", "trabajar"], xp: 3 },
      teach("teach-u10l1-colega", "colega"),
      { id: "u10l1-3", type: "translate", prompt: "Translate: ‘My colleague works from home.’", acceptedAnswers: ["Mi colega trabaja desde casa.", "Mi colega trabaja desde casa"], hint: "colega + desde casa", explanation: "Mi colega trabaja desde casa.", wordCardIds: ["colega", "desde-casa"], xp: 4 },
      teach("teach-u10l1-uni", "universidad"),
      listen("u10l1-4", "¿A qué hora es la reunión?", ["What time is the meeting?", "Where is the pharmacy?", "Do you have a fever?", "Will you travel?"], 0, "¿A qué hora es la reunión?", ["reunion"]),
      { id: "u10l1-5", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "I study at the university.", template: "Estudio en la ___.", acceptedAnswers: ["universidad", "Universidad"], hint: "university", explanation: "Estudio en la universidad.", wordCardIds: ["universidad", "estudiar"], xp: 3 },
      { id: "u10l1-6", type: "match-pairs", prompt: "Match work/school words.", pairs: [{ left: "la reunión", right: "the meeting" }, { left: "el proyecto", right: "the project" }, { left: "el colega", right: "the colleague" }, { left: "la universidad", right: "the university" }], explanation: "Core work & studies lemmas.", wordCardIds: ["reunion", "proyecto", "colega", "universidad"], xp: 4 },
      conjugate("u10l1-conj-1", "trabajar", "yo", "Present indicative", ["trabajo", "Trabajo"], "yo + trabajar → trabajo.", ["trabajar"], { hint: "trabajo" }),
    ],
  },
  "u10-l2": {
    id: "u10-l2", unitId: "unit-10", title: "Career talk & email",
    description: "Carrera, entrevista, correo, desde casa.", xpReward: 44,
    exercises: [
      teach("teach-u10l2-carrera", "carrera"),
      { id: "u10l2-1", type: "select", prompt: "Ask: ‘What major are you studying?’", options: ["¿Qué carrera estudias?", "¿Qué fiebre estudias?", "¿Qué farmacia comes?", "¿Qué dolor trabajas?"], correctIndex: 0, explanation: "¿Qué carrera estudias?", wordCardIds: ["carrera", "estudiar"], xp: 3 },
      teach("teach-u10l2-entrevista", "entrevista"),
      { id: "u10l2-2", type: "tap-chips", prompt: "Build: ‘I have an interview tomorrow.’", chips: ["Tengo", "una", "entrevista", "mañana.", "resfriado", "metro"], correctOrder: ["Tengo", "una", "entrevista", "mañana."], explanation: "Tengo una entrevista mañana.", wordCardIds: ["entrevista", "manana"], xp: 3 },
      teach("teach-u10l2-correo", "correo"),
      { id: "u10l2-3", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "I'll send you an email today.", template: "Te envío un ___ hoy.", acceptedAnswers: ["correo", "Correo"], hint: "email", explanation: "Te envío un correo hoy.", wordCardIds: ["correo", "hoy"], xp: 3 },
      teach("teach-u10l2-casa", "desde-casa"),
      listen("u10l2-4", "Trabajo desde casa tres días.", ["I work from home three days.", "I have a fever three days.", "I go to the pharmacy.", "I book a flight."], 0, "Trabajo desde casa tres días.", ["desde-casa", "trabajar"]),
      { id: "u10l2-5", type: "situational-choose", prompt: "Pick the best line.", situation: "A coworker asks how you work this week; you are remote.", options: ["Trabajo desde casa.", "Tengo fiebre de proyecto.", "Me duele el correo.", "Voy a la farmacia a la reunión."], correctIndex: 0, explanation: "Trabajo desde casa.", wordCardIds: ["desde-casa"], xp: 3 },
      { id: "u10l2-6", type: "match-pairs", prompt: "Match career phrases.", pairs: [{ left: "la carrera", right: "the degree / major" }, { left: "la entrevista", right: "the interview" }, { left: "el correo", right: "the email" }, { left: "desde casa", right: "from home" }], explanation: "Career toolkit.", wordCardIds: ["carrera", "entrevista", "correo", "desde-casa"], xp: 4 },
      { id: "u10l2-7", type: "translate", prompt: "Translate: ‘The interview went well.’", acceptedAnswers: ["La entrevista fue bien.", "La entrevista fue bien", "La entrevista salió bien."], hint: "fue bien", explanation: "La entrevista fue bien.", wordCardIds: ["entrevista"], xp: 4 },
      conjugate("u10l2-conj-1", "estudiar", "tú", "Present indicative", ["estudias", "Estudias"], "tú + estudiar → estudias.", ["estudiar"], { hint: "estudias" }),
    ],
  },
  "u10-l3": {
    id: "u10-l3", unitId: "unit-10", title: "Soft plans: me gustaría & debería",
    description: "Polite wishes and light advice — conditional feel.", xpReward: 44,
    exercises: [
      teach("teach-u10l3-gustaria", "me-gustaria"),
      { id: "u10l3-1", type: "select", prompt: "‘I would like to finish the project soon’ starts with…", options: ["Me gustaría…", "Me duele…", "Tengo fiebre…", "La farmacia…"], correctIndex: 0, explanation: "Me gustaría terminar el proyecto pronto.", wordCardIds: ["me-gustaria", "proyecto"], xp: 3 },
      teach("teach-u10l3-deberia", "deberia"),
      { id: "u10l3-2", type: "tap-chips", prompt: "Build: ‘I should rest today.’", chips: ["Debería", "descansar", "hoy.", "entrevista", "metro"], correctOrder: ["Debería", "descansar", "hoy."], explanation: "Debería descansar hoy.", wordCardIds: ["deberia", "descansar", "hoy"], xp: 3 },
      { id: "u10l3-3", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "You should talk with your colleague.", template: "___ hablar con tu colega.", acceptedAnswers: ["Deberías", "Deberias", "deberías", "deberias"], hint: "you should", explanation: "Deberías hablar con tu colega.", wordCardIds: ["deberia", "colega"], xp: 3 },
      listen("u10l3-4", "Me gustaría trabajar desde casa.", ["I would like to work from home.", "I have a cold at home.", "My head hurts at home.", "I booked the pharmacy."], 0, "Me gustaría trabajar desde casa.", ["me-gustaria", "desde-casa"]),
      { id: "u10l3-5", type: "situational-choose", prompt: "Pick the soft advice.", situation: "A friend looks tired after work.", options: ["Deberías descansar.", "Debes comer el proyecto.", "Me duele tu colega.", "Iré la fiebre."], correctIndex: 0, explanation: "Deberías descansar.", wordCardIds: ["deberia", "descansar"], xp: 3 },
      { id: "u10l3-6", type: "match-pairs", prompt: "Match soft plan phrases.", pairs: [{ left: "Me gustaría…", right: "I would like…" }, { left: "Debería…", right: "I should…" }, { left: "Deberías…", right: "You should…" }, { left: "descansar", right: "to rest" }], explanation: "Soft plans toolkit.", wordCardIds: ["me-gustaria", "deberia", "descansar"], xp: 4 },
      { id: "u10l3-7", type: "translate", prompt: "Translate: ‘I would like to go to the meeting.’", acceptedAnswers: ["Me gustaría ir a la reunión.", "Me gustaria ir a la reunion.", "Me gustaría ir a la reunion."], hint: "Me gustaría ir…", explanation: "Me gustaría ir a la reunión.", wordCardIds: ["me-gustaria", "reunion"], xp: 4 },
      { id: "u10l3-8", type: "select", prompt: "Reuse: ‘Sounds good to me’ is…", options: ["Me parece bien.", "Me duele bien.", "Tengo fiebre bien.", "Desde casa bien."], correctIndex: 0, explanation: "Me parece bien — from Unit 8/9.", wordCardIds: ["me-parece"], xp: 2 },
    ],
  },
  "u10-l4": {
    id: "u10-l4", unitId: "unit-10", title: "Near future: ir a + time frames",
    description: "Deepen voy a… with próxima semana / próximo mes.", xpReward: 46,
    exercises: [
      teach("teach-u10l4-ira", "ir-a-deep"),
      { id: "u10l4-1", type: "select", prompt: "‘I'm going to send an email tomorrow’ is…", options: ["Voy a enviar un correo mañana.", "Fui a enviar un correo ayer solo.", "Me duele enviar un correo.", "Tengo fiebre el correo."], correctIndex: 0, explanation: "Voy a enviar un correo mañana.", wordCardIds: ["ir-a-deep", "correo", "manana"], xp: 3 },
      teach("teach-u10l4-semana", "la-proxima-semana"),
      { id: "u10l4-2", type: "tap-chips", prompt: "Build: ‘I'm going to finish the project next week.’", chips: ["Voy", "a", "terminar", "el", "proyecto", "la", "próxima", "semana.", "fiebre"], correctOrder: ["Voy", "a", "terminar", "el", "proyecto", "la", "próxima", "semana."], explanation: "Voy a terminar el proyecto la próxima semana.", wordCardIds: ["ir-a-deep", "proyecto", "la-proxima-semana"], xp: 3 },
      teach("teach-u10l4-mes", "el-proximo-mes"),
      { id: "u10l4-3", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "Next month I start a new project.", template: "El próximo ___ empiezo un proyecto nuevo.", acceptedAnswers: ["mes", "Mes"], hint: "month", explanation: "El próximo mes empiezo un proyecto nuevo.", wordCardIds: ["el-proximo-mes", "proyecto"], xp: 3 },
      listen("u10l4-4", "¿Vas a ir a la reunión?", ["Are you going to go to the meeting?", "Do you have a fever?", "Where is the pharmacy?", "Will you take medicine?"], 0, "¿Vas a ir a la reunión?", ["ir-a-deep", "reunion"]),
      { id: "u10l4-5", type: "situational-choose", prompt: "Pick the best line.", situation: "Someone asks your plan for next week.", options: ["Voy a trabajar desde casa la próxima semana.", "Tuve fiebre la próxima semana.", "Me duele el próximo mes.", "Comí la reunión."], correctIndex: 0, explanation: "Voy a trabajar desde casa la próxima semana.", wordCardIds: ["ir-a-deep", "desde-casa", "la-proxima-semana"], xp: 3 },
      { id: "u10l4-6", type: "match-pairs", prompt: "Match future time frames.", pairs: [{ left: "mañana", right: "tomorrow" }, { left: "la próxima semana", right: "next week" }, { left: "el próximo mes", right: "next month" }, { left: "voy a…", right: "I'm going to…" }], explanation: "Near-future scaffolding.", wordCardIds: ["manana", "la-proxima-semana", "el-proximo-mes", "ir-a-deep"], xp: 4 },
      { id: "u10l4-7", type: "translate", prompt: "Translate: ‘Are you going to study next week?’ (tú)", acceptedAnswers: ["¿Vas a estudiar la próxima semana?", "Vas a estudiar la próxima semana?", "¿Vas a estudiar la proxima semana?"], hint: "Vas a estudiar…", explanation: "¿Vas a estudiar la próxima semana?", wordCardIds: ["ir-a-deep", "estudiar", "la-proxima-semana"], xp: 4 },
      conjugate("u10l4-conj-1", "ir", "nosotros/as", "Present indicative", ["vamos", "Vamos"], "nosotros + ir → vamos (as in vamos a…).", ["ir-a-deep", "ir"], { hint: "vamos" }),
    ],
  },
  "u10-l5": {
    id: "u10-l5", unitId: "unit-10", title: "Simple future intro",
    description: "Hablaré, trabajaré, iré, tendré — will / shall forms.", xpReward: 46,
    exercises: [
      teach("teach-u10l5-fut", "futuro-simple"),
      { id: "u10l5-1", type: "select", prompt: "The simple future is great for…", options: ["Will / shall plans and predictions", "Only past habits", "Only ordering juice", "Only greetings"], correctIndex: 0, explanation: "hablaré / trabajaré — will forms.", wordCardIds: ["futuro-simple"], xp: 3 },
      teach("teach-u10l5-hablar", "hablar-future"),
      { id: "u10l5-2", type: "select", prompt: "yo + hablar (future) is…", options: ["hablaré", "hablaba", "hablé", "hablo ayer"], correctIndex: 0, explanation: "hablaré.", wordCardIds: ["hablar-future"], xp: 3 },
      teach("teach-u10l5-trabajar", "trabajar-future"),
      { id: "u10l5-3", type: "tap-chips", prompt: "Build: ‘I will work from home tomorrow.’", chips: ["Trabajaré", "desde", "casa", "mañana.", "iba", "fiebre"], correctOrder: ["Trabajaré", "desde", "casa", "mañana."], explanation: "Trabajaré desde casa mañana.", wordCardIds: ["trabajar-future", "desde-casa", "manana"], xp: 3 },
      teach("teach-u10l5-ir", "ir-future"),
      { id: "u10l5-4", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "I will go to the doctor next week.", template: "___ al médico la próxima semana.", acceptedAnswers: ["Iré", "Ire", "iré", "ire"], hint: "ir future — yo", explanation: "Iré al médico la próxima semana.", wordCardIds: ["ir-future", "medico", "la-proxima-semana"], xp: 3 },
      teach("teach-u10l5-tener", "tener-future"),
      listen("u10l5-5", "Tendré una reunión a las once.", ["I will have a meeting at eleven.", "I had a fever at eleven.", "I booked the pharmacy.", "I used to work at eleven."], 0, "Tendré una reunión a las once.", ["tener-future", "reunion", "a-las"]),
      { id: "u10l5-6", type: "match-pairs", prompt: "Match future forms.", pairs: [{ left: "hablaré", right: "I will speak" }, { left: "trabajaré", right: "I will work" }, { left: "iré", right: "I will go" }, { left: "tendré", right: "I will have" }], explanation: "High-frequency future starters.", wordCardIds: ["hablar-future", "trabajar-future", "ir-future", "tener-future"], xp: 4 },
      { id: "u10l5-7", type: "situational-choose", prompt: "Pick the best line.", situation: "Promise a coworker you will email them.", options: ["Te enviaré un correo mañana.", "Te envié un resfriado.", "Me duele el correo ayer.", "Íbamos la farmacia."], correctIndex: 0, explanation: "Te enviaré un correo mañana.", wordCardIds: ["correo", "manana"], xp: 3 },
    ],
  },
  "u10-l6": {
    id: "u10-l6", unitId: "unit-10", title: "Future conjugations",
    description: "Drill hablar, trabajar, ir, tener in simple future.", xpReward: 48,
    exercises: [
      conjugate("u10l6-1", "hablar", "yo", "Simple future", ["hablaré", "hablare", "Hablaré"], "yo + hablar → hablaré.", ["hablar-future"], { hint: "hablaré" }),
      conjugate("u10l6-2", "hablar", "tú", "Simple future", ["hablarás", "hablaras", "Hablarás"], "tú + hablar → hablarás.", ["hablar-future"], { hint: "hablarás" }),
      conjugate("u10l6-3", "trabajar", "yo", "Simple future", ["trabajaré", "trabajare", "Trabajaré"], "yo + trabajar → trabajaré.", ["trabajar-future"], { hint: "trabajaré" }),
      conjugate("u10l6-4", "trabajar", "ustedes", "Simple future", ["trabajarán", "trabajaran", "Trabajarán"], "ustedes + trabajar → trabajarán.", ["trabajar-future"], { hint: "trabajarán" }),
      conjugate("u10l6-5", "ir", "yo", "Simple future", ["iré", "ire", "Iré"], "yo + ir → iré.", ["ir-future"], { hint: "iré" }),
      conjugate("u10l6-6", "ir", "nosotros/as", "Simple future", ["iremos", "Iremos"], "nosotros + ir → iremos.", ["ir-future"], { hint: "iremos" }),
      conjugate("u10l6-7", "tener", "yo", "Simple future", ["tendré", "tendre", "Tendré"], "yo + tener → tendré.", ["tener-future"], { hint: "tendré" }),
      conjugate("u10l6-8", "tener", "tú", "Simple future", ["tendrás", "tendras", "Tendrás"], "tú + tener → tendrás.", ["tener-future"], { hint: "tendrás" }),
      { id: "u10l6-9", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "You (tú) will have time tomorrow.", template: "Tú ___ tiempo mañana.", acceptedAnswers: ["tendrás", "tendras", "Tendrás"], hint: "tener future", explanation: "Tú tendrás tiempo mañana.", wordCardIds: ["tener-future", "manana"], xp: 3 },
      listen("u10l6-10", "Hablaré con mi colega mañana.", ["I will talk with my colleague tomorrow.", "I had a cold tomorrow.", "I booked the pharmacy.", "I used to eat tomorrow."], 0, "Hablaré con mi colega mañana.", ["hablar-future", "colega", "manana"]),
      { id: "u10l6-11", type: "match-pairs", prompt: "Future check.", pairs: [{ left: "yo iré", right: "I will go" }, { left: "tú trabajarás", right: "you will work" }, { left: "nosotros hablaremos", right: "we will speak" }, { left: "ustedes tendrán", right: "you all will have" }], explanation: "Keep future forms warm.", wordCardIds: ["ir-future", "trabajar-future", "hablar-future", "tener-future"], xp: 4 },
    ],
  },
  "u10-l7": {
    id: "u10-l7", unitId: "unit-10", title: "Health: feeling well or ill",
    description: "Me duele, enfermo, estoy bien/mal, resfriado, fiebre.", xpReward: 44,
    exercises: [
      teach("teach-u10l7-duele", "me-duele"),
      { id: "u10l7-1", type: "select", prompt: "‘My head hurts’ is…", options: ["Me duele la cabeza.", "Mi cabeza duele yo.", "Tengo reunión la cabeza.", "Iré la cabeza."], correctIndex: 0, explanation: "Me duele la cabeza.", wordCardIds: ["me-duele", "dolor"], xp: 3 },
      teach("teach-u10l7-enfermo", "enfermo"),
      teach("teach-u10l7-bien", "estoy-bien"),
      { id: "u10l7-2", type: "tap-chips", prompt: "Build: ‘Today I'm sick.’", chips: ["Hoy", "estoy", "enfermo.", "proyecto", "metro"], correctOrder: ["Hoy", "estoy", "enfermo."], explanation: "Hoy estoy enfermo.", wordCardIds: ["enfermo", "hoy"], xp: 3 },
      teach("teach-u10l7-fiebre", "fiebre"),
      { id: "u10l7-3", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "I have a fever and my head hurts.", template: "Tengo ___ y me duele la cabeza.", acceptedAnswers: ["fiebre", "Fiebre"], hint: "fever", explanation: "Tengo fiebre y me duele la cabeza.", wordCardIds: ["fiebre", "me-duele"], xp: 3 },
      teach("teach-u10l7-resfriado", "resfriado"),
      listen("u10l7-4", "Tengo un resfriado.", ["I have a cold.", "I have a meeting.", "I will travel.", "I work from home."], 0, "Tengo un resfriado.", ["resfriado"]),
      teach("teach-u10l7-dolor", "dolor"),
      { id: "u10l7-5", type: "situational-choose", prompt: "Pick the best reply.", situation: "A friend asks ¿Cómo estás? and you feel unwell.", options: ["Hoy no estoy bien.", "Hoy tengo una carrera de jugo.", "Hoy voy a la reunión de farmacia solo para saludar.", "Hoy hablaba el imperfecto."], correctIndex: 0, explanation: "Hoy no estoy bien.", wordCardIds: ["estoy-bien"], xp: 3 },
      { id: "u10l7-6", type: "match-pairs", prompt: "Match health phrases.", pairs: [{ left: "me duele", right: "it hurts me" }, { left: "estoy enfermo", right: "I'm sick" }, { left: "tengo fiebre", right: "I have a fever" }, { left: "un resfriado", right: "a cold" }], explanation: "Health toolkit.", wordCardIds: ["me-duele", "enfermo", "fiebre", "resfriado"], xp: 4 },
      { id: "u10l7-7", type: "translate", prompt: "Translate: ‘I have a headache.’", acceptedAnswers: ["Tengo dolor de cabeza.", "Me duele la cabeza.", "Tengo un dolor de cabeza."], hint: "dolor de cabeza / me duele", explanation: "Tengo dolor de cabeza / Me duele la cabeza.", wordCardIds: ["dolor", "me-duele"], xp: 4 },
    ],
  },
  "u10-l8": {
    id: "u10-l8", unitId: "unit-10", title: "Appointments & pharmacy",
    description: "Cita, médico, farmacia, medicina + soft advice.", xpReward: 44,
    exercises: [
      teach("teach-u10l8-cita", "cita"),
      { id: "u10l8-1", type: "select", prompt: "‘I have an appointment at three’ is…", options: ["Tengo una cita a las tres.", "Tengo un colega a las tres solo.", "Me duele una cita.", "Voy a la universidad de fiebre."], correctIndex: 0, explanation: "Tengo una cita a las tres.", wordCardIds: ["cita", "a-las"], xp: 3 },
      teach("teach-u10l8-medico", "medico"),
      { id: "u10l8-2", type: "tap-chips", prompt: "Build: ‘I'm going to the doctor tomorrow.’", chips: ["Voy", "al", "médico", "mañana.", "proyecto", "correo"], correctOrder: ["Voy", "al", "médico", "mañana."], explanation: "Voy al médico mañana.", wordCardIds: ["medico", "manana"], xp: 3 },
      teach("teach-u10l8-farmacia", "farmacia"),
      teach("teach-u10l8-medicina", "medicina"),
      { id: "u10l8-3", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "I'm going to the pharmacy for the medicine.", template: "Voy a la ___ por la medicina.", acceptedAnswers: ["farmacia", "Farmacia"], hint: "pharmacy", explanation: "Voy a la farmacia por la medicina.", wordCardIds: ["farmacia", "medicina"], xp: 3 },
      listen("u10l8-4", "Quiero hacer una cita.", ["I want to make an appointment.", "I want to eat a project.", "I will work from fever.", "I booked a flight only."], 0, "Quiero hacer una cita.", ["cita"]),
      { id: "u10l8-5", type: "situational-choose", prompt: "Pick the soft advice.", situation: "A coworker has a bad cold.", options: ["Deberías ir al médico.", "Deberías enviar la fiebre al aeropuerto.", "Deberías comer el proyecto.", "Íbamos la entrevista."], correctIndex: 0, explanation: "Deberías ir al médico.", wordCardIds: ["deberia", "medico"], xp: 3 },
      { id: "u10l8-6", type: "match-pairs", prompt: "Match appointment phrases.", pairs: [{ left: "la cita", right: "the appointment" }, { left: "el médico", right: "the doctor" }, { left: "la farmacia", right: "the pharmacy" }, { left: "la medicina", right: "the medicine" }], explanation: "Clinic toolkit.", wordCardIds: ["cita", "medico", "farmacia", "medicina"], xp: 4 },
      { id: "u10l8-7", type: "translate", prompt: "Translate: ‘You should take the medicine.’ (tú)", acceptedAnswers: ["Deberías tomar la medicina.", "Deberias tomar la medicina.", "Debes tomar la medicina."], hint: "Deberías tomar…", explanation: "Deberías tomar la medicina.", wordCardIds: ["deberia", "medicina"], xp: 4 },
      listen("u10l8-8", "La farmacia está cerca.", ["The pharmacy is nearby.", "The meeting is nearby.", "I have a fever nearby.", "I will work nearby."], 0, "La farmacia está cerca.", ["farmacia", "cerca"]),
    ],
  },
  "u10-l9": {
    id: "u10-l9", unitId: "unit-10", title: "Story: Work, plans & feeling better",
    description: "Story-listen + comprehension — work, future, health.", xpReward: 48,
    exercises: [
      storyListen(
        "u10l9-story", "Planes y bienestar",
        [
          { text: "Mañana voy a trabajar desde casa.", en: "Tomorrow I'm going to work from home." },
          { text: "Tendré una reunión por la mañana.", en: "I will have a meeting in the morning." },
          { text: "Hoy no estoy bien — me duele la cabeza.", en: "Today I'm not well — my head hurts." },
          { text: "Mi colega dice: deberías ir a la farmacia.", en: "My colleague says: you should go to the pharmacy." },
          { text: "De acuerdo. Compraré medicina y descansaré.", en: "Agreed. I'll buy medicine and I'll rest." },
        ],
        [
          { prompt: "Where will the narrator work tomorrow?", options: ["From home", "Only at the airport", "At the pharmacy forever", "Nowhere"], correctIndex: 0, explanation: "Mañana voy a trabajar desde casa." },
          { prompt: "What will they have in the morning?", options: ["A meeting", "A flight only", "Nothing", "A new car"], correctIndex: 0, explanation: "Tendré una reunión por la mañana." },
          { prompt: "How does the narrator feel today?", options: ["Not well — head hurts", "Perfect forever", "Only hungry for juice", "Lost at the hotel"], correctIndex: 0, explanation: "Hoy no estoy bien — me duele la cabeza." },
          { prompt: "What does the colleague suggest?", options: ["Go to the pharmacy", "Cancel Spanish", "Eat the passport", "Skip rest forever"], correctIndex: 0, explanation: "Deberías ir a la farmacia." },
        ],
        ["manana", "ir-a-deep", "desde-casa", "tener-future", "reunion", "estoy-bien", "me-duele", "colega", "deberia", "farmacia", "de-acuerdo", "medicina", "descansar"],
        "Work-and-wellbeing story — Neural2 voice rotation.", 12
      ),
      { id: "u10l9-1", type: "select", prompt: "From the story — soft advice was…", options: ["Deberías ir a la farmacia.", "Debes comer el proyecto.", "Íbamos al imperfecto.", "Fui la entrevista."], correctIndex: 0, explanation: "Deberías ir a la farmacia.", wordCardIds: ["deberia", "farmacia"], xp: 3 },
      { id: "u10l9-2", type: "match-pairs", prompt: "Match story details.", pairs: [{ left: "tomorrow", right: "work from home" }, { left: "morning", right: "a meeting" }, { left: "today", right: "head hurts" }, { left: "plan", right: "buy medicine and rest" }], explanation: "Story comprehension.", wordCardIds: ["desde-casa", "reunion", "me-duele", "medicina"], xp: 4 },
      listen("u10l9-3", "De acuerdo. Compraré medicina y descansaré.", ["They agree to buy medicine and rest.", "They cancel the meeting forever.", "They fly tonight only.", "They disagree with rest."], 0, "The final plan.", ["de-acuerdo", "medicina", "descansar"]),
    ],
  },
  "u10-l10": {
    id: "u10-l10", unitId: "unit-10", title: "Cloze & dictation from the story",
    description: "Story lines — cloze, dictation, and listen.", xpReward: 48,
    exercises: [
      dictation("u10l10-dict-1", "Mañana voy a trabajar desde casa.", ["Mañana voy a trabajar desde casa.", "Manana voy a trabajar desde casa."], "Type the line you heard.", ["manana", "ir-a-deep", "desde-casa"], { hint: "Replay if needed", voice: "f" }),
      cloze("u10l10-cloze-1", "Mañana voy a trabajar desde ___.", ["casa", "Casa"], "Mañana voy a trabajar desde casa.", ["desde-casa"], { hint: "home", audioText: "Mañana voy a trabajar desde casa.", voice: "f" }),
      dictation("u10l10-dict-2", "Tendré una reunión por la mañana.", ["Tendré una reunión por la mañana.", "Tendre una reunion por la mañana.", "Tendré una reunion por la mañana."], "Type the line you heard.", ["tener-future", "reunion"], { hint: "Replay if needed", voice: "m" }),
      cloze("u10l10-cloze-2", "___ una reunión por la mañana.", ["Tendré", "Tendre", "tendré", "tendre"], "Tendré una reunión por la mañana.", ["tener-future", "reunion"], { hint: "I will have", audioText: "Tendré una reunión por la mañana.", voice: "m" }),
      dictation("u10l10-dict-3", "Hoy no estoy bien — me duele la cabeza.", ["Hoy no estoy bien — me duele la cabeza.", "Hoy no estoy bien, me duele la cabeza.", "Hoy no estoy bien - me duele la cabeza."], "Type the line you heard.", ["estoy-bien", "me-duele"], { hint: "Replay if needed", voice: "c" }),
      cloze("u10l10-cloze-3", "Hoy no estoy bien — me ___ la cabeza.", ["duele", "Duele"], "Hoy no estoy bien — me duele la cabeza.", ["me-duele"], { hint: "hurts", audioText: "Hoy no estoy bien — me duele la cabeza.", voice: "c" }),
      dictation("u10l10-dict-4", "Mi colega dice: deberías ir a la farmacia.", ["Mi colega dice: deberías ir a la farmacia.", "Mi colega dice: deberias ir a la farmacia."], "Type the line you heard.", ["colega", "deberia", "farmacia"], { hint: "Replay if needed", voice: "f" }),
      cloze("u10l10-cloze-4", "Mi colega dice: deberías ir a la ___.", ["farmacia", "Farmacia"], "Mi colega dice: deberías ir a la farmacia.", ["deberia", "farmacia", "colega"], { hint: "pharmacy", audioText: "Mi colega dice: deberías ir a la farmacia.", voice: "f" }),
      dictation("u10l10-dict-5", "De acuerdo. Compraré medicina y descansaré.", ["De acuerdo. Compraré medicina y descansaré.", "De acuerdo, compraré medicina y descansaré.", "De acuerdo. Comprare medicina y descansare."], "Type the line you heard.", ["de-acuerdo", "medicina", "descansar"], { hint: "Replay if needed", voice: "m" }),
      cloze("u10l10-cloze-5", "De acuerdo. Compraré ___ y descansaré.", ["medicina", "Medicina"], "De acuerdo. Compraré medicina y descansaré.", ["medicina", "descansar"], { hint: "medicine", audioText: "De acuerdo. Compraré medicina y descansaré.", voice: "m" }),
    ],
  },
  "u10-l11": {
    id: "u10-l11", unitId: "unit-10", title: "Situations: work & wellbeing",
    description: "Dialogue-style practice — office, plans, health.", xpReward: 46,
    exercises: [
      { id: "u10l11-1", type: "situational-choose", prompt: "Pick the best line.", situation: "You need to cancel a meeting because you are sick.", options: ["No puedo ir a la reunión — estoy enfermo.", "No puedo ir a la reunión — soy metro.", "No puedo ir — comí el imperfecto.", "No puedo ir — el pasaporte tiene fiebre."], correctIndex: 0, explanation: "No puedo ir a la reunión — estoy enfermo.", wordCardIds: ["reunion", "enfermo"], xp: 4 },
      { id: "u10l11-2", type: "situational-choose", prompt: "Pick the best line.", situation: "A coworker asks about next week's plan.", options: ["Voy a terminar el proyecto la próxima semana.", "Voy a terminar el resfriado ayer.", "Íbamos el proyecto de jugo.", "Me duele la próxima semana el correo."], correctIndex: 0, explanation: "Voy a terminar el proyecto la próxima semana.", wordCardIds: ["ir-a-deep", "proyecto", "la-proxima-semana"], xp: 3 },
      { id: "u10l11-3", type: "tap-chips", prompt: "Build: ‘I would like to rest tomorrow.’", chips: ["Me", "gustaría", "descansar", "mañana.", "fiebre", "metro"], correctOrder: ["Me", "gustaría", "descansar", "mañana."], explanation: "Me gustaría descansar mañana.", wordCardIds: ["me-gustaria", "descansar", "manana"], xp: 3 },
      listen("u10l11-4", "¿Tienes una cita con el médico?", ["Do you have an appointment with the doctor?", "Do you have a project with juice?", "Will you fly tomorrow only?", "Did you eat the pharmacy?"], 0, "¿Tienes una cita con el médico?", ["cita", "medico"]),
      { id: "u10l11-5", type: "translate", prompt: "Translate: ‘I will talk with my colleague tomorrow.’", acceptedAnswers: ["Hablaré con mi colega mañana.", "Hablare con mi colega mañana.", "Voy a hablar con mi colega mañana."], hint: "Hablaré… / Voy a hablar…", explanation: "Hablaré con mi colega mañana.", wordCardIds: ["hablar-future", "colega", "manana"], xp: 4 },
      { id: "u10l11-6", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "Next month I will travel.", template: "El próximo mes ___.", acceptedAnswers: ["viajaré", "viajaré.", "viajare", "Viajaré"], hint: "I will travel", explanation: "El próximo mes viajaré.", wordCardIds: ["el-proximo-mes", "futuro-simple"], xp: 3 },
      { id: "u10l11-7", type: "select", prompt: "Friend has a fever. Soft advice?", options: ["Deberías ir al médico y descansar.", "Nunca hables.", "Come el proyecto.", "Íbamos no forever."], correctIndex: 0, explanation: "Advice + rest.", wordCardIds: ["deberia", "medico", "descansar"], xp: 3 },
      listen("u10l11-8", "Te envío un correo hoy.", ["I'll send you an email today.", "I have a cold today.", "I booked the hotel.", "Where is the passport?"], 0, "Te envío un correo hoy.", ["correo", "hoy"]),
      { id: "u10l11-9", type: "match-pairs", prompt: "Situation phrases.", pairs: [{ left: "Voy a…", right: "I'm going to…" }, { left: "Tendré una reunión", right: "I will have a meeting" }, { left: "Me duele…", right: "… hurts" }, { left: "Deberías…", right: "You should…" }], explanation: "Work + health glue.", wordCardIds: ["ir-a-deep", "tener-future", "me-duele", "deberia"], xp: 4 },
      conjugate("u10l11-conj-1", "tener", "yo", "Simple future", ["tendré", "tendre", "Tendré"], "yo tendré… for future meetings.", ["tener-future"], { hint: "tendré" }),
    ],
  },
  "u10-l12": {
    id: "u10-l12", unitId: "unit-10", title: "Unit 10 check",
    description: "Mixed review — work, future plans, health & appointments.", xpReward: 48,
    exercises: [
      { id: "u10l12-1", type: "select", prompt: "‘I have a meeting’ is…", options: ["Tengo una reunión.", "Tengo una fiebre de metro.", "Me duele una carrera.", "Iré un jugo."], correctIndex: 0, explanation: "Tengo una reunión.", wordCardIds: ["reunion"], xp: 3 },
      { id: "u10l12-2", type: "select", prompt: "yo + ir future =", options: ["iré", "iba", "fui", "voy ayer"], correctIndex: 0, explanation: "iré.", wordCardIds: ["ir-future"], xp: 3 },
      { id: "u10l12-3", type: "tap-chips", prompt: "Build: ‘I work from home.’", chips: ["Trabajo", "desde", "casa.", "farmacia", "pasaporte"], correctOrder: ["Trabajo", "desde", "casa."], explanation: "Trabajo desde casa.", wordCardIds: ["desde-casa", "trabajar"], xp: 3 },
      { id: "u10l12-4", type: "translate", prompt: "Translate: ‘My head hurts.’", acceptedAnswers: ["Me duele la cabeza.", "Me duele la cabeza", "Tengo dolor de cabeza."], hint: "Me duele…", explanation: "Me duele la cabeza.", wordCardIds: ["me-duele"], xp: 4 },
      listen("u10l12-5", "Voy a terminar el proyecto la próxima semana.", ["I'm going to finish the project next week.", "I had a cold next week.", "I booked the pharmacy.", "I used to speak next week."], 0, "Voy a terminar el proyecto la próxima semana.", ["ir-a-deep", "proyecto", "la-proxima-semana"]),
      { id: "u10l12-6", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "I want to make an appointment.", template: "Quiero hacer una ___.", acceptedAnswers: ["cita", "Cita"], hint: "appointment", explanation: "Quiero hacer una cita.", wordCardIds: ["cita"], xp: 3 },
      { id: "u10l12-7", type: "match-pairs", prompt: "Final Unit 10 match.", pairs: [{ left: "el colega", right: "the colleague" }, { left: "trabajaré", right: "I will work" }, { left: "la farmacia", right: "the pharmacy" }, { left: "me gustaría", right: "I would like" }], explanation: "Core Unit 10 lemmas.", wordCardIds: ["colega", "trabajar-future", "farmacia", "me-gustaria"], xp: 4 },
      { id: "u10l12-8", type: "situational-choose", prompt: "Pick the best line.", situation: "You need medicine after work.", options: ["Voy a la farmacia por la medicina.", "Voy a la farmacia por el imperfecto.", "Voy a comer el pasaporte.", "No estoy de acuerdo el metro."], correctIndex: 0, explanation: "Voy a la farmacia por la medicina.", wordCardIds: ["farmacia", "medicina"], xp: 3 },
      { id: "u10l12-9", type: "select", prompt: "‘Next month’ is…", options: ["el próximo mes", "el resfriado mes", "la fiebre mes", "el colega mes"], correctIndex: 0, explanation: "el próximo mes.", wordCardIds: ["el-proximo-mes"], xp: 3 },
      conjugate("u10l12-conj-1", "trabajar", "yo", "Simple future", ["trabajaré", "trabajare", "Trabajaré"], "yo + trabajar → trabajaré.", ["trabajar-future"], { hint: "trabajaré" }),
      conjugate("u10l12-conj-2", "hablar", "nosotros/as", "Simple future", ["hablaremos", "Hablaremos"], "nosotros + hablar → hablaremos.", ["hablar-future"], { hint: "hablaremos" }),
      { id: "u10l12-10", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "I should rest today.", template: "___ descansar hoy.", acceptedAnswers: ["Debería", "Deberia", "debería", "deberia"], hint: "I should", explanation: "Debería descansar hoy.", wordCardIds: ["deberia", "descansar"], xp: 3 },
    ],
  },
};
