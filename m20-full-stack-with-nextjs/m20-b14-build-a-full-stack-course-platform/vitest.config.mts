import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  test: {
    env: {
      DATABASE_URL: 'postgres://app:fake-local-password@localhost:5414/platform_test',
    },
    fileParallelism: false,
  },
})
