import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  maxFailures: 3,
  // Use multiple reporters: list for real-time output, AI reporter for debugging context
  reporter: [
    ['list'],  // Built-in list reporter for real-time test progress
    ['./tests/e2e/utils/ai-reporter.ts'],  // Custom AI-friendly reporter for failure details
  ],
  timeout: 5000,              // 5s max per test - fail fast
  expect: { timeout: 1000 },  // 1s for assertions
  use: {
    actionTimeout: 1000,      // 1s for actions
    baseURL: process.env.E2E_TARGET_URL || 'http://localhost:5173',
  },
  webServer: undefined,       // NEVER let Playwright start the server
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
