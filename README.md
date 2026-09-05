# Blih Ecosystem

[![Nx](https://img.shields.io/badge/Nx-Monorepo-blue.svg?logo=nx)](https://nx.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black.svg?logo=next.js)](https://nextjs.org/)
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
| **Skills Web** | `http://localhost:3001` | Course catalog, interactive learning workspace (video, reading, quizzes, assignment uploads), payment checkout, and digital certificates. |
| **Talent Web** | `http://localhost:3002` | Verified talent directory, candidate profile management, verified credentials display, CV attachments, and recruiter search. |
| **Core API** | `http://localhost:4000` | Centralized REST API server, business logic, PostgreSQL database owner, and PDF certificate streaming. |
| **Swagger UI** | `http://localhost:4000/api/v1/docs` | Interactive OpenAPI 3.0 API documentation and live endpoint testing. |

---

## ✨ Core Ecosystem Features

### 🔐 1. Centralized Identity & Security (Phases 0–1)
- **Unified Auth**: Shared authentication flow across all ecosystem frontends using HTTP-only JWT cookies.
- **Google OAuth 2.0 & Email Auth**: Social sign-in combined with email verification and password recovery.
- **Global Role-Based Access**: Granular permissions for `TALENT`, `COMPANY`, and `ADMIN` roles.

### 📚 2. Blih Skills & Interactive Learning Engine (Phases 2 & 5)
- **Comprehensive Course Catalog**: Public exploration of curriculum modules, learning outcomes, and course structure.
- **Interactive Player**: Multi-tab course workspace featuring video streams, reading material, automated quizzes, and file/link assignment submissions.
- **Permanent Skills Entitlement**: One-time payment granting lifetime access to all Blih Skills tracks.
- **Real-Time Progress Tracking**: Granular lesson completion tracking with automatic course completion calculation.

### 📜 3. Certificates & Product Integration (Phase 6)
- **Automated Certificate Generation**: Unique certificate numbers (`BLIH-CERT-...`) auto-issued upon 100% course completion.
- **Vector PDF Generator & Downloads**: Direct A4 vector PDF certificate stream downloads powered by `pdfkit`.
- **Verified Talent Profile Display**: Talent Web profiles showcase earned Blih credentials, verified badges, and direct PDF download links for employers.
- **Responsive Certificate Canvas**: Fluid React certificate renderer with Blih logo vectors and verification pills.

### 💼 4. Blih Talent Network & Directory (Phase 3)
- **Verified Candidate Profiles**: Rich talent profiles displaying verified competencies, work history, education, and CV documents.
- **Profile Completion Engine**: Dynamic completion score meter with an actionable missing fields checklist.
- **Company Recruitment Access**: Company subscription plan gating for talent search and candidate profile inspection.

### 💳 5. Ethiopian Payment Infrastructure (Phase 4)
- **Chapa Gateway Integration**: Native payment checkout supporting local Ethiopian debit cards and mobile money.
- **Server-Side Verification**: Idempotent transaction verification, currency validation (`ETB`), and entitlement grants.

### 🏢 6. Company Subscriptions & Candidate Access Gating (Phase 7)
- **Tiered Company Plans**: Monthly (2,000 ETB) and Yearly (10,000 ETB) subscription options for hiring organizations.
- **Access Control Guards**: Strict server-side route guards enforcing active subscription requirements before companies can search talent profiles or view candidate contact info.
- **Dynamic Subscription Status**: Automated status resolution (`ACTIVE`, `INACTIVE`, `EXPIRED`, `CANCELLED`) with instant payment return verification.

---

## 🛠 Technology Stack

- **Monorepo Orchestration**: Nx Monorepo with pnpm workspaces
- **Frontend Framework**: Next.js 16 (App Router), React 19, Vanilla Tailwind CSS, Lucide Icons
- **Backend API**: Express.js, Node.js, Swagger JSDoc, OpenAPI 3.0, PDFKit
- **Database & Persistence**: PostgreSQL, Prisma ORM 7, Cloudinary API
- **Authentication**: JWT (JSON Web Tokens), Google Auth Library, bcrypt
- **Validation**: Zod schema validation across API and client packages

---

## 🚀 Running the Ecosystem Locally

### Monorepo Development (All Apps in Parallel)

```bash
# Run all dev servers in parallel (Ports 4000, 3001, 3002, 3003)
pnpm dev
```

### Production Build & Execution

```bash
# 1. Build all production bundles
pnpm build

# 2. Start all production servers in parallel
pnpm start
```

### Running Individual Services

```bash
pnpm dev:api      # Start API & Swagger Docs (Port 4000)
pnpm dev:skills   # Start Skills Web (Port 3001)
pnpm dev:talent   # Start Talent Web (Port 3002)
pnpm dev:auth     # Start Auth Web (Port 3003)
```

---

## 🧪 Database & Migration Commands

```bash
# Push Prisma schema to PostgreSQL
pnpm prisma:migrate

# Generate Prisma Client types
pnpm prisma:generate

# Seed initial course and user data
pnpm seed
```

---

## 📄 License & Attribution

© 2026 Blih Ecosystem. All rights reserved.
