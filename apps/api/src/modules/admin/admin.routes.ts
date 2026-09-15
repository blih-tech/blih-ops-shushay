import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { Role } from "@prisma/client";
import {
  getStats,
  getUsers,
  getUserById,
  deleteUser,
  grantSkillsAccess,
  revokeSkillsAccess,
  getTalents,
  getTalentById,
  getCompanies,
  getCompanyById,
  getJobs,
  getJobById,
  updateJobStatus,
  deleteJob,
  getApplications,
  getApplicationById,
  getPayments,
  getPaymentById,
  getSubscriptions,
  getSubscriptionById,
  getCertificates,
  getCertificateById,
  deleteCertificate,
  getNotifications,
  getNotificationById,
} from "./admin.controller";

const router = Router();

// Secure all admin routes — ADMIN role required
router.use(requireAuth, requireRole([Role.ADMIN]));

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
router.get("/stats", getStats);

// ─── Users ────────────────────────────────────────────────────────────────────
router.get("/users", getUsers);
router.get("/users/:userId", getUserById);
router.delete("/users/:userId", deleteUser);
router.post("/users/:userId/skills-access", grantSkillsAccess);
router.delete("/users/:userId/skills-access", revokeSkillsAccess);

// ─── Talents ──────────────────────────────────────────────────────────────────
router.get("/talents", getTalents);
router.get("/talents/:talentId", getTalentById);

// ─── Companies ────────────────────────────────────────────────────────────────
router.get("/companies", getCompanies);
router.get("/companies/:companyId", getCompanyById);

// ─── Jobs ─────────────────────────────────────────────────────────────────────
router.get("/jobs", getJobs);
router.get("/jobs/:jobId", getJobById);
router.patch("/jobs/:jobId/status", updateJobStatus);
router.delete("/jobs/:jobId", deleteJob);

// ─── Applications ─────────────────────────────────────────────────────────────
router.get("/applications", getApplications);
router.get("/applications/:appId", getApplicationById);

// ─── Payments ─────────────────────────────────────────────────────────────────
router.get("/payments", getPayments);
router.get("/payments/:paymentId", getPaymentById);

// ─── Subscriptions ────────────────────────────────────────────────────────────
router.get("/subscriptions", getSubscriptions);
router.get("/subscriptions/:subId", getSubscriptionById);

// ─── Certificates ─────────────────────────────────────────────────────────────
router.get("/certificates", getCertificates);
router.get("/certificates/:certId", getCertificateById);
router.delete("/certificates/:certId", deleteCertificate);

// ─── Notifications ────────────────────────────────────────────────────────────
router.get("/notifications", getNotifications);
router.get("/notifications/:id", getNotificationById);

export default router;
