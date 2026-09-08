-- Migration for Phase 9 Applications & Jobs tables

DO $$ BEGIN
    CREATE TYPE "public"."JobStatus" AS ENUM ('ACTIVE', 'CLOSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "public"."EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "public"."ExperienceLevel" AS ENUM ('ENTRY', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "public"."ApplicationStatus" AS ENUM ('SUBMITTED', 'IN_REVIEW', 'INTERVIEW_SCHEDULED', 'OFFER_EXTENDED', 'REJECTED', 'WITHDRAWN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "public"."jobs" (
    "id" TEXT NOT NULL,
    "companyProfileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requiredSkills" TEXT[],
    "englishLevel" "public"."EnglishLevel",
    "salaryMin" DOUBLE PRECISION,
    "salaryMax" DOUBLE PRECISION,
    "salaryCurrency" TEXT NOT NULL DEFAULT 'USD',
    "salaryDisplay" TEXT,
    "employmentType" "public"."EmploymentType" NOT NULL,
    "workingHours" TEXT,
    "timezone" TEXT,
    "countryRestrictions" TEXT[],
    "experienceLevel" "public"."ExperienceLevel" NOT NULL,
    "applicationDeadline" TIMESTAMP(3),
    "status" "public"."JobStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."job_applications" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "talentProfileId" TEXT NOT NULL,
    "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "coverLetter" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "jobs_companyProfileId_idx" ON "public"."jobs"("companyProfileId" ASC);
CREATE INDEX IF NOT EXISTS "jobs_status_idx" ON "public"."jobs"("status" ASC);
CREATE INDEX IF NOT EXISTS "jobs_createdAt_idx" ON "public"."jobs"("createdAt" ASC);

CREATE UNIQUE INDEX IF NOT EXISTS "job_applications_jobId_talentProfileId_key" ON "public"."job_applications"("jobId" ASC, "talentProfileId" ASC);
CREATE INDEX IF NOT EXISTS "job_applications_jobId_idx" ON "public"."job_applications"("jobId" ASC);
CREATE INDEX IF NOT EXISTS "job_applications_talentProfileId_idx" ON "public"."job_applications"("talentProfileId" ASC);

DO $$ BEGIN
    ALTER TABLE "public"."jobs" ADD CONSTRAINT "jobs_companyProfileId_fkey" FOREIGN KEY ("companyProfileId") REFERENCES "public"."company_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "public"."job_applications" ADD CONSTRAINT "job_applications_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "public"."job_applications" ADD CONSTRAINT "job_applications_talentProfileId_fkey" FOREIGN KEY ("talentProfileId") REFERENCES "public"."talent_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
