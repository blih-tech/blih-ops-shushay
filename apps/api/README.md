# blih-api

The single backend for Skills Web, Talent Web, and Auth Web. Owns the database — the web apps never touch Postgres directly.

## Setup

```bash
npm install
cp .env.example .env       # then edit DATABASE_URL / JWT_SECRET
docker compose up -d       # starts local Postgres on :5432
npm run prisma:migrate     # creates the first migration
npm run dev                # http://localhost:4000/api/v1/health
```

## Structure

- `src/modules/*` — one folder per domain module (auth, users, talents, companies, courses, learning, certificates, payments, subscriptions, jobs, applications, notifications). Keep them as internal modules, not separate services.
- `src/middleware/errorHandler.ts` — consistent `{ error: { message, details } }` response shape.
- `src/middleware/validate.ts` — Zod-based request validation.
- `prisma/schema.prisma` — starts with the `User` model (roles: talent, company, admin) from Phase 1.

## Next steps (Phase 1 — Authentication)

1. Fill in `src/modules/auth` (register, login, logout, email verification, password reset).
2. Add auth + role-based authorization middleware.
3. Wire it into `src/routes/index.ts`.
