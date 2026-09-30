import { Router } from "express";
import { validate } from "../../middleware/validate";
import { requireAuth } from "../../middleware/auth";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.schemas";
import {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  me,
  initiateGoogleAuth,
  handleGoogleCallback,
} from "./auth.controller";

import rateLimit from "express-rate-limit";
import { env } from "../../config/env";

const isProd = env.nodeEnv === "production";

// Strict in production to protect against brute-force and credential-stuffing attacks.
// Generous in development so testing is never blocked.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProd ? 10 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts from this IP, please try again after 15 minutes" },
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 20 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many registration attempts from this IP, please try again after 15 minutes" },
});

const router = Router();

router.post("/register", registerLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.post("/verify-email", validate(verifyEmailSchema), verifyEmail);
router.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.get("/me", requireAuth, me);

// ── Google OAuth ────────────────────────────────────────────────────────────
router.get("/google", initiateGoogleAuth);
router.get("/google/callback", handleGoogleCallback);

export default router;
