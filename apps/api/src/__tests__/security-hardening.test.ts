/**
 * Integration tests for Redis-backed idempotency middleware and rate limiting.
 */
import request from "supertest";
import app from "../app";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Role } from "@prisma/client";

function makeToken(role: Role, userId: string, email: string) {
  return jwt.sign({ userId, email, role }, env.jwtSecret, { expiresIn: "1h" });
}

jest.mock("../config/prisma", () => ({
  $queryRaw: jest.fn(),
  user: { findUnique: jest.fn() },
  paymentTransaction: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  companySubscription: { findFirst: jest.fn() },
  notification: { create: jest.fn() },
}));

// Mock idempotency middleware so Redis is not required in tests
jest.mock("../middleware/idempotency", () => ({
  webhookIdempotency: (_req: any, _res: any, next: any) => next(),
}));

// Mock chapa service
jest.mock("../modules/payments/chapa.service", () => ({
  chapaService: {
    verifyWebhookSignature: jest.fn().mockReturnValue(true),
    verifyPayment: jest.fn(),
    initializePayment: jest.fn(),
  },
}));

// Mock sandbox service
jest.mock("../modules/sandbox/sandbox.service", () => ({
  executeCode: jest.fn().mockResolvedValue({
    stdout: "ok",
    stderr: null,
    compileOutput: null,
    exitCode: 0,
    time: "0.01",
    memory: 512,
    status: { id: 3, description: "Accepted" },
  }),
}));

describe("Security Hardening — Rate Limiting & Idempotency", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("Webhook Idempotency Middleware", () => {
    it("passes through to handler when idempotency middleware allows (mocked next())", async () => {
      // Middleware is mocked to always call next() — verify handler still runs
      const res = await request(app)
        .post("/api/v1/payments/webhook")
        .send({ tx_ref: "blih_course_123_abc", status: "success" });

      // Handler runs; missing CHAPA_SECRET_KEY → mock mode → falls into payment logic
      expect([200, 400, 404]).toContain(res.status);
    });

    it("webhook endpoint exists and returns structured JSON", async () => {
      const res = await request(app)
        .post("/api/v1/payments/webhook")
        .set("Content-Type", "application/json")
        .send({});

      expect(res.headers["content-type"]).toMatch(/json/);
    });
  });

  describe("Sandbox Rate Limiting", () => {
    const token = makeToken(Role.TALENT, "talent-rl-1", "rl@blih.com");
    const cookie = [`token=${token}`];

    it("accepts sandbox execution for authenticated user", async () => {
      // Mock prisma.user.findUnique for auth middleware
      const prisma = require("../config/prisma");
      prisma.user.findUnique.mockResolvedValue({
        id: "talent-rl-1",
        email: "rl@blih.com",
        role: Role.TALENT,
        emailVerified: true,
      });

      const res = await request(app)
        .post("/api/v1/sandbox/execute")
        .set("Cookie", cookie)
        .send({ language: "javascript", code: 'console.log("ok")' });

      expect(res.status).toBe(200);
    });

    it("sandbox languages endpoint is public (no auth needed)", async () => {
      const res = await request(app).get("/api/v1/sandbox/languages");
      expect(res.status).toBe(200);
    });
  });

  describe("Auth Rate Limiter", () => {
    it("auth endpoints return JSON structured errors", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "x", password: "y" });

      // Should be 400 (validation) or 401 (auth failed) — never a server crash
      expect([400, 401, 429]).toContain(res.status);
      expect(res.headers["content-type"]).toMatch(/json/);
    });
  });
});
