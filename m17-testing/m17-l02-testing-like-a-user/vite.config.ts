import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  server: { port: 5172 },
  test: { environment: 'jsdom', setupFiles: process.env.SETUP || './src/setup.ts' },
})
