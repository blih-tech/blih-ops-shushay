/**
 * google.service.ts
 *
 * Lightweight Google OAuth 2.0 helper.
 * Uses the built-in https module for HTTP requests (avoids node-fetch ESM issues
 * in a CommonJS project).
 *
 * Flow:
 *   1. Frontend redirects user to Google via /auth/google
 *   2. Google redirects back to /auth/google/callback with ?code=...&state=...
 *   3. We exchange the code for tokens here
 *   4. We fetch the user's profile and return it to the controller
 */

import https from "https";
import { env } from "../config/env";


export interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface GoogleUserProfile {
  sub: string;           // Google user ID (unique, stable)
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name?: string;
  family_name?: string;
}

/** State payload encoded into the OAuth `state` parameter. */
export interface OAuthState {
  role: "TALENT" | "COMPANY";
  returnTo?: string;
  /** CSRF nonce */
  nonce: string;
}

/**
 * Encode state into a URL-safe base64 string.
 */
export function encodeState(state: OAuthState): string {
  return Buffer.from(JSON.stringify(state)).toString("base64url");
}

/**
 * Decode and validate state from a URL-safe base64 string.
 * Throws if the value is malformed.
 */
export function decodeState(encoded: string): OAuthState {
  try {
    const parsed = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf-8")
    ) as OAuthState;
    if (!parsed.role || !parsed.nonce) {
      throw new Error("Missing required state fields");
    }
    return parsed;
  } catch {
    throw new Error("Invalid OAuth state parameter");
  }
}

// ─── Internal HTTP helpers (avoids node-fetch ESM incompatibility) ────────────

function httpsPost(url: string, body: string, headers: Record<string, string>): Promise<{ ok: boolean; status: number; json: () => Promise<any>; text: () => Promise<string> }> {
  return new Promise((resolve, reject) => {
    const { hostname, pathname, search } = new URL(url);
    const options = {
      hostname,
      path: pathname + search,
      method: "POST",
      headers: { ...headers, "Content-Length": String(Buffer.byteLength(body)) },
    };
    const req = https.request(options, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (d: Buffer) => chunks.push(d));
      res.on("end", () => {
        const raw = Buffer.concat(chunks).toString("utf-8");
        resolve({
          ok: (res.statusCode ?? 0) >= 200 && (res.statusCode ?? 0) < 300,
          status: res.statusCode ?? 0,
          json: async () => JSON.parse(raw),
          text: async () => raw,
        });
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

function httpsGet(url: string, headers: Record<string, string>): Promise<{ ok: boolean; status: number; json: () => Promise<any>; text: () => Promise<string> }> {
  return new Promise((resolve, reject) => {
    const { hostname, pathname, search } = new URL(url);
    const options = { hostname, path: pathname + search, method: "GET", headers };
    const req = https.request(options, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (d: Buffer) => chunks.push(d));
      res.on("end", () => {
        const raw = Buffer.concat(chunks).toString("utf-8");
        resolve({
          ok: (res.statusCode ?? 0) >= 200 && (res.statusCode ?? 0) < 300,
          status: res.statusCode ?? 0,
          json: async () => JSON.parse(raw),
          text: async () => raw,
        });
      });
    });
    req.on("error", reject);
    req.end();
  });
}

/**
 * Exchange the Google authorization code for access/id tokens.
 */
export async function exchangeCodeForTokens(
  code: string
): Promise<GoogleTokenResponse> {
  const { clientId, clientSecret, callbackUrl } = env.google;

  const body = new URLSearchParams({
    code,
    client_id: clientId!,
    client_secret: clientSecret!,
    redirect_uri: callbackUrl,
    grant_type: "authorization_code",
  }).toString();

  const response = await httpsPost(
    "https://oauth2.googleapis.com/token",
    body,
    { "Content-Type": "application/x-www-form-urlencoded" }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google token exchange failed: ${response.status} ${text}`);
  }

  return response.json() as Promise<GoogleTokenResponse>;
}

/**
 * Fetch the authenticated user's profile from Google using the access token.
 */
export async function fetchGoogleUserProfile(
  accessToken: string
): Promise<GoogleUserProfile> {
  const response = await httpsGet(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    { Authorization: `Bearer ${accessToken}` }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Failed to fetch Google user profile: ${response.status} ${text}`
    );
  }

  return response.json() as Promise<GoogleUserProfile>;
}

/**
 * Build the Google authorization URL to redirect the browser to.
 */
export function buildGoogleAuthUrl(state: string): string {
  const { clientId, callbackUrl } = env.google;

  const params = new URLSearchParams({
    client_id: clientId!,
    redirect_uri: callbackUrl,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
