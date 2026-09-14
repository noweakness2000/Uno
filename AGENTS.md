# Uno

Explanations-first **Latin American Spanish** learning app. Brand is **Uno**, never Habla.

No hearts, energy, or lockouts. XP, streak, and daily goals are motivational only. Demo/local mode must keep working without login.

## Stack

- Next.js 15 App Router + React 19 + TypeScript (strict)
- Tailwind 4 + shadcn-style primitives in `src/components/ui`
- Zustand + persist (`src/store`) for demo user and lesson session
- Auth.js (NextAuth v5) + Google SSO in `src/auth.ts` — optional until env is set
- Drizzle ORM + Postgres in `src/db`
- Path alias: `@/*` → `src/*`

Prefer `bun` (`bun.lock` is in repo). npm is fine.

```bash
bun install
bun run dev          # http://localhost:3000
bun run build
bun run lint
bun run db:push      # drizzle-kit push
bun run db:generate
bun run generate-tts # python3 scripts/generate-tts.py
```

Do not commit `.env*`, `credentials*.json`, or TTS secrets.

## Layout

| Path | Role |
| --- | --- |
| `src/app/` | Routes: `/` → onboarding or home, `/login`, `/onboarding`, `/home`, `/lesson/[id]`, `/review`, `/flashcards`, `/leaderboard`, `/privacy` |
| `src/app/api/` | Auth.js, `/api/progress`, `/api/leaderboard` |
| `src/components/lesson/` | Lesson player, teach view, exercise views |
| `src/components/wrong-answer-panel.tsx` | Feedback sheet; wrong answers show the **correct answer in bold** |
| `src/lib/types.ts` | Word cards, exercises, placement types — extend here first |
| `src/lib/grading.ts` | Accent-insensitive match, near-miss, chip sequences |
| `src/lib/correct-answer.ts` | Display string for the correct answer |
| `src/lib/placement.ts` | Starting level → recommended/skipped units |
| `src/lib/content/` | Units 1–3 in `unit1.ts`…`unit3.ts`; units 4+ in `intermediate.ts` (+ `unit5.ts`…`unit11.ts`) |
| `src/lib/mock-data.ts` | Assembles units/lessons/word cards + demo user. Early Unit 1 lessons (`u1-l1`…`u1-l4`) live here so audio voice indices stay stable |
| `src/store/user-store.ts` | Persisted demo user (XP, streak, weak words, SRS, placement) |
| `src/store/lesson-store.ts` | In-progress lesson session |
| `public/audio/es-mx/` | Baked Neural2 MP3s (`{slug}-{f\|m\|c}.mp3`) |

## Product rules

- **Dialect:** Latin American Spanish. Default vocab: `carro`, `jugo`, `departamento`, `celular`, `computadora`. Verb tables use **ustedes**, not vosotros. Do not switch the product to Spain-Spanish.
- **UI language:** English prompts for exercises. Spanish chrome only when it is obvious (the Spanish itself, speaker buttons, word-card lemmas).
- **Teach then practice:** `teach` exercises are 0 XP, no fail state. Word cards need `meaningSummary`, examples as `{ es, en }` (Spanish on top, English under), conjugations when the lemma is a verb.
- **Wrong answers:** short explanation, mark weak, continue. Never block the learner.
- **Grading:** accents optional (`normalizeAnswer` in `grading.ts`). Translate / fill-blank / cloze / dictation / conjugate use `acceptedAnswers` — include courtesy near-synonyms.
- **Listening:** prefer baked `audioSrc` from `audioSrcFor()` / `voiceForIndex()`. Browser TTS is a stub labeled **practice audio** (prefer `es-MX` / `es-US` / `es-419`). Do not bulk-regenerate or commit `public/audio/es-mx/` unless the task is explicitly TTS.
- **Placement:** self-claimed `startingLevel` only (`absolute_beginner` → Unit 1, `some_words` → Unit 2 / Unit 1 optional review, `conversational_basics` → Unit 4+). True diagnostic test is future work.

## Content IDs

- Lessons: `u{n}-l{m}` (e.g. `u1-l1`). Units: `unit-1` … `unit-11`.
- Beginner = units 1–3. Intermediate starts at `unit-4`.
- New listening items must set `audioText` + `audioSrc` so filenames match `scripts/generate-tts.py` slugify.

## Auth and data

Env (never commit): `DATABASE_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_URL`.

If Google credentials are missing, the app still boots; `/login` shows a config message. Zustand + `localStorage` remains the source of truth until the user signs in, then progress can sync via `/api/progress`.

## Do not

- Add hearts, lives, energy, paywalls, or hard lockouts
- Rename the product to Habla
- Default to vosotros / Spain vocab
- Put secrets in the repo
- Drive-by refactors, new dependencies, or audio regenerations outside the requested task
