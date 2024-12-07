import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { installGlobals } from '@remix-run/node'
import { RemixVitePWA } from '@vite-pwa/remix'

installGlobals()

const { RemixVitePWAPlugin, RemixPWAPreset } = RemixVitePWA()


export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    remix({
      ignoredRouteFiles: ["**/.*"],
      tailwind: true,
      appDirectory: "app",
      assetsBuildDirectory: "public/build",
      publicPath: "/build/",
      serverBuildPath: "build/index.js",
      browserNodeBuiltinsPolyfill: { modules: { crypto: true } },
      future: {
        unstable_optimizeDsr: true,
      },
      presets: [RemixPWAPreset()],
    }),
    tsconfigPaths(),
    RemixVitePWAPlugin({
      devOptions: {
        enabled: true,
      },
      registerType: "autoUpdate",
      includeAssets: ["**/*.{png,svg,ico,webp,jpg,jpeg}"],
      manifest: {
        "name": "Financial Calculator",
        "short_name": "Financial Calculator",
        "description": "A simple financial calculator",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#475569",
        "orientation": "portrait",
        "categories": ["finance", "utilities", "productivity"],
        "prefer_related_applications": false,
        "icons": [
          {
            "src": "/icons/icon-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
          },
          {
            "src": "/icons/icon-512x512.png", 
            "sizes": "512x512",
            "type": "image/png",
          },
          {
            "src": "/icons/apple-icon-180x180.png",
            "sizes": "180x180",
            "type": "image/png",
            "purpose": "apple touch icon"
          }
        ],
        "screenshots": [
          {
            "src": "/screenshots/desktop.png",
            "sizes": "1916x959",
            "type": "image/png",
            "form_factor": "wide",
            "label": "Desktop view of Financial Calculator"
          },
          {
            "src": "/screenshots/mobile.png",
            "sizes": "359x741",
            "type": "image/png",
            "form_factor": "narrow",
            "label": "Mobile view of Financial Calculator"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico,webp,jpg,jpeg}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      }
    })
  ],
});
