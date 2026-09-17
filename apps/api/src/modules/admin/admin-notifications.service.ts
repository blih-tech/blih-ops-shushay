import prisma from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import { Role, JobStatus } from "@prisma/client";


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
