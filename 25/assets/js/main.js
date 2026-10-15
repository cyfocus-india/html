/**
 * VoltGuard Electrical - Main JavaScript
 * Handles: Theme toggle, RTL toggle, Mobile Drawer, Accordion,
 * Modern Form Validation with Accessible Feedback, Pricing Calculator, and Interactive Modals.
 * Zero dependencies, pure vanilla JS.
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. Theme Management (Light / Dark)
  // -------------------------------------------------------------------------
  const THEME_KEY = 'voltguard_theme';
  const themeToggleBtns = document.querySelectorAll('.theme-toggle');

  const getPreferredTheme = () => {
    const urlTheme = new URLSearchParams(window.location.search).get('theme');
    if (urlTheme === 'light' || urlTheme === 'dark') return urlTheme;
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    themeToggleBtns.forEach((btn) => {
      const isDrawer = btn.closest('.mobile-drawer');
      if (theme === 'dark') {
        btn.innerHTML = isDrawer ? '<span aria-hidden="true">☀</span> Light' : '<span aria-hidden="true">☀</span>';
        btn.setAttribute('aria-label', 'Switch to light theme');
        btn.setAttribute('title', 'Switch to light theme');
      } else {
        btn.innerHTML = isDrawer ? '<span aria-hidden="true">☾</span> Dark' : '<span aria-hidden="true">☾</span>';
        btn.setAttribute('aria-label', 'Switch to dark theme');
        btn.setAttribute('title', 'Switch to dark theme');
      }
    });
  };

  // Initialize Theme
  applyTheme(getPreferredTheme());

  themeToggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  });

  // -------------------------------------------------------------------------
  // 2. Direction Management (LTR / RTL)
  // -------------------------------------------------------------------------
  const DIR_KEY = 'voltguard_dir';
  const dirToggleBtns = document.querySelectorAll('.dir-toggle');

  const getPreferredDir = () => {
    const saved = localStorage.getItem(DIR_KEY);
    return saved ? saved : 'ltr';
  };

  const applyDir = (dir) => {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(DIR_KEY, dir);

    dirToggleBtns.forEach((btn) => {
      if (dir === 'rtl') {
        btn.textContent = '⇄ LTR';
        btn.setAttribute('aria-label', 'Switch to left-to-right layout');
        btn.setAttribute('title', 'Switch to left-to-right layout');
      } else {
        btn.textContent = '⇄ RTL';
        btn.setAttribute('aria-label', 'Switch to right-to-left layout');
        btn.setAttribute('title', 'Switch to right-to-left layout');
      }
    });
  };

  // Initialize Direction
  applyDir(getPreferredDir());

  dirToggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('dir') || 'ltr';
      const next = current === 'rtl' ? 'ltr' : 'rtl';
      applyDir(next);
    });
  });

  // -------------------------------------------------------------------------
  // 3. Mobile Hamburger & Slide-in Drawer Navigation
  // -------------------------------------------------------------------------
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileBackdrop = document.querySelector('.mobile-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-drawer a');

  const openDrawer = () => {
    if (!mobileDrawer) return;
    hamburgerBtn.classList.add('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('is-active');
    if (mobileBackdrop) mobileBackdrop.classList.add('is-active');
    document.body.classList.add('nav-locked');
  };

  const closeDrawer = () => {
    if (!mobileDrawer) return;
    hamburgerBtn.classList.remove('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('is-active');
    if (mobileBackdrop) mobileBackdrop.classList.remove('is-active');
    document.body.classList.remove('nav-locked');
  };

  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('is-active');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (mobileBackdrop) {
      mobileBackdrop.addEventListener('click', closeDrawer);
    }

    // Close on clicking the X close button inside drawer
    const drawerCloseBtns = document.querySelectorAll('.mobile-drawer-close');
    drawerCloseBtns.forEach((btn) => {
      btn.addEventListener('click', closeDrawer);
    });

    // Close on clicking any link inside drawer
    mobileLinks.forEach((link) => {
      link.addEventListener('click', closeDrawer);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-active')) {
        closeDrawer();
      }
    });

    if (new URLSearchParams(window.location.search).get('drawer') === 'open') {
      openDrawer();
    }
  }

  // Mobile Accordion (Home Dropdown in Drawer)
  const mobileAccordionHeader = document.querySelector('.mobile-accordion-header');
  const mobileAccordionContent = document.querySelector('.mobile-accordion-content');

  if (mobileAccordionHeader && mobileAccordionContent) {
    mobileAccordionHeader.addEventListener('click', () => {
      const isOpen = mobileAccordionContent.classList.contains('is-open');
      if (isOpen) {
        mobileAccordionContent.classList.remove('is-open');
        mobileAccordionHeader.querySelector('.accordion-arrow').textContent = '▼';
        mobileAccordionHeader.setAttribute('aria-expanded', 'false');
      } else {
        mobileAccordionContent.classList.add('is-open');
        mobileAccordionHeader.querySelector('.accordion-arrow').textContent = '▲';
        mobileAccordionHeader.setAttribute('aria-expanded', 'true');
      }
    });
  }

  // -------------------------------------------------------------------------
  // 4. FAQ Accordion (Home 2)
  // -------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const wasOpen = item.classList.contains('is-open');
        // Close all other FAQ items for clean single expansion
        faqItems.forEach((other) => {
          other.classList.remove('is-open');
          const btn = other.querySelector('.faq-question');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });

        if (!wasOpen) {
          item.classList.add('is-open');
          questionBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // -------------------------------------------------------------------------
  // 5. Interactive Pricing Calculator (Pricing Page)
  // -------------------------------------------------------------------------
  const calcForm = document.getElementById('pricing-calc-form');
  const estDisplay = document.getElementById('calc-estimate-result');

  if (calcForm && estDisplay) {
    const updateEstimate = () => {
      const service = calcForm.querySelector('#calc-service').value;
      const count = parseInt(calcForm.querySelector('#calc-count').value, 10) || 1;
      const urgency = calcForm.querySelector('#calc-urgency').value;

      let baseMin = 100;
      let baseMax = 200;

      switch (service) {
        case 'fan-fitting':
          baseMin = 160 * count;
          baseMax = 240 * count;
          break;
        case 'light-fixture':
          baseMin = 190 * count;
          baseMax = 350 * count;
          break;
        case 'switchboard-repair':
          baseMin = 180 + (count - 1) * 75;
          baseMax = 320 + (count - 1) * 110;
          break;
        case 'panel-upgrade-200a':
          baseMin = 2250;
          baseMax = 3100;
          break;
        case 'ev-charger':
          baseMin = 750;
          baseMax = 1200;
          break;
        case 'rewiring':
          baseMin = 1200 * count;
          baseMax = 2100 * count;
          break;
        default:
          baseMin = 120 * count;
          baseMax = 220 * count;
      }

      if (urgency === 'emergency') {
        baseMin = Math.round(baseMin * 1.35);
        baseMax = Math.round(baseMax * 1.35);
      } else if (urgency === 'next-day') {
        baseMin = Math.round(baseMin * 1.1);
        baseMax = Math.round(baseMax * 1.1);
      }

      estDisplay.textContent = `$${baseMin.toLocaleString()} - $${baseMax.toLocaleString()}`;
      estDisplay.classList.remove('pop-animate');
      void estDisplay.offsetWidth;
      estDisplay.classList.add('pop-animate');

      // Dynamically update the estimate booking button URL
      const calcBookBtn = document.getElementById('calc-book-btn');
      if (calcBookBtn) {
        const serviceMap = {
          'fan-fitting': 'fan-light',
          'light-fixture': 'chandelier',
          'switchboard-repair': 'switchboard',
          'panel-upgrade-200a': 'panel-upgrade',
          'ev-charger': 'ev-charger',
          'rewiring': 'rewiring'
        };
        const targetService = serviceMap[service] || service;
        calcBookBtn.setAttribute('href', `contact.html?service=${targetService}`);
      }
    };

    calcForm.addEventListener('change', updateEstimate);
    calcForm.addEventListener('input', updateEstimate);
    updateEstimate(); // Initial calculation
  }

  // -------------------------------------------------------------------------
  // 6. Contact & Booking Form Validation (Modern Web Standards)
  // Compliant with :user-invalid and ARIA state synchronization
  // -------------------------------------------------------------------------
  const bookingForm = document.getElementById('electrician-booking-form');
  const modalOverlay = document.getElementById('booking-confirmation-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  if (bookingForm) {
    // Accessibility bridge: sync aria-invalid with form validity state
    const syncAriaInvalid = (control) => {
      if (!control.checkValidity()) {
        control.setAttribute('aria-invalid', 'true');
      } else {
        control.removeAttribute('aria-invalid');
      }
    };

    bookingForm.addEventListener('blur', (e) => {
      if (e.target.matches('input, select, textarea')) {
        syncAriaInvalid(e.target);
      }
    }, true);

    bookingForm.addEventListener('input', (e) => {
      if (e.target.matches('input, select, textarea') && e.target.checkValidity()) {
        e.target.removeAttribute('aria-invalid');
        e.target.classList.remove('user-invalid-fallback');
      }
    });

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate all required fields
      const inputs = bookingForm.querySelectorAll('input[required], select[required], textarea[required]');
      let isAllValid = true;

      inputs.forEach((input) => {
        if (!input.checkValidity()) {
          isAllValid = false;
          input.classList.add('user-invalid-fallback');
          syncAriaInvalid(input);
        }
      });

      if (!isAllValid) {
        const firstInvalid = bookingForm.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // If valid, extract values and show confirmation modal
      const name = bookingForm.querySelector('#customer-name').value;
      const phone = bookingForm.querySelector('#customer-phone').value;
      const service = bookingForm.querySelector('#service-type').selectedOptions[0].text;
      const urgency = bookingForm.querySelector('#service-urgency').selectedOptions[0].text;
      const refNumber = 'VG-' + Math.floor(100000 + Math.random() * 900000);

      const refElem = document.getElementById('modal-ref-id');
      const detailsElem = document.getElementById('modal-booking-summary');

      if (refElem) refElem.textContent = refNumber;
      if (detailsElem) {
        detailsElem.innerHTML = `
          <strong>Customer:</strong> ${name}<br>
          <strong>Contact:</strong> ${phone}<br>
          <strong>Requested Service:</strong> ${service}<br>
          <strong>Dispatch Priority:</strong> ${urgency}<br>
          <strong>Status:</strong> Assigned to Metro On-Duty Master Electrician
        `;
      }

      if (modalOverlay) {
        modalOverlay.classList.add('is-active');
        document.body.classList.add('nav-locked');
      }

      bookingForm.reset();
    });
  }

  // Modal Dismissal
  if (modalOverlay) {
    const closeModal = () => {
      modalOverlay.classList.remove('is-active');
      document.body.classList.remove('nav-locked');
    };

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('is-active')) {
        closeModal();
      }
    });
  }

  // -------------------------------------------------------------------------
  // 7. Smooth Hash Anchor Scrolling with Sticky Header Offset
  // -------------------------------------------------------------------------
  if (window.location.hash) {
    const targetElement = document.querySelector(window.location.hash);
    if (targetElement) {
      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }

  // -------------------------------------------------------------------------
  // 8. Auto-populate Service in Contact Form from URL Parameters / Hash
  // -------------------------------------------------------------------------
  const serviceSelect = document.getElementById('service-type');
  if (serviceSelect) {
    let requestedService = null;
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('service')) {
      requestedService = urlParams.get('service');
    } else if (window.location.hash) {
      const hashStr = window.location.hash.replace(/^#/, '');
      if (hashStr.startsWith('service=')) {
        requestedService = hashStr.replace('service=', '');
      } else if (hashStr && !hashStr.startsWith('/')) {
        requestedService = hashStr;
      }
    }

    if (requestedService) {
      requestedService = requestedService.toLowerCase().trim();

      const serviceAliasMap = {
        'rewiring': 'rewiring',
        'wiring': 'rewiring',
        'whole-house-wiring': 'rewiring',
        'wiring-service': 'rewiring',
        'fan-light': 'fan-light',
        'fan-fitting': 'fan-light',
        'fan-light-service': 'fan-light',
        'ceiling-fan': 'fan-light',
        'switchboard': 'switchboard',
        'switchboard-repair': 'switchboard',
        'switchboard-service': 'switchboard',
        'breaker-repair': 'switchboard',
        'panel-upgrade': 'panel-upgrade',
        'panel-upgrade-200a': 'panel-upgrade',
        'panel-upgrade-service': 'panel-upgrade',
        '200a-upgrade': 'panel-upgrade',
        'ev-charger': 'ev-charger',
        'ev-package': 'ev-charger',
        'ev-charging': 'ev-charger',
        'smart-lighting': 'smart-lighting',
        'smart-lighting-controls': 'smart-lighting',
        'appliance-run': 'appliance-run',
        'dedicated-appliance': 'appliance-run',
        'surge-defense': 'surge-defense',
        'surge-package': 'surge-defense',
        'inspection': 'inspection',
        'diagnostic': 'inspection',
        'thermal-scans': 'inspection',
        'gfci-testing': 'gfci-testing',
        'gfci-afci': 'gfci-testing',
        'escrow-audit': 'escrow-audit',
        'chandelier': 'chandelier',
        'light-fixture': 'chandelier',
        'outlet-switch': 'outlet-switch',
        'gfci-outlet': 'gfci-outlet',
        'emergency': 'emergency'
      };

      const matchedValue = serviceAliasMap[requestedService] || requestedService;

      let optionFound = false;
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].value === matchedValue) {
          serviceSelect.selectedIndex = i;
          optionFound = true;
          break;
        }
      }

      if (optionFound) {
        serviceSelect.dispatchEvent(new Event('change', { bubbles: true }));
        serviceSelect.removeAttribute('aria-invalid');
        serviceSelect.classList.remove('user-invalid-fallback');

        // Pre-select emergency urgency if emergency service requested
        if (matchedValue === 'emergency') {
          const urgencySelect = document.getElementById('service-urgency');
          if (urgencySelect) {
            urgencySelect.value = 'emergency';
            urgencySelect.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }

        // Visual feedback highlight on the pre-selected input
        serviceSelect.style.outline = '2px solid var(--color-accent)';
        serviceSelect.style.boxShadow = '0 0 0 4px var(--color-accent-glow)';
        setTimeout(() => {
          serviceSelect.style.outline = '';
          serviceSelect.style.boxShadow = '';
        }, 3000);

        // Smooth scroll to the booking form so the user sees the pre-selected option
        const bookingCard = document.querySelector('.booking-form-card') || serviceSelect.closest('form');
        if (bookingCard) {
          setTimeout(() => {
            bookingCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 250);
        }
      }
    }
  }

  // -------------------------------------------------------------------------
  // 9. Clickable Service & Pricing Cards
  // -------------------------------------------------------------------------
  document.querySelectorAll('[data-service-link]').forEach((card) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      const targetUrl = card.getAttribute('data-service-link');
      if (targetUrl) {
        window.location.href = targetUrl;
      }
    });
  });

  // -------------------------------------------------------------------------
  // 10. Sticky Header Elevation on Scroll
  // -------------------------------------------------------------------------
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        siteHeader.classList.add('is-scrolled');
      } else {
        siteHeader.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // -------------------------------------------------------------------------
  // 11. Scroll-Triggered Reveal Animations (IntersectionObserver)
  // -------------------------------------------------------------------------
  const initScrollReveals = () => {
    // If user prefers reduced motion, do not apply hidden reveal states
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Select candidate elements to reveal across all sections
    const targetSelectors = [
      '.section-header',
      '.grid-4 > *',
      '.grid-3 > *',
      '.grid-2 > *',
      '.pricing-guide-grid > *',
      '.bundle-grid > *',
      '.process-grid > *',
      '.safety-checklist-grid > *',
      '.load-advisor-grid > *',
      '.calc-wrapper',
      '.banner-cta',
      '.booking-form-card',
      '.contact-info-card',
      '.faq-list > *',
      '.footer-grid > *'
    ];

    const elementsToReveal = document.querySelectorAll(targetSelectors.join(', '));
    if (!elementsToReveal.length) return;

    // Fallback if IntersectionObserver is not supported
    if (!('IntersectionObserver' in window)) {
      elementsToReveal.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    // Helper to calculate viewport overlap on load (prevent FOIC)
    const isInInitialViewport = (el) => {
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    };

    // Stagger items in the same container
    const parentContainerMap = new Map();

    elementsToReveal.forEach((el) => {
      // If inside a hero section or already in initial view, reveal cleanly
      if (el.closest('.hero-split') || el.closest('.hero-centered') || el.closest('.hero-standard') || el.closest('.hero-contact')) {
        return;
      }

      el.classList.add('reveal-on-scroll');

      // Calculate staggered delay if inside a grid
      const parent = el.parentElement;
      if (parent) {
        const count = parentContainerMap.get(parent) || 0;
        parentContainerMap.set(parent, count + 1);
        const delayClass = `reveal-delay-${(count % 6) + 1}`;
        el.classList.add(delayClass);
      }

      // If already in view on page load, reveal right away
      if (isInInitialViewport(el)) {
        requestAnimationFrame(() => {
          el.classList.add('is-revealed');
        });
      }
    });

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
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    elementsToReveal.forEach((el) => {
      if (el.classList.contains('reveal-on-scroll') && !el.classList.contains('is-revealed')) {
        observer.observe(el);
      }
    });
  };

  initScrollReveals();
});
