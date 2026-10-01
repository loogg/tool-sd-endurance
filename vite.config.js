import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import process from 'node:process'

const packageJson = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
)

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/').at(-1)

export default defineConfig({
  plugins: [react()],
  base: `/${repositoryName || 'tool-sd-endurance'}/`,
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(packageJson.version),
  },
  build: {
    rollupOptions: { output: { manualChunks: { charts: ['recharts'] } } },
  },
})
