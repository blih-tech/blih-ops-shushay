import prisma from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import { Role, JobStatus } from "@prisma/client";


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
