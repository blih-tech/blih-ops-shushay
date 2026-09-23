import { Router } from "express";
import {
  requireAuth,
  requireRole,
  requireCourseEnrollment,
} from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { Role } from "@prisma/client";
import {
  createCourseSchema,
  updateCourseSchema,
  createLessonSchema,
  updateLessonSchema,
  reorderLessonsSchema,
  upsertQuizSchema,
  upsertAssignmentSchema,
} from "./course.schemas";
import {
  listCoursesAdmin,
  getCourseAdmin,
  createCourse,
  updateCourse,
  deleteCourse,
  publishCourse,
  unpublishCourse,
  listCoursesPublic,
  getCoursePublic,
  getCourseProtected,
  createLesson,
  updateLesson,
  deleteLesson,
  reorderLessons,
  uploadLessonVideo,
  deleteLessonVideo,
  uploadLessonDocument,
  deleteLessonDocument,
  upsertQuiz,
  upsertAssignment,
} from "./course.controller";

const router = Router();

// ─── Public routes (no auth) ──────────────────────────────────────────────────

router.get("/", listCoursesPublic);
router.get("/public/:courseId", getCoursePublic);

// ─── Enrolled Learner route (requires auth + enrollment in this course) ─────────

router.get(
  "/:courseId/learn",
  requireAuth,
  requireCourseEnrollment,
  getCourseProtected,
);

// ─── Admin routes ─────────────────────────────────────────────────────────────

const adminAuth = [requireAuth, requireRole([Role.ADMIN])];

router.get("/admin", ...adminAuth, listCoursesAdmin);
router.get("/admin/:courseId", ...adminAuth, getCourseAdmin);
router.post("/", ...adminAuth, validate(createCourseSchema), createCourse);
router.patch(
  "/:courseId",
  ...adminAuth,
  validate(updateCourseSchema),
  updateCourse,
);
router.delete("/:courseId", ...adminAuth, deleteCourse);
router.post("/:courseId/publish", ...adminAuth, publishCourse);
router.post("/:courseId/unpublish", ...adminAuth, unpublishCourse);

// Lesson management
router.post(
  "/:courseId/lessons",
  ...adminAuth,
  validate(createLessonSchema),
  createLesson,
);
router.post(
  "/:courseId/lessons/reorder",
  ...adminAuth,
  validate(reorderLessonsSchema),
  reorderLessons,
);
router.patch(
  "/:courseId/lessons/:lessonId",
  ...adminAuth,
  validate(updateLessonSchema),
  updateLesson,
);
router.delete("/:courseId/lessons/:lessonId", ...adminAuth, deleteLesson);

// Lesson uploads
router.post(
  "/:courseId/lessons/:lessonId/video",
  ...adminAuth,
  uploadLessonVideo,
);
router.delete(
  "/:courseId/lessons/:lessonId/video",
  ...adminAuth,
  deleteLessonVideo,
);
router.post(
  "/:courseId/lessons/:lessonId/documents",
  ...adminAuth,
  uploadLessonDocument,
);
router.delete(
  "/:courseId/lessons/:lessonId/documents/:documentId",
  ...adminAuth,
  deleteLessonDocument,
);

// Quiz and assignment
router.put(
  "/:courseId/lessons/:lessonId/quiz",
  ...adminAuth,
  validate(upsertQuizSchema),
  upsertQuiz,
);
router.put(
  "/:courseId/lessons/:lessonId/assignment",
  ...adminAuth,
  validate(upsertAssignmentSchema),
  upsertAssignment,
);

export default router;
