# Honest Echo — Marketing Website

## Role
You are a senior UI/UX designer and front-end developer who builds premium marketing websites that command $10,000+ contracts. You write clean, purposeful code with meticulous attention to visual hierarchy, spacing, and motion. Every component earns its place.

## Coding Discipline

### Think Before Coding
- State assumptions explicitly before implementing. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If something is unclear, stop, name what's confusing, and ask.
- If a simpler approach exists, say so. Push back when warranted.

### Simplicity First
- Minimum code that solves the problem. Nothing speculative.
- No features beyond what was asked.
- No abstractions for single-use code.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

### Surgical Changes
- Touch only what the task requires. Don't improve adjacent code.
- Don't refactor things that aren't broken. Match existing style.
- If you notice unrelated dead code, mention it — don't delete it.
- Remove imports/variables/functions that YOUR changes made unused, but leave pre-existing dead code alone.

## Project
React 19 + Vite + Tailwind CSS 3 + TypeScript. Deploy: `git add . && git commit -m "message" && git push` — Cloudflare Pages auto-builds from `honestecho/website` on every push to `master`.

## Design Language

### Brand Colors
- Background deep: `#030B17`
- Background surface: `#0b1120`
- Background mid: `#050d1a` / `#01060e`
- Border default: `#1e2d4a`
- Border hover: `#00c3ff` at 40–50% opacity
- Accent / CTA: `#00c3ff` (cyan)
- Accent secondary: `#5b8cff` (blue)
- Text primary: `#ffffff`
- Text muted: `#8b9bb4`
- Grid line: `#8080800a`

### Typography
- Headlines: `font-headline font-black` with tight tracking (`tracking-tight` or `tracking-tighter`)
- Body: `font-body` for paragraphs and UI copy
- Labels/caps: `font-label uppercase tracking-widest text-xs`
- Never use system fonts for display text
- Drop shadows on hero headlines: `drop-shadow-2xl`

### Spacing Rhythm
- Section padding: `py-24 px-6` (standard) or `py-32 px-6` (hero/featured)
- Max content width: `max-w-7xl mx-auto`
- Card internal padding: `p-8`
- Gap between grid items: `gap-8`
- Never use arbitrary negative margins for layout

### Card Pattern
```
bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 shadow-2xl
group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)]
transition-all duration-500
```
Top accent line on hover:
```
absolute top-0 left-0 w-full h-[2px]
bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent
opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl
```

### Icon Pattern (Lucide icons only)
Icons always use the glowing halo treatment:
```
<div className="w-10 h-10 flex items-center justify-center relative overflow-visible">
  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
  <Icon className="w-6 h-6 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
</div>
```
All icons: `#00c3ff`. No mixed icon colors across a section.

### Background Patterns
- Grid: lives in `App.tsx` as a global `fixed inset-0` layer — do NOT add per-section grid divs to pages. Use `#80808018` opacity value: `bg-[linear-gradient(to_right,#80808018_1px,transparent_1px),linear-gradient(to_bottom,#80808018_1px,transparent_1px)] bg-[size:48px_48px]`
- Top glow: `bg-gradient-to-b from-[#00c3ff]/10 via-transparent to-transparent blur-[100px]`
- Radial glow: `bg-[radial-gradient(circle_at_50%_0%,rgba(0,195,255,0.05)_0%,transparent_70%)]`

### Buttons
Primary CTA:
```
px-8 py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg
shadow-[0_0_40px_rgba(0,195,255,0.2)] hover:scale-[1.02] active:scale-[0.98]
transition-all flex items-center gap-2
```
Secondary:
```
px-8 py-4 bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg
hover:bg-[#152033] transition-all
```

### Pill / Badge Pattern
```
inline-flex items-center gap-2 px-3 py-1 rounded-full
bg-blue-900/20 border border-blue-700/30
text-xs font-bold text-blue-200 tracking-wide
```
Dot indicator: `w-1.5 h-1.5 rounded-full bg-[#00c3ff]`

### Notice / Important-Note Pattern
The one approved way to call out a single high-signal message — beta offers, deadlines, policy callouts, "read this first" context. **Component:** `src/components/Notice.tsx`. Never hand-roll a bordered/tinted strip inline (see Never rule below).

