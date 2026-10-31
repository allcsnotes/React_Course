import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig({
  server: { port: 5152 },
  plugins: [
    react(),
    babel({
      presets: [
        reactCompilerPreset({ panicThreshold: 'all_errors' }),
      ],
    }),
  ],
})
