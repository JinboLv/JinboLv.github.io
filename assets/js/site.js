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
  var themeTransitionRunning = false;
  var scrollAnimationFrame = 0;
  var ticking = false;

  function cancelAnimatedScroll() {
    if (scrollAnimationFrame) window.cancelAnimationFrame(scrollAnimationFrame);
    scrollAnimationFrame = 0;
  }

  function scrollToPosition(top, onComplete) {
    cancelAnimatedScroll();
    var start = window.scrollY || root.scrollTop;
    var maximum = Math.max(0, root.scrollHeight - window.innerHeight);
    var destination = Math.max(0, Math.min(top, maximum));
    var distance = destination - start;

    // Navigation animation is explicitly requested by the user's click.
    if (Math.abs(distance) < 1) {
      window.scrollTo({ top: destination, behavior: 'instant' });
      if (onComplete) onComplete();
      return;
    }

    var duration = Math.min(900, Math.max(400, Math.abs(distance) * 0.45));
    var startTime = null;
    function step(time) {
      if (startTime === null) startTime = time;
      var progress = Math.min((time - startTime) / duration, 1);
      var eased = progress < 0.5 ? 4 * progress * progress * progress :
        1 - Math.pow(-2 * progress + 2, 3) / 2;
      window.scrollTo({ top: start + distance * eased, behavior: 'instant' });
      if (progress < 1) {
        scrollAnimationFrame = window.requestAnimationFrame(step);
      } else {
        scrollAnimationFrame = 0;
        if (onComplete) onComplete();
      }
    }
    scrollAnimationFrame = window.requestAnimationFrame(step);
  }

  function sectionScrollPosition(section) {
    // Layout offsets remain stable while section reveal transforms animate.
    var top = 0;
    for (var element = section; element; element = element.offsetParent) {
      top += element.offsetTop;
    }
    var padding = parseFloat(window.getComputedStyle(root).scrollPaddingTop) || 0;
    var headerOffset = masthead ? masthead.getBoundingClientRect().height + 16 : 0;
    return top - Math.max(padding, headerOffset);
  }

  function focusSection(section) {
    if (!section.hasAttribute('tabindex')) {
      section.setAttribute('tabindex', '-1');
      section.addEventListener('blur', function () {
        section.removeAttribute('tabindex');
      }, { once: true });
    }
    section.focus({ preventScroll: true });
  }

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

  function finishThemeTransition() {
    root.classList.remove('theme-snapshot', 'theme-transitioning');
    themeTransitionRunning = false;
  }

  function animateThemeChange(applyTheme) {
    if (reduceMotion) {
      applyTheme();
      return;
    }

    themeTransitionRunning = true;
    if (document.startViewTransition) {
      // Capture complete themes; element color transitions would blur the endpoints.
      root.classList.add('theme-snapshot');
      try {
        var transition = document.startViewTransition(applyTheme);
        transition.finished.then(finishThemeTransition, finishThemeTransition);
        return;
      } catch (error) {
        root.classList.remove('theme-snapshot');
      }
    }

    root.classList.add('theme-transitioning');
    // Let the browser apply transition properties before changing the colors.
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        applyTheme();
        window.setTimeout(finishThemeTransition, 700);
      });
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      if (themeTransitionRunning) return;
      var nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      var applyTheme = function () {
        setTheme(nextTheme);
        try { localStorage.setItem('site-theme', nextTheme); } catch (error) {}
      };

      animateThemeChange(applyTheme);
    });
  }

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      scrollToPosition(0);
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
      scrollToPosition(0);
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
      link.addEventListener('click', function (event) {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
            event.ctrlKey || event.shiftKey || event.altKey ||
            link.target === '_blank' || link.hasAttribute('download')) return;

        var href = link.getAttribute('href');
        var section = href && href.charAt(0) === '#' ?
          document.getElementById(href.slice(1)) : null;
        closeMenu();
        if (!section) return;

        event.preventDefault();
        if (window.location.hash !== href) window.history.pushState(null, '', href);
        scrollToPosition(sectionScrollPosition(section), event.detail === 0 ? function () {
          if (document.activeElement === link) focusSection(section);
        } : null);
      });
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
  window.addEventListener('wheel', cancelAnimatedScroll, { passive: true });
  window.addEventListener('touchstart', cancelAnimatedScroll, { passive: true });
  window.addEventListener('pointerdown', cancelAnimatedScroll, { passive: true });
  document.addEventListener('keydown', function (event) {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].indexOf(event.key) !== -1) {
      cancelAnimatedScroll();
    }
  });
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
