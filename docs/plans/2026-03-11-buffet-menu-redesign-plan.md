# Buffet & Menu Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the buffet horizontal carousel with a 3D stacked-cards scroll animation, and upgrade the menu book with cinematic animations and better UX.

**Architecture:** Two independent section rewrites in the same three files (index.html, styles.css, script.js). Buffet gets a completely new HTML/CSS/JS stack mechanic. Menu keeps its DOM structure but gets enhanced CSS animations and a rewritten JS controller. Both sections use GSAP ScrollTrigger with pin+scrub.

**Tech Stack:** HTML5, CSS3 (custom properties, keyframes, 3D transforms), GSAP 3.12 (ScrollTrigger), vanilla JS

**Design doc:** `docs/plans/2026-03-11-buffet-menu-redesign-design.md`

---

## Task 1: Buffet HTML — Replace carousel with stacked cards

**Files:**
- Modify: `index.html` — the `<section id="buffet">` block (lines ~256–326)

**Step 1: Replace the buffet section HTML**

Replace everything from `<section id="buffet"` to its closing `</section>` with:

```html
<section id="buffet" class="buffet">
  <div class="buffet__inner">
    <div class="buffet__header">
      <p class="buffet__eyebrow" data-reveal>un voyage culinaire</p>
      <h2 class="buffet__title" data-split-words>NOTRE BUFFET</h2>
    </div>

    <!-- Ghost number that changes with active card -->
    <div class="buffet__ghost-num" aria-hidden="true">01</div>

    <!-- Card stack container -->
    <div class="buffet__stack">
      <article class="buffet__card" data-card="0">
        <div class="buffet__card-img">
          <img src="assets/buffet/antipasti.jpg" alt="Antipasti italiens" loading="lazy">
        </div>
        <div class="buffet__card-overlay"></div>
        <div class="buffet__card-content">
          <span class="buffet__card-num">01</span>
          <h3 class="buffet__card-name">Antipasti</h3>
          <p class="buffet__card-desc">Bruschette, caprese, legumes grilles et charcuterie italienne</p>
        </div>
      </article>
      <article class="buffet__card" data-card="1">
        <div class="buffet__card-img">
          <img src="assets/buffet/pizze.jpg" alt="Pizza Napoletana" loading="lazy">
        </div>
        <div class="buffet__card-overlay"></div>
        <div class="buffet__card-content">
          <span class="buffet__card-num">02</span>
          <h3 class="buffet__card-name">Pizze</h3>
          <p class="buffet__card-desc">Cuites a la minute dans notre four traditionnel a bois</p>
        </div>
      </article>
      <article class="buffet__card" data-card="2">
        <div class="buffet__card-img">
          <img src="assets/buffet/primi-piatti.jpg" alt="Pasta Fresca" loading="lazy">
        </div>
        <div class="buffet__card-overlay"></div>
        <div class="buffet__card-content">
          <span class="buffet__card-num">03</span>
          <h3 class="buffet__card-name">Primi Piatti</h3>
          <p class="buffet__card-desc">Pates fraiches preparees dans la meule de parmesan</p>
        </div>
      </article>
      <article class="buffet__card" data-card="3">
        <div class="buffet__card-img">
          <img src="assets/buffet/secondi.jpg" alt="Grillades" loading="lazy">
        </div>
        <div class="buffet__card-overlay"></div>
        <div class="buffet__card-content">
          <span class="buffet__card-num">04</span>
          <h3 class="buffet__card-name">Secondi</h3>
          <p class="buffet__card-desc">Viandes grillees et saveurs mediterraneennes a la braise</p>
        </div>
      </article>
      <article class="buffet__card" data-card="4">
        <div class="buffet__card-img">
          <img src="assets/buffet/dolci.jpg" alt="Desserts italiens" loading="lazy">
        </div>
        <div class="buffet__card-overlay"></div>
        <div class="buffet__card-content">
          <span class="buffet__card-num">05</span>
          <h3 class="buffet__card-name">Dolci</h3>
          <p class="buffet__card-desc">Tiramisu, cannoli, panna cotta et fontaine de chocolat</p>
        </div>
      </article>
    </div>

    <!-- Counter -->
    <div class="buffet__counter">
      <span class="buffet__counter-current">1</span>
      <span class="buffet__counter-sep">/</span>
      <span class="buffet__counter-total">5</span>
    </div>

    <div class="buffet__footer">
      <a href="#menu" class="buffet__cta" data-magnetic>
        <span>DECOUVRIR LA CARTE</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
      </a>
    </div>
  </div>
</section>
```

