/**
 * Apex Stationery & Office Supplies - Master Interactive Controller
 * Pure Vanilla JavaScript - No Libraries - Accessible & Fast
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Theme (Light/Dark) Controller
  // -------------------------------------------------------------------------
  const THEME_STORAGE_KEY = 'apex_theme';
  const DIR_STORAGE_KEY = 'apex_dir';

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);

    const themeToggleBtns = document.querySelectorAll('#theme-toggle, #mobile-theme-toggle, .theme-toggle-btn');
    themeToggleBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        btn.classList.add('theme-spin');
        setTimeout(function () {
          btn.classList.remove('theme-spin');
        }, 450);
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
      });
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    const themeToggleBtns = document.querySelectorAll('#theme-toggle, #mobile-theme-toggle, .theme-toggle-btn');
    themeToggleBtns.forEach(function (btn) {
      const symbolSpan = btn.querySelector('.symbol');
      const textSpan = btn.querySelector('.control-text');
      if (theme === 'dark') {
        if (symbolSpan) symbolSpan.textContent = '☀';
        if (textSpan) textSpan.textContent = 'Light Mode';
        btn.setAttribute('title', 'Switch to Light Mode');
        btn.setAttribute('aria-label', 'Switch to Light Mode');
      } else {
        if (symbolSpan) symbolSpan.textContent = '☾';
        if (textSpan) textSpan.textContent = 'Dark Mode';
        btn.setAttribute('title', 'Switch to Dark Mode');
        btn.setAttribute('aria-label', 'Switch to Dark Mode');
      }
    });
  }

  // -------------------------------------------------------------------------
  // 2. Direction (LTR/RTL) Controller
  // -------------------------------------------------------------------------
  function initDirection() {
    const savedDir = localStorage.getItem(DIR_STORAGE_KEY) || 'ltr';
    applyDirection(savedDir);

    const dirToggleBtns = document.querySelectorAll('#dir-toggle, #mobile-dir-toggle, .dir-toggle-btn');
    dirToggleBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
        const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
        applyDirection(newDir);
      });
    });
  }

  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(DIR_STORAGE_KEY, dir);

    const dirToggleBtns = document.querySelectorAll('#dir-toggle, #mobile-dir-toggle, .dir-toggle-btn');
    dirToggleBtns.forEach(function (btn) {
      const labelSpan = btn.querySelector('.dir-label') || btn;
      if (dir === 'rtl') {
        labelSpan.textContent = btn.classList.contains('drawer-control-btn') ? 'LTR Mode' : '⇄ LTR';
        btn.setAttribute('title', 'Switch layout to Left-to-Right');
        btn.setAttribute('aria-label', 'Switch layout to Left-to-Right');
      } else {
        labelSpan.textContent = btn.classList.contains('drawer-control-btn') ? 'RTL Mode' : '⇄ RTL';
        btn.setAttribute('title', 'Switch layout to Right-to-Left');
        btn.setAttribute('aria-label', 'Switch layout to Right-to-Left');
      }
    });

    // Ensure mobile drawer and backdrop state are preserved if currently open
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger-btn');
    const backdrop = document.getElementById('drawer-backdrop');
    if (navMenu && navMenu.classList.contains('is-open')) {
      navMenu.classList.add('is-open');
      if (hamburger) {
        hamburger.classList.add('is-active');
        hamburger.setAttribute('aria-expanded', 'true');
      }
      if (backdrop) backdrop.classList.add('is-visible');
      document.body.classList.add('nav-open');
    }
  }

  // -------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer & Hamburger Animation
  // -------------------------------------------------------------------------
  function initNavigation() {
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const backdrop = document.getElementById('drawer-backdrop');

    if (!hamburger || !navMenu) return;

    function openNav() {
      hamburger.classList.add('is-active');
      hamburger.setAttribute('aria-expanded', 'true');
      navMenu.classList.add('is-open');
      if (backdrop) backdrop.classList.add('is-visible');
      document.body.classList.add('nav-open');
    }

    function closeNav() {
      hamburger.classList.remove('is-active');
      hamburger.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
      if (backdrop) backdrop.classList.remove('is-visible');
      document.body.classList.remove('nav-open');
    }

    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('is-open');
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });

    if (backdrop) {
      backdrop.addEventListener('click', closeNav);
    }

    // Close on navigation link click
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 1024) {
          closeNav();
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        closeNav();
        hamburger.focus();
      }
    });

    // Auto-close drawer on viewport resize past 1024px
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024 && navMenu.classList.contains('is-open')) {
        closeNav();
      }
    });

    // Mobile Accordion for Home Dropdown
    const dropdownToggle = navMenu.querySelector('.dropdown-toggle');
    const dropdown = navMenu.querySelector('.dropdown');
    if (dropdownToggle && dropdown) {
      dropdownToggle.addEventListener('click', function (e) {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          dropdown.classList.toggle('open');
          const isExpanded = dropdown.classList.contains('open');
          dropdownToggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        }
      });
    }

    // Sticky Header Scroll Elevation
    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 15) {
          siteHeader.classList.add('scrolled');
        } else {
          siteHeader.classList.remove('scrolled');
        }
      }, { passive: true });
    }
  }

  // -------------------------------------------------------------------------
  // 4. Accordion Components (FAQs and Details)
  // -------------------------------------------------------------------------
  function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(function (header) {
      header.addEventListener('click', function () {
        const item = header.parentElement;
        const body = item.querySelector('.accordion-body');
        const isActive = item.classList.contains('active');

        // Close other sibling items in same accordion container
        const parentAccordion = item.closest('.accordion');
        if (parentAccordion) {
          const siblings = parentAccordion.querySelectorAll('.accordion-item');
          siblings.forEach(function (sib) {
            if (sib !== item) {
              sib.classList.remove('active');
              const sibBody = sib.querySelector('.accordion-body');
              if (sibBody) sibBody.style.maxHeight = null;
            }
          });
        }

        if (isActive) {
          item.classList.remove('active');
          if (body) body.style.maxHeight = null;
        } else {
          item.classList.add('active');
          if (body) body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // 5. Contact Form Validation & Submission
  // -------------------------------------------------------------------------
  function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;

      // Validate inputs
      const requiredInputs = contactForm.querySelectorAll('[required]');
      requiredInputs.forEach(function (input) {
        const val = input.value.trim();
        let fieldValid = val.length > 0;

        if (input.type === 'email' && fieldValid) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          fieldValid = emailPattern.test(val);
        }

        if (!fieldValid) {
          input.classList.add('is-invalid');
          isValid = false;
        } else {
          input.classList.remove('is-invalid');
        }

        // Live clear error on input
        input.addEventListener('input', function () {
          if (input.value.trim().length > 0) {
            input.classList.remove('is-invalid');
          }
        }, { once: true });
      });

      if (isValid) {
        const successAlert = document.getElementById('form-success-alert');
        if (successAlert) {
          successAlert.style.display = 'block';
          successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        contactForm.reset();
      }
    });
  }

  // -------------------------------------------------------------------------
  // 6. Interactive Bulk Order Estimator
  // -------------------------------------------------------------------------
  function initBulkEstimator() {
    const calcBtn = document.getElementById('calc-estimate-btn');
    const categorySelect = document.getElementById('calc-category');

    // Pre-fill from URL parameters if arriving from a product card Bulk Quote button
    const urlParams = new URLSearchParams(window.location.search);
    const prodParam = (urlParams.get('product') || urlParams.get('item') || '').toLowerCase();
    if (categorySelect && prodParam) {
      if (prodParam.includes('pen') || prodParam.includes('rollerball') || prodParam.includes('fountain') || prodParam.includes('highlighter')) {
        categorySelect.value = 'pens';
      } else if (prodParam.includes('notebook') || prodParam.includes('journal') || prodParam.includes('pad')) {
        categorySelect.value = 'notebooks';
      } else if (prodParam.includes('folder') || prodParam.includes('binder') || prodParam.includes('box') || prodParam.includes('sorter')) {
        categorySelect.value = 'filing';
      } else if (prodParam.includes('paper') || prodParam.includes('cardstock') || prodParam.includes('copy')) {
        categorySelect.value = 'paper';
      }
    }

    if (!calcBtn) return;

    calcBtn.addEventListener('click', function () {
      const itemType = document.getElementById('calc-category')?.value || 'paper';
      const quantity = parseInt(document.getElementById('calc-qty')?.value || '100', 10);
      const outputElem = document.getElementById('calc-result-price');
      const discountElem = document.getElementById('calc-result-discount');

      let unitBase = 10;
      if (itemType === 'pens') unitBase = 2.5;
      if (itemType === 'notebooks') unitBase = 8.0;
      if (itemType === 'filing') unitBase = 6.5;
      if (itemType === 'paper') unitBase = 42.0; // box of 5 reams

      let discountRate = 0.10;
      if (quantity >= 50 && quantity < 250) discountRate = 0.20;
      if (quantity >= 250 && quantity < 1000) discountRate = 0.30;
      if (quantity >= 1000) discountRate = 0.42;

      const subtotal = quantity * unitBase;
      const discount = subtotal * discountRate;
      const total = subtotal - discount;

      if (outputElem) outputElem.textContent = '$' + total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      if (discountElem) discountElem.textContent = (discountRate * 100).toFixed(0) + '% Volume Savings Applied (-$' + discount.toFixed(2) + ')';
    });
  }

  // -------------------------------------------------------------------------
  // 7. Smooth Scroll Reveals & Number Counter Animations
  // -------------------------------------------------------------------------
  function initAnimations() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Enable animation CSS triggers
    document.documentElement.classList.add('has-animations');

    // Automatically apply .reveal and staggered delays to key elements
    const revealTargets = document.querySelectorAll('.section-header, .card, .step-card, .table-wrapper, .cta-banner, .stat-item, .contact-grid > div');
    
    // Auto-stagger grid children
    const gridContainers = document.querySelectorAll('.grid-2, .grid-3, .grid-4, .workflow-grid, .stats-strip');
    gridContainers.forEach(function (grid) {
      const children = Array.from(grid.children);
      children.forEach(function (child, index) {
        child.classList.add('reveal');
        const delayIndex = (index % 4) + 1;
        child.classList.add('delay-' + delayIndex);
      });
    });

    revealTargets.forEach(function (el) {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
      }
    });

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');

            // Trigger stat counters if inside this target
            const statNum = entry.target.querySelector ? entry.target.querySelector('.stat-num') : null;
            if (statNum && !statNum.dataset.animated) {
              animateCounter(statNum);
            } else if (entry.target.classList.contains('stat-num') && !entry.target.dataset.animated) {
              animateCounter(entry.target);
            }

            observer.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.12
      });

      document.querySelectorAll('.reveal').forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      // Fallback if IntersectionObserver is unavailable
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('is-revealed');
      });
    }
  }

  // Smooth ease-out counter for statistical metrics
  function animateCounter(el) {
    el.dataset.animated = 'true';
    const rawText = el.textContent.trim();
    // Match digits and trailing symbols
    const match = rawText.match(/^([\d,\.]+)(.*)$/);
    if (!match) return;

    const numStr = match[1].replace(/,/g, '');
    const suffix = match[2] || '';
    const targetVal = parseFloat(numStr);
    if (isNaN(targetVal)) return;

    const isDecimal = numStr.includes('.');
    const decimalPlaces = isDecimal ? numStr.split('.')[1].length : 0;
    const duration = 1200;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentVal = targetVal * ease;

      let formatted = isDecimal ? currentVal.toFixed(decimalPlaces) : Math.floor(currentVal).toLocaleString();
      if (!isDecimal && numStr.length >= 4) {
        formatted = Math.floor(currentVal).toLocaleString();
      }
      el.textContent = formatted + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = rawText; // Ensure exact final string
      }
    }

    requestAnimationFrame(updateCounter);
  }

  // -------------------------------------------------------------------------
  // 8. Direct Item Quick Order System
  // -------------------------------------------------------------------------
  function initDirectOrderSystem() {
    const modal = document.getElementById('order-modal');
    if (!modal) return;

    const closeBtn = document.getElementById('order-modal-close-btn');
    const cancelBtn = document.getElementById('order-cancel-btn');
    const formView = document.getElementById('order-modal-form-view');
    const successView = document.getElementById('order-modal-success-view');
    const orderForm = document.getElementById('order-direct-form');

    // Product Preview Elements
    const imgEl = document.getElementById('order-modal-img');
    const nameEl = document.getElementById('order-modal-name');
    const skuEl = document.getElementById('order-modal-sku');
    const badgeEl = document.getElementById('order-modal-badge');
    const unitPriceEl = document.getElementById('order-modal-unit-price');
    const unitLabelEl = document.getElementById('order-modal-unit-label');
    const qtyUnitLabel = document.getElementById('order-qty-unit-label');

    // Stepper & Calc Elements
    const qtyInput = document.getElementById('order-modal-qty');
    const minusBtn = document.getElementById('order-qty-minus');
    const plusBtn = document.getElementById('order-qty-plus');
    const tierBanner = document.getElementById('order-tier-banner');
    const tierText = document.getElementById('order-tier-text');
    const calcQty = document.getElementById('order-calc-qty');
    const calcSubtotal = document.getElementById('order-calc-subtotal');
    const calcDiscountRow = document.getElementById('order-calc-discount-row');
    const calcDiscount = document.getElementById('order-calc-discount');
    const calcTax = document.getElementById('order-calc-tax');
    const calcTotal = document.getElementById('order-calc-total');
    const btnText = document.getElementById('order-btn-text');

    // Receipt Elements
    const successDoneBtn = document.getElementById('order-success-done-btn');
    const printReceiptBtn = document.getElementById('order-print-receipt-btn');
    const successOrderId = document.getElementById('success-order-id');
    const successProductName = document.getElementById('success-product-name');
    const successQuantity = document.getElementById('success-quantity');
    const successTotalAmount = document.getElementById('success-total-amount');
    const successPaymentTerms = document.getElementById('success-payment-terms');
    const successBuyerEmail = document.getElementById('success-buyer-email');

    let currentItem = {
      name: 'Apex Signature Rollerball',
      price: 18.50,
      unit: 'box',
      sku: 'APX-WRI-001',
      badge: '0.7mm Tip',
      img: '../assets/images/cat-writing.jpg'
    };

    function recalculate() {
      let qty = parseInt(qtyInput.value, 10);
      if (isNaN(qty) || qty < 1) qty = 1;
      if (qty > 500) qty = 500;
      qtyInput.value = qty;

      const subtotal = qty * currentItem.price;
      let discountRate = 0;
      if (qty >= 10) {
        discountRate = 0.10;
        tierText.textContent = '10% wholesale volume discount applied!';
      } else if (qty >= 5) {
        discountRate = 0.05;
        const diff = 10 - qty;
        tierText.textContent = '5% tier discount active! Add ' + diff + ' more to unlock 10%!';
      } else {
        const diff = 5 - qty;
        tierText.textContent = 'Add ' + diff + ' more to unlock 5% volume savings!';
      }

      const discountAmount = subtotal * discountRate;
      if (discountRate > 0) {
        calcDiscountRow.style.display = 'flex';
        calcDiscount.textContent = '-$' + discountAmount.toFixed(2) + ' (' + (discountRate * 100) + '%)';
      } else {
        calcDiscountRow.style.display = 'none';
      }

      const taxableBase = subtotal - discountAmount;
      const taxAmount = taxableBase * 0.0825;
      const totalAmount = taxableBase + taxAmount;

      calcQty.textContent = qty;
      calcSubtotal.textContent = '$' + subtotal.toFixed(2);
      calcTax.textContent = '$' + taxAmount.toFixed(2);
      calcTotal.textContent = '$' + totalAmount.toFixed(2);

      if (btnText) {
        btnText.textContent = 'Place Direct Order ($' + totalAmount.toFixed(2) + ')';
      }
    }

    function openModal(data) {
      currentItem = Object.assign(currentItem, data);

      if (nameEl) nameEl.textContent = currentItem.name;
      if (imgEl && currentItem.img) imgEl.src = currentItem.img;
      if (skuEl) skuEl.textContent = 'SKU: ' + (currentItem.sku || 'APX-GEN-01');
      if (badgeEl) badgeEl.textContent = currentItem.badge || 'Commercial Spec';
      if (unitPriceEl) unitPriceEl.textContent = '$' + parseFloat(currentItem.price).toFixed(2);
      if (unitLabelEl) unitLabelEl.textContent = '/ ' + currentItem.unit;
      if (qtyUnitLabel) qtyUnitLabel.textContent = currentItem.unit + 's';

      qtyInput.value = 1;
      recalculate();

      // Show form view, hide success view
      formView.style.display = 'block';
      successView.style.display = 'none';

      // Open backdrop
      modal.style.display = 'flex';
      setTimeout(function () {
        modal.classList.add('is-active');
        document.body.style.overflow = 'hidden';
      }, 10);
    }

    function closeModal() {
      modal.classList.remove('is-active');
      document.body.style.overflow = '';
      setTimeout(function () {
        modal.style.display = 'none';
      }, 250);
    }

    // Attach click handlers to all Order Item buttons
    document.querySelectorAll('.btn-order-item').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const data = {
          name: btn.dataset.name || btn.closest('.product-card')?.querySelector('.card-title')?.textContent.trim() || 'Office Stationery Item',
          price: parseFloat(btn.dataset.price) || 20.00,
          unit: btn.dataset.unit || 'unit',
          sku: btn.dataset.sku || 'APX-CAT-01',
          badge: btn.dataset.badge || btn.closest('.product-card')?.querySelector('.card-badge')?.textContent.trim() || 'In Stock',
          img: btn.dataset.img || btn.closest('.product-card')?.querySelector('img')?.getAttribute('src') || '../assets/images/cat-writing.jpg'
        };
        openModal(data);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (successDoneBtn) successDoneBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-active')) {
        closeModal();
      }
    });

    if (minusBtn) {
      minusBtn.addEventListener('click', function () {
        let v = parseInt(qtyInput.value, 10) || 1;
        if (v > 1) {
          qtyInput.value = v - 1;
          recalculate();
        }
      });
    }

    if (plusBtn) {
      plusBtn.addEventListener('click', function () {
        let v = parseInt(qtyInput.value, 10) || 1;
        if (v < 500) {
          qtyInput.value = v + 1;
          recalculate();
        }
      });
    }

    if (qtyInput) {
      qtyInput.addEventListener('input', recalculate);
      qtyInput.addEventListener('change', recalculate);
    }

    if (printReceiptBtn) {
      printReceiptBtn.addEventListener('click', function () {
        window.print();
      });
    }

    // Form Submission & Validation
    if (orderForm) {
      orderForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const requiredInputs = orderForm.querySelectorAll('[required]');
        let isValid = true;
        let firstInvalid = null;

        requiredInputs.forEach(function (input) {
          const val = input.value.trim();
          let fieldValid = val.length > 0;
          if (input.type === 'email') {
            fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
          }

          if (!fieldValid) {
            isValid = false;
            input.classList.add('is-invalid');
            if (!firstInvalid) firstInvalid = input;
          } else {
            input.classList.remove('is-invalid');
          }
        });

        if (!isValid) {
          if (firstInvalid) firstInvalid.focus();
          return;
        }

        // Show loading state
        const submitBtn = document.getElementById('order-submit-btn');
        if (submitBtn) {
          submitBtn.disabled = true;
          if (btnText) btnText.textContent = 'Processing Order...';
        }

        setTimeout(function () {
          if (submitBtn) submitBtn.disabled = false;

          // Fill receipt
          const randomNum = Math.floor(10000 + Math.random() * 90000);
          if (successOrderId) successOrderId.textContent = '#APX-ORD-' + randomNum;
          if (successProductName) successProductName.textContent = currentItem.name;
          if (successQuantity) successQuantity.textContent = qtyInput.value + ' ' + (parseInt(qtyInput.value, 10) > 1 ? currentItem.unit + 's' : currentItem.unit);
          if (successTotalAmount) successTotalAmount.textContent = calcTotal.textContent;

          const methodSelect = document.getElementById('order-payment-method');
          if (successPaymentTerms && methodSelect) {
            successPaymentTerms.textContent = methodSelect.options[methodSelect.selectedIndex].text;
          }

          const emailInput = document.getElementById('order-email');
          if (successBuyerEmail && emailInput) {
            successBuyerEmail.textContent = emailInput.value.trim();
          }

          // Transition to success screen
          formView.style.display = 'none';
          successView.style.display = 'block';
          orderForm.reset();
        }, 400);
      });
    }
  }

  // -------------------------------------------------------------------------
  // Initialize on DOM Ready
  // -------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initDirection();
    initNavigation();
    initAccordions();
    initContactForm();
    initBulkEstimator();
    initAnimations();
    initDirectOrderSystem();
  });
})();
