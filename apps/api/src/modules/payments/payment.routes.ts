import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  initializeCoursePaymentSchema,
  verifyPaymentSchema,
} from "./payment.schemas";
import {
  initializeCoursePayment,
  verifyPayment,
  chapaWebhook,
  getCourseAccessStatus,
  getUserEnrollments,
  listUserPayments,
} from "./payment.controller";

const router = Router();

// Public webhook endpoint for Chapa server-to-server POST notifications only
router.post("/webhook", chapaWebhook);

// Protected payment endpoints
router.post(
  "/courses/enroll",
  requireAuth,
  validate(initializeCoursePaymentSchema),
  initializeCoursePayment,
);

/**
 * @openapi
 * /payments/courses/{courseId}/access-status:
 *   get:
 *     summary: Check if the authenticated user is enrolled in a specific course
 *     tags: [Payments]
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
 *         description: Access status for the course
 */
router.get("/courses/:courseId/access-status", requireAuth, getCourseAccessStatus);

/**
 * @openapi
 * /payments/enrollments:
 *   get:
 *     summary: List all courses the authenticated user is enrolled in
 *     tags: [Payments]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Array of enrollments with course info
 */
router.get("/enrollments", requireAuth, getUserEnrollments);

router.get("/history", requireAuth, listUserPayments);

router.get("/verify/:txRef", requireAuth, verifyPayment);
router.post(
  "/verify",
  requireAuth,
  validate(verifyPaymentSchema),
  verifyPayment,
);

export default router;
