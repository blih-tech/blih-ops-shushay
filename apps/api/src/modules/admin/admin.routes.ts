import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { Role } from "@prisma/client";
import { getStats, getTalents, getCompanies } from "./admin.controller";

const router = Router();

// Secure all admin routes to ADMIN role
router.use(requireAuth, requireRole([Role.ADMIN]));

router.get("/stats", getStats);
router.get("/talents", getTalents);
router.get("/companies", getCompanies);

export default router;
