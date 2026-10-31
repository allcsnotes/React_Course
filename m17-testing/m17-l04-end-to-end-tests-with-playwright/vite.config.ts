import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  server: { port: 5174, proxy: { '/api': 'http://localhost:8174' } },
  test: { environment: 'jsdom', include: ['src/**/*.test.{ts,tsx}'] },
})
