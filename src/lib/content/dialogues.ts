/**
 * Phase 1 — scripted multi-turn dialogues. Latin American Spanish.
 *
 * Fully local: no AI, no microphone, no network. Each dialogue is a short
 * branching tree — an NPC line, two or three learner replies, and a different
 * NPC answer for each reply. Wrong picks still get a natural answer and the
 * conversation continues; nothing dead-ends and nothing locks.
 *
 * Audio policy: reuse only clips that already exist under
 * public/audio/es-mx/. BAKED below lists the slugs verified present; a line
 * whose slug is not in that list renders without a speaker button rather than
 * triggering TTS generation. Re-verify with scripts/check-dialogue-audio.ts.
 *
 * This file deliberately owns no listenVoiceIndex counter. Voices are picked
 * per speaker, so adding dialogues here can never reshuffle voice assignment
 * for existing lessons in the unit files.
 */
import { audioSrcFor, slugifyAudio, type AudioVoice } from "../audio";
import type { DialogueExercise, DialogueOption, DialogueTurn } from "../types";

/** Slugs confirmed present as {slug}-{voice}.mp3 under public/audio/es-mx/. */
export const BAKED_DIALOGUE_SLUGS = [
  "buenos-dias-como-estas",
  "buenos-dias-como-te-llamas",
  "buenas-tardes-que-tal",
  "buenas-tardes-en-que-puedo-ayudarte",
  "buenas-noches-nos-vemos-manana",
  "me-llamo-bruno-y-tu",
  "mucho-gusto",
  "de-donde-eres",
  "de-nada-con-gusto",
  "cuantos-anos-tienes",
  "disculpe-habla-ingles",
  "disculpe-me-puede-ayudar",
  "disculpe-me-puede-traer-un-menu",
  "disculpe-donde-esta-la-estacion-de-metro",
  "disculpe-donde-esta-la-farmacia",
  "disculpe-como-llego-al-centro",
  "disculpe-tiene-un-mapa",
  "como-llego-al-hotel",
  "te-recomiendo-ir-en-metro",
  "para-llevar-o-para-comer-aqui",
  "que-quieres-comer",
  "cafe-con-leche",
  "la-cuenta-por-favor",
  "la-comida-esta-muy-buena",
  "cuanto-cuestan-los-jugos",
  "cuesta-diez-pesos",
  "cuesta-doce-pesos",
  "te-gustaria-ir-al-cine-el-sabado",
  "quieres-ir-al-centro-a-tomar-un-cafe",
  "gracias-pero-esta-noche-no-puedo",
  "el-sabado-me-parece-bien",
  "nos-vemos-a-las-siete-en-el-centro",
  "hoy-no-estoy-bien-me-duele-la-cabeza",
  "deberias-ir-a-la-farmacia",
  "el-medico-me-dio-una-receta",
  "el-doctor-llega-manana",
] as const;

const BAKED = new Set<string>(BAKED_DIALOGUE_SLUGS);

/** Baked clip for this line, or undefined when none exists. */
function clip(text: string, voice: AudioVoice): string | undefined {
  return BAKED.has(slugifyAudio(text)) ? audioSrcFor(text, voice) : undefined;
}

/** Learner reply plus the NPC's answer to that specific choice. */
function opt(
  es: string,
  en: string,
  correct: boolean,
  reply: string,
  replyEn: string,
  npcVoice: AudioVoice,
  explanation?: string
): DialogueOption {
  return {
    es,
    en,
    correct,
    reply,
    replyEn,
    replyAudioSrc: clip(reply, npcVoice),
    explanation,
  };
}

function turn(
  npc: string,
  npcEn: string,
  npcVoice: AudioVoice,
  options: DialogueOption[]
): DialogueTurn {
  return { npc, npcEn, audioSrc: clip(npc, npcVoice), options };
}

function dialogue(
  id: string,
  scenario: string,
  goal: string,
  npcName: string,
  turns: DialogueTurn[],
  wordCardIds?: string[]
): DialogueExercise {
  return {
    id,
    type: "dialogue",
    prompt: "Choose your reply.",
    explanation: "",
    scenario,
    goal,
    npcName,
    turns,
    wordCardIds,
    xp: 5,
  };
}

/* ================================================================== */
/* Unit 1 — First contact                                             */
/* ================================================================== */

