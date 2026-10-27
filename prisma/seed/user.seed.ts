import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

export async function seedUsers(prisma: PrismaClient) {
  const password = await bcrypt.hash("testing123", 10);

  const usersData = [
    {
      email: "admin@ets.com",
      name: "Super Admin ETS",
      password,
      role: Role.ADMIN,
      phoneNumber: "081234567800",
    },
    {
      email: "admin@example.com",
      name: "Admin Operasional",
      password,
      role: Role.ADMIN,
      phoneNumber: "081234567801",
    },
    {
      email: "user@ets.com",
      name: "Budi Santoso",
      password,
      role: Role.USER,
      phoneNumber: "081234567810",
    },
    {
      email: "user@example.com",
      name: "Regular User",
      password,
      role: Role.USER,
      phoneNumber: "081234567811",
    },
    {
      email: "siti@ets.com",
      name: "Siti Nurhaliza",
      password,
      role: Role.USER,
      phoneNumber: "081234567812",
    },
    {
      email: "andi@ets.com",
      name: "Andi Wijaya",
      password,
      role: Role.USER,
      phoneNumber: "081234567813",
    },
    {
      email: "dewi@ets.com",
      name: "Dewi Lestari",
      password,
      role: Role.USER,
      phoneNumber: "081234567814",
    },
    {
      email: "rizky@ets.com",
      name: "Rizky Pratama",
      password,
      role: Role.USER,
      phoneNumber: "081234567815",
    },
    {
      email: "maya@ets.com",
      name: "Maya Anggraini",
      password,
      role: Role.USER,
      phoneNumber: "081234567816",
    },
    {
      email: "reza@ets.com",
      name: "Reza Rahadian",
      password,
      role: Role.USER,
      phoneNumber: "081234567817",
    },
  ];

  for (let i = 1; i <= 5; i++) {
    usersData.push({
      email: `user${i}@example.com`,
      name: `User Tester ${i}`,
      password,
      role: Role.USER,
      phoneNumber: `08123456782${i}`,
    });
  }

  for (const user of usersData) {
    await prisma.users.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password: user.password,
        role: user.role,
        phoneNumber: user.phoneNumber,
      },
      create: user,
    });
  }

  console.log(`✅ Seeded ${usersData.length} users with password: testing123`);
}
