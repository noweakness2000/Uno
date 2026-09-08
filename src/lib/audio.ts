/** Baked LatAm practice MP3s under /public/audio/es-mx/ (Neural2). */

import { speakPracticeAudio } from "@/lib/tts";

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

export function audioSrcFor(text: string): string {
  return `/audio/es-mx/${slugifyAudio(text)}.mp3`;
}

/** Heuristic: option/chip looks like Spanish worth playing. */
export function looksSpanish(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (/[áéíóúüñ¿¡]/i.test(t)) return true;
  // Common A1 chunks / function words (accent-stripped match)
  const norm = t
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[¿?¡!,.]/g, "");
  if (
    /\b(hola|adios|gracias|perdon|disculpe|buenos|buenas|dias|tardes|noches|mucho|gusto|llamo|llamas|llamarse|soy|eres|es|somos|son|hablo|hablas|habla|hablan|ingles|espanol|mexico|estados|unidos|vivo|viven|tambien|pero|nada|favor|luego|hasta|usted|ustedes|como|donde|de|un|poco|si|no|me|te|se|nos)\b/.test(
      norm
    )
  ) {
    return true;
  }
  // Short all-lowercase tokens that are clearly not English glosses
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
 * Play baked MP3 for text; fall back to browser TTS if the file is missing
 * or fails to load.
 */
export function playSpanishAudio(text: string, src?: string): void {
  if (typeof window === "undefined") return;
  const url = src ?? audioSrcFor(text);
  try {
    if (current) {
      current.pause();
      current = null;
    }
    const audio = new Audio(url);
    current = audio;
    void audio.play().catch(() => {
      speakPracticeAudio(text);
    });
  } catch {
    speakPracticeAudio(text);
  }
}