const u1GreetMorning = dialogue(
  "dlg-u1-greet-morning",
  "You pass a neighbor in the hallway around nine in the morning.",
  "Greet her and say how you are.",
  "Vecina",
  [
    turn("Buenos días. ¿Cómo estás?", "Good morning. How are you?", "f", [
      opt("Buenos días. Muy bien, gracias.", "Good morning. Very well, thanks.", true,
        "Qué bueno. ¿Y tu familia?", "Good to hear. And your family?", "f"),
      opt("Buenas noches. Muy bien.", "Good night. Very well.", false,
        "¿Noches? Apenas son las nueve de la mañana.", "Night? It is barely nine in the morning.", "f",
        "Buenas noches is for the evening. Before midday, use buenos días."),
      opt("Me llamo bien, gracias.", "My name is well, thanks.", false,
        "Creo que querías decir estoy bien.", "I think you meant estoy bien.", "f",
        "Me llamo introduces your name. To say how you are, use estoy bien."),
    ]),
    turn("¿Y tu familia, está bien?", "And your family, are they well?", "f", [
      opt("Sí, todos están bien. Gracias.", "Yes, everyone is well. Thanks.", true,
        "Me alegro mucho.", "I am very glad.", "f"),
      opt("Sí, todos son bien.", "Yes, everyone is well.", false,
        "Decimos están bien para cómo se sienten.", "We say están bien for how people feel.", "f",
        "For how someone feels right now, Spanish uses estar, not ser."),
    ]),
    turn("Bueno, que tengas buen día.", "Well, have a good day.", "f", [
      opt("Igualmente. Hasta luego.", "Same to you. See you later.", true,
        "Hasta luego.", "See you later.", "f"),
      opt("De nada. Hasta luego.", "You are welcome. See you later.", false,
        "No me agradezcas todavía. Hasta luego.", "Do not thank me yet. See you later.", "f",
        "De nada answers a thank-you. To return a good wish, use igualmente."),
    ]),
  ],
  ["buenos-dias", "como-estas", "hasta-luego"]
);

const u1GoodbyeNight = dialogue(
  "dlg-u1-goodbye-night",
  "You are leaving a friend's place late in the evening.",
  "Say goodbye and agree on a time for tomorrow.",
  "Amigo",
  [
    turn("Buenas noches. Nos vemos mañana.", "Good night. See you tomorrow.", "m", [
      opt("Buenas noches. Que descanses.", "Good night. Rest well.", true,
        "Gracias, igualmente.", "Thanks, same to you.", "m"),
      opt("Buenos días. Que descanses.", "Good morning. Rest well.", false,
        "¿Días? Ya es de noche.", "Morning? It is already night.", "m",
        "Buenos días is a morning greeting; late at night use buenas noches."),
      opt("Mucho gusto. Que descanses.", "Nice to meet you. Rest well.", false,
        "Ya nos conocemos, pero gracias.", "We already know each other, but thanks.", "m",
        "Mucho gusto is for meeting someone for the first time."),
    ]),
    turn("¿A qué hora llegas mañana?", "What time are you arriving tomorrow?", "m", [
      opt("A las siete, más o menos.", "Around seven.", true,
        "Perfecto, te espero.", "Perfect, I will wait for you.", "m"),
      opt("Soy las siete.", "I am seven.", false,
        "Querías decir a las siete.", "You meant a las siete.", "m",
        "Clock times take a las, not soy."),
    ]),
  ],
  ["buenas-noches", "hasta-luego"]
);

const u1MeetName = dialogue(
  "dlg-u1-meet-name",
  "Someone new joins your table at a language exchange.",
  "Exchange names and say where you are from.",
  "Bruno",
  [
    turn("Me llamo Bruno, ¿y tú?", "My name is Bruno, and you?", "m", [
      opt("Me llamo Ana. Mucho gusto.", "My name is Ana. Nice to meet you.", true,
        "Mucho gusto, Ana.", "Nice to meet you, Ana.", "m"),
      opt("Soy llamo Ana.", "I am call Ana.", false,
        "Puedes decir me llamo Ana o soy Ana.", "You can say me llamo Ana or soy Ana.", "m",
        "Use either me llamo Ana or soy Ana — not both verbs together."),
      opt("Tengo Ana.", "I have Ana.", false,
        "Creo que querías decir me llamo Ana.", "I think you meant me llamo Ana.", "m",
        "Tener is for age and possessions, not names."),
    ]),
    turn("¿De dónde eres?", "Where are you from?", "m", [
      opt("Soy de Estados Unidos. ¿Y tú?", "I am from the United States. And you?", true,
        "Yo soy de México, de Guadalajara.", "I am from Mexico, from Guadalajara.", "m"),
      opt("Estoy de Estados Unidos.", "I am being from the United States.", false,
        "Para el origen usamos soy de.", "For origin we use soy de.", "m",
        "Origin uses ser: soy de. Estar is for temporary states and locations."),
    ]),
    turn("¿Hablas español todos los días?", "Do you speak Spanish every day?", "m", [
      opt("Un poco, pero quiero practicar más.", "A little, but I want to practice more.", true,
        "Pues aquí estamos. Practiquemos.", "Well, here we are. Let us practice.", "m"),
      opt("Sí, hablo un poco de inglés.", "Yes, I speak a little English.", false,
        "Te pregunté por el español, pero está bien.", "I asked about Spanish, but that is fine.", "m",
        "The question was about español — answer about Spanish, not inglés."),
    ]),
  ],
  ["me-llamo", "mucho-gusto", "de-donde-eres"]
);

