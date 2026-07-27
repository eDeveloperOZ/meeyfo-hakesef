import { expect, test } from "@playwright/test";
import { loadDataset } from "../../scripts/lib/load-data";
import { formatHebrewDateTime } from "../../src/lib/format";

const dataset = loadDataset();
const firstParty = dataset.parties[0]!;
const partiesWithWebsites = dataset.parties.filter(({ website_url }) => website_url);

test.describe.configure({ mode: "serial" });

test("home is Hebrew RTL and navigates to a party page", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "he");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1, name: "מאיפה הכסף" })).toBeVisible();
  await expect(page.getByText(formatHebrewDateTime(dataset.release.releasedAt))).toBeVisible();

  const partyLink = page.getByRole("link", { name: new RegExp(firstParty.name_he) }).first();
  await partyLink.click();
  await expect(page).toHaveURL(new RegExp(`/party/${firstParty.party_id}/?$`));
  await expect(page.getByRole("heading", { level: 1, name: firstParty.name_he })).toBeVisible();
});

test("countdown dismissal is private and persists across reload", async ({ page }) => {
  await page.goto("/");
  const close = page.getByRole("button", { name: "סגירת ספירת הימים לבחירות" });
  await expect(close).toBeVisible();
  await close.click();
  await expect(close).toBeHidden();
  await page.reload();
  await expect(close).toBeHidden();
});

test("download dialog permits an immediate real CSV download and restores focus", async ({
  page,
}) => {
  await page.goto("/data");
  const trigger = page.getByRole("button", { name: "הורדת הנתונים" });
  await trigger.focus();
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "הנתונים פתוחים וחופשיים לשימוש" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: /הורדת הנתונים/ })).toBeVisible();
  await expect(dialog.getByRole("link", { name: /GitHub/ })).toBeVisible();
  await expect(dialog.getByRole("link", { name: /X/ })).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await dialog.getByRole("link", { name: /הורדת הנתונים/ }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("master-financing-records.csv");

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("issue links point to the structured GitHub forms", async ({ page }) => {
  await page.goto("/");
  const addParty = page.getByRole("link", { name: /חסרה מפלגה/ });
  await expect(addParty).toHaveAttribute("href", /issues\/new\?template=add-party\.yml/);

  await page.goto(`/party/${firstParty.party_id}`);
  await expect(page.getByRole("link", { name: "דיווח על טעות" })).toHaveAttribute(
    "href",
    /issues\/new\?template=incorrect-data\.yml/,
  );
});

test("all external party links use the same component and interaction attributes", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Viewport-independent exhaustive data check.");
  test.setTimeout(120_000);
  const signatures: string[] = [];
  for (const party of partiesWithWebsites) {
    await page.goto(`/party/${party.party_id}`);
    const link = page.locator('[data-component="external-party-link"]');
    await expect(link).toHaveCount(1);
    await expect(link).toHaveAttribute("href", party.website_url);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer external");
    signatures.push(
      await link.evaluate((element) =>
        [
          element.tagName,
          element.className,
          element.getAttribute("target"),
          element.getAttribute("rel"),
          element.textContent?.replace(/\s+/g, " ").trim(),
        ].join("|"),
      ),
    );
  }
  expect(new Set(signatures).size).toBeLessThanOrEqual(1);
});

test("every party page exposes the same section skeleton and recorded source URLs", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Viewport-independent exhaustive data check.");
  test.setTimeout(120_000);
  let expectedHeadings: string[] | undefined;
  const sourceById = new Map(dataset.sources.map((source) => [source.source_id, source]));
  for (const party of dataset.parties) {
    await page.goto(`/party/${party.party_id}`);
    const headings = await page.locator("main h2").allTextContents();
    expectedHeadings ??= headings;
    expect(headings).toEqual(expectedHeadings);

    const expectedSources = new Set<string>();
    const eligibility = sourceById.get(party.eligibility_source_id);
    if (eligibility) expectedSources.add(eligibility.url);
    const portal = sourceById.get("src-comptroller-financing-portal");
    if (portal) expectedSources.add(portal.url);
    for (const record of dataset.financingRecords.filter(
      ({ party_id }) => party_id === party.party_id,
    )) {
      const source = sourceById.get(record.source_id);
      if (source) expectedSources.add(source.url);
    }
    const actualSources = await page
      .locator(".sources-section a.source-link")
      .evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).href));
    expect(new Set(actualSources)).toEqual(expectedSources);
  }
});

test("records are amount-descending and details work when records exist", async ({ page }) => {
  const partyWithRecords = dataset.parties.find((party) =>
    dataset.financingRecords.some(({ party_id }) => party_id === party.party_id),
  );
  if (!partyWithRecords) {
    test.skip(true, "The initial official dataset has no retrievable financing records yet.");
  }
  await page.goto(`/party/${partyWithRecords!.party_id}`);
  const amounts = await page.locator(".record-row > div:first-child > strong").allTextContents();
  const numeric = amounts.map((amount) => Number(amount.replace(/[^\d]/g, "")));
  expect(numeric).toEqual([...numeric].sort((left, right) => right - left));

  const trigger = page.getByRole("button", { name: "מידע נוסף" }).first();
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "פרטי הרשומה" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: /לצפייה במקור הרשמי/ })).toHaveAttribute(
    "rel",
    "noopener noreferrer external",
  );
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("keyboard navigation reaches the skip link and main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "דילוג לתוכן המרכזי" });
  await expect(skip).toBeFocused();
  await skip.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});
