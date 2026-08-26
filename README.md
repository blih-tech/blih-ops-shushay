# blih-ops

Basic setup for the Blih MVP: 4 repos, run independently.

```
blih-api          → api.blih.com     (Express + Prisma + Postgres)
blih-skills-web   → skills.blih.com  (Next.js)
blih-talent-web   → talent.blih.com  (Next.js)
blih-auth-web     → auth.blih.com    (Next.js)
```

The web apps talk only to `blih-api` — none of them touch Postgres directly.

## Get everything running locally

1. `cd blih-api && npm install && cp .env.example .env`
2. `docker compose up -d` (starts Postgres from `blih-api/docker-compose.yml`)
3. `npm run prisma:migrate` (inside `blih-api`)
4. `npm run dev` in `blih-api` → http://localhost:4000/api/v1/health
5. In each of `blih-skills-web`, `blih-talent-web`, `blih-auth-web`:
   `npm install && cp .env.local.example .env.local && npm run dev`
   (ports 3001 / 3002 / 3003 respectively)

Each repo has its own README with specifics. This is a Phase 0 skeleton — see the implementation plan for Phase 1 (authentication) as the next step.

> Note: `node_modules` are not included — run `npm install` in each folder after unzipping. Each repo should also become its own git repository (`git init`) once you're ready to push.
