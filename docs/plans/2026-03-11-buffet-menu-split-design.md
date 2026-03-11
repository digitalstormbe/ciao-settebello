# Buffet & Menu — Split Layout Design

## Summary
Merge the separate Buffet and Menu sections into a single cream-background section with a two-column split layout on desktop: buffet carousel on the left (60%), menu book 3D on the right (40%).

## Layout

Desktop (>900px): CSS Grid `3fr 2fr` (60/40 split), max-width 1400px centered.
Mobile (≤900px): Single column stack — buffet on top, menu below.

## Left Column — Notre Buffet (60%)

- Header: eyebrow "un voyage culinaire" (Helvetica Neue Bold, black, uppercase), title "NOTRE BUFFET" (Amfibia, red)
- Horizontal carousel with 5 slides (Antipasti, Pizze, Primi Piatti, Secondi, Dolci)
- Carousel scrolls horizontally via GSAP ScrollTrigger scrub within its container
- Slides keep current design: rounded cards, photo + gradient overlay + number/title/desc
- Remove the "DÉCOUVRIR LA CARTE" CTA button (redundant with menu next to it)
- Remove the "BUFFET" ghost background text (no longer works on cream)

## Right Column — Le Menu (40%)

- Header: eyebrow "notre carte" (Helvetica Neue Bold, black, uppercase), title "LE MENU" (Amfibia, red)
- Menu book 3D centered vertically in the column
- Book max-width reduced to ~340px to fit the narrower column
- All book interactions preserved: click cover → flip → interior → back → close
- "Ouvrir le menu" button below the book

## Colors

- Section background: var(--cream)
- Eyebrows: var(--black)
- Titles: var(--red)
- Slide cards: dark overlay on photos (unchanged), cream text inside cards
- Book: unchanged styling (shadows, perspective)

## Typography

- Eyebrows: var(--font-body), 700, uppercase, letter-spacing: 0.12em
- Titles: var(--font-display), clamp sizes, uppercase
- Slide content: unchanged

## Responsive (≤900px)

- Grid collapses to single column
- Buffet section: full width, carousel scrolls naturally
- Menu section: full width, book centered, standard spacing
- Both sections get vertical padding between them

## Technical Notes

- Single `<section id="buffet">` replaces both old sections
- GSAP ScrollTrigger for carousel adapts to the new container width
- Menu book JS (initMenuBook) unchanged, just targets new DOM location
- Nav links: keep #buffet, remove #menu (or point both to #buffet)
