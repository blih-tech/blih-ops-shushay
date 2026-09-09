import prisma from "../../config/prisma";
import { TalentSearchQueryInput } from "./talent.schemas";

export async function searchTalents(query: TalentSearchQueryInput) {
  const { page, limit, search, skills, englishLevel, country, city } = query;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (englishLevel) {
    where.englishLevel = englishLevel;
  }
  if (country) {
    where.country = { contains: country, mode: "insensitive" };
  }
  if (city) {
    where.city = { contains: city, mode: "insensitive" };
  }
  if (skills) {
    const skillList = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (skillList.length > 0) {
      where.skills = { hasSome: skillList };
    }
  }
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { title: { contains: search, mode: "insensitive" } },
      { bio: { contains: search, mode: "insensitive" } },
      { skills: { hasSome: [search] } },
    ];
  }

  const [talents, total] = await Promise.all([
    prisma.talentProfile.findMany({
      where,
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        _count: {
          select: {
            experience: true,
            education: true,
          },
        },
      },
    }),
    prisma.talentProfile.count({ where }),
  ]);

  const userIds = talents.map((t) => t.userId);
  const certCounts = await prisma.certificate.groupBy({
    by: ["userId"],
    where: { userId: { in: userIds } },
    _count: { id: true },
  });
  const certCountMap = new Map(certCounts.map((c) => [c.userId, c._count.id]));

  const talentList = talents.map((t) => ({
    id: t.id,
    userId: t.userId,
    fullName: t.fullName || "Talent",
    title: t.title,
    bio: t.bio,
    photoUrl: t.photoUrl,
    country: t.country,
    city: t.city,
    englishLevel: t.englishLevel,
    skills: t.skills,
    experienceCount: t._count.experience,
    educationCount: t._count.education,
    certificatesCount: certCountMap.get(t.userId) || 0,
    isComplete: Boolean(t.fullName && t.title && t.skills.length > 0),
  }));

  return {
    talents: talentList,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
