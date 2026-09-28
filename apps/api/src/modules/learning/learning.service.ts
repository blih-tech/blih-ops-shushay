import prisma from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";
import {
  SubmitQuizInput,
  SubmitAssignmentInput,
  SaveLessonPositionInput,
} from "./learning.schemas";
import { enqueuePdfGeneration } from "../../services/queue.service";

/** Typed shape of a single quiz question stored in the Prisma JSON field. */
interface QuizQuestion {
  question: string;
  options: string[];
  correctOptionIndex: number;
}

/**
 * Verifies that a user (non-admin) is enrolled in the given course.
 * Admins are always allowed through.
 */
async function assertEnrolled(userId: string, courseId: string, userRole?: string) {
  if (userRole === "ADMIN") return;
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (!enrollment) {
    throw new AppError(
      403,
      "Course enrollment required. Please purchase access to this course.",
    );
  }
}

export async function markLessonComplete(userId: string, lessonId: string, userRole?: string) {
  // Verify lesson exists
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { quiz: true, assignment: true },
  });

  if (!lesson) {
    throw new AppError(404, "Lesson not found");
  }

  // Verify user is enrolled in this course
  await assertEnrolled(userId, lesson.courseId, userRole);

  if (lesson.quiz || lesson.assignment) {
    throw new AppError(
      400,
      "Cannot mark lesson complete. It requires a quiz or assignment submission.",
    );
  }

  const progress = await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      },
    },
    update: {
      completed: true,
    },
    create: {
      userId,
      lessonId,
      completed: true,
    },
  });

  // Automatically check if course is completed and generate certificate
  try {
    await enqueuePdfGeneration(userId, lesson.courseId);
  } catch {}

  return progress;
}

export async function saveLessonPosition(
  userId: string,
  data: SaveLessonPositionInput,
  userRole?: string,
) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: data.lessonId },
    select: { id: true, courseId: true },
  });

  if (!lesson) {
    throw new AppError(404, "Lesson not found");
  }

  await assertEnrolled(userId, lesson.courseId, userRole);

  const progress = await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId,
        lessonId: data.lessonId,
      },
    },
    update: {
      lastPosition: data.lastPosition,
      ...(data.completed !== undefined ? { completed: data.completed } : {}),
    },
    create: {
      userId,
      lessonId: data.lessonId,
      lastPosition: data.lastPosition,
      completed: data.completed ?? false,
    },
  });

  return progress;
}

export async function submitQuiz(userId: string, data: SubmitQuizInput, userRole?: string) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: data.quizId },
    include: { lesson: true },
  });

  if (!quiz) {
    throw new AppError(404, "Quiz not found");
  }

  // Verify user is enrolled in this course
  await assertEnrolled(userId, quiz.lesson.courseId, userRole);

  // Calculate score
  const questions = quiz.questions as unknown as QuizQuestion[];

  let correctCount = 0;

  if (!Array.isArray(questions) || questions.length !== data.answers.length) {
    throw new AppError(400, "Invalid number of answers provided");
  }

  for (let i = 0; i < questions.length; i++) {
    if (questions[i].correctOptionIndex === data.answers[i]) {
      correctCount++;
    }
  }

  const score = Math.round((correctCount / questions.length) * 100);
  const passed = score >= 80;

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId,
      quizId: data.quizId,
      score,
      passed,
      answers: data.answers,
    },
  });

  if (passed) {
    // Mark lesson as complete if passed
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId: quiz.lessonId,
        },
      },
      update: {},
      create: {
        userId,
        lessonId: quiz.lessonId,
      },
    });

    // Automatically check if course is completed and generate certificate
    try {
      await enqueuePdfGeneration(userId, quiz.lesson.courseId);
    } catch {}
  }

  return attempt;
}

export async function submitAssignment(
  userId: string,
  data: SubmitAssignmentInput,
  fileInfo?: { fileUrl: string; filePublicId?: string },
  userRole?: string,
) {
  const assignment = await prisma.assignment.findUnique({
    where: { id: data.assignmentId },
    include: { lesson: true },
  });

  if (!assignment) {
    throw new AppError(404, "Assignment not found");
  }

  // Verify user is enrolled in this course
  await assertEnrolled(userId, assignment.lesson.courseId, userRole);

  if (!data.content && !fileInfo) {
    throw new AppError(400, "Must provide content or a file");
  }

  const submission = await prisma.assignmentSubmission.upsert({
    where: {
      userId_assignmentId: {
        userId,
        assignmentId: data.assignmentId,
      },
    },
    update: {
      content: data.content,
      fileUrl: fileInfo?.fileUrl,
      filePublicId: fileInfo?.filePublicId,
    },
    create: {
      userId,
      assignmentId: data.assignmentId,
      content: data.content,
      fileUrl: fileInfo?.fileUrl,
      filePublicId: fileInfo?.filePublicId,
    },
  });

  // Mark lesson as complete upon submission
  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId,
        lessonId: assignment.lessonId,
      },
    },
    update: {},
    create: {
      userId,
      lessonId: assignment.lessonId,
    },
  });

  // Automatically check if course is completed and generate certificate
  try {
    await enqueuePdfGeneration(userId, assignment.lesson.courseId);
  } catch {}

  return submission;
}

export async function getCourseProgress(userId: string, courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: {
        select: { id: true },
      },
    },
  });

  if (!course) {
    throw new AppError(404, "Course not found");
  }

  const lessonIds = course.lessons.map((l: any) => l.id);
  const totalLessons = lessonIds.length;

  if (totalLessons === 0) {
    return {
      courseId,
      completedLessons: 0,
      totalLessons: 0,
      isCompleted: false,
      progressPercentage: 0,
      completedLessonIds: [],
    };
  }

  const allProgress = await prisma.lessonProgress.findMany({
    where: {
      userId,
      lessonId: { in: lessonIds },
    },
    select: { lessonId: true, lastPosition: true, completed: true },
  });

  const completed = allProgress.filter((p) => p.completed);
  const completedCount = completed.length;
  const isCompleted = completedCount === totalLessons;

  const lessonPositions: Record<
    string,
    { lastPosition: number; completed: boolean }
  > = {};
  for (const p of allProgress) {
    lessonPositions[p.lessonId] = {
      lastPosition: p.lastPosition,
      completed: p.completed,
    };
  }

  // If completed, trigger certificate generation only when no certificate exists yet
  if (isCompleted) {
    try {
      const existingCert = await prisma.certificate.findFirst({
        where: { userId, courseId },
        select: { id: true },
      });
      if (!existingCert) {
        await enqueuePdfGeneration(userId, courseId);
      }
    } catch {}
  }

  return {
    courseId,
    completedLessons: completedCount,
    totalLessons,
    isCompleted,
    progressPercentage: Math.round((completedCount / totalLessons) * 100),
    completedLessonIds: completed.map((c: { lessonId: string }) => c.lessonId),
    lessonPositions,
  };
}