/* ================================================================== */
/* Unit 2 — Who I am                                                  */
/* ================================================================== */

const u2Origin = dialogue(
  "dlg-u2-origin",
  "A classmate asks about where you come from.",
  "Say where you are from and ask her back.",
  "Camila",
  [
    turn("¿De dónde eres?", "Where are you from?", "f", [
      opt("Soy de Chicago, en Estados Unidos.", "I am from Chicago, in the United States.", true,
        "Qué bien. Yo soy de Monterrey.", "How nice. I am from Monterrey.", "f"),
      opt("Vivo de Chicago.", "I live from Chicago.", false,
        "Se dice vivo en Chicago o soy de Chicago.", "We say vivo en Chicago or soy de Chicago.", "f",
        "Vivir takes en for the place. For origin, use soy de."),
      opt("Tengo de Chicago.", "I have from Chicago.", false,
        "Creo que querías decir soy de Chicago.", "I think you meant soy de Chicago.", "f",
        "Tener does not work for origin. Use ser: soy de."),
    ]),
    turn("¿Y vives aquí ahora?", "And do you live here now?", "f", [
      opt("Sí, vivo en un departamento cerca del centro.", "Yes, I live in an apartment near downtown.", true,
        "Nosotros también vivimos por allá.", "We live over there too.", "f"),
      opt("Sí, soy en un departamento.", "Yes, I am in an apartment.", false,
        "Para dónde vives usamos vivo en.", "For where you live we use vivo en.", "f",
        "Where you live uses vivir: vivo en. Ser states origin, not address."),
    ]),
    turn("¿Y te gusta la ciudad?", "And do you like the city?", "f", [
      opt("Sí, me gusta mucho. La comida es muy buena.", "Yes, I like it a lot. The food is very good.", true,
        "Tienes razón, se come muy bien aquí.", "You are right, the food here is great.", "f"),
      opt("Sí, me gustan mucho la ciudad.", "Yes, I like the city a lot.", false,
        "Es una ciudad, entonces me gusta.", "It is one city, so me gusta.", "f",
        "One singular thing takes me gusta; me gustan is for plurals."),
    ]),
  ],
  ["de-donde-eres", "soy-de", "vivo-en"]
);

const u2Languages = dialogue(
  "dlg-u2-languages",
  "A tourist at the bus stop is struggling and turns to you.",
  "Say which languages you speak and offer help.",
  "Turista",
  [
    turn("Disculpe, ¿habla inglés?", "Excuse me, do you speak English?", "m", [
      opt("Hablo un poco de inglés. ¿Le puedo ayudar?", "I speak a little English. Can I help you?", true,
        "Sí, por favor. Busco la estación.", "Yes, please. I am looking for the station.", "m"),
      opt("Sí, soy inglés.", "Yes, I am English.", false,
        "¿Es usted de Inglaterra? Yo preguntaba por el idioma.", "Are you from England? I was asking about the language.", "m",
        "Soy inglés claims a nationality. For the language, say hablo inglés."),
      opt("Sí, tengo inglés.", "Yes, I have English.", false,
        "Se dice hablo inglés.", "We say hablo inglés.", "m",
        "Languages go with hablar, not tener."),
    ]),
    turn("¿Y usted habla español también?", "And do you speak Spanish too?", "m", [
      opt("Sí, estoy aprendiendo español.", "Yes, I am learning Spanish.", true,
        "Habla muy bien para estar aprendiendo.", "You speak very well for someone still learning.", "m"),
      opt("Sí, hablo español todos los años.", "Yes, I speak Spanish every year.", false,
        "¿Cada año nada más?", "Only once a year?", "m",
        "Todos los años means yearly. For daily practice, say todos los días."),
    ]),
  ],
  ["hablar", "ingles", "espanol"]
);

