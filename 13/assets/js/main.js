(function () {
  "use strict";

  const body = document.body;
  const ROOT = body.dataset.depth === "1" ? "../" : "";
  const page = body.dataset.page || "home";
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const icon = (name, extra = "") => `<i data-lucide="${name}" ${extra}></i>`;

  const routes = {
    home: `${ROOT}index.html`,
    homeAlt: `${ROOT}index1.html`,
    shop: `${ROOT}pages/shop.html`,
    ingredients: `${ROOT}pages/ingredients.html`,
    guide: `${ROOT}pages/skin-type-guide.html`,
    bundles: `${ROOT}pages/bundles.html`,
    contact: `${ROOT}pages/contact.html`,
    about: `${ROOT}pages/about.html`,
    signin: `${ROOT}pages/signin.html`,
    signup: `${ROOT}pages/signup.html`,
    forgotPassword: `${ROOT}pages/forgot-password.html`,
    privacy: `${ROOT}pages/privacy.html`,
    terms: `${ROOT}pages/terms.html`,
    comingSoon: `${ROOT}pages/coming-soon.html`,
    error404: `${ROOT}pages/404.html`
  };

  // Product Database for Search, Cart and Routine Lookups
  const productCatalog = {
    "gentle-cleanser": { name: "Gentle Cleanser", price: 899, photo: "product-1", category: "Cleansers", href: `${routes.shop}?category=cleansers` },
    "creamy-hydrating-cleanser": { name: "Creamy Hydrating Cleanser", price: 899, photo: "product-image-creamy-hydrating-cleanser", category: "Cleansers", href: `${routes.shop}?category=cleansers` },
    "oil-control-cleanser": { name: "Oil Control Cleanser", price: 899, photo: "product-image-oil-control-cleanser", category: "Cleansers", href: `${routes.shop}?category=cleansers` },
    "calm-milk-cleanser": { name: "Calm Milk Cleanser", price: 899, photo: "product-1", category: "Cleansers", href: `${routes.shop}?category=cleansers` },
    "balancing-cleanser": { name: "Balancing Cleanser", price: 899, photo: "product-1", category: "Cleansers", href: `${routes.shop}?category=cleansers` },
    "niacinamide-serum": { name: "Niacinamide Radiance Serum", price: 1299, photo: "product-image-niacinamide-radiance-serum", category: "Serums", href: `${routes.shop}?category=serums` },
    "niacinamide-radiance-serum": { name: "Niacinamide Radiance Serum", price: 1299, photo: "product-image-niacinamide-radiance-serum", category: "Serums", href: `${routes.shop}?category=serums` },
    "hyaluronic-acid-serum": { name: "Hyaluronic Acid Hydra Boost Serum", price: 1399, photo: "product-image-hyaluronic-acid-hydra-boost-serum", category: "Serums", href: `${routes.shop}?category=serums` },
    "hyaluronic-acid-hydra-boost-serum": { name: "Hyaluronic Acid Hydra Boost Serum", price: 1399, photo: "product-image-hyaluronic-acid-hydra-boost-serum", category: "Serums", href: `${routes.shop}?category=serums` },
    "vitamin-c-serum": { name: "Vitamin C Brightening Serum", price: 1299, photo: "product-image-vitamin-c-brightening-serum", category: "Serums", href: `${routes.shop}?category=serums` },
    "vitamin-c-brightening-serum": { name: "Vitamin C Brightening Serum", price: 1299, photo: "product-image-vitamin-c-brightening-serum", category: "Serums", href: `${routes.shop}?category=serums` },
    "centella-recovery-serum": { name: "Centella Recovery Serum", price: 1299, photo: "product-image-centella-recovery-serum", category: "Serums", href: `${routes.shop}?category=serums` },
    "rich-barrier-moisturizer": { name: "Rich Barrier Moisturizer", price: 1199, photo: "product-image-rich-barrier-moisturizer", category: "Moisturizers", href: `${routes.shop}?category=moisturizers` },
    "weightless-gel-moisturizer": { name: "Weightless Gel Moisturizer", price: 1199, photo: "product-image-weightless-gel-moisturizer", category: "Moisturizers", href: `${routes.shop}?category=moisturizers` },
    "ceramide-cloud-cream": { name: "Ceramide Cloud Cream", price: 1249, photo: "product-image-ceramide-cloud-cream", category: "Moisturizers", href: `${routes.shop}?category=moisturizers` },
    "barrier-rescue-cream": { name: "Barrier Rescue Cream", price: 1199, photo: "product-3", category: "Moisturizers", href: `${routes.shop}?category=moisturizers` },
    "invisible-shield-sunscreen": { name: "Invisible Shield Sunscreen SPF 50", price: 999, photo: "product-image-invisible-shield-sunscreen-spf-50", category: "Sunscreens", href: `${routes.shop}?category=sunscreens` },
    "invisible-shield-sunscreen-spf-50": { name: "Invisible Shield Sunscreen SPF 50", price: 999, photo: "product-image-invisible-shield-sunscreen-spf-50", category: "Sunscreens", href: `${routes.shop}?category=sunscreens` },
    "invisible-shield-spf-50": { name: "Invisible Shield Sunscreen SPF 50", price: 999, photo: "product-image-invisible-shield-sunscreen-spf-50", category: "Sunscreens", href: `${routes.shop}?category=sunscreens` },
    "mineral-veil-spf-50": { name: "Mineral Veil SPF 50", price: 999, photo: "product-image-mineral-veil-spf-50", category: "Sunscreens", href: `${routes.shop}?category=sunscreens` },
    "clay-detox-mask": { name: "Clay Detox Face Mask", price: 899, photo: "product-image-clay-detox-face-mask", category: "Face Masks", href: `${routes.shop}?category=masks` },
    "clay-detox-face-mask": { name: "Clay Detox Face Mask", price: 899, photo: "product-image-clay-detox-face-mask", category: "Face Masks", href: `${routes.shop}?category=masks` },
    "overnight-glow-mask": { name: "Overnight Glow Mask", price: 999, photo: "product-image-overnight-glow-mask", category: "Face Masks", href: `${routes.shop}?category=masks` },
    "glowing-skin-essentials": { name: "Glowing Skin Essentials", price: 2499, photo: "bundle-1", category: "Bundles", href: routes.bundles },
    "hydration-boost-bundle": { name: "Hydration Boost Bundle", price: 2099, photo: "bundle-2", category: "Bundles", href: routes.bundles },
    "acne-control-bundle": { name: "Acne Control Bundle", price: 2399, photo: "bundle-3", category: "Bundles", href: routes.bundles },
    "brightening-bundle": { name: "Brightening & Radiance Set", price: 2699, photo: "bundle-4", category: "Bundles", href: routes.bundles },
    "brightening-radiance-set": { name: "Brightening & Radiance Set", price: 2699, photo: "bundle-4", category: "Bundles", href: routes.bundles },
    "anti-aging-essentials": { name: "Anti-Aging Essentials", price: 3299, photo: "bundle-5", category: "Bundles", href: routes.bundles },
    "pure-calming-barrier-set": { name: "Pure Calming Barrier Set", price: 2599, photo: "bundle-calming", category: "Bundles", href: routes.bundles },
    "pore-clarifying-trio": { name: "Pore Clarifying Trio", price: 2299, photo: "bundle-clarifying", category: "Bundles", href: routes.bundles }
  };

  const brandLogo = `
    <span class="brand-emblem" aria-hidden="true">
      <svg class="brand-logo-svg" viewBox="0 0 44 44" width="34" height="34" fill="none" role="img">
        <rect width="44" height="44" rx="13" fill="#fcf0ed" stroke="#f4ded9" stroke-width="1.2" class="brand-emblem-bg"/>
        <path d="M22 10 C22 10 30 18 30 24 C30 28.4 26.4 32 22 32 C17.6 32 14 28.4 14 24 C14 18 22 10 22 10 Z" fill="url(#brandSunGrad)" opacity="0.9"/>
        <path d="M22 32 C22 32 33 29 33 19 C27 19 22 24 22 32 Z" fill="url(#brandLeafGrad)"/>
        <path d="M22 32 C22 32 25 25 32 20" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" opacity="0.9"/>
        <defs>
          <linearGradient id="brandLeafGrad" x1="14" y1="12" x2="32" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#7a9155"/>
            <stop offset="100%" stop-color="#556c34"/>
          </linearGradient>
          <linearGradient id="brandSunGrad" x1="18" y1="10" x2="34" y2="26" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#eb7378"/>
            <stop offset="100%" stop-color="#d99a34"/>
          </linearGradient>
        </defs>
      </svg>
    </span>
    <span class="brand-text-wrap">
      <span class="brand-title">Glowé</span>
      <span class="brand-tag">BOTANICAL SCIENCE</span>
    </span>`;

  const socialIcons = {
    instagram: `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
    facebook: `<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
    youtube: `<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#fff"/></svg>`,
    pinterest: `<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M12 0a12 12 0 0 0-4.37 23.18c-.03-.96-.06-2.43.05-3.48l1.45-6.14s-.37-.74-.37-1.83c0-1.72 1-3 2.25-3 1.06 0 1.57.8 1.57 1.75 0 1.07-.68 2.67-1.03 4.15-.3 1.24.62 2.25 1.84 2.25 2.21 0 3.9-2.33 3.9-5.7 0-2.98-2.14-5.06-5.2-5.06a5.37 5.37 0 0 0-5.61 5.38c0 1.07.41 2.22.93 2.85a.37.37 0 0 1 .09.35c-.1.4-.31 1.28-.35 1.45-.06.24-.2.3-.46.18-1.72-.8-2.8-3.3-2.8-5.32 0-4.33 3.15-8.31 9.08-8.31 4.77 0 8.47 3.4 8.47 7.94 0 4.74-2.99 8.56-7.14 8.56-1.4 0-2.7-.73-3.15-1.58l-.86 3.28c-.31 1.2-.15 2.7-.02 3.6A11.99 11.99 0 0 0 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z"/></svg>`
  };

  const headerMarkup = `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <div class="shipping-bar">
      <span>${icon("gift")} <strong>FREE SHIPPING</strong> on orders above ₹999 <span class="desktop-only">| Use code <strong>GLOW10</strong> for 10% OFF</span></span>
    </div>
    <header class="site-header" aria-label="Main header">
      <div class="nav-wrap">
        <a class="brand" href="${routes.home}" aria-label="Glowé home">${brandLogo}</a>
        <nav class="main-nav" aria-label="Primary navigation">
          <div class="nav-item has-dropdown">
            <a class="nav-link dropdown-toggle" data-nav="home" href="${routes.home}" aria-haspopup="true" aria-expanded="false">Home ${icon("chevron-down", 'class="dropdown-icon"')}</a>
            <div class="dropdown-menu">
              <a class="dropdown-link" data-nav="home-1" href="${routes.home}">Home 1</a>
              <a class="dropdown-link" data-nav="home-2" href="${routes.homeAlt}">Home 2</a>
            </div>
          </div>
          <a data-nav="shop" href="${routes.shop}">Shop</a>
          <a data-nav="ingredients" href="${routes.ingredients}">Ingredients</a>
          <a data-nav="guide" href="${routes.guide}">Skin Type Guide</a>
          <a data-nav="bundles" href="${routes.bundles}">Bundles</a>
          <a data-nav="contact" href="${routes.contact}">Contact</a>
          <div class="nav-item has-dropdown">
            <a class="nav-link dropdown-toggle" data-nav="pages" href="${routes.about}" aria-haspopup="true" aria-expanded="false">Pages ${icon("chevron-down", 'class="dropdown-icon"')}</a>
            <div class="dropdown-menu">
              <a class="dropdown-link" data-nav="about" href="${routes.about}">About Us</a>
              <a class="dropdown-link" data-nav="privacy" href="${routes.privacy}">Privacy Policy</a>
              <a class="dropdown-link" data-nav="terms" href="${routes.terms}">Terms & Conditions</a>
              <a class="dropdown-link" data-nav="coming" href="${routes.comingSoon}">Coming Soon</a>
              <a class="dropdown-link" data-nav="404" href="${routes.error404}">404</a>
            </div>
          </div>
        </nav>
        <div class="nav-actions">
          <button class="icon-btn theme-button" type="button" aria-label="Toggle color theme" title="Toggle color theme">${icon("moon")}</button>
          <button class="dir-toggle-btn rtl-button" type="button" aria-label="Toggle right-to-left layout" title="Toggle RTL layout"><span class="dir-badge">RTL</span></button>
          <button class="icon-btn search-button" type="button" aria-label="Open search">${icon("search")}</button>
          <button class="icon-btn cart-button" type="button" aria-label="Open shopping bag">${icon("shopping-bag")}<span class="cart-count" aria-live="polite">0</span></button>
          <a class="btn btn-coral btn-sm header-signin-btn" href="${routes.signin}">Sign In</a>
          <button class="icon-btn menu-toggle" type="button" aria-label="Open menu" aria-expanded="false">${icon("menu")}</button>
        </div>
      </div>
    </header>
    <div class="mobile-drawer-nav" aria-label="Mobile navigation" aria-hidden="true">
      <div class="mobile-nav-header">
        <span class="brand">${brandLogo}</span>
        <button class="icon-btn close-mobile-nav" type="button" aria-label="Close menu">${icon("x")}</button>
      </div>
      <div class="mobile-nav-links">
        <div class="mobile-nav-group">
          <span class="mobile-group-title">Home</span>
          <div class="mobile-group-links">
            <a data-nav="home-1" href="${routes.home}">${icon("home")} <span>Home 1</span></a>
            <a data-nav="home-2" href="${routes.homeAlt}">${icon("sparkles")} <span>Home 2</span></a>
          </div>
        </div>
        <div class="mobile-nav-group">
          <span class="mobile-group-title">Store</span>
          <div class="mobile-group-links">
            <a data-nav="shop" href="${routes.shop}">${icon("shopping-bag")} <span>Shop</span></a>
            <a data-nav="ingredients" href="${routes.ingredients}">${icon("sprout")} <span>Ingredients</span></a>
            <a data-nav="guide" href="${routes.guide}">${icon("sparkles")} <span>Skin Type Guide</span></a>
            <a data-nav="bundles" href="${routes.bundles}">${icon("package")} <span>Bundles</span></a>
            <a data-nav="contact" href="${routes.contact}">${icon("message-square")} <span>Contact</span></a>
          </div>
        </div>
        <div class="mobile-nav-group">
          <span class="mobile-group-title">Pages</span>
          <div class="mobile-group-links">
            <a data-nav="about" href="${routes.about}">${icon("heart")} <span>About Us</span></a>
            <a data-nav="privacy" href="${routes.privacy}">${icon("shield-check")} <span>Privacy Policy</span></a>
            <a data-nav="terms" href="${routes.terms}">${icon("file-text")} <span>Terms & Conditions</span></a>
            <a data-nav="coming" href="${routes.comingSoon}">${icon("clock")} <span>Coming Soon</span></a>
            <a data-nav="404" href="${routes.error404}">${icon("alert-circle")} <span>404</span></a>
          </div>
        </div>
      </div>
      <div class="mobile-nav-footer">
        <a class="btn btn-coral" style="width:100%;justify-content:center" href="${routes.signin}">Sign In ${icon("arrow-right")}</a>
      </div>
    </div>`;

  const footerMarkup = `
    <section class="container newsletter" aria-labelledby="newsletter-title" data-reveal>
      <div class="newsletter-copy">${icon("mail")}
        <div><h3 id="newsletter-title">Subscribe to our Newsletter</h3><p>Skin tips, exclusive offers & new launches straight to your inbox.</p></div>
      </div>
      <form class="inline-form newsletter-form" novalidate>
        <label class="sr-only" for="footer-email">Email address</label>
        <input id="footer-email" name="email" type="email" autocomplete="email" placeholder="Enter your email address" required>
        <button class="btn" type="submit">Subscribe</button>
      </form>
    </section>
    <footer class="site-footer">
      <div class="container footer-top">
        <div class="footer-brand">
          <a class="brand" href="${routes.home}">${brandLogo}</a>
          <p>Clean. Honest. Effective.<br>Skincare made for real skin and real life.</p>
          <div class="socials" aria-label="Social media">
            <a class="icon-btn social-btn-ig" href="${routes.comingSoon}" aria-label="Instagram" target="_blank" rel="noopener">${socialIcons.instagram}</a>
            <a class="icon-btn social-btn-fb" href="${routes.comingSoon}" aria-label="Facebook" target="_blank" rel="noopener">${socialIcons.facebook}</a>
            <a class="icon-btn social-btn-yt" href="${routes.comingSoon}" aria-label="YouTube" target="_blank" rel="noopener">${socialIcons.youtube}</a>
            <a class="icon-btn social-btn-pin" href="${routes.comingSoon}" aria-label="Pinterest" target="_blank" rel="noopener">${socialIcons.pinterest}</a>
          </div>
        </div>
        <div class="footer-col">
          <h3>Home & Store</h3>
          <a href="${routes.home}">Home 1</a>
          <a href="${routes.homeAlt}">Home 2</a>
          <a href="${routes.shop}">Shop</a>
          <a href="${routes.bundles}">Bundles</a>
        </div>
        <div class="footer-col">
          <h3>Explore & Guide</h3>
          <a href="${routes.ingredients}">Ingredients</a>
          <a href="${routes.guide}">Skin Type Guide</a>
          <a href="${routes.about}">About Us</a>
          <a href="${routes.contact}">Contact</a>
        </div>
        <div class="footer-col">
          <h3>Account & Pages</h3>
          <a href="${routes.signin}">Sign In</a>
          <a href="${routes.signup}">Sign Up</a>
          <a href="${routes.privacy}">Privacy Policy</a>
          <a href="${routes.terms}">Terms & Conditions</a>
          <a href="${routes.comingSoon}">Coming Soon</a>
          <a href="${routes.error404}">404</a>
        </div>
        <div class="footer-col footer-contact">
          <h3>Contact</h3>
          <p><span class="contact-util-icon">${icon("mail")}</span> <a href="mailto:hello@glowe.com">hello@glowe.com</a></p>
          <p><span class="contact-util-icon">${icon("phone")}</span> <a href="tel:+919876543210">+91 98765 43210</a></p>
          <p><span class="contact-util-icon">${icon("clock-3")}</span> <span>Mon – Sat | 10 AM – 6 PM</span></p>
        </div>
      </div>
      <div class="container footer-bottom">
        <p>© <span data-year></span> Glowé Skincare Inc. All rights reserved. Clean science & botanical care.</p>
      </div>
    </footer>
    <button class="icon-btn back-to-top" type="button" aria-label="Back to top">${icon("chevron-up")}</button>`;

  const globalMarkup = `
    <div class="overlay" aria-hidden="true"></div>
    <aside class="drawer cart-drawer" aria-label="Shopping bag" aria-hidden="true">
      <div class="drawer-head">
        <div>
          <h2>Your Bag</h2>
          <span class="muted cart-item-count-text" style="font-size:12px">0 items</span>
        </div>
        <button class="icon-btn close-layer" type="button" aria-label="Close bag">${icon("x")}</button>
      </div>
      <div class="free-shipping-tracker">
        <div class="shipping-msg"><span>${icon("truck")} <strong class="shipping-threshold-text">Add ₹999 for FREE shipping</strong></span></div>
        <div class="shipping-progress-bar"><span class="shipping-progress-fill" style="width:0%"></span></div>
      </div>
      <div class="cart-items-container"></div>
      <div class="cart-footer">
        <div class="cart-promo-wrap">
          <input class="cart-promo-input" type="text" placeholder="Promo code (e.g. GLOW10)" autocomplete="off">
          <button class="btn btn-sm btn-soft cart-promo-btn" type="button">Apply</button>
        </div>
        <div class="cart-summary-rows">
          <div class="summary-row"><span>Subtotal</span><strong class="cart-subtotal-val">₹0</strong></div>
          <div class="summary-row promo-discount-row" style="display:none;color:var(--sage)"><span>Discount (10% off)</span><strong class="cart-discount-val">-₹0</strong></div>
          <div class="summary-row"><span>Estimated Shipping</span><strong class="cart-shipping-val">₹99</strong></div>
          <div class="summary-row total-row"><span>Total</span><strong class="cart-total-val">₹0</strong></div>
        </div>
        <button class="btn btn-coral cart-checkout-btn" style="width:100%" type="button">Proceed to Checkout ${icon("arrow-right")}</button>
        <button class="clear-cart-link" type="button">Clear Shopping Bag</button>
      </div>
      <div class="cart-empty">
        <span class="round-icon">${icon("shopping-bag")}</span>
        <h3>Your bag is waiting</h3>
        <p>Add your Glowé favorites and they’ll appear here.</p>
        <a class="btn btn-soft close-layer" href="${routes.shop}">Explore products</a>
      </div>
    </aside>
    <section class="search-panel" aria-label="Site search" aria-hidden="true">
      <div class="search-inner">
        <div class="drawer-head">
          <span class="eyebrow">${icon("sparkles")} Search Glowé Store</span>
          <button class="icon-btn close-layer" type="button" aria-label="Close search">${icon("x")}</button>
        </div>
        <form class="search-row" role="search">
          <label class="sr-only" for="site-search">Search products, ingredients and routines</label>
          <input id="site-search" type="search" placeholder="Search serums, cleansers, ingredients..." autocomplete="off">
          <button class="icon-btn" type="submit" aria-label="Submit search">${icon("arrow-right")}</button>
        </form>
        <div class="search-trending">
          <span class="muted" style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em">Trending Searches:</span>
          <div class="trending-tags">
            <button class="trending-tag" type="button">Niacinamide Serum</button>
            <button class="trending-tag" type="button">Sunscreen SPF 50</button>
            <button class="trending-tag" type="button">Hyaluronic Acid</button>
            <button class="trending-tag" type="button">Hydration Bundle</button>
            <button class="trending-tag" type="button">Skin Quiz</button>
            <button class="trending-tag" type="button">Ceramides</button>
          </div>
        </div>
        <div class="search-results-list" aria-live="polite"></div>
      </div>
    </section>
    <section class="modal quiz-modal" role="dialog" aria-modal="true" aria-labelledby="quiz-title" aria-hidden="true">
      <button class="icon-btn modal-close close-layer" type="button" aria-label="Close quiz">${icon("x")}</button>
      <span class="eyebrow">${icon("sparkles")} 2-Minute Skin Diagnostic</span>
      <h2 id="quiz-title">Meet your skin.</h2>
      <div class="quiz-progress"><span style="width:25%"></span></div>
      <div class="quiz-content"></div>
    </section>
    <section class="modal checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title" aria-hidden="true">
      <button class="icon-btn modal-close close-layer" type="button" aria-label="Close checkout">${icon("x")}</button>
      <div class="checkout-modal-body">
        <form id="checkout-form" class="checkout-form" novalidate>
          <span class="eyebrow">${icon("shield-check")} 256-Bit SSL Encrypted Checkout</span>
          <h2 id="checkout-title" style="margin-bottom:6px">Complete Your Order</h2>
          <p class="muted" style="font-size:13px;margin-bottom:20px">Enter your delivery details to finalize your skincare order.</p>
          <div class="checkout-grid">
            <div class="checkout-main-fields">
              <h3 class="checkout-section-heading">${icon("map-pin")} Delivery Address</h3>
              <div class="checkout-form-fields">
                <div class="field">
                  <label for="co-name">Full Name *</label>
                  <input id="co-name" name="name" type="text" required placeholder="e.g. Ananya Sharma" autocomplete="name">
                </div>
                <div class="field">
                  <label for="co-phone">Phone Number *</label>
                  <input id="co-phone" name="phone" type="tel" required placeholder="10-digit mobile number" autocomplete="tel">
                </div>
                <div class="field field-full">
                  <label for="co-email">Email Address *</label>
                  <input id="co-email" name="email" type="email" required placeholder="ananya@example.com" autocomplete="email">
                </div>
                <div class="field field-full">
                  <label for="co-address">Street Address / Flat / Building *</label>
                  <input id="co-address" name="address" type="text" required placeholder="Apartment, Street name, Landmark" autocomplete="street-address">
                </div>
                <div class="field">
                  <label for="co-city">City / Town *</label>
                  <input id="co-city" name="city" type="text" required placeholder="Mumbai / Delhi / Bengaluru" autocomplete="address-level2">
                </div>
                <div class="field">
                  <label for="co-pincode">PIN Code *</label>
                  <input id="co-pincode" name="pincode" type="text" pattern="[0-9]{6}" maxlength="6" required placeholder="6-digit PIN" autocomplete="postal-code">
                </div>
              </div>

              <h3 class="checkout-section-heading" style="margin-top:24px">${icon("credit-card")} Payment Method</h3>
              <div class="payment-methods-list">
                <label class="payment-option selected">
                  <input type="radio" name="payment-method" value="upi" checked>
                  <div class="payment-option-info">
                    <strong>UPI / QR (Instant & Safe)</strong>
                    <small>Google Pay, PhonePe, Paytm, BHIM</small>
                  </div>
                  <span class="badge" style="position:static">Instant</span>
                </label>
                <label class="payment-option">
                  <input type="radio" name="payment-method" value="card">
                  <div class="payment-option-info">
                    <strong>Credit / Debit Card</strong>
                    <small>Visa, Mastercard, RuPay, Amex</small>
                  </div>
                </label>
                <label class="payment-option">
                  <input type="radio" name="payment-method" value="cod">
                  <div class="payment-option-info">
                    <strong>Cash on Delivery (COD)</strong>
                    <small>Pay at your doorstep upon arrival</small>
                  </div>
                </label>
              </div>
            </div>

            <div class="checkout-sidebar-summary">
              <h3 class="checkout-section-heading">${icon("shopping-bag")} Order Summary</h3>
              <div class="checkout-items-preview"></div>
              <div class="checkout-price-breakdown">
                <div class="summary-row"><span>Subtotal</span><strong class="co-subtotal">₹0</strong></div>
                <div class="summary-row co-discount-row" style="color:var(--sage);display:none"><span>Promo Discount</span><strong class="co-discount">-₹0</strong></div>
                <div class="summary-row"><span>Estimated Shipping</span><strong class="co-shipping">FREE</strong></div>
                <div class="summary-row total-row"><span>Total Payable</span><strong class="co-total">₹0</strong></div>
              </div>
              <button class="btn btn-coral complete-order-btn" style="width:100%;margin-top:18px" type="submit">
                Place Order Now ${icon("shield-check")}
              </button>
              <p class="muted" style="font-size:11px;text-align:center;margin-top:10px;display:flex;align-items:center;justify-content:center;gap:5px">
                ${icon("lock")} 100% Secure Checkout & 14-Day Returns
              </p>
            </div>
          </div>
        </form>

        <div class="order-success-view" style="display:none;text-align:center;padding:20px 8px">
          <div class="round-icon" style="width:68px;height:68px;margin:0 auto 16px;background:var(--blush);color:var(--coral)">
            ${icon("check-circle-2", 'style="width:36px;height:36px"')}
          </div>
          <span class="eyebrow">${icon("sparkles")} Order Confirmed</span>
          <h2 style="font-size:clamp(1.8rem,3.5vw,2.4rem);margin-bottom:8px">Thank You For Glowing With Us!</h2>
          <p class="lead" style="margin:0 auto 16px;max-width:480px">Your order <strong class="order-id-badge" style="color:var(--coral-dark)">#GLW-782910</strong> has been received and is being prepared with clean care.</p>
          <div class="order-details-card" style="background:var(--blush);border-radius:12px;padding:18px 22px;margin:20px auto;max-width:440px;text-align:left;border:1px solid var(--line);display:flex;flex-direction:column;gap:8px">
            <div class="summary-row" style="display:flex;justify-content:space-between;font-size:13px"><span>Estimated Delivery:</span><strong>3 – 4 Business Days</strong></div>
            <div class="summary-row" style="display:flex;justify-content:space-between;font-size:13px"><span>Payment Status:</span><strong style="color:var(--sage)">Paid / Confirmed</strong></div>
            <div class="summary-row" style="display:flex;justify-content:space-between;font-size:14px;font-weight:750;padding-top:6px;border-top:1px dashed var(--line)"><span>Order Total:</span><strong class="order-confirmed-total">₹0</strong></div>
          </div>
          <div style="display:flex;gap:12px;justify-content:center;margin-top:24px;flex-wrap:wrap">
            <button class="btn btn-coral close-layer finish-order-btn" type="button">Continue Shopping</button>
            <a class="btn btn-outline" href="${routes.shop}">Explore More Products</a>
          </div>
        </div>
      </div>
    </section>
    <div class="toast" role="status" aria-live="polite"></div>`;

  const headerTarget = $("[data-site-header]");
  const footerTarget = $("[data-site-footer]");
  if (headerTarget) headerTarget.innerHTML = headerMarkup;
  if (footerTarget) footerTarget.innerHTML = footerMarkup;
  body.insertAdjacentHTML("beforeend", globalMarkup);

  const refreshIcons = () => {
    if (window.lucide) {
      window.lucide.createIcons({ attrs: { "aria-hidden": "true" } });
    }
  };
  refreshIcons();

  const navPage = page === "skin" ? "guide" : page;
  if (navPage === "home" || navPage === "home-1" || navPage === "home-2") {
    const isAlt = window.location.pathname.endsWith("index1.html") || navPage === "home-2";
    $$(`[data-nav="${isAlt ? 'home-2' : 'home-1'}"]`).forEach(el => el.classList.add("active"));
    $$(`[data-nav="home"]`).forEach(el => el.classList.add("active"));
  } else if (["about", "signin", "signup", "privacy", "terms", "404", "coming"].includes(navPage)) {
    $$(`[data-nav="${navPage}"]`).forEach(el => el.classList.add("active"));
    $$(`[data-nav="pages"]`).forEach(el => el.classList.add("active"));
  } else {
    $$(`[data-nav="${navPage}"]`).forEach(el => el.classList.add("active"));
  }
  $$("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  // Toast System
  let toastTimer;
  function showToast(message, isSuccess = true) {
    const toast = $(".toast");
    if (!toast) return;
    toast.innerHTML = `${icon(isSuccess ? "check-circle-2" : "info")} <span>${message}</span>`;
    refreshIcons();
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
  }

  // Overlays & Layers Management
  const overlay = $(".overlay");
  const mobileNavDrawer = $(".mobile-drawer-nav");
  const layers = [$(".cart-drawer"), $(".search-panel"), $(".quiz-modal"), $(".checkout-modal"), mobileNavDrawer];
  let lastFocus = null;

  function setLayer(layer, open) {
    if (!layer) return;
    if (open) lastFocus = document.activeElement;
    layer.classList.toggle("open", open);
    layer.setAttribute("aria-hidden", String(!open));
    overlay.classList.toggle("open", open);
    body.classList.toggle("no-scroll", open);
    if (open) {
      setTimeout(() => $("button, input, a", layer)?.focus(), 120);
      refreshIcons();
    }
  }

  function closeLayers() {
    layers.forEach(layer => layer?.classList.remove("open"));
    $(".filter-sidebar")?.classList.remove("open");
    overlay.classList.remove("open");
    body.classList.remove("no-scroll");
    layers.forEach(layer => layer?.setAttribute("aria-hidden", "true"));
    $(".menu-toggle")?.setAttribute("aria-expanded", "false");
    if (lastFocus instanceof HTMLElement) lastFocus.focus();
  }

  $(".cart-button")?.addEventListener("click", () => {
    renderCartDrawer();
    setLayer($(".cart-drawer"), true);
  });
  $(".search-button")?.addEventListener("click", () => {
    setLayer($(".search-panel"), true);
    setTimeout(() => $("#site-search")?.focus(), 150);
  });
  overlay.addEventListener("click", closeLayers);
  $$(".close-layer").forEach(el => el.addEventListener("click", closeLayers));
  $(".close-mobile-nav")?.addEventListener("click", closeLayers);

  // Mobile Menu Toggle
  const menuButton = $(".menu-toggle");
  menuButton?.addEventListener("click", () => {
    const open = !mobileNavDrawer.classList.contains("open");
    setLayer(mobileNavDrawer, open);
    menuButton.setAttribute("aria-expanded", String(open));
  });

  // Close layers on Esc or Tab Trap
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeLayers();
    const activeLayer = layers.find(layer => layer?.classList.contains("open"));
    if (e.key === "Tab" && activeLayer) {
      const focusable = $$('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])', activeLayer).filter(el => el.getAttribute("aria-hidden") !== "true");
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Theme Management (Dark / Light)
  const storedTheme = localStorage.getItem("glowe-theme");
  const systemTheme = matchMedia("(prefers-color-scheme: dark)");
  document.documentElement.dataset.theme = storedTheme || (systemTheme.matches ? "dark" : "light");
  document.documentElement.dataset.themeSource = storedTheme ? "user" : "system";

  const updateThemeButtons = () => {
    const isDark = document.documentElement.dataset.theme === "dark";
    $$(".theme-button").forEach(btn => {
      btn.innerHTML = icon(isDark ? "sun" : "moon");
      btn.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} mode`);
      btn.setAttribute("title", `Switch to ${isDark ? "light" : "dark"} mode`);
    });
    refreshIcons();
  };

  function toggleTheme() {
    const isDark = document.documentElement.dataset.theme === "dark";
    const nextTheme = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.dataset.themeSource = "user";
    localStorage.setItem("glowe-theme", nextTheme);
    updateThemeButtons();
    showToast(`Switched to ${nextTheme} mode`);
  }

  systemTheme.addEventListener?.("change", event => {
    if (document.documentElement.dataset.themeSource === "system") {
      document.documentElement.dataset.theme = event.matches ? "dark" : "light";
      updateThemeButtons();
    }
  });
  updateThemeButtons();

  // RTL / LTR Management
  const storedDir = localStorage.getItem("glowe-dir") || "ltr";
  document.documentElement.dir = storedDir;

  function updateRtlButtons() {
    const isRtl = document.documentElement.dir === "rtl";
    $$(".rtl-button").forEach(btn => {
      btn.innerHTML = `<span class="dir-badge">${isRtl ? "LTR" : "RTL"}</span>`;
      btn.setAttribute("aria-label", `Switch to ${isRtl ? "left-to-right (LTR)" : "right-to-left (RTL)"} layout`);
      btn.setAttribute("title", `Switch to ${isRtl ? "LTR" : "RTL"}`);
    });
  }

  function toggleDir() {
    const next = document.documentElement.dir === "rtl" ? "ltr" : "rtl";
    document.documentElement.dir = next;
    localStorage.setItem("glowe-dir", next);
    updateRtlButtons();
    showToast(next === "rtl" ? "RTL layout enabled" : "Left-to-right (LTR) layout enabled");
  }

  updateRtlButtons();

  // Unified Document Delegation for Theme and RTL buttons
  document.addEventListener("click", e => {
    const themeBtn = e.target.closest(".theme-button");
    if (themeBtn) {
      e.preventDefault();
      toggleTheme();
      return;
    }
    const rtlBtn = e.target.closest(".rtl-button");
    if (rtlBtn) {
      e.preventDefault();
      toggleDir();
      return;
    }
  });

  // High Performance RAF Throttled Scroll Header & Back To Top
  const header = $(".site-header");
  const backTop = $(".back-to-top");
  let isScrolled = false;
  let isBackTop = false;
  let scrollTicking = false;

  const updateScrollState = () => {
    const y = window.scrollY;
    const nextScrolled = y > 12;
    const nextBackTop = y > 450;

    if (nextScrolled !== isScrolled) {
      isScrolled = nextScrolled;
      header?.classList.toggle("scrolled", isScrolled);
    }
    if (nextBackTop !== isBackTop) {
      isBackTop = nextBackTop;
      backTop?.classList.toggle("show", isBackTop);
    }
    scrollTicking = false;
  };

  const onScroll = () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(updateScrollState);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  updateScrollState();
  backTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Smooth Staggered Reveal On Scroll Animation
  const revealObserver = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }) : null;

  $$("[data-reveal]").forEach(el => {
    const parent = el.parentElement;
    if (parent && !el.style.getPropertyValue("--delay")) {
      const siblings = Array.from(parent.children).filter(c => c.hasAttribute("data-reveal"));
      const idx = siblings.indexOf(el);
      if (idx >= 0) {
        el.style.setProperty("--delay", `${(idx % 6) * 50}ms`);
      }
    }
    revealObserver ? revealObserver.observe(el) : el.classList.add("revealed");
  });

  // ==========================================
  // SHOPPING CART STATE & DRAWER SYSTEM
  // ==========================================
  let promoApplied = false;

  function getCart() {
    try {
      const data = localStorage.getItem("glowe-cart-items-v2");
      let items = data ? JSON.parse(data) : [];
      let updated = false;
      items.forEach(item => {
        const key = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const catalogPhoto = productCatalog[key]?.photo;
        const usesLegacyProductSprite = /^product-[1-6]$/.test(item.photo || "");
        if (!item.photo || item.photo.trim() === "" || item.photo === "undefined" || (catalogPhoto && usesLegacyProductSprite)) {
          item.photo = catalogPhoto || "product-1";
          updated = true;
        }
      });
      if (updated) localStorage.setItem("glowe-cart-items-v2", JSON.stringify(items));
      return items;
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem("glowe-cart-items-v2", JSON.stringify(cart));
    updateCartCount();
  }

  function updateCartCount() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    $$(".cart-count").forEach(el => {
      el.textContent = totalCount;
      el.classList.remove("cart-bump");
      void el.offsetWidth; // trigger reflow for smooth animation replay
      el.classList.add("cart-bump");
    });
    const countText = $(".cart-item-count-text");
    if (countText) countText.textContent = `${totalCount} item${totalCount === 1 ? "" : "s"}`;
  }

  function addToCart(productName, price, photoClass) {
    const cart = getCart();
    // Normalize lookup
    const key = productName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const meta = productCatalog[key] || {
      name: productName,
      price: price || 999,
      photo: photoClass || "product-1",
      category: "Skincare"
    };

    let photoToUse = meta.photo;
    if (!photoToUse && photoClass) {
      const match = String(photoClass).match(/(product-\d|bundle-\d)/);
      photoToUse = match ? match[0] : photoClass;
    }
    if (!photoToUse) photoToUse = "product-1";

    const existing = cart.find(item => item.name === meta.name);
    if (existing) {
      existing.quantity += 1;
      if (!existing.photo) existing.photo = photoToUse;
    } else {
      cart.push({
        id: key,
        name: meta.name,
        price: meta.price,
        photo: photoToUse,
        category: meta.category,
        quantity: 1
      });
    }

    saveCart(cart);
    renderCartDrawer();
    showToast(`Added “${meta.name}” to your bag`);
  }

  function updateCartItemQty(id, delta) {
    let cart = getCart();
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
    saveCart(cart);
    renderCartDrawer();
  }

  function removeCartItem(id) {
    let cart = getCart();
    cart = cart.filter(i => i.id !== id);
    saveCart(cart);
    renderCartDrawer();
    showToast("Item removed from bag");
  }

  function clearCart() {
    saveCart([]);
    promoApplied = false;
    renderCartDrawer();
    showToast("Shopping bag cleared");
  }

  function renderCartDrawer() {
    const cart = getCart();
    const drawer = $(".cart-drawer");
    if (!drawer) return;

    const emptyView = $(".cart-empty", drawer);
    const itemsContainer = $(".cart-items-container", drawer);
    const footer = $(".cart-footer", drawer);
    const tracker = $(".free-shipping-tracker", drawer);

    if (cart.length === 0) {
      emptyView.style.display = "grid";
      itemsContainer.style.display = "none";
      footer.style.display = "none";
      tracker.style.display = "none";
      return;
    }

    emptyView.style.display = "none";
    itemsContainer.style.display = "block";
    footer.style.display = "block";
    tracker.style.display = "block";

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
    const shipping = subtotal >= 999 ? 0 : 99;
    const total = subtotal - discount + shipping;

    // Free shipping tracker
    const freeShippingProgress = Math.min(100, Math.round((subtotal / 999) * 100));
    const fillEl = $(".shipping-progress-fill", drawer);
    const thresholdText = $(".shipping-threshold-text", drawer);
    if (fillEl) fillEl.style.width = `${freeShippingProgress}%`;
    if (thresholdText) {
      if (subtotal >= 999) {
        thresholdText.innerHTML = "🎉 <strong>FREE Shipping Unlocked!</strong>";
      } else {
        thresholdText.innerHTML = `Add <strong>₹${999 - subtotal}</strong> more for <strong>FREE Shipping</strong>`;
      }
    }

    // Render items
    itemsContainer.innerHTML = cart.map(item => `
      <article class="cart-item" data-id="${item.id}">
        <div class="cart-item-photo ${item.photo}"></div>
        <div class="cart-item-details">
          <div class="cart-item-title-row">
            <h4>${item.name}</h4>
            <button class="cart-item-remove" type="button" data-remove="${item.id}" aria-label="Remove ${item.name}">${icon("trash-2")}</button>
          </div>
          <span class="cart-item-category">${item.category}</span>
          <div class="cart-item-bottom">
            <div class="cart-qty-stepper">
              <button type="button" data-qty-change="-1" data-id="${item.id}" aria-label="Decrease quantity">${icon("minus")}</button>
              <span>${item.quantity}</span>
              <button type="button" data-qty-change="1" data-id="${item.id}" aria-label="Increase quantity">${icon("plus")}</button>
            </div>
            <span class="cart-item-price">₹${(item.price * item.quantity).toLocaleString("en-IN")}</span>
          </div>
        </div>
      </article>
    `).join("");

    // Summary numbers
    $(".cart-subtotal-val", drawer).textContent = `₹${subtotal.toLocaleString("en-IN")}`;
    $(".cart-shipping-val", drawer).textContent = shipping === 0 ? "FREE" : `₹${shipping}`;
    $(".cart-total-val", drawer).textContent = `₹${total.toLocaleString("en-IN")}`;

    const promoRow = $(".promo-discount-row", drawer);
    if (promoRow) {
      promoRow.style.display = promoApplied ? "flex" : "none";
      $(".cart-discount-val", drawer).textContent = `-₹${discount.toLocaleString("en-IN")}`;
    }

    // Wire item buttons
    $$("[data-remove]", itemsContainer).forEach(btn => {
      btn.addEventListener("click", () => removeCartItem(btn.dataset.remove));
    });
    $$("[data-qty-change]", itemsContainer).forEach(btn => {
      btn.addEventListener("click", () => updateCartItemQty(btn.dataset.id, Number(btn.dataset.qtyChange)));
    });

    refreshIcons();
  }

  // Promo Code Handler
  $(".cart-promo-btn")?.addEventListener("click", () => {
    const input = $(".cart-promo-input");
    const code = input?.value.trim().toUpperCase();
    if (!code) return;
    if (code === "GLOW10" || code === "GLOWE10") {
      promoApplied = true;
      showToast("Coupon GLOW10 applied! 10% discount added.");
      renderCartDrawer();
    } else {
      showToast("Invalid promo code. Try GLOW10 for 10% off.", false);
    }
  });

  // ==========================================
  // CHECKOUT ENGINE & MODAL SYSTEM
  // ==========================================
  function openCheckout() {
    const cart = getCart();
    if (!cart.length) {
      showToast("Your shopping bag is empty. Please add products first!", false);
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
    const shipping = subtotal >= 999 ? 0 : 99;
    const total = subtotal - discount + shipping;

    // Render items preview in checkout modal
    const itemsPreview = $(".checkout-items-preview");
    if (itemsPreview) {
      itemsPreview.innerHTML = cart.map(item => `
        <div class="checkout-item-row">
          <div class="checkout-item-thumb ${item.photo}"></div>
          <div class="checkout-item-meta">
            <div class="checkout-item-name">${item.name}</div>
            <small class="muted">Qty: ${item.quantity} × ₹${item.price.toLocaleString("en-IN")}</small>
          </div>
          <strong style="color:var(--ink)">₹${(item.price * item.quantity).toLocaleString("en-IN")}</strong>
        </div>
      `).join("");
    }

    // Update numbers
    const coSubtotal = $(".co-subtotal");
    const coDiscountRow = $(".co-discount-row");
    const coDiscount = $(".co-discount");
    const coShipping = $(".co-shipping");
    const coTotal = $(".co-total");
    const completeOrderBtn = $(".complete-order-btn");

    if (coSubtotal) coSubtotal.textContent = `₹${subtotal.toLocaleString("en-IN")}`;
    if (coDiscountRow) {
      coDiscountRow.style.display = promoApplied ? "flex" : "none";
      if (coDiscount) coDiscount.textContent = `-₹${discount.toLocaleString("en-IN")}`;
    }
    if (coShipping) coShipping.textContent = shipping === 0 ? "FREE" : `₹${shipping}`;
    if (coTotal) coTotal.textContent = `₹${total.toLocaleString("en-IN")}`;
    if (completeOrderBtn) completeOrderBtn.innerHTML = `Place Order Now (₹${total.toLocaleString("en-IN")}) ${icon("shield-check")}`;

    // Reset views
    const coForm = $("#checkout-form");
    const successView = $(".order-success-view");
    if (coForm) coForm.style.display = "block";
    if (successView) successView.style.display = "none";

    // Close cart drawer, open checkout modal
    closeLayers();
    setLayer($(".checkout-modal"), true);
    refreshIcons();
  }

  // Global Checkout Trigger Delegation
  document.addEventListener("click", e => {
    if (e.target.closest(".cart-checkout-btn") || e.target.closest("[data-open-checkout]")) {
      e.preventDefault();
      openCheckout();
    }
    if (e.target.closest(".finish-order-btn")) {
      closeLayers();
    }
  });

  // Payment Options Radio Selection Sync
  document.addEventListener("change", e => {
    if (e.target.name === "payment-method") {
      $$(".payment-option").forEach(opt => {
        const input = opt.querySelector('input[type="radio"]');
        opt.classList.toggle("selected", input && input.checked);
      });
    }
  });

  // Checkout Form Submission
  $("#checkout-form")?.addEventListener("submit", e => {
    e.preventDefault();
    const form = e.target;
    const nameInput = $("#co-name", form);
    const phoneInput = $("#co-phone", form);
    const emailInput = $("#co-email", form);
    const addrInput = $("#co-address", form);
    const cityInput = $("#co-city", form);
    const pinInput = $("#co-pincode", form);

    const name = nameInput?.value.trim();
    const phone = phoneInput?.value.trim();
    const email = emailInput?.value.trim();
    const address = addrInput?.value.trim();
    const city = cityInput?.value.trim();
    const pin = pinInput?.value.trim();

    if (!name || !phone || !email || !address || !city || !pin) {
      showToast("Please fill in all required delivery fields.", false);
      const firstInvalid = form.querySelector("input:invalid") || form.querySelector("input:placeholder-shown");
      firstInvalid?.focus();
      return;
    }

    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      showToast("Please enter a valid 6-digit PIN code.", false);
      pinInput?.focus();
      return;
    }

    const submitBtn = $(".complete-order-btn", form);
    const originalText = submitBtn?.innerHTML || "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Processing Order...`;
    }

    setTimeout(() => {
      const cart = getCart();
      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
      const shipping = subtotal >= 999 ? 0 : 99;
      const total = subtotal - discount + shipping;

      const orderId = `#GLW-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderIdBadge = $(".order-id-badge");
      const orderTotalVal = $(".order-confirmed-total");

      if (orderIdBadge) orderIdBadge.textContent = orderId;
      if (orderTotalVal) orderTotalVal.textContent = `₹${total.toLocaleString("en-IN")}`;

      form.style.display = "none";
      const successView = $(".order-success-view");
      if (successView) successView.style.display = "block";

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }

      clearCart();
      showToast(`🎉 Order ${orderId} confirmed! Thank you, ${name.split(" ")[0]}.`);
      refreshIcons();
    }, 600);
  });

  $(".clear-cart-link")?.addEventListener("click", clearCart);

  // Initialize Cart items from legacy storage or default
  if (!localStorage.getItem("glowe-cart-items-v2")) {
    const legacyCount = Number(localStorage.getItem("glowe-cart-count") || 0);
    if (legacyCount > 0) {
      saveCart([
        { id: "niacinamide-serum", name: "Niacinamide Radiance Serum", price: 1299, photo: "product-image-niacinamide-radiance-serum", category: "Serums", quantity: legacyCount }
      ]);
    } else {
      saveCart([]);
    }
  }
  updateCartCount();

  // Global Add To Cart Event Delegation
  document.addEventListener("click", e => {
    const button = e.target.closest("[data-add-cart]");
    if (!button) return;
    const card = button.closest(".product-card") || button.closest(".bundle-card") || button.closest(".routine-step");
    let name = button.dataset.product;
    let price = button.dataset.price ? Number(button.dataset.price) : null;
    let photo = "";

    if (!name && card) {
      name = card.querySelector("h3")?.textContent.trim();
      const priceText = card.querySelector(".price, .bundle-price")?.textContent.replace(/[^0-9]/g, "");
      if (priceText) price = Number(priceText);
      const photoEl = card.querySelector(".product-photo, .bundle-photo");
      if (photoEl) photo = photoEl.className;
    }

    if (name) {
      addToCart(name, price, photo);
      const originalHtml = button.innerHTML;
      const isRound = button.classList.contains("card-cart") || button.classList.contains("icon-btn");
      if (isRound) {
        button.classList.add("added");
        button.innerHTML = icon("check");
      } else {
        button.innerHTML = `${icon("check")} <span>Added</span>`;
      }
      refreshIcons();
      setTimeout(() => {
        if (isRound) button.classList.remove("added");
        button.innerHTML = originalHtml;
        refreshIcons();
      }, 1200);
    }
  });

  // Slider Carousel Controls
  $$("[data-slider]").forEach(slider => {
    const controls = slider.closest("section")?.querySelectorAll("[data-slide]") || [];
    controls.forEach(control => control.addEventListener("click", () => {
      const offset = (control.dataset.slide === "next" ? 1 : -1) * (slider.clientWidth * 0.75);
      slider.scrollBy({ left: offset, behavior: "smooth" });
    }));
  });

  // ==========================================
  // LIVE SEARCH & AUTO-SUGGESTIONS
  // ==========================================
  const searchInput = $("#site-search");
  const searchResultsContainer = $(".search-results-list");

  const searchDatabase = [
    { title: "Creamy Hydrating Cleanser", type: "Product", category: "Cleansers", price: "₹899", url: routes.shop, photo: "product-image-creamy-hydrating-cleanser" },
    { title: "Niacinamide Radiance Serum", type: "Product", category: "Serums", price: "₹1,299", url: routes.shop, photo: "product-image-niacinamide-radiance-serum" },
    { title: "Rich Barrier Moisturizer", type: "Product", category: "Moisturizers", price: "₹1,199", url: routes.shop, photo: "product-image-rich-barrier-moisturizer" },
    { title: "Invisible Shield Sunscreen SPF 50", type: "Product", category: "Sunscreens", price: "₹999", url: routes.shop, photo: "product-image-invisible-shield-sunscreen-spf-50" },
    { title: "Hyaluronic Acid Hydra Boost Serum", type: "Product", category: "Serums", price: "₹1,399", url: routes.shop, photo: "product-image-hyaluronic-acid-hydra-boost-serum" },
    { title: "Clay Detox Face Mask", type: "Product", category: "Face Masks", price: "₹899", url: routes.shop, photo: "product-image-clay-detox-face-mask" },
    { title: "Vitamin C Brightening Serum", type: "Product", category: "Serums", price: "₹1,299", url: routes.shop, photo: "product-image-vitamin-c-brightening-serum" },
    { title: "Oil Control Cleanser", type: "Product", category: "Cleansers", price: "₹899", url: routes.shop, photo: "product-image-oil-control-cleanser" },
    { title: "Overnight Glow Mask", type: "Product", category: "Face Masks", price: "₹999", url: routes.shop, photo: "product-image-overnight-glow-mask" },
    { title: "Glowing Skin Essentials", type: "Bundle", category: "Bundles", price: "₹2,499", url: routes.bundles, photo: "bundle-1" },
    { title: "Hydration Boost Bundle", type: "Bundle", category: "Bundles", price: "₹2,099", url: routes.bundles, photo: "bundle-2" },
    { title: "Acne Control Bundle", type: "Bundle", category: "Bundles", price: "₹2,399", url: routes.bundles, photo: "bundle-3" },
    { title: "Brightening & Radiance Set", type: "Bundle", category: "Bundles", price: "₹2,699", url: routes.bundles, photo: "bundle-4" },
    { title: "Anti-Aging Essentials", type: "Bundle", category: "Bundles", price: "₹3,299", url: routes.bundles, photo: "bundle-5" },
    { title: "Pure Calming Barrier Set", type: "Bundle", category: "Bundles", price: "₹2,599", url: routes.bundles, photo: "bundle-calming" },
    { title: "Pore Clarifying Trio", type: "Bundle", category: "Bundles", price: "₹2,299", url: routes.bundles, photo: "bundle-clarifying" },
    { title: "Hyaluronic Acid Ingredient Guide", type: "Ingredient", category: "Transparency", price: "Deep Hydration", url: routes.ingredients, photo: "ingredient-2 ingredient-sprite" },
    { title: "Niacinamide Active Standards", type: "Ingredient", category: "Transparency", price: "Pore Refining", url: routes.ingredients, photo: "ingredient-3 ingredient-sprite" },
    { title: "Centella Asiatica Soothing Care", type: "Ingredient", category: "Transparency", price: "Barrier Repair", url: routes.ingredients, photo: "ingredient-4 ingredient-sprite" },
    { title: "Skin Type Diagnostic & Bare-Faced Test", type: "Guide", category: "Skin Education", price: "Find Your Routine", url: routes.guide, photo: "model-guide model-sprite" },
    { title: "Complimentary Skin Consultation", type: "Service", category: "Expert Care", price: "Free Guidance", url: `${routes.contact}#consultation`, photo: "product-1" }
  ];

  function performSearch(query) {
    if (!searchResultsContainer) return;
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) {
      searchResultsContainer.innerHTML = "";
      return;
    }

    const matches = searchDatabase.filter(item =>
      item.title.toLowerCase().includes(cleanQuery) ||
      item.category.toLowerCase().includes(cleanQuery) ||
      item.type.toLowerCase().includes(cleanQuery)
    );

    if (matches.length === 0) {
      searchResultsContainer.innerHTML = `
        <div class="search-no-results">
          <p>No direct matches found for “<strong>${query}</strong>”.</p>
          <a class="btn btn-outline btn-sm" href="${routes.shop}">Browse Full Shop</a>
        </div>`;
      return;
    }

    searchResultsContainer.innerHTML = `
      <div class="search-results-grid">
        ${matches.map(item => `
          <a class="search-result-card" href="${item.url}">
            <div class="search-result-photo ${item.photo}"></div>
            <div class="search-result-info">
              <span class="search-result-tag">${item.type} · ${item.category}</span>
              <h4>${item.title}</h4>
              <span class="search-result-price">${item.price}</span>
            </div>
            ${icon("chevron-right")}
          </a>
        `).join("")}
      </div>`;
    refreshIcons();
  }

  searchInput?.addEventListener("input", e => performSearch(e.target.value));

  $$(".trending-tag").forEach(tag => {
    tag.addEventListener("click", () => {
      if (searchInput) {
        searchInput.value = tag.textContent.trim();
        performSearch(searchInput.value);
        searchInput.focus();
      }
    });
  });

  $(".search-row")?.addEventListener("submit", e => {
    e.preventDefault();
    const query = searchInput?.value.trim().toLowerCase();
    if (!query) return;
    const directMatch = searchDatabase.find(item => item.title.toLowerCase().includes(query));
    if (directMatch) {
      window.location.href = directMatch.url;
    } else {
      window.location.href = `${routes.shop}?query=${encodeURIComponent(query)}`;
    }
  });

  // ==========================================
  // INTERACTIVE SKIN QUIZ ENGINE
  // ==========================================
  const quizSteps = [
    {
      title: "What is your primary skincare goal?",
      subtitle: "Choose the main benefit you’d like to see in your skin.",
      options: [
        { label: "Deep & lasting hydration", tag: "Hydration" },
        { label: "Clear blemishes & minimize pores", tag: "Clarity" },
        { label: "Brighten dark spots & even tone", tag: "Radiance" },
        { label: "Soothe redness & calm sensitivity", tag: "Calming" }
      ]
    },
    {
      title: "How does your skin feel around midday?",
      subtitle: "Observe your natural skin behavior 4-5 hours after cleansing.",
      options: [
        { label: "Comfortable, smooth and balanced", result: "Normal" },
        { label: "Shiny, slick and oily all over", result: "Oily" },
        { label: "Tight, parched or flaky in areas", result: "Dry" },
        { label: "Oily in T-zone (forehead, nose), dry cheeks", result: "Combination" },
        { label: "Red, flushed, itchy or easily irritated", result: "Sensitive" }
      ]
    },
    {
      title: "What kind of skincare ritual fits your lifestyle?",
      subtitle: "We believe in rituals that you’ll actually enjoy keeping up.",
      options: [
        { label: "Simple & fast (2–3 daily essentials)", type: "Minimal" },
        { label: "A complete restorative morning & night ritual", type: "Complete" },
        { label: "Start with one targeted hero serum", type: "Targeted" },
        { label: "Flexible based on how my skin feels each day", type: "Custom" }
      ]
    }
  ];

  let quizStep = 0;
  const quizAnswers = [];

  function renderQuiz() {
    const content = $(".quiz-content");
    if (!content) return;

    if (quizStep >= quizSteps.length) {
      const middayAnswer = quizAnswers[1] || {};
      const skinType = middayAnswer.result || "Balanced";
      const goalAnswer = quizAnswers[0] || {};
      const goal = goalAnswer.tag || "Radiance";

      const progressSpan = $(".quiz-progress span");
      if (progressSpan) progressSpan.style.width = "100%";

      content.innerHTML = `
        <div class="quiz-result">
          <span class="eyebrow">${icon("sparkles")} Diagnostic Complete</span>
          <h2>Your Skin Profile: <span class="accent">${skinType} Skin</span></h2>
          <p class="lead">Based on your focus on <strong>${goal}</strong>, here is your curated daily ritual designed to strengthen your skin barrier without overwhelm.</p>
          
          <div class="quiz-routine-preview">
            <div class="routine-preview-item">
              <div class="routine-preview-badge">Step 1</div>
              <strong>${skinType === "Oily" ? "Oil Control Cleanser" : "Creamy Hydrating Cleanser"}</strong>
              <span class="muted">Gentle daily reset</span>
            </div>
            <div class="routine-preview-item">
              <div class="routine-preview-badge">Step 2</div>
              <strong>${goal === "Hydration" ? "Hyaluronic Acid Serum" : goal === "Calming" ? "Centella Recovery Serum" : "Niacinamide Radiance Serum"}</strong>
              <span class="muted">Targeted bio-active</span>
            </div>
            <div class="routine-preview-item">
              <div class="routine-preview-badge">Step 3</div>
              <strong>${skinType === "Oily" ? "Weightless Gel Moisturizer" : "Rich Barrier Moisturizer"}</strong>
              <span class="muted">Long-lasting comfort</span>
            </div>
            <div class="routine-preview-item">
              <div class="routine-preview-badge">Step 4</div>
              <strong>Invisible Shield Sunscreen SPF 50</strong>
              <span class="muted">UV & antioxidant barrier</span>
            </div>
          </div>

          <div class="hero-actions" style="margin-top:28px">
            <a class="btn btn-coral" href="${routes.guide}">Explore Full ${skinType} Routine ${icon("arrow-right")}</a>
            <button class="btn btn-outline quiz-restart" type="button">Retake Diagnostic</button>
          </div>
        </div>`;

      refreshIcons();
      $(".quiz-restart")?.addEventListener("click", () => {
        quizStep = 0;
        quizAnswers.length = 0;
        renderQuiz();
      });
      return;
    }

    const step = quizSteps[quizStep];
    const progressSpan = $(".quiz-progress span");
    if (progressSpan) progressSpan.style.width = `${((quizStep + 1) / quizSteps.length) * 100}%`;

    content.innerHTML = `
      <div class="quiz-step-header">
        <span class="muted" style="font-size:12px;font-weight:700;letter-spacing:.05em">Step ${quizStep + 1} of ${quizSteps.length}</span>
        ${quizStep > 0 ? `<button class="quiz-back-btn" type="button">${icon("arrow-left")} Back</button>` : ""}
      </div>
      <h3>${step.title}</h3>
      <p class="muted" style="font-size:13px;margin-bottom:20px">${step.subtitle}</p>
      <div class="quiz-options">
        ${step.options.map((opt, idx) => `
          <button class="quiz-option" type="button" data-index="${idx}">
            <span class="quiz-option-indicator"></span>
            <span>${opt.label}</span>
          </button>
        `).join("")}
      </div>`;

    refreshIcons();

    $$(".quiz-option", content).forEach(button => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.index);
        quizAnswers[quizStep] = step.options[index];
        button.classList.add("selected");
        setTimeout(() => {
          quizStep += 1;
          renderQuiz();
        }, 220);
      });
    });

    $(".quiz-back-btn")?.addEventListener("click", () => {
      if (quizStep > 0) {
        quizStep -= 1;
        renderQuiz();
      }
    });
  }

  $$("[data-open-quiz]").forEach(button => {
    button.addEventListener("click", () => {
      quizStep = 0;
      quizAnswers.length = 0;
      renderQuiz();
      setLayer($(".quiz-modal"), true);
    });
  });

  // ==========================================
  // FORM VALIDATION & INTERACTION
  // ==========================================
  function validateField(field) {
    const input = $("input, select, textarea", field);
    if (!input) return true;
    let message = "";
    const value = input.value.trim();

    if (input.required && !value) {
      message = "This field is required.";
    } else if (input.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      message = "Please enter a valid email address.";
    } else if (input.type === "tel" && value && !/^[+\d][\d\s-]{7,}$/.test(value)) {
      message = "Please enter a valid phone number.";
    } else if (input.minLength > 0 && value.length < input.minLength) {
      message = `Please use at least ${input.minLength} characters.`;
    }

    field.classList.toggle("invalid", Boolean(message));
    let error = $(".field-error", field);
    if (!error) {
      error = document.createElement("span");
      error.className = "field-error";
      field.append(error);
    }
    error.textContent = message;
    input.setAttribute("aria-invalid", String(Boolean(message)));
    return !message;
  }

  $$("[data-validate]").forEach(form => {
    $$(".field", form).forEach(field => {
      const input = $("input, select, textarea", field);
      input?.addEventListener("blur", () => validateField(field));
      input?.addEventListener("input", () => {
        if (field.classList.contains("invalid")) validateField(field);
      });
    });

    form.addEventListener("submit", e => {
      e.preventDefault();
      const fields = $$(".field", form);
      const valid = fields.map(validateField).every(Boolean);
      const consent = $('input[type="checkbox"][required]', form);
      if (consent && !consent.checked) {
        showToast("Please check the consent box to proceed.", false);
        return;
      }
      if (!valid) {
        $(".invalid input, .invalid select, .invalid textarea", form)?.focus();
        showToast("Please correct the errors in the form.", false);
        return;
      }
      showToast(form.dataset.success || "Thank you — your request was received successfully!");
      form.reset();
      $$(".field", form).forEach(f => f.classList.remove("invalid"));
    });
  });

  $$(".newsletter-form").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const input = $("input", form);
      if (!input.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        input.focus();
        input.setAttribute("aria-invalid", "true");
        showToast("Please enter a valid email address.", false);
        return;
      }
      input.setAttribute("aria-invalid", "false");
      showToast("Welcome to your weekly glow-up! Check your inbox.");
      form.reset();
    });
  });

  $$(".password-toggle").forEach(button => {
    button.addEventListener("click", () => {
      const input = button.parentElement.querySelector("input");
      if (!input) return;
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      button.innerHTML = icon(show ? "eye-off" : "eye");
      button.setAttribute("aria-label", show ? "Hide password" : "Show password");
      refreshIcons();
    });
  });

  // FAQ Accordion
  $$(".faq-question").forEach(button => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const open = item.classList.toggle("open");
      button.setAttribute("aria-expanded", String(open));
      const iconEl = $("i", button);
      if (iconEl) {
        iconEl.setAttribute("data-lucide", open ? "minus" : "plus");
        refreshIcons();
      }
    });
  });

  // ==========================================
  // SHOP FILTERING, PRICE SLIDER & SORTING
  // ==========================================
  const filterSidebar = $(".filter-sidebar");
  $(".mobile-filter-button")?.addEventListener("click", () => {
    filterSidebar?.classList.add("open");
    overlay.classList.add("open");
    body.classList.add("no-scroll");
  });

  $(".clear-filters")?.addEventListener("click", () => {
    $$(".filter-sidebar input[type='checkbox']").forEach(input => input.checked = false);
    const slider = $("#price-slider");
    if (slider) {
      slider.value = 3499;
      const label = $(".current-price-label");
      if (label) label.textContent = "₹3,499";
    }
    $$(".filter-tabs .filter-tab").forEach((b, i) => b.classList.toggle("active", i === 0));
    applyProductFilters("all");
  });

  function applyProductFilters(tabCategory) {
    const cards = $$(".product-grid .product-card");
    if (!cards.length) return;

    const activeCategory = tabCategory || $(".filter-tab.active")?.dataset.filter || "all";
    const selected = $$(".filter-sidebar input[type='checkbox']:checked").map(input => ({
      type: input.dataset.filterType,
      value: input.value
    }));

    const maxPrice = Number($("#price-slider")?.value || 3499);
    const groups = selected.reduce((map, filter) => {
      (map[filter.type] ||= []).push(filter.value);
      return map;
    }, {});

    let matchedCount = 0;
    cards.forEach(card => {
      const cardPrice = Number(card.dataset.price || 0);
      const priceMatch = cardPrice <= maxPrice;
      const tabMatch = activeCategory === "all" || card.dataset.category === activeCategory;
      const sideMatch = Object.entries(groups).every(([type, values]) => {
        if (values.includes("all")) return true;
        const cardVal = (card.dataset[type] || "");
        return values.some(val => cardVal.split(" ").includes(val));
      });

      if (tabMatch && sideMatch && priceMatch) {
        card.classList.remove("hidden");
        matchedCount++;
      } else {
        card.classList.add("hidden");
      }
    });

    const countEl = $("[data-product-count]");
    if (countEl) countEl.textContent = `${matchedCount} Product${matchedCount === 1 ? "" : "s"}`;
    $(".empty-state")?.classList.toggle("show", matchedCount === 0);
  }

  // Price Slider interaction
  const priceSlider = $("#price-slider");
  priceSlider?.addEventListener("input", e => {
    const val = Number(e.target.value);
    const label = $(".current-price-label");
    if (label) label.textContent = `₹${val.toLocaleString("en-IN")}`;
    applyProductFilters();
  });

  function applyBundleFilter(filter = "all") {
    let matchedCount = 0;
    const normalizedFilter = (filter || "all").toLowerCase().trim();
    $$(".bundle-card").forEach(card => {
      const skinTypes = (card.dataset.skin || "").toLowerCase().split(/\s+/).filter(Boolean);
      const match = normalizedFilter === "all" || skinTypes.includes(normalizedFilter);
      if (match) {
        card.classList.remove("hidden");
        card.removeAttribute("hidden");
        card.style.display = "flex";
        card.classList.add("revealed");
        matchedCount++;
      } else {
        card.classList.add("hidden");
        card.setAttribute("hidden", "");
        card.style.display = "none";
      }
    });
    const emptyEl = $(".bundle-empty-state");
    if (emptyEl) {
      emptyEl.style.display = matchedCount === 0 ? "block" : "none";
    }
  }

  $$(".filter-tabs .filter-tab").forEach(button => {
    button.addEventListener("click", () => {
      $$(".filter-tabs .filter-tab").forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      if (page === "shop") applyProductFilters(button.dataset.filter);
      if (page === "bundles") applyBundleFilter(button.dataset.filter);
    });
  });

  $$(".filter-sidebar input[type='checkbox']").forEach(input => {
    input.addEventListener("change", () => applyProductFilters());
  });

  $("#product-sort")?.addEventListener("change", e => {
    const grid = $(".product-grid");
    const cards = $$(".product-card", grid);
    const val = e.target.value;

    cards.sort((a, b) => {
      if (val === "price-low") return Number(a.dataset.price) - Number(b.dataset.price);
      if (val === "price-high") return Number(b.dataset.price) - Number(a.dataset.price);
      return Number(b.dataset.rating) - Number(a.dataset.rating);
    }).forEach(card => grid.insertBefore(card, $(".empty-state")));
    applyProductFilters(null, false);
  });

  if (page === "shop") {
    const category = new URLSearchParams(window.location.search).get("category");
    if (category) {
      const tab = $(`.filter-tab[data-filter="${category}"]`);
      tab?.click();
    } else {
      applyProductFilters("all");
    }
  }

  if (page === "bundles") {
    const skinParam = new URLSearchParams(window.location.search).get("filter") || new URLSearchParams(window.location.search).get("skin");
    if (skinParam) {
      const targetTab = $(`.filter-tab[data-filter="${skinParam.toLowerCase()}"]`);
      if (targetTab) {
        targetTab.click();
      } else {
        applyBundleFilter("all");
      }
    } else {
      applyBundleFilter("all");
    }
  }

  // ==========================================
  // INGREDIENTS FILTERING (PAGE: INGREDIENTS)
  // ==========================================
  $$(".ingredients-filter-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      $$(".ingredients-filter-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const category = tab.dataset.ingredientCategory;
      $$(".ingredient-item").forEach(item => {
        const itemCat = item.dataset.category || "";
        const show = category === "all" || itemCat.includes(category);
        item.style.display = show ? "grid" : "none";
      });
    });
  });

  // ==========================================
  // SKIN GUIDE & BARE-FACED TEST ROUTINE ENGINE
  // ==========================================
  const routineData = {
    normal: [
      { name: "Creamy Hydrating Cleanser", desc: "Gently removes impurities while preserving natural hydration.", photo: "product-image-creamy-hydrating-cleanser", file: "creamy-hydrating-cleanser.png", price: 899 },
      { name: "Vitamin C Brightening Serum", desc: "Potent daily antioxidant boost for healthy daytime radiance.", photo: "product-image-vitamin-c-brightening-serum", file: "vitamin-c-brightening-serum.png", price: 1299 },
      { name: "Rich Barrier Moisturizer", desc: "Long-lasting barrier comfort without greasy residue.", photo: "product-image-rich-barrier-moisturizer", file: "rich-barrier-moisturizer.png", price: 1199 },
      { name: "Invisible Shield Sunscreen SPF 50", desc: "Ultra-light broad spectrum UV defense with zero white cast.", photo: "product-image-invisible-shield-sunscreen-spf-50", file: "invisible-shield-sunscreen-spf-50.png", price: 999 }
    ],
    oily: [
      { name: "Oil Control Cleanser", desc: "Purifies excess sebum, clears blackheads & unclogs congested pores.", photo: "product-image-oil-control-cleanser", file: "oil-control-cleanser.png", price: 899 },
      { name: "Niacinamide Radiance Serum", desc: "10% Niacinamide + Zinc PCA to tighten pores & balance sebum.", photo: "product-image-niacinamide-radiance-serum", file: "niacinamide-radiance-serum.png", price: 1299 },
      { name: "Weightless Gel Moisturizer", desc: "Refreshing water-burst hydration that keeps skin matte & soft.", photo: "product-image-weightless-gel-moisturizer", file: "weightless-gel-moisturizer.png", price: 1199 },
      { name: "Invisible Shield Sunscreen SPF 50", desc: "Non-comedogenic, shine-free daily broad-spectrum sun defense.", photo: "product-image-invisible-shield-sunscreen-spf-50", file: "invisible-shield-sunscreen-spf-50.png", price: 999 }
    ],
    dry: [
      { name: "Creamy Hydrating Cleanser", desc: "Rich comforting wash that cleanses without any tight feeling.", photo: "product-image-creamy-hydrating-cleanser", file: "creamy-hydrating-cleanser.png", price: 899 },
      { name: "Hyaluronic Acid Hydra Boost Serum", desc: "Multi-depth hydration replenishing water reservoirs in parched skin.", photo: "product-image-hyaluronic-acid-hydra-boost-serum", file: "hyaluronic-acid-hydra-boost-serum.png", price: 1399 },
      { name: "Ceramide Cloud Cream", desc: "Multi-ceramide barrier butter that seals moisture & prevents flaking.", photo: "product-image-ceramide-cloud-cream", file: "ceramide-cloud-cream.png", price: 1249 },
      { name: "Mineral Veil SPF 50", desc: "Nourishing physical shield preventing moisture loss and sun damage.", photo: "product-image-mineral-veil-spf-50", file: "mineral-veil-spf-50.png", price: 999 }
    ],
    combination: [
      { name: "Oil Control Cleanser", desc: "Purifies oily forehead & nose areas while keeping cheeks calm.", photo: "product-image-oil-control-cleanser", file: "oil-control-cleanser.png", price: 899 },
      { name: "Vitamin C Brightening Serum", desc: "Dual-action antioxidant serum that evens tone and brightens dull zones.", photo: "product-image-vitamin-c-brightening-serum", file: "vitamin-c-brightening-serum.png", price: 1299 },
      { name: "Weightless Gel Moisturizer", desc: "Adaptive lightweight hydration that balances dual skin zones.", photo: "product-image-weightless-gel-moisturizer", file: "weightless-gel-moisturizer.png", price: 1199 },
      { name: "Invisible Shield Sunscreen SPF 50", desc: "Breathable daily barrier against UVA/UVB rays with matte finish.", photo: "product-image-invisible-shield-sunscreen-spf-50", file: "invisible-shield-sunscreen-spf-50.png", price: 999 }
    ],
    sensitive: [
      { name: "Creamy Hydrating Cleanser", desc: "Ultra-gentle soothing formula that cleanses without redness or stinging.", photo: "product-image-creamy-hydrating-cleanser", file: "creamy-hydrating-cleanser.png", price: 899 },
      { name: "Centella Recovery Serum", desc: "Centella Asiatica active soothing irritation & strengthening barrier.", photo: "product-image-centella-recovery-serum", file: "centella-recovery-serum.png", price: 1299 },
      { name: "Ceramide Cloud Cream", desc: "Hypoallergenic barrier recovery cream for sensitive complexions.", photo: "product-image-ceramide-cloud-cream", file: "ceramide-cloud-cream.png", price: 1249 },
      { name: "Mineral Veil SPF 50", desc: "100% mineral zinc oxide gentle UV defense for reactive skin.", photo: "product-image-mineral-veil-spf-50", file: "mineral-veil-spf-50.png", price: 999 }
    ]
  };

  function updateRoutineDisplay(routineKey) {
    const items = routineData[routineKey];
    if (!items) return;

    $$(".routine-step").forEach((step, i) => {
      const data = items[i];
      if (!data) return;
      const card = step.querySelector(".product-card");
      if (card) {
        card.style.opacity = "0.35";
        card.style.transform = "translateY(6px)";
        setTimeout(() => {
          const titleEl = step.querySelector("h3");
          const descEl = step.querySelector("p");
          const photoEl = step.querySelector(".product-photo");
          const priceEl = step.querySelector(".price");
          if (titleEl) titleEl.textContent = data.name;
          if (descEl) descEl.textContent = data.desc;
          if (priceEl) priceEl.textContent = `₹${data.price.toLocaleString("en-IN")}`;
          if (photoEl) {
            photoEl.className = `product-photo ${data.photo}`;
            photoEl.setAttribute("aria-label", data.name);
            const depth = document.body.dataset.depth === "1" ? "../assets/images/shop/" : "assets/images/shop/";
            if (data.file) {
              photoEl.style.backgroundImage = `url("${depth}${data.file}")`;
              photoEl.style.backgroundSize = "cover";
              photoEl.style.backgroundPosition = "center";
            }
          }
          const cartBtn = step.querySelector("[data-add-cart]");
          if (cartBtn) {
            cartBtn.dataset.product = data.name;
            cartBtn.dataset.price = data.price;
            cartBtn.setAttribute("aria-label", `Add ${data.name} to bag`);
          }
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
          card.style.transition = "opacity .3s var(--ease), transform .3s var(--ease)";
        }, 100);
      }
    });
  }

  $$(".routine-tabs button").forEach(button => {
    button.addEventListener("click", () => {
      $$(".routine-tabs button").forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      updateRoutineDisplay(button.dataset.routine);
    });
  });

  // Bare-Faced Test Clickable Results Sync
  $$(".result-row").forEach(row => {
    row.style.cursor = "pointer";
    row.addEventListener("click", () => {
      const text = row.querySelector("strong")?.textContent.toLowerCase() || "";
      let skinType = "normal";
      if (text.includes("tight") || text.includes("flaky")) skinType = "dry";
      else if (text.includes("shiny all")) skinType = "oily";
      else if (text.includes("t-zone") || text.includes("cheeks")) skinType = "combination";
      else if (text.includes("red") || text.includes("itchy")) skinType = "sensitive";

      const routineButton = $(`.routine-tabs button[data-routine="${skinType}"]`);
      if (routineButton) {
        routineButton.click();
        const routineSection = document.getElementById("routine-title")?.closest("section");
        if (routineSection) {
          routineSection.scrollIntoView({ behavior: "smooth", block: "start" });
          showToast(`Displaying recommended routine for ${skinType.toUpperCase()} skin.`);
        }
      }
    });
  });

  // ==========================================
  // CLINICAL 4-WEEK TIMELINE TABS (HOME 1)
  // ==========================================
  $$(".timeline-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const stage = tab.dataset.stage;
      if (!stage) return;
      $$(".timeline-tab").forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      $$(".timeline-panel").forEach(panel => {
        if (panel.dataset.panel === stage) {
          panel.classList.add("active");
        } else {
          panel.classList.remove("active");
        }
      });
    });
  });

  $$("[data-open-consultation]").forEach(button => {
    button.addEventListener("click", () => {
      window.location.href = `${routes.contact}#consultation`;
    });
  });

  // ==========================================
  // LIVE INTERACTIVE MAP & STUDIO SWITCHER
  // ==========================================
  const studioData = {
    bengaluru: {
      name: "Glowé Flagship Studio & Skin Bar",
      badge: "Flagship Store",
      address: "100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038",
      hours: "Mon – Sat: 10 AM – 8 PM<br>Sunday: 11 AM – 6 PM",
      phone: "+91 98765 43210",
      mapSrc: "https://www.openstreetmap.org/export/embed.html?bbox=77.6330%2C12.9660%2C77.6530%2C12.9860&layer=mapnik&marker=12.9760%2C77.6430",
      directionsUrl: "https://www.google.com/maps/search/?api=1&query=100+Feet+Road+Indiranagar+Bengaluru+560038"
    },
    mumbai: {
      name: "Glowé Mumbai Studio & Skin Lab",
      badge: "Experience Center",
      address: "Pali Hill, Bandra West, Mumbai, Maharashtra 400050",
      hours: "Mon – Sat: 10 AM – 8 PM<br>Sunday: 11 AM – 7 PM",
      phone: "+91 98765 43211",
      mapSrc: "https://www.openstreetmap.org/export/embed.html?bbox=72.8180%2C19.0520%2C72.8380%2C19.0720&layer=mapnik&marker=19.0620%2C72.8280",
      directionsUrl: "https://www.google.com/maps/search/?api=1&query=Pali+Hill+Bandra+West+Mumbai+400050"
    },
    delhi: {
      name: "Glowé Delhi Experience Lounge",
      badge: "Boutique Studio",
      address: "Khan Market, Rabindra Nagar, New Delhi 110003",
      hours: "Mon – Sat: 10:30 AM – 8 PM<br>Sunday: 11 AM – 6 PM",
      phone: "+91 98765 43212",
      mapSrc: "https://www.openstreetmap.org/export/embed.html?bbox=77.2200%2C28.5900%2C77.2400%2C28.6100&layer=mapnik&marker=28.6000%2C77.2300",
      directionsUrl: "https://www.google.com/maps/search/?api=1&query=Khan+Market+New+Delhi+110003"
    }
  };

  $$(".studio-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const studioKey = tab.dataset.studio;
      const data = studioData[studioKey];
      if (!data) return;

      $$(".studio-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const iframe = $("#live-map-iframe");
      if (iframe && iframe.src !== data.mapSrc) {
        iframe.src = data.mapSrc;
      }

      const badge = $("#studio-badge");
      const name = $("#studio-name");
      const addr = $("#studio-address span");
      const hours = $("#studio-hours");
      const phone = $("#studio-phone");
      const directions = $("#studio-directions-link");

      const card = $("#active-studio-card");
      if (card) {
        card.style.opacity = "0.4";
        card.style.transform = "translateY(4px)";
        setTimeout(() => {
          if (badge) badge.textContent = data.badge;
          if (name) name.textContent = data.name;
          if (addr) addr.textContent = data.address;
          if (hours) hours.innerHTML = data.hours;
          if (phone) phone.textContent = data.phone;
          if (directions) directions.href = data.directionsUrl;
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
          card.style.transition = "opacity .25s var(--ease), transform .25s var(--ease)";
        }, 80);
      }
    });
  });

  // ==========================================
  // INGREDIENTS ACTIVE SYNERGY LAB TABS
  // ==========================================
  $$("[data-synergy-tab]").forEach(tab => {
    tab.addEventListener("click", () => {
      const category = tab.dataset.synergyTab;
      if (!category) return;
      $$("[data-synergy-tab]").forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      $$(".synergy-panel").forEach(panel => {
        if (panel.id === `synergy-panel-${category}`) {
          panel.classList.add("active");
          panel.removeAttribute("hidden");
        } else {
          panel.classList.remove("active");
          panel.setAttribute("hidden", "");
        }
      });
      if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
      }
    });
  });

  // ==========================================
  // SEASONAL SHIFTS & CLIMATE TABS
  // ==========================================
  $$("[data-season-tab]").forEach(tab => {
    tab.addEventListener("click", () => {
      const season = tab.dataset.seasonTab;
      if (!season) return;
      $$("[data-season-tab]").forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      $$(".season-panel").forEach(panel => {
        if (panel.id === `season-panel-${season}`) {
          panel.classList.add("active");
          panel.removeAttribute("hidden");
        } else {
          panel.classList.remove("active");
          panel.setAttribute("hidden", "");
        }
      });
      if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
      }
    });
  });

  // ==========================================
  // BARRIER HEALTH CHECKLIST & STATUS CALCULATOR
  // ==========================================
  const barrierCheckboxes = $$(".barrier-checkbox");
  if (barrierCheckboxes.length) {
    const updateBarrierStatus = () => {
      let checkedCount = 0;
      barrierCheckboxes.forEach(cb => {
        const item = cb.closest(".barrier-check-item");
        if (cb.checked) {
          checkedCount++;
          if (item) item.classList.add("checked");
        } else {
          if (item) item.classList.remove("checked");
        }
      });

      const dot = $(".barrier-status-dot");
      const title = $("#barrier-status-title");
      const desc = $("#barrier-status-desc");

      if (dot && title && desc) {
        dot.className = "barrier-status-dot";
        if (checkedCount === 0) {
          dot.classList.add("status-optimal");
          title.textContent = "Optimal Barrier Health";
          desc.textContent = "Zero irritation indicators selected";
        } else if (checkedCount <= 2) {
          dot.classList.add("status-caution");
          title.textContent = "Mild Sensitization";
          desc.textContent = `${checkedCount} symptom${checkedCount > 1 ? "s" : ""} detected — simplify routine`;
        } else {
          dot.classList.add("status-danger");
          title.textContent = "Compromised Barrier";
          desc.textContent = `${checkedCount} warning signs detected — activate 72h SOS Reset`;
        }
      }
    };

    barrierCheckboxes.forEach(cb => {
      cb.addEventListener("change", updateBarrierStatus);
    });
  }

})();
