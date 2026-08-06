(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  var progress = document.getElementById('scroll-progress');
  var backToTop = document.getElementById('back-to-top');
  var siteBrand = document.querySelector('.site-brand');
  var themeToggle = document.getElementById('theme-toggle');
  var navToggle = document.getElementById('nav-toggle');
  var menu = document.getElementById('site-menu');
  var masthead = document.getElementById('masthead');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ticking = false;

  function syncLayoutMetrics() {
    if (!masthead) return;
    root.style.setProperty('--masthead-height', masthead.getBoundingClientRect().height + 'px');
  }

  function updateScrollUI() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var percent = scrollable > 0 ? Math.min((scrollTop / scrollable) * 100, 100) : 0;

    if (progress) progress.style.transform = 'scaleX(' + percent / 100 + ')';
    if (backToTop) backToTop.classList.toggle('is-visible', scrollTop > 520);
    if (masthead) masthead.classList.toggle('is-scrolled', scrollTop > 12);
    ticking = false;
  }

  function requestScrollUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollUI);
      ticking = true;
    }
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
    var themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#0b1020' : '#f5f7fb');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      var applyTheme = function () {
        setTheme(nextTheme);
        try { localStorage.setItem('site-theme', nextTheme); } catch (error) {}
      };

      if (!reduceMotion && document.startViewTransition) {
        document.startViewTransition(applyTheme);
      } else if (!reduceMotion) {
        root.classList.add('theme-transitioning');
        window.requestAnimationFrame(function () {
          applyTheme();
          window.setTimeout(function () {
            root.classList.remove('theme-transitioning');
          }, 520);
        });
      } else {
        applyTheme();
      }
    });
  }

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  if (siteBrand) {
    siteBrand.addEventListener('click', function (event) {
      var destination = new URL(siteBrand.href, window.location.href);
      var isCurrentPage = destination.origin === window.location.origin &&
        destination.pathname === window.location.pathname;

      if (!isCurrentPage || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      event.preventDefault();
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  function closeMenu() {
    if (!menu || !navToggle) return;
    menu.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
    body.classList.remove('menu-open');
  }

  if (navToggle && menu) {
    navToggle.addEventListener('click', function () {
      var willOpen = !menu.classList.contains('is-open');
      menu.classList.toggle('is-open', willOpen);
      navToggle.classList.toggle('is-open', willOpen);
      navToggle.setAttribute('aria-expanded', String(willOpen));
      navToggle.setAttribute('aria-label', willOpen ? 'Close navigation menu' : 'Open navigation menu');
      body.classList.toggle('menu-open', willOpen);
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (event) {
      if (menu.classList.contains('is-open') && !event.target.closest('.site-navigation')) closeMenu();
    });
  }

  var sections = document.querySelectorAll('.reveal-section');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    sections.forEach(function (section) { section.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -9% 0px', threshold: 0.08 });
    sections.forEach(function (section) { revealObserver.observe(section); });
  }

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-menu a[href^="#"]'));
  var observedSections = navLinks.map(function (link) {
    return document.querySelector(link.getAttribute('href'));
  }).filter(Boolean);

  if ('IntersectionObserver' in window && observedSections.length) {
    var activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-22% 0px -68% 0px', threshold: 0 });
    observedSections.forEach(function (section) { activeObserver.observe(section); });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 820) closeMenu();
    syncLayoutMetrics();
    requestScrollUpdate();
  });

  syncLayoutMetrics();
  if ('ResizeObserver' in window && masthead) {
    new ResizeObserver(syncLayoutMetrics).observe(masthead);
  }
  setTheme(root.getAttribute('data-theme') || 'light');
  updateScrollUI();
}());