/* ================================================================== */
/* Unit 3 — Numbers that matter                                       */
/* ================================================================== */

const u3Age = dialogue(
  "dlg-u3-age",
  "You are signing up for a class and the receptionist needs your details.",
  "Give your age and phone number.",
  "Recepcionista",
  [
    turn("¿Cuántos años tienes?", "How old are you?", "f", [
      opt("Tengo veintiocho años.", "I am twenty-eight.", true,
        "Perfecto. ¿Y tu teléfono?", "Perfect. And your phone number?", "f"),
      opt("Soy veintiocho años.", "I am twenty-eight years.", false,
        "En español la edad va con tener: tengo veintiocho.", "In Spanish age goes with tener: tengo veintiocho.", "f",
        "Age uses tener, never ser: tengo veintiocho años."),
      opt("Tengo veintiocho.", "I am twenty-eight.", false,
        "Casi. Agrega años al final.", "Almost. Add años at the end.", "f",
        "Close — Spanish keeps años: tengo veintiocho años."),
    ]),
    turn("¿Y cuál es tu número de teléfono?", "And what is your phone number?", "f", [
      opt("Es el cinco, cinco, cinco, doce, treinta.", "It is five five five, twelve, thirty.", true,
        "Gracias, ya quedaste registrada.", "Thanks, you are registered.", "f"),
      opt("Tengo el cinco, cinco, cinco, doce, treinta.", "I have five five five, twelve, thirty.", false,
        "Normalmente decimos es el...", "We normally say es el...", "f",
        "For giving a number, es el… sounds more natural than tengo el…"),
    ]),
  ],
  ["tener", "numeros", "telefono"]
);

const u3Market = dialogue(
  "dlg-u3-market",
  "You are buying juice at a market stall.",
  "Ask the price and pay.",
  "Vendedor",
  [
    turn("Buenas tardes, ¿en qué puedo ayudarte?", "Good afternoon, how can I help you?", "m", [
      opt("¿Cuánto cuestan los jugos?", "How much are the juices?", true,
        "Cuesta diez pesos cada uno.", "They are ten pesos each.", "m"),
      opt("¿Cuánto cuesta los jugos?", "How much does the juices cost?", false,
        "Son varios, entonces cuestan.", "There are several, so cuestan.", "m",
        "Plural subject takes cuestan; cuesta is for one item."),
      opt("¿Cuántos años cuestan los jugos?", "How many years do the juices cost?", false,
        "Ja, nada más diez pesos.", "Ha, just ten pesos.", "m",
        "Cuántos años asks an age. For price, ask cuánto cuesta or cuánto cuestan."),
    ]),
    turn("¿Cuántos te doy?", "How many should I give you?", "m", [
      opt("Dos, por favor.", "Two, please.", true,
        "Son veinte pesos.", "That is twenty pesos.", "m"),
      opt("Dos, de nada.", "Two, you are welcome.", false,
        "Creo que querías decir por favor.", "I think you meant por favor.", "m",
        "De nada answers a thank-you. To ask politely, use por favor."),
    ]),
    turn("Son veinte pesos.", "That is twenty pesos.", "m", [
      opt("Aquí tiene. Gracias.", "Here you go. Thank you.", true,
        "De nada, con gusto.", "You are welcome, my pleasure.", "m"),
      opt("Aquí tiene. De nada.", "Here you go. You are welcome.", false,
        "Todavía no me agradeces nada.", "You have not thanked me yet.", "m",
        "Say gracias when handing over payment; de nada is the reply to it."),
    ]),
  ],
  ["cuanto-cuesta", "pesos", "numeros"]
);

/* ================================================================== */
/* Unit 5 — Food & ordering                                           */
/* ================================================================== */

