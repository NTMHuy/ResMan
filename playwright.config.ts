import { defineConfig, devices } from "@playwright/test";

/**
 * ResMan web E2E test configuration.
 *
 * Set PLAYWRIGHT_BASE_URL to the running frontend URL before executing tests.
 * The default localhost URL is a placeholder until the frontend is implemented.
 */
export default defineConfig({
  testDir: "./tests/e2e/web",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }]
});
