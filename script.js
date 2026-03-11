/* ============================================
   CIAO SETTEBELLO — V5 "Trattoria Moderna"
   Cinematic Animations & Expert Interactions
   GSAP + Lenis + SplitType
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  gsap.registerPlugin(ScrollTrigger);

  // ========================================
  // LENIS SMOOTH SCROLL
  // ========================================
  let lenis;
  if (!prefersReducedMotion) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Stop scroll during loader
    lenis.stop();
  }

  // ========================================
  // SCROLL PROGRESS BAR
  // ========================================
  const scrollProgressBar = document.getElementById('scrollProgress');
  if (scrollProgressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollProgressBar.style.width = scrollPercent + '%';
    }, { passive: true });
  }

  // ========================================
  // SCROLL ANIMATION — Frame-by-frame canvas
  // ========================================
  const animCanvas = document.getElementById('animCanvas');
  const ctx = animCanvas ? animCanvas.getContext('2d') : null;
  const scrollAnimSection = document.getElementById('scrollAnimation');
  const navbar = document.getElementById('navbar');
  const FRAME_COUNT = 73;
  const framePaths = [];
  const frameImages = new Array(FRAME_COUNT);
  let currentFrame = -1;

  // Build frame paths: 1.png -> frame_0001-0071.webp -> 2.png
  framePaths.push('assets/frames/1.png');
  for (let i = 1; i <= 71; i++) {
    framePaths.push('assets/frames/frame_' + String(i).padStart(4, '0') + '.webp');
  }
  framePaths.push('assets/frames/2.png');

  function resizeCanvas() {
    if (!animCanvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    animCanvas.width = window.innerWidth * dpr;
    animCanvas.height = window.innerHeight * dpr;
    animCanvas.style.width = window.innerWidth + 'px';
    animCanvas.style.height = window.innerHeight + 'px';
    if (currentFrame >= 0) drawFrame(currentFrame);
  }

  function drawFrame(index) {
    if (!ctx || !frameImages[index] || !frameImages[index].complete) return;
    currentFrame = index;
    const img = frameImages[index];
    const cw = animCanvas.width;
    const ch = animCanvas.height;
    const imgR = img.naturalWidth / img.naturalHeight;
    const canR = cw / ch;
    const isPortrait = ch > cw;

    if (isPortrait) {
      ctx.fillStyle = '#ED1C24';
      ctx.fillRect(0, 0, cw, ch);
      let dw, dh, dx, dy;
      if (imgR > canR) {
        dw = cw;
        dh = cw / imgR;
        dx = 0;
        dy = (ch - dh) / 2;
      } else {
        dh = ch;
        dw = ch * imgR;
        dx = (cw - dw) / 2;
        dy = 0;
      }
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, dx, dy, dw, dh);
    } else {
      let sx, sy, sw, sh;
      if (imgR > canR) {
        sh = img.naturalHeight;
        sw = sh * canR;
        sx = (img.naturalWidth - sw) / 2;
        sy = 0;
      } else {
        sw = img.naturalWidth;
        sh = sw / canR;
        sx = 0;
        sy = (img.naturalHeight - sh) / 2;
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
    }
  }

  window.addEventListener('resize', resizeCanvas);

  function preloadFrames() {
    return new Promise((resolve) => {
      let loaded = 0;
      framePaths.forEach((src, i) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          loaded++;
          const bar = document.getElementById('loaderProgress');
          if (bar) bar.style.width = ((loaded / FRAME_COUNT) * 100) + '%';
          if (loaded === FRAME_COUNT) resolve();
        };
        img.src = src;
        frameImages[i] = img;
      });
    });
  }

  function setupScrollAnimation() {
    if (!scrollAnimSection || !ctx) return;

    const frameObj = { frame: 0 };
    gsap.to(frameObj, {
      frame: FRAME_COUNT - 1,
      ease: 'none',
      scrollTrigger: {
        trigger: scrollAnimSection,
        start: 'top top',
        end: '75% bottom',
        scrub: true,
      },
      onUpdate: () => {
        const idx = Math.round(frameObj.frame);
        if (idx !== currentFrame) drawFrame(idx);
      }
    });

    // Show navbar as soon as user starts scrolling — stays visible permanently
    let navRevealed = false;
    ScrollTrigger.create({
      trigger: scrollAnimSection,
      start: 'top top-=2%',
      once: true,
      onEnter: () => {
        if (navbar && !navRevealed) {
          navRevealed = true;
          navbar.style.pointerEvents = '';
          gsap.to(navbar, {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            onStart: () => {
              navbar.style.transform = 'translateX(-50%) translateY(0)';
            }
          });
        }
      }
    });

    // ---- Hero text reveal — cinematic scroll-synced ----
    const heroEyebrow = document.getElementById('heroEyebrow');
    const heroLine1 = document.getElementById('heroLine1');
    const heroLine2 = document.getElementById('heroLine2');
    const heroSep = document.getElementById('heroSep');
    const heroTagline = document.getElementById('heroTagline');
    const heroSpinner = document.getElementById('heroSpinner');
    const heroActions = document.getElementById('heroActions');

    const heroTL = gsap.timeline({
      scrollTrigger: {
        trigger: scrollAnimSection,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      }
    });

    // Eyebrow: glassmorphism rectangle fade in
    if (heroEyebrow) {
      heroTL.fromTo(heroEyebrow,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.05, ease: 'power2.out' },
        0.01
      );
    }

    // MAMMA — dramatic 3D entrance with letter-spacing
    if (heroLine1) {
      heroTL.fromTo(heroLine1,
        { opacity: 0, y: 100, rotateX: -20, letterSpacing: '0.15em' },
        { opacity: 1, y: 0, rotateX: 0, letterSpacing: '-0.03em', duration: 0.09, ease: 'power4.out' },
        0.05
      );
    }

    // MIA ! — slide up with 3D rotation, slight delay for drama
    if (heroLine2) {
      heroTL.fromTo(heroLine2,
        { opacity: 0, y: 100, rotateX: -25, scale: 0.9 },
        { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 0.09, ease: 'power4.out' },
        0.12
      );
    }

    // Separator line — expand with glow
    if (heroSep) {
      heroTL.fromTo(heroSep,
        { opacity: 0, scaleX: 0, width: 0 },
        { opacity: 1, scaleX: 1, width: 56, duration: 0.05, ease: 'power3.inOut' },
        0.20
      );
    }

    // Tagline — elegant entrance
    if (heroTagline) {
      heroTL.fromTo(heroTagline,
        { opacity: 0, y: 30, letterSpacing: '0.08em' },
        { opacity: 0.95, y: 0, letterSpacing: '0em', duration: 0.07, ease: 'power3.out' },
        0.24
      );
    }

    // Rotating badge — spin in with scale
    if (heroSpinner) {
      heroTL.fromTo(heroSpinner,
        { opacity: 0, scale: 0, rotation: -90 },
        { opacity: 1, scale: 1, rotation: 0, duration: 0.08, ease: 'back.out(1.7)' },
        0.30
      );
    }

    // Actions — CTA button with bounce
    if (heroActions) {
      heroTL.fromTo(heroActions,
        { opacity: 0, y: 24, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.08, ease: 'back.out(1.4)' },
        0.35
      );
    }

    // Fade out at the end (86-94%)
    heroTL.to('#heroText', {
      opacity: 0,
      y: -80,
      scale: 0.97,
      duration: 0.08,
      ease: 'power2.in',
    }, 0.86);
  }

  // ========================================
  // PAGE LOADER
  // ========================================
  const loader = document.getElementById('loader');

  if (prefersReducedMotion) {
    if (loader) loader.style.display = 'none';
    if (scrollAnimSection) scrollAnimSection.style.display = 'none';
    if (lenis) lenis.start();
  } else {
    if (navbar) {
      navbar.style.opacity = '0';
      navbar.style.pointerEvents = 'none';
      navbar.style.transform = 'translateX(-50%) translateY(-20px)';
    }

    preloadFrames().then(() => {
      gsap.delayedCall(0.4, () => {
        resizeCanvas();
        drawFrame(0);
        gsap.to(loader, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.8,
          ease: 'power4.inOut',
          onComplete: () => {
            loader.style.display = 'none';
            if (lenis) lenis.start();
            setupScrollAnimation();
            initSections();
          }
        });
      });
    });
  }

  // ========================================
  // SECTION ANIMATIONS — Called after loader
  // ========================================
  function initSections() {
    initSplitType();
    initRevealAnimations();
    initClipReveals();
    initTilt();
    initParallaxElements();
    initMagnetic();
    initMarquee();
    initConceptAnimations();
    initBuffetHorizontalScroll();
    initMenuBookFlip();
    initStatsAnimations();
    initInfosAnimations();
    initFooterAnimations();
  }

  // Also initialize if reduced motion is off but loader was skipped
  if (prefersReducedMotion) {
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  // ========================================
  // SPLITTYPE — Word-by-word reveal on scroll
  // ========================================
  function initSplitType() {
    if (prefersReducedMotion || typeof SplitType === 'undefined') return;

    document.querySelectorAll('[data-split-words]').forEach(el => {
      if (el.closest('.hero-text')) return;

      const split = new SplitType(el, { types: 'words' });
      gsap.set(split.words, { opacity: 0, y: 80, rotateX: -20 });

      gsap.to(split.words, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        }
      });
    });
  }

  // ========================================
  // DATA-REVEAL — Fade-in + slide-up
  // ========================================
  function initRevealAnimations() {
    if (prefersReducedMotion) return;

    document.querySelectorAll('[data-reveal]').forEach(el => {
      gsap.from(el, {
        opacity: 0,
        y: 50,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        }
      });
    });
  }

  // ========================================
  // CLIP-PATH REVEALS — Cinematic image reveals
  // ========================================
  function initClipReveals() {
    if (prefersReducedMotion) return;

    document.querySelectorAll('[data-clip-reveal]').forEach(el => {
      // Start with image hidden via clip-path
      gsap.set(el, { clipPath: 'inset(12% 12% 12% 12%)' });

      const img = el.querySelector('img');
      if (img) {
        gsap.set(img, { scale: 1.2 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          once: true,
        }
      });

      tl.to(el, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.2,
        ease: 'power3.inOut',
      });

      if (img) {
        tl.to(img, {
          scale: 1,
          duration: 1.4,
          ease: 'power2.out',
        }, 0.1);
      }
    });
  }

  // ========================================
  // DATA-TILT — 3D tilt on hover
  // ========================================
  function initTilt() {
    if (!window.matchMedia('(pointer: fine)').matches || prefersReducedMotion) return;

    document.querySelectorAll('[data-tilt]').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        gsap.to(el, {
          rotateX,
          rotateY,
          transformPerspective: 800,
          duration: 0.4,
          ease: 'power2.out',
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)',
        });
      });
    });
  }

  // ========================================
  // PARALLAX — data-speed elements
  // ========================================
  function initParallaxElements() {
    if (prefersReducedMotion) return;

    document.querySelectorAll('[data-speed]').forEach(el => {
      const speed = parseFloat(el.getAttribute('data-speed'));
      gsap.to(el, {
        y: () => speed * -200,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        }
      });
    });
  }

  // ========================================
  // MAGNETIC HOVER
  // ========================================
  function initMagnetic() {
    if (!window.matchMedia('(pointer: fine)').matches || prefersReducedMotion) return;

    document.querySelectorAll('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, {
          x: x / 4,
          y: y / 4,
          duration: 0.4,
          ease: 'power2.out',
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          x: 0, y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)',
        });
      });
    });
  }

  // ========================================
  // MARQUEE — Velocity-based speed + skew
  // ========================================
  function initMarquee() {
    if (prefersReducedMotion) return;

    const marqueeTrack1 = document.querySelector('#marquee1 .marquee__track');
    const marqueeTrack2 = document.querySelector('#marquee2 .marquee__track');

    if (marqueeTrack1) {
      ScrollTrigger.create({
        trigger: '.marquee-section',
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          const skew = gsap.utils.clamp(-4, 4, velocity / 500);
          gsap.to('.marquee-section', {
            skewX: skew,
            duration: 0.3,
            ease: 'power2.out',
          });
          const speed = gsap.utils.clamp(1, 4, 1 + Math.abs(velocity) / 1000);
          if (marqueeTrack1) marqueeTrack1.style.animationDuration = (25 / speed) + 's';
          if (marqueeTrack2) marqueeTrack2.style.animationDuration = (30 / speed) + 's';
        }
      });
    }
  }

  // ========================================
  // CONCEPT — Cinematic Scroll Reveal
  // ========================================
  function initConceptAnimations() {
    if (prefersReducedMotion) return;

    const section = document.getElementById('concept');
    const sticky = document.querySelector('.concept__sticky');
    if (!section || !sticky) return;

    const introContent = document.querySelector('.concept__intro-content');
    const panelsWrap = document.querySelector('.concept__panels');
    const panels = document.querySelectorAll('.concept__panel');
    const summary = document.querySelector('.concept__summary');
    const isMobile = window.innerWidth <= 900;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        pin: sticky,
        scrub: 1,
        pinSpacing: false,
      }
    });

    // ---- Phase 1: Title fade out (0% → 25%) ----
    if (introContent) {
      tl.to(introContent,
        { opacity: 0, y: -60, duration: 0.15, ease: 'power2.in' },
        0.15
      );
    }

    // ---- Phase 2: Panels slide in (25% → 75%) ----
    if (panelsWrap && panels.length) {
      // Show panels container
      tl.to(panelsWrap,
        { opacity: 1, pointerEvents: 'auto', duration: 0.01 },
        0.24
      );

      // Each panel slides in from right (or bottom on mobile)
      panels.forEach((panel, i) => {
        const startPos = 0.25 + (i * 0.15);
        if (isMobile) {
          tl.fromTo(panel,
            { yPercent: 100 },
            { yPercent: 0, duration: 0.14, ease: 'power3.out' },
            startPos
          );
        } else {
          tl.fromTo(panel,
            { xPercent: 100 },
            { xPercent: 0, duration: 0.14, ease: 'power3.out' },
            startPos
          );
        }
      });
    }

    // ---- Phase 3: Summary overlay (75% → 100%) ----
    if (summary) {
      tl.to(summary,
        { opacity: 1, pointerEvents: 'auto', duration: 0.12, ease: 'power2.out' },
        0.78
      );
    }
  }

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
    const flyCount = totalCards - 1; // 4 cards fly away, last card stays

    // Pre-calculate random end rotations so scrub stays deterministic
    const endRotations = Array.from({ length: totalCards }, () =>
      gsap.utils.random(-8, 8)
    );

    // Initial stacked positions: index 0 = top (highest z-index), index 4 = bottom
    // This way Antipasti (01) shows first, Dolci (05) shows last
    cards.forEach((card, i) => {
      const stackOffset = i * 8;
      const stackRotation = i * 1.5;
      gsap.set(card, {
        y: stackOffset,
        rotation: stackRotation,
        zIndex: totalCards - i,
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
        onUpdate: (self) => {
          // Update ghost number and counter based on scroll progress
          // Switches text at ~70% through each card's fly-away phase
          const p = self.progress;
          const step = Math.min(Math.floor(p * flyCount + 0.3), flyCount);
          if (ghostNum) ghostNum.textContent = nums[Math.min(step, totalCards - 1)];
          if (counterCurrent) counterCurrent.textContent = String(step + 1);
        }
      }
    });

    // Animate cards flying away sequentially: card 0 first, card 3 last, card 4 stays
    for (let step = 0; step < flyCount; step++) {
      const cardIndex = step; // 0, 1, 2, 3
      const card = cards[cardIndex];
      const label = `fly${step}`;

      tl.addLabel(label);

      // Card flies away
      tl.to(card, {
        y: -300,
        rotation: endRotations[cardIndex],
        rotateX: 15,
        scale: 0.85,
        opacity: 0,
        duration: 1,
        ease: 'power2.in',
      }, label);

      // Restack remaining cards simultaneously
      for (let j = cardIndex + 1; j < totalCards; j++) {
        const newStackPos = j - cardIndex - 1;
        tl.to(cards[j], {
          y: newStackPos * 8,
          rotation: newStackPos * 1.5,
          duration: 0.5,
          ease: 'power2.out',
        }, label);
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
      const target = document.querySelector('.menu-book__dot[data-page="' + state + '"]');
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

      menuInterior.style.display = 'block';
      gsap.set(menuInterior, { opacity: 0 });

      // Phase 1: Lift cover corner
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

      // Fade in interior
      gsap.to(menuInterior, {
        opacity: 1,
        duration: 0.5,
        delay: 0.7,
        ease: 'power2.out',
      });

      // Show navigation with bounce
      menuNext.style.display = 'flex';
      menuClose.style.display = 'flex';
      gsap.fromTo([menuClose, menuNext],
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 0.5, delay: 1, stagger: 0.1, ease: 'back.out(2.5)' }
      );

      menuOpen.classList.add('is-hidden');
    }

    // --- Show back page (page turn) ---
    function showBackPage() {
      if (currentState !== 'interior') return;
      currentState = 'back';
      updateDots('back');

      menuBack.style.display = 'block';
      gsap.set(menuBack, { opacity: 0, rotateY: 180 });

      // Interior page turns away
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

  // ========================================
  // ========================================
  // STATS — Counters + Review Carousel
  // ========================================
  function initStatsAnimations() {
    if (prefersReducedMotion) return;

    // Counter animation
    ScrollTrigger.create({
      trigger: '.stats__counters',
      start: 'top 80%',
      once: true,
      onEnter: () => animateCounters(),
    });

    // Background text parallax
    const statsBgText = document.querySelector('.stats__bg-text');
    if (statsBgText) {
      gsap.to(statsBgText, {
        x: 80,
        ease: 'none',
        scrollTrigger: {
          trigger: '.stats',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 3,
        }
      });
    }

    // Left column entrance
    gsap.from('.stats__header', {
      opacity: 0, y: 40,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.stats__header', start: 'top 85%', once: true }
    });
    gsap.from('.stats__nav', {
      opacity: 0, y: 20,
      duration: 0.8,
      delay: 0.3,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.stats__header', start: 'top 85%', once: true }
    });

    // Review carousel
    initReviewCarousel();
  }

  function initReviewCarousel() {
    const cards = document.querySelectorAll('.stats__card');
    const prevBtn = document.getElementById('reviewPrev');
    const nextBtn = document.getElementById('reviewNext');
    if (!cards.length) return;

    let current = 0;
    let isAnimating = false;

    // Set first card active
    cards[0].classList.add('is-active');

    function goTo(index, direction) {
      if (isAnimating || index === current) return;
      isAnimating = true;

      const outCard = cards[current];
      const inCard = cards[index];
      const xOut = direction === 'next' ? -40 : 40;
      const xIn = direction === 'next' ? 40 : -40;

      // Fade out current
      gsap.to(outCard, {
        opacity: 0,
        x: xOut,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          outCard.classList.remove('is-active');
          gsap.set(outCard, { x: 0 });
        }
      });

      // Fade in new card
      inCard.classList.add('is-active');
      gsap.fromTo(inCard,
        { opacity: 0, x: xIn },
        {
          opacity: 1, x: 0,
          duration: 0.5,
          delay: 0.15,
          ease: 'power3.out',
          onComplete: () => {
            isAnimating = false;
          }
        }
      );

      current = index;
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const prev = (current - 1 + cards.length) % cards.length;
        goTo(prev, 'prev');
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const next = (current + 1) % cards.length;
        goTo(next, 'next');
      });
    }

    // Auto-advance every 6s
    let autoInterval = setInterval(() => {
      const next = (current + 1) % cards.length;
      goTo(next, 'next');
    }, 6000);

    // Pause auto on hover
    const carousel = document.getElementById('reviewCarousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', () => clearInterval(autoInterval));
      carousel.addEventListener('mouseleave', () => {
        autoInterval = setInterval(() => {
          const next = (current + 1) % cards.length;
          goTo(next, 'next');
        }, 6000);
      });
    }

    // Entrance animation for first card
    gsap.from(cards[0], {
      opacity: 0, y: 50,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.stats__right',
        start: 'top 80%',
        once: true,
      }
    });
  }

  function animateCounters() {
    document.querySelectorAll('.stats__value[data-count]').forEach(el => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const obj = { val: 0 };

      gsap.to(obj, {
        val: target,
        duration: 2.5,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = Math.round(obj.val);
        },
        onComplete: () => {
          gsap.fromTo(el,
            { scale: 1.15 },
            { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' }
          );
        }
      });
    });
  }

  // ========================================
  // INFOS — Card entrance animations
  // ========================================
  function initInfosAnimations() {
    if (prefersReducedMotion) return;

    gsap.from('.infos__card', {
      opacity: 0,
      y: 60,
      scale: 0.92,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.infos__grid',
        start: 'top 80%',
        once: true,
      }
    });

    // Map reveal with scale
    const mapEl = document.querySelector('.infos__map');
    if (mapEl) {
      gsap.from(mapEl, {
        opacity: 0,
        y: 40,
        scale: 0.97,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: mapEl,
          start: 'top 85%',
          once: true,
        }
      });
    }
  }

  // ========================================
  // FOOTER — CTA & deco entrance
  // ========================================
  function initFooterAnimations() {
    if (prefersReducedMotion) return;

    // Decorative elements spin in
    gsap.from('.footer__deco', {
      opacity: 0,
      scale: 0,
      rotation: -180,
      duration: 1,
      stagger: 0.2,
      ease: 'back.out(2)',
      scrollTrigger: {
        trigger: '.footer__cta-section',
        start: 'top 75%',
        once: true,
      }
    });

    // Footer sticker entrance
    const footerSticker = document.querySelector('.sticker--footer');
    if (footerSticker) {
      gsap.from(footerSticker, {
        scale: 0,
        rotation: -180,
        opacity: 0,
        duration: 1,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: '.footer__cta-section',
          start: 'top 70%',
          once: true,
        }
      });
    }

    // Footer CTA button pulse
    const footerBtn = document.querySelector('.footer__btn');
    if (footerBtn) {
      gsap.from(footerBtn, {
        opacity: 0,
        y: 30,
        scale: 0.9,
        duration: 0.8,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: footerBtn,
          start: 'top 90%',
          once: true,
        }
      });
    }
  }

  // ========================================
  // CUSTOM CURSOR — Smooth lerp follow
  // ========================================
  if (window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion) {
    const cursor = document.getElementById('cursor');
    const cursorLabel = cursor.querySelector('.cursor__label');

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    const speed = 0.15;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * speed;
      cursorY += (mouseY - cursorY) * speed;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const interactiveSelectors = 'a, button, [data-magnetic], .buffet__slide, .concept__panel, input, textarea';

    document.querySelectorAll(interactiveSelectors).forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        const label = el.getAttribute('data-cursor-label');
        if (label) cursorLabel.textContent = label;
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorLabel.textContent = '';
      });
    });

    window.addEventListener('mousedown', () => cursor.classList.add('click'));
    window.addEventListener('mouseup', () => cursor.classList.remove('click'));
  }

  // ========================================
  // NAVBAR
  // ========================================
  const navBurger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link, .mobile-menu__cta');

  navbar.style.transition = 'opacity 0.4s';

  navBurger.addEventListener('click', () => {
    navBurger.classList.toggle('active');
    mobileMenu.classList.toggle('active');

    if (mobileMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
      navbar.style.transform = 'translateX(-50%) translateY(0)';

      if (!prefersReducedMotion) {
        gsap.from('.mobile-menu__link, .mobile-menu__socials, .mobile-menu__cta', {
          opacity: 0,
          y: 30,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.2,
        });
      }
    } else {
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    }
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      navBurger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    });
  });

  // ========================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        if (lenis) {
          lenis.scrollTo(target, { offset: -80 });
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
});
