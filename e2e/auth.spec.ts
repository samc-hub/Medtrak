import { test, expect } from "@playwright/test";

// A unique email per run keeps registration idempotent across repeated runs.
const unique = () => `user_${Date.now()}_${Math.floor(Math.random() * 1e4)}@example.com`;

test("a new user can register, reach the dashboard, log out, and log back in", async ({ page }) => {
  const email = unique();
  const password = "supersecret123";

  // Register
  await page.goto("/register");
  await page.getByLabel("Name").fill("Sam Tester");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();

  // Lands on the dashboard, greeted by name
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: /Good to see you, Sam/ })).toBeVisible();

  // Log out
  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL(/\/login$/);

  // Log back in
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
});

test("protected dashboard redirects an unauthenticated visitor to login", async ({ page }) => {
  await page.goto("/dashboard/medications");
  await expect(page).toHaveURL(/\/login/);
});

test("registering with an existing email shows an error", async ({ page }) => {
  const email = unique();
  const password = "supersecret123";

  await page.goto("/register");
  await page.getByLabel("Name").fill("First Person");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await page.getByRole("button", { name: "Log out" }).click();

  // Same email again
  await page.goto("/register");
  await page.getByLabel("Name").fill("Second Person");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("alert")).toContainText(/already exists/i);
});
