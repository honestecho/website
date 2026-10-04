import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'
import { initGoogleAds } from './lib/googleAds'

// The prerender moves each route's <title>/<meta>/<link> into <head> for
// crawlers (scripts/prerender.js). React renders its own live copies, so drop
// the static ones first or the stale <title> keeps winning document.title.
document.head.querySelectorAll('[data-prerender]').forEach(el => el.remove())

// Before React mounts, while the landing URL still carries the ad-click id.
initGoogleAds()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
