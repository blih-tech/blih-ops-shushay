import prisma from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import {
  CreateCourseInput,
  UpdateCourseInput,
  CreateLessonInput,
  UpdateLessonInput,
  ReorderLessonsInput,
  UpsertQuizInput,
  UpsertAssignmentInput,
} from "./course.schemas";

// ─── Admin selects ────────────────────────────────────────────────────────────

const lessonWithContentSelect = {
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function assertCourseExists(id: string) {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new AppError(404, "Course not found");
  return course;
}

async function assertLessonBelongsToCourse(courseId: string, lessonId: string) {
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) throw new AppError(404, "Lesson not found");
  if (lesson.courseId !== courseId)
    throw new AppError(404, "Lesson not found in this course");
  return lesson;
}

async function nextLessonOrder(courseId: string): Promise<number> {
  const last = await prisma.lesson.findFirst({
    where: { courseId },
    orderBy: { order: "desc" },
    select: { order: true },
  });
  return last ? last.order + 1 : 0;
}

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
    include: {
      lessons: {
        orderBy: { order: "asc" },
        select: lessonWithContentSelect,
      },
    },
  });
}

export async function createCourse(data: CreateCourseInput) {
  return prisma.course.create({ data });
}

export async function updateCourse(id: string, data: UpdateCourseInput) {
  await assertCourseExists(id);
  return prisma.course.update({ where: { id }, data });
}

export async function publishCourse(id: string) {
  await assertCourseExists(id);
  return prisma.course.update({ where: { id }, data: { status: "PUBLISHED" } });
}

export async function unpublishCourse(id: string) {
  await assertCourseExists(id);
  return prisma.course.update({ where: { id }, data: { status: "DRAFT" } });
}

export async function deleteCourse(id: string) {
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      lessons: {
        select: {
          videoUrl: true,
          videoPublicId: true,
          documents: { select: { url: true, publicId: true } },
        },
      },
    },
  });
  if (!course) throw new AppError(404, "Course not found");

  await prisma.course.delete({ where: { id } });

  const videos = course.lessons
    .filter((l) => l.videoUrl && l.videoPublicId)
    .map((l) => ({ url: l.videoUrl!, publicId: l.videoPublicId! }));

  const documents: { url: string; publicId: string | null }[] = [];
  for (const lesson of course.lessons) {
    for (const doc of lesson.documents) {
      documents.push({ url: doc.url, publicId: doc.publicId });
    }
  }

  return { success: true, videos, documents };
}

// ─── Courses (public) ─────────────────────────────────────────────────────────

export async function listCoursesPublic() {
  return prisma.course.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { updatedAt: "desc" },
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
  const course = await prisma.course.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      lessons: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          order: true,
          // Indicate presence of content types without exposing admin-only data
          videoUrl: true,
          documents: { select: { id: true, name: true } },
          quiz: { select: { id: true, title: true } },
          assignment: { select: { id: true, title: true } },
        },
      },
    },
  });

  if (!course || course.status !== "PUBLISHED") {
    throw new AppError(404, "Course not found");
  }

  // Strip status from public response
  const { status: _status, ...publicCourse } = course;
  return publicCourse;
}

export async function getCourseProtected(id: string) {
  const course = await prisma.course.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      lessons: {
        orderBy: { order: "asc" },
        select: lessonWithContentSelect,
      },
    },
  });

  if (!course || course.status !== "PUBLISHED") {
    throw new AppError(404, "Course not found");
  }

  const { status: _status, ...protectedCourse } = course;
  return protectedCourse;
}


// ─── Lessons ──────────────────────────────────────────────────────────────────

export async function createLesson(courseId: string, data: CreateLessonInput) {
  await assertCourseExists(courseId);
  const order = await nextLessonOrder(courseId);
  return prisma.lesson.create({
    data: { courseId, title: data.title, content: data.content ?? null, order },
    select: lessonWithContentSelect,
  });
}

export async function updateLesson(
  courseId: string,
  lessonId: string,
  data: UpdateLessonInput,
) {
  await assertLessonBelongsToCourse(courseId, lessonId);
  return prisma.lesson.update({
    where: { id: lessonId },
    data: {
      title: data.title !== undefined ? data.title : undefined,
      content: data.content !== undefined ? data.content : undefined,
    },
    select: lessonWithContentSelect,
  });
}

