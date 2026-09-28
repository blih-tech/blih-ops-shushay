import { Router } from "express";
import * as learningController from "./learning.controller";
import { requireAuth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  markLessonCompleteSchema,
  saveLessonPositionSchema,
  submitQuizSchema,
} from "./learning.schemas";

const router = Router();

// All learning routes require authentication
router.use(requireAuth);

/**
 * @openapi
 * /learning/lesson/complete:
 *   post:
 *     summary: Mark a lesson as completed
 *     tags: [Learning]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [lessonId]
 *             properties:
 *               lessonId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lesson progress recorded
 */
router.post(
  "/lesson/complete",
  validate(markLessonCompleteSchema),
  learningController.markLessonComplete,
);

/**
 * @openapi
 * /learning/lesson/position:
 *   post:
 *     summary: Save video playback timestamp position for a lesson
 *     tags: [Learning]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [lessonId, lastPosition]
 *             properties:
 *               lessonId:
 *                 type: string
 *               lastPosition:
 *                 type: number
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Video position saved
 */
router.post(
  "/lesson/position",
  validate(saveLessonPositionSchema),
  learningController.saveLessonPosition,
);

/**
 * @openapi
 * /learning/quiz/submit:
 *   post:
 *     summary: Submit quiz answers for a lesson
 *     tags: [Learning]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [lessonId, answers]
 *             properties:
 *               lessonId:
 *                 type: string
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Quiz evaluated and score returned
 */
router.post(
  "/quiz/submit",
  validate(submitQuizSchema),
  learningController.submitQuiz,
);

/**
 * @openapi
 * /learning/assignment/submit:
 *   post:
 *     summary: Submit assignment solution files or github URL
 *     tags: [Learning]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Assignment submitted successfully
 */
router.post(
  "/assignment/submit",
  learningController.submitAssignmentFiles,
  learningController.submitAssignment,
);

/**
 * @openapi
 * /learning/progress/{courseId}:
 *   get:
 *     summary: Get user progress for a specific course
 *     tags: [Learning]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course completion progress percentage and completed lesson IDs
 */
router.get("/progress/:courseId", learningController.getCourseProgress);

export default router;
