/**
 * Print the Word of the Day phrases (lemma + example sentence) that have no
 * baked clip yet, one per line — input for
 * `python3 scripts/generate-tts.py --phrases-file <file>`.
 *
 * Only the ~500 entries that actually make the pot are listed; wotd-pad.ts
 * holds more than the pot uses, and those extras never show, so they never
 * need audio.
 *
 *   bun run scripts/list-wotd-phrases.ts > wotd-missing.txt
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { audioSrcFor, audioSrcLegacy } from "../src/lib/audio";
import { getWotdPot } from "../src/lib/word-of-the-day";

const PUBLIC = join(import.meta.dir, "..", "public");
const VOICES = ["f", "m", "c"] as const;

function hasAllVoices(text: string): boolean {
  if (existsSync(join(PUBLIC, audioSrcLegacy(text)))) return true;
  return VOICES.every((v) => existsSync(join(PUBLIC, audioSrcFor(text, v))));
}

const seen = new Set<string>();
const out: string[] = [];
for (const entry of getWotdPot()) {
  for (const text of [entry.lemma, entry.exampleEs]) {
    if (seen.has(text) || hasAllVoices(text)) continue;
    seen.add(text);
    out.push(text);
  }
}
console.log(out.join("\n"));
console.error(`# ${out.length} phrases without a full voice set`);
