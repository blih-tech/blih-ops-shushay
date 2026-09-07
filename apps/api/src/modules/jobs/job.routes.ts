import { Router } from "express";
import { Role } from "@prisma/client";
import {
  requireAuth,
  requireRole,
  requireActiveSubscription,
} from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  createJobSchema,
  updateJobSchema,
} from "./job.schemas";
import {
  createJob,
  getCompanyJobs,
  getJobById,
  updateJob,
  closeJob,
  listActiveJobs,
} from "./job.controller";

const router = Router();

// Publicly searchable / viewable for authenticated users
router.get("/", requireAuth, listActiveJobs);

// Company-specific jobs list (must be defined before /:jobId)
router.get("/company/mine", requireAuth, requireRole([Role.COMPANY]), getCompanyJobs);

// Create job requires COMPANY role + active subscription
router.post(
  "/",
  requireAuth,
  requireRole([Role.COMPANY]),
  requireActiveSubscription,
  validate(createJobSchema),
  createJob,
);

// View job details
router.get("/:jobId", requireAuth, getJobById);

// Update own job requires COMPANY role + active subscription
router.patch(
  "/:jobId",
  requireAuth,
  requireRole([Role.COMPANY]),
  requireActiveSubscription,
  validate(updateJobSchema),
  updateJob,
);

// Close own job requires COMPANY role
router.post(
  "/:jobId/close",
  requireAuth,
  requireRole([Role.COMPANY]),
  closeJob,
);

export default router;
