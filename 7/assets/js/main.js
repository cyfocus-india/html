/**
 * PLAY ZONE - Modern Kids Play Zone & Indoor Play Area
 * Core Main JavaScript (assets/js/main.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRTL();
  initHeaderScroll();
  initMobileNav();
  initPasswordToggles();
  initFormValidation();
  initModals();
  initScrollAnimations();
  initContactLiveMap();
  initGalleryFilter();
  initDropdowns();
  initBackToTop();
  initFaqAccordion();
  initForgotPassword();
  initHashScroll();
  initZoneMatcher();
  initBlueprintExplorer();
});

/* --------------------------------------------------------------------------
   1. Theme Management (Light / Dark Mode)
   -------------------------------------------------------------------------- */
function initTheme() {
  const savedTheme = localStorage.getItem('playzone-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  applyTheme(currentTheme);

  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme.toUpperCase()} mode`, 'info');
    });
  });

  // Listen for system theme changes if user hasn't set explicit preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('playzone-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('playzone-theme', theme);

  const themeIcons = document.querySelectorAll('.theme-toggle-btn i');
  themeIcons.forEach(icon => {
    if (theme === 'dark') {
      icon.className = 'fas fa-sun';
      icon.setAttribute('title', 'Switch to Light Mode');
    } else {
      icon.className = 'fas fa-moon';
      icon.setAttribute('title', 'Switch to Dark Mode');
    }
  });
}

/* --------------------------------------------------------------------------
   2. RTL / LTR Direction Management
   -------------------------------------------------------------------------- */
function initRTL() {
  const savedDir = localStorage.getItem('playzone-dir') || 'ltr';
  applyDirection(savedDir);

  // Click handler for segmented buttons [ LTR | RTL ]
  document.querySelectorAll('.dir-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetDir = btn.getAttribute('data-dir');
      if (targetDir) {
        applyDirection(targetDir);
        showToast(`Layout switched to ${targetDir.toUpperCase()}`, 'info');
      }
    });
  });

  // Clicking the container pill toggles between LTR and RTL
  document.querySelectorAll('.dir-toggle-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      if (e.target.classList.contains('dir-btn')) return;
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      applyDirection(newDir);
      showToast(`Layout switched to ${newDir.toUpperCase()}`, 'info');
    });
  });
}

function applyDirection(dir) {
  document.documentElement.setAttribute('dir', dir);
  localStorage.setItem('playzone-dir', dir);

  // Update active state on all .dir-btn elements across pages
  document.querySelectorAll('.dir-btn').forEach(btn => {
    if (btn.getAttribute('data-dir') === dir) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
   3. Header Sticky & Scroll Effect
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   4. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const openBtns = document.querySelectorAll('.mobile-nav-btn');
  const closeBtn = document.querySelector('.mobile-drawer-close');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.mobile-drawer-overlay');

  if (!drawer) return;

  const openDrawer = () => {
    drawer.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    openBtns.forEach(btn => btn.setAttribute('aria-expanded', 'true'));
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
    openBtns.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
  };

  openBtns.forEach(btn => btn.addEventListener('click', openDrawer));
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  // Auto-close drawer when any internal navigation link or button is clicked
  drawer.querySelectorAll('.mobile-drawer-links a, .mobile-nav-drawer a.btn').forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });
}

/* --------------------------------------------------------------------------
   5. Password Show / Hide Toggle
   -------------------------------------------------------------------------- */
function initPasswordToggles() {
  const toggleButtons = document.querySelectorAll('.toggle-pwd-btn, .password-toggle-btn');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const container = btn.closest('.password-input-group, .input-password-wrapper');
      const input = container ? container.querySelector('input') : null;
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   6. Form Validation Engine
   -------------------------------------------------------------------------- */
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate="true"]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      let isValid = true;
      const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      if (!isValid) {
        e.preventDefault();
        showToast('Please correct the errors in the form.', 'danger');
      } else {
        // If it's a demo or client-side form, handle submission gracefully
        if (form.getAttribute('data-ajax') === 'true') {
          e.preventDefault();
          const submitBtn = form.querySelector('button[type="submit"]');
          if (submitBtn) {
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

            setTimeout(() => {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalText;
              form.reset();
              showToast(form.getAttribute('data-success-msg') || 'Form submitted successfully!', 'success');
            }, 800);
          }
        }
      }
    });

    // Real-time input validation on blur / input
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
          validateField(input);
        }
      });
    });
  });
}

function validateField(input) {
  const value = input.value.trim();
  let isValid = true;
  let errorMsg = '';

  if (input.hasAttribute('required') && !value) {
    isValid = false;
    errorMsg = 'This field is required.';
  } else if (input.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMsg = 'Please enter a valid email address.';
    }
  } else if (input.type === 'password' && value && input.minLength) {
    if (value.length < input.minLength) {
      isValid = false;
      errorMsg = `Password must be at least ${input.minLength} characters.`;
    }
  } else if (input.type === 'tel' && value) {
    const phoneRegex = /^[\d\s+\-()]{7,15}$/;
    if (!phoneRegex.test(value)) {
      isValid = false;
      errorMsg = 'Please enter a valid phone number.';
    }
  }

  // Update UI error class and message
  const feedbackEl = input.parentElement.querySelector('.invalid-feedback');
  if (!isValid) {
    input.classList.add('is-invalid');
    if (feedbackEl) feedbackEl.textContent = errorMsg;
  } else {
    input.classList.remove('is-invalid');
  }

  return isValid;
}

/* --------------------------------------------------------------------------
   7. Toast Notification Utility
   -------------------------------------------------------------------------- */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconClass = type === 'success' ? 'fa-check-circle' :
                    type === 'danger' ? 'fa-exclamation-circle' :
                    type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';

  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.75rem;">
      <i class="fas ${iconClass}" style="font-size: 1.15rem;"></i>
      <span>${message}</span>
    </div>
    <button type="button" class="toast-close" style="color: inherit; opacity: 0.7; padding: 4px;" aria-label="Close">
      <i class="fas fa-times"></i>
    </button>
  `;

  container.appendChild(toast);

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    setTimeout(() => toast.remove(), 300);
  });

  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      setTimeout(() => toast.remove(), 300);
    }
  }, 4000);
}

