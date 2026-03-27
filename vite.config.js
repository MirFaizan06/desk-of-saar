import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    nodePolyfills({
      include: ['buffer', 'stream', 'util', 'crypto'],
      globals: { Buffer: true, global: true, process: true },
    }),
    react({
      fastRefresh: true,
      jsxRuntime: 'automatic',
    }),
    tailwindcss(),
  ],

  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'aws-sdk': ['@aws-sdk/client-s3', '@aws-sdk/lib-storage'],
          'icons': ['lucide-react'],
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    cssCodeSplit: true,
    minify: 'esbuild',
    sourcemap: false,
    reportCompressedSize: true,
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react', 'react-router-dom'],
  },

  server: {
    hmr: {
      overlay: true,
    },
  },
})
