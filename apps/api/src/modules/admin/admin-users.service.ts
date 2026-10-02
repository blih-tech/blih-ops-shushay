import { Prisma, Role } from "@prisma/client";
import crypto from "crypto";
import prisma from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import { env } from "../../config/env";
import { logger } from "../../utils/logger";
import { sendAdminInviteEmail, sendPasswordResetEmail } from "../../services/email.service";

export async function getAdminUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}) {
  const { page = 1, limit = 20, search, role } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {};
  if (role && ["TALENT", "COMPANY", "ADMIN"].includes(role)) {
    where.role = role as Role;
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
        isActive: true,
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

        certificates: {
          select: {
            courseId: true,
            course: { select: { title: true } },
          },
        },
        courseEnrollments: {
          select: {
            courseId: true,
            grantedAt: true,
            course: { select: { id: true, title: true } },
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
      isActive: true,
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

      certificates: {
        select: {
          courseId: true,
          course: { select: { title: true } },
        },
      },
      courseEnrollments: {
        select: {
          courseId: true,
          grantedAt: true,
          course: { select: { id: true, title: true } },
        },
        orderBy: { grantedAt: "desc" },
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

  if (user.role === Role.ADMIN) {
    const adminCount = await prisma.user.count({ where: { role: Role.ADMIN } });
    if (adminCount <= 1) {
      throw new AppError(400, "Cannot delete the last admin account.");
    }
  }

  await prisma.user.delete({ where: { id: userId } });
  return { success: true };
}

/**
 * Admin grants a user enrollment in a specific course (no payment required).
 */
export async function grantSkillsAccess(userId: string, courseId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) throw new AppError(404, "User not found.");

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new AppError(404, "Course not found.");

  const existing = await prisma.courseEnrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (existing) {
    return { alreadyGranted: true, enrollment: existing };
  }

  const enrollment = await prisma.courseEnrollment.create({
    data: { userId, courseId },
    include: { course: { select: { id: true, title: true } } },
  });
  return { alreadyGranted: false, enrollment };
}

/**
 * Admin revokes a user's enrollment in a specific course.
 */
export async function revokeSkillsAccess(userId: string, courseId: string) {
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (!enrollment) {
    throw new AppError(404, "No enrollment found for this user and course.");
  }
  await prisma.courseEnrollment.delete({
    where: { userId_courseId: { userId, courseId } },
  });
  return { success: true };
}

/**
 * Creates a new admin user and sends them an invite email with a set-password link.
 * The account is created without a password; the invite link uses the reset-token
 * flow so the new admin can set their own password within 24 hours.
 */
export async function createAdmin(
  email: string,
  invitedByEmail: string,
) {
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existing) {
    throw new AppError(409, "An account with this email already exists.");
  }

  // Create the admin account with no password — they'll set it via the invite link
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      role: Role.ADMIN,
      emailVerified: true, // No email verification step needed for invited admins
      resetToken,
      resetExpires,
    },
    select: {
      id: true,
      email: true,
      role: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  // Send the invite email
  const setPasswordLink = `${env.authUrl}/reset-password?token=${resetToken}`;
  await sendAdminInviteEmail(normalizedEmail, setPasswordLink, invitedByEmail);
  logger.info(`[ADMIN CREATED] Admin invite for ${normalizedEmail} | Link: ${setPasswordLink}`);

  return { ...user, inviteLink: setPasswordLink };
}

/**
 * Resends an invite or password reset link to a user.
 * Generates a fresh 24h reset token, logs the link to console, and sends the email.
 */
export async function resendInvite(userId: string, requestedByEmail: string = "Admin") {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, "User not found.");

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await prisma.user.update({
    where: { id: userId },
    data: { resetToken, resetExpires },
  });

  const setPasswordLink = `${env.authUrl}/reset-password?token=${resetToken}`;

  if (user.role === Role.ADMIN) {
    await sendAdminInviteEmail(user.email, setPasswordLink, requestedByEmail);
  } else {
    await sendPasswordResetEmail(user.email, setPasswordLink);
  }

  logger.info(`[INVITE RESENT] Set-password link for ${user.email} (${user.role}) → ${setPasswordLink}`);

  return {
    success: true,
    email: user.email,
    role: user.role,
    inviteLink: setPasswordLink,
  };
}

/**
 * Toggles a user's active/suspended status (isActive: true/false).
 */
export async function toggleUserActive(userId: string, isActive: boolean) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, "User not found.");

  // If deactivating an admin, ensure they are not the last active admin
  if (user.role === Role.ADMIN && !isActive) {
    const activeAdminCount = await prisma.user.count({
      where: { role: Role.ADMIN, isActive: true },
    });
    if (activeAdminCount <= 1) {
      throw new AppError(400, "Cannot deactivate the last active admin account.");
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isActive },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      updatedAt: true,
    },
  });

  return updatedUser;
}

/**
 * Updates a user's role (ADMIN, TALENT, COMPANY).
 */
export async function updateUserRole(userId: string, newRole: Role) {
  if (![Role.ADMIN, Role.TALENT, Role.COMPANY].includes(newRole)) {
    throw new AppError(400, `Invalid role: ${newRole}`);
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, "User not found.");

  if (user.role === newRole) {
    return user;
  }

  // If demoting an admin, ensure they are not the last admin account
  if (user.role === Role.ADMIN && newRole !== Role.ADMIN) {
    const adminCount = await prisma.user.count({ where: { role: Role.ADMIN } });
    if (adminCount <= 1) {
      throw new AppError(400, "Cannot demote the last admin account.");
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      updatedAt: true,
    },
  });

  return updatedUser;
}


