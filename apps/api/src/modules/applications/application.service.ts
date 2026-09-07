import prisma from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import { CreateApplicationInput } from "./application.schemas";
import { JobStatus, ApplicationStatus } from "@prisma/client";

export async function applyToJob(userId: string, data: CreateApplicationInput) {
  const talentProfile = await prisma.talentProfile.findUnique({
    where: { userId },
  });

  if (!talentProfile) {
    throw new AppError(404, "Talent profile not found. Please complete your profile first.");
  }

  const job = await prisma.job.findUnique({
    where: { id: data.jobId },
  });

  if (!job) {
    throw new AppError(404, "Job not found.");
  }

  if (job.status !== JobStatus.ACTIVE) {
    throw new AppError(400, "This job is closed and no longer accepting applications.");
  }

  if (job.applicationDeadline && job.applicationDeadline < new Date()) {
    throw new AppError(400, "The application deadline for this job has passed.");
  }

  const existingApplication = await prisma.jobApplication.findUnique({
    where: {
      jobId_talentProfileId: {
        jobId: data.jobId,
        talentProfileId: talentProfile.id,
      },
    },
  });

  if (existingApplication) {
    throw new AppError(409, "You have already submitted an application for this job.");
  }

  return prisma.jobApplication.create({
    data: {
      jobId: data.jobId,
      talentProfileId: talentProfile.id,
      coverLetter: data.coverLetter ?? null,
      status: ApplicationStatus.SUBMITTED,
    },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          companyProfile: {
            select: {
              companyName: true,
              logoUrl: true,
            },
          },
        },
      },
    },
  });
}

export async function getTalentApplications(userId: string) {
  const talentProfile = await prisma.talentProfile.findUnique({
    where: { userId },
  });

  if (!talentProfile) {
    return [];
  }

  return prisma.jobApplication.findMany({
    where: { talentProfileId: talentProfile.id },
    orderBy: { createdAt: "desc" },
    include: {
      job: {
        include: {
          companyProfile: {
            select: {
              companyName: true,
              logoUrl: true,
              country: true,
              city: true,
            },
          },
        },
      },
    },
  });
}

export async function getJobApplicationsForCompany(jobId: string, companyUserId: string) {
  const companyProfile = await prisma.companyProfile.findUnique({
    where: { userId: companyUserId },
  });

  if (!companyProfile) {
    throw new AppError(404, "Company profile not found.");
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    throw new AppError(404, "Job not found.");
  }

  if (job.companyProfileId !== companyProfile.id) {
    throw new AppError(403, "You do not have access to applications for this job.");
  }

  return prisma.jobApplication.findMany({
    where: { jobId },
    orderBy: { createdAt: "desc" },
    include: {
      talentProfile: {
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });
}
