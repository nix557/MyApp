import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Opsi ini akan menampilkan prompt untuk memperbarui aplikasi saat ada versi baru
      registerType: 'autoUpdate',
      // Injeksi manifest dan link ikon ke dalam file HTML secara otomatis
      injectRegister: 'auto',
      workbox: {
        // Otomatis cache semua aset statis saat build
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      // Konfigurasi manifest aplikasi Anda
      manifest: {
        name: 'Asisten AI Cerdas',
        short_name: 'Asisten AI',
        description: 'Asisten AI cerdas didukung oleh Gemini.',
        theme_color: '#ffffff',
        background_color: '#f9fafb',
        display: 'standalone',
        start_url: '.',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
