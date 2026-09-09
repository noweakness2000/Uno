/**
 * Unit 11 — Stories & social life (~12 lessons). Early–mid B1 Spanish.
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

const LATAM_PRETERITE = (forms: [string, string, string, string, string]) => [
  {
    label: "Preterite",
    forms: [
      { person: "yo", form: forms[0] },
      { person: "tú", form: forms[1] },
      { person: "él/ella/usted", form: forms[2] },
      { person: "nosotros/as", form: forms[3] },
      { person: "ustedes", form: forms[4] },
    ],
  },
];

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

let listenVoiceIndex = 1100;

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

export const UNIT11_WORD_CARDS: Record<string, WordCard> = {
  amigo: {
    id: "amigo",
    lemma: "el amigo / la amiga",
    pos: "noun",
    gender: "mf",
    gloss: "friend",
    meaningSummary:
      "Close friend: Mi amigo llega tarde / Salgo con mis amigas. Everyday social life word.",
    examples: [
      { es: "Voy a la fiesta con mis amigos.", en: "I'm going to the party with my friends." },
      { es: "Mi amiga me invitó al cine.", en: "My friend invited me to the movies." },
    ],
    useWhen: "Talking about friends and social plans.",
    dontUseWhen: "For a work peer, colega is more precise.",
    contrast: "colega (coworker)",
    formality: "neutral",
    cefr: "A1",
  },
  familia: {
    id: "familia",
    lemma: "la familia",
    pos: "noun",
    gender: "f",
    gloss: "family",
    meaningSummary:
      "Family group: Mi familia vive cerca / Pasamos el fin de semana con la familia.",
    examples: [
      { es: "Pasé el domingo con mi familia.", en: "I spent Sunday with my family." },
      { es: "¿Tu familia vive aquí?", en: "Does your family live here?" },
    ],
    useWhen: "Family gatherings and weekend stories.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "A1",
  },
  hermano: {
    id: "hermano",
    lemma: "el hermano / la hermana",
    pos: "noun",
    gender: "mf",
    gloss: "brother / sister",
    meaningSummary:
      "Sibling: Mi hermana bailó en la fiesta / Mi hermano y yo fuimos al cine.",
    examples: [
      { es: "Mi hermana me invitó a su cumpleaños.", en: "My sister invited me to her birthday." },
      { es: "Fui al cine con mi hermano.", en: "I went to the movies with my brother." },
    ],
    useWhen: "Family stories and invitations.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "A1",
  },
  conocer: {
    id: "conocer",
    lemma: "conocer",
    pos: "verb",
    gender: "n/a",
    gloss: "to know (a person/place) / to meet",
    meaningSummary:
      "Meet or know people/places: Quiero conocer a tus amigos / Conocí a Ana en la fiesta. With people, use a: conocer a…",
    conjugations: LATAM_PRESENT([
      "conozco",
      "conoces",
      "conoce",
      "conocemos",
      "conocen",
    ]),
    examples: [
      { es: "Quiero conocer a tus amigos.", en: "I want to meet your friends." },
      { es: "¿Conoces a mi hermana?", en: "Do you know my sister?" },
    ],
    useWhen: "Meeting people or saying you know someone.",
    dontUseWhen: "For knowing facts, saber is the usual verb.",
    contrast: "saber (know facts)",
    formality: "neutral",
    cefr: "A2",
  },
  invitar: {
    id: "invitar",
    lemma: "invitar",
    pos: "verb",
    gender: "n/a",
    gloss: "to invite",
    meaningSummary:
      "Invite someone: Te invito a la fiesta / Me invitaron al cine. Core social verb.",
    conjugations: LATAM_PRESENT([
      "invito",
      "invitas",
      "invita",
      "invitamos",
      "invitan",
    ]),
    examples: [
      { es: "Te invito a mi cumpleaños.", en: "I invite you to my birthday." },
      { es: "¿Me invitas al cine?", en: "Are you inviting me to the movies?" },
    ],
    useWhen: "Making and answering invites.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "A2",
  },
  juntos: {
    id: "juntos",
    lemma: "juntos / juntas",
    pos: "adverb",
    gender: "mf",
    gloss: "together",
    meaningSummary:
      "Doing something with others: Salimos juntos / Comimos juntos anoche. Agreement: juntas with feminine group.",
    examples: [
      { es: "Fuimos al cine juntos.", en: "We went to the movies together." },
      { es: "Mis amigas bailaron juntas.", en: "My friends danced together." },
    ],
    useWhen: "Emphasizing shared activities.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "A2",
  },
  fiesta: {
    id: "fiesta",
    lemma: "la fiesta",
    pos: "noun",
    gender: "f",
    gloss: "party",
    meaningSummary:
      "Party / celebration: Hay una fiesta el sábado / Fuimos a una fiesta divertida.",
    examples: [
      { es: "La fiesta fue muy divertida.", en: "The party was really fun." },
      { es: "¿Vas a la fiesta esta noche?", en: "Are you going to the party tonight?" },
    ],
    useWhen: "Social events and weekend stories.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "A2",
  },
  cumpleanos: {
    id: "cumpleanos",
    lemma: "el cumpleaños",
    pos: "noun",
    gender: "m",
    gloss: "birthday",
    meaningSummary:
      "Birthday: Es el cumpleaños de mi hermana / Te invito a mi cumpleaños. Accent on e: cumpleaños.",
    examples: [
      { es: "Hoy es el cumpleaños de mi amigo.", en: "Today is my friend's birthday." },
      { es: "Fuimos a un cumpleaños anoche.", en: "We went to a birthday party last night." },
    ],
    useWhen: "Birthday invites and stories.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "A2",
  },
  pelicula: {
    id: "pelicula",
    lemma: "la película",
    pos: "noun",
    gender: "f",
    gloss: "movie / film",
    meaningSummary:
      "Movie: Vimos una película / La película era larga pero buena. Accent on u: película.",
    examples: [
      { es: "Anoche vimos una película juntos.", en: "Last night we watched a movie together." },
      { es: "¿Qué película quieres ver?", en: "What movie do you want to watch?" },
    ],
    useWhen: "Cinema and weekend entertainment.",
    dontUseWhen: "n/a",
    contrast: "el cine (the movie theater / movies as outing)",
    formality: "neutral",
    cefr: "A2",
  },
  bailar: {
    id: "bailar",
    lemma: "bailar",
    pos: "verb",
    gender: "n/a",
    gloss: "to dance",
    meaningSummary:
      "Dance at parties: Bailamos toda la noche / ¿Quieres bailar? Regular -ar.",
    conjugations: LATAM_PRESENT([
      "bailo",
      "bailas",
      "baila",
      "bailamos",
      "bailan",
    ]),
    examples: [
      { es: "Bailamos en la fiesta.", en: "We danced at the party." },
      { es: "Mi hermana baila muy bien.", en: "My sister dances very well." },
    ],
    useWhen: "Party and celebration scenes.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "A2",
  },
  divertido: {
    id: "divertido",
    lemma: "divertido/a",
    pos: "adjective",
    gender: "mf",
    gloss: "fun / funny",
    meaningSummary:
      "Fun experience or funny person: La fiesta fue divertida / Es un amigo muy divertido.",
    examples: [
      { es: "La película fue divertida.", en: "The movie was fun." },
      { es: "Pasamos un fin de semana divertido.", en: "We had a fun weekend." },
    ],
    useWhen: "Describing enjoyable social time.",
    dontUseWhen: "For 'I had fun' as a verb, divertirse appears later — divertido covers the adjective.",
    formality: "neutral",
    cefr: "A2",
  },
  "contar-historia": {
    id: "contar-historia",
    lemma: "contar (una historia)",
    pos: "verb",
    gender: "n/a",
    gloss: "to tell (a story)",
    meaningSummary:
      "Tell a story: Conté lo que pasó / ¿Me cuentas la historia? Stem change o→ue in present: cuento, cuentas…",
    conjugations: LATAM_PRESENT([
      "cuento",
      "cuentas",
      "cuenta",
      "contamos",
      "cuentan",
    ]),
    examples: [
      { es: "Te cuento lo que pasó anoche.", en: "I'll tell you what happened last night." },
      { es: "Mi amigo contó una historia divertida.", en: "My friend told a funny story." },
    ],
    useWhen: "Storytelling and weekend recaps.",
    dontUseWhen: "For counting numbers, contar also means to count — context decides.",
    formality: "neutral",
    cefr: "B1",
  },
  mientras: {
    id: "mientras",
    lemma: "mientras",
    pos: "phrase",
    gender: "n/a",
    gloss: "while / meanwhile",
    meaningSummary:
      "Background frame for imperfect: Mientras hablábamos, llegó mi amigo. Classic pret vs imperfect glue.",
    examples: [
      { es: "Mientras veíamos la película, comíamos palomitas.", en: "While we were watching the movie, we were eating popcorn." },
      { es: "Llamé mientras tú salías.", en: "I called while you were going out." },
    ],
    useWhen: "Setting a background action for a story.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "B1",
  },
  "de-repente": {
    id: "de-repente",
    lemma: "de repente",
    pos: "phrase",
    gender: "n/a",
    gloss: "suddenly",
    meaningSummary:
      "Sudden completed event — often with preterite: De repente llegó mi hermana / De repente se fue la luz.",
    examples: [
      { es: "De repente llegó mi amigo a la fiesta.", en: "Suddenly my friend arrived at the party." },
      { es: "De repente empezó a llover.", en: "Suddenly it started to rain." },
    ],
    useWhen: "Marking a sudden event in a story (preterite).",
    dontUseWhen: "For slow background habits, imperfect fits better.",
    contrast: "mientras (while / background)",
    formality: "neutral",
    cefr: "B1",
  },
  "pret-vs-imp": {
    id: "pret-vs-imp",
    lemma: "pretérito vs imperfecto",
    pos: "phrase",
    gender: "n/a",
    gloss: "preterite vs imperfect (contrast)",
    meaningSummary:
      "Light contrast: pretérito = what happened (finished); imperfecto = what was going on / used to. Fuimos a la fiesta (event) / La fiesta era divertida (background).",
    examples: [
      { es: "Anoche fui al cine. La película era larga.", en: "Last night I went to the movies. The movie was long." },
      { es: "Mientras hablábamos, llegó Ana.", en: "While we were talking, Ana arrived." },
    ],
    useWhen: "Choosing past tense for stories.",
    dontUseWhen: "Don't quiz the grammar label alone — use real forms.",
    contrast: "fui (event) vs iba / era (background)",
    formality: "neutral",
    cefr: "B1",
  },
  "ver-preterite": {
    id: "ver-preterite",
    lemma: "ver (preterite)",
    pos: "verb",
    gender: "n/a",
    gloss: "to see / watch — saw",
    meaningSummary:
      "Irregular-looking but simple: vi, viste, vio, vimos, vieron. Anoche vimos una película.",
    conjugations: LATAM_PRETERITE(["vi", "viste", "vio", "vimos", "vieron"]),
    examples: [
      { es: "Anoche vi una película con mis amigos.", en: "Last night I watched a movie with my friends." },
      { es: "¿Viste a mi hermana en la fiesta?", en: "Did you see my sister at the party?" },
    ],
    useWhen: "Finished seeing/watching events.",
    dontUseWhen: "For 'used to watch', veía (imperfect) fits habits.",
    contrast: "veía (imperfect)",
    formality: "neutral",
    cefr: "A2",
  },
  "estar-imperfect": {
    id: "estar-imperfect",
    lemma: "estar (imperfect)",
    pos: "verb",
    gender: "n/a",
    gloss: "to be (location/state) — was / were",
    meaningSummary:
      "Background location/state: estaba, estabas, estaba, estábamos, estaban. Mis amigos estaban en la fiesta.",
    conjugations: LATAM_IMPERFECT([
      "estaba",
      "estabas",
      "estaba",
      "estábamos",
      "estaban",
    ]),
    examples: [
      { es: "Mis amigos estaban en la fiesta.", en: "My friends were at the party." },
      { es: "Yo estaba cansado después del cine.", en: "I was tired after the movies." },
    ],
    useWhen: "Past background location or feeling.",
    dontUseWhen: "For a finished trip to a place, fui / estuve may fit better.",
    contrast: "fui / estuve (preterite)",
    formality: "neutral",
    cefr: "A2",
  },
  "conocer-preterite": {
    id: "conocer-preterite",
    lemma: "conocer (preterite)",
    pos: "verb",
    gender: "n/a",
    gloss: "to meet (someone) — met",
    meaningSummary:
      "First meeting finished: conocí, conociste, conoció, conocimos, conocieron. Conocí a Ana en la fiesta.",
    conjugations: LATAM_PRETERITE([
      "conocí",
      "conociste",
      "conoció",
      "conocimos",
      "conocieron",
    ]),
    examples: [
      { es: "Conocí a tu hermano anoche.", en: "I met your brother last night." },
      { es: "¿Cuándo conociste a tus amigos?", en: "When did you meet your friends?" },
    ],
    useWhen: "Narrating when you first met someone.",
    dontUseWhen: "For already knowing someone, present conozco.",
    formality: "neutral",
    cefr: "B1",
  },
  "bailar-preterite": {
    id: "bailar-preterite",
    lemma: "bailar (preterite)",
    pos: "verb",
    gender: "n/a",
    gloss: "to dance — danced",
    meaningSummary:
      "Regular -ar preterite: bailé, bailaste, bailó, bailamos, bailaron. Bailamos toda la noche.",
    conjugations: LATAM_PRETERITE([
      "bailé",
      "bailaste",
      "bailó",
      "bailamos",
      "bailaron",
    ]),
    examples: [
      { es: "Bailé con mis amigos en la fiesta.", en: "I danced with my friends at the party." },
      { es: "Ellos bailaron hasta tarde.", en: "They danced until late." },
    ],
    useWhen: "Finished dancing events.",
    dontUseWhen: "For habitual past dancing, bailaba.",
    formality: "neutral",
    cefr: "A2",
  },
  "invitar-preterite": {
    id: "invitar-preterite",
    lemma: "invitar (preterite)",
    pos: "verb",
    gender: "n/a",
    gloss: "to invite — invited",
    meaningSummary:
      "Regular -ar preterite: invité, invitaste, invitó, invitamos, invitaron. Me invitaron al cine.",
    conjugations: LATAM_PRETERITE([
      "invité",
      "invitaste",
      "invitó",
      "invitamos",
      "invitaron",
    ]),
    examples: [
      { es: "Mi amiga me invitó a su cumpleaños.", en: "My friend invited me to her birthday." },
      { es: "¿Te invitaron a la fiesta?", en: "Did they invite you to the party?" },
    ],
    useWhen: "Narrating past invitations.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "A2",
  },
  "ver-imperfect": {
    id: "ver-imperfect",
    lemma: "ver (imperfect)",
    pos: "verb",
    gender: "n/a",
    gloss: "to see / watch — used to watch / was watching",
    meaningSummary:
      "Imperfect: veía, veías, veía, veíamos, veían. Habit or background: Antes veía muchas películas.",
    conjugations: LATAM_IMPERFECT([
      "veía",
      "veías",
      "veía",
      "veíamos",
      "veían",
    ]),
    examples: [
      { es: "Cuando era niño, veía películas con mi familia.", en: "When I was a kid, I used to watch movies with my family." },
      { es: "Mientras veíamos la película, llegó mi amigo.", en: "While we were watching the movie, my friend arrived." },
    ],
    useWhen: "Habits or ongoing watching in the past.",
    dontUseWhen: "For one finished viewing, vi / vimos.",
    contrast: "vi (preterite)",
    formality: "neutral",
    cefr: "B1",
  },
  "pasar-tiempo": {
    id: "pasar-tiempo",
    lemma: "pasar tiempo",
    pos: "phrase",
    gender: "n/a",
    gloss: "to spend time",
    meaningSummary:
      "Social time: Pasé el fin de semana con mi familia / Me gusta pasar tiempo con mis amigos.",
    examples: [
      { es: "Pasé el sábado con mis amigos.", en: "I spent Saturday with my friends." },
      { es: "Queremos pasar tiempo juntos.", en: "We want to spend time together." },
    ],
    useWhen: "Talking about hanging out and weekends.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "A2",
  },
};

export const UNIT11_LESSONS: Record<string, Lesson> = {
  "u11-l1": {
    id: "u11-l1", unitId: "unit-11", title: "Friends & family",
    description: "Word Cards first — amigo, familia, hermano, pasar tiempo.", xpReward: 44,
    exercises: [
      teach("teach-u11l1-amigo", "amigo"),
      { id: "u11l1-1", type: "select", prompt: "‘I'm going with my friends’ is…", options: ["Voy con mis amigos.", "Voy con mis reuniones.", "Voy con mi fiebre.", "Voy con el imperfecto."], correctIndex: 0, explanation: "Voy con mis amigos.", wordCardIds: ["amigo"], xp: 3 },
      teach("teach-u11l1-familia", "familia"),
      { id: "u11l1-2", type: "tap-chips", prompt: "Build: ‘I spent Sunday with my family.’", chips: ["Pasé", "el", "domingo", "con", "mi", "familia.", "fiebre", "metro"], correctOrder: ["Pasé", "el", "domingo", "con", "mi", "familia."], explanation: "Pasé el domingo con mi familia.", wordCardIds: ["familia", "pasar-tiempo"], xp: 3 },
      teach("teach-u11l1-hermano", "hermano"),
      { id: "u11l1-3", type: "translate", prompt: "Translate: ‘I went to the movies with my brother.’", acceptedAnswers: ["Fui al cine con mi hermano.", "Fui al cine con mi hermano", "Yo fui al cine con mi hermano."], hint: "Fui al cine…", explanation: "Fui al cine con mi hermano.", wordCardIds: ["hermano", "el-cine"], xp: 4 },
      teach("teach-u11l1-pasar", "pasar-tiempo"),
      listen("u11l1-4", "Me gusta pasar tiempo con mis amigos.", ["I like spending time with my friends.", "I have a meeting with fever.", "I booked the pharmacy.", "I will work next month."], 0, "Me gusta pasar tiempo con mis amigos.", ["pasar-tiempo", "amigo"]),
      { id: "u11l1-5", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "Does your family live here?", template: "¿Tu ___ vive aquí?", acceptedAnswers: ["familia", "Familia"], hint: "family", explanation: "¿Tu familia vive aquí?", wordCardIds: ["familia"], xp: 3 },
      { id: "u11l1-6", type: "match-pairs", prompt: "Match people words.", pairs: [{ left: "el amigo", right: "the friend (m)" }, { left: "la familia", right: "the family" }, { left: "la hermana", right: "the sister" }, { left: "pasar tiempo", right: "to spend time" }], explanation: "Core social people lemmas.", wordCardIds: ["amigo", "familia", "hermano", "pasar-tiempo"], xp: 4 },
      conjugate("u11l1-conj-1", "pasar", "yo", "Preterite", ["pasé", "pase", "Pasé"], "yo + pasar → pasé (as in pasé tiempo).", ["pasar-tiempo"], { hint: "pasé" }),
    ],
  },
  "u11-l2": {
    id: "u11-l2", unitId: "unit-11", title: "Invites & hanging out",
    description: "Invitar, conocer, juntos — plans with people.", xpReward: 44,
    exercises: [
      teach("teach-u11l2-invitar", "invitar"),
      { id: "u11l2-1", type: "select", prompt: "‘I invite you to my birthday’ is…", options: ["Te invito a mi cumpleaños.", "Te duele mi cumpleaños.", "Te envío una fiebre.", "Te iba el proyecto."], correctIndex: 0, explanation: "Te invito a mi cumpleaños.", wordCardIds: ["invitar", "cumpleanos"], xp: 3 },
      teach("teach-u11l2-conocer", "conocer"),
      { id: "u11l2-2", type: "tap-chips", prompt: "Build: ‘I want to meet your friends.’", chips: ["Quiero", "conocer", "a", "tus", "amigos.", "fiebre", "metro"], correctOrder: ["Quiero", "conocer", "a", "tus", "amigos."], explanation: "Quiero conocer a tus amigos. — a before people.", wordCardIds: ["conocer", "amigo"], xp: 3 },
      teach("teach-u11l2-juntos", "juntos"),
      { id: "u11l2-3", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "We went to the movies together.", template: "Fuimos al cine ___.", acceptedAnswers: ["juntos", "Juntos"], hint: "together", explanation: "Fuimos al cine juntos.", wordCardIds: ["juntos", "el-cine"], xp: 3 },
      listen("u11l2-4", "¿Me invitas al cine?", ["Are you inviting me to the movies?", "Do you have a fever?", "Will you work from home?", "Where is the pharmacy?"], 0, "¿Me invitas al cine?", ["invitar", "el-cine"]),
      { id: "u11l2-5", type: "situational-choose", prompt: "Pick the best line.", situation: "A friend asks if you know their sister.", options: ["¿Conoces a mi hermana?", "¿Comes a mi hermana?", "¿Iré fiebre hermana?", "¿Trabajaré la farmacia?"], correctIndex: 0, explanation: "¿Conoces a mi hermana?", wordCardIds: ["conocer", "hermano"], xp: 3 },
      { id: "u11l2-6", type: "match-pairs", prompt: "Match invite phrases.", pairs: [{ left: "invitar", right: "to invite" }, { left: "conocer a…", right: "to meet / know (a person)" }, { left: "juntos", right: "together" }, { left: "el cine", right: "the movies" }], explanation: "Hanging-out toolkit.", wordCardIds: ["invitar", "conocer", "juntos", "el-cine"], xp: 4 },
      { id: "u11l2-7", type: "translate", prompt: "Translate: ‘Do you know my friends?’ (tú)", acceptedAnswers: ["¿Conoces a mis amigos?", "Conoces a mis amigos?", "¿Conoces a mis amigos"], hint: "Conoces a…", explanation: "¿Conoces a mis amigos?", wordCardIds: ["conocer", "amigo"], xp: 4 },
      conjugate("u11l2-conj-1", "invitar", "tú", "Present indicative", ["invitas", "Invitas"], "tú + invitar → invitas.", ["invitar"], { hint: "invitas" }),
    ],
  },
  "u11-l3": {
    id: "u11-l3", unitId: "unit-11", title: "Parties & birthdays vocab",
    description: "Fiesta, cumpleaños, bailar, divertido — celebration words.", xpReward: 44,
    exercises: [
      teach("teach-u11l3-fiesta", "fiesta"),
      { id: "u11l3-1", type: "select", prompt: "‘Are you going to the party tonight?’ is…", options: ["¿Vas a la fiesta esta noche?", "¿Vas a la reunión de fiebre?", "¿Ibas el pasaporte?", "¿Me duele la fiesta?"], correctIndex: 0, explanation: "¿Vas a la fiesta esta noche?", wordCardIds: ["fiesta"], xp: 3 },
      teach("teach-u11l3-cumple", "cumpleanos"),
      { id: "u11l3-2", type: "tap-chips", prompt: "Build: ‘Today is my friend's birthday.’", chips: ["Hoy", "es", "el", "cumpleaños", "de", "mi", "amigo.", "metro", "fiebre"], correctOrder: ["Hoy", "es", "el", "cumpleaños", "de", "mi", "amigo."], explanation: "Hoy es el cumpleaños de mi amigo.", wordCardIds: ["cumpleanos", "amigo"], xp: 3 },
      teach("teach-u11l3-bailar", "bailar"),
      teach("teach-u11l3-divertido", "divertido"),
      { id: "u11l3-3", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "The party was really fun.", template: "La fiesta fue muy ___.", acceptedAnswers: ["divertida", "Divertida", "divertido", "Divertido"], hint: "fun (agree with fiesta)", explanation: "La fiesta fue muy divertida.", wordCardIds: ["divertido", "fiesta"], xp: 3 },
      listen("u11l3-4", "Bailamos en la fiesta.", ["We danced at the party.", "We had a fever at work.", "We booked the hotel.", "We will travel next month."], 0, "Bailamos en la fiesta.", ["bailar", "fiesta"]),
      { id: "u11l3-5", type: "situational-choose", prompt: "Pick the best invite.", situation: "You want friends at your birthday.", options: ["Te invito a mi cumpleaños.", "Te envío un resfriado.", "Me duele el cine.", "Íbamos la farmacia."], correctIndex: 0, explanation: "Te invito a mi cumpleaños.", wordCardIds: ["invitar", "cumpleanos"], xp: 3 },
      { id: "u11l3-6", type: "match-pairs", prompt: "Match celebration words.", pairs: [{ left: "la fiesta", right: "the party" }, { left: "el cumpleaños", right: "the birthday" }, { left: "bailar", right: "to dance" }, { left: "divertido", right: "fun" }], explanation: "Party toolkit.", wordCardIds: ["fiesta", "cumpleanos", "bailar", "divertido"], xp: 4 },
      { id: "u11l3-7", type: "translate", prompt: "Translate: ‘We danced at the party.’", acceptedAnswers: ["Bailamos en la fiesta.", "Bailamos en la fiesta", "Nosotros bailamos en la fiesta."], hint: "Bailamos…", explanation: "Bailamos en la fiesta.", wordCardIds: ["bailar", "fiesta"], xp: 4 },
    ],
  },
  "u11-l4": {
    id: "u11-l4", unitId: "unit-11", title: "Preterite refresh: what happened",
    description: "Vi, conocí, invité, bailé — finished social events.", xpReward: 46,
    exercises: [
      teach("teach-u11l4-ver", "ver-preterite"),
      { id: "u11l4-1", type: "select", prompt: "yo + ver (preterite) is…", options: ["vi", "veía", "veo ayer", "veré"], correctIndex: 0, explanation: "vi — I saw / watched.", wordCardIds: ["ver-preterite"], xp: 3 },
      teach("teach-u11l4-conocer", "conocer-preterite"),
      { id: "u11l4-2", type: "tap-chips", prompt: "Build: ‘I met Ana at the party.’", chips: ["Conocí", "a", "Ana", "en", "la", "fiesta.", "conocía", "metro"], correctOrder: ["Conocí", "a", "Ana", "en", "la", "fiesta."], explanation: "Conocí a Ana en la fiesta.", wordCardIds: ["conocer-preterite", "fiesta"], xp: 3 },
      teach("teach-u11l4-invitar", "invitar-preterite"),
      { id: "u11l4-3", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "My friend invited me to the movies.", template: "Mi amiga me ___ al cine.", acceptedAnswers: ["invitó", "invito", "Invitó"], hint: "invitar preterite — ella", explanation: "Mi amiga me invitó al cine.", wordCardIds: ["invitar-preterite", "el-cine"], xp: 3 },
      teach("teach-u11l4-bailar", "bailar-preterite"),
      listen("u11l4-4", "Anoche vi una película con mis amigos.", ["Last night I watched a movie with my friends.", "I used to watch movies only.", "I have a fever tonight.", "I will work from home."], 0, "Anoche vi una película con mis amigos.", ["ver-preterite", "pelicula", "amigo"]),
      { id: "u11l4-5", type: "situational-choose", prompt: "Pick the finished event.", situation: "Tell what happened at the party.", options: ["Bailé con mis amigos.", "Bailaba siempre en 1990 only forever.", "Bailaré la farmacia.", "Me duele el pretérito."], correctIndex: 0, explanation: "Bailé con mis amigos.", wordCardIds: ["bailar-preterite", "amigo"], xp: 3 },
      { id: "u11l4-6", type: "match-pairs", prompt: "Match preterite forms.", pairs: [{ left: "vi", right: "I saw / watched" }, { left: "conocí", right: "I met" }, { left: "invité", right: "I invited" }, { left: "bailé", right: "I danced" }], explanation: "Social preterite starters.", wordCardIds: ["ver-preterite", "conocer-preterite", "invitar-preterite", "bailar-preterite"], xp: 4 },
      { id: "u11l4-7", type: "translate", prompt: "Translate: ‘Did you see my sister at the party?’ (tú)", acceptedAnswers: ["¿Viste a mi hermana en la fiesta?", "Viste a mi hermana en la fiesta?", "¿Viste a mi hermana en la fiesta"], hint: "Viste a…", explanation: "¿Viste a mi hermana en la fiesta?", wordCardIds: ["ver-preterite", "hermano", "fiesta"], xp: 4 },
    ],
  },
  "u11-l5": {
    id: "u11-l5", unitId: "unit-11", title: "Imperfect backdrop: what was going on",
    description: "Estaba, veía, mientras — background for stories.", xpReward: 46,
    exercises: [
      teach("teach-u11l5-contrast", "pret-vs-imp"),
      { id: "u11l5-1", type: "select", prompt: "Imperfect is great for…", options: ["Background and habits (was / used to)", "Only one finished click", "Only future email", "Only pharmacy orders"], correctIndex: 0, explanation: "What was going on vs what happened.", wordCardIds: ["pret-vs-imp"], xp: 3 },
      teach("teach-u11l5-estar", "estar-imperfect"),
      { id: "u11l5-2", type: "select", prompt: "‘My friends were at the party’ uses imperfect estar:", options: ["Mis amigos estaban en la fiesta.", "Mis amigos fueron en la fiesta forever.", "Mis amigos estoy fiesta.", "Mis amigos iré fiesta."], correctIndex: 0, explanation: "Mis amigos estaban en la fiesta.", wordCardIds: ["estar-imperfect", "amigo", "fiesta"], xp: 3 },
      teach("teach-u11l5-ver", "ver-imperfect"),
      { id: "u11l5-3", type: "tap-chips", prompt: "Build: ‘I used to watch movies with my family.’", chips: ["Antes", "veía", "películas", "con", "mi", "familia.", "vi", "metro"], correctOrder: ["Antes", "veía", "películas", "con", "mi", "familia."], explanation: "Antes veía películas con mi familia.", wordCardIds: ["ver-imperfect", "pelicula", "familia"], xp: 3 },
      teach("teach-u11l5-mientras", "mientras"),
      { id: "u11l5-4", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "While we were talking, Ana arrived.", template: "___ hablábamos, llegó Ana.", acceptedAnswers: ["Mientras", "mientras"], hint: "while", explanation: "Mientras hablábamos, llegó Ana.", wordCardIds: ["mientras"], xp: 3 },
      listen("u11l5-5", "Mientras veíamos la película, llegó mi amigo.", ["While we were watching the movie, my friend arrived.", "We never watched a movie.", "I have a fever at work.", "I will send an email."], 0, "Mientras veíamos la película, llegó mi amigo.", ["mientras", "ver-imperfect", "pelicula", "amigo"]),
      { id: "u11l5-6", type: "match-pairs", prompt: "Match backdrop forms.", pairs: [{ left: "estaba", right: "I/he/she was (state)" }, { left: "veía", right: "I used to watch" }, { left: "mientras", right: "while" }, { left: "eran divertidas", right: "they were fun (background)" }], explanation: "Imperfect story glue.", wordCardIds: ["estar-imperfect", "ver-imperfect", "mientras", "divertido"], xp: 4 },
      { id: "u11l5-7", type: "situational-choose", prompt: "Pick the background line.", situation: "Set the scene before a friend arrived.", options: ["Estábamos en la fiesta cuando llegó.", "Fuimos en la fiesta cuando llegar forever.", "Iré la fiesta mañana ayer.", "Me duele el imperfecto."], correctIndex: 0, explanation: "Estábamos… cuando llegó — backdrop + event.", wordCardIds: ["estar-imperfect", "fiesta"], xp: 3 },
    ],
  },
  "u11-l6": {
    id: "u11-l6", unitId: "unit-11", title: "Preterite vs imperfect drills",
    description: "Contrast drills + conjugate — event vs background.", xpReward: 48,
    exercises: [
      teach("teach-u11l6-repente", "de-repente"),
      { id: "u11l6-1", type: "select", prompt: "‘Suddenly’ often pairs with…", options: ["Preterite (finished sudden event)", "Only simple future email", "Only greetings", "Only ordering juice"], correctIndex: 0, explanation: "De repente llegó… — preterite.", wordCardIds: ["de-repente", "pret-vs-imp"], xp: 3 },
      conjugate("u11l6-2", "ver", "yo", "Preterite", ["vi", "Vi"], "yo + ver → vi.", ["ver-preterite"], { hint: "vi" }),
      conjugate("u11l6-3", "ver", "yo", "Imperfect", ["veía", "veia", "Veía"], "yo + ver → veía.", ["ver-imperfect"], { hint: "veía" }),
      conjugate("u11l6-4", "estar", "nosotros/as", "Imperfect", ["estábamos", "estabamos", "Estábamos"], "nosotros + estar → estábamos.", ["estar-imperfect"], { hint: "estábamos" }),
      conjugate("u11l6-5", "conocer", "yo", "Preterite", ["conocí", "conoci", "Conocí"], "yo + conocer → conocí.", ["conocer-preterite"], { hint: "conocí" }),
      conjugate("u11l6-6", "bailar", "tú", "Preterite", ["bailaste", "Bailaste"], "tú + bailar → bailaste.", ["bailar-preterite"], { hint: "bailaste" }),
      conjugate("u11l6-7", "invitar", "ellos/ustedes", "Preterite", ["invitaron", "Invitaron"], "ustedes/ellos + invitar → invitaron.", ["invitar-preterite"], { hint: "invitaron" }),
      { id: "u11l6-8", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "Suddenly my friend arrived at the party.", template: "De ___ llegó mi amigo a la fiesta.", acceptedAnswers: ["repente", "Repente"], hint: "de ___", explanation: "De repente llegó mi amigo a la fiesta.", wordCardIds: ["de-repente", "amigo", "fiesta"], xp: 3 },
      listen("u11l6-9", "De repente llegó mi hermana.", ["Suddenly my sister arrived.", "I used to arrive forever.", "I have a fever.", "I will work from home."], 0, "De repente llegó mi hermana.", ["de-repente", "hermano"]),
      { id: "u11l6-10", type: "match-pairs", prompt: "Event vs background.", pairs: [{ left: "fui al cine", right: "finished event" }, { left: "la película era larga", right: "background description" }, { left: "de repente llegó", right: "sudden event" }, { left: "mientras hablábamos", right: "ongoing background" }], explanation: "Light pret vs imperfect contrast.", wordCardIds: ["pret-vs-imp", "de-repente", "mientras"], xp: 4 },
      { id: "u11l6-11", type: "situational-choose", prompt: "Pick the best pair.", situation: "Tell a short story: event + background.", options: ["Fuimos a la fiesta. La música era buena.", "Íbamos a la fiesta una vez only forever never.", "Iré la fiesta ayer.", "Me duele la película el mes."], correctIndex: 0, explanation: "Fuimos (event) + era (background).", wordCardIds: ["pret-vs-imp", "fiesta"], xp: 3 },
    ],
  },
  "u11-l7": {
    id: "u11-l7", unitId: "unit-11", title: "Party stories",
    description: "Weekend party narratives — invites, dance, fun.", xpReward: 44,
    exercises: [
      teach("teach-u11l7-contar", "contar-historia"),
      { id: "u11l7-1", type: "select", prompt: "‘I'll tell you what happened last night’ is…", options: ["Te cuento lo que pasó anoche.", "Te duele lo que pasó.", "Te envío la fiebre anoche.", "Íbamos el correo."], correctIndex: 0, explanation: "Te cuento lo que pasó anoche.", wordCardIds: ["contar-historia"], xp: 3 },
      { id: "u11l7-2", type: "tap-chips", prompt: "Build: ‘They invited me to a fun party.’", chips: ["Me", "invitaron", "a", "una", "fiesta", "divertida.", "veía", "metro"], correctOrder: ["Me", "invitaron", "a", "una", "fiesta", "divertida."], explanation: "Me invitaron a una fiesta divertida.", wordCardIds: ["invitar-preterite", "fiesta", "divertido"], xp: 3 },
      { id: "u11l7-3", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "We danced all night at the birthday party.", template: "Bailamos toda la noche en el ___.", acceptedAnswers: ["cumpleaños", "Cumpleaños", "cumpleanos"], hint: "birthday", explanation: "Bailamos toda la noche en el cumpleaños.", wordCardIds: ["bailar-preterite", "cumpleanos"], xp: 3 },
      listen("u11l7-4", "La fiesta fue muy divertida.", ["The party was really fun.", "The meeting was a fever.", "I booked the pharmacy.", "I will travel."], 0, "La fiesta fue muy divertida.", ["fiesta", "divertido"]),
      { id: "u11l7-5", type: "situational-choose", prompt: "Pick the best line.", situation: "Friend asks how the birthday was.", options: ["Fue divertido. Bailamos mucho.", "Fue el imperfecto de farmacia.", "Tuve una reunión de jugo.", "Me duele el pasaporte."], correctIndex: 0, explanation: "Fue divertido. Bailamos mucho.", wordCardIds: ["divertido", "bailar-preterite"], xp: 3 },
      { id: "u11l7-6", type: "match-pairs", prompt: "Match party story phrases.", pairs: [{ left: "me invitaron", right: "they invited me" }, { left: "bailamos", right: "we danced" }, { left: "fue divertida", right: "it was fun" }, { left: "te cuento", right: "I'll tell you" }], explanation: "Party narrative toolkit.", wordCardIds: ["invitar-preterite", "bailar-preterite", "divertido", "contar-historia"], xp: 4 },
      { id: "u11l7-7", type: "translate", prompt: "Translate: ‘My sister invited me to her birthday.’", acceptedAnswers: ["Mi hermana me invitó a su cumpleaños.", "Mi hermana me invito a su cumpleaños.", "Mi hermana me invitó a su cumpleaños"], hint: "me invitó…", explanation: "Mi hermana me invitó a su cumpleaños.", wordCardIds: ["hermano", "invitar-preterite", "cumpleanos"], xp: 4 },
      listen("u11l7-8", "De repente llegó mi amigo a la fiesta.", ["Suddenly my friend arrived at the party.", "I used to arrive forever.", "I have a cold.", "I will email."], 0, "De repente llegó mi amigo a la fiesta.", ["de-repente", "amigo", "fiesta"]),
    ],
  },
  "u11-l8": {
    id: "u11-l8", unitId: "unit-11", title: "Movies & weekend stories",
    description: "Película, cine, weekend recaps with light tense contrast.", xpReward: 44,
    exercises: [
      teach("teach-u11l8-peli", "pelicula"),
      { id: "u11l8-1", type: "select", prompt: "‘We watched a movie together’ is…", options: ["Vimos una película juntos.", "Veíamos una fiebre juntos.", "Iré una película mañana ayer.", "Me duele el cine forever."], correctIndex: 0, explanation: "Vimos una película juntos.", wordCardIds: ["ver-preterite", "pelicula", "juntos"], xp: 3 },
      { id: "u11l8-2", type: "tap-chips", prompt: "Build: ‘The movie was long but good.’", chips: ["La", "película", "era", "larga", "pero", "buena.", "fue sola", "metro"], correctOrder: ["La", "película", "era", "larga", "pero", "buena."], explanation: "La película era larga pero buena. — imperfect description.", wordCardIds: ["pelicula", "pret-vs-imp"], xp: 3 },
      { id: "u11l8-3", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "Last night we went to the movies with my family.", template: "Anoche fuimos al ___ con mi familia.", acceptedAnswers: ["cine", "Cine"], hint: "movies / theater", explanation: "Anoche fuimos al cine con mi familia.", wordCardIds: ["el-cine", "familia"], xp: 3 },
      listen("u11l8-4", "¿Qué película quieres ver?", ["What movie do you want to watch?", "What fever do you want?", "Where is the pharmacy?", "Will you work?"], 0, "¿Qué película quieres ver?", ["pelicula"]),
      { id: "u11l8-5", type: "situational-choose", prompt: "Pick the best weekend story.", situation: "Friend asks about your Saturday.", options: ["Pasé el sábado con amigos. Vimos una película.", "Pasé el sábado con el imperfecto de jugo.", "Tuve fiebre de pasaporte.", "Iré la reunión ayer."], correctIndex: 0, explanation: "Pasé… Vimos… — clear weekend story.", wordCardIds: ["pasar-tiempo", "amigo", "ver-preterite", "pelicula"], xp: 3 },
      { id: "u11l8-6", type: "match-pairs", prompt: "Match movie phrases.", pairs: [{ left: "la película", right: "the movie" }, { left: "vimos", right: "we watched" }, { left: "era larga", right: "it was long (background)" }, { left: "al cine", right: "to the movies" }], explanation: "Weekend cinema toolkit.", wordCardIds: ["pelicula", "ver-preterite", "el-cine", "pret-vs-imp"], xp: 4 },
      { id: "u11l8-7", type: "translate", prompt: "Translate: ‘While we were watching the movie, my friend arrived.’", acceptedAnswers: ["Mientras veíamos la película, llegó mi amigo.", "Mientras veiamos la pelicula, llego mi amigo.", "Mientras veíamos la película llegó mi amigo."], hint: "Mientras veíamos… llegó…", explanation: "Mientras veíamos la película, llegó mi amigo.", wordCardIds: ["mientras", "ver-imperfect", "pelicula", "amigo"], xp: 4 },
      conjugate("u11l8-conj-1", "ver", "nosotros/as", "Preterite", ["vimos", "Vimos"], "nosotros + ver → vimos.", ["ver-preterite"], { hint: "vimos" }),
    ],
  },
  "u11-l9": {
    id: "u11-l9", unitId: "unit-11", title: "Story: A fun weekend",
    description: "Story-listen + comprehension — friends, party, movie.", xpReward: 48,
    exercises: [
      storyListen(
        "u11l9-story", "Un fin de semana divertido",
        [
          { text: "El sábado mis amigos me invitaron a una fiesta.", en: "On Saturday my friends invited me to a party." },
          { text: "La música era buena y bailamos mucho.", en: "The music was good and we danced a lot." },
          { text: "De repente llegó mi hermana con un pastel.", en: "Suddenly my sister arrived with a cake." },
          { text: "El domingo vimos una película juntos.", en: "On Sunday we watched a movie together." },
          { text: "Mientras veíamos la película, comíamos palomitas.", en: "While we were watching the movie, we were eating popcorn." },
        ],
        [
          { prompt: "What happened on Saturday?", options: ["Friends invited the narrator to a party", "Only a work meeting", "A flight forever", "Nothing"], correctIndex: 0, explanation: "Mis amigos me invitaron a una fiesta." },
          { prompt: "How was the music?", options: ["Good (background)", "Missing forever", "Only fever", "At the pharmacy"], correctIndex: 0, explanation: "La música era buena — imperfect description." },
          { prompt: "Who arrived suddenly?", options: ["The narrator's sister", "The doctor only", "A taxi forever", "Nobody"], correctIndex: 0, explanation: "De repente llegó mi hermana…" },
          { prompt: "What did they do on Sunday?", options: ["Watched a movie together", "Only sent email", "Booked a hotel", "Went to the airport"], correctIndex: 0, explanation: "El domingo vimos una película juntos." },
        ],
        ["amigo", "invitar-preterite", "fiesta", "pret-vs-imp", "bailar-preterite", "de-repente", "hermano", "ver-preterite", "pelicula", "juntos", "mientras", "ver-imperfect", "divertido"],
        "Social weekend story — Neural2 voice rotation.", 12
      ),
      { id: "u11l9-1", type: "select", prompt: "From the story — sudden event was…", options: ["De repente llegó mi hermana con un pastel.", "De repente iba siempre en 1990.", "De repente la farmacia.", "De repente el correo."], correctIndex: 0, explanation: "De repente llegó mi hermana…", wordCardIds: ["de-repente", "hermano"], xp: 3 },
      { id: "u11l9-2", type: "match-pairs", prompt: "Match story details.", pairs: [{ left: "Saturday", right: "party invite" }, { left: "music", right: "was good" }, { left: "sister", right: "arrived suddenly" }, { left: "Sunday", right: "movie together" }], explanation: "Story comprehension.", wordCardIds: ["fiesta", "hermano", "pelicula", "juntos"], xp: 4 },
      listen("u11l9-3", "Mientras veíamos la película, comíamos palomitas.", ["While watching the movie, they were eating popcorn.", "They canceled Spanish forever.", "They flew tonight only.", "They disagreed with rest."], 0, "Background actions during the movie.", ["mientras", "ver-imperfect", "pelicula"]),
    ],
  },
  "u11-l10": {
    id: "u11-l10", unitId: "unit-11", title: "Cloze & dictation from the story",
    description: "Story lines — cloze, dictation, and listen.", xpReward: 48,
    exercises: [
      dictation("u11l10-dict-1", "El sábado mis amigos me invitaron a una fiesta.", ["El sábado mis amigos me invitaron a una fiesta.", "El sabado mis amigos me invitaron a una fiesta."], "Type the line you heard.", ["amigo", "invitar-preterite", "fiesta"], { hint: "Replay if needed", voice: "f" }),
      cloze("u11l10-cloze-1", "El sábado mis amigos me ___ a una fiesta.", ["invitaron", "Invitaron"], "El sábado mis amigos me invitaron a una fiesta.", ["invitar-preterite", "fiesta"], { hint: "they invited", audioText: "El sábado mis amigos me invitaron a una fiesta.", voice: "f" }),
      dictation("u11l10-dict-2", "La música era buena y bailamos mucho.", ["La música era buena y bailamos mucho.", "La musica era buena y bailamos mucho."], "Type the line you heard.", ["bailar-preterite", "pret-vs-imp"], { hint: "Replay if needed", voice: "m" }),
      cloze("u11l10-cloze-2", "La música ___ buena y bailamos mucho.", ["era", "Era"], "La música era buena y bailamos mucho.", ["pret-vs-imp"], { hint: "was (background)", audioText: "La música era buena y bailamos mucho.", voice: "m" }),
      dictation("u11l10-dict-3", "De repente llegó mi hermana con un pastel.", ["De repente llegó mi hermana con un pastel.", "De repente llego mi hermana con un pastel."], "Type the line you heard.", ["de-repente", "hermano"], { hint: "Replay if needed", voice: "c" }),
      cloze("u11l10-cloze-3", "De ___ llegó mi hermana con un pastel.", ["repente", "Repente"], "De repente llegó mi hermana con un pastel.", ["de-repente", "hermano"], { hint: "suddenly", audioText: "De repente llegó mi hermana con un pastel.", voice: "c" }),
      dictation("u11l10-dict-4", "El domingo vimos una película juntos.", ["El domingo vimos una película juntos.", "El domingo vimos una pelicula juntos."], "Type the line you heard.", ["ver-preterite", "pelicula", "juntos"], { hint: "Replay if needed", voice: "f" }),
      cloze("u11l10-cloze-4", "El domingo ___ una película juntos.", ["vimos", "Vimos"], "El domingo vimos una película juntos.", ["ver-preterite", "pelicula"], { hint: "we watched", audioText: "El domingo vimos una película juntos.", voice: "f" }),
      dictation("u11l10-dict-5", "Mientras veíamos la película, comíamos palomitas.", ["Mientras veíamos la película, comíamos palomitas.", "Mientras veiamos la pelicula, comiamos palomitas.", "Mientras veíamos la película comíamos palomitas."], "Type the line you heard.", ["mientras", "ver-imperfect", "pelicula"], { hint: "Replay if needed", voice: "m" }),
      cloze("u11l10-cloze-5", "___ veíamos la película, comíamos palomitas.", ["Mientras", "mientras"], "Mientras veíamos la película, comíamos palomitas.", ["mientras", "ver-imperfect"], { hint: "while", audioText: "Mientras veíamos la película, comíamos palomitas.", voice: "m" }),
    ],
  },
  "u11-l11": {
    id: "u11-l11", unitId: "unit-11", title: "Situations: social life",
    description: "Dialogue-style practice — invites, parties, stories.", xpReward: 46,
    exercises: [
      { id: "u11l11-1", type: "situational-choose", prompt: "Pick the best line.", situation: "Invite a friend to your birthday.", options: ["Te invito a mi cumpleaños.", "Te invito a mi fiebre.", "Íbamos el pasaporte.", "Me duele el correo."], correctIndex: 0, explanation: "Te invito a mi cumpleaños.", wordCardIds: ["invitar", "cumpleanos"], xp: 4 },
      { id: "u11l11-2", type: "situational-choose", prompt: "Pick the best line.", situation: "Friend asks who you met at the party.", options: ["Conocí a la hermana de Ana.", "Conocía la farmacia forever.", "Iré el imperfecto.", "Tuve una reunión de jugo."], correctIndex: 0, explanation: "Conocí a la hermana de Ana.", wordCardIds: ["conocer-preterite", "hermano"], xp: 3 },
      { id: "u11l11-3", type: "tap-chips", prompt: "Build: ‘We spent the weekend together.’", chips: ["Pasamos", "el", "fin", "de", "semana", "juntos.", "fiebre", "metro"], correctOrder: ["Pasamos", "el", "fin", "de", "semana", "juntos."], explanation: "Pasamos el fin de semana juntos.", wordCardIds: ["pasar-tiempo", "juntos", "fin-de-semana"], xp: 3 },
      listen("u11l11-4", "¿Quieres ir al cine conmigo?", ["Do you want to go to the movies with me?", "Do you want a fever?", "Will you fly only?", "Did you eat the pharmacy?"], 0, "¿Quieres ir al cine conmigo?", ["el-cine"]),
      { id: "u11l11-5", type: "translate", prompt: "Translate: ‘I'll tell you what happened.’", acceptedAnswers: ["Te cuento lo que pasó.", "Te cuento lo que paso.", "Te cuento lo que pasó", "Te voy a contar lo que pasó."], hint: "Te cuento…", explanation: "Te cuento lo que pasó.", wordCardIds: ["contar-historia"], xp: 4 },
      { id: "u11l11-6", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "While we were talking, my friend arrived.", template: "Mientras hablábamos, ___ mi amigo.", acceptedAnswers: ["llegó", "llego", "Llegó"], hint: "arrived", explanation: "Mientras hablábamos, llegó mi amigo.", wordCardIds: ["mientras", "amigo"], xp: 3 },
      { id: "u11l11-7", type: "select", prompt: "Friend asks how the party was.", options: ["Fue divertida. Bailamos mucho.", "Fue el metro de farmacia.", "Nunca hables.", "Íbamos no forever."], correctIndex: 0, explanation: "Fue divertida. Bailamos mucho.", wordCardIds: ["divertido", "bailar-preterite", "fiesta"], xp: 3 },
      listen("u11l11-8", "Anoche pasé tiempo con mi familia.", ["Last night I spent time with my family.", "I have a cold today.", "I booked the hotel.", "Where is the passport?"], 0, "Anoche pasé tiempo con mi familia.", ["pasar-tiempo", "familia"]),
      { id: "u11l11-9", type: "match-pairs", prompt: "Situation phrases.", pairs: [{ left: "Te invito…", right: "I invite you…" }, { left: "Conocí a…", right: "I met…" }, { left: "De repente…", right: "Suddenly…" }, { left: "Mientras…", right: "While…" }], explanation: "Social storytelling glue.", wordCardIds: ["invitar", "conocer-preterite", "de-repente", "mientras"], xp: 4 },
      conjugate("u11l11-conj-1", "ver", "tú", "Preterite", ["viste", "Viste"], "tú + ver → viste.", ["ver-preterite"], { hint: "viste" }),
    ],
  },
  "u11-l12": {
    id: "u11-l12", unitId: "unit-11", title: "Unit 11 check",
    description: "Mixed review — friends, parties, pret vs imperfect, stories.", xpReward: 48,
    exercises: [
      { id: "u11l12-1", type: "select", prompt: "‘Friend’ is…", options: ["amigo / amiga", "reunión only", "fiebre", "farmacia"], correctIndex: 0, explanation: "amigo / amiga.", wordCardIds: ["amigo"], xp: 3 },
      { id: "u11l12-2", type: "select", prompt: "yo + ver preterite =", options: ["vi", "veía", "veo ayer", "veré"], correctIndex: 0, explanation: "vi.", wordCardIds: ["ver-preterite"], xp: 3 },
      { id: "u11l12-3", type: "tap-chips", prompt: "Build: ‘We danced at the party.’", chips: ["Bailamos", "en", "la", "fiesta.", "farmacia", "pasaporte"], correctOrder: ["Bailamos", "en", "la", "fiesta."], explanation: "Bailamos en la fiesta.", wordCardIds: ["bailar-preterite", "fiesta"], xp: 3 },
      { id: "u11l12-4", type: "translate", prompt: "Translate: ‘Suddenly my friend arrived.’", acceptedAnswers: ["De repente llegó mi amigo.", "De repente llego mi amigo.", "De repente llegó mi amigo"], hint: "De repente llegó…", explanation: "De repente llegó mi amigo.", wordCardIds: ["de-repente", "amigo"], xp: 4 },
      listen("u11l12-5", "Vimos una película juntos el domingo.", ["We watched a movie together on Sunday.", "We had a cold next week.", "We booked the pharmacy.", "We used to speak next week."], 0, "Vimos una película juntos el domingo.", ["ver-preterite", "pelicula", "juntos"]),
      { id: "u11l12-6", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "I want to meet your friends.", template: "Quiero ___ a tus amigos.", acceptedAnswers: ["conocer", "Conocer"], hint: "to meet", explanation: "Quiero conocer a tus amigos.", wordCardIds: ["conocer", "amigo"], xp: 3 },
      { id: "u11l12-7", type: "match-pairs", prompt: "Final Unit 11 match.", pairs: [{ left: "el cumpleaños", right: "the birthday" }, { left: "mientras", right: "while" }, { left: "estaban", right: "they were (imperfect)" }, { left: "te cuento", right: "I'll tell you" }], explanation: "Core Unit 11 lemmas.", wordCardIds: ["cumpleanos", "mientras", "estar-imperfect", "contar-historia"], xp: 4 },
      { id: "u11l12-8", type: "situational-choose", prompt: "Pick the best line.", situation: "Describe the party music as background.", options: ["La música era buena.", "La música fui buena once only.", "La música iré farmacia.", "No estoy de acuerdo el metro."], correctIndex: 0, explanation: "La música era buena.", wordCardIds: ["pret-vs-imp"], xp: 3 },
      { id: "u11l12-9", type: "select", prompt: "‘Together’ is…", options: ["juntos", "de repente only", "la fiebre", "el colega mes"], correctIndex: 0, explanation: "juntos.", wordCardIds: ["juntos"], xp: 3 },
      conjugate("u11l12-conj-1", "conocer", "yo", "Preterite", ["conocí", "conoci", "Conocí"], "yo + conocer → conocí.", ["conocer-preterite"], { hint: "conocí" }),
      conjugate("u11l12-conj-2", "estar", "yo", "Imperfect", ["estaba", "Estaba"], "yo + estar → estaba.", ["estar-imperfect"], { hint: "estaba" }),
      { id: "u11l12-10", type: "fill-blank", prompt: "Type the missing Spanish.", englishPrompt: "I invite you to the party.", template: "Te ___ a la fiesta.", acceptedAnswers: ["invito", "Invito"], hint: "I invite", explanation: "Te invito a la fiesta.", wordCardIds: ["invitar", "fiesta"], xp: 3 },
    ],
  },
};
