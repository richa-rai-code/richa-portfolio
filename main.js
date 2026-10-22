/* ═══════════════════════════════════════════════════════════
   RICHA RAI — PORTFOLIO  |  main.js
   Handles:
     - Footer copyright year
     - Sticky nav scroll styling
     - Mobile menu drawer & keyboard accessibility
     - Active nav link highlighting
     - Progressive-enhancement scroll reveal
     - Smooth scrolling for internal anchor links
     - Placeholder link guard
     - Hero visual subtle parallax on mouse move
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
