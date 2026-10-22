/* ═══════════════════════════════════════════════════════════
   RICHA RAI — PORTFOLIO  |  assets/js/main.js
   Handles:
     - Footer copyright year
     - Sticky nav scroll styling
     - Mobile menu drawer & keyboard accessibility
     - Active nav link highlighting
     - Progressive-enhancement scroll reveal
     - Smooth scrolling for internal anchor links
     - Placeholder link guard
   ═══════════════════════════════════════════════════════════ */

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
  onScroll(); // Run once immediately on load


  /* ─── 3. MOBILE MENU DRAWER ──────────────────────────────── */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
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
    const scrollY = window.scrollY + 120; // offset for fixed header

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


  /* ─── 5. PROGRESSIVE-ENHANCEMENT REVEAL ANIMATIONS ───────── */
  /*
   * Content is visible by default in CSS.
   * Only elements well below the initial viewport fold are given
   * .js-reveal-pending so they smoothly enter on scroll.
   * Elements above the fold or in reduced-motion mode are NEVER touched.
   */
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
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px'
      }
    );

    const windowHeight = window.innerHeight;

    revealEls.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      // Only animate elements that start below the initial screen
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
      const href = this.getAttribute('href') || '';
      const hashIdx = href.lastIndexOf('#');
      if (hashIdx === -1) return;

      const targetId = href.slice(hashIdx + 1);
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      const navOffset = 70;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      if (history.pushState) {
        history.pushState(null, '', '#' + targetId);
      }
    });
  });


  /* ─── 7. PLACEHOLDER LINK GUARD ──────────────────────────── */
  document.querySelectorAll('[data-placeholder="true"]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      const href = el.getAttribute('href');
      if (href === '#' || !href) {
        e.preventDefault();
        const originalOpacity = el.style.opacity;
        el.style.opacity = '0.35';
        setTimeout(function () {
          el.style.opacity = originalOpacity || '';
        }, 280);
      }
    });
  });

})();
