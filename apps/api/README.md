# Blih Core API Service (`@blih/api`)

Centralized REST API backend service for the **Blih Ops Ecosystem**, built with **Express 5**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

---

## 📖 Interactive OpenAPI / Swagger Documentation

Interactive OpenAPI 3.0 documentation is served live at runtime:
👉 **`http://localhost:4000/api/v1/docs`**

---

## ⚡ Quick Setup

### 1. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your database connection string and secret keys are configured:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/blih_dev?schema=public"
JWT_SECRET="your-development-jwt-secret-key"
PORT=4000
CORS_ORIGINS="http://localhost:3000"
```

### 2. Database Migration & Seed
Run database migrations and seed initial courses and admin data:
```bash
# Push schema to PostgreSQL
pnpm prisma:migrate

# Seed database
pnpm seed
```

### 3. Run API Development Server
```bash
# From workspace root:
pnpm dev:api

# Health Check Endpoint:
# http://localhost:4000/api/v1/health
```

---

## 🧱 Modular Domain Architecture (`src/modules/`)

```text
src/
├── config/                     # Environment & runtime configurations
├── middleware/                 # Auth, role-guards, CORS, error handling
├── modules/
│   ├── auth/                   # JWT auth, Google OAuth, password reset
│   ├── users/                  # User accounts & role permissions (TALENT, COMPANY, ADMIN)
│   ├── talents/                # Talent profiles, skills, CV uploads, search engine
│   ├── companies/              # Recruiter profiles & company verification
│   ├── company-subscriptions/  # Chapa subscription gating & tier management
│   ├── courses/                # Course catalog CRUD, lesson sequences, attachments
│   ├── payments/               # Chapa checkout, server verification, webhooks
│   ├── learning/               # Lesson progress, quiz submissions, assignment scoring
│   ├── certificates/           # Automated certificate generation & PDFKit rendering
│   ├── jobs/                   # Job posting lifecycle & deadline enforcement
│   ├── applications/           # Job application tracking & pipeline transitions
│   └── notifications/          # In-app notifications & email dispatching
├── prisma/                     # Prisma schema, migrations, and seed script
└── server.ts                   # Express server bootstrap & route mounting
```

---

## 💳 Payment Gateway Testing Sandbox (Chapa Test Mode)

- **Test Mobile Money Numbers**: `0900123456`, `0900112233`, `0900881111`
- **Test Card Number**: `4111 1111 1111 1111` (Expiry: `12/28`, CVV: `123`)

---

## 🧪 Testing & Verification

```bash
# Run unit & integration tests with Jest
pnpm test

# Verify TypeScript compilation
pnpm typecheck
```
