import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    cors: true,
    hmr: {
      overlay: true,
      timeout: 5000
    },
    watch: {
      usePolling: true,
      interval: 1000
    }
  }
})