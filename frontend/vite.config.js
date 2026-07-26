import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.png'],
      manifest: {
        name: 'MissionFlow - Gestion Enseignants & Étudiants',
        short_name: 'MissionFlow',
        description: 'Gestion des projets, tâches, cours et programmes pour Admin, Chef de projet, Enseignants et Étudiants',
        theme_color: '#1b6ec2',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        lang: 'fr',
        icons: [
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        // Ne met en cache que les assets statiques ; les appels API restent toujours en ligne
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        navigateFallbackDenylist: [/^\/api/],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'pdf-vendor': ['@react-pdf/renderer'],
          'chart-vendor': ['recharts'],
          'fontawesome-vendor': ['@fortawesome/react-fontawesome', '@fortawesome/fontawesome-svg-core'],
        },
      },
    },
  },
});
