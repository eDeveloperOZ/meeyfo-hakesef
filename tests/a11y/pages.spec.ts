import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { loadDataset } from "../../scripts/lib/load-data";

const dataset = loadDataset();
const staticRoutes = [
  "/",
  "/methodology",
  "/how-it-works",
  "/glossary",
  "/data",
  "/about",
  "/accessibility",
  "/privacy",
  "/terms",
  "/corrections",
  `/party/${dataset.parties[0]!.party_id}`,
  `/who/${dataset.persons[0]!.person_id}`,
  "/not-a-real-page",
];

for (const route of staticRoutes) {
  test(`${route} has no critical axe violations`, async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter(({ impact }) => impact === "critical")).toEqual([]);
  });
}

test("visible focus and reduced motion preferences are implemented", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  const focused = page.locator(":focus");
  await expect(focused).toBeVisible();
  const focusStyle = await focused.evaluate((element) => {
    const style = getComputedStyle(element);
    return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
  });
  expect(focusStyle.outlineStyle).not.toBe("none");
  expect(focusStyle.outlineWidth).not.toBe("0px");
});

test("download dialog traps focus and restores it to its trigger", async ({ page }) => {
  await page.goto("/data");
  const trigger = page.getByRole("button", { name: "הורדת הנתונים" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "הנתונים פתוחים וחופשיים לשימוש" });
  await expect(dialog).toBeVisible();
  for (let index = 0; index < 8; index += 1) {
    await page.keyboard.press("Tab");
    await expect(page.locator('[role="dialog"] :focus')).toHaveCount(1);
  }
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("financing visualizations expose Hebrew labels and adjacent table equivalents", async ({
  page,
}) => {
  await page.goto("/party/yashar");
  const charts = page.locator("svg[role='img']");
  expect(await charts.count()).toBeGreaterThan(3);
  for (let index = 0; index < (await charts.count()); index += 1) {
    await expect(charts.nth(index)).toHaveAttribute("aria-label", /[\u0590-\u05FF]/);
  }

  const tableDisclosures = page.locator(".chart-table-disclosure");
  await expect(tableDisclosures).toHaveCount(3);
  for (let index = 0; index < (await tableDisclosures.count()); index += 1) {
    await tableDisclosures.nth(index).locator("summary").click();
    const table = tableDisclosures.nth(index).getByRole("table");
    await expect(table).toBeVisible();
    await expect(table.locator("th")).not.toHaveCount(0);
  }
});
