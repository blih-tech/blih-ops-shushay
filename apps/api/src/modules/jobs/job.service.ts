import prisma from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import { CreateJobInput, UpdateJobInput, JobQueryInput } from "./job.schemas";
import { JobStatus } from "@prisma/client";

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getCompanyProfileByUserId(userId: string) {
  const profile = await prisma.companyProfile.findUnique({ where: { userId } });
  if (!profile) throw new AppError(404, "Company profile not found.");
  return profile;
}

// ─── Company-scoped operations ────────────────────────────────────────────────

export async function createJob(userId: string, data: CreateJobInput) {
  const companyProfile = await getCompanyProfileByUserId(userId);
  return prisma.job.create({
    data: {
      companyProfileId: companyProfile.id,
      title: data.title,
      description: data.description,
      requiredSkills: data.requiredSkills,
      englishLevel: data.englishLevel ?? null,
      salaryMin: data.salaryMin ?? null,
      salaryMax: data.salaryMax ?? null,
      salaryCurrency: data.salaryCurrency,
      salaryDisplay: data.salaryDisplay ?? null,
      employmentType: data.employmentType,
      workingHours: data.workingHours ?? null,
      timezone: data.timezone ?? null,
      countryRestrictions: data.countryRestrictions,
      experienceLevel: data.experienceLevel,
      applicationDeadline: data.applicationDeadline ?? null,
    },
    include: {
      companyProfile: { select: { companyName: true, logoUrl: true } },
    },
  });
}

export async function getCompanyJobs(userId: string, query: JobQueryInput) {
  const companyProfile = await getCompanyProfileByUserId(userId);
  const {
    page,
    limit,
    search,
    skills,
    englishLevel,
    employmentType,
    experienceLevel,
    status,
  } = query;
  const skip = (page - 1) * limit;

  const where: any = { companyProfileId: companyProfile.id };
  if (status) where.status = status;
  if (employmentType) where.employmentType = employmentType;
  if (experienceLevel) where.experienceLevel = experienceLevel;
  if (englishLevel) where.englishLevel = englishLevel;
  if (skills) {
    const skillList = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (skillList.length) where.requiredSkills = { hasSome: skillList };
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { applications: true } },
      },
    }),
    prisma.job.count({ where }),
  ]);

  return { jobs, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getJobById(jobId: string, userId?: string) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      companyProfile: {
        select: {
          companyName: true,
          description: true,
          logoUrl: true,
          website: true,
          country: true,
          city: true,
        },
      },
      _count: { select: { applications: true } },
    },
  });
  if (!job) throw new AppError(404, "Job not found.");

  let hasApplied = false;
  if (userId) {
    const talentProfile = await prisma.talentProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (talentProfile) {
      const app = await prisma.jobApplication.findUnique({
        where: {
          jobId_talentProfileId: {
            jobId,
            talentProfileId: talentProfile.id,
          },
        },
      });
      hasApplied = !!app;
    }
  }

  return { ...job, hasApplied };
}

export async function updateJob(
  jobId: string,
  userId: string,
  data: UpdateJobInput,
) {
  const companyProfile = await getCompanyProfileByUserId(userId);
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new AppError(404, "Job not found.");
  if (job.companyProfileId !== companyProfile.id) {
    throw new AppError(403, "You do not have permission to edit this job.");
  }
  if (job.status === JobStatus.CLOSED) {
    throw new AppError(400, "Closed jobs cannot be edited.");
  }

  return prisma.job.update({
    where: { id: jobId },
    data: {
      title: data.title,
      description: data.description,
      requiredSkills: data.requiredSkills,
      englishLevel: data.englishLevel ?? undefined,
      salaryMin: data.salaryMin ?? undefined,
      salaryMax: data.salaryMax ?? undefined,
      salaryCurrency: data.salaryCurrency,
      salaryDisplay: data.salaryDisplay ?? undefined,
      employmentType: data.employmentType,
      workingHours: data.workingHours ?? undefined,
      timezone: data.timezone ?? undefined,
      countryRestrictions: data.countryRestrictions,
      experienceLevel: data.experienceLevel,
      applicationDeadline: data.applicationDeadline ?? undefined,
    },
    include: {
      companyProfile: { select: { companyName: true, logoUrl: true } },
    },
  });
}

export async function closeJob(jobId: string, userId: string) {
  const companyProfile = await getCompanyProfileByUserId(userId);
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new AppError(404, "Job not found.");
  if (job.companyProfileId !== companyProfile.id) {
    throw new AppError(403, "You do not have permission to close this job.");
  }
  if (job.status === JobStatus.CLOSED) {
    throw new AppError(400, "Job is already closed.");
  }
  return prisma.job.update({
    where: { id: jobId },
    data: { status: JobStatus.CLOSED },
  });
}

export async function reopenJob(jobId: string, userId: string) {
  const companyProfile = await getCompanyProfileByUserId(userId);
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new AppError(404, "Job not found.");
  if (job.companyProfileId !== companyProfile.id) {
    throw new AppError(403, "You do not have permission to reopen this job.");
  }
  if (job.status !== JobStatus.CLOSED) {
    throw new AppError(400, "Only closed jobs can be reopened.");
  }
  const newDeadline = new Date();
  newDeadline.setDate(newDeadline.getDate() + 30);
  return prisma.job.update({
    where: { id: jobId },
    data: { status: JobStatus.ACTIVE, applicationDeadline: newDeadline },
    include: {
      companyProfile: { select: { companyName: true, logoUrl: true } },
    },
  });
}


// ─── Public job listing ───────────────────────────────────────────────────────

export async function listActiveJobs(query: JobQueryInput, userId?: string) {
  const {
    page,
    limit,
    search,
    skills,
    englishLevel,
    employmentType,
    experienceLevel,
  } = query;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (employmentType) where.employmentType = employmentType;
  if (experienceLevel) where.experienceLevel = experienceLevel;
  if (englishLevel) where.englishLevel = englishLevel;
  if (skills) {
    const skillList = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (skillList.length) where.requiredSkills = { hasSome: skillList };
  }
  if (search) {
    where.AND = [
      {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { requiredSkills: { hasSome: [search] } },
        ],
      },
    ];
  }

  const [allMatchingJobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      include: {
        companyProfile: {
          select: {
            companyName: true,
            logoUrl: true,
            country: true,
            city: true,
          },
        },
        _count: { select: { applications: true } },
      },
    }),
    prisma.job.count({ where }),
  ]);

  const now = new Date();
  const isJobActive = (j: any) =>
    j.status === JobStatus.ACTIVE &&
    (!j.applicationDeadline || new Date(j.applicationDeadline) >= now);

  const sortedJobs = allMatchingJobs.sort((a, b) => {
    const aActive = isJobActive(a);
    const bActive = isJobActive(b);
    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const jobs = sortedJobs.slice(skip, skip + limit);

  let appliedJobIds = new Set<string>();
  if (userId) {
    const talentProfile = await prisma.talentProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (talentProfile) {
      const apps = await prisma.jobApplication.findMany({
        where: {
          talentProfileId: talentProfile.id,
          jobId: { in: jobs.map((j) => j.id) },
        },
        select: { jobId: true },
      });
      appliedJobIds = new Set(apps.map((a) => a.jobId));
    }
  }

  const enrichedJobs = jobs.map((job) => ({
    ...job,
    hasApplied: appliedJobIds.has(job.id),
  }));

  return {
    jobs: enrichedJobs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
