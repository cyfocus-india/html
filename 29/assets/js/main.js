/* ==========================================================================
   Copper Pot Cooking Studio — main.js
   Shared behaviour for every public page + Sign In / Sign Up.
   1. Preferences (theme + direction, saved in localStorage)
   2. Header: sticky shadow, Home dropdown, mobile slide-in panel
   3. Scroll reveal + footer year
   4. Classes page: filters, search, query-string presets
   5. Tabs (Weekend Workshops itinerary)
   6. Gallery: filters + lightbox
   7. Contact form validation
   8. Opening hours "today" highlight
   9. Sign In / Forgot password / Sign Up
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var STORE = { theme: 'cp-theme', dir: 'cp-dir', users: 'cp-users', session: 'cp-session' };

  /* Safe localStorage helpers (file:// and private windows can throw) */
  function getItem(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function setItem(key, val) { try { localStorage.setItem(key, val); } catch (e) { /* ignore */ } }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ------------------------------------------------------------------
     1. Preferences
     ------------------------------------------------------------------ */
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    $$('[data-theme-toggle]').forEach(function (btn) {
      var dark = theme === 'dark';
      btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      var icon = btn.querySelector('[aria-hidden]');
      if (icon) icon.textContent = dark ? '☀' : '☾';
    });
    document.dispatchEvent(new CustomEvent('cp:themechange', { detail: theme }));
  }

  function applyDir(dir) {
    root.setAttribute('dir', dir);
    $$('[data-dir-toggle]').forEach(function (btn) {
      var rtl = dir === 'rtl';
      btn.setAttribute('aria-label', rtl ? 'Switch to left-to-right layout' : 'Switch to right-to-left layout');
      btn.setAttribute('aria-pressed', rtl ? 'true' : 'false');
      var label = btn.querySelector('.dir-label');
      if (label) label.textContent = rtl ? 'LTR' : 'RTL';
    });
    document.dispatchEvent(new CustomEvent('cp:dirchange', { detail: dir }));
  }

  applyTheme(getItem(STORE.theme) || 'light');
  applyDir(getItem(STORE.dir) || 'ltr');

  document.addEventListener('click', function (e) {
    var themeBtn = e.target.closest('[data-theme-toggle]');
    if (themeBtn) {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setItem(STORE.theme, next);
      applyTheme(next);
    }
    var dirBtn = e.target.closest('[data-dir-toggle]');
    if (dirBtn) {
      var nextDir = root.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
      setItem(STORE.dir, nextDir);
      applyDir(nextDir);
    }
  });

  /* Keep tabs in sync if preferences change in another tab */
  window.addEventListener('storage', function (e) {
    if (e.key === STORE.theme && e.newValue) applyTheme(e.newValue);
    if (e.key === STORE.dir && e.newValue) applyDir(e.newValue);
  });

  /* ------------------------------------------------------------------
     2. Header + navigation
     ------------------------------------------------------------------ */
  var header = $('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var nav = $('#main-nav');
  var burger = $('.hamburger');
  var mobileQuery = window.matchMedia('(max-width: 1024px)');

  function setDropdown(item, open) {
    var toggle = item.querySelector('.dropdown-toggle');
    item.classList.toggle('is-open', open);
    if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function closeAllDropdowns(except) {
    $$('.has-dropdown').forEach(function (item) { if (item !== except) setDropdown(item, false); });
  }

  /* Dropdown: click on all sizes (accordion on mobile), hover on desktop */
  $$('.has-dropdown').forEach(function (item) {
    var toggle = item.querySelector('.dropdown-toggle');
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !item.classList.contains('is-open');
      closeAllDropdowns(item);
      setDropdown(item, open);
    });
    item.addEventListener('mouseenter', function () { if (!mobileQuery.matches) setDropdown(item, true); });
    item.addEventListener('mouseleave', function () { if (!mobileQuery.matches) setDropdown(item, false); });
    item.addEventListener('focusout', function (e) {
      if (!mobileQuery.matches && !item.contains(e.relatedTarget)) setDropdown(item, false);
    });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && item.classList.contains('is-open')) {
        e.stopPropagation();
        setDropdown(item, false);
        toggle.focus();
      }
    });
  });

  function openNav() {
    if (!nav) return;
    nav.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('nav-open');
    var first = nav.querySelector('a, button');
    if (first) setTimeout(function () { first.focus(); }, 60);
  }

  function closeNav(returnFocus) {
    if (!nav || !nav.classList.contains('is-open')) return;
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('nav-open');
    if (returnFocus) burger.focus();
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) closeNav(false); else openNav();
    });

    /* Close on any link click inside the panel, or a click on the dimmed area outside it */
    nav.addEventListener('click', function (e) {
      if (e.target === nav || e.target.closest('a')) closeNav(false);
    });

    /* Keep keyboard focus inside the open panel (panel + header buttons) */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeNav(true); closeAllDropdowns(); }
      if (e.key !== 'Tab' || !nav.classList.contains('is-open')) return;
      var focusables = [burger].concat($$('a[href], button:not([disabled])', nav));
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    /* Reset the panel when resizing up to desktop */
    var resetOnDesktop = function () { if (!mobileQuery.matches) { closeNav(false); closeAllDropdowns(); } };
    if (mobileQuery.addEventListener) mobileQuery.addEventListener('change', resetOnDesktop);
    else if (mobileQuery.addListener) mobileQuery.addListener(resetOnDesktop);
  }

  /* Outside click closes the desktop dropdown */
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-dropdown')) closeAllDropdowns();
  });

  /* ------------------------------------------------------------------
     3. Scroll reveal + footer year
     ------------------------------------------------------------------ */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ------------------------------------------------------------------
     4. Classes page filters
     ------------------------------------------------------------------ */
  var catalog = $('[data-catalog]');
  if (catalog) {
    var cards = $$('[data-class]', catalog);
    var state = { cuisine: 'all', level: 'all', q: '' };
    var countEl = $('[data-result-count]');
    var emptyEl = $('[data-empty]');
    var searchEl = $('[data-class-search]');

    /* Preset filters from the Home 2 class finder (?cuisine=…&level=…) */
    var params = new URLSearchParams(window.location.search);
    ['cuisine', 'level'].forEach(function (key) {
      var val = (params.get(key) || '').toLowerCase();
      if (val && $('[data-filter="' + key + '"][data-value="' + val + '"]')) state[key] = val;
    });

    function syncButtons() {
      $$('[data-filter]').forEach(function (btn) {
        var group = btn.getAttribute('data-filter');
        btn.setAttribute('aria-pressed', btn.getAttribute('data-value') === state[group] ? 'true' : 'false');
      });
    }

    function applyFilters() {
      var shown = 0;
      cards.forEach(function (card) {
        var matchCuisine = state.cuisine === 'all' || card.getAttribute('data-cuisine') === state.cuisine;
        var matchLevel = state.level === 'all' || card.getAttribute('data-level') === state.level;
        var matchText = !state.q || card.textContent.toLowerCase().indexOf(state.q) !== -1;
        var visible = matchCuisine && matchLevel && matchText;
        card.hidden = !visible;
        if (visible) shown++;
      });
      if (countEl) countEl.textContent = shown + (shown === 1 ? ' class' : ' classes') + ' found';
      if (emptyEl) emptyEl.hidden = shown !== 0;
      syncButtons();
    }

    $$('[data-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state[btn.getAttribute('data-filter')] = btn.getAttribute('data-value');
        applyFilters();
      });
    });
    if (searchEl) {
      searchEl.addEventListener('input', function () {
        state.q = searchEl.value.trim().toLowerCase();
        applyFilters();
      });
    }
    $$('[data-reset-filters]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state = { cuisine: 'all', level: 'all', q: '' };
        if (searchEl) searchEl.value = '';
        applyFilters();
      });
    });
    applyFilters();
  }

  /* ------------------------------------------------------------------
     5. Tabs (roving arrow-key focus, ARIA tabs pattern)
     ------------------------------------------------------------------ */
  $$('[data-tabs]').forEach(function (wrap) {
    var tabs = $$('[role="tab"]', wrap);
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
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
        var next = null;
        if (e.key === 'ArrowRight') next = tabs[(i + (rtl ? -1 : 1) + tabs.length) % tabs.length];
        if (e.key === 'ArrowLeft') next = tabs[(i + (rtl ? 1 : -1) + tabs.length) % tabs.length];
        if (e.key === 'Home') next = tabs[0];
        if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); select(next, true); }
      });
    });
  });

  /* ------------------------------------------------------------------
     6. Gallery filters + lightbox
     ------------------------------------------------------------------ */
  var gallery = $('[data-gallery]');
  if (gallery) {
    var items = $$('.gallery-item', gallery);
    $$('[data-gallery-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var val = btn.getAttribute('data-gallery-filter');
        $$('[data-gallery-filter]').forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        items.forEach(function (item) {
          var show = val === 'all' || item.getAttribute('data-cat') === val;
          item.classList.toggle('is-hidden', !show);
        });
      });
    });

    var lb = $('[data-lightbox]');
    var lbImg = $('img', lb);
    var lbCap = $('figcaption', lb);
    var current = 0;
    var lastFocus = null;

    function visibleItems() { return items.filter(function (i) { return !i.classList.contains('is-hidden'); }); }
    function show(index) {
      var list = visibleItems();
      if (!list.length) return;
      current = (index + list.length) % list.length;
      var img = $('img', list[current]);
      lbImg.src = img.getAttribute('src');
      lbImg.alt = img.getAttribute('alt');
      lbCap.textContent = list[current].getAttribute('data-caption') || img.alt;
    }
    function openLb(item) {
      lastFocus = item;
      show(visibleItems().indexOf(item));
      lb.hidden = false;
      document.body.classList.add('nav-open');
      $('.lb-close', lb).focus();
    }
    function closeLb() {
      lb.hidden = true;
      document.body.classList.remove('nav-open');
      if (lastFocus) lastFocus.focus();
    }
    items.forEach(function (item) { item.addEventListener('click', function () { openLb(item); }); });
    $('.lb-close', lb).addEventListener('click', closeLb);
    $('.lb-prev', lb).addEventListener('click', function () { show(current - 1); });
    $('.lb-next', lb).addEventListener('click', function () { show(current + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      var rtl = root.getAttribute('dir') === 'rtl';
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowRight') show(current + (rtl ? -1 : 1));
      if (e.key === 'ArrowLeft') show(current + (rtl ? 1 : -1));
      if (e.key === 'Tab') {
        var f = $$('button', lb);
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
  }

  /* ------------------------------------------------------------------
     Shared form helpers
     ------------------------------------------------------------------ */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(input, message) {
    var field = input.closest('.field');
    var out = field ? field.querySelector('.field-error') : null;
    if (field) field.classList.toggle('has-error', !!message);
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (out) out.textContent = message || '';
    return !message;
  }

  function validateField(input) {
    var val = (input.value || '').trim();
    var label = input.getAttribute('data-label') || 'This field';
    if (input.type === 'checkbox') return setError(input, input.required && !input.checked ? input.getAttribute('data-msg') || 'Please tick this box.' : '');
    if (input.required && !val) return setError(input, label + ' is required.');
    if (val && input.type === 'email' && !EMAIL_RE.test(val)) return setError(input, 'Enter a valid email, like name@example.com.');
    if (val && input.type === 'tel' && !/^[+()\-\s\d]{7,}$/.test(val)) return setError(input, 'Enter a valid phone number.');
    var min = parseInt(input.getAttribute('data-minlength') || input.getAttribute('minlength') || '0', 10);
    if (val && min && val.length < min) return setError(input, label + ' needs at least ' + min + ' characters.');
    var match = input.getAttribute('data-match');
    if (match) {
      var other = document.getElementById(match);
      if (other && val !== other.value) return setError(input, 'Passwords do not match.');
    }
    return setError(input, '');
  }

  function validateForm(form) {
    var ok = true;
    var firstBad = null;
    $$('[data-validate]', form).forEach(function (input) {
      if (!validateField(input)) { ok = false; if (!firstBad) firstBad = input; }
    });
    if (firstBad) firstBad.focus();
    return ok;
  }

  /* Live re-validation after a field has been touched */
  document.addEventListener('blur', function (e) {
    if (e.target.matches && e.target.matches('[data-validate]') && e.target.value) validateField(e.target);
  }, true);
  document.addEventListener('input', function (e) {
    if (e.target.matches && e.target.matches('[data-validate]') && e.target.getAttribute('aria-invalid') === 'true') validateField(e.target);
  });

  /* Show / hide password buttons */
  $$('[data-pw-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = document.getElementById(btn.getAttribute('aria-controls'));
      var showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      btn.textContent = showing ? 'Show' : 'Hide';
      btn.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
      btn.setAttribute('aria-pressed', showing ? 'false' : 'true');
    });
  });

  /* Shared helpers for dashboard.js */
  window.CP = {
    getItem: getItem,
    setItem: setItem,
    validateForm: validateForm,
    setError: setError,
    setTheme: function (t) { setItem(STORE.theme, t); applyTheme(t); },
    setDir: function (d) { setItem(STORE.dir, d); applyDir(d); }
  };

  /* ------------------------------------------------------------------
     7. Contact form & Seat booking
     ------------------------------------------------------------------ */
  var contactForm = $('[data-contact-form]');
  if (contactForm) {
    var params = new URLSearchParams(window.location.search);
    var topicSel = $('#c-topic');
    var classField = $('#field-class');
    var workshopField = $('#field-workshop');
    var classSel = $('#c-class');
    var workshopSel = $('#c-workshop');
    var guestsInput = $('#c-guests');
    var dateInput = $('#c-date');
    var messageInput = $('#c-message');
    var submitBtn = $('#c-submit');
    var summaryBox = $('#booking-summary');
    var bsType = $('#bs-type');
    var bsTitle = $('#bs-title');
    var bsMeta = $('#bs-meta');
    var bsRate = $('#bs-rate');
    var bsTotal = $('#bs-total');

    function updateBookingView() {
      var topic = topicSel ? topicSel.value : '';
      var isClasses = topic === 'classes';
      var isWorkshops = topic === 'workshops';

      if (classField) classField.hidden = !isClasses;
      if (workshopField) workshopField.hidden = !isWorkshops;

      var activeSel = isClasses ? classSel : (isWorkshops ? workshopSel : null);
      if (classSel) {
        if (isClasses) classSel.setAttribute('data-validate', '');
        else classSel.removeAttribute('data-validate');
      }
      if (workshopSel) {
        if (isWorkshops) workshopSel.setAttribute('data-validate', '');
        else workshopSel.removeAttribute('data-validate');
      }

      if (!activeSel || !activeSel.value) {
        if (summaryBox) summaryBox.hidden = true;
        if (submitBtn) submitBtn.textContent = (isClasses || isWorkshops) ? 'Book seats' : 'Send message';
        return;
      }

      var opt = activeSel.selectedOptions ? activeSel.selectedOptions[0] : null;
      if (!opt) return;

      var title = opt.getAttribute('data-title') || opt.textContent.split('—')[0].trim();
      var price = parseInt(opt.getAttribute('data-price') || '0', 10);
      var date = opt.getAttribute('data-date') || '';
      var time = opt.getAttribute('data-time') || '';
      var chef = opt.getAttribute('data-chef') || '';
      var dates = opt.getAttribute('data-dates') || date;
      var seats = parseInt(guestsInput ? guestsInput.value || '1' : '1', 10) || 1;
      if (seats < 1) seats = 1;
      var total = price * seats;

      if (date && dateInput && (!dateInput.value || dateInput.dataset.autofilled === 'true')) {
        dateInput.value = date;
        dateInput.dataset.autofilled = 'true';
      }

      if (summaryBox) {
        summaryBox.hidden = false;
        if (bsType) bsType.textContent = isWorkshops ? 'Weekend Workshop Booking' : 'Cooking Class Booking';
        if (bsTitle) bsTitle.textContent = title;
        if (bsMeta) bsMeta.textContent = dates + (time ? ' · ' + time : '') + (chef ? ' · ' + chef : '');
        if (bsRate) bsRate.textContent = '$' + price + ' / seat';
        if (bsTotal) bsTotal.textContent = '$' + total + ' total (' + seats + (seats > 1 ? ' seats' : ' seat') + ')';
      }

      if (submitBtn) {
        submitBtn.textContent = 'Book ' + seats + (seats > 1 ? ' seats' : ' seat') + (total > 0 ? ' · $' + total : '');
      }

      if (messageInput && (!messageInput.value || messageInput.dataset.autofilled === 'true')) {
        messageInput.value = 'I would like to book ' + seats + (seats > 1 ? ' seats' : ' seat') + ' for ' + title + ' (' + dates + (time ? ' · ' + time : '') + ').';
        messageInput.dataset.autofilled = 'true';
      }
    }

    if (topicSel) {
      topicSel.addEventListener('change', function () {
        if (dateInput && dateInput.dataset.autofilled === 'true') {
          dateInput.value = '';
          dateInput.dataset.autofilled = 'false';
        }
        if (messageInput && messageInput.dataset.autofilled === 'true') {
          messageInput.value = '';
          messageInput.dataset.autofilled = 'false';
        }
        updateBookingView();
      });
    }

    if (classSel) {
      classSel.addEventListener('change', function () {
        if (dateInput) dateInput.dataset.autofilled = 'true';
        if (messageInput) messageInput.dataset.autofilled = 'true';
        updateBookingView();
      });
    }

    if (workshopSel) {
      workshopSel.addEventListener('change', function () {
        if (dateInput) dateInput.dataset.autofilled = 'true';
        if (messageInput) messageInput.dataset.autofilled = 'true';
        updateBookingView();
      });
    }

    if (guestsInput) {
      guestsInput.addEventListener('input', function () {
        if (messageInput && messageInput.dataset.autofilled === 'true') {
          var activeSel = (topicSel && topicSel.value === 'workshops') ? workshopSel : classSel;
          var opt = activeSel && activeSel.selectedOptions ? activeSel.selectedOptions[0] : null;
          if (opt && activeSel.value) {
            var title = opt.getAttribute('data-title') || opt.textContent.split('—')[0].trim();
            var time = opt.getAttribute('data-time') || '';
            var date = opt.getAttribute('data-date') || '';
            var dates = opt.getAttribute('data-dates') || date;
            var s = parseInt(guestsInput.value || '1', 10) || 1;
            messageInput.value = 'I would like to book ' + s + (s > 1 ? ' seats' : ' seat') + ' for ' + title + ' (' + dates + (time ? ' · ' + time : '') + ').';
          }
        }
        updateBookingView();
      });
    }

    if (messageInput) {
      messageInput.addEventListener('input', function () {
        messageInput.dataset.autofilled = 'false';
      });
    }
    if (dateInput) {
      dateInput.addEventListener('input', function () {
        dateInput.dataset.autofilled = 'false';
      });
    }

    /* Process initial incoming URL parameters */
    var reqType = params.get('type') || params.get('topic');
    var reqClass = params.get('class');
    var reqWorkshop = params.get('workshop');
    var reqSeats = params.get('seats') || params.get('guests');

    if (reqSeats && guestsInput) {
      guestsInput.value = reqSeats;
    }

    if (reqClass) {
      if (topicSel) topicSel.value = 'classes';
      if (classSel && classSel.querySelector('option[value="' + reqClass + '"]')) {
        classSel.value = reqClass;
      }
    } else if (reqWorkshop) {
      if (topicSel) topicSel.value = 'workshops';
      if (workshopSel && workshopSel.querySelector('option[value="' + reqWorkshop + '"]')) {
        workshopSel.value = reqWorkshop;
      }
    } else if (reqType && topicSel && topicSel.querySelector('option[value="' + reqType + '"]')) {
      topicSel.value = reqType;
    }

    updateBookingView();

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(contactForm)) return;
      var success = $('[data-contact-success]');
      var first = ($('#c-name').value || '').trim().split(' ')[0];
      $('[data-success-name]').textContent = first || 'there';

      var isBooking = topicSel && (topicSel.value === 'classes' || topicSel.value === 'workshops');
      var activeSel = topicSel && topicSel.value === 'workshops' ? workshopSel : classSel;
      var opt = activeSel && activeSel.selectedOptions ? activeSel.selectedOptions[0] : null;
      var detail = $('[data-success-detail]');
      if (detail && isBooking && opt && activeSel.value) {
        var s = parseInt(guestsInput.value || '1', 10) || 1;
        var title = opt.getAttribute('data-title') || opt.textContent.split('—')[0].trim();
        detail.textContent = 'We received your booking request for ' + s + (s > 1 ? ' seats' : ' seat') + ' in "' + title + '". Our studio team will confirm your reservation and send payment instructions to ' + ($('#c-email').value || 'your email') + ' within one business day.';
      } else if (detail) {
        detail.textContent = 'Someone from the studio will reply to your email within one business day. Need an answer sooner? Call us on (503) 555-0148.';
      }

      contactForm.hidden = true;
      success.hidden = false;
      success.focus();
    });

    var again = $('[data-contact-again]');
    if (again) again.addEventListener('click', function () {
      contactForm.reset();
      if (classSel) classSel.value = '';
      if (workshopSel) workshopSel.value = '';
      if (guestsInput) guestsInput.value = '1';
      $$('.field', contactForm).forEach(function (f) { f.classList.remove('has-error'); });
      $$('.field-error', contactForm).forEach(function (f) { f.textContent = ''; });
      updateBookingView();
      $('[data-contact-success]').hidden = true;
      contactForm.hidden = false;
      $('#c-name').focus();
    });
  }

  /* Global seat picker listener for classes and workshops pages */
  document.addEventListener('change', function (e) {
    if (e.target.matches && e.target.matches('[data-seat-picker]')) {
      var picker = e.target;
      var group = picker.closest('.class-book-group, .workshop-book-group');
      if (!group) return;
      var btn = group.querySelector('[data-book-btn]');
      if (!btn) return;
      var currentHref = btn.getAttribute('href') || '';
      var parts = currentHref.split('?');
      var path = parts[0];
      var searchParams = new URLSearchParams(parts[1] || '');
      searchParams.set('seats', picker.value);
      btn.setAttribute('href', path + '?' + searchParams.toString());
    }
  });

  /* ------------------------------------------------------------------
     8. Opening hours: highlight today
     ------------------------------------------------------------------ */
  var today = new Date().getDay();
  $$('[data-day]').forEach(function (row) {
    if (parseInt(row.getAttribute('data-day'), 10) === today) row.classList.add('is-today');
  });

  /* ------------------------------------------------------------------
     9. Sign In / Forgot password / Sign Up (demo, stored locally)
     ------------------------------------------------------------------ */
  function getUsers() {
    try { return JSON.parse(getItem(STORE.users) || '[]'); } catch (e) { return []; }
  }
  function startSession(user) {
    setItem(STORE.session, JSON.stringify({ name: user.name, email: user.email, at: Date.now() }));
  }
  /* Preserve ?class=… so a seat chosen on the public site opens in the dashboard */
  function dashboardUrl() {
    var cls = new URLSearchParams(window.location.search).get('class');
    return 'dashboard.html' + (cls ? '?class=' + encodeURIComponent(cls) : '');
  }
  function nameFromEmail(email) {
    var part = email.split('@')[0].replace(/[._-]+/g, ' ');
    return part.replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  var signinForm = $('[data-signin-form]');
  if (signinForm) {
    var alertBox = $('[data-auth-alert]');
    signinForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alertBox.hidden = true;
      if (!validateForm(signinForm)) return;
      var email = $('#si-email').value.trim().toLowerCase();
      var pass = $('#si-password').value;
      var user = getUsers().filter(function (u) { return u.email === email; })[0];
      if (user && user.password !== pass) {
        alertBox.textContent = 'That password doesn’t match this account. Try again or reset it below.';
        alertBox.hidden = false;
        $('#si-password').focus();
        return;
      }
      startSession(user || { name: nameFromEmail(email), email: email });
      var btn = signinForm.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Signing you in…';
      setTimeout(function () { window.location.href = dashboardUrl(); }, 500);
    });

    /* Forgot password view switching */
    var views = { signin: $('[data-view="signin"]'), reset: $('[data-view="reset"]') };
    function showView(name) {
      Object.keys(views).forEach(function (k) { views[k].hidden = k !== name; });
      var heading = views[name].querySelector('h1');
      if (heading) heading.focus();
    }
    $$('[data-show-view]').forEach(function (btn) {
      btn.addEventListener('click', function () { showView(btn.getAttribute('data-show-view')); });
    });

    var resetForm = $('[data-reset-form]');
    resetForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(resetForm)) return;
      $('[data-reset-email]').textContent = $('#rs-email').value.trim();
      resetForm.hidden = true;
      $('[data-reset-success]').hidden = false;
    });
    $$('[data-reset-back]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        resetForm.reset();
        resetForm.hidden = false;
        $('[data-reset-success]').hidden = true;
        showView('signin');
      });
    });
  }

  var signupForm = $('[data-signup-form]');
  if (signupForm) {
    var pw = $('#su-password');
    var meter = $('[data-pw-meter]');
    pw.addEventListener('input', function () {
      var v = pw.value;
      var score = 0;
      if (v.length >= 8) score++;
      if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
      if (/\d/.test(v)) score++;
      if (/[^A-Za-z0-9]/.test(v) || v.length >= 12) score++;
      meter.setAttribute('data-score', v ? String(Math.max(score, 1)) : '0');
      var words = ['', 'Weak', 'Fair', 'Good', 'Strong'];
      $('[data-pw-text]').textContent = v ? 'Strength: ' + words[Math.max(score, 1)] : 'Use 8+ characters with a number.';
    });

    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var alertBox = $('[data-auth-alert]');
      alertBox.hidden = true;
      if (!validateForm(signupForm)) return;
      var email = $('#su-email').value.trim().toLowerCase();
      var users = getUsers();
      if (users.some(function (u) { return u.email === email; })) {
        alertBox.innerHTML = 'An account with this email already exists. <a href="signin.html">Sign in instead</a>.';
        alertBox.hidden = false;
        return;
      }
      var user = { name: $('#su-name').value.trim(), email: email, password: pw.value };
      users.push(user);
      setItem(STORE.users, JSON.stringify(users));
      startSession(user);
      var btn = signupForm.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Creating your account…';
      setTimeout(function () { window.location.href = dashboardUrl(); }, 500);
    });
  }
})();