/* --------------------------------------------------------------------------
   8. Accessible Modal Dialogs
   -------------------------------------------------------------------------- */
function initModals() {
  document.querySelectorAll('[data-modal-target]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      openModal(targetId);
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop.id);
      }
    });

    const closeBtn = backdrop.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(backdrop.id));
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-backdrop.active');
      if (activeModal) closeModal(activeModal.id);
    }
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* --------------------------------------------------------------------------
   9. Scroll Reveal Animations (All Pages)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const animTargets = document.querySelectorAll(
    '.reveal, .reveal-up, .reveal-fade, .reveal-scale, .reveal-left, .reveal-right, ' +
    '.section-header, .highlight-box, .zone-tile, .dual-promo-card, .safety-text-panel, ' +
    '.safety-ballpit-round, .safety-mosaic-art, .dash-card, .schedule-card, ' +
    '.adventure-spot-card, .gallery-tile-item, .countdown-unit-card'
  );

  if (!animTargets.length) return;

  animTargets.forEach(el => {
    if (!el.classList.contains('reveal') &&
        !el.classList.contains('reveal-up') &&
        !el.classList.contains('reveal-fade') &&
        !el.classList.contains('reveal-scale') &&
        !el.classList.contains('reveal-left') &&
        !el.classList.contains('reveal-right')) {
      el.classList.add('reveal-up');
    }

    const parent = el.parentElement;
    if (parent && (parent.classList.contains('highlights-container-grid') ||
                   parent.classList.contains('zones-four-col-grid') ||
                   parent.classList.contains('dual-promo-grid') ||
                   parent.classList.contains('schedule-timeline') ||
                   parent.classList.contains('adventure-map-grid') ||
                   parent.classList.contains('gallery-mosaic-grid') ||
                   parent.classList.contains('countdown-box-grid'))) {
      const siblingIndex = Array.from(parent.children).indexOf(el);
      el.style.transitionDelay = `${(siblingIndex % 4) * 0.12}s`;
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    animTargets.forEach(el => observer.observe(el));
  } else {
    animTargets.forEach(el => el.classList.add('is-revealed'));
  }
}

/* --------------------------------------------------------------------------
   10. Live Interactive Contact Map Navigation
   -------------------------------------------------------------------------- */
function initContactLiveMap() {
  const mapSection = document.querySelector('.contact-live-map-section');
  if (!mapSection) return;

  const mapIframe = document.getElementById('contact-live-iframe');
  const targetTitle = document.getElementById('map-target-title');
  const targetNote = document.getElementById('map-target-note');
  const directionsLink = document.getElementById('map-directions-link');
  const copyBtn = document.getElementById('map-copy-address-btn');
  const chips = mapSection.querySelectorAll('.map-chip');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const locQuery = chip.getAttribute('data-location') || '123+Play+Street,+Central+Family+Park,+Fun+City';
      const title = chip.getAttribute('data-title') || 'Play Zone Facility';
      const note = chip.getAttribute('data-note') || '';

      if (mapIframe) {
        mapIframe.src = `https://maps.google.com/maps?q=${encodeURIComponent(locQuery)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
      }

      if (targetTitle) targetTitle.textContent = title;
      if (targetNote) targetNote.textContent = note;
      if (directionsLink) {
        directionsLink.href = `https://maps.google.com/?q=${encodeURIComponent(locQuery)}`;
      }

      if (window.showToast) {
        window.showToast(`Navigated map to: ${title}`, 'info');
      }
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const address = '123 Play Street, Fun City, 560001 (Opposite Central Family Park)';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(address).then(() => {
          if (window.showToast) window.showToast('Facility address copied to clipboard!', 'success');
        }).catch(() => {
          fallbackCopyText(address);
        });
      } else {
        fallbackCopyText(address);
      }
    });
  }

  function fallbackCopyText(text) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    if (window.showToast) window.showToast('Facility address copied to clipboard!', 'success');
  }
}

