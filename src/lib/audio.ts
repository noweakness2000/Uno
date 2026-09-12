/** Baked Spanish practice MP3s under /public/audio/es-mx/ (Neural2). */

import { speakPracticeAudio } from "@/lib/tts";

/** f = es-US-Neural2-A (F) · m = Neural2-B (M) · c = Neural2-C (M) */
export type AudioVoice = "f" | "m" | "c";

const VOICE_ROTATION: AudioVoice[] = ["f", "m", "c"];

export function voiceForIndex(index: number): AudioVoice {
  return VOICE_ROTATION[((index % VOICE_ROTATION.length) + VOICE_ROTATION.length) % VOICE_ROTATION.length];
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

/** Gendered clip: `{slug}-f.mp3` / `{slug}-m.mp3` / `{slug}-c.mp3`. */
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
    /\b(hola|adios|gracias|perdon|disculpe|buenos|buenas|dias|tardes|noches|mucho|gusto|llamo|llamas|llamarse|soy|eres|es|somos|son|hablo|hablas|habla|hablan|ingles|espanol|mexico|estados|unidos|vivo|viven|tambien|pero|nada|favor|luego|hasta|usted|ustedes|como|donde|de|un|poco|si|no|me|te|se|nos|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez|veinte|cien|celular|telefono|anos|cuanto|cuesta|pesos|dolares|gratis|tengo|tienes|numero|numeros|carro|jugo|departamento|despierto|trabajo|camino|gusta|gustan|quiero|cuenta|cerca|lejos|derecha|izquierda|recto|centro|metro|llego|comi|hable|ayer|hoy|fui|hice|tuve|dije|voy|vas|gustaria|parece|levanto|levantas|ducho|duchas|desayuno|estudio|limpio|cocina|fin|semana|descanso|temprano|manana|preparo|lavo|oficina|escuela|tarea|ropa|platos|dormir|duermo)\b/.test(
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

/** Stop any in-flight baked clip. */
export function stopSpanishAudio(): void {
  if (typeof window === "undefined") return;
  if (current) {
    current.pause();
    current = null;
  }
  try {
    window.speechSynthesis?.cancel();
  } catch {
    /* ignore */
  }
}

/**
 * Play one baked clip and resolve when it ends (or immediately on total failure).
 */
export type PlayAudioOptions = {
  src?: string;
  voice?: AudioVoice;
  /** Playback rate (e.g. 0.75 or 1). */
  rate?: number;
  /** Abort mid-clip (pause / restart). */
  signal?: AbortSignal;
};

export function playSpanishAudioAsync(
  text: string,
  srcOrOpts?: string | PlayAudioOptions,
  voiceArg: AudioVoice = "f"
): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  const opts: PlayAudioOptions =
    typeof srcOrOpts === "object" && srcOrOpts !== null
      ? srcOrOpts
      : { src: srcOrOpts, voice: voiceArg };
  const voice = opts.voice ?? voiceArg;
  const rate = opts.rate && opts.rate > 0 ? opts.rate : 1;
  const signal = opts.signal;

  return new Promise((resolve) => {
    if (signal?.aborted) {
      resolve();
      return;
    }

    const onAbort = () => {
      if (current) {
        current.pause();
        current = null;
      }
      try {
        window.speechSynthesis?.cancel();
      } catch {
        /* ignore */
      }
      resolve();
    };
    signal?.addEventListener("abort", onAbort, { once: true });

    try {
      if (current) {
        current.pause();
        current = null;
      }
      const urls = opts.src
        ? [opts.src, audioSrcFor(text, voice), audioSrcLegacy(text)]
        : [audioSrcFor(text, voice), audioSrcLegacy(text)];
      const seen = new Set<string>();
      const unique = urls.filter((u) => {
        if (seen.has(u)) return false;
        seen.add(u);
        return true;
      });

      const tryUrl = (i: number) => {
        if (signal?.aborted) {
          resolve();
          return;
        }
        if (i >= unique.length) {
          speakPracticeAudio(text);
          // Browser TTS has no reliable ended event across engines — short pause.
          const ms = Math.min(4000, 400 + text.length * 60) / rate;
          window.setTimeout(() => resolve(), ms);
          return;
        }
        const audio = new Audio();
        current = audio;
        audio.playbackRate = rate;
        let settled = false;
        const fail = () => {
          if (settled) return;
          settled = true;
          audio.removeEventListener("error", fail);
          audio.removeEventListener("ended", onEnded);
          audio.removeEventListener("canplaythrough", onReady);
          tryUrl(i + 1);
        };
        const onEnded = () => {
          if (settled) return;
          settled = true;
          signal?.removeEventListener("abort", onAbort);
          resolve();
        };
        const onReady = () => {
          if (signal?.aborted) {
            if (settled) return;
            settled = true;
            resolve();
            return;
          }
          void audio.play().catch(fail);
        };
        audio.addEventListener("error", fail);
        audio.addEventListener("ended", onEnded);
        audio.addEventListener("canplaythrough", onReady);
        audio.preload = "auto";
        audio.src = unique[i];
        void audio.load();
      };
      tryUrl(0);
    } catch {
      speakPracticeAudio(text);
      window.setTimeout(() => resolve(), 800);
    }
  });
}

/**
 * Play a baked clip and report whether one actually existed.
 *
 * Unlike playSpanishAudio this never falls back to browser TTS — callers that
 * need "baked audio or nothing" (tap-chips tiles, scrambled arrangements) use
 * the boolean to decide what to do next.
 */
export function playBakedClip(
  text: string,
  voice: AudioVoice = "f"
): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  const urls = [audioSrcFor(text, voice), audioSrcLegacy(text)];

  return new Promise((resolve) => {
    try {
      if (current) {
        current.pause();
        current = null;
      }
    } catch {
      /* ignore */
    }

    const tryUrl = (i: number) => {
      if (i >= urls.length) {
        resolve(false);
        return;
      }
      const audio = new Audio();
      current = audio;
      let settled = false;
      const fail = () => {
        if (settled) return;
        settled = true;
        tryUrl(i + 1);
      };
      const onEnded = () => {
        if (settled) return;
        settled = true;
        resolve(true);
      };
      audio.addEventListener("error", fail);
      audio.addEventListener("ended", onEnded);
      audio.addEventListener("canplaythrough", () => {
        void audio.play().catch(fail);
      });
      audio.preload = "auto";
      audio.src = urls[i];
      void audio.load();
    };
    tryUrl(0);
  });
}