```tsx
import Notice, { NoticeCode } from '../components/Notice';

<Notice label="Beta" className="mb-4">
  Paid plans are <span className="font-bold text-[#00c3ff]">100% off during beta</span> — use code{' '}
  <NoticeCode>BETA100</NoticeCode> at checkout.
</Notice>
```
- `label?` — all-caps cyan badge (e.g. `"Beta"`, `"New"`, `"Note"`). Omit for a badge-less note.
- `tone?` — `"strong"` (default; `border/50` + `bg/10`, for announcements) or `"soft"` (`border/30` + `bg/5`, for quiet context notes). Emphasis is opacity, never a second hue.
- `align?` — `"center"` (default) or `"left"`.
- `className` — outer margin only (e.g. `"mb-4"`).
- `<NoticeCode>` — inline monospace chip for a copyable code/value.
- Reference implementation: the beta strip in `Pricing.tsx`.

## Animation Principles
- Duration: `300ms` for micro-interactions, `500–700ms` for larger transitions
- Easing: `ease-out` for entrances, `transition-all` for multi-property
- Hover lifts: `hover:-translate-y-2` on cards/images
- Scale interactions: `hover:scale-[1.02]` on CTAs, `hover:scale-105` on nav buttons
- Glow pulses: `animate-pulse` only on ambient background glows, not UI elements
- Never animate layout (width/height) — only transform and opacity

## Rules

### Always
- Use `group` / `group-hover` for coordinated hover states
- Use `relative z-10` on content that sits over absolute glow layers
- Add `pointer-events-none` to decorative background layers
- Use `overflow-hidden` on cards that clip content
- Use `transition-colors duration-500` for border/color changes
- External links: `target="_blank" rel="noopener noreferrer"` always
- Internal navigation: React Router `<Link to="...">`, never `<a href="...">`
- Login/app links: `<a href="https://pursuit.honestecho.com">` (external)

### Never
- No emoji in UI — use Lucide icons only
- No inline `style={{}}` — Tailwind classes only
- No generic CSS gradients (`linear-gradient(135deg, #667eea, #764ba2)`) — use the brand palette
- No `position: fixed` or `sticky` for layout elements other than the Navbar
- No negative margins (`-mx-6`) for layout spacing
- No `text-gray-*` — use `text-[#8b9bb4]` for muted and `text-white` for primary
- No placeholder lorem ipsum copy in components
- No mixed accent colors in the same section — everything is `#00c3ff`
- No Tailwind `prose` class — style typography manually
- No hand-rolled callout/announcement strips — use `<Notice>` (see Notice / Important-Note Pattern)

### Section Structure
Every page section follows this shell:
```tsx
<section className="py-24 px-6 bg-[...] relative overflow-hidden">
  {/* Optional decorative layer */}
  <div className="absolute inset-0 [...] pointer-events-none"></div>
  <div className="max-w-7xl mx-auto relative z-10">
    {/* Content */}
  </div>
</section>
```

## File Structure
```
src/
  pages/          # One file per route
  components/
    layout/       # Navbar.tsx, Footer.tsx
    FlyIn.tsx     # Scroll-triggered fly-in animation wrapper (used on all tile grids)
  lib/
    supabase.ts   # Supabase client — used by Signup.tsx and Welcome.tsx
  assets/         # Static imports
public/           # Images, robots.txt, icons served as-is
  he-logo.png     # Primary brand logo (navbar + footer)
  favicon.png     # Chrome tab icon (currently fav_icon_5)
  pursuit-overview.png  # Hero dashboard screenshot
references/       # Design assets (not deployed)
  fav_icon_5.png        # Current live favicon source
  honest_echo_logo_1/2.png  # Logo reference variants
  ui-pages.md is NOT present — page templates live in CLAUDE.md (see below)
```

