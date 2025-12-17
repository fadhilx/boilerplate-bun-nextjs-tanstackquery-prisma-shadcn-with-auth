import { test, expect } from "@playwright/test";
import { TEST_CONFIG } from "../../test.config";

const BASE_URL = `http://localhost:${TEST_CONFIG.PORT}`;

test.describe("account page setting", () => {
  test.setTimeout(60_000);
  test("test opening the page", async ({ page }) => {
    await page.goto(BASE_URL);
    // Should redirect to login when not authenticated
    await expect(page).toHaveURL(/.*login/);
    // Check that the page loaded (has login form)
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });
});
