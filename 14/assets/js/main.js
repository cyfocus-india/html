(() => {
  'use strict';

  const root = document.documentElement;
  const inPages = location.pathname.includes('/pages/');
  const base = inPages ? '../' : './';
  
  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch (_) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (_) {} }
  };

  const icons = {
    sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/></svg>',
    moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/></svg>',
    globe: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
    // RTL and LTR layout toggle symbol: bidirectional horizontal arrows representing
    // Left-to-Right and Right-to-Left reading directions.
    rtlSymbol: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16m0 0-4-4m4 4-4 4M20 16H4m0 0 4-4m-4 4 4 4"/></svg>',
    textLtr: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16m0 0-4-4m4 4-4 4M20 16H4m0 0 4-4m-4 4 4 4"/></svg>',
    textRtl: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16m0 0-4-4m4 4-4 4M20 16H4m0 0 4-4m-4 4 4 4"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    arrow: '<svg class="btn-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    chevron: '<svg class="dropdown-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.6 2.8 8.1 7 10 4.2-1.9 7-5.4 7-10V6Z"/><path d="m9 12 2 2 4-4"/></svg>',
    truck: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 16h13V7H3zM16 10h3l2 3v3h-5z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
    box: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>'
  };

  window.MoveMateIcons = icons;

  const logo = () => `
    <span class="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#075fd7"/><path d="M15 28 32 14l17 14v21H15Z" fill="#fff"/><path d="M10 36h33v12H10zM43 39h9l4 5v4H43z" fill="#78b9ff" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/><circle cx="20" cy="50" r="5" fill="#062344" stroke="#fff" stroke-width="2"/><circle cx="48" cy="50" r="5" fill="#062344" stroke="#fff" stroke-width="2"/><path d="M28 49V31h8v18" fill="none" stroke="#075fd7" stroke-width="2.5"/></svg>
    </span>
    <span class="brand-type"><strong>MoveMate</strong><small>We Move With Care</small></span>`;

  function currentPage() {
    const raw = location.pathname.split('/').pop().split('?')[0].split('#')[0] || 'index.html';
    if (raw === '' || raw === 'index.html') return 'home';
    if (raw === 'index1.html') return 'home2';
    if (raw === 'dashboard.html') return 'dashboard';
    return raw.replace('.html', '');
  }

  function headerMarkup() {
    const page = currentPage();
    const active = key => page === key ? ' active' : '';
    const isHomeParent = page === 'home' || page === 'home2';
    const isPagesParent = ['contact', 'coming-soon', '404', 'privacy', 'terms'].includes(page);

    return `
      <a class="skip-link" href="#main-content">Skip to content</a>
      <header class="site-header" id="siteHeader">
        <div class="container nav-wrap">
          <a class="brand" href="${base}index.html" aria-label="MoveMate Home">${logo()}</a>
          <nav class="main-nav" id="mainNav" aria-label="Primary navigation">
            <ul class="nav-list">
              <li class="has-dropdown${isHomeParent ? ' active-parent' : ''}">
                <button class="nav-link dropdown-toggle" type="button" aria-expanded="false" aria-haspopup="true">
                  <span>Home</span>
                  ${icons.chevron}
                </button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-link${active('home')}" href="${base}index.html">Home 1</a></li>
                  <li><a class="dropdown-link${active('home2')}" href="${base}index1.html">Home 2</a></li>
                </ul>
              </li>
              <li><a class="nav-link${active('about')}" href="${base}pages/about.html">About</a></li>
              <li><a class="nav-link${active('services')}" href="${base}pages/services.html">Services</a></li>
              <li><a class="nav-link${active('how-it-works')}" href="${base}pages/how-it-works.html">How It Works</a></li>
              <li><a class="nav-link${active('pricing')}" href="${base}pages/pricing.html">Pricing</a></li>
              <li><a class="nav-link${active('service-areas')}" href="${base}pages/service-areas.html">Service Areas</a></li>
              <li><a class="nav-link${active('dashboard')}" href="${base}pages/dashboard.html">Dashboard</a></li>
              <li class="has-dropdown${isPagesParent ? ' active-parent' : ''}">
                <button class="nav-link dropdown-toggle" type="button" aria-expanded="false" aria-haspopup="true">
                  <span>Pages</span>
                  ${icons.chevron}
                </button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-link${active('contact')}" href="${base}pages/contact.html">Contact</a></li>
                  <li><a class="dropdown-link${active('coming-soon')}" href="${base}pages/coming-soon.html">Coming Soon</a></li>
                  <li><a class="dropdown-link${active('404')}" href="${base}pages/404.html">404</a></li>
                  <li><a class="dropdown-link${active('privacy')}" href="${base}pages/privacy.html">Privacy Policy</a></li>
                  <li><a class="dropdown-link${active('terms')}" href="${base}pages/terms.html">Terms &amp; Conditions</a></li>
                </ul>
              </li>
            </ul>
            <div class="mobile-nav-footer">
              <a class="btn btn-primary btn-sm full" href="${base}pages/signin.html">${icons.user}<span>Login</span></a>
            </div>
          </nav>
          <div class="nav-actions">
            <button class="icon-btn theme-toggle" type="button" aria-label="Switch color theme" title="Switch color theme">${icons.moon}</button>
            <button class="icon-btn rtl-toggle" type="button" aria-label="Switch to right-to-left layout" aria-pressed="false" title="Switch to right-to-left layout">${icons.rtlSymbol}</button>
            <a class="btn btn-primary btn-sm login-btn" href="${base}pages/signin.html" aria-label="Login">${icons.user}<span>Login</span></a>
            <button class="icon-btn menu-toggle" type="button" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle mobile menu">${icons.menu}</button>
          </div>
        </div>
      </header>`;
  }

  function footerMarkup() {
    return `
      <footer class="site-footer">
        <div class="container footer-grid">
          <div class="footer-brand">
            <a class="brand" href="${base}index.html" aria-label="MoveMate Home">${logo()}</a>
            <p>India’s trusted home shifting, packing and corporate relocation partner. Every move is planned, protected and tracked door to door.</p>
          </div>
          <div class="footer-col">
            <h3>Main Pages</h3>
            <ul>
              <li><a href="${base}index.html">Home 1</a></li>
              <li><a href="${base}index1.html">Home 2</a></li>
              <li><a href="${base}pages/about.html">About Us</a></li>
              <li><a href="${base}pages/how-it-works.html">How It Works</a></li>
              <li><a href="${base}pages/pricing.html">Pricing</a></li>
              <li><a href="${base}pages/contact.html">Contact</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h3>Services &amp; Areas</h3>
            <ul>
              <li><a href="${base}pages/services.html">Services</a></li>
              <li><a href="${base}pages/service-areas.html">Service Areas</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h3>Account &amp; Utility</h3>
            <ul>
              <li><a href="${base}pages/dashboard.html">Dashboard</a></li>
              <li><a href="${base}pages/signin.html">Sign In</a></li>
              <li><a href="${base}pages/signup.html">Sign Up</a></li>
              <li><a href="${base}pages/coming-soon.html">Coming Soon</a></li>
              <li><a href="${base}pages/404.html">404</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h3>Legal &amp; Contact</h3>
            <ul>
              <li><a href="${base}pages/privacy.html">Privacy Policy</a></li>
              <li><a href="${base}pages/terms.html">Terms &amp; Conditions</a></li>
            </ul>
            <div class="socials" aria-label="Social media channels" style="margin-top:14px">
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" title="X (Twitter)">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
            <a href="tel:+919876543210" style="font-weight:600;color:#fff;font-size:1.02rem;display:inline-block;margin-top:10px">+91 98765 43210</a>
          </div>
        </div>
        <div class="container footer-bottom">
          <span>© <span data-year></span> MoveMate Logistics &amp; Relocations Pvt. Ltd. All rights reserved.</span>
          <span>Safe • Transparent • Insured Delivery</span>
        </div>
      </footer>`;
  }

  function quoteModalMarkup() {
    return `<div class="modal-backdrop" id="quoteModal" role="dialog" aria-modal="true" aria-labelledby="quoteTitle">
      <div class="quote-modal">
        <div class="modal-head">
          <div>
            <span class="eyebrow">Instant Free Estimate</span>
            <h2 id="quoteTitle">Plan Your Move With Care</h2>
          </div>
          <button class="icon-btn modal-close" type="button" aria-label="Close quote form">${icons.close}</button>
        </div>
        <form class="validate-form" data-success="Thank you! Your MoveMate quote request has been received. Our moving specialist will contact you shortly with a confirmed quote." novalidate>
          <div class="field-grid">
            <div class="field">
              <label for="quoteName">Full Name</label>
              <input id="quoteName" name="name" autocomplete="name" placeholder="E.g. Rahul Sharma" required minlength="2">
              <span class="error" aria-live="polite"></span>
            </div>
            <div class="field">
              <label for="quotePhone">Phone Number</label>
              <input id="quotePhone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="+91 98765 43210" pattern="[0-9+() -]{10,}" required>
              <span class="error" aria-live="polite"></span>
            </div>
          </div>
          <div class="field-grid">
            <div class="field">
              <label for="quoteFrom">Pickup City / Area</label>
              <input id="quoteFrom" name="pickup" placeholder="E.g. Bengaluru" required minlength="2">
              <span class="error" aria-live="polite"></span>
            </div>
            <div class="field">
              <label for="quoteTo">Delivery City / Area</label>
              <input id="quoteTo" name="delivery" placeholder="E.g. Hyderabad" required minlength="2">
              <span class="error" aria-live="polite"></span>
            </div>
          </div>
          <div class="field-grid">
            <div class="field">
              <label for="quoteType">Service Type</label>
              <select id="quoteType" name="serviceType" required>
                <option value="local">Local Household Shifting</option>
                <option value="intercity">Intercity Relocation</option>
                <option value="auto">Vehicle Carrier (Cars &amp; Two-Wheelers)</option>
                <option value="office">Office / Commercial Shifting</option>
                <option value="packing">Professional Packing Only</option>
              </select>
              <span class="error" aria-live="polite"></span>
            </div>
            <div class="field">
              <label for="quoteSize">Home / Office Size or Vehicle Type</label>
              <select id="quoteSize" name="size" required>
                <option value="">Select Size / Capacity</option>
                <optgroup label="Household Moves">
                  <option value="1bhk">1 BHK / Studio</option>
                  <option value="2bhk" selected>2 BHK Standard</option>
                  <option value="3bhk">3 BHK Large</option>
                  <option value="4bhk">4+ BHK / Villa</option>
                  <option value="custom">Custom / Luxury Estate</option>
                  <option value="office">Office / Commercial Space</option>
                </optgroup>
                <optgroup label="Vehicle Transport">
                  <option value="bike">Two-Wheeler / Scooter / Bike</option>
                  <option value="superbike">Superbike / Cruiser</option>
                  <option value="car">Standard Car (Sedan / Hatchback)</option>
                  <option value="suv">SUV / Luxury Vehicle</option>
                </optgroup>
              </select>
              <span class="error" aria-live="polite"></span>
            </div>
          </div>
          <div class="field">
            <label for="quoteDate">Preferred Moving Date</label>
            <input id="quoteDate" name="moveDate" type="date" required>
            <span class="error" aria-live="polite"></span>
          </div>
          <button class="btn btn-primary full" style="margin-top:10px" type="submit">
            <span>Request My Free Quote</span>
            ${icons.arrow}
          </button>
          <small class="center" style="display:block;margin-top:8px">100% Free &amp; No Obligation. No hidden fees or spam guaranteed.</small>
        </form>
      </div>
    </div>`;
  }

  const serviceDetails = {
    local: {
      title: 'Local Household Shifting',
      badge: 'Same-Day City Relocation',
      tagline: 'Fast & Careful Doorstep Moving',
      image: 'assets/images/photo-service-local.jpg',
      description: 'Our local home shifting service is engineered for effortless, zero-stress moving within your city. Our background-verified crew manages everything from dismantling beds and heavy wardrobes to multi-layer bubble wrapping, safe vehicle loading, transit, and complete reassembly in your new home—all within a single day.',
      inclusions: [
        'Dedicated 3 to 5 mover crew + dedicated supervisor',
        'Doorstep furniture disassembly (beds, tables, wardrobes) and reassembly',
        'Multi-layer bubble wrap & quilted blanket padding for heavy appliances',
        'Floor and doorway protection runners to prevent scratches',
        'Dedicated closed container truck exclusively for your goods (no co-loading)',
        'Room-by-room box placement and basic settling support'
      ],
      materials: '5-ply corrugated moving boxes, multi-layer bubble wrap, virgin stretch film, appliance dollies, and corner edge protectors.',
      timing: 'Same-day completion (typically 4 to 8 hours depending on home size).',
      pricing: 'Starting from ₹2,800 for 1 BHK / Studio (City radius up to 30 km).',
      serviceKey: 'local'
    },
    intercity: {
      title: 'Intercity Relocation',
      badge: 'Pan-India Long Distance',
      tagline: 'Direct Dedicated Sealed Containers',
      image: 'assets/images/photo-service-intercity.jpg',
      description: 'Moving between cities requires dependable scheduling and uncompromising security. MoveMate provides dedicated, tamper-sealed container trucks that travel directly from your pickup address to your destination city without transshipment or shared cargo. Every vehicle is GPS-tracked in real-time with automated milestone updates.',
      inclusions: [
        'Exclusive dedicated sealed container truck (no shared cargo or transshipment)',
        'Tamper-evident serial seal locked at your doorstep and verified at destination',
        '24/7 Live GPS checkpoint tracking with driver direct phone contact',
        'Comprehensive transit insurance coverage against accidental road hazards',
        'Dedicated Move Coordinator managing all inter-state tolls and paperwork',
        'Careful unloading, unpacking, and room arrangement at destination'
      ],
      materials: 'Heavy-duty 5-ply cartons, waterproof shrink wrapping, wooden crating for delicate items, and specialized vehicle tie-down strapping.',
      timing: 'Guaranteed transit schedule (24 to 72 hours based on route distance).',
      pricing: 'Starting from ₹6,500 + tolls and state taxes (Distance based rate card).',
      serviceKey: 'intercity'
    },
    packing: {
      title: 'Professional Packing & Unpacking',
      badge: 'Zero-Damage Protection',
      tagline: '5-Layer Cushioning Protocol',
      image: 'assets/images/photo-service-packing.jpg',
      description: 'Packing is the critical foundation of a damage-free move. Our certified packing specialists use standardized 5-layer cushioning tailored to each item category—from delicate crystal stemware and LED televisions to antique wooden furniture, paintings, and heavy kitchenware.',
      inclusions: [
        'Room-by-room color-coded inventory labeling and itemized packing manifest',
        'Multi-layer bubble wrap and corrugated separation for glassware and chinaware',
        'Custom foam corner protectors and heavy blanket wrap for TVs and monitors',
        'Anti-static bubble wrap for sensitive home office and computer equipment',
        'Waterproof high-density stretch wrapping for mattresses and sofas',
        'Complete unpacking and carton debris removal at your destination home'
      ],
      materials: 'Virgin bubble wrap, 5-ply virgin craft cartons, foam corner guards, packing peanuts, heavy PVC tape, and stretch film.',
      timing: 'Full household packing completed in 3 to 6 hours prior to transit.',
      pricing: 'Starting from ₹1,800 (Full packing materials and skilled labor included).',
      serviceKey: 'packing'
    },
    office: {
      title: 'Office & Corporate Relocation',
      badge: 'Zero Business Downtime',
      tagline: 'Weekend & Overnight Transitions',
      image: 'assets/images/photo-service-office.jpg',
      description: 'We understand that business downtime equals lost revenue. MoveMate executes corporate relocations on optimized schedules—including evenings and weekends—so your team can log off on Friday and resume full operations at the new office on Monday morning.',
      inclusions: [
        'Pre-move site survey and phased floor-plan relocation blueprints',
        'Anti-static protective packaging and numbered crate labeling for IT servers and monitors',
        'Disassembly and precision setup of modular workstations, cubicles, and conference tables',
        'Confidential document bins and high-security tamper-evident seals',
        'Specialized hydraulic lift vehicles and heavy safe / server rigging equipment',
        'Post-move cleanup and immediate workstation power-on readiness'
      ],
      materials: 'Anti-static electronic wraps, heavy-duty plastic rental crates, foam-padded monitor sleeves, and hydraulic machinery dollies.',
      timing: 'Overnight or weekend transition tailored to your company operations schedule.',
      pricing: 'Starting from ₹7,800 (Custom corporate rate based on workstation count).',
      serviceKey: 'office'
    }
  };

  function serviceModalMarkup() {
    return `<div class="modal-backdrop" id="serviceModal" role="dialog" aria-modal="true" aria-labelledby="serviceModalTitle">
      <div class="service-modal">
        <div class="modal-head">
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <span class="eyebrow" id="serviceModalBadge" style="margin-bottom:0"></span>
            <span class="paid-pill" id="serviceModalTagline"></span>
          </div>
          <button class="icon-btn modal-close" type="button" aria-label="Close service details">${icons.close}</button>
        </div>
        <div class="service-modal-body">
          <div class="service-modal-visual">
            <img id="serviceModalImg" src="" alt="Service illustration" width="300" height="240">
          </div>
          <div class="service-modal-content">
            <h2 id="serviceModalTitle" style="margin-bottom:8px"></h2>
            <p id="serviceModalDesc" style="font-size:0.95rem;line-height:1.6;color:var(--text);margin-bottom:16px"></p>
            <h3 style="font-size:1.02rem;margin-bottom:8px">What's Included In This Service:</h3>
            <ul class="check-list" id="serviceModalInclusions" style="font-size:0.88rem;margin-bottom:18px"></ul>
            <div class="service-modal-grid">
              <div class="service-modal-info-box">
                <span class="eyebrow" style="margin-bottom:4px">Materials &amp; Fleet</span>
                <p id="serviceModalMaterials" style="font-size:0.84rem;margin-bottom:0;color:var(--ink)"></p>
              </div>
              <div class="service-modal-info-box">
                <span class="eyebrow" style="margin-bottom:4px">Estimated Timeline</span>
                <p id="serviceModalTiming" style="font-size:0.84rem;margin-bottom:0;color:var(--ink)"></p>
              </div>
            </div>
            <div class="service-modal-price-bar">
              <div>
                <small style="color:var(--muted);font-weight:600">PRICING GUIDELINE</small>
                <div id="serviceModalPrice" style="font-size:1.15rem;font-weight:600;color:var(--brand-ink)"></div>
              </div>
              <div style="display:flex;gap:10px;flex-wrap:wrap">
                <button class="btn btn-primary btn-sm service-book-now" type="button">
                  <span>Book This Service Now</span>
                  ${icons.arrow}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }

  function setTheme(theme) {
    root.dataset.theme = theme;
    storage.set('movemate-theme', theme);
    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach(toggle => {
      toggle.innerHTML = theme === 'dark' ? icons.sun : icons.moon;
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      toggle.setAttribute('title', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    });
  }

  function setupTheme() {
    const saved = storage.get('movemate-theme');
    const preferred = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(saved || preferred);
    document.querySelectorAll('.theme-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        showToast(next === 'dark' ? 'Dark mode enabled.' : 'Light mode enabled.');
      });
    });
  }

  function setupDirection() {
    const saved = storage.get('movemate-direction') || 'ltr';
    root.dir = saved;
    const toggles = document.querySelectorAll('.rtl-toggle');

    const sync = () => {
      const isRtl = root.dir === 'rtl';
      const label = isRtl ? 'Switch to left-to-right layout (LTR)' : 'Switch to right-to-left layout (RTL)';
      toggles.forEach(toggle => {
        toggle.innerHTML = icons.rtlSymbol;
        toggle.setAttribute('aria-pressed', String(isRtl));
        toggle.classList.toggle('active', isRtl);
        toggle.setAttribute('aria-label', label);
        toggle.setAttribute('title', label);
      });
    };
    sync();

    toggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        root.dir = root.dir === 'rtl' ? 'ltr' : 'rtl';
        storage.set('movemate-direction', root.dir);
        sync();
        showToast(root.dir === 'rtl' ? 'Right-to-left layout enabled.' : 'Left-to-right layout enabled.');
      });
    });
  }

  function setupDropdowns() {
    document.querySelectorAll('.has-dropdown').forEach(dropdown => {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      if (!toggle) return;

      toggle.addEventListener('click', event => {
        event.stopPropagation();
        const isOpen = dropdown.classList.contains('open');
        
        // Close other dropdowns
        document.querySelectorAll('.has-dropdown.open').forEach(other => {
          if (other !== dropdown) {
            other.classList.remove('open');
            other.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
          }
        });

        dropdown.classList.toggle('open', !isOpen);
        toggle.setAttribute('aria-expanded', String(!isOpen));
      });
    });

    document.addEventListener('click', event => {
      if (!event.target.closest('.has-dropdown')) {
        document.querySelectorAll('.has-dropdown.open').forEach(dropdown => {
          dropdown.classList.remove('open');
          dropdown.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
        });
      }
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        document.querySelectorAll('.has-dropdown.open').forEach(dropdown => {
          dropdown.classList.remove('open');
          dropdown.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  function setupMenu() {
    const nav = document.querySelector('.main-nav');
    const toggle = document.querySelector('.menu-toggle');
    if (!nav || !toggle) return;
    
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.innerHTML = open ? icons.close : icons.menu;
      document.body.classList.toggle('no-scroll', open);
    });

    nav.addEventListener('click', event => {
      if ((event.target.closest('a') && !event.target.closest('.dropdown-toggle')) || event.target.closest('.quote-open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = icons.menu;
        document.body.classList.remove('no-scroll');
      }
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = icons.menu;
        document.body.classList.remove('no-scroll');
      }
    });
  }

  function setupQuoteModal() {
    const modal = document.getElementById('quoteModal');
    if (!modal) return;
    let lastFocus;

    const open = (serviceType = '', pickupLocation = '', homeSize = '') => {
      lastFocus = document.activeElement;
      if (serviceType) {
        const select = modal.querySelector('#quoteType');
        if (select) {
          const val = (serviceType === 'vehicle' || serviceType === 'auto_carrier') ? 'auto' : serviceType;
          if (select.querySelector(`option[value="${val}"]`)) {
            select.value = val;
          }
        }
      }
      if (homeSize) {
        const sizeSelect = modal.querySelector('#quoteSize');
        if (sizeSelect) {
          const norm = String(homeSize).toLowerCase().replace(/[^a-z0-9]/g, '');
          let opt = Array.from(sizeSelect.options).find(o => {
            if (!o.value) return false;
            const oVal = o.value.toLowerCase().replace(/[^a-z0-9]/g, '');
            const oText = o.textContent.toLowerCase().replace(/[^a-z0-9]/g, '');
            return oVal === norm || oText.includes(norm) ||
                   (norm.includes('1') && oVal === '1bhk') ||
                   (norm.includes('2') && oVal === '2bhk') ||
                   (norm.includes('3') && oVal === '3bhk') ||
                   ((norm.includes('4') || norm.includes('custom') || norm.includes('villa')) && (oVal === '4bhk' || oVal === 'custom')) ||
                   ((norm.includes('bike') || norm.includes('two') || norm.includes('scooter')) && oVal === 'bike') ||
                   ((norm.includes('superbike') || norm.includes('cruiser')) && oVal === 'superbike') ||
                   ((norm.includes('car') || norm.includes('sedan') || norm.includes('hatch')) && oVal === 'car') ||
                   ((norm.includes('suv') || norm.includes('lux') || norm.includes('muv')) && oVal === 'suv');
          });
          if (opt) {
            sizeSelect.value = opt.value;
          }
        }
      }
      if (pickupLocation) {
        const pickupInput = modal.querySelector('#quotePickup') || modal.querySelector('#quoteFrom');
        if (pickupInput) pickupInput.value = pickupLocation;
      }
      modal.classList.add('open');
      document.body.classList.add('no-scroll');
      setTimeout(() => modal.querySelector('input')?.focus(), 100);
    };

    window.openMoveMateQuote = open;

    const close = () => {
      modal.classList.remove('open');
      document.body.classList.remove('no-scroll');
      lastFocus?.focus();
    };

    document.querySelectorAll('.quote-open').forEach(button => {
      button.addEventListener('click', () => {
        const service = button.dataset.service || button.dataset.quoteType || '';
        const pickup = button.dataset.pickup || button.dataset.city || button.dataset.quoteOrigin || button.dataset.origin || '';
        const size = button.dataset.homeSize || button.dataset.size || '';
        open(service, pickup, size);
      });
    });

    modal.querySelector('.modal-close')?.addEventListener('click', close);
    modal.addEventListener('click', event => { if (event.target === modal) close(); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && modal.classList.contains('open')) close();
    });
  }

  function setupServiceModal() {
    const modal = document.getElementById('serviceModal');
    if (!modal) return;
    let lastFocus;

    const badgeEl = modal.querySelector('#serviceModalBadge');
    const taglineEl = modal.querySelector('#serviceModalTagline');
    const titleEl = modal.querySelector('#serviceModalTitle');
    const descEl = modal.querySelector('#serviceModalDesc');
    const imgEl = modal.querySelector('#serviceModalImg');
    const inclusionsEl = modal.querySelector('#serviceModalInclusions');
    const materialsEl = modal.querySelector('#serviceModalMaterials');
    const timingEl = modal.querySelector('#serviceModalTiming');
    const priceEl = modal.querySelector('#serviceModalPrice');
    const bookBtn = modal.querySelector('.service-book-now');

    let currentServiceKey = 'local';

    const openService = key => {
      const details = serviceDetails[key] || serviceDetails.local;
      currentServiceKey = details.serviceKey;
      lastFocus = document.activeElement;

      if (badgeEl) badgeEl.textContent = details.badge;
      if (taglineEl) taglineEl.textContent = details.tagline;
      if (titleEl) titleEl.textContent = details.title;
      if (descEl) descEl.textContent = details.description;
      if (imgEl) {
        imgEl.src = `${base}${details.image}`;
        imgEl.alt = details.title;
      }
      if (inclusionsEl) {
        inclusionsEl.innerHTML = details.inclusions.map(inc => `<li>${inc}</li>`).join('');
      }
      if (materialsEl) materialsEl.textContent = details.materials;
      if (timingEl) timingEl.textContent = details.timing;
      if (priceEl) priceEl.textContent = details.pricing;

      modal.classList.add('open');
      document.body.classList.add('no-scroll');
      setTimeout(() => modal.querySelector('.modal-close')?.focus(), 100);
    };

    const closeService = () => {
      modal.classList.remove('open');
      document.body.classList.remove('no-scroll');
      lastFocus?.focus();
    };

    document.querySelectorAll('[data-explore-service], .explore-service-btn').forEach(btn => {
      btn.addEventListener('click', event => {
        event.preventDefault();
        const key = btn.dataset.exploreService || 'local';
        openService(key);
      });
    });

    if (bookBtn) {
      bookBtn.addEventListener('click', () => {
        closeService();
        setTimeout(() => {
          const quoteModal = document.getElementById('quoteModal');
          if (quoteModal) {
            const select = quoteModal.querySelector('#quoteType');
            if (select && select.querySelector(`option[value="${currentServiceKey}"]`)) {
              select.value = currentServiceKey;
            }
            quoteModal.classList.add('open');
            document.body.classList.add('no-scroll');
            setTimeout(() => quoteModal.querySelector('input')?.focus(), 100);
          }
        }, 300);
      });
    }

    modal.querySelector('.modal-close')?.addEventListener('click', closeService);
    modal.addEventListener('click', event => { if (event.target === modal) closeService(); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && modal.classList.contains('open')) closeService();
    });

    window.openMoveMateServiceModal = openService;
  }

  function messageFor(field) {
    if (field.validity.valueMissing) return 'This field is required.';
    if (field.validity.typeMismatch) return 'Please enter a valid email address.';
    if (field.validity.patternMismatch) return 'Please enter a valid phone number (at least 10 digits).';
    if (field.validity.tooShort) return `Please enter at least ${field.minLength} characters.`;
    return 'Please check this field.';
  }

  function validateForm(form) {
    let valid = true;
    form.querySelectorAll('input, select, textarea').forEach(field => {
      const error = field.closest('.field')?.querySelector('.error');
      if (!field.checkValidity()) {
        valid = false;
        field.setAttribute('aria-invalid', 'true');
        if (error) error.textContent = messageFor(field);
      } else {
        field.removeAttribute('aria-invalid');
        if (error) error.textContent = '';
      }
    });
    form.querySelector('[aria-invalid="true"]')?.focus();
    return valid;
  }

  function setupForms() {
    document.querySelectorAll('.validate-form').forEach(form => {
      form.addEventListener('input', event => {
        const field = event.target;
        if (field.matches('[aria-invalid="true"]') && field.checkValidity()) {
          field.removeAttribute('aria-invalid');
          const error = field.closest('.field')?.querySelector('.error');
          if (error) error.textContent = '';
        }
      });
      form.addEventListener('submit', event => {
        event.preventDefault();
        if (!validateForm(form)) return;
        showToast(form.dataset.success || 'Thank you! Your request has been submitted.');
        form.reset();
        if (form.closest('#quoteModal')) {
          setTimeout(() => document.querySelector('#quoteModal .modal-close')?.click(), 900);
        }
      });
    });
  }

  function setupReveal() {
    // Auto-tag key components across all pages for smooth scroll reveals
    document.querySelectorAll(`
      .section-head, .service-card, .process-card, .content-card, 
      .feature-quad, .benefit-item, .contact-item, .faq-item, 
      .pricing-table, .form-panel, .price-panel, .track-panel, 
      .coverage-layout, .impact-stat, .prose > h2, .prose > p, 
      .prose > ul, .timeline, .cta-panel
    `).forEach(el => el.classList.add('reveal'));

    const items = document.querySelectorAll('.reveal');
    if (!items.length || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach(item => item.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px' });
    
    items.forEach((item, index) => {
      const parent = item.parentElement;
      const siblingIndex = parent ? Array.from(parent.children).indexOf(item) : index;
      const delay = (siblingIndex >= 0 ? siblingIndex % 4 : index % 4) * 80;
      item.style.transitionDelay = `${delay}ms`;
      observer.observe(item);
    });
  }

  function setupCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const start = performance.now();
        const tick = now => {
          const progress = Math.min((now - start) / 1200, 1);
          const value = Math.round(target * (1 - Math.pow(1 - progress, 3)));
          el.textContent = value.toLocaleString('en-IN') + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    }, { threshold: 0.3 });
    counters.forEach(counter => observer.observe(counter));
  }

  function setupFaqs() {
    document.querySelectorAll('.faq-q').forEach(button => {
      button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        const open = item.classList.toggle('open');
        button.setAttribute('aria-expanded', String(open));
      });
    });
  }

  function setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(button => {
      button.addEventListener('click', () => {
        button.parentElement.querySelectorAll('.tab-btn').forEach(item => item.classList.remove('active'));
        button.classList.add('active');
        const region = button.dataset.region;
        document.querySelectorAll('[data-city-region]').forEach(column => {
          column.hidden = region !== 'all' && column.dataset.cityRegion !== region;
        });
      });
    });
  }

  function setupCitySearch() {
    const input = document.getElementById('citySearchInput');
    if (!input) return;
    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      const items = document.querySelectorAll('.city-columns li');
      items.forEach(li => {
        const text = li.textContent.toLowerCase();
        const match = text.includes(query);
        li.style.display = match ? '' : 'none';
      });
    });
  }

  function initInteractiveMap() {
    const mapContainer = document.getElementById('serviceAreaLiveMap');
    if (!mapContainer) return;

    const hubs = [
      // North India (10)
      { name: 'Delhi NCR Central Hub', city: 'Delhi NCR', lat: 28.6139, lng: 77.2090, region: 'north', fleet: '45 Dedicated Trucks', address: 'Plot 18, Okhla Industrial Area Phase III, New Delhi', areas: 'Delhi, Central NCR, Connaught Place, Dwarka' },
      { name: 'Gurugram Logistics Node', city: 'Gurugram', lat: 28.4595, lng: 77.0266, region: 'north', fleet: '35 Dedicated Trucks', address: 'DLF Cyber City Node, Sector 29, Gurugram', areas: 'Cyber City, Golf Course Rd, Sohna Rd, Manesar' },
      { name: 'Noida Shifting Center', city: 'Noida', lat: 28.5355, lng: 77.3910, region: 'north', fleet: '30 Dedicated Trucks', address: 'Sector 62 Logistics Park, Noida', areas: 'Noida Sector 18-150, Greater Noida West, Expressway' },
      { name: 'Ghaziabad Industrial Hub', city: 'Ghaziabad', lat: 28.6692, lng: 77.4538, region: 'north', fleet: '20 Dedicated Trucks', address: 'Sahibabad Industrial Area, Ghaziabad', areas: 'Indirapuram, Vaishali, Vasundhara, Raj Nagar' },
      { name: 'Faridabad Logistics Depot', city: 'Faridabad', lat: 28.4089, lng: 77.3178, region: 'north', fleet: '18 Dedicated Trucks', address: 'Mathura Road Depot, Faridabad', areas: 'Sector 15-21, Neharpar, Green Field, Ballabhgarh' },
      { name: 'Chandigarh Tri-City Hub', city: 'Chandigarh', lat: 30.7333, lng: 76.7794, region: 'north', fleet: '16 Dedicated Trucks', address: 'Industrial Area Phase 1, Chandigarh', areas: 'Chandigarh, Mohali, Panchkula, Zirakpur, Kharar' },
      { name: 'Jaipur Heritage Gateway', city: 'Jaipur', lat: 26.9124, lng: 75.7873, region: 'north', fleet: '20 Dedicated Trucks', address: 'VKIA Road No. 14, Jaipur', areas: 'Vaishali Nagar, Mansarovar, Malviya Nagar, C-Scheme' },
      { name: 'Lucknow Central UP Hub', city: 'Lucknow', lat: 26.8467, lng: 80.9462, region: 'north', fleet: '18 Dedicated Trucks', address: 'Transport Nagar, Kanpur Road, Lucknow', areas: 'Gomti Nagar, Hazratganj, Alambagh, Indira Nagar' },
      { name: 'Dehradun Hill Node', city: 'Dehradun', lat: 30.3165, lng: 78.0322, region: 'north', fleet: '12 Dedicated Trucks', address: 'Patel Nagar Transport Hub, Dehradun', areas: 'Rajpur Road, Clement Town, Sahastradhara, Mussoorie' },
      { name: 'Agra Express Hub', city: 'Agra', lat: 27.1767, lng: 78.0081, region: 'north', fleet: '14 Dedicated Trucks', address: 'Sikandra Industrial Area, Agra', areas: 'Tajganj, Sanjay Place, Dayalbagh, Kamla Nagar' },

      // West India (10)
      { name: 'Mumbai Western Mega Hub', city: 'Mumbai', lat: 19.0760, lng: 72.8777, region: 'west', fleet: '50 Dedicated Trucks', address: 'Central Logistics Park, Andheri East, Mumbai', areas: 'Andheri, Bandra, Powai, Borivali, Dadar, Colaba' },
      { name: 'Pune Expressway Node', city: 'Pune', lat: 18.5204, lng: 73.8567, region: 'west', fleet: '28 Dedicated Trucks', address: 'Hinjawadi Phase 2 Logistics Park, Pune', areas: 'Hinjawadi, Wakad, Baner, Kothrud, Hadapsar, Viman Nagar' },
      { name: 'Thane Central Depot', city: 'Thane', lat: 19.2183, lng: 72.9781, region: 'west', fleet: '22 Dedicated Trucks', address: 'Wagle Estate Transport Center, Thane', areas: 'Ghodbunder Rd, Majiwada, Vartak Nagar, Naupada' },
      { name: 'Navi Mumbai Gateway', city: 'Navi Mumbai', lat: 19.0330, lng: 73.0297, region: 'west', fleet: '24 Dedicated Trucks', address: 'APMC Logistics Terminal, Vashi, Navi Mumbai', areas: 'Vashi, Nerul, Kharghar, Belapur, Panvel, Airoli' },
      { name: 'Nagpur Central Cargo Node', city: 'Nagpur', lat: 21.1458, lng: 79.0882, region: 'west', fleet: '20 Dedicated Trucks', address: 'MIHAN Cargo Hub, Nagpur', areas: 'Dharampeth, Wardha Road, Ramdaspeth, Civil Lines' },
      { name: 'Nashik Industrial Node', city: 'Nashik', lat: 19.9975, lng: 73.7898, region: 'west', fleet: '14 Dedicated Trucks', address: 'Ambad MIDC Logistics Park, Nashik', areas: 'College Road, Indira Nagar, Panchavati, Satpur' },
      { name: 'Ahmedabad Commercial Hub', city: 'Ahmedabad', lat: 23.0225, lng: 72.5714, region: 'west', fleet: '24 Dedicated Trucks', address: 'Sanand Industrial Estate, Ahmedabad', areas: 'SG Highway, Satellite, Bodakdev, Prahlad Nagar, Bopal' },
      { name: 'Surat Textile City Node', city: 'Surat', lat: 21.1702, lng: 72.8311, region: 'west', fleet: '18 Dedicated Trucks', address: 'Ring Road Transport Hub, Surat', areas: 'Adajan, Vesu, Piplod, Varachha, Citylight' },
      { name: 'Vadodara Transit Node', city: 'Vadodara', lat: 22.3072, lng: 73.1812, region: 'west', fleet: '16 Dedicated Trucks', address: 'Makarpura GIDC Terminal, Vadodara', areas: 'Alkapuri, Gotri, Manjalpur, Vasna Road, Karelibaug' },
      { name: 'Goa Coastal Gateway', city: 'Goa', lat: 15.2993, lng: 74.1240, region: 'west', fleet: '12 Dedicated Trucks', address: 'Verna Industrial Estate, South Goa', areas: 'Panaji, Margao, Vasco, Porvorim, Mapusa, Calangute' },

      // South India (10)
      { name: 'Bengaluru Tech Gateway', city: 'Bengaluru', lat: 12.9716, lng: 77.5946, region: 'south', fleet: '42 Dedicated Trucks', address: 'Whitefield Industrial Zone, Bengaluru', areas: 'Indiranagar, Koramangala, Whitefield, HSR, Electronic City' },
      { name: 'Hyderabad Deccan Hub', city: 'Hyderabad', lat: 17.3850, lng: 78.4867, region: 'south', fleet: '35 Dedicated Trucks', address: 'Hitech City Transport Hub, Madhapur, Hyderabad', areas: 'Madhapur, Hitech City, Gachibowli, Jubilee Hills, Kondapur' },
      { name: 'Chennai Coastal Center', city: 'Chennai', lat: 13.0827, lng: 80.2707, region: 'south', fleet: '30 Dedicated Trucks', address: 'Ambattur Industrial Estate, Chennai', areas: 'OMR, Anna Nagar, T. Nagar, Velachery, Adyar, Tambaram' },
      { name: 'Coimbatore Industrial Node', city: 'Coimbatore', lat: 11.0168, lng: 76.9558, region: 'south', fleet: '18 Dedicated Trucks', address: 'Peelamedu Transport Node, Coimbatore', areas: 'RS Puram, Gandhipuram, Peelamedu, Saibaba Colony' },
      { name: 'Kochi Port Logistics Hub', city: 'Kochi', lat: 9.9312, lng: 76.2673, region: 'south', fleet: '15 Dedicated Trucks', address: 'Kalamassery Container Depot, Kochi', areas: 'Kakkanad, Marine Drive, Edappally, Panampilly Nagar' },
      { name: 'Madurai Temple City Node', city: 'Madurai', lat: 9.9252, lng: 78.1198, region: 'south', fleet: '12 Dedicated Trucks', address: 'Kappalur Industrial Estate, Madurai', areas: 'KK Nagar, Anna Nagar, Simmakkal, Tallakulam' },
      { name: 'Vijayawada Andhra Hub', city: 'Vijayawada', lat: 16.5062, lng: 80.6480, region: 'south', fleet: '14 Dedicated Trucks', address: 'Autonagar Logistics Park, Vijayawada', areas: 'Benz Circle, Governorpet, MG Road, Gannavaram' },
      { name: 'Visakhapatnam Harbor Node', city: 'Visakhapatnam', lat: 17.6868, lng: 83.2185, region: 'south', fleet: '16 Dedicated Trucks', address: 'Gajuwaka Industrial Zone, Visakhapatnam', areas: 'MVP Colony, Siripuram, Gajuwaka, Madhurawada' },
      { name: 'Thiruvananthapuram Capital Hub', city: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366, region: 'south', fleet: '12 Dedicated Trucks', address: 'Technopark Transport Desk, Thiruvananthapuram', areas: 'Kazhakkoottam, Kowdiar, Vellayambalam, Sasthamangalam' },
      { name: 'Mysuru Heritage Node', city: 'Mysuru', lat: 12.2958, lng: 76.6394, region: 'south', fleet: '14 Dedicated Trucks', address: 'Hebbal Industrial Area, Mysuru', areas: 'Gokulam, Jayalakshmipuram, Vijayanagar, Kuvempunagar' },

      // East India (10)
      { name: 'Kolkata Eastern Gateway', city: 'Kolkata', lat: 22.5726, lng: 88.3639, region: 'east', fleet: '28 Dedicated Trucks', address: 'Taratala Transport Depot, Kolkata', areas: 'Salt Lake, New Town, Park Street, Ballygunge, Howrah' },
      { name: 'Siliguri North Bengal Hub', city: 'Siliguri', lat: 26.7271, lng: 88.3953, region: 'east', fleet: '12 Dedicated Trucks', address: 'North Bengal Logistics Gateway, Siliguri', areas: 'Sevoke Road, Matigara, Pradhan Nagar, Bagdogra' },
      { name: 'Patna Bihar Transit Node', city: 'Patna', lat: 25.5941, lng: 85.1376, region: 'east', fleet: '14 Dedicated Trucks', address: 'Patliputra Industrial Area, Patna', areas: 'Kankarbagh, Boring Road, Bailey Road, Danapur' },
      { name: 'Ranchi Plateau Node', city: 'Ranchi', lat: 23.3441, lng: 85.3096, region: 'east', fleet: '14 Dedicated Trucks', address: 'Tupudana Industrial Area, Ranchi', areas: 'Harmu, Morabadi, Doranda, Kanke Road, Lalpur' },
      { name: 'Bhubaneswar Smart City Hub', city: 'Bhubaneswar', lat: 20.2961, lng: 85.8245, region: 'east', fleet: '16 Dedicated Trucks', address: 'Rasulgarh Logistics Center, Bhubaneswar', areas: 'Saheed Nagar, Chandrasekharpur, Patia, Khandagiri' },
      { name: 'Guwahati North-East Gateway', city: 'Guwahati', lat: 26.1445, lng: 91.7362, region: 'east', fleet: '12 Dedicated Trucks', address: 'Beltola Logistics Node, Guwahati', areas: 'Beltola, GS Road, Dispur, Khanapara, Jalukbari' },
      { name: 'Agartala Tripura Node', city: 'Agartala', lat: 23.8315, lng: 91.2868, region: 'east', fleet: '10 Dedicated Trucks', address: 'Bodhjungnagar Industrial Zone, Agartala', areas: 'Kunjaban, Banamalipur, Dhaleswar, Radhanagar' },
      { name: 'Jamshedpur Steel Hub', city: 'Jamshedpur', lat: 22.8046, lng: 86.2029, region: 'east', fleet: '12 Dedicated Trucks', address: 'Adityapur Industrial Complex, Jamshedpur', areas: 'Bistupur, Sakchi, Kadma, Telco, Sonari' },
      { name: 'Cuttack Silver City Node', city: 'Cuttack', lat: 20.4625, lng: 85.8828, region: 'east', fleet: '12 Dedicated Trucks', address: 'Jagatpur Industrial Estate, Cuttack', areas: 'Badambadi, CDA Sector 1-11, Madhupatna, Buxi Bazaar' },
      { name: 'Durgapur Industrial Gateway', city: 'Durgapur', lat: 23.5204, lng: 87.3119, region: 'east', fleet: '10 Dedicated Trucks', address: 'Muchipara Transport Center, Durgapur', areas: 'City Centre, Benachity, Bidhannagar, Steel Township' }
    ];

    if (typeof L === 'undefined') return;

    const map = L.map('serviceAreaLiveMap', {
      center: [22.0, 79.0],
      zoom: 4.6,
      minZoom: 4,
      maxZoom: 13,
      scrollWheelZoom: false
    });

    // Esri World Street Map tiles: enterprise high-speed CDN, free, no API key required,
    // and completely immune to OpenStreetMap volunteer server 403 access blocks.
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; <a href="https://www.esri.com/" target="_blank" rel="noopener">Esri</a> &mdash; Esri, DeLorme, NAVTEQ',
      maxZoom: 18
    }).addTo(map);

    const markerGroup = L.layerGroup().addTo(map);
    const markerMap = new Map();

    const createIcon = () => L.divIcon({
      className: 'custom-map-marker-wrap',
      html: `<div class="custom-map-marker" aria-label="MoveMate Regional Hub">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="12" cy="10" r="3"/><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/></svg>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    hubs.forEach(hub => {
      const popupContent = `
        <div class="map-hub-popup">
          <span class="hub-badge">${hub.region.toUpperCase()} INDIA HUB</span>
          <h4>${hub.name}</h4>
          <div class="hub-stat"><strong>🚚 Active Fleet:</strong> ${hub.fleet}</div>
          <div class="hub-stat"><strong>📍 Coverage:</strong> ${hub.areas}</div>
          <div class="hub-stat"><strong>📞 Direct Hub Line:</strong> <a href="tel:+919876543210">+91 98765 43210</a></div>
          <button class="hub-action-btn" type="button" onclick="window.openMoveMateQuote && window.openMoveMateQuote('local', '${hub.city}')">Book Move from ${hub.city} →</button>
        </div>
      `;

      const marker = L.marker([hub.lat, hub.lng], { icon: createIcon() })
        .bindPopup(popupContent)
        .addTo(markerGroup);

      markerMap.set(hub.city.toLowerCase(), { marker, hub });
      markerMap.set(hub.name.toLowerCase(), { marker, hub });
      
      // Also register clean sub-keys (e.g. "noida" for "noida / greater noida")
      if (hub.city.includes('/')) {
        hub.city.split('/').forEach(part => {
          markerMap.set(part.trim().toLowerCase(), { marker, hub });
        });
      }
    });

    // Express Corridors
    const corridorRoutes = [
      [[28.6139, 77.2090], [26.9124, 75.7873], [23.0225, 72.5714], [19.0760, 72.8777]],
      [[19.0760, 72.8777], [18.5204, 73.8567], [12.9716, 77.5946]],
      [[12.9716, 77.5946], [13.0827, 80.2707]],
      [[13.0827, 80.2707], [17.3850, 78.4867], [22.5726, 88.3639]],
      [[22.5726, 88.3639], [25.5941, 85.1376], [26.8467, 80.9462], [28.6139, 77.2090]],
      [[28.6139, 77.2090], [30.7333, 76.7794]],
      [[12.9716, 77.5946], [9.9312, 76.2673]],
      [[22.5726, 88.3639], [26.1445, 91.7362]],
      [[19.0760, 72.8777], [21.1458, 79.0882], [22.5726, 88.3639]]
    ];

    corridorRoutes.forEach(route => {
      L.polyline(route, {
        color: '#075fd7',
        weight: 3,
        opacity: 0.65,
        dashArray: '6, 8'
      }).addTo(map);
    });

    // Region buttons
    document.querySelectorAll('[data-map-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        const region = btn.dataset.mapFilter;
        document.querySelectorAll('[data-map-filter]').forEach(b => b.classList.toggle('active', b === btn));
        
        if (region === 'all') {
          map.flyTo([22.0, 79.0], 4.6, { duration: 1 });
        } else {
          const regionHubs = hubs.filter(h => h.region === region);
          if (regionHubs.length) {
            const bounds = L.latLngBounds(regionHubs.map(h => [h.lat, h.lng]));
            map.fitBounds(bounds, { padding: [40, 40], maxZoom: 7, duration: 1.2 });
          }
        }
      });
    });

    document.querySelector('[data-map-reset]')?.addEventListener('click', () => {
      map.flyTo([22.0, 79.0], 4.6, { duration: 1.2 });
    });

    // Connect right-side city list clicks to fly to hub on map
    document.querySelectorAll('.city-columns li').forEach(item => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => {
        const rawName = item.textContent.trim().toLowerCase();
        let target = null;

        // 1. Direct search
        for (const [key, val] of markerMap.entries()) {
          if (rawName === key || key.includes(rawName) || rawName.includes(key)) {
            target = val;
            break;
          }
        }

        // 2. Token matching (for composite labels like "Noida / Greater Noida")
        if (!target) {
          const tokens = rawName.split(/[\/\,\s]+/).filter(t => t.length > 2);
          for (const token of tokens) {
            for (const [key, val] of markerMap.entries()) {
              if (key.includes(token) || token.includes(key)) {
                target = val;
                break;
              }
            }
            if (target) break;
          }
        }

        if (target) {
          map.flyTo([target.hub.lat, target.hub.lng], 9, { duration: 1.2 });
          setTimeout(() => target.marker.openPopup(), 1250);
          window.showToast?.(`📍 Selected MoveMate ${target.hub.name}`);
        } else {
          window.showToast?.(`Selected ${item.textContent.trim()}`);
        }
      });
    });

    // Connect city search input to highlight map hub
    const searchInput = document.getElementById('citySearchInput');
    if (searchInput) {
      const handleSearch = () => {
        const val = searchInput.value.trim().toLowerCase();
        if (!val) return;
        let found = null;
        for (const [key, obj] of markerMap.entries()) {
          if (key.includes(val) || val.includes(key)) {
            found = obj;
            break;
          }
        }
        if (found) {
          map.flyTo([found.hub.lat, found.hub.lng], 9, { duration: 1.2 });
          setTimeout(() => found.marker.openPopup(), 1250);
        }
      };
      searchInput.addEventListener('change', handleSearch);
      searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSearch();
        }
      });
    }
  }

  /* Contact page office locator. Uses the same Leaflet setup as the coverage
     map on Service Areas so there is no second mapping dependency. */
  function initContactMap() {
    const mapEl = document.getElementById('contactLiveMap');
    if (!mapEl || typeof L === 'undefined') return;

    const offices = [
      {
        id: 'gurugram',
        name: 'Corporate Headquarters',
        city: 'Gurugram',
        lat: 28.4595, lng: 77.0266,
        address: 'MoveMate House, Sector 44, Gurugram, Haryana 122003',
        phone: '+91 98765 43210',
        hours: 'Mon–Sat, 9:00 AM – 8:00 PM'
      },
      {
        id: 'mumbai',
        name: 'West India Operations',
        city: 'Mumbai',
        lat: 19.0760, lng: 72.8777,
        address: 'Central Logistics Park, Andheri East, Mumbai 400059',
        phone: '+91 98765 43211',
        hours: 'Mon–Sat, 9:00 AM – 8:00 PM'
      },
      {
        id: 'bengaluru',
        name: 'South India Operations',
        city: 'Bengaluru',
        lat: 12.9716, lng: 77.5946,
        address: 'Whitefield Industrial Zone, Bengaluru 560066',
        phone: '+91 98765 43212',
        hours: 'Mon–Sat, 9:00 AM – 8:00 PM'
      },
      {
        id: 'kolkata',
        name: 'East India Operations',
        city: 'Kolkata',
        lat: 22.5726, lng: 88.3639,
        address: 'Taratala Transport Depot, Kolkata 700088',
        phone: '+91 98765 43213',
        hours: 'Mon–Sat, 9:30 AM – 7:30 PM'
      }
    ];

    const map = L.map('contactLiveMap', {
      center: [22.5, 79.0],
      zoom: 4.4,
      minZoom: 3,
      maxZoom: 16,
      scrollWheelZoom: false
    });

    // Esri World Street Map tiles: enterprise high-speed CDN, free, no API key required,
    // and completely immune to OpenStreetMap volunteer server 403 access blocks.
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; <a href="https://www.esri.com/" target="_blank" rel="noopener">Esri</a> &mdash; Esri, DeLorme, NAVTEQ',
      maxZoom: 18
    }).addTo(map);

    const icon = () => L.divIcon({
      className: 'custom-map-marker-wrap',
      html: `<div class="custom-map-marker" aria-label="MoveMate office">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="12" cy="10" r="3"/><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/></svg>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    const markers = {};

    offices.forEach(office => {
      const marker = L.marker([office.lat, office.lng], { icon: icon() })
        .bindPopup(`
          <div class="map-hub-popup">
            <span class="hub-badge">${office.city}</span>
            <h4>${office.name}</h4>
            <div class="hub-stat"><strong>📍 Address:</strong> ${office.address}</div>
            <div class="hub-stat"><strong>📞 Phone:</strong> <a href="tel:${office.phone.replace(/\s/g, '')}">${office.phone}</a></div>
            <div class="hub-stat"><strong>🕒 Hours:</strong> ${office.hours}</div>
          </div>
        `)
        .addTo(map);
      markers[office.id] = marker;
    });

    // Selecting an office card flies the map to that branch.
    const cards = document.querySelectorAll('[data-office]');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const office = offices.find(o => o.id === card.dataset.office);
        if (!office) return;
        cards.forEach(c => c.classList.toggle('active', c === card));
        map.flyTo([office.lat, office.lng], 11, { duration: 1.2 });
        setTimeout(() => markers[office.id].openPopup(), 1250);
      });
    });

    document.querySelector('[data-office-reset]')?.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      map.closePopup();
      map.flyTo([22.5, 79.0], 4.4, { duration: 1.2 });
    });
  }

  const popularIndianLocalities = [
    'Indiranagar, Bengaluru',
    'Koramangala, Bengaluru',
    'Whitefield, Bengaluru',
    'HSR Layout, Bengaluru',
    'Jayanagar, Bengaluru',
    'Electronic City, Bengaluru',
    'Andheri East, Mumbai',
    'Bandra West, Mumbai',
    'Powai, Mumbai',
    'Thane West, Mumbai',
    'Navi Mumbai, Vashi',
    'Borivali West, Mumbai',
    'Green Park, New Delhi',
    'Hauz Khas, New Delhi',
    'Dwarka, New Delhi',
    'Rohini, New Delhi',
    'Sector 57, Gurugram',
    'Cyber City, Gurugram',
    'Sector 62, Noida',
    'Greater Noida West',
    'Madhapur, Hyderabad',
    'Hitech City, Hyderabad',
    'Gachibowli, Hyderabad',
    'Jubilee Hills, Hyderabad',
    'Kukatpally, Hyderabad',
    'Anna Nagar, Chennai',
    'T. Nagar, Chennai',
    'Velachery, Chennai',
    'Adyar, Chennai',
    'OMR, Chennai',
    'Salt Lake, Kolkata',
    'New Town, Kolkata',
    'Ballygunge, Kolkata',
    'Hinjawadi, Pune',
    'Kothrud, Pune',
    'Wakad, Pune',
    'Baner, Pune',
    'Viman Nagar, Pune',
    'Vaishali Nagar, Jaipur',
    'Mansarovar, Jaipur',
    'Malviya Nagar, Jaipur',
    'Gomti Nagar, Lucknow',
    'Hazratganj, Lucknow',
    'Alambagh, Lucknow',
    'Sanand, Ahmedabad',
    'Satellite, Ahmedabad',
    'SG Highway, Ahmedabad',
    'Sector 17, Chandigarh',
    'Sector 35, Chandigarh',
    'Kakkanad, Kochi',
    'Marine Drive, Kochi',
    'Patliputra, Patna',
    'Beltola, Guwahati'
  ];

  function computeMoveEstimate(pickup, delivery, size = '2bhk') {
    const p = (pickup || '').trim().toLowerCase();
    const d = (delivery || '').trim().toLowerCase();

    const cityCoords = {
      bengaluru: { lat: 12.9716, lng: 77.5946 },
      bangalore: { lat: 12.9716, lng: 77.5946 },
      mumbai: { lat: 19.0760, lng: 72.8777 },
      delhi: { lat: 28.6139, lng: 77.2090 },
      gurugram: { lat: 28.4595, lng: 77.0266 },
      gurgaon: { lat: 28.4595, lng: 77.0266 },
      noida: { lat: 28.5355, lng: 77.3910 },
      hyderabad: { lat: 17.3850, lng: 78.4867 },
      chennai: { lat: 13.0827, lng: 80.2707 },
      kolkata: { lat: 22.5726, lng: 88.3639 },
      pune: { lat: 18.5204, lng: 73.8567 },
      ahmedabad: { lat: 23.0225, lng: 72.5714 },
      jaipur: { lat: 26.9124, lng: 75.7873 },
      lucknow: { lat: 26.8467, lng: 80.9462 },
      chandigarh: { lat: 30.7333, lng: 76.7794 },
      kochi: { lat: 9.9312, lng: 76.2673 },
      cochin: { lat: 9.9312, lng: 76.2673 },
      patna: { lat: 25.5941, lng: 85.1376 },
      guwahati: { lat: 26.1445, lng: 91.7362 },
      mysuru: { lat: 12.2958, lng: 76.6394 },
      mysore: { lat: 12.2958, lng: 76.6394 },
      goa: { lat: 15.2993, lng: 74.1240 },
      nagpur: { lat: 21.1458, lng: 79.0882 },
      coimbatore: { lat: 11.0168, lng: 76.9558 },
      indore: { lat: 22.7196, lng: 75.8577 },
      bhopal: { lat: 23.2599, lng: 77.4126 },
      surat: { lat: 21.1702, lng: 72.8311 },
      vadodara: { lat: 22.3072, lng: 73.1812 },
      visakhapatnam: { lat: 17.6868, lng: 83.2185 },
      vizag: { lat: 17.6868, lng: 83.2185 },
      vijayawada: { lat: 16.5062, lng: 80.6480 },
      dehradun: { lat: 30.3165, lng: 78.0322 },
      agra: { lat: 27.1767, lng: 78.0081 },
      ranchi: { lat: 23.3441, lng: 85.3096 },
      bhubaneswar: { lat: 20.2961, lng: 85.8245 }
    };

    let pCity = Object.keys(cityCoords).find(k => p.includes(k));
    let dCity = Object.keys(cityCoords).find(k => d.includes(k));

    let isIntercity = false;
    let distanceKm = 18;

    if (pCity && dCity && pCity !== dCity) {
      isIntercity = true;
      const c1 = cityCoords[pCity];
      const c2 = cityCoords[dCity];
      const R = 6371;
      const dLat = (c2.lat - c1.lat) * Math.PI / 180;
      const dLng = (c2.lng - c1.lng) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(c1.lat * Math.PI / 180) * Math.cos(c2.lat * Math.PI / 180) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      distanceKm = Math.round(R * c * 1.25);
    } else if (p && d && p !== d) {
      const isDifferent = !p.includes(d) && !d.includes(p);
      isIntercity = isDifferent && (p.includes(',') || d.includes(','));
      distanceKm = isIntercity ? 320 : 22;
    }

    const sizeMultipliers = {
      '1bhk': { base: 2800, rateKm: 18, label: '1 BHK / Studio' },
      '2bhk': { base: 4500, rateKm: 26, label: '2 BHK Apartment' },
      '3bhk': { base: 6800, rateKm: 34, label: '3 BHK Family Flat' },
      '4bhk': { base: 9500, rateKm: 42, label: '4+ BHK / Villa' },
      'office': { base: 8500, rateKm: 40, label: 'Commercial Office' }
    };

    const cfg = sizeMultipliers[size] || sizeMultipliers['2bhk'];
    let minPrice, maxPrice, timeline;

    if (isIntercity) {
      const transportCost = cfg.base + (distanceKm * cfg.rateKm);
      minPrice = Math.round(transportCost * 1.18);
      maxPrice = Math.round(minPrice * 1.22);
      timeline = distanceKm > 800 ? '48 – 72 Hours' : (distanceKm > 300 ? '24 – 48 Hours' : 'Same-Day / Overnight');
    } else {
      minPrice = cfg.base;
      maxPrice = Math.round(cfg.base * 1.25);
      timeline = 'Same-Day (4 to 8 Hours)';
    }

    return {
      isIntercity,
      distanceKm,
      minPrice,
      maxPrice,
      timeline,
      sizeLabel: cfg.label
    };
  }

  function injectCityDatalist() {
    if (document.getElementById('moveMateCitySuggestions')) return;
    const datalist = document.createElement('datalist');
    datalist.id = 'moveMateCitySuggestions';
    datalist.innerHTML = popularIndianLocalities.map(loc => `<option value="${loc}">`).join('');
    document.body.appendChild(datalist);

    document.querySelectorAll('input[name="pickup"], input[name="delivery"], #pickup, #delivery, #dashPickup, #dashDelivery, #quoteFrom, #quoteTo, #reqPickup, #reqDelivery').forEach(input => {
      if (!input.hasAttribute('list')) {
        input.setAttribute('list', 'moveMateCitySuggestions');
        input.setAttribute('autocomplete', 'off');
      }
    });
  }

  function setupSmartRouteFinder() {
    const pickupInput = document.getElementById('h2Pickup');
    const deliveryInput = document.getElementById('h2Delivery');
    const sizeSelect = document.getElementById('h2Size');
    const previewBox = document.getElementById('h2RoutePreview');
    const previewType = document.getElementById('h2PreviewType');
    const previewTitle = document.getElementById('h2PreviewTitle');
    const previewInfo = document.getElementById('h2PreviewInfo');
    const previewPrice = document.getElementById('h2PreviewPrice');

    if (!pickupInput || !deliveryInput) return;

    function updateRoute() {
      const p = pickupInput.value.trim();
      const d = deliveryInput.value.trim();
      const s = sizeSelect ? sizeSelect.value : '2bhk';

      if (p.length >= 2 && d.length >= 2) {
        const est = computeMoveEstimate(p, d, s);
        if (previewBox) {
          previewBox.style.display = 'flex';
          if (previewType) previewType.textContent = est.isIntercity ? 'Intercity Transit Computed' : 'Local City Move Computed';
          if (previewTitle) previewTitle.textContent = `${p} → ${d}`;
          if (previewInfo) previewInfo.textContent = `Distance: ~${est.distanceKm} km • Dedicated Sealed Truck • ETA: ${est.timeline}`;
          if (previewPrice) previewPrice.textContent = `₹${est.minPrice.toLocaleString('en-IN')} – ₹${est.maxPrice.toLocaleString('en-IN')}`;
        }
      } else if (previewBox) {
        previewBox.style.display = 'none';
      }
    }

    pickupInput.addEventListener('input', updateRoute);
    pickupInput.addEventListener('change', updateRoute);
    deliveryInput.addEventListener('input', updateRoute);
    deliveryInput.addEventListener('change', updateRoute);
    if (sizeSelect) sizeSelect.addEventListener('change', updateRoute);

    const modeTabs = document.querySelectorAll('.mode-tab');
    if (modeTabs.length && sizeSelect) {
      modeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          modeTabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');
          const mode = tab.getAttribute('data-mode');
          if (mode === 'office') {
            sizeSelect.value = 'office';
          } else if (mode === 'intercity') {
            sizeSelect.value = '3bhk';
          } else {
            sizeSelect.value = '2bhk';
          }
          updateRoute();
        });
      });
    }

    const routeBtns = document.querySelectorAll('.route-select-btn');
    routeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const p = btn.getAttribute('data-route-pickup');
        const d = btn.getAttribute('data-route-delivery');
        if (p) pickupInput.value = p;
        if (d) deliveryInput.value = d;
        updateRoute();
        pickupInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => pickupInput.focus({ preventScroll: true }), 350);
        window.showToast?.(`Selected route: ${p} ➔ ${d}`);
      });
    });

    updateRoute();

    const form = pickupInput.closest('form');
    if (form) {
      form.addEventListener('submit', event => {
        event.preventDefault();
        const p = pickupInput.value.trim();
        const d = deliveryInput.value.trim();
        const s = sizeSelect ? sizeSelect.value : '2bhk';

        if (!p || !d) {
          window.showToast?.('Please specify both Pickup and Destination locations.');
          return;
        }

        const est = computeMoveEstimate(p, d, s);
        const modal = document.getElementById('quoteModal');
        if (modal) {
          const typeSelect = modal.querySelector('#quoteType');
          const pickupField = modal.querySelector('#quotePickup');
          const nameField = modal.querySelector('#quoteName');

          if (typeSelect) typeSelect.value = est.isIntercity ? 'intercity' : 'local';
          if (pickupField) pickupField.value = `${p} ➔ ${d} (${est.sizeLabel})`;

          modal.classList.add('open');
          document.body.classList.add('no-scroll');
          setTimeout(() => nameField?.focus(), 120);
          window.showToast?.(`Route confirmed (~${est.distanceKm} km). Please provide your contact details to lock booking.`);
        }
      });
    }
  }

  function setupMovePlanner() {
    const plannerTabs = document.querySelectorAll('.planner-tab');
    const plannerTag = document.getElementById('plannerTag');
    const plannerHeading = document.getElementById('plannerHeading');
    const plannerPrice = document.getElementById('plannerPrice');
    const plannerPriceType = document.getElementById('plannerPriceType');
    const plannerTruck = document.getElementById('plannerTruck');
    const plannerBoxes = document.getElementById('plannerBoxes');
    const plannerCrew = document.getElementById('plannerCrew');
    const plannerTime = document.getElementById('plannerTime');
    const plannerList = document.getElementById('plannerInclusionsList');
    const plannerBookBtn = document.getElementById('plannerBookBtn');
    const plannerBookText = document.getElementById('plannerBookText');

    if (!plannerTabs.length) return;

    const sizeData = {
      '1bhk': {
        tag: 'Compact Household Move',
        heading: '1 BHK / Studio Apartment Shifting',
        price: '₹3,200*',
        priceType: 'Local (Intercity from ₹7,500*)',
        truck: '10–14 Ft Closed Container',
        boxes: '15 – 22 Heavy-Duty Boxes',
        crew: '2 Certified Movers',
        time: '2.5 – 3.5 Hours',
        btnText: 'Book 1 BHK Move',
        inclusions: [
          '1 Double Bed & Mattress protective waterproof wrapping',
          'Single/Double Door Refrigerator & Washing Machine armor covers',
          'Up to 43" LED/Smart TV specialized foam casing',
          '2-Seater sofa & small coffee table dustproof shrink film wrap',
          '10–15 Kitchen carton boxes with bubble wrap for glassware',
          'Complimentary ₹1,00,000 transit cover + live GPS tracking'
        ]
      },
      '2bhk': {
        tag: 'Standard Family Move',
        heading: '2 BHK Standard Family Apartment',
        price: '₹4,500*',
        priceType: 'Local (Intercity from ₹11,500*)',
        truck: '14–17 Ft Dedicated Container',
        boxes: '28 – 38 Heavy-Duty Boxes',
        crew: '3 Dedicated Professionals',
        time: '3.5 – 4.5 Hours',
        btnText: 'Book 2 BHK Move',
        inclusions: [
          '2 Queen/King Beds disassembly, protective wrap & reassembly',
          'Large double-door fridge & front-load washing machine armor covers',
          '55"–65" OLED TV custom foam cushioning & wooden edge bumpers',
          '3–5 Seater sofa dustproof shrink wrapping + dining table & 4 chairs',
          'Complete modular kitchen packing with segregated glassware padding',
          'Complimentary ₹1,00,000 transit cover + live GPS milestones'
        ]
      },
      '3bhk': {
        tag: 'Spacious Family Residence',
        heading: '3 BHK Spacious Family Residence',
        price: '₹6,800*',
        priceType: 'Local (Intercity from ₹16,500*)',
        truck: '17–19 Ft Heavy Container',
        boxes: '45 – 60 Heavy-Duty Boxes',
        crew: '4 Certified Packers + 1 Lead',
        time: '5.0 – 6.5 Hours',
        btnText: 'Book 3 BHK Move',
        inclusions: [
          '3 Complete bedrooms disassembly, bubble wrap & reassembly',
          'Side-by-side refrigerator, microwave, oven & major appliance protection',
          '65"+ TV, audio equipment, PC monitors & home study workstation',
          '6-Seater glass/wooden dining table & display crockery unit crating',
          'Wardrobe hanging boxes for formal suits and ethnic garments',
          'Priority dispatch with dedicated personal move coordinator'
        ]
      },
      '4bhk': {
        tag: 'Luxury Estate / Villa',
        heading: '4+ BHK Luxury Villa & Estate',
        price: '₹10,500*',
        priceType: 'Local (Intercity from ₹25,000*)',
        truck: '22–24 Ft Dedicated Heavy Carrier',
        boxes: '70 – 95+ Heavy-Duty Boxes',
        crew: '5–6 Master Packers + Lead',
        time: 'Full Day (7 – 9 Hours)',
        btnText: 'Book 4+ BHK Move',
        inclusions: [
          'Full-scale villa dismantling, room-by-room staging & destination setup',
          'Custom wooden crating for chandeliers, marble consoles & artwork',
          'Multiple refrigerators, deep freezers, home gym & patio sets',
          'Zero-contact wardrobe & walk-in closet garment transit boxes',
          'Continuous floor runner protection & wall-corner guards',
          'VIP white-glove unboxing & comprehensive furniture arrangement'
        ]
      }
    };

    plannerTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const size = tab.getAttribute('data-size');
        const data = sizeData[size];
        if (!data) return;

        plannerTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        if (plannerTag) plannerTag.textContent = data.tag;
        if (plannerHeading) plannerHeading.textContent = data.heading;
        if (plannerPrice) plannerPrice.textContent = data.price;
        if (plannerPriceType) plannerPriceType.textContent = data.priceType;
        if (plannerTruck) plannerTruck.textContent = data.truck;
        if (plannerBoxes) plannerBoxes.textContent = data.boxes;
        if (plannerCrew) plannerCrew.textContent = data.crew;
        if (plannerTime) plannerTime.textContent = data.time;
        if (plannerBookBtn) {
          plannerBookBtn.setAttribute('data-size', size);
          if (plannerBookBtn.tagName && plannerBookBtn.tagName.toLowerCase() === 'a') {
            const calcSize = size === '1bhk' ? 'studio' : (size === 'villa' ? '4bhk' : size);
            plannerBookBtn.href = `pages/pricing.html?homeSize=${calcSize}&moveType=local#calculator`;
          }
        }

        if (plannerList) {
          plannerList.innerHTML = data.inclusions.map(inc => `<li>${inc}</li>`).join('');
        }
      });
    });

    if (plannerBookBtn) {
      plannerBookBtn.addEventListener('click', () => {
        const currentSize = plannerBookBtn.getAttribute('data-size') || '2bhk';
        const modal = document.getElementById('quoteModal');
        if (modal) {
          const sizeSelect = modal.querySelector('#quoteSize');
          const nameField = modal.querySelector('#quoteName');
          if (sizeSelect) sizeSelect.value = currentSize;

          modal.classList.add('open');
          document.body.classList.add('no-scroll');
          setTimeout(() => nameField?.focus(), 120);
          window.showToast?.(`Selected ${currentSize.toUpperCase()} move package. Please enter your contact details.`);
        }
      });
    }
  }

  function setupScrollHeader() {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(window.__moveMateToast);
    window.__moveMateToast = setTimeout(() => toast.classList.remove('show'), 3500);
  }

  window.showToast = showToast;

  window.validateMoveMateForm = validateForm;

  const headerTarget = document.querySelector('[data-site-header]');
  const footerTarget = document.querySelector('[data-site-footer]');
  if (headerTarget) headerTarget.innerHTML = headerMarkup();
  if (footerTarget) footerTarget.innerHTML = footerMarkup();
  if (!document.querySelector('#quoteModal') && !document.body.classList.contains('dashboard-body') && !document.body.classList.contains('auth-body')) {
    document.body.insertAdjacentHTML('beforeend', quoteModalMarkup());
  }
  if (!document.querySelector('#serviceModal') && !document.body.classList.contains('dashboard-body') && !document.body.classList.contains('auth-body')) {
    document.body.insertAdjacentHTML('beforeend', serviceModalMarkup());
  }
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  function setupFleetTabs() {
    const tabs = document.querySelectorAll('.fleet-tab');
    const cards = document.querySelectorAll('.fleet-card');
    if (!tabs.length || !cards.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const filter = tab.dataset.fleetFilter;
        cards.forEach(card => {
          if (filter === 'all' || card.dataset.fleetType === filter) {
            card.style.display = '';
            card.style.opacity = '1';
            card.style.transform = 'none';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* Pricing Tier Selector -> Live Calculator Sync */
  function setupPricingTiers() {
    const tierButtons = document.querySelectorAll('.tier-select-btn');
    if (!tierButtons.length) return;

    tierButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const homeSize = btn.getAttribute('data-home-size');
        const pack = btn.getAttribute('data-pack') === 'true';

        // Select Home Size radio in calculator
        if (homeSize) {
          const radio = document.querySelector(`input[name="homeSize"][value="${homeSize}"]`);
          if (radio) {
            radio.checked = true;
          }
        }

        // Select or unselect packing checkbox
        const packCheckbox = document.querySelector('input[name="extras"][value="packing"]');
        if (packCheckbox) {
          packCheckbox.checked = pack;
        }

        // Ensure loading & unloading are checked
        const loadingBox = document.querySelector('input[name="extras"][value="loading"]');
        const unloadingBox = document.querySelector('input[name="extras"][value="unloading"]');
        if (loadingBox) loadingBox.checked = true;
        if (unloadingBox) unloadingBox.checked = true;

        // Trigger input event to update price calculation immediately
        const form = document.getElementById('calculatorForm');
        if (form) {
          form.dispatchEvent(new Event('input', { bubbles: true }));
          form.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Smooth scroll to calculator
        const calcSection = document.getElementById('calculator');
        if (calcSection) {
          calcSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Brief pulse on price panel
        const pricePanel = document.querySelector('.price-panel');
        if (pricePanel) {
          pricePanel.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease';
          pricePanel.style.boxShadow = '0 0 0 3px rgba(7, 95, 215, 0.35)';
          pricePanel.style.borderColor = 'var(--brand)';
          setTimeout(() => {
            pricePanel.style.boxShadow = '';
            pricePanel.style.borderColor = '';
          }, 1200);
        }
      });
    });
  }

  /* Pincode & Locality Feasibility Engine */
  function setupPincodeFeasibility() {
    const input = document.getElementById('pincodeSearchInput');
    const btn = document.getElementById('pincodeSearchBtn');
    const resultBox = document.getElementById('feasibilityResultBox');
    if (!input || !resultBox) return;

    const chips = document.querySelectorAll('.metro-chip');
    const badgeEl = document.getElementById('resultBadge');
    const zoneEl = document.getElementById('resultZone');
    const hubEl = document.getElementById('resultHub');
    const dispatchEl = document.getElementById('resultDispatch');
    const townshipEl = document.getElementById('resultTownship');
    const fleetEl = document.getElementById('resultFleet');
    const noteEl = document.getElementById('resultNote');
    const bookBtn = document.getElementById('resultBookBtn');

    const metroData = [
      {
        keys: ['560', 'bengaluru', 'bangalore', 'indiranagar', 'whitefield', 'koramangala', 'hsr', 'electronic city', 'hebbal', 'jayanagar'],
        zone: 'South India Primary Tech Zone',
        hub: 'South Tech-Corridor Super-Hub (Bommasandra, Bengaluru)',
        dispatch: '< 2 Hours for Same-Day Physical / Video Survey',
        township: 'Pre-Authorized for 150+ Societies (Prestige, Sobha, Brigade)',
        fleet: '14 ft Sprinters & 19 ft SafeVaults on immediate standby',
        note: 'High fleet density zone: Same-day packing and loading guaranteed.',
        origin: 'Bengaluru, Karnataka'
      },
      {
        keys: ['400', 'mumbai', 'bandra', 'andheri', 'powai', 'thane', 'navi mumbai', 'borivali', 'juhu', 'worli'],
        zone: 'West Coast Primary Coastal Zone',
        hub: 'Bhiwandi / Mumbai Gateway Super-Hub (Mankoli Depot)',
        dispatch: '< 2 Hours for Same-Day Inspection',
        township: 'Pre-Authorized for 200+ Societies (Hiranandani, Lodha, Godrej)',
        fleet: 'Sub-2.4m Low-Clearance Basement Sprinters Available',
        note: 'Low-clearance basement parking pass enabled for all MMR high-rises.',
        origin: 'Mumbai, Maharashtra'
      },
      {
        keys: ['110', '122', '201', 'delhi', 'gurugram', 'gurgaon', 'noida', 'faridabad', 'ghaziabad', 'dwarka', 'south delhi'],
        zone: 'North India Primary Capital Zone',
        hub: 'Gurugram / NCR Super-Hub (Sector 18 / NH-48)',
        dispatch: '< 2 Hours for Same-Day Physical / Video Survey',
        township: 'Pre-Authorized for 180+ Societies (DLF, Central Park, Tata Primanti)',
        fleet: 'Heavy Linehaul Carriers & Dedicated City Sprinters Active',
        note: 'Daily express linehaul departures to Mumbai, Bengaluru, and Kolkata.',
        origin: 'Gurugram / Delhi NCR'
      },
      {
        keys: ['500', 'hyderabad', 'hitec', 'gachibowli', 'kondapur', 'madhapur', 'jubilee hills', 'banjara hills', 'kukatpally'],
        zone: 'South-Central Primary Zone',
        hub: 'South-Central Logistics Hub (HITEC City Logistics Node)',
        dispatch: '< 2 Hours for Same-Day Inspection',
        township: 'Pre-Authorized for 100+ Societies (My Home, Aparna, Jayabheri)',
        fleet: '14 ft, 19 ft & 32 ft Containers Ready for Dispatch',
        note: 'Direct 24-Hour Express Corridor connected to Bengaluru & Mumbai.',
        origin: 'Hyderabad, Telangana'
      },
      {
        keys: ['600', 'chennai', 'omr', 'ecr', 'velachery', 'anna nagar', 't nagar', 'adyar', 'guindy'],
        zone: 'South Coastal Primary Zone',
        hub: 'Chennai Gateway Hub (Guindy Logistics Depot)',
        dispatch: '< 2.5 Hours for Same-Day Inspection',
        township: 'Pre-Authorized for 90+ Societies (Hiranandani Parks, Olympia, Ceebros)',
        fleet: 'Weather-Sealed Marine Grade Containers on standby',
        note: 'Direct daily schedule to Bengaluru, Hyderabad, and Coimbatore.',
        origin: 'Chennai, Tamil Nadu'
      },
      {
        keys: ['411', 'pune', 'hinjewadi', 'wakad', 'kothrud', 'viman nagar', 'baner', 'hadapsar', 'magarpatta'],
        zone: 'Western Expressway Zone',
        hub: 'Pune Regional Hub (Chakan-Hinjewadi Node)',
        dispatch: '< 2 Hours for Same-Day Inspection',
        township: 'Pre-Authorized for 120+ Societies (Kolte-Patil, Amanora, Blue Ridge)',
        fleet: 'Express Container Shuttles on standby',
        note: 'Mumbai-Pune express transit available with same-day delivery.',
        origin: 'Pune, Maharashtra'
      },
      {
        keys: ['700', 'kolkata', 'dankuni', 'salt lake', 'new town', 'rajarhat', 'howrah'],
        zone: 'East Gateway Primary Zone',
        hub: 'Dankuni / Kolkata Depot (Delhi Road Expressway)',
        dispatch: '< 3 Hours for Same-Day Inspection',
        township: 'Pre-Authorized for 80+ Societies (South City, Hiland, Uniworld)',
        fleet: 'Multi-Modal Weatherproof Heavy Containers on standby',
        note: 'Direct trunk line connect to Delhi NCR, Patna, and North-East routes.',
        origin: 'Kolkata, West Bengal'
      }
    ];

    function checkFeasibility(query) {
      const q = query.toLowerCase().trim();
      if (!q) return;

      let match = metroData.find(item => item.keys.some(k => q.includes(k) || (q.length >= 3 && k.startsWith(q.slice(0, 3)))));

      // If no direct metro key matched, check if it looks like a valid 6-digit Indian pincode
      if (!match) {
        const isPincode = /^[1-9][0-9]{2,5}$/.test(q);
        if (isPincode) {
          match = {
            zone: 'Pan-India Extended Transit Corridor',
            hub: 'Nearest State Capital Super-Hub & Logistics Node',
            dispatch: '24–48 Hours Prior Scheduling Recommended',
            township: 'Assisted Association NOC & Gate Pass Coordination',
            fleet: 'Dedicated All-Weather Container Dispatched on Booking',
            note: 'Confirmed door-to-door network connection with live GPS tracking.',
            origin: `Pincode ${q}`
          };
        } else {
          match = {
            zone: 'Custom Feasibility Route',
            hub: 'Central Relocation Operations Desk',
            dispatch: 'Feasibility Survey within 4 Hours',
            township: 'Full Society Permission Assistance Provided',
            fleet: 'Dedicated Route Truck Assigned Upon Request',
            note: 'Our logistics desk will verify exact road clearance and route schedule.',
            origin: query
          };
        }
      }

      if (zoneEl) zoneEl.textContent = match.zone;
      if (hubEl) hubEl.textContent = match.hub;
      if (dispatchEl) dispatchEl.textContent = match.dispatch;
      if (townshipEl) townshipEl.textContent = match.township;
      if (fleetEl) fleetEl.textContent = match.fleet;
      if (noteEl) noteEl.textContent = match.note;
      if (badgeEl) {
        badgeEl.textContent = '✓ Service Hub Confirmed & Active';
        badgeEl.className = 'result-badge success';
      }
      if (bookBtn) {
        bookBtn.setAttribute('data-quote-origin', match.origin);
        if (bookBtn.tagName && bookBtn.tagName.toLowerCase() === 'a') {
          bookBtn.href = `pricing.html?pickup=${encodeURIComponent(match.origin)}&moveType=local#calculator`;
        }
      }

      // Smooth highlight effect
      resultBox.style.borderColor = 'var(--brand)';
      resultBox.style.boxShadow = '0 0 0 3px rgba(7, 95, 215, 0.2)';
      setTimeout(() => {
        resultBox.style.borderColor = '';
        resultBox.style.boxShadow = '';
      }, 1000);
    }

    if (btn) {
      btn.addEventListener('click', () => {
        checkFeasibility(input.value);
      });
    }

    input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        checkFeasibility(input.value);
      } else if (input.value.length >= 3) {
        checkFeasibility(input.value);
      }
    });

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const code = chip.getAttribute('data-pincode');
        input.value = code;
        checkFeasibility(code);
      });
    });
  }

  setupTheme();
  setupDirection();
  setupDropdowns();
  setupMenu();
  setupQuoteModal();
  setupServiceModal();
  setupForms();
  setupReveal();
  setupCounters();
  setupFaqs();
  setupTabs();
  setupCitySearch();
  initInteractiveMap();
  initContactMap();
  injectCityDatalist();
  setupSmartRouteFinder();
  setupMovePlanner();
  setupFleetTabs();
  setupPricingTiers();
  setupPincodeFeasibility();
  setupScrollHeader();
})();
