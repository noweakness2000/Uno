# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

`AGENTS.md` holds the product/brand rules (dialect, tone, "do not" list). Read it too — the rules there are binding and are not repeated in full here.

## Commands

```bash
bun install
bun run dev            # http://localhost:3000
bun run build          # next build (output: "standalone")
bun run lint           # eslint (next/core-web-vitals + next/typescript)
bun run db:push        # drizzle-kit push — needs DATABASE_URL
bun run db:generate
bun run db:studio
bun run generate-tts   # python3 scripts/generate-tts.py (see TTS below)
```

`bun.lock` is committed; npm works too (`package-lock.json` is also committed and is what the Dockerfile uses). There is **no test runner** in this repo — verification is `bun run lint` plus `bun run build` (TypeScript is `strict`, so the build is the type check).

Changes to `src/**` hot-reload under `bun run dev`. Changes to `next.config.ts`, `drizzle.config.ts`, `eslint.config.mjs`, `.env*`, or anything read at process start require restarting the dev server.

## Architecture

### Content is TypeScript, not a database

All lessons, exercises, and word cards are static TS modules. `src/lib/mock-data.ts` is the single assembly point: it spreads `UNIT{1,2,3}_*` plus `INTERMEDIATE_*` into the flat `WORD_CARDS` and `LESSONS` records and defines the `UNITS` array. `src/lib/content/intermediate.ts` is itself an aggregator — it re-exports Units 5–11 from `unit5.ts`…`unit11.ts` and holds Unit 4 inline, plus `INTERMEDIATE_UNITS_META`.

Consequences when adding content:
- A new unit file must be wired in **three** places: its own `unitN.ts`, the aggregator (`intermediate.ts` imports/spreads + `INTERMEDIATE_UNITS_META`), and `scripts/generate-tts.py`'s `CONTENT_FILES` list.
- Unit 1 lessons `u1-l1`…`u1-l4` deliberately live in `mock-data.ts` (not `unit1.ts`) so their audio voice-rotation indices stay stable. Moving them re-slugs audio.
- `intermediate.ts` and the unit files share local helpers (`teach()`, `listen()`, `LATAM_PRESENT`, `LATAM_PRETERITE`) and a module-level `listenVoiceIndex` counter. Inserting a listening item mid-file shifts every later item's voice — append rather than insert when you want existing MP3s to keep matching.

`src/lib/types.ts` is the contract: `Exercise` is a discriminated union of 12 `type` values. Adding an exercise type means touching `types.ts`, the `ExerciseRenderer` switch in `src/components/lesson/exercise-views.tsx`, and usually `feedback-coach.ts`.

### Audio: baked MP3s with a TTS fallback

`public/audio/es-mx/` holds ~6,300 pre-generated Google Neural2 MP3s named `{slug}-{f|m|c}.mp3` (f = es-US-Neural2-A, m = -B, c = -C). Two slugify implementations must stay byte-identical: `slugifyAudio()` in `src/lib/audio.ts` and `slugify()` in `scripts/generate-tts.py`. Diverging them silently breaks playback.

`playSpanishAudio()` / `playSpanishAudioAsync()` try, in order: explicit `audioSrc` → `audioSrcFor(text, voice)` → legacy ungendered `audioSrcLegacy(text)` → browser `speechSynthesis` (`src/lib/tts.ts`), which is a labeled "practice audio" stub. So a missing MP3 degrades rather than fails, which also means a typo in `audioText` looks like it works.

`playStoryLines()` drives the hands-free story/podcast player (per-line highlight callback, gap, playback rate, `AbortSignal` for pause/resume).

Regenerating requires `pip install google-cloud-texttospeech` and `GOOGLE_APPLICATION_CREDENTIALS`. Do not bulk-regenerate or commit audio unless the task is explicitly TTS.

### Two-tier state: local-first, DB-optional

The app is fully usable with no login and no database.

- `src/store/user-store.ts` (zustand + `persist`, localStorage key `uno-demo-user`) is the source of truth for XP, streak, completed lessons, weak words, SRS cards, and placement. Its custom `merge` runs `withPlacementDefaults()` so older persisted shapes get backfilled — add new `DemoUser` fields there or they'll be `undefined` for returning users.
- `src/store/lesson-store.ts` is ephemeral per-lesson session state (index, feedback panel, earned XP). Wrong answers still award `max(1, xp/2)`.
- `src/components/auth/progress-sync.tsx` bridges the two once a session exists: initial PUT+merge, then a fingerprint-diffed, 750 ms debounced PUT, plus `keepalive` flushes on `visibilitychange`/`pagehide`.
- `src/app/api/progress/route.ts` merges rather than overwrites — `Math.max` on numbers, set union on id arrays, `mergeSrsCards` for SRS. Both sides are defensive so a stale response can't lower local XP.

`src/db/index.ts` creates the Postgres client lazily; `hasDatabase()` gates every DB path. `src/auth.ts` only registers the Google provider when `isGoogleAuthConfigured()` passes, and falls back to JWT sessions when there is no DB. Keep new server code behind these guards or the no-env boot breaks.

There is a recurring `displayName` vs OAuth `name` repair story: `src/lib/display-name.ts` `isPlaceholderName()` exists so the string "Learner" never overwrites a real Google name. Both `/api/progress` (GET and PUT) and the `signIn` event carry that repair — preserve it when editing name handling.

`/api/leaderboard` joins `accounts.provider = 'google'`, so demo/local users never appear.

### Grading and placement

`src/lib/grading.ts` normalizes NFD + strips diacritics and punctuation, so accents are always optional. `isNearMiss()` / `isChipNearMiss()` (Levenshtein with a length-scaled threshold) power a soft "Close, but not quite" retry before a real wrong answer. Free-text exercise types carry `acceptedAnswers` arrays — add courtesy near-synonyms there rather than loosening the matcher.

`src/lib/placement.ts` derives everything from the self-claimed `startingLevel`: recommended unit, which units count as skipped, and which lessons get auto-marked complete. It imports `UNITS`/`LESSONS` from `mock-data.ts`, so unit ids are the coupling point (`unit-1`…`unit-11`, lessons `u{n}-l{m}`).

### Word of the Day

`src/lib/word-of-the-day.ts` builds a ~500-entry pot (existing word cards first, then `wotd-pad.ts`), seeded-shuffles it with a fixed seed, and indexes by America/Chicago day offset from a fixed epoch. The seed and epoch are load-bearing — changing either reshuffles everyone's history.

## Deployment surfaces

- **Docker**: `Dockerfile` builds the Next standalone output and runs `node server.js` on 3000. It uses `npm ci` against `package-lock.json`, so keep that lockfile in sync when adding dependencies.
- **Android**: `android/` is a thin Kotlin WebView wrapper (`app.rivertechnologies.uno`, minSdk 26) that loads `R.string.site_url` with cookies and DOM storage enabled. It ships no app logic — web changes reach it without an APK rebuild.

## Environment

`DATABASE_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_URL`. All optional for local demo mode. Never commit `.env*`, `credentials*.json`, or TTS service-account files.