/**
 * Speak a learner-built phrase using clips that already exist.
 *
 * Tries the whole phrase first, which sounds natural when the words happen to
 * be in the order a baked clip was recorded in. Any other order has no clip,
 * so it falls back to playing each word's own clip in sequence rather than
 * going silent.
 */
export async function playPhraseOrWords(
  words: string[],
  voice: AudioVoice = "f",
  gapMs = 90
): Promise<void> {
  if (typeof window === "undefined" || words.length === 0) return;
  const phrase = words.join(" ");
  if (await playBakedClip(phrase, voice)) return;
  for (const word of words) {
    await playBakedClip(word, voice);
    if (gapMs > 0) {
      await new Promise<void>((r) => window.setTimeout(r, gapMs));
    }
  }
}

export type StoryPlayOptions = {
  onLine?: (index: number) => void;
  /** Gap between lines in ms (podcast breathing room). Default 550. */
  gapMs?: number;
  rate?: number;
  signal?: AbortSignal;
  /** Start at this line index (resume after pause). */
  startIndex?: number;
};

/** Play story lines sequentially with optional per-line highlight callback. */
export async function playStoryLines(
  lines: { text: string; voice?: AudioVoice }[],
  onLineOrOpts?: ((index: number) => void) | StoryPlayOptions
): Promise<void> {
  const opts: StoryPlayOptions =
    typeof onLineOrOpts === "function"
      ? { onLine: onLineOrOpts }
      : onLineOrOpts ?? {};
  const gapMs = opts.gapMs ?? 550;
  const rate = opts.rate ?? 1;
  const start = Math.max(0, opts.startIndex ?? 0);

  for (let i = start; i < lines.length; i++) {
    if (opts.signal?.aborted) return;
    opts.onLine?.(i);
    const voice = lines[i].voice ?? voiceForIndex(i);
    await playSpanishAudioAsync(lines[i].text, {
      voice,
      rate,
      signal: opts.signal,
    });
    if (opts.signal?.aborted) return;
    if (i < lines.length - 1 && gapMs > 0) {
      await new Promise<void>((resolve) => {
        const t = window.setTimeout(resolve, gapMs);
        opts.signal?.addEventListener(
          "abort",
          () => {
            window.clearTimeout(t);
            resolve();
          },
          { once: true }
        );
      });
    }
  }
}