**Step 2: Verify HTML is valid**

Open `index.html` in browser. The section should render (unstyled). No console errors.

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat(buffet): replace carousel HTML with stacked cards structure"
```

---

## Task 2: Buffet CSS — Style the stacked cards

**Files:**
- Modify: `styles.css` — replace the `.buffet` CSS block

**Step 1: Replace buffet CSS**

Find the entire buffet CSS block (starts with `/* === BUFFET — Horizontal Scroll Showcase */` and ends before `/* === MENU — Book Flip 3D */`). Replace it with:

```css
/* ============================================
   BUFFET — 3D Stacked Cards
   ============================================ */
.buffet {
  position: relative;
  background: var(--cream);
  overflow: hidden;
  /* Height controlled by GSAP pin */
}
.buffet__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--side-pad);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Header */
.buffet__header {
  text-align: center;
  margin-bottom: clamp(40px, 5vw, 64px);
  position: relative;
  z-index: 2;
}
.buffet__eyebrow {
  font-family: var(--font-body);
  font-size: clamp(14px, 1.8vw, 18px);
  font-weight: 700;
  color: var(--black);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 12px;
}
.buffet__title {
  font-family: var(--font-display);
  font-size: clamp(52px, 11vw, 140px);
  color: var(--red);
  text-transform: uppercase;
  line-height: 0.88;
  letter-spacing: -0.01em;
}

/* Ghost number */
.buffet__ghost-num {
  position: absolute;
  top: 50%;
  left: clamp(20px, 5vw, 80px);
  transform: translateY(-50%);
  font-family: var(--font-display);
  font-size: clamp(120px, 20vw, 300px);
  color: var(--red);
  opacity: 0.08;
  line-height: 1;
  pointer-events: none;
  user-select: none;
  z-index: 0;
  transition: opacity 0.3s;
}

/* Card stack */
.buffet__stack {
  position: relative;
  width: 100%;
  max-width: 560px;
  aspect-ratio: 5 / 3.5;
  z-index: 2;
}
.buffet__card {
  position: absolute;
  inset: 0;
  border-radius: 24px;
  overflow: hidden;
  will-change: transform, opacity;
  box-shadow: 0 8px 32px rgba(26, 10, 0, 0.15), 0 2px 8px rgba(26, 10, 0, 0.08);
}
.buffet__card-img {
  position: absolute;
  inset: 0;
}
.buffet__card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.buffet__card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(26, 10, 0, 0.85) 0%, rgba(26, 10, 0, 0.3) 50%, transparent 100%);
  z-index: 1;
}
.buffet__card-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: clamp(24px, 3vw, 40px);
  z-index: 2;
}
.buffet__card-num {
  font-family: var(--font-display);
  font-size: 13px;
  color: var(--cream);
  opacity: 0.5;
  letter-spacing: 0.15em;
  display: block;
  margin-bottom: 8px;
}
.buffet__card-name {
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 44px);
  color: var(--cream);
  text-transform: uppercase;
  letter-spacing: 0.02em;
  line-height: 1;
  margin-bottom: 8px;
}
.buffet__card-desc {
  font-size: 14px;
  color: var(--cream);
  opacity: 0.7;
  line-height: 1.5;
  max-width: 320px;
}