const u5Order = dialogue(
  "dlg-u5-order",
  "You are at a cafe counter. The server addresses you formally with usted.",
  "Order a coffee, answer the to-go question, and ask for the bill.",
  "Mesero",
  [
    turn("Buenas tardes, ¿en qué puedo ayudarte?", "Good afternoon, how can I help you?", "m", [
      opt("Quisiera un café con leche, por favor.", "I would like a coffee with milk, please.", true,
        "Claro que sí. ¿Para llevar o para comer aquí?", "Of course. To go or to have here?", "m"),
      opt("Quiero café con leche.", "I want coffee with milk.", false,
        "Se lo preparo. Con quisiera suena más amable.", "I will make it. Quisiera sounds more polite.", "m",
        "Quiero works but is blunt. Quisiera is the polite order form."),
      opt("Me gusta un café con leche.", "I like a coffee with milk.", false,
        "Qué bueno que le guste. ¿Se lo sirvo?", "Glad you like it. Shall I serve you one?", "m",
        "Me gusta says you enjoy something. To order, use quisiera or quiero."),
    ]),
    turn("¿Para llevar o para comer aquí?", "To go or to have here?", "m", [
      opt("Para comer aquí, gracias.", "To have here, thanks.", true,
        "Perfecto, ahorita se lo traigo.", "Perfect, I will bring it right away.", "m"),
      opt("Para llevar aquí.", "To go here.", false,
        "Una u otra: para llevar, o para comer aquí.", "One or the other: para llevar, or para comer aquí.", "m",
        "Pick one — para llevar (to go) or para comer aquí (to stay)."),
    ]),
    turn("¿Se le ofrece algo más?", "Would you like anything else?", "m", [
      opt("No, gracias. La cuenta, por favor.", "No, thanks. The bill, please.", true,
        "Enseguida se la traigo.", "I will bring it right away.", "m"),
      opt("No, gracias. La cuenta, de nada.", "No, thanks. The bill, you are welcome.", false,
        "Creo que querías decir por favor.", "I think you meant por favor.", "m",
        "Requests end with por favor; de nada answers a thank-you."),
    ]),
  ],
  ["quisiera", "cafe", "la-cuenta"]
);

const u5Problem = dialogue(
  "dlg-u5-problem",
  "Your food arrives but it is not what you ordered.",
  "Point out the problem politely and settle it.",
  "Mesera",
  [
    turn("Aquí tiene, la sopa de pollo.", "Here you go, the chicken soup.", "f", [
      opt("Disculpe, yo pedí la ensalada.", "Excuse me, I ordered the salad.", true,
        "Ay, una disculpa. Se la cambio ahorita.", "Oh, I am sorry. I will change it right away.", "f"),
      opt("No me gusta la sopa.", "I do not like the soup.", false,
        "¿Se la retiro? Aunque usted había pedido otra cosa, ¿verdad?", "Shall I take it away? You had ordered something else, right?", "f",
        "Saying you dislike it is not the issue — say what you actually ordered."),
      opt("La sopa está muy buena.", "The soup is very good.", false,
        "Me da gusto, pero creo que no era su orden.", "I am glad, but I do not think it was your order.", "f",
        "That praises the dish instead of flagging the mix-up."),
    ]),
    turn("¿Le traigo la ensalada entonces?", "Shall I bring you the salad then?", "f", [
      opt("Sí, por favor. Gracias.", "Yes, please. Thank you.", true,
        "Con gusto. Ya se la traigo.", "My pleasure. I will bring it now.", "f"),
      opt("Sí, quiero la sopa.", "Yes, I want the soup.", false,
        "Entonces, ¿sopa o ensalada?", "So, soup or salad?", "f",
        "You just explained you ordered the salad — stay consistent."),
    ]),
    turn("La comida está muy buena.", "The food is very good.", "f", [
      opt("Sí, todo está delicioso. La cuenta, por favor.", "Yes, everything is delicious. The bill, please.", true,
        "Enseguida se la traigo.", "I will bring it right away.", "f"),
      opt("Sí, todo es delicioso.", "Yes, everything is delicious.", false,
        "Para cómo sabe hoy decimos está delicioso.", "For how it tastes today we say está delicioso.", "f",
        "How food tastes right now uses estar: está delicioso."),
    ]),
  ],
  ["disculpe", "la-cuenta", "pedir"]
);

/* ================================================================== */
/* Unit 6 — Getting around                                            */
/* ================================================================== */

