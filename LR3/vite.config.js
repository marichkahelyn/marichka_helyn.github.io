import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/marichka_helyn.github.io/LR3-dist/',
  build: {
    outDir: '../LR3-dist',  // ← білд іде в окрему папку
  }
})