# Honest Echo — UI Design System

Design reference for honestecho.com and HE Pursuit. All values are Tailwind CSS 3 utility classes unless noted as raw CSS/hex.

---

## Brand Colors

| Role | Hex | Tailwind arbitrary |
|---|---|---|
| Page background (deep) | `#030B17` | `bg-[#030B17]` |
| Surface / card fill | `#0b1120` | `bg-[#0b1120]` |
| Surface hover | `#152033` | `bg-[#152033]` |
| Border default | `#1e2d4a` | `border-[#1e2d4a]` |
| Border hover | `#00c3ff` at 40% | `border-[#00c3ff]/40` |
| Accent / CTA (cyan) | `#00c3ff` | `text-[#00c3ff]` / `bg-[#00c3ff]` |
| Accent secondary (blue) | `#5b8cff` | `text-[#5b8cff]` |
| Text primary | `#ffffff` | `text-white` |
| Text body / muted | `#a0b2c8` | `text-[#a0b2c8]` |
| Text dimmed | `#8b9bb4` | `text-[#8b9bb4]` |
| Grid line | `#808080` at ~6% | see Background Patterns |

---

## Typography

### Font Families
- **Headlines**: `font-headline font-black` — used for all h1–h3 and button labels
- **Body**: `font-body` — paragraphs, card copy, UI text
- **Labels / eyebrows**: `font-label uppercase tracking-widest text-xs`

### Scale

| Use | Classes |
|---|---|
| Page hero h1 | `font-headline font-black text-4xl md:text-6xl tracking-tight leading-tight drop-shadow-2xl` |
| Section h2 | `font-headline font-black text-3xl md:text-4xl tracking-tight leading-tight` |
| Section h3 | `font-headline font-black text-2xl md:text-3xl tracking-tight leading-tight` |
| Card heading | `font-headline font-black text-xl tracking-tight` |
| Mini-card heading | `font-headline font-black text-lg tracking-tight` |
| Body large | `font-body text-lg leading-relaxed` |
| Body default | `font-body text-base leading-relaxed` |
| Body small | `font-body text-sm leading-relaxed` |
| Body micro | `font-body text-sm leading-snug` |
| Eyebrow label | `font-label text-xs font-bold text-blue-200 tracking-widest uppercase` |

---

## Background Patterns

### Global page background
Applied once as a `fixed inset-0` layer behind all content. Do not repeat per section.

```
/* Grid */
bg-[linear-gradient(to_right,#80808018_1px,transparent_1px),linear-gradient(to_bottom,#80808018_1px,transparent_1px)]
bg-[size:48px_48px]

/* Aurora blob A — slow drift */
w-[150vw] h-[150vh] rounded-full blur-[160px]
bg-[radial-gradient(ellipse,rgba(0,195,255,0.40)_0%,rgba(91,140,255,0.16)_45%,transparent_72%)]
animate-glow-a

/* Aurora blob B — counter-drift */
w-[120vw] h-[120vh] rounded-full blur-[140px]
bg-[radial-gradient(ellipse,rgba(91,140,255,0.28)_0%,rgba(0,195,255,0.10)_52%,transparent_75%)]
animate-glow-b
```

### Section-level accent glows (use sparingly, one per section)

```
/* Top radial — hero sections */
absolute inset-0 pointer-events-none
bg-[radial-gradient(circle_at_50%_0%,rgba(0,195,255,0.06)_0%,transparent_65%)]

/* Side radial — CTA / asymmetric sections */
absolute inset-0 pointer-events-none
bg-[radial-gradient(ellipse_at_30%_50%,rgba(0,195,255,0.04)_0%,transparent_65%)]

/* Inner card radial — card fill glow */
absolute inset-0 pointer-events-none
bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,195,255,0.04)_0%,transparent_60%)]
```

---

## Section Shell

Every page section follows this exact structure:

```tsx
<section className="py-24 px-6 relative overflow-hidden">
  {/* Optional decorative glow — pointer-events-none */}
  <div className="absolute inset-0 bg-[radial-gradient(...)] pointer-events-none"></div>

  <div className="max-w-7xl mx-auto relative z-10">
    {/* Content */}
  </div>
</section>
```

- Standard padding: `py-24 px-6`
- Hero / featured: `py-32 px-6`
- Compact (between sections): `py-16 px-6`
- Max content width: `max-w-7xl mx-auto`
- Always `relative z-10` on the content wrapper

---

## Cards

