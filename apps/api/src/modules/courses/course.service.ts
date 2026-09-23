import prisma from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import {
  CreateCourseInput,
  UpdateCourseInput,
  CreateLessonInput,
  UpdateLessonInput,
  ReorderLessonsInput,
} from "./course.schemas";
import {
  lessonWithContentSelect,
  assertCourseExists,
  assertLessonBelongsToCourse,
  nextLessonOrder,
} from "./course.queries";

export { upsertQuiz, upsertAssignment } from "./courseQuizAssignment.service";

// ─── Courses (admin) ──────────────────────────────────────────────────────────

export async function listCoursesAdmin() {
  return prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { lessons: true } },
    },
  });
}

export async function getCourseAdmin(id: string) {
  await assertCourseExists(id);
  return prisma.course.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      lessons: {
        select: lessonWithContentSelect,
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function createCourse(data: CreateCourseInput) {
  return prisma.course.create({
    data: {
      title: data.title.trim(),
      description: data.description.trim(),
      price: data.price ?? 1000,
      status: "DRAFT",
    },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function updateCourse(id: string, data: UpdateCourseInput) {
  await assertCourseExists(id);
  const updateData: { title?: string; description?: string; price?: number } = {};
  if (data.title !== undefined) updateData.title = data.title.trim();
  if (data.description !== undefined)
    updateData.description = data.description.trim();
  if (data.price !== undefined) updateData.price = data.price;

  return prisma.course.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function publishCourse(id: string) {
  const course = await getCourseAdmin(id);
  if (!course) throw new AppError(404, "Course not found");
  if (course.lessons.length === 0) {
    throw new AppError(400, "Cannot publish a course with no lessons");
  }

  return prisma.course.update({
    where: { id },
    data: { status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      updatedAt: true,
    },
  });
}

export async function unpublishCourse(id: string) {
  await assertCourseExists(id);
  return prisma.course.update({
    where: { id },
    data: { status: "DRAFT" },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      updatedAt: true,
    },
  });
}

export async function deleteCourse(id: string) {
  await assertCourseExists(id);
  return prisma.course.delete({ where: { id } });
}

// ─── Courses (public) ─────────────────────────────────────────────────────────

export async function listCoursesPublic() {
  return prisma.course.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { lessons: true } },
    },
  });
}

export async function getCoursePublic(id: string) {
  const course = await prisma.course.findFirst({
    where: { id, status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      lessons: {
        select: { id: true, title: true, order: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) throw new AppError(404, "Course not found");
  return course;
}

export async function getCourseProtected(id: string) {
  const course = await prisma.course.findFirst({
    where: { id, status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      lessons: {
        select: lessonWithContentSelect,
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) throw new AppError(404, "Course not found or not published");
  return course;
}

// ─── Lessons (admin) ──────────────────────────────────────────────────────────

export async function createLesson(courseId: string, data: CreateLessonInput) {
  await assertCourseExists(courseId);
  const order = await nextLessonOrder(courseId);

  return prisma.lesson.create({
    data: {
      courseId,
      title: data.title.trim(),
      content: data.content?.trim() || null,
      order,
    },
    select: lessonWithContentSelect,
  });
}

export async function updateLesson(
  courseId: string,
  lessonId: string,
  data: UpdateLessonInput,
) {
  await assertLessonBelongsToCourse(courseId, lessonId);

  const updateData: { title?: string; content?: string | null } = {};
  if (data.title !== undefined) updateData.title = data.title.trim();
  if (data.content !== undefined)
    updateData.content = data.content?.trim() || null;

  return prisma.lesson.update({
    where: { id: lessonId },
    data: updateData,
    select: lessonWithContentSelect,
  });
}

export async function deleteLesson(courseId: string, lessonId: string) {
  const lesson = await assertLessonBelongsToCourse(courseId, lessonId);

  const documents = await prisma.lessonDocument.findMany({
    where: { lessonId },
    select: { url: true, publicId: true },
  });

  await prisma.lesson.delete({ where: { id: lessonId } });

  return {
    videoUrl: lesson.videoUrl,
    videoPublicId: lesson.videoPublicId,
    documents,
  };
}

export async function reorderLessons(
  courseId: string,
  data: ReorderLessonsInput,
) {
  await assertCourseExists(courseId);

  const existingLessons = await prisma.lesson.findMany({
    where: { courseId },
    select: { id: true },
  });
  const existingIds = new Set(existingLessons.map((l) => l.id));

  for (const item of data.lessons) {
    if (!existingIds.has(item.id)) {
      throw new AppError(
        400,
        `Lesson ${item.id} does not belong to course ${courseId}`,
      );
    }
  }

  await prisma.$transaction(
    data.lessons.map((item: { id: string; order: number }) =>
      prisma.lesson.update({
        where: { id: item.id },
        data: { order: item.order },
      }),
    ),
  );

  return getCourseAdmin(courseId);
}

export async function setLessonVideo(
  courseId: string,
  lessonId: string,
  videoUrl: string,
  videoPublicId: string,
) {
  await assertLessonBelongsToCourse(courseId, lessonId);

  return prisma.lesson.update({
    where: { id: lessonId },
    data: { videoUrl, videoPublicId },
    select: lessonWithContentSelect,
  });
}

export async function deleteLessonVideo(courseId: string, lessonId: string) {
  const lesson = await assertLessonBelongsToCourse(courseId, lessonId);

  await prisma.lesson.update({
    where: { id: lessonId },
    data: { videoUrl: null, videoPublicId: null },
  });

  return {
    videoUrl: lesson.videoUrl,
    videoPublicId: lesson.videoPublicId,
  };
}

export async function addLessonDocument(
  courseId: string,
  lessonId: string,
  name: string,
  url: string,
  publicId: string,
) {
  await assertLessonBelongsToCourse(courseId, lessonId);

  await prisma.lessonDocument.create({
    data: { lessonId, name: name.trim(), url, publicId },
  });

  return getCourseAdmin(courseId);
}

export async function deleteLessonDocument(
  courseId: string,
  lessonId: string,
  documentId: string,
) {
  await assertLessonBelongsToCourse(courseId, lessonId);

  const doc = await prisma.lessonDocument.findUnique({
    where: { id: documentId },
  });
  if (!doc || doc.lessonId !== lessonId) {
    throw new AppError(404, "Document not found in this lesson");
  }

  await prisma.lessonDocument.delete({ where: { id: documentId } });

  return { url: doc.url, publicId: doc.publicId };
}
