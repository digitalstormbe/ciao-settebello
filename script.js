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

  // Build frame paths: first.png -> frame_0002.png -> frame_0003-0072.webp -> last.png
  framePaths.push('assets/frames/first.png');
  framePaths.push('assets/frames/frame_0002.png');
  for (let i = 3; i <= 72; i++) {
    framePaths.push('assets/frames/frame_' + String(i).padStart(4, '0') + '.webp');
  }
  framePaths.push('assets/frames/last.png');

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

    // Show navbar as soon as user starts scrolling
    ScrollTrigger.create({
      trigger: scrollAnimSection,
      start: 'top top-=5%',
      once: true,
      onEnter: () => {
        if (navbar) {
          gsap.to(navbar, { opacity: 1, duration: 0.6, ease: 'power2.out' });
          navbar.style.pointerEvents = '';
        }
      }
    });

    // ---- Hero text reveal synced with scroll ----
    const heroLine1 = document.getElementById('heroLine1');
    const heroLine2 = document.getElementById('heroLine2');
    const heroSep = document.getElementById('heroSep');
    const heroTagline = document.getElementById('heroTagline');
    const heroDesc = document.getElementById('heroDesc');
    const heroActions = document.getElementById('heroActions');

    const heroTL = gsap.timeline({
      scrollTrigger: {
        trigger: scrollAnimSection,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      }
    });

    if (heroLine1) {
      heroTL.fromTo(heroLine1,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.06, ease: 'power2.out' },
        0.02
      );
    }
    if (heroLine2) {
      heroTL.fromTo(heroLine2,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.06, ease: 'power2.out' },
        0.08
      );
    }
    if (heroSep) {
      heroTL.fromTo(heroSep,
        { opacity: 0, scaleX: 0 },
        { opacity: 1, scaleX: 1, duration: 0.05, ease: 'power2.out' },
        0.14
      );
    }
    if (heroTagline) {
      heroTL.fromTo(heroTagline,
        { opacity: 0, y: 30 },
        { opacity: 0.9, y: 0, duration: 0.08, ease: 'power2.out' },
        0.20
      );
    }
    if (heroDesc) {
      heroTL.fromTo(heroDesc,
        { opacity: 0, y: 20 },
        { opacity: 0.65, y: 0, duration: 0.08, ease: 'power2.out' },
        0.30
      );
    }
    if (heroActions) {
      heroTL.fromTo(heroActions,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' },
        0.38
      );
    }

    // Fade out at the end (90-98%)
    heroTL.to('#heroText', {
      opacity: 0,
      y: -40,
      duration: 0.08,
      ease: 'power2.in',
    }, 0.90);
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
    initGalerieAnimations();
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
  // CONCEPT — Sticker + pillar animations
  // ========================================
  function initConceptAnimations() {
    if (prefersReducedMotion) return;

    // Sticker entrance
    const conceptSticker = document.querySelector('.sticker--concept');
    if (conceptSticker) {
      gsap.from(conceptSticker, {
        scale: 0,
        rotation: -180,
        opacity: 0,
        duration: 1,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: '.concept__img-wrap',
          start: 'top 70%',
          once: true,
        }
      });
    }

    // Pillars staggered entrance
    gsap.from('.concept__pillar', {
      opacity: 0,
      y: 60,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.concept__pillars',
        start: 'top 82%',
        once: true,
      }
    });
  }

  // ========================================
  // BUFFET — Horizontal Scroll with GSAP pin
  // ========================================
  function initBuffetHorizontalScroll() {
    if (prefersReducedMotion) return;

    const buffetCarousel = document.getElementById('buffetCarousel');
    const buffetSection = document.getElementById('buffet');

    if (!buffetCarousel || !buffetSection) return;

    const getScrollAmount = () => {
      return -(buffetCarousel.scrollWidth - window.innerWidth + 40);
    };

    gsap.to(buffetCarousel, {
      x: getScrollAmount,
      ease: 'none',
      scrollTrigger: {
        trigger: buffetSection,
        start: 'top top',
        end: () => `+=${Math.abs(getScrollAmount())}`,
        pin: true,
        scrub: 1.5,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      }
    });

    // Background text parallax
    const buffetBgText = document.querySelector('.buffet__bg-text');
    if (buffetBgText) {
      gsap.to(buffetBgText, {
        x: -120,
        ease: 'none',
        scrollTrigger: {
          trigger: buffetSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 3,
        }
      });
    }

    // Slide entrance animation
    document.querySelectorAll('.buffet__slide').forEach((slide, i) => {
      gsap.from(slide, {
        opacity: 0,
        y: 60,
        scale: 0.92,
        rotation: gsap.utils.random(-3, 3),
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: slide,
          start: 'top 95%',
          once: true,
        },
        delay: i * 0.08,
      });
    });
  }

  // ========================================
  // GALERIE — Staggered grid animations
  // ========================================
  function initGalerieAnimations() {
    if (prefersReducedMotion) return;

    // Each column gets a stagger delay
    document.querySelectorAll('.galerie__col').forEach((col, colIdx) => {
      const items = col.querySelectorAll('.galerie__item');
      items.forEach((item, i) => {
        // Parallax on images
        const img = item.querySelector('img');
        if (img) {
          gsap.set(img, { scale: 1.1 });
          gsap.to(img, {
            y: -30,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 2,
            }
          });
        }
      });
    });
  }

  // ========================================
  // STATS — Counters + reviews
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

    // Divider reveal
    const divider = document.querySelector('.stats__divider');
    if (divider) {
      gsap.from(divider, {
        scaleX: 0,
        duration: 1.2,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: divider,
          start: 'top 85%',
          once: true,
        }
      });
    }

    // Reviews slide in
    document.querySelectorAll('.stats__review').forEach((review, i) => {
      gsap.from(review, {
        opacity: 0,
        x: i % 2 === 0 ? -60 : 60,
        y: 20,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: review,
          start: 'top 88%',
          once: true,
        }
      });
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

    const interactiveSelectors = 'a, button, [data-magnetic], .buffet__slide, .galerie__item, .concept__pillar, .concept__tag, input, textarea';

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

    // Gallery items get "Voir" label
    document.querySelectorAll('.galerie__item').forEach(el => {
      el.setAttribute('data-cursor-label', 'Voir');
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
