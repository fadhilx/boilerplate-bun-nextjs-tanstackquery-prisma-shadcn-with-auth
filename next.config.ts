import type { NextConfig } from "next";
import { TEST_CONFIG } from "./test.config";
const appEnv =
  process.env.APP_ENV ||
  (process.env.NODE_ENV === "development" ? "development" : "production");
const isTestAppEnv = appEnv === "test";
const databaseUrl = isTestAppEnv
  ? TEST_CONFIG.DB_URL
  : process.env.DATABASE_URL;
const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  env: {
    DATABASE_URL: databaseUrl,
    APP_ENV: appEnv,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  outputFileTracingExcludes: {
    "*": [".src/generated/prisma", "./prisma"],
  },
};

export default nextConfig;
