# Blih Web Application (`@blih/web`)

The frontend for the **Blih Ops Ecosystem**, built using **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **Lucide Icons**.

---

## ⚡ Features & App Modules

The web application is structured cleanly using Next.js App Router route groups:

- 🔐 **`(auth)` Route Group (`/login`, `/register`, `/forgot-password`)**: Identity, social OAuth callbacks, and token session management.
- 🎓 **`(skills)` Route Group (`/courses`, `/certificates`, `/checkout`)**: Interactive learning catalog, lesson video player, quiz engine, and certificate verification.
- 💼 **`(talent)` Route Group (`/profile`, `/jobs`, `/company`, `/applications`)**: Verified candidate profiles, job postings directory, talent directory, and company recruitment tools.
- 🛡️ **`(admin)` Route Group (`/admin`)**: Admin dashboard for user role management, course publishing, payment monitoring, and global platform oversight.

---

## 🚀 Development Setup

### 1. Prerequisites
Make sure dependencies have been installed from the workspace root:
```bash
pnpm install
```

### 2. Environment Variables
Create `.env.local` inside `apps/web`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Dev Server
Start the Next.js development server with **Turbopack** enabled:

```bash
# From workspace root:
pnpm dev:web

# Or directly inside apps/web:
pnpm dev
```

Visit **`http://localhost:3000`**.

---

## 🛠️ Project Structure

```text
apps/web/
├── src/
│   ├── app/                    # Next.js App Router (Route groups)
│   │   ├── (admin)/            # Admin management pages
│   │   ├── (auth)/             # Authentication pages
│   │   ├── (skills)/           # Learning marketplace & certificates
│   │   └── (talent)/           # Candidate profiles & recruiter portal
│   ├── components/             # Reusable UI components & layouts
│   │   ├── ui/                 # Core Design System components (Buttons, Inputs, Cards, Modals)
│   │   ├── layout/             # Header, Navbar, Footer components
│   │   ├── profile/            # Talent & profile forms
│   │   ├── company/            # Recruiter & job management cards
│   │   └── learn/              # Course video player & quiz components
│   ├── lib/                    # API client instances & utilities
│   ├── providers/              # React Context providers (AuthProvider)
│   └── types/                  # Local TypeScript type declarations
├── next.config.js              # Next.js configuration
├── postcss.config.js           # PostCSS & Tailwind CSS config
└── package.json
```

---

## 🧪 Verification & Building

```bash
# Type check TypeScript code
pnpm typecheck

# Lint codebase
pnpm lint

# Build production bundle
pnpm build
```
