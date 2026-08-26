import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
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
  publishCourse,
  unpublishCourse,
  listCoursesPublic,
  getCoursePublic,
  createLesson,
  updateLesson,
  deleteLesson,
  reorderLessons,
  uploadLessonVideo,
  uploadLessonDocument,
  deleteLessonDocument,
  upsertQuiz,
  upsertAssignment,
} from "./course.controller";

const router = Router();

// ─── Public routes (no auth) ──────────────────────────────────────────────────

router.get("/", listCoursesPublic);
router.get("/public/:courseId", getCoursePublic);

// ─── Admin routes ─────────────────────────────────────────────────────────────

const adminAuth = [requireAuth, requireRole([Role.ADMIN])];

router.get("/admin", ...adminAuth, listCoursesAdmin);
router.get("/admin/:courseId", ...adminAuth, getCourseAdmin);
router.post("/", ...adminAuth, validate(createCourseSchema), createCourse);
router.patch("/:courseId", ...adminAuth, validate(updateCourseSchema), updateCourse);
router.post("/:courseId/publish", ...adminAuth, publishCourse);
router.post("/:courseId/unpublish", ...adminAuth, unpublishCourse);

// Lesson management
router.post("/:courseId/lessons", ...adminAuth, validate(createLessonSchema), createLesson);
router.post("/:courseId/lessons/reorder", ...adminAuth, validate(reorderLessonsSchema), reorderLessons);
router.patch("/:courseId/lessons/:lessonId", ...adminAuth, validate(updateLessonSchema), updateLesson);
router.delete("/:courseId/lessons/:lessonId", ...adminAuth, deleteLesson);


// Lesson uploads
router.post("/:courseId/lessons/:lessonId/video", ...adminAuth, uploadLessonVideo);
router.post("/:courseId/lessons/:lessonId/documents", ...adminAuth, uploadLessonDocument);
router.delete("/:courseId/lessons/:lessonId/documents/:documentId", ...adminAuth, deleteLessonDocument);

// Quiz and assignment
router.put("/:courseId/lessons/:lessonId/quiz", ...adminAuth, validate(upsertQuizSchema), upsertQuiz);
router.put("/:courseId/lessons/:lessonId/assignment", ...adminAuth, validate(upsertAssignmentSchema), upsertAssignment);

export default router;
