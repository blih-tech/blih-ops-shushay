import { z } from "zod";

// --- Course ------------------------------------------------------------------

export const createCourseSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be at most 200 characters"),
  description: z.string().trim().min(1, "Description is required").max(2000, "Description must be at most 2000 characters"),
});

export const updateCourseSchema = createCourseSchema.partial();

// --- Lesson -------------------------------------------------------------------

export const createLessonSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be at most 200 characters"),
  content: z.string().trim().optional().nullable(),
});

export const updateLessonSchema = z.object({
  title: z.string().trim().min(1, "Title cannot be empty").max(200, "Title must be at most 200 characters").optional(),
  content: z.string().trim().optional().nullable(),
});

export const reorderLessonsSchema = z.object({
  lessons: z.array(
    z.object({
      id: z.string().min(1, "Lesson ID is required"),
      order: z.number().int().min(0, "Order must be a non-negative integer"),
    })
  ).min(1, "At least one lesson entry is required"),
});

// --- Quiz ---------------------------------------------------------------------

const quizQuestionSchema = z.object({
  text: z.string().trim().min(1, "Question text is required"),
  options: z.array(z.string().trim().min(1, "Option cannot be empty")).min(2, "At least 2 options required").max(6, "At most 6 options allowed"),
  correctOptionIndex: z.number().int().min(0, "Correct option index must be non-negative"),
}).refine(
  (q) => q.correctOptionIndex < q.options.length,
  { message: "correctOptionIndex must be within the options array bounds", path: ["correctOptionIndex"] }
);

export const upsertQuizSchema = z.object({
  title: z.string().trim().min(1, "Quiz title is required").max(200, "Quiz title must be at most 200 characters"),
  questions: z.array(quizQuestionSchema).min(1, "At least one question is required"),
});

// --- Assignment ---------------------------------------------------------------

export const upsertAssignmentSchema = z.object({
  title: z.string().trim().min(1, "Assignment title is required").max(200, "Assignment title must be at most 200 characters"),
  instructions: z.string().trim().min(1, "Instructions are required"),
});

// --- Inferred Types ------------------------------------------------------------

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;
export type ReorderLessonsInput = z.infer<typeof reorderLessonsSchema>;
export type UpsertQuizInput = z.infer<typeof upsertQuizSchema>;
export type UpsertAssignmentInput = z.infer<typeof upsertAssignmentSchema>;
