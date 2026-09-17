import { Router } from "express";
import * as settingsController from "./settings.controller";
import { requireAuth, requireRole } from "../../middleware/auth";

const router = Router();

// Admins only
router.use(requireAuth, requireRole(["ADMIN"]));

router.get("/pricing", settingsController.getPricingSettings);
router.put("/pricing", settingsController.updatePricingSettings);

export { router as settingsRoutes };
