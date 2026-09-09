/** Browser TTS labeled as practice audio — prefer Spanish voices. */

function scoreVoice(voice: SpeechSynthesisVoice): number {
  const lang = voice.lang.replace("_", "-");
  const lower = lang.toLowerCase();
  if (lower === "es-mx" || lower.startsWith("es-mx")) return 100;
  if (lower === "es-us" || lower.startsWith("es-us")) return 90;
  if (lower === "es-419" || lower.includes("419")) return 85;
  if (lower === "es-es" || lower.startsWith("es-es")) return 70;
  if (lower.startsWith("es")) return 50;
  return 0;
}

function pickSpanishVoice(
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | null {
  let best: SpeechSynthesisVoice | null = null;
  let bestScore = 0;
  for (const v of voices) {
    const s = scoreVoice(v);
    if (s > bestScore) {
      bestScore = s;
      best = v;
    }
  }
  return bestScore > 0 ? best : null;
}

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  const existing = window.speechSynthesis.getVoices();
  if (existing.length > 0) return Promise.resolve(existing);
  return new Promise((resolve) => {
    const done = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", done);
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener("voiceschanged", done);
    // Fallback if voiceschanged never fires
    setTimeout(() => {
      window.speechSynthesis.removeEventListener("voiceschanged", done);
      resolve(window.speechSynthesis.getVoices());
    }, 500);
  });
}

/** True when no Spanish-tagged voice is available (caller may show install tip). */
export async function hasSpanishVoice(): Promise<boolean> {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  const voices = await loadVoices();
  return pickSpanishVoice(voices) !== null;
}

/**
 * Speak practice audio. Prefers es-MX / es-US / es-419 over es-ES.
 * Always sets lang=es-MX even if no Spanish voice pack is installed.
 */
export function speakPracticeAudio(text: string, lang = "es-MX"): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const speak = (voices: SpeechSynthesisVoice[]) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.88;
    const voice = pickSpanishVoice(voices);
    if (voice) {
      utterance.voice = voice;
      // Prefer the voice's own lang tag when available
      if (voice.lang) utterance.lang = voice.lang.replace("_", "-");
    }
    window.speechSynthesis.speak(utterance);
  };

  const existing = window.speechSynthesis.getVoices();
  if (existing.length > 0) {
    speak(existing);
    return;
  }

  void loadVoices().then(speak);
}
