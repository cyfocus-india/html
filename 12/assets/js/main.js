(() => {
  'use strict';

  /* ----------------------------------------------------
     0. Universal Inlined SVG Sprite (Zero CORS / file:// safe)
  ---------------------------------------------------- */
  const SVG_DEFS = ` <symbol id="logo" viewBox="0 0 48 48"><rect x="2" y="2" width="44" height="44" rx="11" fill="#0a3ea8"/><path d="M24 35C18.5 31.8 12.5 32.8 10 34V24.5C12.5 23.3 18.5 22.3 24 25.8C29.5 22.3 35.5 23.3 38 24.5V34C35.5 32.8 29.5 31.8 24 35Z" fill="#ffffff"/><path d="M24 26V35" stroke="#0a3ea8" stroke-width="1.5" stroke-linecap="round"/><polygon points="24,10 38,16.5 24,23 10,16.5" fill="#3b82f6" stroke="#ffffff" stroke-width="1.5" stroke-linejoin="round"/><path d="M16 19V24C16 27 32 27 32 24V19" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/><path d="M32 17.5L36.5 23.5V27" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round" fill="none"/><circle cx="36.5" cy="27.5" r="1.3" fill="#f59e0b"/><path d="M24 4.5L25.3 7.3L28.2 8.2L25.3 9.1L24 11.8L22.7 9.1L19.8 8.2L22.7 7.3Z" fill="#f59e0b"/></symbol> <symbol id="home" viewBox="0 0 24 24"><path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-9Z"/></symbol> <symbol id="user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></symbol> <symbol id="users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="4"/><circle cx="18" cy="9" r="3"/><path d="M2 21a7 7 0 0 1 14 0m0-5a6 6 0 0 1 6 5"/></symbol> <symbol id="book" viewBox="0 0 24 24"><path d="M4 4h6a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4V4Zm16 0h-4a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h4V4Z"/></symbol> <symbol id="file" viewBox="0 0 24 24"><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 12h6m-6 4h6"/></symbol> <symbol id="clipboard" viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 4V2h6v2M9 10l1.5 1.5L14 8m-5 8 1.5 1.5L14 14"/></symbol> <symbol id="chart" viewBox="0 0 24 24"><path d="M4 20V10m6 10V4m6 16v-7m4 7H2"/></symbol> <symbol id="trend" viewBox="0 0 24 24"><path d="m3 17 6-6 4 4 7-8"/><path d="M15 7h5v5"/></symbol> <symbol id="target" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></symbol> <symbol id="clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol> <symbol id="calendar" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/></symbol> <symbol id="video" viewBox="0 0 24 24"><rect x="3" y="5" width="13" height="14" rx="2"/><path d="m16 10 5-3v10l-5-3z"/></symbol> <symbol id="award" viewBox="0 0 24 24"><circle cx="12" cy="9" r="6"/><path d="m8 14-2 8 6-3 6 3-2-8"/><path d="m12 6 1 2 2 .3-1.5 1.5.4 2.2-1.9-1-1.9 1 .4-2.2L9 8.3l2-.3z"/></symbol> <symbol id="trophy" viewBox="0 0 24 24"><path d="M7 3h10v5a5 5 0 0 1-10 0V3Z"/><path d="M7 5H3v2a4 4 0 0 0 5 4m9-6h4v2a4 4 0 0 1-5 4M12 13v5m-4 3h8m-6-3h4"/></symbol> <symbol id="bank" viewBox="0 0 24 24"><path d="m3 9 9-6 9 6H3Zm2 3h14M6 12v6m4-6v6m4-6v6m4-6v6M3 21h18"/></symbol> <symbol id="train" viewBox="0 0 24 24"><rect x="6" y="2" width="12" height="16" rx="3"/><path d="M8 6h8M8 11h8m-7 7-3 4m9-4 3 4M9 15h.01M15 15h.01"/></symbol> <symbol id="gear" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1A8 8 0 0 0 15 6l-.3-2.6h-4L10.4 6A8 8 0 0 0 9 7.1l-2.4-1-2 3.4L6.6 11a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1A8 8 0 0 0 10.4 18l.3 2.6h4L15 18a8 8 0 0 0 1.5-1.1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z"/></symbol> <symbol id="cap" viewBox="0 0 24 24"><path d="m2 9 10-5 10 5-10 5L2 9Z"/><path d="M6 11v5c3 3 9 3 12 0v-5m4-2v7"/></symbol> <symbol id="shield" viewBox="0 0 24 24"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z"/><path d="m8 12 2.5 2.5L16 9"/></symbol> <symbol id="check" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></symbol> <symbol id="arrow" viewBox="0 0 24 24"><path d="M5 12h14m-5-5 5 5-5 5"/></symbol> <symbol id="download" viewBox="0 0 24 24"><path d="M12 3v12m-5-5 5 5 5-5M5 21h14"/></symbol> <symbol id="bookmark" viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4-6 4z"/></symbol> <symbol id="search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></symbol> <symbol id="menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></symbol> <symbol id="close" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></symbol> <symbol id="sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></symbol> <symbol id="moon" viewBox="0 0 24 24"><path d="M20 15.5A9 9 0 0 1 8.5 4 9 9 0 1 0 20 15.5Z"/></symbol> <symbol id="globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18m0-18a14 14 0 0 0 0 18"/></symbol> <symbol id="bell" viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Zm-8 12h4"/></symbol> <symbol id="mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></symbol> <symbol id="phone" viewBox="0 0 24 24"><path d="M7 3H4a2 2 0 0 0-2 2c0 9.4 7.6 17 17 17a2 2 0 0 0 2-2v-3l-5-2-2 3c-4-1.6-6.4-4-8-8l3-2-2-5Z"/></symbol> <symbol id="location" viewBox="0 0 24 24"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2"/></symbol> <symbol id="help" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.7 2.7 0 1 1 4.2 2.2c-1 .7-1.7 1.2-1.7 2.8m0 3h.01"/></symbol> <symbol id="headphones" viewBox="0 0 24 24"><path d="M4 14v-3a8 8 0 0 1 16 0v3"/><path d="M4 14H2v5h4v-5H4Zm16 0h2v5h-4v-5h2Z"/></symbol> <symbol id="lock" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></symbol> <symbol id="eye" viewBox="0 0 24 24"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></symbol> <symbol id="logout" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></symbol> <symbol id="chevron-down" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></symbol> <symbol id="rtl-icon" viewBox="0 0 24 24"><path d="M4 6h16M4 12h10M4 18h16M14 9l-3 3 3 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol> `;
  if (!document.getElementById('__SITE_SVG_SPRITE__')) {
    const spriteDiv = document.createElement('div');
    spriteDiv.id = '__SITE_SVG_SPRITE__';
    spriteDiv.style.position = 'absolute';
    spriteDiv.style.width = '0';
    spriteDiv.style.height = '0';
    spriteDiv.style.overflow = 'hidden';
    spriteDiv.setAttribute('aria-hidden', 'true');
    spriteDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"><defs>${SVG_DEFS}</defs></svg>`;
    document.body.insertBefore(spriteDiv, document.body.firstChild);
  }

  const resolveSvgUses = (root = document) => {
    root.querySelectorAll('use').forEach(u => {
      const href = u.getAttribute('href') || u.getAttribute('xlink:href') || '';
      if (href.includes('#')) {
        const id = href.split('#')[1];
        if (id && href !== '#' + id) {
          u.setAttribute('href', '#' + id);
          u.removeAttribute('xlink:href');
        }
      }
    });
  };
  resolveSvgUses(document);

  const isPage = location.pathname.includes('/pages/');
  const base = isPage ? '../' : './';
  const page = document.body.dataset.page || 'home';
  const icon = (name, cls = '') => `<svg class="icon ${cls}" aria-hidden="true"><use href="#${name}"></use></svg>`;

  const isHome2 = page === 'home2' || location.pathname.includes('index1.html');
  const isHome1 = !isHome2 && (page === 'home' || location.pathname.endsWith('index.html') || location.pathname.endsWith('/'));
  const isHomeActive = isHome1 || isHome2;

  const pagesSubRoutes = [
    { key: 'classes', label: 'Live Classes', href: `${base}pages/live-classes.html`, icon: 'video' },
    { key: 'resources', label: 'Study Materials', href: `${base}pages/study-materials.html`, icon: 'book' },
    { key: 'coming', label: 'Coming Soon', href: `${base}pages/coming-soon.html`, icon: 'clock' },
    { key: '404', label: '404', href: `${base}pages/404.html`, icon: 'help' },
    { key: 'privacy', label: 'Privacy Policy', href: `${base}pages/privacy.html`, icon: 'shield' },
    { key: 'terms', label: 'Terms of Service', href: `${base}pages/terms.html`, icon: 'file' }
  ];
  const isPagesActive = pagesSubRoutes.some(r => r.key === page);

  /* ----------------------------------------------------
     1. Header & Navigation Component
  ---------------------------------------------------- */
  const headerHost = document.querySelector('[data-site-header]');
  if (headerHost) {
    const topStrip = document.body.dataset.topStrip === 'true' ? `
      <div class="top-strip"><div class="container">
        <span>★ &nbsp;India’s trusted platform for competitive exam preparation — Admissions Open 2026–27</span>
        <span class="top-strip-links">
          <a href="${base}pages/coming-soon.html">Download Mobile App</a>
          <a href="${base}pages/contact.html">Help Center</a>
          <a href="tel:+919876543210">+91 98765 43210</a>
        </span>
      </div></div>` : '';

    headerHost.innerHTML = `${topStrip}
      <header class="site-header" id="siteHeader">
        <div class="container header-inner">
          <div class="header-brand-group">
            <a class="brand" href="${base}index.html" aria-label="ExamSuccess home">
              <span class="brand-mark"><svg aria-hidden="true"><use href="#logo"></use></svg></span>
              <span class="brand-text"><span class="brand-name">ExamSuccess</span><span class="brand-tag">Your Success, Our Mission</span></span>
            </a>
          </div>
          ${page !== 'dashboard' ? `
          <nav class="nav" id="mainNav" aria-label="Primary navigation">
            <div class="nav-drawer-header">
              <div class="brand">
                <span class="brand-mark"><svg aria-hidden="true"><use href="#logo"></use></svg></span>
                <span class="brand-text"><span class="brand-name">ExamSuccess</span><span class="brand-tag">Your Success, Our Mission</span></span>
              </div>
              <button class="nav-close-btn" id="navCloseBtn" aria-label="Close navigation menu">${icon('close')}</button>
            </div>
            <ul class="nav-list">
              <li class="nav-item has-dropdown ${isHomeActive ? 'current-parent' : ''}">
                <button class="nav-link nav-dropdown-btn ${isHomeActive ? 'active' : ''}" type="button" aria-expanded="false" aria-haspopup="true">
                  <span>Home</span>
                  <svg class="icon dropdown-caret" aria-hidden="true"><use href="#chevron-down"></use></svg>
                </button>
                <ul class="dropdown-menu" role="menu">
                  <li><a class="dropdown-link ${isHome1 ? 'active' : ''}" ${isHome1 ? 'aria-current="page"' : ''} href="${base}index.html">${icon('home')} Home 1</a></li>
                  <li><a class="dropdown-link ${isHome2 ? 'active' : ''}" ${isHome2 ? 'aria-current="page"' : ''} href="${base}index1.html">${icon('home')} Home 2</a></li>
                </ul>
              </li>
              <li class="nav-item"><a class="nav-link ${page === 'about' ? 'active' : ''}" ${page === 'about' ? 'aria-current="page"' : ''} href="${base}pages/about.html">About Us</a></li>
              <li class="nav-item"><a class="nav-link ${page === 'courses' ? 'active' : ''}" ${page === 'courses' ? 'aria-current="page"' : ''} href="${base}pages/courses.html">Courses</a></li>
              <li class="nav-item"><a class="nav-link ${page === 'faculty' ? 'active' : ''}" ${page === 'faculty' ? 'aria-current="page"' : ''} href="${base}pages/faculty.html">Faculty</a></li>
              <li class="nav-item"><a class="nav-link ${page === 'results' ? 'active' : ''}" ${page === 'results' ? 'aria-current="page"' : ''} href="${base}pages/results.html">Results</a></li>
              <li class="nav-item"><a class="nav-link ${page === 'fees' ? 'active' : ''}" ${page === 'fees' ? 'aria-current="page"' : ''} href="${base}pages/fees.html">Fees</a></li>
              <li class="nav-item"><a class="nav-link ${page === 'dashboard' ? 'active' : ''}" ${page === 'dashboard' ? 'aria-current="page"' : ''} href="${base}pages/dashboard.html">Dashboard</a></li>
              <li class="nav-item"><a class="nav-link ${page === 'contact' ? 'active' : ''}" ${page === 'contact' ? 'aria-current="page"' : ''} href="${base}pages/contact.html">Contact</a></li>
              <li class="nav-item has-dropdown ${isPagesActive ? 'current-parent' : ''}">
                <button class="nav-link nav-dropdown-btn ${isPagesActive ? 'active' : ''}" type="button" aria-expanded="false" aria-haspopup="true">
                  <span>Pages</span>
                  <svg class="icon dropdown-caret" aria-hidden="true"><use href="#chevron-down"></use></svg>
                </button>
                <ul class="dropdown-menu dropdown-menu-end" role="menu">
                  ${pagesSubRoutes.map(item => `
                    <li><a class="dropdown-link ${page === item.key ? 'active' : ''}" ${page === item.key ? 'aria-current="page"' : ''} href="${item.href}">${icon(item.icon)} ${item.label}</a></li>
                  `).join('')}
                </ul>
              </li>
            </ul>
            <div class="nav-drawer-footer">
              <div class="nav-drawer-actions">
                <a class="btn btn-primary" href="${base}pages/signin.html" style="width:100%">${icon('user')} Login</a>
              </div>
            </div>
          </nav>` : ''}
          <div class="header-actions">
            <button class="icon-btn theme-toggle-btn" id="themeToggle" aria-label="Switch color theme" title="Switch color theme"><svg class="icon" aria-hidden="true"><use href="#moon"></use></svg></button>
            <button class="icon-btn rtl-toggle-btn" id="rtlToggle" aria-label="Toggle right-to-left layout" title="Toggle RTL layout"><svg class="icon" aria-hidden="true"><use href="#rtl-icon"></use></svg><span class="dir-indicator">LTR</span></button>
            ${page === 'dashboard' ? `
              <a class="btn btn-outline btn-sm logout-btn desktop-action" id="headerLogoutBtn" href="${base}pages/signin.html" title="Sign out of student account">${icon('logout')} Logout</a>
            ` : `
              <a class="btn btn-primary btn-sm desktop-action header-login-btn" href="${base}pages/signin.html">${icon('user')} Login</a>
              <button class="icon-btn mobile-menu" id="menuToggle" aria-controls="mainNav" aria-expanded="false" aria-label="Open menu">${icon('menu')}</button>
            `}
          </div>
        </div>
      </header><div class="menu-backdrop" id="menuBackdrop"></div>`;
  }

  /* ----------------------------------------------------
     2. Footer Component
  ---------------------------------------------------- */
  const footerHost = document.querySelector('[data-site-footer]');
  if (footerHost) {
    footerHost.innerHTML = `<footer class="site-footer"><div class="container">
      <div class="footer-grid">
        <div>
          <a class="brand footer-brand" href="${base}index.html" aria-label="ExamSuccess home">
            <span class="brand-mark"><svg aria-hidden="true"><use href="#logo"></use></svg></span>
            <span class="brand-text"><span class="brand-name">ExamSuccess</span><span class="brand-tag">Your Success, Our Mission</span></span>
          </a>
          <p>Focused learning, expert educators, daily mock tests, and proven results for banking, SSC, railways, engineering, teaching, and defence exam aspirants.</p>
        </div>
        <div>
          <h3>Explore</h3>
          <div class="footer-links">
            <a href="${base}index.html">Home 1</a>
            <a href="${base}index1.html">Home 2</a>
            <a href="${base}pages/courses.html">Courses</a>
            <a href="${base}pages/faculty.html">Faculty</a>
            <a href="${base}pages/results.html">Results</a>
            <a href="${base}pages/fees.html">Fees</a>
          </div>
        </div>
        <div>
          <h3>Student Portal</h3>
          <div class="footer-links">
            <a href="${base}pages/dashboard.html">Dashboard</a>
            <a href="${base}pages/live-classes.html">Live Classes</a>
            <a href="${base}pages/study-materials.html">Study Materials</a>
            <a href="${base}pages/signin.html">Sign In</a>
            <a href="${base}pages/signup.html">Sign Up</a>
          </div>
        </div>
        <div>
          <h3>Company &amp; Info</h3>
          <div class="footer-links">
            <a href="${base}pages/about.html">About Us</a>
            <a href="${base}pages/contact.html">Contact</a>
            <a href="${base}pages/coming-soon.html">Coming Soon</a>
            <a href="${base}pages/404.html">404</a>
            <a href="${base}pages/privacy.html">Privacy Policy</a>
            <a href="${base}pages/terms.html">Terms of Service</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© <span data-year></span> ExamSuccess EduTech. All rights reserved.</span>
        <span>Built for ambitious learners across India.</span>
      </div>
    </div></footer>`;
  }

  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  /* ----------------------------------------------------
     3. Theme & Layout Direction Management
  ---------------------------------------------------- */
  const savedTheme = localStorage.getItem('exam-theme');
  const systemDark = matchMedia('(prefers-color-scheme: dark)').matches;
  const applyTheme = theme => {
    document.documentElement.dataset.theme = theme;
    const isDark = theme === 'dark';
    const btns = document.querySelectorAll('#themeToggle, #drawerThemeToggle, [data-theme-toggle], .theme-toggle-btn');
    btns.forEach(btn => {
      if (btn) {
        btn.innerHTML = `<svg class="icon" aria-hidden="true" style="${isDark ? 'color:#fbbf24;fill:#fbbf24;stroke:#fbbf24' : 'color:var(--ink);fill:none;stroke:currentColor'}"><use href="#${isDark ? 'sun' : 'moon'}"></use></svg>`;
        btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
        btn.setAttribute('title', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      }
    });
    resolveSvgUses(document);
  };
  applyTheme(savedTheme || (systemDark ? 'dark' : 'light'));

  const toggleTheme = () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('exam-theme', next);
    applyTheme(next);
    showToast(next === 'dark' ? 'Dark theme enabled' : 'Light theme enabled');
  };
  document.querySelectorAll('#themeToggle, #drawerThemeToggle, [data-theme-toggle], .theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  const applyDir = dir => {
    document.documentElement.dir = dir;
    const isRtl = dir === 'rtl';
    const btns = document.querySelectorAll('#rtlToggle, #drawerRtlToggle, [data-rtl-toggle], .rtl-toggle-btn');
    btns.forEach(btn => {
      if (btn) {
        btn.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#rtl-icon"></use></svg><span class="dir-indicator">${isRtl ? 'RTL' : 'LTR'}</span>`;
        btn.setAttribute('aria-label', isRtl ? 'Switch to left-to-right (LTR) layout' : 'Switch to right-to-left (RTL) layout');
        btn.setAttribute('title', isRtl ? 'Switch to LTR' : 'Switch to RTL');
      }
    });
    resolveSvgUses(document);
  };
  const savedDir = localStorage.getItem('exam-dir') || 'ltr';
  applyDir(savedDir);

  const toggleRtl = () => {
    const next = document.documentElement.dir === 'rtl' ? 'ltr' : 'rtl';
    localStorage.setItem('exam-dir', next);
    applyDir(next);
    showToast(next === 'rtl' ? 'Right-to-left layout enabled' : 'Left-to-right layout enabled');
  };
  document.querySelectorAll('#rtlToggle, #drawerRtlToggle, [data-rtl-toggle], .rtl-toggle-btn').forEach(btn => {
    btn.addEventListener('click', toggleRtl);
  });

  /* ----------------------------------------------------
     4. Navigation Drawer & Scrolling
  ---------------------------------------------------- */
  const menu = document.getElementById('mainNav');
  const menuButton = document.getElementById('menuToggle');
  const backdrop = document.getElementById('menuBackdrop');
  const navCloseBtn = document.getElementById('navCloseBtn');

  const closeMenu = () => {
    menu?.classList.remove('open');
    backdrop?.classList.remove('show');
    menuButton?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };

  menuButton?.addEventListener('click', () => {
    if (!menu) return;
    const open = !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    backdrop?.classList.toggle('show', open);
    menuButton.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('no-scroll', open);
  });

  backdrop?.addEventListener('click', closeMenu);
  navCloseBtn?.addEventListener('click', closeMenu);
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { closeMenu(); closeAllDropdowns(); }));

  // Dropdown toggles (supports touch, click and accordion in mobile drawer)
  const closeAllDropdowns = () => {
    document.querySelectorAll('.has-dropdown.open').forEach(d => {
      d.classList.remove('open');
      d.querySelector('.nav-dropdown-btn')?.setAttribute('aria-expanded', 'false');
    });
  };

  document.querySelectorAll('.has-dropdown').forEach(dropdown => {
    const btn = dropdown.querySelector('.nav-dropdown-btn');
    if (!btn) return;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('open');
      document.querySelectorAll('.has-dropdown.open').forEach(d => {
        if (d !== dropdown) {
          d.classList.remove('open');
          d.querySelector('.nav-dropdown-btn')?.setAttribute('aria-expanded', 'false');
        }
      });
      dropdown.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.has-dropdown')) {
      closeAllDropdowns();
    }
  });

  addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeMenu();
      closeModal();
      closeAllDropdowns();
    }
  });

  addEventListener('scroll', () => document.getElementById('siteHeader')?.classList.toggle('scrolled', scrollY > 10), { passive: true });

  /* ----------------------------------------------------
     5. Scroll Reveal & Number Animations
  ---------------------------------------------------- */
  const reveals = [...document.querySelectorAll('[data-reveal]')];
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: .1, rootMargin: '0px 0px -25px' });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  const countUp = el => {
    const target = Number(el.dataset.target || 0);
    if (!Number.isFinite(target)) return;
    const suffix = el.dataset.suffix || '';
    const duration = 1100;
    const start = performance.now();
    const tick = now => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(target * eased).toLocaleString('en-IN') + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counters = document.querySelectorAll('[data-target]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { countUp(entry.target); counterObserver.unobserve(entry.target); }
    }), { threshold: .4 });
    counters.forEach(el => counterObserver.observe(el));
  }

  /* ----------------------------------------------------
     6. Button Ripple Micro-interaction
  ---------------------------------------------------- */
  document.addEventListener('click', e => {
    const button = e.target.closest('.btn');
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.className = 'ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });

  /* ----------------------------------------------------
     7. Generic Tabs (Faculty, Results, etc.)
  ---------------------------------------------------- */
  document.querySelectorAll('[data-tabs]').forEach(group => {
    group.addEventListener('click', e => {
      const tab = e.target.closest('[data-tab]');
      if (!tab) return;
      group.querySelectorAll('[data-tab]').forEach(t => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });
      const target = tab.dataset.tab;
      const selector = group.dataset.target;
      document.querySelectorAll(selector).forEach(card => {
        const visible = target === 'all' || card.dataset.category === target;
        card.hidden = !visible;
        card.style.display = visible ? '' : 'none';
        if (visible && card.hasAttribute('data-reveal')) {
          card.classList.add('visible');
        }
      });
    });
  });

  /* ----------------------------------------------------
     8. Synchronized Course Catalog Filtering & Search
  ---------------------------------------------------- */
  const catalog = document.querySelector('[data-course-catalog]');
  if (catalog) {
    const cards = [...catalog.querySelectorAll('[data-course]')];
    const search = document.getElementById('courseSearch');
    const sortSelect = document.querySelector('.sort-select');
    let category = 'all';

    let noResults = document.getElementById('catalogNoResults');
    if (!noResults) {
      noResults = document.createElement('div');
      noResults.id = 'catalogNoResults';
      noResults.className = 'card';
      noResults.style.cssText = 'grid-column:1/-1;padding:36px;text-align:center;margin:12px 0;';
      noResults.hidden = true;
      noResults.innerHTML = `
        <div style="font-size:2.2rem;margin-bottom:10px">🔍</div>
        <h3 style="margin-bottom:6px">No courses found</h3>
        <p style="margin-bottom:16px">We couldn’t find any courses matching your search criteria. Try clearing filters or searching for another exam.</p>
        <button class="btn btn-primary btn-sm" id="emptyResetBtn">Reset All Filters</button>
      `;
      const grid = catalog.querySelector('.course-card-grid');
      if (grid) grid.appendChild(noResults);
      document.getElementById('emptyResetBtn')?.addEventListener('click', () => resetFilters());
    }

    const filter = () => {
      const query = (search?.value || '').toLowerCase().trim();
      const typeBoxes = [...document.querySelectorAll('.filter-panel input[data-type-filter]:checked')].map(cb => cb.dataset.typeFilter);
      const langBoxes = [...document.querySelectorAll('.filter-panel input[data-lang-filter]:checked')].map(cb => cb.dataset.langFilter);

      let visibleCount = 0;
      cards.forEach(card => {
        const cardText = card.textContent.toLowerCase();
        const matchesText = !query || cardText.includes(query);
        const matchesCat = category === 'all' || card.dataset.category === category;

        const cardTypes = (card.dataset.type || 'live,recorded,test').split(',');
        const matchesType = typeBoxes.length === 0 || typeBoxes.some(t => cardTypes.includes(t));

        const cardLangs = (card.dataset.lang || 'english,hinglish').split(',');
        const matchesLang = langBoxes.length === 0 || langBoxes.some(l => cardLangs.includes(l));

        const visible = matchesText && matchesCat && matchesType && matchesLang;
        card.hidden = !visible;
        card.style.display = visible ? '' : 'none';
        if (visible) {
          visibleCount++;
          if (card.hasAttribute('data-reveal')) card.classList.add('visible');
        }
      });

      if (noResults) {
        noResults.hidden = visibleCount > 0;
        noResults.style.display = visibleCount > 0 ? 'none' : '';
      }

      const countEl = document.getElementById('courseCountDisplay');
      if (countEl) countEl.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? 'Course' : 'Courses'}`;
      const desktopCount = document.getElementById('desktopCourseCount');
      if (desktopCount) desktopCount.textContent = `${visibleCount} ${visibleCount === 1 ? 'Program' : 'Programs'}`;
    };

    document.querySelectorAll('[data-course-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        category = btn.dataset.courseFilter;
        document.querySelectorAll('[data-course-filter]').forEach(b => {
          b.classList.toggle('active', b.dataset.courseFilter === category);
        });
        filter();
      });
    });

    search?.addEventListener('input', filter);
    document.querySelectorAll('.filter-panel input[type="checkbox"]').forEach(cb => cb.addEventListener('change', filter));

    sortSelect?.addEventListener('change', () => {
      const grid = catalog.querySelector('.course-card-grid');
      if (!grid) return;
      const sorted = [...cards];
      const val = sortSelect.value.toLowerCase();
      if (val === 'price-low') {
        sorted.sort((a, b) => Number(a.dataset.price || 0) - Number(b.dataset.price || 0));
      } else if (val === 'price-high') {
        sorted.sort((a, b) => Number(b.dataset.price || 0) - Number(a.dataset.price || 0));
      } else if (val === 'students') {
        sorted.sort((a, b) => Number(b.dataset.students || 0) - Number(a.dataset.students || 0));
      } else {
        sorted.sort((a, b) => Number(b.dataset.students || 0) - Number(a.dataset.students || 0));
      }
      sorted.forEach(card => grid.appendChild(card));
      if (noResults) grid.appendChild(noResults);
    });

    const resetFilters = () => {
      category = 'all';
      if (search) search.value = '';
      document.querySelectorAll('[data-course-filter]').forEach(b => {
        b.classList.toggle('active', b.dataset.courseFilter === 'all');
      });
      document.querySelectorAll('.filter-panel input[type="checkbox"]').forEach(c => c.checked = false);
      filter();
    };

    document.getElementById('clearFilters')?.addEventListener('click', resetFilters);

    const applyHash = () => {
      const hash = location.hash.replace('#', '').toLowerCase();
      if (hash) {
        const match = document.querySelector(`[data-course-filter="${hash}"]`);
        if (match) {
          category = hash;
          document.querySelectorAll('[data-course-filter]').forEach(b => {
            b.classList.toggle('active', b.dataset.courseFilter === category);
          });
          filter();
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };
    applyHash();
    addEventListener('hashchange', applyHash);

    document.getElementById('mobileFilterToggle')?.addEventListener('click', () => {
      const panel = document.querySelector('.filter-panel');
      if (!panel) return;
      panel.classList.toggle('mobile-open');
    });
  }

  /* ----------------------------------------------------
     9. Interactive Mock Test Simulator & Unique Question Engine
  ---------------------------------------------------- */
  const questionBanks = {
    quant: [
      {
        q: "A train 240 m long passes an electric pole in 24 seconds. How much time will it take to cross a platform 650 m long?",
        options: ["65 seconds", "89 seconds", "72 seconds", "95 seconds"],
        correct: 1,
        explanation: "Speed = 240m / 24s = 10 m/s. Total distance = 240m + 650m = 890m. Time = 890m / 10 m/s = 89 seconds.",
        category: "Quantitative Aptitude"
      },
      {
        q: "A can complete a work in 12 days, and B can complete it in 18 days. If they work together with C to finish it in 4 days, in how many days can C alone finish the work?",
        options: ["9 days", "10 days", "12 days", "8 days"],
        correct: 0,
        explanation: "Work rates: 1/A = 1/12, 1/B = 1/18. 1/A + 1/B = 5/36. 1/C = 1/4 - 5/36 = (9 - 5)/36 = 4/36 = 1/9. Therefore, C alone takes 9 days.",
        category: "Quantitative Aptitude"
      },
      {
        q: "The difference between Compound Interest and Simple Interest on a sum of money for 2 years at 10% per annum is ₹150. What is the principal sum?",
        options: ["₹12,000", "₹15,000", "₹18,000", "₹10,500"],
        correct: 1,
        explanation: "Difference for 2 years = P × (R/100)². ₹150 = P × (10/100)² = P × (1/100). P = 150 × 100 = ₹15,000.",
        category: "Quantitative Aptitude"
      },
      {
        q: "A shopkeeper marks an article 40% above cost price and allows a 20% discount. What is his net profit percentage?",
        options: ["12%", "15%", "18%", "20%"],
        correct: 0,
        explanation: "Net % = M - D - (M × D)/100 = 40 - 20 - (40 × 20)/100 = 20 - 8 = 12% profit.",
        category: "Quantitative Aptitude"
      },
      {
        q: "A mixture contains milk and water in the ratio 7 : 3. If 10 litres of water is added, the ratio becomes 7 : 5. What was the initial quantity of milk?",
        options: ["28 litres", "35 litres", "42 litres", "21 litres"],
        correct: 1,
        explanation: "Milk remains constant at 7x. Water increases from 3x to 5x: 2x = 10 litres => x = 5. Initial milk = 7 × 5 = 35 litres.",
        category: "Quantitative Aptitude"
      }
    ],

    reasoning: [
      {
        q: "In a certain code language, 'TARGET' is coded as 'UBSHFU'. How will 'SUCCESS' be coded in that same language?",
        options: ["TVDDFTT", "TVDDFSS", "RVDDFTT", "TVEESTT"],
        correct: 0,
        explanation: "Each letter is shifted forward by +1 position in the English alphabetical series: S->T, U->V, C->D, C->D, E->F, S->T, S->T.",
        category: "Reasoning Ability"
      },
      {
        q: "Statements: (I) Only a few A are B. (II) All B are C. Conclusions: (1) Some A are not B. (2) All A can be C.",
        options: ["Only (1) follows", "Only (2) follows", "Both (1) and (2) follow", "Neither follows"],
        correct: 2,
        explanation: "'Only a few A are B' means Some A are B AND Some A are not B (hence Concl 1 is true). All A can easily be placed inside C without violating restrictions (hence Concl 2 is true).",
        category: "Reasoning Ability"
      },
      {
        q: "Pointing to a photograph, Amit said, 'She is the daughter of the only son of my grandfather.' How is the girl related to Amit?",
        options: ["Sister", "Daughter", "Cousin", "Mother"],
        correct: 0,
        explanation: "Amit's grandfather's only son is Amit's father. The daughter of Amit's father is Amit's sister.",
        category: "Reasoning Ability"
      },
      {
        q: "Six friends P, Q, R, S, T, and U sit in a circle facing the center. P is opposite S. Q is between P and T. R is between S and U. Who sits immediately to the left of P if Q is to P's right?",
        options: ["U", "T", "R", "S"],
        correct: 0,
        explanation: "Arrangement clockwise: P, Q, T, S, R, U. Immediately to the left of P is U.",
        category: "Reasoning Ability"
      },
      {
        q: "Complete the numerical series: 4, 9, 25, 49, 121, ?",
        options: ["144", "169", "196", "225"],
        correct: 1,
        explanation: "The series represents squares of consecutive prime numbers: 2²=4, 3²=9, 5²=25, 7²=49, 11²=121, 13²=169.",
        category: "Reasoning Ability"
      }
    ],

    english: [
      {
        q: "Identify the part of the sentence with a grammatical error: 'Neither the supervisor (A) nor the apprentices (B) was aware of (C) the safety protocol (D).'",
        options: ["Part (A)", "Part (B)", "Part (C)", "Part (D)"],
        correct: 2,
        explanation: "When subjects are joined by 'neither... nor', the verb agrees with the closer subject. 'Apprentices' is plural, so it should be 'were aware of' instead of 'was aware of'.",
        category: "English Language"
      },
      {
        q: "Choose the exact antonym for the word: OBFUSCATE.",
        options: ["Clarify", "Complicate", "Conceal", "Baffle"],
        correct: 0,
        explanation: "Obfuscate means to make obscure, unclear, or unintelligible. Its direct antonym is Clarify (to make clear).",
        category: "English Language"
      },
      {
        q: "Fill in the blank with the most appropriate idiom: 'After working a 16-hour shift, the doctor decided to _______.'",
        options: ["bite the bullet", "call it a day", "burn bridges", "break the ice"],
        correct: 1,
        explanation: "'Call it a day' means to stop working on something for the rest of the day.",
        category: "English Language"
      },
      {
        q: "Select the correctly spelled word:",
        options: ["Accommodate", "Acommodate", "Accomodate", "Accommadate"],
        correct: 0,
        explanation: "The correct spelling has double 'c' and double 'm': ACCOMMODATE.",
        category: "English Language"
      },
      {
        q: "Change into Passive Voice: 'The committee has evaluated all competitive exam applications.'",
        options: ["All competitive exam applications have been evaluated by the committee.", "All competitive exam applications had been evaluated by the committee.", "All competitive exam applications were evaluated by the committee.", "All competitive exam applications are evaluated by the committee."],
        correct: 0,
        explanation: "Present perfect active ('has evaluated') transforms to 'have been evaluated' with plural subject 'applications'.",
        category: "English Language"
      }
    ],

    ga: [
      {
        q: "Which Article of the Constitution of India provides for the establishment and role of the Finance Commission?",
        options: ["Article 268", "Article 280", "Article 324", "Article 356"],
        correct: 1,
        explanation: "Article 280 states that the President of India shall constitute a Finance Commission every five years.",
        category: "General Awareness"
      },
      {
        q: "Which river is known as the 'Sorrow of Bengal' due to its frequent devastating floods?",
        options: ["Kosi", "Damodar", "Hooghly", "Brahmaputra"],
        correct: 1,
        explanation: "Damodar River was historically known as the Sorrow of Bengal before the construction of multi-purpose river valley dams (DVC).",
        category: "General Awareness"
      },
      {
        q: "What is the primary objective of the Monetary Policy Committee (MPC) constituted by the Reserve Bank of India?",
        options: ["Maintaining foreign exchange reserves", "Inflation targeting with economic growth", "Managing government debt auctions", "Regulating stock exchanges"],
        correct: 1,
        explanation: "Under Section 45ZB of the RBI Act, the MPC is tasked with keeping CPI inflation within the target band (4% ± 2%) while supporting economic growth.",
        category: "General Awareness"
      },
      {
        q: "The Keoladeo National Park (formerly Bharatpur Bird Sanctuary), a UNESCO World Heritage Site, is located in which Indian state?",
        options: ["Gujarat", "Rajasthan", "Madhya Pradesh", "Haryana"],
        correct: 1,
        explanation: "Keoladeo National Park is located in Bharatpur district, Rajasthan, renowned as a wintering habitat for migratory avifauna.",
        category: "General Awareness"
      },
      {
        q: "Who among the following was the first Chief Election Commissioner of Independent India?",
        options: ["Sukumar Sen", "T. N. Seshan", "K. V. K. Sundaram", "Nagendra Singh"],
        correct: 0,
        explanation: "Sukumar Sen served as the 1st Chief Election Commissioner of India from March 1950 to December 1958, overseeing the historic 1951-52 General Elections.",
        category: "General Awareness"
      }
    ],

    banking: [
      {
        q: "Which committee recommended the establishment of Regional Rural Banks (RRBs) in India?",
        options: ["Hilton Young Commission", "Narasimham Working Group (1975)", "Raghuram Rajan Committee", "Urjit Patel Committee"],
        correct: 1,
        explanation: "The Narasimham Working Group (1975) recommended establishing Regional Rural Banks to cater to rural credit needs.",
        category: "Banking Awareness"
      },
      {
        q: "What does 'L' stand for in the LAF framework operated by the Reserve Bank of India?",
        options: ["Liquidity", "Lending", "Leverage", "Liability"],
        correct: 0,
        explanation: "LAF stands for Liquidity Adjustment Facility, a key monetary tool used by RBI through Repo and Reverse Repo auctions.",
        category: "Banking Awareness"
      },
      {
        q: "Under Priority Sector Lending (PSL) norms in India, what percentage of Adjusted Net Bank Credit (ANBC) must domestic commercial banks allocate to priority sectors?",
        options: ["25%", "33%", "40%", "50%"],
        correct: 2,
        explanation: "Domestic scheduled commercial banks are mandated to allocate 40% of their ANBC or credit equivalent of off-balance sheet exposure to Priority Sector Lending.",
        category: "Banking Awareness"
      },
      {
        q: "The deposit insurance scheme in India is administered by DICGC. What is the maximum insurance coverage per depositor per bank?",
        options: ["₹1,00,000", "₹2,50,000", "₹5,00,000", "₹10,00,000"],
        correct: 2,
        explanation: "DICGC (a wholly owned subsidiary of RBI) insures bank deposits up to ₹5,00,000 for both principal and interest per depositor per bank.",
        category: "Banking Awareness"
      },
      {
        q: "Which entity regulates the credit rating agencies (CRAs) operating in India?",
        options: ["Reserve Bank of India (RBI)", "Securities and Exchange Board of India (SEBI)", "IRDAI", "PFRDA"],
        correct: 1,
        explanation: "Credit rating agencies such as CRISIL, ICRA, and CARE are registered and regulated by SEBI under the SEBI (Credit Rating Agencies) Regulations, 1999.",
        category: "Banking Awareness"
      }
    ],

    ssc: [
      {
        q: "If sin θ + cos θ = √2 cos θ, then what is the value of (cos θ - sin θ)?",
        options: ["√2 sin θ", "√2 cos θ", "1 / √2", "2 sin θ"],
        correct: 0,
        explanation: "Given sin θ = (√2 - 1) cos θ. Multiply numerator & denominator by (√2 + 1): cos θ = (√2 + 1) sin θ. Thus cos θ - sin θ = √2 sin θ.",
        category: "SSC CGL Quantitative"
      },
      {
        q: "Who among the following founded the famous Asiatic Society of Bengal in 1784?",
        options: ["Warren Hastings", "Sir William Jones", "Lord Cornwallis", "James Prinsep"],
        correct: 1,
        explanation: "Sir William Jones founded the Asiatic Society in Calcutta in 1784 to promote Oriental studies and research.",
        category: "SSC CGL General Studies"
      },
      {
        q: "If x + 1/x = 5, find the value of x³ + 1/x³.",
        options: ["110", "115", "120", "125"],
        correct: 0,
        explanation: "Formula: x³ + 1/x³ = k³ - 3k. For k = 5: 5³ - 3(5) = 125 - 15 = 110.",
        category: "SSC CGL Quantitative"
      },
      {
        q: "Which gland in the human body is responsible for producing the hormone insulin?",
        options: ["Thyroid Gland", "Pancreas (Islets of Langerhans)", "Pituitary Gland", "Adrenal Gland"],
        correct: 1,
        explanation: "Beta cells in the Islets of Langerhans of the pancreas secrete insulin to regulate blood glucose levels.",
        category: "SSC CGL General Science"
      },
      {
        q: "Select the related word from the given alternatives: Ornithology : Birds :: Paleontology : ?",
        options: ["Fossils", "Insects", "Plants", "Minerals"],
        correct: 0,
        explanation: "Ornithology is the scientific study of birds; Paleontology is the study of fossils and prehistoric life.",
        category: "SSC CGL General Intelligence"
      }
    ],

    railways: [
      {
        q: "What is the SI unit of electrical resistance?",
        options: ["Ohm", "Volt", "Ampere", "Watt"],
        correct: 0,
        explanation: "Ohm (Ω) is the SI unit of electrical resistance, defined by Ohm's law V = IR.",
        category: "RRB NTPC General Science"
      },
      {
        q: "In which year did the first passenger train run in India between Bori Bunder (Bombay) and Thane?",
        options: ["1848", "1853", "1857", "1869"],
        correct: 1,
        explanation: "India's first passenger train ran on 16 April 1853 covering a distance of 34 km with 14 carriages and 400 passengers.",
        category: "RRB NTPC Railways & History"
      },
      {
        q: "Which component of the computer's CPU is responsible for carrying out arithmetic and logic operations?",
        options: ["ALU", "Control Unit", "Cache Memory", "Registers"],
        correct: 0,
        explanation: "The ALU (Arithmetic Logic Unit) executes all mathematical calculations and boolean logical comparisons.",
        category: "RRB NTPC Computer Awareness"
      },
      {
        q: "The speed of sound is maximum in which of the following media?",
        options: ["Vacuum", "Air", "Water", "Steel (Solids)"],
        correct: 3,
        explanation: "Sound waves are mechanical waves that travel fastest through dense solid elastic media like steel (~5960 m/s), slower in water (~1480 m/s), and slowest in air (~343 m/s). It cannot travel in vacuum.",
        category: "RRB NTPC General Science"
      },
      {
        q: "A 180 m long train moving at 54 km/h crosses a man running at 6 km/h in the same direction. How much time does it take?",
        options: ["12 seconds", "13.5 seconds", "15 seconds", "18 seconds"],
        correct: 1,
        explanation: "Relative speed = 54 - 6 = 48 km/h = 48 × (5/18) = 40/3 m/s. Time = Distance / Speed = 180 / (40/3) = (180 × 3) / 40 = 13.5 seconds.",
        category: "RRB NTPC Mathematics"
      }
    ],

    diagnostic: [
      {
        q: "The lengths of two parallel sides of a trapezium are 18 cm and 24 cm, and the distance between them is 12 cm. What is the area of the trapezium?",
        options: ["252 cm²", "288 cm²", "312 cm²", "216 cm²"],
        correct: 0,
        explanation: "Area of trapezium = 1/2 × (sum of parallel sides) × height = 1/2 × (18 + 24) × 12 = 1/2 × 42 × 12 = 252 cm².",
        category: "Geometry & Mensuration"
      },
      {
        q: "From a pack of 52 playing cards, two cards are drawn at random. What is the probability that both are Kings?",
        options: ["1/221", "1/169", "1/13", "1/52"],
        correct: 0,
        explanation: "Probability = (4C2) / (52C2) = [ (4 × 3)/2 ] / [ (52 × 51)/2 ] = 6 / 1326 = 1 / 221.",
        category: "Modern Math & Probability"
      },
      {
        q: "Find the length of the diagonal of a cube whose total surface area is 216 cm².",
        options: ["6√3 cm", "6√2 cm", "8√3 cm", "12 cm"],
        correct: 0,
        explanation: "Total surface area = 6a² = 216 => a² = 36 => a = 6 cm. Body diagonal of a cube = a√3 = 6√3 cm.",
        category: "Geometry & 3D Mensuration"
      },
      {
        q: "In how many distinct ways can the letters of the word 'SUCCESS' be arranged?",
        options: ["420", "840", "1260", "2520"],
        correct: 0,
        explanation: "Total letters = 7 (S appears 3 times, C appears 2 times, U appears 1, E appears 1). Total permutations = 7! / (3! × 2!) = 5040 / (6 × 2) = 5040 / 12 = 420.",
        category: "Permutations & Combinations"
      },
      {
        q: "In a circle with radius 13 cm, a chord is drawn at a distance of 5 cm from the center. What is the length of the chord?",
        options: ["12 cm", "20 cm", "24 cm", "26 cm"],
        correct: 2,
        explanation: "By Pythagoras theorem, half-chord length = √(13² - 5²) = √(169 - 25) = √144 = 12 cm. Total chord length = 2 × 12 = 24 cm.",
        category: "Geometry & Circles"
      }
    ],

    speedSprint: [
      {
        q: "Rapid Calculation: What is 18.5% of 400 + 35% of 240?",
        options: ["148", "158", "162", "154"],
        correct: 1,
        explanation: "18.5% of 400 = 18.5 × 4 = 74. 35% of 240 = 70% of 120 = 84. Total = 74 + 84 = 158.",
        category: "Speed Math Drill"
      },
      {
        q: "What comes next in the letter pattern: BDF, HJL, NPR, ?",
        options: ["TVX", "TUX", "SUW", "UWZ"],
        correct: 0,
        explanation: "Each block skips 1 letter (B-D-F, H-J-L, N-P-R). The start of each block moves by +6 (B->H->N->T). Next block: T-V-X.",
        category: "Rapid Reasoning"
      },
      {
        q: "If the price of sugar increases by 25%, by what percentage must consumption be reduced to keep expenditure constant?",
        options: ["20%", "25%", "15%", "16.67%"],
        correct: 0,
        explanation: "% Reduction = [ r / (100 + r) ] × 100 = [ 25 / 125 ] × 100 = 1/5 × 100 = 20%.",
        category: "Speed Math Drill"
      },
      {
        q: "Which country hosted the First Olympic Games in modern history (1896)?",
        options: ["Greece (Athens)", "France (Paris)", "United Kingdom (London)", "USA (St. Louis)"],
        correct: 0,
        explanation: "The 1896 Summer Olympics, the first modern international Olympic Games, were held in Athens, Greece.",
        category: "Rapid GK PYQ"
      },
      {
        q: "A sum triples itself in 6 years at Simple Interest. In how many years will it become 7 times itself?",
        options: ["14 years", "18 years", "21 years", "16 years"],
        correct: 1,
        explanation: "Simple interest earned in 6 years = 3P - P = 2P => rate per 6 years is 2P. To become 7P, interest needed = 6P. Time = 3 × 6 = 18 years.",
        category: "Speed Math Drill"
      }
    ],

    fullMock: [
      {
        q: "The ratio of male to female aspirants in an exam batch of 180 is 5 : 4. How many more female aspirants must join to make the ratio 1 : 1?",
        options: ["15", "20", "25", "10"],
        correct: 1,
        explanation: "Total parts = 5 + 4 = 9. Each part = 180 / 9 = 20. Males = 5 × 20 = 100, Females = 4 × 20 = 80. To equalize (100:100), 100 - 80 = 20 females must join.",
        category: "Quantitative Aptitude"
      },
      {
        q: "In a certain code language, 'TARGET' is coded as 'UBSHFU'. How will 'SUCCESS' be coded in that same language?",
        options: ["TVDDFTT", "TVDDFSS", "RVDDFTT", "TVEESTT"],
        correct: 0,
        explanation: "Each letter is shifted forward by +1 position in the English alphabetical series: S->T, U->V, C->D, C->D, E->F, S->T, S->T.",
        category: "Reasoning Ability"
      },
      {
        q: "Which Article of the Constitution of India provides for the establishment and role of the Finance Commission?",
        options: ["Article 268", "Article 280", "Article 324", "Article 356"],
        correct: 1,
        explanation: "Article 280 states that the President of India shall constitute a Finance Commission every five years.",
        category: "General Awareness"
      },
      {
        q: "Choose the exact antonym for the word: OBFUSCATE.",
        options: ["Clarify", "Complicate", "Conceal", "Baffle"],
        correct: 0,
        explanation: "Obfuscate means to make obscure, unclear, or unintelligible. Its direct antonym is Clarify (to make clear).",
        category: "English Language"
      },
      {
        q: "Which committee recommended the establishment of Regional Rural Banks (RRBs) in India?",
        options: ["Hilton Young Commission", "Narasimham Working Group (1975)", "Raghuram Rajan Committee", "Urjit Patel Committee"],
        correct: 1,
        explanation: "The Narasimham Working Group (1975) recommended establishing Regional Rural Banks to cater to rural credit needs.",
        category: "Banking Awareness"
      }
    ]
  };

  const getQuestionsForTest = (subjectTitle = '') => {
    const t = subjectTitle.toLowerCase();
    if (t.includes('geom') || t.includes('modern math') || t.includes('diag')) return questionBanks.diagnostic;
    if (t.includes('sprint') || t.includes('rapid') || t.includes('drill') || t.includes('pyq')) return questionBanks.speedSprint;
    if (t.includes('rrb') || t.includes('ntpc') || t.includes('railway') || t.includes('science')) return questionBanks.railways;
    if (t.includes('ssc') || t.includes('cgl') || t.includes('chsl') || t.includes('tier')) return questionBanks.ssc;
    if (t.includes('bank') || t.includes('financial') || t.includes('economy') || t.includes('rbi')) return questionBanks.banking;
    if (t.includes('reason') || t.includes('puzzle') || t.includes('seating') || t.includes('logic')) return questionBanks.reasoning;
    if (t.includes('quant') || t.includes('arith') || t.includes('math') || t.includes('di') || t.includes('data inter')) return questionBanks.quant;
    if (t.includes('eng') || t.includes('gram') || t.includes('vocab') || t.includes('comprehension')) return questionBanks.english;
    if (t.includes('ga') || t.includes('current') || t.includes('gk') || t.includes('general awareness')) return questionBanks.ga;
    if (t.includes('full length') || t.includes('all-india') || t.includes('sbi po') || t.includes('mock - 2')) return questionBanks.fullMock;
    return questionBanks.quant;
  };

  let testState = {
    active: false,
    subjectTitle: '',
    questions: [],
    currentIdx: 0,
    answers: {},
    timeRemaining: 15 * 60,
    timer: null
  };

  const startMockTest = (subjectTitle = 'Free All-India Mock Test') => {
    testState.active = true;
    testState.subjectTitle = subjectTitle;
    testState.questions = getQuestionsForTest(subjectTitle);
    testState.currentIdx = 0;
    testState.answers = {};
    const t = subjectTitle.toLowerCase();
    testState.timeRemaining = t.includes('sprint') ? 10 * 60 : (t.includes('full') ? 20 * 60 : 15 * 60);
    clearInterval(testState.timer);

    let modal = document.getElementById('freeTestModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal';
      modal.id = 'freeTestModal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-hidden', 'true');
      modal.setAttribute('aria-labelledby', 'free-test-title');
      modal.innerHTML = `<div class="modal-panel modal-panel-lg"></div>`;
      document.body.appendChild(modal);
      modal.addEventListener('click', e => {
        if (e.target === modal) closeModal();
      });
    }

    modal.classList.remove('modal-panel-lg');
    const panel = modal.querySelector('.modal-panel');
    if (!panel) return;

    panel.classList.add('modal-panel-lg');
    modal.scrollTop = 0;
    panel.scrollTop = 0;
    renderTestUI(panel, subjectTitle);
    openModal('freeTestModal');

    testState.timer = setInterval(() => {
      testState.timeRemaining--;
      const timerEl = document.getElementById('simTimer');
      if (timerEl) {
        const m = Math.floor(testState.timeRemaining / 60).toString().padStart(2, '0');
        const s = (testState.timeRemaining % 60).toString().padStart(2, '0');
        timerEl.textContent = `${m}:${s}`;
      }
      if (testState.timeRemaining <= 0) {
        clearInterval(testState.timer);
        submitMockTest(panel, subjectTitle);
      }
    }, 1000);
  };

  const renderTestUI = (panel, subjectTitle) => {
    const q = testState.questions[testState.currentIdx];
    const totalQ = testState.questions.length;
    const selected = testState.answers[testState.currentIdx];
    const m = Math.floor(testState.timeRemaining / 60).toString().padStart(2, '0');
    const s = (testState.timeRemaining % 60).toString().padStart(2, '0');

    panel.innerHTML = `
      <div class="test-simulator">
        <div class="modal-head" style="margin-bottom:14px">
          <div style="display:flex;align-items:center;gap:10px">
            <span class="brand-mark" style="width:30px;height:30px;flex-shrink:0"><svg aria-hidden="true"><use href="#logo"></use></svg></span>
            <h2 id="free-test-title" style="font-size:1.15rem;margin:0">${subjectTitle}</h2>
          </div>
          <button class="modal-close-corner" data-modal-close aria-label="Exit mock test" title="Exit mock test">${icon('close')}</button>
        </div>
        <div class="test-top-bar">
          <span class="test-timer">${icon('clock', 'icon')} <span id="simTimer">${m}:${s}</span></span>
          <span class="test-progress-text">Question ${testState.currentIdx + 1} of ${totalQ}</span>
          <span class="course-badge highlight">${q.category}</span>
        </div>
        <div class="test-question-box">
          <div class="test-q-meta">
            <span>Mark: +1.00 &nbsp;|&nbsp; Negative: -0.25</span>
            <span>Single Correct Option</span>
          </div>
          <div class="test-q-text">${testState.currentIdx + 1}. ${q.q}</div>
          <div class="test-options">
            ${q.options.map((opt, idx) => `
              <label class="test-opt-label">
                <input type="radio" name="testOpt" value="${idx}" ${selected === idx ? 'checked' : ''}>
                <span>${String.fromCharCode(65 + idx)}) &nbsp;${opt}</span>
              </label>
            `).join('')}
          </div>
        </div>
        <div class="test-nav-actions">
          <button class="btn btn-outline btn-sm" id="simPrevBtn" ${testState.currentIdx === 0 ? 'disabled' : ''}>Previous</button>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            <button class="btn btn-ghost btn-sm" id="simClearBtn">Clear Choice</button>
            <button class="btn btn-outline btn-sm" data-modal-close id="simExitBtn">Exit Test</button>
            ${testState.currentIdx === totalQ - 1 ?
              `<button class="btn btn-primary btn-sm" id="simSubmitBtn">Submit Exam</button>` :
              `<button class="btn btn-primary btn-sm" id="simNextBtn">Next Question ${icon('arrow')}</button>`
            }
          </div>
        </div>
      </div>
    `;

    panel.querySelectorAll('input[name="testOpt"]').forEach(radio => {
      radio.addEventListener('change', () => {
        testState.answers[testState.currentIdx] = Number(radio.value);
      });
    });

    panel.querySelector('#simPrevBtn')?.addEventListener('click', () => {
      if (testState.currentIdx > 0) {
        testState.currentIdx--;
        renderTestUI(panel, subjectTitle);
      }
    });

    panel.querySelector('#simNextBtn')?.addEventListener('click', () => {
      if (testState.currentIdx < totalQ - 1) {
        testState.currentIdx++;
        renderTestUI(panel, subjectTitle);
      }
    });

    panel.querySelector('#simClearBtn')?.addEventListener('click', () => {
      delete testState.answers[testState.currentIdx];
      renderTestUI(panel, subjectTitle);
    });

    panel.querySelector('#simSubmitBtn')?.addEventListener('click', () => {
      submitMockTest(panel, subjectTitle);
    });

    panel.querySelectorAll('[data-modal-close]').forEach(b => b.addEventListener('click', closeModal));
  };

  const submitMockTest = (panel, subjectTitle) => {
    clearInterval(testState.timer);
    let correct = 0;
    let attempted = 0;
    const totalQ = testState.questions.length;

    testState.questions.forEach((q, idx) => {
      if (testState.answers[idx] !== undefined) {
        attempted++;
        if (testState.answers[idx] === q.correct) correct++;
      }
    });

    const incorrect = attempted - correct;
    const rawScore = Math.max(0, (correct * 1) - (incorrect * 0.25)).toFixed(2);
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    const percentile = Math.min(99.4, (75 + (correct * 4.8))).toFixed(1);

    const modal = document.getElementById('freeTestModal') || panel.closest('.modal');
    if (modal) modal.scrollTop = 0;
    panel.scrollTop = 0;

    panel.innerHTML = `
      <div class="test-scorecard">
        <div class="modal-head" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
          <div style="display:flex;align-items:center;gap:10px">
            <span class="brand-mark" style="width:30px;height:30px;flex-shrink:0"><svg aria-hidden="true"><use href="#logo"></use></svg></span>
            <span class="course-badge highlight" style="font-size:.78rem">Diagnostic Performance Report</span>
          </div>
          <button class="modal-close-corner" data-modal-close aria-label="Close scorecard" title="Close report">${icon('close')}</button>
        </div>
        <div class="score-badge-circle">${rawScore}</div>
        <h2>Test Completed!</h2>
        <p style="margin-bottom:20px;color:var(--muted)">Diagnostic Score Report for <strong>${subjectTitle}</strong></p>
        
        <div class="summary-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:20px">
          <div class="card" style="padding:14px">
            <strong style="font-size:1.4rem;color:var(--green)">${correct}/${totalQ}</strong>
            <small class="muted" style="display:block">Correct Answers</small>
          </div>
          <div class="card" style="padding:14px">
            <strong style="font-size:1.4rem;color:var(--blue-700)">${accuracy}%</strong>
            <small class="muted" style="display:block">Accuracy</small>
          </div>
          <div class="card" style="padding:14px">
            <strong style="font-size:1.4rem;color:var(--purple)">${percentile}%</strong>
            <small class="muted" style="display:block">Est. Percentile</small>
          </div>
        </div>

        <div style="text-align:left;margin-bottom:22px;border:1px solid var(--line);border-radius:10px;padding:16px;background:var(--surface-2);max-height:240px;overflow-y:auto">
          <h4 style="margin-bottom:10px;font-size:.86rem">Detailed Answer Explanations:</h4>
          ${testState.questions.map((q, idx) => {
            const userAns = testState.answers[idx];
            const isRight = userAns === q.correct;
            return `
              <div style="margin-bottom:12px;font-size:.8rem;padding-bottom:8px;border-bottom:1px solid rgba(0,0,0,.08)">
                <b>Q${idx+1}:</b> ${q.q}<br>
                <span style="color:${isRight ? 'var(--green)' : 'var(--red)'};font-weight:750">
                  ${userAns !== undefined ? (isRight ? '✓ Correct' : `✗ Incorrect (You chose ${String.fromCharCode(65 + userAns)})`) : '— Skipped'}
                </span> &nbsp;·&nbsp;
                <span style="color:var(--ink)">Correct: ${String.fromCharCode(65 + q.correct)}) ${q.options[q.correct]}</span>
                <p style="margin:4px 0 0;color:var(--muted);font-size:.74rem">${q.explanation}</p>
              </div>
            `;
          }).join('')}
        </div>

        <div class="hero-actions" style="justify-content:center;gap:12px;margin-top:20px;flex-wrap:wrap">
          <button class="btn btn-primary" id="simRetakeBtn">${icon('clock')} Retake Test</button>
          <a class="btn btn-outline" href="${base}pages/courses.html">Explore Recommended Courses</a>
          <button class="btn btn-secondary" data-modal-close id="simScoreCloseBtn">${icon('close')} Close Report</button>
        </div>
      </div>
    `;

    panel.querySelector('#simRetakeBtn')?.addEventListener('click', () => {
      startMockTest(subjectTitle);
    });
    panel.querySelectorAll('[data-modal-close]').forEach(b => b.addEventListener('click', closeModal));
  };

  document.querySelectorAll('[data-modal-open="freeTestModal"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      startMockTest('Free All-India Quantitative & Reasoning Mock');
    });
  });

  /* ----------------------------------------------------
     10. Faculty Profile Modal
  ---------------------------------------------------- */
  const facultyDatabase = [
    { name: "Rohit Mehta", subject: "Quantitative Aptitude", exp: "12+ Years", students: "1,50,000+", selections: "4,800+", bio: "Ex-SBI PO Trainer with a decade of mastery in simplifying complex arithmetic and algebra shortcuts.", px: "0%", py: "0%", quote: "Mastering speed math is about recognizing patterns, not memorizing 100 separate tricks." },
    { name: "Neha Arora", subject: "English Language & RC", exp: "10+ Years", students: "1,20,000+", selections: "3,900+", bio: "Delhi University alumna and verbal ability mentor specializing in root-word vocabulary, grammar rules, and reading comprehension.", px: "33.333%", py: "0%", quote: "Reading analytically for 15 minutes a day builds exam-level verbal instinct faster than rote rules." },
    { name: "Amit Verma", subject: "Reasoning Ability & Puzzles", exp: "11+ Years", students: "1,40,000+", selections: "4,200+", bio: "Known across India as the 'Puzzle Master' for decoding multi-variable circular arrangements and syllogisms.", px: "66.667%", py: "0%", quote: "Every complex puzzle has an entry point. Find the anchor variable, and the puzzle solves itself." },
    { name: "Rahul Sir", subject: "Computer Awareness", exp: "9+ Years", students: "90,000+", selections: "2,700+", bio: "MCA and former IT systems engineer guiding banking and regulatory exam aspirants in computer aptitude.", px: "100%", py: "0%", quote: "Computer awareness is a scoring section if you understand OS fundamentals and modern cyber concepts." },
    { name: "Vivek Pandey", subject: "General Awareness & Current Affairs", exp: "13+ Years", students: "2,00,000+", selections: "6,100+", bio: "Senior faculty for daily current affairs, static GK, and Indian economy with over 6,000 selections.", px: "0%", py: "50%", quote: "Connect daily news to the underlying constitutional and economic background for lasting retention." },
    { name: "Sandeep Sir", subject: "Advanced Maths & Trigonometry", exp: "14+ Years", students: "1,80,000+", selections: "5,500+", bio: "M.Sc. Mathematics mentor who has trained multiple top-100 rankers in SSC CGL and engineering exams.", px: "33.333%", py: "50%", quote: "Geometry theorems become intuitive when visual proofs replace dry formula memorization." },
    { name: "Gaurav Singh", subject: "Banking Awareness & Financial Systems", exp: "8+ Years", students: "1,10,000+", selections: "3,200+", bio: "Former banking officer demystifying monetary policy, RBI circulars, and financial inclusion schemes.", px: "66.667%", py: "50%", quote: "Understand how the central bank steers liquidity, and monetary policy questions become effortless." },
    { name: "Manoj Kumar", subject: "Railways General Studies & Science", exp: "10+ Years", students: "1,30,000+", selections: "4,600+", bio: "Railways exam specialist who has mentored candidates through CBT-1 and CBT-2 across RRB NTPC and Group D.", px: "100%", py: "50%", quote: "RRB exams test speed and accuracy on NCERT science fundamentals. Consistency guarantees selection." },
    { name: "Deepak Sir", subject: "Engineering Mathematics", exp: "11+ Years", students: "95,000+", selections: "2,900+", bio: "M.Tech IIT Roorkee with deep expertise in calculus, linear algebra, and numerical methods for GATE.", px: "0%", py: "100%", quote: "Mathematics is the highest scoring section in engineering exams when solved methodically." },
    { name: "Ananya Ranjan", subject: "Physics & Mechanics", exp: "9+ Years", students: "85,000+", selections: "2,400+", bio: "Ph.D. in Physics mentoring aspirants for JEE Main, Advanced, and defence entrance examinations.", px: "33.333%", py: "100%", quote: "Draw the free-body diagram first. The correct equations will follow naturally." },
    { name: "Ashish Ranjan", subject: "General Science (Physics & Biology)", exp: "9+ Years", students: "1,15,000+", selections: "3,800+", bio: "Experienced educator translating NCERT science into high-yield memory maps and revision quizzes.", px: "66.667%", py: "100%", quote: "Everyday science phenomena are the core of competitive exam questions. Learn with real-world examples." },
    { name: "Kavita Ma’am", subject: "Chemistry & Organic Mechanisms", exp: "8+ Years", students: "80,000+", selections: "2,100+", bio: "Post-graduate in Chemistry specializing in periodic table trends, chemical kinetics, and metallurgy.", px: "100%", py: "100%", quote: "Understand electron movement, and organic reaction mechanisms become logical rather than memorized." }
  ];

  window.openFacultyProfile = index => {
    const educator = facultyDatabase[index] || facultyDatabase[0];
    let modal = document.getElementById('facultyModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'facultyModal';
      modal.className = 'modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.innerHTML = `
        <div class="modal-panel modal-panel-lg">
          <div class="modal-head">
            <h2>Faculty Profile</h2>
            <button class="modal-close-corner" data-modal-close aria-label="Close" title="Close">${icon('close')}</button>
          </div>
          <div id="facultyModalBody"></div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.querySelectorAll('[data-modal-close]').forEach(b => b.addEventListener('click', closeModal));
      modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    }

    const body = modal.querySelector('#facultyModalBody');
    if (body) {
      body.innerHTML = `
        <div class="faculty-modal-head">
          <div class="faculty-modal-avatar" style="background-position:${educator.px} ${educator.py}"></div>
          <div>
            <h3 style="margin:0 0 4px;font-size:1.3rem">${educator.name}</h3>
            <span class="faculty-subject" style="font-size:.85rem">${educator.subject}</span>
            <div class="stars" style="margin-top:4px" aria-label="5 out of 5 stars">★★★★★ <small style="color:var(--muted)">(4.9/5 from 8,400+ students)</small></div>
          </div>
        </div>
        <p style="font-size:.9rem;line-height:1.6">${educator.bio}</p>
        <blockquote style="margin:14px 0;padding:12px 16px;background:var(--surface-2);border-left:4px solid var(--blue-600);border-radius:6px;font-style:italic">
          “${educator.quote}”
        </blockquote>
        <div class="faculty-stat-grid">
          <div><strong>${educator.exp}</strong><span>Teaching Exp.</span></div>
          <div><strong>${educator.students}</strong><span>Aspirants Taught</span></div>
          <div><strong>${educator.selections}</strong><span>Final Selections</span></div>
        </div>
        <div style="margin-top:20px;display:flex;gap:10px;justify-content:flex-end">
          <button class="btn btn-primary btn-sm" id="closeFacultyModalBtn" data-modal-close type="button">Close Profile</button>
        </div>
      `;
      body.querySelectorAll('[data-modal-close]').forEach(b => {
        b.addEventListener('click', e => {
          e.preventDefault();
          closeModal();
        });
      });
    }

    modal.querySelectorAll('[data-modal-close]').forEach(b => {
      b.addEventListener('click', e => {
        e.preventDefault();
        closeModal();
      });
    });
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

    openModal('facultyModal');
  };

  document.querySelectorAll('.faculty-card').forEach((card, idx) => {
    const link = card.querySelector('.card-link');
    if (link) {
      link.addEventListener('click', e => {
        e.preventDefault();
        openFacultyProfile(idx);
      });
    }
  });

  /* ----------------------------------------------------
     11. Live Classroom Preview Simulator
  ---------------------------------------------------- */
  window.openLiveClassroom = (topic = 'Arithmetic Speed Drills', educator = 'Rahul Sir') => {
    let modal = document.getElementById('liveClassModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'liveClassModal';
      modal.className = 'modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.innerHTML = `
        <div class="modal-panel modal-panel-lg">
          <div class="modal-head">
            <h2>Live Interactive Classroom</h2>
            <button class="modal-close-corner" data-modal-close aria-label="Close" title="Close">${icon('close')}</button>
          </div>
          <div id="liveClassModalBody"></div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.querySelectorAll('[data-modal-close]').forEach(b => b.addEventListener('click', closeModal));
      modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    }

    const body = modal.querySelector('#liveClassModalBody');
    if (body) {
      body.innerHTML = `
        <div class="live-viewport">
          <span class="live-indicator"><span style="width:7px;height:7px;background:#fff;border-radius:50%;display:inline-block"></span> LIVE NOW</span>
          <span class="live-viewers">${icon('users')} 1,428 Aspirants Online</span>
          <div style="text-align:center">
            <span style="display:inline-grid;width:56px;height:56px;place-items:center;background:rgba(255,255,255,.2);border-radius:50%;margin-bottom:8px">
              ${icon('video', 'icon')}
            </span>
            <div style="font-size:1.1rem;font-weight:750">${topic}</div>
            <small style="opacity:.8">Conducted by ${educator} · ExamSuccess Prime</small>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr;gap:12px">
          <div>
            <h4 style="margin:0 0 6px;font-size:.85rem">Live Discussion &amp; Doubt Stream</h4>
            <div class="live-chat-wrap" id="simChatList">
              <div class="chat-msg"><b>Pooja S.:</b> Good evening sir! Ready for today's mock set.</div>
              <div class="chat-msg"><b>Karan M.:</b> Sir will we get today's formula PDF after the class?</div>
              <div class="chat-msg"><b>ExamSuccess Mentor:</b> Yes Karan, lecture notes will be uploaded to your Study Materials library.</div>
            </div>
            <form id="simChatForm" style="display:flex;gap:8px;margin-top:10px">
              <input class="field" id="simChatInput" placeholder="Ask a doubt or post an answer..." style="min-height:38px;padding:6px 12px;font-size:.82rem" required>
              <button class="btn btn-primary btn-sm" type="submit">Post</button>
            </form>
          </div>
        </div>
      `;

      const chatForm = body.querySelector('#simChatForm');
      const chatInput = body.querySelector('#simChatInput');
      const chatList = body.querySelector('#simChatList');
      chatForm?.addEventListener('submit', e => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        const msg = document.createElement('div');
        msg.className = 'chat-msg';
        msg.innerHTML = `<b>You:</b> ${text}`;
        chatList.appendChild(msg);
        chatInput.value = '';
        chatList.scrollTop = chatList.scrollHeight;

        setTimeout(() => {
          const reply = document.createElement('div');
          reply.className = 'chat-msg';
          reply.innerHTML = `<b>${educator} (Live):</b> Excellent point! Let's solve that exact variation in step 3.`;
          chatList.appendChild(reply);
          chatList.scrollTop = chatList.scrollHeight;
        }, 1200);
      });
    }

    openModal('liveClassModal');
  };

  document.querySelectorAll('button[onclick*="Joining the live"], button[onclick*="Demo classroom"]').forEach(btn => {
    btn.removeAttribute('onclick');
    btn.addEventListener('click', () => {
      const card = btn.closest('.class-card, .schedule-row');
      const topic = card?.querySelector('h3, b')?.textContent || 'Arithmetic Speed Drills';
      openLiveClassroom(topic);
    });
  });

  /* ----------------------------------------------------
     11.5 Full Interactive Syllabus Viewer Modal
  ---------------------------------------------------- */
  const SYLLABUS_DATA = {
    banking: {
      title: "Banking Exams (IBPS PO, SBI PO, RBI Grade B & Clerk)",
      badge: "Updated 2026–27 Pattern · Prelims + Mains",
      desc: "Detailed curriculum covering Quantitative Aptitude, Reasoning Ability, English Language, and Banking & Financial Awareness.",
      modules: [
        {
          name: "Quantitative Aptitude (Prelims: 35 Marks / Mains: 50 Marks)",
          topics: [
            "Simplification & Approximation (BODMAS, Surds & Indices, Decimals)",
            "Number Series (Missing & Wrong Number Series Patterns)",
            "Quadratic Equations & Polynomial Sign Method Comparisons",
            "Data Interpretation: Tables, Bar, Line, Pie, Radar, Mixed & Caselet DI",
            "Data Sufficiency & Quantity Comparisons (Q1 vs Q2)",
            "Arithmetic Core: Percentages, Profit & Loss, Ratio & Proportion, Averages",
            "Time & Work, Pipes & Cisterns, Work & Wages",
            "Speed, Time & Distance, Problems on Trains, Boats & Streams",
            "Simple & Compound Interest, Annual & Half-Yearly Installments",
            "Permutation, Combination & Probability",
            "Mensuration 2D (Area/Perimeter) & 3D (Volume/Surface Area)"
          ]
        },
        {
          name: "Reasoning Ability & Computer Aptitude (Prelims: 35 / Mains: 60 Marks)",
          topics: [
            "Linear Seating Arrangement (Single, Parallel Rows, Facing North/South)",
            "Circular & Polygonal Seating Arrangement (Inward/Outward facing)",
            "Complex Puzzles: Floor & Flat, Box Stacking, Month-Date & Day Scheduling",
            "Blood Relations with Multi-variable Profession & Generation Tree",
            "Syllogisms: Only a Few, Some Not, Possibility and Reverse Syllogisms",
            "Inequalities: Direct, Coded, and Reverse Inequalities",
            "Coding-Decoding: Chinese Substitution, Advance Symbol & Binary Logic",
            "Direction Sense & Distances with Shadows and Degrees",
            "Critical Reasoning: Assumptions, Statement & Argument, Course of Action"
          ]
        },
        {
          name: "English Language & Verbal Ability (Prelims: 30 / Mains: 40 Marks)",
          topics: [
            "Reading Comprehension (Banking, Editorial, Economic & Geopolitical Passages)",
            "Cloze Test (Advanced Double Fillers & Inverted Context)",
            "Error Detection & Phrase Replacement (Advanced Grammar Rules)",
            "Sentence Rearrangement, Para Jumbles & Theme Connectors",
            "Vocabulary: High-Frequency Exam Words, Idioms & Phrasal Verbs",
            "Descriptive English (Mains): Formal/Informal Letter Writing & Essay"
          ]
        },
        {
          name: "General, Banking & Financial Awareness (Mains: 40–50 Marks)",
          topics: [
            "RBI Monetary Policy, CRR, SLR, Repo, Reverse Repo & SDF",
            "Banking Regulation Act, Basel III Capital Adequacy, Priority Sector Lending",
            "Negotiable Instruments, Types of Cheques, Digital Payments (UPI, NEFT, RTGS)",
            "Union Budget 2026–27 & Economic Survey Highlights",
            "National & International Current Affairs (Last 6 Months)",
            "Static GK: National Parks, Wildlife Sanctuaries, Head Offices, Dams & Airports"
          ]
        }
      ]
    },
    ssc: {
      title: "SSC Exams (CGL, CHSL, MTS, CPO & GD Constable)",
      badge: "Tier 1 & Tier 2 Comprehensive Curriculum",
      desc: "Complete syllabus mapped to the official SSC scheme covering General Intelligence, Quantitative Aptitude, General Awareness, and English Comprehension.",
      modules: [
        {
          name: "Quantitative Aptitude & Advanced Mathematics (Tier 1: 50 / Tier 2: 90 Marks)",
          topics: [
            "Number Systems, Decimals, Fractions, HCF & LCM",
            "Percentages, Ratio & Proportion, Averages, Mixture & Alligation",
            "Profit, Loss, Discount, Simple & Compound Interest",
            "Time & Work, Pipes & Cisterns, Speed, Time & Distance",
            "Advanced Algebra: Identities, Factorization, Linear & Quadratic Equations",
            "Geometry: Triangles, Circles, Tangents, Chords, Quadrilaterals & Theorems",
            "Mensuration 2D & 3D: Cylinders, Cones, Spheres, Frustum & Prisms",
            "Trigonometry: Ratios, Standard Angles, Complementary Angles, Heights & Distances",
            "Elementary Statistics & Probability: Mean, Median, Mode, Variance, Standard Deviation"
          ]
        },
        {
          name: "General Intelligence & Reasoning (Tier 1: 50 / Tier 2: 60 Marks)",
          topics: [
            "Analogies: Semantic, Symbolic/Number & Figural Analogies",
            "Classification & Odd One Out across words, numbers and figures",
            "Series: Number, Letter, Continuous Pattern & Image Series",
            "Coding-Decoding & Mathematical Operator Interchanges",
            "Venn Diagrams, Syllogisms & Logical Deductions",
            "Blood Relations, Direction Sense, Ordering & Ranking",
            "Non-Verbal: Paper Folding, Cutting, Embedded Figures, Water & Mirror Images"
          ]
        },
        {
          name: "English Language & Comprehension (Tier 1: 50 / Tier 2: 135 Marks)",
          topics: [
            "Grammar Core: Tenses, Subject-Verb Agreement, Prepositions, Voice & Narration",
            "Vocabulary: Synonyms, Antonyms, One Word Substitution, Idioms & Phrases",
            "Sentence Correction, Spotting Errors & Fill in the Blanks",
            "Cloze Passage & Multi-Paragraph Reading Comprehension"
          ]
        },
        {
          name: "General Awareness & Static GK (Tier 1: 50 / Tier 2: 75 Marks)",
          topics: [
            "Indian History: Ancient, Medieval, Modern & Freedom Struggle",
            "Polity & Constitution: Fundamental Rights, Articles, Parliament, Judiciary",
            "Geography: Physical, Drainage, Climate, Soil, Minerals & Agriculture",
            "Economy: National Income, Five Year Plans, Taxation, Fiscal Policies",
            "General Science: Physics, Chemistry & Biology (Class 10 CBSE Standard)",
            "Art & Culture, Folk Dances, Festivals & Classical Music"
          ]
        }
      ]
    },
    railways: {
      title: "Railways Exams (RRB NTPC, Group D, ALP & Technician)",
      badge: "CBT-1 & CBT-2 Unified Pattern",
      desc: "Full syllabus covering Mathematics, General Intelligence, General Science, and General Awareness for Indian Railways.",
      modules: [
        {
          name: "Mathematics (CBT-1: 30 Marks / CBT-2: 35 Marks)",
          topics: [
            "Number System, Decimals, Fractions, LCM & HCF",
            "Ratio & Proportions, Percentage, Mensuration",
            "Time and Work, Time and Distance, Pipes & Cisterns",
            "Simple and Compound Interest, Profit and Loss",
            "Elementary Algebra, Basic Geometry and Elementary Trigonometry",
            "Elementary Statistics: Calculation of Mean, Median, Mode"
          ]
        },
        {
          name: "General Intelligence and Reasoning (CBT-1: 30 / CBT-2: 35 Marks)",
          topics: [
            "Analogies, Alphabetical and Number Series, Coding and Decoding",
            "Mathematical Operations, Relationships & Family Tree",
            "Syllogism, Jumbling, Venn Diagrams, Puzzle Solving",
            "Data Sufficiency, Statement-Conclusion and Decision Making",
            "Analytical Reasoning, Direction & Distance, Similarities and Differences"
          ]
        },
        {
          name: "General Science (Physics, Chemistry & Life Science - 25 Marks)",
          topics: [
            "Physics: Laws of Motion, Work, Energy, Power, Gravitation, Sound, Light",
            "Chemistry: Matter, Atomic Structure, Chemical Bonding, Acids & Bases",
            "Life Science: Cell Biology, Human Body Systems, Plant Physiology, Genetics"
          ]
        },
        {
          name: "General Awareness & Current Affairs (CBT-1: 40 / CBT-2: 50 Marks)",
          topics: [
            "Current Events of National and International Importance",
            "Indian Railways History, Zones, Divisions, Rolling Stock & Tech",
            "Indian Literature, Monuments, UNESCO Heritage Sites",
            "Indian Polity & Governance, Constitution & Amendments",
            "Environmental Issues, Science & Tech Innovations, ISRO Space Missions"
          ]
        }
      ]
    },
    engineering: {
      title: "Engineering Entrance (JEE Main, JEE Advanced & GATE)",
      badge: "Class 11 & 12 Complete Syllabus + Exam Shortcuts",
      desc: "Detailed modular topics across Physics, Chemistry, and Advanced Mathematics.",
      modules: [
        {
          name: "Physics (Mechanics, Electrodynamics & Modern Physics)",
          topics: [
            "Kinematics in 1D & 2D, Projectile Motion, Relative Velocity",
            "Newton’s Laws of Motion, Friction, Circular Motion",
            "Work, Energy, Power & Conservation Laws",
            "Center of Mass, Linear Momentum, Collisions, Rotational Dynamics",
            "Gravitation, Fluid Mechanics, Viscosity, Surface Tension",
            "Thermodynamics, Kinetic Theory of Gases, Heat Transfer",
            "Electrostatics, Gauss Law, Capacitance, Current Electricity",
            "Magnetism, Electromagnetic Induction, Alternating Current",
            "Optics (Ray & Wave Optics), Dual Nature of Matter, Nuclear Physics"
          ]
        },
        {
          name: "Chemistry (Physical, Inorganic & Organic Chemistry)",
          topics: [
            "Physical Chemistry: Mole Concept, Atomic Structure, Thermodynamics, Equilibrium, Solutions, Electrochemistry, Chemical Kinetics",
            "Inorganic Chemistry: Periodic Trends, Chemical Bonding, p-Block, d & f-Block Elements, Coordination Compounds",
            "Organic Chemistry: IUPAC, GOC Mechanisms, Hydrocarbons, Haloalkanes, Alcohols, Carbonyls, Amines & Biomolecules"
          ]
        },
        {
          name: "Mathematics (Algebra, Calculus, Coordinate Geometry & Vectors)",
          topics: [
            "Sets, Relations, Functions, Quadratic Equations, Complex Numbers",
            "Matrices, Determinants, Permutations, Combinations, Binomial Theorem",
            "Differential Calculus: Limits, Continuity, Derivatives & Applications",
            "Integral Calculus: Definite & Indefinite Integrals, Differential Equations, Area Under Curve",
            "Coordinate Geometry: Straight Lines, Circles, Parabola, Ellipse, Hyperbola",
            "Vector Algebra, Three-Dimensional Geometry, Probability & Statistics"
          ]
        }
      ]
    },
    teaching: {
      title: "Teaching Exams (CTET, State TETs, KVS, NVS & DSSSB)",
      badge: "Paper 1 & Paper 2 Comprehensive Pedagogy Curriculum",
      desc: "Child Development and Pedagogy, Language Proficiencies, and Subject Methodologies.",
      modules: [
        {
          name: "Child Development and Pedagogy (30 Marks)",
          topics: [
            "Concept of Development, Growth Principles & Heredity vs Environment",
            "Piaget, Kohlberg and Vygotsky Learning Theories & Constructivism",
            "Child-Centered and Progressive Education Frameworks",
            "Inclusive Education: Addressing Special Needs & Learning Disabilities",
            "Cognition, Emotion, Motivation and Learning Assessment"
          ]
        },
        {
          name: "Language I & II (English, Hindi & Regional Languages)",
          topics: [
            "Reading Comprehension (Unseen Passages & Poems)",
            "Contextual Grammar and Sentence Construction",
            "Language Pedagogy: Principles, Methods, Skills (LSRW)",
            "Remedial Teaching & Diagnostic Language Evaluation"
          ]
        },
        {
          name: "Mathematics & Science / Social Studies Pedagogy",
          topics: [
            "Curriculum Placement, Nature and Logical Thinking in Mathematics",
            "Scientific Method, Inquiry, Observation, Experimentation",
            "Social Sciences Content, Source Method, Project Work, CCE Evaluation"
          ]
        }
      ]
    },
    state: {
      title: "State PSC & Police Recruitment",
      badge: "Prelims & Mains General Studies Curriculum",
      desc: "State History, Geography, Polity, Administration, and Mental Ability.",
      modules: [
        {
          name: "State Specialization & General Studies",
          topics: [
            "State History, Freedom Movement, Culture, Festivals & Heritage",
            "Physical Geography of State: Rivers, Forests, Climate & Minerals",
            "State Polity: Governor, Chief Minister, Legislative Assembly, Panchayati Raj",
            "State Economy, Agriculture, Welfare Schemes & Annual Budget"
          ]
        },
        {
          name: "Mental Ability & General Aptitude",
          topics: [
            "Logical Reasoning, Syllogisms & Critical Thinking",
            "Quantitative Aptitude, Basic Numeracy & Data Interpretation",
            "Decision Making, Interpersonal Skills & Communication"
          ]
        }
      ]
    },
    defence: {
      title: "Defence Exams (NDA, CDS, AFCAT & CAPF)",
      badge: "Written Examination + SSB Guidance",
      desc: "Mathematics, General Ability Test (GAT), English, and Military Orientation.",
      modules: [
        {
          name: "Mathematics (Algebra, Trigonometry, Calculus & Vectors)",
          topics: [
            "Algebra: Sets, Relations, Matrices, Determinants, Progressions",
            "Trigonometry: Angles, Triangles, Inverse Functions, Heights & Distances",
            "Calculus: Limits, Derivatives, Integrals & Differential Equations",
            "Vector Algebra, 3D Geometry, Statistics & Probability"
          ]
        },
        {
          name: "General Ability Test (GAT - English, Science & Social Studies)",
          topics: [
            "English: Grammar, Vocabulary, Comprehension & Sentence Ordering",
            "General Science: Physics, Chemistry & Biology Daily Life Fundamentals",
            "Indian History, Freedom Struggle, Constitution, Geography & World Events",
            "Defence Services Knowledge & SSB Interview Orientation (OIR, PPDT, GTO)"
          ]
        }
      ]
    }
  };

  const ensureSyllabusModal = () => {
    let modal = document.getElementById('syllabusModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal';
      modal.id = 'syllabusModal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-hidden', 'true');
      modal.setAttribute('aria-labelledby', 'syllabusTitle');
      modal.innerHTML = `
        <div class="modal-panel modal-panel-lg">
          <div class="modal-head">
            <div>
              <span class="eyebrow" style="margin-bottom:3px;display:block">Exam Curriculum</span>
              <h2 id="syllabusTitle">Full Exam Syllabus</h2>
            </div>
            <button class="modal-close-corner" data-modal-close aria-label="Close" title="Close">${icon('close')}</button>
          </div>
          <div id="syllabusContainer"></div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.querySelectorAll('[data-modal-close]').forEach(b => b.addEventListener('click', closeModal));
      modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    }
    return modal;
  };

  const openSyllabus = (rawStream = 'banking') => {
    const stream = (rawStream || 'banking').toLowerCase().trim();
    const data = SYLLABUS_DATA[stream] || SYLLABUS_DATA.banking;
    const modal = ensureSyllabusModal();
    const titleEl = modal.querySelector('#syllabusTitle');
    const container = modal.querySelector('#syllabusContainer');

    if (titleEl) titleEl.textContent = data.title;
    if (container) {
      const isCoursePage = location.pathname.includes('courses.html');
      const targetHash = stream;

      container.innerHTML = `
        <div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:14px">
          <span class="course-badge highlight">${data.badge}</span>
          <span class="course-badge">100% Free Access</span>
          <span class="course-badge">Faculty Verified 2026–27</span>
        </div>
        <p style="font-size:.88rem;color:var(--muted);margin-bottom:18px;line-height:1.55">${data.desc}</p>
        
        <div class="syllabus-accordion">
          ${data.modules.map((m, idx) => `
            <div class="syllabus-card">
              <button class="syllabus-toggle" type="button" aria-expanded="true">
                <span>${m.name}</span>
                <span class="syllabus-count-pill">${m.topics.length} Core Topics</span>
              </button>
              <div class="syllabus-content">
                <ul>
                  ${m.topics.map(t => `<li>${t}</li>`).join('')}
                </ul>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="hero-actions" style="margin-top:22px;justify-content:space-between;flex-wrap:wrap;gap:12px">
          <button class="btn btn-outline" id="downloadSyllabusBtn">
            ${icon('download')} Download Syllabus PDF (Free)
          </button>
          <button class="btn btn-primary" id="viewCourseTrackBtn">
            View Enrolled Course Track ${icon('arrow')}
          </button>
        </div>
      `;

      // Accordion toggle behavior
      container.querySelectorAll('.syllabus-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
          const content = btn.nextElementSibling;
          const isHidden = content.style.display === 'none';
          content.style.display = isHidden ? '' : 'none';
          btn.setAttribute('aria-expanded', String(isHidden));
        });
      });

      // Download PDF button
      container.querySelector('#downloadSyllabusBtn')?.addEventListener('click', () => {
        const toast = document.createElement('div');
        toast.className = 'toast show';
        toast.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;background:var(--ink);color:#fff;padding:12px 20px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.3);display:flex;align-items:center;gap:8px;';
        toast.innerHTML = `${icon('check')} <span><strong>${data.title}</strong> syllabus downloaded successfully!</span>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
      });

      // View course track button
      container.querySelector('#viewCourseTrackBtn')?.addEventListener('click', () => {
        closeModal();
        if (isCoursePage) {
          const tabBtn = document.querySelector(`[data-course-filter="${targetHash}"]`);
          if (tabBtn) tabBtn.click();
          const targetCard = document.getElementById(targetHash);
          if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetCard.style.outline = '3px solid var(--blue-600)';
            targetCard.style.transition = 'outline .3s';
            setTimeout(() => targetCard.style.outline = '', 2500);
          }
        } else {
          location.href = `${base}pages/courses.html#${targetHash}`;
        }
      });
    }

    openModal('syllabusModal');
  };

  window.openSyllabus = openSyllabus;

  document.addEventListener('click', e => {
    const syllabusBtn = e.target.closest('[data-open-syllabus]');
    if (syllabusBtn) {
      e.preventDefault();
      const stream = syllabusBtn.dataset.openSyllabus || 'banking';
      openSyllabus(stream);
    }
  });

  /* ----------------------------------------------------
     12. Course Finder Quiz Modal
  ---------------------------------------------------- */
  const finderForm = document.querySelector('#finderModal form');
  if (finderForm) {
    finderForm.addEventListener('submit', e => {
      e.preventDefault();
      const goal = document.getElementById('goal')?.value || 'Banking';
      const timeline = document.getElementById('timeline')?.value || '3–6 months';
      const goalKey = goal.toLowerCase();
      const panel = document.querySelector('#finderModal .modal-panel');
      if (panel) {
        panel.innerHTML = `
          <div class="modal-head">
            <h2>Recommended for You</h2>
            <button class="icon-btn" data-modal-close aria-label="Close">${icon('close')}</button>
          </div>
          <div style="padding:10px 0">
            <span class="course-badge highlight">${goal} Preparation · Target: ${timeline}</span>
            <h3 style="margin:12px 0 6px">${goal} Foundation to Advanced Masterclass</h3>
            <p style="font-size:.85rem;color:var(--muted);margin-bottom:16px">
              Based on your selection, we recommend this comprehensive program covering syllabus, daily live classes, 120+ mock tests, and 1:1 doubt mentorship.
            </p>
            <div class="card" style="padding:14px;background:var(--surface-2);margin-bottom:16px;font-size:.84rem">
              <div>✓ Includes complete prelims + mains test series</div>
              <div>✓ Bi-lingual classes (Hindi + English) with PDF capsules</div>
              <div>✓ Regular performance diagnosis and AIR ranking</div>
            </div>
            <div class="hero-actions" style="justify-content:flex-end;gap:10px;flex-wrap:wrap">
              <button class="btn btn-outline" data-modal-close>Close</button>
              <button class="btn btn-primary" id="exploreSyllabusBtn">Explore Full Syllabus</button>
            </div>
          </div>
        `;
        panel.querySelectorAll('[data-modal-close]').forEach(b => b.addEventListener('click', closeModal));

        panel.querySelector('#exploreSyllabusBtn')?.addEventListener('click', () => {
          closeModal();
          setTimeout(() => {
            openSyllabus(goalKey);
          }, 150);
        });
      }
    });
  }

  /* ----------------------------------------------------
     13. Pricing Billing Switcher & Coupon Engine
  ---------------------------------------------------- */
  const billingBtns = document.querySelectorAll('[data-billing]');
  if (billingBtns.length) {
    const plans = {
      quarterly: { practice: '₹299', achiever: '₹1,199', excellence: '₹2,199', period: ' / 3 months' },
      annual: { practice: '₹499', achiever: '₹2,999', excellence: '₹3,999', period: ' / 12 months' },
      extended: { practice: '₹799', achiever: '₹3,899', excellence: '₹5,499', period: ' / 18 months' }
    };

    billingBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        billingBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.billing;
        const data = plans[mode] || plans.annual;

        const p1 = document.getElementById('pricePractice');
        const p2 = document.getElementById('priceAchiever');
        const p3 = document.getElementById('priceExcellence');
        if (p1) p1.innerHTML = `${data.practice}<small>${data.period}</small>`;
        if (p2) p2.innerHTML = `${data.achiever}<small>${data.period}</small>`;
        if (p3) p3.innerHTML = `${data.excellence}<small>${data.period}</small>`;
      });
    });

    document.getElementById('applyCouponBtn')?.addEventListener('click', () => {
      const input = document.getElementById('couponInput');
      const val = (input?.value || '').trim().toUpperCase();
      if (val === 'EXAM20' || val === 'SUCCESS20') {
        showToast('🎉 Coupon applied! Flat 20% discount activated on all plans.');
        document.querySelectorAll('.price').forEach(el => {
          const current = parseInt(el.textContent.replace(/[^\d]/g, ''), 10);
          if (current) {
            const discounted = Math.round(current * 0.8);
            el.innerHTML = `₹${discounted.toLocaleString('en-IN')}<small style="color:var(--green);font-weight:700"> (20% OFF applied)</small>`;
          }
        });
      } else {
        showToast('Invalid coupon. Try code "EXAM20" for 20% off.');
      }
    });
  }

  /* ----------------------------------------------------
     14. Accessible FAQ Accordion
  ---------------------------------------------------- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ----------------------------------------------------
     15. Form Validation & Password Strength
  ---------------------------------------------------- */
  const validateField = field => {
    let message = '';
    if (field.required && field.type === 'checkbox' && !field.checked) message = 'Please confirm this required option.';
    else if (field.required && !field.value.trim()) message = 'Please complete this field.';
    else if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) message = 'Enter a valid email address.';
    else if (field.type === 'tel' && field.value && !/^[+\d][\d\s-]{8,}$/.test(field.value)) message = 'Enter a valid 10-digit phone number.';
    else if (field.minLength > 0 && field.value.length < field.minLength) message = `Use at least ${field.minLength} characters.`;
    else if (field.dataset.match && field.value !== document.getElementById(field.dataset.match)?.value) message = 'Passwords do not match.';

    const error = field.closest('.form-row, .password-wrap')?.parentElement?.querySelector(`[data-error-for="${field.id}"]`) || document.querySelector(`[data-error-for="${field.id}"]`);
    field.setAttribute('aria-invalid', String(Boolean(message)));
    if (error) error.textContent = message;
    return !message;
  };

  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') validateField(field); });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const fields = [...form.querySelectorAll('input, select, textarea')].filter(f => f.type !== 'hidden');
      const valid = fields.map(validateField).every(Boolean);
      if (!valid) {
        form.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }
      const status = form.querySelector('[data-form-status]');
      if (status) {
        status.hidden = false;
        status.textContent = form.dataset.success || 'Thanks! Your information has been successfully received.';
      }
      if (form.dataset.redirect) {
        showToast('Success! Redirecting to your student dashboard…');
        setTimeout(() => { location.href = form.dataset.redirect; }, 600);
        return;
      }
      if (form.id === 'forgotPasswordForm') {
        showToast('Password reset link sent to your registered email.');
        setTimeout(() => {
          closeModal();
          form.reset();
          if (status) status.hidden = true;
        }, 2500);
        return;
      }
      form.reset();
    });
  });

  document.querySelectorAll('[data-password-toggle]').forEach(button => button.addEventListener('click', () => {
    const field = document.getElementById(button.dataset.passwordToggle);
    if (!field) return;
    field.type = field.type === 'password' ? 'text' : 'password';
    button.innerHTML = icon(field.type === 'password' ? 'eye' : 'close');
    button.setAttribute('aria-label', field.type === 'password' ? 'Show password' : 'Hide password');
  }));

  const signupPass = document.getElementById('signupPassword');
  if (signupPass) {
    const bar = document.querySelector('.strength-bar');
    const text = document.querySelector('.strength-text');
    signupPass.addEventListener('input', () => {
      const v = signupPass.value;
      let score = 0;
      if (v.length >= 8) score++;
      if (/[A-Z]/.test(v)) score++;
      if (/[0-9]/.test(v)) score++;
      if (/[^A-Za-z0-9]/.test(v)) score++;

      const widths = ['0%', '25%', '50%', '75%', '100%'];
      const colors = ['#e2e8f0', '#ef2b36', '#f07b00', '#3b82f6', '#16a34a'];
      const labels = ['Password strength', 'Weak password', 'Fair password', 'Good password', 'Strong password'];

      if (bar) {
        bar.style.width = widths[score];
        bar.style.backgroundColor = colors[score];
      }
      if (text) text.textContent = labels[score];
    });
  }

  /* ----------------------------------------------------
     16. Testimonial Carousel with Controls
  ---------------------------------------------------- */
  const testimonialTrack = document.querySelector('[data-testimonials]');
  if (testimonialTrack) {
    const slides = [...testimonialTrack.children];
    if (slides.length > 1) {
      let index = 0;
      let paused = false;
      testimonialTrack.addEventListener('mouseenter', () => paused = true);
      testimonialTrack.addEventListener('mouseleave', () => paused = false);

      setInterval(() => {
        if (paused) return;
        slides[index].hidden = true;
        index = (index + 1) % slides.length;
        slides[index].hidden = false;
      }, 5000);
    }
  }

  /* ----------------------------------------------------
     17. Toast & Modal Helpers
  ---------------------------------------------------- */
  window.showToast = message => {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3200);
  };

  window.openModal = id => {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    modal.querySelector('button:not(.icon-btn), [href], input')?.focus();
  };

  window.closeModal = () => {
    document.querySelectorAll('.modal.open').forEach(modal => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    });
    document.body.classList.remove('no-scroll');
    if (testState.timer) clearInterval(testState.timer);
  };

  window.startMockTest = startMockTest;

  document.querySelectorAll('[data-modal-open]').forEach(button => {
    button.addEventListener('click', e => {
      const targetId = button.dataset.modalOpen;
      if (targetId === 'freeTestModal') {
        e.preventDefault();
        startMockTest('Free All-India Quantitative & Reasoning Mock');
      } else {
        openModal(targetId);
      }
    });
  });

  // Global delegated click listener for all data-modal-close elements (covers dynamic content)
  document.addEventListener('click', e => {
    const closeBtn = e.target.closest('[data-modal-close]');
    if (closeBtn) {
      e.preventDefault();
      closeModal();
    }
  });

  document.querySelectorAll('.modal').forEach(modal => modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  }));

  // Home 2 Masterclass Filter Tabs
  document.querySelectorAll('[data-mc-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.mcFilter;
      document.querySelectorAll('[data-mc-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.masterclass-card').forEach(card => {
        if (filter === 'all' || card.dataset.stream === filter) {
          card.classList.remove('hidden-filter');
          card.style.display = '';
        } else {
          card.classList.add('hidden-filter');
          card.style.display = 'none';
        }
      });
    });
  });

  // Home 1: Interactive Study Strategy & Score Booster Calculator
  const initStrategyCalculator = () => {
    const calcCard = document.querySelector('.strategy-calculator-card');
    if (!calcCard) return;

    const streamData = {
      banking: {
        name: 'Banking (IBPS / SBI PO & Clerk)',
        baseProb: 92.5,
        baseCutoff: 24.5,
        targetHash: 'banking',
        advice: 'Focus on high-speed Data Interpretation and Arithmetic shortcuts first. Master 30-second sectional calculation techniques to secure a reliable 20+ mark safety margin over Prelims cutoff.'
      },
      ssc: {
        name: 'SSC (CGL / CHSL / CPO & Tier 1+2)',
        baseProb: 91.0,
        baseCutoff: 27.0,
        targetHash: 'ssc',
        advice: 'Prioritize Advanced Maths geometry/trigonometry traps and English cloze test drills. Consistent speed drills ensure 170+ score in CGL Tier 1.'
      },
      railways: {
        name: 'Railways (RRB NTPC, Group D & ALP)',
        baseProb: 93.8,
        baseCutoff: 22.0,
        targetHash: 'railways',
        advice: 'Double down on General Science numericals and statement-conclusion logic. Timed full-length CBT mocks build the endurance needed for CBT-1 & CBT-2.'
      },
      engineering: {
        name: 'Engineering (GATE & State CETs)',
        baseProb: 88.5,
        baseCutoff: 19.5,
        targetHash: 'engineering',
        advice: 'Core engineering subject weightage requires systematic concept revision alongside Engineering Maths & General Aptitude scoring drills.'
      },
      defence: {
        name: 'Defence (NDA, CDS & AFCAT + SSB)',
        baseProb: 90.2,
        baseCutoff: 25.0,
        targetHash: 'defence',
        advice: 'Balance General Ability Test (GAT) speed capsules with daily current affairs and Officer-Like Qualities (OLQ) psychological interview drills.'
      }
    };

    let activeStream = 'banking';
    let activeMonths = 6;
    let activeDailyHours = 4;

    const streamBtns = calcCard.querySelectorAll('.calc-pill');
    const timelineBtns = calcCard.querySelectorAll('.calc-btn');
    const hoursSlider = calcCard.querySelector('#dailyHoursSlider');
    const hoursDisplay = calcCard.querySelector('#hoursValDisplay');
    const streamLabel = calcCard.querySelector('#selectedStreamLabel');
    const timelineLabel = calcCard.querySelector('#selectedTimelineLabel');

    const probEl = calcCard.querySelector('#probPercent');
    const totalHoursEl = calcCard.querySelector('#statTotalHours');
    const mockCountEl = calcCard.querySelector('#statMockCount');
    const cutoffBufferEl = calcCard.querySelector('#statCutoffBuffer');
    const adviceEl = calcCard.querySelector('#strategyAdviceText');
    const exploreBtn = calcCard.querySelector('#calcExploreBatchesBtn');

    const recalculate = () => {
      const data = streamData[activeStream] || streamData.banking;

      const totalDays = activeMonths * 30;
      const totalHours = Math.round(totalDays * activeDailyHours * 0.85);
      const mockCount = Math.round(activeMonths * (8 + activeDailyHours * 3.5));
      const durationBonus = activeMonths === 12 ? 4.2 : activeMonths === 6 ? 2.5 : 0;
      const hoursBonus = (activeDailyHours - 2) * 1.6;
      const calculatedProb = Math.min(97.8, (data.baseProb + durationBonus + hoursBonus)).toFixed(1);
      const cutoffBuffer = (data.baseCutoff + (activeDailyHours * 1.2) + (activeMonths * 0.8)).toFixed(1);

      if (probEl) probEl.textContent = `${calculatedProb}%`;
      if (totalHoursEl) totalHoursEl.textContent = `${totalHours.toLocaleString()} hrs`;
      if (mockCountEl) mockCountEl.textContent = `${mockCount} Tests`;
      if (cutoffBufferEl) cutoffBufferEl.textContent = `+${cutoffBuffer} Marks`;
      if (adviceEl) adviceEl.textContent = data.advice;
      if (exploreBtn) exploreBtn.href = `${base}pages/courses.html#${data.targetHash}`;
    };

    streamBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        streamBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        activeStream = btn.dataset.stream || 'banking';
        if (streamLabel) streamLabel.textContent = streamData[activeStream]?.name || '';
        recalculate();
      });
    });

    timelineBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        timelineBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        activeMonths = parseInt(btn.dataset.months, 10) || 6;
        if (timelineLabel) {
          const mText = activeMonths === 3 ? '90 Days (High-Speed Crash)' : activeMonths === 6 ? '6 Months (Intensive Track)' : '12 Months (Comprehensive Foundation)';
          timelineLabel.textContent = mText;
        }
        recalculate();
      });
    });

    if (hoursSlider) {
      hoursSlider.addEventListener('input', (e) => {
        activeDailyHours = parseInt(e.target.value, 10) || 4;
        if (hoursDisplay) hoursDisplay.textContent = `${activeDailyHours} Hours / Day`;
        recalculate();
      });
    }

    recalculate();
  };

  initStrategyCalculator();

  // Home 1: Daily High-Yield Aspirant Hub & Live Exam Radar
  const initDailyHub = () => {
    const hub = document.getElementById('daily-hub');
    if (!hub) return;

    // Daily Speed Drill Questions Archive
    const drillQuestions = [
      {
        category: 'Quantitative Aptitude',
        difficulty: '★★☆ Moderate (SBI PO Level)',
        question: 'A train 240 m long passes a pole in 16 seconds and passes a platform in 36 seconds. What is the length of the platform?',
        options: ['280 m', '300 m', '320 m', '360 m'],
        correct: 1, // 300 m
        solution: 'Speed = 240 m / 16 s = 15 m/s. In 36 s, total distance = 15 × 36 = 540 m. Platform length = 540 - 240 = <strong>300 m</strong> (Option B). Shortcut: Ratio 16 : (36 - 16) = 16 : 20 = 4 : 5. Length = (240 / 4) × 5 = 300 m.',
        peerStat: '<strong>78.4%</strong> of aspirants solved this correctly in 32s average.'
      },
      {
        category: 'Logical Reasoning',
        difficulty: '★★★ High Yield (SSC CGL Tier 2)',
        question: 'Statements: All Bankers are Planners. Some Planners are Analysts. Conclusion I: Some Bankers are Analysts. Conclusion II: Some Planners are Bankers.',
        options: ['Only Conclusion I follows', 'Only Conclusion II follows', 'Both I and II follow', 'Neither I nor II follows'],
        correct: 1, // Only II follows
        solution: 'All Bankers are Planners implies conversion: Some Planners are Bankers (Conclusion II definitely follows). Since Middle Term "Planners" is not distributed in both premises, no definite relation exists between Bankers and Analysts. Thus, <strong>Only Conclusion II follows</strong>.',
        peerStat: '<strong>82.1%</strong> of aspirants solved this correctly in 24s average.'
      },
      {
        category: 'English Language',
        difficulty: '★★☆ Vocabulary (IBPS & RRB)',
        question: 'Choose the most appropriate antonym for the word: "EPHEMERAL".',
        options: ['Transitory', 'Perpetual', 'Fleeting', 'Transient'],
        correct: 1, // Perpetual
        solution: 'Ephemeral means lasting for a very short time (synonyms: transitory, fleeting, transient). Its exact opposite / antonym is <strong>Perpetual</strong> (meaning never-ending or enduring).',
        peerStat: '<strong>89.6%</strong> of aspirants solved this correctly in 18s average.'
      }
    ];

    let currentQIdx = 0;
    let timerInterval = null;
    let secondsRemaining = 58;

    const catBadge = hub.querySelector('#drillCategoryBadge');
    const qText = hub.querySelector('#drillQuestionText');
    const optionsWrap = hub.querySelector('#drillOptionsWrap');
    const feedbackBox = hub.querySelector('#drillFeedbackBox');
    const feedbackStatus = hub.querySelector('#feedbackStatus');
    const solutionText = hub.querySelector('#drillSolutionText');
    const peerStatText = hub.querySelector('.drill-peer-stat span');
    const nextBtn = hub.querySelector('#nextDrillBtn');
    const timerText = hub.querySelector('#drillTimerText');
    const downloadBtn = hub.querySelector('#downloadDailyCapsuleBtn');

    const updateTimerDisplay = () => {
      if (timerText) {
        const secStr = secondsRemaining < 10 ? `0${secondsRemaining}` : `${secondsRemaining}`;
        timerText.textContent = `00:${secStr}`;
      }
    };

    const handleOptionClick = (selectedBtn, q) => {
      if (timerInterval) clearInterval(timerInterval);
      const chosenIdx = parseInt(selectedBtn.dataset.opt, 10);
      const allBtns = optionsWrap.querySelectorAll('.drill-opt-btn');
      allBtns.forEach(b => b.disabled = true);

      if (chosenIdx === q.correct) {
        selectedBtn.classList.add('correct');
        if (feedbackStatus) {
          feedbackStatus.className = 'feedback-status correct';
          feedbackStatus.innerHTML = `${icon('check')} Correct Answer! Great speed.`;
        }
      } else {
        selectedBtn.classList.add('wrong');
        const correctBtn = optionsWrap.querySelector(`[data-opt="${q.correct}"]`);
        if (correctBtn) correctBtn.classList.add('correct');
        if (feedbackStatus) {
          feedbackStatus.className = 'feedback-status wrong';
          feedbackStatus.innerHTML = `${icon('close')} Incorrect. Keep practicing!`;
        }
      }

      if (feedbackBox) feedbackBox.hidden = false;
    };

    const handleTimeUp = (q) => {
      const allBtns = optionsWrap.querySelectorAll('.drill-opt-btn');
      allBtns.forEach(b => b.disabled = true);
      const correctBtn = optionsWrap.querySelector(`[data-opt="${q.correct}"]`);
      if (correctBtn) correctBtn.classList.add('correct');
      if (feedbackStatus) {
        feedbackStatus.className = 'feedback-status wrong';
        feedbackStatus.innerHTML = `${icon('clock')} Time's Up! Here is the correct solution.`;
      }
      if (feedbackBox) feedbackBox.hidden = false;
    };

    const renderQuestion = (idx) => {
      const q = drillQuestions[idx];
      if (!q) return;

      if (catBadge) catBadge.textContent = q.category;
      if (qText) qText.textContent = q.question;
      if (solutionText) solutionText.innerHTML = q.solution;
      if (peerStatText) peerStatText.innerHTML = q.peerStat;
      if (feedbackBox) feedbackBox.hidden = true;

      // Render options
      if (optionsWrap) {
        optionsWrap.innerHTML = q.options.map((opt, i) => `
          <button type="button" class="drill-opt-btn" data-opt="${i}">
            <span class="opt-prefix">${String.fromCharCode(65 + i)}</span>
            <span class="opt-text">${opt}</span>
          </button>
        `).join('');

        optionsWrap.querySelectorAll('.drill-opt-btn').forEach(btn => {
          btn.addEventListener('click', () => handleOptionClick(btn, q));
        });
      }

      // Reset & restart timer
      if (timerInterval) clearInterval(timerInterval);
      secondsRemaining = 60;
      updateTimerDisplay();
      timerInterval = setInterval(() => {
        if (secondsRemaining > 0) {
          secondsRemaining--;
          updateTimerDisplay();
        } else {
          clearInterval(timerInterval);
          handleTimeUp(q);
        }
      }, 1000);
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentQIdx = (currentQIdx + 1) % drillQuestions.length;
        renderQuestion(currentQIdx);
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        if (window.showToast) {
          window.showToast('📥 Downloading Today\'s 2-Page Current Affairs Capsule (PDF)...');
        }
      });
    }

    renderQuestion(0);
  };

  initDailyHub();

  /* ====================================================
     Faculty Page: Pedagogy & 1-on-1 Mentorship Booking
     ==================================================== */
  const initFacultyBooking = () => {
    const bookingForm = document.getElementById('mentorBookingForm');
    if (!bookingForm) return;

    let selectedSlot = 'Today 05:00 PM';
    const chips = bookingForm.querySelectorAll('.slot-chip');

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-checked', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-checked', 'true');
        selectedSlot = chip.dataset.slot || chip.textContent.trim();
      });
    });

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('mentorStudentName');
      const phoneInput = document.getElementById('mentorStudentPhone');
      const streamSelect = document.getElementById('mentorStreamSelect');
      const focusSelect = document.getElementById('mentorFocusSelect');

      const name = nameInput ? nameInput.value.trim() : 'Learner';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const stream = streamSelect ? streamSelect.value : 'General';
      const focus = focusSelect ? focusSelect.value : 'Strategy';

      if (!phone || phone.length < 10) {
        if (window.showToast) {
          window.showToast('⚠️ Please provide a valid 10-digit mobile number.');
        }
        return;
      }

      if (window.showToast) {
        window.showToast(`🎉 Mentorship call confirmed for ${name}! Slot: ${selectedSlot} (${stream} - ${focus}). Senior educator will call you at ${phone}.`);
      }

      bookingForm.reset();
      // Reset chips to first one active
      chips.forEach((c, idx) => {
        if (idx === 0) {
          c.classList.add('active');
          c.setAttribute('aria-checked', 'true');
          selectedSlot = c.dataset.slot || c.textContent.trim();
        } else {
          c.classList.remove('active');
          c.setAttribute('aria-checked', 'false');
        }
      });
    });
  };

  initFacultyBooking();

  /* ====================================================
     Results Page: Cut-off Benchmark Analyzer & Predictor
     ==================================================== */
  const initResultsCutoffAnalyzer = () => {
    const selectorWrap = document.querySelector('.cutoff-exam-selector');
    if (!selectorWrap) return;

    const CUTOFF_DATA = {
      'sbi-po': {
        title: 'SBI PO Prelims (Total: 100 Marks)',
        meta: 'Official Normalised Qualifying Marks (2024 Cycle)',
        trend: '▲ +1.50 vs 2023',
        maxScore: 100,
        cutoffs: { UR: 59.50, OBC: 58.25, EWS: 59.50, SC: 53.00, ST: 47.50 },
        safeTargets: { UR: '68+', OBC: '66+', EWS: '67+', SC: '60+', ST: '55+' },
        sections: [
          { name: 'Quantitative Aptitude (35 M)', cutoff: 18.5, ranker: 31.5, max: 35 },
          { name: 'Reasoning Ability (35 M)', cutoff: 20.0, ranker: 33.0, max: 35 },
          { name: 'English Language (30 M)', cutoff: 16.0, ranker: 26.5, max: 30 }
        ]
      },
      'ssc-cgl': {
        title: 'SSC CGL Tier-1 (Total: 200 Marks)',
        meta: 'Official Normalised Qualifying Marks (2024 Cycle)',
        trend: '▲ +3.25 vs 2023',
        maxScore: 200,
        cutoffs: { UR: 148.50, OBC: 145.75, EWS: 143.00, SC: 126.50, ST: 118.00 },
        safeTargets: { UR: '160+', OBC: '158+', EWS: '155+', SC: '138+', ST: '130+' },
        sections: [
          { name: 'General Intelligence & Reasoning (50 M)', cutoff: 36.0, ranker: 47.5, max: 50 },
          { name: 'Quantitative Aptitude (50 M)', cutoff: 34.5, ranker: 46.0, max: 50 },
          { name: 'English Comprehension (50 M)', cutoff: 38.0, ranker: 48.0, max: 50 }
        ]
      },
      'rrb-ntpc': {
        title: 'RRB NTPC CBT-1 (Total: 100 Marks)',
        meta: 'Official Normalised Qualifying Marks (CEN 01 Cycle)',
        trend: '▼ -1.20 vs Previous',
        maxScore: 100,
        cutoffs: { UR: 71.00, OBC: 68.50, EWS: 65.00, SC: 61.50, ST: 54.00 },
        safeTargets: { UR: '80+', OBC: '77+', EWS: '74+', SC: '70+', ST: '64+' },
        sections: [
          { name: 'General Awareness (40 M)', cutoff: 25.0, ranker: 36.0, max: 40 },
          { name: 'Mathematics (30 M)', cutoff: 23.5, ranker: 29.0, max: 30 },
          { name: 'General Intelligence & Reasoning (30 M)', cutoff: 22.5, ranker: 28.5, max: 30 }
        ]
      },
      'ibps-po': {
        title: 'IBPS PO Prelims (Total: 100 Marks)',
        meta: 'Official Normalised Qualifying Marks (CRP PO/MT-XIII)',
        trend: '▲ +0.75 vs 2023',
        maxScore: 100,
        cutoffs: { UR: 54.25, OBC: 54.25, EWS: 54.25, SC: 49.00, ST: 43.00 },
        safeTargets: { UR: '63+', OBC: '63+', EWS: '63+', SC: '57+', ST: '51+' },
        sections: [
          { name: 'Quantitative Aptitude (35 M)', cutoff: 16.5, ranker: 30.0, max: 35 },
          { name: 'Reasoning Ability (35 M)', cutoff: 18.0, ranker: 32.5, max: 35 },
          { name: 'English Language (30 M)', cutoff: 15.5, ranker: 26.0, max: 30 }
        ]
      }
    };

    const examTitle = document.getElementById('cutoffExamTitle');
    const examMeta = document.getElementById('cutoffExamMeta');
    const trendBadge = document.getElementById('cutoffTrendBadge');
    const catGrid = document.getElementById('categoryCutoffGrid');
    const benchmarkBars = document.getElementById('benchmarkBars');

    const updateDisplay = (examKey) => {
      const data = CUTOFF_DATA[examKey];
      if (!data) return;

      if (examTitle) examTitle.textContent = data.title;
      if (examMeta) examMeta.textContent = data.meta;
      if (trendBadge) trendBadge.textContent = data.trend;

      if (catGrid) {
        catGrid.innerHTML = Object.keys(data.cutoffs).map(cat => `
          <div class="cat-cutoff-pill">
            <span class="cat-name">${cat === 'UR' ? 'General (UR)' : cat}</span>
            <strong class="cat-score">${data.cutoffs[cat].toFixed(2)}</strong>
            <small class="cat-sub">Safe Target: ${data.safeTargets[cat]}</small>
          </div>
        `).join('');
      }

      if (benchmarkBars) {
        benchmarkBars.innerHTML = data.sections.map(sec => {
          const cutPct = Math.round((sec.cutoff / sec.max) * 100);
          const rnkPct = Math.round((sec.ranker / sec.max) * 100);
          return `
            <div class="benchmark-item">
              <div class="benchmark-label-row">
                <span>${sec.name}</span>
                <span>Cutoff: <b>${sec.cutoff}</b> | Rankers: <b class="accent">${sec.ranker}</b></span>
              </div>
              <div class="benchmark-track">
                <div class="benchmark-fill cutoff-fill" style="width: ${cutPct}%;" title="Cutoff: ${sec.cutoff}/${sec.max}"></div>
                <div class="benchmark-fill ranker-fill" style="width: ${rnkPct}%;" title="Ranker Avg: ${sec.ranker}/${sec.max}"></div>
              </div>
            </div>
          `;
        }).join('');
      }
    };

    const tabs = selectorWrap.querySelectorAll('.cutoff-exam-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const exam = tab.dataset.exam;
        updateDisplay(exam);

        // Also sync the predictor form dropdown
        const evalSelect = document.getElementById('evalExamSelect');
        if (evalSelect && evalSelect.value !== exam) {
          evalSelect.value = exam;
        }
      });
    });

    // Mock Predictor Form Handler
    const predictorForm = document.getElementById('mockPredictorForm');
    const resultBox = document.getElementById('evalResultBox');
    const resetBtn = document.getElementById('evalResetBtn');

    if (predictorForm) {
      predictorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const examSelect = document.getElementById('evalExamSelect');
        const catSelect = document.getElementById('evalCategorySelect');
        const scoreInput = document.getElementById('evalUserScore');

        const exam = examSelect ? examSelect.value : 'sbi-po';
        const cat = catSelect ? catSelect.value : 'UR';
        const score = scoreInput ? parseFloat(scoreInput.value) : 0;

        const data = CUTOFF_DATA[exam];
        if (!data) return;

        const cutoff = data.cutoffs[cat] || data.cutoffs['UR'];
        const margin = score - cutoff;

        const verdictBadge = document.getElementById('evalVerdictBadge');
        const percentileText = document.getElementById('evalPercentileText');
        const marginVal = document.getElementById('evalMarginVal');
        const marginDesc = document.getElementById('evalMarginDesc');
        const adviceText = document.getElementById('evalAdviceText');

        if (verdictBadge && percentileText && marginVal && marginDesc && adviceText) {
          verdictBadge.className = 'eval-verdict-badge';

          if (margin >= 8) {
            verdictBadge.classList.add('safe');
            verdictBadge.textContent = 'High Qualifying Probability';
            percentileText.textContent = '~97.8th Percentile';
            marginVal.textContent = `+${margin.toFixed(2)} Marks`;
            marginVal.style.color = '#047857';
            marginDesc.textContent = `Comfortable safety cushion above ${cat} cutoff (${cutoff.toFixed(2)})`;
            adviceText.textContent = 'Outstanding performance! You are performing in the top decile. Focus on sectional revision and full-length Mains mocks.';
          } else if (margin >= 0) {
            verdictBadge.classList.add('moderate');
            verdictBadge.textContent = 'Qualifying Zone (Moderate Margin)';
            percentileText.textContent = '~91.4th Percentile';
            marginVal.textContent = `+${margin.toFixed(2)} Marks`;
            marginVal.style.color = '#b45309';
            marginDesc.textContent = `Within qualifying threshold above ${cat} cutoff (${cutoff.toFixed(2)})`;
            adviceText.textContent = 'You clear the cutoff, but borderline normalization could be risky. Target +5 more marks by cutting negative guesses in English or Quant.';
          } else {
            verdictBadge.classList.add('risk');
            verdictBadge.textContent = 'Needs Strategic Improvement';
            percentileText.textContent = '~74.2th Percentile';
            marginVal.textContent = `${margin.toFixed(2)} Marks`;
            marginVal.style.color = '#dc2626';
            marginDesc.textContent = `Score deficit relative to ${cat} cutoff (${cutoff.toFixed(2)})`;
            adviceText.textContent = 'Score is currently below qualifying benchmark. Focus on high-frequency question patterns and take sectional diagnostic drills to plug weak spots.';
          }
        }

        if (resultBox) {
          resultBox.style.display = 'flex';
          resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    }

    if (resetBtn && resultBox) {
      resetBtn.addEventListener('click', () => {
        resultBox.style.display = 'none';
        const scoreInput = document.getElementById('evalUserScore');
        if (scoreInput) {
          scoreInput.value = '';
          scoreInput.focus();
        }
      });
    }
  };

  /* ====================================================
     Results Page: Searchable Verified Selection Registry
     ==================================================== */
  const initResultsRegistrySearch = () => {
    const searchInput = document.getElementById('registrySearchInput');
    const tableBody = document.getElementById('registryTableBody');
    const filterChips = document.querySelectorAll('.reg-chip');
    const emptyState = document.getElementById('registryEmptyState');
    const gazetteBtn = document.getElementById('downloadMeritGazetteBtn');

    if (!tableBody) return;

    let activeStream = 'all';
    let searchQuery = '';

    const filterRows = () => {
      const rows = tableBody.querySelectorAll('tr');
      let matchCount = 0;

      rows.forEach(row => {
        const streamMatch = activeStream === 'all' || row.dataset.stream === activeStream;
        const keywords = (row.dataset.keywords || '') + ' ' + row.textContent.toLowerCase();
        const textMatch = !searchQuery || keywords.includes(searchQuery);

        const visible = streamMatch && textMatch;
        row.style.display = visible ? '' : 'none';
        if (visible) matchCount++;
      });

      if (emptyState) {
        emptyState.style.display = matchCount === 0 ? 'block' : 'none';
      }
    };

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        searchQuery = searchInput.value.trim().toLowerCase();
        filterRows();
      });
    }

    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-checked', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-checked', 'true');
        activeStream = chip.dataset.stream || 'all';
        filterRows();
      });
    });

    if (gazetteBtn) {
      gazetteBtn.addEventListener('click', () => {
        if (window.showToast) {
          window.showToast('📥 Downloading ExamSuccess 2024–25 Verified Selection Gazette (PDF)...');
        }
      });
    }
  };

  const initWeightageTabs = () => {
    const tabButtons = document.querySelectorAll('.weightage-tab-btn');
    if (!tabButtons.length) return;

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.weightageTab;
        if (!targetId) return;

        tabButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        document.querySelectorAll('.weightage-panel').forEach(panel => {
          panel.classList.remove('active');
          panel.hidden = true;
        });

        const targetPanel = document.getElementById(`panel-${targetId}`);
        if (targetPanel) {
          targetPanel.classList.add('active');
          targetPanel.hidden = false;
        }
      });
    });
  };

  const initGlobalDownloads = () => {
    document.addEventListener('click', e => {
      const downloadBtn = e.target.closest('[data-download]');
      if (downloadBtn) {
        const item = downloadBtn.dataset.download || 'Study Material';
        if (window.showToast) {
          window.showToast(`📥 Downloading ${item}... Document will open shortly.`);
        }
      }
    });
  };

  initResultsCutoffAnalyzer();
  initResultsRegistrySearch();
  initWeightageTabs();
  initGlobalDownloads();

})();