/* Counter */
.buffet__counter {
  margin-top: clamp(24px, 3vw, 40px);
  font-family: var(--font-display);
  font-size: 18px;
  color: var(--black);
  opacity: 0.4;
  letter-spacing: 0.1em;
  z-index: 2;
}
.buffet__counter-current {
  color: var(--red);
  opacity: 1;
  font-size: 22px;
}

/* Footer CTA */
.buffet__footer {
  text-align: center;
  margin-top: clamp(32px, 4vw, 56px);
  position: relative;
  z-index: 2;
}
.buffet__cta {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-display);
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 18px 44px;
  background: var(--red);
  color: var(--cream);
  border-radius: 50px;
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(237, 28, 36, 0.3);
}
.buffet__cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--black);
  border-radius: 50px;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.5s var(--ease-out-expo);
}
.buffet__cta:hover::before {
  transform: scaleX(1);
  transform-origin: left;
}
.buffet__cta span,
.buffet__cta svg {
  position: relative;
  z-index: 1;
}
.buffet__cta:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 28px rgba(237, 28, 36, 0.4);
}
.buffet__cta:hover svg {
  transform: translate(4px, -4px);
}

/* Mobile */
@media (max-width: 768px) {
  .buffet__stack {
    max-width: 340px;
  }
  .buffet__ghost-num {
    display: none;
  }
}
```

**Step 2: Verify in browser**

The cards should appear stacked on top of each other (all visible, overlapping). Ghost number visible on left. CTA visible below. No animations yet.

**Step 3: Commit**

```bash
git add styles.css
git commit -m "style(buffet): stacked cards layout with ghost number and counter"
```

---

## Task 3: Buffet JS — GSAP stacked card scroll animation

**Files:**
- Modify: `script.js` — replace `initBuffetHorizontalScroll()` function

**Step 1: Replace the entire `initBuffetHorizontalScroll` function**

Find the function (starts with `// BUFFET — Horizontal Scroll Showcase` comment, ends with the closing `}` of the function). Replace with:

```javascript
  // ========================================
  // BUFFET — 3D Stacked Cards
  // ========================================
  function initBuffetHorizontalScroll() {
    if (prefersReducedMotion) return;

    const buffetSection = document.getElementById('buffet');
    const cards = document.querySelectorAll('.buffet__card');
    const ghostNum = document.querySelector('.buffet__ghost-num');
    const counterCurrent = document.querySelector('.buffet__counter-current');

    if (!buffetSection || !cards.length) return;

    const totalCards = cards.length;
    const nums = ['01', '02', '03', '04', '05'];

    // Set initial stacked positions: bottom card first, top card last in DOM
    // Cards are stacked with slight offset and rotation
    cards.forEach((card, i) => {
      const stackOffset = (totalCards - 1 - i) * 8;
      const stackRotation = (totalCards - 1 - i) * 1.5;
      gsap.set(card, {
        y: stackOffset,
        rotation: stackRotation,
        zIndex: i + 1, // last card on top
      });
    });

    // Master timeline pinned to section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: buffetSection,
        start: 'top top',
        end: () => `+=${window.innerHeight * 4}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      }
    });

    // Animate each card flying away (top card first = last in DOM = index totalCards-1)
    for (let i = totalCards - 1; i >= 1; i--) {
      const card = cards[i];
      const progress = (totalCards - 1 - i) / (totalCards - 1);
      const nextCardIndex = i - 1;

      tl.to(card, {
        y: -300,
        rotation: gsap.utils.random(-8, 8),
        rotateX: 15,
        scale: 0.85,
        opacity: 0,
        duration: 1,
        ease: 'power2.in',
        onStart: () => {
          // Update ghost number and counter
          if (ghostNum) ghostNum.textContent = nums[nextCardIndex] || nums[0];
          if (counterCurrent) counterCurrent.textContent = String(totalCards - i + 1);
        }
      }, progress * 0.85);

      // Restack remaining cards
      if (i > 1) {
        for (let j = i - 1; j >= 0; j--) {
          const belowCard = cards[j];
          const newStackPos = (i - 1 - j);
          tl.to(belowCard, {
            y: newStackPos * 8,
            rotation: newStackPos * 1.5,
            duration: 0.5,
            ease: 'power2.out',
          }, progress * 0.85);
        }
      }
    }

    // Entrance animation for the stack
    gsap.from('.buffet__stack', {
      y: 80,
      opacity: 0,
      scale: 0.92,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: buffetSection,
        start: 'top 80%',
        once: true,
      }
    });
  }
