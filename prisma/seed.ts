import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export async function main() {
  console.log("🌱 Starting seed...");

  // Create admin user
  const adminEmail = "admin@example.com";
  const adminPassword = "admin123";

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: "Admin User",
          role: "ADMIN",
        },
      });
      console.log(`✅ Created admin user: ${adminEmail} / ${adminPassword}`);
    } else {
      console.log(`ℹ️  Admin user already exists: ${adminEmail}`);
    }

    console.log("✅ Seed completed");
  } catch (error) {
    console.error("❌ Error in seed function:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
