import prisma from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";

export const lessonWithContentSelect = {
  id: true,
  courseId: true,
  title: true,
  content: true,
  order: true,
  videoUrl: true,
  videoPublicId: true,
  createdAt: true,
  updatedAt: true,
  documents: {
    select: {
      id: true,
      name: true,
      url: true,
      publicId: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" as const },
  },
  quiz: {
    select: {
      id: true,
      title: true,
      questions: true,
      createdAt: true,
      updatedAt: true,
    },
  },
  assignment: {
    select: {
      id: true,
      title: true,
      instructions: true,
      createdAt: true,
      updatedAt: true,
    },
  },
};

export async function assertCourseExists(id: string) {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new AppError(404, "Course not found");
  return course;
}

export async function assertLessonBelongsToCourse(courseId: string, lessonId: string) {
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) throw new AppError(404, "Lesson not found");
  if (lesson.courseId !== courseId)
    throw new AppError(404, "Lesson not found in this course");
  return lesson;
}

export async function nextLessonOrder(courseId: string): Promise<number> {
  const last = await prisma.lesson.findFirst({
    where: { courseId },
    orderBy: { order: "desc" },
    select: { order: true },
  });
  return last ? last.order + 1 : 0;
}
