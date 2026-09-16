/*!
 * Wag & Whisker — main.js
 * Vanilla JavaScript, no dependencies. Every module checks for its own markup,
 * so the same file safely runs on every page.
 *
 *  1. Helpers & storage      9. Tabs, accordion, slider, scroller
 *  2. Theme (dark / light)  10. Toasts
 *  3. Direction (LTR / RTL) 11. Cart & wishlist
 *  4. Header & scroll       12. Quick view
 *  5. Navigation dropdowns  13. Shop filters
 *  6. Overlays (drawers,    14. Product page
 *     modals, search)       15. Home 2 pet picker, countdown, calculator
 *  7. Scroll reveal         16. Opening hours, blog & brand filters, TOC
 *  8. Counters              17. Form validation
 */
(function () {
  'use strict';

  /* 1. Helpers & storage ------------------------------------------------ */
  var d = document;
  var html = d.documentElement;
  var body = d.body;
  var ROOT = body.getAttribute('data-root') || '';
  var WW = (window.WW = window.WW || {});
  var DATA = WW.data || { products: [], pets: {}, brands: {}, categories: {} };
  var ICONS = WW.icons || {};
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduceMotion = function () { return mqReduce.matches; };

  function $(sel, ctx) { return (ctx || d).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || d).querySelectorAll(sel)); }
  function on(el, ev, fn, opts) { if (el) el.addEventListener(ev, fn, opts || false); }
  function isRTL() { return html.getAttribute('dir') === 'rtl'; }
  function inr(n) { return '₹' + Number(n).toLocaleString('en-IN'); }
  function escapeHTML(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function svg(name, cls) {
    return '<svg class="icon' + (cls ? ' ' + cls : '') + '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  }
  var store = {
    get: function (k, fallback) { try { var v = localStorage.getItem(k); return v === null ? fallback : JSON.parse(v); } catch (e) { return fallback; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
    raw: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    rawSet: function (k, v) { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };
  var productsById = {};
  (DATA.products || []).forEach(function (p) { productsById[p.id] = p; });
  function product(id) { return productsById[id]; }
  var articlesById = {};
  (DATA.articles || []).forEach(function (a) {
    articlesById[a.id] = a;
    if (a.slug) articlesById[a.slug] = a;
    (a.aliases || []).forEach(function (al) { articlesById[al] = a; });
  });
  function findArticle(id) {
    if (!id) return null;
    return articlesById[id] || articlesById[String(id).toLowerCase().trim()];
  }
  function petLabel(key) { return (DATA.pets[key] && DATA.pets[key].label) || key; }
  function brandName(key) { return (DATA.brands[key] && DATA.brands[key].name) || key; }
  function debounce(fn, ms) { var t; return function () { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { fn.apply(c, a); }, ms); }; }

  WW.svg = svg; WW.inr = inr; WW.product = product; WW.article = findArticle; WW.store = store;

  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* 2. Theme ------------------------------------------------------------ */
  var mqDark = window.matchMedia('(prefers-color-scheme: dark)');
  function systemTheme() { return mqDark.matches ? 'dark' : 'light'; }
  function applyTheme(t) {
    html.setAttribute('data-theme', t);
    $$('[data-theme-toggle]').forEach(function (b) {
      b.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }
  function savedTheme() { var t = store.raw('ww-theme'); return t === 'light' || t === 'dark' ? t : null; }
  applyTheme(savedTheme() || systemTheme());
  $$('[data-theme-toggle]').forEach(function (btn) {
    on(btn, 'click', function () {
      var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      store.rawSet('ww-theme', next);
      applyTheme(next);
      syncThemeChoice();
    });
  });
  var onSystemChange = function () { if (!savedTheme()) applyTheme(systemTheme()); };
  if (mqDark.addEventListener) mqDark.addEventListener('change', onSystemChange); else if (mqDark.addListener) mqDark.addListener(onSystemChange);
  function syncThemeChoice() {
    var pref = savedTheme() || 'system';
    $$('[data-theme-choice]').forEach(function (r) { r.checked = r.value === pref; });
  }
  syncThemeChoice();
  $$('[data-theme-choice]').forEach(function (r) {
    on(r, 'change', function () {
      if (r.value === 'system') { store.rawSet('ww-theme', null); applyTheme(systemTheme()); }
      else { store.rawSet('ww-theme', r.value); applyTheme(r.value); }
    });
  });

  /* 3. Direction -------------------------------------------------------- */
  function applyDir(dir) {
    html.setAttribute('dir', dir);
    $$('[data-dir-label]').forEach(function (el) { el.textContent = dir === 'rtl' ? 'LTR' : 'RTL'; });
    $$('[data-dir-toggle]').forEach(function (b) { b.setAttribute('aria-label', dir === 'rtl' ? 'LTR: switch to left-to-right layout' : 'RTL: switch to right-to-left layout'); });
    d.dispatchEvent(new CustomEvent('ww:dir'));
  }
  applyDir(store.raw('ww-dir') === 'rtl' ? 'rtl' : 'ltr');
  $$('[data-dir-toggle]').forEach(function (btn) {
    on(btn, 'click', function () {
      var next = isRTL() ? 'ltr' : 'rtl';
      store.rawSet('ww-dir', next);
      applyDir(next);
      toast(next === 'rtl' ? 'Right-to-left layout on' : 'Left-to-right layout on', 'languages');
    });
  });

  /* 4. Header & scroll -------------------------------------------------- */
  var header = $('.site-header') || $('.standalone-header');
  var progress = $('.scroll-progress');
  var toTop = $('[data-to-top]');
  var parallax = $$('[data-parallax]');
  var ticking = false;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 12);
    if (progress) {
      var h = d.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (h > 0 ? Math.min(y / h, 1) : 0) + ')';
    }
    if (toTop) toTop.classList.toggle('is-visible', y > 700);
    if (!reduceMotion()) {
      parallax.forEach(function (el) {
        var f = parseFloat(el.getAttribute('data-parallax')) || 0.05;
        el.style.transform = 'translate3d(0,' + (y * f).toFixed(1) + 'px,0)';
      });
    }
    ticking = false;
  }
  on(window, 'scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  on(toTop, 'click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduceMotion() ? 'auto' : 'smooth' });
    var main = $('#main'); if (main) main.focus({ preventScroll: true });
  });

  /* 5. Navigation dropdowns -------------------------------------------- */
  var dropdownBtns = $$('.has-dropdown > .nav-link');
  function closeDropdowns(except) {
    dropdownBtns.forEach(function (b) {
      if (b === except) return;
      b.setAttribute('aria-expanded', 'false');
      var m = d.getElementById(b.getAttribute('aria-controls'));
      if (m) m.classList.remove('is-open');
    });
  }
  function openDropdown(btn, focusFirst) {
    closeDropdowns(btn);
    btn.setAttribute('aria-expanded', 'true');
    var menu = d.getElementById(btn.getAttribute('aria-controls'));
    if (menu) {
      menu.classList.add('is-open');
      // wait a frame: the visibility transition must start before links are focusable
      if (focusFirst) setTimeout(function () { var a = $('a', menu); if (a) a.focus(); }, 40);
    }
  }
  dropdownBtns.forEach(function (btn) {
    var li = btn.parentElement;
    var menu = d.getElementById(btn.getAttribute('aria-controls'));
    var timer;
    on(btn, 'click', function () {
      if (btn.getAttribute('aria-expanded') === 'true') closeDropdowns(); else openDropdown(btn);
    });
    on(btn, 'keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); openDropdown(btn, true); }
    });
    on(li, 'mouseenter', function () { if (window.matchMedia('(hover: hover)').matches) { clearTimeout(timer); openDropdown(btn); } });
    on(li, 'mouseleave', function () { if (window.matchMedia('(hover: hover)').matches) { timer = setTimeout(function () { closeDropdowns(); }, 160); } });
    on(menu, 'keydown', function (e) {
      var links = $$('a', menu), i = links.indexOf(d.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); links[(i + 1) % links.length].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); links[(i - 1 + links.length) % links.length].focus(); }
      if (e.key === 'Escape') { closeDropdowns(); btn.focus(); }
    });
    on(li, 'focusout', function (e) { if (!li.contains(e.relatedTarget)) { btn.setAttribute('aria-expanded', 'false'); if (menu) menu.classList.remove('is-open'); } });
  });
  on(d, 'click', function (e) { if (!e.target.closest('.has-dropdown')) closeDropdowns(); });

  /* 6. Overlays --------------------------------------------------------- */
  var backdrop = $('[data-backdrop]');
  var stack = [];
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function openOverlay(el, trigger) {
    if (!el || el.classList.contains('is-open')) return;
    closeDropdowns();
    el.hidden = false;
    el._trigger = trigger || d.activeElement;
    void el.offsetWidth;
    el.classList.add('is-open');
    if (el.classList.contains('drawer') && backdrop) { backdrop.hidden = false; void backdrop.offsetWidth; backdrop.classList.add('is-visible'); }
    body.classList.add('is-locked');
    $$('[aria-controls="' + el.id + '"]').forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    stack.push(el);
    setTimeout(function () {
      var target = $('[autofocus], input[type="search"]', el) || $(FOCUSABLE, el);
      if (target) target.focus();
    }, 60);
  }
  function closeOverlay(el) {
    el = el || stack[stack.length - 1];
    if (!el || !el.classList.contains('is-open')) return;
    el.classList.remove('is-open');
    stack = stack.filter(function (x) { return x !== el; });
    $$('[aria-controls="' + el.id + '"]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    if (!stack.some(function (x) { return x.classList.contains('drawer'); }) && backdrop) {
      backdrop.classList.remove('is-visible');
      setTimeout(function () { if (!backdrop.classList.contains('is-visible')) backdrop.hidden = true; }, 450);
    }
    if (!stack.length) body.classList.remove('is-locked');
    setTimeout(function () { if (!el.classList.contains('is-open')) el.hidden = true; }, 450);
    if (el._trigger && el._trigger.focus) el._trigger.focus({ preventScroll: true });
  }
  WW.openOverlay = openOverlay; WW.closeOverlay = closeOverlay;

  on(d, 'click', function (e) {
    var t = e.target;
    var opener = t.closest('[data-drawer-open]');
    if (opener) { e.preventDefault(); openOverlay(d.getElementById(opener.getAttribute('data-drawer-open')), opener); return; }
    var modalOpener = t.closest('[data-modal-open]');
    if (modalOpener) {
      e.preventDefault();
      var targetModal = d.getElementById(modalOpener.getAttribute('data-modal-open'));
      if (targetModal) {
        if (targetModal.id === 'forgot-modal') {
          var siEmail = $('#si-email');
          var fpEmail = $('#fp-email');
          if (siEmail && fpEmail && siEmail.value && !fpEmail.value) {
            fpEmail.value = siEmail.value;
          }
        }
        openOverlay(targetModal, modalOpener);
      }
      return;
    }
    if (t.closest('[data-search-open]')) { openOverlay($('#search-dialog'), t.closest('[data-search-open]')); return; }
    var closer = t.closest('[data-drawer-close], [data-modal-close], [data-search-close]');
    if (closer) { closeOverlay(closer.closest('.drawer, .modal, .search-dialog')); return; }
    if (t === backdrop) { closeOverlay(); return; }
    if (t.classList && (t.classList.contains('modal') || t.classList.contains('search-dialog')) && t.classList.contains('is-open')) closeOverlay(t);
  });
  on(d, 'keydown', function (e) {
    var top = stack[stack.length - 1];
    if (e.key === 'Escape') {
      if (top) { closeOverlay(top); return; }
      var f = $('.filters.is-open'); if (f) closeFilters();
      closeDropdowns();
    }
    if (e.key === 'Tab' && top) {
      var items = $$(FOCUSABLE, top).filter(function (x) { return x.offsetParent !== null; });
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && !top && !/input|textarea|select/i.test(d.activeElement.tagName)) {
      var sd = $('#search-dialog'); if (sd) { e.preventDefault(); openOverlay(sd); }
    }
  });

  /* 7. Scroll reveal ---------------------------------------------------- */
  $$('[data-stagger]').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      if (!child.hasAttribute('data-reveal')) child.setAttribute('data-reveal', '');
      if (!child.style.getPropertyValue('--delay')) child.style.setProperty('--delay', (i % 8) * 80 + 'ms');
    });
  });
  var revealIO = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('is-revealed'); revealIO.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }) : null;
  function reveal(ctx) {
    $$('[data-reveal]:not(.is-revealed)', ctx).forEach(function (el) {
      if (!revealIO || reduceMotion()) el.classList.add('is-revealed'); else revealIO.observe(el);
    });
  }
  reveal();
  WW.reveal = reveal;

  function animateIn(els) {
    if (reduceMotion()) return;
    els.forEach(function (el, i) {
      el.style.animation = 'fade-up 520ms var(--ease-out) ' + (i * 45) + 'ms both';
    });
  }

  /* 8. Counters --------------------------------------------------------- */
  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var divide = parseFloat(el.getAttribute('data-divide')) || 1;
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var fmt = function (v) { v = v / divide; return decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString('en-IN'); };
    if (reduceMotion()) { el.textContent = fmt(target); return; }
    var start = null, dur = 1600;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var countIO = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { runCounter(en.target); countIO.unobserve(en.target); } });
  }, { threshold: 0.4 }) : null;
  $$('[data-count]').forEach(function (el) { if (countIO) countIO.observe(el); else runCounter(el); });

  /* 9. Tabs, accordion, slider, scroller -------------------------------- */
  function initTabs(root) {
    var tabs = $$('[role="tab"]', root);
    var indicator = $('.tabs__indicator', root);
    function moveIndicator(tab) {
      if (!indicator || !tab) return;
      indicator.style.width = tab.offsetWidth + 'px';
      indicator.style.transform = 'translateX(' + tab.offsetLeft + 'px)';
    }
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var sel = t === tab;
        t.setAttribute('aria-selected', sel ? 'true' : 'false');
        t.tabIndex = sel ? 0 : -1;
        var panel = d.getElementById(t.getAttribute('aria-controls'));
        if (panel) {
          panel.hidden = !sel;
          if (sel) { panel.classList.remove('is-entering'); void panel.offsetWidth; panel.classList.add('is-entering'); }
        }
      });
      moveIndicator(tab);
      if (focus) tab.focus();
    }
    tabs.forEach(function (t, i) {
      on(t, 'click', function () { select(t); });
      on(t, 'keydown', function (e) {
        var next = null, fwd = isRTL() ? 'ArrowLeft' : 'ArrowRight', back = isRTL() ? 'ArrowRight' : 'ArrowLeft';
        if (e.key === fwd) next = tabs[(i + 1) % tabs.length];
        if (e.key === back) next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') next = tabs[0];
        if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); select(next, true); }
      });
    });
    var current = function () { return tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0]; };
    requestAnimationFrame(function () { moveIndicator(current()); });
    on(window, 'resize', debounce(function () { moveIndicator(current()); }, 120));
    on(d, 'ww:dir', function () { requestAnimationFrame(function () { moveIndicator(current()); }); });
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { moveIndicator(current()); });
    if (location.hash) {
      var target = tabs.filter(function (t) { return '#' + t.id === location.hash; })[0];
      if (target) select(target);
    }
    root._select = select;
  }
  $$('[data-tabs]').forEach(initTabs);

  $$('[data-accordion]').forEach(function (acc) {
    $$('.accordion__trigger', acc).forEach(function (btn) {
      on(btn, 'click', function () {
        var item = btn.closest('.accordion__item');
        var open = !item.classList.contains('is-open');
        item.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
  });

  $$('[data-slider]').forEach(function (slider) {
    var track = $('.slider__track', slider);
    var slides = $$('.slider__slide', slider);
    var dotsWrap = $('[data-slider-dots]', slider);
    var viewport = $('.slider__viewport', slider);
    var index = 0, timer = null, paused = false;
    function perView() { var w = slides[0].getBoundingClientRect().width; return Math.max(1, Math.round(viewport.getBoundingClientRect().width / w)); }
    function pages() { return Math.max(1, slides.length - perView() + 1); }
    function buildDots() {
      dotsWrap.innerHTML = '';
      for (var i = 0; i < pages(); i++) {
        var b = d.createElement('button');
        b.type = 'button'; b.className = 'slider__dot';
        b.setAttribute('aria-label', 'Show review ' + (i + 1));
        (function (n) { on(b, 'click', function () { go(n); restart(); }); })(i);
        dotsWrap.appendChild(b);
      }
    }
    function go(n) {
      var max = pages();
      index = (n + max) % max;
      var w = slides[0].getBoundingClientRect().width;
      track.style.transform = 'translateX(' + (isRTL() ? 1 : -1) * index * w + 'px)';
      $$('.slider__dot', dotsWrap).forEach(function (dt, i) { dt.setAttribute('aria-current', i === index ? 'true' : 'false'); });
      slides.forEach(function (s, i) {
        var visible = i >= index && i < index + perView();
        s.setAttribute('aria-hidden', visible ? 'false' : 'true');
        $$('a, button', s).forEach(function (f) { f.tabIndex = visible ? 0 : -1; });
      });
    }
    function restart() {
      clearInterval(timer);
      if (reduceMotion()) return;
      timer = setInterval(function () { if (!paused && !d.hidden) go(index + 1); }, 6500);
    }
    on($('[data-slider-prev]', slider), 'click', function () { go(index - 1); restart(); });
    on($('[data-slider-next]', slider), 'click', function () { go(index + 1); restart(); });
    on(slider, 'mouseenter', function () { paused = true; });
    on(slider, 'mouseleave', function () { paused = false; });
    on(slider, 'focusin', function () { paused = true; });
    on(slider, 'focusout', function () { paused = false; });
    var startX = null;
    on(viewport, 'pointerdown', function (e) { startX = e.clientX; });
    on(viewport, 'pointerup', function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX; startX = null;
      if (Math.abs(dx) > 45) { go(index + ((dx < 0) !== isRTL() ? 1 : -1)); restart(); }
    });
    var rebuild = debounce(function () { buildDots(); go(Math.min(index, pages() - 1)); }, 150);
    on(window, 'resize', rebuild);
    on(d, 'ww:dir', function () { go(index); });
    buildDots(); go(0); restart();
  });

  on(d, 'click', function (e) {
    var b = e.target.closest('[data-scroll-prev], [data-scroll-next]');
    if (!b) return;
    var id = b.getAttribute('data-scroll-prev') || b.getAttribute('data-scroll-next');
    var track = d.getElementById(id);
    if (!track) return;
    var dirSign = b.hasAttribute('data-scroll-next') ? 1 : -1;
    if (isRTL()) dirSign *= -1;
    track.scrollBy({ left: dirSign * track.clientWidth * 0.8, behavior: reduceMotion() ? 'auto' : 'smooth' });
  });

  /* 10. Toasts ---------------------------------------------------------- */
  var toastRegion = $('[data-toasts]');
  function toast(message, iconName, action) {
    if (!toastRegion) return;
    var el = d.createElement('div');
    el.className = 'toast';
    el.innerHTML = svg(iconName || 'circle-check') + '<span>' + escapeHTML(message) + '</span>';
    if (action) {
      var a = d.createElement('button');
      a.type = 'button'; a.className = 'btn btn-sm btn-accent'; a.style.marginInlineStart = 'auto'; a.style.minHeight = '34px';
      a.textContent = action.label;
      on(a, 'click', function () { action.onClick(); dismiss(); });
      el.appendChild(a);
    }
    toastRegion.appendChild(el);
    var gone = false;
    function dismiss() {
      if (gone) return; gone = true;
      el.classList.add('is-leaving');
      setTimeout(function () { el.remove(); }, 300);
    }
    setTimeout(dismiss, action ? 5000 : 3600);
    while (toastRegion.children.length > 3) toastRegion.firstElementChild.remove();
  }
  WW.toast = toast;
  on(d, 'click', function (e) {
    var t = e.target.closest('[data-toast]');
    if (!t || t.tagName === 'FORM') return;
    if (t.tagName === 'A') e.preventDefault();
    toast(t.getAttribute('data-toast'), 'info');
  });

  /* 11. Cart & wishlist ------------------------------------------------- */
  var cart = store.get('ww-cart', []).filter(function (i) { return product(i.id); });
  var wish = store.get('ww-wish', []).filter(function (id) { return product(id); });
  var FREE = DATA.freeShip || 1499, FEE = DATA.shipFee || 79;

  function cartCount() { return cart.reduce(function (n, i) { return n + i.qty; }, 0); }
  function cartSubtotal() { return cart.reduce(function (n, i) { return n + product(i.id).price * i.qty; }, 0); }
  function saveCart() { store.set('ww-cart', cart); renderCart(); }
  function bump(el) { if (!el) return; el.classList.remove('is-bumped'); void el.offsetWidth; el.classList.add('is-bumped'); }

  function addToCart(id, qty, option, source) {
    var p = product(id); if (!p) return;
    qty = Math.max(1, Math.min(parseInt(qty, 10) || 1, 20));
    var key = id + '|' + (option || '');
    var line = cart.filter(function (i) { return i.key === key; })[0];
    if (line) line.qty = Math.min(line.qty + qty, 20);
    else cart.push({ key: key, id: id, qty: qty, option: option || '' });
    saveCart();
    flyToCart(source);
    return p;
  }
  WW.cart = { add: addToCart, items: function () { return cart.slice(); } };

  function flyToCart(source) {
    var target = $('[data-cart-target]');
    var badge = $('[data-cart-count]');
    if (!source || !target || reduceMotion() || !source.getBoundingClientRect) { bump(badge); return; }
    var s = source.getBoundingClientRect(), t = target.getBoundingClientRect();
    var dot = d.createElement('span');
    dot.className = 'fly-dot';
    dot.innerHTML = svg('paw-print');
    dot.style.left = (s.left + s.width / 2 - 13) + 'px';
    dot.style.top = (s.top + s.height / 2 - 13) + 'px';
    body.appendChild(dot);
    var dx = (t.left + t.width / 2) - (s.left + s.width / 2), dy = (t.top + t.height / 2) - (s.top + s.height / 2);
    if (!dot.animate) { dot.remove(); bump(badge); return; }
    var anim = dot.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: 'translate(' + dx * 0.45 + 'px,' + (Math.min(dy, 0) - 90) + 'px) scale(1.25)', opacity: 1, offset: 0.45 },
      { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(0.35)', opacity: 0.4 }
    ], { duration: 780, easing: 'cubic-bezier(.5,0,.3,1)' });
    anim.onfinish = function () { dot.remove(); bump(badge); var ic = $('.icon', target); if (ic) { ic.style.animation = 'none'; void ic.offsetWidth; ic.style.animation = 'wiggle 500ms ease'; } };
  }

  function renderCart() {
    var count = cartCount(), sub = cartSubtotal();
    $$('[data-cart-count]').forEach(function (b) { b.textContent = count ? String(count) : ''; b.setAttribute('data-badge', count); });
    $$('[data-cart-target]').forEach(function (b) { b.setAttribute('aria-label', 'Open basket, ' + count + (count === 1 ? ' item' : ' items')); });
    var list = $('[data-cart-items]');
    if (!list) return;
    if (!cart.length) {
      list.innerHTML = '<div class="cart-empty"><span class="icon-bubble icon-bubble--lg">' + svg('shopping-bag') + '</span><h3>Your basket is empty</h3><p class="muted mt-2">Treats, toys and cosy beds are just a click away.</p><a class="btn btn-primary mt-6" href="' + ROOT + 'pages/shop.html">Start shopping</a></div>';
    } else {
      list.innerHTML = '<ul role="list" style="padding:0">' + cart.map(function (i) {
        var p = product(i.id);
        return '<li class="cart-item" data-key="' + escapeHTML(i.key) + '">' +
          '<img src="' + ROOT + 'assets/images/' + p.img + '.webp" alt="" width="72" height="72">' +
          '<div><h3><a href="' + ROOT + 'pages/product.html?id=' + p.id + '" style="color:inherit;text-decoration:none">' + escapeHTML(p.name) + '</a></h3>' +
          (i.option ? '<p class="muted" style="font-size:var(--fs-xs);font-weight:700">' + escapeHTML(i.option) + '</p>' : '') +
          '<div class="cluster" style="gap:var(--sp-3);margin-top:4px"><div class="qty qty--sm"><button type="button" data-cart-dec aria-label="Decrease quantity of ' + escapeHTML(p.name) + '">' + svg('minus') + '</button>' +
          '<input type="number" value="' + i.qty + '" min="1" max="20" aria-label="Quantity of ' + escapeHTML(p.name) + '" data-cart-qty><button type="button" data-cart-inc aria-label="Increase quantity of ' + escapeHTML(p.name) + '">' + svg('plus') + '</button></div>' +
          '<span class="cart-item__price">' + inr(p.price * i.qty) + '</span></div></div>' +
          '<button class="icon-btn cart-item__remove" type="button" data-cart-remove aria-label="Remove ' + escapeHTML(p.name) + ' from basket">' + svg('trash-2') + '</button></li>';
      }).join('') + '</ul>';
    }
    var ship = sub === 0 || sub >= FREE ? 0 : FEE;
    var set = function (sel, v) { var el = $(sel); if (el) el.textContent = v; };
    set('[data-cart-subtotal]', inr(sub));
    set('[data-cart-shipping]', ship ? inr(ship) : 'Free');
    set('[data-cart-total]', inr(sub + ship));
    var meter = $('[data-ship-meter]');
    if (meter) {
      var pct = Math.min(100, Math.round(sub / FREE * 100));
      $('.ship-meter__track span', meter).style.width = pct + '%';
      $('[data-ship-text]', meter).innerHTML = sub >= FREE ? svg('truck', 'icon-sm') + ' Yay! You’ve unlocked free same-day delivery.' : 'Add <strong>' + inr(FREE - sub) + '</strong> more for free delivery';
    }
    var foot = $('[data-cart-foot]'); if (foot) foot.hidden = !cart.length;
  }

  on(d, 'click', function (e) {
    var add = e.target.closest('[data-add-to-cart]');
    if (add) {
      var id = add.getAttribute('data-add-to-cart');
      var qtySrc = add.getAttribute('data-qty-source');
      var qty = qtySrc ? (d.getElementById(qtySrc) || {}).value : 1;
      var optEl = add.closest('[data-pdp], .quick-view') ? $('input[name="opt"]:checked', add.closest('[data-pdp], .quick-view')) : null;
      var p = addToCart(id, qty, optEl ? optEl.value : '', add);
      if (p) {
        if (add.classList.contains('add-btn')) {
          var original = add.innerHTML;
          add.classList.add('is-added'); add.innerHTML = svg('check');
          setTimeout(function () { add.classList.remove('is-added'); add.innerHTML = original; }, 1400);
        }
        toast(p.name + ' added to your basket', 'shopping-bag', { label: 'View', onClick: function () { openOverlay($('#cart-drawer')); } });
      }
      return;
    }
    var bundle = e.target.closest('[data-add-bundle]');
    if (bundle) {
      bundle.getAttribute('data-add-bundle').split(',').forEach(function (id) { addToCart(id.trim(), 1, '', null); });
      flyToCart(bundle);
      toast((bundle.getAttribute('data-bundle-name') || 'Bundle') + ' added to your basket', 'gift', { label: 'View', onClick: function () { openOverlay($('#cart-drawer')); } });
      return;
    }
    var item = e.target.closest('.cart-item[data-key]');
    if (item) {
      var key = item.getAttribute('data-key');
      var line = cart.filter(function (i) { return i.key === key; })[0];
      if (!line) return;
      if (e.target.closest('[data-cart-inc]')) { line.qty = Math.min(line.qty + 1, 20); saveCart(); focusCart(key, '[data-cart-inc]'); }
      else if (e.target.closest('[data-cart-dec]')) {
        if (line.qty > 1) { line.qty--; saveCart(); focusCart(key, '[data-cart-dec]'); }
      } else if (e.target.closest('[data-cart-remove]')) {
        cart = cart.filter(function (i) { return i.key !== key; }); saveCart();
        toast('Removed from your basket', 'trash-2');
        var next = $('[data-cart-items] button, [data-cart-items] a'); if (next) next.focus();
      }
    }
    if (e.target.closest('[data-checkout-open]')) {
      if (!cart.length) { toast('Your basket is empty', 'info'); return; }
      closeOverlay($('#cart-drawer'));
      setTimeout(function () { openOverlay($('#checkout-modal')); }, 200);
    }
  });
  function focusCart(key, sel) { var el = $('.cart-item[data-key="' + key + '"] ' + sel); if (el) el.focus(); }
  on(d, 'change', function (e) {
    if (!e.target.matches('[data-cart-qty]')) return;
    var key = e.target.closest('.cart-item').getAttribute('data-key');
    var line = cart.filter(function (i) { return i.key === key; })[0];
    if (line) { line.qty = Math.max(1, Math.min(parseInt(e.target.value, 10) || 1, 20)); saveCart(); }
  });

  function syncWish(ctx) {
    $$('[data-wishlist]', ctx).forEach(function (b) {
      var id = b.getAttribute('data-wishlist'), p = product(id), onList = wish.indexOf(id) > -1;
      b.setAttribute('aria-pressed', onList ? 'true' : 'false');
      if (p) b.setAttribute('aria-label', (onList ? 'Remove ' : 'Save ') + p.name + (onList ? ' from wishlist' : ' to wishlist'));
    });
    $$('[data-wishlist-count]').forEach(function (b) { b.textContent = wish.length ? String(wish.length) : ''; b.setAttribute('data-badge', wish.length); });
  }
  on(d, 'click', function (e) {
    var b = e.target.closest('[data-wishlist]');
    if (!b) return;
    var id = b.getAttribute('data-wishlist'), p = product(id);
    var i = wish.indexOf(id);
    if (i > -1) { wish.splice(i, 1); toast(p.name + ' removed from wishlist', 'heart'); }
    else { wish.push(id); toast(p.name + ' saved to wishlist', 'heart'); }
    store.set('ww-wish', wish);
    syncWish();
    bump($('[data-wishlist-count]'));
    d.dispatchEvent(new CustomEvent('ww:wishlist'));
  });
  WW.wishlist = { items: function () { return wish.slice(); } };
  on(window, 'storage', function (e) {
    if (e.key === 'ww-cart') { cart = store.get('ww-cart', []); renderCart(); }
    if (e.key === 'ww-wish') { wish = store.get('ww-wish', []); syncWish(); d.dispatchEvent(new CustomEvent('ww:wishlist')); }
  });
  renderCart();
  syncWish();

  /* Product card template (mirrors the static HTML cards) */
  function stars(r) {
    var full = Math.round(r), s = '';
    for (var i = 0; i < 5; i++) s += svg('star', i < full ? '' : 'is-empty');
    return '<span class="stars" aria-hidden="true">' + s + '</span>';
  }
  function badge(p) {
    if (!p.badge) return '';
    if (p.badge === 'sale') return '<span class="sticker sticker--sale">-' + Math.round((1 - p.price / p.old) * 100) + '%</span>';
    if (p.badge === 'new') return '<span class="sticker sticker--new">New</span>';
    return '<span class="sticker sticker--pick">Staff pick</span>';
  }
  function priceHTML(p) {
    return '<span class="price"><span class="sr-only">Price ' + inr(p.price) + (p.old ? ', was ' + inr(p.old) : '') + '</span><span aria-hidden="true">' + inr(p.price) + (p.old ? ' <del>' + inr(p.old) + '</del>' : '') + '</span></span>';
  }
  function renderCard(p) {
    var name = escapeHTML(p.name);
    return '<article class="product-card" data-product-id="' + p.id + '"><div class="product-card__media">' + badge(p) +
      '<img src="' + ROOT + 'assets/images/' + p.img + '.webp" alt="' + escapeHTML(p.alt) + '" width="800" height="800" loading="lazy" decoding="async">' +
      '<div class="product-card__tools"><button type="button" class="icon-btn wish-btn" data-wishlist="' + p.id + '" aria-pressed="false" aria-label="Save ' + name + ' to wishlist">' + svg('heart') + '</button>' +
      '<button type="button" class="icon-btn product-card__quick" data-quick-view="' + p.id + '" aria-label="Quick view: ' + name + '">' + svg('eye') + '</button></div></div>' +
      '<div class="product-card__body"><span class="product-card__brand">' + escapeHTML(brandName(p.brand)) + '</span>' +
      '<h3 class="product-card__title"><a href="' + ROOT + 'pages/product.html?id=' + p.id + '">' + name + '</a></h3>' +
      '<span class="rating">' + stars(p.rating) + '<span class="sr-only">Rated ' + p.rating + ' out of 5 from ' + p.reviews + ' reviews.</span><span aria-hidden="true">' + p.rating + ' (' + p.reviews + ')</span></span>' +
      '<div class="product-card__foot">' + priceHTML(p) +
      '<button type="button" class="add-btn" data-add-to-cart="' + p.id + '" aria-label="Add ' + name + ' to basket">' + svg('shopping-bag') + '</button></div></div></article>';
  }
  function renderGrid(grid, list) {
    grid.innerHTML = list.map(renderCard).join('');
    syncWish(grid);
    animateIn($$('.product-card', grid));
  }
  WW.renderCard = renderCard; WW.renderGrid = renderGrid; WW.stars = stars;

  function optionsHTML(p) {
    if (!p.option) return '';
    return '<fieldset><legend>' + escapeHTML(p.option.label) + '</legend><div class="pills">' + p.option.values.map(function (v, i) {
      return '<label class="pill"><input type="radio" name="opt" value="' + escapeHTML(v) + '"' + (i === 0 ? ' checked' : '') + '><span>' + escapeHTML(v) + '</span></label>';
    }).join('') + '</div></fieldset>';
  }

  /* 12. Quick view ------------------------------------------------------ */
  on(d, 'click', function (e) {
    var b = e.target.closest('[data-quick-view]');
    if (!b) return;
    var p = product(b.getAttribute('data-quick-view'));
    var modal = $('#quick-view');
    if (!p || !modal) return;
    $('[data-quick-view-body]', modal).innerHTML = '<div class="quick-view">' +
      '<div class="quick-view__media">' + '<img src="' + ROOT + 'assets/images/' + p.img + '.webp" alt="' + escapeHTML(p.alt) + '" width="800" height="800"></div>' +
      '<div><span class="tag tint-' + p.pet + '">' + escapeHTML(petLabel(p.pet)) + ' · ' + escapeHTML(brandName(p.brand)) + '</span>' +
      '<h2 id="qv-title">' + escapeHTML(p.name) + '</h2>' +
      '<span class="rating">' + stars(p.rating) + '<span>' + p.rating + ' · ' + p.reviews + ' reviews</span></span>' +
      '<div class="pdp__price">' + priceHTML(p) + '</div><p class="muted">' + escapeHTML(p.desc) + '</p>' +
      '<div class="pdp__options">' + optionsHTML(p) + '</div>' +
      '<div class="pdp__buy"><div class="qty" data-qty><button type="button" aria-label="Decrease quantity" data-qty-dec>' + svg('minus') + '</button><label class="sr-only" for="qv-qty">Quantity</label><input id="qv-qty" type="number" value="1" min="1" max="10" inputmode="numeric"><button type="button" aria-label="Increase quantity" data-qty-inc>' + svg('plus') + '</button></div>' +
      '<button class="btn btn-primary" type="button" data-add-to-cart="' + p.id + '" data-qty-source="qv-qty">' + svg('shopping-bag') + 'Add to basket</button></div>' +
      '<a class="read-more mt-4" href="' + ROOT + 'pages/product.html?id=' + p.id + '">View full details ' + svg('arrow-right') + '</a></div></div>';
    openOverlay(modal, b);
  });

  on(d, 'click', function (e) {
    var b = e.target.closest('[data-qty-dec], [data-qty-inc]');
    if (!b) return;
    var input = $('input', b.closest('[data-qty]'));
    var v = parseInt(input.value, 10) || 1, min = parseInt(input.min, 10) || 1, max = parseInt(input.max, 10) || 99;
    input.value = Math.max(min, Math.min(max, v + (b.hasAttribute('data-qty-inc') ? 1 : -1)));
  });

  /* 13. Shop filters ---------------------------------------------------- */
  var shopGrid = $('[data-shop-grid]');
  var filtersEl = $('#filters');
  function closeFilters() {
    if (!filtersEl) return;
    filtersEl.classList.remove('is-open');
    body.classList.remove('is-locked');
    var t = $('[data-filters-open]'); if (t) { t.setAttribute('aria-expanded', 'false'); t.focus(); }
  }
  if (shopGrid) (function () {
    var PAGE = 12;
    var params = new URLSearchParams(location.search);
    var priceInput = $('[data-filter-price]');
    var maxPrice = priceInput ? parseInt(priceInput.max, 10) : 99999;
    var state = { pet: 'all', cats: [], brands: [], max: maxPrice, rating: 0, sale: false, isNew: false, q: '', sort: 'featured', shown: PAGE };
    var hashPet = location.hash.replace('#', '');
    if (DATA.pets[hashPet]) state.pet = hashPet;
    if (params.get('q')) state.q = params.get('q');
    if (params.get('brand') && DATA.brands[params.get('brand')]) state.brands = [params.get('brand')];
    if (params.get('sort')) state.sort = params.get('sort');
    var qInput = $('[data-filter-q]'), sortSel = $('[data-sort]');
    if (qInput) qInput.value = state.q;
    if (sortSel && $('option[value="' + state.sort + '"]', sortSel)) sortSel.value = state.sort;
    $$('[data-filter-brand]').forEach(function (c) { c.checked = state.brands.indexOf(c.value) > -1; });

    function filtered() {
      var q = state.q.trim().toLowerCase();
      var list = DATA.products.filter(function (p) {
        if (state.pet !== 'all' && p.pet !== state.pet) return false;
        if (state.cats.length && state.cats.indexOf(p.cat) < 0) return false;
        if (state.brands.length && state.brands.indexOf(p.brand) < 0) return false;
        if (p.price > state.max) return false;
        if (p.rating < state.rating) return false;
        if (state.sale && !p.old) return false;
        if (state.isNew && !p.new) return false;
        if (q) {
          var hay = (p.name + ' ' + brandName(p.brand) + ' ' + petLabel(p.pet) + ' ' + (DATA.categories[p.cat] || '') + ' ' + p.desc).toLowerCase();
          if (q.split(/\s+/).some(function (w) { return hay.indexOf(w) < 0; })) return false;
        }
        return true;
      });
      var sorters = {
        popular: function (a, b) { return b.reviews - a.reviews; },
        rating: function (a, b) { return b.rating - a.rating || b.reviews - a.reviews; },
        'price-asc': function (a, b) { return a.price - b.price; },
        'price-desc': function (a, b) { return b.price - a.price; },
        'new': function (a, b) { return (b.new ? 1 : 0) - (a.new ? 1 : 0); }
      };
      if (sorters[state.sort]) list = list.slice().sort(sorters[state.sort]);
      return list;
    }
    function chip(label, clear) { return { label: label, clear: clear }; }
    function apply(keepShown) {
      if (!keepShown) state.shown = PAGE;
      var list = filtered();
      var visible = list.slice(0, state.shown);
      renderGrid(shopGrid, visible);
      $('[data-result-count]').innerHTML = list.length ? 'Showing <strong>' + visible.length + '</strong> of ' + list.length + (list.length === 1 ? ' product' : ' products') + (state.pet !== 'all' ? ' for ' + escapeHTML(petLabel(state.pet).toLowerCase()) : '') : 'No products match';
      $('[data-empty]').hidden = list.length > 0;
      var lm = $('[data-load-more]');
      lm.hidden = list.length <= state.shown;
      $('[data-load-text]').textContent = 'Showing ' + visible.length + ' of ' + list.length;
      $('.load-more__bar span', lm).style.width = Math.round(visible.length / Math.max(list.length, 1) * 100) + '%';
      $$('[data-filter-pet]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-filter-pet') === state.pet ? 'true' : 'false'); });
      var chips = [];
      if (state.q) chips.push(chip('“' + state.q + '”', function () { state.q = ''; if (qInput) qInput.value = ''; }));
      state.cats.forEach(function (c) { chips.push(chip(DATA.categories[c], function () { state.cats = state.cats.filter(function (x) { return x !== c; }); $$('[data-filter-cat]').forEach(function (i) { if (i.value === c) i.checked = false; }); })); });
      state.brands.forEach(function (b) { chips.push(chip(brandName(b), function () { state.brands = state.brands.filter(function (x) { return x !== b; }); $$('[data-filter-brand]').forEach(function (i) { if (i.value === b) i.checked = false; }); })); });
      if (state.max < maxPrice) chips.push(chip('Under ' + inr(state.max), function () { state.max = maxPrice; priceInput.value = maxPrice; updatePriceOut(); }));
      if (state.rating) chips.push(chip(state.rating + '+ stars', function () { state.rating = 0; $$('[data-filter-rating]')[0].checked = true; }));
      if (state.sale) chips.push(chip('On sale', function () { state.sale = false; $('[data-filter-sale]').checked = false; }));
      if (state.isNew) chips.push(chip('New arrivals', function () { state.isNew = false; $('[data-filter-new]').checked = false; }));
      var wrap = $('[data-active-filters]');
      wrap.innerHTML = '';
      chips.forEach(function (c) {
        var b = d.createElement('button');
        b.type = 'button';
        b.innerHTML = escapeHTML(c.label) + svg('x');
        b.setAttribute('aria-label', 'Remove filter: ' + c.label);
        on(b, 'click', function () { c.clear(); apply(); });
        wrap.appendChild(b);
      });
    }
    function updatePriceOut() { var o = $('[data-price-out]'); if (o && priceInput) o.textContent = inr(priceInput.value); }

    $$('[data-filter-pet]').forEach(function (b) {
      on(b, 'click', function () {
        state.pet = b.getAttribute('data-filter-pet');
        history.replaceState(null, '', state.pet === 'all' ? location.pathname + location.search : '#' + state.pet);
        apply();
      });
    });
    on(window, 'hashchange', function () { var h = location.hash.replace('#', ''); if (DATA.pets[h]) { state.pet = h; apply(); } });
    $$('[data-filter-cat]').forEach(function (c) { on(c, 'change', function () { state.cats = $$('[data-filter-cat]:checked').map(function (x) { return x.value; }); apply(); }); });
    $$('[data-filter-brand]').forEach(function (c) { on(c, 'change', function () { state.brands = $$('[data-filter-brand]:checked').map(function (x) { return x.value; }); apply(); }); });
    $$('[data-filter-rating]').forEach(function (r) { on(r, 'change', function () { state.rating = parseFloat(r.value) || 0; apply(); }); });
    on($('[data-filter-sale]'), 'change', function (e) { state.sale = e.target.checked; apply(); });
    on($('[data-filter-new]'), 'change', function (e) { state.isNew = e.target.checked; apply(); });
    on(priceInput, 'input', function () { state.max = parseInt(priceInput.value, 10); updatePriceOut(); debouncedApply(); });
    var debouncedApply = debounce(function () { apply(); }, 180);
    on(qInput, 'input', function () { state.q = qInput.value; debouncedApply(); });
    on(sortSel, 'change', function () { state.sort = sortSel.value; apply(); });
    on($('[data-load-btn]'), 'click', function () {
      var before = $$('.product-card', shopGrid).length;
      state.shown += PAGE; apply(true);
      var first = $$('.product-card', shopGrid)[before];
      if (first) { var a = $('a', first); if (a) a.focus({ preventScroll: true }); }
    });
    $$('[data-filters-reset]').forEach(function (b) {
      on(b, 'click', function () {
        state = { pet: 'all', cats: [], brands: [], max: maxPrice, rating: 0, sale: false, isNew: false, q: '', sort: 'featured', shown: PAGE };
        $$('[data-filter-cat], [data-filter-brand], [data-filter-sale], [data-filter-new]').forEach(function (c) { c.checked = false; });
        $$('[data-filter-rating]')[0].checked = true;
        if (priceInput) priceInput.value = maxPrice; updatePriceOut();
        if (qInput) qInput.value = '';
        if (sortSel) sortSel.value = 'featured';
        history.replaceState(null, '', location.pathname);
        apply();
        toast('Filters cleared', 'rotate-ccw');
      });
    });
    on($('[data-filters-open]'), 'click', function (e) {
      filtersEl.classList.add('is-open'); body.classList.add('is-locked');
      e.currentTarget.setAttribute('aria-expanded', 'true');
      var f = $('button, input', filtersEl); if (f) f.focus();
    });
    $$('[data-filters-close]').forEach(function (b) { on(b, 'click', closeFilters); });
    updatePriceOut();
    apply();
  })();

  /* 14. Product page ---------------------------------------------------- */
  var pdp = $('[data-pdp]');
  if (pdp) (function () {
    var id = new URLSearchParams(location.search).get('id') || pdp.getAttribute('data-default-id');
    var p = product(id) || product(pdp.getAttribute('data-default-id'));
    if (!p) return;
    var set = function (sel, fn) { $$(sel).forEach(fn); };
    d.title = p.name + ' | Wag & Whisker';
    var meta = $('meta[name="description"]'); if (meta) meta.setAttribute('content', p.desc);
    var img = $('[data-pdp-image]');
    img.src = ROOT + 'assets/images/' + p.img + '.webp'; img.alt = p.alt;
    var badgeEl = $('[data-pdp-badge]');
    if (p.badge) { badgeEl.outerHTML = badge(p).replace('<span class="', '<span data-pdp-badge class="'); } else { badgeEl.remove(); }
    var brandEl = $('[data-pdp-brand]');
    brandEl.textContent = brandName(p.brand); brandEl.href = 'brands.html#' + p.brand;
    set('[data-pdp-name], [data-pdp-crumb]', function (el) { el.textContent = p.name; });
    set('[data-pdp-pet-label]', function (el) { el.textContent = petLabel(p.pet); var a = el.closest('a'); if (a) a.href = 'shop.html#' + p.pet; });
    set('[data-pdp-pet]', function (el) { el.textContent = petLabel(p.pet).toLowerCase(); });
    $('[data-pdp-rating]').innerHTML = stars(p.rating) + '<span>' + p.rating + ' · ' + p.reviews + ' reviews</span>';
    $('[data-pdp-price]').innerHTML = inr(p.price) + (p.old ? ' <del>' + inr(p.old) + '</del>' : '');
    var save = $('[data-pdp-save]');
    if (p.old) save.textContent = 'You save ' + inr(p.old - p.price); else save.remove();
    $('[data-pdp-desc]').textContent = p.desc;
    $('[data-pdp-long]').textContent = p.desc + ' Every ' + brandName(p.brand) + ' product we stock is checked by our team for safe materials, solid construction and honest sizing before it reaches the shelf.';
    $('[data-pdp-options]').innerHTML = optionsHTML(p);
    $('[data-pdp-stock]').innerHTML = svg('package', 'icon-sm') + (p.stock <= 10 ? ' Only ' + p.stock + ' left in stock, order soon' : ' In stock and ready to ship today');
    $('[data-pdp-stock]').style.color = p.stock <= 10 ? '' : 'var(--success)';
    $('[data-pdp-add]').setAttribute('data-add-to-cart', p.id);
    $('[data-pdp-wish]').setAttribute('data-wishlist', p.id);
    $('[data-pdp-specs]').innerHTML = [['Brand', brandName(p.brand)], ['Suitable for', petLabel(p.pet)], ['Category', DATA.categories[p.cat]], ['SKU', 'WW-' + p.id.toUpperCase()], ['Availability', 'In stock (' + p.stock + ')']]
      .map(function (r) { return '<tr><th scope="row">' + r[0] + '</th><td>' + escapeHTML(r[1]) + '</td></tr>'; }).join('');
    $('[data-pdp-score]').textContent = p.rating;
    $('[data-pdp-count]').textContent = p.reviews;
    var related = DATA.products.filter(function (x) { return x.pet === p.pet && x.id !== p.id; });
    if (related.length < 4) related = related.concat(DATA.products.filter(function (x) { return x.pet !== p.pet && x.popular; })).slice(0, 4);
    renderGrid($('[data-related]'), related.slice(0, 4));
    syncWish();

    var main = $('[data-zoom-area]');
    var mainImg = img;
    on(main, 'click', function (e) {
      if (main.classList.contains('is-zoomed')) {
        main.classList.remove('is-zoomed');
      } else {
        var r = main.getBoundingClientRect();
        main.style.setProperty('--zx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        main.style.setProperty('--zy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
        main.classList.add('is-zoomed');
      }
    });

    if (window.matchMedia('(hover: hover)').matches) {
      on(main, 'mousemove', function (e) {
        if (!main.classList.contains('is-zoomed')) return;
        var r = main.getBoundingClientRect();
        main.style.setProperty('--zx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        main.style.setProperty('--zy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      });
      on(main, 'mouseleave', function () {
        main.classList.remove('is-zoomed');
      });
    }
  })();

  /* 14b. Article page --------------------------------------------------- */
  var articlePage = $('[data-article-page]') || (body.getAttribute('data-page') === 'blog-post' ? body : null);
  if (articlePage) (function () {
    var defaultId = articlePage.getAttribute('data-default-id') || 'puppy-first-30-days';
    var paramId = new URLSearchParams(location.search).get('id') || defaultId;
    var a = findArticle(paramId) || findArticle(defaultId);
    if (!a) return;

    d.title = a.title + ' · Wag & Whisker';
    var metaDesc = $('meta[name="description"]'); if (metaDesc) metaDesc.setAttribute('content', a.metaDesc);
    var ogTitle = $('meta[property="og:title"]'); if (ogTitle) ogTitle.setAttribute('content', a.title + ' | Wag & Whisker');
    var ogDesc = $('meta[property="og:description"]'); if (ogDesc) ogDesc.setAttribute('content', a.metaDesc);
    var ogUrl = $('meta[property="og:url"]'); if (ogUrl) ogUrl.setAttribute('content', location.href);
    var canon = $('link[rel="canonical"]'); if (canon) canon.setAttribute('href', location.href);

    var crumb = $('[data-article-crumb]'); if (crumb) crumb.textContent = a.shortTitle || a.title;
    var tag = $('[data-article-tag]');
    if (tag) {
      tag.className = 'tag ' + a.tint;
      var tagText = $('[data-article-tag-text]', tag) || tag;
      tagText.textContent = a.tag;
    }
    var titleEl = $('[data-article-title]') || $('#post-title');
    if (titleEl) titleEl.textContent = a.title;

    var avatar = $('[data-article-avatar]');
    if (avatar) {
      avatar.textContent = a.author.initials || 'WW';
      avatar.className = 'avatar ' + (a.author.tint || 'tint-cats');
    }
    var authorName = $('[data-article-author-name]');
    if (authorName) authorName.textContent = a.author.name;
    var authorRole = $('[data-article-author-role]');
    if (authorRole) authorRole.textContent = a.author.role;

    var dateEl = $('[data-article-date]');
    if (dateEl) {
      dateEl.textContent = a.date;
      if (a.datetime) dateEl.setAttribute('datetime', a.datetime);
    }
    var readEl = $('[data-article-readtime]');
    if (readEl) readEl.textContent = a.readTime;

    var hero = $('[data-article-hero]') || $('.article__hero img');
    if (hero) {
      hero.src = ROOT + 'assets/images/' + a.heroImg + '.webp';
      hero.srcset = ROOT + 'assets/images/' + a.heroImg + '-sm.webp 600w, ' + ROOT + 'assets/images/' + a.heroImg + '.webp 1200w';
      hero.alt = a.heroAlt;
    }

    var prose = $('[data-article]');
    if (prose) {
      var proseHtml = '<p class="lead">' + escapeHTML(a.lead) + '</p>';
      (a.sections || []).forEach(function (sec) {
        proseHtml += '<h2 id="' + sec.id + '">' + escapeHTML(sec.title) + '</h2>' + sec.html;
      });
      var shareUrl = encodeURIComponent(location.href);
      var shareTitle = encodeURIComponent(a.title || document.title);
      proseHtml += '<div class="share-row">Share this guide: ' +
        '<a class="icon-btn icon-btn--solid" href="https://www.facebook.com/sharer/sharer.php?u=' + shareUrl + '" target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">' +
        '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a> ' +
        '<a class="icon-btn icon-btn--solid" href="https://twitter.com/intent/tweet?url=' + shareUrl + '&text=' + shareTitle + '" target="_blank" rel="noopener noreferrer" aria-label="Share on X">' +
        '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg></a> ' +
        '<button class="icon-btn icon-btn--solid" type="button" aria-label="Copy link to this article" data-copy-link>' +
        '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg></button>' +
        '</div>';
      proseHtml += '<div class="author-box"><span class="avatar avatar--lg ' + (a.author.tint || 'tint-cats') + '" aria-hidden="true">' + (a.author.initials || 'WW') + '</span>' +
        '<div><strong>' + escapeHTML(a.author.name) + '</strong><p class="muted mt-2" style="font-size:var(--fs-sm)">' + escapeHTML(a.author.bio) + '</p></div></div>';
      prose.innerHTML = proseHtml;
    }

    var tocNav = $('[data-toc]');
    if (tocNav) {
      var ol = $('ol', tocNav);
      if (ol) {
        ol.innerHTML = (a.sections || []).map(function (sec) {
          return '<li><a href="#' + sec.id + '">' + escapeHTML(sec.title) + '</a></li>';
        }).join('');
      }
      initTOC();
    }

    var shopContainer = $('[data-article-shop]');
    if (shopContainer && a.products && a.products.length) {
      shopContainer.innerHTML = a.products.map(function (pid) {
        var p = product(pid);
        if (!p) return '';
        return '<li class="cart-item" style="grid-template-columns:56px 1fr auto;animation:none">' +
          '<img src="' + ROOT + 'assets/images/' + p.img + '.webp" alt="" width="56" height="56" loading="lazy" style="width:56px;height:56px">' +
          '<div><h3><a href="product.html?id=' + p.id + '" style="color:inherit;text-decoration:none">' + escapeHTML(p.name) + '</a></h3>' +
          '<span class="cart-item__price">' + inr(p.price) + '</span></div>' +
          '<button class="add-btn" type="button" data-add-to-cart="' + p.id + '" aria-label="Add ' + escapeHTML(p.name) + ' to basket">' +
          svg('plus') +
          '</button></li>';
      }).join('');
    }

    var moreContainer = $('[data-article-more]');
    if (moreContainer && a.related && a.related.length) {
      moreContainer.innerHTML = a.related.map(function (relId, idx) {
        var rel = findArticle(relId);
        if (!rel) return '';
        return '<article class="post-card" data-reveal style="--delay:' + (idx * 100) + 'ms" data-category="' + escapeHTML(rel.category) + '" data-title="' + escapeHTML(rel.title.toLowerCase()) + '">' +
          '<div class="post-card__media"><img src="' + ROOT + 'assets/images/' + rel.heroImg + '-sm.webp" srcset="' + ROOT + 'assets/images/' + rel.heroImg + '-sm.webp 600w, ' + ROOT + 'assets/images/' + rel.heroImg + '.webp 1200w" sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw" alt="' + escapeHTML(rel.heroAlt) + '" width="1200" height="800" loading="lazy" decoding="async"></div>' +
          '<div class="post-card__body">' +
          '<div class="post-card__meta"><span class="tag ' + rel.tint + '">' + escapeHTML(rel.tag) + '</span><span>' +
          svg('calendar') +
          '<time datetime="' + rel.datetime + '">' + rel.date + '</time></span><span>' +
          '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
          rel.readTime + '</span></div>' +
          '<h3><a href="blog-post.html?id=' + rel.id + '">' + escapeHTML(rel.title) + '</a></h3>' +
          '<p>' + escapeHTML(rel.excerpt) + '</p>' +
          '<span class="read-more">Read the guide ' + svg('arrow-right') + '</span>' +
          '</div></article>';
      }).join('');
      if (typeof reveal === 'function') reveal(moreContainer);
    }
  })();

  /* 15. Home 2 pet picker, countdown, calculator ------------------------ */
  var picks = $('[data-pet-picks]');
  if (picks) {
    var exclude = (picks.getAttribute('data-exclude') || '').split(',');
    $$('[data-pet-pick]').forEach(function (b) {
      on(b, 'click', function () {
        var pet = b.getAttribute('data-pet-pick');
        $$('[data-pet-pick]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        $$('[data-pet-name]').forEach(function (el) { el.textContent = petLabel(pet).toLowerCase(); });
        $$('[data-pet-link]').forEach(function (a) { a.href = 'pages/shop.html#' + pet; });
        var list = DATA.products.filter(function (p) { return p.pet === pet && exclude.indexOf(p.id) < 0; })
          .sort(function (a, c) { return (c.popular ? 1 : 0) - (a.popular ? 1 : 0) || c.rating - a.rating; });
        if (list.length < 4) list = list.concat(DATA.products.filter(function (p) { return p.pet !== pet && p.popular && exclude.indexOf(p.id) < 0; }));
        picks.style.transition = 'opacity 200ms ease';
        picks.style.opacity = '0';
        setTimeout(function () { renderGrid(picks, list.slice(0, 4)); picks.style.opacity = '1'; }, reduceMotion() ? 0 : 200);
      });
    });
  }

  $$('[data-countdown]').forEach(function (cd) {
    var spec = cd.getAttribute('data-countdown');
    var target;
    if (spec === 'week') {
      target = new Date(); target.setHours(23, 59, 59, 0);
      target.setDate(target.getDate() + ((7 - target.getDay()) % 7));
    } else {
      target = new Date(spec);
      if (isNaN(target) || target < new Date()) target = new Date(Date.now() + 30 * 864e5);
    }
    var units = { d: $('[data-cd="d"]', cd), h: $('[data-cd="h"]', cd), m: $('[data-cd="m"]', cd), s: $('[data-cd="s"]', cd) };
    function tick() {
      var diff = Math.max(0, target - new Date());
      var vals = { d: Math.floor(diff / 864e5), h: Math.floor(diff / 36e5) % 24, m: Math.floor(diff / 6e4) % 60, s: Math.floor(diff / 1e3) % 60 };
      Object.keys(units).forEach(function (k) {
        var el = units[k]; if (!el) return;
        var v = String(vals[k]).padStart(2, '0');
        if (el.textContent !== v) {
          el.textContent = v;
          var u = el.parentElement; u.classList.remove('tick'); void u.offsetWidth; u.classList.add('tick');
        }
      });
    }
    tick(); setInterval(tick, 1000);
  });

  $$('[data-calculator]').forEach(function (calc) {
    var G = DATA.grooming; if (!G) return;
    var totalEl = $('[data-calc-total]', calc), lines = $('[data-calc-lines]', calc), timeEl = $('[data-calc-time]', calc), book = $('[data-calc-book]', calc);
    var baseHref = book ? book.getAttribute('href') : 'contact.html#contact-form';
    function update() {
      var size = ($('input[type="radio"]:checked', calc) || {}).value || 'small';
      var pkId = $('select', calc).value;
      var pk = G.packages.filter(function (x) { return x.id === pkId; })[0];
      var sizeName = G.sizes.filter(function (s) { return s.id === size; })[0].name;
      var total = pk.prices[size];
      var html = '<li><span>' + pk.name + ' · ' + sizeName + '</span><span>' + inr(pk.prices[size]) + '</span></li>';
      var selectedAddons = [];
      $$('input[type="checkbox"]:checked', calc).forEach(function (c) {
        var a = G.addons.filter(function (x) { return x.id === c.value; })[0];
        total += a.price; html += '<li><span>' + a.name + '</span><span>+' + inr(a.price) + '</span></li>';
        selectedAddons.push(c.value);
      });
      lines.innerHTML = html;
      totalEl.textContent = inr(total);
      totalEl.classList.remove('is-updating'); void totalEl.offsetWidth; totalEl.classList.add('is-updating');
      timeEl.textContent = pk.time;
      if (book && baseHref.charAt(0) !== '#') {
        var hashIdx = baseHref.indexOf('#');
        var path = hashIdx > -1 ? baseHref.slice(0, hashIdx) : baseHref;
        var hash = hashIdx > -1 ? baseHref.slice(hashIdx) : '#contact-form';
        var query = '?type=grooming&package=' + encodeURIComponent(pkId) + '&size=' + encodeURIComponent(size);
        if (selectedAddons.length) {
          query += '&addons=' + encodeURIComponent(selectedAddons.join(','));
        }
        book.setAttribute('href', path + query + hash);
      }
      calc._choice = { pkg: pkId, size: size, addons: selectedAddons };
    }
    // Same-page booking form: prefill it in place instead of reloading
    if (book && baseHref.charAt(0) === '#') {
      on(book, 'click', function () {
        var ch = calc._choice || {};
        var pk = $('#bk-package'), sz = $('#bk-size'), tp = $('#bk-pettype');
        if (pk) pk.value = ch.pkg;
        if (sz) sz.value = ch.size;
        if (tp) tp.value = ch.size === 'cat' ? 'cat' : 'dog';
        setTimeout(function () { var f = $('#bk-owner'); if (f) f.focus({ preventScroll: true }); }, 600);
      });
    }
    on(calc, 'change', update);
    update();
  });
  (function prefillBooking() {
    var params = new URLSearchParams(location.search);
    var pk = $('#bk-package'), size = $('#bk-size'), type = $('#bk-pettype');
    if (pk && params.get('package')) pk.value = params.get('package');
    if (size && params.get('size')) { size.value = params.get('size'); if (type) type.value = params.get('size') === 'cat' ? 'cat' : 'dog'; }
    $$('[data-pick-package]').forEach(function (a) {
      on(a, 'click', function () { if (pk) pk.value = a.getAttribute('data-pick-package'); });
    });
  })();

  /* Live Interactive Store Map (Google Maps / OpenStreetMap Switcher) */
  (function initLiveMap() {
    var mapCard = $('.map-card');
    if (!mapCard) return;
    var iframe = $('#store-live-map', mapCard);
    var switchBtns = $$('[data-map-switch]', mapCard);
    var fullMapLink = $('#map-external-link', mapCard);
    var directionsLink = $('#map-directions-link', mapCard);
    if (!iframe || !switchBtns.length) return;

    var maps = {
      google: {
        embed: 'https://maps.google.com/maps?q=Lane+5,+North+Main+Road,+Koregaon+Park,+Pune,+Maharashtra+411001&t=&z=16&ie=UTF8&iwloc=&output=embed',
        external: 'https://maps.google.com/?q=Lane+5,+North+Main+Road,+Koregaon+Park,+Pune',
        directions: 'https://www.google.com/maps/dir/?api=1&destination=Lane+5,+North+Main+Road,+Koregaon+Park,+Pune,+Maharashtra+411001'
      },
      osm: {
        embed: 'https://www.openstreetmap.org/export/embed.html?bbox=73.8860%2C18.5310%2C73.9020%2C18.5415&layer=mapnik&marker=18.5362%2C73.8940',
        external: 'https://www.openstreetmap.org/?mlat=18.5362&mlon=73.8940#map=16/18.5362/73.8940',
        directions: 'https://www.openstreetmap.org/directions?to=18.5362%2C73.8940'
      }
    };

    switchBtns.forEach(function (btn) {
      on(btn, 'click', function () {
        var type = btn.getAttribute('data-map-switch');
        if (!maps[type]) return;
        switchBtns.forEach(function (b) {
          var active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        iframe.src = maps[type].embed;
        if (fullMapLink) fullMapLink.href = maps[type].external;
        if (directionsLink) directionsLink.href = maps[type].directions;
      });
    });
  })();

  /* Dynamic contact form handler (Grooming / Special Order / General) */
  (function initContactForm() {
    var form = $('#contact-form');
    if (!form) return;
    var G = DATA && DATA.grooming;
    var soType = $('#so-type', form);
    var soPet = $('#so-pet', form);
    var soSize = $('#so-size', form);
    var soPackage = $('#so-package', form);
    var soTime = $('#so-time', form);
    var soProduct = $('#so-product', form);
    var soBrand = $('#so-brand', form);
    var soQty = $('#so-qty', form);
    var soDate = $('#so-date', form);
    var soAddons = $$('input[name="addons"]', form);
    var groomingOnly = $$('[data-grooming-only]', form);
    var orderOnly = $$('[data-order-only]', form);
    var totalEl = $('[data-contact-total]', form);
    var linesEl = $('[data-contact-lines]', form);
    var timeEl = $('[data-contact-time]', form);
    var dateLabel = $('[data-date-label]', form);
    var dateHint = $('[data-date-hint]', form);
    var submitLabel = $('[data-submit-label]', form);
    var footNote = $('[data-foot-note]', form);

    var eyebrowText = $('[data-so-eyebrow-text]');
    var heading = $('[data-so-heading]');
    var lead = $('[data-so-lead]');
    var step1Title = $('[data-step-1-title]');
    var step1Desc = $('[data-step-1-desc]');
    var step2Title = $('[data-step-2-title]');
    var step2Desc = $('[data-step-2-desc]');
    var step3Title = $('[data-step-3-title]');
    var step3Desc = $('[data-step-3-desc]');
    var successTitle = $('[data-success-title]');
    var successDesc = $('[data-success-desc]');

    function updateEstimate() {
      if (!G) return;
      var size = (soSize && soSize.value) || 'small';
      var pkId = (soPackage && soPackage.value) || 'full';
      var pk = G.packages.filter(function (x) { return x.id === pkId; })[0] || G.packages[1];
      var sizeObj = G.sizes.filter(function (s) { return s.id === size; })[0] || G.sizes[0];
      var total = (pk.prices && pk.prices[size]) || 0;
      var html = '<li><span>' + pk.name + ' · ' + sizeObj.name + '</span><span style="font-weight:700;">' + inr(total) + '</span></li>';
      soAddons.forEach(function (cb) {
        if (cb.checked) {
          var a = G.addons.filter(function (x) { return x.id === cb.value; })[0];
          if (a) {
            total += a.price;
            html += '<li><span>' + a.name + '</span><span style="font-weight:700;">+' + inr(a.price) + '</span></li>';
          }
        }
      });
      if (linesEl) linesEl.innerHTML = html;
      if (totalEl) {
        totalEl.textContent = inr(total);
        totalEl.classList.remove('is-updating');
        void totalEl.offsetWidth;
        totalEl.classList.add('is-updating');
      }
      if (timeEl) timeEl.textContent = pk.time;
    }

    function setMode(mode) {
      if (soType) soType.value = mode;
      if (mode === 'grooming') {
        groomingOnly.forEach(function (el) { el.hidden = false; });
        orderOnly.forEach(function (el) { el.hidden = true; });
        if (soSize) { soSize.disabled = false; soSize.required = true; }
        if (soPackage) { soPackage.disabled = false; soPackage.required = true; }
        if (soTime) { soTime.disabled = false; soTime.required = true; }
        if (soProduct) { soProduct.disabled = true; soProduct.required = false; }
        if (soBrand) { soBrand.disabled = true; }
        if (soQty) { soQty.disabled = true; soQty.required = false; }
        if (soDate) {
          soDate.setAttribute('data-closed-days', '1');
          soDate.setAttribute('data-min-days', '1');
          var minDate = new Date(); minDate.setDate(minDate.getDate() + 1);
          soDate.min = localISO(minDate);
        }
        if (dateLabel) dateLabel.textContent = 'Preferred appointment date';
        if (dateHint) dateHint.textContent = 'Salon is closed on Mondays';
        if (submitLabel) submitLabel.textContent = 'Request appointment';
        if (footNote) footNote.textContent = 'No payment needed now · Pay at the salon.';
        if (eyebrowText) eyebrowText.textContent = 'Grooming appointment';
        if (heading) heading.textContent = "Book your pet's salon visit";
        if (lead) lead.textContent = 'Fear-free baths, breed-perfect trims and gentle nail care in our calm Koregaon Park salon. Pre-book your slot below.';
        if (step1Title) step1Title.textContent = 'Tell us about your pet';
        if (step1Desc) step1Desc.textContent = 'Choose your pet size, desired package and any gentle add-ons.';
        if (step2Title) step2Title.textContent = 'We confirm your slot';
        if (step2Desc) step2Desc.textContent = "We'll send a confirmation via WhatsApp with your appointment timing.";
        if (step3Title) step3Title.textContent = 'Pamper & collect';
        if (step3Desc) step3Desc.textContent = 'Relax while our fear-free groomers take care of your pet. Pay after your visit.';
        if (successTitle) successTitle.textContent = 'Appointment request received!';
        if (successDesc) successDesc.textContent = "Our grooming team will message you on WhatsApp within a few hours to confirm your slot.";
        updateEstimate();
      } else if (mode === 'order') {
        groomingOnly.forEach(function (el) { el.hidden = true; });
        orderOnly.forEach(function (el) { el.hidden = false; });
        if (soSize) { soSize.disabled = true; soSize.required = false; }
        if (soPackage) { soPackage.disabled = true; soPackage.required = false; }
        if (soTime) { soTime.disabled = true; soTime.required = false; }
        if (soProduct) { soProduct.disabled = false; soProduct.required = true; }
        if (soBrand) { soBrand.disabled = false; }
        if (soQty) { soQty.disabled = false; soQty.required = true; }
        if (soDate) {
          soDate.removeAttribute('data-closed-days');
          soDate.setAttribute('data-min-days', '2');
          var minDate2 = new Date(); minDate2.setDate(minDate2.getDate() + 2);
          soDate.min = localISO(minDate2);
        }
        if (dateLabel) dateLabel.textContent = 'Preferred pick-up date';
        if (dateHint) dateHint.textContent = 'At least 2 days from today';
        if (submitLabel) submitLabel.textContent = 'Send enquiry';
        if (footNote) footNote.textContent = 'No payment until your item arrives.';
        if (eyebrowText) eyebrowText.textContent = 'Special order enquiry';
        if (heading) heading.textContent = "Can't find it? We'll get it.";
        if (lead) lead.textContent = "Prescription diets, a specific brand, a bigger bag or a rare aquarium plant. Tell us what you need and we'll source it, usually within 3–5 days.";
        if (step1Title) step1Title.textContent = 'Tell us what you need';
        if (step1Desc) step1Desc.textContent = 'Share the product, size and quantity. Photos or vet notes help.';
        if (step2Title) step2Title.textContent = 'We quote within a day';
        if (step2Desc) step2Desc.textContent = 'Price, availability and an estimated arrival date, with no obligation.';
        if (step3Title) step3Title.textContent = 'Pick up or get it delivered';
        if (step3Desc) step3Desc.textContent = "We'll message the moment it lands. Pay only when you collect.";
        if (successTitle) successTitle.textContent = "Enquiry sent. We're on the hunt!";
        if (successDesc) successDesc.textContent = 'Rohan from our special orders team will get back to you within one working day with price and availability.';
      } else {
        groomingOnly.forEach(function (el) { el.hidden = true; });
        orderOnly.forEach(function (el) { el.hidden = true; });
        if (soSize) { soSize.disabled = true; soSize.required = false; }
        if (soPackage) { soPackage.disabled = true; soPackage.required = false; }
        if (soTime) { soTime.disabled = true; soTime.required = false; }
        if (soProduct) { soProduct.disabled = true; soProduct.required = false; }
        if (soBrand) { soBrand.disabled = true; }
        if (soQty) { soQty.disabled = true; soQty.required = false; }
        if (soDate) {
          soDate.removeAttribute('data-closed-days');
          soDate.setAttribute('data-min-days', '1');
          var minDate3 = new Date(); minDate3.setDate(minDate3.getDate() + 1);
          soDate.min = localISO(minDate3);
        }
        if (dateLabel) dateLabel.textContent = 'Preferred response date';
        if (dateHint) dateHint.textContent = 'We reply within 24 hours';
        if (submitLabel) submitLabel.textContent = 'Send message';
        if (footNote) footNote.textContent = 'We will get back to you promptly.';
        if (eyebrowText) eyebrowText.textContent = 'General enquiry';
        if (heading) heading.textContent = 'How can we help?';
        if (lead) lead.textContent = 'Have a question about our products, advice for your pet, or want to know more about our store? Drop us a note below.';
        if (step1Title) step1Title.textContent = 'Send your question';
        if (step1Desc) step1Desc.textContent = 'Tell us what you need help with in the notes.';
        if (step2Title) step2Title.textContent = 'Quick response';
        if (step2Desc) step2Desc.textContent = "Our team will reply by email, call or WhatsApp within 24 hours.";
        if (step3Title) step3Title.textContent = 'Expert guidance';
        if (step3Desc) step3Desc.textContent = 'Friendly advice from pet specialists who care.';
        if (successTitle) successTitle.textContent = 'Message sent!';
        if (successDesc) successDesc.textContent = 'Thank you for reaching out. Our team will get back to you shortly.';
      }
    }

    if (soType) {
      on(soType, 'change', function () { setMode(soType.value); });
    }
    if (soSize) {
      on(soSize, 'change', function () {
        if (soSize.value === 'cat') {
          if (soPet) soPet.value = 'cats';
        } else {
          if (soPet && (!soPet.value || soPet.value === 'cats')) soPet.value = 'dogs';
        }
        updateEstimate();
      });
    }
    if (soPet) {
      on(soPet, 'change', function () {
        if (soType && soType.value === 'grooming') {
          if (soPet.value === 'cats' && soSize) { soSize.value = 'cat'; }
          else if (soPet.value === 'dogs' && soSize && soSize.value === 'cat') { soSize.value = 'small'; }
          updateEstimate();
        }
      });
    }
    if (soPackage) {
      on(soPackage, 'change', updateEstimate);
    }
    soAddons.forEach(function (cb) {
      on(cb, 'change', updateEstimate);
    });

    // Check URL parameters
    var params = new URLSearchParams(location.search);
    var isGrooming = params.get('type') === 'grooming' || !!params.get('package') || !!params.get('size');
    if (isGrooming) {
      setMode('grooming');
      var sz = params.get('size');
      if (sz && soSize) {
        soSize.value = sz;
        if (sz === 'cat' && soPet) soPet.value = 'cats';
        else if (soPet) soPet.value = 'dogs';
      }
      var pk = params.get('package');
      if (pk && soPackage) {
        soPackage.value = pk;
      }
      var addons = params.get('addons');
      if (addons) {
        var aList = addons.split(',').map(function (s) { return s.trim(); });
        soAddons.forEach(function (cb) {
          cb.checked = aList.indexOf(cb.value) > -1;
        });
      }
      updateEstimate();
    } else {
      setMode(soType ? soType.value : 'order');
    }
  })();

  /* 16. Opening hours, blog & brand filters, TOC ----------------------- */
  function fmtTime(t) {
    var p = t.split(':'), h = parseInt(p[0], 10), m = p[1];
    return (h % 12 || 12) + (m !== '00' ? ':' + m : '') + (h < 12 ? ' am' : ' pm');
  }
  function toMin(t) { var p = t.split(':'); return parseInt(p[0], 10) * 60 + parseInt(p[1], 10); }
  function openState(hours) {
    var now = new Date(), day = now.getDay(), mins = now.getHours() * 60 + now.getMinutes();
    var today = hours[day];
    if (today && mins >= toMin(today[0]) && mins < toMin(today[1])) return { open: true, text: 'Open now · closes ' + fmtTime(today[1]), short: 'Open today ' + fmtTime(today[0]) + ' – ' + fmtTime(today[1]) };
    for (var i = 0; i < 7; i++) {
      var dd = (day + i) % 7, h = hours[dd];
      if (!h) continue;
      if (i === 0 && mins < toMin(h[0])) return { open: false, text: 'Closed · opens ' + fmtTime(h[0]) + ' today', short: 'Opens today at ' + fmtTime(h[0]) };
      if (i > 0) {
        var when = i === 1 ? 'tomorrow' : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dd];
        return { open: false, text: 'Closed · opens ' + fmtTime(h[0]) + ' ' + when, short: 'Closed now · opens ' + when + ' ' + fmtTime(h[0]) };
      }
    }
    return { open: false, text: 'Closed', short: 'Closed' };
  }
  function updateHours() {
    $$('[data-open-status]').forEach(function (el) {
      var src = el.getAttribute('data-hours') === 'salon' ? DATA.salonHours : DATA.hours;
      if (!src) return;
      var s = openState(src);
      if (el.getAttribute('data-open-status') === 'short') { el.textContent = s.short; return; }
      el.textContent = s.text;
      el.classList.toggle('is-open', s.open);
      el.classList.toggle('is-closed', !s.open);
    });
    var today = new Date().getDay();
    $$('[data-hours-table] tr[data-day]').forEach(function (tr) {
      var isToday = parseInt(tr.getAttribute('data-day'), 10) === today;
      tr.classList.toggle('is-today', isToday);
      var th = $('th', tr);
      if (isToday && th && !$('.sr-only', th)) th.insertAdjacentHTML('beforeend', '<span class="sr-only"> (today)</span>');
    });
  }
  updateHours(); setInterval(updateHours, 60000);

  var blogGrid = $('[data-blog-grid]');
  if (blogGrid) {
    var cat = 'all', term = '';
    var runBlog = function () {
      var shown = 0;
      $$('.post-card', blogGrid).forEach(function (c) {
        var ok = (cat === 'all' || c.getAttribute('data-category') === cat) && (!term || c.getAttribute('data-title').indexOf(term) > -1 || c.textContent.toLowerCase().indexOf(term) > -1);
        c.hidden = !ok;
        if (ok) { shown++; c.classList.add('is-revealed'); }
      });
      animateIn($$('.post-card:not([hidden])', blogGrid));
      $('[data-blog-empty]').hidden = shown > 0;
      $('[data-blog-count]').textContent = shown + (shown === 1 ? ' article' : ' articles') + ' shown';
    };
    $$('[data-blog-filter]').forEach(function (b) {
      on(b, 'click', function () {
        cat = b.getAttribute('data-blog-filter');
        $$('[data-blog-filter]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        runBlog();
      });
    });
    on($('[data-blog-search]'), 'input', debounce(function (e) { term = e.target.value.trim().toLowerCase(); runBlog(); }, 160));
  }

  var brandGrid = $('[data-brand-grid]');
  if (brandGrid) {
    $$('[data-brand-filter]').forEach(function (b) {
      on(b, 'click', function () {
        var pet = b.getAttribute('data-brand-filter'), n = 0;
        $$('[data-brand-filter]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        $$('.brand-card', brandGrid).forEach(function (c) {
          var ok = pet === 'all' || c.getAttribute('data-pets').split(' ').indexOf(pet) > -1;
          c.hidden = !ok; if (ok) { n++; c.classList.add('is-revealed'); }
        });
        animateIn($$('.brand-card:not([hidden])', brandGrid));
        $('[data-brand-count]').textContent = n + ' brands shown';
      });
    });
  }

  var tocObserver = null;
  function initTOC() {
    var toc = $('[data-toc]');
    if (!toc || !('IntersectionObserver' in window)) return;
    if (tocObserver) { tocObserver.disconnect(); tocObserver = null; }
    var links = $$('a', toc);
    var headings = $$('[data-article] h2[id]');
    if (!headings.length) return;
    tocObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          var act = a.getAttribute('href') === '#' + en.target.id;
          a.classList.toggle('is-active', act);
          if (act) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    headings.forEach(function (h) { tocObserver.observe(h); });
  }
  initTOC();

  on(d, 'click', function (e) {
    var shareFb = e.target.closest('[aria-label="Share on Facebook"]');
    if (shareFb) {
      e.preventDefault();
      var u = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(location.href);
      window.open(u, '_blank', 'noopener,noreferrer,width=620,height=440');
      return;
    }
    var shareX = e.target.closest('[aria-label="Share on X"]');
    if (shareX) {
      e.preventDefault();
      var t = document.title || 'Wag & Whisker';
      var u = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(location.href) + '&text=' + encodeURIComponent(t);
      window.open(u, '_blank', 'noopener,noreferrer,width=620,height=440');
      return;
    }
    var btn = e.target.closest('[data-copy-link]');
    if (!btn) return;
    var done = function () { toast('Link copied to clipboard', 'check'); };
    if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, done); else done();
  });

  /* 17. Form validation ------------------------------------------------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function isValidPhone(val) {
    var s = (val || '').trim();
    var digits = s.replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
    if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
    return /^[+]?[\d\s\-().]{7,25}$/.test(s) && digits.length === 10;
  }
  function labelText(ctrl) {
    var f = ctrl.closest('.field');
    var l = (ctrl.id && $('label[for="' + ctrl.id + '"]')) || (f && $('legend, .field-label, label', f));
    return l ? l.textContent.replace(/\*|\(optional\)/g, '').trim() : 'This field';
  }
  function localISO(dt) { return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0'); }
  $$('input[type="date"][data-rule="future-date"]').forEach(function (i) {
    var min = new Date(); min.setDate(min.getDate() + (parseInt(i.getAttribute('data-min-days') || '0', 10)));
    i.min = localISO(min);
  });
  function pwChecks(v) { return { len: v.length >= 8, upper: /[A-Z]/.test(v), num: /\d/.test(v), sym: /[^A-Za-z0-9]/.test(v) }; }

  function validateControl(ctrl) {
    var v = ctrl.type === 'checkbox' || ctrl.type === 'radio' ? null : ctrl.value.trim();
    var msg = '';
    var custom = function (k, fallback) { return ctrl.getAttribute('data-msg-' + k) || fallback; };
    var name = labelText(ctrl);
    if (ctrl.type === 'radio') {
      var group = $$('input[name="' + ctrl.name + '"]', ctrl.form);
      if (group.some(function (r) { return r.required; }) && !group.some(function (r) { return r.checked; })) msg = custom('required', 'Please choose one option.');
      return msg;
    }
    if (ctrl.type === 'checkbox') { if (ctrl.required && !ctrl.checked) msg = custom('required', 'Please tick this box to continue.'); return msg; }
    if (ctrl.required && !v) {
      return custom('required', ctrl.tagName === 'SELECT' ? 'Please choose a ' + name.toLowerCase() + '.' : 'Please enter your ' + name.toLowerCase().replace(/^your /, '') + '.');
    }
    if (!v) return '';
    var rule = ctrl.getAttribute('data-rule');
    var min = parseInt(ctrl.getAttribute('data-min') || '0', 10);
    if (ctrl.type === 'email' && !EMAIL_RE.test(v)) msg = custom('email', 'That email doesn’t look quite right. Try something like name@example.com.');
    else if (rule === 'phone' && !isValidPhone(v)) msg = custom('phone', 'Enter a 10-digit mobile number, e.g. 98765 43210.');
    else if (rule === 'pincode' && !/^[1-9]\d{5}$/.test(v)) msg = 'Enter a valid 6-digit PIN code.';
    else if (min && v.length < min) msg = custom('min', 'Please enter at least ' + min + ' characters.');
    else if (rule === 'strong-password') {
      var c = pwChecks(ctrl.value);
      if (!(c.len && c.upper && c.num && c.sym)) msg = 'Your password needs 8+ characters, an uppercase letter, a number and a symbol.';
    } else if (rule === 'range') {
      var n = Number(v), lo = Number(ctrl.min), hi = Number(ctrl.max);
      if (!Number.isInteger(n) || n < lo || n > hi) msg = 'Enter a whole number between ' + lo + ' and ' + hi + '.';
    } else if (rule === 'future-date') {
      var picked = new Date(v + 'T00:00:00');
      var minDays = parseInt(ctrl.getAttribute('data-min-days') || '0', 10);
      var earliest = new Date(); earliest.setHours(0, 0, 0, 0); earliest.setDate(earliest.getDate() + minDays);
      var closed = (ctrl.getAttribute('data-closed-days') || '').split(',').filter(Boolean).map(Number);
      if (isNaN(picked)) msg = 'Please choose a valid date.';
      else if (picked < earliest) msg = minDays ? 'Please choose a date at least ' + minDays + ' days from today.' : 'Please choose today or a later date.';
      else if (closed.indexOf(picked.getDay()) > -1) msg = 'The salon is closed on Mondays. Please pick another day.';
    }
    if (!msg && ctrl.hasAttribute('data-match')) {
      var other = d.getElementById(ctrl.getAttribute('data-match'));
      if (other && other.value !== ctrl.value) msg = 'Passwords don’t match yet.';
    }
    return msg;
  }
  function showState(ctrl, msg) {
    var field = ctrl.closest('.field');
    if (!field) return;
    var err = $('.field-error', field);
    var group = ctrl.type === 'radio' ? $$('input[name="' + ctrl.name + '"]', ctrl.form) : [ctrl];
    if (msg) {
      field.classList.add('is-invalid'); field.classList.remove('is-valid');
      if (err) { $('span', err).textContent = msg; err.hidden = false; }
      group.forEach(function (g) {
        g.setAttribute('aria-invalid', 'true');
        if (err && err.id) {
          var db = (g.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
          if (db.indexOf(err.id) < 0) { db.push(err.id); g.setAttribute('aria-describedby', db.join(' ')); }
        }
      });
    } else {
      field.classList.remove('is-invalid');
      var hasValue = ctrl.type === 'checkbox' || ctrl.type === 'radio' ? true : !!ctrl.value.trim();
      field.classList.toggle('is-valid', hasValue);
      group.forEach(function (g) { g.removeAttribute('aria-invalid'); });
    }
  }
  function controlsOf(form) { return $$('input, select, textarea', form).filter(function (c) { return c.type !== 'hidden' && c.type !== 'submit' && !c.disabled && !c.closest('[hidden]') && (c.required || c.hasAttribute('data-rule') || c.hasAttribute('data-match') || c.type === 'email' || c.hasAttribute('data-min')); }); }

  $$('form[data-validate]').forEach(function (form) {
    var alertBox = $('[data-form-alert]', form);
    controlsOf(form).forEach(function (c) {
      on(c, 'blur', function () { c._touched = true; showState(c, validateControl(c)); });
      on(c, c.tagName === 'SELECT' || c.type === 'checkbox' || c.type === 'radio' || c.type === 'date' ? 'change' : 'input', function () {
        if (c._touched || c.closest('.field.is-invalid')) showState(c, validateControl(c));
        if (c.id) $$('[data-match="' + c.id + '"]', form).forEach(function (m) { if (m.value) showState(m, validateControl(m)); });
      });
    });
    on(form, 'submit', function (e) {
      e.preventDefault();
      var firstBad = null, seen = {};
      controlsOf(form).forEach(function (c) {
        if (c.type === 'radio') { if (seen[c.name]) return; seen[c.name] = true; }
        c._touched = true;
        var msg = validateControl(c);
        showState(c, msg);
        if (msg && !firstBad) firstBad = c;
      });
      if (firstBad) {
        if (alertBox) alertBox.classList.add('is-visible');
        firstBad.focus();
        return;
      }
      if (alertBox) alertBox.classList.remove('is-visible');
      var btn = $('[type="submit"]', form);
      if (btn) btn.classList.add('is-loading');
      setTimeout(function () {
        if (btn) btn.classList.remove('is-loading');
        var successId = form.getAttribute('data-success');
        if (form.hasAttribute('data-clear-cart')) { cart = []; saveCart(); }
        if (successId) {
          var s = d.getElementById(successId);
          form.hidden = true;
          if (s) { s.classList.add('is-visible'); s.focus(); }
        }
        if (form.getAttribute('data-success-toast')) toast(form.getAttribute('data-success-toast'), 'circle-check');
        if (!form.hasAttribute('data-keep')) {
          form.reset();
          $$('.field', form).forEach(function (f) { f.classList.remove('is-valid', 'is-invalid'); });
          controlsOf(form).forEach(function (c) { c._touched = false; });
          $$('[data-pw-meter]', form).forEach(function (i) { i.dispatchEvent(new Event('input')); });
        }
        if (form.getAttribute('data-redirect')) setTimeout(function () { location.href = form.getAttribute('data-redirect'); }, 1300);
      }, 900);
    });
  });
  on(d, 'click', function (e) {
    var b = e.target.closest('[data-form-reset]');
    if (!b) return;
    var s = d.getElementById(b.getAttribute('data-form-reset'));
    var form = s && s.previousElementSibling;
    s.classList.remove('is-visible');
    if (form && form.tagName === 'FORM') { form.hidden = false; var f = $('input, select, textarea', form); if (f) f.focus(); }
  });
  // Re-open form next time any modal opens
  $$('.modal').forEach(function (m) {
    on(m, 'transitionend', function (e) {
      if (e.target === m && !m.classList.contains('is-open')) {
        var s = $('.form-success', m), f = $('form', m);
        if (s && s.classList.contains('is-visible')) { s.classList.remove('is-visible'); }
        if (f) {
          f.hidden = false;
          $$('.field', f).forEach(function (field) { field.classList.remove('is-valid', 'is-invalid'); });
          var alertBox = $('[data-form-alert]', f);
          if (alertBox) alertBox.classList.remove('is-visible');
        }
      }
    });
  });

  $$('[data-toggle-password]').forEach(function (b) {
    on(b, 'click', function () {
      var input = d.getElementById(b.getAttribute('data-toggle-password'));
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      b.setAttribute('aria-pressed', show ? 'true' : 'false');
      b.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      b.innerHTML = svg(show ? 'eye-off' : 'eye');
    });
  });
  if (!ICONS['eye-off']) ICONS['eye-off'] = '<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>';
  if (!ICONS.languages) ICONS.languages = '<path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>';
  if (!ICONS.gift) ICONS.gift = '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>';

  $$('[data-pw-meter]').forEach(function (input) {
    var meter = d.getElementById(input.getAttribute('data-pw-meter'));
    var rules = $('[data-pw-rules="' + input.id + '"]');
    on(input, 'input', function () {
      var c = pwChecks(input.value), score = 0;
      Object.keys(c).forEach(function (k) { if (c[k]) score++; });
      if (!input.value) score = 0;
      meter.setAttribute('data-score', score);
      if (rules) $$('li', rules).forEach(function (li) { li.classList.toggle('is-met', !!c[li.getAttribute('data-rule')] && !!input.value); });
    });
  });

  $$('textarea[data-counter][maxlength]').forEach(function (t) {
    var max = t.getAttribute('maxlength');
    var p = d.createElement('p');
    p.className = 'field-hint'; p.id = t.id + '-count';
    p.textContent = '0 / ' + max + ' characters';
    t.insertAdjacentElement('afterend', p);
    t.setAttribute('aria-describedby', ((t.getAttribute('aria-describedby') || '') + ' ' + p.id).trim());
    on(t, 'input', function () { p.textContent = t.value.length + ' / ' + max + ' characters'; });
  });

  /* Mark the shop nav as current for hash links on the shop page */
  if (body.getAttribute('data-page') === 'shop') {
    var shopLink = $('.nav-link[href*="shop.html"]'); if (shopLink) shopLink.classList.add('is-current');
  }

  /* Auto-open forgot password modal if specified in URL hash */
  function checkForgotHash() {
    var h = window.location.hash;
    if (h === '#forgot' || h === '#forgot-password' || h === '#forgot-modal') {
      var forgotModal = $('#forgot-modal');
      if (forgotModal) {
        var siEmail = $('#si-email');
        var fpEmail = $('#fp-email');
        if (siEmail && fpEmail && siEmail.value && !fpEmail.value) {
          fpEmail.value = siEmail.value;
        }
        openOverlay(forgotModal);
      }
    }
  }
  /* Auto-scroll to target form on hash navigation (e.g. #contact-form) */
  function checkFormHash() {
    var h = window.location.hash;
    if (h === '#contact-form' || h === '#special-order') {
      var target = $(h);
      if (target) {
        var parentReveal = target.closest('[data-reveal]');
        if (parentReveal) parentReveal.classList.add('is-revealed');
        target.classList.add('is-revealed');
        setTimeout(function () {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          var firstInput = $('input:not([type="hidden"]), select, textarea', target);
          if (firstInput) firstInput.focus({ preventScroll: true });
        }, 120);
      }
    }
  }
  checkForgotHash();
  checkFormHash();
  on(window, 'hashchange', function () {
    checkForgotHash();
    checkFormHash();
  });
  /* 18. Home 1 Pet Routine Matcher --------------------------------------- */
  (function () {
    var matcher = $('[data-routine-matcher]');
    if (!matcher) return;

    var routines = {
      dogs: {
        title: 'Daily Vitality & Care Plan for Dogs',
        subtitle: 'Balanced nutrition, plaque-control chews and joint-soothing sleep for Pune pups.',
        petTag: 'Dogs · Vet Approved',
        tint: 'tint-dogs',
        tipAuthor: 'Dr. Meera Kulkarni · Lead Veterinary Advisor',
        tipText: 'In Pune\'s humid monsoon and autumn, pairing a high-protein morning meal with an evening brushing session keeps coat oils balanced and prevents skin hotspots.',
        link: 'pages/shop.html#dogs',
        linkLabel: 'Explore all dog essentials',
        steps: [
          {
            badge: 'Step 01 · Morning Nutrition',
            title: 'Grain-Free Chicken Kibble',
            desc: 'Real deboned chicken & prebiotic fiber support gentle digestion and steady stamina.',
            product: 'kibble'
          },
          {
            badge: 'Step 02 · Afternoon Enrichment',
            title: 'Peanut Butter Bone Biscuits',
            desc: 'Oven-baked crunchy treats scrape plaque naturally while keeping dogs happily engaged.',
            product: 'bone-biscuits'
          },
          {
            badge: 'Step 03 · Evening Wind-Down',
            title: 'Memory Foam Bolster Bed',
            desc: 'Orthopedic pressure relief cradles hip joints and neck after energetic park runs.',
            product: 'orthopedic-bed'
          }
        ]
      },
      cats: {
        title: 'Indoor Harmony & Play Routine for Cats',
        subtitle: 'Whiskers-safe dining, vertical territory and interactive bonding to keep cats thriving indoors.',
        petTag: 'Cats · Feline Specialist',
        tint: 'tint-cats',
        tipAuthor: 'Neha Joshi · Feline Behavior & Grooming Lead',
        tipText: 'Indoor cats need vertical territory. Combining a 10-minute wand play session before dinner satisfies their predatory drive and prevents nighttime zoomies.',
        link: 'pages/shop.html#cats',
        linkLabel: 'Explore all cat essentials',
        steps: [
          {
            badge: 'Step 01 · Whiskers-Safe Dining',
            title: 'Ergonomic Raised Ceramic Bowl',
            desc: 'Shallow angled design prevents whisker fatigue and supports smooth esophagus posture.',
            product: 'raised-bowl'
          },
          {
            badge: 'Step 02 · Vertical Territory',
            title: 'Skyline 5-Level Cat Tree',
            desc: 'Natural sisal posts and plush platforms satisfy climbing instincts away from furniture.',
            product: 'cat-tree'
          },
          {
            badge: 'Step 03 · Evening Hunt & Bond',
            title: 'Feather Teaser Wand',
            desc: 'Aerodynamic feathers mimic bird flight for healthy cardiovascular jumping and bonding.',
            product: 'feather-wand'
          }
        ]
      },
      birds: {
        title: 'Avian Foraging & Song Routine for Birds',
        subtitle: 'Mental foraging stimulation, clean acoustics and feather vitality for companion birds.',
        petTag: 'Birds · Avian Care',
        tint: 'tint-birds',
        tipAuthor: 'Rahul Sharma · Avian Care Specialist',
        tipText: 'Place food in hanging foraging feeders rather than open cups. Active foraging burns nervous energy and prevents destructive feather plucking.',
        link: 'pages/shop.html#birds',
        linkLabel: 'Explore all bird essentials',
        steps: [
          {
            badge: 'Step 01 · Morning Forage',
            title: 'Hanging Acrylic Seed Feeder',
            desc: 'Multi-compartment dispenser encourages natural foraging and keeps seeds dry.',
            product: 'seed-feeder'
          },
          {
            badge: 'Step 02 · Wing Exercise',
            title: 'Brass Arch Bird Cage',
            desc: 'Generous flight bar spacing allows full wing extension and comfortable perch hops.',
            product: 'brass-cage'
          },
          {
            badge: 'Step 03 · Secure Roosting',
            title: 'Heritage Hanging Bird Cage',
            desc: 'Protected domed architecture creates a safe, draught-free roosting zone for 10-hour rest.',
            product: 'hanging-cage'
          }
        ]
      },
      fish: {
        title: 'Aquatic Equilibrium Routine for Fish',
        subtitle: 'Crystal-clear biological filtration, balanced lighting and low-stress feeding.',
        petTag: 'Fish · Aquarist Pick',
        tint: 'tint-fish',
        tipAuthor: 'Aditya Nair · Senior Aquarist',
        tipText: 'Feed only what fish consume in 90 seconds. Clean living bio-plants and stable water temperature prevent 90% of common aquarium diseases.',
        link: 'pages/shop.html#fish',
        linkLabel: 'Explore all fish essentials',
        steps: [
          {
            badge: 'Step 01 · Desktop Clarity',
            title: 'Artisan Glass Fish Bowl',
            desc: 'Clear hand-blown glass provides distortion-free viewing for desktop companions.',
            product: 'fish-bowl'
          },
          {
            badge: 'Step 02 · Daytime Flora',
            title: 'Nano Planted Aquarium Kit',
            desc: 'Integrated 3-stage filtration and natural spectrum LED support healthy live plants.',
            product: 'nano-aquarium'
          },
          {
            badge: 'Step 03 · Crystal Panoramic',
            title: 'Crystal Rimless Tank 45L',
            desc: 'High-clarity low-iron glass and water volume stability for sensitive tropical schools.',
            product: 'rimless-tank'
          }
        ]
      },
      small: {
        title: 'Natural Forage & Burrow Routine for Small Pets',
        subtitle: 'High-fiber digestive health, continuous dental wear and safe burrowing shelters.',
        petTag: 'Small Pets · Nutritionist Pick',
        tint: 'tint-small',
        tipAuthor: 'Priya Sen · Exotic Pet Nutritionist',
        tipText: 'Small herbivores need constant chewing opportunities. Untreated timber cabins and high-fiber forage prevent life-threatening dental overgrowth.',
        link: 'pages/shop.html#small',
        linkLabel: 'Explore all small pet essentials',
        steps: [
          {
            badge: 'Step 01 · Natural Chewing',
            title: 'Natural Timber Cavy Hideaway',
            desc: 'Untreated kiln-dried pine wears teeth down safely while offering a secure retreat.',
            product: 'cavy-hideaway'
          },
          {
            badge: 'Step 02 · Spine-Safe Exercise',
            title: 'Silent Spinner Wheel',
            desc: 'Solid running track prevents tail catching and supports natural spine curvature.',
            product: 'hamster-wheel'
          },
          {
            badge: 'Step 03 · Cozy Burrowing',
            title: 'Cozy Timber Cabin Hideout',
            desc: 'Ventilated wooden shelter promotes dark, quiet daytime nesting and relaxation.',
            product: 'hamster-hideout'
          }
        ]
      }
    };

    var tabs = $$('[data-routine-tab]', matcher);
    var display = $('[data-routine-display]', matcher);
    if (!tabs.length || !display) return;

    function render(petKey) {
      var data = routines[petKey] || routines.dogs;
      tabs.forEach(function (t) {
        var active = t.getAttribute('data-routine-tab') === petKey;
        t.setAttribute('aria-selected', active ? 'true' : 'false');
        t.classList.toggle('is-active', active);
      });

      display.style.transition = 'opacity 180ms ease, transform 180ms ease';
      display.style.opacity = '0';
      display.style.transform = 'translateY(6px)';

      setTimeout(function () {
        var stepsHtml = data.steps.map(function (s) {
          var p = product(s.product) || {};
          var pImg = p.img || 'p-kibble';
          var pName = p.name || s.title;
          var pPrice = p.price ? inr(p.price) : '';
          var pOld = p.old ? '<del>' + inr(p.old) + '</del>' : '';
          return '<div class="routine-step">' +
            '<span class="routine-step__badge">' + svg('check') + escapeHTML(s.badge) + '</span>' +
            '<h4 class="routine-step__heading">' + escapeHTML(s.title) + '</h4>' +
            '<p class="routine-step__desc">' + escapeHTML(s.desc) + '</p>' +
            '<div class="routine-step__item">' +
              '<img class="routine-step__thumb" src="assets/images/' + pImg + '.webp" alt="' + escapeHTML(p.alt || pName) + '" width="800" height="800" loading="lazy">' +
              '<div class="routine-step__info">' +
                '<a class="routine-step__name" href="pages/product.html?id=' + (p.id || s.product) + '">' + escapeHTML(pName) + '</a>' +
                '<span class="routine-step__price">' + pPrice + ' ' + pOld + '</span>' +
              '</div>' +
              '<div class="cluster" style="gap:4px">' +
                '<button type="button" class="icon-btn icon-btn--sm" data-quick-view="' + (p.id || s.product) + '" aria-label="Quick view: ' + escapeHTML(pName) + '">' + svg('eye') + '</button>' +
                '<button type="button" class="add-btn add-btn--sm" data-add-to-cart="' + (p.id || s.product) + '" aria-label="Add ' + escapeHTML(pName) + ' to basket">' + svg('shopping-bag') + '</button>' +
              '</div>' +
            '</div>' +
          '</div>';
        }).join('');

        display.innerHTML =
          '<div class="routine-card__head">' +
            '<div class="routine-card__title">' +
              '<span class="tag ' + data.tint + '">' + escapeHTML(data.petTag) + '</span>' +
              '<div>' +
                '<h3 class="h4" style="margin:0">' + escapeHTML(data.title) + '</h3>' +
                '<p class="text-soft" style="margin:2px 0 0;font-size:var(--fs-xs)">' + escapeHTML(data.subtitle) + '</p>' +
              '</div>' +
            '</div>' +
            '<a class="btn btn-outline btn-sm" href="' + data.link + '">' + escapeHTML(data.linkLabel) + ' ' + svg('arrow-right', 'icon--nudge') + '</a>' +
          '</div>' +
          '<div class="routine-steps">' + stepsHtml + '</div>' +
          '<div class="routine-tip-bar ' + data.tint + '">' +
            '<span class="avatar ' + data.tint + '" aria-hidden="true">' + svg('heart-handshake') + '</span>' +
            '<div>' +
              '<strong>' + escapeHTML(data.tipAuthor) + '</strong>' +
              '<p>' + escapeHTML(data.tipText) + '</p>' +
            '</div>' +
          '</div>';

        display.style.opacity = '1';
        display.style.transform = 'none';
      }, reduceMotion() ? 0 : 180);
    }

    tabs.forEach(function (tab) {
      on(tab, 'click', function () {
        render(tab.getAttribute('data-routine-tab'));
      });
    });
  })();
})();

