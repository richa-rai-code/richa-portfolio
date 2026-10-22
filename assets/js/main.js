/* ═══════════════════════════════════════════════════════════
   RICHA RAI — PORTFOLIO  |  main.js
   Handles:
     - Cinematic preloader (session-gated, two-phase exit)
     - Footer copyright year
     - Sticky nav scroll styling
     - Mobile menu drawer & keyboard accessibility
     - Active nav link highlighting
     - Progressive-enhancement scroll reveal
     - Smooth scrolling for internal anchor links
     - Placeholder link guard
     - Hero visual subtle parallax on mouse move
   ═══════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════
   MODULE 0 — ULTRA-PREMIUM CINEMATIC PRELOADER
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var htmlEl    = document.documentElement;
  var preloader = document.getElementById('preloader');
  var fill      = document.getElementById('pl-progress');
  var label     = document.getElementById('pl-label');
  var statusEl  = document.getElementById('pl-status');

  /* Only run if the session gate is active */
  if (!preloader || htmlEl.getAttribute('data-preloader') !== 'active') {
    return;
  }

  /* Mark session so ordinary back/forward and navigation don't replay the preloader */
  try { sessionStorage.setItem('rrPlShown', '1'); } catch (e) { /* noop */ }

  /* ── Progress simulation ─────────────────────────────────
     Eases smoothly from 0 → ~88% over ~2s using an exponential
     decay curve, then jumps to 100% on window load or safety net.
  ────────────────────────────────────────────────────────── */
  var progress    = 0;
  var rafId       = null;
  var startTime   = performance.now();
  var loadFired   = false;
  var CRAWL_DURATION = 2200;

  function setProgress(pct) {
    progress = Math.max(progress, Math.min(pct, 100));
    if (fill)  fill.style.width = progress + '%';
    if (label) label.textContent = Math.round(progress) + '%';
    if (statusEl) {
      if (progress < 40) {
        statusEl.textContent = 'INITIALIZING';
      } else if (progress < 85) {
        statusEl.textContent = 'LOADING EXPERIENCE';
      } else {
        statusEl.textContent = 'READY';
      }
    }
  }

  function tick(now) {
    if (loadFired) return;
    var elapsed = now - startTime;
    /* Ease-out curve: swift beginning, smoothly settling towards 88% */
    var eased = 88 * (1 - Math.exp(-elapsed / 700));
    setProgress(eased);
    if (elapsed < CRAWL_DURATION) {
      rafId = requestAnimationFrame(tick);
    }
  }

  rafId = requestAnimationFrame(tick);

  /* ── Exit sequence ───────────────────────────────────────
     Phase 1: fade inner content & glint (0.52s)
     Phase 2: curtain rises, hero emerges (0.92s)
     Phase 3: remove from paint tree (display:none)
     Restores body scroll before slide to eliminate CLS.
  ────────────────────────────────────────────────────────── */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var exiting = false;

  function exitPreloader() {
    if (exiting) return;
    exiting = true;

    /* Stop simulation loop */
    if (rafId) cancelAnimationFrame(rafId);
    loadFired = true;

    /* Complete progress to 100% */
    setProgress(100);

    /* Brief pause at 100% for psychological closure */
    setTimeout(function () {
      /* Phase 1 — dissolve inner content */
      preloader.classList.add('pl--fade');

      var FADE_DUR = prefersReduced ? 400 : 520;

      setTimeout(function () {
        /* Restore body scroll BEFORE the curtain moves */
        document.body.style.overflow = '';

        if (!prefersReduced) {
          /* Add homepage revelation class so hero breathes into focus */
          htmlEl.classList.add('is-revealing');

          /* Phase 2 — slide silk curtain up */
          preloader.classList.add('pl--exit');

          setTimeout(function () {
            /* Phase 3 — remove from paint tree and finalize */
            htmlEl.removeAttribute('data-preloader');
            htmlEl.classList.remove('is-revealing');
            preloader.classList.add('pl--done');
            preloader.setAttribute('aria-hidden', 'true');
          }, 950);

        } else {
          /* Reduced motion: just fade out smoothly */
          htmlEl.removeAttribute('data-preloader');
          preloader.classList.add('pl--done');
          preloader.setAttribute('aria-hidden', 'true');
        }

      }, FADE_DUR);

    }, prefersReduced ? 80 : 180);
  }

  /* ── Trigger on window load ──────────────────────────────── */
  if (document.readyState === 'complete') {
    /* Page already loaded (cached) — short display */
    setTimeout(exitPreloader, 1000);
  } else {
    window.addEventListener('load', function () {
      /* Ensure minimum display of 1.5s for the animation to be enjoyed */
      var elapsed    = performance.now() - startTime;
      var minDisplay = 1500;
      var delay      = Math.max(0, minDisplay - elapsed);
      setTimeout(exitPreloader, delay);
    }, { once: true });
  }

  /* ── Safety net — guaranteed to never stall beyond 4.5s ─── */
  setTimeout(function () {
    if (!exiting) exitPreloader();
  }, 4500);

})();



