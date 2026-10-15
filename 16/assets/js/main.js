/* ==========================================================================
   Strand & Steel — main.js (shared by every page)

   Loaded in <head> on purpose: the saved theme and direction are applied
   before the page paints, so there is no flash of the wrong theme.
   Everything that touches the DOM waits for DOMContentLoaded.

   1. Saved preferences (theme + direction) via localStorage
   2. Header: scroll shadow, theme/direction toggles (smooth View Transition swaps)
   3. Navigation: Home dropdown, mobile slide-in panel, focus trap
   4. Reveal-on-scroll: staggered entrances + count-up numbers
   5. Services: "Not sure what to book?" finder
   6. Pricing (and Services care guide): accessible tabs
   6b. Pricing: visit estimator
   7. Gallery: filters (+ "see all" links) + lightbox
   8. Home 2: quick booking widget
   8b. Home 2: walk-in guide — today + current time slot
   9. Contact: open-now status, form prefill, validation & success message
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var KEYS = { theme: 'strandsteel-theme', dir: 'strandsteel-dir' };

  /* ------------------------------------------------------------------------
     1. Saved preferences — storage can be unavailable (private mode or
        strict file:// settings), so every access is wrapped in try/catch.
     ------------------------------------------------------------------------ */
  function readPref(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function savePref(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* ignore */ }
  }

  var savedTheme = readPref(KEYS.theme);
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : (prefersDark ? 'dark' : 'light'));
  root.setAttribute('dir', readPref(KEYS.dir) === 'rtl' ? 'rtl' : 'ltr');
  root.classList.add('js');

  document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initToggles();
    initNav();
    initReveal();
    initFinder();
    initTabs();
    initEstimator();
    initGallery();
    initQuickBook();
    initWalkIn();
    initOpenStatus();
    initBookingForm();
  });

  /* Small helpers */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function isRTL() { return root.getAttribute('dir') === 'rtl'; }
  function focusables(container) {
    return $all('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', container)
      .filter(function (el) { return el.offsetParent !== null || el === document.activeElement; });
  }
  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  // Ease a number in an element from its last value (data-value) to `to`
  function countTo(el, to, format, opts) {
    opts = opts || {};
    var from = opts.from !== undefined ? opts.from : parseFloat(el.getAttribute('data-value'));
    el.setAttribute('data-value', to);
    window.cancelAnimationFrame(el._countFrame);
    if (reducedMotion() || isNaN(from) || from === to) { el.textContent = format(to); return; }
    var duration = opts.duration || 500;
    var start = null;
    el.textContent = format(from);
    function step(now) {
      if (start === null) start = now + (opts.delay || 0);
      var p = Math.max(0, Math.min((now - start) / duration, 1));
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(from + (to - from) * eased);
      if (p < 1) el._countFrame = window.requestAnimationFrame(step);
    }
    el._countFrame = window.requestAnimationFrame(step);
  }

  /* ------------------------------------------------------------------------
     2. Header: shadow once the page scrolls; theme and direction toggles
     ------------------------------------------------------------------------ */
  function initHeader() {
    var header = $('.site-header');
    if (!header) return;
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function initToggles() {
    var themeBtn = $('.theme-toggle');
    var dirBtn = $('.dir-toggle');

    function paintTheme() {
      if (!themeBtn) return;
      var dark = root.getAttribute('data-theme') === 'dark';
      themeBtn.querySelector('.icon').textContent = dark ? '☀' : '☾'; // ☀ / ☾
      themeBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      themeBtn.setAttribute('title', dark ? 'Light theme' : 'Dark theme');
    }
    function paintDir() {
      if (!dirBtn) return;
      var rtl = isRTL();
      dirBtn.querySelector('.dir-label').textContent = rtl ? 'LTR' : 'RTL';
      dirBtn.setAttribute('aria-label', rtl ? 'Switch to left-to-right layout' : 'Switch to right-to-left layout');
      dirBtn.setAttribute('title', rtl ? 'Left-to-right layout' : 'Right-to-left layout');
    }

    paintTheme();
    paintDir();

    // Swap theme/direction inside a View Transition when the browser has one:
    // the theme grows out of the toggle as a circle, direction cross-fades.
    function smoothSwap(apply, fromButton) {
      if (!document.startViewTransition || reducedMotion()) { apply(); return; }
      root.classList.add('vt-instant');
      if (fromButton) root.classList.add('vt-circle');
      var transition = document.startViewTransition(apply);
      var cleanup = function () { root.classList.remove('vt-instant', 'vt-circle'); };
      transition.finished.then(cleanup, cleanup);
      if (!fromButton) return;
      transition.ready.then(function () {
        var box = fromButton.getBoundingClientRect();
        var x = box.left + box.width / 2;
        var y = box.top + box.height / 2;
        var radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
        root.animate(
          { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + radius + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 650, easing: 'cubic-bezier(.22, .61, .36, 1)', pseudoElement: '::view-transition-new(root)' }
        );
      }, function () {});
    }

    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        smoothSwap(function () {
          root.setAttribute('data-theme', next);
          paintTheme();
        }, themeBtn);
        savePref(KEYS.theme, next);
      });
    }
    if (dirBtn) {
      dirBtn.addEventListener('click', function () {
        var next = isRTL() ? 'ltr' : 'rtl';
        smoothSwap(function () {
          root.setAttribute('dir', next);
          paintDir();
        });
        savePref(KEYS.dir, next);
      });
    }
  }

  /* ------------------------------------------------------------------------
     3. Navigation
        Desktop: "Home" dropdown (click, hover, keyboard).
        <=1024px: slide-in panel with the dropdown as an accordion.
        Closes on link click, outside click or Esc; locks page scroll;
        traps keyboard focus while open.
     ------------------------------------------------------------------------ */
  function initNav() {
    var toggle = $('.nav-toggle');
    var nav = $('#site-nav');
    var backdrop = $('.nav-backdrop');
    if (!toggle || !nav) return;

    var mobileQuery = window.matchMedia('(max-width: 1024px)');
    var dropdownToggles = $all('.dropdown-toggle');

    function isOpen() { return root.classList.contains('nav-open'); }

    function closeDropdowns(except) {
      dropdownToggles.forEach(function (btn) {
        if (btn !== except) btn.setAttribute('aria-expanded', 'false');
      });
    }

    function openNav() {
      root.classList.add('nav-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      if (backdrop) backdrop.hidden = false;
      // move focus into the panel once it starts sliding in
      window.setTimeout(function () {
        var first = focusables(nav)[0];
        if (first) first.focus();
      }, 60);
    }

    function closeNav(returnFocus) {
      root.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      closeDropdowns();
      if (backdrop) {
        window.setTimeout(function () { if (!isOpen()) backdrop.hidden = true; }, 300);
      }
      if (returnFocus) toggle.focus();
    }

    toggle.addEventListener('click', function () {
      if (isOpen()) closeNav(false); else openNav();
    });
    if (backdrop) backdrop.addEventListener('click', function () { closeNav(true); });

    // Home dropdown / accordion
    dropdownToggles.forEach(function (btn) {
      btn.addEventListener('click', function (event) {
        event.stopPropagation();
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        closeDropdowns(btn);
        btn.setAttribute('aria-expanded', String(!expanded));
      });
      // desktop: close the dropdown when keyboard focus leaves it
      btn.parentElement.addEventListener('focusout', function (event) {
        if (mobileQuery.matches) return;
        if (!btn.parentElement.contains(event.relatedTarget)) btn.setAttribute('aria-expanded', 'false');
      });
    });

    // close the panel after choosing a link
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a') && isOpen()) closeNav(false);
    });

    // outside click closes the panel and any open dropdown
    document.addEventListener('click', function (event) {
      if (!event.target.closest('.has-dropdown')) closeDropdowns();
      if (isOpen() && !nav.contains(event.target) && !toggle.contains(event.target)) closeNav(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        var openDropdown = $('.dropdown-toggle[aria-expanded="true"]');
        if (isOpen()) {
          closeNav(true);
        } else if (openDropdown) {
          closeDropdowns();
          openDropdown.focus();
        }
      }
      // focus trap: keep Tab inside the panel and its close button
      if (event.key === 'Tab' && isOpen()) {
        var items = [toggle].concat(focusables(nav));
        var first = items[0];
        var last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }
    });

    // leaving the mobile breakpoint resets the panel
    var onBreakpoint = function () { if (!mobileQuery.matches && isOpen()) closeNav(false); };
    if (mobileQuery.addEventListener) mobileQuery.addEventListener('change', onBreakpoint);
    else if (mobileQuery.addListener) mobileQuery.addListener(onBreakpoint);
  }

  /* ------------------------------------------------------------------------
     4. Reveal-on-scroll (skipped when IntersectionObserver is missing).
        Items that come into view together cascade in; [data-count] numbers
        inside them count up. Once an item has landed, data-reveal is removed
        so the component's own hover transitions take over.
     ------------------------------------------------------------------------ */
  function initReveal() {
    var items = $all('[data-reveal]');
    if (!items.length) return;

    function startCounts(el, delay) {
      $all('[data-count]', el).forEach(function (n) {
        var target = parseFloat(n.getAttribute('data-count'));
        var decimals = (n.getAttribute('data-count').split('.')[1] || '').length;
        countTo(n, target, function (v) { return v.toFixed(decimals); }, { from: 0, duration: 1400, delay: delay + 200 });
      });
    }

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      var batch = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = Math.min(batch++, 5) * 90;
        el.style.setProperty('--reveal-delay', delay + 'ms');
        el.classList.add('is-visible');
        observer.unobserve(el);
        startCounts(el, delay);
        window.setTimeout(function () {
          el.removeAttribute('data-reveal');
          el.style.removeProperty('--reveal-delay');
        }, delay + 1700);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------------------------------------------------------
     5. Services — service finder. All answers live in the HTML; the script
        only shows the one that matches the chosen goal.
     ------------------------------------------------------------------------ */
  function initFinder() {
    var finder = $('[data-finder]');
    if (!finder) return;
    var buttons = $all('[data-goal]', finder);
    var results = $all('[data-result]', finder);

    function show(goal) {
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-goal') === goal)); });
      results.forEach(function (r) { r.hidden = r.getAttribute('data-result') !== goal; });
    }
    buttons.forEach(function (b) {
      b.addEventListener('click', function () { show(b.getAttribute('data-goal')); });
    });
    if (buttons[0]) show(buttons[0].getAttribute('data-goal'));
  }

  /* ------------------------------------------------------------------------
     6. Pricing — tabs (arrow keys, Home/End; arrows follow RTL direction)
     ------------------------------------------------------------------------ */
  function initTabs() {
    $all('[data-tabs]').forEach(function (wrapper) {
      var tablist = $('[role="tablist"]', wrapper);
      var tabs = $all('[role="tab"]', wrapper);
      var panels = $all('[role="tabpanel"]', wrapper);
      if (!tablist || !tabs.length) return;
      tablist.hidden = false;
      wrapper.classList.add('tabs-ready');

      function select(tab, moveFocus) {
        tabs.forEach(function (t) {
          var active = t === tab;
          t.setAttribute('aria-selected', String(active));
          t.tabIndex = active ? 0 : -1;
        });
        panels.forEach(function (p) { p.hidden = p.id !== tab.getAttribute('aria-controls'); });
        if (moveFocus) tab.focus();
      }

      tabs.forEach(function (tab, index) {
        tab.addEventListener('click', function () { select(tab, false); });
        tab.addEventListener('keydown', function (event) {
          var step = 0;
          if (event.key === 'ArrowRight') step = isRTL() ? -1 : 1;
          if (event.key === 'ArrowLeft') step = isRTL() ? 1 : -1;
          if (step) {
            event.preventDefault();
            select(tabs[(index + step + tabs.length) % tabs.length], true);
          } else if (event.key === 'Home') {
            event.preventDefault(); select(tabs[0], true);
          } else if (event.key === 'End') {
            event.preventDefault(); select(tabs[tabs.length - 1], true);
          }
        });
      });
      select(tabs[0], false);
    });
  }

  /* ------------------------------------------------------------------------
     6b. Pricing — visit estimator. Prices and times live on the <option>s
         and add-on checkboxes as data attributes; this only adds them up.
     ------------------------------------------------------------------------ */
  function initEstimator() {
    var form = $('[data-estimator]');
    if (!form) return;
    var service = form.elements.service;
    var levels = $all('input[name="level"]', form);
    var addons = $all('input[name="addon"]', form);
    var hint = $('[data-est-hint]', form);
    var fromEl = $('[data-est-from]', form);
    var totalEl = $('[data-est-total]', form);
    var timeEl = $('[data-est-time]', form);
    var linesEl = $('[data-est-lines]', form);
    var announce = $('[data-est-announce]', form);
    var bookLink = $('[data-est-book]', form);
    var bookBase = bookLink.getAttribute('href').split(/[?#]/)[0];

    function duration(mins) {
      var h = Math.floor(mins / 60);
      var m = mins % 60;
      return [h ? h + ' hr' : '', m ? m + ' min' : ''].join(' ').trim();
    }
    function line(label, value) {
      var li = document.createElement('li');
      var name = document.createElement('span');
      var price = document.createElement('span');
      name.textContent = label;
      price.textContent = value;
      li.appendChild(name);
      li.appendChild(price);
      return li;
    }

    function update(event) {
      var opt = service.options[service.selectedIndex];
      var prices = opt.getAttribute('data-prices').split(',');
      var flat = prices.length === 1;
      var from = opt.hasAttribute('data-from');

      // flat-rate barbering ignores the level; some services skip a level
      levels.forEach(function (input, i) { input.disabled = flat || prices[i] === '-'; });
      var level = null;
      if (!flat) {
        level = levels.filter(function (i) { return i.checked && !i.disabled; })[0] ||
                levels.filter(function (i) { return !i.disabled; })[0];
        level.checked = true;
      }
      var note = opt.getAttribute('data-note') || (flat ? 'Barbering is one flat rate, whichever barber you see.' : '');
      hint.textContent = note;
      hint.hidden = !note;

      var base = parseInt(prices[flat ? 0 : levels.indexOf(level)], 10);
      var total = base;
      var mins = parseInt(opt.getAttribute('data-time'), 10);
      linesEl.textContent = '';
      linesEl.appendChild(line(opt.textContent + (level ? ' · ' + level.value : ''), (from ? 'from $' : '$') + base));
      addons.forEach(function (a) {
        if (!a.checked) return;
        var price = parseInt(a.getAttribute('data-price'), 10);
        total += price;
        mins += parseInt(a.getAttribute('data-time'), 10);
        linesEl.appendChild(line(a.value, '+$' + price));
      });

      fromEl.hidden = !from;
      // the big total eases to its new value; screen readers get one clean sentence instead
      countTo(totalEl, total, function (v) { return '$' + Math.round(v); });
      timeEl.textContent = duration(mins);
      if (event) announce.textContent = 'Estimate: ' + (from ? 'from ' : '') + '$' + total + ', about ' + duration(mins) + '.';
      var book = opt.getAttribute('data-book');
      bookLink.href = bookBase + (book ? '?service=' + encodeURIComponent(book) : '') + '#booking';
    }

    form.addEventListener('change', update);
    form.addEventListener('submit', function (event) { event.preventDefault(); });
    update();
  }

  /* ------------------------------------------------------------------------
     7. Gallery — category filters and an accessible lightbox
     ------------------------------------------------------------------------ */
  function initGallery() {
    var grid = $('[data-gallery]');
    if (!grid) return;
    var items = $all('.gallery-item', grid);
    var filterButtons = $all('[data-filter]');
    var status = $('[data-filter-status]');

    function applyFilter(category, animate) {
      var shown = 0;
      items.forEach(function (item) {
        var match = category === 'all' || item.getAttribute('data-category') === category;
        item.hidden = !match;
        item.classList.remove('is-entering');
        if (match) shown += 1;
      });
      if (animate) {
        void grid.offsetWidth;                         // restart the entrance for every visible look
        items.filter(function (i) { return !i.hidden; }).forEach(function (item, index) {
          item.style.setProperty('--i', index);
          item.classList.add('is-entering');
        });
      }
      filterButtons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === category)); });
      if (status) status.textContent = 'Showing ' + shown + ' of ' + items.length + ' looks';
    }
    filterButtons.forEach(function (b) {
      b.addEventListener('click', function () { applyFilter(b.getAttribute('data-filter'), true); });
    });
    // "See all cuts" style links elsewhere on the page jump up with the filter applied
    $all('[data-show-filter]').forEach(function (link) {
      link.addEventListener('click', function () { applyFilter(link.getAttribute('data-show-filter'), true); });
    });
    applyFilter('all');

    // Lightbox
    var box = $('[data-lightbox]');
    if (!box) return;
    var boxImg = $('img', box);
    var boxTitle = $('[data-lb-title]', box);
    var boxMeta = $('[data-lb-meta]', box);
    var closeBtn = $('.lb-close', box);
    var prevBtn = $('.lb-prev', box);
    var nextBtn = $('.lb-next', box);
    var current = 0;
    var opener = null;

    function visibleItems() { return items.filter(function (i) { return !i.hidden; }); }

    function render(item) {
      var img = $('img', item);
      boxImg.classList.remove('is-swapping');
      void boxImg.offsetWidth;                         // replay the cross-fade on every photo change
      boxImg.classList.add('is-swapping');
      boxImg.src = img.getAttribute('src');
      boxImg.alt = img.getAttribute('alt');
      boxTitle.textContent = $('figcaption strong', item).textContent;
      boxMeta.textContent = $('figcaption span', item).textContent;
    }
    function open(item) {
      var list = visibleItems();
      current = list.indexOf(item);
      opener = document.activeElement;
      render(item);
      box.hidden = false;
      root.classList.add('lightbox-open');
      closeBtn.focus();
    }
    function close() {
      box.hidden = true;
      root.classList.remove('lightbox-open');
      if (opener) opener.focus();
    }
    function step(delta) {
      var list = visibleItems();
      current = (current + delta + list.length) % list.length;
      render(list[current]);
    }

    items.forEach(function (item) {
      $('.gallery-open', item).addEventListener('click', function () { open(item); });
    });
    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', function () { step(-1); });
    nextBtn.addEventListener('click', function () { step(1); });
    box.addEventListener('click', function (event) { if (event.target === box) close(); });

    document.addEventListener('keydown', function (event) {
      if (box.hidden) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') step(isRTL() ? -1 : 1);
      if (event.key === 'ArrowLeft') step(isRTL() ? 1 : -1);
      if (event.key === 'Tab') {                       // keep focus inside the dialog
        var f = focusables(box);
        if (!f.length) return;
        if (event.shiftKey && document.activeElement === f[0]) { event.preventDefault(); f[f.length - 1].focus(); }
        else if (!event.shiftKey && document.activeElement === f[f.length - 1]) { event.preventDefault(); f[0].focus(); }
      }
    });
  }

  /* ------------------------------------------------------------------------
     8. Home 2 — quick booking widget: service options follow the chosen side
     ------------------------------------------------------------------------ */
  function initQuickBook() {
    var form = $('[data-quickbook]');
    if (!form) return;
    var select = $('select[name="service"]', form);
    var groups = $all('optgroup', select);

    function sync() {
      var side = (form.querySelector('input[name="side"]:checked') || {}).value || 'barber';
      groups.forEach(function (g) {
        var match = g.getAttribute('data-side') === side;
        g.disabled = !match;
        g.hidden = !match;
      });
      var chosen = select.options[select.selectedIndex];
      if (!chosen || chosen.parentElement.disabled) {
        var firstMatch = $('optgroup[data-side="' + side + '"] option', select);
        if (firstMatch) firstMatch.selected = true;
      }
    }
    $all('input[name="side"]', form).forEach(function (r) { r.addEventListener('change', sync); });
    sync();
  }

  /* ------------------------------------------------------------------------
     8b. Home 2 — walk-in guide: label today's row (initOpenStatus already
         highlights it via data-day) and outline the current time slot
     ------------------------------------------------------------------------ */
  var WALKIN_SLOT_ENDS = [11, 13, 15, 17, 18];   // hours; matches the table columns

  function initWalkIn() {
    var board = $('[data-walkin]');
    if (!board) return;
    var now = portlandNow();
    var row = $('tr[data-day="' + now.day + '"]', board);
    if (!row) return;

    var flag = document.createElement('span');
    flag.className = 'walkin-flag';
    flag.textContent = 'Today';
    row.cells[0].appendChild(flag);

    var hours = HOURS[now.day];
    if (!hours || now.minutes < hours[0] * 60) return;
    for (var i = 0; i < WALKIN_SLOT_ENDS.length; i++) {
      if (now.minutes < WALKIN_SLOT_ENDS[i] * 60) {
        var cell = row.cells[i + 1];
        if (cell && !$('.wait--closed', cell)) {
          cell.classList.add('is-now');
          var label = document.createElement('span');
          label.className = 'visually-hidden';
          label.textContent = ' (right now)';
          cell.appendChild(label);
        }
        return;
      }
    }
  }

  /* ------------------------------------------------------------------------
     9a. Contact — "open now" status using Portland time
     ------------------------------------------------------------------------ */
  var HOURS = { 0: [10, 16], 1: null, 2: [9, 20], 3: [9, 20], 4: [9, 20], 5: [9, 20], 6: [8, 17] };
  var DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function portlandNow() {
    try {
      var parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Los_Angeles', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23'
      }).formatToParts(new Date());
      var map = {};
      parts.forEach(function (p) { map[p.type] = p.value; });
      var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(map.weekday);
      return { day: day, minutes: parseInt(map.hour, 10) * 60 + parseInt(map.minute, 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), minutes: d.getHours() * 60 + d.getMinutes() };
    }
  }
  function formatHour(h) {
    var suffix = h >= 12 ? 'PM' : 'AM';
    var hour = h % 12 === 0 ? 12 : h % 12;
    return hour + ':00 ' + suffix;
  }

  function initOpenStatus() {
    var pill = $('[data-open-status]');
    var now = portlandNow();
    // highlight today's row in the opening-hours table
    $all('[data-day]').forEach(function (row) {
      row.classList.toggle('is-today', row.getAttribute('data-day').split(',').indexOf(String(now.day)) >= 0);
    });
    if (!pill) return;
    var label = $('[data-status-text]', pill);
    var today = HOURS[now.day];
    if (today && now.minutes >= today[0] * 60 && now.minutes < today[1] * 60) {
      pill.classList.add('is-open');
      label.textContent = 'Open now · until ' + formatHour(today[1]) + ' (Portland time)';
      return;
    }
    // find the next opening time
    for (var i = 0; i < 8; i++) {
      var day = (now.day + i) % 7;
      var hours = HOURS[day];
      if (!hours) continue;
      if (i === 0 && now.minutes >= hours[0] * 60) continue;
      pill.classList.add('is-closed');
      label.textContent = 'Closed now · opens ' + (i === 0 ? 'today' : i === 1 ? 'tomorrow' : DAY_NAMES[day]) + ' at ' + formatHour(hours[0]);
      return;
    }
  }

  /* ------------------------------------------------------------------------
     9b. Contact — booking form: prefill from links, validate, confirm
     ------------------------------------------------------------------------ */
  function initBookingForm() {
    var form = $('[data-booking-form]');
    if (!form) return;

    var fields = {
      name: form.elements.name,
      email: form.elements.email,
      phone: form.elements.phone,
      service: form.elements.service,
      pro: form.elements.pro,
      date: form.elements.date,
      time: form.elements.time,
      notes: form.elements.notes,
      policy: form.elements.policy
    };
    var success = $('[data-booking-success]');
    var alertBox = $('[data-form-alert]', form);
    var counter = $('[data-notes-count]', form);
    var submitted = false;

    // date limits: today .. 90 days ahead
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var maxDate = new Date(today.getTime() + 90 * 86400000);
    var iso = function (d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
    fields.date.min = iso(today);
    fields.date.max = iso(maxDate);

    // prefill from links such as contact.html?service=event#booking
    function hasOption(select, value) {
      return Array.prototype.some.call(select.options, function (o) { return o.value === value; });
    }
    var shortcuts = {
      event: 'Wedding or event enquiry',
      gift: 'Gift card request',
      consult: 'Free 15-minute consultation'
    };
    var params = new URLSearchParams(window.location.search);
    var serviceParam = params.get('service');
    var sideParam = params.get('side');
    var proParam = params.get('pro');
    var whenParam = params.get('when');
    if (serviceParam && shortcuts[serviceParam]) serviceParam = shortcuts[serviceParam];
    if (serviceParam && hasOption(fields.service, serviceParam)) {
      fields.service.value = serviceParam;
    } else if (sideParam === 'barber' || sideParam === 'salon') {
      fields.service.value = sideParam === 'barber' ? 'Classic cut' : "Women's cut & style";
    }
    if (proParam && hasOption(fields.pro, proParam)) fields.pro.value = proParam;
    if (whenParam) {
      var whenText = { 'this-week': 'This week, please.', 'next-week': 'Next week works best.', 'flexible': "I'm flexible on dates." }[whenParam];
      if (whenText && !fields.notes.value) fields.notes.value = 'Timing: ' + whenText + ' ';
    }

    function updateCount() {
      if (counter) counter.textContent = fields.notes.value.length + ' / 500';
    }
    fields.notes.addEventListener('input', updateCount);
    updateCount();

    function parseDate(value) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
      var bits = value.split('-');
      var d = new Date(+bits[0], +bits[1] - 1, +bits[2]);
      return isNaN(d.getTime()) ? null : d;
    }

    // each rule returns an error message or ''
    var rules = {
      name: function (v) { return v.trim().length < 2 ? 'Please enter your full name.' : ''; },
      email: function (v) {
        if (!v.trim()) return 'Please enter your email address.';
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please enter a valid email, like name@example.com.';
      },
      phone: function (v) {
        var digits = v.replace(/\D/g, '');
        if (!digits.length) return 'Please enter a phone number so we can text your confirmation.';
        return digits.length < 10 || digits.length > 15 ? 'Please enter a phone number with at least 10 digits.' : '';
      },
      service: function (v) { return v ? '' : 'Please choose a service.'; },
      date: function (v) {
        var d = parseDate(v);
        if (!d) return 'Please choose a preferred date.';
        if (d < today) return 'Please choose a date from today onwards.';
        if (d > maxDate) return 'We book up to 90 days ahead — please choose an earlier date.';
        if (d.getDay() === 1) return "We're closed on Mondays — please pick another day.";
        return '';
      },
      time: function (v) {
        if (!v) return 'Please choose a preferred time of day.';
        var d = parseDate(fields.date.value);
        if (d && (d.getDay() === 6 || d.getDay() === 0) && v === 'Evening') {
          return 'We close early on weekends — please choose morning or afternoon.';
        }
        return '';
      },
      notes: function (v) { return v.length > 500 ? 'Please keep notes under 500 characters.' : ''; },
      policy: function () { return fields.policy.checked ? '' : 'Please confirm you have read the booking policies.'; }
    };

    function check(name) {
      var field = fields[name];
      var message = rules[name](field.value || '');
      var error = $('#err-' + name, form);
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (error) error.textContent = message;
      return !message;
    }

    // live re-validation after the first submit attempt
    Object.keys(rules).forEach(function (name) {
      var field = fields[name];
      var evt = field.type === 'checkbox' || field.tagName === 'SELECT' || field.type === 'date' ? 'change' : 'input';
      field.addEventListener(evt, function () {
        if (submitted) check(name);
        if (name === 'date' && submitted) check('time');
      });
      field.addEventListener('blur', function () { if (field.value) check(name); });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      submitted = true;
      var firstInvalid = null;
      Object.keys(rules).forEach(function (name) {
        if (!check(name) && !firstInvalid) firstInvalid = fields[name];
      });
      if (firstInvalid) {
        alertBox.hidden = false;
        alertBox.textContent = 'Please fix the highlighted fields and try again.';
        firstInvalid.focus();
        return;
      }
      alertBox.hidden = true;

      // Show a confirmation summary (no data leaves the browser on this static site)
      var d = parseDate(fields.date.value);
      var niceDate = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      $('[data-success-name]', success).textContent = fields.name.value.trim().split(' ')[0];
      $('[data-success-service]', success).textContent = fields.service.value;
      $('[data-success-pro]', success).textContent = fields.pro.value;
      $('[data-success-when]', success).textContent = niceDate + ', ' + fields.time.value.toLowerCase();
      $('[data-success-contact]', success).textContent = fields.phone.value.trim() + ' · ' + fields.email.value.trim();
      form.hidden = true;
      success.hidden = false;
      $('h3', success).focus();
    });

    var again = $('[data-book-again]');
    if (again) {
      again.addEventListener('click', function () {
        form.reset();
        submitted = false;
        Object.keys(fields).forEach(function (name) {
          fields[name].removeAttribute('aria-invalid');
          var err = $('#err-' + name, form);
          if (err) err.textContent = '';
        });
        updateCount();
        success.hidden = true;
        form.hidden = false;
        fields.name.focus();
      });
    }
  }
})();
