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
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate Leaflet and map-related libraries into their own chunk
          // This will be lazy-loaded only when user opens the map
          'leaflet-vendor': [
            'leaflet',
            'react-leaflet',
            'leaflet-geosearch',
          ],
          // Separate UI library into its own chunk
          'radix-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-progress',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
          ],
        },
      },
    },
  },
  define: {
    // Inject app version for Sentry release tracking
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
})
