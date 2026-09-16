# Blih Ops — Monorepo Ecosystem

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.9-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-9.15-F69220?style=for-the-badge&logo=pnpm)](https://pnpm.io/)

Welcome to **Blih Ops** — a unified professional platform integrating interactive learning, verified talent discovery, employer subscriptions, and recruitment operations into a high-performance monorepo architecture.

---

## 🏗️ System Architecture & Services

```text
┌─────────────────────────────────────────────────────────────────┐
│                      Blih Ops Monorepo                          │
├────────────────────────────────┬────────────────────────────────┤
│           apps/web             │            apps/api            │
│       Next.js 16 Web App       │       Express 5 REST API       │
│     (Port 3000 | Turbopack)    │       (Port 4000 | OpenAPI)     │
└───────────────┬────────────────┴────────────────┬───────────────┘
                │                                 │
                │        Shared Packages          │
                ├─────────────────────────────────┤
                │  • @blih/types                  │
                │  • @blih/validation (Zod)       │
                │  • @blih/api-client             │
                └────────────────┬────────────────┘
                                 │
                        ┌────────▼────────┐
                        │   PostgreSQL    │
                        │  (Prisma ORM)   │
                        └─────────────────┘
```

### Core Services Summary

| Application / Workspace | Location | Description / Target Port |
| :--- | :--- | :--- |
| **Unified Web App** | [`apps/web`](./apps/web) | Next.js 16 frontend containing Auth, Skills, Talent, and Admin interfaces (`http://localhost:3000`) |
| **Backend Core API** | [`apps/api`](./apps/api) | Express.js API handling authentication, payments, courses, jobs, and PDF generation (`http://localhost:4000`) |
| **Interactive API Docs** | OpenAPI / Swagger | Live Swagger API documentation & testing sandbox (`http://localhost:4000/api/v1/docs`) |
| **Shared Types** | [`packages/types`](./packages/types) | Centralized TypeScript DTOs and entity definitions shared across frontend & backend |
| **Shared Validation** | [`packages/validation`](./packages/validation) | Unified Zod validation schemas for forms and API request payloads |
| **API Client** | [`packages/api-client`](./packages/api-client) | Type-safe HTTP client wrapper for consuming backend endpoints |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: `>= 22.0.0`
- **pnpm**: `>= 9.0.0` (Install globally via `npm i -g pnpm`)
- **PostgreSQL**: Local running instance or remote connection URL

### 1. Clone & Install Dependencies
Run the installation command from the **workspace root directory**:

```bash
# Clone the repository
git clone <repository-url>
cd blih-ops

# Install dependencies across all monorepo workspaces at once
pnpm install
```

### 2. Configure Environment Variables

#### Backend API Config ([`apps/api/.env`](./apps/api/.env.example))
```bash
cp apps/api/.env.example apps/api/.env
```
Edit `apps/api/.env` and configure your database connection string and secret keys:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/blih_dev?schema=public"
JWT_SECRET="your-development-jwt-secret-key"
PORT=4000
CORS_ORIGINS="http://localhost:3000"
```

#### Frontend Web Config ([`apps/web/.env.local`](./apps/web/.env.local))
Create `apps/web/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Initialize & Seed Database
Ensure PostgreSQL is running, then apply migrations and seed initial data:

```bash
# Generate Prisma client & sync schema with PostgreSQL
pnpm prisma:migrate

# Seed sample course catalog, admin accounts, and test data
pnpm seed
```

### 4. Start Local Development
Launch both the Web Frontend (Port 3000 with Turbopack) and API Server (Port 4000) simultaneously:

```bash
pnpm dev
```

Visit **`http://localhost:3000`** in your browser.

---

## 🛠️ CLI Script Reference

Run these commands from the workspace root:

| Command | Action |
| :--- | :--- |
| `pnpm dev` | Starts both Web (`:3000`) and API (`:4000`) dev servers concurrently |
| `pnpm dev:web` | Starts Next.js Web server only with Turbopack (`:3000`) |
| `pnpm dev:api` | Starts Express API server with auto-reload (`:4000`) |
| `pnpm build` | Compiles production bundles for all applications |
| `pnpm start` | Launches production servers |
| `pnpm typecheck` | Runs TypeScript compilation verification across all workspaces (`tsc --noEmit`) |
| `pnpm lint` | Runs ESLint validation across codebases |
| `pnpm prisma:migrate` | Runs Prisma database migrations (`prisma db push`) |
| `pnpm prisma:generate` | Regenerates Prisma TypeScript client |
| `pnpm seed` | Seeds database with initial system & course data |

---

## 📂 Repository Structure

```text
blih-ops/
├── apps/
│   ├── api/                    # Express.js REST API service
│   └── web/                    # Next.js 16 Web App (App Router)
├── packages/
│   ├── api-client/             # Type-safe API fetching client
│   ├── types/                  # Shared TypeScript interfaces
│   └── validation/             # Shared Zod validation schemas
├── pnpm-workspace.yaml         # Workspace root definition
├── package.json                # Root package configuration
└── tsconfig.base.json          # Global TypeScript configuration
```

---

## 📄 License & Ownership

© 2026 Blih Ops. All rights reserved.
