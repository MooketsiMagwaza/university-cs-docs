import { defineConfig } from '@playwright/test';

const useProductionBuild = process.env.PLAYWRIGHT_USE_BUILD === '1';

export default defineConfig({
  testDir: './tests',
  timeout: 300_000,
  expect: { timeout: 180_000 },
  fullyParallel: false,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:3101',
    headless: true,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: useProductionBuild
      ? 'npm run start -- --hostname localhost --port 3101'
      : 'npm run dev -- --hostname localhost --port 3101',
    url: 'http://localhost:3101/api/health',
    reuseExistingServer: true,
    timeout: 300_000,
  },
});
