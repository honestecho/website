// Single source of truth for the HE Pursuit backend base URL.
//
// History: three different hosts were hard-coded across the site
// (he-pursuit-api.onrender.com, pursuit.honestecho.com/api,
// pursuit-api.honestecho.com) — two of which were non-functional in prod
// (pursuit.honestecho.com/api 405s on POST; pursuit-api.honestecho.com has no
// DNS). Everything now funnels through here. Override with VITE_API_URL in the
// build environment if the backend moves off Render.

// VITE_API_URL should be origin-only (no trailing slash, no /api). We normalize
// defensively so a misconfigured env var can't produce `/api/api/...` URLs.
const rawOrigin =
  (import.meta.env.VITE_API_URL as string | undefined) || 'https://he-pursuit-api.onrender.com';

export const API_ORIGIN = rawOrigin.replace(/\/+$/, '').replace(/\/api$/, '');

export const API_BASE = `${API_ORIGIN}/api`;
