# MedTrack

A small, focused web app for tracking medications and logging every dose — so the answer to *"did I already take it?"* is never a guess.

Built as a full-stack TypeScript application: server-rendered Next.js with a real Postgres database, session-based authentication implemented from scratch, and an end-to-end test suite.

> I built MedTrack coming from a background as a registered nurse. Medication adherence is a problem I watched play out on hospital floors, so it felt like the right thing to build well rather than a throwaway demo.

---

## What it does

- **Accounts** — register and log in. Passwords are hashed with bcrypt; sessions are signed JWTs stored in an httpOnly cookie.
- **Medications** — add, list, and delete medications (name, dosage, frequency, notes). Every query is scoped to the signed-in user.
- **Dose logging** — log a dose in one click and see today's doses, with a running count and the time of your last dose on the dashboard.
- **Protected routes** — the dashboard is guarded by middleware; unauthenticated visitors are redirected to login.

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14** (App Router) | Server Components + Server Actions for mutations without a separate API layer |
| Language | **TypeScript** (strict) | Type safety across the data layer, server actions, and UI |
| Database | **Postgres** via **Drizzle ORM** | Typed schema and queries; SQL you can actually read |
| Local DB | **PGlite** | Postgres compiled to WASM — clone and run with zero database setup |
| Auth | **bcryptjs** + **jose** (JWT) | Hand-rolled session auth, no black-box library |
| Validation | **Zod** | One schema validates both the form and the server action |
| Styling | **Tailwind CSS** | |
| Testing | **Playwright** | End-to-end tests covering the real user flows |
| CI | **GitHub Actions** | Type check, build, and E2E on every push |

## Architecture notes

- **Server Actions over an API layer.** Mutations (`register`, `login`, `addMedication`, `logDose`, `deleteMedication`) are server actions in `src/app/**/actions.ts`. Each re-validates input with Zod and re-checks ownership server-side — the client is never trusted.
- **Auth is intentionally from scratch.** `src/lib/auth.ts` hashes passwords, signs/verifies JWTs, and manages the session cookie. `src/middleware.ts` does an edge-safe JWT check to protect `/dashboard`. I chose to implement this rather than configure a library so I understand every line of the flow.
- **One schema, two drivers.** `src/lib/schema.ts` is plain Postgres. Locally it runs against PGlite; in production it runs against managed Postgres (Neon). The schema and queries are identical because both speak Postgres.

## Running locally

```bash
npm install
cp .env.example .env        # then set AUTH_SECRET (openssl rand -base64 32)
npm run db:seed             # optional: creates demo@medtrack.app / password123
npm run dev                 # http://localhost:3000
```

No database to install — PGlite creates a local Postgres in `./.pgdata` on first run.

## Running the tests

```bash
npx playwright install chromium   # one time
npm run test:e2e
```

The suite covers registration, login/logout, the protected-route redirect, duplicate-email handling, and the full add → log dose → delete medication flow.

## Deploying to production (Vercel + Neon)

The only change from local is swapping the database driver — the schema and queries stay the same.

1. Create a free Postgres database at [neon.tech](https://neon.tech) and copy its connection string.
2. Install the Neon driver: `npm install @neondatabase/serverless`.
3. In `src/lib/db.ts`, replace the PGlite client with the Neon driver:

   ```ts
   import { drizzle } from "drizzle-orm/neon-http";
   import { neon } from "@neondatabase/serverless";
   import * as schema from "@/lib/schema";

   const sql = neon(process.env.DATABASE_URL!);
   export const db = drizzle(sql, { schema });
   ```

4. Generate and apply migrations against Postgres (instead of the local `ensureSchema` helper):

   ```bash
   npx drizzle-kit generate
   npx drizzle-kit migrate
   ```

5. Push to GitHub, import the repo on Vercel, and set `DATABASE_URL` and `AUTH_SECRET` as environment variables.

## Project structure

```
src/
  app/
    page.tsx                  landing page
    (auth)/login,register     auth pages
    actions/auth.ts           register / login / logout server actions
    dashboard/
      page.tsx                today overview
      medications/page.tsx    medication list + add form
      actions.ts              add / delete medication, log dose
  components/                 client components (forms, submit button)
  lib/
    schema.ts                 Drizzle schema
    db.ts                     database connection (PGlite local / Postgres prod)
    auth.ts                   password hashing + JWT sessions
    validation.ts             Zod schemas
  middleware.ts               protects /dashboard
e2e/                          Playwright tests
```
