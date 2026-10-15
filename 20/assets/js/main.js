/**
 * HYDROFIX PLUMBING & PIPE REPAIR SERVICE
 * Pure Vanilla JavaScript - No Libraries or Frameworks
 * Handles: Theme Toggle, Direction (LTR/RTL) Toggle, Responsive Mobile Drawer,
 * Accordions, Cost Estimator, Interactive Triage, & Form Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initDirection();
  initMobileNav();
  initAccordions();
  initHome2Selector();
  initCostEstimator();
  initEmergencyChecklist();
  initContactForm();
  initHeaderScroll();
  initScrollAnimations();
});

/* --------------------------------------------------------------------------
   1. Theme Toggle (Light / Dark) with LocalStorage
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('hf_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const currentTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(currentTheme);

  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      localStorage.setItem('hf_theme', nextTheme);
    });
  });
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  themeToggles.forEach(btn => {
    const iconSpan = btn.querySelector('.theme-symbol');
    if (theme === 'dark') {
      if (iconSpan) iconSpan.textContent = '☀';
      btn.setAttribute('aria-label', 'Switch to light mode');
      btn.setAttribute('title', 'Switch to light mode');
    } else {
      if (iconSpan) iconSpan.textContent = '☾';
      btn.setAttribute('aria-label', 'Switch to dark mode');
      btn.setAttribute('title', 'Switch to dark mode');
    }
  });
}

/* --------------------------------------------------------------------------
   2. Direction Toggle (LTR / RTL) with LocalStorage
   -------------------------------------------------------------------------- */
function initDirection() {
  const dirToggles = document.querySelectorAll('.dir-toggle-btn');
  const storedDir = localStorage.getItem('hf_dir') || 'ltr';

  applyDirection(storedDir);

  dirToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeDir = document.documentElement.getAttribute('dir') || 'ltr';
      const nextDir = activeDir === 'rtl' ? 'ltr' : 'rtl';
      applyDirection(nextDir);
      localStorage.setItem('hf_dir', nextDir);
    });
  });
}

function applyDirection(dir) {
  if (dir === 'rtl') {
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    document.documentElement.removeAttribute('dir');
  }

  const dirToggles = document.querySelectorAll('.dir-toggle-btn');
  dirToggles.forEach(btn => {
    const textSpan = btn.querySelector('.dir-text');
    if (dir === 'rtl') {
      if (textSpan) textSpan.textContent = '⇄ LTR';
      btn.setAttribute('aria-label', 'Switch to Left-to-Right layout');
    } else {
      if (textSpan) textSpan.textContent = '⇄ RTL';
      btn.setAttribute('aria-label', 'Switch to Right-to-Left layout');
    }
  });
}

/* --------------------------------------------------------------------------
   3. Mobile Navigation & Drawer with Accordion
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger-btn');
  const mobilePanel = document.querySelector('.mobile-nav-panel');
  const backdrop = document.querySelector('.mobile-backdrop');
  const accordionToggle = document.querySelector('.mobile-accordion-toggle');
  const accordionMenu = document.querySelector('.mobile-accordion-menu');

  if (!hamburger || !mobilePanel) return;

  function openMenu() {
    hamburger.classList.add('is-active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobilePanel.classList.add('is-open');
    if (backdrop) backdrop.classList.add('is-open');
    document.body.classList.add('scroll-locked');
  }

  function closeMenu() {
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobilePanel.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-open');
    document.body.classList.remove('scroll-locked');
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobilePanel.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  // Close on Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobilePanel.classList.contains('is-open')) {
      closeMenu();
      hamburger.focus();
    }
  });

  // Close on mobile navigation link click
  const navLinks = mobilePanel.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Mobile Dropdown Accordion for Home
  if (accordionToggle && accordionMenu) {
    accordionToggle.addEventListener('click', () => {
      const isExpanded = accordionMenu.classList.contains('is-expanded');
      if (isExpanded) {
        accordionMenu.classList.remove('is-expanded');
        accordionToggle.setAttribute('aria-expanded', 'false');
      } else {
        accordionMenu.classList.add('is-expanded');
        accordionToggle.setAttribute('aria-expanded', 'true');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   4. Accordions (General / FAQ)
   -------------------------------------------------------------------------- */
