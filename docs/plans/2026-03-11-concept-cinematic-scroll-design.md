# Concept Section — Cinematic Scroll Reveal

## Summary
Replace the static "Une table, mille saveurs" section with a scroll-driven cinematic experience. The section pins and progresses through 3 phases: full-screen title with zooming background, horizontal panel slide-in, and a final stacked composition.

## Structure
Total height: ~300vh (provides scroll range for GSAP scrub).
Content is pinned (100vh sticky) for the duration.

## Phase 1 — Title Intro (scroll 0%–25%)
- Full-screen background image (food, darkened with gradient overlay)
- Eyebrow: "L'ITALIE AUTHENTIQUE" — Helvetica Neue Bold, uppercase, centered
- Title: "UNE TABLE, MILLE SAVEURS" — Amfibia, massive, centered, cream color
- Background zooms slowly (scale 1 → 1.15, Ken Burns effect)
- At 25%, title + eyebrow fade out upward

## Phase 2 — Horizontal Panels (scroll 25%–75%)
3 panels slide in from the right, one by one, filling the viewport side by side.

Each panel contains:
- Background image (different Italian dish per panel)
- Dark gradient overlay for legibility
- Number (01, 02, 03) — Amfibia, large, semi-transparent
- Title — BUFFET À VOLONTÉ / FAIT MAISON / FAMIGLIA
- Short description line
- Panel dimensions: ~1/3 viewport width × 100vh

Animation: each panel enters via `translateX(100vw) → 0` with staggered timing.

### Panel content:
1. **01 — BUFFET À VOLONTÉ**: "Servez-vous parmi plus de 200 plats italiens authentiques"
2. **02 — FAIT MAISON**: "Recettes traditionnelles préparées sur place chaque jour"
3. **03 — FAMIGLIA**: "Un cadre chaleureux comme à la maison en Italie"

## Phase 3 — Stack + Summary (scroll 75%–100%)
- Panels tighten (gap collapses to 0)
- Glassmorphism overlay text appears at center:
  "Le seul buffet italien à volonté en Belgique. 200+ plats, faits maison, chaque jour."
- Pin releases, user scrolls into Buffet section

## Images (Unsplash placeholders)
- Background (Phase 1): Italian restaurant table spread
- Panel 1: Buffet selection / antipasti spread
- Panel 2: Chef hands / fresh pasta making
- Panel 3: Family dining / warm restaurant interior

## Technical Approach
- GSAP ScrollTrigger with `pin: true` and `scrub: true`
- Single timeline with position labels for each phase
- CSS: `will-change: transform` on panels, `backface-visibility: hidden`
- `contain: layout` on the section for paint performance

## Responsive (≤900px)
- Panels stack vertically instead of horizontally
- Each panel enters from bottom (`translateY(100vh) → 0`)
- Pin height increases to ~400vh
- Panels are 80vh tall instead of 100vh
- Summary text appears at bottom of final panel

## Fonts & Colors
- Eyebrow: `var(--font-body)`, 700, uppercase, `letter-spacing: 0.12em`
- Title: `var(--font-display)`, cream on dark
- Panel numbers: `var(--font-display)`, `opacity: 0.15`, cream
- Panel titles: `var(--font-display)`, cream
- Panel descriptions: `var(--font-body)`, cream, `opacity: 0.7`
- Overlay gradient: `linear-gradient(to top, rgba(0,0,0,0.7), transparent)`
