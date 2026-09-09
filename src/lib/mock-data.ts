/**
 * Mock content for Uno (Spanish Spanish).
 * Later: replace with Postgres on Unraid :5433
 */
import type { DemoUser, Lesson, Unit, WordCard } from "./types";
import { audioSrcFor, voiceForIndex } from "./audio";
import {
  INTERMEDIATE_LESSONS,
  INTERMEDIATE_UNITS_META,
  INTERMEDIATE_WORD_CARDS,
} from "./content/intermediate";
import { UNIT1_LESSONS, UNIT1_WORD_CARDS } from "./content/unit1";
import { UNIT2_LESSONS, UNIT2_WORD_CARDS } from "./content/unit2";
import { UNIT3_LESSONS, UNIT3_WORD_CARDS } from "./content/unit3";

export const DEMO_USER: DemoUser = {
  id: "demo-1",
  name: "",
  xp: 0,
  streak: 0,
  dailyGoal: 20,
  dailyXp: 0,
  completedLessonIds: [],
  weakWordIds: [],
  srsCards: {},
  onboardingComplete: false,
  startingLevel: "absolute_beginner",
  skippedUnitIds: [],
  recommendedUnitId: "unit-1",
};

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

export const WORD_CARDS: Record<string, WordCard> = {
  hola: {
    id: "hola",
    lemma: "hola",
    pos: "interjection",
    gender: "n/a",
    gloss: "hello / hi",
    meaningSummary:
      "The universal casual hello — any time of day, friends or friendly strangers. Pair it with a time-of-day greeting when you want to sound a bit warmer or more polite.",
    examples: [
      { es: "¡Hola! ¿Qué tal?", en: "Hi! How's it going?" },
      { es: "Hola, me llamo Sofía.", en: "Hi, my name is Sofía." },
    ],
    useWhen: "Friendly greeting any time of day.",
    dontUseWhen: "In very formal written contexts, prefer a time-of-day greeting.",
    formality: "informal",
    cefr: "A1",
  },

  "buenos-dias": {
    id: "buenos-dias",
    lemma: "buenos días",
    pos: "phrase",
    gender: "n/a",
    gloss: "good morning",
    meaningSummary:
      "A warm morning greeting used from waking until around noon. Literally “good days,” it’s the default polite hello before lunch in everyday Spanish.",
    examples: [
      { es: "¡Buenos días! ¿Cómo estás?", en: "Good morning! How are you?" },
      { es: "Buenos días, señor López.", en: "Good morning, Mr. López." },
    ],
    useWhen: "Greeting someone in the morning until around noon.",
    dontUseWhen: "Don't use after midday — switch to buenas tardes.",
    contrast: "buenas tardes (afternoon) / buenas noches (evening/night)",
    formality: "neutral",
    cefr: "A1",
  },

  "buenas-tardes": {
    id: "buenas-tardes",
    lemma: "buenas tardes",
    pos: "phrase",
    gender: "n/a",
    gloss: "good afternoon",
    meaningSummary:
      "The standard afternoon greeting from roughly noon until evening. Use it when buenos días no longer fits and it’s not yet dark enough for buenas noches.",
    examples: [
      { es: "Buenas tardes, ¿en qué puedo ayudarte?", en: "Good afternoon, how can I help you?" },
      { es: "¡Buenas tardes! Llegamos a tiempo.", en: "Good afternoon! We arrived on time." },
    ],
    useWhen: "Greeting from roughly noon until evening.",
    dontUseWhen:
      "Don't use in the morning (use buenos días) or late at night (buenas noches).",
    contrast: "buenos días / buenas noches",
    formality: "neutral",
    cefr: "A1",
  },

  "buenas-noches": {
    id: "buenas-noches",
    lemma: "buenas noches",
    pos: "phrase",
    gender: "n/a",
    gloss: "good evening / good night",
    meaningSummary:
      "Works as both an evening hello and a good-night farewell. Context and tone tell you whether someone is arriving or heading to bed.",
    examples: [
      { es: "Buenas noches, que descanses.", en: "Good night, rest well." },
      { es: "¡Buenas noches! Nos vemos mañana.", en: "Good night! See you tomorrow." },
    ],
    useWhen: "Greeting or farewell in the evening or before bed.",
    dontUseWhen: "Don't use as a morning greeting.",
    contrast: "buenos días / buenas tardes",
    formality: "neutral",
    cefr: "A1",
  },

  adios: {
    id: "adios",
    lemma: "adiós",
    pos: "interjection",
    gender: "n/a",
    gloss: "goodbye",
    meaningSummary:
      "A clear goodbye, often when you won’t see someone soon. For a casual “see you later,” hasta luego or nos vemos feels warmer day to day.",
    examples: [
      { es: "Adiós, nos vemos pronto.", en: "Goodbye, see you soon." },
      { es: "¡Adiós! Que te vaya bien.", en: "Goodbye! Take care." },
    ],
    useWhen: "Saying goodbye, especially if you won't see them soon.",
    dontUseWhen: "For 'see you later', hasta luego is more natural.",
    contrast: "hasta luego / nos vemos",
    formality: "neutral",
    cefr: "A1",
  },

  "hasta-luego": {
    id: "hasta-luego",
    lemma: "hasta luego",
    pos: "phrase",
    gender: "n/a",
    gloss: "see you later",
    meaningSummary:
      "Friendly “see you later” when you’ll meet again soon — leaving a café, ending a call, stepping out of a shop. Softer and more everyday than adiós.",
    examples: [
      { es: "Hasta luego, ¡cuidate!", en: "See you later, take care!" },
      { es: "Okay, hasta luego. Nos vemos.", en: "Okay, see you later. See you." },
    ],
    useWhen: "Casual farewell when you'll see the person again soon.",
    dontUseWhen: "If the goodbye is final or very formal, adiós may fit better.",
    contrast: "adiós (more final) / nos vemos (see you)",
    formality: "informal",
    cefr: "A1",
  },

  "me-llamo": {
    id: "me-llamo",
    lemma: "llamarse",
    pos: "verb",
    gender: "n/a",
    gloss: "to be called / to be named",
    meaningSummary:
      "Reflexive verb for saying your name. Me llamo + name is the everyday introduction — never “soy llamo.” Ask someone ¿Cómo te llamas? (tú) or ¿Cómo se llama? (usted).",
    conjugations: LATAM_PRESENT([
      "me llamo",
      "te llamas",
      "se llama",
      "nos llamamos",
      "se llaman",
    ]),
    examples: [
      { es: "Me llamo Diego.", en: "My name is Diego." },
      { es: "Hola, me llamo Valeria. Mucho gusto.", en: "Hi, my name is Valeria. Nice to meet you." },
    ],
    useWhen: "Introducing yourself by name.",
    dontUseWhen: "Don't say 'soy llamo' — that's a common learner error.",
    contrast: "mi nombre es… (also fine, a bit more formal)",
    formality: "neutral",
    cefr: "A1",
  },

  "como-te-llamas": {
    id: "como-te-llamas",
    lemma: "¿cómo te llamas?",
    pos: "phrase",
    gender: "n/a",
    gloss: "what's your name? (tú)",
    meaningSummary:
      "The everyday tú question for someone’s name. With strangers, elders, or workplace formality, switch to ¿Cómo se llama? (usted).",
    examples: [
      { es: "Hola, ¿cómo te llamas?", en: "Hi, what's your name?" },
      { es: "¿Cómo te llamas? Yo me llamo Ana.", en: "What's your name? My name is Ana." },
    ],
    useWhen: "Asking a peer/friend their name (tú).",
    dontUseWhen: "With formal usted contexts — use ¿cómo se llama?",
    contrast: "¿cómo se llama? (usted)",
    formality: "informal",
    cefr: "A1",
  },

  ser: {
    id: "ser",
    lemma: "ser",
    pos: "verb",
    gender: "n/a",
    gloss: "to be (identity / essence)",
    meaningSummary:
      "Ser covers identity, origin, profession, and lasting traits — who or what something is. Soy Ana / Soy de México. Don’t confuse it with estar (location / temporary states).",
    conjugations: LATAM_PRESENT(["soy", "eres", "es", "somos", "son"]),
    examples: [
      { es: "Soy estudiante.", en: "I am a student." },
      { es: "Ella es de México.", en: "She is from Mexico." },
    ],
    useWhen: "Identity, origin, profession, permanent characteristics.",
    dontUseWhen: "Don't use for location or temporary feelings — use estar.",
    contrast: "estar (location / temporary states)",
    formality: "neutral",
    cefr: "A1",
  },

  "mucho-gusto": {
    id: "mucho-gusto",
    lemma: "mucho gusto",
    pos: "phrase",
    gender: "n/a",
    gloss: "nice to meet you",
    meaningSummary:
      "The everyday “nice to meet you” after introductions. Short, friendly, and safe in almost any setting when you meet someone for the first time.",
    examples: [
      { es: "Hola, soy Ana. ¡Mucho gusto!", en: "Hi, I'm Ana. Nice to meet you!" },
      { es: "Mucho gusto, Carlos. Bienvenido.", en: "Nice to meet you, Carlos. Welcome." },
    ],
    useWhen: "When meeting someone for the first time.",
    dontUseWhen: "Don't use with people you already know well.",
    contrast: "encantado/a (also 'pleased to meet you', slightly more formal)",
    formality: "neutral",
    cefr: "A1",
  },

  "como-estas": {
    id: "como-estas",
    lemma: "¿cómo estás?",
    pos: "phrase",
    gender: "n/a",
    gloss: "how are you? (tú)",
    meaningSummary:
      "Informal “how are you?” with tú. For strangers, elders, or workplace formality, switch to ¿cómo está? (usted).",
    examples: [
      { es: "Hola, ¿cómo estás?", en: "Hi, how are you?" },
      { es: "¿Cómo estás hoy?", en: "How are you today?" },
    ],
    useWhen: "Informal check-in with friends, family, peers (tú).",
    dontUseWhen: "With strangers or formal situations — use ¿cómo está?",
    contrast: "¿cómo está? (formal usted)",
    formality: "informal",
    cefr: "A1",
  },

  gracias: {
    id: "gracias",
    lemma: "gracias",
    pos: "interjection",
    gender: "n/a",
    gloss: "thank you",
    meaningSummary:
      "The everyday thank-you. Add muchas for stronger gratitude. Pair with de nada when someone thanks you.",
    examples: [
      { es: "Gracias por tu ayuda.", en: "Thank you for your help." },
      { es: "¡Muchas gracias!", en: "Thank you so much!" },
    ],
    useWhen: "Any time you want to thank someone.",
    dontUseWhen: "n/a — always safe; add de nada as the reply.",
    contrast: "muchas gracias (stronger thanks)",
    formality: "neutral",
    cefr: "A1",
  },

  por: {
    id: "por",
    lemma: "por favor",
    pos: "phrase",
    gender: "n/a",
    gloss: "please",
    meaningSummary:
      "Softens requests and orders. Usually sits at the end (Un café, por favor) or the start; you don’t need it on every statement — only when asking.",
    examples: [
      { es: "Un café, por favor.", en: "A coffee, please." },
      { es: "¿Me pasas el menú, por favor?", en: "Can you pass me the menu, please?" },
    ],
    useWhen: "Softening requests and orders.",
    dontUseWhen: "Not needed for every statement — only requests.",
    formality: "neutral",
    cefr: "A1",
  },

  "de-nada": {
    id: "de-nada",
    lemma: "de nada",
    pos: "phrase",
    gender: "n/a",
    gloss: "you're welcome",
    meaningSummary:
      "The classic reply to gracias — literally “of nothing,” meaning it was no trouble. Friendly alternatives include con gusto and no hay de qué.",
    examples: [
      { es: "—Gracias. —De nada.", en: "—Thank you. —You're welcome." },
      { es: "De nada, con gusto.", en: "You're welcome — glad to help." },
    ],
    useWhen: "Responding to gracias.",
    dontUseWhen: "Don't use it as a greeting or standalone opener.",
    contrast: "con gusto / no hay de qué",
    formality: "neutral",
    region: "'no hay de qué' also common",
    cefr: "A1",
  },

  perdon: {
    id: "perdon",
    lemma: "perdón",
    pos: "interjection",
    gender: "m",
    gloss: "sorry / excuse me",
    meaningSummary:
      "A light apology and polite attention-getter. Use it when you bump someone, need to pass, or didn’t catch what was said — not for deep regret (prefer lo siento).",
    examples: [
      { es: "Perdón, ¿dónde está el baño?", en: "Excuse me, where is the bathroom?" },
      { es: "¡Perdón! No te vi.", en: "Sorry! I didn't see you." },
    ],
    useWhen: "To apologize lightly or get someone's attention politely.",
    dontUseWhen: "For a deeper apology, prefer lo siento.",
    contrast: "disculpe / lo siento",
    formality: "neutral",
    cefr: "A1",
  },

  disculpe: {
    id: "disculpe",
    lemma: "disculpe",
    pos: "interjection",
    gender: "n/a",
    gloss: "excuse me (usted)",
    meaningSummary:
      "Polite “excuse me” with usted — asking for attention, interrupting gently, or a light apology with strangers and formal settings. Disculpa is the tú counterpart.",
    examples: [
      { es: "Disculpe, ¿habla inglés?", en: "Excuse me, do you speak English?" },
      { es: "Disculpe, ¿me puede ayudar?", en: "Excuse me, can you help me?" },
    ],
    useWhen: "Polite attention / light apology with usted.",
    dontUseWhen: "With close friends, perdón or disculpa is more natural.",
    contrast: "perdón (neutral) / disculpa (tú)",
    formality: "formal",
    cefr: "A1",
  },

  si: {
    id: "si",
    lemma: "sí",
    pos: "adverb",
    gender: "n/a",
    gloss: "yes",
    meaningSummary:
      "The basic yes. Accent mark (sí) distinguishes it from si = “if,” but in speech they’re clear from context — and accents are optional when you type here.",
    examples: [
      { es: "—¿Hablas español? —Sí.", en: "—Do you speak Spanish? —Yes." },
      { es: "Sí, por favor.", en: "Yes, please." },
    ],
    useWhen: "Agreeing or answering yes.",
    dontUseWhen: "Don't confuse with si (if) in writing when clarity matters.",
    formality: "neutral",
    cefr: "A1",
  },

  no: {
    id: "no",
    lemma: "no",
    pos: "adverb",
    gender: "n/a",
    gloss: "no / not",
    meaningSummary:
      "Negation and the word “no.” Place it before the verb: No hablo inglés. Soften refusals with gracias when declining something offered.",
    examples: [
      { es: "No, gracias.", en: "No, thank you." },
      { es: "No hablo mucho español.", en: "I don't speak much Spanish." },
    ],
    useWhen: "Saying no or negating a verb.",
    dontUseWhen: "n/a — core word; tone softens blunt refusals.",
    formality: "neutral",
    cefr: "A1",
  },

  "soy-de": {
    id: "soy-de",
    lemma: "soy de",
    pos: "phrase",
    gender: "n/a",
    gloss: "I am from…",
    meaningSummary:
      "Ser + de for origin or hometown: Soy de México. Contrast with vivo en… for where you live now — you can be from one place and live in another.",
    examples: [
      { es: "Soy de México.", en: "I'm from Mexico." },
      { es: "¿De dónde eres? Soy de Estados Unidos.", en: "Where are you from? I'm from the United States." },
    ],
    useWhen: "Talking about origin / hometown.",
    dontUseWhen: "For current residence, prefer vivo en…",
    contrast: "vivo en (I live in)",
    formality: "neutral",
    cefr: "A1",
  },

  "vivo-en": {
    id: "vivo-en",
    lemma: "vivo en",
    pos: "phrase",
    gender: "n/a",
    gloss: "I live in…",
    meaningSummary:
      "From vivir — where you live now. Vivo en Estados Unidos / Vivo en un departamento. Not the same as soy de (origin).",
    conjugations: LATAM_PRESENT([
      "vivo",
      "vives",
      "vive",
      "vivimos",
      "viven",
    ]),
    examples: [
      { es: "Vivo en Estados Unidos.", en: "I live in the United States." },
      { es: "Ella vive en un departamento en la ciudad.", en: "She lives in an apartment in the city." },
    ],
    useWhen: "Saying where you live currently.",
    dontUseWhen: "For nationality/origin, use soy de / ser.",
    contrast: "soy de (I am from)",
    formality: "neutral",
    cefr: "A1",
  },

  "estados-unidos": {
    id: "estados-unidos",
    lemma: "Estados Unidos",
    pos: "noun",
    gender: "m",
    gloss: "United States",
    meaningSummary:
      "The country name. With ser de / vivir en: Soy de Estados Unidos / Vivo en Estados Unidos. The demonym is estadounidense.",
    examples: [
      { es: "Soy de Estados Unidos.", en: "I'm from the United States." },
      { es: "Vivo en Estados Unidos.", en: "I live in the United States." },
    ],
    useWhen: "Naming the U.S. as origin or residence.",
    dontUseWhen: "n/a — use estadounidense for the adjective/person.",
    contrast: "estadounidense (U.S. person/adjective)",
    formality: "neutral",
    cefr: "A1",
  },

  mexico: {
    id: "mexico",
    lemma: "México",
    pos: "noun",
    gender: "m",
    gloss: "Mexico",
    meaningSummary:
      "Country name. High-frequency with soy de / vivo en. Spelling México with accent is standard; accents optional when typing answers here.",
    examples: [
      { es: "Soy de México.", en: "I'm from Mexico." },
      { es: "¿Vives en México?", en: "Do you live in Mexico?" },
    ],
    useWhen: "Talking about Mexico as a place.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "A1",
  },

  estadounidense: {
    id: "estadounidense",
    lemma: "estadounidense",
    pos: "adjective",
    gender: "mf",
    gloss: "American (U.S.) / from the U.S.",
    meaningSummary:
      "The preferred demonym for someone from the United States. Prefer Soy estadounidense or Soy de Estados Unidos over americano, which can mean anyone from the Americas.",
    examples: [
      { es: "Soy estadounidense.", en: "I'm American (from the U.S.)." },
      { es: "Es una empresa estadounidense.", en: "It's a U.S. company." },
    ],
    useWhen: "Nationality / adjective for the U.S.",
    dontUseWhen:
      "Don't assume americano always means U.S. — it can mean pan-American.",
    contrast: "de Estados Unidos / americano (ambiguous)",
    formality: "neutral",
    cefr: "A1",
  },

  hablar: {
    id: "hablar",
    lemma: "hablar",
    pos: "verb",
    gender: "n/a",
    gloss: "to speak / to talk",
    meaningSummary:
      "Regular -ar verb for speaking a language or talking with someone. Hablo español / ¿Hablas inglés? are core A1 patterns. Ustedes hablan… for plural “you.”",
    conjugations: LATAM_PRESENT([
      "hablo",
      "hablas",
      "habla",
      "hablamos",
      "hablan",
    ]),
    examples: [
      { es: "Hablo un poco de español.", en: "I speak a little Spanish." },
      { es: "¿Ustedes hablan inglés?", en: "Do you (plural) speak English?" },
    ],
    useWhen: "Talking about languages or the act of speaking.",
    dontUseWhen: "For 'say' a specific phrase, prefer decir.",
    contrast: "decir (to say) / platicar (to chat)",
    formality: "neutral",
    cefr: "A1",
  },

  espanol: {
    id: "espanol",
    lemma: "español",
    pos: "noun",
    gender: "m",
    gloss: "Spanish (language)",
    meaningSummary:
      "The Spanish language. Hablo español is the everyday way to say you speak Spanish in everyday Spanish.",
    examples: [
      { es: "Hablo español.", en: "I speak Spanish." },
      { es: "Estoy aprendiendo español.", en: "I'm learning Spanish." },
    ],
    useWhen: "Naming the Spanish language.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "A1",
  },

  ingles: {
    id: "ingles",
    lemma: "inglés",
    pos: "noun",
    gender: "m",
    gloss: "English (language)",
    meaningSummary:
      "The English language. ¿Hablas inglés? / Hablo inglés. Accents optional when you type answers in Uno.",
    examples: [
      { es: "¿Hablas inglés?", en: "Do you speak English?" },
      { es: "Hablo inglés y un poco de español.", en: "I speak English and a little Spanish." },
    ],
    useWhen: "Naming the English language.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "A1",
  },

  "un-poco-de": {
    id: "un-poco-de",
    lemma: "un poco de",
    pos: "phrase",
    gender: "n/a",
    gloss: "a little (bit of)",
    meaningSummary:
      "Softens ability or amount: Hablo un poco de español. Honest and natural for beginners — you’ll hear it constantly in real conversations.",
    examples: [
      { es: "Hablo un poco de español.", en: "I speak a little Spanish." },
      { es: "Sé un poco de inglés.", en: "I know a little English." },
    ],
    useWhen: "Saying you know/speak a little of something.",
    dontUseWhen: "Don't drop de before a noun: un poco de español (not un poco español).",
    formality: "neutral",
    cefr: "A1",
  },

  "de-donde-eres": {
    id: "de-donde-eres",
    lemma: "¿de dónde eres?",
    pos: "phrase",
    gender: "n/a",
    gloss: "where are you from? (tú)",
    meaningSummary:
      "The classic tú origin question. Answer with Soy de… For usted: ¿De dónde es? Keep tú first in Uno; use usted when the situation is formal.",
    examples: [
      { es: "¿De dónde eres?", en: "Where are you from?" },
      { es: "¿De dónde eres? — Soy de México.", en: "Where are you from? — I'm from Mexico." },
    ],
    useWhen: "Asking origin with tú.",
    dontUseWhen: "Formal usted → ¿de dónde es?",
    contrast: "¿de dónde es? (usted)",
    formality: "informal",
    cefr: "A1",
  },

  tambien: {
    id: "tambien",
    lemma: "también",
    pos: "adverb",
    gender: "n/a",
    gloss: "also / too",
    meaningSummary:
      "Adds agreement or an extra item: Yo también / Hablo inglés también. Place it near what you’re adding; you’ll hear it constantly in small talk.",
    examples: [
      { es: "Yo también hablo español.", en: "I speak Spanish too." },
      { es: "Me llamo Ana. — Yo también soy Ana.", en: "My name is Ana. — I'm also Ana." },
    ],
    useWhen: "Saying also / too.",
    dontUseWhen: "Don't confuse with tampoco (neither / either in negatives).",
    contrast: "tampoco (neither)",
    formality: "neutral",
    cefr: "A1",
  },

  pero: {
    id: "pero",
    lemma: "pero",
    pos: "phrase",
    gender: "n/a",
    gloss: "but",
    meaningSummary:
      "The everyday contrast word: Hablo español, pero un poco. Softens or limits what you just said — perfect for honest beginner sentences.",
    examples: [
      { es: "Hablo español, pero un poco.", en: "I speak Spanish, but a little." },
      { es: "Soy de México, pero vivo en Estados Unidos.", en: "I'm from Mexico, but I live in the United States." },
    ],
    useWhen: "Contrasting or limiting a statement.",
    dontUseWhen: "n/a — core connector.",
    formality: "neutral",
    cefr: "A1",
  },

  uno: {
    id: "uno",
    lemma: "uno / una",
    pos: "noun",
    gender: "mf",
    gloss: "one",
    meaningSummary:
      "The number one. As a noun/adjective it agrees: un café / una mesa. In counting aloud you’ll hear uno, dos, tres…",
    examples: [
      { es: "Uno, dos, tres.", en: "One, two, three." },
      { es: "Quiero un café, por favor.", en: "I want a coffee, please." },
    ],
    useWhen: "Counting or saying “one / a”.",
    dontUseWhen: "Before masculine nouns use un (un carro), not uno.",
    formality: "neutral",
    cefr: "A1",
  },

  dos: {
    id: "dos",
    lemma: "dos",
    pos: "noun",
    gender: "n/a",
    gloss: "two",
    meaningSummary:
      "The number two. Invariant: dos carros, dos personas. High-frequency in phone numbers, prices, and ages.",
    examples: [
      { es: "Tengo dos hermanos.", en: "I have two siblings." },
      { es: "Son las dos.", en: "It's two o'clock." },
    ],
    useWhen: "Counting or saying two of something.",
    dontUseWhen: "n/a — core number.",
    formality: "neutral",
    cefr: "A1",
  },

  tres: {
    id: "tres",
    lemma: "tres",
    pos: "noun",
    gender: "n/a",
    gloss: "three",
    meaningSummary:
      "The number three. Same form for all genders: tres días, tres amigas.",
    examples: [
      { es: "Vivo en el número tres.", en: "I live at number three." },
      { es: "Tres por favor.", en: "Three, please." },
    ],
    useWhen: "Counting or ordering three of something.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "A1",
  },

  cinco: {
    id: "cinco",
    lemma: "cinco",
    pos: "noun",
    gender: "n/a",
    gloss: "five",
    meaningSummary:
      "The number five. Common in prices, ages, and phone digits. Cinco pesos / Tengo cinco años (kids).",
    examples: [
      { es: "Cuesta cinco pesos.", en: "It costs five pesos." },
      { es: "Mi número termina en cinco.", en: "My number ends in five." },
    ],
    useWhen: "Counting, prices, digits.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "A1",
  },

  diez: {
    id: "diez",
    lemma: "diez",
    pos: "noun",
    gender: "n/a",
    gloss: "ten",
    meaningSummary:
      "The number ten. Milestone in counting 1–10 and a common round price or age.",
    examples: [
      { es: "Cuento hasta diez.", en: "I count to ten." },
      { es: "Son diez dólares.", en: "That's ten dollars." },
    ],
    useWhen: "Counting to ten, round amounts.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "A1",
  },

  veinte: {
    id: "veinte",
    lemma: "veinte",
    pos: "noun",
    gender: "n/a",
    gloss: "twenty",
    meaningSummary:
      "Twenty — useful for ages, prices, and phone chunks. After twenty, Spanish builds veintiuno, veintidós…",
    examples: [
      { es: "Tengo veinte años.", en: "I am twenty years old." },
      { es: "Cuesta veinte pesos.", en: "It costs twenty pesos." },
    ],
    useWhen: "Ages, prices, larger counts.",
    dontUseWhen: "n/a",
    formality: "neutral",
    cefr: "A1",
  },

  celular: {
    id: "celular",
    lemma: "celular",
    pos: "noun",
    gender: "m",
    gloss: "cell phone / mobile",
    meaningSummary:
      "Everyday word for a mobile phone. ¿Cuál es tu número de celular? is common in everyday Spanish.",
    examples: [
      { es: "¿Cuál es tu número de celular?", en: "What's your cell phone number?" },
      { es: "Mi celular no tiene señal.", en: "My phone has no signal." },
    ],
    useWhen: "Talking about mobile phones.",
    dontUseWhen: "When you mean a landline or phones in general — use teléfono.",
    contrast: "teléfono (phone in general) / celular (mobile)",
    formality: "neutral",
    cefr: "A1",
  },

  "cuantos-anos": {
    id: "cuantos-anos",
    lemma: "¿cuántos años tienes?",
    pos: "phrase",
    gender: "n/a",
    gloss: "how old are you? (tú)",
    meaningSummary:
      "The everyday age question with tú. Answer with Tengo + number + años — never “soy veinte años.” Usted: ¿Cuántos años tiene?",
    examples: [
      { es: "¿Cuántos años tienes?", en: "How old are you?" },
      { es: "Tengo veinticinco años.", en: "I am twenty-five years old." },
    ],
    useWhen: "Asking someone's age (tú).",
    dontUseWhen: "Don't answer with soy + number — use tengo … años.",
    contrast: "¿cuántos años tiene? (usted)",
    formality: "informal",
    cefr: "A1",
  },

  tener: {
    id: "tener",
    lemma: "tener",
    pos: "verb",
    gender: "n/a",
    gloss: "to have",
    meaningSummary:
      "Irregular core verb for possession and age: Tengo un celular / Tengo veinte años. Present: tengo, tienes, tiene, tenemos, tienen.",
    conjugations: [
      {
        label: "Present indicative",
        forms: [
          { person: "yo", form: "tengo" },
          { person: "tú", form: "tienes" },
          { person: "él/ella/usted", form: "tiene" },
          { person: "nosotros/as", form: "tenemos" },
          { person: "ustedes", form: "tienen" },
        ],
      },
    ],
    examples: [
      { es: "Tengo un celular nuevo.", en: "I have a new cell phone." },
      { es: "¿Tienes cinco minutos?", en: "Do you have five minutes?" },
    ],
    useWhen: "Possession, age, and many fixed expressions.",
    dontUseWhen: "For identity/profession prefer ser (Soy estudiante).",
    formality: "neutral",
    cefr: "A1",
  },

  "cuanto-cuesta": {
    id: "cuanto-cuesta",
    lemma: "¿cuánto cuesta?",
    pos: "phrase",
    gender: "n/a",
    gloss: "how much does it cost?",
    meaningSummary:
      "The go-to price question. Plural: ¿Cuánto cuestan? Answer with Cuesta / Cuestan + amount (+ pesos/dólares).",
    examples: [
      { es: "¿Cuánto cuesta?", en: "How much does it cost?" },
      { es: "¿Cuánto cuestan los jugos?", en: "How much do the juices cost?" },
    ],
    useWhen: "Asking the price of something.",
    dontUseWhen: "n/a — safe in shops and markets.",
    contrast: "¿cuánto es? (also common at checkout)",
    formality: "neutral",
    cefr: "A1",
  },

  pesos: {
    id: "pesos",
    lemma: "pesos",
    pos: "noun",
    gender: "m",
    gloss: "pesos (currency)",
    meaningSummary:
      "Common currency name across several countries (Mexico, Colombia, Chile, Argentina, etc.). Pair with numbers: diez pesos. For USD say dólares.",
    examples: [
      { es: "Cuesta diez pesos.", en: "It costs ten pesos." },
      { es: "Son cincuenta pesos.", en: "That's fifty pesos." },
    ],
    useWhen: "Talking about local currency amounts.",
    dontUseWhen: "For US dollars use dólares.",
    contrast: "dólares (USD)",
    formality: "neutral",
    region: "Mexico, Colombia, Chile, Argentina, and others",
    cefr: "A1",
  },

  dolares: {
    id: "dolares",
    lemma: "dólares",
    pos: "noun",
    gender: "m",
    gloss: "dollars",
    meaningSummary:
      "US (and other) dollars — widely understood in travel and online prices. Veinte dólares.",
    examples: [
      { es: "Cuesta veinte dólares.", en: "It costs twenty dollars." },
      { es: "¿Aceptan dólares?", en: "Do you accept dollars?" },
    ],
    useWhen: "USD or dollar amounts.",
    dontUseWhen: "Local cash is often pesos — ask if unsure.",
    contrast: "pesos",
    formality: "neutral",
    cefr: "A1",
  },

  gratis: {
    id: "gratis",
    lemma: "gratis",
    pos: "adverb",
    gender: "n/a",
    gloss: "free (no cost)",
    meaningSummary:
      "Means no charge: Es gratis / La entrada es gratis. Don't confuse with libre (free as in not busy / free time).",
    examples: [
      { es: "Es gratis.", en: "It's free." },
      { es: "El agua es gratis.", en: "The water is free." },
    ],
    useWhen: "Saying something has no cost.",
    dontUseWhen: "For “free time” use tiempo libre — not gratis.",
    contrast: "libre (available / free time)",
    formality: "neutral",
    cefr: "A1",
  },
  ...UNIT1_WORD_CARDS,
  ...UNIT2_WORD_CARDS,
  ...UNIT3_WORD_CARDS,
  ...INTERMEDIATE_WORD_CARDS,
};

