import { Role } from "@prisma/client";

export type UsersType = {
  id: string;
  email: string;
  name: string;
  role: Role;
  phoneNumber?: string | null;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
