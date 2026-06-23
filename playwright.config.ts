import { defineConfig, devices } from "@playwright/test";

// Each test run uses a throwaway PGlite database directory so tests never
// collide with your dev data.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3100",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run build && npm run start -- --port 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      PGDATA_DIR: "./.pgdata-e2e",
      AUTH_SECRET: "e2e-only-secret-string-1234567890",
      NODE_ENV: "production",
    },
  },
});
