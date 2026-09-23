-- Blih Skills — Per-course enrollment migration
-- Replaces the global SkillsEntitlement model with CourseEnrollment (per-course access).
-- Also adds: price to courses, company_subscriptions, certificates, system_settings tables,
--            unique constraints on users.verificationToken / resetToken.

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'EXPIRED');

-- AlterEnum: rename SKILLS_ACCESS -> COURSE_ACCESS
BEGIN;
CREATE TYPE "PaymentType_new" AS ENUM ('COURSE_ACCESS', 'COMPANY_SUBSCRIPTION');
ALTER TABLE "payment_transactions" ALTER COLUMN "paymentType" TYPE "PaymentType_new" USING ("paymentType"::text::"PaymentType_new");
ALTER TYPE "PaymentType" RENAME TO "PaymentType_old";
ALTER TYPE "PaymentType_new" RENAME TO "PaymentType";
DROP TYPE "public"."PaymentType_old";
COMMIT;

-- DropForeignKey (skills_entitlements)
ALTER TABLE "skills_entitlements" DROP CONSTRAINT IF EXISTS "skills_entitlements_paymentId_fkey";
ALTER TABLE "skills_entitlements" DROP CONSTRAINT IF EXISTS "skills_entitlements_userId_fkey";

-- AlterTable: add price to courses
ALTER TABLE "courses" ADD COLUMN "price" DOUBLE PRECISION NOT NULL DEFAULT 1000;

-- DropTable: remove global entitlement table
DROP TABLE IF EXISTS "skills_entitlements";

-- CreateTable: company_subscriptions
CREATE TABLE "company_subscriptions" (
    "id" TEXT NOT NULL,
    "companyProfileId" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ETB',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "paymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable: course_enrollments (replaces skills_entitlements)
CREATE TABLE "course_enrollments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "paymentId" TEXT,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable: certificates
CREATE TABLE "certificates" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "certificateNumber" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pdfUrl" TEXT,
    "pdfPublicId" TEXT,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable: system_settings
CREATE TABLE "system_settings" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "company_subscriptions_companyProfileId_key" ON "company_subscriptions"("companyProfileId");
CREATE UNIQUE INDEX "company_subscriptions_paymentId_key" ON "company_subscriptions"("paymentId");

CREATE UNIQUE INDEX "course_enrollments_paymentId_key" ON "course_enrollments"("paymentId");
CREATE INDEX "course_enrollments_userId_idx" ON "course_enrollments"("userId");
CREATE INDEX "course_enrollments_courseId_idx" ON "course_enrollments"("courseId");
CREATE UNIQUE INDEX "course_enrollments_userId_courseId_key" ON "course_enrollments"("userId", "courseId");

CREATE UNIQUE INDEX "certificates_certificateNumber_key" ON "certificates"("certificateNumber");
CREATE INDEX "certificates_userId_idx" ON "certificates"("userId");
CREATE INDEX "certificates_courseId_idx" ON "certificates"("courseId");
CREATE INDEX "certificates_certificateNumber_idx" ON "certificates"("certificateNumber");
CREATE UNIQUE INDEX "certificates_userId_courseId_key" ON "certificates"("userId", "courseId");

CREATE UNIQUE INDEX IF NOT EXISTS "users_verificationToken_key" ON "users"("verificationToken");
CREATE UNIQUE INDEX IF NOT EXISTS "users_resetToken_key" ON "users"("resetToken");

-- AddForeignKey
ALTER TABLE "company_subscriptions" ADD CONSTRAINT "company_subscriptions_companyProfileId_fkey" FOREIGN KEY ("companyProfileId") REFERENCES "company_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "company_subscriptions" ADD CONSTRAINT "company_subscriptions_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payment_transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payment_transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "certificates" ADD CONSTRAINT "certificates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
