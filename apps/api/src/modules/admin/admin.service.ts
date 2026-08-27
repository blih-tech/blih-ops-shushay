import prisma from "../../config/prisma";

export async function getAdminStats() {
  const [
    totalTalents,
    totalCompanies,
    totalCourses,
    publishedCourses,
    totalLessons,
  ] = await Promise.all([
    prisma.talentProfile.count(),
    prisma.companyProfile.count(),
    prisma.course.count(),
    prisma.course.count({ where: { status: "PUBLISHED" } }),
    prisma.lesson.count(),
  ]);

  return {
    totalTalents,
    totalCompanies,
    totalCourses,
    publishedCourses,
    totalLessons,
  };
}

export async function getAdminTalents() {
  return prisma.talentProfile.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
        },
      },
      experience: {
        orderBy: { startDate: "desc" },
      },
      education: {
        orderBy: { startYear: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminCompanies() {
  return prisma.companyProfile.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
