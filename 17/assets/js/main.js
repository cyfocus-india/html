/**
 * Lumina Dental & Oral Care Center - Main JavaScript (all public and auth pages)
 * Handles: theme + direction toggles, desktop dropdown, mobile slide-in menu,
 *          contact form validation and prefill, Sign In / Reset / Sign Up forms,
 *          and scroll-reveal animations.
 * Tech: vanilla JavaScript only (no frameworks or libraries).
 */
(function () {
  'use strict';

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var MIN_PASSWORD = 8;

  // -------------------------------------------------------------------------
  // 0. Safe localStorage helpers (storage can be blocked in private windows)
  // -------------------------------------------------------------------------
  var store = {
    get: function (key) {
      try { return window.localStorage.getItem(key); } catch (e) { return null; }
    },
    set: function (key, value) {
      try { window.localStorage.setItem(key, value); } catch (e) { /* ignore */ }
    },
    remove: function (key) {
      try { window.localStorage.removeItem(key); } catch (e) { /* ignore */ }
    }
  };
  window.LuminaStore = store;

  // -------------------------------------------------------------------------
  // 1. Theme (light / dark), saved and applied on every page
  // -------------------------------------------------------------------------
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    store.set('lumina_theme', theme);
    document.querySelectorAll('[data-action="toggle-theme"]').forEach(function (btn) {
      var dark = theme === 'dark';
      btn.textContent = dark ? '☀' : '☾'; // ☀ / ☾
      btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      btn.setAttribute('title', dark ? 'Light theme' : 'Dark theme');
    });
    document.dispatchEvent(new CustomEvent('lumina:themechange', { detail: theme }));
  }

  function initTheme() {
    applyTheme(store.get('lumina_theme') === 'dark' ? 'dark' : 'light');
    document.querySelectorAll('[data-action="toggle-theme"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    });
  }

  // -------------------------------------------------------------------------
  // 2. Layout direction (LTR / RTL), saved and applied on every page
  // -------------------------------------------------------------------------
  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    store.set('lumina_dir', dir);
    document.querySelectorAll('[data-action="toggle-dir"]').forEach(function (btn) {
      var rtl = dir === 'rtl';
      btn.textContent = rtl ? '⇄ LTR' : '⇄ RTL';
      btn.setAttribute('aria-label', rtl ? 'Switch to left-to-right layout' : 'Switch to right-to-left layout');
    });
    document.dispatchEvent(new CustomEvent('lumina:dirchange', { detail: dir }));
  }

  function initDirection() {
    applyDirection(store.get('lumina_dir') === 'rtl' ? 'rtl' : 'ltr');
    document.querySelectorAll('[data-action="toggle-dir"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('dir');
        applyDirection(current === 'rtl' ? 'ltr' : 'rtl');
      });
    });
  }

  // -------------------------------------------------------------------------
  // 3. Desktop "Home" dropdown: click, keyboard and Esc support
  // -------------------------------------------------------------------------
  function initDesktopDropdown() {
    document.querySelectorAll('.nav-item.has-dropdown').forEach(function (item) {
      var trigger = item.querySelector('.dropdown-trigger');
      if (!trigger) return;

      function setOpen(open) {
        item.classList.toggle('is-open', open);
        item.classList.toggle('is-closed', !open);
        trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      }

      trigger.addEventListener('click', function () {
        setOpen(trigger.getAttribute('aria-expanded') !== 'true');
      });
      item.addEventListener('mouseenter', function () {
        item.classList.remove('is-closed');
        trigger.setAttribute('aria-expanded', 'true');
      });
      item.addEventListener('mouseleave', function () {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      });
      item.addEventListener('focusin', function () {
        item.classList.remove('is-closed');
      });
      item.addEventListener('focusout', function (e) {
        if (!item.contains(e.relatedTarget)) setOpen(false);
      });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          setOpen(false);
          trigger.focus();
        }
      });
      document.addEventListener('click', function (e) {
        if (!item.contains(e.target)) {
          item.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // 4. Mobile slide-in menu (1024px and below)
  //    Closes on link click, backdrop click or Esc; locks page scroll; traps focus
  // -------------------------------------------------------------------------
  function initMobileMenu() {
    var hamburger = document.getElementById('hamburgerBtn');
    var drawer = document.getElementById('mobileNavDrawer');
    var backdrop = document.getElementById('mobileNavBackdrop');
    var closeBtn = document.getElementById('mobileNavClose');
    if (!hamburger || !drawer || !backdrop) return;

    function focusables() {
      return Array.prototype.filter.call(
        drawer.querySelectorAll('a[href], button:not([disabled])'),
        function (el) { return el.offsetParent !== null; }
      );
    }

    function openMenu() {
      hamburger.classList.add('is-active');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Close menu');
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      backdrop.classList.add('is-visible');
      document.documentElement.classList.add('menu-open');
      document.body.classList.add('menu-open');
      setTimeout(function () { if (closeBtn) closeBtn.focus(); }, 50);
    }

    function closeMenu(returnFocus) {
      if (!drawer.classList.contains('is-open')) return;
      hamburger.classList.remove('is-active');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      backdrop.classList.remove('is-visible');
      document.documentElement.classList.remove('menu-open');
      document.body.classList.remove('menu-open');
      if (returnFocus) hamburger.focus();
    }

    hamburger.addEventListener('click', function () {
      if (drawer.classList.contains('is-open')) closeMenu(true); else openMenu();
    });
    if (closeBtn) closeBtn.addEventListener('click', function () { closeMenu(true); });
    backdrop.addEventListener('click', function () { closeMenu(true); });

    document.addEventListener('keydown', function (e) {
      if (!drawer.classList.contains('is-open')) return;
      if (e.key === 'Escape') {
        closeMenu(true);
        return;
      }
      // Keep Tab focus inside the open panel
      if (e.key === 'Tab') {
        var items = focusables();
        if (!items.length) return;
        var first = items[0];
        var last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { closeMenu(false); });
    });

    // Close automatically if the window is resized to desktop width
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024) closeMenu(false);
    });

    // Home accordion inside the panel
    var accToggle = document.getElementById('mobileHomeAccordion');
    var accContent = document.getElementById('mobileHomeContent');
    if (accToggle && accContent) {
      accToggle.addEventListener('click', function () {
        var expanded = accToggle.getAttribute('aria-expanded') === 'true';
        accToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        accContent.classList.toggle('is-expanded', !expanded);
      });
    }
  }

  // -------------------------------------------------------------------------
  // 5. Shared form helpers
  // -------------------------------------------------------------------------
  function setError(input, message) {
    var group = input.closest('.form-group');
    if (!group) return;
    group.classList.add('has-error');
    input.setAttribute('aria-invalid', 'true');
    var err = group.querySelector('.form-error');
    if (err && message) err.textContent = message;
  }

  function clearErrors(form) {
    form.querySelectorAll('.form-group').forEach(function (group) {
      group.classList.remove('has-error');
    });
    form.querySelectorAll('[aria-invalid]').forEach(function (el) {
      el.removeAttribute('aria-invalid');
    });
  }

  function focusFirstError(form) {
    var bad = form.querySelector('[aria-invalid="true"]');
    if (bad) bad.focus();
  }

  // Clear a field's error as soon as the user fixes it
  function liveClear(form) {
    form.addEventListener('input', function (e) {
      var group = e.target.closest('.form-group');
      if (group && group.classList.contains('has-error')) {
        group.classList.remove('has-error');
        e.target.removeAttribute('aria-invalid');
      }
    });
    form.addEventListener('change', function (e) {
      var group = e.target.closest('.form-group');
      if (group && group.classList.contains('has-error')) {
        group.classList.remove('has-error');
        e.target.removeAttribute('aria-invalid');
      }
    });
  }

  function isoDate(d) {
    var m = d.getMonth() + 1;
    var day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  }

  // -------------------------------------------------------------------------
  // 6. Contact page: service/doctor prefill + validation + success message
  // -------------------------------------------------------------------------
  // Remember which service or doctor was clicked anywhere on the site
  function initServiceClickTracking() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href*="contact.html"]');
      if (!link) return;
      var service = link.getAttribute('data-service');
      var doctor = link.getAttribute('data-doctor');
      if (service) store.set('lumina_selected_service', service); else store.remove('lumina_selected_service');
      if (doctor) store.set('lumina_selected_doctor', doctor); else store.remove('lumina_selected_doctor');
    });
  }

  function prefillContact() {
    var serviceSelect = document.getElementById('contactService');
    var doctorSelect = document.getElementById('contactDoctor');
    if (!serviceSelect) return;

    var service = '';
    var doctor = '';
    try {
      var params = new URLSearchParams(window.location.search);
      service = params.get('service') || '';
      doctor = params.get('doctor') || '';
    } catch (e) { /* older browsers */ }

    // Fallback for browsers that drop query strings on file:// links
    if (!service) service = store.get('lumina_selected_service') || '';
    if (!doctor) doctor = store.get('lumina_selected_doctor') || '';
    store.remove('lumina_selected_service');
    store.remove('lumina_selected_doctor');

    var matched = null;
    if (service) {
      var wanted = service.trim().toLowerCase();
      Array.prototype.some.call(serviceSelect.options, function (opt) {
        if (opt.value && opt.value.toLowerCase() === wanted) { matched = opt; return true; }
        return false;
      });
    }

    if (doctorSelect && doctor) {
      doctorSelect.value = doctor;
      if (doctorSelect.value !== doctor) doctorSelect.value = '';
    }

    if (!matched) return;
    serviceSelect.value = matched.value;
    serviceSelect.classList.add('field-highlight');

    var banner = document.getElementById('servicePrefillBanner');
    var bannerName = document.getElementById('prefilledServiceName');
    if (banner && bannerName) {
      bannerName.textContent = matched.textContent.trim() + (doctor ? ' with ' + doctor : '');
      banner.hidden = false;
    }

    serviceSelect.addEventListener('change', function () {
      serviceSelect.classList.remove('field-highlight');
      if (banner) banner.hidden = true;
    });
  }

  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;
    var success = document.getElementById('contactSuccess');
    var dateInput = document.getElementById('contactDate');

    // Earliest bookable date is tomorrow
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (dateInput) dateInput.min = isoDate(tomorrow);

    prefillContact();
    liveClear(form);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrors(form);
      if (success) success.classList.remove('is-visible');

      var name = document.getElementById('contactName');
      var email = document.getElementById('contactEmail');
      var phone = document.getElementById('contactPhone');
      var service = document.getElementById('contactService');
      var message = document.getElementById('contactMessage');
      var valid = true;

      if (name.value.trim().length < 2) { setError(name, 'Please enter your full name.'); valid = false; }
      if (!EMAIL_RE.test(email.value.trim())) { setError(email, 'Please enter a valid email address, e.g. name@example.com.'); valid = false; }
      if (phone.value.replace(/\D/g, '').length < 10) { setError(phone, 'Please enter a phone number with at least 10 digits.'); valid = false; }
      if (!service.value) { setError(service, 'Please choose a treatment.'); valid = false; }
      if (dateInput && dateInput.value && dateInput.value < dateInput.min) {
        setError(dateInput, 'Please choose a date from tomorrow onwards.');
        valid = false;
      }
      if (message.value.trim().length < 10) { setError(message, 'Please add a short message (at least 10 characters).'); valid = false; }

      if (!valid) {
        focusFirstError(form);
        return;
      }

      form.reset();
      service.classList.remove('field-highlight');
      var banner = document.getElementById('servicePrefillBanner');
      if (banner) banner.hidden = true;
      if (success) {
        success.classList.add('is-visible');
        success.focus();
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // -------------------------------------------------------------------------
  // 7. Sign In, Reset Password (same page) and Sign Up
  // -------------------------------------------------------------------------
  function nameFromEmail(email) {
    var local = email.split('@')[0].replace(/[._-]+/g, ' ').trim();
    return local.replace(/\b\w/g, function (c) { return c.toUpperCase(); }) || 'Patient';
  }

  function saveUser(user) {
    var existing = {};
    try { existing = JSON.parse(store.get('lumina_current_user') || '{}') || {}; } catch (e) { existing = {}; }
    // Keep profile details the patient already saved for this email
    if (existing.email && existing.email.toLowerCase() === user.email.toLowerCase()) {
      user = Object.assign({}, existing, { email: user.email });
    }
    store.set('lumina_current_user', JSON.stringify(user));
  }

  function initPasswordToggles() {
    document.querySelectorAll('.password-toggle-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var input = btn.parentElement.querySelector('input');
        if (!input) return;
        var show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.textContent = show ? 'Hide' : 'Show';
        btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
        btn.setAttribute('aria-pressed', show ? 'true' : 'false');
      });
    });
  }

  function initSignIn() {
    var form = document.getElementById('signinForm');
    if (!form) return;
    var signinView = document.getElementById('signinView');
    var resetView = document.getElementById('resetView');
    var resetForm = document.getElementById('resetPasswordForm');
    var resetAlert = document.getElementById('resetSuccessAlert');
    liveClear(form);

    function showReset(show) {
      signinView.hidden = show;
      resetView.hidden = !show;
      if (show) {
        resetForm.reset();
        clearErrors(resetForm);
        resetAlert.classList.remove('is-visible');
        var signinEmail = document.getElementById('signinEmail').value.trim();
        if (signinEmail) document.getElementById('resetEmail').value = signinEmail;
        document.getElementById('resetEmail').focus();
      } else {
        document.getElementById('signinEmail').focus();
      }
    }

    document.getElementById('forgotPasswordLink').addEventListener('click', function (e) {
      e.preventDefault();
      showReset(true);
    });
    document.getElementById('backToSigninLink').addEventListener('click', function (e) {
      e.preventDefault();
      showReset(false);
    });

    if (resetForm) {
      liveClear(resetForm);
      resetForm.addEventListener('submit', function (e) {
        e.preventDefault();
        clearErrors(resetForm);
        var email = document.getElementById('resetEmail');
        if (!EMAIL_RE.test(email.value.trim())) {
          setError(email, 'Please enter a valid email address.');
          email.focus();
          return;
        }
        document.getElementById('resetEmailEcho').textContent = email.value.trim();
        resetAlert.classList.add('is-visible');
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrors(form);
      var email = document.getElementById('signinEmail');
      var password = document.getElementById('signinPassword');
      var valid = true;

      if (!EMAIL_RE.test(email.value.trim())) { setError(email, 'Please enter a valid email address.'); valid = false; }
      if (password.value.length < MIN_PASSWORD) { setError(password, 'Password must be at least ' + MIN_PASSWORD + ' characters.'); valid = false; }
      if (!valid) { focusFirstError(form); return; }

      saveUser({
        name: nameFromEmail(email.value.trim()),
        email: email.value.trim(),
        phone: '(415) 555-0192',
        insurance: 'Delta Dental PPO #DLT-89420',
        bloodGroup: 'O+',
        allergies: 'None recorded',
        smsReminders: true,
        emailReceipts: true
      });
      window.location.href = 'dashboard.html';
    });
  }

  function initSignUp() {
    var form = document.getElementById('signupForm');
    if (!form) return;
    liveClear(form);

    var password = document.getElementById('signupPassword');
    var bar = document.getElementById('passwordStrengthBar');
    var label = document.getElementById('passwordStrengthLabel');
    if (password && bar) {
      password.addEventListener('input', function () {
        var v = password.value;
        var score = 0;
        if (v.length >= MIN_PASSWORD) score++;
        if (/[A-Z]/.test(v)) score++;
        if (/[0-9]/.test(v)) score++;
        if (/[^A-Za-z0-9]/.test(v)) score++;
        bar.style.width = (score * 25) + '%';
        bar.style.backgroundColor = score <= 1 ? 'var(--danger)' : score <= 3 ? 'var(--warning)' : 'var(--success)';
        if (label) label.textContent = v ? 'Strength: ' + (score <= 1 ? 'weak' : score <= 3 ? 'fair' : 'strong') + '.' : '';
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrors(form);
      var name = document.getElementById('signupName');
      var email = document.getElementById('signupEmail');
      var confirm = document.getElementById('signupConfirmPassword');
      var terms = document.getElementById('signupTerms');
      var valid = true;

      if (name.value.trim().length < 2) { setError(name, 'Please enter your full name.'); valid = false; }
      if (!EMAIL_RE.test(email.value.trim())) { setError(email, 'Please enter a valid email address.'); valid = false; }
      if (password.value.length < MIN_PASSWORD) { setError(password, 'Password must be at least ' + MIN_PASSWORD + ' characters.'); valid = false; }
      if (!confirm.value) { setError(confirm, 'Please confirm your password.'); valid = false; }
      else if (confirm.value !== password.value) { setError(confirm, 'Passwords do not match.'); valid = false; }
      if (!terms.checked) { setError(terms, 'Please accept the Notice of Privacy Practices.'); valid = false; }
      if (!valid) { focusFirstError(form); return; }

      store.set('lumina_current_user', JSON.stringify({
        name: name.value.trim(),
        email: email.value.trim(),
        phone: '',
        insurance: '',
        bloodGroup: 'O+',
        allergies: 'None recorded',
        smsReminders: true,
        emailReceipts: true
      }));
      window.location.href = 'dashboard.html';
    });
  }

  // -------------------------------------------------------------------------
  // 8. Scroll-reveal animations (skipped when the user prefers reduced motion)
  // -------------------------------------------------------------------------
  function initScrollReveal() {
    var targets = document.querySelectorAll(
      '.feature-card, .journey-step-card, .testimonial-card, .doctor-card, .service-card, .pricing-item-card, .plan-card, .cta-banner, .booking-split, .info-card, .contact-card, .map-card, .section-header'
    );
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!targets.length || reduce || !('IntersectionObserver' in window)) return;

    targets.forEach(function (el) {
      el.classList.add('reveal');
      var parent = el.parentElement;
      if (parent && /\bgrid-[234]\b/.test(parent.className)) {
        var index = Array.prototype.indexOf.call(parent.children, el);
        el.classList.add('reveal-delay-' + ((index % 4) + 1));
      }
    });

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el) { observer.observe(el); });
  }

  // -------------------------------------------------------------------------
  // Init
  // -------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initDirection();
    initDesktopDropdown();
    initMobileMenu();
    initServiceClickTracking();
    initContactForm();
    initPasswordToggles();
    initSignIn();
    initSignUp();
    initScrollReveal();
  });
})();
