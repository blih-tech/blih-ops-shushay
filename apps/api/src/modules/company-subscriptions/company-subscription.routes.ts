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

/**
 * @openapi
 * /company/subscription/initialize:
 *   post:
 *     summary: Initialize Chapa checkout for company subscription
 *     tags: [Company Subscriptions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [plan]
 *             properties:
 *               plan:
 *                 type: string
 *                 enum: [MONTHLY, YEARLY]
 *                 description: Subscription plan duration
 *     responses:
 *       200:
 *         description: Chapa checkout session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 checkoutUrl:
 *                   type: string
 *                 txRef:
 *                   type: string
 */
router.post(
  "/initialize",
  validate(initializeSubscriptionSchema),
  initializeCompanySubscription,
);

/**
 * @openapi
 * /company/subscription/status:
 *   get:
 *     summary: Get current company subscription status
 *     tags: [Company Subscriptions]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current subscription details and access state
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [ACTIVE, INACTIVE, EXPIRED, CANCELLED]
 *                 expiresAt:
 *                   type: string
 *                   format: date-time
 *                 isSubscriber:
 *                   type: boolean
 */
router.get("/status", getCompanySubscriptionStatus);

export default router;
