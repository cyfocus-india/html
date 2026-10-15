/* ==========================================================================
   Marigold Grand Banquets — site-wide JavaScript (vanilla, no libraries)
   1.  Shared venue data (also used by dashboard.js)
   2.  Preferences: theme + direction (saved in localStorage)
   3.  Header: scroll state, desktop dropdown, mobile slide-in panel
   4.  Reveal-on-scroll, footer year, accordions
   5.  Home 1: quick availability check + hall finder
   6.  Halls: filter by event type and guest count
   7.  Packages: budget estimator
   8.  Gallery: filters + lightbox
   9.  Contact: enquiry form validation + prefill
   10. Sign In / Sign Up
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  /* Safe localStorage wrapper (storage can be disabled in private modes) */
  var store = {
    get: function (key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
    set: function (key, value) { try { localStorage.setItem(key, value); } catch (e) { /* ignore */ } },
    remove: function (key) { try { localStorage.removeItem(key); } catch (e) { /* ignore */ } },
    getJSON: function (key, fallback) {
      try { var raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch (e) { return fallback; }
    },
    setJSON: function (key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ } }
  };

  /* ------------------------------------------------------------------
     1. Shared venue data — one source of truth for halls, menus, add-ons
     ------------------------------------------------------------------ */
  var EVENT_TYPES = {
    wedding: 'Wedding & reception',
    engagement: 'Engagement & sangeet',
    birthday: 'Birthday',
    corporate: 'Corporate event',
    babyshower: 'Baby shower & naming',
    anniversary: 'Anniversary & private dinner'
  };

  var HALLS = [
    { id: 'ballroom', name: 'Marigold Ballroom', min: 350, max: 900, seated: 600, floating: 900, area: '12,500 sq ft',
      slot: { lunch: 180000, dinner: 240000 }, types: ['wedding', 'engagement', 'corporate'], img: 'hall-ballroom.jpg',
      alt: 'Marigold Ballroom with crystal chandeliers and a polished dance floor',
      why: 'A pillarless 12,500 sq ft floor and a 40 × 20 ft stage, so every one of your guests has a clear view of the couple.' },
    { id: 'saffron', name: 'Saffron Hall', min: 120, max: 400, seated: 280, floating: 400, area: '5,200 sq ft',
      slot: { lunch: 75000, dinner: 95000 }, types: ['engagement', 'wedding', 'corporate', 'birthday', 'babyshower'], img: 'hall-saffron.jpg',
      alt: 'Saffron Hall set with round tables, gold chairs and chandeliers',
      why: 'Splits into two soundproofed halls, so a 130-guest sangeet still feels full and lively instead of half-empty.' },
    { id: 'jasmine', name: 'Jasmine Lawn', min: 100, max: 500, seated: 250, floating: 500, area: '14,000 sq ft lawn',
      slot: { lunch: 85000, dinner: 120000 }, types: ['wedding', 'engagement', 'birthday', 'corporate'], img: 'hall-jasmine-lawn.jpg',
      alt: 'Jasmine Lawn at night with fairy lights strung through the rain trees',
      why: 'Open sky under rain trees strung with fairy lights, made for mehendi, haldi and cocktail evenings.' },
    { id: 'lotus', name: 'Lotus Room', min: 40, max: 150, seated: 90, floating: 150, area: '2,400 sq ft',
      slot: { lunch: 32000, dinner: 38000 }, types: ['birthday', 'babyshower', 'engagement', 'corporate', 'anniversary'], img: 'hall-lotus-room.jpg',
      alt: 'Lotus Room with daylight windows and round tables dressed in white',
      why: 'Daylight windows, its own entrance and a child-safe layout, ideal for birthdays and baby showers.' },
    { id: 'ember', name: 'Ember Room', min: 15, max: 40, seated: 24, floating: 40, area: '900 sq ft',
      slot: { lunch: 12000, dinner: 15000 }, types: ['anniversary', 'corporate', 'engagement'], img: 'hall-ember-room.jpg',
      alt: 'Ember Room private dining table with candles and a feather centrepiece',
      why: 'One long candle-lit table and a private butler: an intimate dinner without a restaurant crowd.' }
  ];

  var MENUS = [
    { id: 'veg-classic', name: 'Veg Classic', price: 750 },
    { id: 'veg-royal', name: 'Veg Royal', price: 1050 },
    { id: 'nonveg-classic', name: 'Non-Veg Classic', price: 950 },
    { id: 'nonveg-royal', name: 'Non-Veg Royal', price: 1350 },
    { id: 'satvik', name: 'Jain & Satvik', price: 850 },
    { id: 'hightea', name: 'High Tea', price: 450 }
  ];

  var ADDONS = [
    { id: 'dosa', name: 'Live dosa counter', price: 95, unit: 'guest', group: 'catering' },
    { id: 'chaat', name: 'Chaat & pani-puri counter', price: 85, unit: 'guest', group: 'catering' },
    { id: 'grill', name: 'Live grill & kebab counter', price: 180, unit: 'guest', group: 'catering' },
    { id: 'mocktail', name: 'Mocktail bar', price: 120, unit: 'guest', group: 'catering' },
    { id: 'dessert', name: 'Kulfi & jalebi station', price: 110, unit: 'guest', group: 'catering' },
    { id: 'stage-classic', name: 'Classic floral stage', price: 45000, unit: 'event', group: 'decor' },
    { id: 'stage-grand', name: 'Grand floral stage', price: 120000, unit: 'event', group: 'decor' },
    { id: 'mandap', name: 'Fresh-flower mandap', price: 85000, unit: 'event', group: 'decor' },
    { id: 'entrance', name: 'Entrance & aisle florals', price: 28000, unit: 'event', group: 'decor' },
    { id: 'kids-theme', name: "Kids' theme décor", price: 18000, unit: 'event', group: 'decor' },
    { id: 'pyro', name: 'Cold-pyro entry (4 shots)', price: 9500, unit: 'event', group: 'decor' },
    { id: 'booth', name: 'Photo booth with prints (3 hrs)', price: 16000, unit: 'event', group: 'decor' },
    { id: 'dj', name: 'DJ + 24 × 24 ft dance floor', price: 32000, unit: 'event', group: 'decor' },
    { id: 'hanger', name: 'Lawn rain hanger', price: 65000, unit: 'event', group: 'decor' }
  ];

  var GST_RATE = 0.18;

  function formatINR(n) { return '₹' + Math.round(n).toLocaleString('en-IN'); }
  function findHall(id) { return HALLS.filter(function (h) { return h.id === id; })[0]; }
  function findMenu(id) { return MENUS.filter(function (m) { return m.id === id; })[0]; }
  function findAddon(id) { return ADDONS.filter(function (a) { return a.id === id; })[0]; }

  /* Booking cost: hall slot + plates (minimum guarantee applies) + add-ons, then GST */
  function costBreakdown(opts) {
    var hall = findHall(opts.hallId); var menu = findMenu(opts.menuId);
    if (!hall || !menu) return null;
    var guests = Math.max(0, Number(opts.guests) || 0);
    var plates = Math.max(guests, hall.min);
    var hallCost = hall.slot[opts.slot === 'lunch' ? 'lunch' : 'dinner'];
    var catering = plates * menu.price;
    var addonCost = (opts.addons || []).reduce(function (sum, id) {
      var a = findAddon(id); if (!a) return sum;
      return sum + (a.unit === 'guest' ? a.price * plates : a.price);
    }, 0);
    var subtotal = hallCost + catering + addonCost;
    var gst = Math.round(subtotal * GST_RATE);
    return { hall: hall, menu: menu, plates: plates, hallCost: hallCost, catering: catering, addonCost: addonCost, subtotal: subtotal, gst: gst, total: subtotal + gst };
  }

  /* Expose for dashboard.js */
  window.MG = {
    store: store, EVENT_TYPES: EVENT_TYPES, HALLS: HALLS, MENUS: MENUS, ADDONS: ADDONS, GST_RATE: GST_RATE,
    formatINR: formatINR, findHall: findHall, findMenu: findMenu, findAddon: findAddon, costBreakdown: costBreakdown
  };

  /* ------------------------------------------------------------------
     2. Theme + direction preferences (apply on every page)
     ------------------------------------------------------------------ */
  var THEME_KEY = 'mg-theme';
  var DIR_KEY = 'mg-dir';

  function applyTheme(theme) {
    var dark = theme === 'dark';
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.textContent = dark ? '☀' : '☾';
      btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('title', dark ? 'Light mode' : 'Dark mode');
      btn.setAttribute('aria-pressed', String(dark));
    });
    document.dispatchEvent(new CustomEvent('mg:themechange', { detail: { theme: dark ? 'dark' : 'light' } }));
  }

  function applyDir(dir) {
    var rtl = dir === 'rtl';
    root.setAttribute('dir', rtl ? 'rtl' : 'ltr');
    document.querySelectorAll('[data-dir-toggle]').forEach(function (btn) {
      btn.innerHTML = '<span aria-hidden="true">⇄</span> ' + (rtl ? 'LTR' : 'RTL');
      btn.setAttribute('aria-label', rtl ? 'Switch to left-to-right layout' : 'Switch to right-to-left layout');
      btn.setAttribute('title', rtl ? 'Left-to-right layout' : 'Right-to-left layout');
      btn.setAttribute('aria-pressed', String(rtl));
    });
    document.dispatchEvent(new CustomEvent('mg:dirchange', { detail: { dir: rtl ? 'rtl' : 'ltr' } }));
  }

  window.MG.setTheme = function (theme) { store.set(THEME_KEY, theme); applyTheme(theme); };
  window.MG.setDir = function (dir) { store.set(DIR_KEY, dir); applyDir(dir); };

  applyTheme(store.get(THEME_KEY) || 'light');
  applyDir(store.get(DIR_KEY) || 'ltr');

  document.addEventListener('click', function (e) {
    var themeBtn = e.target.closest('[data-theme-toggle]');
    if (themeBtn) window.MG.setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    var dirBtn = e.target.closest('[data-dir-toggle]');
    if (dirBtn) window.MG.setDir(root.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl');
  });

  /* Keep tabs in sync when preferences change elsewhere */
  window.addEventListener('storage', function (e) {
    if (e.key === THEME_KEY && e.newValue) applyTheme(e.newValue);
    if (e.key === DIR_KEY && e.newValue) applyDir(e.newValue);
  });

  /* ------------------------------------------------------------------
     3. Header behaviour
     ------------------------------------------------------------------ */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Desktop "Home" dropdown: hover, click and keyboard support */
  var desktopQuery = window.matchMedia('(min-width: 1025px) and (hover: hover)');
  document.querySelectorAll('.has-dropdown').forEach(function (dd) {
    var btn = dd.querySelector('.dropdown-toggle');
    var menu = dd.querySelector('.dropdown');
    if (!btn || !menu) return;
    var links = Array.prototype.slice.call(menu.querySelectorAll('a'));
    var open = function () { dd.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); };
    var close = function () { dd.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (dd.classList.contains('is-open')) close(); else open();
    });
    dd.addEventListener('mouseenter', function () { if (desktopQuery.matches) open(); });
    dd.addEventListener('mouseleave', function () { if (desktopQuery.matches) close(); });
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); open(); links[0].focus(); }
    });
    menu.addEventListener('keydown', function (e) {
      var i = links.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); links[(i + 1) % links.length].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); links[(i - 1 + links.length) % links.length].focus(); }
      if (e.key === 'Escape') { close(); btn.focus(); }
    });
    dd.addEventListener('focusout', function (e) { if (!dd.contains(e.relatedTarget)) close(); });
    document.addEventListener('click', function (e) { if (!dd.contains(e.target)) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && dd.classList.contains('is-open')) { close(); btn.focus(); } });
  });

  /* Mobile slide-in panel */
  var burger = document.querySelector('.burger');
  var panel = document.getElementById('mobile-panel');
  var overlay = document.querySelector('.nav-overlay');
  if (burger && panel && overlay) {
    var focusables = function () {
      return [burger].concat(Array.prototype.slice.call(panel.querySelectorAll('a[href], button:not([disabled]), input, select')).filter(function (el) {
        return el.offsetParent !== null || el === burger;
      }));
    };
    var openNav = function () {
      panel.classList.add('is-open');
      overlay.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
      document.body.classList.add('nav-open');
      window.setTimeout(function () { var f = focusables(); if (f[1]) f[1].focus(); }, 60);
    };
    var closeNav = function (returnFocus) {
      panel.classList.remove('is-open');
      overlay.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('nav-open');
      if (returnFocus) burger.focus();
    };
    burger.addEventListener('click', function () {
      if (panel.classList.contains('is-open')) closeNav(true); else openNav();
    });
    overlay.addEventListener('click', function () { closeNav(true); });
    panel.addEventListener('click', function (e) { if (e.target.closest('a[href]')) closeNav(false); });
    document.addEventListener('click', function (e) {
      if (panel.classList.contains('is-open') && !panel.contains(e.target) && !burger.contains(e.target) && !header.contains(e.target)) closeNav(false);
    });
    document.addEventListener('keydown', function (e) {
      if (!panel.classList.contains('is-open')) return;
      if (e.key === 'Escape') { closeNav(true); return; }
      if (e.key === 'Tab') {
        var f = focusables(); var first = f[0]; var last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1024 && panel.classList.contains('is-open')) closeNav(false); });

    /* Home accordion inside the panel */
    panel.querySelectorAll('.accordion-toggle').forEach(function (t) {
      var sub = document.getElementById(t.getAttribute('aria-controls'));
      t.addEventListener('click', function () {
        var expanded = t.getAttribute('aria-expanded') === 'true';
        t.setAttribute('aria-expanded', String(!expanded));
        sub.classList.toggle('is-open', !expanded);
      });
    });
  }

  /* ------------------------------------------------------------------
     4. Reveal-on-scroll, footer year, FAQ accordions
     ------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  document.querySelectorAll('.acc-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.acc-item');
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      item.classList.toggle('is-open', !open);
    });
  });

  /* Shared form helpers */
  function isoDate(d) {
    var tz = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tz).toISOString().slice(0, 10);
  }
  function addDays(d, n) { var c = new Date(d); c.setDate(c.getDate() + n); return c; }
  function setError(input, message) {
    var field = input.closest('.field');
    if (!field) return;
    var msg = field.querySelector('.error-msg');
    field.classList.toggle('has-error', !!message);
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (msg) msg.textContent = message || '';
  }
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE_RE = /^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/;
  window.MG.isoDate = isoDate;
  window.MG.addDays = addDays;
  window.MG.setError = setError;
  window.MG.EMAIL_RE = EMAIL_RE;
  window.MG.PHONE_RE = PHONE_RE;

  /* ------------------------------------------------------------------
     5. Home 1 — quick availability check & hall finder
     ------------------------------------------------------------------ */
  var quick = document.getElementById('quickCheck');
  if (quick) {
    var qDate = quick.querySelector('#qcDate');
    qDate.min = isoDate(addDays(new Date(), 1));
    quick.addEventListener('submit', function (e) {
      e.preventDefault();
      var type = quick.querySelector('#qcEvent');
      var guests = quick.querySelector('#qcGuests');
      var ok = true;
      var g = Number(guests.value);
      if (!type.value) { setError(type, 'Choose your event type.'); ok = false; } else setError(type, '');
      if (!guests.value || g < 15 || g > 900) { setError(guests, 'Enter 15 to 900 guests.'); ok = false; } else setError(guests, '');
      if (!qDate.value || qDate.value < qDate.min) { setError(qDate, 'Pick a date from tomorrow onwards.'); ok = false; } else setError(qDate, '');
      if (!ok) return;
      var params = new URLSearchParams({ event: type.value, guests: String(g), date: qDate.value });
      window.location.href = quick.getAttribute('action') + '?' + params.toString() + '#enquiry';
    });
  }

  var finder = document.getElementById('hallFinder');
  if (finder) {
    var range = finder.querySelector('#guestRange');
    var readout = finder.querySelector('#guestValue');
    var result = document.getElementById('finderResult');
    var renderFinder = function () {
      var g = Number(range.value);
      var typeInput = finder.querySelector('input[name="finderType"]:checked');
      var type = typeInput ? typeInput.value : 'wedding';
      readout.textContent = g;
      range.setAttribute('aria-valuetext', g + ' guests');
      var fits = HALLS.filter(function (h) { return g >= h.min && g <= h.max; });
      var typed = fits.filter(function (h) { return h.types.indexOf(type) > -1; });
      var list = (typed.length ? typed : fits).slice().sort(function (a, b) { return a.max - b.max; });
      var best = list[0];
      var alt = list[1] || fits.filter(function (h) { return h !== best; })[0];
      if (!best) return;
      result.querySelector('img').src = 'assets/images/' + best.img;
      result.querySelector('img').alt = best.alt;
      result.querySelector('[data-f="tag"]').textContent = typed.length ? 'Best match for ' + EVENT_TYPES[type].toLowerCase() : 'Closest fit for ' + g + ' guests';
      result.querySelector('[data-f="name"]').textContent = best.name;
      result.querySelector('[data-f="seated"]').textContent = best.seated;
      result.querySelector('[data-f="floating"]').textContent = best.floating;
      result.querySelector('[data-f="area"]').textContent = best.area;
      result.querySelector('[data-f="why"]').textContent = best.why;
      result.querySelector('[data-f="price"]').textContent = formatINR(best.slot.dinner);
      var link = result.querySelector('[data-f="link"]');
      link.href = 'pages/halls.html#' + best.id;
      link.firstChild.textContent = 'See ' + best.name + ' details ';
      var altEl = result.querySelector('[data-f="alt"]');
      if (alt) {
        altEl.hidden = false;
        altEl.innerHTML = 'Also fits: <a href="pages/halls.html#' + alt.id + '">' + alt.name + '</a> (' + alt.min + '–' + alt.max + ' guests)';
      } else {
        altEl.hidden = true;
      }
    };
    range.addEventListener('input', renderFinder);
    finder.addEventListener('change', renderFinder);
    renderFinder();
  }

  /* ------------------------------------------------------------------
     6. Halls — filter cards by event type and guest count
     ------------------------------------------------------------------ */
  var hallFilter = document.getElementById('hallFilter');
  if (hallFilter) {
    var typeSel = hallFilter.querySelector('#hfType');
    var guestInp = hallFilter.querySelector('#hfGuests');
    var cards = document.querySelectorAll('[data-hall]');
    var countEl = document.getElementById('hallCount');
    var emptyEl = document.getElementById('hallEmpty');
    var runFilter = function () {
      var type = typeSel.value;
      var g = Number(guestInp.value);
      var shown = 0;
      cards.forEach(function (card) {
        var min = Number(card.dataset.min); var max = Number(card.dataset.max);
        var types = card.dataset.types.split(' ');
        var ok = (type === 'all' || types.indexOf(type) > -1) && (!g || (g >= min && g <= max));
        card.hidden = !ok;
        if (ok) shown++;
      });
      countEl.textContent = 'Showing ' + shown + ' of ' + cards.length + ' halls' + (g ? ' for ' + g + ' guests' : '') + (type !== 'all' ? ' · ' + EVENT_TYPES[type] : '');
      emptyEl.hidden = shown !== 0;
    };
    hallFilter.addEventListener('input', runFilter);
    hallFilter.addEventListener('change', runFilter);
    hallFilter.addEventListener('submit', function (e) { e.preventDefault(); });
    hallFilter.querySelector('[data-reset]').addEventListener('click', function () {
      typeSel.value = 'all'; guestInp.value = ''; runFilter();
    });
    runFilter();
  }

  /* ------------------------------------------------------------------
     7. Packages — live budget estimator
     ------------------------------------------------------------------ */
  var est = document.getElementById('estimator');
  if (est) {
    var out = function (key) { return document.querySelector('[data-est="' + key + '"]'); };
    var calc = function () {
      var hallId = est.querySelector('#estHall').value;
      var slot = est.querySelector('input[name="estSlot"]:checked').value;
      var guestsEl = est.querySelector('#estGuests');
      var guests = Number(guestsEl.value) || 0;
      var menuId = est.querySelector('#estMenu').value;
      var addons = Array.prototype.slice.call(est.querySelectorAll('input[name="estAddon"]:checked')).map(function (c) { return c.value; });
      var c = costBreakdown({ hallId: hallId, slot: slot, guests: guests, menuId: menuId, addons: addons });
      if (!c) return;
      var warn = '';
      if (guests > c.hall.max) warn = c.hall.name + ' holds up to ' + c.hall.max + ' guests. Pick a larger hall.';
      else if (guests < c.hall.min) warn = c.hall.name + ' bills a minimum of ' + c.hall.min + ' plates.';
      out('warning').textContent = warn;
      out('hall').textContent = formatINR(c.hallCost);
      out('hallLabel').textContent = c.hall.name + ' · ' + (slot === 'lunch' ? 'lunch' : 'dinner') + ' slot';
      out('catering').textContent = formatINR(c.catering);
      out('cateringLabel').textContent = c.plates + ' plates × ' + formatINR(c.menu.price) + ' (' + c.menu.name + ')';
      out('addons').textContent = formatINR(c.addonCost);
      out('gst').textContent = formatINR(c.gst);
      out('total').textContent = formatINR(c.total);
      out('i1').textContent = formatINR(c.total * 0.25);
      out('i2').textContent = formatINR(c.total * 0.5);
      out('i3').textContent = formatINR(c.total - Math.round(c.total * 0.25) - Math.round(c.total * 0.5));
      out('perGuest').textContent = formatINR(c.total / Math.max(guests, 1)) + ' per guest, all-in';
      var summary = 'Estimate from the Packages page: ' + c.hall.name + ' (' + slot + '), ' + guests + ' guests, ' + c.menu.name +
        (addons.length ? ', add-ons: ' + addons.map(function (id) { return findAddon(id).name; }).join(', ') : '') +
        '. Estimated total ' + formatINR(c.total) + ' incl. GST.';
      var params = new URLSearchParams({ hall: hallId, guests: String(guests), message: summary });
      out('cta').href = 'contact.html?' + params.toString() + '#enquiry';
    };
    est.addEventListener('input', calc);
    est.addEventListener('change', calc);
    est.addEventListener('submit', function (e) { e.preventDefault(); });
    calc();
  }

  /* ------------------------------------------------------------------
     8. Gallery — category filters + accessible lightbox
     ------------------------------------------------------------------ */
  var gallery = document.getElementById('galleryGrid');
  if (gallery) {
    var items = Array.prototype.slice.call(gallery.querySelectorAll('.g-item'));
    document.querySelectorAll('[data-gfilter]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var f = chip.dataset.gfilter;
        document.querySelectorAll('[data-gfilter]').forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        items.forEach(function (it) { it.hidden = !(f === 'all' || it.dataset.cat === f); });
        document.getElementById('galleryCount').textContent = 'Showing ' + items.filter(function (it) { return !it.hidden; }).length + ' photos';
      });
    });

    var lb = document.getElementById('lightbox');
    var lbImg = lb.querySelector('img');
    var lbCap = lb.querySelector('figcaption');
    var current = 0; var lastFocus = null;
    var visible = function () { return items.filter(function (it) { return !it.hidden; }); };
    var show = function (idx) {
      var list = visible();
      current = (idx + list.length) % list.length;
      var it = list[current]; var img = it.querySelector('img');
      var cat = it.querySelector('.g-cat').textContent;
      var title = it.querySelector('.g-cap').textContent.replace(cat, '').trim();
      lbImg.src = img.src; lbImg.alt = img.alt;
      lbCap.textContent = title;
      var small = document.createElement('small');
      small.textContent = cat + ' · ' + (current + 1) + ' of ' + list.length;
      lbCap.appendChild(small);
    };
    var openLb = function (it) {
      lastFocus = it;
      show(visible().indexOf(it));
      lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lb.querySelector('.lb-close').focus();
    };
    var closeLb = function () {
      lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };
    items.forEach(function (it) { it.addEventListener('click', function () { openLb(it); }); });
    lb.querySelector('.lb-close').addEventListener('click', closeLb);
    lb.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      var rtl = root.getAttribute('dir') === 'rtl';
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowRight') show(current + (rtl ? -1 : 1));
      if (e.key === 'ArrowLeft') show(current + (rtl ? 1 : -1));
      if (e.key === 'Tab') {
        var btns = Array.prototype.slice.call(lb.querySelectorAll('button'));
        var i = btns.indexOf(document.activeElement);
        e.preventDefault();
        btns[(i + (e.shiftKey ? -1 : 1) + btns.length) % btns.length].focus();
      }
    });
  }

  /* Gallery: keep the open-house list pointing at the next three first Sundays */
  (function () {
    var ohList = document.getElementById('openHouseDates');
    if (!ohList) return;
    var plan = ['Ballroom · Ivory &amp; Gold', 'Jasmine Lawn · Midnight Garden', 'Saffron Hall · Marigold Heritage', 'Lotus Room · Candy Carnival'];
    var sundays = []; var today = new Date(); today.setHours(0, 0, 0, 0);
    var cursor = new Date(today.getFullYear(), today.getMonth(), 1);
    while (sundays.length < 3) {
      var firstSunday = new Date(cursor);
      while (firstSunday.getDay() !== 0) firstSunday.setDate(firstSunday.getDate() + 1);
      if (firstSunday >= today) sundays.push(firstSunday);
      cursor.setMonth(cursor.getMonth() + 1);
    }
    ohList.innerHTML = sundays.map(function (day) {
      var label = day.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
      return '<li><span>' + label + '</span><b>' + plan[day.getMonth() % plan.length] + '</b></li>';
    }).join('');
  })();

  /* ------------------------------------------------------------------
     9. Contact — enquiry form (prefill from links, validate, confirm)
     ------------------------------------------------------------------ */
  var contact = document.getElementById('contactForm');
  if (contact) {
    var f = function (id) { return contact.querySelector('#' + id); };
    f('cDate').min = isoDate(addDays(new Date(), 1));

    /* Prefill from Home 1 quick check, Halls cards, Packages estimator */
    var params = new URLSearchParams(window.location.search);
    if (params.get('event') && EVENT_TYPES[params.get('event')]) f('cEvent').value = params.get('event');
    if (params.get('guests')) f('cGuests').value = params.get('guests');
    if (params.get('date')) f('cDate').value = params.get('date');
    if (params.get('hall') && findHall(params.get('hall'))) f('cHall').value = params.get('hall');
    if (params.get('message')) f('cMessage').value = params.get('message').slice(0, 600);
    if (params.toString()) {
      var note = document.getElementById('prefillNote');
      if (note) note.hidden = false;
    }

    var counter = document.getElementById('msgCount');
    var updateCount = function () { counter.textContent = f('cMessage').value.length + ' / 600'; };
    f('cMessage').addEventListener('input', updateCount);
    updateCount();

    var rules = {
      cName: function (v) { return v.trim().length < 2 ? 'Please enter your full name.' : ''; },
      cPhone: function (v) { return !PHONE_RE.test(v.trim()) ? 'Enter a 10-digit Indian mobile number, e.g. 98450 31260.' : ''; },
      cEmail: function (v) { return !EMAIL_RE.test(v.trim()) ? 'Enter a valid email address.' : ''; },
      cEvent: function (v) { return !v ? 'Choose the type of event.' : ''; },
      cDate: function (v) { return !v ? 'Choose your preferred date.' : (v < f('cDate').min ? 'Pick a date from tomorrow onwards.' : ''); },
      cGuests: function (v) { var n = Number(v); return !v || n < 15 || n > 900 ? 'Our halls host 15 to 900 guests.' : ''; },
      cMessage: function (v) { return v.length > 600 ? 'Please keep it under 600 characters.' : ''; }
    };
    Object.keys(rules).forEach(function (id) {
      f(id).addEventListener('blur', function () { setError(f(id), rules[id](f(id).value)); });
      f(id).addEventListener('input', function () { if (f(id).closest('.field').classList.contains('has-error')) setError(f(id), rules[id](f(id).value)); });
    });

    contact.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      Object.keys(rules).forEach(function (id) {
        var msg = rules[id](f(id).value); setError(f(id), msg);
        if (msg && !firstBad) firstBad = f(id);
      });
      if (firstBad) { firstBad.focus(); return; }
      var success = document.getElementById('contactSuccess');
      var dateText = new Date(f('cDate').value + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
      success.querySelector('[data-s="name"]').textContent = f('cName').value.trim().split(' ')[0];
      success.querySelector('[data-s="summary"]').textContent = EVENT_TYPES[f('cEvent').value] + ' for ' + f('cGuests').value + ' guests on ' + dateText;
      success.querySelector('[data-s="phone"]').textContent = f('cPhone').value.trim();
      contact.hidden = true;
      success.classList.add('is-visible');
      success.focus();
    });

    document.getElementById('contactAgain').addEventListener('click', function () {
      contact.reset(); updateCount();
      document.getElementById('contactSuccess').classList.remove('is-visible');
      contact.hidden = false;
      f('cName').focus();
    });
  }

  /* ------------------------------------------------------------------
     10. Sign In / Sign Up (front-end demo auth kept in localStorage)
     ------------------------------------------------------------------ */
  var SESSION_KEY = 'mg-session';
  var USERS_KEY = 'mg-users';
  /* Simple non-cryptographic hash so plain passwords are not stored (demo only) */
  function hash(str) { var h = 5381; for (var i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0; return h.toString(16); }
  function nameFromEmail(email) {
    var base = email.split('@')[0].replace(/[._-]+/g, ' ').trim();
    return base.replace(/\b\w/g, function (c) { return c.toUpperCase(); }) || 'Guest';
  }
  window.MG.SESSION_KEY = SESSION_KEY;

  /* Show / hide password buttons */
  document.querySelectorAll('[data-pw-toggle]').forEach(function (btn) {
    var input = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', function () {
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.textContent = show ? 'Hide' : 'Show';
      btn.setAttribute('aria-pressed', String(show));
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
  });

  var signin = document.getElementById('signinForm');
  if (signin) {
    var siEmail = signin.querySelector('#siEmail');
    var siPass = signin.querySelector('#siPassword');
    var siAlert = document.getElementById('signinAlert');
    var signinPanel = document.getElementById('signinPanel');
    var resetPanel = document.getElementById('resetPanel');

    signin.addEventListener('submit', function (e) {
      e.preventDefault();
      siAlert.classList.remove('is-visible');
      var email = siEmail.value.trim().toLowerCase();
      var eMsg = !email ? 'Enter your email address.' : (!EMAIL_RE.test(email) ? 'That email address looks incomplete.' : '');
      var pMsg = !siPass.value ? 'Enter your password.' : (siPass.value.length < 8 ? 'Passwords are at least 8 characters.' : '');
      setError(siEmail, eMsg); setError(siPass, pMsg);
      if (eMsg) { siEmail.focus(); return; }
      if (pMsg) { siPass.focus(); return; }
      var users = store.getJSON(USERS_KEY, []);
      var user = users.filter(function (u) { return u.email === email; })[0];
      if (user && user.pw !== hash(siPass.value)) {
        siAlert.textContent = 'That password doesn’t match the account for ' + email + '. Try again or reset it.';
        siAlert.classList.add('is-visible');
        siPass.focus();
        return;
      }
      store.setJSON(SESSION_KEY, { name: user ? user.name : nameFromEmail(email), email: email, since: Date.now(), remember: signin.querySelector('#siRemember').checked });
      var btn = signin.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Signing you in…';
      window.setTimeout(function () { window.location.href = 'dashboard.html'; }, 450);
    });

    /* Forgot password: swap panels on the same page */
    document.getElementById('forgotLink').addEventListener('click', function () {
      signinPanel.hidden = true; resetPanel.hidden = false;
      var re = document.getElementById('resetEmail');
      if (siEmail.value) re.value = siEmail.value;
      re.focus();
    });
    document.querySelectorAll('[data-back-signin]').forEach(function (b) {
      b.addEventListener('click', function () {
        resetPanel.hidden = true; signinPanel.hidden = false;
        document.getElementById('resetForm').hidden = false;
        document.getElementById('resetSuccess').classList.remove('is-visible');
        siEmail.focus();
      });
    });
    document.getElementById('resetForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var re = document.getElementById('resetEmail');
      var v = re.value.trim();
      var msg = !v ? 'Enter the email you booked with.' : (!EMAIL_RE.test(v) ? 'That email address looks incomplete.' : '');
      setError(re, msg);
      if (msg) { re.focus(); return; }
      document.querySelector('[data-s="resetEmail"]').textContent = v;
      e.target.hidden = true;
      var ok = document.getElementById('resetSuccess');
      ok.classList.add('is-visible'); ok.focus();
    });
  }

  var signup = document.getElementById('signupForm');
  if (signup) {
    var su = function (id) { return signup.querySelector('#' + id); };
    var meter = document.getElementById('pwStrength');
    var meterText = document.getElementById('pwStrengthText');
    var scorePw = function (pw) {
      var s = 0;
      if (pw.length >= 8) s++;
      if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
      if (/\d/.test(pw)) s++;
      if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) s++;
      return pw ? Math.max(1, s) : 0;
    };
    su('suPassword').addEventListener('input', function () {
      var s = scorePw(su('suPassword').value);
      meter.dataset.score = s;
      meterText.textContent = ['Use 8+ characters with a number.', 'Weak password', 'Fair password', 'Good password', 'Strong password'][s];
    });
    var suRules = {
      suName: function (v) { return v.trim().length < 2 ? 'Enter your full name.' : ''; },
      suEmail: function (v) { return !EMAIL_RE.test(v.trim()) ? 'Enter a valid email address.' : ''; },
      suPassword: function (v) { return v.length < 8 ? 'Use at least 8 characters.' : (!/\d/.test(v) || !/[A-Za-z]/.test(v) ? 'Mix letters and at least one number.' : ''); },
      suConfirm: function (v) { return !v ? 'Re-enter your password.' : (v !== su('suPassword').value ? 'Passwords don’t match.' : ''); }
    };
    Object.keys(suRules).forEach(function (id) {
      su(id).addEventListener('blur', function () { if (su(id).value) setError(su(id), suRules[id](su(id).value)); });
    });
    signup.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      Object.keys(suRules).forEach(function (id) {
        var msg = suRules[id](su(id).value); setError(su(id), msg);
        if (msg && !firstBad) firstBad = su(id);
      });
      var terms = su('suTerms');
      var termsMsg = document.getElementById('termsError');
      termsMsg.textContent = terms.checked ? '' : 'Please accept the venue booking terms.';
      if (!terms.checked && !firstBad) firstBad = terms;
      var alertBox = document.getElementById('signupAlert');
      alertBox.classList.remove('is-visible');
      if (firstBad) { firstBad.focus(); return; }
      var email = su('suEmail').value.trim().toLowerCase();
      var users = store.getJSON(USERS_KEY, []);
      if (users.some(function (u) { return u.email === email; })) {
        alertBox.innerHTML = 'An account with ' + email + ' already exists. <a href="signin.html">Sign in instead</a>.';
        alertBox.classList.add('is-visible');
        return;
      }
      var name = su('suName').value.trim();
      users.push({ name: name, email: email, pw: hash(su('suPassword').value), created: Date.now() });
      store.setJSON(USERS_KEY, users);
      store.setJSON(SESSION_KEY, { name: name, email: email, since: Date.now(), isNew: true });
      var btn = signup.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Creating your account…';
      window.setTimeout(function () { window.location.href = 'dashboard.html'; }, 450);
    });
  }
})();
