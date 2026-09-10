import prisma from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import { Role, JobStatus } from "@prisma/client";

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export async function getAdminStats() {
  const [
    totalUsers,
    totalTalents,
    totalCompanies,
    totalCourses,
    publishedCourses,
    totalLessons,
    totalJobs,
    activeJobs,
    totalApplications,
    totalCertificates,
    activeSubscriptions,
    totalPayments,
    successfulPayments,
    totalEntitlements,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.talentProfile.count(),
    prisma.companyProfile.count(),
    prisma.course.count(),
    prisma.course.count({ where: { status: "PUBLISHED" } }),
    prisma.lesson.count(),
    prisma.job.count(),
    prisma.job.count({ where: { status: "ACTIVE" } }),
    prisma.jobApplication.count(),
    prisma.certificate.count(),
    prisma.companySubscription.count({
      where: { status: "ACTIVE", expiresAt: { gt: new Date() } },
    }),
    prisma.paymentTransaction.count(),
    prisma.paymentTransaction.aggregate({
      _sum: { amount: true },
      where: { status: "SUCCESSFUL" },
    }),
    prisma.skillsEntitlement.count(),
  ]);

  // Recent registrations (last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentUsersCount = await prisma.user.count({
    where: { createdAt: { gte: sevenDaysAgo } },
  });

  // Recent jobs (last 7 days)
  const recentJobsCount = await prisma.job.count({
    where: { createdAt: { gte: sevenDaysAgo } },
  });

  // Recent applications (last 7 days)
  const recentApplicationsCount = await prisma.jobApplication.count({
    where: { createdAt: { gte: sevenDaysAgo } },
  });

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      talentProfile: { select: { fullName: true } },
      companyProfile: { select: { companyName: true } },
    },
  });

  const recentJobs = await prisma.job.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      status: true,
      createdAt: true,
      companyProfile: { select: { companyName: true } },
      _count: { select: { applications: true } },
    },
  });

  return {
    // Core counts
    totalUsers,
    totalTalents,
    totalCompanies,
    totalCourses,
    publishedCourses,
    totalLessons,
    totalJobs,
    activeJobs,
    totalApplications,
    totalCertificates,
    activeSubscriptions,
    totalPayments,
    totalRevenue: successfulPayments._sum.amount ?? 0,
    totalEntitlements,
    // 7-day deltas
    recentUsersCount,
    recentJobsCount,
    recentApplicationsCount,
    // Recent activity
    recentUsers,
    recentJobs,
  };
}

// ─── User Management ──────────────────────────────────────────────────────────

export async function getAdminUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}) {
  const { page = 1, limit = 20, search, role } = params;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (role && ["TALENT", "COMPANY", "ADMIN"].includes(role)) {
    where.role = role;
  }
  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      {
        talentProfile: {
          fullName: { contains: search, mode: "insensitive" },
        },
      },
      {
        companyProfile: {
          companyName: { contains: search, mode: "insensitive" },
        },
      },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        talentProfile: {
          select: {
            id: true,
            fullName: true,
            title: true,
            photoUrl: true,
            skills: true,
            country: true,
            city: true,
          },
        },
        companyProfile: {
          select: {
            id: true,
            companyName: true,
            logoUrl: true,
            country: true,
            city: true,
            subscriptionActive: true,
            subscriptionExpiresAt: true,
          },
        },
        skillsEntitlement: {
          select: {
            id: true,
            grantedAt: true,
          },
        },
        _count: {
          select: {
            paymentTransactions: true,
            certificates: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getAdminUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      talentProfile: {
        select: {
          id: true,
          fullName: true,
          title: true,
          photoUrl: true,
          skills: true,
          country: true,
          city: true,
          bio: true,
          englishLevel: true,
        },
      },
      companyProfile: {
        select: {
          id: true,
          companyName: true,
          logoUrl: true,
          country: true,
          city: true,
          subscriptionActive: true,
          subscriptionExpiresAt: true,
          website: true,
          description: true,
        },
      },
      skillsEntitlement: {
        select: {
          id: true,
          grantedAt: true,
        },
      },
      _count: {
        select: {
          paymentTransactions: true,
          certificates: true,
        },
      },
    },
  });
  if (!user) throw new AppError(404, "User not found.");
  return user;
}

export async function deleteUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, "User not found.");
  await prisma.user.delete({ where: { id: userId } });
  return { success: true };
}

export async function grantSkillsAccess(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { skillsEntitlement: true },
  });
  if (!user) throw new AppError(404, "User not found.");
  if (user.skillsEntitlement) {
    return { alreadyGranted: true, entitlement: user.skillsEntitlement };
  }
  const entitlement = await prisma.skillsEntitlement.create({
    data: { userId },
  });
  return { alreadyGranted: false, entitlement };
}

