/* ==========================================================================
   Beadwell Wash & Detail — site-wide behaviour
   - Theme (light/dark) and direction (LTR/RTL) toggles, saved in localStorage
   - Sticky header, Home dropdown, mobile slide-in menu
   - Accordions, tabs, gallery filter + lightbox
   - Contact form, Sign In / Sign Up / password reset (demo, localStorage only)
   No libraries; works from file:// (no modules, no fetch).
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var KEYS = { theme: 'bw-theme', dir: 'bw-dir', users: 'bw-users', session: 'bw-session' };
  var TEXT_ICON = '︎'; // forces text (not emoji) presentation for ☀ ☾

  root.classList.add('js');

  /* ---------- Safe localStorage helpers ---------- */
  function getItem(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function setItem(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ }
  }
  function getJSON(key, fallback) {
    try { var v = JSON.parse(getItem(key)); return v === null ? fallback : v; } catch (e) { return fallback; }
  }

  /* ---------- Theme + direction ---------- */
  function isDark() { return root.getAttribute('data-theme') === 'dark'; }
  function isRTL() { return root.getAttribute('dir') === 'rtl'; }

  function syncToggles() {
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      var icon = btn.querySelector('.toggle-icon');
      if (icon) icon.textContent = (isDark() ? '☀' : '☾') + TEXT_ICON;
      var label = btn.querySelector('.theme-label');
      if (label) label.textContent = isDark() ? 'Light' : 'Dark';
      btn.setAttribute('aria-label', isDark() ? 'Switch to light theme' : 'Switch to dark theme');
      btn.setAttribute('aria-pressed', String(isDark()));
      btn.title = isDark() ? 'Light theme' : 'Dark theme';
    });
    document.querySelectorAll('[data-dir-toggle]').forEach(function (btn) {
      var label = btn.querySelector('.toggle-label');
      if (label) label.textContent = isRTL() ? 'LTR' : 'RTL';
      btn.setAttribute('aria-label', isRTL() ? 'Switch to left-to-right layout' : 'Switch to right-to-left layout');
      btn.setAttribute('aria-pressed', String(isRTL()));
      btn.title = isRTL() ? 'Left-to-right' : 'Right-to-left';
    });
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    setItem(KEYS.theme, isDark() ? 'dark' : 'light');
    syncToggles();
    document.dispatchEvent(new CustomEvent('bw:themechange', { detail: theme }));
  }

  function applyDir(dir) {
    // Pause transitions for a frame so off-canvas panels don't sweep across the screen when mirrored
    root.classList.add('dir-switching');
    setTimeout(function () { root.classList.remove('dir-switching'); }, 60);
    root.setAttribute('dir', dir === 'rtl' ? 'rtl' : 'ltr');
    setItem(KEYS.dir, isRTL() ? 'rtl' : 'ltr');
    syncToggles();
    document.dispatchEvent(new CustomEvent('bw:dirchange', { detail: dir }));
  }

  // Make sure attributes exist even if the inline head script was blocked
  if (!root.getAttribute('data-theme')) root.setAttribute('data-theme', getItem(KEYS.theme) || 'light');
  if (!root.getAttribute('dir')) root.setAttribute('dir', getItem(KEYS.dir) || 'ltr');

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-theme-toggle]')) applyTheme(isDark() ? 'light' : 'dark');
    if (e.target.closest('[data-dir-toggle]')) applyDir(isRTL() ? 'ltr' : 'rtl');
  });
  syncToggles();

  // Keep every open tab in sync when the choice changes elsewhere
  window.addEventListener('storage', function (e) {
    if (e.key === KEYS.theme && e.newValue) { root.setAttribute('data-theme', e.newValue); syncToggles(); }
    if (e.key === KEYS.dir && e.newValue) { root.setAttribute('dir', e.newValue); syncToggles(); }
  });

  // Shared API for dashboard.js
  window.BW = { applyTheme: applyTheme, applyDir: applyDir, isDark: isDark, isRTL: isRTL, getJSON: getJSON, setItem: setItem, getItem: getItem, KEYS: KEYS };

  /* ---------- Focus-trap helper (menus, dialogs) ---------- */
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function visibleFocusables(container) {
    return Array.prototype.filter.call(container.querySelectorAll(FOCUSABLE), function (el) {
      return el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden';
    });
  }
  function trapTab(e, container) {
    if (e.key !== 'Tab') return;
    var items = visibleFocusables(container);
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  window.BW.trapTab = trapTab;

  /* ---------- Header: sticky shadow, dropdown, mobile panel ---------- */
  var header = document.querySelector('.site-header');
  var nav = document.getElementById('main-nav');
  var burger = document.querySelector('.hamburger');
  var overlay = document.querySelector('.nav-overlay');
  var mqMobile = window.matchMedia('(max-width: 1024px)');

  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function setDropdown(item, open) {
    item.classList.toggle('open', open);
    var btn = item.querySelector('.dropdown-toggle');
    if (btn) btn.setAttribute('aria-expanded', String(open));
  }

  document.querySelectorAll('.has-dropdown').forEach(function (item) {
    var btn = item.querySelector('.dropdown-toggle');
    btn.addEventListener('click', function () {
      // On desktop a hover already opened it; a click then keeps it open instead of toggling it shut
      var hovering = !mqMobile.matches && item.matches(':hover');
      setDropdown(item, hovering ? true : !item.classList.contains('open'));
    });
    item.addEventListener('mouseenter', function () { if (!mqMobile.matches) setDropdown(item, true); });
    item.addEventListener('mouseleave', function () { if (!mqMobile.matches) setDropdown(item, false); });
    item.addEventListener('focusout', function (e) {
      if (!mqMobile.matches && !item.contains(e.relatedTarget)) setDropdown(item, false);
    });
  });

  function navIsOpen() { return nav && nav.classList.contains('open'); }

  function openNav() {
    nav.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('nav-open');
    if (overlay) {
      overlay.hidden = false;
      requestAnimationFrame(function () { overlay.classList.add('show'); });
    }
    // Expand the Home accordion when the visitor is on a Home page
    var current = nav.querySelector('.dropdown-toggle.is-current');
    if (current) setDropdown(current.closest('.has-dropdown'), true);
    var first = nav.querySelector('.nav-link');
    setTimeout(function () { if (first && navIsOpen()) first.focus(); }, 380); // after the slide-in finishes
  }

  function closeNav(returnFocus) {
    if (!navIsOpen()) return;
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('nav-open');
    if (overlay) {
      overlay.classList.remove('show');
      setTimeout(function () { if (!navIsOpen()) overlay.hidden = true; }, 300);
    }
    if (returnFocus) burger.focus();
  }

  if (nav && burger) {
    burger.addEventListener('click', function () { navIsOpen() ? closeNav(false) : openNav(); });
    if (overlay) overlay.addEventListener('click', function () { closeNav(false); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeNav(false); });
    header.addEventListener('keydown', function (e) { if (navIsOpen()) trapTab(e, header); });
    var onBreakpoint = function (e) { if (!e.matches) closeNav(false); };
    if (mqMobile.addEventListener) mqMobile.addEventListener('change', onBreakpoint);
    else if (mqMobile.addListener) mqMobile.addListener(onBreakpoint);
  }

  // Outside click closes dropdowns and the mobile panel
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.has-dropdown.open').forEach(function (item) {
      if (!item.contains(e.target) && !mqMobile.matches) setDropdown(item, false);
    });
    if (navIsOpen() && !nav.contains(e.target) && !burger.contains(e.target) && !e.target.closest('.header-tools')) {
      closeNav(false);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.has-dropdown.open').forEach(function (item) {
      setDropdown(item, false);
      if (!mqMobile.matches) item.querySelector('.dropdown-toggle').focus();
    });
    if (navIsOpen()) closeNav(true);
  });

  /* ---------- Contact page: highlight today's opening hours ---------- */
  var today = String(new Date().getDay());
  document.querySelectorAll('[data-hours] tr[data-days]').forEach(function (row) {
    if (row.getAttribute('data-days').split(',').indexOf(today) !== -1) {
      row.classList.add('today-row');
      row.querySelector('th').insertAdjacentHTML('beforeend', ' <span class="visually-hidden">(today)</span>');
    }
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Accordion ---------- */
  document.querySelectorAll('.acc-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      document.getElementById(btn.getAttribute('aria-controls')).hidden = open;
    });
  });

  /* ---------- Tabs (roving focus, arrow keys mirrored in RTL) ---------- */
  document.querySelectorAll('[role="tablist"]').forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab, false); });
      tab.addEventListener('keydown', function (e) {
        var next = isRTL() ? 'ArrowLeft' : 'ArrowRight';
        var prev = isRTL() ? 'ArrowRight' : 'ArrowLeft';
        if (e.key === next) { e.preventDefault(); select(tabs[(i + 1) % tabs.length], true); }
        if (e.key === prev) { e.preventDefault(); select(tabs[(i - 1 + tabs.length) % tabs.length], true); }
        if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
        if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
      });
    });
  });

  /* ---------- Home 1: live "next open slot" estimate ---------- */
  // Bays open 7:30–19:00 Mon–Sat (first online slot 7:40), 9:00–17:00 Sun; slots every 20 min, 40 min lead time.
  function nextSlot(now) {
    var d = new Date(now.getTime() + 40 * 60000);
    var mins = Math.ceil(d.getMinutes() / 20) * 20;
    d.setMinutes(mins, 0, 0);
    for (var i = 0; i < 8; i++) {
      var sun = d.getDay() === 0;
      var open = sun ? 9 * 60 : 7 * 60 + 40;
      var close = sun ? 17 * 60 : 19 * 60;
      var t = d.getHours() * 60 + d.getMinutes();
      if (t < open) { d.setHours(Math.floor(open / 60), open % 60, 0, 0); return d; }
      if (t <= close - 20) return d;
      d.setDate(d.getDate() + 1);
      d.setHours(0, 0, 0, 0);
    }
    return d;
  }
  var slotEls = document.querySelectorAll('[data-next-slot]');
  if (slotEls.length) {
    var now = new Date();
    var slot = nextSlot(now);
    var sameDay = slot.toDateString() === now.toDateString();
    var tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1);
    var dayLabel = sameDay ? 'Today' : (slot.toDateString() === tomorrow.toDateString() ? 'Tomorrow' : slot.toLocaleDateString('en-US', { weekday: 'long' }));
    var timeLabel = slot.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    slotEls.forEach(function (el) {
      el.textContent = el.getAttribute('data-next-slot') === 'day' ? dayLabel : timeLabel;
    });
  }

  /* ---------- Gallery: filter + lightbox ---------- */
  var gallery = document.querySelector('[data-gallery]');
  if (gallery) {
    var items = Array.prototype.slice.call(gallery.querySelectorAll('.gallery-item'));
    var countEl = document.querySelector('[data-gallery-count]');
    document.querySelectorAll('.filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.getAttribute('data-filter');
        document.querySelectorAll('.filter-btn').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        var shown = 0;
        items.forEach(function (item) {
          var match = cat === 'all' || item.getAttribute('data-cat') === cat;
          item.hidden = !match;
          if (match) shown++;
        });
        if (countEl) countEl.textContent = 'Showing ' + shown + ' of ' + items.length + ' photos';
      });
    });

    var lb = document.querySelector('.lightbox');
    var lbImg = lb.querySelector('img');
    var lbCap = lb.querySelector('figcaption');
    var lbIndex = 0, lastFocus = null;
    function visibleItems() { return items.filter(function (i) { return !i.hidden; }); }
    function show(index) {
      var list = visibleItems();
      lbIndex = (index + list.length) % list.length;
      var img = list[lbIndex].querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = list[lbIndex].getAttribute('data-caption') + ' (' + (lbIndex + 1) + ' / ' + list.length + ')';
    }
    function openLb(item) {
      lastFocus = item;
      show(visibleItems().indexOf(item));
      lb.hidden = false;
      document.body.classList.add('modal-open');
      lb.querySelector('.lb-close').focus();
    }
    function closeLb() {
      lb.hidden = true;
      document.body.classList.remove('modal-open');
      if (lastFocus) lastFocus.focus();
    }
    items.forEach(function (item) { item.addEventListener('click', function () { openLb(item); }); });
    lb.querySelector('.lb-close').addEventListener('click', closeLb);
    lb.querySelector('.lb-prev').addEventListener('click', function () { show(lbIndex - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { show(lbIndex + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    lb.addEventListener('keydown', function (e) {
      var fwd = isRTL() ? 'ArrowLeft' : 'ArrowRight';
      var back = isRTL() ? 'ArrowRight' : 'ArrowLeft';
      if (e.key === 'Escape') closeLb();
      if (e.key === fwd) show(lbIndex + 1);
      if (e.key === back) show(lbIndex - 1);
      trapTab(e, lb);
    });
  }

  /* ---------- Form validation helpers ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(input, message) {
    var field = input.closest('.field');
    var msg = field && field.querySelector('.error-msg');
    if (field) field.classList.toggle('invalid', !!message);
    if (msg) msg.textContent = message || '';
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    return !message;
  }

  function validateField(input) {
    var v = (input.value || '').trim();
    var label = input.getAttribute('data-label') || 'This field';
    if (input.type === 'checkbox') return setError(input, input.required && !input.checked ? 'Please tick this box to continue.' : '');
    if (input.required && !v) return setError(input, label + ' is required.');
    if (v && input.type === 'email' && !EMAIL_RE.test(v)) return setError(input, 'Enter a valid email, like name@example.com.');
    if (v && input.type === 'tel' && v.replace(/\D/g, '').length < 10) return setError(input, 'Enter a 10-digit phone number.');
    var min = parseInt(input.getAttribute('data-min') || input.getAttribute('minlength') || '0', 10);
    if (v && min && v.length < min) return setError(input, label + ' needs at least ' + min + ' characters.');
    if (input.hasAttribute('data-strong') && v && !(/[A-Za-z]/.test(v) && /\d/.test(v))) {
      return setError(input, 'Use at least one letter and one number.');
    }
    var matchId = input.getAttribute('data-match');
    if (matchId && v !== document.getElementById(matchId).value) return setError(input, 'Passwords do not match.');
    return setError(input, '');
  }

  function validateForm(form) {
    var ok = true, firstBad = null;
    form.querySelectorAll('input, select, textarea').forEach(function (input) {
      if (input.type === 'hidden' || input.closest('[hidden]')) return;
      if (!validateField(input)) { ok = false; if (!firstBad) firstBad = input; }
    });
    if (firstBad) firstBad.focus();
    return ok;
  }

  function liveValidate(form) {
    form.querySelectorAll('input, select, textarea').forEach(function (input) {
      input.addEventListener('blur', function () { if (input.value) validateField(input); });
      input.addEventListener('input', function () {
        if (input.closest('.field') && input.closest('.field').classList.contains('invalid')) validateField(input);
      });
    });
  }

  /* ---------- Show / hide password ---------- */
  document.querySelectorAll('.pw-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = document.getElementById(btn.getAttribute('aria-controls'));
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.textContent = show ? 'Hide' : 'Show';
      btn.setAttribute('aria-pressed', String(show));
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
  });

  /* ---------- Contact form ---------- */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    liveValidate(contactForm);
    // Pre-select a topic from links such as contact.html?topic=detail or contact.html?topic=club-foam
    var params = new URLSearchParams(window.location.search);
    var topicParam = (params.get('topic') || params.get('plan') || '').toLowerCase().trim();
    var topicSelect = document.getElementById('c-topic');
    if (topicParam && topicSelect) {
      var aliasMap = {
        'foam': 'club-foam',
        'foam-bath': 'club-foam',
        'foam-club': 'club-foam',
        'club-foam': 'club-foam',
        'hand': 'club-hand',
        'hand-finish': 'club-hand',
        'hand-club': 'club-hand',
        'club-hand': 'club-hand',
        'shield': 'club-shield',
        'bead-shield': 'club-shield',
        'shield-club': 'club-shield',
        'club-shield': 'club-shield',
        'membership': 'club',
        'wash-club': 'club'
      };
      var targetVal = aliasMap[topicParam] || topicParam;
      var opt = topicSelect.querySelector('option[value="' + targetVal + '"]');
      if (opt) {
        topicSelect.value = targetVal;
        topicSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(contactForm)) return;
      var success = document.getElementById('contact-success');
      var name = document.getElementById('c-name').value.trim().split(' ')[0];
      success.querySelector('[data-name]').textContent = name;
      success.hidden = false;
      contactForm.reset();
      contactForm.querySelectorAll('.field').forEach(function (f) { f.classList.remove('invalid'); });
      success.focus();
    });
  }

  /* ---------- Auth (demo only: data stays in this browser) ---------- */
  // Simple non-cryptographic hash so passwords are not stored as plain text in the demo.
  function hash(str) {
    var h = 5381;
    for (var i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
    return 'h' + (h >>> 0).toString(36);
  }
  function startSession(user) {
    setItem(KEYS.session, JSON.stringify({ name: user.name, email: user.email, at: Date.now() }));
    window.location.href = 'dashboard.html';
  }
  function nameFromEmail(email) {
    var base = email.split('@')[0].replace(/[._-]+/g, ' ').trim();
    return base.replace(/\b\w/g, function (c) { return c.toUpperCase(); }) || 'Beadwell Member';
  }

  var signinForm = document.getElementById('signin-form');
  if (signinForm) {
    liveValidate(signinForm);
    signinForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(signinForm)) return;
      var email = document.getElementById('si-email').value.trim().toLowerCase();
      var pass = document.getElementById('si-password');
      var users = getJSON(KEYS.users, {});
      var user = users[email];
      if (user && user.pw !== hash(pass.value)) {
        setError(pass, 'That password doesn’t match this account. Try again or reset it.');
        pass.focus();
        return;
      }
      startSession(user || { name: nameFromEmail(email), email: email });
    });

    // Forgot password: swap to the reset form on the same page
    var signinView = document.getElementById('signin-view');
    var resetView = document.getElementById('reset-view');
    var resetForm = document.getElementById('reset-form');
    var resetSuccess = document.getElementById('reset-success');
    document.querySelectorAll('[data-show-reset]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        signinView.hidden = true;
        resetView.hidden = false;
        resetSuccess.hidden = true;
        resetForm.hidden = false;
        var typed = document.getElementById('si-email').value;
        document.getElementById('rs-email').value = typed;
        document.getElementById('rs-email').focus();
      });
    });
    document.querySelectorAll('[data-show-signin]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        resetView.hidden = true;
        signinView.hidden = false;
        document.getElementById('si-email').focus();
      });
    });
    liveValidate(resetForm);
    resetForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(resetForm)) return;
      resetSuccess.querySelector('[data-email]').textContent = document.getElementById('rs-email').value.trim();
      resetForm.hidden = true;
      resetSuccess.hidden = false;
      resetSuccess.focus();
    });
  }

  var signupForm = document.getElementById('signup-form');
  if (signupForm) {
    liveValidate(signupForm);
    var pw = document.getElementById('su-password');
    var meter = document.querySelector('.strength span');
    var meterText = document.getElementById('strength-text');
    pw.addEventListener('input', function () {
      var v = pw.value, score = 0;
      if (v.length >= 8) score++;
      if (/[A-Za-z]/.test(v) && /\d/.test(v)) score++;
      if (/[^A-Za-z0-9]/.test(v) || v.length >= 12) score++;
      var levels = [
        { w: '8%', c: 'var(--danger)', t: 'Too short' },
        { w: '35%', c: 'var(--danger)', t: 'Weak' },
        { w: '70%', c: 'var(--amber-500)', t: 'Good' },
        { w: '100%', c: 'var(--green-600)', t: 'Strong' }
      ];
      var lvl = v ? levels[score] : { w: '0', c: 'var(--danger)', t: 'Use 8+ characters with a letter and a number' };
      meter.style.width = lvl.w;
      meter.style.backgroundColor = lvl.c;
      meterText.textContent = lvl.t;
    });
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(signupForm)) return;
      var email = document.getElementById('su-email').value.trim().toLowerCase();
      var users = getJSON(KEYS.users, {});
      if (users[email]) {
        setError(document.getElementById('su-email'), 'An account already uses this email. Sign in instead.');
        document.getElementById('su-email').focus();
        return;
      }
      var user = {
        name: document.getElementById('su-name').value.trim(),
        email: email,
        pw: hash(pw.value),
        sms: document.getElementById('su-sms').checked
      };
      users[email] = user;
      setItem(KEYS.users, JSON.stringify(users));
      startSession(user);
    });
  }
})();
