# Captionlift

AI video captioning for short-form creators. Upload a video, get it back with
clean, timestamped captions burned in — built for TikTok, Reels and Shorts.

**Model:** 1 free captioned video, then a one-time £5 for unlimited lifetime
access (no subscription).

## Status

Early build. Currently live: the marketing/landing page only. Upload,
transcription, caption editing, rendering, auth, and payments are not built
yet — see the project plan for what's next.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase (auth, Postgres, storage) — not yet connected
- lucide-react for icons

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in real values as they exist
npm run dev
```

Open http://localhost:3000

## Configuration

Numbers like the free video limit and the lifetime price are never
hardcoded — they live in `src/lib/config.ts` and are driven by environment
variables (see `.env.local.example`). Change the env var, not the code, to
adjust them.
