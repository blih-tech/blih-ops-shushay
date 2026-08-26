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

// Secure all routes in this router to TALENT role
router.use(requireAuth, requireRole([Role.TALENT]));

router.get("/profile", getProfile);
router.patch("/profile", validate(updateTalentProfileSchema), updateProfile);

router.post("/profile/photo", uploadPhoto);
router.delete("/profile/photo", deletePhoto);

router.post("/profile/cv", uploadCv);
router.delete("/profile/cv", deleteCv);

router.post("/profile/experience", validate(createExperienceSchema), addExperience);
router.patch("/profile/experience/:id", validate(updateExperienceSchema), updateExperience);
router.delete("/profile/experience/:id", deleteExperience);

router.post("/profile/education", validate(createEducationSchema), addEducation);
router.patch("/profile/education/:id", validate(updateEducationSchema), updateEducation);
router.delete("/profile/education/:id", deleteEducation);

export default router;
