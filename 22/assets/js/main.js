/* ==========================================================================
   Wanderkite Holidays — main.js
   Shared behaviour for every page. Each module checks for its own markup,
   so the same file is safe to load on the public pages, Sign In, Sign Up
   and the Dashboard.
   --------------------------------------------------------------------------
   1.  Helpers (storage, toast, formatting)
   2.  Theme & direction preferences
   3.  Header: sticky state, Home dropdown, mobile panel
   4.  Footer: back to top
   5.  Trip finder (Home 1)
   6.  Deal countdowns (Home 1)
   7.  Review rotator (Home 1)
   8.  Tabs (Home 2, Honeymoon & Family)
   9.  Single-open accordion (Home 2 FAQ)
   10. Package filter, search & sort (Domestic, International)
   11. Save to favourites (shared with the Dashboard)
   12. Romance add-on builder & family estimator
   13. Form validation, contact & callback forms
   14. Sign In / Sign Up
   ========================================================================== */
(function () {
  'use strict';

  /* 1. HELPERS ------------------------------------------------------------ */
  var root = document.documentElement;

  var store = {
    get: function (key, fallback) {
      try {
        var raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) { return fallback; }
    },
    set: function (key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
    },
    getRaw: function (key) {
      try { return localStorage.getItem(key); } catch (e) { return null; }
    },
    setRaw: function (key, value) {
      try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ }
    }
  };

  /** Indian number format: 245000 -> ₹2,45,000 */
  function rupees(n) {
    return '₹' + Math.round(n).toLocaleString('en-IN');
  }

  var toastTimer;
  function toast(message) {
    var el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-visible'); }, 2800);
  }

  // Expose a tiny API for dashboard.js
  window.WK = { store: store, toast: toast, rupees: rupees };

  /* 2. THEME & DIRECTION -------------------------------------------------- */
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    store.setRaw('wk-theme', theme);
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      var dark = theme === 'dark';
      var ico = btn.querySelector('.theme-ico');
      if (ico) ico.textContent = dark ? '☀' : '☾';
      btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      btn.setAttribute('title', dark ? 'Light theme' : 'Dark theme');
    });
    document.dispatchEvent(new CustomEvent('wk:themechange', { detail: theme }));
  }

  function applyDir(dir) {
    root.setAttribute('dir', dir);
    store.setRaw('wk-dir', dir);
    document.querySelectorAll('.dir-toggle').forEach(function (btn) {
      var rtl = dir === 'rtl';
      var lbl = btn.querySelector('.dir-lbl');
      if (lbl) lbl.textContent = rtl ? 'LTR' : 'RTL';
      btn.setAttribute('aria-label', rtl ? 'Switch to left-to-right layout' : 'Switch to right-to-left layout');
      btn.setAttribute('title', rtl ? 'Left-to-right' : 'Right-to-left');
    });
    document.dispatchEvent(new CustomEvent('wk:dirchange', { detail: dir }));
  }

  applyTheme(store.getRaw('wk-theme') || 'light');
  applyDir(store.getRaw('wk-dir') || 'ltr');

  document.addEventListener('click', function (e) {
    if (e.target.closest('.theme-toggle')) {
      applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    }
    if (e.target.closest('.dir-toggle')) {
      applyDir(root.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl');
    }
  });

  /* 3. HEADER ------------------------------------------------------------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var hamburger = header.querySelector('.hamburger');
    var nav = header.querySelector('.main-nav');
    var overlay = document.querySelector('.nav-overlay');
    var dropdowns = header.querySelectorAll('.has-dropdown');
    var mobileQuery = window.matchMedia('(max-width: 1024px)');

    // Shadow once the page scrolls
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Home dropdown (desktop) / accordion (mobile)
    function setDropdown(item, open) {
      item.classList.toggle('is-open', open);
      var btn = item.querySelector('.dropdown-toggle');
      if (btn) btn.setAttribute('aria-expanded', String(open));
    }
    dropdowns.forEach(function (item) {
      var btn = item.querySelector('.dropdown-toggle');
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        setDropdown(item, !item.classList.contains('is-open'));
      });
      // Desktop hover keeps aria-expanded in sync
      item.addEventListener('mouseenter', function () { if (!mobileQuery.matches) btn.setAttribute('aria-expanded', 'true'); });
      item.addEventListener('mouseleave', function () { if (!mobileQuery.matches && !item.classList.contains('is-open')) btn.setAttribute('aria-expanded', 'false'); });
    });

    // Mobile slide-in panel
    function openNav() {
      document.body.classList.add('nav-open');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Close menu');
      var first = nav.querySelector('a, button');
      if (first) setTimeout(function () { first.focus(); }, 60);
    }
    function closeNav(returnFocus) {
      if (!document.body.classList.contains('nav-open')) return;
      document.body.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
      if (returnFocus !== false) hamburger.focus();
    }

    if (hamburger && nav) {
      hamburger.addEventListener('click', function () {
        if (document.body.classList.contains('nav-open')) closeNav(); else openNav();
      });
      if (overlay) overlay.addEventListener('click', function () { closeNav(); });
      nav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { closeNav(false); });
      });
      // Leaving mobile width closes the panel
      var onBreakpoint = function (e) { if (!e.matches) closeNav(false); };
      if (mobileQuery.addEventListener) mobileQuery.addEventListener('change', onBreakpoint);
      else mobileQuery.addListener(onBreakpoint);
    }

    // Outside click closes the desktop dropdown
    document.addEventListener('click', function (e) {
      dropdowns.forEach(function (item) {
        if (!item.contains(e.target) && !mobileQuery.matches) setDropdown(item, false);
      });
      if (document.body.classList.contains('nav-open') && !header.contains(e.target)) closeNav(false);
    });

    // Esc closes everything; Tab is trapped inside the header while the panel is open
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        dropdowns.forEach(function (item) {
          if (item.classList.contains('is-open')) {
            setDropdown(item, false);
            if (!document.body.classList.contains('nav-open')) item.querySelector('.dropdown-toggle').focus();
          }
        });
        closeNav();
      }
      if (e.key === 'Tab' && document.body.classList.contains('nav-open')) {
        var focusables = Array.prototype.filter.call(
          header.querySelectorAll('a[href], button:not([disabled]), input, select'),
          function (el) { return el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden'; }
        );
        if (!focusables.length) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* 4. FOOTER ------------------------------------------------------------- */
  document.querySelectorAll('[data-scroll-top]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      var skip = document.querySelector('.brand');
      if (skip) skip.focus({ preventScroll: true });
    });
  });
  document.querySelectorAll('.year').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* 5. TRIP FINDER -------------------------------------------------------- */
  var finder = document.getElementById('trip-finder');
  if (finder) {
    finder.addEventListener('submit', function (e) {
      e.preventDefault();
      var type = finder.type.value;
      var routes = {
        domestic: 'pages/domestic.html#packages',
        international: 'pages/international.html#packages',
        honeymoon: 'pages/honeymoon-family.html?tab=honeymoon#packages',
        family: 'pages/honeymoon-family.html?tab=family#packages'
      };
      store.set('wk-trip-prefs', { type: type, month: finder.month.value, pax: finder.pax.value });
      window.location.href = routes[type] || routes.domestic;
    });
  }

  /* 6. DEAL COUNTDOWNS ---------------------------------------------------- */
  var timers = document.querySelectorAll('[data-countdown]');
  if (timers.length) {
    var ends = store.get('wk-deal-ends', {});
    var now = Date.now();
    timers.forEach(function (el, i) {
      var days = parseInt(el.getAttribute('data-countdown'), 10) || 3;
      // Each deal keeps its own end time; when it lapses the weekly deal rolls over.
      if (!ends[i] || ends[i] < now) {
        var end = new Date();
        end.setHours(23, 59, 59, 0);
        end.setDate(end.getDate() + days - 1);
        ends[i] = end.getTime();
      }
      el.setAttribute('data-end', ends[i]);
    });
    store.set('wk-deal-ends', ends);

    var pad = function (n) { return String(n).padStart(2, '0'); };
    var tick = function () {
      timers.forEach(function (el) {
        var left = Math.max(0, parseInt(el.getAttribute('data-end'), 10) - Date.now());
        var d = Math.floor(left / 864e5);
        var h = Math.floor(left / 36e5) % 24;
        var m = Math.floor(left / 6e4) % 60;
        var s = Math.floor(left / 1e3) % 60;
        el.innerHTML = '<span>Offer ends in</span>' +
          '<span class="cd-unit">' + pad(d) + 'd</span>' +
          '<span class="cd-unit">' + pad(h) + 'h</span>' +
          '<span class="cd-unit">' + pad(m) + 'm</span>' +
          '<span class="cd-unit">' + pad(s) + 's</span>';
        el.setAttribute('aria-label', 'Offer ends in ' + d + ' days ' + h + ' hours');
      });
    };
    tick();
    setInterval(tick, 1000);
  }

  /* 7. REVIEW ROTATOR ----------------------------------------------------- */
  document.querySelectorAll('[data-quotes]').forEach(function (box) {
    var slides = box.querySelectorAll('.quote-slide');
    var dotsWrap = box.querySelector('[data-quote-dots]');
    var index = 0;
    var auto;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'dot';
      dot.setAttribute('aria-label', 'Show review ' + (i + 1));
      dot.addEventListener('click', function () { show(i); restart(); });
      dotsWrap.appendChild(dot);
    });
    var dots = dotsWrap.querySelectorAll('.dot');

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.hidden = k !== index; });
      dots.forEach(function (d, k) { d.setAttribute('aria-current', k === index ? 'true' : 'false'); });
    }
    function restart() {
      clearInterval(auto);
      auto = setInterval(function () { show(index + 1); }, 7000);
    }
    box.querySelector('[data-quote-prev]').addEventListener('click', function () { show(index - 1); restart(); });
    box.querySelector('[data-quote-next]').addEventListener('click', function () { show(index + 1); restart(); });
    box.addEventListener('mouseenter', function () { clearInterval(auto); });
    box.addEventListener('mouseleave', restart);
    box.addEventListener('focusin', function () { clearInterval(auto); });
    show(0);
    restart();
  });

  /* 8. TABS --------------------------------------------------------------- */
  document.querySelectorAll('[data-tabs]').forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));

    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab); });
      tab.addEventListener('keydown', function (e) {
        var rtl = root.getAttribute('dir') === 'rtl';
        var next = rtl ? 'ArrowLeft' : 'ArrowRight';
        var prev = rtl ? 'ArrowRight' : 'ArrowLeft';
        if (e.key === next) { e.preventDefault(); select(tabs[(i + 1) % tabs.length], true); }
        if (e.key === prev) { e.preventDefault(); select(tabs[(i - 1 + tabs.length) % tabs.length], true); }
        if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
        if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
      });
    });

    // ?tab=family opens the matching tab (used by the Home 1 trip finder)
    var wanted = new URLSearchParams(window.location.search).get('tab');
    if (wanted) {
      var match = document.getElementById('tab-' + wanted);
      if (match && tabs.indexOf(match) > -1) select(match);
    }
  });

  /* 9. SINGLE-OPEN ACCORDION --------------------------------------------- */
  document.querySelectorAll('[data-accordion="single"]').forEach(function (acc) {
    var items = acc.querySelectorAll('details');
    items.forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (!item.open) return;
        items.forEach(function (other) { if (other !== item) other.open = false; });
      });
    });
  });

  /* 10. PACKAGE FILTERS --------------------------------------------------- */
  document.querySelectorAll('[data-filter-root]').forEach(function (bar) {
    var section = bar.closest('section');
    var grid = section.querySelector('[data-grid]');
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.pkg-card'));
    var chips = bar.querySelectorAll('[data-filter]');
    var search = bar.querySelector('[data-search]');
    var sort = bar.querySelector('[data-sort]');
    var count = section.querySelector('[data-count]');
    var empty = section.querySelector('[data-empty]');
    var active = 'all';

    function update() {
      var q = (search && search.value ? search.value : '').trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (card) {
        var matchStyle = active === 'all' || card.getAttribute('data-style') === active;
        var matchText = !q || card.textContent.toLowerCase().indexOf(q) > -1;
        var visible = matchStyle && matchText;
        card.hidden = !visible;
        card.style.display = visible ? '' : 'none';
        if (visible) shown++;
      });

      var key = sort ? sort.value : 'popular';
      var sorted = cards.slice().sort(function (a, b) {
        var num = function (el, attr) { return parseFloat(el.getAttribute(attr)) || 0; };
        if (key === 'price-asc') return num(a, 'data-price') - num(b, 'data-price');
        if (key === 'price-desc') return num(b, 'data-price') - num(a, 'data-price');
        if (key === 'nights') return num(a, 'data-nights') - num(b, 'data-nights') || num(a, 'data-price') - num(b, 'data-price');
        return num(a, 'data-pop') - num(b, 'data-pop');
      });
      sorted.forEach(function (card) { grid.appendChild(card); });

      if (count) count.textContent = 'Showing ' + shown + (shown === 1 ? ' package' : ' packages');
      if (empty) empty.classList.toggle('is-visible', shown === 0);
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        active = chip.getAttribute('data-filter');
        chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        update();
      });
    });
    if (search) search.addEventListener('input', update);
    if (sort) sort.addEventListener('change', update);
    update();
  });

  /* 11. SAVE TO FAVOURITES (read by the Dashboard) ------------------------ */
  var saveButtons = document.querySelectorAll('.save-btn');
  if (saveButtons.length) {
    var getSaved = function () { return store.get('wk-saved', null) || []; };

    var paint = function () {
      var ids = getSaved().map(function (p) { return p.id; });
      saveButtons.forEach(function (btn) {
        var card = btn.closest('.pkg-card');
        var on = ids.indexOf(card.getAttribute('data-id')) > -1;
        var title = card.getAttribute('data-title');
        btn.setAttribute('aria-pressed', String(on));
        btn.textContent = on ? '♥︎' : '♡';
        btn.setAttribute('aria-label', (on ? 'Remove ' : 'Save ') + title + (on ? ' from favourites' : ' to favourites'));
      });
    };

    saveButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = btn.closest('.pkg-card');
        var id = card.getAttribute('data-id');
        var saved = getSaved();
        var exists = saved.some(function (p) { return p.id === id; });
        if (exists) {
          saved = saved.filter(function (p) { return p.id !== id; });
          toast('Removed from your saved packages');
        } else {
          saved.unshift({
            id: id,
            title: card.getAttribute('data-title'),
            price: parseInt(card.getAttribute('data-price'), 10),
            image: card.getAttribute('data-img'),
            duration: card.getAttribute('data-duration'),
            type: card.getAttribute('data-type'),
            page: card.getAttribute('data-page'),
            savedAt: new Date().toISOString()
          });
          toast('Saved — find it under Saved Packages in your dashboard');
        }
        store.set('wk-saved', saved);
        paint();
      });
    });
    paint();
  }

  /* 12a. ROMANCE ADD-ON BUILDER ------------------------------------------ */
  var builder = document.getElementById('addon-builder');
  if (builder) {
    var boxes = builder.querySelectorAll('input[type="checkbox"]');
    var totalEl = builder.querySelector('[data-addon-total]');
    var countEl = builder.querySelector('[data-addon-count]');
    var linkEl = builder.querySelector('[data-addon-link]');
    var refresh = function () {
      var total = 0;
      var names = [];
      boxes.forEach(function (b) {
        if (b.checked) { total += parseInt(b.getAttribute('data-price'), 10); names.push(b.value); }
      });
      totalEl.textContent = rupees(total);
      countEl.textContent = names.length;
      var label = names.length ? 'Honeymoon add-ons: ' + names.join(', ') : 'Honeymoon add-ons';
      linkEl.href = 'contact.html?package=' + encodeURIComponent(label) + '#enquiry';
    };
    builder.addEventListener('change', refresh);
    builder.addEventListener('submit', function (e) { e.preventDefault(); });
    refresh();
  }

  /* 12b. FAMILY COST ESTIMATOR ------------------------------------------- */
  var estimator = document.getElementById('family-estimator');
  if (estimator) {
    var calc = function () {
      var sel = estimator.package;
      var base = parseInt(sel.value, 10);
      var name = sel.options[sel.selectedIndex].getAttribute('data-name');
      var adults = parseInt(estimator.adults.value, 10);
      var k611 = parseInt(estimator.kids611.value, 10);
      var k25 = parseInt(estimator.kids25.value, 10);
      var inf = parseInt(estimator.infants.value, 10);
      var total = adults * base + k611 * base * 0.6 + k25 * base * 0.3;
      estimator.querySelector('[data-est-total]').textContent = rupees(total);
      var parts = [adults + ' adult' + (adults > 1 ? 's' : '') + ' × ' + rupees(base)];
      if (k611) parts.push(k611 + ' × ' + rupees(base * 0.6) + ' (6–11)');
      if (k25) parts.push(k25 + ' × ' + rupees(base * 0.3) + ' (2–5)');
      if (inf) parts.push(inf + ' infant' + (inf > 1 ? 's' : '') + ' free');
      estimator.querySelector('[data-est-breakdown]').textContent = parts.join(' + ') + '. Twin-sharing rooms, before optional add-ons.';
      var travellers = adults + k611 + k25 + inf;
      estimator.querySelector('[data-est-link]').href = 'contact.html?package=' +
        encodeURIComponent(name + ' (' + travellers + ' travellers, est. ' + rupees(total) + ')') + '&type=Family#enquiry';
    };
    estimator.addEventListener('change', calc);
    estimator.addEventListener('submit', function (e) { e.preventDefault(); });
    calc();
  }

  /* 13. FORM VALIDATION --------------------------------------------------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(input, message) {
    var field = input.closest('.field');
    var msg = field ? field.querySelector('.error-msg') : null;
    if (field) field.classList.toggle('has-error', !!message);
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (msg) {
      if (!msg.id) msg.id = (input.id || input.name) + '-error';
      if (!input.hasAttribute('data-hint-ids')) input.setAttribute('data-hint-ids', input.getAttribute('aria-describedby') || '');
      var hints = input.getAttribute('data-hint-ids');
      msg.textContent = message || '';
      var ids = message ? (hints + ' ' + msg.id).trim() : hints;
      if (ids) input.setAttribute('aria-describedby', ids);
      else input.removeAttribute('aria-describedby');
    }
    return !message;
  }

  /** Returns an error message for one control, or '' when it's valid. */
  function checkControl(input) {
    var v = (input.value || '').trim();
    var label = input.getAttribute('data-label') || 'This field';
    if (input.type === 'checkbox') return input.required && !input.checked ? 'Please tick this box to continue.' : '';
    if (input.required && !v) return label + ' is required.';
    if (!v) return '';
    if (input.type === 'email' && !EMAIL_RE.test(v)) return 'Enter a valid email address, e.g. name@example.com.';
    if (input.type === 'tel') {
      var digits = v.replace(/[\s()-]/g, '');
      if (!/^(\+?91)?[6-9]\d{9}$/.test(digits)) return 'Enter a valid 10-digit Indian mobile number.';
    }
    if (input.name === 'name' && v.length < 2) return 'Please enter your full name.';
    if (input.type === 'number') {
      var n = Number(v);
      if (!Number.isInteger(n) || n < Number(input.min || 1) || n > Number(input.max || 99)) return 'Enter a number between ' + (input.min || 1) + ' and ' + (input.max || 99) + '.';
    }
    if (input.type === 'date' && !input.hasAttribute('data-allow-past')) {
      var today = new Date(); today.setHours(0, 0, 0, 0);
      if (new Date(v + 'T00:00:00') < today) return 'Please choose a date from today onwards.';
    }
    if (input.tagName === 'TEXTAREA' && v.length < 10) return 'Tell us a little more (at least 10 characters).';
    if (input.getAttribute('data-match')) {
      var other = document.getElementById(input.getAttribute('data-match'));
      if (other && other.value !== input.value) return 'Passwords do not match.';
    }
    if (input.hasAttribute('data-strong')) {
      if (v.length < 8 || !/[A-Za-z]/.test(v) || !/\d/.test(v)) return 'Use at least 8 characters with letters and a number.';
    }
    if (input.hasAttribute('data-password') && !input.hasAttribute('data-strong') && v.length < 8) return 'Password must be at least 8 characters.';
    return '';
  }

  /** Validate every control; focus the first invalid one. */
  function validateForm(form) {
    var controls = form.querySelectorAll('input, select, textarea');
    var firstBad = null;
    controls.forEach(function (c) {
      if (c.type === 'hidden' || c.disabled || c.closest('[hidden]')) return;
      var ok = setError(c, checkControl(c));
      if (!ok && !firstBad) firstBad = c;
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  // Share validation and preference helpers with dashboard.js
  window.WK.validateForm = validateForm;
  window.WK.setError = setError;
  window.WK.applyTheme = applyTheme;
  window.WK.applyDir = applyDir;

  // Give each control a readable name for messages, and validate on blur
  document.querySelectorAll('form[novalidate]').forEach(function (form) {
    form.querySelectorAll('input, select, textarea').forEach(function (c) {
      var lbl = form.querySelector('label[for="' + c.id + '"]');
      if (lbl && !c.getAttribute('data-label')) c.setAttribute('data-label', lbl.textContent.replace('*', '').trim());
      c.addEventListener('blur', function () {
        if (c.value || c.getAttribute('aria-invalid') === 'true') setError(c, checkControl(c));
      });
      c.addEventListener('change', function () {
        if (c.getAttribute('aria-invalid') === 'true') setError(c, checkControl(c));
      });
    });
  });

  // Contact form
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    var params = new URLSearchParams(window.location.search);
    var pkg = params.get('package');
    var dateInput = contactForm.querySelector('#c-date');
    var d = new Date();
    dateInput.min = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

    if (pkg) {
      contactForm.package.value = pkg;
      var type = params.get('type');
      if (!type) {
        if (/honeymoon/i.test(pkg)) type = 'Honeymoon';
        else if (/family|corbett/i.test(pkg)) type = 'Family';
        else if (/bali|dubai|maldives|thailand|krabi|phuket|vietnam|da nang|singapore|japan|istanbul|cappadocia|kenya|paris|international/i.test(pkg)) type = 'International';
        else type = 'Domestic';
      }
      contactForm.type.value = type;
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(contactForm)) return;
      var ref = 'WK-' + String(Date.now()).slice(-5);
      var success = document.getElementById('contact-success');
      success.querySelector('[data-ref]').textContent = ref;
      contactForm.hidden = true;
      success.classList.add('is-visible');
      success.focus();
      toast('Enquiry ' + ref + ' sent');
    });
  }

  // Callback form (Home 2)
  var callbackForm = document.getElementById('callback-form');
  if (callbackForm) {
    callbackForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(callbackForm)) return;
      var success = callbackForm.parentElement.querySelector('.form-success');
      callbackForm.hidden = true;
      success.classList.add('is-visible');
      success.focus();
    });
  }

  /* 14. SIGN IN / SIGN UP ------------------------------------------------- */
  // Show / hide password
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

  function nameFromEmail(email) {
    var local = email.split('@')[0].replace(/[._\-\d]+/g, ' ').trim();
    if (!local) return 'Traveller';
    return local.split(' ').map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' ');
  }

  function startSession(name, email) {
    store.set('wk-session', { name: name, email: email, since: new Date().toISOString() });
    window.location.href = 'dashboard.html';
  }

  var signinForm = document.getElementById('signin-form');
  if (signinForm) {
    var resetForm = document.getElementById('reset-form');
    var signinPanel = document.getElementById('signin-panel');
    var resetPanel = document.getElementById('reset-panel');
    var resetSuccess = document.getElementById('reset-success');

    signinForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(signinForm)) return;
      var email = signinForm.email.value.trim().toLowerCase();
      var account = store.get('wk-account', null);
      var name = account && account.email === email ? account.name : nameFromEmail(email);
      startSession(name, email);
    });

    document.getElementById('forgot-link').addEventListener('click', function () {
      signinPanel.hidden = true;
      resetPanel.hidden = false;
      resetForm.hidden = false;
      resetSuccess.classList.remove('is-visible');
      resetForm.email.value = signinForm.email.value;
      resetPanel.querySelector('h1').focus();
    });

    document.querySelectorAll('[data-back-signin]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        resetPanel.hidden = true;
        signinPanel.hidden = false;
        signinForm.email.focus();
      });
    });

    resetForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(resetForm)) return;
      resetSuccess.querySelector('[data-reset-email]').textContent = resetForm.email.value.trim();
      resetForm.hidden = true;
      resetSuccess.classList.add('is-visible');
      resetSuccess.focus();
    });
  }

  var signupForm = document.getElementById('signup-form');
  if (signupForm) {
    var pw = signupForm.querySelector('#su-password');
    var bar = signupForm.querySelector('.strength span');
    var barText = signupForm.querySelector('[data-strength-text]');
    pw.addEventListener('input', function () {
      var v = pw.value;
      var score = 0;
      if (v.length >= 8) score++;
      if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
      if (/\d/.test(v)) score++;
      if (/[^A-Za-z0-9]/.test(v) || v.length >= 12) score++;
      var levels = [
        { w: '8%', c: '#B3261E', t: 'Too short' },
        { w: '30%', c: '#B3261E', t: 'Weak' },
        { w: '55%', c: '#E2761B', t: 'Fair' },
        { w: '80%', c: '#2A9D9A', t: 'Good' },
        { w: '100%', c: '#17683F', t: 'Strong' }
      ];
      var lvl = v ? levels[score] : { w: '0', c: 'transparent', t: 'Use 8+ characters with letters and a number' };
      bar.style.width = lvl.w;
      bar.style.backgroundColor = lvl.c;
      barText.textContent = v ? 'Strength: ' + lvl.t : lvl.t;
    });

    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(signupForm)) return;
      var name = signupForm.querySelector('#su-name').value.trim();
      var email = signupForm.querySelector('#su-email').value.trim().toLowerCase();
      store.set('wk-account', { name: name, email: email, created: new Date().toISOString() });
      startSession(name, email);
    });
  }
})();
