import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { Role } from "@prisma/client";
import {
  updateTalentProfileSchema,
  createExperienceSchema,
  updateExperienceSchema,
  createEducationSchema,
  updateEducationSchema,
} from "./talent.schemas";
import {
  getProfile,
  getTalentProfileById,
  updateProfile,
  uploadPhoto,
  deletePhoto,
  uploadCv,
  deleteCv,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
} from "./talent.controller";

const router = Router();

// General authentication gate
router.use(requireAuth);

// Talent-only write endpoints
const talentOnly = requireRole([Role.TALENT]);

router.get("/profile", talentOnly, getProfile);
router.patch(
  "/profile",
  talentOnly,
  validate(updateTalentProfileSchema),
  updateProfile,
);

// Company & Admin accessible endpoints (wildcard matches last)
router.get(
  "/:talentId",
  requireRole([Role.COMPANY, Role.ADMIN]),
  getTalentProfileById,
);

router.post("/profile/photo", talentOnly, uploadPhoto);
router.delete("/profile/photo", talentOnly, deletePhoto);

router.post("/profile/cv", talentOnly, uploadCv);
router.delete("/profile/cv", talentOnly, deleteCv);

router.post(
  "/profile/experience",
  talentOnly,
  validate(createExperienceSchema),
  addExperience,
);
router.patch(
  "/profile/experience/:id",
  talentOnly,
  validate(updateExperienceSchema),
  updateExperience,
);
router.delete("/profile/experience/:id", talentOnly, deleteExperience);

router.post(
  "/profile/education",
  talentOnly,
  validate(createEducationSchema),
  addEducation,
);
router.patch(
  "/profile/education/:id",
  talentOnly,
  validate(updateEducationSchema),
  updateEducation,
);
router.delete("/profile/education/:id", talentOnly, deleteEducation);

export default router;
