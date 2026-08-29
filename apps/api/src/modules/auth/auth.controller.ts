import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import prisma from "../../config/prisma";
import { env } from "../../config/env";
import { AppError } from "../../middleware/errorHandler";
import {
  RegisterInput,
  LoginInput,
  VerifyEmailInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "./auth.schemas";
import {
  buildGoogleAuthUrl,
  decodeState,
  encodeState,
  exchangeCodeForTokens,
  fetchGoogleUserProfile,
} from "../../services/google.service";

export async function register(
  req: Request<{}, {}, RegisterInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password, role } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return next(new AppError(400, "Email already registered"));
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        role,
        verificationToken,
        emailVerified: env.nodeEnv === "development",
      },
    });

    // Mock verification email by printing it to console
    const verificationLink = `http://localhost:3003/verify-email?token=${verificationToken}`;
    console.log("\n==================================================");
    console.log("[EMAIL MOCK] Verification Email Sent");
    console.log(`To: ${normalizedEmail}`);
    console.log(`Link: ${verificationLink}`);
    console.log("==================================================\n");

    res.status(201).json({
      message: "Registration successful. Please check your email to verify your account.",
    });
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request<{}, {}, LoginInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email ? email.trim().toLowerCase() : "";

    console.log(`[AUTH LOGIN] Attempt for email: "${normalizedEmail}"`);

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      console.warn(`[AUTH LOGIN FAILED] No user found for: "${normalizedEmail}"`);
      return next(new AppError(401, "Invalid email or password"));
    }

    const isMatch = user.passwordHash
      ? await bcrypt.compare(password, user.passwordHash)
      : false;
    if (!isMatch) {
      console.warn(`[AUTH LOGIN FAILED] Password mismatch for: "${normalizedEmail}"`);
      return next(new AppError(401, "Invalid email or password"));
    }

    if (!user.emailVerified) {
      console.warn(`[AUTH LOGIN FAILED] Unverified email for: "${normalizedEmail}"`);
      return next(new AppError(401, "Please verify your email address before logging in."));
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      env.jwtSecret,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "lax",
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(_req: Request, res: Response, next: NextFunction) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: "lax",
    });
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
}

export async function verifyEmail(
  req: Request<{}, {}, VerifyEmailInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { token } = req.body;

    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      return next(new AppError(400, "Invalid or expired verification token"));
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
      },
    });

    res.json({ message: "Email verified successfully. You can now log in." });
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetExpires = new Date(Date.now() + 3600000); // 1 hour

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetExpires,
        },
      });

      // Mock reset email by printing it to console
      const resetLink = `http://localhost:3003/reset-password?token=${resetToken}`;
      console.log("\n==================================================");
      console.log("[EMAIL MOCK] Password Reset Email Sent");
      console.log(`To: ${email}`);
      console.log(`Link: ${resetLink}`);
      console.log("==================================================\n");
    }

    // Always return success to prevent user enumeration
    res.json({
      message: "If the email is registered, a password reset link has been sent.",
    });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(
  req: Request<{}, {}, ResetPasswordInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { token, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetExpires: { gt: new Date() },
      },
    });

    if (!user) {
      return next(new AppError(400, "Invalid or expired reset token"));
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetExpires: null,
      },
    });

    res.json({ message: "Password has been reset successfully. You can now log in." });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return next(new AppError(401, "Not authenticated"));
    }
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
}

// ─── Google OAuth ─────────────────────────────────────────────────────────────

/**
 * GET /auth/google
 *
 * Query params:
 *   role     – "TALENT" | "COMPANY"  (required, used when creating a new account)
 *   returnTo – URL to redirect to after successful auth (optional)
 *
 * Redirects the browser to Google's OAuth consent screen.
 */
export function initiateGoogleAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { clientId, clientSecret } = env.google;
    if (!clientId || !clientSecret) {
      return next(
        new AppError(
          501,
          "Google authentication is not configured on this server."
        )
      );
    }

    const role = (req.query.role as string) ?? "TALENT";
    if (role !== "TALENT" && role !== "COMPANY") {
      return next(new AppError(400, "Invalid role. Must be TALENT or COMPANY."));
    }

    const returnTo = (req.query.returnTo as string) ?? undefined;
    const nonce = crypto.randomBytes(16).toString("hex");

    const state = encodeState({ role: role as "TALENT" | "COMPANY", returnTo, nonce });
    const url = buildGoogleAuthUrl(state);

    res.redirect(url);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /auth/google/callback
 *
 * Google redirects here after the user grants (or denies) access.
 * Handles:
 *  - New Google users  → creates account + profile
 *  - Returning Google users → updates googleId linkage if needed
 *  - Existing email/password users → links their Google account
 *  - Cancellations / errors from Google
 */
