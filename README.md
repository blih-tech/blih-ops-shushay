# Blih Ecosystem

[![Nx](https://img.shields.io/badge/Nx-Monorepo-blue.svg?logo=nx)](https://nx.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.0-black.svg?logo=next.js)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-API-green.svg?logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-1B222D.svg?logo=prisma)](https://www.prisma.io/)

Welcome to the **Blih Ecosystem** — a unified platform connecting learners, companies, and talent. This repository contains the complete frontend and backend infrastructure, structured as a modern Nx Monorepo to facilitate seamless code sharing, rapid development, and independent deployments.

---

## 🏗 Architecture

The Blih platform operates through three distinct user-facing web applications powered by a centralized backend API:

- **Auth Web** (`auth.blih.com`): Centralized authentication and account management.
- **Skills Web** (`skills.blih.com`): The learning portal for students and professionals to take courses and earn certificates.
- **Talent Web** (`talent.blih.com`): The professional networking hub for job seekers and companies looking to hire top talent.
- **Core API** (`api.blih.com`): The single source of truth handling business logic, database transactions, and data persistence.

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL, Prisma ORM
- **Tooling**: pnpm, Nx (Build System), TypeScript, Zod

---

## 📁 Repository Structure

```text
blih-ops/
├── apps/
│   ├── api/            # Express.js REST API
│   ├── auth-web/       # Authentication Next.js frontend
│   ├── skills-web/     # Skills/Learner Next.js frontend
│   └── talent-web/     # Talent/Company Next.js frontend
│
├── packages/
│   ├── api-client/     # Shared data fetching logic and React hooks
│   ├── types/          # Shared TypeScript definitions (User, Role, etc.)
│   ├── ui/             # Shared React component library
│   └── validation/     # Shared Zod validation schemas
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [pnpm](https://pnpm.io/) (v9 or higher)
- [PostgreSQL](https://www.postgresql.org/) (Running locally or via Docker)

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   git clone https://github.com/your-org/blih-ops.git
   cd blih-ops
   pnpm install
   ```

2. **Configure Environment Variables:**
   For the API backend:
   ```bash
   cd apps/api
   cp .env.example .env
   ```
   *Update your `.env` file with your local PostgreSQL `DATABASE_URL` (e.g., `postgresql://postgres:postgres@localhost:5433/blih_dev?schema=public`).*

   For the frontend apps (`apps/auth-web`, `apps/skills-web`, `apps/talent-web`), duplicate their `.env.local.example` files to `.env.local`.

3. **Database Setup:**
   Initialize your Prisma schema and run migrations against your local database:
   ```bash
   cd apps/api
   npm run prisma:generate
   npm run prisma:migrate
   ```

### Running the Ecosystem

You can launch the applications directly from the workspace root. Open separate terminal tabs for each service:

```bash
# Start the Backend API (Port 4000)
pnpm dev:api

# Start the Frontend Applications
pnpm dev:auth     # Port 3003
pnpm dev:skills   # Port 3001
pnpm dev:talent   # Port 3002
```

---

## ✅ Development Scripts

This monorepo utilizes Nx to orchestrate tasks across all applications and shared packages efficiently.

- **Typechecking across all apps:**
  ```bash
  pnpm nx run-many -t typecheck
  ```
- **Building all applications:**
  ```bash
  pnpm nx run-many -t build
  ```
- **Linting:**
  ```bash
  pnpm nx run-many -t lint
  ```

---

## 🤝 Contributing

When contributing to this repository, please ensure that your code adheres to the existing architectural patterns. 
- UI components intended for reuse across multiple platforms should be placed in `packages/ui`.
- Type definitions and validation schemas shared between the frontend and backend should be updated in `packages/types` and `packages/validation`.

---

© 2026 Blih Ecosystem. All rights reserved.
