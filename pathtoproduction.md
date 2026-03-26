# Path to Production — honestecho.com

## Stack
- **Framework**: React 19 + Vite + TypeScript + Tailwind CSS 3
- **Hosting**: Cloudflare Pages (project: `he-website`)
- **Domain**: honestecho.com (DNS managed by Cloudflare)
- **Source**: https://github.com/honestecho/website

## Deploy Pipeline
Deployments are automatic. Every push to `master` triggers a Cloudflare Pages build.

```bash
# Make changes, then:
git add .
git commit -m "your message"
git push
```

Cloudflare builds in ~60 seconds. Live at honestecho.com immediately after.

## Local Development
```bash
cd "HE Website - 1"
npm install        # first time only
npm run dev        # http://localhost:5173
```

## Build Locally (verify before pushing)
```bash
npm run build      # outputs to dist/
```

## Project Structure
```
src/
  pages/
    Home.tsx         # / — hero, consulting teaser, testimonials, pricing
    Platform.tsx     # /platform
    Consulting.tsx   # /consulting
    About.tsx        # /about
    Contact.tsx      # /contact
    AppRedirect.tsx  # /app and /pursuit — redirects to pursuit.honestecho.com
  components/
    layout/
      Navbar.tsx
      Footer.tsx
public/
  opportunitycard.jpg
  consulting_collaboration.png
  robots.txt         # blocks AI scrapers
CLAUDE.md            # design system rules — read before building any component
```

## Cloudflare Pages Settings
- **Project name**: `he-website`
- **GitHub repo**: `honestecho/website`
- **Production branch**: `master`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Custom domains**: `honestecho.com`, `www.honestecho.com`

## DNS
- Managed in Cloudflare (nameservers transferred from GoDaddy)
- `honestecho.com` → CNAME to `he-website.pages.dev` (set by Cloudflare Pages automatically)
- `pursuit.honestecho.com` → proxied to `he-pursuit.pages.dev` (the app)

## Related Projects
- **App (HE-Pursuit)**: `pursuit.honestecho.com` — separate Cloudflare Pages project (`he-pursuit`)
- **GitHub**: https://github.com/honestecho/HE-Pursuit