const u6Metro = dialogue(
  "dlg-u6-metro",
  "You are on the street and need the metro station.",
  "Ask for the station and understand the directions.",
  "Señor",
  [
    turn("Buenas tardes, ¿qué tal?", "Good afternoon, how is it going?", "m", [
      opt("Disculpe, ¿dónde está la estación de metro?", "Excuse me, where is the metro station?", true,
        "Está a dos cuadras, a la derecha.", "It is two blocks away, on the right.", "m"),
      opt("Disculpe, ¿dónde está el metro ayer?", "Excuse me, where was the metro yesterday?", false,
        "¿Ayer? Hoy está a dos cuadras.", "Yesterday? Today it is two blocks away.", "m",
        "Drop ayer — you are asking about right now."),
      opt("Disculpe, ¿cuánto cuesta la estación?", "Excuse me, how much does the station cost?", false,
        "La estación no se compra. ¿Busca cómo llegar?", "You do not buy the station. Are you looking for directions?", "m",
        "That asks a price. To locate something, ask dónde está."),
    ]),
    turn("Está a dos cuadras, a la derecha.", "It is two blocks away, on the right.", "m", [
      opt("¿Puede repetirlo, por favor?", "Could you repeat that, please?", true,
        "Claro: dos cuadras y luego a la derecha.", "Sure: two blocks and then to the right.", "m"),
      opt("No entiendo nada.", "I do not understand anything.", false,
        "Se lo digo otra vez, más despacio.", "I will tell you again, more slowly.", "m",
        "It works, but ¿puede repetirlo? is the friendlier way to ask."),
    ]),
    turn("¿Quedó claro?", "Is that clear?", "m", [
      opt("Sí, muchas gracias. Muy amable.", "Yes, thank you very much. Very kind.", true,
        "De nada, con gusto.", "You are welcome, my pleasure.", "m"),
      opt("Sí, de nada.", "Yes, you are welcome.", false,
        "Ja, gracias a usted.", "Ha, thank you.", "m",
        "You are the one receiving help — say gracias, not de nada."),
    ]),
  ],
  ["disculpe", "donde-esta", "derecha"]
);

const u6Repeat = dialogue(
  "dlg-u6-repeat",
  "Someone gives you directions far too quickly.",
  "Ask them to slow down and confirm what you heard.",
  "Señora",
  [
    turn("Disculpe, ¿me puede ayudar?", "Excuse me, can you help me?", "f", [
      opt("Claro, dígame.", "Of course, tell me.", true,
        "Busco la farmacia, pero no sé si es a la izquierda.", "I am looking for the pharmacy, but I do not know if it is to the left.", "f"),
      opt("Claro, me llamo Ana.", "Of course, my name is Ana.", false,
        "Mucho gusto, pero necesito una dirección.", "Nice to meet you, but I need directions.", "f",
        "She asked for help, not your name."),
    ]),
    turn("¿Sabe dónde está la farmacia?", "Do you know where the pharmacy is?", "f", [
      opt("Sí, siga derecho dos cuadras.", "Yes, go straight for two blocks.", true,
        "Perfecto, muchas gracias.", "Perfect, thank you very much.", "f"),
      opt("Sí, está a la derecha derecho.", "Yes, it is to the right straight.", false,
        "¿A la derecha o derecho? No es lo mismo.", "To the right or straight ahead? They are not the same.", "f",
        "Derecho means straight ahead; a la derecha means to the right."),
    ]),
  ],
  ["farmacia", "derecho", "izquierda"]
);

const u6HowTo = dialogue(
  "dlg-u6-howto",
  "You ask a hotel clerk the best way to reach downtown.",
  "Ask how to get there and pick a way to travel.",
  "Recepcionista",
  [
    turn("Buenas tardes, ¿en qué puedo ayudarte?", "Good afternoon, how can I help you?", "f", [
      opt("Disculpe, ¿cómo llego al centro?", "Excuse me, how do I get downtown?", true,
        "Te recomiendo ir en metro.", "I recommend going by metro.", "f"),
      opt("Disculpe, ¿dónde está el centro ayer?", "Excuse me, where was downtown yesterday?", false,
        "El centro sigue en el mismo lugar.", "Downtown is still in the same place.", "f",
        "Drop ayer, and to ask for a route use cómo llego."),
      opt("Disculpe, ¿cuántos años tiene el centro?", "Excuse me, how old is downtown?", false,
        "Bastante viejo, pero creo que busca cómo llegar.", "Quite old, but I think you want directions.", "f",
        "That asks an age. For a route, ask cómo llego a…"),
    ]),
    turn("Te recomiendo ir en metro.", "I recommend going by metro.", "f", [
      opt("¿Está lejos la estación?", "Is the station far?", true,
        "No, está muy cerca, a una cuadra.", "No, it is very close, one block away.", "f"),
      opt("¿Está lejos el metro ayer?", "Was the metro far yesterday?", false,
        "Hoy está cerquita.", "Today it is quite close.", "f",
        "Ayer puts it in the past; ask about now."),
    ]),
    turn("¿Necesitas un mapa?", "Do you need a map?", "f", [
      opt("Sí, por favor. Muchas gracias.", "Yes, please. Thank you very much.", true,
        "Aquí tienes. Que te vaya bien.", "Here you go. Have a good trip.", "f"),
      opt("Sí, tengo un mapa.", "Yes, I have a map.", false,
        "Entonces, ¿le doy uno o no?", "So, shall I give you one or not?", "f",
        "Tengo says you already have one, which contradicts saying yes."),
    ]),
  ],
  ["como-llego", "metro", "cerca"]
);

