/**
 * AURA YOGA & WELLNESS SANCTUARY - MAIN JAVASCRIPT
 * Handles theme toggling, RTL mirroring, mobile navigation, accordions,
 * class filtering, and contact form validation.
 * Zero external libraries. Zero SVG.
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Theme Management (Light / Dark)
  // -------------------------------------------------------------------------
  const THEME_KEY = 'aura_yoga_theme';
  const DIR_KEY = 'aura_yoga_dir';

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', initialTheme);
    updateThemeToggleButtons(initialTheme);
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    updateThemeToggleButtons(newTheme);

    // Dispatch event for dashboard canvas chart re-render
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
  }

  function updateThemeToggleButtons(theme) {
    const buttons = document.querySelectorAll('.theme-toggle-btn');
    buttons.forEach((btn) => {
      if (theme === 'dark') {
        btn.innerHTML = '☀ Light';
        btn.setAttribute('aria-label', 'Switch to light theme');
      } else {
        btn.innerHTML = '☾ Dark';
        btn.setAttribute('aria-label', 'Switch to dark theme');
      }
    });
  }

  // -------------------------------------------------------------------------
  // 2. Direction Management (LTR / RTL)
  // -------------------------------------------------------------------------
  function initDirection() {
    const savedDir = localStorage.getItem(DIR_KEY) || 'ltr';
    document.documentElement.setAttribute('dir', savedDir);
    updateDirToggleButtons(savedDir);
  }

  function toggleDirection() {
    const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
    const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
    document.documentElement.setAttribute('dir', newDir);
    localStorage.setItem(DIR_KEY, newDir);
    updateDirToggleButtons(newDir);
  }

  function updateDirToggleButtons(dir) {
    const buttons = document.querySelectorAll('.dir-toggle-btn');
    buttons.forEach((btn) => {
      if (dir === 'rtl') {
        btn.innerHTML = '⇄ LTR';
        btn.setAttribute('aria-label', 'Switch to left to right layout');
      } else {
        btn.innerHTML = '⇄ RTL';
        btn.setAttribute('aria-label', 'Switch to right to left layout');
      }
    });
  }

  // -------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer
  // -------------------------------------------------------------------------
  function initMobileNav() {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mobileDrawer = document.querySelector('.mobile-nav-drawer');
    const backdrop = document.querySelector('.mobile-nav-backdrop');

    if (!hamburgerBtn || !mobileDrawer) return;

    function openMenu() {
      hamburgerBtn.classList.add('active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      mobileDrawer.classList.add('active');
      if (backdrop) backdrop.classList.add('active');
      document.body.classList.add('menu-open');
    }

    function closeMenu() {
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      mobileDrawer.classList.remove('active');
      if (backdrop) backdrop.classList.remove('active');
      document.body.classList.remove('menu-open');
    }

    hamburgerBtn.addEventListener('click', function () {
      const isOpen = hamburgerBtn.classList.contains('active');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (backdrop) {
      backdrop.addEventListener('click', closeMenu);
    }

    const drawerCloseBtn = mobileDrawer.querySelector('.mobile-drawer-close-btn');
    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', closeMenu);
    }

    // Close on navigation link click
    const mobileLinks = mobileDrawer.querySelectorAll('.mobile-nav-link:not(.mobile-accordion-toggle)');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && hamburgerBtn.classList.contains('active')) {
        closeMenu();
      }
    });

    // Mobile accordion for Home dropdown
    const accordionToggle = mobileDrawer.querySelector('.mobile-accordion-toggle');
    const accordionContent = mobileDrawer.querySelector('.mobile-accordion-content');
    if (accordionToggle && accordionContent) {
      accordionToggle.addEventListener('click', function (e) {
        e.preventDefault();
        const isOpen = accordionContent.classList.contains('open');
        if (isOpen) {
          accordionContent.classList.remove('open');
          accordionToggle.setAttribute('aria-expanded', 'false');
        } else {
          accordionContent.classList.add('open');
          accordionToggle.setAttribute('aria-expanded', 'true');
        }
      });
    }
  }

  // -------------------------------------------------------------------------
  // 4. Interactive Accordions (e.g. FAQs on Contact & Classes)
  // -------------------------------------------------------------------------
  function initAccordions() {
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach((acc) => {
      const items = acc.querySelectorAll('.accordion-item');
      items.forEach((item) => {
        const header = item.querySelector('.accordion-header');
        if (!header) return;
        header.addEventListener('click', function () {
          const isActive = item.classList.contains('active');

          // Close sibling items
          items.forEach((sibling) => {
            sibling.classList.remove('active');
            const h = sibling.querySelector('.accordion-header');
            if (h) h.setAttribute('aria-expanded', 'false');
          });

          if (!isActive) {
            item.classList.add('active');
            header.setAttribute('aria-expanded', 'true');
          }
        });
      });
    });
  }

  // -------------------------------------------------------------------------
  // 5. Classes & Schedule Filtering
  // -------------------------------------------------------------------------
  function initClassFilters() {
    const filterButtons = document.querySelectorAll('[data-filter-group] .filter-btn');
    const classCards = document.querySelectorAll('.filterable-card');
    const statusMsg = document.getElementById('filter-status-msg');
    const noResultsBox = document.getElementById('no-classes-found');
    const resetBtn = document.getElementById('reset-filters-btn');

    if (!filterButtons.length || !classCards.length) return;

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', function () {
        const group = btn.closest('[data-filter-group]');

        // Update active state in current group
        group.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        // Apply filters
        applyFilters();
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        document.querySelectorAll('[data-filter-group] .filter-btn').forEach((b) => {
          if (b.getAttribute('data-filter') === 'all') {
            b.classList.add('active');
          } else {
            b.classList.remove('active');
          }
        });
        applyFilters();
      });
    }

    function applyFilters() {
      const activeStyleBtn = document.querySelector('[data-filter-group="style"] .filter-btn.active');
      const activeLevelBtn = document.querySelector('[data-filter-group="level"] .filter-btn.active');

      const activeStyle = activeStyleBtn ? activeStyleBtn.getAttribute('data-filter') : 'all';
      const activeLevel = activeLevelBtn ? activeLevelBtn.getAttribute('data-filter') : 'all';

      let visibleCount = 0;

      classCards.forEach((card) => {
        const cardStyleTokens = (card.getAttribute('data-style') || '').toLowerCase().trim().split(/\s+/);
        const cardLevelTokens = (card.getAttribute('data-level') || '').toLowerCase().trim().split(/\s+/);

        const matchesStyle = activeStyle === 'all' || cardStyleTokens.includes(activeStyle);
        const matchesLevel = activeLevel === 'all' || cardLevelTokens.includes(activeLevel) || cardLevelTokens.includes('all');

        if (matchesStyle && matchesLevel) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (statusMsg) {
        if (activeStyle === 'all' && activeLevel === 'all') {
          statusMsg.textContent = `Showing all ${visibleCount} studio classes`;
        } else {
          statusMsg.textContent = `Showing ${visibleCount} matching ${visibleCount === 1 ? 'class' : 'classes'}`;
        }
      }

      if (noResultsBox) {
        noResultsBox.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    // Run initial filter check
    applyFilters();
  }

  // -------------------------------------------------------------------------
  // 6. Contact Form Validation
  // -------------------------------------------------------------------------
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const feedback = document.getElementById('contact-form-feedback');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;

      // Inputs to validate
      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const messageInput = document.getElementById('contact-message');

      // Clear previous error states
      form.querySelectorAll('.form-control').forEach((inp) => inp.classList.remove('error'));
      form.querySelectorAll('.field-error').forEach((err) => err.classList.remove('visible'));

      // Validate Name
      if (!nameInput || !nameInput.value.trim()) {
        showError(nameInput, 'Please enter your full name');
        isValid = false;
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
      }

      // Validate Message
      if (!messageInput || messageInput.value.trim().length < 10) {
        showError(messageInput, 'Message must be at least 10 characters long');
        isValid = false;
      }

      if (isValid) {
        // Show success state
        if (feedback) {
          feedback.textContent = 'Namaste! Thank you for reaching out. A studio coordinator will get back to you within 24 hours.';
          feedback.className = 'form-feedback success';
          feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        form.reset();
      }
    });

    function showError(inputElement, msg) {
      if (!inputElement) return;
      inputElement.classList.add('error');
      const errEl = inputElement.parentElement.querySelector('.field-error');
      if (errEl) {
        errEl.textContent = msg;
        errEl.classList.add('visible');
      }
    }
  }

  // -------------------------------------------------------------------------
  // 7. Highlight Active Navigation Links
  // -------------------------------------------------------------------------
  function highlightActiveNav() {
    const path = window.location.pathname;
    const pageName = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

    const allNavLinks = document.querySelectorAll('.nav-link, .dropdown-link, .mobile-nav-link');
    allNavLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const linkPage = href.substring(href.lastIndexOf('/') + 1);

      if (linkPage === pageName || (pageName === '' && linkPage === 'index.html')) {
        link.classList.add('active');
        // If it's in dropdown, also highlight parent toggle
        const dropdownParent = link.closest('.nav-item-dropdown');
        if (dropdownParent) {
          const toggle = dropdownParent.querySelector('.dropdown-toggle');
          if (toggle) toggle.classList.add('active');
        }
      }
    });
  }

  // -------------------------------------------------------------------------
  // 8. Smooth Scroll Reveal Animations
  // -------------------------------------------------------------------------
  function initScrollAnimations() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const animTargets = document.querySelectorAll(
      '.section-header, .atmosphere-card, .instructor-card, .pricing-card, .step-item, .testimonial-card, .cta-banner, .class-card, .comparison-table-wrapper, .schedule-table-wrap'
    );

    if (!animTargets.length) return;

    // Apply reveal class and stagger delays for siblings
    animTargets.forEach((el) => {
      el.classList.add('reveal');
      const parent = el.parentElement;
      if (parent && parent.classList.contains('grid')) {
        const siblings = Array.from(parent.children);
        const index = siblings.indexOf(el);
        if (index > 0) {
          el.style.transitionDelay = `${Math.min(index * 0.08, 0.35)}s`;
        }
      }
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '0px 0px -40px 0px',
          threshold: 0.08
        }
      );

      animTargets.forEach((el) => observer.observe(el));
    } else {
      animTargets.forEach((el) => el.classList.add('revealed'));
    }
  }

  // -------------------------------------------------------------------------
  // Initialize Everything on DOM Ready
  // -------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initDirection();

    // Attach Toggle Listeners
    document.querySelectorAll('.theme-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', toggleTheme);
    });

    document.querySelectorAll('.dir-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', toggleDirection);
    });

    initMobileNav();
    initAccordions();
    initClassFilters();
    initContactForm();
    highlightActiveNav();
    initScrollAnimations();
  });
})();
