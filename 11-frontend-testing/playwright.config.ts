import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/__tests__/e2e',
  webServer: {
    command: 'npm run dev -- --port 3002',
    port: 3002,
    reuseExistingServer: true,
  },
  use: {
    baseURL: 'http://localhost:3002',
  },
});