export async function deleteLesson(courseId: string, lessonId: string) {
  await assertLessonBelongsToCourse(courseId, lessonId);
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      videoUrl: true,
      videoPublicId: true,
      documents: { select: { url: true, publicId: true } },
    },
  });
  if (!lesson) throw new AppError(404, "Lesson not found");
  await prisma.lesson.delete({ where: { id: lessonId } });
  return {
    success: true,
    videoUrl: lesson.videoUrl,
    videoPublicId: lesson.videoPublicId,
    documents: lesson.documents.map((d) => ({
      url: d.url,
      publicId: d.publicId,
    })),
  };
}

export async function reorderLessons(
  courseId: string,
  data: ReorderLessonsInput,
) {
  await assertCourseExists(courseId);

  // Validate all provided IDs belong to this course
  const existingLessons = await prisma.lesson.findMany({
    where: { courseId },
    select: { id: true },
  });
  const existingIds = new Set(existingLessons.map((l) => l.id));
  for (const item of data.lessons) {
    if (!existingIds.has(item.id)) {
      throw new AppError(
        400,
        `Lesson ${item.id} does not belong to this course`,
      );
    }
  }

  // Batch update
  await prisma.$transaction(
    data.lessons.map((item) =>
      prisma.lesson.update({
        where: { id: item.id },
        data: { order: item.order },
      }),
    ),
  );

  // Return ordered lessons
  return prisma.lesson.findMany({
    where: { courseId },
    orderBy: { order: "asc" },
    select: lessonWithContentSelect,
  });
}

// ─── Uploads ──────────────────────────────────────────────────────────────────

export async function setLessonVideo(
  courseId: string,
  lessonId: string,
  videoUrl: string | null,
  videoPublicId: string | null = null,
) {
  await assertLessonBelongsToCourse(courseId, lessonId);
  return prisma.lesson.update({
    where: { id: lessonId },
    data: { videoUrl, videoPublicId },
    select: lessonWithContentSelect,
  });
}

export async function addLessonDocument(
  courseId: string,
  lessonId: string,
  name: string,
  url: string,
  publicId: string | null = null,
) {
  await assertLessonBelongsToCourse(courseId, lessonId);
  return prisma.lessonDocument.create({
    data: { lessonId, name, url, publicId },
    select: { id: true, name: true, url: true, createdAt: true },
  });
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
  if (!doc || doc.lessonId !== lessonId)
    throw new AppError(404, "Document not found");
  await prisma.lessonDocument.delete({ where: { id: documentId } });
  return { success: true, url: doc.url, publicId: doc.publicId };
}

export async function deleteLessonVideo(courseId: string, lessonId: string) {
  await assertLessonBelongsToCourse(courseId, lessonId);
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { videoUrl: true, videoPublicId: true },
  });
  if (!lesson) throw new AppError(404, "Lesson not found");

  await prisma.lesson.update({
    where: { id: lessonId },
    data: { videoUrl: null, videoPublicId: null },
  });

  return {
    success: true,
    videoUrl: lesson.videoUrl,
    videoPublicId: lesson.videoPublicId,
  };
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export async function upsertQuiz(
  courseId: string,
  lessonId: string,
  data: UpsertQuizInput,
) {
  await assertLessonBelongsToCourse(courseId, lessonId);
  return prisma.quiz.upsert({
    where: { lessonId },
    create: { lessonId, title: data.title, questions: data.questions },
    update: { title: data.title, questions: data.questions },
  });
}

// ─── Assignment ───────────────────────────────────────────────────────────────

export async function upsertAssignment(
  courseId: string,
  lessonId: string,
  data: UpsertAssignmentInput,
) {
  await assertLessonBelongsToCourse(courseId, lessonId);
  return prisma.assignment.upsert({
    where: { lessonId },
    create: { lessonId, title: data.title, instructions: data.instructions },
    update: { title: data.title, instructions: data.instructions },
  });
}
