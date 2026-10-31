/* ==========================================================================
   Lumora Optical & Eye Care — main.js
   --------------------------------------------------------------------------
   Plain JavaScript, no libraries. Every feature checks that its markup exists,
   so the same file runs safely on every page.

   1.  Helpers
   2.  Theme toggle (light / dark, saved in localStorage)
   3.  Direction toggle (LTR / RTL, saved in localStorage)
   4.  Header: scroll shadow, Home dropdown, mobile slide-in panel
   5.  Store open / closed status (Bengaluru time)
   6.  Home 1: face-shape frame finder (tabs)
   7.  Home 2: "Is it time for an eye test?" self-check
   8.  Filters (Products frames, Brands directory)
   9.  Products: lens thickness advisor
   10. Form validation helpers
   11. Eye Test: appointment picker + booking form
   12. Contact: enquiry form
   13. Footer year
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- 1. Helpers ---------- */
  var root = document.documentElement;
  var KEYS = { theme: 'lumora-theme', dir: 'lumora-dir' };

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* storage blocked: choice lasts for this page only */ }
  }

  function getParam(name) {
    var match = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.search);
    return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : '';
  }

  function formatRupees(n) {
    return '₹' + n.toLocaleString('en-IN');
  }

  /* Current date/time in Bengaluru (IST, UTC+5:30) regardless of visitor time zone */
  function nowInBengaluru() {
    var d = new Date();
    return new Date(d.getTime() + (d.getTimezoneOffset() + 330) * 60000);
  }

  function isoDate(d) {
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  }

  /* ---------- 2. Theme toggle ---------- */
  function applyTheme(theme) {
    var dark = theme === 'dark';
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    $all('.theme-toggle').forEach(function (btn) {
      btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      var sym = $('.sym', btn);
      if (sym) sym.textContent = dark ? '☀' : '☾';
    });
  }

  applyTheme(root.getAttribute('data-theme'));
  $all('.theme-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      store(KEYS.theme, next);
    });
  });

  /* ---------- 3. Direction toggle ---------- */
  function applyDir(dir) {
    var rtl = dir === 'rtl';
    root.setAttribute('dir', rtl ? 'rtl' : 'ltr');
    $all('.dir-toggle').forEach(function (btn) {
      btn.setAttribute('aria-label', rtl ? 'Switch to left-to-right layout' : 'Switch to right-to-left layout');
      var label = $('.dir-label', btn);
      if (label) label.textContent = rtl ? 'LTR' : 'RTL';
    });
  }

  applyDir(root.getAttribute('dir'));
  $all('.dir-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = root.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
      applyDir(next);
      store(KEYS.dir, next);
    });
  });

  /* ---------- 4. Header & navigation ---------- */
  var header = $('.site-header');
  var burger = $('.nav-burger');
  var nav = $('#site-nav');
  var overlay = $('.nav-overlay');
  var mobileQuery = window.matchMedia('(max-width: 1024px)');

  // Shadow once the page scrolls
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Home dropdown: click to toggle (desktop also opens on hover via CSS)
  function setDropdown(item, open) {
    item.classList.toggle('open', open);
    var toggle = $('.dropdown-toggle', item);
    if (toggle) toggle.setAttribute('aria-expanded', String(open));
  }

  $all('.has-dropdown').forEach(function (item) {
    var toggle = $('.dropdown-toggle', item);
    if (!toggle) return;
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      setDropdown(item, !item.classList.contains('open'));
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', function (e) {
    $all('.has-dropdown.open').forEach(function (item) {
      if (!item.contains(e.target)) setDropdown(item, false);
    });
  });

  // Mobile panel
  function navIsOpen() { return document.body.classList.contains('nav-open'); }

  function openNav() {
    document.body.classList.add('nav-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    var first = $('a, button', nav);
    // wait for the panel to become visible before moving focus
    window.setTimeout(function () { if (first) first.focus(); }, 60);
  }

  function closeNav(returnFocus) {
    if (!navIsOpen()) return;
    document.body.classList.remove('nav-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    $all('.has-dropdown.open', nav).forEach(function (item) { setDropdown(item, false); });
    if (returnFocus) burger.focus();
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      if (navIsOpen()) { closeNav(false); } else { openNav(); }
    });

    if (overlay) overlay.addEventListener('click', function () { closeNav(false); });

    // Close after choosing a page link
    $all('a', nav).forEach(function (link) {
      link.addEventListener('click', function () { if (mobileQuery.matches) closeNav(false); });
    });

    // Close on any click outside the panel and the burger
    document.addEventListener('click', function (e) {
      if (navIsOpen() && !nav.contains(e.target) && !burger.contains(e.target)) closeNav(false);
    });

    // Keep keyboard focus inside the open panel (burger + panel controls)
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !navIsOpen()) return;
      var focusables = [burger].concat($all('a[href], button:not([disabled])', nav).filter(function (el) {
        return el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden';
      }));
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    // Leaving the mobile breakpoint resets the panel
    var onBreakpoint = function (q) { if (!q.matches) closeNav(false); };
    if (mobileQuery.addEventListener) mobileQuery.addEventListener('change', onBreakpoint);
    else if (mobileQuery.addListener) mobileQuery.addListener(onBreakpoint);
  }

  // Esc closes the panel first, then any open dropdown
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (burger && navIsOpen()) { closeNav(true); return; }
    $all('.has-dropdown.open').forEach(function (item) {
      setDropdown(item, false);
      var toggle = $('.dropdown-toggle', item);
      if (toggle) toggle.focus();
    });
  });

  /* ---------- 5. Store open / closed status ---------- */
  // Minutes from midnight. Sunday = 0. Eye tests stop one hour before closing.
  var HOURS = { 0: [660, 1080], 1: [600, 1230], 2: [600, 1230], 3: [600, 1230], 4: [600, 1230], 5: [600, 1230], 6: [600, 1230] };

  // 630 -> "10:30 am"; whole hours drop ":00" unless `full` is set (used for slots)
  function clock(mins, full) {
    var h = Math.floor(mins / 60), m = mins % 60;
    var suffix = h >= 12 ? 'pm' : 'am';
    var h12 = h % 12 || 12;
    return h12 + (m || full ? ':' + (m < 10 ? '0' : '') + m : '') + ' ' + suffix;
  }

  function storeStatus() {
    var now = nowInBengaluru();
    var day = now.getDay();
    var mins = now.getHours() * 60 + now.getMinutes();
    var today = HOURS[day];
    if (mins >= today[0] && mins < today[1]) {
      return {
        open: true,
        text: 'Open now · closes ' + clock(today[1]),
        sub: mins < today[1] - 60 ? 'Walk-in eye tests until ' + clock(today[1] - 60) : 'Eye tests finished for today'
      };
    }
    if (mins < today[0]) {
      return { open: false, text: 'Closed · opens ' + clock(today[0]) + ' today', sub: 'Book a slot online any time' };
    }
    var tomorrow = HOURS[(day + 1) % 7];
    return { open: false, text: 'Closed · opens ' + clock(tomorrow[0]) + ' tomorrow', sub: 'Book a slot online any time' };
  }

  var statusEls = $all('[data-store-status]');
  if (statusEls.length) {
    var s = storeStatus();
    statusEls.forEach(function (el) {
      el.classList.toggle('is-closed', !s.open);
      var t = $('[data-status-text]', el), sub = $('[data-status-sub]', el);
      if (t) t.textContent = s.text;
      if (sub) sub.textContent = s.sub;
    });
  }

  // Highlight today's row in the opening-hours table
  var todayNum = nowInBengaluru().getDay();
  $all('.hours tr[data-days]').forEach(function (row) {
    var days = row.getAttribute('data-days').split(',');
    if (days.indexOf(String(todayNum)) !== -1) {
      row.classList.add('is-today');
      var th = $('th', row);
      if (th) th.insertAdjacentHTML('beforeend', ' <span class="visually-hidden">(today)</span>');
    }
  });

  /* ---------- 6. Face-shape finder (ARIA tabs) ---------- */
  $all('[role="tablist"]').forEach(function (list) {
    var tabs = $all('[role="tab"]', list);

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
      tab.addEventListener('click', function () { select(tab, false); });
      tab.addEventListener('keydown', function (e) {
        var rtl = root.getAttribute('dir') === 'rtl';
        var next = rtl ? 'ArrowLeft' : 'ArrowRight';
        var prev = rtl ? 'ArrowRight' : 'ArrowLeft';
        var target = null;
        if (e.key === next) target = tabs[(i + 1) % tabs.length];
        else if (e.key === prev) target = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') target = tabs[0];
        else if (e.key === 'End') target = tabs[tabs.length - 1];
        if (target) { e.preventDefault(); select(target, true); }
      });
    });
  });

  /* ---------- 7. Self-check (Home 2) ---------- */
  var selfCheck = $('[data-selfcheck]');
  if (selfCheck) {
    var boxes = $all('input[type="checkbox"]', selfCheck);
    var title = $('[data-check-title]', selfCheck);
    var text = $('[data-check-text]', selfCheck);
    var link = $('[data-check-link]', selfCheck);
    var base = link.getAttribute('href').split('?')[0];

    var updateCheck = function () {
      var checked = boxes.filter(function (b) { return b.checked; });
      var values = checked.map(function (b) { return b.value; });
      var test = 'standard';

      if (!checked.length) {
        title.textContent = 'Nothing ticked yet';
        text.textContent = 'If your last test was within two years and your vision feels steady, you can wait until it is due.';
      } else if (values.indexOf('child') !== -1) {
        test = 'child';
        title.textContent = 'Suggested: Children’s Eye Test (₹500, 30 min)';
        text.textContent = 'Children rarely complain about blurry vision. A picture-chart test with a squint check will tell you quickly.';
      } else if (values.indexOf('risk') !== -1 || checked.length >= 3) {
        test = 'comprehensive';
        title.textContent = 'Suggested: Comprehensive Eye Exam (₹1,200, 45 min)';
        text.textContent = 'Several signs together, or a health risk, deserve an eye-pressure test and a retinal scan as well as a new prescription.';
      } else {
        title.textContent = 'Suggested: Standard Eye Test (₹350, 20 min)';
        text.textContent = 'A quick refraction should sort this out, and the fee comes off if you buy a complete pair.';
      }
      link.setAttribute('href', base + '?test=' + test + '#book');
    };

    boxes.forEach(function (b) { b.addEventListener('change', updateCheck); });
    updateCheck();
  }

  /* ---------- 8. Filters (products, brands) ---------- */
  $all('[data-filter-scope]').forEach(function (scope) {
    var chips = $all('[data-filter]', scope);
    var items = $all('[data-category]', scope);
    var count = $('[data-filter-count]', scope);
    var noun = count ? count.getAttribute('data-noun') : 'items';

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var value = chip.getAttribute('data-filter');
        var shown = 0;
        chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        items.forEach(function (item) {
          var match = value === 'all' || item.getAttribute('data-category').split(' ').indexOf(value) !== -1;
          item.hidden = !match;
          if (match) shown += 1;
        });
        if (count) {
          count.textContent = value === 'all'
            ? 'Showing all ' + shown + ' ' + noun
            : 'Showing ' + shown + ' of ' + items.length + ' ' + noun;
        }
      });
    });
  });

  /* ---------- 9. Lens thickness advisor (Products) ---------- */
  var advisor = $('[data-advisor]');
  if (advisor) {
    var range = $('input[type="range"]', advisor);
    var powerOut = $('[data-advisor-power]', advisor);
    var pickOut = $('[data-advisor-pick]', advisor);
    var textOut = $('[data-advisor-text]', advisor);
    var stdBar = $('[data-bar-standard]', advisor);
    var pickBar = $('[data-bar-pick]', advisor);
    var stdMm = $('[data-mm-standard]', advisor);
    var pickMm = $('[data-mm-pick]', advisor);
    var pickLabel = $('[data-pick-label]', advisor);

    // index, label, upgrade price, minimum thickness (mm)
    var LENSES = [
      { n: 1.50, name: '1.50 standard', price: 0, base: 2.0 },
      { n: 1.60, name: '1.60 thin', price: 1400, base: 1.8 },
      { n: 1.67, name: '1.67 thinner', price: 2800, base: 1.6 },
      { n: 1.74, name: '1.74 ultra-thin', price: 5500, base: 1.5 }
    ];

    // Approximate thickest point of a 50 mm lens: base + r² × |P| / (2000 × (n − 1))
    var thickness = function (lens, p) {
      var sag = (25 * 25 * Math.abs(p)) / (2000 * (lens.n - 1));
      return (p > 0 ? 1.6 : lens.base) + sag;
    };

    var updateAdvisor = function () {
      var p = parseFloat(range.value);
      var a = Math.abs(p);
      var lens = a <= 2 ? LENSES[0] : a <= 4 ? LENSES[1] : a <= 6 ? LENSES[2] : LENSES[3];
      var sign = p > 0 ? '+' : p < 0 ? '−' : '';
      var label = sign + a.toFixed(2);
      powerOut.textContent = '\u2066' + label + '\u2069'; // isolate so the sign stays in front in RTL
      range.setAttribute('aria-valuetext', label + ' dioptres');

      pickOut.textContent = lens.name + (lens.price ? ' · +' + formatRupees(lens.price) : ' · included');
      if (a === 0) {
        textOut.textContent = 'No power on this eye — standard lenses are all you need.';
      } else if (lens.price === 0) {
        textOut.textContent = 'At ' + label + ' standard 1.50 lenses stay slim, so there’s no need to pay for thinner material.';
      } else {
        textOut.textContent = (p < 0 ? 'Short-sighted lenses are thickest at the edge. ' : 'Long-sighted lenses are thickest in the centre. ') +
          'At ' + label + ' we recommend ' + lens.name + ' for a lighter, flatter lens.';
      }

      var std = thickness(LENSES[0], p);
      var pick = thickness(lens, p);
      var max = thickness(LENSES[0], 10); // scale bars to the strongest power on the slider
      stdBar.style.width = Math.min(100, (std / max) * 100) + '%';
      pickBar.style.width = Math.min(100, (pick / max) * 100) + '%';
      stdMm.textContent = std.toFixed(1) + ' mm';
      pickMm.textContent = pick.toFixed(1) + ' mm';
      pickLabel.textContent = lens.name.split(' ')[0] + ' pick';
    };

    range.addEventListener('input', updateAdvisor);
    updateAdvisor();
  }

  /* ---------- 10. Form validation helpers ---------- */
  var PHONE_RE = /^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/;
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(field, message) {
    var err = document.getElementById(field.id + '-error');
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (err) err.textContent = message;
  }

  function validateField(field) {
    var value = field.type === 'checkbox' ? '' : field.value.trim();
    var label = field.getAttribute('data-label') || 'This field';
    var msg = '';

    if (field.type === 'checkbox') {
      if (field.required && !field.checked) msg = 'Please tick this box to continue.';
    } else if (field.required && !value) {
      msg = field.tagName === 'SELECT' ? 'Please choose ' + label.toLowerCase() + '.' : label + ' is required.';
    } else if (value && field.type === 'email' && !EMAIL_RE.test(value)) {
      msg = 'Enter a valid email address, e.g. name@example.com.';
    } else if (value && field.getAttribute('data-validate') === 'phone' && !PHONE_RE.test(value)) {
      msg = 'Enter a 10-digit Indian mobile number, e.g. 98450 21734.';
    } else if (value && field.minLength > 0 && value.length < field.minLength) {
      msg = label + ' needs at least ' + field.minLength + ' characters.';
    } else if (value && field.type === 'number') {
      var n = Number(value);
      if (isNaN(n) || n < Number(field.min) || n > Number(field.max)) msg = 'Enter an age between ' + field.min + ' and ' + field.max + '.';
    }

    setError(field, msg);
    return !msg;
  }

  // Validates every field; focuses the first invalid one
  function validateForm(form) {
    var fields = $all('input, select, textarea', form).filter(function (f) { return f.id && f.type !== 'hidden'; });
    var firstBad = null;
    fields.forEach(function (f) {
      if (!validateField(f) && !firstBad) firstBad = f;
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  // Re-check a field as soon as the visitor fixes it
  function liveValidate(form) {
    $all('input, select, textarea', form).forEach(function (f) {
      var evt = f.type === 'checkbox' || f.tagName === 'SELECT' ? 'change' : 'blur';
      f.addEventListener(evt, function () { if (f.getAttribute('aria-invalid') !== null || f.value) validateField(f); });
      f.addEventListener('input', function () { if (f.getAttribute('aria-invalid') === 'true') validateField(f); });
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- 11. Eye Test booking ---------- */
  var booking = $('#booking-form');
  if (booking) {
    var testSelect = $('#b-test');
    var dateInput = $('#b-date');
    var timeSelect = $('#b-time');
    var success = $('#booking-success');
    var cards = $all('[data-test-card]');

    var TESTS = {
      standard: 'Standard Eye Test',
      comprehensive: 'Comprehensive Eye Exam',
      contact: 'Contact Lens Consultation',
      child: 'Children’s Eye Test'
    };

    var highlightCard = function () {
      cards.forEach(function (c) { c.classList.toggle('is-selected', c.getAttribute('data-test-card') === testSelect.value); });
    };

    // "Choose this test" buttons fill the form and jump to it
    $all('[data-choose-test]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        testSelect.value = btn.getAttribute('data-choose-test');
        validateField(testSelect);
        highlightCard();
        document.getElementById('book').scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.setTimeout(function () { dateInput.focus({ preventScroll: true }); }, 450);
      });
    });
    testSelect.addEventListener('change', highlightCard);

    // Preselect from ?test= (used by Home 2 self-check)
    var fromUrl = getParam('test');
    if (TESTS[fromUrl]) { testSelect.value = fromUrl; highlightCard(); }

    // Date limits: today to 60 days ahead (Bengaluru time)
    var today = nowInBengaluru();
    var maxDate = new Date(today.getTime() + 60 * 86400000);
    dateInput.min = isoDate(today);
    dateInput.max = isoDate(maxDate);

    // Build 30-minute slots; last slot one hour before closing
    var buildSlots = function () {
      timeSelect.innerHTML = '';
      if (!dateInput.value) {
        timeSelect.add(new Option('Choose a date first', ''));
        timeSelect.disabled = true;
        return;
      }
      var parts = dateInput.value.split('-');
      var chosen = new Date(+parts[0], +parts[1] - 1, +parts[2]);
      var hours = HOURS[chosen.getDay()];
      var now = nowInBengaluru();
      var isToday = dateInput.value === isoDate(now);
      var earliest = isToday ? now.getHours() * 60 + now.getMinutes() + 60 : 0;

      timeSelect.add(new Option('Select a time', ''));
      var count = 0;
      for (var m = hours[0]; m <= hours[1] - 60; m += 30) {
        if (m < earliest) continue;
        timeSelect.add(new Option(clock(m, true), clock(m, true)));
        count += 1;
      }
      if (!count) {
        timeSelect.innerHTML = '';
        timeSelect.add(new Option('No slots left today — pick another date', ''));
      }
      timeSelect.disabled = false;
    };
    dateInput.addEventListener('change', buildSlots);
    buildSlots();

    liveValidate(booking);

    booking.addEventListener('submit', function (e) {
      e.preventDefault();
      // Date outside the allowed window
      if (dateInput.value && (dateInput.value < dateInput.min || dateInput.value > dateInput.max)) {
        setError(dateInput, 'Choose a date between today and the next 60 days.');
        dateInput.focus();
        return;
      }
      if (!validateForm(booking)) return;

      var name = $('#b-name').value.trim().split(' ')[0];
      var parts = dateInput.value.split('-');
      var nice = new Date(+parts[0], +parts[1] - 1, +parts[2]).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

      success.innerHTML = '<strong>Thank you, ' + escapeHTML(name) + ' — your request is in.</strong>' +
        '<p>' + TESTS[testSelect.value] + ' on ' + nice + ' at ' + escapeHTML(timeSelect.value) +
        '. We’ll confirm by SMS to ' + escapeHTML($('#b-phone').value.trim()) + ' within two working hours.</p>';
      success.hidden = false;
      booking.reset();
      $all('[aria-invalid]', booking).forEach(function (f) { f.removeAttribute('aria-invalid'); });
      buildSlots();
      highlightCard();
      success.focus();
    });
  }

  /* ---------- 12. Contact form ---------- */
  var contact = $('#contact-form-el');
  if (contact) {
    var topic = $('#c-topic');
    var contactSuccess = $('#contact-success');
    var DESKS = {
      frames: 'opticians',
      test: 'clinic',
      reserve: 'counter',
      order: 'brand orders',
      repair: 'orders & repairs',
      corporate: 'corporate care',
      other: 'front'
    };

    // Preselect from ?topic= (Products "Reserve a Frame", Brands "Request a Model")
    var t = getParam('topic');
    if (DESKS[t]) topic.value = t;

    liveValidate(contact);

    contact.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(contact)) return;
      var first = $('#c-name').value.trim().split(' ')[0];
      var topicText = topic.options[topic.selectedIndex].text.toLowerCase();
      contactSuccess.innerHTML = '<strong>Thanks, ' + escapeHTML(first) + '! Your message has been sent.</strong>' +
        '<p>It’s with our ' + DESKS[topic.value] + ' desk (' + escapeHTML(topicText) + '). Expect a reply at ' +
        escapeHTML($('#c-email').value.trim()) + ' within two working hours, Monday to Saturday.</p>';
      contactSuccess.hidden = false;
      contact.reset();
      $all('[aria-invalid]', contact).forEach(function (f) { f.removeAttribute('aria-invalid'); });
      contactSuccess.focus();
    });
  }

  /* ---------- 13. Footer year ---------- */
  $all('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();
