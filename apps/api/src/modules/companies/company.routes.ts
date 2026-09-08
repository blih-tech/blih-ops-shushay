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
  getCompanyById,
} from "./company.controller";

const router = Router();

// Authentication required for all company routes
router.use(requireAuth);

// Company-only write & profile endpoints
const companyOnly = requireRole([Role.COMPANY]);

/**
 * @openapi
 * /companies/profile:
 *   get:
 *     summary: Get current authenticated company's profile
 *     tags: [Companies]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200: { description: Company profile object }
 *       401: { description: Unauthorized }
 *       403: { description: Company role required }
 *   patch:
 *     summary: Update company profile information
 *     tags: [Companies]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName: { type: string }
 *               description: { type: string }
 *               website: { type: string }
 *               country: { type: string }
 *               city: { type: string }
 *               contactName: { type: string }
 *               contactEmail: { type: string, format: email }
 *               contactPhone: { type: string }
 *     responses:
 *       200: { description: Updated company profile }
 *       400: { description: Validation error }
 */
router.get("/profile", companyOnly, getProfile);
router.patch("/profile", companyOnly, validate(updateCompanyProfileSchema), updateProfile);

/**
 * @openapi
 * /companies/profile/logo:
 *   post:
 *     summary: Upload company logo image
 *     tags: [Companies]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200: { description: Logo uploaded successfully }
 *   delete:
 *     summary: Delete company logo
 *     tags: [Companies]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200: { description: Logo deleted }
 */
router.post("/profile/logo", companyOnly, uploadLogo);
router.delete("/profile/logo", companyOnly, deleteLogo);

/**
 * @openapi
 * /companies/{companyId}:
 *   get:
 *     summary: Get public company profile and active job postings by ID
 *     tags: [Companies]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: companyId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Public company profile detail record with active job listings }
 *       404: { description: Company profile not found }
 */
router.get("/:companyId", getCompanyById);

export default router;


