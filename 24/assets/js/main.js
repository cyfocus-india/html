/* ==========================================================================
   Dashmile Couriers — main.js
   --------------------------------------------------------------------------
   Shared by every page (including Sign In, Sign Up and Dashboard).
   1. Preferences: theme + text direction (saved in localStorage)
   2. Header: Home dropdown, mobile slide-in panel, focus trap
   3. Rate engine (zones, services, quotes) — exposed as window.DM
   4. Page modules: quick track, PIN checker, tabs, rate calculator,
      tracking lookup, contact form, Sign In / Sign Up / reset password
   5. Small helpers: reveal-on-scroll, footer year
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  /* ---------- tiny utilities ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function write(key, val) { try { localStorage.setItem(key, val); } catch (e) { /* storage blocked */ } }
  function params() { return new URLSearchParams(window.location.search); }
  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ======================================================================
     1. Preferences — theme & direction
     ====================================================================== */
  var THEME_KEY = 'dm-theme';
  var DIR_KEY = 'dm-dir';

  function syncToggles() {
    var dark = root.getAttribute('data-theme') === 'dark';
    var rtl = root.getAttribute('dir') === 'rtl';
    $$('[data-theme-toggle]').forEach(function (btn) {
      var label = dark ? 'Switch to light theme' : 'Switch to dark theme';
      btn.textContent = dark ? '☀' : '☾';
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    });
    $$('[data-dir-toggle]').forEach(function (btn) {
      var label = rtl ? 'Switch to left-to-right layout' : 'Switch to right-to-left layout';
      btn.innerHTML = '<span class="dir-glyph" aria-hidden="true">⇄</span><span aria-hidden="true">' + (rtl ? 'LTR' : 'RTL') + '</span>';
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    });
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    write(THEME_KEY, theme);
    syncToggles();
    document.dispatchEvent(new CustomEvent('dm:prefs'));
  }

  function setDir(dir) {
    root.setAttribute('dir', dir);
    write(DIR_KEY, dir);
    syncToggles();
    document.dispatchEvent(new CustomEvent('dm:prefs'));
  }

  // The inline <head> script already applied saved values; make sure attributes exist.
  if (!root.getAttribute('data-theme')) root.setAttribute('data-theme', 'light');
  if (!root.getAttribute('dir')) root.setAttribute('dir', 'ltr');
  syncToggles();

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-theme-toggle]');
    if (t) setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    var d = e.target.closest('[data-dir-toggle]');
    if (d) setDir(root.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl');
  });

  /* ======================================================================
     2. Header — dropdown + mobile panel
     ====================================================================== */
  var header = $('.site-header');
  if (header && $('#main-nav', header)) initHeader(header);

  function initHeader(header) {
    var nav = $('#main-nav', header);
    var burger = $('.hamburger', header);
    var overlay = $('.nav-overlay');
    var mobile = window.matchMedia('(max-width: 1024px)');
    var subs = $$('.has-sub', header);

    // Shadow once the page scrolls
    function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    function closeSubs(except) {
      subs.forEach(function (item) {
        if (item === except) return;
        item.classList.remove('is-open');
        $('.sub-toggle', item).setAttribute('aria-expanded', 'false');
      });
    }

    subs.forEach(function (item) {
      var btn = $('.sub-toggle', item);
      btn.addEventListener('click', function () {
        var open = !item.classList.contains('is-open');
        closeSubs(item);
        item.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', String(open));
      });
      // Keep aria-expanded truthful for hover on desktop
      item.addEventListener('mouseenter', function () { if (!mobile.matches) btn.setAttribute('aria-expanded', 'true'); });
      item.addEventListener('mouseleave', function () {
        if (!mobile.matches && !item.classList.contains('is-open')) btn.setAttribute('aria-expanded', 'false');
      });
      // Arrow-down opens the menu and moves focus into it
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
          var first = $('.sub-menu a', item);
          // wait a frame so the menu is visible (it fades in) before moving focus
          if (first) window.setTimeout(function () { first.focus(); }, 40);
        }
      });
      $$('.sub-menu a', item).forEach(function (link, i, all) {
        link.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowDown') { e.preventDefault(); (all[i + 1] || all[0]).focus(); }
          if (e.key === 'ArrowUp') { e.preventDefault(); (all[i - 1] || all[all.length - 1]).focus(); }
        });
      });
      // Close the desktop dropdown when focus leaves it
      item.addEventListener('focusout', function (e) {
        if (!mobile.matches && !item.contains(e.relatedTarget)) {
          item.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    function isOpen() { return nav.classList.contains('is-open'); }

    function openMenu() {
      nav.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
      if (overlay) overlay.classList.add('is-visible');
      document.body.classList.add('no-scroll');
      var first = $('a, button', nav);
      window.setTimeout(function () { if (first) first.focus(); }, 60);
    }

    function closeMenu(returnFocus) {
      if (!isOpen()) return;
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      if (overlay) overlay.classList.remove('is-visible');
      document.body.classList.remove('no-scroll');
      if (returnFocus) burger.focus();
    }

    if (burger) {
      burger.addEventListener('click', function () { isOpen() ? closeMenu(false) : openMenu(); });
    }
    if (overlay) overlay.addEventListener('click', function () { closeMenu(false); });

    // Any link inside the panel closes it
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu(false);
    });

    // Outside click closes the panel and any open dropdown
    document.addEventListener('click', function (e) {
      if (isOpen() && !nav.contains(e.target) && !burger.contains(e.target) && !e.target.closest('.header-actions')) closeMenu(false);
      if (!e.target.closest('.has-sub')) closeSubs();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var openSub = subs.filter(function (s) { return s.classList.contains('is-open'); })[0];
        if (openSub && !mobile.matches) { closeSubs(); $('.sub-toggle', openSub).focus(); return; }
        if (isOpen()) closeMenu(true);
      }
      // Trap focus inside the header while the mobile panel is open
      if (e.key === 'Tab' && isOpen()) {
        var focusables = $$('a[href], button:not([disabled]), input', header).filter(function (el) {
          var style = window.getComputedStyle(el);
          return el.getClientRects().length && style.visibility !== 'hidden' && style.display !== 'none';
        });
        if (!focusables.length) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // Leaving the mobile breakpoint resets the panel
    var onChange = function () { if (!mobile.matches) closeMenu(false); closeSubs(); };
    if (mobile.addEventListener) mobile.addEventListener('change', onChange); else mobile.addListener(onChange);
  }

  /* ======================================================================
     3. Rate engine — zones, services and quotes (also used by dashboard.js)
     ====================================================================== */
  var ZONES = {
    L: { code: 'L', name: 'Local', label: 'Local — Pune & PCMC' },
    R: { code: 'R', name: 'Regional', label: 'Regional — Maharashtra & Goa' },
    M: { code: 'M', name: 'Metro', label: 'Metro — Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Ahmedabad' },
    N: { code: 'N', name: 'National', label: 'National — rest of India' },
    S: { code: 'S', name: 'Special', label: 'Special — North-East, J&K, Ladakh, Andaman' }
  };

  // Prices in ₹ before GST. unit = slab size in kg.
  var SERVICES = {
    next: { id: 'next', name: 'Next-Day Local', zones: ['L'], unit: 1, max: 30, first: 49, addl: 10, eta: 'Next working day by 7 PM' },
    same: { id: 'same', name: 'Same-Day', zones: ['L'], unit: 1, max: 20, first: 69, addl: 15, eta: 'Today by 9 PM (book by 1 PM)' },
    dash: { id: 'dash', name: 'Dash 90', zones: ['L'], unit: 1, max: 8, first: 149, addl: 20, eta: 'Within 90 minutes of pickup' },
    surface: {
      id: 'surface', name: 'Surface', zones: ['R', 'M', 'N', 'S'], unit: 0.5, max: 50,
      table: { R: [45, 35, 2, '1–2 days'], M: [65, 50, 4, '3–4 days'], N: [75, 60, 6, '4–6 days'], S: [110, 85, 8, '6–8 days'] }
    },
    air: {
      id: 'air', name: 'Air Express', zones: ['R', 'M', 'N', 'S'], unit: 0.5, max: 25,
      table: { R: [95, 70, 1, 'Next day'], M: [110, 85, 1, 'Next day'], N: [135, 100, 2, '2 days'], S: [185, 140, 3, '3 days'] }
    }
  };

  function zoneFor(pin) {
    pin = String(pin || '').trim();
    if (!/^[1-8]\d{5}$/.test(pin)) return null;
    var p2 = pin.slice(0, 2), p3 = pin.slice(0, 3), p4 = pin.slice(0, 4);
    if (p3 === '411' || p3 === '412' || p4 === '4105') return ZONES.L;
    if (['18', '19', '78', '79'].indexOf(p2) > -1 || p3 === '744') return ZONES.S;
    if (['110', '121', '122', '201', '560', '500', '600', '700', '380'].indexOf(p3) > -1) return ZONES.M;
    if (['40', '41', '42', '43', '44'].indexOf(p2) > -1) return ZONES.R;
    return ZONES.N;
  }

  function servicesFor(zone) {
    return Object.keys(SERVICES).map(function (k) { return SERVICES[k]; })
      .filter(function (s) { return zone && s.zones.indexOf(zone.code) > -1; });
  }

  function priceTerms(service, zone) {
    if (service.table) {
      var row = service.table[zone.code];
      return { first: row[0], addl: row[1], days: row[2], eta: row[3] };
    }
    return { first: service.first, addl: service.addl, days: 0, eta: service.eta };
  }

  function round2(n) { return Math.round(n * 100) / 100; }

  function quote(o) {
    var zone = zoneFor(o.pin);
    var service = SERVICES[o.service];
    if (!zone || !service || service.zones.indexOf(zone.code) === -1) return null;
    var terms = priceTerms(service, zone);
    var volumetric = (o.l > 0 && o.w > 0 && o.h > 0) ? (o.l * o.w * o.h) / 5000 : 0;
    var chargeable = Math.round(Math.max(o.weight || 0, volumetric) * 1000) / 1000;
    var slabs = Math.max(1, Math.ceil(chargeable / service.unit - 1e-9));
    var extra = (slabs - 1) * terms.addl;
    var cover = o.cover ? Math.max(30, Math.round((o.declared || 0) * 0.01)) : 0;
    var cod = o.cod ? Math.max(40, Math.round((o.codAmount || 0) * 0.02)) : 0;
    var subtotal = terms.first + extra + cover + cod;
    var gst = round2(subtotal * 0.18);
    return {
      zone: zone, service: service, terms: terms,
      volumetric: round2(volumetric), chargeable: chargeable, slabs: slabs,
      base: terms.first, extra: extra, cover: cover, cod: cod,
      subtotal: subtotal, gst: gst, total: round2(subtotal + gst),
      overweight: chargeable > service.max
    };
  }

  function money(n) {
    return '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Adds working days (skips Sundays) and returns a Date
  function addWorkingDays(date, days) {
    var d = new Date(date.getTime());
    while (days > 0) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0) days--;
    }
    return d;
  }

  function fmtDay(d) {
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  // "4:05 PM" style times (some locales return lowercase am/pm)
  function fmtTime(d) {
    return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }).replace(/am|pm/i, function (m) { return m.toUpperCase(); });
  }

  function fmtWhen(ts, now) {
    now = now || Date.now();
    var d = new Date(ts), n = new Date(now);
    var time = fmtTime(d);
    var dayDiff = Math.round((new Date(n.getFullYear(), n.getMonth(), n.getDate()) - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 864e5);
    if (dayDiff === 0) return 'Today, ' + time;
    if (dayDiff === 1) return 'Yesterday, ' + time;
    if (dayDiff === -1) return 'Tomorrow, ' + time;
    return fmtDay(d) + ', ' + time;
  }

  function etaFor(q) {
    var now = new Date();
    if (q.service.id === 'dash') return 'Within 90 minutes of pickup';
    if (q.service.id === 'same') return now.getHours() < 13 ? 'Today by 9 PM' : fmtDay(addWorkingDays(now, 1)) + ' by 9 PM (after 1 PM cut-off)';
    if (q.service.id === 'next') return fmtDay(addWorkingDays(now, 1)) + ' by 7 PM';
    var days = q.terms.days + (now.getHours() >= 17 ? 1 : 0);
    return 'By ' + fmtDay(addWorkingDays(now, days)) + ' (' + q.terms.eta + ')';
  }

  window.DM = {
    ZONES: ZONES, SERVICES: SERVICES, zoneFor: zoneFor, servicesFor: servicesFor, priceTerms: priceTerms,
    quote: quote, money: money, etaFor: etaFor, fmtWhen: fmtWhen, fmtDay: fmtDay, fmtTime: fmtTime, esc: esc,
    readStore: read, writeStore: write, setTheme: setTheme, setDir: setDir
  };

  /* ======================================================================
     4a. Home 1 — quick track form + PIN coverage checker
     ====================================================================== */
  var TRACK_RE = /^DM\d{8}$/;

  $$('[data-quick-track]').forEach(function (form) {
    var input = $('input', form);
    var note = $('[data-track-note]', form.parentNode);
    form.addEventListener('submit', function (e) {
      var val = input.value.trim().toUpperCase().replace(/\s+/g, '');
      input.value = val;
      if (!TRACK_RE.test(val)) {
        e.preventDefault();
        if (note) {
          note.textContent = 'Tracking numbers start with DM followed by 8 digits, e.g. DM48213076.';
          note.classList.add('is-error');
        }
        input.setAttribute('aria-invalid', 'true');
        input.focus();
      }
    });
  });

  var pinForm = $('[data-pin-check]');
  if (pinForm) {
    pinForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = $('input', pinForm);
      var out = $('[data-pin-result]');
      var pin = input.value.trim();
      var zone = zoneFor(pin);
      if (!zone) {
        input.setAttribute('aria-invalid', 'true');
        out.innerHTML = '<div class="notice notice--error"><span class="notice__icon" aria-hidden="true">!</span><div><strong>Please enter a valid 6-digit PIN code.</strong>Indian PIN codes start with a digit from 1 to 8.</div></div>';
        return;
      }
      input.removeAttribute('aria-invalid');
      var list = servicesFor(zone).map(function (s) {
        var t = priceTerms(s, zone);
        return '<li><strong>' + s.name + '</strong> — ' + (s.table ? t.eta : s.eta) + ', from ' + money(t.first).replace('.00', '') + '</li>';
      }).join('');
      out.innerHTML = '<div class="notice notice--success"><span class="notice__icon" aria-hidden="true">✓</span><div><strong>Yes, we deliver to ' + esc(pin) + ' (' + zone.label + ').</strong><ul class="mt-s">' + list + '</ul></div></div>';
    });
  }

  // Live "next cut-off" line under the Home 1 timeline
  var cutoffNow = $('[data-cutoff-now]');
  if (cutoffNow) {
    var CUTOFFS = [[11, 'Outer-ring same-day'], [13, 'City same-day'], [17, 'Air Express pickup'], [19, 'Last surface pickup'], [20, 'Last Dash 90 order']];
    var nowD = new Date();
    var nowTime = fmtTime(nowD);
    var mins = nowD.getHours() * 60 + nowD.getMinutes();
    var next = CUTOFFS.filter(function (c) { return c[0] * 60 > mins; })[0];
    var text;
    if (nowD.getDay() === 0) text = '<strong>It\'s Sunday.</strong> Regular cut-offs resume Monday at 9 AM. Sunday local delivery runs 10 AM to 4 PM.';
    else if (!next) text = '<strong>All of today\'s cut-offs have passed (' + nowTime + ').</strong> Bookings made now are collected from 9 AM tomorrow.';
    else {
      var left = next[0] * 60 - mins;
      var label = fmtTime(new Date(nowD.getFullYear(), nowD.getMonth(), nowD.getDate(), next[0]));
      text = '<strong>It\'s ' + nowTime + ' now.</strong> Next cut-off: ' + next[1] + ' at ' + label + ', ' + Math.floor(left / 60) + ' h ' + (left % 60) + ' min from now.';
    }
    cutoffNow.innerHTML = '<span class="notice__icon" aria-hidden="true">⏱</span><div>' + text + '</div>';
    cutoffNow.hidden = false;
  }

  /* ======================================================================
     4b. Home 2 — industry tabs (ARIA tabs pattern)
     ====================================================================== */
  $$('[data-tabs]').forEach(function (wrap) {
    var tabs = $$('[role="tab"]', wrap);
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
        var rtl = root.getAttribute('dir') === 'rtl';
        var next = rtl ? 'ArrowLeft' : 'ArrowRight';
        var prev = rtl ? 'ArrowRight' : 'ArrowLeft';
        if (e.key === next) { e.preventDefault(); select(tabs[(i + 1) % tabs.length], true); }
        if (e.key === prev) { e.preventDefault(); select(tabs[(i - 1 + tabs.length) % tabs.length], true); }
        if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
        if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
      });
    });
  });

  /* ======================================================================
     4c. Rate Calculator
     ====================================================================== */
  var calc = $('#rate-calc');
  if (calc) initCalculator(calc);

  function initCalculator(form) {
    var pinInput = $('#calc-to', form);
    var serviceBox = $('#calc-services', form);
    var result = $('#calc-result');
    var codToggle = $('#calc-cod', form);
    var coverToggle = $('#calc-cover', form);
    var hasCalculated = false;

    function fieldError(id, msg) {
      var input = $('#' + id, form);
      var field = input.closest('.field');
      var err = $('.field-error', field);
      field.classList.toggle('has-error', !!msg);
      if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
      if (err) err.textContent = msg || '';
      return !msg;
    }

    function renderServices() {
      var zone = zoneFor(pinInput.value);
      var current = ($('input[name="service"]:checked', form) || {}).value;
      if (!zone) {
        serviceBox.innerHTML = '<p class="service-placeholder">Enter a valid destination PIN to see the services available there.</p>';
        return;
      }
      var list = servicesFor(zone);
      var keep = list.some(function (s) { return s.id === current; });
      serviceBox.innerHTML = list.map(function (s, i) {
        var t = priceTerms(s, zone);
        var checked = keep ? s.id === current : i === (zone.code === 'L' ? 1 : 0);
        return '<div class="service-opt"><input type="radio" name="service" id="svc-' + s.id + '" value="' + s.id + '"' + (checked ? ' checked' : '') + '>' +
          '<label for="svc-' + s.id + '"><strong>' + s.name + '</strong><span>' + (s.table ? t.eta : s.eta) + ' · up to ' + s.max + ' kg</span></label></div>';
      }).join('');
    }

    function toggleExtra(toggle, id) {
      var box = $('#' + id, form);
      box.hidden = !toggle.checked;
    }

    function calculate(showErrors) {
      var to = pinInput.value.trim();
      var from = $('#calc-from', form).value.trim();
      var weight = parseFloat($('#calc-weight', form).value);
      var l = parseFloat($('#calc-l', form).value) || 0;
      var w = parseFloat($('#calc-w', form).value) || 0;
      var h = parseFloat($('#calc-h', form).value) || 0;
      var declared = parseFloat($('#calc-declared', form).value) || 0;
      var codAmount = parseFloat($('#calc-cod-amount', form).value) || 0;
      var svc = ($('input[name="service"]:checked', form) || {}).value;
      var ok = true;

      var fromZone = zoneFor(from);
      ok = fieldError('calc-from', !fromZone ? 'Enter your 6-digit pickup PIN.' : (fromZone.code !== 'L' ? 'We collect from Pune & PCMC only (PIN 411xxx, 412xxx or 4105xx).' : '')) && ok;
      ok = fieldError('calc-to', !zoneFor(to) ? 'Enter a valid 6-digit destination PIN.' : '') && ok;
      ok = fieldError('calc-weight', !(weight > 0) ? 'Enter the parcel weight in kg (e.g. 1.5).' : '') && ok;
      var dimsGiven = [l, w, h].filter(function (v) { return v > 0; }).length;
      var dimsField = $('#calc-l', form).closest('.field');
      var dimsErr = $('.field-error', dimsField);
      var dimsMsg = dimsGiven > 0 && dimsGiven < 3 ? 'Add all three dimensions, or leave them blank.' : '';
      dimsField.classList.toggle('has-error', !!dimsMsg);
      dimsErr.textContent = dimsMsg;
      ok = !dimsMsg && ok;
      if (coverToggle.checked) ok = fieldError('calc-declared', !(declared > 0) ? 'Enter the declared value to add Secure Cover.' : (declared > 200000 ? 'Secure Cover is available up to ₹2,00,000 per parcel.' : '')) && ok;
      else fieldError('calc-declared', '');
      if (codToggle.checked) ok = fieldError('calc-cod-amount', !(codAmount > 0) ? 'Enter the amount to collect.' : (codAmount > 50000 ? 'COD is limited to ₹50,000 per parcel.' : '')) && ok;
      else fieldError('calc-cod-amount', '');

      if (!ok || !svc) {
        if (showErrors) {
          var firstBad = $('.has-error input', form);
          if (firstBad) firstBad.focus();
        }
        return;
      }

      var q = quote({ pin: to, service: svc, weight: weight, l: l, w: w, h: h, declared: declared, cover: coverToggle.checked, cod: codToggle.checked, codAmount: codAmount });
      if (!q) return;
      if (q.overweight) {
        result.innerHTML = '<h2>Too heavy for ' + q.service.name + '</h2><div class="notice notice--error mt-s"><span class="notice__icon" aria-hidden="true">!</span><div><strong>Chargeable weight ' + q.chargeable + ' kg is above the ' + q.service.max + ' kg limit.</strong>Pick another service above or split the shipment into two parcels.</div></div>';
        return;
      }
      var unitLabel = q.service.unit === 1 ? 'kg' : '500 g';
      var rows = [
        ['Base freight (first ' + unitLabel + ')', money(q.base)],
        ['Additional weight (' + (q.slabs - 1) + ' × ' + money(q.terms.addl) + ')', money(q.extra)]
      ];
      if (q.cover) rows.push(['Secure Cover (1% of value, min ₹30)', money(q.cover)]);
      if (q.cod) rows.push(['Cash on Delivery fee (2%, min ₹40)', money(q.cod)]);
      rows.push(['GST @ 18%', money(q.gst)]);
      result.innerHTML =
        '<p class="eyebrow">Your estimate</p>' +
        '<h2>' + q.service.name + ' to ' + esc(to) + '</h2>' +
        '<div class="result-total"><span class="muted">Total payable</span><strong>' + money(q.total) + '</strong></div>' +
        '<div class="result-meta">' +
        '<div><span>Zone</span><span>' + q.zone.name + '</span></div>' +
        '<div><span>Chargeable weight</span><span>' + Math.round(q.chargeable * 100) / 100 + ' kg' + (q.volumetric > weight ? ' (volumetric)' : ' (actual)') + '</span></div>' +
        '<div><span>Estimated delivery</span><span>' + etaFor(q) + '</span></div></div>' +
        '<dl class="breakdown">' + rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>'; }).join('') +
        '<div class="is-total"><dt>Total</dt><dd>' + money(q.total) + '</dd></div></dl>' +
        '<a class="btn btn-block" href="contact.html?topic=pickup">Book this pickup</a>' +
        '<p class="hint mt-s">No fuel surcharge or pickup fee. Prices are valid for bookings made today.</p>';
      hasCalculated = true;
    }

    pinInput.addEventListener('input', function () {
      if (pinInput.value.trim().length === 6 || !pinInput.value) renderServices();
    });
    codToggle.addEventListener('change', function () { toggleExtra(codToggle, 'cod-extra'); if (hasCalculated) calculate(false); });
    coverToggle.addEventListener('change', function () { toggleExtra(coverToggle, 'cover-extra'); if (hasCalculated) calculate(false); });
    form.addEventListener('input', function () { if (hasCalculated) calculate(false); });
    form.addEventListener('change', function (e) { if (hasCalculated && e.target.name === 'service') calculate(false); });
    form.addEventListener('submit', function (e) { e.preventDefault(); calculate(true); if (window.innerWidth < 960) result.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    form.addEventListener('reset', function () {
      window.setTimeout(function () {
        hasCalculated = false;
        renderServices();
        toggleExtra(codToggle, 'cod-extra');
        toggleExtra(coverToggle, 'cover-extra');
        $$('.has-error', form).forEach(function (f) { f.classList.remove('has-error'); });
        $$('.field-error', form).forEach(function (f) { f.textContent = ''; });
        result.innerHTML = result.getAttribute('data-empty');
      }, 0);
    });
    result.setAttribute('data-empty', result.innerHTML);
    renderServices();
    toggleExtra(codToggle, 'cod-extra');
    toggleExtra(coverToggle, 'cover-extra');
  }

  /* ======================================================================
     4d. Tracking lookup (demo data generated relative to "now")
     ====================================================================== */
  function demoParcels() {
    var now = Date.now(), M = 6e4, H = 36e5, D = 864e5;
    return {
      DM48213076: {
        service: 'Same-Day', from: 'Kharadi, Pune 411014', to: 'Baner, Pune 411045', weight: '1.4 kg',
        status: 'Out for delivery', pill: 'pill--amber', step: 3,
        eta: fmtWhen(now + 70 * M, now) + ' (± 30 min)', proof: 'OTP sent to receiver',
        events: [
          [now - 50 * M, 'Out for delivery', 'Baner beat · Rider Sachin P. on an EV scooter'],
          [now - 3 * H, 'Sorted at hub', 'Hadapsar sortation hub, Pune'],
          [now - 4 * H - 10 * M, 'Picked up', 'Kharadi, Pune — 1 parcel, 1.4 kg'],
          [now - 5 * H, 'Booked', 'Online booking · Same-Day']
        ]
      },
      DM48207719: {
        service: 'Air Express', from: 'Hadapsar, Pune 411013', to: 'Koramangala, Bengaluru 560034', weight: '2.63 kg (volumetric)',
        status: 'In transit', pill: 'pill--info', step: 2,
        eta: fmtWhen(now + 6 * H, now), proof: 'Signature on delivery',
        events: [
          [now - 9 * H, 'Arrived at destination hub', 'Bengaluru partner hub, Hosur Road'],
          [now - 17 * H, 'Departed on flight', 'Pune Airport (PNQ) → Bengaluru (BLR)'],
          [now - 22 * H, 'Sorted at hub', 'Hadapsar sortation hub, Pune'],
          [now - 25 * H, 'Picked up', 'Hadapsar, Pune — 1 parcel'],
          [now - 26 * H, 'Booked', 'Customer dashboard · Air Express']
        ]
      },
      DM48199240: {
        service: 'Surface', from: 'Wakad, Pune 411057', to: 'Dharampeth, Nagpur 440010', weight: '1.2 kg',
        status: 'Delivered', pill: 'pill--success', step: 4,
        eta: 'Delivered ' + fmtWhen(now - D - 3 * H, now), proof: 'Received by R. Wankhede · OTP verified',
        events: [
          [now - D - 3 * H, 'Delivered', 'Dharampeth, Nagpur — handed to R. Wankhede, OTP verified'],
          [now - D - 5 * H, 'Out for delivery', 'Nagpur city beat'],
          [now - D - 10 * H, 'Arrived at destination hub', 'Nagpur partner hub, Wadi'],
          [now - 2 * D - 20 * H, 'Departed on linehaul truck', 'Pune → Nagpur via Aurangabad'],
          [now - 3 * D - H, 'Sorted at hub', 'Hadapsar sortation hub, Pune'],
          [now - 3 * D - 2 * H, 'Picked up', 'Wakad, Pune'],
          [now - 3 * D - 4 * H, 'Booked', 'Online booking · Surface']
        ]
      },
      DM48222105: {
        service: 'Same-Day', from: 'Shivajinagar, Pune 411005', to: 'Wakad, Pune 411057', weight: '0.8 kg',
        status: 'Delivery attempted', pill: 'pill--danger', step: 3, alert: true,
        eta: 'Next attempt ' + fmtWhen(new Date(new Date(now + D).setHours(10, 0, 0, 0)).getTime(), now) + ' – 1:00 PM', proof: 'Rider photo of the door logged',
        events: [
          [now - H, 'Delivery attempted', 'Receiver not reachable — two calls unanswered. Parcel back at Bhosari hub.'],
          [now - 3 * H, 'Out for delivery', 'Wakad beat · Rider Imran S.'],
          [now - 5 * H, 'Sorted at hub', 'Bhosari PCMC hub'],
          [now - 6 * H, 'Picked up', 'Shivajinagar, Pune'],
          [now - 7 * H, 'Booked', 'WhatsApp booking · Same-Day']
        ]
      }
    };
  }

  var trackForm = $('#track-form');
  if (trackForm) initTracking(trackForm);

  function initTracking(form) {
    var input = $('#track-id', form);
    var out = $('#track-output');
    var note = $('#track-note');
    var steps = ['Booked', 'Picked up', 'At hub / in transit', 'Out for delivery', 'Delivered'];

    function render(id) {
      var data = demoParcels()[id];
      if (!data) {
        out.innerHTML = '<div class="card track-placeholder"><span class="icon-tile" aria-hidden="true">🔍</span><h2>We couldn\'t find ' + esc(id) + '</h2><p class="muted">Check the 10-character number on your booking SMS or receipt. New bookings appear here about 15 minutes after the rider scans the parcel.</p><a class="link-arrow" href="contact.html?topic=tracking&id=' + encodeURIComponent(id) + '">Ask our support team <span class="arrow" aria-hidden="true">→</span></a></div>';
        return;
      }
      var progress = steps.map(function (s, i) {
        var cls = i < data.step ? 'done' : (i === data.step ? (data.step === 4 ? 'done' : (data.alert ? 'alert' : 'current')) : '');
        return '<li class="' + cls + '">' + s + '</li>';
      }).join('');
      var events = data.events.map(function (ev, i) {
        return '<li class="' + (i === 0 ? 'is-latest' : '') + '"><strong>' + ev[1] + '</strong><span class="t-meta">' + fmtWhen(ev[0]) + ' · ' + esc(ev[2]) + '</span></li>';
      }).join('');
      out.innerHTML =
        '<div class="track-result">' +
        '<div class="card"><div class="track-head"><div><span class="mono">' + id + '</span><h2>' + data.status + '</h2></div><span class="pill ' + data.pill + '">' + data.service + '</span></div>' +
        '<p class="muted">' + esc(data.from) + ' <span class="arrow" aria-hidden="true">→</span> ' + esc(data.to) + '</p>' +
        '<ol class="progress-steps" aria-label="Delivery progress">' + progress + '</ol>' +
        '<h3>Scan history</h3><ol class="timeline">' + events + '</ol></div>' +
        '<aside class="card"><h3>Parcel details</h3><dl class="detail-list">' +
        '<div><dt>' + (data.step === 4 ? 'Status' : 'Expected') + '</dt><dd>' + data.eta + '</dd></div>' +
        '<div><dt>Service</dt><dd>' + data.service + '</dd></div>' +
        '<div><dt>Weight</dt><dd>' + data.weight + '</dd></div>' +
        '<div><dt>Proof</dt><dd>' + data.proof + '</dd></div></dl>' +
        '<a class="link-arrow mt-s" href="contact.html?topic=tracking&id=' + id + '">' + (data.alert ? 'Reschedule this delivery' : 'Get help with this parcel') + ' <span class="arrow" aria-hidden="true">→</span></a></aside>' +
        '</div>';
    }

    function submit(id) {
      id = id.trim().toUpperCase().replace(/\s+/g, '');
      input.value = id;
      if (!TRACK_RE.test(id)) {
        input.setAttribute('aria-invalid', 'true');
        note.textContent = 'Tracking numbers start with DM followed by 8 digits, e.g. DM48213076.';
        note.classList.add('is-error');
        input.focus();
        return;
      }
      input.removeAttribute('aria-invalid');
      note.textContent = 'Showing live status for ' + id + '.';
      note.classList.remove('is-error');
      render(id);
      try { window.history.replaceState(null, '', '?id=' + id); } catch (e) { /* some browsers block this on file:// */ }
    }

    form.addEventListener('submit', function (e) { e.preventDefault(); submit(input.value); $('#result').scrollIntoView({ behavior: 'smooth' }); });
    $$('[data-sample-id]').forEach(function (btn) {
      btn.addEventListener('click', function () { submit(btn.getAttribute('data-sample-id')); $('#result').scrollIntoView({ behavior: 'smooth' }); });
    });
    var initial = params().get('id');
    if (initial) submit(initial);
  }

  /* ======================================================================
     4e. Contact form
     ====================================================================== */
  var contactForm = $('#contact-form');
  if (contactForm) initContact(contactForm);

  function setError(input, msg) {
    var field = input.closest('.field') || input.closest('.check-field');
    var err = field && $('.field-error', field);
    if (field) field.classList.toggle('has-error', !!msg);
    if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    if (err) err.textContent = msg || '';
    return !msg;
  }

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function initContact(form) {
    var p = params();
    var topic = p.get('topic');
    if (topic && $('#c-topic option[value="' + topic + '"]', form)) $('#c-topic', form).value = topic;
    if (p.get('id')) $('#c-ref', form).value = p.get('id').toUpperCase();

    $$('[data-topic]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var t = btn.getAttribute('data-topic');
        if (t && $('#c-topic option[value="' + t + '"]', form)) {
          $('#c-topic', form).value = t;
          var nameField = $('#c-name', form);
          if (nameField) nameField.focus();
        }
      });
    });

    function validate() {
      var ok = true;
      var name = $('#c-name', form), email = $('#c-email', form), phone = $('#c-phone', form);
      var topicSel = $('#c-topic', form), msg = $('#c-message', form), consent = $('#c-consent', form);
      ok = setError(name, name.value.trim().length < 2 ? 'Please enter your full name.' : '') && ok;
      ok = setError(email, !EMAIL_RE.test(email.value.trim()) ? 'Enter a valid email address, like name@company.com.' : '') && ok;
      var digits = phone.value.replace(/[\s-]/g, '').replace(/^\+?91/, '');
      ok = setError(phone, !/^[6-9]\d{9}$/.test(digits) ? 'Enter a 10-digit Indian mobile number.' : '') && ok;
      ok = setError(topicSel, !topicSel.value ? 'Choose what your message is about.' : '') && ok;
      ok = setError(msg, msg.value.trim().length < 20 ? 'Tell us a little more (at least 20 characters).' : '') && ok;
      ok = setError(consent, !consent.checked ? 'Please allow us to contact you about this request.' : '') && ok;
      return ok;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var success = $('#contact-success');
      if (!validate()) {
        success.hidden = true;
        var bad = $('[aria-invalid="true"]', form);
        if (bad) bad.focus();
        return;
      }
      var ref = 'DMC-' + String(Date.now()).slice(-6);
      var first = $('#c-name', form).value.trim().split(' ')[0];
      success.innerHTML = '<span class="notice__icon" aria-hidden="true">✓</span><div><strong>Thanks, ' + esc(first) + ' — your message is in.</strong>Reference ' + ref + '. Our desk replies within 2 working hours (Mon–Sat, 8 AM–9 PM). A copy is on its way to your inbox.</div>';
      success.hidden = false;
      form.reset();
      success.focus();
    });

    // Clear an error as soon as the field is fixed
    form.addEventListener('input', function (e) {
      var field = e.target.closest('.field, .check-field');
      if (field && field.classList.contains('has-error')) setError(e.target, '');
    });
    form.addEventListener('change', function (e) {
      var field = e.target.closest('.field, .check-field');
      if (field && field.classList.contains('has-error')) setError(e.target, '');
    });
  }

  /* ======================================================================
     4f. Sign In / Sign Up / Forgot password (demo auth in localStorage)
     ====================================================================== */
  var SESSION_KEY = 'dm-session';
  var USERS_KEY = 'dm-users';

  function hash(str) { // simple non-cryptographic hash so demo passwords are not stored as plain text
    var h = 5381;
    for (var i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
    return 'h' + (h >>> 0).toString(36);
  }
  function users() { try { return JSON.parse(read(USERS_KEY)) || []; } catch (e) { return []; } }
  function nameFromEmail(email) {
    return email.split('@')[0].split(/[._-]+/).filter(Boolean).map(function (w) {
      return w.charAt(0).toUpperCase() + w.slice(1);
    }).join(' ') || 'Customer';
  }
  function startSession(user, remember) {
    var data = JSON.stringify({ name: user.name, email: user.email, company: user.company || '', at: Date.now() });
    try {
      if (remember) { localStorage.setItem(SESSION_KEY, data); sessionStorage.removeItem(SESSION_KEY); }
      else { sessionStorage.setItem(SESSION_KEY, data); localStorage.removeItem(SESSION_KEY); }
    } catch (e) { /* storage blocked: dashboard falls back to demo profile */ }
  }
  function goToDashboard() {
    var next = params().get('next');
    var hashPart = next && /^(overview|book|pickups|tracking|shipments|invoices|settings)$/.test(next) ? '#' + next : '';
    window.location.href = 'dashboard.html' + hashPart;
  }

  // Show / hide password buttons
  $$('[data-reveal-password]').forEach(function (btn) {
    var input = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', function () {
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.textContent = show ? 'Hide' : 'Show';
      btn.setAttribute('aria-pressed', String(show));
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
  });

  var signinForm = $('#signin-form');
  if (signinForm) initSignin(signinForm);

  function initSignin(form) {
    var resetForm = $('#reset-form');
    var signinView = $('#signin-view');
    var resetView = $('#reset-view');
    var banner = $('#signin-banner');
    var p = params();

    if (p.get('logout')) {
      banner.className = 'notice notice--success';
      banner.innerHTML = '<span class="notice__icon" aria-hidden="true">✓</span><div><strong>You\'re signed out.</strong>See you on your next shipment.</div>';
      banner.hidden = false;
    } else if (p.get('next')) {
      banner.className = 'notice notice--info';
      banner.innerHTML = '<span class="notice__icon" aria-hidden="true">i</span><div><strong>' + (p.get('next') === 'book' || p.get('next') === 'pickups' ? 'Sign in to book a pickup.' : 'Sign in to open your dashboard.') + '</strong>New here? Creating an account takes under a minute.</div>';
      banner.hidden = false;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = $('#si-email', form), pass = $('#si-password', form);
      var ok = setError(email, !EMAIL_RE.test(email.value.trim()) ? 'Enter the email you registered with.' : '');
      ok = setError(pass, pass.value.length < 8 ? 'Your password has at least 8 characters.' : '') && ok;
      if (!ok) { $('[aria-invalid="true"]', form).focus(); return; }
      var addr = email.value.trim().toLowerCase();
      var found = users().filter(function (u) { return u.email === addr; })[0];
      if (found && found.pass !== hash(pass.value)) {
        setError(pass, 'That password doesn\'t match this account. Try again or reset it.');
        pass.focus();
        return;
      }
      startSession(found || { name: nameFromEmail(addr), email: addr }, $('#si-remember', form).checked);
      var btn = $('button[type="submit"]', form);
      btn.disabled = true;
      btn.textContent = 'Signing you in…';
      window.setTimeout(goToDashboard, 500);
    });

    function showReset(show) {
      signinView.hidden = show;
      resetView.hidden = !show;
      if (show) { $('#rs-email').value = $('#si-email').value; $('#rs-email').focus(); }
      else { $('#forgot-link').focus(); }
    }
    $('#forgot-link').addEventListener('click', function () { showReset(true); });
    $$('[data-back-signin]').forEach(function (b) {
      b.addEventListener('click', function () {
        $('#reset-success').hidden = true;
        resetForm.hidden = false;
        showReset(false);
      });
    });

    resetForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = $('#rs-email', resetForm);
      if (!setError(email, !EMAIL_RE.test(email.value.trim()) ? 'Enter a valid email address.' : '')) { email.focus(); return; }
      var msg = $('#reset-success');
      $('#reset-email-echo').textContent = email.value.trim();
      resetForm.hidden = true;
      msg.hidden = false;
      $('[data-back-signin]', msg).focus();
    });

    form.addEventListener('input', function (e) { if (e.target.closest('.has-error')) setError(e.target, ''); });
  }

  var signupForm = $('#signup-form');
  if (signupForm) initSignup(signupForm);

  function strength(pw) {
    var s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) s++;
    return pw ? Math.max(1, s) : 0;
  }

  function initSignup(form) {
    var pw = $('#su-password', form);
    var meter = $('#su-strength');
    var meterText = $('#su-strength-text');
    var labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    pw.addEventListener('input', function () {
      var s = strength(pw.value);
      meter.setAttribute('data-score', s);
      meterText.textContent = s ? 'Password strength: ' + labels[s] : 'Use 8+ characters with letters and a number.';
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#su-name', form), email = $('#su-email', form), confirm = $('#su-confirm', form), terms = $('#su-terms', form);
      var ok = setError(name, name.value.trim().length < 2 ? 'Enter your full name.' : '');
      ok = setError(email, !EMAIL_RE.test(email.value.trim()) ? 'Enter a valid work or personal email.' : '') && ok;
      var pwMsg = pw.value.length < 8 ? 'Use at least 8 characters.' : (!/[A-Za-z]/.test(pw.value) || !/\d/.test(pw.value) ? 'Include at least one letter and one number.' : '');
      ok = setError(pw, pwMsg) && ok;
      ok = setError(confirm, !confirm.value ? 'Re-enter your password.' : (confirm.value !== pw.value ? 'Passwords don\'t match.' : '')) && ok;
      ok = setError(terms, !terms.checked ? 'Please accept the shipping terms to continue.' : '') && ok;
      var addr = email.value.trim().toLowerCase();
      if (ok && users().some(function (u) { return u.email === addr; })) {
        ok = setError(email, 'An account with this email already exists. Sign in instead.');
      }
      if (!ok) { $('[aria-invalid="true"]', form).focus(); return; }
      var user = { name: name.value.trim(), email: addr, company: $('#su-company', form).value.trim(), pass: hash(pw.value) };
      var list = users();
      list.push(user);
      write(USERS_KEY, JSON.stringify(list));
      startSession(user, true);
      var btn = $('button[type="submit"]', form);
      btn.disabled = true;
      btn.textContent = 'Creating your account…';
      window.setTimeout(goToDashboard, 500);
    });

    form.addEventListener('input', function (e) { if (e.target.closest('.has-error')) setError(e.target, ''); });
    form.addEventListener('change', function (e) { if (e.target.closest('.has-error')) setError(e.target, ''); });
  }

  /* ======================================================================
     5. Reveal on scroll + footer year
     ====================================================================== */
  var revealEls = $$('[data-reveal]');
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

  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
