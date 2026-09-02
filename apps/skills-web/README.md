# blih-skills-web

Next.js 15 frontend for **Blih Skills** — course catalog, interactive course player, payment checkout return flows, quizzes/assignments, certificates, and administration.

## Setup

```bash
pnpm install
cp .env.local.example .env.local
pnpm dev   # http://localhost:3001
```

Connects to `blih-api` via `src/lib/api.ts` — set `NEXT_PUBLIC_API_URL` to `http://localhost:4000/api/v1`.

## Key Features & User Flows

- **Course Catalog & Detail**: Browse courses, inspect curriculum overview, and view access status.
- **Phase 4 Chapa Payment Integration**: One-time **1,000 ETB** payment unlocking permanent access to all current and future Blih Skills courses.
- **Checkout Return Page (`/checkout/return`)**: Glassmorphism verification UI, receipt breakdown, unlocked capabilities checklist (`Full Course Access`, `Project Workspace`, `Assessment Path`, `Certificate Eligibility`), and failure recovery.
- **Protected Course Paywall (`/courses/:courseId/learn`)**: Gated access enforcing `SkillsEntitlement` check before granting access to video lectures and learning materials.
- **Modular Component Architecture**: All UI components strictly adhere to single responsibility principle (each file < 300 lines of code).

## Sandbox Testing Credentials (Chapa Test Mode)

- **Mobile Money Test Phone Numbers**: `0900123456`, `0900112233`, `0900881111`
- **Test Card Credentials**: Card `4111 1111 1111 1111`, Expiry `12/28`, CVV `123`
