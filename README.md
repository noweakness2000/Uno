# Uno — LatAm Spanish

Explanations-first Spanish learning for Latin American Spanish. No hearts, no energy, no lockouts — XP, streak, and daily goals are motivational only.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui-style components
- Zustand (persisted demo user + lesson session state) — works offline / without login
- Auth.js (NextAuth v5) + Google SSO (optional until credentials are set)
- Drizzle ORM + Postgres (`habla-latam-db` on Unraid network `habla-latam`)

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
| `/login` | Sign in with Google (demo continues without login) |
| `/onboarding` | Display name, starting level, daily XP goal |
| `/home` | Streak, XP, daily goal, unit path, edit profile |
| `/lesson/[id]` | Lesson player (8–12 items) |
| `/review` | Weak items from wrong answers |
| `/api/auth/[...nextauth]` | Auth.js callbacks |

## Demo content

- **Unit 1 — First contact**: `u1-l1` Hello & goodbye · `u1-l2` What's your name? · `u1-l3` Thanks & sorry · `u1-l4` First chat check
- **Unit 2 — Who I am**: `u2-l1` I'm from… / I live in… · `u2-l2` I speak… · `u2-l3` About you check (Units 1–2 unlocked for all)
- **Unit 3 — Numbers that matter**: `u3-l1`–`u3-l3`
- **Intermediate Units 4–8**: Daily life (~12 lessons + story-listen) · Food & ordering (~12 lessons + story-listen) · Getting around · What I did (preterite) · Plans & invitations (`u4-l1`…`u4-l12`, `u5-l1`…`u5-l12`, `u6-l1`…`u8-l2`)
- Teach-before-practice word cards with meaningSummary, conjugations (LatAm, ustedes), examples + speaker audio
- Baked LatAm Neural2 MP3s under `public/audio/es-mx/`

## Placement (starting level)

Onboarding stores a self-claimed `startingLevel` on the demo user (plus `recommendedUnitId` / `skippedUnitIds`):

| Level | Effect today |
| --- | --- |
| `absolute_beginner` (A0) | Start Unit 1 Lesson 1; Units 1–2 unlocked; Continue → first incomplete U1 |
| `some_words` (false beginner) | Unit 1 = Quick review (optional); Continue / recommended path → Unit 2 |
| `conversational_basics` (stronger) | Unit 1 marked skipped/complete; Continue → Unit 2; optional “Unit 2 check” CTA |

Home shows a placement banner when Unit 1 is optional, a primary **Continue** button, and a **Skip ahead** control for anyone still in Unit 1.

Word-card examples are `{ es, en }` pairs — Spanish with English directly underneath on teach screens and the word-card drawer.

**True placement / diagnostic test comes later.**

## Future

- True placement / diagnostic test
- TODO: illustrated characters / Duo-style art for lessons and onboarding
- Real TTS / recorded audio; richer Postgres-backed content


## Auth (Google SSO)

Demo / local mode keeps working with Zustand + `localStorage` until the user signs in. After Google sign-in, progress can sync to Postgres via `/api/progress`.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres URL (Docker: `postgresql://habla:PASSWORD@habla-latam-db:5432/habla_latam`) |
| `AUTH_SECRET` | Random secret (`openssl rand -base64 32`) |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `AUTH_URL` | Canonical URL, e.g. `https://uno.rivertechnologies.app` (`trustHost` also allows LAN) |

If `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` are missing, the app still boots; `/login` shows a config message instead of a working Google button.

### Google Cloud OAuth setup

1. Open [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials.
2. Configure the OAuth consent screen (External or Internal).
3. Create credentials → **OAuth client ID** → Application type **Web application**.
4. Authorized JavaScript origins (optional but useful):
   - `https://uno.rivertechnologies.app`
   - `http://192.168.11.100:3000`
5. Authorized redirect URIs (required):
   - `https://uno.rivertechnologies.app/api/auth/callback/google`
   - `http://192.168.11.100:3000/api/auth/callback/google`
6. Copy the client ID and secret into the Uno container env as `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`, then recreate `uno-web`.

### Database schema

Auth.js adapter tables live in Drizzle (`src/db/schema.ts`): `users`, `accounts`, `sessions`, `verificationTokens`, plus optional progress fields on `users`.

```bash
# From a host that can reach Postgres (LAN :5433 or Docker network)
export DATABASE_URL='postgresql://habla:PASSWORD@127.0.0.1:5433/habla_latam'
npm run db:push
```

## License

Demo / scaffolding project.
