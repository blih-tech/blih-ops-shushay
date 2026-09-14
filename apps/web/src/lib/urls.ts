/** App URL constants — read from environment variables with relative/localhost fallbacks for development. */
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "";
export const SKILLS_URL = APP_URL;
export const TALENT_URL = APP_URL;
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
