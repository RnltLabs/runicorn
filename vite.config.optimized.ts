import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import packageJson from './package.json'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable source maps for production (needed for GlitchTip error stacktraces)
    sourcemap: true,

    // Performance optimizations
    rollupOptions: {
      output: {
        // Manual chunking for better caching
        manualChunks: {
          // React vendor chunk (changes infrequently)
          'react-vendor': ['react', 'react-dom'],

          // Map vendor chunk (large libraries, lazy loaded)
          'map-vendor': ['leaflet', 'react-leaflet', 'leaflet-geosearch'],

          // UI vendor chunk (Radix UI components)
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-progress',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
          ],

          // Monitoring vendor chunk
          'monitoring-vendor': ['@sentry/react'],
        },
      },
    },

    // Performance budget - warn if chunks exceed limit
    chunkSizeWarningLimit: 300, // 300 KB (down from default 500 KB)

    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
  },
  define: {
    // Inject app version for Sentry release tracking
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
})
