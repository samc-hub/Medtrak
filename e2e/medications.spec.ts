import { test, expect } from "@playwright/test";

async function registerFreshUser(page: import("@playwright/test").Page) {
  const email = `med_${Date.now()}_${Math.floor(Math.random() * 1e4)}@example.com`;
  await page.goto("/register");
  await page.getByLabel("Name").fill("Med Tester");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("supersecret123");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

test("a user can add a medication, log a dose, and delete it", async ({ page }) => {
  await registerFreshUser(page);

  await page.goto("/dashboard/medications");
  await expect(page.getByText("No medications yet.")).toBeVisible();

  // Add a medication
  await page.getByLabel("Name").fill("Atorvastatin");
  await page.getByLabel("Dosage").fill("20 mg");
  await page.getByLabel("Frequency").fill("Once daily at night");
  await page.getByLabel("Notes (optional)").fill("After dinner");
  await page.getByRole("button", { name: "Add medication" }).click();

  // It appears in the list
  const row = page.locator("li", { hasText: "Atorvastatin" });
  await expect(row).toBeVisible();
  await expect(row).toContainText("20 mg");

  // Log a dose from the list, then confirm it shows on the Today overview
  await row.getByRole("button", { name: "Log dose" }).click();
  await page.goto("/dashboard");
  await expect(page.getByText("Doses logged today")).toBeVisible();
  await expect(page.locator("text=Atorvastatin").first()).toBeVisible();

  // Delete the medication
  await page.goto("/dashboard/medications");
  await page.getByRole("button", { name: "Delete Atorvastatin" }).click();
  await expect(page.getByText("No medications yet.")).toBeVisible();
});

test("medication form rejects an empty submission", async ({ page }) => {
  await registerFreshUser(page);
  await page.goto("/dashboard/medications");

  // Remove the required attributes the browser would otherwise enforce, so the
  // server-side Zod validation is what gets exercised.
  await page.evaluate(() => {
    document.querySelectorAll("input[required]").forEach((el) => el.removeAttribute("required"));
  });
  await page.getByRole("button", { name: "Add medication" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
});
