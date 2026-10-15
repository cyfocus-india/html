/**
 * SCOOP & SWIRL - ARTISAN ICE CREAM & DESSERT PARLOUR
 * Main JavaScript (No frameworks, No libraries, File:// protocol compatible)
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initDirectionToggle();
  initMobileNavigation();
  initDropdownAccordion();
  initMenuFilters();
  initPartyCalculator();
  initLocationMap();
  initContactForm();
  initFaqAccordion();
  initOnlineOrderingSystem();
  initStickyHeader();
  initScrollAnimations();
});

/* ==========================================================================
   1. Theme Toggle (Light / Dark Mode with localStorage)
   ========================================================================== */
function initThemeToggle() {
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('scoop_theme') || 'light';
  
  applyTheme(savedTheme);

  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('scoop_theme', newTheme);
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
    // Show Sun icon in dark mode (click to make light), Moon icon in light mode (click to make dark)
    btn.textContent = theme === 'dark' ? '☀' : '☾';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  });
}

/* ==========================================================================
   2. Direction Toggle (LTR / RTL with localStorage)
   ========================================================================== */
function initDirectionToggle() {
  const dirToggles = document.querySelectorAll('.dir-toggle-btn');
  const savedDir = localStorage.getItem('scoop_dir') || 'ltr';

  applyDirection(savedDir);

  dirToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      applyDirection(newDir);
      localStorage.setItem('scoop_dir', newDir);
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
    btn.textContent = dir === 'rtl' ? '⇄ LTR' : '⇄ RTL';
    btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to left to right layout' : 'Switch to right to left layout');
  });
}

/* ==========================================================================
   3. Mobile Hamburger & Slide-in Drawer Navigation
   ========================================================================== */
function initMobileNavigation() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navDrawer = document.getElementById('navDrawer');
  const navOverlay = document.getElementById('navOverlay');
  const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-trigger), .dropdown-item');

  if (!hamburgerBtn || !navDrawer || !navOverlay) return;

  function openMenu() {
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    navDrawer.classList.add('active');
    navOverlay.classList.add('active');
    document.body.classList.add('no-scroll');
  }

  function closeMenu() {
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    navDrawer.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = navDrawer.classList.contains('active');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navOverlay.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        closeMenu();
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navDrawer.classList.contains('active')) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   4. Dropdown Accordion in Mobile & Keyboard Nav
   ========================================================================== */
function initDropdownAccordion() {
  const dropdownTrigger = document.querySelector('.dropdown-trigger');
  const dropdownContainer = document.querySelector('.dropdown');

  if (!dropdownTrigger || !dropdownContainer) return;

  dropdownTrigger.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024) {
      e.preventDefault();
      const isOpen = dropdownContainer.classList.contains('open');
      dropdownContainer.classList.toggle('open', !isOpen);
      dropdownTrigger.setAttribute('aria-expanded', String(!isOpen));
    }
  });
}

/* ==========================================================================
   5. Menu Category & Dietary Preference Filter (Menu Page)
   ========================================================================== */
function initMenuFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuItems = document.querySelectorAll('.menu-filterable-item');

  if (!filterBtns.length || !menuItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      menuItems.forEach((item, idx) => {
        const diet = item.getAttribute('data-diet') || '';
        if (filter === 'all' || diet.includes(filter)) {
          item.style.display = '';
          item.classList.remove('filter-show');
          void item.offsetWidth; // re-trigger animation
          item.classList.add('filter-show');
          item.style.animationDelay = `${(idx % 6) * 0.04}s`;
        } else {
          item.style.display = 'none';
          item.classList.remove('filter-show');
        }
      });
    });
  });
}

/* ==========================================================================
   6. Party Catering Real-Time Calculator (Party & Bulk Orders Page)
   ========================================================================== */
