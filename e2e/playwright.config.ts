import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    browserName: "chromium",
    headless: false, // Set to true in CI
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
});
