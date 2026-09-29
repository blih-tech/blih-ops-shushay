# ── Stage 1: Dependencies ──────────────────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /repo

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace manifests (enables pnpm workspace filtering)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY tsconfig.base.json ./

# Copy package manifests for all workspace members
COPY apps/api/package.json ./apps/api/
COPY packages/validation/package.json ./packages/validation/
COPY packages/types/package.json ./packages/types/

# Install prod dependencies only for the API
RUN pnpm install --frozen-lockfile --filter @blih/api... --prod

# ── Stage 2: Build ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /repo

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY tsconfig.base.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/validation/package.json ./packages/validation/
COPY packages/types/package.json ./packages/types/

# Install ALL deps (including dev) for the build step
RUN pnpm install --frozen-lockfile --filter @blih/api...

# Copy source code
COPY apps/api ./apps/api
COPY packages ./packages

# Generate Prisma client
RUN pnpm --filter @blih/api exec prisma generate

# Compile TypeScript
RUN pnpm --filter @blih/api build

# ── Stage 3: Production Image ──────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

# Security: run as non-root
RUN addgroup --system --gid 1001 blih \
 && adduser --system --uid 1001 blih

# Copy prod node_modules from deps stage
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/api/node_modules ./apps/api/node_modules

# Copy compiled output from builder
COPY --from=builder /repo/apps/api/dist ./dist
COPY --from=builder /repo/apps/api/prisma ./prisma

# Copy generated Prisma client (within dist or node_modules)
COPY --from=builder /repo/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /repo/node_modules/@prisma ./node_modules/@prisma

USER blih

EXPOSE 4000

ENV NODE_ENV=production

# Run migrations then start the server
CMD ["sh", "-c", "node node_modules/.bin/prisma migrate deploy --schema=./prisma/schema.prisma && node dist/server.js"]
