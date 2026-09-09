import prisma from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import { CreateApplicationInput } from "./application.schemas";
import { JobStatus, ApplicationStatus } from "@prisma/client";
import {
  createNotification,
  sendJobApplicationEmail,
} from "../notifications/notification.service";

export async function applyToJob(userId: string, data: CreateApplicationInput) {
  const talentProfile = await prisma.talentProfile.findUnique({
    where: { userId },
  });

  if (!talentProfile) {
    throw new AppError(
      404,
      "Talent profile not found. Please complete your profile first.",
    );
  }

  const job = await prisma.job.findUnique({
    where: { id: data.jobId },
    include: {
      companyProfile: {
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

  if (!job) {
    throw new AppError(404, "Job not found.");
  }

  if (job.status !== JobStatus.ACTIVE) {
    throw new AppError(
      400,
      "This job is closed and no longer accepting applications.",
    );
  }

  if (job.applicationDeadline && job.applicationDeadline < new Date()) {
    throw new AppError(
      400,
      "The application deadline for this job has passed.",
    );
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
    throw new AppError(
      409,
      "You have already submitted an application for this job.",
    );
  }

  const application = await prisma.jobApplication.create({
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

  // Trigger internal and email notifications for company
  const companyUserId = job.companyProfile?.userId;
  const applicantName = talentProfile.fullName || "A candidate";
  if (companyUserId) {
    await createNotification({
      userId: companyUserId,
      type: "NEW_JOB_APPLICATION",
      title: "New Job Application",
      message: `${applicantName} has applied for your job posting '${job.title}'.`,
    });
  }

  const companyEmail =
    job.companyProfile?.contactEmail || job.companyProfile?.user?.email;
  if (companyEmail) {
    sendJobApplicationEmail(companyEmail, job.title, applicantName);
  }

  return application;
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

export async function getJobApplicationsForCompany(
  jobId: string,
  companyUserId: string,
) {
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
    throw new AppError(
      403,
      "You do not have access to applications for this job.",
    );
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
          experience: true,
          education: true,
        },
      },
    },
  });
}

export async function updateApplicationStatus(
  applicationId: string,
  companyUserId: string,
  targetStatus: ApplicationStatus,
) {
  const companyProfile = await prisma.companyProfile.findUnique({
    where: { userId: companyUserId },
  });

  if (!companyProfile) {
    throw new AppError(404, "Company profile not found.");
  }

  const application = await prisma.jobApplication.findUnique({
    where: { id: applicationId },
    include: {
      job: {
        select: {
          companyProfileId: true,
        },
      },
    },
  });

  if (!application) {
    throw new AppError(404, "Application not found.");
  }

  if (application.job.companyProfileId !== companyProfile.id) {
    throw new AppError(
      403,
      "You do not have access to update applications for this job.",
    );
  }

  // Enforcement: Allow only Applied (SUBMITTED) -> Reviewing (IN_REVIEW)
  if (
    application.status !== ApplicationStatus.SUBMITTED ||
    targetStatus !== ApplicationStatus.IN_REVIEW
  ) {
    throw new AppError(
      400,
      "Only status change from Applied (SUBMITTED) to Reviewing (IN_REVIEW) is allowed.",
    );
  }

  return prisma.jobApplication.update({
    where: { id: applicationId },
    data: { status: ApplicationStatus.IN_REVIEW },
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
