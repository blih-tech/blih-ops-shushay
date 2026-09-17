import { Router } from "express";
import { Role } from "@prisma/client";
import {
  requireAuth,
  requireRole,
  requireActiveSubscription,
} from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { createJobSchema, updateJobSchema } from "./job.schemas";
import {
  createJob,
  getCompanyJobs,
  getJobById,
  updateJob,
  closeJob,
  reopenJob,
  listActiveJobs,
} from "./job.controller";

const router = Router();

/**
 * @openapi
 * /jobs:
 *   get:
 *     summary: List and search active job postings
 *     tags: [Jobs]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200: { description: List of active job postings }
 *   post:
 *     summary: Create new job posting (Company with active subscription only)
 *     tags: [Jobs]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, employmentType, experienceLevel]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               requiredSkills: { type: array, items: { type: string } }
 *               employmentType: { type: string, enum: [FULL_TIME, PART_TIME, CONTRACT, FREELANCE, INTERNSHIP] }
 *               experienceLevel: { type: string, enum: [ENTRY, MID, SENIOR, LEAD, EXECUTIVE] }
 *     responses:
 *       201: { description: Job created successfully }
 *       402: { description: Payment required - Active subscription needed }
 */
router.get("/", requireAuth, listActiveJobs);

/**
 * @openapi
 * /jobs/company/mine:
 *   get:
 *     summary: List job postings for current company
 *     tags: [Jobs]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200: { description: Array of jobs belonging to company }
 */
router.get(
  "/company/mine",
  requireAuth,
  requireRole([Role.COMPANY]),
  getCompanyJobs,
);

router.post(
  "/",
  requireAuth,
  requireRole([Role.COMPANY]),
  requireActiveSubscription,
  validate(createJobSchema),
  createJob,
);

/**
 * @openapi
 * /jobs/{jobId}:
 *   get:
 *     summary: Get job details by ID
 *     tags: [Jobs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Job detail record }
 *       404: { description: Job not found }
 *   patch:
 *     summary: Update job posting (Company with active subscription only)
 *     tags: [Jobs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Job updated successfully }
 *       400: { description: Closed jobs cannot be edited }
 */
router.get("/:jobId", requireAuth, getJobById);

router.patch(
  "/:jobId",
  requireAuth,
  requireRole([Role.COMPANY]),
  requireActiveSubscription,
  validate(updateJobSchema),
  updateJob,
);

/**
 * @openapi
 * /jobs/{jobId}/close:
 *   post:
 *     summary: Close job posting (Company only)
 *     tags: [Jobs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Job closed successfully }
 */
router.post(
  "/:jobId/close",
  requireAuth,
  requireRole([Role.COMPANY]),
  closeJob,
);

/**
 * @openapi
 * /jobs/{jobId}/reopen:
 *   post:
 *     summary: Reopen a closed job posting (Company with active subscription only)
 *     tags: [Jobs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Job reopened successfully with a new 30-day deadline }
 *       400: { description: Job is not closed }
 *       403: { description: Not authorized }
 */
router.post(
  "/:jobId/reopen",
  requireAuth,
  requireRole([Role.COMPANY]),
  requireActiveSubscription,
  reopenJob,
);

export default router;
