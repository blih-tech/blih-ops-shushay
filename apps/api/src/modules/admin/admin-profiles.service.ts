import prisma from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import { Prisma, SubscriptionStatus } from "@prisma/client";
import { computeEffectiveJobStatus } from "../jobs/job.service";

export async function getAdminTalents(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const { page = 1, limit = 50, search } = params || {};
  const skip = (page - 1) * limit;

  const where: Prisma.TalentProfileWhereInput = {};
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
            courseEnrollments: { select: { id: true, courseId: true, grantedAt: true } },
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

  const where: Prisma.CompanyProfileWhereInput = {};
  if (search) {
    where.OR = [
      { companyName: { contains: search, mode: "insensitive" } },
      { contactName: { contains: search, mode: "insensitive" } },
      { user: { email: { contains: search, mode: "insensitive" } } },
      { country: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
    ];
  }
  if (subscriptionStatus && Object.values(SubscriptionStatus).includes(subscriptionStatus as SubscriptionStatus)) {
    where.companySubscription = { status: subscriptionStatus as SubscriptionStatus };
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
          courseEnrollments: { select: { id: true, courseId: true, grantedAt: true } },
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
        select: {
          id: true,
          title: true,
          status: true,
          employmentType: true,
          applicationDeadline: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { jobs: true } },
    },
  });
  if (!company) throw new AppError(404, "Company profile not found.");

  const jobs = company.jobs.map((j) => ({
    ...j,
    status: computeEffectiveJobStatus(j.status, j.applicationDeadline),
  }));

  return {
    ...company,
    jobs,
  };
}

