import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { validateParams } from "../../middleware/validate";
import { certificateIdParamSchema } from "./certificate.schemas";
import {
  getMyCertificates,
  downloadCertificate,
} from "./certificate.controller";

const router = Router();

/**
 * @openapi
 * /certificates:
 *   get:
 *     summary: Get all earned certificates for current user
 *     tags: [Certificates]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of verified certificates earned by user
 */
router.get("/", requireAuth, getMyCertificates);

/**
 * @openapi
 * /certificates/{id}/download:
 *   get:
 *     summary: Download certificate PDF stream
 *     tags: [Certificates]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Binary PDF file stream
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get(
  "/:id/download",
  requireAuth,
  validateParams(certificateIdParamSchema),
  downloadCertificate,
);

export default router;
