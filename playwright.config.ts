import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  maxFailures: 3,
  reporter: './tests/e2e/utils/ai-reporter.ts',  // Custom AI-friendly reporter
  timeout: 5000,              // 5s max per test - fail fast
  expect: { timeout: 1000 },  // 1s for assertions
  use: {
    actionTimeout: 1000,      // 1s for actions
    baseURL: process.env.E2E_TARGET_URL || 'http://localhost:5173',
  },
  webServer: undefined,       // NEVER let Playwright start the server
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
