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
- Listening: browser TTS stub labeled **practice audio**

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
| `/onboarding` | Pick daily XP goal → demo user |
| `/home` | Streak, XP, daily goal, unit path |
| `/lesson/[id]` | Lesson player (8–12 items) |
| `/review` | Weak items from wrong answers |

## Demo content

- **Unit 1 — First contact**: playable lessons `u1-l1`, `u1-l2`
- **Unit 2 — Meeting people**: `u2-l1` unlocked look
- Units 3–5 visually locked for sequence
- Word cards for greetings & polite basics (`buenos días`, `mucho gusto`, `perdón`, …)

## License

Demo / scaffolding project.
