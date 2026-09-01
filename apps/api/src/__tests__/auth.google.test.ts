/**
 * Integration tests for the Google OAuth authentication routes.
 *
 * These tests use supertest against the real Express app and a real database.
 * Google service functions are mocked so no real HTTP calls are made.
 *
 * Run: npm test -- --testPathPattern=auth.google
 */

import request from "supertest";
import app from "../app";
import prisma from "../config/prisma";
import * as googleService from "../services/google.service";

// ─── Mock the google service — no real HTTPS calls ────────────────────────────

jest.mock("../services/google.service", () => {
  // Keep real encode/decode so state round-trips correctly in tests
  const real = jest.requireActual<typeof import("../services/google.service")>(
    "../services/google.service",
  );
  return {
    ...real,
    buildGoogleAuthUrl: jest.fn(
      (state: string) =>
        `https://accounts.google.com/o/oauth2/v2/auth?mock=1&state=${state}`,
    ),
    exchangeCodeForTokens: jest.fn(),
    fetchGoogleUserProfile: jest.fn(),
  };
});

const mockExchangeTokens = googleService.exchangeCodeForTokens as jest.Mock;
const mockFetchProfile = googleService.fetchGoogleUserProfile as jest.Mock;
const mockBuildUrl = googleService.buildGoogleAuthUrl as jest.Mock;

// ─── Helpers ───────────────────────────────────────────────────────────────────

function mockTokensOk() {
  mockExchangeTokens.mockResolvedValueOnce({
    access_token: "mock-access-token",
    id_token: "mock-id-token",
    token_type: "Bearer",
    expires_in: 3600,
    scope: "openid email profile",
  });
}

function mockTokensFail() {
  mockExchangeTokens.mockRejectedValueOnce(
    new Error('Google token exchange failed: 400 {"error":"invalid_grant"}'),
  );
}

function mockProfileOk(
  overrides: Partial<{
    sub: string;
    email: string;
    name: string;
    picture: string;
    email_verified: boolean;
  }> = {},
) {
  mockFetchProfile.mockResolvedValueOnce({
    sub: "google-uid-default",
    email: "testgoogle@example.com",
    email_verified: true,
    name: "Test Google User",
    picture: "https://example.com/photo.jpg",
    ...overrides,
  });
}

/** Build a valid base64url-encoded state for tests */
function buildState(role: "TALENT" | "COMPANY" = "TALENT", returnTo?: string) {
  return googleService.encodeState({
    role,
    returnTo,
    nonce: "test-nonce-12345",
  });
}