export async function handleGoogleCallback(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Determine a safe fallback URL for error redirects
  const TALENT_URL =
    process.env.NEXT_PUBLIC_TALENT_URL ?? "http://localhost:3002";
  const AUTH_URL =
    process.env.AUTH_URL ?? "http://localhost:3003";

  const errorRedirect = (message: string) =>
    res.redirect(
      `${AUTH_URL}/login?error=${encodeURIComponent(message)}`
    );

  try {
    const { clientId, clientSecret } = env.google;
    if (!clientId || !clientSecret) {
      return errorRedirect("Google authentication is not configured.");
    }

    // ── 1. Handle cancellations / Google-side errors ─────────────────────────
    if (req.query.error) {
      const googleError = req.query.error as string;
      if (googleError === "access_denied") {
        return errorRedirect("Google sign-in was cancelled.");
      }
      return errorRedirect(`Google authentication error: ${googleError}`);
    }

    const code = req.query.code as string;
    const stateParam = req.query.state as string;

    if (!code || !stateParam) {
      return errorRedirect("Missing authentication code or state.");
    }

    // ── 2. Decode state (CSRF / role / returnTo) ──────────────────────────────
    let oauthState;
    try {
      oauthState = decodeState(stateParam);
    } catch {
      return errorRedirect("Invalid OAuth state. Please try again.");
    }

    // ── 3. Exchange code for tokens ───────────────────────────────────────────
    let tokens;
    try {
      tokens = await exchangeCodeForTokens(code);
    } catch (err: any) {
      console.error("[GOOGLE OAUTH] Token exchange failed:", err.message);
      return errorRedirect("Failed to authenticate with Google. Please try again.");
    }

    // ── 4. Fetch Google user profile ──────────────────────────────────────────
    let googleProfile;
    try {
      googleProfile = await fetchGoogleUserProfile(tokens.access_token);
    } catch (err: any) {
      console.error("[GOOGLE OAUTH] Profile fetch failed:", err.message);
      return errorRedirect("Could not retrieve your Google profile. Please try again.");
    }

    const { sub: googleId, email, name } = googleProfile;
    const normalizedEmail = email.trim().toLowerCase();

    // ── 5. Find or create the user ────────────────────────────────────────────
    let user = await prisma.user.findUnique({ where: { googleId } });

    if (!user) {
      // Check if there's an existing email/password account with this email
      user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

      if (user) {
        // Link Google account to existing email/password account
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId },
        });
        console.log(`[GOOGLE OAUTH] Linked Google account to existing user: ${normalizedEmail}`);
      } else {
        // Brand-new Google user — create account + profile
        const role = oauthState.role;

        user = await prisma.user.create({
          data: {
            email: normalizedEmail,
            passwordHash: null,
            role,
            googleId,
            emailVerified: true, // Google emails are pre-verified
          },
        });

        // Create matching empty profile
        if (role === "TALENT") {
          await prisma.talentProfile.create({
            data: {
              userId: user.id,
              fullName: name,
              photoUrl: googleProfile.picture ?? null,
            },
          });
        } else {
          await prisma.companyProfile.create({
            data: {
              userId: user.id,
              contactName: name,
            },
          });
        }

        console.log(`[GOOGLE OAUTH] Created new ${role} account for: ${normalizedEmail}`);
      }
    }

    // ── 6. Issue JWT cookie (same mechanism as email/password login) ──────────
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      env.jwtSecret,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    // ── 7. Redirect to the correct frontend destination ───────────────────────
    let destination = oauthState.returnTo;

    // Enforce role-aware destination routing
    if (destination) {
      try {
        const destUrl = new URL(destination, TALENT_URL);
        const path = destUrl.pathname;
        if (user.role === "COMPANY") {
          const isTalentOnly =
            path === "/profile" || path.startsWith("/profile/") ||
            path === "/jobs" || path.startsWith("/jobs/") ||
            path === "/applications" || path.startsWith("/applications/");
          if (isTalentOnly) {
            destination = `${TALENT_URL}/company`;
          }
        } else if (user.role === "TALENT") {
          const isCompanyOnly = path === "/company" || path.startsWith("/company/");
          if (isCompanyOnly) {
            destination = `${TALENT_URL}/profile`;
          }
        }
      } catch {
        destination = user.role === "COMPANY" ? `${TALENT_URL}/company` : `${TALENT_URL}/profile`;
      }
    }

    if (!destination) {
      if (user.role === "ADMIN") {
        const SKILLS_URL = process.env.NEXT_PUBLIC_SKILLS_URL ?? "http://localhost:3001";
        destination = `${SKILLS_URL}/admin`;
      } else if (user.role === "COMPANY") {
        destination = `${TALENT_URL}/company`;
      } else {
        destination = `${TALENT_URL}/profile`;
      }
    }

    // Prevent cross-origin returnTo redirects (only allow same origin or known hosts)
    const allowedHosts = env.corsOrigins;
    try {
      const destUrl = new URL(destination, TALENT_URL);
      const isAllowed = allowedHosts.some((origin) => {
        try {
          return new URL(origin).host === destUrl.host;
        } catch {
          return false;
        }
      });
      if (!isAllowed) {
        destination = user.role === "COMPANY" ? `${TALENT_URL}/company` : `${TALENT_URL}/profile`;
      } else {
        destination = destUrl.toString();
      }
    } catch {
      destination = user.role === "COMPANY" ? `${TALENT_URL}/company` : `${TALENT_URL}/profile`;
    }

    res.redirect(destination);
  } catch (err) {
    next(err);
  }
}
