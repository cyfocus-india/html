/**
 * VoltGuard Electrical - Main JavaScript
 * Handles: Theme toggle, RTL toggle, Mobile Drawer, Accordion,
 * Modern Form Validation with Accessible Feedback, Pricing Calculator, Interactive Modals,
 * Smart sticky header, Newsletter signup, Stat counters, Project filters, and Back to top.
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
        btn.textContent = 'LTR';
        btn.setAttribute('aria-label', 'Switch to left-to-right layout');
        btn.setAttribute('title', 'Switch to left-to-right layout');
      } else {
        btn.textContent = 'RTL';
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

  // Desktop Navigation Dropdown (Home Dropdown: Home 1 & Home 2)
  const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
  dropdownTriggers.forEach((trigger) => {
    const parent = trigger.closest('.nav-dropdown');
    if (!parent) return;
    const menu = parent.querySelector('.dropdown-menu');
    if (!menu) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.contains('show');
      document.querySelectorAll('.dropdown-menu.show').forEach((m) => {
        if (m !== menu) {
          m.classList.remove('show');
          const t = m.closest('.nav-dropdown')?.querySelector('.dropdown-trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });
      menu.classList.toggle('show', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });

    parent.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('show')) {
        menu.classList.remove('show');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.dropdown-menu.show').forEach((m) => {
        m.classList.remove('show');
        const t = m.closest('.nav-dropdown')?.querySelector('.dropdown-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Mobile Accordion (Home Dropdown in Drawer)
  const mobileAccordionHeaders = document.querySelectorAll('.mobile-accordion-header');
  mobileAccordionHeaders.forEach((header) => {
    const parent = header.closest('.mobile-accordion') || header.parentElement;
    const content = parent.querySelector('.mobile-accordion-content');
    if (!content) return;

    header.addEventListener('click', () => {
      const isOpen = content.classList.contains('is-open');
      const arrow = header.querySelector('.accordion-arrow');
      if (isOpen) {
        content.classList.remove('is-open');
        if (arrow) arrow.textContent = '▼';
        header.setAttribute('aria-expanded', 'false');
      } else {
        content.classList.add('is-open');
        if (arrow) arrow.textContent = '▲';
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });

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
  // getElementById (not querySelector) so hashes like "#service=rewiring"
  // don't throw and halt the rest of this script
  if (window.location.hash) {
    let targetElement = null;
    try {
      targetElement = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    } catch (err) {
      targetElement = null;
    }
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
  // 10. Sticky Header: stays fixed at the top of the viewport at all times
  //     Adds subtle elevation shadow & border accent when scrolled.
  // -------------------------------------------------------------------------
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    let scrollTicking = false;

    const updateHeader = () => {
      const currentY = Math.max(window.scrollY, 0);
      siteHeader.classList.toggle('is-scrolled', currentY > 10);
      siteHeader.classList.remove('is-hidden');
      scrollTicking = false;
    };

    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        scrollTicking = true;
        window.requestAnimationFrame(updateHeader);
      }
    }, { passive: true });

    updateHeader();
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal an element, then drop the reveal classes so the element's own
  // hover transitions (lift, shadow, border) run without the stagger delay
  const REVEAL_CLASSES = ['reveal-on-scroll', 'is-revealed', 'reveal-delay-1', 'reveal-delay-2',
    'reveal-delay-3', 'reveal-delay-4', 'reveal-delay-5', 'reveal-delay-6'];

  const revealElement = (el) => {
    if (!el.classList.contains('reveal-on-scroll') || el.classList.contains('is-revealed')) return;
    el.classList.add('is-revealed');
    window.setTimeout(() => el.classList.remove(...REVEAL_CLASSES), 1300);
  };

  // -------------------------------------------------------------------------
  // 11. Scroll-Triggered Reveal Animations (IntersectionObserver)
  // -------------------------------------------------------------------------
  const initScrollReveals = () => {
    // If user prefers reduced motion, do not apply hidden reveal states
    if (prefersReducedMotion) {
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
      '.stats-grid > *',
      '.story-grid > *',
      '.timeline-item',
      '.booking-steps > *',
      '.ready-box',
      '.team-grid > *',
      '.cert-grid > *',
      '.projects-overview > *',
      '.project-grid > *',
      '.case-study',
      '.footer-cta',
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
          revealElement(el);
        });
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealElement(entry.target);
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

  // -------------------------------------------------------------------------
  // 12. Footer Newsletter Signup (client-side validation + confirmation)
  // -------------------------------------------------------------------------
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  document.querySelectorAll('.newsletter-form').forEach((form) => {
    const input = form.querySelector('.newsletter-input');
    const msg = form.querySelector('.newsletter-msg');
    if (!input || !msg) return;

    const setMessage = (text, type) => {
      msg.textContent = text;
      msg.classList.remove('is-success', 'is-error');
      if (type) msg.classList.add(type);
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = input.value.trim();

      if (!EMAIL_PATTERN.test(email)) {
        input.setAttribute('aria-invalid', 'true');
        setMessage(
          email
            ? 'That email address looks incomplete. Please check it and try again.'
            : 'Please enter your email address to subscribe.',
          'is-error'
        );
        input.focus();
        return;
      }

      input.removeAttribute('aria-invalid');
      setMessage(`You're subscribed! Your first safety checklist is on its way to ${email}.`, 'is-success');
      form.reset();
    });

    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true' && EMAIL_PATTERN.test(input.value.trim())) {
        input.removeAttribute('aria-invalid');
        setMessage('', null);
      }
    });
  });

  // -------------------------------------------------------------------------
  // 13. Animated Statistic Counters (About & Projects pages)
  // The HTML already holds the final figure, so no-JS and reduced-motion
  // visitors see correct numbers; screen readers get a static copy.
  // -------------------------------------------------------------------------
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && !prefersReducedMotion && 'IntersectionObserver' in window) {
    const formatCount = (value, decimals) => value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });

    const runCounter = (el) => {
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = formatCount(target * eased, decimals) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach((el) => {
      const staticCopy = document.createElement('span');
      staticCopy.className = 'sr-only';
      staticCopy.textContent = el.textContent;
      el.after(staticCopy);
      el.setAttribute('aria-hidden', 'true');
      el.textContent = formatCount(0, parseInt(el.dataset.decimals || '0', 10)) + (el.dataset.suffix || '');
      counterObserver.observe(el);
    });
  }

  // -------------------------------------------------------------------------
  // 14. Bar Chart Fill Animation (Projects page)
  // -------------------------------------------------------------------------
  const barCharts = document.querySelectorAll('.bar-chart');
  if (barCharts.length && !prefersReducedMotion && 'IntersectionObserver' in window) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('bars-pending');
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    barCharts.forEach((chart) => {
      // Collapse the bars without animating them shut first
      chart.querySelectorAll('.bar-fill').forEach((bar) => { bar.style.transition = 'none'; });
      chart.classList.add('bars-pending');
      void chart.offsetWidth;
      chart.querySelectorAll('.bar-fill').forEach((bar) => { bar.style.transition = ''; });
      barObserver.observe(chart);
    });
  }

  // -------------------------------------------------------------------------
  // 15. Projects Gallery Category Filters
  // -------------------------------------------------------------------------
  const filterGroup = document.querySelector('.project-filters');
  if (filterGroup) {
    const filterBtns = filterGroup.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectCount = document.getElementById('project-count');

    const applyFilter = (filter) => {
      let visible = 0;

      projectCards.forEach((card) => {
        const categories = (card.dataset.category || '').split(' ');
        const show = filter === 'all' || categories.includes(filter);
        const wasHidden = card.hidden;
        card.hidden = !show;

        if (show) {
          visible += 1;
          revealElement(card);
          if (wasHidden && !prefersReducedMotion) {
            card.classList.remove('is-entering');
            void card.offsetWidth;
            card.classList.add('is-entering');
          }
        }
      });

      filterBtns.forEach((btn) => {
        btn.setAttribute('aria-pressed', String(btn.dataset.filter === filter));
      });

      if (projectCount) {
        projectCount.textContent = `Showing ${visible} of ${projectCards.length} projects`;
      }
    };

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
    });
  }

  // -------------------------------------------------------------------------
  // 16. Back to Top (footer)
  // -------------------------------------------------------------------------
  document.querySelectorAll('.back-to-top').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      // Keyboard users land back at the top of the page, not deep in the footer
      if (e.detail === 0) {
        const brand = document.querySelector('.site-header .brand-link');
        if (brand) brand.focus({ preventScroll: true });
      }
    });
  });
});
