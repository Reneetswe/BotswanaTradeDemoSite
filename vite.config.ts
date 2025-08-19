import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const base = process.env.GITHUB_PAGES ? '/BotswanaTradeDemoSite/' : '/'

export default defineConfig({
  base,
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/components/ui': path.resolve(__dirname, 'src/components/ui'),
      '@/components/auth': path.resolve(__dirname, 'src/components/auth'),
      '@/components/trading': path.resolve(__dirname, 'src/components/trading'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
      '@/hooks': path.resolve(__dirname, 'src/hooks'),
      '@/pages': path.resolve(__dirname, 'src/pages'),
      '@/pages/auth': path.resolve(__dirname, 'src/pages/auth'),
      '@shared': path.resolve(__dirname, 'shared')
    }
  },
  server: {
    port: 3000,
    host: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})
