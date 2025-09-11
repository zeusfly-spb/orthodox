import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import {defineConfig} from 'vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true
    }
  },
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
})
