/** App URL constants — read from environment variables with localhost fallbacks for development. */
export const SKILLS_URL =
  process.env.NEXT_PUBLIC_SKILLS_URL || "http://localhost:3001";
export const TALENT_URL =
  process.env.NEXT_PUBLIC_TALENT_URL || "http://localhost:3002";
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
