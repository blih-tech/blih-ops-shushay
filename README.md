# Blih Ecosystem

[![Nx](https://img.shields.io/badge/Nx-Monorepo-blue.svg?logo=nx)](https://nx.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.0-black.svg?logo=next.js)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-API-green.svg?logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-1B222D.svg?logo=prisma)](https://www.prisma.io/)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-6BA539.svg?logo=swagger)](http://localhost:4000/api/v1/docs)

Welcome to the **Blih Ecosystem** — a connected professional growth platform designed around a clear value loop: **Learn → Practice → Prove → Build Reputation → Get Hired**.

The platform provides a modern editorial interface connecting ambitious learners, verified talent, and hiring organizations through three distinct web applications powered by a single high-performance backend API.

---

## 🏗 System Architecture & Applications

```text
                               ┌─────────────────┐
                               │    Auth Web     │
                               │  (Port 3003)    │
                               └────────┬────────┘
                                        │ (JWT / Cookies)
 ┌─────────────────┐           ┌────────▼────────┐           ┌─────────────────┐
 │   Skills Web    │───────────►    Core API     ◄───────────│   Talent Web    │
 │   (Port 3001)   │           │  (Port 4000)    │           │   (Port 3002)   │
 └─────────────────┘           └────────┬────────┘           └─────────────────┘
                                        │ (Prisma ORM)
                               ┌────────▼────────┐
                               │   PostgreSQL    │
                               │  (Port 5432)    │
                               └─────────────────┘
```

| Application | URL / Port | Role & Key Functionality |
| :--- | :--- | :--- |
| **Auth Web** | `http://localhost:3003` | Centralized identity provider, Google OAuth 2.0, login/registration, password reset, and session management. |
| **Skills Web** | `http://localhost:3001` | Course catalog, interactive learning player (video, reading, quizzes, exercises), Chapa payment checkout, and digital certificates. |
| **Talent Web** | `http://localhost:3002` | Verified talent directory, candidate profile management, CV attachments, and company candidate inspection. |
| **Core API** | `http://localhost:4000` | Centralized REST API server, business logic, PostgreSQL database owner, and Chapa payment integration. |
| **Swagger UI** | `http://localhost:4000/api/v1/docs` | Interactive OpenAPI 3.0 API documentation and live endpoint testing. |

---

## ✨ Core Ecosystem Features

### 🔐 1. Centralized Identity & Security
- **Unified Auth**: Shared authentication flow across all ecosystem frontends using HTTP-only JWT cookies.
- **Google OAuth 2.0 & Email Auth**: Social sign-in combined with email verification and password recovery.
- **Global Role-Based Access**: Granular permissions for `TALENT`, `COMPANY`, and `ADMIN` roles.

### 📚 2. Blih Skills & Learning Platform
- **Comprehensive Course Catalog**: Public exploration of curriculum modules, learning outcomes, and course structure.
- **Interactive Player**: Multi-tab course workspace featuring video streams, reading material, quizzes, and coding exercises.
- **Permanent Skills Access**: One-time **1,000 ETB** payment granting lifetime access to all current and future Blih Skills tracks.
- **Digital Verified Credentials**: Automated certificate generation and verification records upon course completion.
- **Course Administration**: Full CRUD workflow for course creation, module sequencing, and Cloudinary media management.

### 💼 3. Blih Talent Network & Directory
- **Verified Candidate Profiles**: Rich talent profiles displaying verified competencies, work history, education, and CV documents.
- **Profile Completion Engine**: Dynamic completion score meter with an actionable missing fields checklist.
- **Company Recruitment Access**: Company subscription plan gating for talent search and candidate profile inspection.

### 💳 4. Ethiopian Payment Infrastructure (Chapa Gateway)
- **Chapa Gateway Integration**: Native payment checkout supporting local Ethiopian debit cards and mobile money.
- **Server-Side Verification**: Idempotent transaction verification, currency validation (`ETB`), and entitlement grants.
- **Glassmorphism Return UI**: Responsive payment return screen (`/checkout/return`) featuring receipt breakdowns, capability checklists, and failure recovery.

---

## 🛠 Technology Stack

- **Monorepo Orchestration**: Nx Monorepo with pnpm workspaces
- **Frontend Framework**: Next.js 15 (App Router), React 19, Vanilla Tailwind CSS, Lucide Icons
- **Backend API**: Express.js, Node.js, Swagger JSDoc, OpenAPI 3.0
- **Database & Persistence**: PostgreSQL, Prisma ORM 7, Cloudinary API
- **Authentication**: JWT (JSON Web Tokens), Google Auth Library, bcrypt
- **Validation**: Zod schema validation across API and client packages

---

## 📁 Repository Structure

```text
blih-ops/
├── apps/
│   ├── api/            # Express.js REST API server & Swagger documentation
│   ├── auth-web/       # Identity provider & authentication frontend (Port 3003)
│   ├── skills-web/     # Blih Skills learning frontend (Port 3001)
│   └── talent-web/     # Blih Talent professional directory frontend (Port 3002)
│
├── packages/
│   ├── api-client/     # Shared SDK, API fetcher, and React query/state hooks
│   ├── types/          # Shared TypeScript interfaces (User, Course, Talent, etc.)
│   ├── ui/             # Shared React UI component library (Buttons, Modals, Cards)
│   └── validation/     # Shared Zod validation schemas
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **pnpm**: `v9.0.0` or higher
- **PostgreSQL**: `v14` or higher (Running locally or via Docker)

### Installation & Environment Setup

1. **Clone the repository and install dependencies:**
   ```bash
   git clone https://github.com/your-org/blih-ops.git
   cd blih-ops
   pnpm install
   ```

2. **Configure Environment Variables:**
   Copy `.env.example` in `apps/api`:
   ```bash
   cp apps/api/.env.example apps/api/.env
   ```
   _Set `DATABASE_URL` (`postgresql://postgres:postgres@localhost:5432/blih_dev?schema=public`) and `CHAPA_SECRET_KEY` (`CHASECK_TEST-...`)._

3. **Database Migration:**
   ```bash
   cd apps/api
   npx prisma migrate dev
   ```

### Running the Ecosystem

Launch all applications in separate terminal windows:

```bash
# Start Backend API & Swagger Docs (Port 4000)
pnpm dev:api

# Start Web Applications
pnpm dev:auth     # Auth Web (Port 3003)
pnpm dev:skills   # Skills Web (Port 3001)
pnpm dev:talent   # Talent Web (Port 3002)
```

---

## 🧪 Chapa Sandbox Test Credentials

When testing payment flows in local development mode (`CHASECK_TEST-` keys):

- **Test Mobile Money Numbers**: `0900123456` | `0900112233` | `0900881111`
- **Test Card Credentials**: Number `4111 1111 1111 1111`, Expiry `12/28`, CVV `123`

---

## 📄 License & Attribution

© 2026 Blih Ecosystem. All rights reserved.
