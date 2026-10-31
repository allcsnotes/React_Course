import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const proxy = { '/api': 'http://localhost:8123' }

export default defineConfig({
  plugins: [react()],
  server: { port: 5123, proxy },
  preview: { port: 5123, proxy },
})
