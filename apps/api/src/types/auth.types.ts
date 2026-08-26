import { Role } from "@prisma/client";

export type { Role };

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  emailVerified: boolean;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