```

**Step 2: Verify in browser**

Scroll to the buffet section. The section should pin. Cards should fly away one by one as you scroll. Ghost number should update. Counter should update. Last card remains visible.

**Step 3: Commit**

```bash
git add script.js
git commit -m "feat(buffet): GSAP stacked card fly-away scroll animation"
```

---

## Task 4: Menu HTML — Add pulse ring, hint text, dot indicator

**Files:**
- Modify: `index.html` — the `<section id="menu">` block

**Step 1: Add pulse ring div inside menu-book, hint text, and dot indicator**

Inside `<div class="menu-book" id="menuBook">`, add the pulse ring as the first child:
```html
<div class="menu-book__pulse" aria-hidden="true"></div>
```

After the closing `</div>` of `menu-book` (before the CTA button), add:
```html
<!-- Dot indicator -->
<div class="menu-book__dots">
  <button class="menu-book__dot is-active" data-page="cover" aria-label="Couverture"></button>
  <button class="menu-book__dot" data-page="interior" aria-label="Interieur"></button>
  <button class="menu-book__dot" data-page="back" aria-label="Dos"></button>
</div>
```

After the CTA `<button class="menu-section__cta" id="menuOpen">`, add:
```html
<p class="menu-section__hint" id="menuHint">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5"/></svg>
  <span>Cliquez pour feuilleter</span>
</p>
```

**Step 2: Verify HTML renders**

Open browser. New elements should appear (unstyled). No console errors.

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat(menu): add pulse ring, dot indicator, and hint text HTML"
```

---

## Task 5: Menu CSS — Pulse ring, hover lift, hint, dots

**Files:**
- Modify: `styles.css` — add new rules after the existing `.menu-section__cta.is-hidden` block

**Step 1: Add new CSS rules**

Insert these rules right after the `.menu-section__cta.is-hidden` block and before the `/* --- Mobile --- */` media query for the menu:

```css
/* --- Pulse ring --- */
.menu-book__pulse {
  position: absolute;
  inset: -16px;
  border: 2px solid var(--red);
  border-radius: 10px;
  opacity: 0;
  pointer-events: none;
  z-index: 0;
  animation: menuPulse 2.5s ease-out infinite;
}
.menu-book.is-open .menu-book__pulse,
.menu-book.is-back .menu-book__pulse {
  animation: none;
  opacity: 0;
}
@keyframes menuPulse {
  0% {
    opacity: 0.6;
    inset: -4px;
  }
  100% {
    opacity: 0;
    inset: -28px;
  }
}

/* --- Hover lift --- */
.menu-book__cover {
  transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
}
.menu-book:not(.is-open):not(.is-back) .menu-book__cover:hover {
  transform: translateY(-8px);
  box-shadow:
    12px 16px 44px rgba(0, 0, 0, 0.3),
    4px 4px 16px rgba(0, 0, 0, 0.15);
}

/* --- Hint text --- */
.menu-section__hint {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--black);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}
.menu-section__hint.is-visible {
  opacity: 0.5;
}
.menu-section__hint.is-hidden {
  opacity: 0;
}

/* --- Dot indicator --- */
.menu-book__dots {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 24px;
  margin-bottom: 16px;
}
.menu-book__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--red);
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: background 0.3s, transform 0.3s;
}
.menu-book__dot.is-active {
  background: var(--red);
  transform: scale(1.2);
}
.menu-book__dot:hover {
  transform: scale(1.3);
}
```