function teach(
  id: string,
  wordCardId: string
): import("./types").TeachExercise {
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

let listenVoiceIndex = 0;

function listen(
  id: string,
  audioText: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  wordCardIds: string[],
  xp = 3
): import("./types").ListeningChooseExercise {
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

export const LESSONS: Record<string, Lesson> = {
  "u1-l1": {
    id: "u1-l1",
    unitId: "unit-1",
    title: "Hello & goodbye",
    description: "Greet by time of day and say goodbye naturally.",
    xpReward: 32,
    exercises: [
      teach("teach-u1l1-hola", "hola"),
      {
        id: "u1l1-1",
        type: "select",
        prompt: "How do you say a friendly “hi” any time of day?",
        options: ["Hola", "Adiós", "Gracias", "Perdón"],
        correctIndex: 0,
        explanation: "Hola is the universal casual hello.",
        wordCardIds: ["hola"],
        xp: 3,
      },
      teach("teach-u1l1-buenos-dias", "buenos-dias"),
      {
        id: "u1l1-2",
        type: "select",
        prompt: "How do you say “good morning”?",
        options: ["Buenas noches", "Buenos días", "Hasta luego", "De nada"],
        correctIndex: 1,
        explanation:
          "Buenos días is the standard morning greeting in everyday Spanish.",
        wordCardIds: ["buenos-dias"],
        xp: 3,
      },
      teach("teach-u1l1-buenas-tardes", "buenas-tardes"),
      {
        id: "u1l1-3",
        type: "situational-choose",
        prompt: "Pick the best greeting.",
        situation: "It's 3 p.m. You walk into a café and greet the barista.",
        options: ["Buenos días", "Buenas tardes", "Buenas noches", "Adiós"],
        correctIndex: 1,
        explanation:
          "At 3 p.m. you want buenas tardes. Buenos días is morning; buenas noches is evening/night.",
        wordCardIds: ["buenas-tardes"],
        xp: 3,
      },
      teach("teach-u1l1-buenas-noches", "buenas-noches"),
      listen(
        "u1l1-4",
        "Buenas noches",
        [
          "Good morning",
          "Good afternoon",
          "Good evening / good night",
          "See you later",
        ],
        2,
        "Buenas noches works as both an evening greeting and a good-night farewell.",
        ["buenas-noches"]
      ),
      teach("teach-u1l1-adios", "adios"),
      teach("teach-u1l1-hasta-luego", "hasta-luego"),
      {
        id: "u1l1-5",
        type: "situational-choose",
        prompt: "Choose the best farewell.",
        situation: "You're leaving a friend's house and will see them tomorrow.",
        options: ["Adiós", "Hasta luego", "Buenos días", "Perdón"],
        correctIndex: 1,
        explanation:
          "Hasta luego (“see you later”) fits when you'll meet again soon. Adiós can feel more final.",
        wordCardIds: ["hasta-luego", "adios"],
        xp: 3,
      },
      {
        id: "u1l1-6",
        type: "tap-chips",
        prompt: "Build: “Good morning.”",
        chips: ["Buenos", "días", "tardes", "noches", "Hola"],
        correctOrder: ["Buenos", "días"],
        explanation: "Buenos días — morning only.",
        wordCardIds: ["buenos-dias"],
        xp: 4,
      },
      {
        id: "u1l1-7",
        type: "translate",
        prompt: "Translate to Spanish: “Hello.”",
        acceptedAnswers: ["hola", "¡hola!", "ola"],
        hint: "One everyday word.",
        explanation: "Hola is the universal casual hello.",
        wordCardIds: ["hola"],
        xp: 3,
      },
      listen(
        "u1l1-8",
        "Hasta luego",
        ["Hasta luego", "Buenos días", "Mucho gusto", "De nada"],
        0,
        "Hasta luego = see you later.",
        ["hasta-luego"]
      ),
      {
        id: "u1l1-9",
        type: "translate",
        prompt: "Translate to Spanish: “Goodbye.”",
        acceptedAnswers: [
          "adiós",
          "adios",
          "¡adiós!",
          "hasta luego",
          "nos vemos",
        ],
        hint: "Adiós or a softer “see you later.”",
        explanation: "Adiós for goodbye; hasta luego if you'll see them soon.",
        wordCardIds: ["adios", "hasta-luego"],
        xp: 3,
      },
      {
        id: "u1l1-10",
        type: "select",
        prompt: "Which greeting fits late evening?",
        options: ["Buenos días", "Buenas tardes", "Buenas noches", "Hola días"],
        correctIndex: 2,
        explanation: "Evening / night → buenas noches.",
        wordCardIds: ["buenas-noches"],
        xp: 3,
      },
      {
        id: "u1l1-match",
        type: "match-pairs",
        prompt: "Match greetings & goodbyes.",
        pairs: [
          { left: "Hola", right: "Hi / hello" },
          { left: "Buenos días", right: "Good morning" },
          { left: "Buenas tardes", right: "Good afternoon" },
          { left: "Hasta luego", right: "See you later" },
        ],
        explanation: "Core hello/goodbye matches.",
        wordCardIds: ["hola", "buenos-dias", "buenas-tardes", "hasta-luego"],
        xp: 4,
      },
    ],
  },

  "u1-l2": {
    id: "u1-l2",
    unitId: "unit-1",
    title: "What’s your name?",
    description: "Introduce yourself and ask names (tú first).",
    xpReward: 28,
    exercises: [
      teach("teach-u1l2-me-llamo", "me-llamo"),
      {
        id: "u1l2-1",
        type: "select",
        prompt: "“My name is…” in Spanish is:",
        options: ["Me llamo…", "Yo nombre…", "Soy llamo…", "Te llamas…"],
        correctIndex: 0,
        explanation: "Me llamo + name. Never “soy llamo.”",
        wordCardIds: ["me-llamo"],
        xp: 3,
      },
      teach("teach-u1l2-como-te-llamas", "como-te-llamas"),
      {
        id: "u1l2-2",
        type: "select",
        prompt: "How do you casually ask “What’s your name?” (tú)",
        options: [
          "¿Cómo te llamas?",
          "¿Cómo se llama?",
          "¿Qué llamo?",
          "¿Cómo estás?",
        ],
        correctIndex: 0,
        explanation:
          "¿Cómo te llamas? uses tú. ¿Cómo se llama? is usted (formal).",
        wordCardIds: ["como-te-llamas"],
        xp: 3,
      },
      teach("teach-u1l2-ser", "ser"),
      {
        id: "u1l2-3",
        type: "tap-chips",
        prompt: "Build: “Hello, my name is Ana.”",
        chips: ["Ana", "Hola,", "me", "llamo", "días", "perdón"],
        correctOrder: ["Hola,", "me", "llamo", "Ana"],
        explanation: "Me llamo + name is the everyday introduction.",
        wordCardIds: ["hola", "me-llamo"],
        xp: 4,
      },
      teach("teach-u1l2-mucho-gusto", "mucho-gusto"),
      listen(
        "u1l2-4",
        "Mucho gusto",
        ["Mucho gusto", "Me llamo", "Por favor", "De nada"],
        0,
        "Mucho gusto means “nice to meet you.”",
        ["mucho-gusto"]
      ),
      {
        id: "u1l2-5",
        type: "translate",
        prompt: "Translate to Spanish: “Nice to meet you.”",
        acceptedAnswers: [
          "mucho gusto",
          "¡mucho gusto!",
          "mucho gusto!",
          "encantado",
          "encantada",
        ],
        hint: "Two words; very common when meeting someone new.",
        explanation:
          "Mucho gusto is the go-to phrase. Encantado/a also works.",
        wordCardIds: ["mucho-gusto"],
        xp: 4,
      },
      listen(
        "u1l2-6",
        "Me llamo Sofía",
        [
          "Me llamo Sofía",
          "Mucho gusto Sofía",
          "Perdón Sofía",
          "Gracias Sofía",
        ],
        0,
        "Self-introduction with me llamo.",
        ["me-llamo"]
      ),
      teach("teach-u1l2-como-estas", "como-estas"),
      {
        id: "u1l2-7",
        type: "situational-choose",
        prompt: "You meet someone new at a meetup.",
        situation: "After saying your name, what do you add?",
        options: ["Mucho gusto", "Adiós", "Perdón", "De nada"],
        correctIndex: 0,
        explanation: "Mucho gusto = nice to meet you.",
        wordCardIds: ["mucho-gusto"],
        xp: 3,
      },
      {
        id: "u1l2-8",
        type: "select",
        prompt: "How do you casually ask a friend “How are you?”",
        options: [
          "¿Cómo está?",
          "¿Cómo estás?",
          "¿Qué llamo?",
          "¿Buenos días?",
        ],
        correctIndex: 1,
        explanation:
          "¿Cómo estás? uses tú. With strangers, prefer ¿cómo está?",
        wordCardIds: ["como-estas"],
        xp: 3,
      },
      {
        id: "u1l2-9",
        type: "situational-choose",
        prompt: "Formal “How are you?” at work.",
        situation: "You greet your manager in the morning (usted).",
        options: ["¿Cómo estás?", "¿Cómo está?", "¿Cómo soy?", "¿Me llamo?"],
        correctIndex: 1,
        explanation: "¿Cómo está? = usted (formal).",
        wordCardIds: ["como-estas"],
        xp: 3,
      },
      listen(
        "u1l2-10",
        "Hola, ¿cómo estás?",
        [
          "Hola, ¿cómo estás?",
          "Buenas noches",
          "Mucho gusto",
          "Por favor",
        ],
        0,
        "A friendly informal check-in.",
        ["hola", "como-estas"]
      ),
      {
        id: "u1l2-11",
        type: "translate",
        prompt: "Translate: “My name is Carlos.”",
        acceptedAnswers: [
          "me llamo carlos",
          "me llamo Carlos",
          "yo me llamo carlos",
          "mi nombre es carlos",
          "soy carlos",
        ],
        hint: "Me llamo + name (or mi nombre es…).",
        explanation: "Me llamo Carlos is the everyday line.",
        wordCardIds: ["me-llamo", "ser"],
        xp: 4,
      },
    ],
  },

  "u1-l3": {
    id: "u1-l3",
    unitId: "unit-1",
    title: "Thanks & sorry",
    description: "Stay polite: please, thanks, and light apologies.",
    xpReward: 26,
    exercises: [
      teach("teach-u1l3-gracias", "gracias"),
      {
        id: "u1l3-1",
        type: "translate",
        prompt: "Translate to Spanish: “Thank you.”",
        acceptedAnswers: [
          "gracias",
          "¡gracias!",
          "muchas gracias",
          "mil gracias",
        ],
        hint: "One word you'll use every day.",
        explanation: "Gracias is thank you; muchas gracias turns it up.",
        wordCardIds: ["gracias"],
        xp: 3,
      },
      teach("teach-u1l3-por", "por"),
      {
        id: "u1l3-2",
        type: "tap-chips",
        prompt: "Build a polite request: “A coffee, please.”",
        chips: ["Un", "café,", "por", "favor", "jugo", "carro"],
        correctOrder: ["Un", "café,", "por", "favor"],
        explanation:
          "Por favor softens requests.",
        wordCardIds: ["por"],
        xp: 4,
      },
      teach("teach-u1l3-de-nada", "de-nada"),
      {
        id: "u1l3-3",
        type: "situational-choose",
        prompt: "What should you say?",
        situation:
          "Someone thanks you: “¡Gracias!” You want to reply “You're welcome.”",
        options: ["De nada", "Perdón", "Mucho gusto", "Buenos días"],
        correctIndex: 0,
        explanation: "De nada is the classic reply to gracias.",
        wordCardIds: ["de-nada", "gracias"],
        xp: 3,
      },
      listen(
        "u1l3-4",
        "Gracias",
        ["Gracias", "De nada", "Hola", "Adiós"],
        0,
        "Gracias = thank you.",
        ["gracias"]
      ),
      teach("teach-u1l3-perdon", "perdon"),
      teach("teach-u1l3-disculpe", "disculpe"),
      {
        id: "u1l3-5",
        type: "select",
        prompt: "Which phrase means “excuse me / sorry” (light apology)?",
        options: ["Gracias", "Perdón", "Adiós", "Buenas noches"],
        correctIndex: 1,
        explanation:
          "Perdón covers “excuse me” and light “sorry.” Disculpe is more usted-polite.",
        wordCardIds: ["perdon"],
        xp: 3,
      },
      {
        id: "u1l3-6",
        type: "situational-choose",
        prompt: "Best polite attention-getter?",
        situation:
          "You need to ask a stranger for directions (usted).",
        options: ["Disculpe", "Hola días", "De nada", "Hasta luego"],
        correctIndex: 0,
        explanation: "Disculpe is the polite usted “excuse me.”",
        wordCardIds: ["disculpe"],
        xp: 3,
      },
      {
        id: "u1l3-7",
        type: "translate",
        prompt: "Translate: “Please.”",
        acceptedAnswers: ["por favor", "porfa"],
        explanation: "Por favor goes at the end or start of a request.",
        wordCardIds: ["por"],
        xp: 3,
      },
      listen(
        "u1l3-8",
        "Perdón",
        ["Perdón", "Gracias", "Hola", "Adiós"],
        0,
        "Perdón = excuse me / light sorry.",
        ["perdon"]
      ),
      listen(
        "u1l3-9",
        "Disculpe",
        ["Disculpe", "Mucho gusto", "Buenos días", "Hasta luego"],
        0,
        "Disculpe = polite usted “excuse me.”",
        ["disculpe"]
      ),
      {
        id: "u1l3-10",
        type: "translate",
        prompt: "Translate: “Excuse me” / light “sorry.”",
        acceptedAnswers: [
          "perdón",
          "perdon",
          "disculpe",
          "disculpa",
          "disculpame",
          "discúlpame",
          "dispensa",
        ],
        hint: "Common light apology / attention-getter.",
        explanation:
          "Perdón is everyday; disculpe / disculpa are near-synonyms.",
        wordCardIds: ["perdon", "disculpe"],
        xp: 3,
      },
      teach("teach-u1l3-si", "si"),
      teach("teach-u1l3-no", "no"),
      {
        id: "u1l3-11",
        type: "situational-choose",
        prompt: "Someone offers you water you don’t want.",
        situation: "You decline politely.",
        options: ["No, gracias", "Sí, perdón", "De nada", "Me llamo"],
        correctIndex: 0,
        explanation: "No, gracias softens a refusal.",
        wordCardIds: ["no", "gracias"],
        xp: 3,
      },
    ],
  },

  "u1-l4": {
    id: "u1-l4",
    unitId: "unit-1",
    title: "First chat check",
    description: "Mixed review: greetings, names, and polite basics.",
    xpReward: 30,
    exercises: [
      {
        id: "u1l4-1",
        type: "situational-choose",
        prompt: "It's 9 a.m. at the office.",
        situation: "You greet a coworker as you arrive.",
        options: ["Buenos días", "Buenas noches", "Adiós", "De nada"],
        correctIndex: 0,
        explanation: "Morning → buenos días.",
        wordCardIds: ["buenos-dias"],
        xp: 3,
      },
      {
        id: "u1l4-2",
        type: "tap-chips",
        prompt: "Build: “Nice to meet you.”",
        chips: ["Mucho", "gusto", "nada", "perdón", "días"],
        correctOrder: ["Mucho", "gusto"],
        explanation: "Two-word classic for first meetings.",
        wordCardIds: ["mucho-gusto"],
        xp: 3,
      },
      listen(
        "u1l4-3",
        "Hola, ¿cómo estás?",
        [
          "Hola, ¿cómo estás?",
          "¿Cómo te llamas?",
          "Mucho gusto",
          "Hasta luego",
        ],
        0,
        "Friendly informal check-in.",
        ["hola", "como-estas"]
      ),
      {
        id: "u1l4-4",
        type: "select",
        prompt: "Best reply to “¡Gracias!”?",
        options: ["De nada", "Perdón", "Adiós", "Soy"],
        correctIndex: 0,
        explanation: "Answer thanks with de nada.",
        wordCardIds: ["de-nada"],
        xp: 3,
      },
      {
        id: "u1l4-5",
        type: "translate",
        prompt: "Translate: “What’s your name?” (tú)",
        acceptedAnswers: [
          "cómo te llamas",
          "como te llamas",
          "¿cómo te llamas?",
          "¿como te llamas?",
        ],
        hint: "Cómo + te llamas.",
        explanation: "¿Cómo te llamas? for tú.",
        wordCardIds: ["como-te-llamas"],
        xp: 4,
      },
      {
        id: "u1l4-6",
        type: "situational-choose",
        prompt: "You bump someone lightly in a store.",
        situation: "Quick light apology.",
        options: ["Perdón", "Mucho gusto", "Buenas tardes", "Hasta luego"],
        correctIndex: 0,
        explanation: "Perdón is the quick everyday “excuse me / sorry.”",
        wordCardIds: ["perdon"],
        xp: 3,
      },
      listen(
        "u1l4-7",
        "Me llamo Sofía",
        ["Me llamo Sofía", "Soy Sofía llamo", "Gracias Sofía", "Adiós Sofía"],
        0,
        "Me llamo + name.",
        ["me-llamo"]
      ),
      {
        id: "u1l4-8",
        type: "tap-chips",
        prompt: "Build: “See you later.”",
        chips: ["Hasta", "luego", "días", "gracias", "hola"],
        correctOrder: ["Hasta", "luego"],
        explanation: "Hasta luego for a warm short-term goodbye.",
        wordCardIds: ["hasta-luego"],
        xp: 3,
      },
      {
        id: "u1l4-9",
        type: "select",
        prompt: "Which is a friendly daytime hello?",
        options: ["Hola", "Departamento", "Celular", "Computadora"],
        correctIndex: 0,
        explanation:
          "Hola works any time.",
        wordCardIds: ["hola"],
        xp: 3,
      },
      {
        id: "u1l4-10",
        type: "translate",
        prompt: "Translate: “You're welcome.”",
        acceptedAnswers: ["de nada", "con gusto", "no hay de qué", "no hay de que"],
        explanation: "De nada is the classic reply.",
        wordCardIds: ["de-nada"],
        xp: 3,
      },
      listen(
        "u1l4-11",
        "Buenos días",
        ["Buenos días", "Buenas noches", "Hasta luego", "Perdón"],
        0,
        "Morning greeting.",
        ["buenos-dias"]
      ),
      {
        id: "u1l4-12",
        type: "situational-choose",
        prompt: "End a short café chat.",
        situation: "You'll probably see them again this week.",
        options: ["Hasta luego", "Soy de", "Un poco de", "Celular"],
        correctIndex: 0,
        explanation: "Hasta luego fits a friendly short-term goodbye.",
        wordCardIds: ["hasta-luego"],
        xp: 3,
      },
    ],
  },

  "u2-l1": {
    id: "u2-l1",
    unitId: "unit-2",
    title: "I’m from… / I live in…",
    description: "Origin vs residence: soy de and vivo en.",
    xpReward: 28,
    exercises: [
      teach("teach-u2l1-soy-de", "soy-de"),
      teach("teach-u2l1-ser", "ser"),
      {
        id: "u2l1-1",
        type: "select",
        prompt: "“I am from…” in Spanish starts with:",
        options: ["Soy de…", "Vivo de…", "Hablo de…", "Me llamo de…"],
        correctIndex: 0,
        explanation: "Soy de + place = origin.",
        wordCardIds: ["soy-de", "ser"],
        xp: 3,
      },
      teach("teach-u2l1-vivo-en", "vivo-en"),
      {
        id: "u2l1-2",
        type: "select",
        prompt: "Which talks about where you live now?",
        options: ["Vivo en…", "Soy de…", "Me llamo…", "Mucho gusto"],
        correctIndex: 0,
        explanation: "Vivo en = I live in. Soy de = I am from.",
        wordCardIds: ["vivo-en", "soy-de"],
        xp: 3,
      },
      teach("teach-u2l1-mexico", "mexico"),
      teach("teach-u2l1-estados-unidos", "estados-unidos"),
      {
        id: "u2l1-3",
        type: "tap-chips",
        prompt: "Build: “I am from Mexico.”",
        chips: ["Soy", "de", "México", "vivo", "hablo"],
        correctOrder: ["Soy", "de", "México"],
        explanation: "Soy de México — origin.",
        wordCardIds: ["soy-de", "mexico"],
        xp: 4,
      },
      teach("teach-u2l1-de-donde-eres", "de-donde-eres"),
      {
        id: "u2l1-4",
        type: "translate",
        prompt: "Translate: “Where are you from?” (tú)",
        acceptedAnswers: [
          "de dónde eres",
          "de donde eres",
          "¿de dónde eres?",
          "¿de donde eres?",
        ],
        hint: "De dónde + eres.",
        explanation: "¿De dónde eres? Answer with Soy de…",
        wordCardIds: ["de-donde-eres"],
        xp: 4,
      },
      listen(
        "u2l1-5",
        "Soy de México",
        ["Soy de México", "Vivo de México", "Hablo México", "Me llamo México"],
        0,
        "Soy de + country = origin.",
        ["soy-de", "mexico"]
      ),
      {
        id: "u2l1-6",
        type: "tap-chips",
        prompt: "Build: “I live in the United States.”",
        chips: ["Vivo", "en", "Estados", "Unidos", "Soy", "de"],
        correctOrder: ["Vivo", "en", "Estados", "Unidos"],
        explanation: "Vivo en Estados Unidos — current residence.",
        wordCardIds: ["vivo-en", "estados-unidos"],
        xp: 4,
      },
      teach("teach-u2l1-estadounidense", "estadounidense"),
      {
        id: "u2l1-7",
        type: "select",
        prompt: "A clear way to say you’re from the U.S.:",
        options: [
          "Soy estadounidense",
          "Soy americano siempre",
          "Vivo de Estados Unidos",
          "Hablo Estados Unidos",
        ],
        correctIndex: 0,
        explanation:
          "Soy estadounidense or Soy de Estados Unidos. Americano can be ambiguous.",
        wordCardIds: ["estadounidense", "estados-unidos"],
        xp: 3,
      },
      listen(
        "u2l1-8",
        "Vivo en Estados Unidos",
        [
          "Vivo en Estados Unidos",
          "Soy en Estados Unidos",
          "Hablo Estados Unidos",
          "Me llamo Unidos",
        ],
        0,
        "Vivo en + place = where you live.",
        ["vivo-en", "estados-unidos"]
      ),
      {
        id: "u2l1-9",
        type: "situational-choose",
        prompt: "Someone asks ¿De dónde eres?",
        situation: "You grew up in Mexico.",
        options: [
          "Soy de México",
          "Vivo de México",
          "Hablo México",
          "Gracias México",
        ],
        correctIndex: 0,
        explanation: "Answer origin with Soy de…",
        wordCardIds: ["soy-de", "mexico"],
        xp: 3,
      },
      {
        id: "u2l1-10",
        type: "translate",
        prompt: "Translate: “I live in Mexico.”",
        acceptedAnswers: [
          "vivo en méxico",
          "vivo en mexico",
          "yo vivo en méxico",
          "yo vivo en mexico",
        ],
        explanation: "Vivo en México.",
        wordCardIds: ["vivo-en", "mexico"],
        xp: 3,
      },
      {
        id: "u2l1-fill",
        type: "fill-blank",
        prompt: "Type the missing Spanish.",
        englishPrompt: "I'm from Mexico.",
        template: "___ de México.",
        acceptedAnswers: ["Soy", "soy"],
        hint: "I am (from…)",
        explanation: "Soy de México.",
        wordCardIds: ["soy-de", "mexico"],
        xp: 3,
      },
      {
        id: "u2l1-match",
        type: "match-pairs",
        prompt: "Match origin & residence.",
        pairs: [
          { left: "Soy de…", right: "I am from…" },
          { left: "Vivo en…", right: "I live in…" },
          { left: "Estados Unidos", right: "United States" },
          { left: "estadounidense", right: "American (U.S.)" },
        ],
        explanation: "Origin vs residence.",
        wordCardIds: ["soy-de", "vivo-en", "estados-unidos", "estadounidense"],
        xp: 4,
      },
    ],
  },

  "u2-l2": {
    id: "u2-l2",
    unitId: "unit-2",
    title: "I speak…",
    description: "Talk about languages with hablar and un poco de.",
    xpReward: 28,
    exercises: [
      teach("teach-u2l2-hablar", "hablar"),
      {
        id: "u2l2-1",
        type: "select",
        prompt: "“I speak…” uses which yo form?",
        options: ["hablo", "hablas", "habla", "hablan"],
        correctIndex: 0,
        explanation: "Yo hablo… Regular -ar present.",
        wordCardIds: ["hablar"],
        xp: 3,
      },
      teach("teach-u2l2-espanol", "espanol"),
      teach("teach-u2l2-ingles", "ingles"),
      {
        id: "u2l2-2",
        type: "tap-chips",
        prompt: "Build: “I speak Spanish.”",
        chips: ["Hablo", "español", "inglés", "vivo", "de"],
        correctOrder: ["Hablo", "español"],
        explanation: "Hablo español.",
        wordCardIds: ["hablar", "espanol"],
        xp: 4,
      },
      teach("teach-u2l2-un-poco-de", "un-poco-de"),
      {
        id: "u2l2-3",
        type: "select",
        prompt: "How do you say you speak a little Spanish?",
        options: [
          "Hablo un poco de español",
          "Hablo un poco español",
          "Soy un poco de español",
          "Vivo un poco español",
        ],
        correctIndex: 0,
        explanation: "Keep de: un poco de + noun.",
        wordCardIds: ["un-poco-de", "hablar", "espanol"],
        xp: 3,
      },
      {
        id: "u2l2-4",
        type: "translate",
        prompt: "Translate: “Do you speak English?” (tú)",
        acceptedAnswers: [
          "hablas inglés",
          "hablas ingles",
          "¿hablas inglés?",
          "¿hablas ingles?",
          "tú hablas inglés",
          "tu hablas ingles",
        ],
        hint: "Hablas + inglés.",
        explanation: "¿Hablas inglés?",
        wordCardIds: ["hablar", "ingles"],
        xp: 4,
      },
      listen(
        "u2l2-5",
        "Hablo español",
        ["Hablo español", "Soy español hablo", "Vivo español", "Gracias español"],
        0,
        "Hablo + language.",
        ["hablar", "espanol"]
      ),
      teach("teach-u2l2-tambien", "tambien"),
      teach("teach-u2l2-pero", "pero"),
      {
        id: "u2l2-6",
        type: "tap-chips",
        prompt: "Build: “I speak Spanish, but a little.”",
        chips: ["Hablo", "español,", "pero", "un", "poco", "vivo"],
        correctOrder: ["Hablo", "español,", "pero", "un", "poco"],
        explanation: "Pero softens: Hablo español, pero un poco.",
        wordCardIds: ["hablar", "pero", "un-poco-de"],
        xp: 4,
      },
      {
        id: "u2l2-7",
        type: "situational-choose",
        prompt: "Your friend says “Hablo inglés.”",
        situation: "You do too.",
        options: ["Yo también", "Yo pero", "Yo perdón", "Yo departamento"],
        correctIndex: 0,
        explanation: "También = also / too.",
        wordCardIds: ["tambien"],
        xp: 3,
      },
      listen(
        "u2l2-8",
        "¿Hablas inglés?",
        ["¿Hablas inglés?", "¿Vives inglés?", "¿Eres inglés hablo?", "Mucho gusto"],
        0,
        "¿Hablas…? = Do you speak…? (tú)",
        ["hablar", "ingles"]
      ),
      {
        id: "u2l2-9",
        type: "select",
        prompt: "Plural “you speak” is:",
        options: ["hablan", "habláis", "hablo", "hablamos"],
        correctIndex: 0,
        explanation:
          "Ustedes hablan… Uno uses ustedes for plural “you.”",
        wordCardIds: ["hablar"],
        xp: 3,
      },
      {
        id: "u2l2-10",
        type: "translate",
        prompt: "Translate: “I speak a little Spanish.”",
        acceptedAnswers: [
          "hablo un poco de español",
          "hablo un poco de espanol",
          "yo hablo un poco de español",
          "hablo un poco español",
        ],
        explanation: "Hablo un poco de español.",
        wordCardIds: ["hablar", "un-poco-de", "espanol"],
        xp: 4,
      },
    ],
  },

  "u2-l3": {
    id: "u2-l3",
    unitId: "unit-2",
    title: "About you check",
    description: "Mixed review: origin, home, and languages.",
    xpReward: 30,
    exercises: [
      {
        id: "u2l3-1",
        type: "situational-choose",
        prompt: "Small talk opener.",
        situation: "A new classmate asks where you’re from (tú).",
        options: [
          "¿De dónde eres?",
          "¿Cómo te llamas de?",
          "¿Vivo dónde?",
          "¿Gracias de?",
        ],
        correctIndex: 0,
        explanation: "¿De dónde eres? for origin.",
        wordCardIds: ["de-donde-eres"],
        xp: 3,
      },
      {
        id: "u2l3-2",
        type: "select",
        prompt: "Soy de vs vivo en — which is origin?",
        options: ["Soy de", "Vivo en", "Hablo de", "Me llamo en"],
        correctIndex: 0,
        explanation: "Soy de = from; vivo en = live in.",
        wordCardIds: ["soy-de", "vivo-en"],
        xp: 3,
      },
      listen(
        "u2l3-3",
        "Soy de México",
        ["Soy de México", "Vivo de México", "Hablo de México", "Perdón México"],
        0,
        "Origin with soy de.",
        ["soy-de", "mexico"]
      ),
      {
        id: "u2l3-4",
        type: "tap-chips",
        prompt: "Build: “I speak a little English.”",
        chips: ["Hablo", "un", "poco", "de", "inglés", "español"],
        correctOrder: ["Hablo", "un", "poco", "de", "inglés"],
        explanation: "Hablo un poco de inglés.",
        wordCardIds: ["hablar", "un-poco-de", "ingles"],
        xp: 4,
      },
      {
        id: "u2l3-5",
        type: "translate",
        prompt: "Translate: “I am from the United States.”",
        acceptedAnswers: [
          "soy de estados unidos",
          "soy estadounidense",
          "yo soy de estados unidos",
          "yo soy estadounidense",
        ],
        explanation: "Soy de Estados Unidos or Soy estadounidense.",
        wordCardIds: ["soy-de", "estados-unidos", "estadounidense"],
        xp: 4,
      },
      listen(
        "u2l3-6",
        "Hablo un poco de español",
        [
          "Hablo un poco de español",
          "Soy un poco de español",
          "Vivo un poco español",
          "Gracias español",
        ],
        0,
        "Honest beginner line with un poco de.",
        ["hablar", "un-poco-de", "espanol"]
      ),
      {
        id: "u2l3-7",
        type: "situational-choose",
        prompt: "You live in the U.S. but you’re from Mexico.",
        situation: "How do you say that contrast?",
        options: [
          "Soy de México, pero vivo en Estados Unidos",
          "Vivo de México, pero soy en Estados Unidos",
          "Hablo México, pero inglés Estados Unidos",
          "Me llamo México Estados Unidos",
        ],
        correctIndex: 0,
        explanation: "Soy de…, pero vivo en…",
        wordCardIds: ["soy-de", "vivo-en", "pero"],
        xp: 4,
      },
      {
        id: "u2l3-8",
        type: "select",
        prompt: "“I also speak Spanish” can start with:",
        options: ["También hablo…", "Pero soy…", "Perdón hablo…", "De nada hablo…"],
        correctIndex: 0,
        explanation: "También = also.",
        wordCardIds: ["tambien", "hablar"],
        xp: 3,
      },
      listen(
        "u2l3-9",
        "¿De dónde eres?",
        ["¿De dónde eres?", "¿Cómo te llamas?", "¿Hablas inglés?", "Hasta luego"],
        0,
        "Origin question (tú).",
        ["de-donde-eres"]
      ),
      {
        id: "u2l3-10",
        type: "translate",
        prompt: "Translate: “I live in the United States.”",
        acceptedAnswers: [
          "vivo en estados unidos",
          "yo vivo en estados unidos",
        ],
        explanation: "Vivo en Estados Unidos.",
        wordCardIds: ["vivo-en", "estados-unidos"],
        xp: 3,
      },
      {
        id: "u2l3-11",
        type: "situational-choose",
        prompt: "Someone asks ¿Hablas español?",
        situation: "You're a beginner being honest.",
        options: [
          "Sí, un poco",
          "No, carro",
          "De nada español",
          "Hasta luego español",
        ],
        correctIndex: 0,
        explanation: "Sí, un poco is natural and friendly.",
        wordCardIds: ["si", "un-poco-de", "hablar"],
        xp: 3,
      },
      {
        id: "u2l3-12",
        type: "tap-chips",
        prompt: "Build: “I’m from Mexico.”",
        chips: ["Soy", "de", "México", "Vivo", "Hablo"],
        correctOrder: ["Soy", "de", "México"],
        explanation: "Soy de México.",
        wordCardIds: ["soy-de", "mexico"],
        xp: 3,
      },
    ],
  },

  "u3-l1": {
    id: "u3-l1",
    unitId: "unit-3",
    title: "Numbers 1–10",
    description: "Count the essentials you’ll hear every day.",
    xpReward: 36,
    exercises: [
      teach("teach-u3l1-uno", "uno"),
      {
        id: "u3l1-1",
        type: "select",
        prompt: "How do you say “one” when counting?",
        options: ["Uno", "Diez", "Gratis", "Pesos"],
        correctIndex: 0,
        explanation: "Uno is one when you count: uno, dos, tres…",
        wordCardIds: ["uno"],
        xp: 3,
      },
      teach("teach-u3l1-dos", "dos"),
      {
        id: "u3l1-2",
        type: "select",
        prompt: "What number is dos?",
        options: ["One", "Two", "Five", "Ten"],
        correctIndex: 1,
        explanation: "Dos means two.",
        wordCardIds: ["dos"],
        xp: 3,
      },
      teach("teach-u3l1-tres", "tres"),
      {
        id: "u3l1-3",
        type: "tap-chips",
        prompt: "Build: “One, two, three.”",
        chips: ["Uno", "dos", "tres", "cinco", "diez"],
        correctOrder: ["Uno", "dos", "tres"],
        explanation: "Uno, dos, tres.",
        wordCardIds: ["uno", "dos", "tres"],
        xp: 3,
      },
      teach("teach-u3l1-cinco", "cinco"),
      listen(
        "u3l1-4",
        "Cuesta cinco pesos.",
        ["It costs five pesos.", "I have five phones.", "It's free.", "Twenty dollars."],
        0,
        "Cuesta cinco pesos = It costs five pesos.",
        ["cinco", "pesos"]
      ),
      teach("teach-u3l1-diez", "diez"),
      {
        id: "u3l1-5",
        type: "select",
        prompt: "How do you say “ten”?",
        options: ["Cinco", "Veinte", "Diez", "Tres"],
        correctIndex: 2,
        explanation: "Diez is ten.",
        wordCardIds: ["diez"],
        xp: 3,
      },
      {
        id: "u3l1-6",
        type: "translate",
        prompt: "Translate: “I want a coffee, please.”",
        acceptedAnswers: [
          "Quiero un café, por favor.",
          "Quiero un cafe, por favor",
          "Quiero un café por favor",
        ],
        hint: "un café + por favor",
        explanation: "Quiero un café, por favor.",
        wordCardIds: ["uno", "por"],
        xp: 4,
      },
      listen(
        "u3l1-7",
        "Uno, dos, tres.",
        ["One, two, three.", "Eight, nine, ten.", "How much is it?", "I'm twenty."],
        0,
        "Uno, dos, tres = One, two, three.",
        ["uno", "dos", "tres"]
      ),
      {
        id: "u3l1-8",
        type: "situational-choose",
        prompt: "Pick the best line.",
        situation: "You're counting three tickets out loud.",
        options: ["Uno, dos, tres.", "Es gratis.", "¿Cuánto cuesta?", "Tengo veinte años."],
        correctIndex: 0,
        explanation: "Counting three items: uno, dos, tres.",
        wordCardIds: ["uno", "dos", "tres"],
        xp: 3,
      },
      {
        id: "u3l1-9",
        type: "match-pairs",
        prompt: "Match the numbers.",
        pairs: [
          { left: "uno", right: "one" },
          { left: "dos", right: "two" },
          { left: "tres", right: "three" },
          { left: "cinco", right: "five" },
          { left: "diez", right: "ten" },
        ],
        explanation: "uno=one, dos=two, tres=three, cinco=five, diez=ten.",
        wordCardIds: ["uno", "dos", "tres", "cinco", "diez"],
        xp: 4,
      },
      {
        id: "u3l1-10",
        type: "fill-blank",
        prompt: "Type the missing Spanish.",
        englishPrompt: "One, two, three.",
        template: "___, dos, tres.",
        acceptedAnswers: ["Uno", "uno"],
        hint: "The number one",
        explanation: "Uno, dos, tres.",
        wordCardIds: ["uno"],
        xp: 3,
      },
    ],
  },

  "u3-l2": {
    id: "u3-l2",
    unitId: "unit-3",
    title: "Phone & age",
    description: "Celular numbers and saying how old you are.",
    xpReward: 32,
    exercises: [
      teach("teach-u3l2-celular", "celular"),
      {
        id: "u3l2-1",
        type: "select",
        prompt: "Word for cell phone?",
        options: ["Celular", "Teléfono fijo only", "Computadora", "Carro"],
        correctIndex: 0,
        explanation: "Celular is the everyday word for a mobile phone.",
        wordCardIds: ["celular"],
        xp: 3,
      },
      teach("teach-u3l2-tener", "tener"),
      {
        id: "u3l2-2",
        type: "select",
        prompt: "“I have” (yo) is…",
        options: ["Tengo", "Soy", "Hablo", "Vivo"],
        correctIndex: 0,
        explanation: "Tener → yo tengo.",
        wordCardIds: ["tener"],
        xp: 3,
      },
      teach("teach-u3l2-cuantos-anos", "cuantos-anos"),
      {
        id: "u3l2-3",
        type: "tap-chips",
        prompt: "Build: “How old are you?” (tú)",
        chips: ["¿Cuántos", "años", "tienes?", "cuesta", "celular"],
        correctOrder: ["¿Cuántos", "años", "tienes?"],
        explanation: "¿Cuántos años tienes?",
        wordCardIds: ["cuantos-anos"],
        xp: 3,
      },
      teach("teach-u3l2-veinte", "veinte"),
      {
        id: "u3l2-4",
        type: "translate",
        prompt: "Translate: “I am twenty years old.”",
        acceptedAnswers: [
          "Tengo veinte años.",
          "Tengo veinte anos.",
          "Tengo 20 años.",
          "Tengo 20 anos",
        ],
        hint: "Tengo + number + años",
        explanation: "Age uses tener: Tengo veinte años — not soy veinte.",
        wordCardIds: ["tener", "veinte", "cuantos-anos"],
        xp: 4,
      },
      listen(
        "u3l2-5",
        "¿Cuál es tu número de celular?",
        [
          "What's your cell phone number?",
          "How much does it cost?",
          "How old are you?",
          "Do you speak Spanish?",
        ],
        0,
        "¿Cuál es tu número de celular? = What's your cell number?",
        ["celular"]
      ),
      {
        id: "u3l2-6",
        type: "situational-choose",
        prompt: "Pick the best reply.",
        situation: "A new classmate asks ¿Cuántos años tienes?",
        options: [
          "Tengo veinte años.",
          "Soy veinte años.",
          "Es gratis.",
          "Cuesta veinte pesos.",
        ],
        correctIndex: 0,
        explanation: "Age = tengo + number + años. Never soy veinte años.",
        wordCardIds: ["cuantos-anos", "tener", "veinte"],
        xp: 3,
      },
      {
        id: "u3l2-7",
        type: "select",
        prompt: "“Do you have five minutes?”",
        options: [
          "¿Tienes cinco minutos?",
          "¿Eres cinco minutos?",
          "¿Hablas cinco minutos?",
          "¿Vives cinco minutos?",
        ],
        correctIndex: 0,
        explanation: "Tener for possession: ¿Tienes cinco minutos?",
        wordCardIds: ["tener", "cinco"],
        xp: 3,
      },
      listen(
        "u3l2-8",
        "Tengo un celular nuevo.",
        [
          "I have a new cell phone.",
          "I am twenty years old.",
          "It costs five pesos.",
          "The water is free.",
        ],
        0,
        "Tengo un celular nuevo = I have a new cell phone.",
        ["tener", "celular"]
      ),
    ],
  },

  "u3-l3": {
    id: "u3-l3",
    unitId: "unit-3",
    title: "How much?",
    description: "Ask prices with pesos, dólares, and gratis.",
    xpReward: 38,
    exercises: [
      teach("teach-u3l3-cuanto-cuesta", "cuanto-cuesta"),
      {
        id: "u3l3-1",
        type: "select",
        prompt: "How do you ask “How much does it cost?”",
        options: [
          "¿Cuánto cuesta?",
          "¿Cuántos años tienes?",
          "¿Cómo te llamas?",
          "¿De dónde eres?",
        ],
        correctIndex: 0,
        explanation: "¿Cuánto cuesta? is the classic price question.",
        wordCardIds: ["cuanto-cuesta"],
        xp: 3,
      },
      teach("teach-u3l3-pesos", "pesos"),
      {
        id: "u3l3-2",
        type: "tap-chips",
        prompt: "Build: “It costs ten pesos.”",
        chips: ["Cuesta", "diez", "pesos.", "dólares", "gratis"],
        correctOrder: ["Cuesta", "diez", "pesos."],
        explanation: "Cuesta diez pesos.",
        wordCardIds: ["pesos", "diez", "cuanto-cuesta"],
        xp: 3,
      },
      teach("teach-u3l3-dolares", "dolares"),
      listen(
        "u3l3-3",
        "Cuesta veinte dólares.",
        [
          "It costs twenty dollars.",
          "I am twenty years old.",
          "I have two phones.",
          "It's free.",
        ],
        0,
        "Cuesta veinte dólares = It costs twenty dollars.",
        ["dolares", "veinte", "cuanto-cuesta"]
      ),
      teach("teach-u3l3-gratis", "gratis"),
      {
        id: "u3l3-4",
        type: "select",
        prompt: "How do you say “It's free” (no cost)?",
        options: ["Es gratis.", "Es libre.", "Soy gratis.", "Tengo gratis."],
        correctIndex: 0,
        explanation: "Es gratis = no charge. Libre is “available / free time.”",
        wordCardIds: ["gratis"],
        xp: 3,
      },
      {
        id: "u3l3-5",
        type: "situational-choose",
        prompt: "Pick the best question.",
        situation: "You're at a market stall pointing at a juice.",
        options: [
          "¿Cuánto cuesta?",
          "¿Cuántos años tienes?",
          "Mucho gusto.",
          "Hasta luego.",
        ],
        correctIndex: 0,
        explanation: "Ask the price: ¿Cuánto cuesta?",
        wordCardIds: ["cuanto-cuesta"],
        xp: 3,
      },
      {
        id: "u3l3-6",
        type: "translate",
        prompt: "Translate: “How much do the juices cost?”",
        acceptedAnswers: [
          "¿Cuánto cuestan los jugos?",
          "Cuanto cuestan los jugos?",
          "¿Cuánto cuestan los jugos",
        ],
        hint: "cuestan (plural) + los jugos",
        explanation: "Plural prices: ¿Cuánto cuestan los jugos?",
        wordCardIds: ["cuanto-cuesta"],
        xp: 4,
      },
      listen(
        "u3l3-7",
        "El agua es gratis.",
        [
          "The water is free.",
          "The water costs ten pesos.",
          "I want water, please.",
          "Do you accept dollars?",
        ],
        0,
        "El agua es gratis = The water is free.",
        ["gratis"]
      ),
      {
        id: "u3l3-8",
        type: "select",
        prompt: "“Do you accept dollars?”",
        options: [
          "¿Aceptan dólares?",
          "¿Aceptan pesos años?",
          "¿Cuántos dólares tienes?",
          "Es dólares gratis.",
        ],
        correctIndex: 0,
        explanation: "¿Aceptan dólares? is a practical travel line.",
        wordCardIds: ["dolares"],
        xp: 3,
      },
      {
        id: "u3l3-9",
        type: "situational-choose",
        prompt: "Pick the best answer.",
        situation: "The clerk says the Wi-Fi has no charge.",
        options: ["Es gratis.", "Cuesta veinte años.", "Tengo celular.", "Uno, dos, tres."],
        correctIndex: 0,
        explanation: "No cost → Es gratis.",
        wordCardIds: ["gratis"],
        xp: 3,
      },
      {
        id: "u3l3-10",
        type: "match-pairs",
        prompt: "Match price phrases.",
        pairs: [
          { left: "¿Cuánto cuesta?", right: "How much does it cost?" },
          { left: "Es gratis.", right: "It's free." },
          { left: "diez pesos", right: "ten pesos" },
          { left: "veinte dólares", right: "twenty dollars" },
        ],
        explanation: "Price & free basics.",
        wordCardIds: ["cuanto-cuesta", "gratis", "pesos", "dolares"],
        xp: 4,
      },
      {
        id: "u3l3-11",
        type: "fill-blank",
        prompt: "Type the missing Spanish.",
        englishPrompt: "It costs ten pesos.",
        template: "Cuesta diez ___.",
        acceptedAnswers: ["pesos", "Pesos"],
        hint: "currency",
        explanation: "Cuesta diez pesos.",
        wordCardIds: ["pesos", "diez"],
        xp: 3,
      },
    ],
  },
  ...UNIT1_LESSONS,
  ...UNIT2_LESSONS,
  ...UNIT3_LESSONS,
  ...INTERMEDIATE_LESSONS,
};

export const UNITS: Unit[] = [
  {
    id: "unit-1",
    number: 1,
    title: "First contact",
    description: "Greetings, names, and polite essentials.",
    lessonIds: ["u1-l1", "u1-l2", "u1-l3", "u1-l4", "u1-l5", "u1-l6", "u1-l7", "u1-l8", "u1-l9", "u1-l10", "u1-l11", "u1-l12"],
    unlocked: true,
    track: "beginner",
  },
  {
    id: "unit-2",
    number: 2,
    title: "Who I am",
    description: "Origin, where you live, and languages you speak.",
    lessonIds: ["u2-l1", "u2-l2", "u2-l3", "u2-l4", "u2-l5", "u2-l6", "u2-l7", "u2-l8", "u2-l9", "u2-l10", "u2-l11", "u2-l12"],
    unlocked: true,
    track: "beginner",
  },
  {
    id: "unit-3",
    number: 3,
    title: "Numbers that matter",
    description: "Counting, phone, age, and everyday prices.",
    lessonIds: ["u3-l1", "u3-l2", "u3-l3", "u3-l4", "u3-l5", "u3-l6", "u3-l7", "u3-l8", "u3-l9", "u3-l10", "u3-l11", "u3-l12"],
    unlocked: true,
    track: "beginner",
  },
  ...INTERMEDIATE_UNITS_META,
];

export const DAILY_GOAL_OPTIONS = [10, 20, 30, 50] as const;

export function getWordCard(id: string): WordCard | undefined {
  return WORD_CARDS[id];
}

export function getLesson(id: string): Lesson | undefined {
  return LESSONS[id];
}

export function getAllWordCards(): WordCard[] {
  return Object.values(WORD_CARDS);
}

/** Lessons that include a story-listen (podcast) exercise — Units 4–11 preferred. */
export function getStoryListenLessons(): Lesson[] {
  return Object.values(LESSONS).filter((lesson) =>
    lesson.exercises.some((ex) => ex.type === "story-listen")
  );
}

/** Prefer an unlocked intermediate story for the home Audio workout card. */
export function pickAudioWorkoutLesson(opts: {
  completedLessonIds: string[];
  intermediateOpen: boolean;
}): Lesson | undefined {
  const stories = getStoryListenLessons();
  const rank = (id: string) => {
    const m = /^u(\d+)-l(\d+)$/.exec(id);
    if (!m) return 0;
    return Number(m[1]) * 100 + Number(m[2]);
  };
  // Prefer Units 4–11 stories, highest unit first among unlocked
  const intermediate = stories
    .filter((l) => {
      const m = /^u(\d+)/.exec(l.id);
      const n = m ? Number(m[1]) : 0;
      return n >= 4 && n <= 11;
    })
    .sort((a, b) => rank(b.id) - rank(a.id));

  const unlocked = intermediate.filter((lesson) => {
    const unitNum = Number(/^u(\d+)/.exec(lesson.id)?.[1] ?? 0);
    if (unitNum >= 4 && !opts.intermediateOpen) return false;
    const unit = UNITS.find((u) => u.id === lesson.unitId);
    if (!unit?.unlocked && unitNum >= 4) return false;
    // Lesson reachable if prior lessons in unit completed, or already completed
    if (opts.completedLessonIds.includes(lesson.id)) return true;
    if (!unit) return true;
    const idx = unit.lessonIds.indexOf(lesson.id);
    if (idx <= 0) return true;
    return unit.lessonIds.slice(0, idx).every((id) =>
      opts.completedLessonIds.includes(id)
    );
  });

  // Prefer not-yet-completed unlocked story; else any unlocked; else beginner stories
  const next = unlocked.find((l) => !opts.completedLessonIds.includes(l.id));
  if (next) return next;
  if (unlocked.length) return unlocked[0];

  const beginner = stories
    .filter((l) => {
      const n = Number(/^u(\d+)/.exec(l.id)?.[1] ?? 0);
      return n >= 1 && n <= 3;
    })
    .sort((a, b) => rank(b.id) - rank(a.id));
  const beginnerUnlocked = beginner.filter((lesson) => {
    if (opts.completedLessonIds.includes(lesson.id)) return true;
    const unit = UNITS.find((u) => u.id === lesson.unitId);
    if (!unit) return true;
    const idx = unit.lessonIds.indexOf(lesson.id);
    if (idx <= 0) return true;
    return unit.lessonIds
      .slice(0, idx)
      .every((id) => opts.completedLessonIds.includes(id));
  });
  return (
    beginnerUnlocked.find((l) => !opts.completedLessonIds.includes(l.id)) ??
    beginnerUnlocked[0] ??
    beginner[0] ??
    intermediate[0] ??
    stories[0]
  );
}
