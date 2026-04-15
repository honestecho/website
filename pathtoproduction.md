# Path to Production — honestecho.com

## Stack
- **Framework**: React 19 + Vite + TypeScript + Tailwind CSS 3
- **Hosting**: Cloudflare Pages (project: `honest-echo-website`)
- **Domain**: honestecho.com (DNS managed by Cloudflare)
- **Source**: https://github.com/honestecho/website

## Deploy Pipeline
Deployments are automatic. Every push to `master` triggers a Cloudflare Pages build (~60 seconds).

```bash
git add .
git commit -m "your message"
git push
```

## Local Development
```bash
npm install        # first time only
npm run dev        # http://localhost:5173
npm run build      # verify before pushing — outputs to dist/
```

## Project Structure (v1.0)
```
src/
  pages/
    Home.tsx          # /
    Pricing.tsx       # /pricing
    FAQ.tsx           # /faq
    Security.tsx      # /security
    About.tsx         # /about
    Contact.tsx       # /contact
    Terms.tsx         # /terms
    Privacy.tsx       # /privacy
    Signup.tsx        # /signup
    Welcome.tsx       # /welcome (noindex)
    AppRedirect.tsx   # /app, /pursuit, /platform, /consulting → redirect to /
  components/
    layout/
      Navbar.tsx
      Footer.tsx
    FlyIn.tsx         # scroll-triggered tile animation wrapper
  lib/
    supabase.ts       # Supabase client (auth)
public/
  he-logo.png
  favicon.png         # fav_icon_5
  pursuit-overview.png
  robots.txt
references/           # design assets only — not deployed
CLAUDE.md             # design system + new page template — read before building
```

## Cloudflare Pages Settings
- **Project name**: `honest-echo-website`
- **GitHub repo**: `honestecho/website`
- **Production branch**: `master`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Custom domains**: `honestecho.com`, `www.honestecho.com`

## DNS
- Managed in Cloudflare
- `honestecho.com` → Cloudflare Pages
- `pursuit.honestecho.com` → HE Pursuit app (separate project: `he-pursuit`)

## Related Projects
- **App**: `pursuit.honestecho.com` — Cloudflare Pages project `he-pursuit`
- **GitHub**: https://github.com/honestecho/HE-Pursuit
