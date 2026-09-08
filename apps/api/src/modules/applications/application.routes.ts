import { Router } from "express";
import { Role } from "@prisma/client";
import { requireAuth, requireRole } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { createApplicationSchema, updateApplicationStatusSchema } from "./application.schemas";
import {
  applyToJob,
  getTalentApplications,
  getJobApplications,
  updateApplicationStatus,
} from "./application.controller";

const router = Router();

/**
 * @openapi
 * /applications:
 *   post:
 *     summary: Apply to an active job (Talent only)
 *     tags: [Job Applications]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [jobId]
 *             properties:
 *               jobId: { type: string }
 *               coverLetter: { type: string }
 *     responses:
 *       201: { description: Application submitted successfully }
 *       400: { description: Job closed or invalid payload }
 *       409: { description: Duplicate application }
 */
router.post(
  "/",
  requireAuth,
  requireRole([Role.TALENT]),
  validate(createApplicationSchema),
  applyToJob,
);

/**
 * @openapi
 * /applications/mine:
 *   get:
 *     summary: List current talent's submitted applications
 *     tags: [Job Applications]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200: { description: Array of applications for talent }
 */
router.get(
  "/mine",
  requireAuth,
  requireRole([Role.TALENT]),
  getTalentApplications,
);

/**
 * @openapi
 * /applications/job/{jobId}:
 *   get:
 *     summary: List applications for a specific company job (Company only)
 *     tags: [Job Applications]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Array of candidate applications }
 *       403: { description: Access denied - Not job owner }
 */
router.get(
  "/job/:jobId",
  requireAuth,
  requireRole([Role.COMPANY]),
  getJobApplications,
);

/**
 * @openapi
 * /applications/{id}/status:
 *   patch:
 *     summary: Update application status Applied -> Reviewing (Company only)
 *     tags: [Job Applications]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [IN_REVIEW] }
 *     responses:
 *       200: { description: Application status updated to IN_REVIEW }
 *       400: { description: Invalid status transition }
 *       403: { description: Access denied - Not job owner }
 */
router.patch(
  "/:id/status",
  requireAuth,
  requireRole([Role.COMPANY]),
  validate(updateApplicationStatusSchema),
  updateApplicationStatus,
);

export default router;


