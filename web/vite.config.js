import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
  base: './',
  resolve: {
    extensions: ['.js', '.vue', '.json', '.ts'],
    alias: {
      '@': path.resolve(__dirname, "./src")
    }
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/sapi': {
        target: 'http://localhost:8282',
        changeOrigin: true,
        rewrite: path => path.replace(/\/api/, "")
      }
    }
  }
})
