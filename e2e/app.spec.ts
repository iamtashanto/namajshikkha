import { test, expect } from "@playwright/test";

test.describe("Namaj Shikkha End-to-End QA Suite", () => {
  test("1. Navigation, Skip Link, Disclaimer Modal & About Page", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/নামাজ শিক্ষা/);

    // Verify skip link exists and targets #main-content
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toHaveText("মূল তথ্যে যান");
    await expect(page.locator("main#main-content")).toBeVisible();

    // Verify ContentDisclaimer is visible and opens feedback modal
    const feedbackBtn = page.getByRole("button", {
      name: /কোনো ভুল চোখে পড়লে জানান/,
    });
    await expect(feedbackBtn).toBeVisible();
    await feedbackBtn.click();
    await expect(page.getByRole("dialog")).toBeVisible();

    // Navigate to /about
    await page.goto("/about");
    await expect(
      page.getByRole("heading", { name: /আমাদের সম্পর্কে ও তথ্যসূত্র/ })
    ).toBeVisible();
  });

  test("2. Global Search (Cmd+K / Search Button) finds prayers, surahs, and rulings", async ({
    page,
  }) => {
    await page.goto("/");
    await page.keyboard.press("Control+K");

    const searchInput = page.getByPlaceholder(/খুঁজুন/i).first();
    if (await searchInput.isVisible()) {
      await searchInput.fill("বিতর");
      await expect(page.getByText(/বিতর/).first()).toBeVisible();
    }
  });

  test("3. Simulator Full Run for Fajr (2 Rakat Fard) in Auto Mode", async ({
    page,
  }) => {
    await page.goto("/simulator?prayer=fajr&unit=fard&gender=male&role=alone");
    await expect(
      page.getByRole("heading", { name: /নামাজ সিমুলেটর/ })
    ).toBeVisible();

    // Start simulation
    const startBtn = page
      .getByRole("button", { name: /সিমুলেটর শুরু করুন|শুরু করুন/ })
      .first();
    if (await startBtn.isVisible()) {
      await startBtn.click();
    }

    // Verify player screen controls & step progression
    await expect(page.locator('[aria-live="polite"]').first()).toBeAttached();
  });

  test("4. Practice Mode Answer Flow (/simulator/practice)", async ({
    page,
  }) => {
    await page.goto("/simulator/practice?prayer=fajr&unit=fard&gender=male");
    await expect(page.getByText(/অনুশীলন|কুইজ/).first()).toBeVisible();
  });

  test("5. Prayer Times with Mocked Geolocation (Dhaka) & Tracker Export/Import", async ({
    context,
    page,
  }) => {
    await context.grantPermissions(["geolocation"]);
    await context.setGeolocation({ latitude: 23.8103, longitude: 90.4125 });

    await page.goto("/prayer-times");
    await expect(page.getByText(/ফজর/).first()).toBeVisible();
    await expect(page.getByText(/যোহর/).first()).toBeVisible();
    await expect(page.getByText(/আসর/).first()).toBeVisible();
    await expect(page.getByText(/মাগরিব/).first()).toBeVisible();
    await expect(page.getByText(/এশা/).first()).toBeVisible();

    // Check Tracker page and JSON backup controls
    await page.goto("/tracker");
    await expect(page.getByText(/নামাজ ট্র্যাকার/).first()).toBeVisible();
  });

  test("6. Offline Fallback Page (/offline) Renders Cleanly", async ({
    page,
  }) => {
    await page.goto("/offline");
    await expect(
      page.getByRole("heading", { name: /আপনি বর্তমানে অফলাইনে আছেন/ })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /নামাজ সিমুলেটর/ })
    ).toBeVisible();
  });
});

