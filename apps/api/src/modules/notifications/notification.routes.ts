import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { getUserNotifications, markAsRead } from "./notification.controller";

const router = Router();

router.get("/", requireAuth, getUserNotifications);
router.patch("/:id/read", requireAuth, markAsRead);

export default router;
