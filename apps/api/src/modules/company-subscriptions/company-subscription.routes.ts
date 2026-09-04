import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { Role } from "@prisma/client";
import { initializeSubscriptionSchema } from "./company-subscription.schemas";
import {
  initializeCompanySubscription,
  getCompanySubscriptionStatus,
} from "./company-subscription.controller";

const router = Router();

router.use(requireAuth);
router.use(requireRole([Role.COMPANY]));

router.post(
  "/initialize",
  validate(initializeSubscriptionSchema),
  initializeCompanySubscription,
);
router.get("/status", getCompanySubscriptionStatus);

export default router;
