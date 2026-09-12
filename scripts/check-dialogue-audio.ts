/**
 * Verify every slug listed in BAKED_DIALOGUE_SLUGS actually exists under
 * public/audio/es-mx/, and that every dialogue line claiming audio resolves
 * to a real file.
 *
 * Phase 1 dialogues reuse existing clips only — nothing here generates audio.
 * Run with:  bun run scripts/check-dialogue-audio.ts
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { BAKED_DIALOGUE_SLUGS, DIALOGUES } from "../src/lib/content/dialogues";

const AUDIO_DIR = join(process.cwd(), "public", "audio", "es-mx");
const VOICES = ["f", "m", "c"] as const;

function anyVoiceExists(slug: string): boolean {
  return VOICES.some((v) => existsSync(join(AUDIO_DIR, `${slug}-${v}.mp3`)));
}

let problems = 0;

console.log(`Checking ${BAKED_DIALOGUE_SLUGS.length} declared slugs...`);
for (const slug of BAKED_DIALOGUE_SLUGS) {
  if (!anyVoiceExists(slug)) {
    console.log(`  MISSING  ${slug}`);
    problems += 1;
  }
}

// Every audioSrc emitted onto a line must point at a file that exists.
let withAudio = 0;
let withoutAudio = 0;
for (const d of Object.values(DIALOGUES)) {
  for (const t of d.turns) {
    const lines: (string | undefined)[] = [t.audioSrc];
    for (const o of t.options) lines.push(o.replyAudioSrc);
    for (const src of lines) {
      if (!src) {
        withoutAudio += 1;
        continue;
      }
      withAudio += 1;
      const file = join(process.cwd(), "public", src.replace(/^\//, ""));
      if (!existsSync(file)) {
        console.log(`  BROKEN   ${d.id}: ${src}`);
        problems += 1;
      }
    }
  }
}

const total = withAudio + withoutAudio;
console.log(
  `\n${Object.keys(DIALOGUES).length} dialogues, ${total} spoken lines: ` +
    `${withAudio} with baked audio, ${withoutAudio} silent (no clip exists).`
);
console.log(problems === 0 ? "OK — no missing or broken clips." : `${problems} problem(s).`);
if (problems > 0) process.exit(1);
