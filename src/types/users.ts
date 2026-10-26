import { Role } from "@prisma/client";

export type UsersType = {
  id: string;
  email: string;
  name: string;
  role: Role;
  phoneNumber?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};
