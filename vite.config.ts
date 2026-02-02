import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/HTML_Practice/',
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    sourcemap: false
  }
})