### Standard card
```
bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 shadow-2xl
relative overflow-hidden
group hover:border-[#00c3ff]/40 hover:shadow-[0_0_40px_rgba(0,195,255,0.08)]
transition-all duration-500
```

**Top accent line on hover** (place as first child, absolute):
```
absolute top-0 left-0 w-full h-[2px]
bg-gradient-to-r from-transparent via-[#00c3ff]/30 to-transparent
opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl
```

**Inner radial glow** (optional, place after accent line):
```
absolute inset-0 pointer-events-none
bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,195,255,0.04)_0%,transparent_60%)]
```

### Mini card (2×2 grid items, "When to Reach Out" style)
```
flex items-start gap-3
bg-[#0b1120] border border-[#1e2d4a] rounded-xl p-4
group/item hover:border-[#00c3ff]/30 transition-all duration-300
```

---

## Icons

Use **Lucide React** exclusively. All icons use the glowing halo treatment.

### Large icon (card top, standalone)
```tsx
<div className="w-10 h-10 flex items-center justify-center relative overflow-visible mb-6">
  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20
    group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150">
  </div>
  <Icon
    className="w-6 h-6 text-[#00c3ff] group-hover:text-white
      drop-shadow-[0_0_8px_rgba(0,195,255,0.8)]
      group-hover:scale-110 group-hover:-rotate-12
      group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)]
      transition-all duration-500 ease-out relative z-10"
    fill="currentColor" fillOpacity={0.15} strokeWidth={2}
  />
</div>
```

### Inline icon (icon + title on same row)
```tsx
<div className="flex items-center gap-4 mb-4 relative z-10">
  <div className="w-10 h-10 flex items-center justify-center relative overflow-visible shrink-0">
    <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-20
      group-hover:opacity-60 transition-opacity duration-500 rounded-full scale-150">
    </div>
    <Icon
      className="w-6 h-6 text-[#00c3ff] group-hover:text-white
        drop-shadow-[0_0_8px_rgba(0,195,255,0.8)]
        group-hover:scale-110 group-hover:-rotate-12
        group-hover:drop-shadow-[0_0_15px_rgba(0,195,255,1)]
        transition-all duration-500 ease-out relative z-10"
      fill="currentColor" fillOpacity={0.15} strokeWidth={2}
    />
  </div>
  <h3 className="font-headline font-black text-xl text-white tracking-tight leading-tight">
    {heading}
  </h3>
</div>
```

### Small icon (list items, mini-cards)
```tsx
<div className="w-8 h-8 flex items-center justify-center relative overflow-visible shrink-0 mt-0.5">
  <div className="absolute inset-0 bg-[#00c3ff] blur-md opacity-0
    group-hover/item:opacity-50 transition-opacity duration-500 rounded-full scale-150">
  </div>
  <Icon
    className="w-4 h-4 text-[#00c3ff] group-hover/item:text-white
      group-hover/item:-rotate-12 group-hover/item:scale-110
      transition-all duration-500 ease-out relative z-10"
    fill="currentColor" fillOpacity={0.15} strokeWidth={2}
  />
</div>
```

### Rules
- All icons: `#00c3ff`. No mixed colors within a section.
- Always `fill="currentColor" fillOpacity={0.15}` for the subtle fill
- Always `relative z-10` on the icon element itself
- Hover: text → white, scale 110%, rotate -12deg, glow intensifies

---

## Eyebrow / Badge / Pill

Used above section headings and as page-section labels.

```tsx
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
  bg-blue-900/20 border border-blue-700/30 mb-6">
  <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
  <span className="text-xs font-bold text-blue-200 tracking-widest uppercase font-label">
    Label Text
  </span>
</div>
```

- Centered above section headings: wrap in `<div className="text-center mb-12">`
- Left-aligned within a column: no wrapper, `mb-6` on the badge itself
- Dot: always `#00c3ff`, always `w-1.5 h-1.5 rounded-full`

---

## Buttons

### Primary CTA
```
inline-flex items-center gap-2 px-8 py-4
bg-[#00c3ff] text-[#030B17] font-bold rounded-lg font-headline
shadow-[0_0_40px_rgba(0,195,255,0.2)]
hover:scale-[1.02] active:scale-[0.98] transition-all
```

### Secondary (dark fill)
```
inline-flex items-center gap-2 px-8 py-4
bg-[#0b1120] border border-[#1e2d4a] text-white font-bold rounded-lg font-headline
hover:bg-[#152033] hover:border-[#00c3ff]/40 transition-all duration-300
```

