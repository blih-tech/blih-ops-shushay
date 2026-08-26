# blih-skills-web

Next.js frontend for Blih Skills — course catalog, learning, quizzes/assignments, certificates, and course administration.

## Setup
```bash
npm install
cp .env.local.example .env.local
npm run dev   # http://localhost:3001
```

Talks to `blih-api` via `src/lib/api.ts` — set `NEXT_PUBLIC_API_URL` to the API's `/api/v1` base.
