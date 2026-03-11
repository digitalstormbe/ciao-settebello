# Buffet & Menu Sections — Creative Redesign

## Summary
Redesign both sections independently so each feels visually rich and premium. Buffet switches to a "Cards 3D Stacked" format on cream background. Menu upgrades the existing 3D book with cinematic animations and improved UX.

---

## Section 1: Notre Buffet — "Cards 3D Stacked"

### Layout
- Background: var(--cream)
- Header: eyebrow "un voyage culinaire" (Helvetica Neue Bold, black, uppercase) + title "NOTRE BUFFET" (Amfibia, red)
- Stack of 5 cards centered, max-width: 900px
- Each card: ~500x350px desktop, photo + gradient overlay + number/title/description
- CTA "DECOUVRIR LA CARTE" at bottom (same style as current buffet CTA but adapted for cream bg)

### Cards (same 5 categories)
1. Antipasti
2. Pizze
3. Primi Piatti
4. Secondi
5. Dolci

### Animation (GSAP ScrollTrigger, pinned, scrub)
- Section is pinned during the entire card stack animation
- Cards start stacked with slight Y offset (+8px each) and rotation (+2deg each), creating a fanned deck effect
- On scroll, the topmost card "flies away": translateY upward, rotateX(15deg) tilt, scale(0.9), then opacity 0
- Next card takes the foreground position
- Each card transition takes ~20% of the total scroll distance
- Total pin scroll: roughly 5x viewport height

### Decorative Elements
- Large ghost numbers "01"–"05" appear beside the active card, var(--red) at 10% opacity, Amfibia font
- Small counter "1/5", "2/5"... below the stack to orient the user
- Subtle shadow under the stack that changes as cards are removed

### Mobile (<=768px)
- Cards: ~320x240px
- Same stacked mechanic, reduced scroll distance
- Ghost numbers hidden on mobile (too crowded)
- Counter remains visible

### Colors
- Section bg: var(--cream)
- Card overlays: dark gradient on photos (unchanged)
- Text in cards: var(--cream) on dark overlay
- Title: var(--red)
- Eyebrow: var(--black)
- CTA button: var(--red) bg, var(--cream) text

---

## Section 2: Le Menu — "Book Cinematique"

### Layout (unchanged structure)
- Background: var(--cream)
- Header: eyebrow "notre carte" + title "DECOUVREZ LE MENU"
- Book 3D centered, max-width: 420px (860px when open)
- CTA "Ouvrir le menu" below

### UX Improvements — Invitation to Click
- Pulse ring: a CSS ring animation around the cover that expands and fades in a loop (2s interval), stops once book is opened
- Hover lift: on mouseover, book translateY(-8px) with deeper box-shadow
- Hint text: appears 2s after section enters viewport — "Cliquez pour feuilleter" with a small pointer icon, fades on click

### Opening Animation (enhanced)
- Phase 1 (0-30%): Cover lifts with rotateX(-5deg) — simulates lifting the corner
- Phase 2 (30-100%): rotateY(-180deg) with power3.inOut easing — the full flip
- Book width expands to double-page with back.out ease for a satisfying snap
- Optional: tiny particle burst (4-6 small golden dots that scatter and fade) at the moment of full opening

### Page Navigation (enhanced)
- Instead of fade transitions, pages turn with rotateY — the leaving page rotates -180deg while the incoming page rotates from 180deg to 0
- Arrow buttons enlarged (56px) with hover labels: "Page suivante" / "Page precedente"
- Dot indicator below the book: 3 dots (cover, interior, back) showing current position, clickable

### Closing Animation (enhanced)
- Cover returns with elastic.out(1, 0.5) ease — slight bounce on close
- Width shrinks back to original with smooth ease
- Pulse ring restarts after close

### Mobile (<=768px)
- Book: full width (max-width: 100%)
- Nav arrows move below the book (horizontal layout) instead of left/right sides
- Swipe gesture support: left/right swipe to turn pages (touch events)
- Dot indicator remains below arrows

---

## Technical Notes

### Buffet
- Section uses GSAP ScrollTrigger with pin:true and scrub
- Cards positioned with absolute positioning inside a relative container
- Each card has a GSAP timeline that animates in sequence based on scroll progress
- Remove old horizontal carousel code; replace with stack mechanic
- Keep buffet photos from assets/buffet/

### Menu
- Keep existing initMenuBookFlip() function, enhance the GSAP animations
- Add CSS keyframe for pulse ring
- Add touch event listeners for mobile swipe
- Page turn uses GSAP rotateY with perspective
- Dot indicator is simple DOM elements with active class toggling

### Shared
- Both sections on cream background creates visual continuity
- GSAP ScrollTrigger handles all scroll-based animations
- Existing assets (photos, menu images) remain unchanged
