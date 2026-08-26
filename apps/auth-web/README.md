# blih-auth-web

The central authentication interface for Blih. Handles sign up, login, logout, email verification, password reset, role selection, and redirecting users back to the correct product (Skills Web or Talent Web) after auth.

No course/job/talent/company/payment business logic belongs here.

## Setup
```bash
npm install
cp .env.local.example .env.local
npm run dev   # http://localhost:3003
```
