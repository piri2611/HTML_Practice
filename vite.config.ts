import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/HTML_Practice/',
  plugins: [react()],
  server: {
    port: 3000,
    host: 'localhost'
  },
  build: {
    outDir: 'docs',
    sourcemap: false,
    minify: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  }
})