(function () {
  'use strict';

  /* ─── 1. FOOTER DYNAMIC YEAR ────────────────────────────── */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  /* ─── 2. STICKY NAV SCROLL EFFECT ────────────────────────── */
  const navWrapper = document.getElementById('nav');

  function onScroll() {
    if (!navWrapper) return;
    if (window.scrollY > 20) {
      navWrapper.classList.add('scrolled');
    } else {
      navWrapper.classList.remove('scrolled');
    }
    updateActiveLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ─── 3. MOBILE MENU DRAWER ──────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

  function openMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = this.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        hamburger.focus();
      }
    });
  }


  /* ─── 4. ACTIVE NAV LINK HIGHLIGHTING ────────────────────── */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    let current = '';
    const scrollY = window.scrollY + 120;

    sections.forEach(function (section) {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        current = section.id;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      const href    = link.getAttribute('href') || '';
      const hashIdx = href.lastIndexOf('#');
      const hash    = hashIdx !== -1 ? href.slice(hashIdx + 1) : '';
      if (hash && hash === current) {
        link.classList.add('active');
      }
    });
  }


  /* ─── 5. SCROLL REVEAL ANIMATIONS ─────────────────────────── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !prefersReducedMotion && revealEls.length > 0) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.remove('js-reveal-pending');
            entry.target.classList.add('js-revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.07,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    const windowHeight = window.innerHeight;

    revealEls.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top > windowHeight - 40) {
        el.classList.add('js-reveal-pending');
        revealObserver.observe(el);
      } else {
        el.classList.add('js-revealed');
      }
    });
  }


  /* ─── 6. SMOOTH SCROLLING ────────────────────────────────── */
  document.querySelectorAll('a[href*="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href    = this.getAttribute('href') || '';
      const hashIdx = href.lastIndexOf('#');
      if (hashIdx === -1) return;

      const targetId = href.slice(hashIdx + 1);
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      const navOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition  = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

      if (history.pushState) {
        history.pushState(null, '', '#' + targetId);
      }
    });
  });


  /* ─── 7. PLACEHOLDER LINK GUARD ──────────────────────────── */
  document.querySelectorAll('[data-placeholder="true"]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      const href = el.getAttribute('href');
      if (href === '#' || !href || href.startsWith('mailto:your.')) {
        e.preventDefault();
        el.style.opacity = '0.3';
        setTimeout(function () { el.style.opacity = ''; }, 320);
      }
    });
  });


  /* ─── 8. HERO PROFILE PANEL — SUBTLE MOUSE PARALLAX ──────── */
  if (!prefersReducedMotion) {
    const profileFrame = document.querySelector('.profile-frame');
    const hero         = document.querySelector('.hero');

    if (profileFrame && hero) {
      let ticking = false;

      hero.addEventListener('mousemove', function (e) {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          const rect  = hero.getBoundingClientRect();
          const cx    = rect.left + rect.width  / 2;
          const cy    = rect.top  + rect.height / 2;
          const dx    = (e.clientX - cx) / rect.width;
          const dy    = (e.clientY - cy) / rect.height;
          const rotX  = (-dy * 5).toFixed(2);
          const rotY  = ( dx * 5).toFixed(2);
          profileFrame.style.transform =
            'perspective(800px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
          ticking = false;
        });
      });

      hero.addEventListener('mouseleave', function () {
        profileFrame.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1), border-color 0.32s, box-shadow 0.32s';
        profileFrame.style.transform  = 'perspective(800px) rotateX(0) rotateY(0)';
        setTimeout(function () {
          profileFrame.style.transition = '';
        }, 620);
      });
    }
  }

})();