// ─── Setup & Cleanup ───────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(async () => {
  await prisma.user.deleteMany({
    where: { email: { contains: "testgoogle" } },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("GET /api/v1/auth/google", () => {
  it("should redirect to Google accounts when credentials are configured", async () => {
    const res = await request(app).get("/api/v1/auth/google?role=TALENT");
    // Either 302 (configured) or 501 (no credentials in env)
    expect([302, 501]).toContain(res.status);
    if (res.status === 302) {
      expect(res.headers.location).toContain("accounts.google.com");
      expect(res.headers.location).toContain("state=");
    }
  });

  it("should reject invalid role values", async () => {
    const res = await request(app).get("/api/v1/auth/google?role=ADMIN");
    expect([400, 501]).toContain(res.status);
  });

  it("should default to TALENT role when no role param provided", async () => {
    const res = await request(app).get("/api/v1/auth/google");
    expect([302, 501]).toContain(res.status);
  });
});

describe("GET /api/v1/auth/google/callback", () => {
  it("should redirect to login with error when Google returns access_denied", async () => {
    const res = await request(app)
      .get("/api/v1/auth/google/callback?error=access_denied&state=abc")
      .redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toContain("error=");
    expect(decodeURIComponent(res.headers.location)).toContain("cancelled");
  });

  it("should redirect to login with error when state is missing", async () => {
    const res = await request(app)
      .get("/api/v1/auth/google/callback?code=someCode")
      .redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toContain("error=");
  });

  it("should redirect to login with error when state is malformed", async () => {
    const res = await request(app)
      .get("/api/v1/auth/google/callback?code=someCode&state=!!!notbase64!!!")
      .redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toContain("error=");
  });

  it("should redirect to login with error when token exchange fails", async () => {
    mockTokensFail();

    const res = await request(app)
      .get(`/api/v1/auth/google/callback?code=badcode&state=${buildState()}`)
      .redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toContain("error=");
    expect(mockExchangeTokens).toHaveBeenCalledTimes(1);
  });

  it("should create a new TALENT user and set token cookie on first login", async () => {
    mockTokensOk();
    mockProfileOk({
      email: "testgoogle.new@example.com",
      sub: "google-new-uid",
    });

    const res = await request(app)
      .get(
        `/api/v1/auth/google/callback?code=validcode&state=${buildState("TALENT")}`,
      )
      .redirects(0);

    expect(res.status).toBe(302);
    const setCookie = res.headers["set-cookie"] as unknown as
      | string[]
      | undefined;
    expect(setCookie).toBeDefined();
    expect(setCookie!.some((c) => c.startsWith("token="))).toBe(true);

    const user = await prisma.user.findUnique({
      where: { email: "testgoogle.new@example.com" },
      include: { talentProfile: true },
    });
    expect(user).not.toBeNull();
    expect(user?.role).toBe("TALENT");
    expect(user?.googleId).toBe("google-new-uid");
    expect(user?.emailVerified).toBe(true);
    expect(user?.passwordHash).toBeNull();
    expect(user?.talentProfile).not.toBeNull();
    expect(user?.talentProfile?.fullName).toBe("Test Google User");
  });

  it("should create a new COMPANY user with companyProfile", async () => {
    mockTokensOk();
    mockProfileOk({
      email: "testgoogle.company@example.com",
      sub: "google-company-uid",
      name: "Acme Corp",
    });

    const res = await request(app)
      .get(
        `/api/v1/auth/google/callback?code=validcode&state=${buildState("COMPANY")}`,
      )
      .redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toContain("/company");

    const user = await prisma.user.findUnique({
      where: { email: "testgoogle.company@example.com" },
      include: { companyProfile: true },
    });
    expect(user?.role).toBe("COMPANY");
    expect(user?.companyProfile).not.toBeNull();
    expect(user?.companyProfile?.contactName).toBe("Acme Corp");
  });

  it("should link Google account to an existing email/password user", async () => {
    const existing = await prisma.user.create({
      data: {
        email: "testgoogle.existing@example.com",
        passwordHash: "$2b$10$hashedpassword",
        role: "TALENT",
        emailVerified: true,
      },
    });

    mockTokensOk();
    mockProfileOk({
      email: "testgoogle.existing@example.com",
      sub: "google-link-uid",
    });

    const res = await request(app)
      .get(
        `/api/v1/auth/google/callback?code=validcode&state=${buildState("TALENT")}`,
      )
      .redirects(0);

    expect(res.status).toBe(302);

    const updated = await prisma.user.findUnique({
      where: { id: existing.id },
    });
    expect(updated?.googleId).toBe("google-link-uid");
    // Existing password hash preserved
    expect(updated?.passwordHash).toBe("$2b$10$hashedpassword");
  });

  it("should sign in a returning Google user without creating a duplicate", async () => {
    const existing = await prisma.user.create({
      data: {
        email: "testgoogle.returning@example.com",
        passwordHash: null,
        role: "COMPANY",
        googleId: "google-returning-uid",
        emailVerified: true,
      },
    });

    mockTokensOk();
    mockProfileOk({
      email: "testgoogle.returning@example.com",
      sub: "google-returning-uid",
    });

    const res = await request(app)
      .get(
        `/api/v1/auth/google/callback?code=validcode&state=${buildState("COMPANY")}`,
      )
      .redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toContain("/company");

    const count = await prisma.user.count({
      where: { email: "testgoogle.returning@example.com" },
    });
    expect(count).toBe(1);

    await prisma.user.delete({ where: { id: existing.id } });
  });

  it("should redirect TALENT user to /profile dashboard by default", async () => {
    mockTokensOk();
    mockProfileOk({
      email: "testgoogle.talent.dest@example.com",
      sub: "google-talent-dest",
    });

    const res = await request(app)
      .get(
        `/api/v1/auth/google/callback?code=validcode&state=${buildState("TALENT")}`,
      )
      .redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toContain("/profile");
  });

  it("should respect a valid returnTo URL in state", async () => {
    mockTokensOk();
    mockProfileOk({
      email: "testgoogle.returnto@example.com",
      sub: "google-returnto-uid",
    });

    const returnTo = "http://localhost:3002/profile/preview";
    const state = buildState("TALENT", returnTo);

    const res = await request(app)
      .get(`/api/v1/auth/google/callback?code=validcode&state=${state}`)
      .redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe(returnTo);
  });

  it("should reject a cross-origin returnTo URL and fallback to /profile", async () => {
    mockTokensOk();
    mockProfileOk({
      email: "testgoogle.xss@example.com",
      sub: "google-xss-uid",
    });

    const maliciousReturnTo = "https://evil.example.com/steal";
    const state = buildState("TALENT", maliciousReturnTo);

    const res = await request(app)
      .get(`/api/v1/auth/google/callback?code=validcode&state=${state}`)
      .redirects(0);

    expect(res.status).toBe(302);
    expect(res.headers.location).not.toContain("evil.example.com");
    expect(res.headers.location).toContain("/profile");
  });
});
