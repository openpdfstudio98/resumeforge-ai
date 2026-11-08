import { defineConfig, devices } from "@playwright/test";
const url = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3097";
export default defineConfig({
  testDir:"./tests",
  testMatch:"**/*.spec.ts",
  timeout:60_000,
  workers:2,
  use:{baseURL:url, ...devices["Desktop Chrome"],launchOptions:{executablePath:process.env.CHROMIUM_PATH}},
  webServer:process.env.TEST_BASE_URL?undefined:{command:"npm run start -- --hostname 127.0.0.1 --port 3097",url,reuseExistingServer:!process.env.CI},
});
