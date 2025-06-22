import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test/e2e',
  webServer: {
    command: '',
    url: 'http://frontend:8080',
    reuseExistingServer: true,
  },
  use: {
    baseURL: 'http://frontend:8080',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
});
