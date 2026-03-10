/* ============================================
   CIAO SETTEBELLO — V4 "Award-Worthy"
   Cinematic Animations & Interactions
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
  // PAGE LOADER — Cinematic entrance
  // ========================================
  const loader = document.getElementById('loader');

  if (prefersReducedMotion) {
    // Skip loader entirely
    if (loader) loader.style.display = 'none';
    document.querySelectorAll('.hero__script, .hero__title, .hero__subtitle, .hero__illustration, .hero__cta').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    if (lenis) lenis.start();
  } else {
    const loaderTL = gsap.timeline({
      onComplete: () => {
        // Fade out loader with clipPath
        gsap.to(loader, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.8,
          ease: 'power4.inOut',
          onComplete: () => {
            loader.style.display = 'none';
            if (lenis) lenis.start();
            startHeroAnimation();
          }
        });
      }
    });

    // Logo icon fade in
    loaderTL.to('.loader__icon', {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
    });

    // Letters stagger up with bounce
    loaderTL.to('.loader__letter', {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: 'back.out(2)',
    }, '-=0.2');

    // Progress bar
    loaderTL.to('.loader__progress', {
      width: '100%',
      duration: 1.2,
      ease: 'power2.inOut',
    }, '-=0.3');

    // Hold briefly
    loaderTL.to({}, { duration: 0.3 });
  }

  // ========================================
  // HERO ANIMATIONS — After loader
  // ========================================
  function startHeroAnimation() {
    // SplitType on hero title spans for letter-by-letter reveal
    const heroTitleFill = document.querySelector('.hero__title-fill');
    const heroTitleOutline = document.querySelector('.hero__title-outline');
    const heroTitle = document.querySelector('.hero__title');

    let fillSplit, outlineSplit;

    if (typeof SplitType !== 'undefined') {
      if (heroTitleFill) {
        fillSplit = new SplitType(heroTitleFill, { types: 'chars' });
        gsap.set(fillSplit.chars, { opacity: 0, y: 100, rotationX: -90 });
      }
      if (heroTitleOutline) {
        outlineSplit = new SplitType(heroTitleOutline, { types: 'chars' });
        gsap.set(outlineSplit.chars, { opacity: 0, y: 100, rotationX: -90 });
      }
    }

    // Make parent visible (CSS starts at opacity:0)
    if (heroTitle) {
      gsap.set(heroTitle, { opacity: 1, y: 0 });
    }

    const heroTL = gsap.timeline();

    // Script "Ciao" swoops in with rotation
    heroTL.to('.hero__script', {
      opacity: 1,
      y: 0,
      rotation: 0,
      duration: 0.9,
      ease: 'power3.out',
    });

    // SETTE letters cascade in with 3D rotation
    if (fillSplit && fillSplit.chars) {
      heroTL.to(fillSplit.chars, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'back.out(1.5)',
      }, '-=0.4');
    }

    // BELLO letters cascade in (outlined) — slightly delayed
    if (outlineSplit && outlineSplit.chars) {
      heroTL.to(outlineSplit.chars, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'back.out(1.5)',
      }, '-=0.5');
    }

    // Subtitle fades up
    heroTL.to('.hero__subtitle', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.3');

    // Illustration scales in with elastic bounce
    heroTL.to('.hero__illustration', {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1.2,
      ease: 'elastic.out(1, 0.6)',
    }, '-=0.5');

    // CTA button slides up
    heroTL.to('.hero__cta', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.6');

    // Decorative elements fade in
    heroTL.to('.hero__deco', {
      opacity: 0.15,
      duration: 1.2,
      stagger: 0.15,
    }, '-=0.8');

    // Sticker spins in from nowhere
    heroTL.from('.sticker--hero', {
      scale: 0,
      rotation: -180,
      opacity: 0,
      duration: 1,
      ease: 'back.out(2)',
    }, '-=0.6');
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

    // Lerp animation loop
    function animateCursor() {
      cursorX += (mouseX - cursorX) * speed;
      cursorY += (mouseY - cursorY) * speed;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover state on interactive elements
    const interactiveSelectors = 'a, button, [data-magnetic], .buffet__card, .galerie__item, input, textarea';

    document.querySelectorAll(interactiveSelectors).forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        const label = el.getAttribute('data-cursor-label');
        if (label) {
          cursorLabel.textContent = label;
        }
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorLabel.textContent = '';
      });
    });

    // Galerie items get "Voir" label
    document.querySelectorAll('.galerie__item').forEach(el => {
      el.setAttribute('data-cursor-label', 'Voir');
    });

    // Click feedback
    window.addEventListener('mousedown', () => cursor.classList.add('click'));
    window.addEventListener('mouseup', () => cursor.classList.remove('click'));
  }

  // ========================================
  // SPLITTYPE — Word-by-word reveal on scroll
  // ========================================
  if (!prefersReducedMotion && typeof SplitType !== 'undefined') {
    document.querySelectorAll('[data-split-words]').forEach(el => {
      // Don't re-split hero title elements (already handled)
      if (el.closest('.hero')) return;

      const split = new SplitType(el, { types: 'words' });
      gsap.set(split.words, { opacity: 0, y: 60 });

      gsap.to(split.words, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.06,
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
  // DATA-REVEAL — Fade-in + slide-up on scroll
  // ========================================
  if (!prefersReducedMotion) {
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
  // DATA-TILT — 3D tilt effect on hover
  // ========================================
  if (window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion) {
    document.querySelectorAll('[data-tilt]').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        gsap.to(el, {
          rotateX: rotateX,
          rotateY: rotateY,
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
  // DATA-PARALLAX-IMG — Image parallax inside containers
  // ========================================
  if (!prefersReducedMotion) {
    document.querySelectorAll('[data-parallax-img]').forEach(el => {
      const img = el.querySelector('img');
      if (!img) return;

      gsap.set(img, { scale: 1.15 });

      gsap.to(img, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        }
      });
    });
  }

  // ========================================
  // MAGNETIC HOVER — All [data-magnetic] elements
  // ========================================
  if (window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion) {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const strength = 4;
        gsap.to(el, {
          x: x / strength,
          y: y / strength,
          duration: 0.4,
          ease: 'power2.out',
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)',
        });
      });
    });
  }

  // ========================================
  // HERO PARALLAX — Scale down + fade on scroll
  // ========================================
  if (!prefersReducedMotion) {
    gsap.to('.hero__content', {
      scale: 0.85,
      opacity: 0.3,
      y: -80,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      }
    });

    // Decorative elements parallax
    gsap.to('.hero__deco--1', {
      y: -120,
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2 }
    });
    gsap.to('.hero__deco--3', {
      y: -180,
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
    });

    // Sticker parallax
    gsap.to('.sticker--hero', {
      y: -100,
      rotation: 90,
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2 }
    });
  }

  // ========================================
  // MARQUEE — Scroll velocity + skew
  // ========================================
  if (!prefersReducedMotion) {
    // Velocity-based speed for marquee row 1
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

          // Speed up based on scroll speed
          const speed = gsap.utils.clamp(1, 4, 1 + Math.abs(velocity) / 1000);
          if (marqueeTrack1) marqueeTrack1.style.animationDuration = (25 / speed) + 's';
          if (marqueeTrack2) marqueeTrack2.style.animationDuration = (30 / speed) + 's';
        }
      });
    }
  }

  // ========================================
  // CONCEPT — Sticker entrance
  // ========================================
  if (!prefersReducedMotion) {
    const conceptSticker = document.querySelector('.sticker--concept');
    if (conceptSticker) {
      gsap.from(conceptSticker, {
        scale: 0,
        rotation: -180,
        opacity: 0,
        duration: 1,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: '.concept__visual-wrap',
          start: 'top 70%',
          once: true,
        }
      });
    }
  }

  // ========================================
  // BUFFET — Stagger cards with rotation + BG text parallax
  // ========================================
  if (!prefersReducedMotion) {
    gsap.from('.buffet__card', {
      opacity: 0,
      y: 80,
      scale: 0.85,
      rotation: () => gsap.utils.random(-5, 5),
      duration: 0.9,
      stagger: 0.1,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: '.buffet__grid',
        start: 'top 80%',
        once: true,
      }
    });

    // Background watermark text parallax
    const buffetBgText = document.querySelector('.buffet__bg-text');
    if (buffetBgText) {
      gsap.to(buffetBgText, {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: '.buffet',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 3,
        }
      });
    }

    // Buffet card images subtle float
    document.querySelectorAll('.buffet__card-img img').forEach(img => {
      gsap.to(img, {
        y: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 3,
        }
      });
    });
  }

  // ========================================
  // GALERIE — Horizontal Scroll (GSAP pin)
  // ========================================
  if (!prefersReducedMotion) {
    const galerieTrack = document.getElementById('galerieTrack');
    const galerieWrap = document.querySelector('.galerie__track-wrap');

    if (galerieTrack && galerieWrap) {
      // Calculate how far to scroll horizontally
      const getScrollAmount = () => {
        return -(galerieTrack.scrollWidth - window.innerWidth + 40);
      };

      gsap.to(galerieTrack, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: '.galerie',
          start: 'top top',
          end: () => `+=${Math.abs(getScrollAmount())}`,
          pin: true,
          scrub: 1.5,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        }
      });

      // Gallery items entrance — stagger reveal as they scroll in
      document.querySelectorAll('.galerie__item').forEach((item, i) => {
        gsap.from(item, {
          opacity: 0,
          scale: 0.9,
          y: 40,
          rotation: gsap.utils.random(-3, 3),
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            containerAnimation: gsap.getById && gsap.getById('galerieScroll') || undefined,
            start: 'left 90%',
            once: true,
          },
          delay: i * 0.1,
        });
      });
    }
  }

  // ========================================
  // STATS — Counter animation with overshoot
  // ========================================
  if (!prefersReducedMotion) {
    ScrollTrigger.create({
      trigger: '.stats__numbers',
      start: 'top 80%',
      once: true,
      onEnter: () => animateCounters(),
    });

    // Stats watermark parallax
    const statsWatermark = document.querySelector('.stats__watermark');
    if (statsWatermark) {
      gsap.to(statsWatermark, {
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: '.stats',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 3,
        }
      });
    }
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
          // Overshoot bounce effect
          gsap.fromTo(el,
            { scale: 1.2 },
            { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' }
          );
        }
      });
    });
  }

  // ========================================
  // STATS — Divider & reviews entrance
  // ========================================
  if (!prefersReducedMotion) {
    // Stats divider reveal
    gsap.from('.stats__divider', {
      scaleX: 0,
      duration: 1,
      ease: 'power3.inOut',
      scrollTrigger: {
        trigger: '.stats__divider',
        start: 'top 85%',
        once: true,
      }
    });

    // Reviews slide in from sides
    const reviews = document.querySelectorAll('.stats__review');
    reviews.forEach((review, i) => {
      gsap.from(review, {
        opacity: 0,
        x: i % 2 === 0 ? -80 : 80,
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

  // ========================================
  // INFOS — Cards entrance with stagger
  // ========================================
  if (!prefersReducedMotion) {
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

    // Map reveal
    gsap.from('.infos__map', {
      opacity: 0,
      y: 40,
      scale: 0.98,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.infos__map',
        start: 'top 85%',
        once: true,
      }
    });
  }

  // ========================================
  // FOOTER — CTA & sticker entrance
  // ========================================
  if (!prefersReducedMotion) {
    gsap.from('.footer__deco', {
      opacity: 0,
      scale: 0,
      rotation: -180,
      duration: 1,
      stagger: 0.2,
      ease: 'back.out(2)',
      scrollTrigger: {
        trigger: '.footer__cta',
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
          trigger: '.footer__cta',
          start: 'top 70%',
          once: true,
        }
      });
    }
  }

  // ========================================
  // STICKER SCROLL PARALLAX — data-speed
  // ========================================
  if (!prefersReducedMotion) {
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
  // NAVBAR
  // ========================================
  const navbar = document.getElementById('navbar');
  const navBurger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link, .mobile-menu__cta');

  // Scroll state
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    navbar.classList.toggle('scrolled', currentScroll > 50);

    // Auto-hide nav on scroll down, show on scroll up
    if (currentScroll > 300) {
      if (currentScroll > lastScroll && !mobileMenu.classList.contains('active')) {
        navbar.style.transform = 'translateY(-100%)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    lastScroll = currentScroll;
  }, { passive: true });

  navbar.style.transition = 'background 0.4s, box-shadow 0.4s, transform 0.4s';

  // Burger toggle
  navBurger.addEventListener('click', () => {
    navBurger.classList.toggle('active');
    mobileMenu.classList.toggle('active');

    if (mobileMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
      navbar.style.transform = 'translateY(0)';

      // Animate mobile links in
      if (!prefersReducedMotion) {
        gsap.from('.mobile-menu__link, .mobile-menu__cta', {
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

  // ========================================
  // REDUCED MOTION FALLBACK — Show all content
  // ========================================
  if (prefersReducedMotion) {
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.clipPath = 'none';
    });
  }
});
