import prisma from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import { Role, JobStatus } from "@prisma/client";


export async function getAdminCertificates(params: {
  page?: number;
  limit?: number;
  search?: string;
  courseId?: string;
}) {
  const { page = 1, limit = 20, search, courseId } = params;

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

  const rawCertificates = await prisma.certificate.findMany({
    where,
    orderBy: { issueDate: "desc" },
    include: {
      user: {
        select: {
          email: true,
          talentProfile: { select: { fullName: true, photoUrl: true } },
        },
      },
      course: { select: { id: true, title: true } },
    },
  });

  // Deduplicate by userId + course title/id (keep newest certificate per user & course)
  const uniqueMap = new Map<string, (typeof rawCertificates)[0]>();
  for (const cert of rawCertificates) {
    const key = `${cert.userId}_${cert.course?.title?.trim() || cert.courseId}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, cert);
    }
  }

  const uniqueCertificates = Array.from(uniqueMap.values());
  const total = uniqueCertificates.length;
  const skip = (page - 1) * limit;
  const certificates = uniqueCertificates.slice(skip, skip + limit);

  return { certificates, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
}

export async function adminDeleteCertificate(certId: string) {
  const cert = await prisma.certificate.findUnique({ where: { id: certId } });
  if (!cert) throw new AppError(404, "Certificate not found");
  await prisma.certificate.delete({ where: { id: certId } });
  return { message: "Certificate deleted successfully" };
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
