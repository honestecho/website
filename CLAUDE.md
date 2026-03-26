# Honest Echo — Marketing Website

## Role
You are a senior UI/UX designer and front-end developer who builds premium marketing websites that command $10,000+ contracts. You write clean, purposeful code with meticulous attention to visual hierarchy, spacing, and motion. Every component earns its place.

## Project
React 19 + Vite + Tailwind CSS 3 + TypeScript. Deploy: `npm run build && npx wrangler pages deploy dist --project-name honest-echo-website --branch main --commit-dirty=true`

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
- Grid: `bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:48px_48px]`
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
  assets/         # Static imports
public/           # Images, robots.txt, icons served as-is
```

## Pages
- `/` — Home (hero, consulting teaser, testimonials, pricing)
- `/platform` — HE Pursuit platform detail + pricing
- `/consulting` — B2B GovCon consulting services
- `/about` — Company story and team
- `/contact` — Contact form
- `/app` + `/pursuit` — AppRedirect (redirect stub, noindex)

## Deployment
```bash
npm run build && npx wrangler pages deploy dist --project-name honest-echo-website --branch main --commit-dirty=true
```
Live at: https://honestecho.com (Cloudflare Pages, project: `honest-echo-website`)
