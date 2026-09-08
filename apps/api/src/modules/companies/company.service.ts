import prisma from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import { UpdateCompanyProfileInput } from "./company.schemas";

export async function getOrCreateProfile(userId: string) {
  let profile = await prisma.companyProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    profile = await prisma.companyProfile.create({
      data: {
        userId,
      },
    });
  }

  return profile;
}

export async function updateProfile(
  userId: string,
  data: UpdateCompanyProfileInput,
) {
  const profile = await prisma.companyProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new AppError(404, "Company profile not found");
  }

  return prisma.companyProfile.update({
    where: { userId },
    data: {
      companyName:
        data.companyName !== undefined ? data.companyName : undefined,
      description:
        data.description !== undefined ? data.description : undefined,
      website: data.website !== undefined ? data.website : undefined,
      country: data.country !== undefined ? data.country : undefined,
      city: data.city !== undefined ? data.city : undefined,
      contactName:
        data.contactName !== undefined ? data.contactName : undefined,
      contactEmail:
        data.contactEmail !== undefined ? data.contactEmail : undefined,
      contactPhone:
        data.contactPhone !== undefined ? data.contactPhone : undefined,
    },
  });
}

export async function updateFile(
  userId: string,
  field: "logoUrl",
  fileUrl: string | null,
  publicId: string | null = null,
) {
  const profile = await prisma.companyProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new AppError(404, "Company profile not found");
  }

  const publicIdField = "logoPublicId";

  return prisma.companyProfile.update({
    where: { userId },
    data: {
      [field]: fileUrl,
      [publicIdField]: publicId,
    },
  });
}

export async function getCompanyById(companyId: string) {
  const company = await prisma.companyProfile.findUnique({
    where: { id: companyId },
    select: {
      id: true,
      companyName: true,
      description: true,
      website: true,
      country: true,
      city: true,
      contactName: true,
      contactEmail: true,
      contactPhone: true,
      logoUrl: true,
      createdAt: true,
      jobs: {
        where: { status: "ACTIVE" },
        select: {
          id: true,
          title: true,
          description: true,
          employmentType: true,
          experienceLevel: true,
          salaryMin: true,
          salaryMax: true,
          salaryCurrency: true,
          salaryDisplay: true,
          countryRestrictions: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!company) {
    throw new AppError(404, "Company profile not found");
  }

  return company;
}

