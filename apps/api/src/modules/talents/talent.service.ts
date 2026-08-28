import prisma from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import {
  UpdateTalentProfileInput,
  CreateExperienceInput,
  UpdateExperienceInput,
  CreateEducationInput,
  UpdateEducationInput,
} from "./talent.schemas";

export function computeIsComplete(profile: any): boolean {
  if (!profile) return false;
  return (
    !!profile.fullName &&
    !!profile.title &&
    !!profile.phone &&
    !!profile.country &&
    !!profile.city &&
    !!profile.englishLevel &&
    Array.isArray(profile.skills) &&
    profile.skills.length > 0
  );
}

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

  return {
    ...profile,
    isComplete: computeIsComplete(profile),
  };
}

export async function updateProfile(userId: string, data: UpdateTalentProfileInput) {
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
      englishLevel: data.englishLevel !== undefined ? data.englishLevel : undefined,
      skills: data.skills !== undefined ? data.skills : undefined,
      bio: data.bio !== undefined ? data.bio : undefined,
    },
    include: {
      experience: true,
      education: true,
    },
  });

  return {
    ...updated,
    isComplete: computeIsComplete(updated),
  };
}

export async function addExperience(userId: string, data: CreateExperienceInput) {
  const profile = await prisma.talentProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new AppError(404, "Talent profile not found");
  }

  return prisma.experience.create({
    data: {
      profileId: profile.id,
      title: data.title,
      company: data.company,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      current: data.current,
      description: data.description,
    },
  });
}

export async function updateExperience(userId: string, id: string, data: UpdateExperienceInput) {
  const exp = await prisma.experience.findUnique({
    where: { id },
    include: { profile: true },
  });

  if (!exp) {
    throw new AppError(404, "Experience entry not found");
  }

  if (exp.profile.userId !== userId) {
    throw new AppError(403, "Access denied. You do not own this profile.");
  }

  return prisma.experience.update({
    where: { id },
    data: {
      title: data.title !== undefined ? data.title : undefined,
      company: data.company !== undefined ? data.company : undefined,
      startDate: data.startDate !== undefined ? new Date(data.startDate) : undefined,
      endDate: data.endDate !== undefined ? (data.endDate ? new Date(data.endDate) : null) : undefined,
      current: data.current !== undefined ? data.current : undefined,
      description: data.description !== undefined ? data.description : undefined,
    },
  });
}

export async function deleteExperience(userId: string, id: string) {
  const exp = await prisma.experience.findUnique({
    where: { id },
    include: { profile: true },
  });

  if (!exp) {
    throw new AppError(404, "Experience entry not found");
  }

  if (exp.profile.userId !== userId) {
    throw new AppError(403, "Access denied. You do not own this profile.");
  }

  await prisma.experience.delete({
    where: { id },
  });

  return { success: true };
}

export async function addEducation(userId: string, data: CreateEducationInput) {
  const profile = await prisma.talentProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new AppError(404, "Talent profile not found");
  }

  return prisma.education.create({
    data: {
      profileId: profile.id,
      institution: data.institution,
      degree: data.degree,
      field: data.field,
      startYear: data.startYear,
      endYear: data.endYear,
    },
  });
}

export async function updateEducation(userId: string, id: string, data: UpdateEducationInput) {
  const edu = await prisma.education.findUnique({
    where: { id },
    include: { profile: true },
  });

  if (!edu) {
    throw new AppError(404, "Education entry not found");
  }

  if (edu.profile.userId !== userId) {
    throw new AppError(403, "Access denied. You do not own this profile.");
  }

  return prisma.education.update({
    where: { id },
    data: {
      institution: data.institution !== undefined ? data.institution : undefined,
      degree: data.degree !== undefined ? data.degree : undefined,
      field: data.field !== undefined ? data.field : undefined,
      startYear: data.startYear !== undefined ? data.startYear : undefined,
      endYear: data.endYear !== undefined ? data.endYear : undefined,
    },
  });
}

export async function deleteEducation(userId: string, id: string) {
  const edu = await prisma.education.findUnique({
    where: { id },
    include: { profile: true },
  });

  if (!edu) {
    throw new AppError(404, "Education entry not found");
  }

  if (edu.profile.userId !== userId) {
    throw new AppError(403, "Access denied. You do not own this profile.");
  }

  await prisma.education.delete({
    where: { id },
  });

  return { success: true };
}

export async function updateFile(
  userId: string,
  field: "photoUrl" | "cvUrl",
  fileUrl: string | null,
  publicId: string | null = null
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

  return {
    ...updated,
    isComplete: computeIsComplete(updated),
  };
}
