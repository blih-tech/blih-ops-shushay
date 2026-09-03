import { z } from "zod";

export const markLessonCompleteSchema = z.object({
  lessonId: z.string(),
});

export type MarkLessonCompleteInput = z.infer<typeof markLessonCompleteSchema>;

export const submitQuizSchema = z.object({
  quizId: z.string(),
  answers: z.array(z.number()), // Array of selected option indices
});

export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;

export const submitAssignmentSchema = z.object({
  assignmentId: z.string(),
  content: z.string().optional(),
});

export type SubmitAssignmentInput = z.infer<typeof submitAssignmentSchema>;