export async function revokeSkillsAccess(userId: string) {
  const entitlement = await prisma.skillsEntitlement.findUnique({
    where: { userId },
  });
  if (!entitlement) throw new AppError(404, "No skills entitlement found for this user.");
  await prisma.skillsEntitlement.delete({ where: { userId } });
  return { success: true };
}

// ─── Job Management ───────────────────────────────────────────────────────────

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

  const where: any = {};
  if (status && ["ACTIVE", "CLOSED"].includes(status)) where.status = status;
  if (employmentType) where.employmentType = employmentType;
  if (experienceLevel) where.experienceLevel = experienceLevel;
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

  const [jobs, total] = await Promise.all([
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
  return job;
}

export async function adminUpdateJobStatus(jobId: string, status: JobStatus) {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new AppError(404, "Job not found.");
  return prisma.job.update({
    where: { id: jobId },
    data: { status },
  });
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

  const where: any = {};
  if (
    status &&
    ["SUBMITTED", "IN_REVIEW", "INTERVIEW_SCHEDULED", "OFFER_EXTENDED", "REJECTED", "WITHDRAWN"].includes(
      status,
    )
  ) {
    where.status = status;
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

// ─── Payments Management ──────────────────────────────────────────────────────

export async function getAdminPayments(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentType?: string;
}) {
  const { page = 1, limit = 20, search, status, paymentType } = params;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (status && ["PENDING", "SUCCESSFUL", "FAILED", "CANCELLED"].includes(status)) {
    where.status = status;
  }
  if (paymentType && ["SKILLS_ACCESS", "COMPANY_SUBSCRIPTION"].includes(paymentType)) {
    where.paymentType = paymentType;
  }
  if (search) {
    where.OR = [
      { txRef: { contains: search, mode: "insensitive" } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [payments, total, revenueSummary] = await Promise.all([
    prisma.paymentTransaction.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            email: true,
            talentProfile: { select: { fullName: true } },
            companyProfile: { select: { companyName: true } },
          },
        },
      },
    }),
    prisma.paymentTransaction.count({ where }),
    prisma.paymentTransaction.aggregate({
      _sum: { amount: true },
      _count: { _all: true },
      where: { status: "SUCCESSFUL" },
    }),
  ]);

  return {
    payments,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    summary: {
      totalRevenue: revenueSummary._sum.amount ?? 0,
      successfulCount: revenueSummary._count._all,
    },
  };
}

// ─── Subscriptions Management ─────────────────────────────────────────────────

export async function getAdminSubscriptions(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) {
  const { page = 1, limit = 20, search, status } = params;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (status && ["ACTIVE", "EXPIRED"].includes(status)) {
    where.status = status;
  }
  if (search) {
    where.companyProfile = {
      OR: [
        { companyName: { contains: search, mode: "insensitive" } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ],
    };
  }

  const [subscriptions, total] = await Promise.all([
    prisma.companySubscription.findMany({
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
            user: { select: { email: true } },
          },
        },
        payment: {
          select: { txRef: true, amount: true, currency: true, status: true },
        },
      },
    }),
    prisma.companySubscription.count({ where }),
  ]);

  return { subscriptions, total, page, limit, totalPages: Math.ceil(total / limit) };
}

// ─── Certificates Management ──────────────────────────────────────────────────

export async function getAdminCertificates(params: {
  page?: number;
  limit?: number;
  search?: string;
  courseId?: string;
}) {
  const { page = 1, limit = 20, search, courseId } = params;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (courseId) where.courseId = courseId;
  if (search) {
    where.OR = [
      { certificateNumber: { contains: search, mode: "insensitive" } },
      { user: { email: { contains: search, mode: "insensitive" } } },
      {
        user: {
          talentProfile: {
            fullName: { contains: search, mode: "insensitive" },
          },
        },
      },
    ];
  }

  const [certificates, total] = await Promise.all([
    prisma.certificate.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            email: true,
            talentProfile: { select: { fullName: true, photoUrl: true } },
          },
        },
        course: { select: { id: true, title: true } },
      },
    }),
    prisma.certificate.count({ where }),
  ]);

  return { certificates, total, page, limit, totalPages: Math.ceil(total / limit) };
}

// ─── Notifications Management ─────────────────────────────────────────────────

export async function getAdminNotifications(params: {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  read?: string;
}) {
  const { page = 1, limit = 20, search, type, read } = params;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (type) where.type = type;
  if (read === "true") where.read = true;
  if (read === "false") where.read = false;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { message: { contains: search, mode: "insensitive" } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            email: true,
            role: true,
            talentProfile: { select: { fullName: true } },
            companyProfile: { select: { companyName: true } },
          },
        },
      },
    }),
    prisma.notification.count({ where }),
  ]);

  return { notifications, total, page, limit, totalPages: Math.ceil(total / limit) };
}