function initPartyCalculator() {
  const guestSlider = document.getElementById('calcGuests');
  const guestCountDisplay = document.getElementById('calcGuestCount');
  const packageCards = document.querySelectorAll('.calc-radio-card');
  const addonCheckboxes = document.querySelectorAll('.calc-addon-input');
  const totalDisplay = document.getElementById('calcTotalCost');
  const costPerPersonDisplay = document.getElementById('calcCostPerPerson');

  if (!guestSlider || !totalDisplay) return;

  let baseRate = 16; // default to Vintage Scoop Cart

  function calculateTotal() {
    const guests = parseInt(guestSlider.value, 10);
    guestCountDisplay.textContent = `${guests} Guests`;

    let addOnsPerPerson = 0;
    addonCheckboxes.forEach(box => {
      if (box.checked) {
        addOnsPerPerson += parseFloat(box.value || 0);
      }
    });

    const ratePerGuest = baseRate + addOnsPerPerson;
    const subtotal = guests * ratePerGuest;

    // Apply 10% volume discount for 150+ guests
    const discount = guests >= 150 ? subtotal * 0.10 : 0;
    const finalTotal = subtotal - discount;

    totalDisplay.textContent = `$${Math.round(finalTotal).toLocaleString()}`;
    if (costPerPersonDisplay) {
      costPerPersonDisplay.textContent = `~$${(finalTotal / guests).toFixed(2)} / guest`;
    }
  }

  guestSlider.addEventListener('input', calculateTotal);

  packageCards.forEach(card => {
    card.addEventListener('click', () => {
      packageCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input');
      if (radio) {
        radio.checked = true;
        baseRate = parseFloat(radio.value);
      }
      calculateTotal();
    });
  });

  addonCheckboxes.forEach(cb => {
    cb.addEventListener('change', calculateTotal);
  });

  // Calculate initial values
  calculateTotal();

  // Inquiry form submit handling
  const quoteForm = document.getElementById('partyQuoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting Request...';
      }
      setTimeout(() => {
        const successBox = document.getElementById('partySuccessMsg');
        if (successBox) successBox.style.display = 'block';
        quoteForm.reset();
        calculateTotal();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Catering Request';
        }
      }, 700);
    });
  }
}

/* ==========================================================================
   7. Location Map Component (Contact Page)
   ========================================================================== */
function initLocationMap() {
  const mapTabs = document.querySelectorAll('.map-tab-btn');
  const mapAddressLabel = document.getElementById('mapAddressLabel');
  const mapHoursLabel = document.getElementById('mapHoursLabel');
  const mapDirectionsLink = document.getElementById('mapDirectionsLink');
  const mapPinTitle = document.getElementById('mapPinTitle');
  const mapParkArea = document.querySelector('.map-park-area');

  const locations = {
    boardwalk: {
      title: 'Sunset Beach Boardwalk',
      address: '120 Ocean Promenade, Pier Plaza Suite 4, Seaside Boardwalk',
      hours: 'Mon–Sun: 10:30 AM – 11:00 PM Daily',
      park: 'Seaside Dunes & Pier',
      dirUrl: 'https://maps.google.com/?q=120+Ocean+Promenade+Pier+Plaza',
      iframeId: 'mapIframeBoardwalk'
    }
  };

  if (!mapTabs.length) return;

  mapTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      mapTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const locKey = tab.getAttribute('data-location') || 'boardwalk';
      const locData = locations[locKey] || locations.boardwalk;

      // Switch Google Map iframes
      const mapIframes = document.querySelectorAll('.google-map-iframe');
      mapIframes.forEach(iframe => iframe.classList.remove('active'));

      if (locData) {
        const activeIframe = document.getElementById(locData.iframeId);
        if (activeIframe) activeIframe.classList.add('active');

        if (mapPinTitle) mapPinTitle.textContent = locData.title;
        if (mapAddressLabel) mapAddressLabel.textContent = locData.address;
        if (mapHoursLabel) mapHoursLabel.textContent = locData.hours;
        if (mapParkArea) mapParkArea.textContent = locData.park;
        if (mapDirectionsLink) mapDirectionsLink.href = locData.dirUrl;

        // Smooth map transition animation
        const mapWrap = document.querySelector('.map-embed-wrapper');
        if (mapWrap) {
          mapWrap.classList.remove('map-switched');
          void mapWrap.offsetWidth;
          mapWrap.classList.add('map-switched');
        }
      }
    });
  });
}

/* ==========================================================================
   8. Contact Form with Live Field Validation (Contact Page)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const messageInput = document.getElementById('contactMessage');
  const successAlert = document.getElementById('contactSuccessAlert');

  function validateEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  }

  function validateField(input, testFn, errorMsg) {
    const parent = input.closest('.form-group');
    const errorEl = parent ? parent.querySelector('.form-error') : null;

    if (!testFn(input.value)) {
      if (parent) parent.classList.add('has-error');
      if (errorEl) errorEl.textContent = errorMsg;
      return false;
    } else {
      if (parent) parent.classList.remove('has-error');
      return true;
    }
  }

  if (nameInput) {
    nameInput.addEventListener('input', () => {
      validateField(nameInput, val => val.trim().length >= 2, 'Please enter at least 2 characters.');
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      validateField(emailInput, validateEmail, 'Please enter a valid email address.');
    });
  }

  if (messageInput) {
    messageInput.addEventListener('input', () => {
      validateField(messageInput, val => val.trim().length >= 10, 'Message must be at least 10 characters.');
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(nameInput, val => val.trim().length >= 2, 'Please enter your full name.');
    const isEmailValid = validateField(emailInput, validateEmail, 'Please enter a valid email address.');
    const isMessageValid = validateField(messageInput, val => val.trim().length >= 10, 'Please write at least 10 characters.');

    if (isNameValid && isEmailValid && isMessageValid) {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending Message...';
      }

      setTimeout(() => {
        if (successAlert) {
          successAlert.style.display = 'block';
          successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
      }, 600);
    }
  });
}

/* ==========================================================================
   9. FAQ & Information Accordions
   ========================================================================== */
function initFaqAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      if (!item) return;

      const isActive = item.classList.contains('active');
      
      // Close other accordion items in the same container
      const parent = item.parentElement;
      if (parent) {
        parent.querySelectorAll('.accordion-item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherBtn = otherItem.querySelector('.accordion-header');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });
      }

      item.classList.toggle('active', !isActive);
      header.setAttribute('aria-expanded', String(!isActive));
    });
  });
}

/* ==========================================================================
   10. Interactive Online Ordering System & Cart Management
   ========================================================================== */
function initOnlineOrderingSystem() {
  injectOrderingElements();
  updateCartUI();
  setupOrderButtons();
  setupDrawerListeners();
  setupCustomizerModal();
  setupOrderCheckout();
}

// 1. Get & Save Cart in localStorage
function getCart() {
  try {
    return JSON.parse(localStorage.getItem('scoop_cart')) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('scoop_cart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(item) {
  const cart = getCart();
  const existingIdx = cart.findIndex(
    i => i.name === item.name && i.optionsText === item.optionsText
  );

  if (existingIdx > -1) {
    cart[existingIdx].quantity += item.quantity || 1;
  } else {
    cart.push({
      id: item.id || 'item_' + Date.now(),
      name: item.name,
      category: item.category || 'icecream',
      price: parseFloat(item.price),
      quantity: item.quantity || 1,
      optionsText: item.optionsText || ''
    });
  }

  saveCart(cart);
  showOrderToast(`🍦 Added "${item.name}" to your order!`);
}

function removeFromCart(index) {
  const cart = getCart();
  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
    saveCart(cart);
  }
}

function updateCartQuantity(index, delta) {
  const cart = getCart();
  if (index >= 0 && index < cart.length) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    saveCart(cart);
  }
}

