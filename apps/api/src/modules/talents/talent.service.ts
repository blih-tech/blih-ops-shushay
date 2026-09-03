import prisma from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import { UpdateTalentProfileInput } from "./talent.schemas";
import {
  getDetailedProfileCompletion,
  computeIsComplete,
} from "./talentProfileCalculator";

export { getDetailedProfileCompletion, computeIsComplete };
export {
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
} from "./talentExperienceEducation.service";

export async function getOrCreateProfile(userId: string) {
  let profile = await prisma.talentProfile.findUnique({
    where: { userId },
    include: {
      experience: true,
      education: true,
    },
  });

  if (!profile) {
    profile = await prisma.talentProfile.create({
      data: {
        userId,
        skills: [],
      },
      include: {
        experience: true,
        education: true,
      },
    });
  }

  const completion = getDetailedProfileCompletion(profile);

  const certificates = await prisma.certificate.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          description: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const completedCourses = certificates.map((c: any) => ({
    id: c.course.id,
    title: c.course.title,
    description: c.course.description,
    completedAt: c.issueDate,
    certificateId: c.id,
    certificateNumber: c.certificateNumber,
  }));

  return {
    ...profile,
    isComplete: completion.isComplete,
    profileCompletion: completion,
    certificates,
    completedCourses,
  };
}

export async function updateProfile(
  userId: string,
  data: UpdateTalentProfileInput,
) {
  const profile = await prisma.talentProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new AppError(404, "Talent profile not found");
  }

  const updated = await prisma.talentProfile.update({
    where: { userId },
    data: {
      fullName: data.fullName !== undefined ? data.fullName : undefined,
      title: data.title !== undefined ? data.title : undefined,
      phone: data.phone !== undefined ? data.phone : undefined,
      country: data.country !== undefined ? data.country : undefined,
      city: data.city !== undefined ? data.city : undefined,
      englishLevel:
        data.englishLevel !== undefined ? data.englishLevel : undefined,
      skills: data.skills !== undefined ? data.skills : undefined,
      bio: data.bio !== undefined ? data.bio : undefined,
    },
    include: {
      experience: true,
      education: true,
    },
  });

  const completion = getDetailedProfileCompletion(updated);

  return {
    ...updated,
    isComplete: completion.isComplete,
    profileCompletion: completion,
  };
}

export async function updateFile(
  userId: string,
  field: "photoUrl" | "cvUrl",
  fileUrl: string | null,
  publicId: string | null = null,
) {
  const profile = await prisma.talentProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new AppError(404, "Talent profile not found");
  }

  const publicIdField = field === "photoUrl" ? "photoPublicId" : "cvPublicId";

  const updated = await prisma.talentProfile.update({
    where: { userId },
    data: {
      [field]: fileUrl,
      [publicIdField]: publicId,
    },
    include: {
      experience: true,
      education: true,
    },
  });

  const completion = getDetailedProfileCompletion(updated);

  return {
    ...updated,
    isComplete: completion.isComplete,
    profileCompletion: completion,
  };
}

export async function getTalentProfileById(
  talentId: string,
  requestUser: { id: string; role: string },
) {
  if (requestUser.role === "COMPANY") {
    const company = await prisma.companyProfile.findUnique({
      where: { userId: requestUser.id },
      select: { subscriptionActive: true, subscriptionExpiresAt: true },
    });

    if (!company) {
      throw new AppError(403, "Access denied. Company profile not found.");
    }

    const now = new Date();
    const isSubscribed =
      company.subscriptionActive &&
      company.subscriptionExpiresAt &&
      company.subscriptionExpiresAt > now;

    if (!isSubscribed) {
      throw new AppError(
        402,
        "Payment Required. An active subscription is required to view full talent profiles.",
      );
    }
  } else if (requestUser.role !== "ADMIN") {
    throw new AppError(403, "Access denied. Insufficient permissions.");
  }

  const talent = await prisma.talentProfile.findUnique({
    where: { id: talentId },
    include: {
      user: { select: { email: true } },
      experience: true,
      education: true,
    },
  });

  if (!talent) {
    throw new AppError(404, "Talent profile not found");
  }

  const completion = getDetailedProfileCompletion(talent);

  const certificates = await prisma.certificate.findMany({
    where: { userId: talent.userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          description: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const completedCourses = certificates.map((c: any) => ({
    id: c.course.id,
    title: c.course.title,
    description: c.course.description,
    completedAt: c.issueDate,
    certificateId: c.id,
    certificateNumber: c.certificateNumber,
  }));

  return {
    ...talent,
    email: talent.user.email,
    isComplete: completion.isComplete,
    profileCompletion: completion,
    certificates,
    completedCourses,
  };
}
