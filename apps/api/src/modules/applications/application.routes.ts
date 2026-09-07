import { Router } from "express";
import { Role } from "@prisma/client";
import { requireAuth, requireRole } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { createApplicationSchema } from "./application.schemas";
import {
  applyToJob,
  getTalentApplications,
  getJobApplications,
} from "./application.controller";

const router = Router();

// Apply to a job (Talent only)
router.post(
  "/",
  requireAuth,
  requireRole([Role.TALENT]),
  validate(createApplicationSchema),
  applyToJob,
);

// View talent's own submitted applications
router.get(
  "/mine",
  requireAuth,
  requireRole([Role.TALENT]),
  getTalentApplications,
);

// View applications for a specific job (Company only)
router.get(
  "/job/:jobId",
  requireAuth,
  requireRole([Role.COMPANY]),
  getJobApplications,
);

export default router;
