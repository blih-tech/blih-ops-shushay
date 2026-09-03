import prisma from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import {
  UpdateTalentProfileInput,
  CreateExperienceInput,
  UpdateExperienceInput,
  CreateEducationInput,
  UpdateEducationInput,
} from "./talent.schemas";

export function getDetailedProfileCompletion(profile: any) {
  if (!profile) {
    return {
      percentage: 0,
      missingFields: [
        "fullName",
        "title",
        "phone",
        "country",
        "city",
        "englishLevel",
        "skills",
        "experience",
        "education",
        "cvUrl",
      ],
      isComplete: false,
    };
  }

  const checklist = [
    { field: "fullName", check: () => !!profile.fullName },
    { field: "title", check: () => !!profile.title },
    { field: "phone", check: () => !!profile.phone },
    { field: "country", check: () => !!profile.country },
    { field: "city", check: () => !!profile.city },
    { field: "englishLevel", check: () => !!profile.englishLevel },
    {
      field: "skills",
      check: () => Array.isArray(profile.skills) && profile.skills.length > 0,
    },
    {
      field: "experience",
      check: () =>
        Array.isArray(profile.experience) && profile.experience.length > 0,
    },
    {
      field: "education",
      check: () =>
        Array.isArray(profile.education) && profile.education.length > 0,
    },
    { field: "cvUrl", check: () => !!profile.cvUrl },
  ];

  const missingFields: string[] = [];
  let score = 0;

  for (const item of checklist) {
    if (item.check()) {
      score += 10;
    } else {
      missingFields.push(item.field);
    }
  }

  return {
    percentage: score,
    missingFields,
    isComplete: score === 100,
  };
}

export function computeIsComplete(profile: any): boolean {
  return getDetailedProfileCompletion(profile).isComplete;
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

  const completion = getDetailedProfileCompletion(profile);

  // Fetch certificates & completed courses for profile display
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

export async function addExperience(
  userId: string,
  data: CreateExperienceInput,
) {
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

export async function updateExperience(
  userId: string,
  id: string,
  data: UpdateExperienceInput,
) {
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
      startDate:
        data.startDate !== undefined ? new Date(data.startDate) : undefined,
      endDate:
        data.endDate !== undefined
          ? data.endDate
            ? new Date(data.endDate)
            : null
          : undefined,
      current: data.current !== undefined ? data.current : undefined,
      description:
        data.description !== undefined ? data.description : undefined,
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

export async function updateEducation(
  userId: string,
  id: string,
  data: UpdateEducationInput,
) {
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
      institution:
        data.institution !== undefined ? data.institution : undefined,
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
    // Verify company active subscription
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

  // Fetch full talent profile
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

  // Attach email from user table to the profile for easy consumption
  return {
    ...talent,
    email: talent.user.email,
    isComplete: completion.isComplete,
    profileCompletion: completion,
    certificates,
    completedCourses,
  };
}
