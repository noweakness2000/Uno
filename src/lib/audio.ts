/** Baked LatAm practice MP3s under /public/audio/es-mx/ (Neural2). */

import { speakPracticeAudio } from "@/lib/tts";

/** Female = es-US-Neural2-A · Male = es-US-Neural2-B */
export type AudioVoice = "f" | "m";

export function voiceForIndex(index: number): AudioVoice {
  return index % 2 === 0 ? "f" : "m";
}

/** Match scripts/generate-tts.py slugify for stable filenames. */
export function slugifyAudio(text: string): string {
  const nfkd = text.normalize("NFKD");
  const ascii = nfkd.replace(/\p{M}/gu, "");
  return ascii
    .toLowerCase()
    .replace(/[¿?¡!,.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Gendered clip: `{slug}-f.mp3` / `{slug}-m.mp3`. */
export function audioSrcFor(text: string, voice: AudioVoice = "f"): string {
  return `/audio/es-mx/${slugifyAudio(text)}-${voice}.mp3`;
}

/** Legacy ungendered path (pre dual-voice). */
export function audioSrcLegacy(text: string): string {
  return `/audio/es-mx/${slugifyAudio(text)}.mp3`;
}

/** Heuristic: option/chip looks like Spanish worth playing. */
export function looksSpanish(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (/[áéíóúüñ¿¡]/i.test(t)) return true;
  const norm = t
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[¿?¡!,.]/g, "");
  if (
    /\b(hola|adios|gracias|perdon|disculpe|buenos|buenas|dias|tardes|noches|mucho|gusto|llamo|llamas|llamarse|soy|eres|es|somos|son|hablo|hablas|habla|hablan|ingles|espanol|mexico|estados|unidos|vivo|viven|tambien|pero|nada|favor|luego|hasta|usted|ustedes|como|donde|de|un|poco|si|no|me|te|se|nos|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|veinte|cien|celular|telefono|anos|cuanto|cuesta|pesos|dolares|gratis|tengo|tienes|numero|numeros|carro|jugo|departamento|despierto|trabajo|camino|gusta|gustan|quiero|cuenta|cerca|lejos|derecha|izquierda|recto|centro|metro|llego|comi|hable|ayer|hoy|fui|hice|tuve|dije|voy|vas|gustaria|parece)\b/.test(
      norm
    )
  ) {
    return true;
  }
  if (
    /^(hola|adios|gracias|perdon|disculpe|si|no|de nada|por favor|mucho gusto|hasta luego)$/i.test(
      t.trim()
    )
  ) {
    return true;
  }
  return false;
}

let current: HTMLAudioElement | null = null;

/**
 * Try baked URLs in order. Prefer Neural2 MP3s; only fall back to browser TTS
 * when every candidate fails to load/play (missing file / decode error).
 */
function tryPlay(urls: string[], text: string, i = 0): void {
  if (i >= urls.length) {
    speakPracticeAudio(text);
    return;
  }
  const url = urls[i];
  const audio = new Audio();
  current = audio;

  let settled = false;
  const fail = () => {
    if (settled) return;
    settled = true;
    audio.removeEventListener("error", fail);
    audio.removeEventListener("canplaythrough", onReady);
    tryPlay(urls, text, i + 1);
  };
  const onReady = () => {
    if (settled) return;
    settled = true;
    audio.removeEventListener("error", fail);
    audio.removeEventListener("canplaythrough", onReady);
    void audio.play().catch(fail);
  };

  audio.addEventListener("error", fail);
  audio.addEventListener("canplaythrough", onReady);
  audio.preload = "auto";
  audio.src = url;
  // Some browsers fire canplaythrough late; also kick play after a short load.
  void audio.load();
}

/**
 * Play baked MP3 for text; prefer gendered Neural2 clip, then legacy slug,
 * then browser TTS only if generation truly failed / file is missing.
 */
export function playSpanishAudio(
  text: string,
  src?: string,
  voice: AudioVoice = "f"
): void {
  if (typeof window === "undefined") return;
  try {
    if (current) {
      current.pause();
      current = null;
    }
    const urls = src
      ? [src, audioSrcFor(text, voice), audioSrcLegacy(text)]
      : [audioSrcFor(text, voice), audioSrcLegacy(text)];
    // Dedupe while preserving order
    const seen = new Set<string>();
    const unique = urls.filter((u) => {
      if (seen.has(u)) return false;
      seen.add(u);
      return true;
    });
    tryPlay(unique, text);
  } catch {
    speakPracticeAudio(text);
  }
}
