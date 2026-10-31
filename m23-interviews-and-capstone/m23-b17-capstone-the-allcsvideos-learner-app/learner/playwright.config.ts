import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  reporter: [['list']],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:5847',
    launchOptions: { executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' },
  },
})