// 2. Inject DOM Elements (Cart Drawer, Modals, Floating Pill, Toast)
function injectOrderingElements() {
  if (document.getElementById('orderDrawerBackdrop')) return;

  const container = document.createElement('div');
  container.id = 'orderingSystemRoot';
  container.innerHTML = `
    <!-- Floating Cart Action Pill -->
    <button class="order-floating-pill" id="orderFloatingPill" aria-label="View current order">
      <span>🛒</span>
      <span>View Order</span>
      <span class="order-pill-badge" id="orderPillCount">0</span>
    </button>

    <!-- Notification Toast -->
    <div class="order-toast" id="orderToast">
      <span id="orderToastMsg">Item added to order!</span>
      <button class="order-toast-btn" id="orderToastViewBtn">View Order</button>
    </div>

    <!-- Slide-in Order Drawer Backdrop & Drawer -->
    <div class="order-drawer-backdrop" id="orderDrawerBackdrop"></div>
    <div class="order-drawer" id="orderDrawer" role="dialog" aria-modal="true" aria-label="Order Cart">
      <div class="order-drawer-header">
        <h3 class="order-drawer-title">
          <span>🛍</span> Your Ice Cream Order
        </h3>
        <button class="order-close-btn" id="orderCloseBtn" aria-label="Close order drawer">✕</button>
      </div>

      <div class="order-drawer-body" id="orderDrawerBody">
        <!-- Rendered via JS -->
      </div>

      <div class="order-drawer-footer" id="orderDrawerFooter">
        <div class="order-summary-row">
          <span>Subtotal</span>
          <span id="cartSubtotal">$0.00</span>
        </div>
        <div class="order-summary-row">
          <span>Local Tax (8%)</span>
          <span id="cartTax">$0.00</span>
        </div>
        <div class="order-summary-row total-row">
          <span>Total</span>
          <span class="total-amount" id="cartTotal">$0.00</span>
        </div>
        <button class="btn btn-primary btn-lg" id="btnPlaceOrder" style="width: 100%;">
          Place Pickup Order
        </button>
      </div>
    </div>

    <!-- Scoop Flavor & Cone Customizer Modal -->
    <div class="order-modal-backdrop" id="customizerModalBackdrop">
      <div class="order-modal-card">
        <div class="order-modal-header">
          <div>
            <span class="badge badge-primary" style="margin-bottom: 0.25rem;">Customize Your Scoop</span>
            <h3 id="customizerItemName">Artisan Ice Cream</h3>
          </div>
          <button class="order-close-btn" id="customizerCloseBtn" aria-label="Close customizer">✕</button>
        </div>

        <div class="order-modal-body">
          <!-- Size Options -->
          <div>
            <div class="modal-section-title">1. Select Scoop Size</div>
            <div class="modal-options-grid" id="modalSizeGrid">
              <div class="modal-option-card selected" data-type="size" data-price="4.50" data-label="Single Scoop">
                <div>Single Scoop</div>
                <div class="modal-option-price">$4.50</div>
              </div>
              <div class="modal-option-card" data-type="size" data-price="7.25" data-label="Double Scoop">
                <div>Double Scoop</div>
                <div class="modal-option-price">$7.25</div>
              </div>
              <div class="modal-option-card" data-type="size" data-price="9.50" data-label="Triple Scoop">
                <div>Triple Scoop</div>
                <div class="modal-option-price">$9.50</div>
              </div>
            </div>
          </div>

          <!-- Serving / Cone Options -->
          <div>
            <div class="modal-section-title">2. Choose Cup or Fresh Cone</div>
            <div class="modal-options-grid" style="grid-template-columns: repeat(2, 1fr);" id="modalConeGrid">
              <div class="modal-option-card selected" data-type="cone" data-price="0.00" data-label="Compostable Cup">
                <div>Compostable Cup</div>
                <div class="modal-option-price">Free (+$0.00)</div>
              </div>
              <div class="modal-option-card" data-type="cone" data-price="1.50" data-label="Artisan Waffle Cone">
                <div>Artisan Waffle Cone</div>
                <div class="modal-option-price">+$1.50</div>
              </div>
              <div class="modal-option-card" data-type="cone" data-price="2.00" data-label="Choc Dipped Waffle">
                <div>Choc Dipped Waffle</div>
                <div class="modal-option-price">+$2.00</div>
              </div>
              <div class="modal-option-card" data-type="cone" data-price="1.50" data-label="Gluten-Free Waffle">
                <div>Gluten-Free Waffle</div>
                <div class="modal-option-price">+$1.50</div>
              </div>
            </div>
          </div>

          <!-- Optional Toppings -->
          <div>
            <div class="modal-section-title">3. Add Toppings (+$0.75 each)</div>
            <div class="modal-toppings-list">
              <label class="modal-topping-item">
                <span>Warm Belgian Hot Fudge</span>
                <input type="checkbox" class="topping-checkbox" value="0.75" data-name="Hot Fudge">
              </label>
              <label class="modal-topping-item">
                <span>Salted Butter Caramel Drizzle</span>
                <input type="checkbox" class="topping-checkbox" value="0.75" data-name="Caramel Drizzle">
              </label>
              <label class="modal-topping-item">
                <span>Toasted Candied Pecans</span>
                <input type="checkbox" class="topping-checkbox" value="0.75" data-name="Candied Pecans">
              </label>
              <label class="modal-topping-item">
                <span>Rainbow Pearl Sprinkles</span>
                <input type="checkbox" class="topping-checkbox" value="0.75" data-name="Rainbow Sprinkles">
              </label>
            </div>
          </div>
        </div>

        <div class="order-modal-footer">
          <div>
            <small style="color: var(--text-muted); display: block;">Item Total:</small>
            <strong id="customizerLiveTotal" style="font-size: 1.5rem; color: var(--primary);">$4.50</strong>
          </div>
          <button class="btn btn-primary btn-lg" id="btnConfirmCustomizer">
            Add to Order
          </button>
        </div>
      </div>
    </div>

    <!-- Order Confirmation Receipt Dialog -->
    <div class="order-confirm-overlay" id="orderConfirmOverlay">
      <div class="order-receipt-card">
        <div class="receipt-icon-circle">✔</div>
        <h2 style="font-size: 1.85rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--text-main);">
          Order Placed Successfully!
        </h2>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1rem;">
          We have received your ice cream order and our scoop crew is packing it fresh right now.
        </p>

        <div class="receipt-order-num" id="receiptOrderNum">Order #SS-0000</div>

        <div style="background-color: var(--bg-alt); padding: 1rem; border-radius: var(--radius-sm); margin-bottom: 1.25rem; font-size: 0.9rem; text-align: start;">
          <div><strong>📍 Pickup Location:</strong> <span id="receiptLocation">Downtown Flagship</span></div>
          <div><strong>⏱ Estimated Ready Time:</strong> <span id="receiptReadyTime">Ready in 15–20 minutes</span></div>
          <div><strong>👤 Customer:</strong> <span id="receiptCustomer">Guest</span></div>
        </div>

        <div class="receipt-items-box" id="receiptItemsBox">
          <!-- Populated via JS -->
        </div>

        <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 1.2rem; margin-bottom: 1.75rem; color: var(--text-main);">
          <span>Total Paid / Due:</span>
          <span id="receiptTotalAmount" style="color: var(--primary);">$0.00</span>
        </div>

        <button class="btn btn-primary btn-lg" id="btnCloseReceipt" style="width: 100%;">
          Done &amp; Order More Treats
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(container);
}

// 3. Update Cart Badges & Floating Pill
function updateCartUI() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Update Floating Pill
  const pill = document.getElementById('orderFloatingPill');
  const pillCount = document.getElementById('orderPillCount');
  if (pill && pillCount) {
    pillCount.textContent = totalItems;
    if (totalItems > 0) {
      pill.classList.add('visible');
    } else {
      pill.classList.remove('visible');
    }
  }

  // Update Header Badges
  const orderLinks = document.querySelectorAll('.site-header .btn-primary, .nav-menu-wrapper .btn-primary');
  orderLinks.forEach(link => {
    let badge = link.querySelector('.nav-cart-badge');
    if (totalItems > 0) {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'nav-cart-badge';
        link.appendChild(badge);
      }
      badge.textContent = totalItems;
      badge.classList.remove('bump');
      void badge.offsetWidth;
      badge.classList.add('bump');
    } else if (badge) {
      badge.remove();
    }
  });

  renderCartDrawer();
}

// 4. Render Cart Drawer Contents
function renderCartDrawer() {
  const drawerBody = document.getElementById('orderDrawerBody');
  const drawerFooter = document.getElementById('orderDrawerFooter');
  if (!drawerBody || !drawerFooter) return;

  const cart = getCart();

  if (cart.length === 0) {
    drawerBody.innerHTML = `
      <div class="order-empty-state">
        <div class="order-empty-icon">🍨</div>
        <h4 style="font-size: 1.2rem; font-weight: 700; color: var(--text-main);">Your Order is Empty</h4>
        <p class="order-empty-text">
          Choose your favorite scoops, decadent sundaes, or thick milkshakes from our menu!
        </p>
        <button class="btn btn-primary btn-sm" id="btnEmptyBrowseMenu">Browse Menu &amp; Flavors</button>
      </div>
    `;
    drawerFooter.style.display = 'none';

    const btnBrowse = document.getElementById('btnEmptyBrowseMenu');
    if (btnBrowse) {
      btnBrowse.addEventListener('click', () => {
        closeOrderDrawer();
        const isPagesDir = window.location.pathname.includes('/pages/');
        const target = isPagesDir ? 'menu.html' : 'pages/menu.html';
        window.location.href = target;
      });
    }
    return;
  }

  drawerFooter.style.display = 'flex';

  let itemsHtml = '<div class="cart-items-list">';
  let subtotal = 0;

  cart.forEach((item, idx) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    itemsHtml += `
      <div class="cart-item-card">
        <div class="cart-item-header">
          <div>
            <div class="cart-item-name">${item.name}</div>
            ${item.optionsText ? `<div class="cart-item-options">${item.optionsText}</div>` : ''}
          </div>
          <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
        </div>
        <div class="cart-item-controls">
          <div class="qty-control-group">
            <button class="qty-btn" data-action="dec" data-index="${idx}" aria-label="Decrease quantity">−</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn" data-action="inc" data-index="${idx}" aria-label="Increase quantity">+</button>
          </div>
          <button class="cart-item-remove-btn" data-action="remove" data-index="${idx}">
            ✕ Remove
          </button>
        </div>
      </div>
    `;
  });
  itemsHtml += '</div>';

  // Checkout inputs inside drawer body
  const preferencesHtml = `
    <div class="order-preferences-box">
      <div class="order-pref-group">
        <label for="orderPickupLocation">📍 Select Pickup Parlour Location</label>
        <select id="orderPickupLocation" class="form-control" style="padding: 0.65rem 0.85rem; font-size: 0.9rem;">
          <option value="Downtown Flagship (742 Evergreen Terr)">Downtown Flagship (742 Evergreen Terr)</option>
          <option value="Sunset Beach Boardwalk (120 Ocean Prom)">Sunset Beach Boardwalk (120 Ocean Prom)</option>
        </select>
      </div>

      <div class="order-pref-group">
        <label for="orderPickupTime">⏱ Desired Pickup Time</label>
        <select id="orderPickupTime" class="form-control" style="padding: 0.65rem 0.85rem; font-size: 0.9rem;">
          <option value="ASAP (Ready in 15–20 minutes)">ASAP (Ready in 15–20 minutes)</option>
          <option value="In 30–45 minutes">In 30–45 minutes</option>
          <option value="In 1 Hour">In 1 Hour</option>
          <option value="Later Tonight (before 11 PM)">Later Tonight (before 11 PM)</option>
        </select>
      </div>

      <div class="order-pref-group">
        <label for="orderCustomerName">👤 Your Name *</label>
        <input type="text" id="orderCustomerName" class="form-control" placeholder="e.g. Maya Chen" style="padding: 0.65rem 0.85rem; font-size: 0.9rem;" required>
      </div>

      <div class="order-pref-group">
        <label for="orderCustomerPhone">📞 Phone Number (for Ready SMS) *</label>
        <input type="tel" id="orderCustomerPhone" class="form-control" placeholder="e.g. (555) 726-6700" style="padding: 0.65rem 0.85rem; font-size: 0.9rem;" required>
      </div>

      <div class="order-pref-group">
        <label for="orderSpecialNotes">📝 Special Instructions (Optional)</label>
        <input type="text" id="orderSpecialNotes" class="form-control" placeholder="e.g. Extra napkins, pack spoons separately..." style="padding: 0.65rem 0.85rem; font-size: 0.9rem;">
      </div>
    </div>
  `;

  drawerBody.innerHTML = itemsHtml + preferencesHtml;

  // Add click handlers for qty / remove
  drawerBody.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      const action = btn.getAttribute('data-action');
      updateCartQuantity(idx, action === 'inc' ? 1 : -1);
    });
  });

  drawerBody.querySelectorAll('.cart-item-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      removeFromCart(idx);
    });
  });

  // Update Totals
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const subtotalEl = document.getElementById('cartSubtotal');
  const taxEl = document.getElementById('cartTax');
  const totalEl = document.getElementById('cartTotal');
  const btnPlace = document.getElementById('btnPlaceOrder');

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  if (btnPlace) btnPlace.textContent = `Place Pickup Order • $${total.toFixed(2)}`;
}

// 5. Drawer Controls
function openOrderDrawer() {
  const drawer = document.getElementById('orderDrawer');
  const backdrop = document.getElementById('orderDrawerBackdrop');
  if (drawer && backdrop) {
    drawer.classList.add('active');
    backdrop.classList.add('active');
    document.body.classList.add('no-scroll');
  }
}

function closeOrderDrawer() {
  const drawer = document.getElementById('orderDrawer');
  const backdrop = document.getElementById('orderDrawerBackdrop');
  if (drawer && backdrop) {
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
}

function setupDrawerListeners() {
  const closeBtn = document.getElementById('orderCloseBtn');
  const backdrop = document.getElementById('orderDrawerBackdrop');
  const pill = document.getElementById('orderFloatingPill');
  const toastViewBtn = document.getElementById('orderToastViewBtn');

  if (closeBtn) closeBtn.addEventListener('click', closeOrderDrawer);
  if (backdrop) backdrop.addEventListener('click', closeOrderDrawer);
  if (pill) pill.addEventListener('click', openOrderDrawer);
  if (toastViewBtn) {
    toastViewBtn.addEventListener('click', () => {
      hideOrderToast();
      openOrderDrawer();
    });
  }

  // Intercept header "Order Online" clicks to open drawer if cart has items!
  const headerOrderBtns = document.querySelectorAll('.site-header .btn-primary, .nav-menu-wrapper .btn-primary');
  headerOrderBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cart = getCart();
      if (cart.length > 0) {
        e.preventDefault();
        openOrderDrawer();
      }
      // If empty and already on menu.html, smooth scroll to scoops!
      else if (window.location.pathname.includes('menu.html')) {
        const scoopsSec = document.getElementById('category-scoops');
        if (scoopsSec) {
          e.preventDefault();
          scoopsSec.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeOrderDrawer();
      closeCustomizerModal();
      closeOrderReceipt();
    }
  });
}

// 6. Scoop Customizer Modal Logic
let currentCustomizingItem = null;

function setupCustomizerModal() {
  const modal = document.getElementById('customizerModalBackdrop');
  const closeBtn = document.getElementById('customizerCloseBtn');
  const confirmBtn = document.getElementById('btnConfirmCustomizer');

  if (!modal || !closeBtn || !confirmBtn) return;

  closeBtn.addEventListener('click', closeCustomizerModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeCustomizerModal();
  });

  // Size cards click
  const sizeCards = modal.querySelectorAll('#modalSizeGrid .modal-option-card');
  sizeCards.forEach(card => {
    card.addEventListener('click', () => {
      sizeCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      calcCustomizerTotal();
    });
  });

  // Cone cards click
  const coneCards = modal.querySelectorAll('#modalConeGrid .modal-option-card');
  coneCards.forEach(card => {
    card.addEventListener('click', () => {
      coneCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      calcCustomizerTotal();
    });
  });

  // Topping checkboxes click
  const toppingCheckboxes = modal.querySelectorAll('.topping-checkbox');
  toppingCheckboxes.forEach(cb => {
    cb.addEventListener('change', calcCustomizerTotal);
  });

  // Confirm customizer and add to cart
  confirmBtn.addEventListener('click', () => {
    if (!currentCustomizingItem) return;

    const selectedSize = modal.querySelector('#modalSizeGrid .modal-option-card.selected');
    const selectedCone = modal.querySelector('#modalConeGrid .modal-option-card.selected');
    const checkedToppings = modal.querySelectorAll('.topping-checkbox:checked');

    const sizeLabel = selectedSize ? selectedSize.getAttribute('data-label') : 'Single Scoop';
    const coneLabel = selectedCone ? selectedCone.getAttribute('data-label') : 'Cup';
    const toppingNames = Array.from(checkedToppings).map(cb => cb.getAttribute('data-name'));

    let optionsArray = [sizeLabel, coneLabel];
    if (toppingNames.length > 0) {
      optionsArray.push(toppingNames.join(', '));
    }

    const calculatedPrice = calcCustomizerTotal();

    addToCart({
      name: currentCustomizingItem.name,
      category: 'scoop',
      price: calculatedPrice,
      quantity: 1,
      optionsText: optionsArray.join(' • ')
    });

    closeCustomizerModal();
  });
}

function calcCustomizerTotal() {
  const modal = document.getElementById('customizerModalBackdrop');
  if (!modal) return 4.50;

  const selectedSize = modal.querySelector('#modalSizeGrid .modal-option-card.selected');
  const selectedCone = modal.querySelector('#modalConeGrid .modal-option-card.selected');
  const checkedToppings = modal.querySelectorAll('.topping-checkbox:checked');

  const sizePrice = selectedSize ? parseFloat(selectedSize.getAttribute('data-price')) : 4.50;
  const conePrice = selectedCone ? parseFloat(selectedCone.getAttribute('data-price')) : 0.00;
  const toppingsPrice = checkedToppings.length * 0.75;

  const total = sizePrice + conePrice + toppingsPrice;
  const liveTotalEl = document.getElementById('customizerLiveTotal');
  if (liveTotalEl) {
    liveTotalEl.textContent = `$${total.toFixed(2)}`;
  }

  return total;
}

function openCustomizerModal(item) {
  currentCustomizingItem = item;
  const modal = document.getElementById('customizerModalBackdrop');
  const nameEl = document.getElementById('customizerItemName');

  if (!modal || !nameEl) return;

  nameEl.textContent = item.name;

  // Reset defaults (Single Scoop, Cup, no toppings)
  const sizeCards = modal.querySelectorAll('#modalSizeGrid .modal-option-card');
  sizeCards.forEach((c, idx) => c.classList.toggle('selected', idx === 0));

  const coneCards = modal.querySelectorAll('#modalConeGrid .modal-option-card');
  coneCards.forEach((c, idx) => c.classList.toggle('selected', idx === 0));

  modal.querySelectorAll('.topping-checkbox').forEach(cb => {
    cb.checked = false;
  });

  calcCustomizerTotal();
  modal.classList.add('active');
  document.body.classList.add('no-scroll');
}

function closeCustomizerModal() {
  const modal = document.getElementById('customizerModalBackdrop');
  if (modal) {
    modal.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
}

// 7. Wire Up All Order Buttons Across All Pages
function setupOrderButtons() {
  document.querySelectorAll('.btn-order-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-id') || 'item';
      const name = btn.getAttribute('data-name') || 'Artisan Treat';
      const price = parseFloat(btn.getAttribute('data-price') || 4.50);
      const category = btn.getAttribute('data-category') || 'icecream';

      if (category === 'scoop') {
        openCustomizerModal({ id, name, price });
      } else {
        addToCart({
          id,
          name,
          category,
          price,
          quantity: 1,
          optionsText: ''
        });
      }
    });
  });
}

// 8. Toast Feedback Popup
let toastTimer = null;
function showOrderToast(msg) {
  const toast = document.getElementById('orderToast');
  const msgEl = document.getElementById('orderToastMsg');
  if (!toast || !msgEl) return;

  msgEl.textContent = msg;
  toast.classList.add('active');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    hideOrderToast();
  }, 4000);
}

function hideOrderToast() {
  const toast = document.getElementById('orderToast');
  if (toast) toast.classList.remove('active');
}

// 9. Order Checkout Submission & Confirmation Screen
function setupOrderCheckout() {
  const btnPlace = document.getElementById('btnPlaceOrder');
  const receiptOverlay = document.getElementById('orderConfirmOverlay');
  const btnCloseReceipt = document.getElementById('btnCloseReceipt');

  if (!btnPlace) return;

  btnPlace.addEventListener('click', () => {
    const cart = getCart();
    if (cart.length === 0) return;

    const nameInput = document.getElementById('orderCustomerName');
    const phoneInput = document.getElementById('orderCustomerPhone');
    const locationInput = document.getElementById('orderPickupLocation');
    const timeInput = document.getElementById('orderPickupTime');

    if (!nameInput || !nameInput.value.trim() || nameInput.value.trim().length < 2) {
      alert('Please enter your full name for the order.');
      if (nameInput) nameInput.focus();
      return;
    }

    if (!phoneInput || !phoneInput.value.trim() || phoneInput.value.trim().length < 7) {
      alert('Please enter a valid contact phone number.');
      if (phoneInput) phoneInput.focus();
      return;
    }

    const orderNum = '#SS-' + Math.floor(1000 + Math.random() * 9000);
    const customer = nameInput.value.trim();
    const location = locationInput ? locationInput.value : 'Downtown Flagship';
    const readyTime = timeInput ? timeInput.value : 'Ready in 15–20 minutes';

    let subtotal = 0;
    let itemsReceiptHtml = '';

    cart.forEach(item => {
      const itemTot = item.price * item.quantity;
      subtotal += itemTot;
      itemsReceiptHtml += `
        <div class="receipt-item-line">
          <div>
            <strong>${item.quantity}x ${item.name}</strong>
            ${item.optionsText ? `<div style="font-size: 0.75rem; color: var(--text-muted);">${item.optionsText}</div>` : ''}
          </div>
          <div>$${itemTot.toFixed(2)}</div>
        </div>
      `;
    });

    const tax = subtotal * 0.08;
    const finalTotal = subtotal + tax;

    // Fill Receipt Modal
    const numEl = document.getElementById('receiptOrderNum');
    const locEl = document.getElementById('receiptLocation');
    const timeEl = document.getElementById('receiptReadyTime');
    const custEl = document.getElementById('receiptCustomer');
    const boxEl = document.getElementById('receiptItemsBox');
    const totEl = document.getElementById('receiptTotalAmount');

    if (numEl) numEl.textContent = `Order ${orderNum}`;
    if (locEl) locEl.textContent = location;
    if (timeEl) timeEl.textContent = readyTime;
    if (custEl) custEl.textContent = customer;
    if (boxEl) boxEl.innerHTML = itemsReceiptHtml;
    if (totEl) totEl.textContent = `$${finalTotal.toFixed(2)}`;

    // Clear cart
    saveCart([]);
    closeOrderDrawer();

    // Show Confirmation Screen
    if (receiptOverlay) {
      receiptOverlay.classList.add('active');
      document.body.classList.add('no-scroll');
    }
  });

  if (btnCloseReceipt && receiptOverlay) {
    btnCloseReceipt.addEventListener('click', closeOrderReceipt);
    receiptOverlay.addEventListener('click', (e) => {
      if (e.target === receiptOverlay) closeOrderReceipt();
    });
  }
}

function closeOrderReceipt() {
  const receiptOverlay = document.getElementById('orderConfirmOverlay');
  if (receiptOverlay) {
    receiptOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
}

/* ==========================================================================
   11. Sticky Header Ambient Shadow on Scroll
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
      header.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)';
    } else {
      header.classList.remove('scrolled');
      header.style.boxShadow = '';
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   12. Smooth 60fps Scroll Reveal Animation System
   Uses IntersectionObserver for GPU-accelerated reveals and progressive enhancement.
   ========================================================================== */
function initScrollAnimations() {
  // Mark document as animation-ready so initial hidden styles only apply when JS is active
  document.documentElement.classList.add('js-animations');

  // Select all component elements across all pages
  const targets = document.querySelectorAll(
    '.section-header, .feature-card, .process-card, .flight-card, ' +
    '.pricing-package-card, .offer-deal-card, .sundae-showcase-item, ' +
    '.loyalty-tier-card, .testimonial-card, .gallery-item, .contact-card, ' +
    '.accordion-item, .cta-banner, .party-calc-card, .sourcing-row, ' +
    '.amenity-card, .calendar-table-wrap, .menu-filterable-item'
  );

  if (!targets.length) return;

  // Stagger helper: attach stagger class to common card grids
  const parentGrids = document.querySelectorAll(
    '.grid, .process-grid, .weekly-offers-grid, ' +
    '.sundae-showcase-grid, .loyalty-tiers-grid, .reviews-grid, ' +
    '.gallery-grid, .contact-locations-grid, .party-calc-grid, ' +
    '.experience-highlights-grid, .tasting-flights-grid'
  );

  parentGrids.forEach(grid => {
    grid.classList.add('reveal-stagger');
  });

  // Fallback for environments without IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  });

  const windowHeight = window.innerHeight || document.documentElement.clientHeight;

  targets.forEach(el => {
    el.classList.add('reveal-on-scroll');
    const rect = el.getBoundingClientRect();
    // If element is already in or above the visible viewport on load, reveal immediately
    if (rect.top <= windowHeight - 40) {
      el.classList.add('is-visible');
    } else {
      observer.observe(el);
    }
  });
}