const u6Lost = dialogue(
  "dlg-u6-lost",
  "It is getting dark and you cannot find your way back to the hotel.",
  "Explain you are lost and get back.",
  "Señor",
  [
    turn("¿Todo bien? Se ve un poco perdida.", "All good? You look a little lost.", "m", [
      opt("Sí, estoy perdida. ¿Cómo llego al hotel?", "Yes, I am lost. How do I get to the hotel?", true,
        "Tranquila, está cerca. Siga derecho.", "Do not worry, it is close. Go straight.", "m"),
      opt("Sí, soy perdida.", "Yes, I am a lost person.", false,
        "Se dice estoy perdida.", "We say estoy perdida.", "m",
        "Being lost is a temporary state: estar, not ser."),
      opt("Sí, tengo perdida.", "Yes, I have lost.", false,
        "Creo que querías decir estoy perdida.", "I think you meant estoy perdida.", "m",
        "Use estar for states like being lost."),
    ]),
    turn("Siga derecho y luego a la izquierda.", "Go straight and then to the left.", "m", [
      opt("Derecho y luego a la izquierda. Gracias.", "Straight and then left. Thank you.", true,
        "De nada, con gusto.", "You are welcome, my pleasure.", "m"),
      opt("A la derecha y luego derecho.", "Right and then straight.", false,
        "Al revés: derecho primero, luego izquierda.", "The other way around: straight first, then left.", "m",
        "Repeat it back in the same order — derecho first, then izquierda."),
    ]),
  ],
  ["perdido", "hotel", "izquierda"]
);

/* ================================================================== */
/* Unit 8 — Plans & invitations                                       */
/* ================================================================== */

const u8Invite = dialogue(
  "dlg-u8-invite",
  "A friend invites you out for the weekend.",
  "Accept and agree on a time and place.",
  "Amiga",
  [
    turn("¿Te gustaría ir al cine el sábado?", "Would you like to go to the movies on Saturday?", "f", [
      opt("El sábado me parece bien.", "Saturday works for me.", true,
        "Perfecto. ¿Nos vemos a las siete?", "Perfect. Shall we meet at seven?", "f"),
      opt("Sí, fui al cine el sábado.", "Yes, I went to the movies on Saturday.", false,
        "Eso fue antes. ¿Vienes este sábado?", "That was before. Are you coming this Saturday?", "f",
        "Fui is past tense. She is inviting you to a future Saturday."),
      opt("Sí, me gusta el sábado.", "Yes, I like Saturday.", false,
        "¿Entonces vienes o no?", "So are you coming or not?", "f",
        "Me gusta rates the day. To accept, say me parece bien or sí, vamos."),
    ]),
    turn("¿Nos vemos a las siete en el centro?", "Shall we meet at seven downtown?", "f", [
      opt("Sí, nos vemos a las siete en el centro.", "Yes, see you at seven downtown.", true,
        "Va, ahí nos vemos.", "Great, see you there.", "f"),
      opt("Sí, soy a las siete.", "Yes, I am at seven.", false,
        "Querías decir nos vemos a las siete.", "You meant nos vemos a las siete.", "f",
        "For arranging a time, use nos vemos a las…, not soy."),
    ]),
  ],
  ["te-gustaria", "nos-vemos", "sabado"]
);

const u8Decline = dialogue(
  "dlg-u8-decline",
  "A coworker invites you for coffee tonight, but you cannot go.",
  "Decline kindly and suggest another day.",
  "Compañero",
  [
    turn("¿Quieres ir al centro a tomar un café?", "Do you want to go downtown for a coffee?", "m", [
      opt("Gracias, pero esta noche no puedo.", "Thanks, but I cannot tonight.", true,
        "No hay problema. ¿Otro día?", "No problem. Another day?", "m"),
      opt("No.", "No.", false,
        "Está bien... ¿pasó algo?", "All right... is something wrong?", "m",
        "A bare no sounds cold. Soften it: gracias, pero no puedo."),
      opt("Sí, pero no quiero.", "Yes, but I do not want to.", false,
        "Eso sonó un poco duro.", "That sounded a bit harsh.", "m",
        "That contradicts itself and sounds rude. Decline with gracias, pero…"),
    ]),
    turn("¿Otro día entonces?", "Another day then?", "m", [
      opt("Sí, ¿te parece el sábado?", "Yes, does Saturday work for you?", true,
        "El sábado me parece bien.", "Saturday works for me.", "m"),
      opt("Sí, ayer me parece bien.", "Yes, yesterday works for me.", false,
        "Ayer ya pasó.", "Yesterday has already gone.", "m",
        "Suggest a future day — ayer is already past."),
    ]),
    turn("Perfecto, ¿a qué hora?", "Perfect, what time?", "m", [
      opt("A las seis de la tarde, si puedes.", "At six in the evening, if you can.", true,
        "Nos vemos a las seis.", "See you at six.", "m"),
      opt("A las seis de la mañana, si puedes.", "At six in the morning, if you can.", false,
        "¿Tan temprano? Mejor en la tarde.", "That early? Better in the afternoon.", "m",
        "For an evening coffee, de la tarde fits better than de la mañana."),
    ]),
  ],
  ["quieres", "no-puedo", "sabado"]
);

