import prisma from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import { Prisma, JobStatus, ApplicationStatus, EmploymentType, ExperienceLevel } from "@prisma/client";
import { computeEffectiveJobStatus } from "../jobs/job.service";

export async function getAdminJobs(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  employmentType?: string;
  experienceLevel?: string;
}) {
  const { page = 1, limit = 20, search, status, employmentType, experienceLevel } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.JobWhereInput = {};
  if (status && Object.values(JobStatus).includes(status as JobStatus)) where.status = status as JobStatus;
  if (employmentType && Object.values(EmploymentType).includes(employmentType as EmploymentType)) {
    where.employmentType = employmentType as EmploymentType;
  }
  if (experienceLevel && Object.values(ExperienceLevel).includes(experienceLevel as ExperienceLevel)) {
    where.experienceLevel = experienceLevel as ExperienceLevel;
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      {
        companyProfile: {
          companyName: { contains: search, mode: "insensitive" },
        },
      },
    ];
  }

  const [rawJobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        companyProfile: {
          select: {
            id: true,
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

  const jobs = rawJobs.map((j) => ({
    ...j,
    status: computeEffectiveJobStatus(j.status, j.applicationDeadline),
  }));

  return { jobs, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getAdminJobById(jobId: string) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      companyProfile: {
        include: {
          user: { select: { email: true } },
          companySubscription: { select: { status: true, expiresAt: true, plan: true } },
        },
      },
      applications: {
        orderBy: { createdAt: "desc" },
        include: {
          talentProfile: {
            select: {
              id: true,
              fullName: true,
              title: true,
              photoUrl: true,
              user: { select: { email: true } },
            },
          },
        },
      },
    },
  });
  if (!job) throw new AppError(404, "Job not found.");

  return {
    ...job,
    status: computeEffectiveJobStatus(job.status, job.applicationDeadline),
  };
}

export async function adminUpdateJobStatus(jobId: string, status: JobStatus) {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new AppError(404, "Job not found.");

  const updateData: Prisma.JobUpdateInput = { status };

  if (status === JobStatus.ACTIVE) {
    const now = new Date();
    if (!job.applicationDeadline || new Date(job.applicationDeadline) < now) {
      // Reopening sets a fresh 30-day application deadline
      updateData.applicationDeadline = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      );
    }
  }

  return prisma.job.update({
    where: { id: jobId },
    data: updateData,
  });
}

export async function adminDeleteJob(jobId: string) {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new AppError(404, "Job not found.");
  await prisma.job.delete({ where: { id: jobId } });
  return { success: true };
}

// ─── Applications Management ──────────────────────────────────────────────────

export async function getAdminApplications(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) {
  const { page = 1, limit = 20, search, status } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.JobApplicationWhereInput = {};
  if (
    status &&
    Object.values(ApplicationStatus).includes(status as ApplicationStatus)
  ) {
    where.status = status as ApplicationStatus;
  }

  if (search) {
    where.OR = [
      { job: { title: { contains: search, mode: "insensitive" } } },
      {
        talentProfile: {
          fullName: { contains: search, mode: "insensitive" },
        },
      },
      {
        talentProfile: {
          user: { email: { contains: search, mode: "insensitive" } },
        },
      },
      {
        job: {
          companyProfile: {
            companyName: { contains: search, mode: "insensitive" },
          },
        },
      },
    ];
  }

  const [applications, total] = await Promise.all([
    prisma.jobApplication.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            status: true,
            employmentType: true,
            companyProfile: {
              select: { companyName: true, logoUrl: true },
            },
          },
        },
        talentProfile: {
          select: {
            fullName: true,
            title: true,
            photoUrl: true,
            user: { select: { email: true } },
          },
        },
      },
    }),
    prisma.jobApplication.count({ where }),
  ]);

  return { applications, total, page, limit, totalPages: Math.ceil(total / limit) };
}


export async function getAdminApplicationById(appId: string) {
  const application = await prisma.jobApplication.findUnique({
    where: { id: appId },
    include: {
      job: {
        include: {
          companyProfile: {
            select: { id: true, companyName: true, logoUrl: true },
          },
        },
      },
      talentProfile: {
        include: {
          user: { select: { email: true } },
        },
      },
    },
  });
  if (!application) throw new AppError(404, "Application not found.");
  return application;
}
