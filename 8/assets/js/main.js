/* Meeple & Marrow — shared site behaviour (vanilla JS only) */
(() => {
  "use strict";

  const doc = document;
  const html = doc.documentElement;
  html.classList.add("js");
  const body = doc.body;
  const root = body.dataset.root || ".";
  const page = body.dataset.page || "home";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  const path = (value) => `${root}/${value}`;

  // SVG Icons subset (Lucide Icons, ISC license)
  const icons = {
    "arrow-left": '<path d="m15 18-6-6 6-6"/><path d="M21 12H9"/>',
    "arrow-right": '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    "arrow-up-right": '<path d="M7 17 17 7"/><path d="M7 7h10v10"/>',
    bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    check: '<path d="m20 6-11 11-5-5"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    compass: '<circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3 6.3-2.1Z"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    dice: '<rect width="18" height="18" x="3" y="3" rx="3"/><path d="M8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    "eye-off": '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>',
    filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
    gamepad: '<path d="M6 12h4M8 10v4M15 13h.01M18 11h.01"/><rect width="20" height="12" x="2" y="6" rx="5"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    instagram: '<rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.4A4 4 0 1 1 12.6 8 4 4 0 0 1 16 11.4ZM17.5 6.5h.01"/>',
    lightbulb: '<path d="M9 18h6M10 22h4"/><path d="M15.1 14c.2-1 .9-1.6 1.5-2.3A6 6 0 1 0 7.4 12c.6.7 1.3 1.3 1.5 2.3.1.5.1 1.1.1 1.7h6c0-.7 0-1.4.1-2Z"/>',
    ltr: '<path d="M4 6h16M4 12h11M4 18h16"/><path d="m15 9 3 3-3 3"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-10 6L2 7"/>',
    map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/>',
    "map-pin": '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    minus: '<path d="M5 12h14"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/>',
    package: '<path d="m16.5 9.4-9-5.2M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="M3.3 7 12 12l8.7-5M12 22V12"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2.1Z"/>',
    plus: '<path d="M5 12h14M12 5v14"/>',
    puzzle: '<path d="M19.4 15a1.65 1.65 0 0 0-1.4-.8 1.7 1.7 0 0 0-1.7 1.7v.1a2 2 0 0 1-2 2h-1.8v-2.2a1.7 1.7 0 0 0-1.7-1.7 1.65 1.65 0 0 0-1.4.8 2 2 0 0 1-1.7 1H5.5a2 2 0 0 1-2-2V12h2.2a1.7 1.7 0 0 0 1.7-1.7 1.65 1.65 0 0 0-.8-1.4 2 2 0 0 1-1-1.7V5.5a2 2 0 0 1 2-2H10v2.2a1.7 1.7 0 0 0 1.7 1.7 1.65 1.65 0 0 0 1.4-.8 2 2 0 0 1 1.7-1h1.7a2 2 0 0 1 2 2V10h-2.2a1.7 1.7 0 0 0-1.7 1.7 1.65 1.65 0 0 0 .8 1.4 2 2 0 0 1 1 1.7V18h1.1a2 2 0 0 0 1.9-3Z"/>',
    rtl: '<path d="M4 6h16M9 12h11M4 18h16"/><path d="m9 9-3 3 3 3"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3v8Z"/><path d="m9 12 2 2 4-4"/>',
    sparkles: '<path d="m12 3-1.9 4.8a2 2 0 0 1-1.1 1.1L4.2 11 9 12.9a2 2 0 0 1 1.1 1.1l1.9 4.8 1.9-4.8a2 2 0 0 1 1.1-1.1l4.8-1.9L15 9.1a2 2 0 0 1-1.1-1.1L12 3Z"/><path d="M5 3v4M3 5h4M19 17v4M17 19h4"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    ticket: '<path d="M2 9a3 3 0 0 0 0 6v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a3 3 0 0 0 0-6V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4Z"/><path d="M13 5v2M13 17v2M13 11v2"/>',
    trash: '<path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  };

  const icon = (name, className = "") => {
    const nodes = icons[name] || icons.sparkles;
    return `<svg class="icon ${className}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${nodes}</svg>`;
  };

  const readSetting = (key) => {
    try { return localStorage.getItem(key); } catch { return null; }
  };

  const writeSetting = (key, value) => {
    try { localStorage.setItem(key, value); } catch { /* private browsing */ }
  };

  // Local theme and layout direction settings
  const initialTheme = readSetting("mm-theme") || (systemTheme.matches ? "dark" : "light");
  const initialDirection = readSetting("mm-direction") || "ltr";
  html.dataset.theme = initialTheme;
  html.dir = initialDirection;

  // Shopping Bag Store (backed by localStorage)
  const getBag = () => {
    try {
      const stored = localStorage.getItem("mm-bag");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveBag = (items) => {
    try {
      localStorage.setItem("mm-bag", JSON.stringify(items));
    } catch { /* private mode */ }
    updateBagUI();
  };

  const addToBag = (product) => {
    const bag = getBag();
    const existing = bag.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      bag.push({
        id: product.id,
        name: product.name,
        category: product.category || "Board Game",
        price: product.price || 0,
        formattedPrice: product.formattedPrice || `₹${product.price?.toLocaleString("en-IN")}`,
        quantity: 1,
        meta: product.meta || "",
      });
    }
    saveBag(bag);
    showToast(`Added “${product.name}” to your bag.`, "bag");
  };

  const updateBagQty = (id, delta) => {
    let bag = getBag();
    const item = bag.find((it) => it.id === id);
    if (!item) return;
    item.quantity = (item.quantity || 1) + delta;
    if (item.quantity <= 0) {
      bag = bag.filter((it) => it.id !== id);
    }
    saveBag(bag);
  };

  const removeFromBag = (id) => {
    const bag = getBag().filter((it) => it.id !== id);
    saveBag(bag);
    showToast("Item removed from bag.", "trash");
  };

  const clearBag = () => {
    saveBag([]);
    showToast("Shopping bag cleared.", "check");
  };

  const updateBagUI = () => {
    const bag = getBag();
    const totalCount = bag.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const totalPrice = bag.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

    // Update badge in header
    doc.querySelectorAll("[data-bag-count]").forEach((badge) => {
      badge.textContent = totalCount;
      badge.hidden = totalCount === 0;
      badge.setAttribute("aria-label", `${totalCount} ${totalCount === 1 ? "item" : "items"} in shopping bag`);
    });

    // Update Drawer Contents
    const bagList = doc.querySelector("[data-bag-list]");
    const bagEmpty = doc.querySelector("[data-bag-empty]");
    const bagFooter = doc.querySelector("[data-bag-footer]");
    const bagTotalElem = doc.querySelector("[data-bag-total]");

    if (bagTotalElem) {
      bagTotalElem.textContent = `₹${totalPrice.toLocaleString("en-IN")}`;
    }

    if (bagList && bagEmpty && bagFooter) {
      if (bag.length === 0) {
        bagList.innerHTML = "";
        bagEmpty.hidden = false;
        bagFooter.hidden = true;
      } else {
        bagEmpty.hidden = true;
        bagFooter.hidden = false;
        bagList.innerHTML = bag.map((item) => `
          <div class="bag-item" data-bag-item-id="${item.id}">
            <div class="bag-item__info">
              <span class="bag-item__category">${item.category}</span>
              <h4 class="bag-item__title">${item.name}</h4>
              <span class="bag-item__meta">${item.meta}</span>
              <strong class="bag-item__price">${item.formattedPrice}</strong>
            </div>
            <div class="bag-item__actions">
              <div class="qty-control" role="group" aria-label="Adjust quantity for ${item.name}">
                <button class="qty-btn" type="button" data-bag-qty-minus="${item.id}" aria-label="Decrease quantity for ${item.name}">${icon("minus")}</button>
                <span class="qty-val" aria-live="polite">${item.quantity}</span>
                <button class="qty-btn" type="button" data-bag-qty-plus="${item.id}" aria-label="Increase quantity for ${item.name}">${icon("plus")}</button>
              </div>
              <button class="bag-remove-btn" type="button" data-bag-remove="${item.id}" aria-label="Remove ${item.name} from bag" title="Remove">${icon("trash")}</button>
            </div>
          </div>
        `).join("");
      }
    }
  };

  const navItems = [
    ["products", "Products", "pages/products.html"],
    ["recommendations", "Recommendations", "pages/recommendations.html"],
    ["events", "Events", "pages/events.html"],
    ["about", "About Us", "pages/about.html"],
  ];

  const otherPages = [
    ["coming-soon", "Coming Soon", "pages/coming-soon.html"],
    ["privacy", "Privacy Policy", "pages/privacy.html"],
    ["terms", "Terms of Service", "pages/terms.html"],
    ["404", "404", "pages/404.html"],
  ];

  const shell = () => {
    const headerTarget = doc.querySelector("[data-site-header]");
    const footerTarget = doc.querySelector("[data-site-footer]");

    if (headerTarget) {
      const isHome = page === "home" || page === "home-alt";
      const isOtherPages = otherPages.some(([k]) => page === k);
      headerTarget.outerHTML = `
        <header class="site-header" data-header>
          <div class="scroll-progress" data-scroll-progress aria-hidden="true"></div>
          <nav class="nav-shell" aria-label="Primary navigation">
            <a class="brand" href="${path("index.html")}" aria-label="Meeple and Marrow home">
              <span class="brand__mark" aria-hidden="true"><img src="${path("assets/images/paper-worlds/brand-mark.svg")}" alt="" width="40" height="40"></span>
              <span>Meeple <span aria-hidden="true">&amp;</span><br>Marrow</span>
            </a>
            <div class="nav-links" id="site-navigation" data-nav-links>
              <div class="nav-dropdown" data-nav-dropdown>
                <button class="nav-dropdown__btn" type="button" aria-expanded="false" aria-haspopup="true"${isHome ? ' aria-current="page"' : ""}>
                  <span>Home</span>
                  ${icon("chevron-down", "nav-dropdown__arrow")}
                </button>
                <div class="nav-dropdown__menu" role="menu">
                  <a href="${path("index.html")}" class="nav-dropdown__item${page === "home" ? " is-active" : ""}" role="menuitem"${page === "home" ? ' aria-current="page"' : ""}>
                    <span class="nav-dropdown__label">Home 1</span>
                  </a>
                  <a href="${path("index1.html")}" class="nav-dropdown__item${page === "home-alt" ? " is-active" : ""}" role="menuitem"${page === "home-alt" ? ' aria-current="page"' : ""}>
                    <span class="nav-dropdown__label">Home 2</span>
                  </a>
                </div>
              </div>
              ${navItems.map(([key, label, href]) => {
                const isCurrent = page === key;
                return `<a href="${path(href)}"${isCurrent ? ' aria-current="page"' : ""}>${label}</a>`;
              }).join("")}
              <div class="nav-dropdown" data-nav-dropdown>
                <button class="nav-dropdown__btn" type="button" aria-expanded="false" aria-haspopup="true"${isOtherPages ? ' aria-current="page"' : ""}>
                  <span>Pages</span>
                  ${icon("chevron-down", "nav-dropdown__arrow")}
                </button>
                <div class="nav-dropdown__menu" role="menu">
                  ${otherPages.map(([key, label, href]) => `
                    <a href="${path(href)}" class="nav-dropdown__item${page === key ? " is-active" : ""}" role="menuitem"${page === key ? ' aria-current="page"' : ""}>
                      <span class="nav-dropdown__label">${label}</span>
                    </a>
                  `).join("")}
                </div>
              </div>
              <a href="${path("pages/contact.html")}"${page === "contact" ? ' aria-current="page"' : ""}>Contact</a>
            </div>
            <div class="header-actions">
              <button class="icon-button" type="button" data-direction-toggle aria-label="${initialDirection === "rtl" ? "Switch to left-to-right (LTR) layout" : "Switch to right-to-left (RTL) layout"}" title="${initialDirection === "rtl" ? "Switch to LTR" : "Switch to RTL"}">
                ${icon(initialDirection === "rtl" ? "ltr" : "rtl")}
              </button>
              <button class="icon-button" type="button" data-theme-toggle aria-label="Switch color theme" title="Toggle color theme"></button>
              <button class="icon-button bag-action" type="button" data-bag-open aria-label="View shopping bag" title="Shopping bag">
                ${icon("bag")}
                <span class="bag-badge" data-bag-count hidden>0</span>
              </button>
              <a class="btn btn--small btn--header-signin" href="${path("pages/signin.html")}"${page === "signin" ? ' aria-current="page"' : ""}>
                <span>Sign in</span>
              </a>
              <button class="icon-button nav-toggle" type="button" data-nav-toggle aria-controls="site-navigation" aria-expanded="false" aria-label="Open navigation">${icon("menu")}</button>
            </div>
          </nav>
        </header>`;
    }

    if (footerTarget) {
      footerTarget.outerHTML = `
        <footer class="site-footer">
          <div class="container footer-main">
            <div class="footer-brand">
              <a class="brand" href="${path("index.html")}">
                <span class="brand__mark" aria-hidden="true"><img src="${path("assets/images/paper-worlds/brand-mark.svg")}" alt="" width="40" height="40"></span>
                <span>Meeple <span aria-hidden="true">&amp;</span><br>Marrow</span>
              </a>
              <p>Considered games, generous tables, and a welcoming place for every kind of player in Bengaluru.</p>
              <div class="footer-badge-list">
                <span class="footer-pill">${icon("check")} 100% Curated</span>
                <span class="footer-pill">${icon("users")} Community Hosted</span>
                <span class="footer-pill">${icon("heart")} Family Friendly</span>
              </div>
            </div>
            <div class="footer-column">
              <h2>Navigation</h2>
              <a href="${path("index.html")}">Home 1</a>
              <a href="${path("index1.html")}">Home 2</a>
              <a href="${path("pages/products.html")}">Products</a>
              <a href="${path("pages/recommendations.html")}">Recommendations</a>
              <a href="${path("pages/events.html")}">Events</a>
            </div>
            <div class="footer-column">
              <h2>Company</h2>
              <a href="${path("pages/about.html")}">About Us</a>
              <a href="${path("pages/contact.html")}">Contact</a>
              <a href="${path("pages/coming-soon.html")}">Coming Soon</a>
              <a href="${path("pages/404.html")}">404</a>
            </div>
            <div class="footer-column">
              <h2>Account &amp; Legal</h2>
              <a href="${path("pages/signin.html")}">Sign In</a>
              <a href="${path("pages/signup.html")}">Sign Up</a>
              <a href="${path("pages/privacy.html")}">Privacy Policy</a>
              <a href="${path("pages/terms.html")}">Terms of Service</a>
            </div>
          </div>
          <div class="container footer-bottom">
            <span>© <span data-year></span> Meeple &amp; Marrow. Independent board game shop &amp; community.</span>
            <div class="footer-bottom__links">
              <a href="mailto:hello@meepleandmarrow.example">${icon("mail")} Email</a>
              <a href="tel:+919876543210">${icon("phone")} Call store</a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">${icon("instagram")} Instagram</a>
            </div>
          </div>
        </footer>`;
    }

    body.insertAdjacentHTML("beforeend", `
      <!-- Global Search Modal -->
      <dialog class="modal" data-search-dialog aria-labelledby="search-title">
        <div class="modal__inner">
          <div class="modal__header">
            <div>
              <span class="eyebrow">Quick find</span>
              <h2 id="search-title">Search the store</h2>
            </div>
            <button class="icon-button" type="button" data-search-close aria-label="Close search">${icon("close")}</button>
          </div>
          <div class="field">
            <label for="site-search">What are you looking for?</label>
            <div class="search-input-wrap">
              <input id="site-search" type="search" placeholder="Search games, categories, events, or hours…" autocomplete="off" data-site-search>
            </div>
          </div>
          <div class="search-quick-tags" aria-label="Search suggestions">
            <span>Try:</span>
            <button type="button" class="tag-chip" data-search-suggestion="Strategy">Strategy</button>
            <button type="button" class="tag-chip" data-search-suggestion="Cards">Cards</button>
            <button type="button" class="tag-chip" data-search-suggestion="D&D">D&amp;D</button>
            <button type="button" class="tag-chip" data-search-suggestion="Game night">Game night</button>
            <button type="button" class="tag-chip" data-search-suggestion="Hours">Store hours</button>
          </div>
          <div class="wizard-result search-results-box" data-search-results aria-live="polite">
            <p>Start typing to explore games, upcoming tables, and store info.</p>
          </div>
        </div>
      </dialog>

      <!-- Shopping Bag & Pickup Reservation Drawer -->
      <dialog class="modal modal--drawer" data-bag-dialog aria-labelledby="bag-title">
        <div class="modal__inner drawer__inner">
          <div class="modal__header">
            <div>
              <span class="eyebrow">Shopping bag &amp; reservations</span>
              <h2 id="bag-title">Your Table Bag</h2>
            </div>
            <button class="icon-button" type="button" data-bag-close aria-label="Close shopping bag">${icon("close")}</button>
          </div>
          
          <div class="bag-items-wrap" data-bag-list></div>

          <div class="bag-empty" data-bag-empty>
            <div class="bag-empty__icon" aria-hidden="true">${icon("bag")}</div>
            <h3>Your table is clear.</h3>
            <p>You haven’t added any games to your bag yet. Browse our curated collection to pick something special.</p>
            <a class="btn btn--small" href="${path("pages/products.html")}" data-bag-close-link><span>Explore collection</span>${icon("arrow-right")}</a>
          </div>

          <div class="bag-footer" data-bag-footer hidden>
            <div class="bag-summary">
              <div class="bag-summary__row">
                <span>Total estimate:</span>
                <strong class="price" data-bag-total>₹0</strong>
              </div>
              <p class="bag-note">In-store pickup and desk reservation available in Bengaluru.</p>
            </div>
            
            <form class="bag-reserve-form" data-validate data-success="Your games have been reserved for pickup! We’ll hold them for 48 hours." novalidate>
              <div class="field">
                <label for="bag-cust-name">Your Name</label>
                <input id="bag-cust-name" name="name" type="text" placeholder="Name for pickup desk" required>
                <p class="field-error"></p>
              </div>
              <div class="field">
                <label for="bag-cust-phone">Phone / WhatsApp</label>
                <input id="bag-cust-phone" name="phone" type="tel" placeholder="+91 98765 43210" pattern="[0-9+() -]{7,20}" required>
                <p class="field-error"></p>
              </div>
              <button class="btn btn--full" type="submit">
                <span>Reserve for in-store pickup</span>
                ${icon("check")}
              </button>
              <button class="btn btn--ghost btn--small btn--full" type="button" data-bag-clear>
                <span>Clear bag</span>
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <!-- Product Quick View Modal -->
      <dialog class="modal" data-quick-view-dialog aria-labelledby="qv-title">
        <div class="modal__inner">
          <div class="modal__header">
            <div>
              <span class="eyebrow" data-qv-category>Game details</span>
              <h2 id="qv-title" data-qv-title>Game Title</h2>
            </div>
            <button class="icon-button" type="button" data-qv-close aria-label="Close details">${icon("close")}</button>
          </div>
          <div class="qv-body">
            <p class="lede" data-qv-desc>Game description</p>
            <div class="feature-copy__meta qv-meta">
              <span>${icon("users")}<span data-qv-players>2–4 players</span></span>
              <span>${icon("clock")}<span data-qv-time>60 min</span></span>
              <span>${icon("sparkles")}<span data-qv-tag>Strategy</span></span>
            </div>
            <div class="qv-action-row">
              <strong class="price price--lg" data-qv-price>₹0</strong>
              <button class="btn" type="button" data-qv-add-bag>
                <span>Add to Bag</span>
                ${icon("bag")}
              </button>
            </div>
          </div>
        </div>
      </dialog>

      <!-- Global RSVP Modal Dialog -->
      <dialog class="modal" data-rsvp-dialog aria-labelledby="rsvp-title">
        <div class="modal__inner">
          <div class="modal__header">
            <div>
              <span class="eyebrow">Reserve a seat</span>
              <h2 id="rsvp-title">Join the table.</h2>
            </div>
            <button class="icon-button" type="button" data-rsvp-close aria-label="Close RSVP form">${icon("close")}</button>
          </div>
          <p>You’re RSVPing for <strong data-event-name>Community Game Night</strong>.</p>
          <form class="form-grid" data-validate data-success="Your seat has been reserved! We look forward to seeing you at the table." novalidate>
            <input type="hidden" name="event" value="Community Game Night">
            <div class="field">
              <label for="rsvp-name">Name</label>
              <input id="rsvp-name" name="name" type="text" autocomplete="name" placeholder="Your full name" minlength="2" required aria-describedby="rsvp-name-error">
              <p class="field-error" id="rsvp-name-error"></p>
            </div>
            <div class="field">
              <label for="rsvp-email">Email</label>
              <input id="rsvp-email" name="email" type="email" autocomplete="email" placeholder="name@example.com" required aria-describedby="rsvp-email-error">
              <p class="field-error" id="rsvp-email-error"></p>
            </div>
            <div class="field">
              <label for="rsvp-party">Seats</label>
              <select id="rsvp-party" name="seats">
                <option value="1">1 seat</option>
                <option value="2">2 seats</option>
                <option value="3">3 seats</option>
                <option value="4">4 seats</option>
              </select>
            </div>
            <button class="btn btn--full" type="submit">
              <span>Confirm reservation</span>
              ${icon("arrow-right")}
            </button>
          </form>
        </div>
      </dialog>

      <!-- Category Details Modal Dialog -->
      <dialog class="modal modal--category" data-category-dialog aria-labelledby="cat-dialog-title">
        <div class="modal__inner">
          <div class="modal__header">
            <div>
              <span class="eyebrow" data-cat-dialog-tag>Category Overview</span>
              <h2 id="cat-dialog-title" data-cat-dialog-title>Strategy Games</h2>
            </div>
            <button class="icon-button" type="button" data-cat-dialog-close aria-label="Close category details">${icon("close")}</button>
          </div>
          <div class="cat-dialog-body">
            <p class="lede" data-cat-dialog-subtitle></p>
            <p class="cat-dialog-desc" data-cat-dialog-desc></p>
            
            <div class="cat-dialog-specs" data-cat-dialog-specs>
              <div class="cat-spec-item">
                <span class="cat-spec-label">${icon("sparkles")} Complexity</span>
                <strong data-cat-dialog-complexity>Medium to Heavy</strong>
              </div>
              <div class="cat-spec-item">
                <span class="cat-spec-label">${icon("clock")} Typical Time</span>
                <strong data-cat-dialog-time>60–150 min</strong>
              </div>
              <div class="cat-spec-item">
                <span class="cat-spec-label">${icon("users")} Best Suited For</span>
                <strong data-cat-dialog-best>Game nights & thinkers</strong>
              </div>
            </div>

            <div class="cat-dialog-featured">
              <h4>Popular Titles in this Collection</h4>
              <div class="cat-dialog-pills" data-cat-dialog-featured></div>
            </div>

            <div class="cat-dialog-actions">
              <button class="btn btn--full" type="button" data-cat-dialog-filter>
                <span data-cat-dialog-filter-text>Browse Strategy Games</span>
                ${icon("arrow-right")}
              </button>
            </div>
          </div>
        </div>
      </dialog>

      <!-- Global Toast Notification -->
      <div class="toast" role="status" aria-live="polite" aria-atomic="true" data-toast></div>
    `);
  };

  shell();

  const hydrateIcons = (scope = doc) => {
    scope.querySelectorAll("[data-icon]").forEach((node) => {
      const name = node.dataset.icon;
      const size = node.dataset.iconSize ? `icon--${node.dataset.iconSize}` : "";
      node.innerHTML = icon(name, size);
    });
  };

  hydrateIcons();

  // Color Theme Toggle (All buttons on page)
  const updateThemeButtons = () => {
    const dark = html.dataset.theme === "dark";
    doc.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.innerHTML = icon(dark ? "sun" : "moon");
      button.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
      button.title = dark ? "Use light theme" : "Use dark theme";
    });
  };

  updateThemeButtons();

  // Text Direction (LTR / RTL) Toggle (All buttons on page)
  const updateDirectionButtons = () => {
    const isRtl = html.dir === "rtl";
    doc.querySelectorAll("[data-direction-toggle]").forEach((button) => {
      button.innerHTML = icon(isRtl ? "ltr" : "rtl");
      button.setAttribute("aria-label", isRtl ? "Switch to left-to-right (LTR) layout" : "Switch to right-to-left (RTL) layout");
      button.title = isRtl ? "Switch to LTR" : "Switch to RTL";
    });
  };

  updateDirectionButtons();

  // Delegated click handler for theme and direction toggles
  doc.addEventListener("click", (e) => {
    const themeBtn = e.target.closest("[data-theme-toggle]");
    if (themeBtn) {
      const next = html.dataset.theme === "dark" ? "light" : "dark";
      html.dataset.theme = next;
      writeSetting("mm-theme", next);
      updateThemeButtons();
      showToast(next === "dark" ? "Dark theme enabled." : "Light theme enabled.", next === "dark" ? "moon" : "sun");
      return;
    }

    const dirBtn = e.target.closest("[data-direction-toggle]");
    if (dirBtn) {
      const next = html.dir === "rtl" ? "ltr" : "rtl";
      html.dir = next;
      writeSetting("mm-direction", next);
      updateDirectionButtons();
      showToast(next === "rtl" ? "Right-to-left (RTL) layout enabled." : "Left-to-right (LTR) layout enabled.", next);
      return;
    }
  });

  // Dropdown Navigation Handling (Home & Pages)
  const navDropdowns = doc.querySelectorAll("[data-nav-dropdown]");
  navDropdowns.forEach((dd) => {
    const btn = dd.querySelector(".nav-dropdown__btn");
    btn?.addEventListener("click", (e) => {
      e.stopPropagation();
      const expanded = btn.getAttribute("aria-expanded") === "true";
      navDropdowns.forEach((other) => {
        if (other !== dd) {
          other.querySelector(".nav-dropdown__btn")?.setAttribute("aria-expanded", "false");
          other.classList.remove("is-open");
        }
      });
      btn.setAttribute("aria-expanded", String(!expanded));
      dd.classList.toggle("is-open", !expanded);
    });
  });

  doc.addEventListener("click", (e) => {
    navDropdowns.forEach((dd) => {
      if (!dd.contains(e.target)) {
        dd.querySelector(".nav-dropdown__btn")?.setAttribute("aria-expanded", "false");
        dd.classList.remove("is-open");
      }
    });
  });

  // Mobile Navigation Menu Toggle & Outside Click
  const navToggle = doc.querySelector("[data-nav-toggle]");
  const navLinks = doc.querySelector("[data-nav-links]");

  const closeNav = () => {
    if (!navToggle || !navLinks) return;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
    navToggle.innerHTML = icon("menu");
    navLinks.classList.remove("is-open");
    navDropdowns.forEach((dd) => {
      dd.querySelector(".nav-dropdown__btn")?.setAttribute("aria-expanded", "false");
      dd.classList.remove("is-open");
    });
  };

  navToggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!open));
    navToggle.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
    navToggle.innerHTML = icon(open ? "menu" : "close");
    navLinks?.classList.toggle("is-open", !open);
  });

  navLinks?.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeNav();
  });

  doc.addEventListener("click", (event) => {
    if (navLinks?.classList.contains("is-open") && !event.target.closest(".site-header")) {
      closeNav();
    }
  });

  doc.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });

  // Scroll Progress and Parallax Behavior
  const header = doc.querySelector("[data-header]");
  const progress = doc.querySelector("[data-scroll-progress]");
  const parallaxNodes = [...doc.querySelectorAll("[data-parallax]")];
  let ticking = false;

  const updateScroll = () => {
    const y = window.scrollY;
    const max = Math.max(1, doc.documentElement.scrollHeight - window.innerHeight);
    header?.classList.toggle("is-scrolled", y > 18);
    if (progress) progress.style.transform = `scaleX(${Math.min(1, y / max)})`;

    if (!reduceMotion.matches) {
      parallaxNodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const shift = Math.max(-18, Math.min(18, (rect.top - window.innerHeight / 2) * -0.035));
        node.style.setProperty("--parallax-y", `${shift}px`);
      });
    }
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScroll);
      ticking = true;
    }
  }, { passive: true });

  updateScroll();

  // Scroll Reveal Animations
  const revealNodes = [...doc.querySelectorAll("[data-reveal]")];
  doc.querySelectorAll("[data-reveal-stagger]").forEach((group) => {
    [...group.children].forEach((child, index) => {
      if (child.hasAttribute("data-reveal")) child.style.setProperty("--reveal-delay", `${Math.min(index * 90, 450)}ms`);
    });
  });

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -5%" });
    revealNodes.forEach((node) => revealObserver.observe(node));
  }

  // Animated Number Counters (Auto-detects and counts up)
  const statNodes = [...doc.querySelectorAll("[data-count], .stat strong")];
  if (statNodes.length && "IntersectionObserver" in window) {
    const runCounter = (node) => {
      let target = Number(node.dataset.count);
      let suffix = node.dataset.suffix || "";
      let prefix = "";

      if (isNaN(target)) {
        const text = node.textContent.trim();
        const match = text.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
        if (match) {
          prefix = match[1];
          target = parseFloat(match[2]);
          suffix = match[3];
        } else {
          return;
        }
      }

      if (reduceMotion.matches) {
        node.textContent = `${prefix}${target}${suffix}`;
        return;
      }
      const start = performance.now();
      const duration = 1400;
      const isInt = Number.isInteger(target);
      const step = (now) => {
        const pct = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - pct, 3);
        const current = target * eased;
        node.textContent = `${prefix}${isInt ? Math.round(current) : current.toFixed(1)}${suffix}`;
        if (pct < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.35 });
    statNodes.forEach((node) => countObserver.observe(node));
  }

  // Horizontal Carousel with Smooth Drag & Controls
  doc.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector("[data-carousel-track]");
    carousel.querySelector("[data-carousel-prev]")?.addEventListener("click", () => {
      track?.scrollBy({ left: -Math.min(track.clientWidth * 0.82, 560), behavior: reduceMotion.matches ? "auto" : "smooth" });
    });
    carousel.querySelector("[data-carousel-next]")?.addEventListener("click", () => {
      track?.scrollBy({ left: Math.min(track.clientWidth * 0.82, 560), behavior: reduceMotion.matches ? "auto" : "smooth" });
    });

    if (track) {
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;

      track.addEventListener("mousedown", (e) => {
        if (e.target.closest("button") || e.target.closest("a")) return;
        isDown = true;
        track.style.cursor = "grabbing";
        track.style.userSelect = "none";
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
      });

      window.addEventListener("mouseup", () => {
        if (isDown) {
          isDown = false;
          track.style.cursor = "";
          track.style.userSelect = "";
        }
      });

      track.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.5;
        track.scrollLeft = scrollLeft - walk;
      });
    }
  });

  // Product Catalog Filtering & Hash Navigation
  const filterButtons = [...doc.querySelectorAll("[data-filter]")];
  const catalogItems = [...doc.querySelectorAll("[data-product-category]")];

  const applyCategoryFilter = (filterKey, shouldScroll = false) => {
    if (!filterButtons.length) return;
    const cleanKey = (filterKey || "all").toLowerCase().replace("#", "").trim() || "all";
    const targetButton = filterButtons.find((btn) => btn.dataset.filter === cleanKey) || filterButtons[0];

    filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === targetButton)));
    
    let visibleCount = 0;
    catalogItems.forEach((item) => {
      const match = cleanKey === "all" || item.dataset.productCategory === cleanKey;
      item.hidden = !match;
      if (match) visibleCount++;
    });

    const status = doc.querySelector("[data-filter-status]");
    if (status) status.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? "game" : "games"}.`;

    if (shouldScroll) {
      const catalogSection = doc.getElementById("catalog");
      if (catalogSection) {
        const headerOffset = 90;
        const elementPosition = catalogSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: reduceMotion.matches ? "auto" : "smooth"
        });
      }
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      if (window.location.pathname.includes("products")) {
        history.replaceState(null, "", `#${filter}`);
      }
      applyCategoryFilter(filter, false);
    });
  });

  // Category card jump links (e.g. data-filter-jump="strategy")
  doc.querySelectorAll("[data-filter-jump]").forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetCategory = link.dataset.filterJump;
      if (window.location.pathname.includes("products")) {
        e.preventDefault();
        history.replaceState(null, "", `#${targetCategory}`);
        applyCategoryFilter(targetCategory, true);
      }
    });
  });

  // Handle initial page load with category hash
  if (window.location.hash && filterButtons.length) {
    const initialHash = window.location.hash.substring(1).toLowerCase().trim();
    if (filterButtons.some((b) => b.dataset.filter === initialHash)) {
      applyCategoryFilter(initialHash, true);
      setTimeout(() => {
        applyCategoryFilter(initialHash, true);
      }, 180);
    }
  }

  window.addEventListener("hashchange", () => {
    if (window.location.hash && filterButtons.length) {
      const currentHash = window.location.hash.substring(1).toLowerCase().trim();
      applyCategoryFilter(currentHash, true);
    }
  });

  // Events Category Filter
  const eventFilterButtons = [...doc.querySelectorAll("[data-event-filter]")];
  const eventRows = [...doc.querySelectorAll("[data-event-category]")];
  eventFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.eventFilter;
      eventFilterButtons.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
      eventRows.forEach((row) => {
        row.hidden = filter !== "all" && row.dataset.eventCategory !== filter;
      });
      const count = eventRows.filter((r) => !r.hidden).length;
      const status = doc.querySelector("[data-event-status]");
      if (status) status.textContent = `Showing ${count} upcoming ${count === 1 ? "event" : "events"}.`;
    });
  });

  // Recommendation Engine Matcher
  const recommender = doc.querySelector("[data-recommender]");
  recommender?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(recommender);
    const players = form.get("players");
    const mood = form.get("mood");
    const minutes = form.get("minutes");
    
    const gameDatabase = {
      solo: {
        thoughtful: { title: "Verdant Paths", cat: "strategy", price: 4499, players: "1–4 players", time: "55 min", desc: "A meditative landscape puzzle with a rich solo campaign and lush wooden pieces." },
        lively: { title: "Circuit Rush", cat: "family", price: 3299, players: "1–6 players", time: "35 min", desc: "A quick route planning sprint with solo time-trial challenge cards." },
        story: { title: "The Quiet Archive", cat: "puzzles", price: 3799, players: "1–4 players", time: "90–150 min", desc: "Unfold a tactile mystery letter by letter with hand-drawn maps and wax seals." }
      },
      pair: {
        thoughtful: { title: "Eclipse Valley", cat: "strategy", price: 4999, players: "2–4 players", time: "60–90 min", desc: "Elegant dueling caravan strategy with deep, rewarding choices in under an hour." },
        lively: { title: "Cocoa Grove", cat: "cards", price: 2699, players: "2–5 players", time: "45 min", desc: "Fast trading, friendly tension, and botanical cards that bring the table to life." },
        story: { title: "Lantern Letters", cat: "cards", price: 1899, players: "2 players", time: "30 min", desc: "A warm cooperative mystery designed from the ground up for two players." }
      },
      group: {
        thoughtful: { title: "Starborne Signal", cat: "strategy", price: 5899, players: "2–4 players", time: "120 min", desc: "A layered interstellar strategy game that rewards table talk and patient grand plans." },
        lively: { title: "Circuit Rush", cat: "family", price: 3299, players: "2–6 players", time: "35 min", desc: "Simultaneous turns and push-your-luck racing keep the whole table in continuous action." },
        story: { title: "The Quiet Archive", cat: "puzzles", price: 3799, players: "1–4 players", time: "90–150 min", desc: "An atmospheric expedition that has players working together to decode sealed letters." }
      },
      party: {
        thoughtful: { title: "Mosaic Commons", cat: "family", price: 2499, players: "3–8 players", time: "40 min", desc: "Generous team pattern-building and spatial strategy made for a full table." },
        lively: { title: "Cocoa Grove", cat: "cards", price: 2699, players: "3–5 players", time: "45 min", desc: "A friendly high-energy card game with fast bartering and quick turns." },
        story: { title: "Mosaic Commons", cat: "family", price: 2499, players: "3–8 players", time: "40 min", desc: "Creative shared storytelling meets tactile pattern arrangement for larger gatherings." }
      }
    };

    const match = gameDatabase[players]?.[mood] || gameDatabase.group.thoughtful;
    const paceNote = minutes === "short" ? "Compact play session." : minutes === "long" ? "Perfect for settling in for an immersive evening." : "Comfortable mid-length play.";

    const target = doc.querySelector("[data-recommendation-result]");
    if (target) {
      target.innerHTML = `
        <div class="rec-card">
          <div class="rec-card__header">
            <span class="eyebrow">${match.cat.toUpperCase()} MATCH</span>
            <strong class="rec-card__title">${match.title}</strong>
          </div>
          <p class="rec-card__desc">${match.desc} <em>${paceNote}</em></p>
          <div class="rec-card__meta">
            <span>${icon("users")}<span>${match.players}</span></span>
            <span>${icon("clock")}<span>${match.time}</span></span>
            <span class="price">₹${match.price.toLocaleString("en-IN")}</span>
          </div>
          <div class="rec-card__actions">
            <a class="btn btn--small" href="${path("pages/products.html")}#${match.cat}">
              <span>View in catalog</span>
              ${icon("arrow-right")}
            </a>
            <button class="btn btn--small btn--ghost" type="button" data-add-game="${match.title}" data-game-price="${match.price}" data-game-cat="${match.cat}" data-game-meta="${match.players} · ${match.time}">
              <span>Add to bag</span>
              ${icon("bag")}
            </button>
          </div>
        </div>
      `;
      hydrateIcons(target);
      target.focus({ preventScroll: true });
    }
  });

  // Pre-fill recommendation matcher from Player Count cards
  doc.querySelectorAll("[data-recommend-preset]").forEach((card) => {
    card.addEventListener("click", () => {
      const preset = card.dataset.recommendPreset;
      const select = doc.getElementById("players");
      if (select) {
        select.value = preset;
        const matcherSection = doc.getElementById("game-matcher");
        if (matcherSection) {
          matcherSection.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth" });
          select.focus();
        }
      }
    });
  });

  // Live Store Status & Map POI Handlers
  const storeBadge = doc.querySelector("[data-store-status]");
  if (storeBadge) {
    const now = new Date();
    // Convert to IST (UTC+5:30)
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const ist = new Date(utc + 3600000 * 5.5);
    const day = ist.getDay(); // 0 = Sunday, 6 = Saturday
    const hour = ist.getHours() + ist.getMinutes() / 60;
    const isWeekend = day === 0 || day === 6;
    const openHour = 10;
    const closeHour = isWeekend ? 22 : 21;
    const isOpen = hour >= openHour && hour < closeHour;

    if (isOpen) {
      const closingTimeStr = isWeekend ? "10:00 PM" : "9:00 PM";
      storeBadge.innerHTML = `<span class="pulse-dot"></span><strong>Open Today</strong> · Closes at ${closingTimeStr}`;
    } else {
      storeBadge.innerHTML = `<span style="display:inline-block;width:0.55rem;height:0.55rem;border-radius:50%;background:var(--ink-soft);margin-right:0.35rem;"></span><strong>Closed Now</strong> · Opens 10:00 AM`;
    }
  }

  const mapFrame = doc.querySelector("[data-map-iframe]");
  const mapPoints = doc.querySelectorAll("[data-map-poi]");
  const focusLabel = doc.querySelector("[data-map-focus-label]");
  const directionsBtn = doc.querySelector("[data-map-directions]");
  const copyBtn = doc.querySelector("[data-map-copy]");

  if (mapPoints.length && mapFrame) {
    const poiData = {
      store: {
        url: "https://maps.google.com/maps?q=12.9715987,77.5945627+(Meeple+%26+Marrow+Flagship+Store)&t=&z=17&ie=UTF8&iwloc=B&output=embed",
        directions: "https://www.google.com/maps/dir/?api=1&destination=12.9715987,77.5945627",
        address: "125 Game Lane, Playtown, Bengaluru 560001",
        label: "<strong>Flagship Store</strong> · 125 Game Lane",
        icon: "map-pin"
      },
      metro: {
        url: "https://maps.google.com/maps?q=Cubbon+Park+Metro+Station+Bengaluru&t=&z=18&ie=UTF8&iwloc=B&output=embed",
        directions: "https://www.google.com/maps/dir/?api=1&destination=Cubbon+Park+Metro+Station+Bengaluru",
        address: "Playtown Central Metro Station (Exit Gate 2), Bengaluru",
        label: "<strong>Metro Station</strong> · Gate 2 (3 min walk)",
        icon: "compass"
      },
      parking: {
        url: "https://maps.google.com/maps?q=Multi+Level+Car+Parking+MG+Road+Bengaluru&t=&z=18&ie=UTF8&iwloc=B&output=embed",
        directions: "https://www.google.com/maps/dir/?api=1&destination=Multi+Level+Car+Parking+MG+Road+Bengaluru",
        address: "Dedicated Customer Parking & Cycle Stands, 125 Game Lane, Bengaluru",
        label: "<strong>Customer Parking</strong> · Dedicated Basement & Cycle Racks",
        icon: "ticket"
      }
    };

    mapPoints.forEach((point) => {
      const activatePoi = () => {
        mapPoints.forEach((p) => p.classList.remove("is-active"));
        point.classList.add("is-active");
        const poiKey = point.dataset.mapPoi;
        const data = poiData[poiKey];
        if (data) {
          mapFrame.src = data.url;
          if (focusLabel) {
            focusLabel.innerHTML = `${icon(data.icon)}${data.label}`;
            hydrateIcons(focusLabel);
            focusLabel.style.animation = "none";
            void focusLabel.offsetWidth;
            focusLabel.style.animation = "modal-pop 300ms var(--ease-spring)";
          }
          if (directionsBtn) {
            directionsBtn.href = data.directions;
          }
          if (copyBtn) {
            copyBtn.dataset.copy = data.address;
          }
        }
      };

      point.addEventListener("click", activatePoi);
      point.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activatePoi();
        }
      });
    });
  }

  // Accessible Client-side Form Validation
  const errorText = (field) => {
    if (field.validity.valueMissing) return "Please complete this field.";
    if (field.validity.typeMismatch) return "Please enter a valid email address.";
    if (field.validity.tooShort) return `Please use at least ${field.minLength} characters.`;
    if (field.validity.patternMismatch) return field.dataset.patternMessage || "Please check the format and try again.";
    return "Please check this field.";
  };

  const validateField = (field) => {
    const parent = field.closest(".field");
    const error = parent?.querySelector(".field-error");
    const valid = field.checkValidity();
    field.setAttribute("aria-invalid", String(!valid));
    if (error) error.textContent = valid ? "" : errorText(field);
    return valid;
  };

  doc.querySelectorAll("[data-validate]").forEach((form) => {
    const fields = [...form.querySelectorAll("input, select, textarea")].filter((field) => field.type !== "hidden" && field.type !== "submit");
    fields.forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true") validateField(field);
      });
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const valid = fields.map(validateField).every(Boolean);
      if (!valid) {
        fields.find((field) => !field.checkValidity())?.focus();
        return;
      }
      const message = form.dataset.success || "Thanks — your submission has been received.";
      showToast(message, "check");
      form.reset();
      fields.forEach((field) => field.removeAttribute("aria-invalid"));
      form.querySelectorAll(".field-error").forEach((error) => { error.textContent = ""; });
      
      const dialog = form.closest("dialog");
      if (dialog) {
        setTimeout(() => dialog.close(), 650);
        if (dialog.hasAttribute("data-bag-dialog")) {
          saveBag([]);
        }
      }
    });
  });

  // Password Visibility Toggle
  doc.querySelectorAll("[data-toggle-password]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = button.parentElement.querySelector("input");
      if (!input) return;
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      button.innerHTML = icon(isPassword ? "eye-off" : "eye");
      button.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
    });
  });

  // RSVP Modal Dialog
  const rsvpDialog = doc.querySelector("[data-rsvp-dialog]");
  doc.querySelectorAll("[data-rsvp]").forEach((button) => {
    button.addEventListener("click", () => {
      const eventName = button.dataset.rsvp || "Community Game Night";
      const label = rsvpDialog?.querySelector("[data-event-name]");
      const input = rsvpDialog?.querySelector("[name='event']");
      if (label) label.textContent = eventName;
      if (input) input.value = eventName;
      rsvpDialog?.showModal();
    });
  });
  doc.querySelector("[data-rsvp-close]")?.addEventListener("click", () => rsvpDialog?.close());
  rsvpDialog?.addEventListener("click", (event) => {
    if (event.target === rsvpDialog) rsvpDialog.close();
  });

  // Category Overview Data Store & Modal Logic
  const categoryDetailsData = {
    strategy: {
      tag: "Deep Systems · Engine Building · Tactical Play",
      title: "Strategy Games",
      subtitle: "Thoughtful systems, rewarding choices, and emergent stories written by the table.",
      desc: "Our strategy collection features deep euro-style resource management, tactical area control, and intricate engine builders. Designed for players who love calculating multiple paths to victory with minimal luck and maximum table satisfaction.",
      complexity: "Medium to Heavy (2.8 – 4.2 / 5)",
      time: "60–150 min",
      best: "Competitive thinkers & game night deep dives",
      featured: [
        { name: "Verdant Paths", price: "₹4,499" },
        { name: "Starborne Signal", price: "₹5,899" },
        { name: "Clockwork Realm", price: "₹3,899" }
      ],
      filterKey: "strategy"
    },
    cards: {
      tag: "Fast Teaches · Hand Management · High Interaction",
      title: "Card Games",
      subtitle: "Small boxes, instant setup, and surprising depth for every kind of table.",
      desc: "Card games deliver tremendous tactical tension, bluffing, and social engagement in portable formats. From pocket-sized deck builders and trick-taking games to high-stakes auctions and dynamic set collections.",
      complexity: "Light to Medium (1.5 – 2.8 / 5)",
      time: "20–45 min",
      best: "Travel, cafes, openers & casual gatherings",
      featured: [
        { name: "Cocoa Grove", price: "₹2,699" },
        { name: "Velvet Shadows", price: "₹1,899" },
        { name: "Harbor Run", price: "₹1,499" }
      ],
      filterKey: "cards"
    },
    family: {
      tag: "All Ages · Low Friction · High Replayability",
      title: "Family Games",
      subtitle: "Generous fun for mixed ages, easy rules, and lively repeat plays.",
      desc: "Designed to bring kids, parents, and friends together with rules taught in under five minutes. These titles balance gentle decision-making, luck mitigation, and cooperative excitement so every player has a blast.",
      complexity: "Beginner Friendly (1.2 – 2.0 / 5)",
      time: "25–45 min",
      best: "Families, multi-generational groups & parties",
      featured: [
        { name: "Circuit Rush", price: "₹3,299" },
        { name: "Meadow Mischief", price: "₹2,499" },
        { name: "Wonder Island", price: "₹2,899" }
      ],
      filterKey: "family"
    },
    puzzles: {
      tag: "Mindful Focus · Tactile Craft · Spatial Deduction",
      title: "Puzzles & Solitaire",
      subtitle: "Peace in every piece—from tactile wooden mechanisms to layered mysteries.",
      desc: "For solo contemplation or cooperative problem solving, our puzzle collection includes artisan wooden interlocking boxes, sequential discovery mechanisms, and escape-room mystery challenges that reward patience and spatial intuition.",
      complexity: "Mindful Spatial & Deductive Challenges",
      time: "30–90 min",
      best: "Solo focus, mindful gifting & mystery lovers",
      featured: [
        { name: "Celestial Sphere", price: "₹1,999" },
        { name: "Labyrinth of Solitude", price: "₹2,499" },
        { name: "Cryptic Vault", price: "₹3,199" }
      ],
      filterKey: "puzzles"
    },
    rpg: {
      tag: "Campaign Gear · Hand-Crafted Polyhedrals · Story Craft",
      title: "RPG Accessories & Tools",
      subtitle: "Dice, journals, screens, and tools crafted for your next shared campaign world.",
      desc: "Elevate your tabletop roleplaying sessions with precision-balanced gemstone and resin dice, vegan leather campaign journals, GM screens, and modular accessories made to enrich character stories and immersive worlds.",
      complexity: "Compatible with D&D, Pathfinder & all TTRPGs",
      time: "Ongoing campaign play",
      best: "Dungeon Masters, roleplayers & keepsakes",
      featured: [
        { name: "Stone & Ember Dice Set", price: "₹1,299" },
        { name: "Wayfinder Journal", price: "₹899" },
        { name: "Dungeon Master Screen", price: "₹2,299" }
      ],
      filterKey: "rpg"
    }
  };

  const categoryDialog = doc.querySelector("[data-category-dialog]");
  const openCategoryModal = (catKey) => {
    const data = categoryDetailsData[catKey] || categoryDetailsData.strategy;
    if (!categoryDialog || !data) return;

    categoryDialog.querySelector("[data-cat-dialog-tag]").textContent = data.tag;
    categoryDialog.querySelector("[data-cat-dialog-title]").textContent = data.title;
    categoryDialog.querySelector("[data-cat-dialog-subtitle]").textContent = data.subtitle;
    categoryDialog.querySelector("[data-cat-dialog-desc]").textContent = data.desc;
    categoryDialog.querySelector("[data-cat-dialog-complexity]").textContent = data.complexity;
    categoryDialog.querySelector("[data-cat-dialog-time]").textContent = data.time;
    categoryDialog.querySelector("[data-cat-dialog-best]").textContent = data.best;

    const featuredWrap = categoryDialog.querySelector("[data-cat-dialog-featured]");
    if (featuredWrap) {
      featuredWrap.innerHTML = data.featured.map((item) => `
        <span class="cat-pill">
          <span>${item.name}</span>
          <strong class="price">${item.price}</strong>
        </span>
      `).join("");
    }

    const filterBtn = categoryDialog.querySelector("[data-cat-dialog-filter]");
    if (filterBtn) {
      filterBtn.querySelector("[data-cat-dialog-filter-text]").textContent = `Browse ${data.title} in Catalog`;
      filterBtn.onclick = () => {
        categoryDialog.close();
        if (page === "products" || doc.querySelector("[data-filter]")) {
          applyCategoryFilter(data.filterKey, true);
          const catalogSection = doc.getElementById("catalog");
          if (catalogSection) {
            catalogSection.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth" });
          }
        } else {
          window.location.href = `${path("pages/products.html")}#${data.filterKey}`;
        }
      };
    }

    categoryDialog.showModal();
  };

  doc.querySelectorAll("[data-category-modal]").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const catKey = trigger.dataset.categoryModal;
      openCategoryModal(catKey);
    });
  });

  doc.querySelector("[data-cat-dialog-close]")?.addEventListener("click", () => categoryDialog?.close());
  categoryDialog?.addEventListener("click", (event) => {
    if (event.target === categoryDialog) categoryDialog.close();
  });

  // Shopping Bag Drawer Dialog Handlers
  const bagDialog = doc.querySelector("[data-bag-dialog]");
  const openBag = () => {
    closeNav();
    updateBagUI();
    bagDialog?.showModal();
  };
  const closeBag = () => bagDialog?.close();

  doc.querySelectorAll("[data-bag-open]").forEach((btn) => btn.addEventListener("click", openBag));
  doc.querySelector("[data-bag-close]")?.addEventListener("click", closeBag);
  doc.querySelector("[data-bag-close-link]")?.addEventListener("click", closeBag);
  bagDialog?.addEventListener("click", (event) => {
    if (event.target === bagDialog) closeBag();
  });

  // Bag Item Quantity & Remove delegated listener
  doc.addEventListener("click", (e) => {
    const plusBtn = e.target.closest("[data-bag-qty-plus]");
    if (plusBtn) {
      updateBagQty(plusBtn.dataset.bagQtyPlus, 1);
      return;
    }
    const minusBtn = e.target.closest("[data-bag-qty-minus]");
    if (minusBtn) {
      updateBagQty(minusBtn.dataset.bagQtyMinus, -1);
      return;
    }
    const removeBtn = e.target.closest("[data-bag-remove]");
    if (removeBtn) {
      removeFromBag(removeBtn.dataset.bagRemove);
      return;
    }
    const clearBtn = e.target.closest("[data-bag-clear]");
    if (clearBtn) {
      clearBag();
      return;
    }

    // Add to bag button delegation
    const addGameBtn = e.target.closest("[data-add-game]");
    if (addGameBtn) {
      const name = addGameBtn.dataset.addGame;
      const price = Number(addGameBtn.dataset.gamePrice || 0);
      const cat = addGameBtn.dataset.gameCat || "Board Game";
      const meta = addGameBtn.dataset.gameMeta || "";
      addToBag({
        id: name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        name,
        category: cat,
        price,
        formattedPrice: `₹${price.toLocaleString("en-IN")}`,
        meta,
      });
      return;
    }

    // Quick View button delegation
    const qvBtn = e.target.closest("[data-quick-view]");
    if (qvBtn) {
      const qvDialog = doc.querySelector("[data-quick-view-dialog]");
      if (!qvDialog) return;
      const title = qvBtn.dataset.qvTitle || "Game";
      const desc = qvBtn.dataset.qvDesc || "Curated board game";
      const cat = qvBtn.dataset.qvCat || "Board Game";
      const price = Number(qvBtn.dataset.qvPrice || 0);
      const players = qvBtn.dataset.qvPlayers || "1–4 players";
      const time = qvBtn.dataset.qvTime || "45 min";

      qvDialog.querySelector("[data-qv-title]").textContent = title;
      qvDialog.querySelector("[data-qv-desc]").textContent = desc;
      qvDialog.querySelector("[data-qv-category]").textContent = cat.toUpperCase();
      qvDialog.querySelector("[data-qv-tag]").textContent = cat;
      qvDialog.querySelector("[data-qv-players]").textContent = players;
      qvDialog.querySelector("[data-qv-time]").textContent = time;
      qvDialog.querySelector("[data-qv-price]").textContent = `₹${price.toLocaleString("en-IN")}`;

      const addBtn = qvDialog.querySelector("[data-qv-add-bag]");
      if (addBtn) {
        addBtn.dataset.addGame = title;
        addBtn.dataset.gamePrice = String(price);
        addBtn.dataset.gameCat = cat;
        addBtn.dataset.gameMeta = `${players} · ${time}`;
      }

      qvDialog.showModal();
    }
  });

  doc.querySelector("[data-qv-close]")?.addEventListener("click", () => {
    doc.querySelector("[data-quick-view-dialog]")?.close();
  });
  doc.querySelector("[data-quick-view-dialog]")?.addEventListener("click", (e) => {
    const d = doc.querySelector("[data-quick-view-dialog]");
    if (e.target === d) d?.close();
  });

  // Forgot Password Dialog handling
  doc.addEventListener("click", (e) => {
    const forgotBtn = e.target.closest("[data-forgot-open]");
    if (forgotBtn) {
      const d = doc.querySelector("[data-forgot-dialog]");
      if (d) {
        d.showModal();
        setTimeout(() => d.querySelector("input")?.focus(), 60);
      }
      return;
    }
    const closeBtn = e.target.closest("[data-forgot-close]");
    if (closeBtn) {
      doc.querySelector("[data-forgot-dialog]")?.close();
      return;
    }
  });

  doc.querySelector("[data-forgot-dialog]")?.addEventListener("click", (e) => {
    const d = doc.querySelector("[data-forgot-dialog]");
    if (e.target === d) d?.close();
  });

  // Comprehensive Search System with Full Store Index
  const searchDialog = doc.querySelector("[data-search-dialog]");
  const searchInput = doc.querySelector("[data-site-search]");
  const searchResults = doc.querySelector("[data-search-results]");

  const searchIndex = [
    // Pages
    { title: "The Collection (Products)", type: "Page", terms: "games shop products catalog store buy browse", url: "pages/products.html" },
    { title: "Find Your Game (Recommendations)", type: "Guide", terms: "recommendation matcher table players solo pairs groups party gift", url: "pages/recommendations.html" },
    { title: "Community Game Nights (Events)", type: "Events", terms: "events game night social schedule rsvp tickets calendar", url: "pages/events.html" },
    { title: "Visit & Contact Us", type: "Store", terms: "contact store hours address telephone phone email location bengaluru", url: "pages/contact.html" },
    { title: "Our Story & Values", type: "About", terms: "about story history philosophy table community curated", url: "pages/about.html" },
    { title: "Store Hours & Schedule", type: "Info", terms: "timings open weekend monday sunday hours", url: "pages/contact.html#hours" },
    { title: "Club & Bulk Orders", type: "Services", terms: "schools library corporate bulk order bundles discounts custom", url: "pages/contact.html#enquiry" },
    
    // Games
    { title: "Eclipse Valley", type: "Game · Strategy", terms: "eclipse valley caravan strategy living map terrain 2-4 players ₹4999", url: "pages/products.html#strategy" },
    { title: "Verdant Paths", type: "Game · Strategy", terms: "verdant paths trails landscape nature solo campaign 1-4 players ₹4499", url: "pages/products.html#strategy" },
    { title: "Cocoa Grove", type: "Game · Card Game", terms: "cocoa grove botanical trading cards harvest market 3-5 players ₹2699", url: "pages/products.html#cards" },
    { title: "Lantern Letters", type: "Game · Card Game", terms: "lantern letters cooperative clues mystery duo 2 players ₹1899", url: "pages/products.html#cards" },
    { title: "Circuit Rush", type: "Game · Family", terms: "circuit rush racing line puzzle cars fast family 2-6 players ₹3299", url: "pages/products.html#family" },
    { title: "Mosaic Commons", type: "Game · Family", terms: "mosaic commons pattern building team game tiles 3-8 players ₹2499", url: "pages/products.html#family" },
    { title: "The Quiet Archive", type: "Game · Puzzle", terms: "quiet archive mystery letters maps tactile 1-4 players ₹3799", url: "pages/products.html#puzzles" },
    { title: "River Form", type: "Game · Puzzle", terms: "river form wooden tactile solo puzzle sculpture 1 player ₹2299", url: "pages/products.html#puzzles" },
    { title: "Starborne Signal", type: "Game · Strategy", terms: "starborne signal space orbital deep strategy expert 2-4 players ₹5899", url: "pages/products.html#strategy" },
    { title: "Stone & Ember Dice Set", type: "Accessory · RPG", terms: "stone ember dice set mineral resin d20 d6 rpg 7-piece ₹1299", url: "pages/products.html#rpg" },
    { title: "Wayfinder Journal", type: "Accessory · RPG", terms: "wayfinder journal campaign maps notes a5 leatherette ₹899", url: "pages/products.html#rpg" },

    // Events
    { title: "New Player Social", type: "Event", terms: "sep 05 saturday social short teaches beginners 18 seats", url: "pages/events.html" },
    { title: "Learn & Play: Cocoa Grove", type: "Event", terms: "sep 12 saturday cocoa grove guided teach 12 seats", url: "pages/events.html" },
    { title: "D&D One-Shot: The Glass Orchard", type: "Event", terms: "sep 19 saturday dungeons dragons level 3 adventure 6 seats", url: "pages/events.html" },
    { title: "Family Game Day", type: "Event", terms: "sep 27 sunday family kids all ages open table", url: "pages/events.html" },
    { title: "After Hours: Heavy Strategy", type: "Event", terms: "oct 03 saturday expert strategy 16 seats", url: "pages/events.html" },
  ];

  const performSearch = (query) => {
    if (!searchResults) return;
    const clean = query.trim().toLowerCase();
    if (clean.length < 2) {
      searchResults.innerHTML = "<p>Type at least two characters to search.</p>";
      return;
    }
    const matches = searchIndex.filter((item) => `${item.title} ${item.type} ${item.terms}`.toLowerCase().includes(clean));
    if (matches.length === 0) {
      searchResults.innerHTML = `<p>No close match for “${query}”. Try ‘strategy’, ‘cards’, ‘dice’, or ‘game night’.</p>`;
      return;
    }

    searchResults.innerHTML = `
      <div class="search-match-list">
        ${matches.map((item) => `
          <a class="search-match-item" href="${path(item.url)}">
            <div class="search-match-copy">
              <span class="search-badge">${item.type}</span>
              <strong>${item.title}</strong>
            </div>
            ${icon("arrow-right")}
          </a>
        `).join("")}
      </div>
    `;
    hydrateIcons(searchResults);
  };

  doc.querySelector("[data-search-open]")?.addEventListener("click", () => {
    searchDialog?.showModal();
    setTimeout(() => searchInput?.focus(), 30);
  });
  doc.querySelector("[data-search-close]")?.addEventListener("click", () => searchDialog?.close());
  searchDialog?.addEventListener("click", (event) => {
    if (event.target === searchDialog) searchDialog.close();
  });

  searchInput?.addEventListener("input", () => performSearch(searchInput.value));

  doc.querySelectorAll("[data-search-suggestion]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (searchInput) {
        searchInput.value = btn.dataset.searchSuggestion;
        performSearch(searchInput.value);
        searchInput.focus();
      }
    });
  });

  // Clipboard copy helper for store contact info
  doc.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", () => {
      const text = button.dataset.copy;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`Copied “${text}” to clipboard.`, "copy");
        });
      }
    });
  });

  // Toast Notification System
  function showToast(message, iconName = "check") {
    const toast = doc.querySelector("[data-toast]");
    if (!toast) return;
    toast.innerHTML = `${icon(iconName)}<span>${message}</span>`;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 3800);
  }

  // Set copyright years
  doc.querySelectorAll("[data-year]").forEach((node) => { node.textContent = new Date().getFullYear(); });
  body.classList.add("page-enter");

  // System Theme Listener
  systemTheme.addEventListener?.("change", (event) => {
    if (!readSetting("mm-theme")) {
      html.dataset.theme = event.matches ? "dark" : "light";
      updateThemeButton();
    }
  });

  // Initialize Bag UI on load
  updateBagUI();

  // Modern 3D Tilt & Micro-Interactions on Pointer Devices
  if (window.matchMedia && window.matchMedia("(pointer: fine)").matches && !reduceMotion.matches) {
    const tiltCards = doc.querySelectorAll(".product-card, .category-card, .recommend-card, .feature-media, .hero__seal");
    tiltCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;
        card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  // Expose global helpers
  window.MeepleAndMarrow = { showToast, hydrateIcons, addToBag, openBag, closeBag };
})();
