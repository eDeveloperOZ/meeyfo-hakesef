import { expect, test } from "@playwright/test";

test("download dialog remains usable at the project viewport", async ({ page }) => {
  await page.goto("/data");
  await page.getByRole("button", { name: "הורדת הנתונים" }).click();
  const dialog = page.getByRole("dialog", { name: "הנתונים פתוחים וחופשיים לשימוש" });
  await expect(dialog).toBeInViewport();
  const box = await dialog.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(await page.evaluate(() => innerWidth));
});
