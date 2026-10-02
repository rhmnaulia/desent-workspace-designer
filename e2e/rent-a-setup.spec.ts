import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const slip = (page: Page) => page.getByRole("region", { name: "Your rental" });

test("build a setup and request it", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: /The Founder/ }).click();
  await page.getByRole("tab", { name: /Chair/ }).click();
  await page.getByRole("radio", { name: /Pro ergonomic chair/ }).check();
  await page.getByRole("tab", { name: /Gear/ }).click();
  await page.getByRole("button", { name: "Add one 27-inch monitor" }).click();
  await page.getByRole("checkbox", { name: /Potted monstera/ }).check();

  await expect(slip(page).getByText("Pro ergonomic chair")).toBeVisible();
  await expect(slip(page).getByText("×2")).toBeVisible();
  await expect(page).toHaveURL(/s=std\.pro\.m27x2\.stand\.keys\.lamp\.plant/);

  await slip(page).getByRole("link", { name: "Rent this setup" }).click();
  await expect(page.getByRole("heading", { name: "Review your setup" })).toBeVisible();
  await expect(page.getByRole("listitem").filter({ hasText: "Pro ergonomic chair" })).toBeVisible();

  // Submitting empty points at the first problem instead of failing silently.
  await page.getByRole("button", { name: "Send rental request" }).click();
  await expect(page.getByLabel("Deliver to")).toBeFocused();
  await expect(page.getByText("Choose where we should deliver.")).toBeVisible();

  await page.getByLabel("Deliver to").selectOption("Uluwatu");
  await page.getByLabel("Your name").fill("Sam Rivera");
  await page.getByLabel("WhatsApp or email").fill("sam@example.com");
  await page.getByRole("radio", { name: /3 months/ }).check();
  await page.getByRole("button", { name: "Send rental request" }).click();

  await expect(page.getByRole("heading", { name: "Request sent, Sam." })).toBeFocused();
  await expect(page.getByText(/delivery to Uluwatu/)).toBeVisible();
});

test("a shared link opens the same setup", async ({ page }) => {
  await page.goto("/?s=xl.rattan.m24x3.coffee");
  await expect(slip(page).getByText("Rattan side chair")).toBeVisible();
  await expect(slip(page).getByText("×3")).toBeVisible();
});

test("the whole flow works with a keyboard alone", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard flow is a desktop concern");
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to the designer" })).toBeFocused();
  await page.keyboard.press("Enter");

  // Tab into the step tabs, arrow to Chair, then into the radio group.
  const chairTab = page.getByRole("tab", { name: /Chair/ });
  await page.getByRole("tab", { name: /Desk/ }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(chairTab).toBeFocused();
  // Into the panel: past a card's "More about" button to the chair radio group.
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press("Tab");
    if (await page.evaluate(() => (document.activeElement as HTMLInputElement)?.type === "radio"))
      break;
  }
  await page.keyboard.press("ArrowDown");
  await expect(slip(page).getByText("Pro ergonomic chair")).toBeVisible();
});

for (const path of ["/", "/checkout?s=xl.pro.m27x2.lamp"]) {
  for (const scheme of ["light", "dark"] as const) {
    test(`no axe violations on ${path} (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
}

test("reflows to 320px without sideways scrolling (WCAG 1.4.10)", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  for (const path of ["/?s=xl.pro.m27x3.lamp.plant.coffee", "/checkout"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});

test("theme choice overrides the OS and survives a reload", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-theme", "light");

  await page.getByRole("radio", { name: "Dark" }).check();
  await expect(html).toHaveAttribute("data-theme", "dark");

  await page.reload();
  // Set by the head script, before React: no flash of the light theme.
  await expect(html).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("radio", { name: "Dark" })).toBeChecked();

  await page.getByRole("radio", { name: "Match system" }).check();
  await expect(html).toHaveAttribute("data-theme", "light");
});

test("product details open in a sheet and add to the setup", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: /Gear/ }).click();
  const trigger = page.getByRole("button", { name: "More about the Smart LED desk lamp" });
  await trigger.click();

  const sheet = page.getByRole("dialog", { name: "Smart LED desk lamp" });
  await expect(sheet).toBeVisible();
  await expect(sheet.getByRole("img", { name: /Photo of the Smart LED desk lamp/ })).toBeVisible();
  await expect(sheet.getByRole("button", { name: "Close" })).toBeFocused();

  await sheet.getByRole("button", { name: "Add to my setup" }).click();
  await expect(sheet).toBeHidden();
  await expect(slip(page).getByText("Smart LED desk lamp")).toBeVisible();

  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(trigger).toBeFocused();
});
