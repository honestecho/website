import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Emit dist/.vite/manifest.json so the prerender step can map each route to
    // its code-split chunk and inject <link rel="modulepreload"> — this loads the
    // lazy route chunk in parallel with the main bundle so hydration doesn't flash
    // the Suspense fallback (which causes CLS on hard-loaded landing pages).
    manifest: true,
  },
})
