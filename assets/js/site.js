(function () {
  'use strict';

  var root = document.documentElement;
  var toggle = document.getElementById('nav-toggle');
  var menu = document.getElementById('site-menu');
  var mobile = window.matchMedia('(max-width: 900px)');
  var scrollFrame = 0;

  function cancelAnimatedScroll() {
    if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;
  }

  function focusSection(target) {
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
      target.addEventListener('blur', function () { target.removeAttribute('tabindex'); }, { once: true });
    }
    target.focus({ preventScroll: true });
  }

  function scrollToSection(target) {
    cancelAnimatedScroll();
    var start = window.scrollY;
    var padding = parseFloat(window.getComputedStyle(root).scrollPaddingTop) || 0;
    var maximum = Math.max(0, root.scrollHeight - window.innerHeight);
    var destination = Math.max(0, Math.min(target.getBoundingClientRect().top + start - padding, maximum));
    var distance = destination - start;
    if (Math.abs(distance) < 1) {
      window.scrollTo({ top: destination, behavior: 'instant' });
      focusSection(target);
      return;
    }

    // Manual navigation is explicitly enabled to animate independently of OS motion settings.
    var duration = Math.min(800, Math.max(450, Math.abs(distance) * 0.4));
    var startTime = null;
    function step(now) {
      if (startTime === null) startTime = now;
      var progress = Math.min((now - startTime) / duration, 1);
      var eased = progress < 0.5 ? 4 * progress * progress * progress :
        1 - Math.pow(-2 * progress + 2, 3) / 2;
      window.scrollTo({ top: start + distance * eased, behavior: 'instant' });
      if (progress < 1) {
        scrollFrame = window.requestAnimationFrame(step);
      } else {
        scrollFrame = 0;
        focusSection(target);
      }
    }
    scrollFrame = window.requestAnimationFrame(step);
  }

  function closeMenu(restoreFocus) {
    if (!toggle || !menu) return;
    var wasOpen = toggle.getAttribute('aria-expanded') === 'true';
    menu.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    if (wasOpen && restoreFocus) toggle.focus();
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      toggle.classList.toggle('is-open', open);
      menu.classList.toggle('is-open', open);
    });
    document.addEventListener('click', function (event) {
      if (!event.target.closest('.site-navigation')) closeMenu(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu(true);
    });
    document.addEventListener('focusin', function (event) {
      if (!event.target.closest('.site-navigation')) closeMenu(false);
    });
    mobile.addEventListener('change', function () { closeMenu(false); });
  }

  // Update the fragment without triggering an instant native anchor jump.
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      var target = document.getElementById(link.getAttribute('href').slice(1));
      if (!target) return;
      event.preventDefault();
      closeMenu(false);
      if (window.location.hash !== link.hash) window.history.pushState(null, '', link.hash);
      scrollToSection(target);
    });
  });

  var navLinks = Array.from(document.querySelectorAll('.site-menu a[href^="#"]'));
  var sections = navLinks.map(function (link) {
    return document.getElementById(link.getAttribute('href').slice(1));
  }).filter(Boolean);
  var updatePending = false;
  function updateActiveSection() {
    var activeId = '';
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= 160) activeId = section.id;
    });
    if (window.scrollY + window.innerHeight >= root.scrollHeight - 4) activeId = 'contact';
    navLinks.forEach(function (link) {
      var active = link.getAttribute('href') === '#' + activeId;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    updatePending = false;
  }
  window.addEventListener('scroll', function () {
    if (updatePending) return;
    updatePending = true;
    window.requestAnimationFrame(updateActiveSection);
  }, { passive: true });
  window.addEventListener('resize', updateActiveSection);
  window.addEventListener('wheel', cancelAnimatedScroll, { passive: true });
  window.addEventListener('touchstart', cancelAnimatedScroll, { passive: true });
  window.addEventListener('pointerdown', cancelAnimatedScroll, { passive: true });
  window.addEventListener('popstate', cancelAnimatedScroll);
  window.addEventListener('hashchange', cancelAnimatedScroll);
  window.addEventListener('resize', cancelAnimatedScroll);
  document.addEventListener('keydown', function (event) {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Tab', 'Escape'].indexOf(event.key) !== -1) {
      cancelAnimatedScroll();
    }
  });
  updateActiveSection();
}());
