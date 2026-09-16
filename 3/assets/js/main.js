(() => {
  'use strict';

  const root = document.body.dataset.root || '.';
  const page = document.body.dataset.page || '';
  const html = document.documentElement;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const getTheme = () => {
    const saved = localStorage.getItem('rosewood-theme');
    if (saved) return saved;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const setTheme = (theme) => {
    html.dataset.theme = theme;
    localStorage.setItem('rosewood-theme', theme);
    $$('[data-theme-toggle]').forEach((toggle) => {
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Use light theme' : 'Use dark theme');
      toggle.innerHTML = `<i data-lucide="${theme === 'dark' ? 'sun' : 'moon'}" aria-hidden="true"></i>`;
    });
    refreshIcons();
  };

  const setDirection = (direction) => {
    html.dir = direction;
    localStorage.setItem('rosewood-direction', direction);
    $$('[data-rtl-toggle]').forEach((toggle) => {
      toggle.setAttribute('aria-label', direction === 'rtl' ? 'Switch to left-to-right layout' : 'Switch to right-to-left layout');
      toggle.setAttribute('aria-pressed', String(direction === 'rtl'));
      $$('[data-dir]', toggle).forEach((opt) => {
        opt.classList.toggle('is-active', opt.dataset.dir === direction);
      });
    });
  };

  html.dataset.theme = getTheme();
  html.dir = localStorage.getItem('rosewood-direction') || 'ltr';

  const primaryLinksBefore = [
    ['about', 'About Us', `${root}/pages/about.html`],
    ['products', 'Shop', `${root}/pages/products.html`],
    ['delivery', 'Same Day Delivery', `${root}/pages/same-day-delivery.html`],
    ['custom', 'Custom Arrangement', `${root}/pages/custom-arrangement.html`]
  ];
  const primaryLinksAfter = [
    ['contact', 'Contact', `${root}/pages/contact.html`]
  ];

  const pagesList = [
    { id: 'bulk', title: 'Bulk Orders', url: `${root}/pages/bulk-orders.html` },
    { id: 'coming', title: 'Coming Soon', url: `${root}/pages/coming-soon.html` },
    { id: '404', title: '404', url: `${root}/pages/404.html` },
    { id: 'privacy', title: 'Privacy Policy', url: `${root}/pages/privacy.html` },
    { id: 'terms', title: 'Terms of Service', url: `${root}/pages/terms.html` }
  ];

  const isHomeActive = page === 'home' || page === 'home2';
  const isPagesActive = pagesList.some((item) => item.id === page);

  const desktopHomeDropdown = `
    <div class="nav-dropdown" data-nav-dropdown>
      <button class="nav-dropdown-btn${isHomeActive ? ' is-active' : ''}" type="button" aria-expanded="false" aria-haspopup="true">
        <span>Home</span>
        <i data-lucide="chevron-down" class="dropdown-chevron" aria-hidden="true"></i>
      </button>
      <div class="nav-dropdown-menu" role="menu">
        <a class="nav-dropdown-item${page === 'home' ? ' is-current' : ''}" href="${root}/index.html" role="menuitem">
          <span class="nav-dropdown-item-title">Home 1</span>
        </a>
        <a class="nav-dropdown-item${page === 'home2' ? ' is-current' : ''}" href="${root}/index1.html" role="menuitem">
          <span class="nav-dropdown-item-title">Home 2</span>
        </a>
      </div>
    </div>
  `;

  const desktopPagesDropdown = `
    <div class="nav-dropdown" data-nav-dropdown>
      <button class="nav-dropdown-btn${isPagesActive ? ' is-active' : ''}" type="button" aria-expanded="false" aria-haspopup="true">
        <span>Pages</span>
        <i data-lucide="chevron-down" class="dropdown-chevron" aria-hidden="true"></i>
      </button>
      <div class="nav-dropdown-menu nav-dropdown-mega" role="menu">
        <div class="dropdown-grid">
          ${pagesList.map((item) => `
            <a class="nav-dropdown-item${page === item.id ? ' is-current' : ''}" href="${item.url}" role="menuitem">
              <span class="nav-dropdown-item-title">${item.title}</span>
            </a>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  const desktopNavHtml = [
    desktopHomeDropdown,
    ...primaryLinksBefore.map(([id, label, url]) => `<a href="${url}"${page === id ? ' aria-current="page"' : ''}>${label}</a>`),
    desktopPagesDropdown,
    ...primaryLinksAfter.map(([id, label, url]) => `<a href="${url}"${page === id ? ' aria-current="page"' : ''}>${label}</a>`)
  ].join('');

  const mobileHomeDropdown = `
    <div class="mobile-dropdown${isHomeActive ? ' is-open' : ''}" data-mobile-dropdown>
      <button class="mobile-dropdown-btn" type="button" aria-expanded="${isHomeActive ? 'true' : 'false'}">
        <span>Home</span>
        <i data-lucide="chevron-down" class="dropdown-chevron" aria-hidden="true"></i>
      </button>
      <div class="mobile-dropdown-menu">
        <a class="mobile-dropdown-item${page === 'home' ? ' is-current' : ''}" href="${root}/index.html">Home 1</a>
        <a class="mobile-dropdown-item${page === 'home2' ? ' is-current' : ''}" href="${root}/index1.html">Home 2</a>
      </div>
    </div>
  `;

  const mobilePagesDropdown = `
    <div class="mobile-dropdown${isPagesActive ? ' is-open' : ''}" data-mobile-dropdown>
      <button class="mobile-dropdown-btn" type="button" aria-expanded="${isPagesActive ? 'true' : 'false'}">
        <span>Pages</span>
        <i data-lucide="chevron-down" class="dropdown-chevron" aria-hidden="true"></i>
      </button>
      <div class="mobile-dropdown-menu">
        ${pagesList.map((item) => `
          <a class="mobile-dropdown-item${page === item.id ? ' is-current' : ''}" href="${item.url}">${item.title}</a>
        `).join('')}
      </div>
    </div>
  `;

  const mobileNavHtml = [
    mobileHomeDropdown,
    ...primaryLinksBefore.map(([id, label, url]) => `<a href="${url}"${page === id ? ' aria-current="page"' : ''}>${label}</a>`),
    mobilePagesDropdown,
    ...primaryLinksAfter.map(([id, label, url]) => `<a href="${url}"${page === id ? ' aria-current="page"' : ''}>${label}</a>`)
  ].join('');

  const headerTarget = $('[data-site-header]');
  if (headerTarget) {
    headerTarget.innerHTML = `
      <a class="skip-link" href="#main">Skip to main content</a>
      <div class="announcement" aria-label="Store announcement">
        <div class="announcement-track" aria-hidden="true">
          <span>Same-day delivery · 2 PM Mon–Sat / noon Sun <i></i> Bengaluru hand-delivery <i></i> Every bouquet made to order <i></i></span>
          <span>Same-day delivery · 2 PM Mon–Sat / noon Sun <i></i> Bengaluru hand-delivery <i></i> Every bouquet made to order <i></i></span>
        </div>
      </div>
      <div class="mobile-menu-backdrop" data-menu-backdrop></div>
      <header class="site-header" data-header>
        <div class="container nav-shell">
          <a class="brand" href="${root}/index.html" aria-label="Rosewood Florals home"><strong>Rosewood</strong><small>Florals</small></a>
          <nav class="desktop-nav" aria-label="Primary navigation">${desktopNavHtml}</nav>
          <div class="nav-actions">
            <button class="dir-toggle" type="button" data-rtl-toggle aria-label="Switch text direction">
              <span class="dir-opt ${html.dir === 'ltr' ? 'is-active' : ''}" data-dir="ltr">LTR</span>
              <span class="dir-opt ${html.dir === 'rtl' ? 'is-active' : ''}" data-dir="rtl">RTL</span>
            </button>
            <button class="icon-btn theme-btn" type="button" data-theme-toggle aria-label="Switch theme"><i data-lucide="moon" aria-hidden="true"></i></button>
            <a class="btn btn-header-signin hide-mobile" href="${root}/pages/signin.html">Sign In</a>
            <button class="icon-btn cart-btn" type="button" data-cart-button aria-label="Shopping bag, 0 items"><i data-lucide="shopping-bag" aria-hidden="true"></i><span class="cart-count" data-cart-count>0</span></button>
            <button class="icon-btn menu-toggle" type="button" data-menu-toggle aria-label="Open menu" aria-expanded="false"><i data-lucide="menu" aria-hidden="true"></i></button>
          </div>
        </div>
        <nav class="mobile-menu" data-mobile-menu aria-label="Mobile navigation">
          <div class="mobile-menu-inner">
            <div class="mobile-menu-links">
              ${mobileNavHtml}
            </div>
            <div class="mobile-menu-footer">
              <div class="mobile-menu-preferences"><span>Layout direction</span><button class="dir-toggle" type="button" data-rtl-toggle aria-label="Switch text direction"><span class="dir-opt" data-dir="ltr">LTR</span><span class="dir-opt" data-dir="rtl">RTL</span></button></div>
              <div class="mobile-menu-auth">
                <a class="btn btn-primary btn-block" href="${root}/pages/signin.html">Sign In</a>
                <a class="btn btn-ghost btn-block" href="${root}/pages/signup.html">Sign Up</a>
              </div>
            </div>
          </div>
        </nav>
      </header>`;
  }

  const footerTarget = $('[data-site-footer]');
  if (footerTarget) {
    footerTarget.innerHTML = `
      <footer class="site-footer">
        <div class="container footer-grid">
          <div class="footer-brand">
            <a class="brand" href="${root}/index.html"><strong>Rosewood</strong><small>Florals</small></a>
            <p>Season-led flowers, composed by hand and delivered with care across Bengaluru.</p>
            <div class="cluster"><a class="icon-btn" href="${root}/pages/coming-soon.html" aria-label="Instagram"><i data-lucide="instagram"></i></a><a class="icon-btn" href="${root}/pages/coming-soon.html" aria-label="Pinterest"><i data-lucide="image"></i></a></div>
          </div>
          <div class="footer-col">
            <h3>Home & Shop</h3>
            <a href="${root}/index.html">Home 1</a>
            <a href="${root}/index1.html">Home 2</a>
            <a href="${root}/pages/products.html">Shop</a>
            <a href="${root}/pages/same-day-delivery.html">Same Day Delivery</a>
            <a href="${root}/pages/custom-arrangement.html">Custom Arrangement</a>
          </div>
          <div class="footer-col">
            <h3>Company & Services</h3>
            <a href="${root}/pages/about.html">About Us</a>
            <a href="${root}/pages/bulk-orders.html">Bulk Orders</a>
            <a href="${root}/pages/contact.html">Contact</a>
          </div>
          <div class="footer-col">
            <h3>Account & Legal</h3>
            <a href="${root}/pages/signin.html">Sign In</a>
            <a href="${root}/pages/signup.html">Sign Up</a>
            <a href="${root}/pages/privacy.html">Privacy Policy</a>
            <a href="${root}/pages/terms.html">Terms of Service</a>
            <a href="${root}/pages/coming-soon.html">Coming Soon</a>
            <a href="${root}/pages/404.html">404</a>
          </div>
        </div>
        <div class="container footer-bottom"><span>© <span data-year></span> Rosewood Florals. Demo storefront.</span><span>Made slowly. Delivered thoughtfully.</span></div>
      </footer>`;
  }

  const refreshIcons = () => window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
  addEventListener('load', refreshIcons);
  setTimeout(refreshIcons, 150);
  setTheme(html.dataset.theme);
  setDirection(html.dir);
  $$('[data-year]').forEach((el) => el.textContent = new Date().getFullYear());

  $$('[data-theme-toggle]').forEach((btn) => btn.addEventListener('click', () => setTheme(html.dataset.theme === 'dark' ? 'light' : 'dark')));
  $$('[data-rtl-toggle]').forEach((btn) => btn.addEventListener('click', (e) => {
    const opt = e.target.closest('[data-dir]');
    if (opt && opt.dataset.dir) {
      setDirection(opt.dataset.dir);
    } else {
      setDirection(html.dir === 'rtl' ? 'ltr' : 'rtl');
    }
  }));

  // Dropdowns interaction
  $$('[data-mobile-dropdown]').forEach((dropdown) => {
    const btn = dropdown.querySelector('.mobile-dropdown-btn');
    btn?.addEventListener('click', () => {
      const open = dropdown.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  $$('[data-nav-dropdown]').forEach((dropdown) => {
    const btn = dropdown.querySelector('.nav-dropdown-btn');
    btn?.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = dropdown.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-nav-dropdown]')) {
      $$('[data-nav-dropdown]').forEach((d) => {
        d.classList.remove('is-open');
        d.querySelector('.nav-dropdown-btn')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  const menuButton = $('[data-menu-toggle]');
  const mobileMenu = $('[data-mobile-menu]');
  const menuBackdrop = $('[data-menu-backdrop]');

  const closeMenu = () => {
    mobileMenu?.classList.remove('is-open');
    menuBackdrop?.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open menu');
    if (menuButton) menuButton.innerHTML = `<i data-lucide="menu"></i>`;
    refreshIcons();
  };

  const openMenu = () => {
    mobileMenu?.classList.add('is-open');
    menuBackdrop?.classList.add('is-open');
    menuButton?.setAttribute('aria-expanded', 'true');
    menuButton?.setAttribute('aria-label', 'Close menu');
    if (menuButton) menuButton.innerHTML = `<i data-lucide="x"></i>`;
    refreshIcons();
  };

  menuButton?.addEventListener('click', () => {
    if (mobileMenu?.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menuBackdrop?.addEventListener('click', closeMenu);
  matchMedia('(min-width: 1200px)').addEventListener('change', (event) => { if (event.matches) closeMenu(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && mobileMenu?.classList.contains('is-open')) { closeMenu(); menuButton?.focus(); } });

  if (mobileMenu) {
    $$('a', mobileMenu).forEach((link) => link.addEventListener('click', closeMenu));
  }

  const header = $('[data-header]');
  const onScroll = () => header?.classList.toggle('is-scrolled', scrollY > 16);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px -30px' }) : null;
  $$('[data-reveal]').forEach((el) => revealObserver ? revealObserver.observe(el) : el.classList.add('is-revealed'));

  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const parallaxItems = $$('[data-parallax]');
    let ticking = false;
    addEventListener('scroll', () => {
      if (!ticking) requestAnimationFrame(() => {
        parallaxItems.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.bottom > 0 && rect.top < innerHeight) el.style.transform = `translate3d(0, ${rect.top * -.035}px, 0)`;
        });
        ticking = false;
      });
      ticking = true;
    }, { passive: true });
  }

  // ==========================================
  // Scroll Lock & Focus Trap Helpers
  // ==========================================
  let scrollLockCount = 0;
  let savedScrollY = 0;

  const lockScroll = () => {
    scrollLockCount++;
    if (scrollLockCount === 1) {
      savedScrollY = window.scrollY;
      document.body.style.setProperty('--scroll-y', `-${savedScrollY}px`);
      document.body.classList.add('scroll-locked');
    }
  };

  const unlockScroll = () => {
    scrollLockCount = Math.max(0, scrollLockCount - 1);
    if (scrollLockCount === 0) {
      document.body.classList.remove('scroll-locked');
      document.body.style.removeProperty('--scroll-y');
      window.scrollTo(0, savedScrollY);
    }
  };

  const trapFocus = (container) => {
    const focusable = container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const handler = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    container.addEventListener('keydown', handler);
    container._focusTrapHandler = handler;
  };

  const releaseFocusTrap = (container) => {
    if (container._focusTrapHandler) {
      container.removeEventListener('keydown', container._focusTrapHandler);
      delete container._focusTrapHandler;
    }
  };

  // ==========================================
  // Shopping Cart & Checkout System
  // ==========================================
  const CATALOG = {
    'Afterglow': {
      id: 'afterglow',
      name: 'Afterglow',
      price: 2450,
      stems: 'Rose · Ranunculus · Stock',
      imageFile: 'product-afterglow.webp'
    },
    'Peach Theory': {
      id: 'peach-theory',
      name: 'Peach Theory',
      price: 2850,
      stems: 'Tulip · Rose · Sweet pea',
      imageFile: 'product-peach-theory.webp'
    },
    'Meadow Light': {
      id: 'meadow-light',
      name: 'Meadow Light',
      price: 2150,
      stems: 'Daffodil · Chamomile · Fern',
      imageFile: 'product-meadow-light.webp'
    },
    'Quiet Vow': {
      id: 'quiet-vow',
      name: 'Quiet Vow',
      price: 4200,
      stems: 'Ivory orchids · Calla lilies',
      imageFile: 'product-quiet-vow.webp'
    },
    'Still Garden': {
      id: 'still-garden',
      name: 'Still Garden',
      price: 3100,
      stems: 'White lilies · Cream roses · Eucalyptus',
      imageFile: 'product-still-garden.webp'
    },
    'Good News': {
      id: 'good-news',
      name: 'Good News',
      price: 2650,
      stems: 'Coral gerberas · Orange ranunculus',
      imageFile: 'product-good-news.webp'
    }
  };

  const CATALOG_BY_ID = Object.values(CATALOG).reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});

  const getProductImageSrc = (item) => {
    let filename = item.imageFile;
    if (!filename && item.id && CATALOG_BY_ID[item.id]) {
      filename = CATALOG_BY_ID[item.id].imageFile;
    }
    if (!filename && item.name && CATALOG[item.name]) {
      filename = CATALOG[item.name].imageFile;
    }
    if (!filename && item.image) {
      filename = item.image.split('/').pop().replace(/\?.*$/, '');
    }
    if (!filename || !filename.includes('.')) {
      filename = 'product-afterglow.webp';
    }
    return `${root}/assets/images/${filename}`;
  };

  const getStoredCart = () => {
    try {
      const stored = localStorage.getItem('rosewood-cart-items');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => ({
            ...item,
            imageFile: item.imageFile || (item.id && CATALOG_BY_ID[item.id] ? CATALOG_BY_ID[item.id].imageFile : (item.name && CATALOG[item.name] ? CATALOG[item.name].imageFile : 'product-afterglow.webp'))
          }));
        }
      }
    } catch (e) {
      console.warn('Cart parse fallback', e);
    }
    const legacy = Number(localStorage.getItem('rosewood-cart') || 0);
    if (legacy > 0) {
      return [{
        id: 'afterglow',
        name: 'Afterglow',
        price: 2450,
        stems: 'Rose · Ranunculus · Stock',
        imageFile: 'product-afterglow.webp',
        quantity: legacy
      }];
    }
    return [];
  };

  let cart = getStoredCart();

  // Create Cart Overlay & Drawer
  const cartOverlay = document.createElement('div');
  cartOverlay.className = 'cart-overlay';
  cartOverlay.setAttribute('data-cart-overlay', '');
  cartOverlay.setAttribute('aria-hidden', 'true');

  const cartDrawer = document.createElement('aside');
  cartDrawer.className = 'cart-drawer';
  cartDrawer.setAttribute('data-cart-drawer', '');
  cartDrawer.setAttribute('role', 'dialog');
  cartDrawer.setAttribute('aria-modal', 'true');
  cartDrawer.setAttribute('aria-label', 'Shopping Bag');
  cartDrawer.tabIndex = -1;

  cartDrawer.innerHTML = `
    <div class="cart-header">
      <div class="cart-title-row">
        <div class="cart-title-wrap">
          <h2>Shopping Bag</h2>
          <span class="cart-badge-count" data-cart-badge-count>0 items</span>
        </div>
        <button class="icon-btn cart-close-btn" type="button" data-cart-close aria-label="Close shopping bag">
          <i data-lucide="x" aria-hidden="true"></i>
        </button>
      </div>
      <div class="delivery-progress" data-delivery-progress>
        <div class="delivery-progress-text">
          <i data-lucide="truck" aria-hidden="true"></i>
          <span data-progress-message>Add ₹3,000 for <strong>Free Bengaluru Delivery</strong></span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" data-progress-fill style="width: 0%"></div>
        </div>
      </div>
    </div>
    <div class="cart-body" data-cart-body></div>
    <div class="cart-footer" data-cart-footer>
      <div class="cart-notes">
        <details class="cart-note-details">
          <summary><i data-lucide="pen-line" aria-hidden="true"></i> Add a handwritten gift card note</summary>
          <textarea class="cart-note-input" placeholder="Write your heartfelt message here (complimentary wax-sealed card)..." maxlength="200" data-cart-note></textarea>
        </details>
      </div>
      <div class="cart-summary">
        <div class="summary-row">
          <span>Bouquets Subtotal</span>
          <span data-cart-subtotal>₹0</span>
        </div>
        <div class="summary-row">
          <span>Bengaluru Hand-Delivery</span>
          <span data-cart-delivery>₹150</span>
        </div>
        <div class="summary-row total-row">
          <strong>Total</strong>
          <strong data-cart-total>₹0</strong>
        </div>
      </div>
      <div class="cart-actions">
        <button class="btn btn-primary btn-block" type="button" data-checkout-open>
          Proceed to Checkout <i data-lucide="arrow-right" aria-hidden="true"></i>
        </button>
        <button class="btn-clear-cart" type="button" data-clear-cart>
          Clear shopping bag
        </button>
      </div>
    </div>
  `;

  // Create Checkout Modal
  const checkoutOverlay = document.createElement('div');
  checkoutOverlay.className = 'checkout-overlay';
  checkoutOverlay.setAttribute('data-checkout-overlay', '');
  checkoutOverlay.setAttribute('aria-hidden', 'true');

  const checkoutModal = document.createElement('div');
  checkoutModal.className = 'checkout-modal';
  checkoutModal.setAttribute('data-checkout-modal', '');
  checkoutModal.setAttribute('role', 'dialog');
  checkoutModal.setAttribute('aria-modal', 'true');
  checkoutModal.setAttribute('aria-label', 'Checkout');
  checkoutModal.tabIndex = -1;

  document.body.append(cartOverlay, cartDrawer, checkoutOverlay, checkoutModal);

  const cartButton = $('[data-cart-button]');
  const cartCount = $('[data-cart-count]');
  const cartBody = $('[data-cart-body]', cartDrawer);
  const cartFooter = $('[data-cart-footer]', cartDrawer);
  const cartBadgeCount = $('[data-cart-badge-count]', cartDrawer);
  const progressFill = $('[data-progress-fill]', cartDrawer);
  const progressMessage = $('[data-progress-message]', cartDrawer);
  const subtotalEl = $('[data-cart-subtotal]', cartDrawer);
  const deliveryEl = $('[data-cart-delivery]', cartDrawer);
  const totalEl = $('[data-cart-total]', cartDrawer);
  const giftNoteInput = $('[data-cart-note]', cartDrawer);

  const savedGiftNote = localStorage.getItem('rosewood-gift-note') || '';
  if (giftNoteInput && savedGiftNote) giftNoteInput.value = savedGiftNote;
  giftNoteInput?.addEventListener('input', (e) => {
    localStorage.setItem('rosewood-gift-note', e.target.value);
  });

  const FREE_DELIVERY_THRESHOLD = 3000;
  const STANDARD_DELIVERY_FEE = 150;

  const openCart = () => {
    cartDrawer.classList.add('is-open');
    cartOverlay.classList.add('is-visible');
    cartOverlay.setAttribute('aria-hidden', 'false');
    lockScroll();
    cartDrawer.focus();
    renderCart();
    trapFocus(cartDrawer);
  };

  const closeCart = () => {
    cartDrawer.classList.remove('is-open');
    cartOverlay.classList.remove('is-visible');
    cartOverlay.setAttribute('aria-hidden', 'true');
    releaseFocusTrap(cartDrawer);
    unlockScroll();
  };

  const openCheckout = () => {
    if (cart.length === 0) return;
    closeCart();
    renderCheckoutForm();
    checkoutModal.classList.add('is-open');
    checkoutOverlay.classList.add('is-visible');
    checkoutOverlay.setAttribute('aria-hidden', 'false');
    lockScroll();
    checkoutModal.focus();
    trapFocus(checkoutModal);
  };

  const closeCheckout = () => {
    checkoutModal.classList.remove('is-open');
    checkoutOverlay.classList.remove('is-visible');
    checkoutOverlay.setAttribute('aria-hidden', 'true');
    releaseFocusTrap(checkoutModal);
    unlockScroll();
  };

  const saveCart = () => {
    localStorage.setItem('rosewood-cart-items', JSON.stringify(cart));
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    localStorage.setItem('rosewood-cart', totalItems);
    updateCartBadge();
    renderCart();
  };

  const updateCartBadge = () => {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    if (cartCount) {
      cartCount.textContent = totalItems;
      if (totalItems === 0) {
        cartCount.setAttribute('data-empty', '');
      } else {
        cartCount.removeAttribute('data-empty');
      }
    }
    cartButton?.setAttribute('aria-label', `Shopping bag, ${totalItems} ${totalItems === 1 ? 'item' : 'items'}`);
    if (totalItems > 0) {
      cartCount?.classList.remove('bump');
      void cartCount?.offsetWidth; // Trigger reflow
      cartCount?.classList.add('bump');
    }
  };

  const renderCart = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0;
    const deliveryFee = isFreeDelivery ? 0 : STANDARD_DELIVERY_FEE;
    const grandTotal = subtotal + deliveryFee;

    if (cartBadgeCount) {
      cartBadgeCount.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;
    }

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    if (deliveryEl) deliveryEl.textContent = isFreeDelivery ? (subtotal === 0 ? '₹0' : 'FREE') : `₹${deliveryFee}`;
    if (totalEl) totalEl.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;

    // Delivery progress
    if (progressFill && progressMessage) {
      if (subtotal === 0) {
        progressFill.style.width = '0%';
        progressFill.classList.remove('is-qualified');
        progressMessage.innerHTML = `Add ₹${FREE_DELIVERY_THRESHOLD.toLocaleString('en-IN')} for <strong>Free Bengaluru Delivery</strong>`;
      } else if (subtotal >= FREE_DELIVERY_THRESHOLD) {
        progressFill.style.width = '100%';
        progressFill.classList.add('is-qualified');
        progressMessage.innerHTML = `🎉 You've unlocked <strong>Free Bengaluru Delivery!</strong>`;
      } else {
        const remaining = FREE_DELIVERY_THRESHOLD - subtotal;
        const pct = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100));
        progressFill.style.width = `${pct}%`;
        progressFill.classList.remove('is-qualified');
        progressMessage.innerHTML = `Add <strong>₹${remaining.toLocaleString('en-IN')}</strong> more for <strong>Free Delivery</strong>`;
      }
    }

    if (cart.length === 0) {
      cartBody.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">
            <i data-lucide="flower" aria-hidden="true"></i>
          </div>
          <h3 class="cart-empty-title">Your bag is empty</h3>
          <p class="cart-empty-desc">Discover our season-led bouquets hand-tied fresh in our Bengaluru studio.</p>
          <a class="btn btn-primary" href="${root}/pages/products.html" data-explore-btn>Explore bouquets <i data-lucide="arrow-right" aria-hidden="true"></i></a>
        </div>
      `;
      if (cartFooter) cartFooter.style.display = 'none';
      $('[data-explore-btn]', cartBody)?.addEventListener('click', closeCart);
    } else {
      if (cartFooter) cartFooter.style.display = 'grid';
      cartBody.innerHTML = `
        <div class="cart-items-list">
          ${cart.map((item) => `
            <article class="cart-item" data-item-id="${item.id}">
              <div class="cart-item-thumb">
                <img src="${getProductImageSrc(item)}" alt="${item.name}" width="78" height="82" loading="lazy" onerror="this.onerror=null;this.src='${root}/assets/images/product-afterglow.webp';">
              </div>
              <div class="cart-item-info">
                <div class="cart-item-header">
                  <div>
                    <h3 class="cart-item-title">${item.name}</h3>
                    <p class="cart-item-stems">${item.stems || 'Hand-tied fresh bouquet'}</p>
                  </div>
                  <button class="cart-item-remove" type="button" data-remove-item="${item.id}" aria-label="Remove ${item.name}">
                    <i data-lucide="trash-2" aria-hidden="true"></i>
                  </button>
                </div>
                <div class="cart-item-bottom">
                  <div class="qty-stepper">
                    <button class="qty-btn" type="button" data-qty-change="-1" data-id="${item.id}" aria-label="Decrease quantity of ${item.name}">
                      <i data-lucide="minus" aria-hidden="true"></i>
                    </button>
                    <span class="qty-val" aria-live="polite">${item.quantity}</span>
                    <button class="qty-btn" type="button" data-qty-change="1" data-id="${item.id}" aria-label="Increase quantity of ${item.name}">
                      <i data-lucide="plus" aria-hidden="true"></i>
                    </button>
                  </div>
                  <span class="cart-item-price">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      `;
    }

    refreshIcons();
  };

  const renderCheckoutForm = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
    const deliveryFee = isFreeDelivery ? 0 : STANDARD_DELIVERY_FEE;
    const grandTotal = subtotal + deliveryFee;
    const giftNote = giftNoteInput?.value.trim() || '';

    checkoutModal.innerHTML = `
      <div class="checkout-header">
        <h2>Bengaluru Hand-Delivery Checkout</h2>
        <button class="icon-btn cart-close-btn" type="button" data-checkout-close aria-label="Close checkout">
          <i data-lucide="x" aria-hidden="true"></i>
        </button>
      </div>
      <div class="checkout-body">
        <form data-checkout-form>
          <p class="checkout-section-title"><i data-lucide="user" aria-hidden="true"></i> 1. Recipient Details</p>
          <div class="form-grid two-col">
            <div class="field">
              <label for="co-name">Recipient full name</label>
              <input id="co-name" name="name" required autocomplete="name" placeholder="e.g. Ananya Sharma">
              <p class="error-message" aria-live="polite"></p>
            </div>
            <div class="field">
              <label for="co-phone">Recipient phone number</label>
              <input id="co-phone" name="phone" type="tel" required autocomplete="tel" placeholder="e.g. +91 98765 43210">
              <p class="error-message" aria-live="polite"></p>
            </div>
            <div class="field full">
              <label for="co-address">Delivery address & landmarks (Bengaluru)</label>
              <input id="co-address" name="address" required autocomplete="street-address" placeholder="Flat / House No, Street, Indiranagar / Koramangala...">
              <p class="error-message" aria-live="polite"></p>
            </div>
          </div>

          <p class="checkout-section-title"><i data-lucide="calendar" aria-hidden="true"></i> 2. Delivery Timing</p>
          <div class="choice-grid">
            <div class="choice">
              <input id="slot-same-day" type="radio" name="delivery_slot" value="Same-Day Express (2 PM cutoff)" checked>
              <label for="slot-same-day">Today · Afternoon Hand-Delivery</label>
            </div>
            <div class="choice">
              <input id="slot-morning" type="radio" name="delivery_slot" value="Tomorrow Morning (9 AM - 12 PM)">
              <label for="slot-morning">Tomorrow · Morning Fresh Slot</label>
            </div>
          </div>

          <p class="checkout-section-title"><i data-lucide="credit-card" aria-hidden="true"></i> 3. Payment Method</p>
          <div class="choice-grid">
            <div class="choice">
              <input id="pay-upi" type="radio" name="payment_method" value="UPI / QR (GPay, PhonePe, Paytm)" checked>
              <label for="pay-upi">UPI / Instant QR</label>
            </div>
            <div class="choice">
              <input id="pay-card" type="radio" name="payment_method" value="Cards & NetBanking">
              <label for="pay-card">Credit / Debit Card</label>
            </div>
          </div>

          <div class="checkout-order-preview">
            <div class="summary-row">
              <span>Items (${cart.reduce((s, i) => s + i.quantity, 0)} bouquets):</span>
              <span>₹${subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div class="summary-row">
              <span>Hand-Delivery:</span>
              <span>${isFreeDelivery ? 'FREE' : `₹${deliveryFee}`}</span>
            </div>
            ${giftNote ? `<div class="summary-row" style="margin-top:.4rem;font-size:.78rem;font-style:italic;"><span>Gift note:</span> <span>"${giftNote.slice(0, 32)}..."</span></div>` : ''}
            <div class="summary-row total-row">
              <strong>Order Total:</strong>
              <strong>₹${grandTotal.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <button class="btn btn-primary btn-block" type="submit" data-submit-order>
            Place Order · ₹${grandTotal.toLocaleString('en-IN')} <i data-lucide="check" aria-hidden="true"></i>
          </button>
        </form>
      </div>
    `;

    refreshIcons();

    $('[data-checkout-close]', checkoutModal)?.addEventListener('click', closeCheckout);

    const form = $('[data-checkout-form]', checkoutModal);
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = $('[data-submit-order]', form);
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `Confirming order...`;
      }

      setTimeout(() => {
        const orderId = `RW-${Math.floor(100000 + Math.random() * 900000)}`;
        const recipientName = $('#co-name', form)?.value || 'Valued Customer';
        const address = $('#co-address', form)?.value || 'Bengaluru';
        const slot = form.querySelector('input[name="delivery_slot"]:checked')?.value || 'Today';

        checkoutModal.innerHTML = `
          <div class="checkout-header">
            <h2>Order Confirmed!</h2>
            <button class="icon-btn cart-close-btn" type="button" data-order-done aria-label="Close">
              <i data-lucide="x" aria-hidden="true"></i>
            </button>
          </div>
          <div class="checkout-body order-confirmation-view">
            <div class="order-success-icon">
              <i data-lucide="check-circle-2" aria-hidden="true"></i>
            </div>
            <span class="order-ref-badge">Order ${orderId}</span>
            <h3 style="font-size:1.6rem;margin-bottom:.5rem;">Flowers are on their way!</h3>
            <p style="max-width:44ch;margin:0 auto 1.5rem;font-size:.9rem;">
              Thank you, <strong>${recipientName}</strong>. Our florist is hand-tying your seasonal stems right now in our Bengaluru studio.
            </p>
            <div class="order-summary-box">
              <div class="summary-row"><span>Estimated Delivery:</span><strong>${slot}</strong></div>
              <div class="summary-row"><span>Delivery Address:</span><span>${address}</span></div>
              <div class="summary-row"><span>Items Ordered:</span><span>${cart.map(i => `${i.quantity}x ${i.name}`).join(', ')}</span></div>
              <div class="summary-row total-row"><span>Total Paid:</span><strong>₹${grandTotal.toLocaleString('en-IN')}</strong></div>
            </div>
            <button class="btn btn-primary btn-block" type="button" data-order-done>
              Continue Browsing
            </button>
          </div>
        `;
        refreshIcons();

        // Clear cart
        cart = [];
        saveCart();

        $$('[data-order-done]', checkoutModal).forEach((btn) => btn.addEventListener('click', () => {
          closeCheckout();
          showToast('Order confirmed! A photo will be sent prior to dispatch.', 'sparkles');
        }));
      }, 700);
    });
  };

  // Cart body delegate clicks (quantities & delete)
  cartBody.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('[data-remove-item]');
    if (removeBtn) {
      const id = removeBtn.dataset.removeItem;
      cart = cart.filter((item) => item.id !== id);
      saveCart();
      return;
    }

    const qtyBtn = e.target.closest('[data-qty-change]');
    if (qtyBtn) {
      const id = qtyBtn.dataset.id;
      const delta = Number(qtyBtn.dataset.qtyChange);
      const item = cart.find((i) => i.id === id);
      if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
          cart = cart.filter((i) => i.id !== id);
        }
        saveCart();
      }
    }
  });

  $('[data-clear-cart]', cartDrawer)?.addEventListener('click', () => {
    cart = [];
    saveCart();
    showToast('Shopping bag cleared', 'trash-2');
  });

  $('[data-checkout-open]', cartDrawer)?.addEventListener('click', openCheckout);
  $('[data-cart-close]', cartDrawer)?.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);
  checkoutOverlay.addEventListener('click', closeCheckout);

  // Close with Escape key
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (checkoutModal.classList.contains('is-open')) closeCheckout();
      else if (cartDrawer.classList.contains('is-open')) closeCart();
    }
  });

  // Cart button in header opens the cart drawer
  cartButton?.addEventListener('click', openCart);

  // Add-to-cart buttons across the website
  const addToCartHandler = (button) => {
    const productName = button.dataset.addCart || 'Afterglow';
    const catalogItem = CATALOG[productName] || {
      id: productName.toLowerCase().replace(/\s+/g, '-'),
      name: productName,
      price: 2450,
      stems: 'Seasonal studio selection',
      imageFile: 'product-afterglow.webp'
    };

    const existing = cart.find((item) => item.id === catalogItem.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: catalogItem.id,
        name: catalogItem.name,
        price: catalogItem.price,
        stems: catalogItem.stems,
        imageFile: catalogItem.imageFile || 'product-afterglow.webp',
        quantity: 1
      });
    }

    saveCart();
    showToast(`Added ${catalogItem.name} to your bag`, 'shopping-bag');
    openCart();
  };

  $$('[data-add-cart]').forEach((button) => {
    button.addEventListener('click', () => addToCartHandler(button));
  });

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.append(toast);
  let toastTimer;
  const showToast = (message, icon = 'sparkles') => {
    toast.innerHTML = `<i data-lucide="${icon}"></i><span>${message}</span>`;
    toast.classList.add('is-visible');
    refreshIcons();
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
  };

  updateCartBadge();
  renderCart();

  // Filter bar & Occasion redirection filter handler
  const filterButtons = $$('[data-filter]');
  const productCards = $$('[data-category]');

  const applyCategoryFilter = (filterKey, shouldScroll = false) => {
    if (!filterButtons.length || !productCards.length) return;
    const cleanKey = (filterKey || 'all').toLowerCase().replace(/^#/, '').trim();
    const matchingBtn = filterButtons.find((btn) => btn.dataset.filter === cleanKey);
    const activeFilter = matchingBtn ? cleanKey : 'all';

    filterButtons.forEach((item) => {
      item.classList.toggle('is-active', item.dataset.filter === activeFilter);
    });

    productCards.forEach((card) => {
      const match = activeFilter === 'all' || card.dataset.category === activeFilter;
      card.hidden = !match;
      if (match) {
        card.classList.add('is-revealed');
      }
    });

    if (shouldScroll && activeFilter !== 'all') {
      setTimeout(() => {
        const filterBar = $('.filter-bar') || $('.product-grid');
        if (filterBar) {
          filterBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 80);
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter || 'all';
      applyCategoryFilter(filter);
      try {
        const newUrl = filter === 'all' ? location.pathname : `${location.pathname}#${filter}`;
        history.replaceState(null, '', newUrl);
      } catch (e) {}
    });
  });

  const checkUrlFilter = (shouldScroll = false) => {
    const hash = location.hash ? location.hash.slice(1) : '';
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category') || params.get('filter') || params.get('occasion') || hash;
    if (categoryParam) {
      applyCategoryFilter(categoryParam, shouldScroll);
    }
  };

  checkUrlFilter(true);
  window.addEventListener('hashchange', () => checkUrlFilter(true));

  // Delivery Window Redirect Handler (Products page)
  const handleWindowRedirect = () => {
    const params = new URLSearchParams(location.search);
    const rawHash = (location.hash || '').replace(/^#/, '').toLowerCase();
    const windowParam = (params.get('window') || params.get('slot') || '').toLowerCase();
    const targetKey = windowParam || rawHash;

    if (!targetKey) return;

    let targetEl = null;
    if (['morning', 'morning-bouquets', 'slot-morning'].includes(targetKey)) {
      targetEl = $('#morning-bouquets') || $('#morning');
    } else if (['evening', 'evening-bouquets', 'slot-evening', 'afternoon', 'afternoon-bouquets'].includes(targetKey)) {
      targetEl = $('#evening-bouquets') || $('#evening');
    } else if (['night', 'night-bouquets', 'slot-night', 'twilight'].includes(targetKey)) {
      targetEl = $('#night-bouquets') || $('#night');
    }

    if (targetEl) {
      setTimeout(() => {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        targetEl.classList.add('is-focused-window');
        setTimeout(() => targetEl.classList.remove('is-focused-window'), 2500);
      }, 150);
    }
  };

  handleWindowRedirect();
  window.addEventListener('hashchange', handleWindowRedirect);

  // Botanical seasonal calendar filter (About Us page)
  const seasonButtons = $$('[data-season-btn]');
  const seasonCards = $$('[data-season-card]');

  if (seasonButtons.length && seasonCards.length) {
    seasonButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetSeason = (btn.dataset.seasonBtn || 'all').toLowerCase();
        seasonButtons.forEach((b) => {
          const isActive = b === btn;
          b.classList.toggle('is-active', isActive);
          b.setAttribute('aria-pressed', String(isActive));
        });

        seasonCards.forEach((card) => {
          const cardSeason = (card.dataset.seasonCard || '').toLowerCase();
          const match = targetSeason === 'all' || cardSeason === targetSeason;
          card.hidden = !match;
          if (match) {
            card.classList.add('is-revealed');
          }
        });
      });
    });
  }

  // Same-Day Delivery Slot Selector (Delivery Page)
  const slotCards = $$('[data-slot-card]');
  const slotBannerTitle = $('#selected-slot-title');
  const slotBannerDetail = $('#selected-slot-detail');
  const slotBannerCta = $('#selected-slot-cta');

  if (slotCards.length && slotBannerTitle && slotBannerDetail && slotBannerCta) {
    const slotData = {
      morning: {
        title: 'Morning Delivery · 9:00 AM – 1:00 PM',
        detail: 'Cutoff: Order by 8:30 AM today · Perfect for morning breakfast & birthday wake-ups',
        cta: 'Browse Morning Bouquets',
        link: 'products.html?window=morning#morning-bouquets',
      },
      evening: {
        title: 'Evening Delivery · 2:00 PM – 6:30 PM',
        detail: 'Cutoff: Order by 1:30 PM today · Ideal for desk arrivals, sundown celebrations & milestones',
        cta: 'Browse Evening Bouquets',
        link: 'products.html?window=evening#evening-bouquets',
      },
      night: {
        title: 'Night Delivery · 6:30 PM – 10:00 PM',
        detail: 'Cutoff: Order by 4:00 PM today · Ready for candlelit dinners, anniversaries & night arrivals',
        cta: 'Browse Night Bouquets',
        link: 'products.html?window=night#night-bouquets',
      },
      afternoon: {
        title: 'Evening Delivery · 2:00 PM – 6:30 PM',
        detail: 'Cutoff: Order by 1:30 PM today · Ideal for desk arrivals, sundown celebrations & milestones',
        cta: 'Browse Evening Bouquets',
        link: 'products.html?window=evening#evening-bouquets',
      },
    };

    slotCards.forEach((card) => {
      card.addEventListener('click', () => {
        const slotKey = card.dataset.slotCard;
        const info = slotData[slotKey];
        if (!info) return;

        slotCards.forEach((c) => {
          const isActive = c === card;
          c.classList.toggle('is-active', isActive);
          c.setAttribute('aria-selected', String(isActive));
        });

        slotBannerTitle.textContent = info.title;
        slotBannerDetail.textContent = info.detail;
        slotBannerCta.innerHTML = `${info.cta} <i data-lucide="arrow-right"></i>`;
        slotBannerCta.setAttribute('href', info.link);
        if (window.lucide) window.lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });
      });
    });
  }

  // Custom Arrangement Mood Card Selector
  $$('[data-set-mood]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mood = btn.dataset.setMood;
      const radio = $(`#mood-${mood}`);
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
        const formTarget = $('#custom-story') || $('.form-card');
        if (formTarget) {
          formTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (formTarget.tagName === 'TEXTAREA') formTarget.focus();
        }
      }
    });
  });

  // Contact Page Studio Experience Selector
  $$('[data-select-enquiry]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const enquiryType = btn.dataset.selectEnquiry;
      const select = $('#enquiry-type');
      if (select) {
        const option = Array.from(select.options).find((opt) => opt.text.toLowerCase().includes(enquiryType.toLowerCase()));
        if (option) {
          select.value = option.value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
      const formTarget = $('#order-enquiry') || $('.form-card');
      if (formTarget) {
        formTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const firstInput = $('#enquiry-name') || $('#enquiry-message');
        if (firstInput) {
          setTimeout(() => firstInput.focus(), 300);
        }
      }
    });
  });

  // FAQ Accordion
  $$('[data-faq-button]').forEach((button) => button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open));
  }));

  // Animated counters
  $$('[data-counter]').forEach((counter) => {
    const target = Number(counter.dataset.counter);
    const suffix = counter.dataset.suffix || '';
    const animate = () => {
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / 1200, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { animate(); observer.disconnect(); } }, { threshold: .4 });
      observer.observe(counter);
    } else animate();
  });

  // Forms
  $$('form[data-validate]').forEach((form) => {
    const validateField = (field) => {
      let message = '';
      const value = field.value.trim();
      if (field.required && !value) message = 'Please complete this field.';
      else if (field.type === 'email' && value && !/^\S+@\S+\.\S+$/.test(value)) message = 'Enter a valid email address.';
      else if (field.type === 'tel' && value && !/^[+\d][\d\s()-]{7,}$/.test(value)) message = 'Enter a valid phone number.';
      else if (field.minLength > 0 && value.length < field.minLength) message = `Use at least ${field.minLength} characters.`;
      field.setAttribute('aria-invalid', String(Boolean(message)));
      const error = field.closest('.field')?.querySelector('.error-message');
      if (error) error.textContent = message;
      return !message;
    };
    $$('input, select, textarea', form).forEach((field) => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') validateField(field); });
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const fields = $$('input, select, textarea', form).filter((field) => field.type !== 'hidden');
      const valid = fields.map(validateField).every(Boolean);
      if (!valid) {
        $('[aria-invalid="true"]', form)?.focus();
        return;
      }
      const success = $('.form-success', form);
      if (success) success.classList.add('is-visible');
      showToast(form.dataset.success || 'Thank you — your request has been received.', 'check-circle-2');
      form.reset();
    });
  });

  // Budget Range
  const range = $('[data-budget-range]');
  const rangeOutput = $('[data-budget-output]');
  const syncRange = () => { if (range && rangeOutput) rangeOutput.textContent = `₹${Number(range.value).toLocaleString('en-IN')}`; };
  range?.addEventListener('input', syncRange);
  syncRange();

  // =========================================================================
  // Live Interactive Map (Zero API Key Required)
  // =========================================================================
  const initLiveMap = () => {
    const liveDeliveryMap = document.getElementById('live-delivery-map');
    if (!liveDeliveryMap) return;

    // Touch scroll overlay — prevents iframe from trapping page scroll
    const mapContainers = $$('.zone-map');
    mapContainers.forEach((container) => {
      const iframe = container.querySelector('iframe');
      if (!iframe) return;
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:absolute;inset:0;z-index:5;cursor:pointer;';
      overlay.setAttribute('aria-hidden', 'true');
      container.style.position = 'relative';
      container.appendChild(overlay);
      overlay.addEventListener('click', () => {
        overlay.style.display = 'none';
        // Re-show overlay after user scrolls away
        const restoreOverlay = () => {
          overlay.style.display = '';
          window.removeEventListener('scroll', restoreOverlay);
        };
        setTimeout(() => window.addEventListener('scroll', restoreOverlay, { passive: true, once: true }), 2000);
      });
    });

    const liveZoneUrls = {
      all: 'https://maps.google.com/maps?q=Indiranagar,+Bengaluru,+Karnataka,+India&t=&z=12&ie=UTF8&iwloc=&output=embed',
      indiranagar: 'https://maps.google.com/maps?q=100+Feet+Road,+Indiranagar,+Bengaluru&t=&z=15&ie=UTF8&iwloc=&output=embed',
      koramangala: 'https://maps.google.com/maps?q=Koramangala,+Bengaluru&t=&z=14&ie=UTF8&iwloc=&output=embed',
      whitefield: 'https://maps.google.com/maps?q=Whitefield,+Bengaluru&t=&z=13&ie=UTF8&iwloc=&output=embed',
      jayanagar: 'https://maps.google.com/maps?q=Jayanagar,+Bengaluru&t=&z=14&ie=UTF8&iwloc=&output=embed',
      hsr: 'https://maps.google.com/maps?q=HSR+Layout,+Bengaluru&t=&z=14&ie=UTF8&iwloc=&output=embed'
    };

    $$('[data-live-zone]').forEach((pill) => {
      pill.addEventListener('click', () => {
        $$('[data-live-zone]').forEach((p) => p.classList.remove('is-active'));
        pill.classList.add('is-active');
        const key = pill.dataset.liveZone;
        if (liveZoneUrls[key]) {
          liveDeliveryMap.src = liveZoneUrls[key];
        }
      });
    });

    const postcodeInput = document.getElementById('postcode');
    if (postcodeInput) {
      postcodeInput.addEventListener('input', () => {
        const val = postcodeInput.value.trim();
        let targetKey = '';
        if (val === '560038' || val.startsWith('56003')) targetKey = 'indiranagar';
        else if (val === '560095' || val === '560034') targetKey = 'koramangala';
        else if (val === '560066') targetKey = 'whitefield';
        else if (val === '560041') targetKey = 'jayanagar';
        else if (val === '560102') targetKey = 'hsr';

        if (targetKey && liveZoneUrls[targetKey]) {
          $$('[data-live-zone]').forEach((p) => p.classList.toggle('is-active', p.dataset.liveZone === targetKey));
          liveDeliveryMap.src = liveZoneUrls[targetKey];
        }
      });
    }
  };

  // Forgot Password Panel Toggle
  const forgotToggle = $('[data-forgot-toggle]');
  const backToSignin = $('[data-back-to-signin]');
  const signinPanel = $('#signin-panel');
  const forgotPanel = $('#forgot-panel');

  if (forgotToggle && signinPanel && forgotPanel) {
    forgotToggle.addEventListener('click', () => {
      signinPanel.hidden = true;
      forgotPanel.hidden = false;
      forgotToggle.setAttribute('aria-expanded', 'true');
      const emailField = $('#forgot-email');
      const signinEmail = $('#signin-email');
      if (emailField && signinEmail && signinEmail.value) {
        emailField.value = signinEmail.value;
      }
      emailField?.focus();
    });

    backToSignin?.addEventListener('click', () => {
      forgotPanel.hidden = true;
      signinPanel.hidden = false;
      forgotToggle.setAttribute('aria-expanded', 'false');
      $('#signin-email')?.focus();
    });
  }

  // The Florist’s Workbench: Stem Anatomy & Composition Studio (Home 2)
  const initFlowerWorkbench = () => {
    const tabs = $$('[data-workbench-tab]');
    if (!tabs.length) return;

    const wbPhoto = $('#wb-photo');
    const wbBadge = $('#wb-badge');
    const wbMood = $('#wb-mood');
    const wbTitle = $('#wb-title');
    const wbDesc = $('#wb-desc');
    const wbSwatches = $('#wb-swatches');
    const wbRatio = $('#wb-ratio');
    const wbLife = $('#wb-life');
    const wbScent = $('#wb-scent');
    const wbVessel = $('#wb-vessel');
    const wbPrice = $('#wb-price');
    const wbAddBtn = $('#wb-add-btn');
    const wbStemCount = $('#wb-stem-count');
    const wbStemsList = $('#wb-stems-list');

    const workbenchData = {
      peach: {
        photo: 'assets/images/product-peach-theory.webp',
        alt: 'Peach Theory bouquet of apricot roses and peach flowers tied with ribbon',
        badge: 'Studio Palette No. 01',
        mood: 'Soft & Romantic Mood',
        title: 'Peach Theory',
        desc: 'Sun-drenched apricot tones celebrating spontaneous thank-yous, warm anniversaries, and graceful domestic tables.',
        swatches: ['#e8927c', '#f4c2ad', '#d97757', '#6b8068'],
        ratio: '45% Focal · 35% Wild · 20% Foliage',
        life: '7–10 Days in cool water',
        scent: 'Apricot Nectar & Sweet Damask',
        vessel: 'Fluted Sandstone Ceramic Pitcher',
        price: '₹2,850',
        productName: 'Peach Theory',
        stemCount: '4 Curated Cultivars',
        stems: [
          {
            role: 'role-focal',
            roleIcon: 'award',
            roleText: '01 / Primary Focal Hero',
            origin: 'Nilgiris (2,200m)',
            title: 'Kahala Garden Rose',
            latin: "Rosa 'Kahala' · Rosaceae",
            notes: 'Ruffled, cupped petals in warm apricot-terracotta that unfurl over 5 days, forming the gravitational anchor of the arrangement.'
          },
          {
            role: 'role-motion',
            roleIcon: 'wind',
            roleText: '02 / Structural Movement',
            origin: 'Bengaluru Outskirts',
            title: 'Coral Ranunculus',
            latin: 'Ranunculus Asiaticus · Ranunculaceae',
            notes: 'Slender, serpentine stems with multi-layered paper-thin petals that bend gracefully over the vase edge with natural fluidity.'
          },
          {
            role: 'role-wild',
            roleIcon: 'sparkle',
            roleText: '03 / Airy Wildflower',
            origin: 'Kaveri Valley',
            title: 'Blush Sweet Pea',
            latin: 'Lathyrus Odoratus · Fabaceae',
            notes: 'Delicate winged blossoms releasing honey-floral fragrance notes, adding buoyant height and breath between dense blooms.'
          },
          {
            role: 'role-foliage',
            roleIcon: 'leaf',
            roleText: '04 / Architectural Greenery',
            origin: 'Coorg Cloud Estates',
            title: 'Emerald Italian Ruscus',
            latin: 'Ruscus Hypophyllum · Asparagaceae',
            notes: "Glossy deep-green spears that establish the arrangement's asymmetric silhouette and sustain vase freshness for up to 14 days."
          }
        ]
      },
      meadow: {
        photo: 'assets/images/product-meadow-light.webp',
        alt: 'Meadow Light bouquet with yellow cosmos, chamomile and pale blue delphinium',
        badge: 'Studio Palette No. 02',
        mood: 'Bright & Garden-Led Mood',
        title: 'Meadow Light',
        desc: 'Fresh morning energy capturing the spontaneous wonder of wild fields, sunny breakfast mornings, and playful celebrations.',
        swatches: ['#e2a829', '#fbe29d', '#99c3d9', '#638258'],
        ratio: '40% Focal · 45% Wild · 15% Foliage',
        life: '6–8 Days in cool water',
        scent: 'Crisp Chamomile & Garden Herb',
        vessel: 'Ribbed Clear Glass Cylinder',
        price: '₹2,150',
        productName: 'Meadow Light',
        stemCount: '4 Curated Cultivars',
        stems: [
          {
            role: 'role-focal',
            roleIcon: 'award',
            roleText: '01 / Primary Focal Hero',
            origin: 'Ooty Highlands',
            title: 'Golden Garden Tulip',
            latin: 'Tulipa Gesneriana · Liliaceae',
            notes: 'Luminous sunshine chalices that respond to sunlight by opening during morning light and re-closing as evening settles.'
          },
          {
            role: 'role-motion',
            roleIcon: 'wind',
            roleText: '02 / Structural Movement',
            origin: 'Coonoor Terraces',
            title: 'Sky Blue Delphinium',
            latin: 'Delphinium Elatum · Ranunculaceae',
            notes: 'Towering spires of pale azure florets that establish vertical rhythm and bring a sense of expansive sky into the room.'
          },
          {
            role: 'role-wild',
            roleIcon: 'sparkle',
            roleText: '03 / Airy Wildflower',
            origin: 'Bengaluru Outskirts',
            title: 'Garden Chamomile',
            latin: 'Matricaria Chamomilla · Asteraceae',
            notes: 'Whimsical daisy-like buttons exuding gentle apple-sweet notes, scattering informal meadow light across the vase.'
          },
          {
            role: 'role-foliage',
            roleIcon: 'leaf',
            roleText: '04 / Architectural Greenery',
            origin: 'Western Ghats Foothills',
            title: 'Feathery Maidenhair Fern',
            latin: 'Adiantum Raddianum · Pteridaceae',
            notes: 'Ultra-fine cascading fronds providing textural filtration, catching light between colorful petals like morning dew.'
          }
        ]
      },
      afterglow: {
        photo: 'assets/images/product-afterglow.webp',
        alt: 'Afterglow bouquet with burgundy roses, coral ranunculus and blush stock',
        badge: 'Studio Palette No. 03',
        mood: 'Moody & Velvety Romance',
        title: 'Afterglow',
        desc: 'Deep burgundy and coral harmony crafted for intimate evening tables, candlelit dining, and unforgettable anniversary confessions.',
        swatches: ['#8b263e', '#e06d53', '#f2b5a5', '#3d4a3b'],
        ratio: '50% Focal · 30% Wild · 20% Foliage',
        life: '8–12 Days in cool water',
        scent: 'Velvety Damask Rose & Clove',
        vessel: 'Smoked Charcoal Fluted Vase',
        price: '₹2,450',
        productName: 'Afterglow',
        stemCount: '4 Curated Cultivars',
        stems: [
          {
            role: 'role-focal',
            roleIcon: 'award',
            roleText: '01 / Primary Focal Hero',
            origin: 'Nilgiri Cloud Mist',
            title: 'Deep O’Hara Garden Rose',
            latin: "Rosa 'Black Baccara' · Rosaceae",
            notes: 'Velvety plum and burgundy petals with extraordinary depth, releasing intoxicating classic perfume as candlelight flickers.'
          },
          {
            role: 'role-motion',
            roleIcon: 'wind',
            roleText: '02 / Structural Movement',
            origin: 'Bengaluru Nursery',
            title: 'Flame Coral Ranunculus',
            latin: 'Ranunculus Asiaticus · Ranunculaceae',
            notes: 'Dramatic crimson and copper swirls providing fire-like focal movement that cuts across the darker background foliage.'
          },
          {
            role: 'role-wild',
            roleIcon: 'sparkle',
            roleText: '03 / Airy Wildflower',
            origin: 'Kaveri Basin',
            title: 'Fragrant Blush Stock',
            latin: 'Matthiola Incana · Brassicaceae',
            notes: 'Plump clusters of ruffled florets bearing a warm clove-spiced fragrance that gently fills evening dining rooms.'
          },
          {
            role: 'role-foliage',
            roleIcon: 'leaf',
            roleText: '04 / Architectural Greenery',
            origin: 'Coorg Estate Slopes',
            title: 'Cotinus Smoke Bush',
            latin: 'Cotinus Coggygria · Anacardiaceae',
            notes: 'Dark mulberry foliage with feathery plumes that frame blooms in painterly chiaroscuro contrast.'
          }
        ]
      },
      garden: {
        photo: 'assets/images/product-still-garden.webp',
        alt: 'Still Garden peaceful arrangement of white flowers and leafy green stems',
        badge: 'Studio Palette No. 04',
        mood: 'Calm, Pure & Meditative Mood',
        title: 'Still Garden',
        desc: 'Understated ivory and silver-green foliage offering serenity, quiet comfort, mindful breathing, and pure aesthetic peace.',
        swatches: ['#f7f5f0', '#d8dfd5', '#8a9a86', '#3b4737'],
        ratio: '35% Focal · 35% Wild · 30% Foliage',
        life: '10–14 Days in cool water',
        scent: 'Fresh Eucalyptus & Crisp Green Tea',
        vessel: 'Matte Chalk Stoneware Urn',
        price: '₹3,100',
        productName: 'Still Garden',
        stemCount: '4 Curated Cultivars',
        stems: [
          {
            role: 'role-focal',
            roleIcon: 'award',
            roleText: '01 / Primary Focal Hero',
            origin: 'Ooty Mountain Glasshouse',
            title: 'Alabaster Casa Blanca Lily',
            latin: 'Lilium Orientalis · Liliaceae',
            notes: 'Graceful porcelain-white petals that open into expansive stars, delivering quiet dignity and comforting presence.'
          },
          {
            role: 'role-motion',
            roleIcon: 'wind',
            roleText: '02 / Structural Movement',
            origin: 'Bengaluru Outskirts',
            title: 'Ivory Double Lisianthus',
            latin: 'Eustoma Grandiflorum · Gentianaceae',
            notes: 'Rose-like spiral buds on multiple branching stems that open progressively over two full weeks of vase life.'
          },
          {
            role: 'role-wild',
            roleIcon: 'sparkle',
            roleText: '03 / Airy Wildflower',
            origin: 'Nilgiri Foothills',
            title: 'Wild Queen Anne’s Lace',
            latin: 'Daucus Carota · Apiaceae',
            notes: 'Intricate umbrella-shaped umbels that float like white mist above the solid blooms, giving optical weightlessness.'
          },
          {
            role: 'role-foliage',
            roleIcon: 'leaf',
            roleText: '04 / Architectural Greenery',
            origin: 'Nilgiri Highlands',
            title: 'Silver Dollar Eucalyptus',
            latin: 'Eucalyptus Cinerea · Myrtaceae',
            notes: 'Aromatic silver-blue rounded leaves that purify ambient air and maintain architectural form even when dried.'
          }
        ]
      }
    };

    const renderWorkbench = (key) => {
      const data = workbenchData[key];
      if (!data) return;

      tabs.forEach((t) => {
        const isActive = t.dataset.workbenchTab === key;
        t.classList.toggle('is-active', isActive);
        t.setAttribute('aria-selected', String(isActive));
      });

      if (wbPhoto) {
        wbPhoto.src = data.photo;
        wbPhoto.alt = data.alt;
      }
      if (wbBadge) wbBadge.textContent = data.badge;
      if (wbMood) wbMood.textContent = data.mood;
      if (wbTitle) wbTitle.textContent = data.title;
      if (wbDesc) wbDesc.textContent = data.desc;
      if (wbRatio) wbRatio.textContent = data.ratio;
      if (wbLife) wbLife.textContent = data.life;
      if (wbScent) wbScent.innerHTML = data.scent;
      if (wbVessel) wbVessel.textContent = data.vessel;
      if (wbPrice) wbPrice.textContent = data.price;
      if (wbStemCount) wbStemCount.textContent = data.stemCount;

      if (wbAddBtn) {
        wbAddBtn.dataset.addCart = data.productName;
        wbAddBtn.innerHTML = `Add to bag <i data-lucide="plus" aria-hidden="true"></i>`;
      }

      if (wbSwatches) {
        wbSwatches.innerHTML = data.swatches.map((color) => `<span class="swatch-dot" style="background:${color}"></span>`).join('');
      }

      if (wbStemsList) {
        wbStemsList.innerHTML = data.stems.map((s) => `
          <article class="stem-card">
            <div class="stem-card-top">
              <span class="stem-role-badge ${s.role}"><i data-lucide="${s.roleIcon}"></i> ${s.roleText}</span>
              <span class="stem-origin"><i data-lucide="map-pin"></i> ${s.origin}</span>
            </div>
            <div class="stem-card-title">
              <h5>${s.title}</h5>
              <em class="stem-latin">${s.latin}</em>
            </div>
            <p class="stem-notes">${s.notes}</p>
          </article>
        `).join('');
      }

      if (window.lucide) {
        window.lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });
      }
    };

    tabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => {
        renderWorkbench(tab.dataset.workbenchTab);
      });

      tab.addEventListener('keydown', (e) => {
        let targetIdx = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          targetIdx = (idx + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          targetIdx = (idx - 1 + tabs.length) % tabs.length;
        } else if (e.key === 'Home') {
          targetIdx = 0;
        } else if (e.key === 'End') {
          targetIdx = tabs.length - 1;
        }

        if (targetIdx !== null) {
          e.preventDefault();
          tabs[targetIdx].focus();
          tabs[targetIdx].click();
        }
      });
    });
  };

  initLiveMap();
  initFlowerWorkbench();
})();

