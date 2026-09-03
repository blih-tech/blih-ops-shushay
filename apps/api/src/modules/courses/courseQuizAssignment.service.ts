import prisma from "../../config/prisma";
import { UpsertQuizInput, UpsertAssignmentInput } from "./course.schemas";
import { assertLessonBelongsToCourse } from "./course.queries";

export async function upsertQuiz(
  courseId: string,
  lessonId: string,
  data: UpsertQuizInput,
) {
  await assertLessonBelongsToCourse(courseId, lessonId);

  return prisma.quiz.upsert({
    where: { lessonId },
    create: {
      lessonId,
      title: data.title.trim(),
      questions: JSON.parse(JSON.stringify(data.questions)),
    },
    update: {
      title: data.title.trim(),
      questions: JSON.parse(JSON.stringify(data.questions)),
    },
    select: {
      id: true,
      title: true,
      questions: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function upsertAssignment(
  courseId: string,
  lessonId: string,
  data: UpsertAssignmentInput,
) {
  await assertLessonBelongsToCourse(courseId, lessonId);

  return prisma.assignment.upsert({
    where: { lessonId },
    create: {
      lessonId,
      title: data.title.trim(),
      instructions: data.instructions.trim(),
    },
    update: {
      title: data.title.trim(),
      instructions: data.instructions.trim(),
    },
    select: {
      id: true,
      title: true,
      instructions: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
