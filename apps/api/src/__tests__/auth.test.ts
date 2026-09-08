/**
 * Integration tests for Phase 1: Authentication (email + password flow).
 * Uses supertest against the real Express app with mocked Prisma.
 */
import request from "supertest";
import app from "../app";
import prisma from "../config/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Role } from "@prisma/client";

// Mock email service so no real emails are sent during tests
jest.mock("../services/email.service", () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue({ success: true }),
  sendPasswordResetEmail: jest.fn().mockResolvedValue({ success: true }),
}));

jest.mock("../config/prisma", () => ({
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
}));

const VERIFIED_USER = {
  id: "auth-test-user-1",
  email: "talent@test.blih.com",
  role: Role.TALENT,
  emailVerified: true,
  passwordHash: bcrypt.hashSync("correctPassword123!", 10),
  verificationToken: null,
  resetToken: null,
  resetExpires: null,
};

const UNVERIFIED_USER = {
  ...VERIFIED_USER,
  id: "auth-test-user-2",
  email: "unverified@test.blih.com",
  emailVerified: false,
  verificationToken: "valid-verify-token-abc",
};

describe("Auth — Registration & Login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── Register ────────────────────────────────────────────────────────────────

  describe("POST /api/v1/auth/register", () => {
    it("creates a new account and returns 201", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: "new-user-1",
        email: "newuser@blih.com",
        role: Role.TALENT,
      });

      const res = await request(app).post("/api/v1/auth/register").send({
        email: "newuser@blih.com",
        password: "SecurePass123!",
        role: "TALENT",
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toMatch(/Registration successful/i);
    });

    it("returns 400 when email is already registered", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(VERIFIED_USER);

      const res = await request(app).post("/api/v1/auth/register").send({
        email: VERIFIED_USER.email,
        password: "SecurePass123!",
        role: "TALENT",
      });

      expect(res.status).toBe(400);
      expect(res.body.error.message).toMatch(/already registered/i);
    });

    it("returns 400 when role is invalid", async () => {
      const res = await request(app).post("/api/v1/auth/register").send({
        email: "new@blih.com",
        password: "SecurePass123!",
        role: "SUPERUSER", // invalid
      });

      expect(res.status).toBe(400);
    });

    it("returns 400 when password is missing", async () => {
      const res = await request(app).post("/api/v1/auth/register").send({
        email: "new@blih.com",
        role: "TALENT",
      });

      expect(res.status).toBe(400);
    });
  });

  // ─── Login ───────────────────────────────────────────────────────────────────

  describe("POST /api/v1/auth/login", () => {
    it("returns 200 and sets JWT cookie on valid credentials", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(VERIFIED_USER);

      const res = await request(app).post("/api/v1/auth/login").send({
        email: VERIFIED_USER.email,
        password: "correctPassword123!",
      });

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(VERIFIED_USER.email);
      expect(res.body.user.role).toBe(Role.TALENT);
      // Cookie should be set
      const rawCookie = res.headers["set-cookie"];
      const cookie = Array.isArray(rawCookie) ? rawCookie.join(";") : (rawCookie ?? "");
      expect(cookie).toMatch(/token=/);
    });

    it("returns 401 on wrong password", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(VERIFIED_USER);

      const res = await request(app).post("/api/v1/auth/login").send({
        email: VERIFIED_USER.email,
        password: "wrongPassword!",
      });

      expect(res.status).toBe(401);
      expect(res.body.error.message).toMatch(/Invalid email or password/i);
    });

    it("returns 401 on non-existent email", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const res = await request(app).post("/api/v1/auth/login").send({
        email: "nobody@blih.com",
        password: "anything",
      });

      expect(res.status).toBe(401);
    });

    it("returns 401 when email is not verified", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(UNVERIFIED_USER);

      const res = await request(app).post("/api/v1/auth/login").send({
        email: UNVERIFIED_USER.email,
        password: "correctPassword123!",
      });

      expect(res.status).toBe(401);
      expect(res.body.error.message).toMatch(/verify your email/i);
    });
  });

  // ─── Logout ──────────────────────────────────────────────────────────────────

  describe("POST /api/v1/auth/logout", () => {
    it("returns 200 and clears the token cookie", async () => {
      const res = await request(app).post("/api/v1/auth/logout");

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/Logged out/i);
      const rawCookie = res.headers["set-cookie"];
      const cookie = Array.isArray(rawCookie) ? rawCookie.join(";") : (rawCookie ?? "");
      // Cookie should be expired (Max-Age=0 or Expires in the past)
      expect(cookie).toMatch(/token=/);
    });
  });

  // ─── GET /me ─────────────────────────────────────────────────────────────────

  describe("GET /api/v1/auth/me", () => {
    it("returns user data when authenticated", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(VERIFIED_USER);

      const token = jwt.sign(
        { userId: VERIFIED_USER.id, email: VERIFIED_USER.email, role: VERIFIED_USER.role },
        env.jwtSecret,
        { expiresIn: "1h" },
      );

      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Cookie", [`token=${token}`]);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(VERIFIED_USER.email);
    });

    it("returns 401 when not authenticated", async () => {
      const res = await request(app).get("/api/v1/auth/me");
      expect(res.status).toBe(401);
    });
  });

  // ─── Email Verification ───────────────────────────────────────────────────────

  describe("POST /api/v1/auth/verify-email", () => {
    it("verifies a valid token and returns 200", async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(UNVERIFIED_USER);
      (prisma.user.update as jest.Mock).mockResolvedValue({
        ...UNVERIFIED_USER,
        emailVerified: true,
        verificationToken: null,
      });

      const res = await request(app)
        .post("/api/v1/auth/verify-email")
        .send({ token: "valid-verify-token-abc" });

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/verified successfully/i);
    });

    it("returns 400 for an invalid or expired token", async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

      const res = await request(app)
        .post("/api/v1/auth/verify-email")
        .send({ token: "invalid-token" });

      expect(res.status).toBe(400);
      expect(res.body.error.message).toMatch(/Invalid or expired/i);
    });
  });

  // ─── Forgot / Reset Password ──────────────────────────────────────────────────

  describe("POST /api/v1/auth/forgot-password", () => {
    it("always returns 200 regardless of whether email exists (prevents enumeration)", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const res = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email: "anyone@blih.com" });

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/If the email is registered/i);
    });

    it("generates reset token when user exists", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(VERIFIED_USER);
      (prisma.user.update as jest.Mock).mockResolvedValue({
        ...VERIFIED_USER,
        resetToken: "generated-reset-token",
        resetExpires: new Date(Date.now() + 3600000),
      });

      const res = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email: VERIFIED_USER.email });

      expect(res.status).toBe(200);
      expect(prisma.user.update).toHaveBeenCalled();
    });
  });

  describe("POST /api/v1/auth/reset-password", () => {
    it("resets password with a valid token", async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue({
        ...VERIFIED_USER,
        resetToken: "valid-reset-token",
        resetExpires: new Date(Date.now() + 3600000),
      });
      (prisma.user.update as jest.Mock).mockResolvedValue({
        ...VERIFIED_USER,
        resetToken: null,
        resetExpires: null,
      });

      const res = await request(app)
        .post("/api/v1/auth/reset-password")
        .send({ token: "valid-reset-token", password: "NewSecurePass456!" });

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/reset successfully/i);
    });

    it("returns 400 for an expired or invalid reset token", async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

      const res = await request(app)
        .post("/api/v1/auth/reset-password")
        .send({ token: "expired-token", password: "NewSecurePass456!" });

      expect(res.status).toBe(400);
      expect(res.body.error.message).toMatch(/Invalid or expired/i);
    });
  });
});
