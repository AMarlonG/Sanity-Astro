import {defineConfig} from 'vitest/config'
import {getViteConfig} from 'astro/config'

export default defineConfig(
  getViteConfig(
    defineConfig({
      test: {
        globals: true,
        environment: 'happy-dom',
        include: ['**/*.test.ts', '**/*.test.tsx', '**/*.test.js', '**/*.test.jsx'],
        exclude: ['node_modules', 'dist', '.astro'],
        setupFiles: ['./test-setup.ts']
      }
    })
  )
)