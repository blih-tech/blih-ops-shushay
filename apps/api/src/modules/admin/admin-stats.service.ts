import prisma from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import { Role, JobStatus } from "@prisma/client";

// ─── Dashboard Stats Cache (60-second TTL) ───────────────────────────────────
let statsCache: { data: Awaited<ReturnType<typeof _getAdminStatsRaw>>; expiresAt: number } | null = null;
const STATS_CACHE_TTL_MS = 60_000;

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

async function _getAdminStatsRaw() {
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
    totalEnrollments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.talentProfile.count(),
    prisma.companyProfile.count(),
    prisma.course.count(),
    prisma.course.count({ where: { status: "PUBLISHED" } }),
    prisma.lesson.count(),
    prisma.job.count(),
    prisma.job.count({
      where: {
        status: "ACTIVE",
        OR: [
          { applicationDeadline: null },
          { applicationDeadline: { gte: new Date() } },
        ],
      },
    }),
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
    prisma.courseEnrollment.count(),
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
    totalEnrollments,
    totalEntitlements: totalEnrollments,
    // 7-day deltas
    recentUsersCount,
    recentJobsCount,
    recentApplicationsCount,
    // Recent activity
    recentUsers,
    recentJobs,
  };
}

// Public cached wrapper
export async function getAdminStats() {
  if (statsCache && Date.now() < statsCache.expiresAt) {
    return statsCache.data;
  }
  const data = await _getAdminStatsRaw();
  statsCache = { data, expiresAt: Date.now() + STATS_CACHE_TTL_MS };
  return data;
}
