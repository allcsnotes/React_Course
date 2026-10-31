import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const proxy = { '/api': 'http://localhost:8133' }

export default defineConfig({
  plugins: [react()],
  server: { port: 5233, proxy },
  preview: { port: 5233, proxy },
})