**Step 2: Verify in browser**

Pulse ring should animate around the book cover. Dots visible below book. Hint text hidden (JS will show it).

**Step 3: Commit**

```bash
git add styles.css
git commit -m "style(menu): pulse ring, hover lift, hint text, dot indicator"
```

---

## Task 6: Menu JS — Enhanced animations and UX

**Files:**
- Modify: `script.js` — rewrite `initMenuBookFlip()` function

**Step 1: Replace the entire `initMenuBookFlip` function**

Find the function (starts with `// MENU — Book Flip 3D` comment). Replace with:

```javascript
  // ========================================
  // MENU — Book Flip 3D (Cinematic)
  // ========================================
  function initMenuBookFlip() {
    const menuBook = document.getElementById('menuBook');
    const menuCover = document.getElementById('menuCover');
    const menuInterior = document.getElementById('menuInterior');
    const menuBack = document.getElementById('menuBack');
    const menuOpen = document.getElementById('menuOpen');
    const menuClose = document.getElementById('menuClose');
    const menuNext = document.getElementById('menuNext');
    const menuPrev = document.getElementById('menuPrev');
    const menuHint = document.getElementById('menuHint');
    const dots = document.querySelectorAll('.menu-book__dot');

    if (!menuBook || !menuCover) return;

    let currentState = 'cover'; // 'cover' | 'interior' | 'back'

    // --- Dot indicator ---
    function updateDots(state) {
      dots.forEach(dot => dot.classList.remove('is-active'));
      const target = document.querySelector(`.menu-book__dot[data-page="${state}"]`);
      if (target) target.classList.add('is-active');
    }

    // --- Hint text: show after 2s delay when section enters viewport ---
    if (menuHint) {
      ScrollTrigger.create({
        trigger: '.menu-section',
        start: 'top 60%',
        once: true,
        onEnter: () => {
          gsap.delayedCall(2, () => {
            if (currentState === 'cover') {
              menuHint.classList.add('is-visible');
            }
          });
        }
      });
    }

    function hideHint() {
      if (menuHint) {
        menuHint.classList.remove('is-visible');
        menuHint.classList.add('is-hidden');
      }
    }

    // --- Open book (cinematic) ---
    function openBook() {
      if (currentState !== 'cover') return;
      currentState = 'interior';
      hideHint();
      updateDots('interior');

      // Show interior, prepare for reveal
      menuInterior.style.display = 'block';
      gsap.set(menuInterior, { opacity: 0 });

      // Phase 1: Lift cover corner (rotateX)
      gsap.to(menuCover, {
        rotateX: -5,
        duration: 0.3,
        ease: 'power2.out',
        onStart: () => {
          menuBook.classList.add('is-open');
          gsap.to(menuCover, { boxShadow: '0 0 0 rgba(0,0,0,0)', duration: 0.3 });
        },
        onComplete: () => {
          // Phase 2: Full flip
          gsap.to(menuCover, {
            rotateX: 0,
            rotateY: -180,
            duration: 0.8,
            ease: 'power3.inOut',
          });
        }
      });

      // Fade in interior with delay
      gsap.to(menuInterior, {
        opacity: 1,
        duration: 0.5,
        delay: 0.7,
        ease: 'power2.out',
      });

      // Show navigation with back.out bounce
      menuNext.style.display = 'flex';
      menuClose.style.display = 'flex';
      gsap.fromTo([menuClose, menuNext],
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 0.5, delay: 1, stagger: 0.1, ease: 'back.out(2.5)' }
      );

      // Hide CTA
      menuOpen.classList.add('is-hidden');
    }

    // --- Show back page (page turn) ---
    function showBackPage() {
      if (currentState !== 'interior') return;
      currentState = 'back';
      updateDots('back');

      menuBack.style.display = 'block';
      gsap.set(menuBack, { opacity: 0, rotateY: 180 });

      // Page turn: interior rotates away
      gsap.to(menuInterior, {
        rotateY: -180,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          menuInterior.style.display = 'none';
          gsap.set(menuInterior, { rotateY: 0 });
          menuBook.classList.remove('is-open');
          menuBook.classList.add('is-back');
        }
      });

      // Back page turns in
      gsap.to(menuBack, {
        rotateY: 0,
        opacity: 1,
        duration: 0.6,
        delay: 0.15,
        ease: 'power2.inOut',
      });

      // Switch arrows
      gsap.to(menuNext, {
        opacity: 0, scale: 0.6, duration: 0.2,
        onComplete: () => { menuNext.style.display = 'none'; }
      });
      menuPrev.style.display = 'flex';
      gsap.fromTo(menuPrev,
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 0.4, delay: 0.5, ease: 'back.out(2)' }
      );
    }

    // --- Show interior from back (reverse page turn) ---
    function showInteriorFromBack() {
      if (currentState !== 'back') return;
      currentState = 'interior';
      updateDots('interior');

      menuInterior.style.display = 'block';
      gsap.set(menuInterior, { opacity: 0, rotateY: 180 });

      // Back page turns away
      gsap.to(menuBack, {
        rotateY: -180,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          menuBack.style.display = 'none';
          gsap.set(menuBack, { rotateY: 0 });
          menuBook.classList.remove('is-back');
          menuBook.classList.add('is-open');
        }
      });

      // Interior turns in
      gsap.to(menuInterior, {
        rotateY: 0,
        opacity: 1,
        duration: 0.6,
        delay: 0.15,
        ease: 'power2.inOut',
      });

      // Switch arrows
      gsap.to(menuPrev, {
        opacity: 0, scale: 0.6, duration: 0.2,
        onComplete: () => { menuPrev.style.display = 'none'; }
      });
      menuNext.style.display = 'flex';
      gsap.fromTo(menuNext,
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 0.4, delay: 0.5, ease: 'back.out(2)' }
      );
    }

    // --- Close book (elastic bounce) ---
    function closeBook() {
      currentState = 'cover';
      updateDots('cover');

      // Hide navigation
      gsap.to([menuNext, menuPrev, menuClose], {
        opacity: 0, scale: 0.6, duration: 0.2,
        onComplete: function () {
          menuNext.style.display = 'none';
          menuPrev.style.display = 'none';
          menuClose.style.display = 'none';
        }
      });

      // Fade out pages
      gsap.to([menuInterior, menuBack], {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          menuInterior.style.display = 'none';
          menuBack.style.display = 'none';
          gsap.set([menuInterior, menuBack], { rotateY: 0 });
          menuBook.classList.remove('is-open', 'is-back');
        }
      });

      // Cover returns with elastic bounce
      menuCover.style.display = '';
      gsap.set(menuCover, { rotateY: -180, rotateX: 0 });
      gsap.to(menuCover, {
        rotateY: 0,
        duration: 1,
        delay: 0.3,
        ease: 'elastic.out(1, 0.5)',
        onComplete: () => {
          gsap.set(menuCover, {
            boxShadow: '8px 8px 30px rgba(0,0,0,0.25), 2px 2px 8px rgba(0,0,0,0.12)',
          });
        }
      });

      // Show CTA
      menuOpen.classList.remove('is-hidden');
    }

    // --- Dot click navigation ---
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const page = dot.getAttribute('data-page');
        if (page === 'cover' && currentState !== 'cover') closeBook();
        if (page === 'interior' && currentState === 'cover') openBook();
        if (page === 'interior' && currentState === 'back') showInteriorFromBack();
        if (page === 'back' && currentState === 'interior') showBackPage();
      });
    });

    // --- Event listeners ---
    menuOpen.addEventListener('click', openBook);
    menuCover.addEventListener('click', openBook);
    menuNext.addEventListener('click', showBackPage);
    menuPrev.addEventListener('click', showInteriorFromBack);
    menuClose.addEventListener('click', closeBook);

    // --- Mobile swipe support ---
    let touchStartX = 0;
    let touchEndX = 0;
    menuBook.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    menuBook.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swipe left → next
          if (currentState === 'cover') openBook();
          else if (currentState === 'interior') showBackPage();
        } else {
          // Swipe right → prev
          if (currentState === 'back') showInteriorFromBack();
          else if (currentState === 'interior') closeBook();
        }
      }
    }, { passive: true });

    // --- Scroll reveal for book ---
    gsap.from('.menu-book__cover', {
      y: 60,
      opacity: 0,
      scale: 0.92,
      rotation: -3,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.menu-section',
        start: 'top 70%',
        once: true,
      }
    });
  }
```

