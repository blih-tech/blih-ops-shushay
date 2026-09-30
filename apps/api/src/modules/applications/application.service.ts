import prisma from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import { CreateApplicationInput } from "./application.schemas";
import { JobStatus, ApplicationStatus } from "@prisma/client";
import { createNotification } from "../notifications/notification.service";
import { enqueueEmail } from "../../services/queue.service";

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
    enqueueEmail({
      jobType: "JOB_APPLICATION",
      payload: { companyEmail, jobTitle: job.title, applicantName },
    });
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

// ─── Application status state machine ────────────────────────────────────────
// Maps each status to the set of statuses a company is allowed to transition to.
const COMPANY_STATUS_TRANSITIONS: Partial<Record<ApplicationStatus, ApplicationStatus[]>> = {
  [ApplicationStatus.SUBMITTED]: [ApplicationStatus.IN_REVIEW, ApplicationStatus.REJECTED],
  [ApplicationStatus.IN_REVIEW]: [
    ApplicationStatus.INTERVIEW_SCHEDULED,
    ApplicationStatus.OFFER_EXTENDED,
    ApplicationStatus.REJECTED,
  ],
  [ApplicationStatus.INTERVIEW_SCHEDULED]: [
    ApplicationStatus.OFFER_EXTENDED,
    ApplicationStatus.REJECTED,
  ],
};

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
          title: true,
          companyProfile: { select: { companyName: true } },
        },
      },
      talentProfile: {
        select: {
          userId: true,
          fullName: true,
          user: { select: { email: true } },
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

  // Validate against the state machine.
  const allowedNextStatuses = COMPANY_STATUS_TRANSITIONS[application.status as ApplicationStatus] ?? [];
  if (!allowedNextStatuses.includes(targetStatus)) {
    throw new AppError(
      400,
      `Cannot transition application from "${application.status}" to "${targetStatus}". ` +
        `Only status change from Applied (SUBMITTED) to Reviewing (IN_REVIEW) is allowed. ` +
        `Allowed transitions: ${allowedNextStatuses.join(", ") || "none"}.`,
    );
  }

  const updated = await prisma.jobApplication.update({
    where: { id: applicationId },
    data: { status: targetStatus },
  });

  // Notify the talent of every status change.
  if (application.talentProfile?.userId) {
    const companyName = application.job.companyProfile?.companyName || "A company";
    const statusLabels: Partial<Record<ApplicationStatus, string>> = {
      [ApplicationStatus.IN_REVIEW]: "is now under review",
      [ApplicationStatus.INTERVIEW_SCHEDULED]: "has been selected for an interview",
      [ApplicationStatus.OFFER_EXTENDED]: "has received a job offer",
      [ApplicationStatus.REJECTED]: "was not selected at this time",
    };
    const statusLabel = statusLabels[targetStatus] ?? `moved to ${targetStatus}`;
    await createNotification({
      userId: application.talentProfile.userId,
      type: "APPLICATION_STATUS_UPDATED",
      title: "Application Update",
      message: `Your application for '${application.job.title}' at ${companyName} ${statusLabel}.`,
    });
  }

  return updated;
}
