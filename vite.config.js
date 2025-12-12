import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh for development
      fastRefresh: true,
      // Optimize JSX for production
      jsxRuntime: 'automatic',
    }),
    tailwindcss()
  ],

  build: {
    // Target modern browsers for smaller bundle
    target: 'es2015',

    // Optimize chunk size
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'animation': ['framer-motion'],
          'icons': ['lucide-react'],
        },

        // Optimize chunk naming for better caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },

    // Enable CSS code splitting
    cssCodeSplit: true,

    // Minify with esbuild for fast builds and good compression
    minify: 'esbuild',
    esbuild: {
      drop: ['console', 'debugger'], // Remove console.logs and debugger in production
    },

    // Source maps for debugging (can be disabled for smaller bundle)
    sourcemap: false,

    // Optimize bundle size
    reportCompressedSize: true,
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'lucide-react',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
    ],
  },

  // Performance optimizations
  server: {
    hmr: {
      overlay: true,
    },
  },
})
