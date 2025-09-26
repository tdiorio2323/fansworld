import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    include: [
      'tests/unit/**/*.{test,spec}.{ts,tsx}',
      'src/pwa.test.ts',
    ],
    environment: 'jsdom',
    globals: true,
    css: true,
    setupFiles: './vitest.setup.ts',
    exclude: [
      'node_modules/**',
      'dist/**',
      '.next/**',
      '.git/**',
      'coverage/**',
      'tests/e2e/**',
      'tests/smoke.spec.ts',
    ],
  },
})
