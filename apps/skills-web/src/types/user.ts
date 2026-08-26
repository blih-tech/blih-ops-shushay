export type Role = "TALENT" | "COMPANY" | "ADMIN";

export interface User {
  id: string;
  email: string;
  role: Role;
  emailVerified?: boolean;
}
