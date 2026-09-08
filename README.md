# Uno — LatAm Spanish

Explanations-first Spanish learning for Latin American Spanish. No hearts, no energy, no lockouts — XP, streak, and daily goals are motivational only.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui-style components
- Zustand (persisted demo user + lesson session state)
- Mock data only (no real DB)

> Later: Postgres on Unraid `:5433`

## Brand / product notes

- Brand: **Uno** (not Habla)
- LatAm-neutral vocab: **carro**, **jugo**, **departamento**, **celular**, **computadora**
- English prompts for exercises; Spanish chrome only when obvious
- Wrong answers: short explanation + mark weak + continue
- Listening: browser TTS stub labeled **practice audio** (prefers es-MX / es-US / es-419)
- Wrong-answer feedback shows the **correct answer in bold**
- Grading: accents optional; courtesy near-synonyms on translate items

## Run locally

Install dependencies, then start the dev server:

```bash
bun install
bun run dev
```

Or with Node's classic client:

```bash
npm install
npm run dev
```

```bash
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000).

Production build:

```bash
bun run build
bun run start
```

Scripts in `package.json`: `dev`, `build`, `start`, `lint`.

## Main routes

| Route | Screen |
| --- | --- |
| `/` | Redirects to onboarding or home |
| `/onboarding` | Display name, starting level, daily XP goal |
| `/home` | Streak, XP, daily goal, unit path, edit profile |
| `/lesson/[id]` | Lesson player (8–12 items) |
| `/review` | Weak items from wrong answers |

## Demo content

- **Unit 1 — First contact**: `u1-l1` Hello & goodbye · `u1-l2` What's your name? · `u1-l3` Thanks & sorry · `u1-l4` First chat check
- **Unit 2 — Who I am**: `u2-l1` I'm from… / I live in… · `u2-l2` I speak… · `u2-l3` About you check (Units 1–2 unlocked for all)
- Units 3–5 visually locked for sequence
- Teach-before-practice word cards with meaningSummary, conjugations (LatAm, ustedes), examples + speaker audio
- Baked LatAm Neural2 MP3s under `public/audio/es-mx/`

## Placement (starting level)

Onboarding stores a self-claimed `startingLevel` on the demo user:

| Level | Effect today |
| --- | --- |
| `absolute_beginner` (A0) | Unit 1 |
| `some_words` (false beginner) | Unit 1 (preference stored for later) |
| `conversational_basics` (A2-ish) | Units 1-2 unlocked visually — content is **not** skipped |

**True placement test comes later.** This pass only stores the preference and gates Unit 2 visually for higher comfort.

## Future

- True placement / diagnostic test
- TODO: illustrated characters / Duo-style art for lessons and onboarding
- Real TTS / recorded audio; Postgres-backed content

## License

Demo / scaffolding project.
