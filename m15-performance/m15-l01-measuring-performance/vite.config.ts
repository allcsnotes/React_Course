import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: process.env.PROFILING
      ? { 'react-dom/client': 'react-dom/profiling' }
      : {},
  },
  server: { port: 5151 },
  preview: { port: 5151 },
})
