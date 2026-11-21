import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: null,
      manifest: {
        name: 'IRON//OS',
        short_name: 'IRON//OS',
        description: 'Offline workout and nutrition companion',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#e8dfc8',
        theme_color: '#e8dfc8',
        icons: [
          {
            src: '/iron-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/iron-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,json}'],
        globIgnores: ['**/models/**'],
        maximumFileSizeToCacheInBytes: 20000000,
        cleanupOutdatedCaches: true,
        navigateFallback: '/index.html'
      }
    })
  ]
});
