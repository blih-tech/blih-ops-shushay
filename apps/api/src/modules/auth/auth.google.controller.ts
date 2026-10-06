import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import prisma from "../../config/prisma";
import { env } from "../../config/env";
import { AppError } from "../../middleware/errorHandler";
import { invalidateCachedUser } from "../../middleware/auth";
import { logger } from "../../utils/logger";
import {
  buildGoogleAuthUrl,
  decodeState,
  encodeState,
  exchangeCodeForTokens,
  fetchGoogleUserProfile,
} from "../../services/google.service";

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
  next: NextFunction,
) {
  try {
    const { clientId, clientSecret } = env.google;
    if (!clientId || !clientSecret) {
      return next(
        new AppError(
          501,
          "Google authentication is not configured on this server.",
        ),
      );
    }

    const role = (req.query.role as string) ?? "TALENT";
    if (role !== "TALENT" && role !== "COMPANY") {
      return next(
        new AppError(400, "Invalid role. Must be TALENT or COMPANY."),
      );
    }

    const returnTo = (req.query.returnTo as string) ?? undefined;
    const nonce = crypto.randomBytes(16).toString("hex");

    const state = encodeState({
      role: role as "TALENT" | "COMPANY",
      returnTo,
      nonce,
    });
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
  next: NextFunction,
) {
  const APP_URL = env.appUrl;
  const TALENT_URL = env.talentWebUrl;
  const AUTH_URL = env.authUrl;

  const errorRedirect = (message: string) =>
    res.redirect(`${APP_URL}/login?error=${encodeURIComponent(message)}`);

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
      return errorRedirect(
        "Failed to authenticate with Google. Please try again.",
      );
    }

    // ── 4. Fetch Google user profile ──────────────────────────────────────────
    let googleProfile;
    try {
      googleProfile = await fetchGoogleUserProfile(tokens.access_token);
    } catch (err: any) {
      console.error("[GOOGLE OAUTH] Profile fetch failed:", err.message);
      return errorRedirect(
        "Could not retrieve your Google profile. Please try again.",
      );
    }

    const { sub: googleId, email, name } = googleProfile;
    const normalizedEmail = email.trim().toLowerCase();

    // ── 5. Find or create the user ────────────────────────────────────────────
    const user = await findOrCreateGoogleUser(googleProfile, oauthState.role);

    await invalidateCachedUser(user.id);

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      env.jwtSecret,
      { expiresIn: "7d" },
    );

    const isProd = env.nodeEnv === "production";
    const sameSiteOption = isProd ? "none" : "lax";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: sameSiteOption,
      path: "/",
    });

    res.cookie("blih_role", user.role, {
      httpOnly: false,
      secure: isProd,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: sameSiteOption,
      path: "/",
    });

    // ── 7. Determine the post-auth destination for returnTo ──────────────────
    const postAuthDest = getPostAuthPath(user, oauthState.returnTo);

    // ── 8. Redirect to /auth/callback on the frontend with token + returnTo ───
    const callbackParams = new URLSearchParams({
      token,
      role: user.role,
    });
    if (postAuthDest) callbackParams.set("returnTo", postAuthDest);

    res.redirect(`${TALENT_URL}/auth/callback?${callbackParams.toString()}`);
  } catch (err) {
    next(err);
  }
}

async function findOrCreateGoogleUser(googleProfile: any, role: "TALENT" | "COMPANY") {
  const { sub: googleId, email, name } = googleProfile;
  const normalizedEmail = email.trim().toLowerCase();

  let user = await prisma.user.findUnique({ where: { googleId } });

  if (!user) {
    user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId },
      });
      if (user.role === "TALENT") {
        await prisma.talentProfile.upsert({
          where: { userId: user.id },
          update: {},
          create: {
            userId: user.id,
            fullName: name,
            photoUrl: googleProfile.picture ?? null,
          },
        });
      } else if (user.role === "COMPANY") {
        await prisma.companyProfile.upsert({
          where: { userId: user.id },
          update: {},
          create: {
            userId: user.id,
            companyName: name || normalizedEmail.split("@")[0],
            contactName: name,
          },
        });
      }
      logger.debug(`[GOOGLE OAUTH] Linked Google account to existing user: ${normalizedEmail}`);
    } else {
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          passwordHash: null,
          role,
          googleId,
          emailVerified: true,
        },
      });

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
            companyName: name || normalizedEmail.split("@")[0],
            contactName: name,
          },
        });
      }

      logger.debug(`[GOOGLE OAUTH] Created new ${role} account for: ${normalizedEmail}`);
    }
  }
  return user;
}

/**
 * Returns the relative path the user should land on after Google OAuth.
 * returnTo is preserved when safe; otherwise we pick the role-appropriate home.
 */
function getPostAuthPath(user: any, returnTo?: string): string {
  const role = user.role as "TALENT" | "COMPANY" | "ADMIN";

  const defaultPath =
    role === "ADMIN" ? "/admin" : role === "COMPANY" ? "/company" : "/profile";

  if (!returnTo) return defaultPath;

  try {
    // Accept both absolute URLs and relative paths
    const path = returnTo.startsWith("http")
      ? new URL(returnTo).pathname
      : returnTo.startsWith("/")
      ? returnTo
      : `/${returnTo}`;

    const isTalentOnly =
      path === "/profile" ||
      path.startsWith("/profile/") ||
      path === "/applications" ||
      path.startsWith("/applications/");
    const isCompanyOnly =
      path === "/company" || path.startsWith("/company/");
    const isAdminOnly =
      path === "/admin" || path.startsWith("/admin/");

    if (role === "TALENT" && (isCompanyOnly || isAdminOnly)) return "/profile";
    if (role === "COMPANY" && (isTalentOnly || isAdminOnly)) return "/company";
    if (role === "ADMIN" && (isTalentOnly || isCompanyOnly)) return "/admin";

    return path;
  } catch {
    return defaultPath;
  }
}
