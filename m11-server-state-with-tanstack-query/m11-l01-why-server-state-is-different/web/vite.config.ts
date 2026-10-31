import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const proxy = { '/api': 'http://localhost:8111' }

export default defineConfig({
  plugins: [react()],
  server: { port: 5211, proxy },
  preview: { port: 5211, proxy },
})
