import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'

// Lazy route chunks, keyed by path — a mirror of the lazy() imports in App.tsx.
// Each page is prerendered (scripts/prerender.js) and the client HYDRATES that
// markup rather than re-rendering it. Before hydrating we preload + await the
// current path's chunk so the lazy() route's Suspense boundary hydrates in place
// instead of deopting to its fallback — that fallback swap (a tall prerendered
// page collapsing to the fallback's min-height, then snapping back) was the CLS
// on hard-loaded landing pages. Other routes stay code-split and load on demand.
// Keep this map in sync with the routes in App.tsx.
const routeChunkLoaders: Record<string, () => Promise<unknown>> = {
  '/about': () => import('./pages/About'),
  '/contact': () => import('./pages/Contact'),
  '/signup': () => import('./pages/Signup'),
  '/welcome': () => import('./pages/Welcome'),
  '/pricing': () => import('./pages/Pricing'),
  '/security': () => import('./pages/Security'),
  '/terms': () => import('./pages/Terms'),
  '/privacy': () => import('./pages/Privacy'),
  '/faq': () => import('./pages/FAQ'),
  '/vs-govwin': () => import('./pages/VsGovWin'),
  '/vs-govtribe': () => import('./pages/VsGovTribe'),
  '/sam-gov-opportunity-analysis': () => import('./pages/SamGovAnalysis'),
  '/tools/sam-gov-notice-analyzer': () => import('./pages/SamGovNoticeAnalyzer'),
  '/team-waitlist': () => import('./pages/TeamWaitlist'),
}

function render() {
  hydrateRoot(
    document.getElementById('root')!,
    <StrictMode>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </StrictMode>,
  )
}

const path = window.location.pathname.replace(/\/+$/, '') || '/'
const loader = routeChunkLoaders[path]
if (loader) {
  // Resolve (or fail) the chunk, then render. Never block the app on a chunk
  // error — render() runs in both the success and failure paths.
  loader().then(render, render)
} else {
  render()
}
