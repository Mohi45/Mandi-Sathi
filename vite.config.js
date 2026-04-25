import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.svg', 'pwa-192x192.svg', 'pwa-512x512.svg', 'apple-touch-icon.svg'],
            manifest: {
                name: 'Farmer Crop Price Checker',
                short_name: 'Crop Prices',
                description: 'Check crop prices from mandis across Uttar Pradesh',
                start_url: '/',
                display: 'standalone',
                background_color: '#ffffff',
                theme_color: '#16a34a',
                orientation: 'portrait-primary',
                scope: '/',
                lang: 'en',
                icons: [
                    {
                        src: 'pwa-192x192.svg',
                        sizes: '192x192',
                        type: 'image/svg+xml',
                        purpose: 'any maskable'
                    },
                    {
                        src: 'pwa-512x512.svg',
                        sizes: '512x512',
                        type: 'image/svg+xml',
                        purpose: 'any maskable'
                    },
                    {
                        src: 'pwa-192x192.svg',
                        sizes: '192x192',
                        type: 'image/svg+xml',
                        purpose: 'any'
                    },
                    {
                        src: 'pwa-512x512.svg',
                        sizes: '512x512',
                        type: 'image/svg+xml',
                        purpose: 'any'
                    }
                ],
                categories: ['business', 'agriculture'],
                shortcuts: [
                    {
                        name: 'Get Prices',
                        short_name: 'Prices',
                        description: 'Check crop prices',
                        url: '/?action=prices',
                        icons: [{ src: 'pwa-192x192.svg', sizes: '192x192' }]
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/api\.data\.gov\.in\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'api-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 // 24 hours
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    }
                ]
            }
        })
    ],
    server: {
        proxy: {
            '/api': {
                target: 'https://api.data.gov.in',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
})