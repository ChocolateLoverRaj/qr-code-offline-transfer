import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
// @ts-ignore
import iconsJson from './icons.json'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import keyCert from 'key-cert'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        theme_color: '#FFFFFF',
        background_color: '#FF000000',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        short_name: 'QR Share',
        description: 'Send data offline through QR codes and scanning it with a camera',
        name: 'QR Code Offline Transfer',
        icons: iconsJson.icons
      }
    }),
    nodePolyfills()
  ],
  server: {
    https: await keyCert()
  }
})