/* --------------------------------------------------------------------------
   10. Gallery Category Filter (Home 2 / Visual Tour)
   -------------------------------------------------------------------------- */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filter-nav .filter-pill-btn');
  const galleryItems = document.querySelectorAll('.gallery-mosaic-grid .gallery-tile-item');

  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter') || 'all';

      // Update active button visual state and accessibility attributes
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Filter gallery tiles with smooth fade & scale animation
      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category') || '';
        const categories = itemCategory.split(/\s+/);
        const isMatch = filterValue === 'all' || categories.includes(filterValue);

        if (isMatch) {
          item.classList.remove('is-hidden');
          item.classList.add('is-animating-in');
          setTimeout(() => {
            item.classList.remove('is-animating-in');
          }, 350);
        } else {
          item.classList.add('is-hidden');
          item.classList.remove('is-animating-in');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   11. Accessible Dropdowns (Touch & Keyboard Friendly)
   -------------------------------------------------------------------------- */
function initDropdowns() {
  const dropdowns = document.querySelectorAll('.nav-dropdown');

  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.nav-link');
    const menu = dropdown.querySelector('.nav-dropdown-menu');
    if (!trigger || !menu) return;

    // Toggle on click/tap for touch screens
    trigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 1180) return; // handled by mobile drawer
      if (trigger.getAttribute('href') === '#' || trigger.getAttribute('href') === '') {
        e.preventDefault();
      }
      const isOpen = dropdown.classList.contains('is-open');
      dropdowns.forEach(d => {
        d.classList.remove('is-open');
        const t = d.querySelector('.nav-link');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        dropdown.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    // Keyboard support: Escape closes dropdown
    dropdown.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropdown.classList.contains('is-open')) {
        dropdown.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });
  });

  // Close open dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
      dropdowns.forEach(d => {
        d.classList.remove('is-open');
        const t = d.querySelector('.nav-link');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

/* --------------------------------------------------------------------------
   12. Floating Back to Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  let btn = document.querySelector('.back-to-top-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'back-to-top-btn';
    btn.setAttribute('aria-label', 'Back to top of page');
    btn.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
    document.body.appendChild(btn);
  }

  let isTicking = false;
  const toggleVisibility = () => {
    if (window.scrollY > 380) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
    isTicking = false;
  };

  window.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(toggleVisibility);
      isTicking = true;
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   13. Interactive FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const accordionCards = document.querySelectorAll('.faq-accordion-card');
  if (!accordionCards.length) return;

  accordionCards.forEach(card => {
    const questionBtn = card.querySelector('.faq-question-btn');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = card.classList.contains('is-open');

      // Close sibling items for single-open accordion behavior
      accordionCards.forEach(c => {
        c.classList.remove('is-open');
        const btn = c.querySelector('.faq-question-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        card.classList.add('is-open');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// Global exposure for inline calls
window.showToast = showToast;
window.openModal = openModal;
window.closeModal = closeModal;
window.initScrollAnimations = initScrollAnimations;
window.initContactLiveMap = initContactLiveMap;
window.initGalleryFilter = initGalleryFilter;
window.initDropdowns = initDropdowns;
window.initBackToTop = initBackToTop;
window.initFaqAccordion = initFaqAccordion;

/* --------------------------------------------------------------------------
   14. Forgot Password Handler
   -------------------------------------------------------------------------- */
function initForgotPassword() {
  const forgotLinks = document.querySelectorAll(
    '[data-action="forgot-password"], .forgot-pwd-link, a[href="#forgot"], a[href="#forgot-password-modal"]'
  );
  const forgotModal = document.getElementById('forgot-password-modal');
  const forgotForm = document.getElementById('forgot-password-form');
  const forgotEmailInput = document.getElementById('forgot-email');
  const loginEmailInput = document.getElementById('login-email');
  const forgotFormView = document.getElementById('forgot-form-view');
  const forgotSuccessView = document.getElementById('forgot-success-view');
  const forgotSentEmail = document.getElementById('forgot-sent-email');

  forgotLinks.forEach(link => {
    link.removeAttribute('onclick');

    link.addEventListener('click', (e) => {
      e.preventDefault();

      if (forgotModal) {
        // Reset modal state to form view
        if (forgotFormView) forgotFormView.style.display = 'block';
        if (forgotSuccessView) forgotSuccessView.style.display = 'none';
        if (forgotForm) {
          forgotForm.reset();
          const invalidInputs = forgotForm.querySelectorAll('.is-invalid');
          invalidInputs.forEach(input => input.classList.remove('is-invalid'));
        }

        // Auto pre-fill with email typed in sign-in form if present
        if (forgotEmailInput) {
          const typedEmail = loginEmailInput ? loginEmailInput.value.trim() : '';
          if (typedEmail) {
            forgotEmailInput.value = typedEmail;
          }
        }

        openModal('forgot-password-modal');

        if (forgotEmailInput) {
          setTimeout(() => forgotEmailInput.focus(), 150);
        }
      } else {
        // Fallback if modal is not present in the DOM
        const email = loginEmailInput ? loginEmailInput.value.trim() : '';
        if (email) {
          showToast(`Password reset link sent to ${email}`, 'success');
        } else {
          showToast('Please enter your email address to receive a password reset link.', 'warning');
          if (loginEmailInput) loginEmailInput.focus();
        }
      }
    });
  });

  if (forgotForm) {
    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = forgotEmailInput ? forgotEmailInput.value.trim() : '';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email || !emailRegex.test(email)) {
        if (forgotEmailInput) {
          forgotEmailInput.classList.add('is-invalid');
          forgotEmailInput.focus();
        }
        showToast('Please enter a valid email address.', 'danger');
        return;
      }

      if (forgotEmailInput) {
        forgotEmailInput.classList.remove('is-invalid');
      }

      const submitBtn = document.getElementById('forgot-submit-btn');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Link...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }

        if (forgotFormView && forgotSuccessView) {
          forgotFormView.style.display = 'none';
          forgotSuccessView.style.display = 'block';
          if (forgotSentEmail) forgotSentEmail.textContent = email;
        } else {
          closeModal('forgot-password-modal');
        }

        showToast(`Password reset instructions sent to ${email}`, 'success');
      }, 500);
    });

    if (forgotEmailInput) {
      forgotEmailInput.addEventListener('input', () => {
        if (forgotEmailInput.classList.contains('is-invalid')) {
          forgotEmailInput.classList.remove('is-invalid');
        }
      });
    }
  }

  // Handle any other legacy inline onclick="showToast(...)"
  document.querySelectorAll('a[onclick*="showToast"]').forEach(el => {
    if (el.getAttribute('href') === '#forgot' || el.classList.contains('forgot-pwd-link')) return;
    const originalOnclick = el.getAttribute('onclick');
    el.removeAttribute('onclick');
    el.addEventListener('click', (e) => {
      e.preventDefault();
      try { new Function(originalOnclick)(); } catch(err) { /* fallback */ }
    });
  });
}