// ─── Admin Talents (enhanced) ─────────────────────────────────────────────────

export async function getAdminTalents(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const { page = 1, limit = 50, search } = params || {};
  const skip = (page - 1) * limit;

  const where: any = {};
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { title: { contains: search, mode: "insensitive" } },
      { user: { email: { contains: search, mode: "insensitive" } } },
      { country: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
    ];
  }

  const [talents, total] = await Promise.all([
    prisma.talentProfile.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            emailVerified: true,
            createdAt: true,
            skillsEntitlement: { select: { id: true, grantedAt: true } },
          },
        },
        experience: { orderBy: { startDate: "desc" } },
        education: { orderBy: { startYear: "desc" } },
        _count: { select: { jobApplications: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.talentProfile.count({ where }),
  ]);

  return { talents, total, page, limit, totalPages: Math.ceil(total / limit) };
}

// ─── Admin Companies (enhanced) ───────────────────────────────────────────────

export async function getAdminCompanies(params?: {
  page?: number;
  limit?: number;
  search?: string;
  subscriptionStatus?: string;
}) {
  const { page = 1, limit = 50, search, subscriptionStatus } = params || {};
  const skip = (page - 1) * limit;

  const where: any = {};
  if (search) {
    where.OR = [
      { companyName: { contains: search, mode: "insensitive" } },
      { contactName: { contains: search, mode: "insensitive" } },
      { user: { email: { contains: search, mode: "insensitive" } } },
      { country: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
    ];
  }
  if (subscriptionStatus) {
    where.companySubscription = { status: subscriptionStatus };
  }

  const [companies, total] = await Promise.all([
    prisma.companyProfile.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            emailVerified: true,
            createdAt: true,
          },
        },
        companySubscription: {
          select: {
            id: true,
            plan: true,
            status: true,
            amount: true,
            currency: true,
            startDate: true,
            expiresAt: true,
          },
        },
        _count: { select: { jobs: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.companyProfile.count({ where }),
  ]);

  return { companies, total, page, limit, totalPages: Math.ceil(total / limit) };
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

export async function getAdminPaymentById(paymentId: string) {
  const payment = await prisma.paymentTransaction.findUnique({
    where: { id: paymentId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          talentProfile: { select: { fullName: true } },
          companyProfile: { select: { companyName: true } },
        },
      },
    },
  });
  if (!payment) throw new AppError(404, "Payment transaction not found.");
  return payment;
}

export async function getAdminSubscriptionById(subId: string) {
  const subscription = await prisma.companySubscription.findUnique({
    where: { id: subId },
    include: {
      companyProfile: {
        select: {
          id: true,
          companyName: true,
          logoUrl: true,
          country: true,
          city: true,
          user: { select: { email: true } },
        },
      },
      payment: {
        select: { txRef: true, amount: true, currency: true, status: true },
      },
    },
  });
  if (!subscription) throw new AppError(404, "Subscription not found.");
  return subscription;
}

export async function getAdminCertificateById(certId: string) {
  const certificate = await prisma.certificate.findUnique({
    where: { id: certId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          talentProfile: { select: { fullName: true, photoUrl: true } },
        },
      },
      course: { select: { id: true, title: true, description: true } },
    },
  });
  if (!certificate) throw new AppError(404, "Certificate not found.");
  return certificate;
}

export async function getAdminNotificationById(id: string) {
  const notification = await prisma.notification.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          talentProfile: { select: { fullName: true } },
          companyProfile: { select: { companyName: true } },
        },
      },
    },
  });
  if (!notification) throw new AppError(404, "Notification not found.");
  return notification;
}

export async function getAdminTalentById(talentId: string) {
  const talent = await prisma.talentProfile.findUnique({
    where: { id: talentId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          skillsEntitlement: { select: { id: true, grantedAt: true } },
        },
      },
      experience: { orderBy: { startDate: "desc" } },
      education: { orderBy: { startYear: "desc" } },
      _count: { select: { jobApplications: true } },
    },
  });
  if (!talent) throw new AppError(404, "Talent profile not found.");
  return talent;
}

export async function getAdminCompanyById(companyId: string) {
  const company = await prisma.companyProfile.findUnique({
    where: { id: companyId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          emailVerified: true,
          createdAt: true,
        },
      },
      companySubscription: true,
      jobs: {
        select: { id: true, title: true, status: true, employmentType: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { jobs: true } },
    },
  });
  if (!company) throw new AppError(404, "Company profile not found.");
  return company;
}
