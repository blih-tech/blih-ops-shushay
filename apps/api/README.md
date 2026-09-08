# blih-api

The single backend for Skills Web, Talent Web, and Auth Web. Owns the database — web apps communicate via REST API and never touch Postgres directly.

## Interactive API Documentation (Swagger)

When running locally, interactive OpenAPI / Swagger UI documentation is available at:
👉 **[http://localhost:4000/api/v1/docs](http://localhost:4000/api/v1/docs)**

## Setup

```bash
pnpm install
cp .env.example .env       # edit DATABASE_URL, JWT_SECRET, CHAPA_SECRET_KEY
docker compose up -d       # starts local Postgres on :5432
npx prisma migrate dev     # applies database migrations
pnpm dev:api               # http://localhost:4000/api/v1/health
```

## Modular Domain Architecture (`src/modules/`)

- `auth/` — **Phase 1**: Authentication, sessions, tokens, Google OAuth, email verification, password reset.
- `users/` — User accounts and global roles (`TALENT`, `COMPANY`, `ADMIN`).
- `talents/` — **Phase 2 & 8**: Talent profile management, skills, experience, CV uploads, profile completion engine, talent search directory.
- `companies/` — Company profile management, contact details.
- `company-subscriptions/` — **Phase 7**: Company subscriptions, plan initialization (Monthly/Yearly), Chapa checkout, active status gating.
- `courses/` — **Phase 3**: Course catalog CRUD, lesson sequences, video resources, document attachments (Cloudinary).
- `payments/` — **Phase 4**: Blih Skills payment (Chapa payment checkout, server-side verification, idempotent webhook handling, permanent entitlement grants).
- `learning/` — **Phase 5**: Lesson progress tracking, quiz submissions, assignment uploads.
- `certificates/` — **Phase 6**: Course completion certificate generation, PDF rendering, verification.
- `jobs/` — **Phase 8**: Job posting creation, editing, closing, active job search, deadline enforcement.
- `applications/` — **Phase 9**: Apply-to-job flow, duplicate application prevention, application listing (talent/company), status transition (`Applied -> Reviewing`).
- `notifications/` — **Phase 9**: In-app internal notifications and resilient email dispatch service.
- `__tests__/` — **Phase 10**: Testing & Hardening (Health check `/api/v1/health`, role authorization matrix, payment gateway resilience, cross-tenant security).

## Key API Endpoints (Phases 0–10)

- `GET /api/v1/health` — **Phase 0 & 10**: Health check and database connection status.
- `POST /api/v1/payments/skills/initialize` — **Phase 4**: Initialize 1,000 ETB Blih Skills payment.
- `GET /api/v1/payments/verify/:txRef` — **Phase 4 & 7**: Idempotent server-side payment verification for Skills & Subscriptions.
- `POST /api/v1/company/subscription/initialize` — **Phase 7**: Initialize 2,000 ETB/mo or 10,000 ETB/yr company subscription.
- `GET /api/v1/jobs` & `POST /api/v1/jobs` — **Phase 8**: Search active jobs and post new company jobs.
- `POST /api/v1/applications` & `PATCH /api/v1/applications/:id/status` — **Phase 9**: Apply to active jobs and update status `Applied -> Reviewing`.
- `GET /api/v1/notifications` & `PATCH /api/v1/notifications/:id/read` — **Phase 9**: List in-app notifications and mark as read.

## Testing Sandbox Credentials (Chapa Test Mode)

- **Test Mobile Money Numbers**: `0900123456`, `0900112233`, `0900881111`
- **Test Card Number**: `4111 1111 1111 1111` (Expiry: `12/28`, CVV: `123`)