/* --------------------------------------------------------------------------
   15. Smooth Scroll to Hash Anchors on Page Load
   -------------------------------------------------------------------------- */
function initHashScroll() {
  const hash = window.location.hash;
  if (!hash) return;

  // Delay to allow DOM to fully render (especially dashboard tabs)
  setTimeout(() => {
    const target = document.querySelector(hash);
    if (!target) return;

    // If it's a dashboard tab, activate it
    const tabId = hash.replace('#', '').replace('-tab', '');
    const tabBtn = document.querySelector(`.dash-tab-btn[data-tab="${tabId}"], .dash-tab-btn[data-tab="${hash.replace('#', '')}"]`);
    if (tabBtn) {
      tabBtn.click();
    }

    // Smooth scroll to target with header offset
    const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 84;
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }, 300);
}

/* --------------------------------------------------------------------------
   17. Interactive Child Age & Zone Matcher (Home 2)
   -------------------------------------------------------------------------- */
function initZoneMatcher() {
  const tabBtns = document.querySelectorAll('.matcher-tab-btn');
  const panels = document.querySelectorAll('.matcher-panel');
  if (!tabBtns.length || !panels.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetZone = btn.getAttribute('data-zone');
      if (!targetZone) return;

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      panels.forEach(panel => {
        if (panel.id === `zone-panel-${targetZone}`) {
          panel.classList.add('active');
          panel.removeAttribute('hidden');
        } else {
          panel.classList.remove('active');
          panel.setAttribute('hidden', '');
        }
      });
    });
  });

  // Handle Book Zone buttons to pre-select dropdown in slot-checker-bar
  const bookBtns = document.querySelectorAll('.book-zone-btn');
  const zoneSelect = document.getElementById('home-quick-zone');
  const bookingBand = document.getElementById('booking-band');

  bookBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const zone = btn.getAttribute('data-zone-select');
      if (zoneSelect && zone) {
        zoneSelect.value = zone;
      }
      if (bookingBand) {
        const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 84;
        const targetPosition = bookingBand.getBoundingClientRect().top + window.scrollY - headerHeight - 15;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   18. Interactive Arena Blueprint & Facility Explorer (Home 2)
   -------------------------------------------------------------------------- */
function initBlueprintExplorer() {
  const blueprintSection = document.getElementById('facility-walkthrough');
  if (!blueprintSection) return;

  const pins = blueprintSection.querySelectorAll('.blueprint-pin');
  const chips = blueprintSection.querySelectorAll('.bp-quick-chip');
  const svgZones = blueprintSection.querySelectorAll('.bp-svg-zone');
  const panels = blueprintSection.querySelectorAll('.inspector-panel');
  const filterBtns = blueprintSection.querySelectorAll('.blueprint-filter-btn');
  const bookBtns = blueprintSection.querySelectorAll('.bp-book-btn');
  const bookingBand = document.getElementById('booking-band');
  const zoneSelect = document.getElementById('home-quick-zone');

  const spotCategoryMap = {
    '1': 'early',
    '2': 'early',
    '3': 'adventure',
    '4': 'adventure',
    '5': 'amenities',
    '6': 'amenities'
  };

  function activateSpot(spotId) {
    if (!spotId) return;

    // Update pins
    pins.forEach(pin => {
      if (pin.getAttribute('data-spot') === spotId) {
        pin.classList.add('active');
        pin.setAttribute('aria-pressed', 'true');
      } else {
        pin.classList.remove('active');
        pin.setAttribute('aria-pressed', 'false');
      }
    });

    // Update quick chips
    chips.forEach(chip => {
      if (chip.getAttribute('data-spot') === spotId) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });

    // Update inspector panels
    panels.forEach(panel => {
      if (panel.id === `spot-panel-${spotId}`) {
        panel.classList.add('active');
        panel.removeAttribute('hidden');
      } else {
        panel.classList.remove('active');
        panel.setAttribute('hidden', '');
      }
    });
  }

  // Pin click listeners
  pins.forEach(pin => {
    pin.addEventListener('click', () => {
      const spot = pin.getAttribute('data-spot');
      activateSpot(spot);
    });
  });

  // Quick chip click listeners
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const spot = chip.getAttribute('data-spot');
      activateSpot(spot);
    });
  });

  // SVG zone click listeners
  svgZones.forEach(zone => {
    zone.addEventListener('click', () => {
      const spot = zone.getAttribute('data-spot');
      activateSpot(spot);
    });
    zone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const spot = zone.getAttribute('data-spot');
        activateSpot(spot);
      }
    });
  });

  // Category filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      if (!filter) return;

      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      let firstVisibleSpot = null;

      // Filter pins & chips
      pins.forEach(pin => {
        const spotId = pin.getAttribute('data-spot');
        const cat = spotCategoryMap[spotId];
        const isMatch = (filter === 'all' || cat === filter);
        pin.style.display = isMatch ? '' : 'none';
        if (isMatch && !firstVisibleSpot) firstVisibleSpot = spotId;
      });

      chips.forEach(chip => {
        const spotId = chip.getAttribute('data-spot');
        const cat = spotCategoryMap[spotId];
        chip.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
      });

      // If active spot is now hidden, activate first visible spot
      const currentActivePanel = blueprintSection.querySelector('.inspector-panel.active');
      if (currentActivePanel) {
        const currentCat = currentActivePanel.getAttribute('data-category');
        if (filter !== 'all' && currentCat !== filter && firstVisibleSpot) {
          activateSpot(firstVisibleSpot);
        }
      }
    });
  });

  // Direct Book CTA handlers
  bookBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const zone = btn.getAttribute('data-zone-select');
      if (zoneSelect && zone) {
        zoneSelect.value = zone;
      }
      if (bookingBand) {
        const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 84;
        const targetPosition = bookingBand.getBoundingClientRect().top + window.scrollY - headerHeight - 15;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}


