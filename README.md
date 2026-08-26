# Blih Ops Nx Monorepo

Welcome to the Blih Ops Nx Monorepo! This repository contains the code for the Blih platform, unified into a single repository for easier development and sharing of packages.

## Architecture

The project consists of 4 main applications (in `apps/`) and several shared libraries (in `packages/`):

```
blih-ops/
├── apps/
│   ├── api          → api.blih.com     (Express + Prisma + Postgres)
│   ├── skills-web   → skills.blih.com  (Next.js)
│   ├── talent-web   → talent.blih.com  (Next.js)
│   └── auth-web     → auth.blih.com    (Next.js)
│
├── packages/
│   ├── api-client   → Shared API fetching logic
│   ├── types        → Shared TypeScript types (User, Role, etc.)
│   ├── ui           → Shared React components (Buttons, Inputs, etc.)
│   └── validation   → Shared Zod validation schemas
```

The web apps talk only to `apps/api` — none of them touch Postgres directly.

## Getting Started

1. Ensure you have `pnpm` installed.
2. Install dependencies at the root:
   ```bash
   pnpm install
   ```
3. Set up the API environment:
   ```bash
   cd apps/api
   cp .env.example .env
   ```
   *Edit `.env` to include your `DATABASE_URL` (e.g., `postgresql://postgres:password@localhost:5433/blih_dev?schema=public`) and a `JWT_SECRET`.*
4. Start the database (if using the provided Docker compose):
   ```bash
   # Make sure you have a docker-compose.yml available for postgres
   docker compose up -d 
   ```
5. Migrate and generate the Prisma client:
   ```bash
   cd apps/api
   npm run prisma:migrate
   npm run prisma:generate
   ```
6. Start the API server:
   ```bash
   # From apps/api
   npm run dev
   # Or from the root
   pnpm dev:api
   ```
7. Set up and start the frontend apps:
   In each frontend app (`apps/skills-web`, `apps/talent-web`, `apps/auth-web`), copy the `.env.local.example` to `.env.local`, then start them:
   ```bash
   # From root
   pnpm dev:skills
   pnpm dev:talent
   pnpm dev:auth
   ```
   (Ports are 3001, 3002, and 3003 respectively)

## Shared Packages

Any changes you make inside the `packages/` directories are immediately available to the applications in `apps/` because they are linked via `pnpm` workspace references.

## Typechecking

You can verify types across the entire monorepo using Nx:
```bash
npx nx run-many --target=typecheck --all
```
