import { Router } from "express";
import * as learningController from "./learning.controller";
import { requireAuth, requireSkillsAccess } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  markLessonCompleteSchema,
  submitQuizSchema,
} from "./learning.schemas";

const router = Router();

// All learning routes require authentication and Skills access
router.use(requireAuth);
router.use(requireSkillsAccess);

router.post(
  "/lesson/complete",
  validate(markLessonCompleteSchema),
  learningController.markLessonComplete,
);

router.post(
  "/quiz/submit",
  validate(submitQuizSchema),
  learningController.submitQuiz,
);

router.post(
  "/assignment/submit",
  learningController.submitAssignmentFiles,
  learningController.submitAssignment,
);

router.get("/progress/:courseId", learningController.getCourseProgress);

export default router;
