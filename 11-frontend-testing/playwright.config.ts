import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/__tests__/e2e',
  webServer: {
    command:
      'bash ../scripts/dev-with-backend.sh ../../backend-masterclass/05-auth-and-security "npm run dev -- --port 3002" 3000',
    port: 3002,
    reuseExistingServer: true,
    timeout: 120000,
  },
  use: {
    baseURL: 'http://localhost:3002',
  },
});