### Ghost / Outline (cyan)
```
inline-flex items-center gap-2 px-8 py-4
bg-transparent border border-[#00c3ff]/30 text-[#00c3ff] font-bold rounded-lg font-headline
hover:bg-[#0b1120] hover:border-[#00c3ff]/60 hover:text-white transition-all duration-300
```

### Stacked button list (CTA panels — 3 buttons, full width)
Each button uses `justify-between` so label is left, arrow is right:
```
inline-flex items-center justify-between gap-2 px-8 py-4 rounded-lg font-headline font-bold
group/btn
```
Arrow behavior:
- Primary: `group-hover/btn:translate-x-1 transition-transform duration-300`
- Secondary: `text-[#8b9bb4] group-hover/btn:text-[#00c3ff] group-hover/btn:translate-x-1`
- Ghost: `opacity-60 group-hover/btn:opacity-100 group-hover/btn:translate-x-1`

---

## Hover Group Scoping

Use Tailwind named groups to scope hover effects to individual items vs. the whole card.

```tsx
{/* Card-level hover */}
<div className="group/card ...">
  <div className="group-hover/card:opacity-100 ..."></div>  {/* top accent line */}
</div>

{/* Item-level hover (within a card) */}
<div className="group/item ...">
  <Icon className="group-hover/item:text-white group-hover/item:-rotate-12 ..." />
  <span className="group-hover/item:text-white ...">Label</span>
</div>
```

Use `group/card` + `group/item` when individual rows/items inside a card should highlight independently (not all at once).

---

## Layout Patterns

### Standard 2-column split (text left, content right)
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
  <div>{/* Left — badge, heading, copy */}</div>
  <div>{/* Right — card, image, buttons */}</div>
</div>
```

### CTA split (heading left, stacked buttons right)
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
  <div>{/* Eyebrow + h2 + subtext */}</div>
  <div className="flex flex-col gap-4 lg:pl-12">
    {/* 3 stacked full-width buttons */}
  </div>
</div>
```

### Card grid — 2×2
```
grid grid-cols-1 md:grid-cols-2 gap-8
```

### Card grid — 3-column
```
grid grid-cols-1 md:grid-cols-3 gap-8
```

### Mini-card grid — 2×2 (compact, within a section column)
```
grid grid-cols-2 gap-4
```

---

## Spacing Rhythm

| Context | Value |
|---|---|
| Section padding (standard) | `py-24 px-6` |
| Section padding (hero) | `py-32 px-6` |
| Section padding (compact) | `py-16 px-6` |
| Card internal | `p-8` |
| Mini-card internal | `p-4` |
| Grid gap (large cards) | `gap-8` |
| Grid gap (mini-cards) | `gap-4` |
| Column gap (2-col split) | `gap-16` |
| Column gap (CTA split) | `gap-12` |
| Space below eyebrow | `mb-6` |
| Space below h2 in section | `mb-5` or `mb-8` |
| Space below section heading block | `mb-16` (before card grid) |

---

## Animation

| Effect | Classes |
|---|---|
| Hover card lift | `hover:-translate-y-2 transition-transform duration-300` |
| CTA scale | `hover:scale-[1.02] active:scale-[0.98]` |
| Icon rotate on hover | `group-hover:-rotate-12` |
| Icon scale on hover | `group-hover:scale-110` |
| Glow opacity increase | `opacity-20 group-hover:opacity-60 transition-opacity duration-500` |
| Arrow slide right | `group-hover:translate-x-1 transition-transform duration-300` |
| Border color change | `transition-colors duration-500` |
| All properties | `transition-all duration-500` (large) / `duration-300` (micro) |

- Easing: `ease-out` on all entrances
- **Never** animate layout (width/height) — only transform and opacity
- **Never** use `animate-pulse` on UI elements — only ambient background glows

---

## Navigation

- Internal links: React Router `<Link to="...">` — never `<a href="...">`
- External app link: `<a href="https://pursuit.honestecho.com">`
- External links always: `target="_blank" rel="noopener noreferrer"`

---

## Do Not Use

- `text-gray-*` — use `text-[#8b9bb4]` or `text-[#a0b2c8]`
- `prose` class — style typography manually
- Inline `style={{}}` — Tailwind classes only
- System fonts for display text
- Generic gradients (e.g. `linear-gradient(135deg, #667eea, #764ba2)`)
- Emoji in UI — Lucide icons only
- Mixed accent colors within one section — everything is `#00c3ff`
- `position: fixed` or `sticky` except for Navbar
- Negative margins (`-mx-6`) for layout spacing
- Per-section grid background divs — the grid lives in the global fixed layer only
