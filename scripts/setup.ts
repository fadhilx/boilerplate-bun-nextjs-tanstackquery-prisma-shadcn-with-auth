#!/usr/bin/env bun

import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

/**
 * Formats a project name to be URL-safe and consistent
 */
function formatProjectName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-") // Replace non-alphanumeric (except hyphens) with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Main setup function
 */
async function setup() {
  console.log("🚀 Project Setup Script\n");

  // Prompt for project name
  const args = process.argv.slice(2);
  let projectName: string;

  if (args.length > 0) {
    projectName = args[0];
  } else {
    // Read from stdin if available (for non-interactive use)
    const readline = await import("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    projectName = await new Promise<string>((resolve) => {
      rl.question("Enter your project name: ", (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }

  if (!projectName || projectName.trim().length === 0) {
    console.error("✗ Project name cannot be empty");
    process.exit(1);
  }

  const formattedName = formatProjectName(projectName);
  const formattedNameNext = `${formattedName}-next`;

  console.log(`\n📝 Project name: ${projectName}`);
  console.log(`📝 Formatted name: ${formattedName}`);
  console.log(`📝 Formatted name (with -next): ${formattedNameNext}\n`);

  console.log("🔄 Replacing 'myprojectname' with project name...\n");

  const rootDir = process.cwd();
  const filesToUpdate: Array<{
    path: string;
    replacements: Array<{ search: string | RegExp; replace: string }>;
  }> = [
    {
      path: join(rootDir, "package.json"),
      replacements: [
        {
          search: /"name":\s*"myprojectname-next"/,
          replace: `"name": "${formattedNameNext}"`,
        },
      ],
    },
    {
      path: join(rootDir, "bun.lock"),
      replacements: [
        {
          search: /"name":\s*"myprojectname-next"/,
          replace: `"name": "${formattedNameNext}"`,
        },
      ],
    },
    {
      path: join(rootDir, "test.config.ts"),
      replacements: [
        {
          search: /myprojectnametest/,
          replace: `${formattedName}test`,
        },
      ],
    },
    {
      path: join(rootDir, "README.md"),
      replacements: [
        {
          search: /# myprojectname Next\.js/,
          replace: `# ${formattedName} Next.js`,
        },
        { search: /myprojectname-next/g, replace: formattedNameNext },
        {
          search:
            /DATABASE_URL="postgresql:\/\/postgres:your_password@localhost:5432\/myprojectname\?schema=public"/g,
          replace: `DATABASE_URL="postgresql://postgres:your_password@localhost:5432/${formattedName}?schema=public"`,
        },
        {
          search: /createdb myprojectname/,
          replace: `createdb ${formattedName}`,
        },
        {
          search: /psql -U postgres -c "CREATE DATABASE myprojectname;"/,
          replace: `psql -U postgres -c "CREATE DATABASE ${formattedName};"`,
        },
        {
          search: /myprojectname-next\//,
          replace: `${formattedNameNext}/`,
        },
        {
          search: /`myprojectname`/g,
          replace: `\`${formattedName}\``,
        },
        {
          search: /replaces `myprojectname`/,
          replace: `replaces \`${formattedName}\``,
        },
      ],
    },
    {
      path: join(rootDir, "scripts", "setup.ts"),
      replacements: [
        {
          search: /Replacing 'myprojectname'/,
          replace: `Replacing '${formattedName}'`,
        },
        {
          search: /"name":\s*"myprojectname-next"/g,
          replace: `"name": "${formattedNameNext}"`,
        },
        {
          search: /myprojectnametest/g,
          replace: `${formattedName}test`,
        },
        {
          search: /# myprojectname Next\.js/,
          replace: `# ${formattedName} Next.js`,
        },
        { search: /myprojectname-next/g, replace: formattedNameNext },
        {
          search:
            /DATABASE_URL="postgresql:\/\/postgres:your_password@localhost:5432\/myprojectname\?schema=public"/g,
          replace: `DATABASE_URL="postgresql://postgres:your_password@localhost:5432/${formattedName}?schema=public"`,
        },
        {
          search: /createdb myprojectname/,
          replace: `createdb ${formattedName}`,
        },
        {
          search: /psql -U postgres -c "CREATE DATABASE myprojectname;"/,
          replace: `psql -U postgres -c "CREATE DATABASE ${formattedName};"`,
        },
        {
          search: /myprojectname-next\//g,
          replace: `${formattedNameNext}/`,
        },
        {
          search: /`myprojectname`/g,
          replace: `\`${formattedName}\``,
        },
        {
          search: /replaces `myprojectname`/,
          replace: `replaces \`${formattedName}\``,
        },
      ],
    },
  ];

  // Update files
  for (const file of filesToUpdate) {
    if (!existsSync(file.path)) {
      console.warn(`⚠ Warning: ${file.path} not found, skipping...`);
      continue;
    }

    try {
      let content = await readFile(file.path, "utf-8");
      for (const replacement of file.replacements) {
        content = content.replace(replacement.search, replacement.replace);
      }
      // Catch-all: replace any remaining standalone instances of myprojectname
      // This catches cases like `myprojectname` in backticks, standalone text, etc.
      // We do this after specific replacements to catch any we might have missed
      // Use negative lookahead to avoid replacing parts of already-processed strings
      content = content.replace(/myprojectname(?!-next|test)/g, formattedName);
      await writeFile(file.path, content, "utf-8");
      console.log(`✓ Updated ${file.path}`);
    } catch (error) {
      console.error(`✗ Error updating ${file.path}:`, error);
      process.exit(1);
    }
  }

  console.log("\n✅ Setup complete! Your project has been configured.");
  console.log(`\n📋 Next steps:`);
  console.log(`   1. Update your .env file with the correct DATABASE_URL`);
  console.log(`   2. Run: bun install`);
  console.log(`   3. Run: bunx prisma migrate dev`);
  console.log(`   4. Run: bun run db:seed`);
  console.log(`   5. Run: bun run dev`);
}

// Run setup
setup().catch((error) => {
  console.error("✗ Setup failed:", error);
  process.exit(1);
});
