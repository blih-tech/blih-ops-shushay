import prisma from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import { Role, JobStatus } from "@prisma/client";


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

  const [rawUsers, total] = await Promise.all([
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
        certificates: {
          select: {
            courseId: true,
            course: { select: { title: true } },
          },
        },
        _count: {
          select: {
            paymentTransactions: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  const users = rawUsers.map(({ certificates, _count, ...u }) => {
    const uniqueTitles = new Set(
      certificates.map((c) => c.course?.title?.trim() || c.courseId),
    );
    return {
      ...u,
      _count: {
        ..._count,
        certificates: uniqueTitles.size,
      },
    };
  });

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
          _count: {
            select: {
              jobApplications: true,
            },
          },
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
          companySubscription: {
            select: {
              status: true,
              plan: true,
              expiresAt: true,
            },
          },
          _count: {
            select: {
              jobs: true,
            },
          },
        },
      },
      skillsEntitlement: {
        select: {
          id: true,
          grantedAt: true,
        },
      },
      certificates: {
        select: {
          courseId: true,
          course: { select: { title: true } },
        },
      },
      _count: {
        select: {
          paymentTransactions: true,
        },
      },
    },
  });
  if (!user) throw new AppError(404, "User not found.");

  const { certificates, _count, ...userData } = user;
  const uniqueTitles = new Set(
    certificates.map((c) => c.course?.title?.trim() || c.courseId),
  );

  return {
    ...userData,
    _count: {
      ..._count,
      certificates: uniqueTitles.size,
    },
  };
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
