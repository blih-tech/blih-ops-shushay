import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { getUserNotifications, markAsRead } from "./notification.controller";

const router = Router();

/**
 * @openapi
 * /notifications:
 *   get:
 *     summary: List notifications for current authenticated user
 *     tags: [Notifications]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200: { description: Array of user notifications }
 */
router.get("/", requireAuth, getUserNotifications);

/**
 * @openapi
 * /notifications/{id}/read:
 *   patch:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Notification marked as read }
 *       403: { description: Access denied - Not notification owner }
 *       404: { description: Notification not found }
 */
router.patch("/:id/read", requireAuth, markAsRead);

export default router;
