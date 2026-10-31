import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5782',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'node api/server.mjs',
      url: 'http://localhost:8170/api/courses',
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run dev -- --port 5782 --strictPort',
      url: 'http://localhost:5782',
      reuseExistingServer: !process.env.CI,
    },
  ],
})
