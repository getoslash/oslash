import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve, join } from 'path'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
// https://vitejs.dev/config/
export default defineConfig({
  // REFER: https://github.com/crxjs/chrome-extension-tools/issues/696#issuecomment-1526138970
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
  plugins: [svelte(), crx({ manifest })],
  build: {
    outDir: join(__dirname, "oslash-chrome-extension"),
    rollupOptions: {
      input: {
        option: resolve(__dirname, 'option.html'),
        popup: resolve(__dirname, 'popup.html')
      },
    },
  },
})
