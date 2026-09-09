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
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../../services/email.service";

export async function register(
  req: Request<{}, {}, RegisterInput>,
  res: Response,
  next: NextFunction,
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

    // Send verification email (real in production, console in dev without key)
    const verificationLink = `${env.authUrl}/verify-email?token=${verificationToken}`;
    await sendVerificationEmail(normalizedEmail, verificationLink);

    res.status(201).json({
      message:
        "Registration successful. Please check your email to verify your account.",
    });
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request<{}, {}, LoginInput>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email ? email.trim().toLowerCase() : "";

    console.log(`[AUTH LOGIN] Attempt for email: "${normalizedEmail}"`);

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      console.warn(
        `[AUTH LOGIN FAILED] No user found for: "${normalizedEmail}"`,
      );
      return next(new AppError(401, "Invalid email or password"));
    }

    const isMatch = user.passwordHash
      ? await bcrypt.compare(password, user.passwordHash)
      : false;
    if (!isMatch) {
      console.warn(
        `[AUTH LOGIN FAILED] Password mismatch for: "${normalizedEmail}"`,
      );
      return next(new AppError(401, "Invalid email or password"));
    }

    if (!user.emailVerified) {
      console.warn(
        `[AUTH LOGIN FAILED] Unverified email for: "${normalizedEmail}"`,
      );
      return next(
        new AppError(
          401,
          "Please verify your email address before logging in.",
        ),
      );
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      env.jwtSecret,
      { expiresIn: "7d" },
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
  next: NextFunction,
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
  next: NextFunction,
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

      // Send password reset email (real in production, console in dev without key)
      const resetLink = `${env.authUrl}/reset-password?token=${resetToken}`;
      await sendPasswordResetEmail(email, resetLink);
    }

    // Always return success to prevent user enumeration
    res.json({
      message:
        "If the email is registered, a password reset link has been sent.",
    });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(
  req: Request<{}, {}, ResetPasswordInput>,
  res: Response,
  next: NextFunction,
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

    res.json({
      message: "Password has been reset successfully. You can now log in.",
    });
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

export {
  initiateGoogleAuth,
  handleGoogleCallback,
} from "./auth.google.controller";