/* ================================================================== */
/* Unit 10 — Plans, work & wellbeing                                  */
/* ================================================================== */

const u10Appointment = dialogue(
  "dlg-u10-appt",
  "You feel unwell and call the clinic to move your appointment.",
  "Explain how you feel and reschedule.",
  "Asistente",
  [
    turn("Clínica del Valle, buenas tardes. ¿En qué puedo ayudarle?", "Clínica del Valle, good afternoon. How can I help you?", "f", [
      opt("Hoy no estoy bien, me duele la cabeza.", "I am not well today, my head hurts.", true,
        "Lo siento. ¿Quiere cambiar su cita?", "I am sorry. Would you like to change your appointment?", "f"),
      opt("Hoy no soy bien, me duele la cabeza.", "Today I am not good, my head hurts.", false,
        "Se dice no estoy bien.", "We say no estoy bien.", "f",
        "How you feel uses estar: no estoy bien."),
      opt("Hoy tengo bien, me duele la cabeza.", "Today I have well, my head hurts.", false,
        "Creo que quiso decir no estoy bien.", "I think you meant no estoy bien.", "f",
        "Tener does not work here. Use estar for how you feel."),
    ]),
    turn("¿Quiere cambiar su cita?", "Would you like to change your appointment?", "f", [
      opt("Sí, ¿sería posible el jueves?", "Yes, would Thursday be possible?", true,
        "El doctor llega mañana.", "The doctor arrives tomorrow.", "f"),
      opt("Sí, cambié mi cita el jueves.", "Yes, I changed my appointment on Thursday.", false,
        "¿Ya la cambió? Yo no veo el cambio.", "You already changed it? I do not see the change.", "f",
        "Cambié is past. You are asking to change it now — use the question form."),
    ]),
    turn("¿Necesita algo más? ¿Una receta, quizá?", "Do you need anything else? A prescription, perhaps?", "f", [
      opt("El médico me dio una receta la semana pasada.", "The doctor gave me a prescription last week.", true,
        "Perfecto, la tengo aquí en el sistema.", "Perfect, I have it here in the system.", "f"),
      opt("El médico me da una receta la semana pasada.", "The doctor gives me a prescription last week.", false,
        "Si fue la semana pasada, decimos me dio.", "If it was last week, we say me dio.", "f",
        "La semana pasada needs the preterite: me dio."),
    ]),
  ],
  ["me-duele", "cita", "receta"]
);

/* ================================================================== */

/** Every dialogue, keyed by id. */
export const DIALOGUES: Record<string, DialogueExercise> = {
  [u1GreetMorning.id]: u1GreetMorning,
  [u1GoodbyeNight.id]: u1GoodbyeNight,
  [u1MeetName.id]: u1MeetName,
  [u2Origin.id]: u2Origin,
  [u2Languages.id]: u2Languages,
  [u3Age.id]: u3Age,
  [u3Market.id]: u3Market,
  [u5Order.id]: u5Order,
  [u5Problem.id]: u5Problem,
  [u6Metro.id]: u6Metro,
  [u6Repeat.id]: u6Repeat,
  [u6HowTo.id]: u6HowTo,
  [u6Lost.id]: u6Lost,
  [u8Invite.id]: u8Invite,
  [u8Decline.id]: u8Decline,
  [u10Appointment.id]: u10Appointment,
};

/** Pull one dialogue for a lesson, failing loudly at build time if renamed. */
export function dlg(id: string): DialogueExercise {
  const d = DIALOGUES[id];
  if (!d) throw new Error(`Unknown dialogue id: ${id}`);
  return d;
}