**Step 2: Verify in browser**

- Book should have pulse ring animation
- Hint text appears after 2s when scrolling to section
- Click cover → cinematic 2-phase flip (lift corner then rotate)
- Click next → page turn effect (rotateY)
- Click prev → reverse page turn
- Close → elastic bounce
- Dots update and are clickable
- Swipe on mobile works

**Step 3: Commit**

```bash
git add script.js
git commit -m "feat(menu): cinematic book flip, pulse ring, dots, swipe, hint"
```

---

## Task 7: Menu CSS mobile — Arrows below book, responsive

**Files:**
- Modify: `styles.css` — update the menu `@media (max-width: 768px)` block

**Step 1: Replace the mobile media query for menu**

Find the existing menu mobile block and replace:

```css
@media (max-width: 768px) {
  .menu-book { max-width: 100%; }
  .menu-book.is-open { max-width: 100%; }
  .menu-book.is-back { max-width: 100%; }
  .menu-book__nav {
    position: static;
    transform: none;
    width: 48px;
    height: 48px;
  }
  .menu-book__nav:hover {
    transform: scale(1.1);
  }
  .menu-book__nav--next { right: auto; }
  .menu-book__nav--prev { left: auto; }
  .menu-section__inner {
    position: relative;
  }
  /* Arrows below book on mobile */
  .menu-book__nav--next,
  .menu-book__nav--prev {
    position: fixed;
    bottom: 24px;
    z-index: 20;
  }
  .menu-book__nav--prev { left: 24px; }
  .menu-book__nav--next { right: 24px; }
  .menu-book__close {
    position: fixed;
    top: auto;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    right: auto;
    z-index: 20;
  }
  .menu-book__close:hover {
    transform: translateX(-50%) rotate(90deg);
  }
}
```

