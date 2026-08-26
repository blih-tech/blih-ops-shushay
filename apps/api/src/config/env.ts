import "dotenv/config";

function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

export const env = {
  port: process.env.PORT ?? "4000",
  databaseUrl: required("DATABASE_URL"),
  jwtSecret: required("JWT_SECRET"),
  corsOrigins: (process.env.CORS_ORIGINS ?? "")
    .split(",")
    .filter(Boolean).length > 0
    ? (process.env.CORS_ORIGINS ?? "").split(",").filter(Boolean)
    : [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
      ],
  nodeEnv: process.env.NODE_ENV ?? "development",
  uploadsBaseUrl: process.env.UPLOADS_BASE_URL ?? "http://localhost:4000/uploads",
};