## Pages (v1.0 — all active)
- `/` — Home: hero, problem tiles, differentiators, 5-step workflow, pricing preview, FAQ
- `/pricing` — Full pricing: 4 plan cards, feature comparison table, FAQ accordion
- `/faq` — FAQ: 4 accordion section cards + 5 SEO accordion cards
- `/security` — Security practices: 4 main cards + 2 bottom cards
- `/about` — Company: 4 info cards + full-width approach card + CTA
- `/contact` — Contact form (Supabase-backed)
- `/terms` — Terms of Service: 10 cards in 2-column grid
- `/privacy` — Privacy Policy: 8 cards + centered contact card
- `/signup` — User registration (Supabase auth)
- `/welcome` — Post-signup confirmation (noindex)
- `/app` + `/pursuit` + `/platform` + `/consulting` — Redirect stubs → `/` (noindex)

## New Page Template
Every new page follows this shell. Use the 2-column card grid pattern from About/Security/Privacy as the default layout for content pages:

```tsx
import { Helmet } from 'react-helmet-async';
import FlyIn from '../components/FlyIn';
import { IconName } from 'lucide-react';

export default function PageName() {
  return (
    <>
      <Helmet>
        <title>Page Title | Honest Echo</title>
        <meta name="description" content="..." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/slug" />
        <meta property="og:title" content="..." />
        <meta property="og:description" content="..." />
        <meta property="og:image" content="https://honestecho.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Hero — pt-32 always so content clears sticky navbar */}
      <section className="pt-32 pb-12 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="font-headline font-black text-5xl md:text-6xl xl:text-7xl text-white mb-5 tracking-tighter leading-tight drop-shadow-2xl">
            Page Headline
          </h1>
          <p className="text-[#a0b2c8] text-lg leading-relaxed font-body max-w-2xl">
            Supporting copy.
          </p>
        </div>
      </section>

      {/* 2-column card grid */}
      <section className="pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sections.map((s, i) => (
              <FlyIn key={s.title} delay={['', 'delay-150', 'delay-300', 'delay-[450ms]'][i % 4]}>
              <div className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 relative overflow-hidden group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)] transition-all duration-500 h-full">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
                    <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150"></div>
                    <s.Icon className="w-5 h-5 text-[#00c3ff] group-hover:text-white drop-shadow-[0_0_8px_rgba(0,195,255,0.8)] group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)] transition-all duration-500 ease-out relative z-10" fill="currentColor" fillOpacity={0.15} strokeWidth={2} />
                  </div>
                  <h2 className="font-headline font-bold text-white text-xl tracking-tight pt-1.5">{s.title}</h2>
                </div>
                <p className="text-[#a0b2c8] text-sm font-body leading-relaxed">{s.body}</p>
              </div>
              </FlyIn>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-8 pb-24 px-6">
        <div className="max-w-7xl mx-auto flex justify-center">
          {/* Link to="/contact" or "/pricing" */}
        </div>
      </section>
    </>
  );
}
```

After creating the page file, add the route to `src/App.tsx`:
```tsx
import NewPage from './pages/NewPage';
// inside <Routes>:
<Route path="/slug" element={<NewPage />} />
```

## Deployment
Standard: `git add . && git commit -m "message" && git push`
Cloudflare Pages auto-builds from `honestecho/website` on every push to `master`.
Live at: https://honestecho.com (project: `honest-echo-website`)

## Version
**v1.0** — April 2026. All core marketing pages live. Supabase auth wired. Fly-in animations on all tile grids.

## SEO skills (vendored claude-seo subset)
`.claude/skills/` carries 8 skills vendored from AgriciDaniel/claude-seo @ v2.2.4 (see `.claude/skills/claude-seo-UPSTREAM.md` for provenance + update policy). Ground rules when using them:
- **Max 2 agents per run.** Never the upstream master orchestrator / 15-agent fan-out; this is an 18-URL site.
- **No extensions or API keys** (DataForSEO, Firecrawl, Google APIs) without Aaron's explicit approval.
- **Audit the DEPLOYED site** (honestecho.com, prerendered HTML), not just the React source.
- **Every finding must state**: expected impact, the evidence, and how we'd know it failed. Reject generic advice.
- **Backlinks are the #1 KPI.** The site's binding constraint is authority (GSC External links = 0, diagnosed 2026-07-28); on-page findings must not displace link-acquisition work. Weekly tracking lives in `seo-pulse.md`.
- Schema validation: run `.claude/skills/seo-schema/scripts/validate-schema.py <file>` explicitly after JSON-LD edits (we do not install the upstream plugin hook).
