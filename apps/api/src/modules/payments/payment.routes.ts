import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  initializeSkillsPaymentSchema,
  verifyPaymentSchema,
} from "./payment.schemas";
import {
  initializeSkillsPayment,
  verifyPayment,
  chapaWebhook,
  getSkillsAccessStatus,
  listUserPayments,
} from "./payment.controller";

const router = Router();

// Public webhook endpoint for Chapa server-to-server notifications
router.post("/webhook", chapaWebhook);
router.get("/webhook", chapaWebhook);

// Protected payment endpoints
router.post(
  "/skills/initialize",
  requireAuth,
  validate(initializeSkillsPaymentSchema),
  initializeSkillsPayment,
);

router.get("/skills/access-status", requireAuth, getSkillsAccessStatus);
router.get("/history", requireAuth, listUserPayments);

router.get("/verify/:txRef", requireAuth, verifyPayment);
router.post("/verify", requireAuth, validate(verifyPaymentSchema), verifyPayment);

export default router;
