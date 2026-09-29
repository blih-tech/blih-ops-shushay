# ── Stage 1: Dependencies ──────────────────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /repo

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY tsconfig.base.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/api-client/package.json ./packages/api-client/
COPY packages/types/package.json ./packages/types/
COPY packages/validation/package.json ./packages/validation/

RUN pnpm install --frozen-lockfile --filter @blih/web...

# ── Stage 2: Build ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /repo

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY tsconfig.base.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/api-client/package.json ./packages/api-client/
COPY packages/types/package.json ./packages/types/
COPY packages/validation/package.json ./packages/validation/

COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/web/node_modules ./apps/web/node_modules

COPY apps/web ./apps/web
COPY packages ./packages

# Build Next.js app with standalone output for minimal image size
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @blih/web build

# ── Stage 3: Production Image ──────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 blih \
 && adduser --system --uid 1001 blih

# Copy Next.js standalone build (requires output: 'standalone' in next.config.js)
COPY --from=builder --chown=blih:blih /repo/apps/web/.next/standalone ./
COPY --from=builder --chown=blih:blih /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=blih:blih /repo/apps/web/public ./apps/web/public

USER blih

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
