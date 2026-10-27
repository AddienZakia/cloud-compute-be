import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { seedDrivers } from "./driver.seed";
import { seedMerchantsAndCatalogs } from "./merchant.seed";
import { seedUsers } from "./user.seed";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting full database seed...");
  await seedUsers(prisma);
  await seedDrivers(prisma);
  await seedMerchantsAndCatalogs(prisma);
}

main()
  .then(() => {
    console.log("🚀 Database seeded completely with all test accounts (password: testing123)!");
    process.exit(0);
  })
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  });