**Step 2: Test on mobile viewport (375px width)**

Arrows should appear as fixed buttons at the bottom of the screen when book is open.

**Step 3: Commit**

```bash
git add styles.css
git commit -m "style(menu): mobile responsive — arrows fixed at bottom"
```

---

## Task 8: Final — Bump cache, verify both sections, push

**Files:**
- Modify: `index.html` — bump `?v=` query strings

**Step 1: Bump cache version**

Replace all `?v=37` with `?v=38` in index.html.

**Step 2: Full browser verification**

Open the site and test:
- [ ] Buffet section: cards stack visible, scroll pins section, cards fly away one by one
- [ ] Buffet: ghost number updates, counter updates
- [ ] Buffet: CTA button works
- [ ] Buffet: mobile view — smaller cards, no ghost number
- [ ] Menu section: pulse ring animates around cover
- [ ] Menu: hover lifts book
- [ ] Menu: hint text appears after 2s
- [ ] Menu: click cover → cinematic 2-phase flip
- [ ] Menu: next → page turn effect
- [ ] Menu: prev → reverse page turn
- [ ] Menu: close → elastic bounce
- [ ] Menu: dots are clickable and update
- [ ] Menu: mobile arrows at bottom, swipe works
- [ ] No console errors

**Step 3: Push**

```bash
git push origin main
```
