import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import prisma from "../../config/prisma";
import { env } from "../../config/env";
import { AppError } from "../../middleware/errorHandler";
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
  const APP_URL = env.appUrl ?? "http://localhost:3000";
  const TALENT_URL = APP_URL;
  const AUTH_URL = APP_URL;

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

    // ── 6. Issue JWT cookie ───────────────────────────────────────────────────
    issueAuthCookies(res, user);

    // ── 7. Redirect to the correct frontend destination ───────────────────────
    const destination = getRedirectDestination(user, oauthState.returnTo, TALENT_URL, APP_URL);

    res.redirect(destination);
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
            contactName: name,
          },
        });
      }

      logger.debug(`[GOOGLE OAUTH] Created new ${role} account for: ${normalizedEmail}`);
    }
  }
  return user;
}

function issueAuthCookies(res: Response, user: any) {
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    env.jwtSecret,
    { expiresIn: "7d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
  });

  res.cookie("blih_role", user.role, {
    httpOnly: false,
    secure: env.nodeEnv === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
  });
}

function getRedirectDestination(user: any, returnTo: string | undefined, talentUrl: string, appUrl: string) {
  let destination = returnTo;

  if (destination) {
    try {
      const destUrl = new URL(destination, talentUrl);
      const path = destUrl.pathname;
      if (user.role === "COMPANY") {
        const isTalentOnly = path === "/profile" || path.startsWith("/profile/") || path === "/jobs" || path.startsWith("/jobs/") || path === "/applications" || path.startsWith("/applications/");
        if (isTalentOnly) destination = `${talentUrl}/company`;
      } else if (user.role === "TALENT") {
        const isCompanyOnly = path === "/company" || path.startsWith("/company/");
        if (isCompanyOnly) destination = `${talentUrl}/profile`;
      }
    } catch {
      destination = user.role === "COMPANY" ? `${talentUrl}/company` : `${talentUrl}/profile`;
    }
  }

  if (!destination) {
    if (user.role === "ADMIN") destination = `${appUrl}/admin`;
    else if (user.role === "COMPANY") destination = `${appUrl}/company`;
    else destination = `${appUrl}/profile`;
  }

  const allowedHosts = env.corsOrigins;
  try {
    const destUrl = new URL(destination, talentUrl);
    const isAllowed = allowedHosts.some((origin) => {
      try {
        return new URL(origin).host === destUrl.host;
      } catch {
        return false;
      }
    });
    if (!isAllowed) {
      destination = user.role === "COMPANY" ? `${talentUrl}/company` : `${talentUrl}/profile`;
    } else {
      destination = destUrl.toString();
    }
  } catch {
    destination = user.role === "COMPANY" ? `${talentUrl}/company` : `${talentUrl}/profile`;
  }

  return destination;
}
