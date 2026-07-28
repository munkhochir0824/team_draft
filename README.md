# CS2 Team Draft

A CS2-themed live draft board for splitting players into 2–4 teams, plus an
admin page for managing player profiles (with 5-star ability ratings).

## How the draft works

- Teams are numbered 1–4; pick the active count (2, 3, or 4) from Settings.
- Picks rotate through the active teams in order — 1, 2, 3, 4, 1, 2, 3, 4, ...
  (same direction every round, no snake reversal).
- Each team drafts 5 players, so a draft has `teamCount × 5` total picks.
- Click a player card to select it, then hit **Confirm Pick** to lock it in
  for whichever team is currently on the clock.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Vercel KV (Redis) for storage, via `@vercel/kv` — with an in-memory
  fallback so `npm run dev` works without any KV setup
- A single shared admin password (env var) gates `/admin` and player
  create/update/delete endpoints via a signed HTTP-only cookie

## Local development

```bash
npm install
cp .env.local.example .env.local   # set ADMIN_PASSWORD at minimum
npm run dev
```

Open http://localhost:3000. Without `KV_REST_API_URL` / `KV_REST_API_TOKEN`
set, data is kept in memory for that dev process only and resets whenever
the server restarts — that's expected locally.

## Deploying to Vercel

1. Push this repo to GitHub/GitLab/Bitbucket and import it in Vercel, or run
   `vercel` from this directory.
2. Add storage: in the Vercel project → **Storage** tab → create/connect a
   **Redis** store (Vercel's KV offering is now provisioned via the Upstash
   Redis integration on the Marketplace, but it still exposes the same
   `KV_REST_API_URL` / `KV_REST_API_TOKEN` env vars that `@vercel/kv`
   expects). Connect it to this project — Vercel sets those env vars for you.
3. Set the `ADMIN_PASSWORD` environment variable in Project Settings →
   Environment Variables (use a real password, not the local dev one).
4. Deploy. If you want the same env vars locally, run `vercel env pull
   .env.local` after connecting storage.

## Project structure

- `app/page.tsx` — draft board (client component `DraftBoard`)
- `app/admin/page.tsx` — password-gated player management (`AdminPanel` /
  `LoginForm`)
- `app/api/players/*` — player CRUD (mutations require the admin cookie)
- `app/api/draft/*` — draft state, picks, start/reset, team naming
- `lib/store.ts` — KV read/write with the in-memory dev fallback
- `lib/draft.ts` — pick-order and draft-state transition logic
- `lib/auth.ts` — password check + signed session cookie helpers
