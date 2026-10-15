/**
 * AuraWash Laundry & Dry Cleaning - Main JavaScript
 * Pure Vanilla JavaScript - No libraries, no frameworks, zero SVG.
 * Works natively via file:// protocol.
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. Theme & Direction State Management (Persists across all pages)
     ========================================================================== */
  const THEME_KEY = 'aurawash_theme';
  const DIR_KEY = 'aurawash_dir';

  function applySavedPreferences() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    const savedDir = localStorage.getItem(DIR_KEY) || 'ltr';

    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.setAttribute('dir', savedDir);

    updateThemeButtonUI(savedTheme);
    updateDirButtonUI(savedDir);
    updateBrandLogo(savedTheme);
  }

  function updateThemeButtonUI(theme) {
    const themeBtns = document.querySelectorAll('.theme-toggle-btn');
    themeBtns.forEach((btn) => {
      if (theme === 'dark') {
        btn.innerHTML = '<span class="toggle-icon">☀</span><span class="toggle-text">Light</span>';
        btn.setAttribute('aria-label', 'Switch to light mode');
      } else {
        btn.innerHTML = '<span class="toggle-icon">☾</span><span class="toggle-text">Dark</span>';
        btn.setAttribute('aria-label', 'Switch to dark mode');
      }
    });
  }

  function updateDirButtonUI(dir) {
    const dirBtns = document.querySelectorAll('.dir-toggle-btn');
    dirBtns.forEach((btn) => {
      if (dir === 'rtl') {
        btn.innerHTML = '<span class="toggle-icon">⇄</span><span class="toggle-text">LTR</span>';
        btn.setAttribute('aria-label', 'Switch to left-to-right direction');
      } else {
        btn.innerHTML = '<span class="toggle-icon">⇄</span><span class="toggle-text">RTL</span>';
        btn.setAttribute('aria-label', 'Switch to right-to-left direction');
      }
    });
  }

  function updateBrandLogo(theme) {
    const logos = document.querySelectorAll('.site-logo-img');
    logos.forEach((img) => {
      const isPagesDir = window.location.pathname.includes('/pages/');
      const basePath = isPagesDir ? '../assets/images/' : 'assets/images/';
      if (theme === 'dark') {
        img.src = basePath + 'logo-dark.png';
      } else {
        img.src = basePath + 'logo.png';
      }
    });
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    updateThemeButtonUI(newTheme);
    updateBrandLogo(newTheme);

    // Notify any canvas charts on dashboard
    window.dispatchEvent(new Event('themechange'));
  }

  function toggleDirection() {
    const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
    const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
    document.documentElement.setAttribute('dir', newDir);
    localStorage.setItem(DIR_KEY, newDir);
    updateDirButtonUI(newDir);
  }

  // Run preference setup immediately
  applySavedPreferences();

  /* ==========================================================================
     2. DOM Ready Initializations
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    applySavedPreferences();

    // Bind theme and dir toggle buttons
    document.querySelectorAll('.theme-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', toggleTheme);
    });
    document.querySelectorAll('.dir-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', toggleDirection);
    });

    /* --- Sticky Header Scroll Shadow --- */
    const header = document.querySelector('.site-header');
    if (header) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 15) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
      });
    }

    /* --- Hamburger Navigation (Mobile & Tablet <= 1024px) --- */
    const hamburger = document.querySelector('.hamburger-btn');
    const navMenu = document.querySelector('.nav-menu');
    const backdrop = document.querySelector('.mobile-backdrop');
    const navDropdown = document.querySelector('.nav-dropdown');

    function closeMobileMenu() {
      if (hamburger) hamburger.classList.remove('is-active');
      if (navMenu) navMenu.classList.remove('is-active');
      if (backdrop) backdrop.classList.remove('is-active');
      document.body.classList.remove('menu-open');
    }

    function openMobileMenu() {
      if (hamburger) hamburger.classList.add('is-active');
      if (navMenu) navMenu.classList.add('is-active');
      if (backdrop) backdrop.classList.add('is-active');
      document.body.classList.add('menu-open');
    }

    if (hamburger && navMenu) {
      hamburger.addEventListener('click', function () {
        const isOpen = navMenu.classList.contains('is-active');
        if (isOpen) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      });

      if (backdrop) {
        backdrop.addEventListener('click', closeMobileMenu);
      }

      // Close on Esc key
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('is-active')) {
          closeMobileMenu();
        }
      });

      // Close when clicking internal links
      navMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', function () {
          // If it's a dropdown toggle link on mobile, don't close yet
          if (window.innerWidth <= 1024 && link.parentElement.classList.contains('nav-dropdown')) {
            return;
          }
          closeMobileMenu();
        });
      });
    }

    // Accordion behavior for dropdown in mobile menu
    if (navDropdown) {
      const dropdownToggle = navDropdown.querySelector('.dropdown-trigger');
      if (dropdownToggle) {
        dropdownToggle.addEventListener('click', function (e) {
          if (window.innerWidth <= 1024) {
            e.preventDefault();
            navDropdown.classList.toggle('is-open');
          }
        });
      }
    }

    /* ==========================================================================
       3. Home 1: Postal / Zip Code Serviceability Checker Widget
       ========================================================================== */
    const checkerForm = document.getElementById('areaCheckerForm');
    const checkerInput = document.getElementById('checkerZipInput');
    const checkerResult = document.getElementById('checkerResult');

    if (checkerForm && checkerInput && checkerResult) {
      checkerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const val = checkerInput.value.trim();
        if (!val || val.length < 3) {
          checkerResult.className = 'checker-result info';
          checkerResult.textContent = 'Please enter a valid zip or postal code.';
          return;
        }

        localStorage.setItem('aurawash_zip_code', val);
        checkerResult.className = 'checker-result success';
        checkerResult.innerHTML = `✓ Great news! Fast doorstep pickup is active in <strong>${escapeHTML(val)}</strong>. Next route window departs today at 10:00 AM! <a href="pages/contact.html?zip=${encodeURIComponent(val)}&service=Wash%20%26%20Fold" class="btn btn-primary btn-sm" style="display:inline-block; margin-top:0.6rem; vertical-align:middle;">Book Pickup In ${escapeHTML(val)} →</a>`;
      });
    }

    /* ==========================================================================
       4. Home 2: Interactive Laundry Load Estimator
       ========================================================================== */
    const estRange = document.getElementById('loadWeightRange');
    const estWeightDisplay = document.getElementById('loadWeightVal');
    const estPriceDisplay = document.getElementById('estTotalPrice');
    const estTimeDisplay = document.getElementById('estTurnaroundTime');
    const estServiceBtns = document.querySelectorAll('.est-toggle-btn');
    const bookHome2EstimateBtn = document.getElementById('bookHome2EstimateBtn');

    let selectedServiceMultiplier = 1.95; // base Wash & Fold $/lb
    let serviceTurnaroundHours = 24;
    let selectedServiceName = 'Wash & Fold';

    function recalculateEstimator() {
      if (!estRange || !estPriceDisplay) return;
      const weight = parseInt(estRange.value, 10);
      if (estWeightDisplay) estWeightDisplay.textContent = weight + ' lbs';

      const total = (weight * selectedServiceMultiplier).toFixed(2);
      estPriceDisplay.textContent = '$' + total;

      if (estTimeDisplay) {
        estTimeDisplay.textContent = serviceTurnaroundHours + ' Hours Turnaround';
      }

      if (bookHome2EstimateBtn) {
        bookHome2EstimateBtn.href = `pages/contact.html?service=${encodeURIComponent(selectedServiceName)}&weight=${weight}&amount=%24${total}`;
      }
    }

    if (bookHome2EstimateBtn) {
      bookHome2EstimateBtn.addEventListener('click', function () {
        const weight = estRange ? estRange.value : '20';
        const total = estPriceDisplay ? estPriceDisplay.textContent : '$39.00';
        localStorage.setItem('aurawash_selected_service', selectedServiceName);
        localStorage.setItem('aurawash_estimate_weight', weight);
        localStorage.setItem('aurawash_estimate_amount', total);
      });
    }

    if (estRange) {
      estRange.addEventListener('input', recalculateEstimator);
    }

    if (estServiceBtns.length > 0) {
      estServiceBtns.forEach((btn) => {
        btn.addEventListener('click', function () {
          estServiceBtns.forEach((b) => b.classList.remove('is-selected'));
          this.classList.add('is-selected');

          const svcType = this.getAttribute('data-service');
          if (svcType === 'wash-fold') {
            selectedServiceMultiplier = 1.95;
            serviceTurnaroundHours = 24;
            selectedServiceName = 'Wash & Fold';
          } else if (svcType === 'wash-iron') {
            selectedServiceMultiplier = 2.75;
            serviceTurnaroundHours = 24;
            selectedServiceName = 'Steam Ironing';
          } else if (svcType === 'dry-clean') {
            selectedServiceMultiplier = 3.95;
            serviceTurnaroundHours = 48;
            selectedServiceName = 'Dry Cleaning';
          }
          recalculateEstimator();
        });
      });
      recalculateEstimator();
    }

    /* ==========================================================================
       5. Interactive FAQ Accordions (Home 2 & Contact Page)
       ========================================================================== */
    const faqAccordions = document.querySelectorAll('.faq-accordion');
    if (faqAccordions.length > 0) {
      faqAccordions.forEach((accordion) => {
        const items = accordion.querySelectorAll('.faq-item');
        items.forEach((item) => {
          const trigger = item.querySelector('.faq-trigger');
          if (trigger) {
            trigger.addEventListener('click', function () {
              const isOpen = item.classList.contains('is-open');
              // Close other faq items in this accordion
              items.forEach((i) => i.classList.remove('is-open'));
              if (!isOpen) {
                item.classList.add('is-open');
              }
            });
          }
        });
      });
    }

    /* ==========================================================================
       6. Pricing Page: Interactive Itemized Cost Calculator & Plan Selectors
       ========================================================================== */
    const calcContainer = document.querySelector('.calc-container');
    const bookWithEstimateBtn = document.getElementById('bookWithEstimateBtn');

    if (calcContainer) {
      const grandTotalDisplay = document.getElementById('calcGrandTotal');
      const itemCounterButtons = calcContainer.querySelectorAll('.stepper-btn');

      const itemRates = {
        'wash-fold-lbs': 1.95,
        'dry-clean-shirts': 3.50,
        'dry-clean-suits': 14.50,
        'dry-clean-pants': 7.00,
        'curtains-panels': 22.00,
        'ironing-only': 2.50
      };

      function updatePricingTotal() {
        let sum = 0;
        Object.keys(itemRates).forEach((key) => {
          const valEl = document.getElementById(`val-${key}`);
          if (valEl) {
            const count = parseInt(valEl.textContent, 10) || 0;
            sum += count * itemRates[key];
          }
        });

        const totalFormatted = '$' + sum.toFixed(2);
        if (grandTotalDisplay) {
          grandTotalDisplay.textContent = totalFormatted;
        }

        if (bookWithEstimateBtn) {
          bookWithEstimateBtn.href = `contact.html?service=Custom%20Order%20Estimate&amount=${encodeURIComponent(totalFormatted)}`;
        }
      }

      if (bookWithEstimateBtn) {
        bookWithEstimateBtn.addEventListener('click', function () {
          const total = grandTotalDisplay ? grandTotalDisplay.textContent : '$71.75';
          localStorage.setItem('aurawash_selected_service', 'Custom Order Estimate');
          localStorage.setItem('aurawash_estimate_amount', total);
        });
      }

      itemCounterButtons.forEach((btn) => {
        btn.addEventListener('click', function () {
          const action = this.getAttribute('data-action');
          const targetKey = this.getAttribute('data-target');
          const valEl = document.getElementById(`val-${targetKey}`);
          if (!valEl) return;

          let current = parseInt(valEl.textContent, 10) || 0;
          if (action === 'plus') {
            current += targetKey === 'wash-fold-lbs' ? 5 : 1;
          } else if (action === 'minus') {
            const step = targetKey === 'wash-fold-lbs' ? 5 : 1;
            current = Math.max(0, current - step);
          }
          valEl.textContent = current;
          updatePricingTotal();
        });
      });

      updatePricingTotal();
    }

    // Global service pre-selection click handler for all buttons linking to contact.html
    document.querySelectorAll('a[href*="contact.html"]').forEach((btn) => {
      btn.addEventListener('click', function () {
        const explicitService = this.getAttribute('data-service') || this.getAttribute('data-plan');
        if (explicitService) {
          localStorage.setItem('aurawash_selected_service', explicitService);
          return;
        }
        try {
          const url = new URL(this.href, window.location.href);
          const serviceQuery = url.searchParams.get('service');
          if (serviceQuery) {
            localStorage.setItem('aurawash_selected_service', serviceQuery);
          }
        } catch (e) {
          const match = this.href.match(/[?&]service=([^&]+)/);
          if (match) {
            localStorage.setItem('aurawash_selected_service', decodeURIComponent(match[1]));
          }
        }
      });
    });

    /* ==========================================================================
       7. Contact Page Auto-Selection & Form Validation
       ========================================================================== */
    const contactServiceSelect = document.getElementById('contactService');
    const contactMessageTextarea = document.getElementById('contactMessage');
    const contactAddressInput = document.getElementById('contactAddress');
    const contactPreselectedAlert = document.getElementById('contactPreselectedAlert');

    if (contactServiceSelect) {
      // 1. Read parameters from URLSearchParams or localStorage
      const urlParams = new URLSearchParams(window.location.search);
      const serviceParam = urlParams.get('service') || localStorage.getItem('aurawash_selected_service');
      const amountParam = urlParams.get('amount') || localStorage.getItem('aurawash_estimate_amount');
      const weightParam = urlParams.get('weight') || localStorage.getItem('aurawash_estimate_weight');
      const zipParam = urlParams.get('zip') || localStorage.getItem('aurawash_zip_code');

      // Clear the temporary localStorage keys
      localStorage.removeItem('aurawash_selected_service');
      localStorage.removeItem('aurawash_estimate_amount');
      localStorage.removeItem('aurawash_estimate_weight');
      localStorage.removeItem('aurawash_zip_code');

      if (zipParam && contactAddressInput && !contactAddressInput.value) {
        contactAddressInput.value = zipParam;
      }

      if (serviceParam) {
        const targetClean = serviceParam.toLowerCase().trim();
        let matched = false;

        // Try exact / partial match in options
        for (let i = 0; i < contactServiceSelect.options.length; i++) {
          const opt = contactServiceSelect.options[i];
          const valClean = opt.value.toLowerCase().trim();
          const textClean = opt.text.toLowerCase().trim();

          if (valClean === targetClean || textClean === targetClean || 
              valClean.includes(targetClean) || targetClean.includes(valClean) ||
              textClean.includes(targetClean)) {
            contactServiceSelect.selectedIndex = i;
            matched = true;
            break;
          }
        }

        // Fallback fuzzy mapping
        if (!matched) {
          if (targetClean.includes('solo')) {
            contactServiceSelect.value = 'Solo Fresh Plan';
          } else if (targetClean.includes('family')) {
            contactServiceSelect.value = 'Family Essentials Plan';
          } else if (targetClean.includes('exec') || targetClean.includes('club')) {
            contactServiceSelect.value = 'Executive Club Plan';
          } else if (targetClean.includes('custom') || targetClean.includes('estim')) {
            contactServiceSelect.value = 'Custom Order Estimate';
          } else if (targetClean.includes('wash') || targetClean.includes('fold')) {
            contactServiceSelect.value = 'Wash & Fold';
          } else if (targetClean.includes('dry')) {
            contactServiceSelect.value = 'Dry Cleaning';
          } else if (targetClean.includes('iron') || targetClean.includes('press')) {
            contactServiceSelect.value = 'Steam Ironing';
          } else if (targetClean.includes('curtain') || targetClean.includes('drapery')) {
            contactServiceSelect.value = 'Curtains & Drapery';
          } else if (targetClean.includes('commercial') || targetClean.includes('bulk')) {
            contactServiceSelect.value = 'Commercial Laundry';
          }
        }

        const selectedOptionText = contactServiceSelect.options[contactServiceSelect.selectedIndex] ? 
                                   contactServiceSelect.options[contactServiceSelect.selectedIndex].text : 
                                   contactServiceSelect.value;

        // Show pre-selected notification banner
        if (contactPreselectedAlert) {
          contactPreselectedAlert.style.display = 'block';
          contactPreselectedAlert.innerHTML = `✓ <strong>${escapeHTML(selectedOptionText)}</strong> has been automatically selected for your request. Please complete your details below!`;
        }

        // Pre-fill message textarea if empty
        if (contactMessageTextarea && !contactMessageTextarea.value.trim()) {
          const selectedVal = contactServiceSelect.value;
          if (selectedVal === 'Solo Fresh Plan') {
            contactMessageTextarea.value = "Hello AuraWash team, I would like to sign up for the Solo Fresh Membership Plan ($59/mo). Please get in touch to set up my recurring weekly doorstep pickups.";
          } else if (selectedVal === 'Family Essentials Plan') {
            contactMessageTextarea.value = "Hello AuraWash team, I would like to sign up for the Family Essentials Membership Plan ($139/mo). Please get in touch to set up our weekly doorstep pickups and deliver our personalized hampers.";
          } else if (selectedVal === 'Executive Club Plan') {
            contactMessageTextarea.value = "Hello AuraWash team, I would like to enroll in the Executive Wardrobe Club Plan ($89/mo). Please get in touch to activate my concierge dry cleaning and shirt pressing pickups.";
          } else if (selectedVal === 'Custom Order Estimate') {
            const amtStr = amountParam ? ` (Calculated Total: ${amountParam})` : '';
            contactMessageTextarea.value = `Hello AuraWash team, I would like to book a doorstep pickup for my custom calculated order estimate${amtStr}. Please contact me to confirm available collection windows.`;
          } else if (selectedVal === 'Commercial Laundry') {
            contactMessageTextarea.value = "Hello AuraWash team, I would like to request a commercial laundry proposal and corporate billing terms for our business linen and uniform needs.";
          } else if (selectedVal === 'Wash & Fold') {
            const extra = (weightParam ? ` for approx ${weightParam} lbs` : '') + (amountParam ? ` (Estimated Total: ${amountParam})` : '');
            contactMessageTextarea.value = `Hello AuraWash team, I would like to schedule a doorstep pickup for Wash & Fold everyday laundry${extra}.`;
          } else if (selectedVal === 'Dry Cleaning') {
            contactMessageTextarea.value = "Hello AuraWash team, I would like to schedule a doorstep pickup for eco-friendly dry cleaning.";
          } else if (selectedVal === 'Steam Ironing') {
            contactMessageTextarea.value = "Hello AuraWash team, I would like to schedule a doorstep pickup for artisan steam ironing and hand pressing.";
          } else if (selectedVal === 'Curtains & Drapery') {
            contactMessageTextarea.value = "Hello AuraWash team, I would like to schedule an inspection and pickup for window curtains & drapery care.";
          }
        }

        // Smooth scroll to contact form so user sees the pre-selected option right away
        setTimeout(() => {
          const formCard = document.querySelector('.contact-form-card');
          if (formCard) {
            formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 120);
      }
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let isValid = true;
        const nameInput = document.getElementById('contactName');
        const emailInput = document.getElementById('contactEmail');
        const phoneInput = document.getElementById('contactPhone');
        const messageInput = document.getElementById('contactMessage');
        const successBox = document.getElementById('contactSuccessAlert');

        // Reset errors
        document.querySelectorAll('.form-error').forEach((el) => (el.style.display = 'none'));

        if (!nameInput.value.trim()) {
          showError('contactNameError', 'Please enter your full name.');
          isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
          showError('contactEmailError', 'Please enter a valid email address.');
          isValid = false;
        }

        if (!phoneInput.value.trim() || phoneInput.value.trim().length < 7) {
          showError('contactPhoneError', 'Please enter a valid phone number.');
          isValid = false;
        }

        if (!messageInput.value.trim()) {
          showError('contactMessageError', 'Please enter your message or pickup details.');
          isValid = false;
        }

        if (isValid) {
          if (successBox) {
            successBox.style.display = 'block';
            successBox.innerHTML = `✓ Thank you, <strong>${escapeHTML(nameInput.value.trim())}</strong>! Your inquiry & pickup request has been received. Our concierge team will reach out within 30 minutes!`;
          }
          contactForm.reset();
          successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    }

    function showError(elementId, msg) {
      const err = document.getElementById(elementId);
      if (err) {
        err.textContent = msg;
        err.style.display = 'block';
      }
    }

    function escapeHTML(str) {
      return str.replace(/[&<>'"]/g, function (tag) {
        const chars = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        };
        return chars[tag] || tag;
      });
    }

    /* ==========================================================================
       9. Smooth Scroll Reveal Animations
       ========================================================================== */
    function initScrollReveal() {
      // Respect user's reduced-motion preference
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      // Collect target elements across all pages
      const targets = document.querySelectorAll(
        '.section-header, .step-card, .service-card-deep, .tech-card, .category-card, .plan-card, .guarantee-card, .depot-card, .support-sla-card, .review-card, .calc-container, .contact-form-card, .contact-info-card, .cta-banner, .corporate-banner-grid, .impact-showcase, .faq-item'
      );

      if (!targets.length) return;

      if (!('IntersectionObserver' in window)) {
        targets.forEach((el) => el.classList.add('is-revealed'));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px 0px -40px 0px',
          threshold: 0.1
        }
      );

      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      targets.forEach((el) => {
        // If element is already above or within the initial viewport, reveal immediately
        const rect = el.getBoundingClientRect();
        if (rect.top < windowHeight + 60) {
          el.classList.add('is-revealed');
        } else {
          el.classList.add('reveal');
          observer.observe(el);
        }
      });
    }

    initScrollReveal();
  });
})();