function initAccordions() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const btn = item.querySelector('.accordion-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close sibling items in the same container
      const parent = item.closest('.accordion');
      if (parent) {
        parent.querySelectorAll('.accordion-item').forEach(sibling => {
          sibling.classList.remove('open');
          const sibBtn = sibling.querySelector('.accordion-btn');
          if (sibBtn) sibBtn.setAttribute('aria-expanded', 'false');
        });
      }

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Home 2 Interactive Issue Selector
   -------------------------------------------------------------------------- */
function initHome2Selector() {
  const issueSelect = document.getElementById('home2-issue-select');
  const issueOutput = document.getElementById('home2-issue-output');
  if (!issueSelect || !issueOutput) return;

  const solutions = {
    burst_pipe: {
      title: 'Active Pipe Fracture / Leak Detected',
      desc: 'Immediate emergency shutoff assistance, acoustic leak localization, and high-temp copper/PEX sectional pipe replacement.',
      eta: '30-45 Mins Arrival',
      price: 'Starting from $175',
      serviceKey: 'emergency_burst'
    },
    clogged_drain: {
      title: 'Mainline Sewer or Sink Blockage',
      desc: 'High-pressure 4000 PSI hydro-jetting, optical snake inspection, and thorough grease/root clearing.',
      eta: 'Standard Same-Day or Emergency',
      price: 'Starting from $140',
      serviceKey: 'drain_unblock'
    },
    low_pressure: {
      title: 'Water Pressure Loss or Valve Fault',
      desc: 'Pressure reducing valve (PRV) testing, mineral descaling, and booster pump optimization.',
      eta: 'Scheduled Within 2 Hours',
      price: 'Starting from $150',
      serviceKey: 'water_heater'
    },
    tank_sediment: {
      title: 'Storage Tank Sedimentation & Impurities',
      desc: 'Food-grade mechanical sludge removal, non-toxic UV/chlorine sanitation, and booster pump inspection.',
      eta: 'Scheduled Morning Service',
      price: 'Starting from $210',
      serviceKey: 'tank_clean'
    },
    faucet_leak: {
      title: 'Worn Tap Mechanism or Constant Drip',
      desc: 'Ceramic cartridge rebuild, water-saving aerator installation, or complete luxury mixer tap replacement.',
      eta: 'Same-Day Flexible Slot',
      price: 'Starting from $85',
      serviceKey: 'tap_replace'
    }
  };

  issueSelect.addEventListener('change', () => {
    const val = issueSelect.value;
    const match = solutions[val];
    if (match) {
      issueOutput.innerHTML = `
        <div class="anim-pop" style="background-color: var(--bg-card); border: 2px solid var(--brand-blue); border-radius: var(--radius-md); padding: 1.5rem; text-align: start; margin-top: 1rem; box-shadow: var(--card-shadow);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
            <strong style="font-size: 1.15rem; color: var(--text-primary);">${match.title}</strong>
            <span class="badge badge-guarantee">${match.eta}</span>
          </div>
          <p style="font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 1rem;">${match.desc}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); padding-top: 0.75rem;">
            <span style="font-weight: 800; font-size: 1.1rem; color: var(--brand-blue);">${match.price}</span>
            <a href="pages/contact.html?service=${match.serviceKey}" data-service="${match.serviceKey}" class="btn-primary" style="padding: 0.45rem 1rem; font-size: 0.88rem;">Book This Service</a>
          </div>
        </div>
      `;
    }
  });
}

/* --------------------------------------------------------------------------
   6. Pricing Page Interactive Cost Estimator
   -------------------------------------------------------------------------- */
function initCostEstimator() {
  const serviceSelect = document.getElementById('est-service');
  const urgencySelect = document.getElementById('est-urgency');
  const propertySelect = document.getElementById('est-property');
  const totalDisplay = document.getElementById('est-total-display');
  const breakdownDisplay = document.getElementById('est-breakdown');
  const bookBtn = document.getElementById('est-book-btn');

  if (!serviceSelect || !urgencySelect || !propertySelect || !totalDisplay) return;

  const baseRates = {
    tap_repair: { base: 85, name: 'Tap Cartridge / Faucet Replacement' },
    drain_clear: { base: 140, name: 'Drain Snaking & Unblocking' },
    pipe_repair: { base: 175, name: 'Sectional Pipe Leak Repair' },
    hydro_jet: { base: 320, name: 'Commercial-Grade Hydro-Jetting' },
    tank_clean: { base: 210, name: 'Overhead / Storage Tank Cleaning' },
    camera_inspect: { base: 165, name: '4K CCTV Pipe Camera Inspection' }
  };

  const serviceKeyMap = {
    tap_repair: 'tap_replace',
    drain_clear: 'drain_unblock',
    pipe_repair: 'pipe_repair',
    hydro_jet: 'drain_unblock',
    tank_clean: 'tank_clean',
    camera_inspect: 'audit_inspection'
  };

  function calculateEstimate() {
    const serviceKey = serviceSelect.value;
    const urgency = urgencySelect.value;
    const property = propertySelect.value;

    const serviceInfo = baseRates[serviceKey] || { base: 120, name: 'General Assessment' };
    let base = serviceInfo.base;

    // Property multiplier
    let propMultiplier = 1.0;
    if (property === 'commercial') propMultiplier = 1.35;
    if (property === 'industrial') propMultiplier = 1.6;

    // Urgency multiplier
    let urgencyFee = 0;
    if (urgency === 'urgent') urgencyFee = 45;
    if (urgency === 'emergency') urgencyFee = 85;

    const calculatedTotal = Math.round((base * propMultiplier) + urgencyFee);

    totalDisplay.textContent = `$${calculatedTotal}`;
    totalDisplay.classList.remove('anim-pop');
    void totalDisplay.offsetWidth; // Force reflow to restart animation
    totalDisplay.classList.add('anim-pop');
    if (breakdownDisplay) {
      breakdownDisplay.textContent = `${serviceInfo.name} • Labor & standard parts included • $0 diagnostic fee on completed repair`;
    }

    if (bookBtn) {
      const targetServiceCode = serviceKeyMap[serviceKey] || 'pipe_repair';
      bookBtn.href = `contact.html?service=${targetServiceCode}`;
      bookBtn.setAttribute('data-service', targetServiceCode);
    }
  }

  serviceSelect.addEventListener('change', calculateEstimate);
  urgencySelect.addEventListener('change', calculateEstimate);
  propertySelect.addEventListener('change', calculateEstimate);
  calculateEstimate();
}

/* --------------------------------------------------------------------------
   7. Emergency Page Interactive Triage Checklist
   -------------------------------------------------------------------------- */
function initEmergencyChecklist() {
  const checkboxes = document.querySelectorAll('.triage-check');
  const counter = document.getElementById('triage-counter');

  if (!checkboxes.length || !counter) return;

  function updateCount() {
    const checked = Array.from(checkboxes).filter(c => c.checked).length;
    const total = checkboxes.length;
    counter.textContent = `${checked} of ${total} safety steps completed`;
    counter.classList.remove('anim-pop');
    void counter.offsetWidth; // Force reflow to restart animation
    counter.classList.add('anim-pop');
  }

  checkboxes.forEach(c => {
    c.addEventListener('change', updateCount);
  });
}

/* --------------------------------------------------------------------------
   8. Contact Page Form Validation & Auto-Service Selection
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('booking-contact-form');
  const successBanner = document.getElementById('contact-success-banner');
  if (!form) return;

  // Auto-select service if passed from another page
  autoSelectService();

  const fields = {
    name: document.getElementById('cf-name'),
    phone: document.getElementById('cf-phone'),
    email: document.getElementById('cf-email'),
    service: document.getElementById('cf-service'),
    date: document.getElementById('cf-date'),
    address: document.getElementById('cf-address')
  };

  function validateField(input) {
    if (!input) return true;
    const group = input.closest('.form-group');
    if (!group) return true;

    let isValid = true;
    const val = input.value.trim();

    if (input.required && !val) {
      isValid = false;
    } else if (input.type === 'email' && val) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(val);
    } else if (input.id === 'cf-phone' && val) {
      const cleanPhone = val.replace(/\D/g, '');
      isValid = cleanPhone.length >= 7;
    }

    if (!isValid) {
      group.classList.add('has-error');
    } else {
      group.classList.remove('has-error');
    }

    return isValid;
  }

  Object.values(fields).forEach(input => {
    if (input) {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.closest('.form-group')?.classList.contains('has-error')) {
          validateField(input);
        }
      });
      if (input.tagName === 'SELECT') {
        input.addEventListener('change', () => validateField(input));
      }
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let allValid = true;
    Object.values(fields).forEach(input => {
      if (!validateField(input)) {
        allValid = false;
      }
    });

    if (!allValid) {
      const firstError = form.querySelector('.form-group.has-error input, .form-group.has-error select');
      if (firstError) firstError.focus();
      return;
    }

    // Submit Simulation
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Processing Dispatch Request...</span>';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();

      if (successBanner) {
        const ticketCode = 'HF-' + Math.floor(100000 + Math.random() * 900000);
        const ticketSpan = successBanner.querySelector('.ticket-id');
        if (ticketSpan) ticketSpan.textContent = ticketCode;

        successBanner.classList.add('is-visible');
        successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 900);
  });
}

/**
 * Automatically detects and selects the chosen service in the contact form
 * using URL query parameters (?service=...), location hash, or sessionStorage.
 */
function autoSelectService() {
  const serviceDropdown = document.getElementById('cf-service');
  if (!serviceDropdown) return;

  let serviceCode = null;

  // 1. Check URL query parameters (?service=... or ?s=...)
  try {
    const params = new URLSearchParams(window.location.search);
    serviceCode = params.get('service') || params.get('s');
  } catch (err) {}

  // 2. Check location.search / location.hash fallback
  if (!serviceCode) {
    const match = (window.location.search + window.location.hash).match(/[?&#](?:service|s)=([^&#]+)/i);
    if (match) {
      serviceCode = decodeURIComponent(match[1]);
    }
  }

  // 3. Check sessionStorage fallback
  if (!serviceCode) {
    try {
      serviceCode = sessionStorage.getItem('hf_selected_service');
      if (serviceCode) {
        sessionStorage.removeItem('hf_selected_service');
      }
    } catch (err) {}
  }

  if (!serviceCode) return;

  serviceCode = serviceCode.toLowerCase().trim();

  // Normalize aliases to valid #cf-service values
  const aliasMap = {
    'pipe_repair': 'pipe_repair',
    'pipe': 'pipe_repair',
    'leak': 'pipe_repair',
    'pinhole': 'pipe_repair',
    'drain_unblock': 'drain_unblock',
    'drain': 'drain_unblock',
    'drain_clear': 'drain_unblock',
    'clog': 'drain_unblock',
    'clogged_drain': 'drain_unblock',
    'hydro_jet': 'drain_unblock',
    'sewer': 'drain_unblock',
    'tap_replace': 'tap_replace',
    'tap': 'tap_replace',
    'tap_repair': 'tap_replace',
    'faucet': 'tap_replace',
    'faucet_leak': 'tap_replace',
    'tank_clean': 'tank_clean',
    'tank': 'tank_clean',
    'tank_sediment': 'tank_clean',
    'water_heater': 'water_heater',
    'heater': 'water_heater',
    'low_pressure': 'water_heater',
    'pressure': 'water_heater',
    'prv': 'water_heater',
    'audit_inspection': 'audit_inspection',
    'audit': 'audit_inspection',
    'inspection': 'audit_inspection',
    'maintenance': 'audit_inspection',
    'home_shield': 'audit_inspection',
    'landlord': 'audit_inspection',
    'facility': 'audit_inspection',
    'camera_inspect': 'audit_inspection',
    'emergency_burst': 'emergency_burst',
    'emergency': 'emergency_burst',
    'burst_pipe': 'emergency_burst',
    'burst': 'emergency_burst'
  };

  const targetValue = aliasMap[serviceCode] || serviceCode;

  for (let i = 0; i < serviceDropdown.options.length; i++) {
    if (serviceDropdown.options[i].value === targetValue) {
      serviceDropdown.selectedIndex = i;

      // Clear any previous error state
      const group = serviceDropdown.closest('.form-group');
      if (group) group.classList.remove('has-error');

      // Visual highlight confirmation
      serviceDropdown.style.borderColor = 'var(--brand-blue)';
      serviceDropdown.style.boxShadow = '0 0 0 3px rgba(2, 132, 199, 0.3)';
      setTimeout(() => {
        serviceDropdown.style.boxShadow = '';
      }, 2500);

      // Scroll smoothly to form if user clicked a service from another page
      const formCard = document.querySelector('.contact-form-card');
      if (formCard && (window.location.search || window.location.hash)) {
        setTimeout(() => {
          formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
      break;
    }
  }
}

// Global click listener to store chosen service into sessionStorage as an extra fail-safe
document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-service]');
  if (link) {
    const service = link.getAttribute('data-service');
    if (service) {
      try {
        sessionStorage.setItem('hf_selected_service', service);
      } catch (err) {}
    }
  }
});

/* --------------------------------------------------------------------------
   9. Sticky Header Dynamic Elevation on Scroll
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 25) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   10. Scroll Reveal Animation Engine (Progressive Enhancement)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  // WCAG AA: Respect reduced-motion preferences
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  if (!('IntersectionObserver' in window)) {
    return;
  }

  // Activate CSS progressive enhancement hiding
  document.documentElement.classList.add('js-anim-ready');

  const targetSelectors = [
    '.section-header',
    '.grid-2 > *',
    '.grid-3 > *',
    '.grid-4 > *',
    '.plan-grid > *',
    '.process-step-grid > *',
    '.triage-step-grid > *',
    '.service-deep-card',
    '.emergency-cta-banner',
    '.cta-banner',
    '.contact-form-card',
    '.contact-info-card',
    '.estimator-card',
    '.estimator-summary',
    '.faq-container',
    '.data-table-wrapper',
    '.pricing-tiers-wrapper'
  ];

  const parentGrids = document.querySelectorAll('.grid-2, .grid-3, .grid-4, .plan-grid, .process-step-grid, .triage-step-grid');
  parentGrids.forEach(grid => {
    grid.classList.add('reveal-grid');
  });

  const elementsToReveal = document.querySelectorAll(targetSelectors.join(', '));

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add('is-revealed');
        obs.unobserve(el);

        // Remove reveal classes after transition so hover states & transforms remain unconstrained
        const delay = parseFloat(getComputedStyle(el).transitionDelay || '0') * 1000;
        setTimeout(() => {
          el.classList.remove('reveal-item', 'is-revealed');
          el.style.willChange = 'auto';
        }, 750 + delay);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  elementsToReveal.forEach(el => {
    // Avoid double-animating hero section items that already animate on load
    if (el.closest('.home1-hero, .home2-hero, .services-hero, .pricing-hero, .emergency-hero, .contact-hero')) {
      return;
    }
    el.classList.add('reveal-item');
    observer.observe(el);
  });
}

