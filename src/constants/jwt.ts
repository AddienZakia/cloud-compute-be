import { Role } from "@prisma/client";

export type AppRole = Role | "DRIVER" | "MERCHANT";

export type JWTPayload = {
  id: string;
  email: string;
  role: AppRole;
};
