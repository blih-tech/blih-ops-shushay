-- Phase 4 baseline migration.
-- This migration represents the full DB state as applied via prisma db push
-- through Phases 0–4. It is marked as applied without re-running.

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'SUCCESSFUL', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."PaymentType" AS ENUM ('SKILLS_ACCESS', 'COMPANY_SUBSCRIPTION');

-- AlterTable: users - add googleId
ALTER TABLE "public"."users" ADD COLUMN IF NOT EXISTS "googleId" TEXT;
ALTER TABLE "public"."users" ALTER COLUMN "passwordHash" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "users_googleId_key" ON "public"."users"("googleId" ASC);

-- AlterTable: company_profiles - add subscription fields
ALTER TABLE "public"."company_profiles" ADD COLUMN IF NOT EXISTS "subscriptionActive" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "public"."company_profiles" ADD COLUMN IF NOT EXISTS "subscriptionExpiresAt" TIMESTAMP(3);

-- CreateTable: payment_transactions
CREATE TABLE IF NOT EXISTS "public"."payment_transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "txRef" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ETB',
    "paymentType" "public"."PaymentType" NOT NULL,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "chapaRef" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "payment_transactions_txRef_key" ON "public"."payment_transactions"("txRef" ASC);
CREATE INDEX IF NOT EXISTS "payment_transactions_userId_idx" ON "public"."payment_transactions"("userId" ASC);
CREATE INDEX IF NOT EXISTS "payment_transactions_txRef_idx" ON "public"."payment_transactions"("txRef" ASC);
CREATE INDEX IF NOT EXISTS "payment_transactions_status_idx" ON "public"."payment_transactions"("status" ASC);

ALTER TABLE "public"."payment_transactions" ADD CONSTRAINT IF NOT EXISTS "payment_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: skills_entitlements
CREATE TABLE IF NOT EXISTS "public"."skills_entitlements" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paymentId" TEXT,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "skills_entitlements_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "skills_entitlements_userId_key" ON "public"."skills_entitlements"("userId" ASC);
CREATE UNIQUE INDEX IF NOT EXISTS "skills_entitlements_paymentId_key" ON "public"."skills_entitlements"("paymentId" ASC);

ALTER TABLE "public"."skills_entitlements" ADD CONSTRAINT IF NOT EXISTS "skills_entitlements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."skills_entitlements" ADD CONSTRAINT IF NOT EXISTS "skills_entitlements_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."payment_transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable: notifications
CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "notifications_userId_idx" ON "public"."notifications"("userId" ASC);

ALTER TABLE "public"."notifications" ADD CONSTRAINT IF NOT EXISTS "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
