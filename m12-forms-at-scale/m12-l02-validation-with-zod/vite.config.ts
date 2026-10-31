import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: { port: 5222, proxy: { '/api': 'http://localhost:8122' } },
})
