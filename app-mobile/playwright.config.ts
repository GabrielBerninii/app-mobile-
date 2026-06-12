import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:8081";
const apiURL = process.env.PLAYWRIGHT_API_URL || "http://localhost:3000";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  outputDir: "test-results",
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL,
    trace: "on",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "npm run server",
      url: apiURL,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command:
        "set EXPO_HOME=%CD%\\.expo-e2e&& set USERPROFILE=%CD%\\.expo-e2e-home&& set HOME=%CD%\\.expo-e2e-home&& npx.cmd expo start --web --port 8081",
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
