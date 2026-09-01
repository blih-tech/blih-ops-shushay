import "dotenv/config";

function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

/** Returns the env var value or undefined if absent (non-breaking optional). */
function optional(key: string): string | undefined {
  return process.env[key] || undefined;
}

export const env = {
  port: process.env.PORT ?? "4000",
  databaseUrl: required("DATABASE_URL"),
  jwtSecret: required("JWT_SECRET"),
  corsOrigins:
    (process.env.CORS_ORIGINS ?? "").split(",").filter(Boolean).length > 0
      ? (process.env.CORS_ORIGINS ?? "").split(",").filter(Boolean)
      : [
          "http://localhost:3000",
          "http://localhost:3001",
          "http://localhost:3002",
          "http://localhost:3003",
        ],
  nodeEnv: process.env.NODE_ENV ?? "development",
  uploadsBaseUrl:
    process.env.UPLOADS_BASE_URL ?? "http://localhost:4000/uploads",
  cloudinary: {
    cloudName: required("CLOUDINARY_CLOUD_NAME"),
    apiKey: required("CLOUDINARY_API_KEY"),
    apiSecret: required("CLOUDINARY_API_SECRET"),
  },
  google: {
    clientId: optional("GOOGLE_CLIENT_ID"),
    clientSecret: optional("GOOGLE_CLIENT_SECRET"),
    /**
     * The redirect URI registered in Google Cloud Console.
     * Defaults to localhost for development.
     * Override with GOOGLE_CALLBACK_URL in production.
     */
    callbackUrl:
      process.env.GOOGLE_CALLBACK_URL ??
      "http://localhost:4000/api/v1/auth/google/callback",
  },
};
