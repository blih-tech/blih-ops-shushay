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

- `auth/` — Authentication, sessions, tokens, Google OAuth, email verification, password reset.
- `users/` — User accounts and global roles (`TALENT`, `COMPANY`, `ADMIN`).
- `talents/` — Talent profile management, skills, experience, CV uploads, profile completion score engine.
- `companies/` — Company profile management, hiring credentials, active subscription gating.
- `courses/` — Course catalog CRUD, lesson sequences, video resources, document attachments (Cloudinary).
- `payments/` — **Phase 4: Blih Skills Payment & Access Integration** (Chapa payment checkout, server-side verification, idempotent webhook handling, permanent entitlement grants).
- `subscriptions/` — Company subscription management and plan gating.
- `notifications/` — In-app notification queue and email confirmation dispatchers.

## Key Payment Endpoints (Phase 4)

- `GET /api/v1/payments/skills/access-status` — Returns current user's entitlement status and payment history.
- `POST /api/v1/payments/skills/initialize` — Creates a 1,000 ETB hosted payment checkout session with Chapa.
- `GET /api/v1/payments/verify/:txRef` — Idempotent server-side payment verification and entitlement granting.
- `POST /api/v1/payments/chapa/webhook` — Asynchronous Chapa webhook event processor.

## Testing Sandbox Credentials (Chapa Test Mode)

- **Test Mobile Money Numbers**: `0900123456`, `0900112233`, `0900881111`
- **Test Card Number**: `4111 1111 1111 1111` (Expiry: `12/28`, CVV: `123`)
