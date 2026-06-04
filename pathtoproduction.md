# Path to Production — honestecho.com

## Stack
- **Framework**: React 19 + Vite + TypeScript + Tailwind CSS 3
- **Hosting**: Cloudflare Pages (project: **`he-website`** — serves honestecho.com + www.honestecho.com. NOTE: there is also a stray domainless `honest-echo-website` project on the same account — do NOT deploy there.)
- **Domain**: honestecho.com (DNS managed by Cloudflare)
- **Source**: https://github.com/honestecho/website

## Deploy Pipeline
⚠️ GitHub auto-deploy is UNRELIABLE — pushes have silently failed to ship (prod sat on a pre-SP-1 build while pricing/SEO/testimonials commits were live on GitHub). **Deploy manually after every push** (verified working 2026-06-01):

```bash
git add . && git commit -m "your message" && git push        # source of truth
npm run build                                                  # must pass (tsc -b && vite build && prerender — emits dist/{route}/index.html for crawlers)
# export CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID (reuse HE-Pursuit/.env if none here), then:
npx wrangler pages deploy dist --project-name he-website --branch master --commit-dirty=true
```
Then verify: `curl -s https://honestecho.com | grep index-…js` → fetch that asset → confirm your change is in it.

## Local Development
```bash
npm install        # first time only
npm run dev        # http://localhost:5173
npm run build      # verify before pushing — outputs to dist/
```

## Project Structure
```
src/
  pages/
    Home.tsx                  # /
    Pricing.tsx               # /pricing
    FAQ.tsx                   # /faq
    Security.tsx              # /security
    About.tsx                 # /about
    Contact.tsx               # /contact
    Terms.tsx                 # /terms
    Privacy.tsx               # /privacy
    Signup.tsx                # /signup
    Welcome.tsx               # /welcome (noindex)
    VsGovWin.tsx              # /vs-govwin
    VsGovTribe.tsx            # /vs-govtribe
    SamGovAnalysis.tsx        # /sam-gov-opportunity-analysis
    SamGovNoticeAnalyzer.tsx  # /tools/sam-gov-notice-analyzer (no login required)
    SharedPackage.tsx         # /p/:token (shared decision package)
    TeamWaitlist.tsx          # /team-waitlist
    AppRedirect.tsx           # /app, /pursuit → redirect to /
    NotFound.tsx              # * (404 catch-all)
                              # /product, /platform, /consulting → inline <Navigate> to /
  components/
    layout/
      Navbar.tsx
      Footer.tsx
    FlyIn.tsx                 # scroll-triggered tile animation wrapper
    PursuitDemoAnimation.tsx  # animated hero demo
    AnalyzerOpportunityCard.tsx
    SchemaOrg.tsx             # JSON-LD structured data
  lib/
    supabase.ts               # Supabase client (auth)
public/
  he-logo.png, he-logo-mark.png
  favicon.png, favicon.svg
  pursuit-overview.png, pursuit-overview-2.png, pursuit-overview-3.png
  hero-dashboard.png, data-network.png, opportunity_card_v1.png
  consulting_collaboration.png, consulting_command_center.png, strategic_war_room.png
  icons.svg
  robots.txt, sitemap.xml, _headers
references/                   # design assets only — not deployed
CLAUDE.md                     # design system + new page template — read before building
```

## Cloudflare Pages Settings
- **Project name**: `he-website` (NOT `honest-echo-website` — that one has no domain)
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
