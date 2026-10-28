import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export async function seedDrivers(prisma: PrismaClient) {
  const password = await bcrypt.hash("testing123", 10);

  const driversData = [
    {
      email: "driver@ets.com",
      name: "Budi Driver Kilat",
      password,
      isAvailable: true,
    },
    {
      email: "driver.agus@ets.com",
      name: "Agus Prasetyo",
      password,
      isAvailable: true,
    },
    {
      email: "driver.joko@ets.com",
      name: "Joko Widodo",
      password,
      isAvailable: true,
    },
    {
      email: "driver.ridwan@ets.com",
      name: "Ridwan Kamil",
      password,
      isAvailable: true,
    },
    {
      email: "driver.hendra@ets.com",
      name: "Hendra Gunawan",
      password,
      isAvailable: false,
    },
    {
      email: "driver.arif@ets.com",
      name: "Arif Hidayat",
      password,
      isAvailable: true,
    },
    {
      email: "driver.fajar@ets.com",
      name: "Fajar Nugraha",
      password,
      isAvailable: true,
    },
    {
      email: "driver.dimas@ets.com",
      name: "Dimas Saputra",
      password,
      isAvailable: true,
    },
  ];

  for (const driver of driversData) {
    await prisma.driver.upsert({
      where: { email: driver.email },
      update: {
        name: driver.name,
        password: driver.password,
        isAvailable: driver.isAvailable,
      },
      create: driver,
    });
  }

  console.log(
    `✅ Seeded ${driversData.length} drivers with password: testing123`,
  );
}
