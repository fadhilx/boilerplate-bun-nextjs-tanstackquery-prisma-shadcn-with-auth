import { test, expect } from "@playwright/test";
import { TEST_CONFIG } from "../../test.config";

const BASE_URL = `http://localhost:${TEST_CONFIG.PORT}`;

test.describe("Authentication", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto(BASE_URL);
  });

  test("should redirect to login when not authenticated", async ({ page }) => {
    await expect(page).toHaveURL(/.*login/);
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.fill('input[name="email"]', "wrong@example.com");
    await page.fill('input[name="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    // Wait for error message
    await expect(page.locator("text=Invalid email or password")).toBeVisible();
  });

  test("should login successfully with admin credentials", async ({ page }) => {
    // Login with admin credentials (from seed)
    await page.fill('input[name="email"]', "admin@example.com");
    await page.fill('input[name="password"]', "admin123");
    await page.click('button[type="submit"]');

    // Should redirect to home page
    await expect(page).toHaveURL(new URL("/", BASE_URL).href);

    // Should see welcome message
    await expect(page.locator("text=Welcome")).toBeVisible();
    await expect(page.locator("text=admin@example.com")).toBeVisible();
    await expect(page.locator("text=Administrator")).toBeVisible();
  });

  test("should show create user button for admin", async ({ page }) => {
    // Login as admin
    await page.fill('input[name="email"]', "admin@example.com");
    await page.fill('input[name="password"]', "admin123");
    await page.click('button[type="submit"]');

    // Wait for home page
    await expect(page.locator("text=Welcome")).toBeVisible();

    // Should see manage users button
    await expect(page.locator("text=Manage Users")).toBeVisible();

    // Click to navigate to dashboard
    await page.click("text=Manage Users");
    await expect(page).toHaveURL(/.*dashboard\/users/);

    // Wait for dashboard to load
    await expect(page.locator("text=User Management")).toBeVisible();

    // Should see create user button on dashboard
    await expect(page.locator("button:has-text('Create User')")).toBeVisible();
  });

  test("should allow admin to create new user", async ({ page }) => {
    // Login as admin
    await page.fill('input[name="email"]', "admin@example.com");
    await page.fill('input[name="password"]', "admin123");
    await page.click('button[type="submit"]');

    // Wait for home page
    await expect(page.locator("text=Welcome")).toBeVisible();

    // Navigate to dashboard
    await page.click("text=Manage Users");
    await expect(page).toHaveURL(/.*dashboard\/users/);

    // Wait for dashboard to load
    await expect(page.locator("text=User Management")).toBeVisible();

    // Wait for and click create user button (opens modal)
    const createButton = page.locator("button:has-text('Create User')");
    await expect(createButton).toBeVisible();
    await createButton.click();

    // Wait for modal to open
    await expect(page.locator("text=Create New User")).toBeVisible();

    // Fill in user details in modal
    await page.fill('input[id="name"]', "Test User");
    const testEmail = `test${Date.now()}@example.com`;
    await page.fill('input[id="email"]', testEmail);
    await page.fill('input[id="password"]', "test123");

    // Submit form - wait for button to be enabled and click
    const submitButton = page.locator(
      'button[type="submit"]:has-text("Create User")'
    );
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Wait for modal to close
    await expect(page.locator("text=Create New User")).not.toBeVisible({
      timeout: 10000,
    });

    // Wait for user to appear in table
    await expect(page.locator(`text=${testEmail}`)).toBeVisible({
      timeout: 10000,
    });
  });

  test("should prevent creating user with existing email", async ({ page }) => {
    // Login as admin
    await page.fill('input[name="email"]', "admin@example.com");
    await page.fill('input[name="password"]', "admin123");
    await page.click('button[type="submit"]');

    // Wait for home page
    await expect(page.locator("text=Welcome")).toBeVisible();

    // Navigate to dashboard
    await page.click("text=Manage Users");
    await expect(page).toHaveURL(/.*dashboard\/users/);

    // Wait for dashboard to load
    await expect(page.locator("text=User Management")).toBeVisible();

    // Wait for and click create user button (opens modal)
    const createButton = page.locator("button:has-text('Create User')");
    await expect(createButton).toBeVisible();
    await createButton.click();

    // Wait for modal to open and form to be ready
    await expect(page.locator("text=Create New User")).toBeVisible();
    await expect(page.locator('input[id="email"]')).toBeVisible();

    // Try to create user with admin email (should fail)
    await page.fill('input[id="email"]', "admin@example.com");
    await page.fill('input[id="password"]', "test123");

    // Submit form
    await page.click('button[type="submit"]:has-text("Create User")');

    // Should see error message in modal (wait for mutation to complete)
    await expect(
      page.locator("text=User with this email already exists")
    ).toBeVisible({ timeout: 10000 });
  });

  test("should logout successfully", async ({ page }) => {
    // Login as admin
    await page.fill('input[name="email"]', "admin@example.com");
    await page.fill('input[name="password"]', "admin123");
    await page.click('button[type="submit"]');

    // Wait for home page
    await expect(page.locator("text=Welcome")).toBeVisible();

    // Logout
    await page.click('button:has-text("Logout")');

    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
  });
});
