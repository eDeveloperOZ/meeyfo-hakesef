import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: /(?:e2e|a11y)\/.*\.spec\.ts/,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["html", { open: "never" }], ["github"]] : "list",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
    locale: "he-IL",
  },
  webServer: {
    command: "npm run build && node scripts/serve-static.mjs",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
    timeout: 180_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], browserName: "chromium" } },
    { name: "tablet", use: { ...devices["iPad (gen 7)"], browserName: "chromium" } },
    { name: "mobile", use: { ...devices["iPhone SE"], browserName: "chromium" } },
  ],
});
