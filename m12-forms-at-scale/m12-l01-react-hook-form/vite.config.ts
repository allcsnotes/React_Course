import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const proxy = { '/api': 'http://localhost:8121' }

export default defineConfig({
  plugins: [react()],
  server: { port: 5221, proxy },
  preview: { port: 5221, proxy },
})
