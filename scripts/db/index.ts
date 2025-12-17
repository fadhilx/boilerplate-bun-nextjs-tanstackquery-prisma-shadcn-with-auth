#!/usr/bin/env bun

import { $ } from "bun";
import { existsSync } from "fs";
import { join } from "path";

// Load environment variables
import "dotenv/config";

const command = process.argv[2];

if (!command) {
  console.error("Usage: bun run scripts/db/index.ts <setup|clean|seed|reset>");
  process.exit(1);
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("Error: DATABASE_URL environment variable is not set");
  process.exit(1);
}

async function setup() {
  console.log("🔧 Setting up database...");

  try {
    // Generate Prisma Client
    console.log("📦 Generating Prisma Client...");
    await $`bunx prisma generate`.quiet();
    console.log("✅ Prisma Client generated");

    // Run migrations
    console.log("🔄 Running migrations...");
    const migrationsExist = existsSync(
      join(process.cwd(), "prisma", "migrations")
    );

    if (migrationsExist) {
      await $`bunx prisma migrate deploy`.quiet();
      console.log("✅ Migrations applied");
    } else {
      console.log("⚠️  No migrations found, pushing schema...");
      await $`bunx prisma db push --accept-data-loss`.quiet();
      console.log("✅ Schema pushed");
    }

    console.log("✅ Database setup complete");
  } catch (error) {
    console.error("❌ Error setting up database:", error);
    process.exit(1);
  }
}

async function clean() {
  console.log("🧹 Cleaning database...");

  try {
    // Drop the database and recreate it (this will drop all tables)
    // Note: migrate reset will also run seed if configured, but we handle that in reset()
    console.log("🗑️  Dropping all tables...");
    await $`bunx prisma migrate reset --force`.quiet();
    console.log("✅ Database cleaned");
  } catch (error) {
    console.error("❌ Error cleaning database:", error);
    process.exit(1);
  }
}

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    const seedFile = join(process.cwd(), "prisma", "seed.ts");
    const seedJsFile = join(process.cwd(), "prisma", "seed.js");

    if (existsSync(seedFile)) {
      console.log("📝 Running seed script with bun...");
      // Use bun directly to run the seed file
      await $`bun ${seedFile}`.quiet();
      console.log("✅ Database seeded");
    } else if (existsSync(seedJsFile)) {
      console.log("📝 Running seed script...");
      await $`bunx prisma db seed`.quiet();
      console.log("✅ Database seeded");
    } else {
      console.log("⚠️  No seed file found at prisma/seed.ts or prisma/seed.js");
      console.log(
        "   Create a seed file to populate your database with initial data"
      );
    }
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

async function reset() {
  console.log("🔄 Resetting database...");

  try {
    // Generate Prisma Client first
    console.log("📦 Generating Prisma Client...");
    try {
      await $`bunx prisma generate`.quiet();
    } catch {
      // Try with npx if bunx fails
      await $`npx prisma generate`.quiet();
    }

    // Try migrate reset first (this will drop, migrate, but skip seed)
    console.log("🗑️  Resetting database...");

    try {
      await $`bunx prisma migrate reset --force --skip-seed`.quiet();
    } catch {
      // migrate reset failed, try with npx
      try {
        await $`npx prisma migrate reset --force --skip-seed`.quiet();
      } catch {
        // If migrate reset fails, use db push as fallback
        try {
          await $`bunx prisma db push --accept-data-loss`.quiet();
        } catch {
          // Last resort: try npx db push
          await $`npx prisma db push --accept-data-loss`.quiet();
        }
      }
    }

    // Always run seed after reset
    console.log("🌱 Seeding database...");
    const seedFile = join(process.cwd(), "prisma", "seed.ts");
    if (existsSync(seedFile)) {
      await $`bun ${seedFile}`.quiet();
      console.log("✅ Seed completed");
    } else {
      console.log("⚠️  No seed file found at prisma/seed.ts");
    }

    console.log("✅ Database reset complete");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    process.exit(1);
  }
}

// Execute the requested command
switch (command) {
  case "setup":
    await setup();
    break;
  case "clean":
    await clean();
    break;
  case "seed":
    await seed();
    break;
  case "reset":
    await reset();
    break;
  default:
    console.error(`Unknown command: ${command}`);
    console.error(
      "Usage: bun run scripts/db/index.ts <setup|clean|seed|reset>"
    );
    process.exit(1);
}
