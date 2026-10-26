import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

export async function seedUsers(prisma: PrismaClient) {
  const password = await bcrypt.hash("password123", 10);

  const users = [
    {
      email: "admin@example.com",
      name: "Admin User",
      password,
      role: Role.ADMIN,
      phoneNumber: "081234567890",
    },
    {
      email: "user@example.com",
      name: "Regular User",
      password,
      role: Role.USER,
      phoneNumber: "081234567891",
    },
  ];

  // Optional: generate 5 sample users
  for (let i = 1; i <= 5; i++) {
    users.push({
      email: `user${i}@example.com`,
      name: `User ${i}`,
      password,
      role: Role.USER,
      phoneNumber: `08123456789${i + 1}`,
    });
  }

  await prisma.users.createMany({
    data: users,
    skipDuplicates: true,
  });

  console.log(" seeded users table");
}
