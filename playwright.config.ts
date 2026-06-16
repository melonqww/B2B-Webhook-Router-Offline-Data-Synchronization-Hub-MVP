import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: 'cd backend && npm run dev',
      port: 3001,
      timeout: 15000,
      reuseExistingServer: true,
    },
    {
      command: 'cd frontend && npm run dev',
      port: 3000,
      timeout: 15000,
      reuseExistingServer: true,
    },
  ],
});
