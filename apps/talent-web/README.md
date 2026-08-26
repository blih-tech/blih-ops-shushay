# blih-talent-web

Next.js frontend for Blih Talent — talent profiles, job search/applications, and company hiring flows (profile, subscription, talent search, job posting).

## Setup
```bash
npm install
cp .env.local.example .env.local
npm run dev   # http://localhost:3002
```

Talks to `blih-api` via `src/lib/api.ts` — set `NEXT_PUBLIC_API_URL` to the API's `/api/v1` base.
