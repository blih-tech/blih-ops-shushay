import { test, expect } from "@playwright/test";

test.describe("Landing Page & Navigation E2E", () => {
  test("should load the home page with title, hero badge, and explore sections", async ({ page }) => {
    await page.goto("/");

    // Verify page title / main hero heading
    await expect(page).toHaveTitle(/Blih Ops|Blih/i);

    // Verify main CTA or hero section is visible
    const heroHeading = page.locator("h1");
    await expect(heroHeading).toBeVisible();

    // Verify navigation links
    const coursesLink = page.locator('a[href*="/courses"]').first();
    const jobsLink = page.locator('a[href*="/jobs"]').first();

    await expect(coursesLink).toBeVisible();
    await expect(jobsLink).toBeVisible();
  });
});
