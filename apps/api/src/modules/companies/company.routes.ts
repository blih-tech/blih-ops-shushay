import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { Role } from "@prisma/client";
import { updateCompanyProfileSchema } from "./company.schemas";
import {
  getProfile,
  updateProfile,
  uploadLogo,
  deleteLogo,
} from "./company.controller";

const router = Router();

// Secure all routes in this router to COMPANY role
router.use(requireAuth, requireRole([Role.COMPANY]));

router.get("/profile", getProfile);
router.patch("/profile", validate(updateCompanyProfileSchema), updateProfile);

router.post("/profile/logo", uploadLogo);
router.delete("/profile/logo", deleteLogo);

export default router;
