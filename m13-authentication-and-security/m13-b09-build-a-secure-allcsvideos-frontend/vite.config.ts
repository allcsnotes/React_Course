import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: { port: 5739, proxy: { '/api': 'http://localhost:8139' } },
})
