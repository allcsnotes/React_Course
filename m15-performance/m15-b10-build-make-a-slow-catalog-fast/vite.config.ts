import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    ...(process.env.ANALYZE
      ? [visualizer({ filename: 'stats.html', gzipSize: true })]
      : []),
  ],
  // the measuring build: React's profiling build, so <Profiler> works
  resolve:
    mode === 'profiling'
      ? { alias: { 'react-dom/client': 'react-dom/profiling' } }
      : {},
  server: { port: 5760, proxy: { '/api': 'http://localhost:8150' } },
  preview: { port: 5760, proxy: { '/api': 'http://localhost:8150' } },
}))
