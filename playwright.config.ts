import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './test/e2e',
  outputDir: './test/e2e/test-results',
  fullyParallel: true,
  retries: 3,
  reporter: [['html', { outputFolder: './test/e2e/report', open: 'never' }]],
  timeout: 60000,
  expect: {
    timeout: 15000,
  },
  use: {
    trace: 'on-first-retry',
    baseURL: 'http://localhost:3000',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
