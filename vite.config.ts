import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import compression from 'vite-plugin-compression';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  plugins: [
    react(),
    tailwindcss(),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      deleteOriginFile: false,
    }),
    {
      name: 'touch-files-for-brotli',
      apply: 'build',
      enforce: 'post',
      async closeBundle() {
        const outDir = path.resolve(import.meta.dirname, 'dist');
        const touchTree = (dir: string) => {
          if (!fs.existsSync(dir)) return;
          for (const item of fs.readdirSync(dir)) {
            const full = path.join(dir, item);
            if (fs.statSync(full).isDirectory()) {
              touchTree(full);
            } else if (!full.endsWith('.gz') && !full.endsWith('.br')) {
              const future = new Date(Date.now() + 15000);
              try { fs.utimesSync(full, future, future); } catch {}
            }
          }
        };
        touchTree(outDir);
      },
    },
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      deleteOriginFile: false,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: false,
      },
      includeAssets: ['icon.svg', 'apple-touch-icon.png', 'icons/favicon-64.png', 'icons/apple-touch-icon.png'],
      manifest: {
        id: '/',
        name: 'حسب قلب الله',
        short_name: 'حسب قلب الله',
        description:
          'منصة مراجعة روحية ونضج مسيحي وتقييم للمكرسين لله في العلوم الكنسية والعمق الداخلي',
        lang: 'ar',
        dir: 'rtl',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0c0a09',
        theme_color: '#0c0a09',
        categories: ['education', 'lifestyle', 'books'],
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|webp|gif)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'app-images-cache',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            if (id.includes('canvas-confetti')) {
              return 'vendor-confetti';
            }
          }
          if (id.includes('heavenlyMessages')) {
            return 'data-heavenly';
          }
          if (id.includes('patristicFullBooks')) {
            return 'data-patristics';
          }
          if (id.includes('prayerFortressData')) {
            return 'data-prayer-fortress';
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: false,
  },
});
