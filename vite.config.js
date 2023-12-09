/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        // Enable rollup polyfills plugin
        // used during production bundling
        rollupNodePolyFill(),
      ],
    },
  },
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser', // <-- Fix from above
    },
  },
})

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   optimizeDeps: {
//     esbuildOptions: {
//       // Node.js global to browser globalThis
//       define: {
//         global: 'globalThis',
//       },
//     },
//   },
// test: {
//   globals: true,
//   environment: 'jsdom',
//   css: true,
//   setupFiles: './setup.js',
// },
// define: {
//   global: { cache: {} },
// },
// })
