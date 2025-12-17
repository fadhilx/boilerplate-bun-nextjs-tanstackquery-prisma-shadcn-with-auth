import { defineConfig, devices } from "@playwright/test";

// Central configuration - change port here only!
export const TEST_CONFIG = {
  PORT: 50410,
  DB_URL: "postgresql://postgres:dev@localhost:5432/myprojectnametest",
  APP_ENV: "test",
  NEXT_DIST_DIR: ".next-test",
};

const BASE_URL = `http://localhost:${TEST_CONFIG.PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: "list",
  timeout: 60000, //  60 seconds global timeout
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // No globalSetup/globalTeardown - server should be started manually
});
