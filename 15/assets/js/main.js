(() => {
  'use strict';

  const root = document.documentElement;
  const page = document.body.dataset.page || 'home';
  const inPages = location.pathname.includes('/pages/');
  const base = inPages ? '../' : '';

  const favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.href = `${base}assets/images/favicon.svg`;
  favicon.type = 'image/svg+xml';
  document.head.appendChild(favicon);

  const storedTheme = localStorage.getItem('solarnest-theme');
  const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = storedTheme || (preferredDark ? 'dark' : 'light');
  root.dir = localStorage.getItem('solarnest-direction') || 'ltr';

  const brand = `
    <a class="brand" href="${base}index.html" aria-label="SolarNest home">
      <span class="brand-mark" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" class="brand-svg" width="38" height="38" fill="none">
          <defs>
            <linearGradient id="sn-sun-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FFBD22"/>
              <stop offset="100%" stop-color="#FF7A00"/>
            </linearGradient>
            <linearGradient id="sn-panel-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#1E78C2"/>
              <stop offset="100%" stop-color="#0E4273"/>
            </linearGradient>
            <linearGradient id="sn-leaf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#55D85C"/>
              <stop offset="100%" stop-color="#248A3D"/>
            </linearGradient>
          </defs>
          <circle cx="22" cy="15" r="7.5" fill="url(#sn-sun-grad)"/>
          <g stroke="#FFBD22" stroke-width="1.8" stroke-linecap="round" opacity="0.9">
            <line x1="22" y1="3" x2="22" y2="6"/>
            <line x1="22" y1="24" x2="22" y2="26"/>
            <line x1="10" y1="15" x2="13" y2="15"/>
            <line x1="31" y1="15" x2="34" y2="15"/>
            <line x1="13.5" y1="6.5" x2="15.5" y2="8.5"/>
            <line x1="28.5" y1="21.5" x2="30.5" y2="23.5"/>
            <line x1="30.5" y1="6.5" x2="28.5" y2="8.5"/>
            <line x1="15.5" y1="21.5" x2="13.5" y2="23.5"/>
          </g>
          <path d="M7 35 L22 21 L37 35 L31 36 L22 26 L13 36 Z" fill="url(#sn-panel-grad)"/>
          <path d="M15 29 L29 29 M18 25 L26 25 M22 22 L22 33" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round" opacity="0.85"/>
          <path d="M5 36 C 10 40, 17 41.5, 24 39.5 C 32 37.5, 37 30, 39 23 C 39 29, 34 38, 25 41 C 17 42.5, 9 40.5, 5 36 Z" fill="url(#sn-leaf-grad)"/>
        </svg>
      </span>
      <span class="brand-text-wrap"><span class="brand-name" dir="ltr"><span class="solar">Solar</span><span class="nest">Nest</span></span><small class="brand-tagline">Clean Energy, Bright Future</small></span>
    </a>`;

  const currentPath = location.pathname;
  const isHome2Active = currentPath.endsWith('index1.html') || page === 'home-2';
  const isHome1Active = !isHome2Active && (page === 'home' || page === 'home-1' || currentPath.endsWith('index.html') || currentPath.endsWith('/'));
  const isHomeActive = isHome1Active || isHome2Active;

  const pagesGroup = ['faq', 'coming-soon', '404', 'privacy', 'terms'];
  const isPagesActive = pagesGroup.includes(page) ||
    currentPath.includes('faq.html') ||
    currentPath.includes('coming-soon.html') ||
    currentPath.includes('404.html') ||
    currentPath.includes('privacy.html') ||
    currentPath.includes('terms.html');

  const headerMount = document.querySelector('#site-header');
  if (headerMount) {
    headerMount.innerHTML = `
      <a class="skip-link" href="#main-content">Skip to content</a>
      <header class="site-header" data-header>
        <div class="container header-inner">
          ${brand}
          <nav class="primary-nav" id="primary-nav" aria-label="Primary navigation">
            <div class="nav-item has-dropdown ${isHomeActive ? 'active' : ''}">
              <button class="nav-link dropdown-toggle ${isHomeActive ? 'active' : ''}" type="button" aria-expanded="false" aria-haspopup="true">
                <span>Home</span>
                <i data-lucide="chevron-down" class="dropdown-chevron"></i>
              </button>
              <div class="dropdown-menu" role="menu">
                <a href="${base}index.html" class="dropdown-item ${isHome1Active ? 'active' : ''}" role="menuitem">Home 1</a>
                <a href="${base}index1.html" class="dropdown-item ${isHome2Active ? 'active' : ''}" role="menuitem">Home 2</a>
              </div>
            </div>
            <a href="${base}pages/about.html" class="nav-link ${page === 'about' ? 'active' : ''}" ${page === 'about' ? 'aria-current="page"' : ''}>About Us</a>
            <a href="${base}pages/products.html" class="nav-link ${page === 'products' ? 'active' : ''}" ${page === 'products' ? 'aria-current="page"' : ''}>Products</a>
            <a href="${base}pages/calculator.html" class="nav-link ${page === 'calculator' ? 'active' : ''}" ${page === 'calculator' ? 'aria-current="page"' : ''}><span class="nav-label-full">Solar Savings Calculator</span><span class="nav-label-short">Savings Calculator</span></a>
            <a href="${base}pages/how-it-works.html" class="nav-link ${page === 'how' ? 'active' : ''}" ${page === 'how' ? 'aria-current="page"' : ''}>How It Works</a>
            <a href="${base}pages/projects.html" class="nav-link ${page === 'projects' ? 'active' : ''}" ${page === 'projects' ? 'aria-current="page"' : ''}>Projects</a>
            <a href="${base}pages/contact.html" class="nav-link ${page === 'contact' ? 'active' : ''}" ${page === 'contact' ? 'aria-current="page"' : ''}>Contact</a>
            <div class="nav-item has-dropdown ${isPagesActive ? 'active' : ''}">
              <button class="nav-link dropdown-toggle ${isPagesActive ? 'active' : ''}" type="button" aria-expanded="false" aria-haspopup="true">
                <span>Pages</span>
                <i data-lucide="chevron-down" class="dropdown-chevron"></i>
              </button>
              <div class="dropdown-menu" role="menu">
                <a href="${base}pages/faq.html" class="dropdown-item ${page === 'faq' ? 'active' : ''}" role="menuitem">FAQ</a>
                <a href="${base}pages/coming-soon.html" class="dropdown-item ${page === 'coming-soon' ? 'active' : ''}" role="menuitem">Coming Soon</a>
                <a href="${base}pages/404.html" class="dropdown-item ${page === '404' ? 'active' : ''}" role="menuitem">404</a>
                <a href="${base}pages/privacy.html" class="dropdown-item ${page === 'privacy' ? 'active' : ''}" role="menuitem">Privacy Policy</a>
                <a href="${base}pages/terms.html" class="dropdown-item ${page === 'terms' ? 'active' : ''}" role="menuitem">Terms &amp; Conditions</a>
              </div>
            </div>
            <a class="btn nav-cta" href="${base}pages/contact.html#booking"><i data-lucide="calendar-check"></i> Book Site Assessment</a>
          </nav>
          <div class="header-actions">
            <button class="icon-button" type="button" data-theme-toggle aria-label="Switch color theme" title="Switch color theme"><i data-lucide="moon"></i></button>
            <button class="icon-button rtl-toggle" type="button" data-rtl-toggle aria-label="Toggle right-to-left layout" title="Toggle RTL layout"><span class="rtl-label">RTL</span></button>
            <a class="btn btn-sm header-cta" href="${base}pages/contact.html#booking"><i data-lucide="calendar-check"></i> <span class="cta-label-full">Book Site Assessment</span><span class="cta-label-short">Site Assessment</span></a>
            <button class="icon-button menu-toggle" type="button" data-menu-toggle aria-label="Open navigation" aria-controls="primary-nav" aria-expanded="false"><i data-lucide="menu"></i></button>
          </div>
        </div>
      </header>`;
  }

  const footerMount = document.querySelector('#site-footer');
  if (footerMount) {
    footerMount.innerHTML = `
      <footer class="site-footer">
        <div class="container footer-main">
          <div class="footer-intro">
            ${brand}
            <p>Helping Indian homes unlock lower electricity bills with dependable rooftop solar.</p>
            <div class="socials" style="margin-top:16px">
              <a href="https://facebook.com/solarnest" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i data-lucide="facebook"></i></a>
              <a href="https://instagram.com/solarnest" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i data-lucide="instagram"></i></a>
              <a href="https://youtube.com/@solarnest" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i data-lucide="youtube"></i></a>
              <a href="https://linkedin.com/company/solarnest" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i data-lucide="linkedin"></i></a>
            </div>
          </div>
          <div class="footer-col">
            <h3>Solar Systems</h3>
            <a href="${base}index.html">Home 1</a>
            <a href="${base}index1.html">Home 2</a>
            <a href="${base}pages/products.html">Products</a>
            <a href="${base}pages/calculator.html">Solar Savings Calculator</a>
            <a href="${base}pages/how-it-works.html">How It Works</a>
          </div>
          <div class="footer-col">
            <h3>Company</h3>
            <a href="${base}pages/about.html">About Us</a>
            <a href="${base}pages/projects.html">Projects</a>
            <a href="${base}pages/faq.html">FAQ</a>
            <a href="${base}pages/contact.html">Contact</a>
          </div>
          <div class="footer-col">
            <h3>Resources &amp; Legal</h3>
            <a href="${base}pages/contact.html#booking">Book Free Site Assessment</a>
            <a href="${base}pages/coming-soon.html">Coming Soon</a>
            <a href="${base}pages/404.html">404</a>
            <a href="${base}pages/privacy.html">Privacy Policy</a>
            <a href="${base}pages/terms.html">Terms &amp; Conditions</a>
          </div>
          <div class="footer-col">
            <h3>Newsletter</h3>
            <p class="muted" style="font-size:.74rem">Practical solar tips, policy updates and offers.</p>
            <form class="newsletter validated-form" novalidate>
              <div class="site-footer newsletter">
                <input type="email" name="newsletterEmail" aria-label="Email for newsletter" placeholder="Enter your email" required>
                <button type="submit" aria-label="Subscribe"><i data-lucide="arrow-right"></i></button>
              </div>
              <div class="field-error" aria-live="polite"></div>
            </form>
          </div>
        </div>
        <div class="container footer-bottom">
          <span>© <span data-year></span> SolarNest. All rights reserved.</span>
          <span><a href="${base}pages/privacy.html">Privacy Policy</a><a href="${base}pages/terms.html">Terms &amp; Conditions</a></span>
        </div>
      </footer>`;
  }

  const refreshIcons = () => {
    if (window.lucide) window.lucide.createIcons({ attrs: { 'aria-hidden': 'true', 'stroke-width': 1.9 } });
  };
  refreshIcons();
  window.addEventListener('load', refreshIcons);

  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  document.querySelectorAll('input[type="date"]').forEach(input => {
    input.min = new Date().toISOString().slice(0, 10);
  });

  const header = document.querySelector('[data-header]');
  const onScroll = () => header?.classList.toggle('scrolled', scrollY > 24);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  const menuButton = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('#primary-nav');
  menuButton?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menuButton.innerHTML = `<i data-lucide="${open ? 'x' : 'menu'}"></i>`;
    refreshIcons();
  });

  // Dropdown toggles
  document.querySelectorAll('.has-dropdown .dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = toggle.closest('.has-dropdown');
      const isOpen = parent.classList.contains('open');

      document.querySelectorAll('.has-dropdown.open').forEach(item => {
        if (item !== parent) {
          item.classList.remove('open');
          item.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
        }
      });

      parent.classList.toggle('open', !isOpen);
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-dropdown')) {
      document.querySelectorAll('.has-dropdown.open').forEach(item => {
        item.classList.remove('open');
        item.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Close dropdowns on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.has-dropdown.open').forEach(item => {
        item.classList.remove('open');
        item.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
        item.querySelector('.dropdown-toggle')?.focus();
      });
    }
  });

  // Keyboard navigation within dropdowns
  document.querySelectorAll('.has-dropdown').forEach(dropdown => {
    dropdown.addEventListener('keydown', (e) => {
      const items = Array.from(dropdown.querySelectorAll('.dropdown-item'));
      if (!items.length) return;
      const currentIndex = items.indexOf(document.activeElement);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        dropdown.classList.add('open');
        dropdown.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'true');
        const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        items[nextIndex]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        items[prevIndex]?.focus();
      }
    });
  });

  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded','false');
    menuButton?.setAttribute('aria-label', 'Open navigation');
    if (menuButton) menuButton.innerHTML = `<i data-lucide="menu"></i>`;
    document.querySelectorAll('.has-dropdown.open').forEach(item => {
      item.classList.remove('open');
      item.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
    });
    refreshIcons();
  }));

  const updateThemeIcon = () => {
    const dark = root.dataset.theme === 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.innerHTML = `<i data-lucide="${dark ? 'sun' : 'moon'}"></i>`;
      btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      btn.setAttribute('title', dark ? 'Switch to light theme' : 'Switch to dark theme');
    });
    refreshIcons();
  };
  updateThemeIcon();
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('solarnest-theme', root.dataset.theme);
      updateThemeIcon();
    });
  });

  const updateRtlLabel = () => {
    const isRtl = root.dir === 'rtl';
    document.querySelectorAll('.rtl-label').forEach(el => {
      el.textContent = isRtl ? 'LTR' : 'RTL';
    });
    document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
      btn.setAttribute('title', isRtl ? 'Switch to Left-to-Right layout' : 'Switch to Right-to-Left layout');
      btn.setAttribute('aria-label', isRtl ? 'Switch to Left-to-Right layout' : 'Switch to Right-to-Left layout');
    });
  };
  updateRtlLabel();

  document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      root.dir = root.dir === 'rtl' ? 'ltr' : 'rtl';
      localStorage.setItem('solarnest-direction', root.dir);
      updateRtlLabel();
    });
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px -30px' });
  document.querySelectorAll('.reveal,.stagger').forEach(el => revealObserver.observe(el));

  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const art = document.querySelector('.hero-art');
    addEventListener('scroll', () => {
      if (art && scrollY < innerHeight) art.style.translate = `0 ${Math.min(scrollY * .08, 45)}px`;
    }, { passive: true });
  }

  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count || 0);
      const suffix = el.dataset.suffix || '';
      const start = performance.now();
      const duration = 1150;
      const tick = now => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const value = target % 1 ? (target * eased).toFixed(1) : Math.round(target * eased).toLocaleString('en-IN');
        el.textContent = value + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: .7 });
  document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

  document.querySelectorAll('.faq-item').forEach((item, index) => {
    const button = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!button || !answer) return;
    button.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
    answer.id ||= `faq-answer-${index + 1}`;
    button.setAttribute('aria-controls', answer.id);
    if (item.classList.contains('open')) answer.style.maxHeight = answer.scrollHeight + 'px';
    button.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
      answer.style.maxHeight = open ? answer.scrollHeight + 'px' : '0px';
    });
  });

  const setOutput = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  };
  const money = value => `₹${Math.round(value).toLocaleString('en-IN')}`;

  // Real Indian Residential Solar Pricing & Subsidy Model (MNRE / PM Surya Ghar 2026)
  const getIndianSolarSpecs = (kw) => {
    const size = Math.max(1, Math.min(20, Number(kw) || 3));
    
    // Central Govt Subsidy (PM Surya Ghar: Muft Bijli Yojana)
    // 1 kW: ₹30,000 | 2 kW: ₹60,000 | 3 kW to 10 kW: ₹78,000 max | >10 kW: ₹0 (Commercial)
    let subsidy = 0;
    if (size === 1) subsidy = 30000;
    else if (size === 2) subsidy = 60000;
    else if (size === 2.5) subsidy = 69000;
    else if (size >= 3 && size <= 10) subsidy = 78000;
    else subsidy = 0; // >10 kW small commercial

    // Approximate Turnkey Project Cost in India (Tier-1 Modules + Bi-directional Meter + Inverter + Installation)
    let grossCost = 0;
    if (size === 1) grossCost = 65000;
    else if (size === 2) grossCost = 125000;
    else if (size === 3) grossCost = 180000;
    else if (size === 4) grossCost = 225000;
    else if (size === 5) grossCost = 265000;
    else if (size === 6) grossCost = 305000;
    else if (size === 7 || size === 7.5) grossCost = 355000;
    else if (size === 8) grossCost = 385000;
    else if (size === 9) grossCost = 425000;
    else if (size === 10) grossCost = 465000;
    else grossCost = size * 44000; // 11-20 kW

    const netInvestment = Math.max(grossCost - subsidy, 10000);
    return { grossCost, subsidy, netInvestment };
  };

  const computeSolarEstimate = (billInput, sizeInput, tariffInput = 8) => {
    const bill = Math.max(0, Number(billInput) || 0);
    const size = Math.max(1, Math.min(20, Number(sizeInput) || 3));
    const tariff = Math.max(1, Number(tariffInput) || 8);

    // Indian Generation Benchmark: 4.2 units (kWh) per kW per day -> 126 units/month/kW
    const dailyGenUnits = size * 4.2;
    const monthlyUnitsGen = Math.round(dailyGenUnits * 30);
    const monthlyUnitsUsed = Math.round(bill > 0 ? bill / tariff : monthlyUnitsGen);

    // Bill offset calculation:
    // In India, fixed connection charges are ~5% of the bill, so solar can offset up to 95% of grid charges.
    // If generation exceeds consumption, surplus units get credited at DISCOM solar feed-in tariff (avg ₹3.50/unit).
    let monthlySaving = 0;
    if (bill > 0) {
      if (monthlyUnitsGen <= monthlyUnitsUsed) {
        // Solar directly offsets grid units up to 95% of the bill
        monthlySaving = Math.min(bill * 0.95, monthlyUnitsGen * tariff);
      } else {
        // Solar covers 95% of bill + exports surplus units to grid
        const baseBillSavings = bill * 0.95;
        const surplusUnits = monthlyUnitsGen - monthlyUnitsUsed;
        const exportCredit = surplusUnits * 3.50; // DISCOM feed-in tariff
        monthlySaving = baseBillSavings + exportCredit;
      }
    } else {
      monthlySaving = monthlyUnitsGen * tariff;
    }

    const annualSaving = monthlySaving * 12;
    const { grossCost, subsidy, netInvestment } = getIndianSolarSpecs(size);
    const paybackYears = (netInvestment / Math.max(annualSaving, 1)).toFixed(1);
    
    // CO2 offset: ~1.25 metric tons per kW per year (CEA India emission factor)
    const co2Tons = (size * 1.25).toFixed(1);
    
    // 25-Year metrics with 0.5% annual degradation and 5% electricity inflation
    const lifetimeUnits = Math.round(monthlyUnitsGen * 12 * 25 * 0.92);
    let lifetimeSavings = 0;
    for (let yr = 0; yr < 25; yr++) {
      const yearFactor = Math.pow(1.05, yr) * (1 - yr * 0.005);
      lifetimeSavings += annualSaving * yearFactor;
    }

    return {
      bill,
      size,
      tariff,
      monthlyUnitsGen,
      monthlyUnitsUsed,
      monthlySaving: Math.round(monthlySaving),
      annualSaving: Math.round(annualSaving),
      payback: `${paybackYears} Years`,
      co2Tons: `${co2Tons} Tons/Year`,
      lifetimeUnits: `${lifetimeUnits.toLocaleString('en-IN')} Units`,
      lifetimeSavings: Math.round(lifetimeSavings),
      subsidy,
      grossCost,
      netInvestment
    };
  };

  const calcForm = document.querySelector('#savings-calculator');
  const calculate = (announce = false) => {
    if (!calcForm) return;
    const bill = Number(calcForm.monthlyBill?.value || 5000);
    const tariff = Number(calcForm.tariff?.value || 8);
    const size = Number(calcForm.systemSize?.value || 3);

    const res = computeSolarEstimate(bill, size, tariff);

    setOutput('[data-monthly-saving]', money(res.monthlySaving));
    setOutput('[data-annual-saving]', money(res.annualSaving));
    setOutput('[data-payback]', res.payback);
    setOutput('[data-system-output]', `${res.size} kW`);
    setOutput('[data-carbon]', res.co2Tons);
    setOutput('[data-units]', res.lifetimeUnits);
    setOutput('[data-lifetime]', money(res.lifetimeSavings));
    if (announce) document.querySelector('[data-results]')?.focus({ preventScroll: true });
    renderChart(res.bill, res.monthlySaving);
  };

  const renderChart = (monthlyBill, monthlySavings) => {
    const chart = document.querySelector('[data-savings-chart]');
    if (!chart) return;
    chart.innerHTML = '';

    const annualBill = (Number(monthlyBill) || 5000) * 12;
    const annualSavings = (Number(monthlySavings) || 3024) * 12;
    // Scale max height based on 25-year projected annual electricity bill at 6% inflation
    const maxProjected = annualBill * Math.pow(1.06, 25) * 1.15;
    const max = Math.max(maxProjected, 10000);

    for (let year = 0; year <= 24; year += 2) {
      const gridEscalation = Math.pow(1.06, year);
      const yearGridBill = annualBill * gridEscalation;
      const yearSolarSavings = annualSavings * Math.pow(1.04, year);
      const yearNetSolarBill = Math.max(yearGridBill - yearSolarSavings, yearGridBill * 0.10);
      const netSavings = yearGridBill - yearNetSolarBill;
      const savingPercent = Math.min(90, Math.round((netSavings / yearGridBill) * 100));

      const billHeight = Math.min(Math.max((yearGridBill / max) * 100, 8), 95);
      const solarHeight = Math.min(Math.max((yearNetSolarBill / max) * 100, 4), 95);

      const pair = document.createElement('div');
      pair.className = 'bar-pair';
      pair.setAttribute('tabindex', '0');
      pair.setAttribute('role', 'graphics-symbol');
      pair.setAttribute('aria-label', `Year ${year}: Grid bill ${money(yearGridBill)}/yr, Solar net bill ${money(yearNetSolarBill)}/yr. You save ${money(netSavings)}/yr (${savingPercent}%)`);
      pair.innerHTML = `
        <span class="bar bill" style="height:${billHeight.toFixed(1)}%"></span>
        <span class="bar solar" style="height:${solarHeight.toFixed(1)}%"></span>
        <div class="chart-tooltip">
          <div class="tooltip-year">Year ${year} Projection</div>
          <div class="tooltip-row"><span>Grid Bill:</span> <strong>${money(yearGridBill)}/yr</strong></div>
          <div class="tooltip-row"><span>Solar Net:</span> <strong>${money(yearNetSolarBill)}/yr</strong></div>
          <div class="tooltip-row saving"><span>You Save:</span> <strong>${money(netSavings)}/yr (${savingPercent}%)</strong></div>
        </div>
      `;
      chart.appendChild(pair);
    }

    const chartCard = chart.closest('.chart-card');
    if (chartCard && !chartCard.querySelector('.chart-x-axis')) {
      const axis = document.createElement('div');
      axis.className = 'chart-x-axis';
      axis.innerHTML = `<span>Year 0</span><span>Year 4</span><span>Year 8</span><span>Year 12</span><span>Year 16</span><span>Year 20</span><span>Year 24</span>`;
      chart.after(axis);
    }
  };

  if (calcForm) {
    const sizeOutput = calcForm.querySelector('[data-size-output]');
    const sizeInput = calcForm.systemSize;
    const billInput = calcForm.monthlyBill;
    const usageInput = calcForm.usage;
    const tariffInput = calcForm.tariff;

    const syncSize = value => {
      const clamped = Math.min(20, Math.max(1, Number(value)));
      sizeInput.value = String(clamped);
      if (sizeOutput) sizeOutput.value = String(clamped);
      calculate();
    };

    calcForm.querySelector('[data-size-minus]')?.addEventListener('click', () => syncSize(Number(sizeInput.value) - 1));
    calcForm.querySelector('[data-size-plus]')?.addEventListener('click', () => syncSize(Number(sizeInput.value) + 1));
    
    let isUpdatingUsage = false;
    let isUpdatingBill = false;

    if (billInput) {
      ['input', 'change', 'keyup'].forEach(evt => {
        billInput.addEventListener(evt, () => {
          if (isUpdatingBill) return;
          isUpdatingUsage = true;
          const b = Math.max(0, Number(billInput.value || 0));
          const t = Math.max(1, Number(tariffInput?.value || 8));
          if (usageInput && b > 0) {
            usageInput.value = String(Math.max(1, Math.round(b / t / 30)));
          }
          isUpdatingUsage = false;
          calculate();
        });
      });
    }

    if (usageInput) {
      ['input', 'change', 'keyup'].forEach(evt => {
        usageInput.addEventListener(evt, () => {
          if (isUpdatingUsage) return;
          isUpdatingBill = true;
          const u = Math.max(0, Number(usageInput.value || 0));
          const t = Math.max(1, Number(tariffInput?.value || 8));
          if (billInput && u > 0) {
            billInput.value = String(Math.max(500, Math.round(u * t * 30)));
          }
          isUpdatingBill = false;
          calculate();
        });
      });
    }

    if (tariffInput) {
      ['input', 'change', 'keyup'].forEach(evt => {
        tariffInput.addEventListener(evt, () => {
          const b = Math.max(0, Number(billInput?.value || 0));
          const t = Math.max(1, Number(tariffInput.value || 8));
          if (usageInput && b > 0) {
            usageInput.value = String(Math.max(1, Math.round(b / t / 30)));
          }
          calculate();
        });
      });
    }

    calcForm.querySelectorAll('select').forEach(sel => {
      sel.addEventListener('change', calculate);
    });

    calcForm.addEventListener('submit', event => {
      event.preventDefault();
      if (validateForm(calcForm)) calculate(true);
    });
    calculate();
  }

  document.querySelectorAll('[data-mini-calc]').forEach(form => {
    const billInput = form.querySelector('[name="bill"]');
    const sizeSelect = form.querySelector('[name="size"]');
    const container = form.closest('.mini-calculator');

    const update = () => {
      const bill = Number(billInput?.value || 5000);
      const size = Number(sizeSelect?.value || 3);
      const res = computeSolarEstimate(bill, size);

      const savingEl = container?.querySelector('[data-mini-saving]');
      const annualEl = container?.querySelector('[data-mini-annual]');
      const paybackEl = container?.querySelector('[data-mini-payback]');

      if (savingEl) savingEl.textContent = money(res.monthlySaving);
      if (annualEl) annualEl.textContent = money(res.annualSaving);
      if (paybackEl) paybackEl.textContent = res.payback;
    };

    ['input', 'change', 'keyup'].forEach(evt => {
      billInput?.addEventListener(evt, update);
      sizeSelect?.addEventListener(evt, update);
    });
    form.addEventListener('submit', e => { e.preventDefault(); update(); });
    update();
  });

  // Product Tabs Filtering
  const applyProductFilters = (btn) => {
    const targetBtn = btn.closest('[data-product-tab]') || btn;
    const parentTabs = targetBtn.closest('.tabs') || document;
    parentTabs.querySelectorAll('[data-product-tab]').forEach(b => {
      b.classList.toggle('active', b === targetBtn);
      b.setAttribute('aria-selected', String(b === targetBtn));
    });
    const audience = targetBtn.dataset.productTab;
    document.querySelectorAll('[data-audience]').forEach(card => {
      const cardAudience = (card.dataset.audience || '').split(' ');
      const show = audience === 'all' || cardAudience.includes(audience);
      card.hidden = !show;
      if (show) {
        card.style.display = 'flex';
        card.style.opacity = '1';
        card.style.transform = 'none';
        card.style.animation = 'pop 0.3s var(--ease) forwards';
      } else {
        card.style.display = 'none';
        card.style.animation = 'none';
      }
    });
  };

  document.querySelectorAll('[data-product-tab]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      applyProductFilters(button);
    });
  });

  const applyProjectFilters = () => {
    const category = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    const capacity = document.querySelector('[data-capacity-filter]')?.value || 'all';
    const location = document.querySelector('[data-location-filter]')?.value || 'all';
    let visibleCount = 0;
    document.querySelectorAll('[data-project]').forEach(card => {
      const categoryMatch = category === 'all' || card.dataset.category === category;
      const capacityMatch = capacity === 'all' || card.dataset.capacity === capacity;
      const locationMatch = location === 'all' || card.dataset.location === location;
      const isVisible = categoryMatch && capacityMatch && locationMatch;
      card.hidden = !isVisible;
      if (isVisible) {
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.transform = 'none';
        card.style.animation = 'pop 0.3s var(--ease) forwards';
        visibleCount++;
      } else {
        card.style.display = 'none';
        card.style.animation = 'none';
      }
    });

    const gallery = document.querySelector('.projects-grid');
    if (gallery) {
      let emptyMsg = gallery.querySelector('.project-empty-state');
      if (!emptyMsg) {
        emptyMsg = document.createElement('div');
        emptyMsg.className = 'project-empty-state';
        emptyMsg.innerHTML = `
          <div class="icon-orb"><i data-lucide="search-x"></i></div>
          <h3 style="margin:0 0 6px">No projects found</h3>
          <p class="muted" style="margin:0 0 16px;font-size:.84rem">No solar installations match the chosen category, capacity, and location filters.</p>
          <button class="btn btn-outline btn-sm" type="button" data-reset-filters>Reset Filters</button>
        `;
        gallery.appendChild(emptyMsg);
        refreshIcons();
        emptyMsg.querySelector('[data-reset-filters]')?.addEventListener('click', () => {
          document.querySelectorAll('.filter-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
          const capSelect = document.querySelector('[data-capacity-filter]');
          const locSelect = document.querySelector('[data-location-filter]');
          if (capSelect) capSelect.value = 'all';
          if (locSelect) locSelect.value = 'all';
          applyProjectFilters();
        });
      }
      emptyMsg.classList.toggle('visible', visibleCount === 0);
    }
  };
  document.querySelectorAll('.filter-btn').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    applyProjectFilters();
  }));
  document.querySelectorAll('[data-capacity-filter],[data-location-filter]').forEach(select => select.addEventListener('change', applyProjectFilters));

  function validateForm(form) {
    let valid = true;
    form.querySelectorAll('[required]').forEach(input => {
      let message = '';
      if (!input.value.trim()) message = 'Please complete this field.';
      else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) message = 'Enter a valid email address.';
      else if (input.type === 'tel' && !/^[+\d][\d\s-]{7,15}$/.test(input.value)) message = 'Enter a valid phone number.';
      else if (input.min && Number(input.value) < Number(input.min)) message = `Value must be at least ${input.min}.`;
      input.setAttribute('aria-invalid', String(Boolean(message)));
      const error = input.closest('.field')?.querySelector('.field-error');
      if (error) error.textContent = message;
      if (message) valid = false;
    });
    if (!valid) form.querySelector('[aria-invalid="true"]')?.focus();
    return valid;
  }

  document.querySelectorAll('.validated-form').forEach(form => {
    if (form.id === 'savings-calculator') return;
    form.querySelectorAll('input,select,textarea').forEach(input => {
      input.addEventListener('blur', () => validateForm(form));
      input.addEventListener('input', () => {
        if (input.getAttribute('aria-invalid') === 'true') {
          validateForm(form);
        }
      });
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!validateForm(form)) return;
      const success = form.querySelector('.form-success') || form.closest('.booking-form')?.querySelector('.form-success');
      if (success) {
        success.classList.add('visible');
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        const note = form.querySelector('.field-error');
        if (note) { note.textContent = 'Thanks — you’re subscribed.'; note.style.color = 'var(--green)'; }
      }
      form.reset();
    });
  });

  // Auto-fill Contact / Assessment Form from URL Parameters
  const initFormAutoFill = () => {
    const params = new URLSearchParams(window.location.search);
    const system = params.get('system');
    const title = params.get('title');
    const size = params.get('size');
    const price = params.get('price');
    const property = params.get('property');
    const bill = params.get('bill');
    const project = params.get('project');

    const form = document.querySelector('.booking-form form, #booking form, form.validated-form');
    if (!form) return;

    let hasPreFill = false;

    // Property Type
    if (property) {
      const propertySelect = form.querySelector('[name="property"]');
      if (propertySelect) {
        for (const opt of propertySelect.options) {
          if (opt.value.toLowerCase().includes(property.toLowerCase()) || property.toLowerCase().includes(opt.value.toLowerCase())) {
            propertySelect.value = opt.value;
            hasPreFill = true;
            break;
          }
        }
      }
    }

    // Monthly Bill
    if (bill) {
      const billInput = form.querySelector('[name="bill"]');
      if (billInput) {
        billInput.value = bill;
        hasPreFill = true;
      }
    }

    // Note / Inquiry message
    const noteInput = form.querySelector('[name="note"]');
    if (noteInput) {
      let inquiryText = '';
      if (system || title || size) {
        const sysName = title || (size ? `${size} kW Rooftop Solar System` : `${system.toUpperCase()} Solar System`);
        const formattedPrice = price ? ` (Estimated Cost: ₹${Number(price).toLocaleString('en-IN')}* after subsidy)` : '';
        inquiryText = `Inquiring about ${sysName}${formattedPrice}. Looking for engineering feasibility assessment, rooftop layout proposal, and PM Surya Ghar subsidy assistance.`;
      } else if (project) {
        inquiryText = `Inquiring about solar installation details similar to the "${project}" project.`;
      }
      if (inquiryText) {
        noteInput.value = inquiryText;
        hasPreFill = true;
      }
    }

    // Visual notification pill above booking form
    if (hasPreFill) {
      const bookingFormContainer = form.closest('.booking-form') || form.parentElement;
      if (bookingFormContainer && !bookingFormContainer.querySelector('.prefill-badge')) {
        const badge = document.createElement('div');
        badge.className = 'prefill-badge';
        badge.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 16px;margin:0 0 16px;border-radius:12px;background:var(--green-soft);border:1px solid #bce1bb;color:var(--green-dark);font-size:.82rem;animation:pop 0.3s var(--ease) forwards;';
        
        const sysName = title || (size ? `${size} kW Solar System` : 'Selected Solar System');
        badge.innerHTML = `
          <div style="display:flex;align-items:center;gap:8px;">
            <i data-lucide="check-circle-2" style="width:18px;height:18px;flex-shrink:0;"></i>
            <span>Pre-filled with <strong>${sysName}</strong> inquiry details</span>
          </div>
          <button type="button" class="btn btn-ghost btn-sm" style="padding:4px 8px;font-size:.72rem;min-height:auto;color:var(--green-dark);" data-clear-prefill>Clear</button>
        `;
        const heading = bookingFormContainer.querySelector('h2, .eyebrow');
        if (heading) {
          heading.before(badge);
        } else {
          bookingFormContainer.prepend(badge);
        }
        refreshIcons();

        badge.querySelector('[data-clear-prefill]')?.addEventListener('click', () => {
          form.reset();
          badge.remove();
        });
      }

      // Smoothly scroll to the form if hash is present
      if (window.location.hash === '#booking' || window.location.search) {
        setTimeout(() => {
          const target = document.querySelector('#booking') || form;
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      }
    }
  };
  initFormAutoFill();

  // Live Interactive Contact Map
  const mapElement = document.querySelector('#contact-map');
  if (mapElement) {
    const offices = {
      bengaluru: {
        name: 'Bengaluru Headquarters',
        address: '123 Green Energy Street, MG Road, Bengaluru 560001',
        hours: 'Mon–Sat, 9:00 AM – 6:00 PM',
        phone: '+91 98765 43210',
        coords: [12.9716, 77.5946],
        zoom: 14
      },
      pune: {
        name: 'Pune Regional Office',
        address: '45 Solar Square, FC Road, Shivaji Nagar, Pune 411005',
        hours: 'Mon–Sat, 9:00 AM – 6:00 PM',
        phone: '+91 98765 43211',
        coords: [18.5204, 73.8567],
        zoom: 14
      },
      hyderabad: {
        name: 'Hyderabad Solar Hub',
        address: '88 Eco Park View, Hitec City, Madhapur, Hyderabad 500081',
        hours: 'Mon–Sat, 9:00 AM – 6:00 PM',
        phone: '+91 98765 43212',
        coords: [17.3850, 78.4867],
        zoom: 14
      },
      chennai: {
        name: 'Chennai Experience Center',
        address: '12 Sun Avenue, 2nd Avenue, Anna Nagar, Chennai 600040',
        hours: 'Mon–Sat, 9:00 AM – 6:00 PM',
        phone: '+91 98765 43213',
        coords: [13.0827, 80.2707],
        zoom: 14
      }
    };

    const updateInfoCard = (locationKey) => {
      const office = offices[locationKey];
      if (!office) return;
      const nameEl = document.querySelector('#map-office-name');
      const addrEl = document.querySelector('#map-office-address');
      const hoursEl = document.querySelector('#map-office-hours');
      const phoneEl = document.querySelector('#map-office-phone');
      const dirBtn = document.querySelector('#map-directions-btn');

      if (nameEl) nameEl.textContent = office.name;
      if (addrEl) addrEl.textContent = office.address;
      if (hoursEl) hoursEl.textContent = office.hours;
      if (phoneEl) {
        phoneEl.textContent = office.phone;
        phoneEl.href = `tel:${office.phone.replace(/\s+/g, '')}`;
      }
      if (dirBtn) {
        dirBtn.href = `https://www.google.com/maps/search/?api=1&query=${office.coords[0]},${office.coords[1]}`;
      }
    };

    const initMap = () => {
      if (typeof L === 'undefined') {
        setTimeout(initMap, 150);
        return;
      }

      const map = L.map('contact-map', {
        center: offices.bengaluru.coords,
        zoom: offices.bengaluru.zoom,
        scrollWheelZoom: false
      });

      const tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, METI, TomTom'
      }).addTo(map);

      tileLayer.on('tileerror', function() {
        if (!map._hasTileFallback) {
          map._hasTileFallback = true;
          map.removeLayer(tileLayer);
          L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            maxZoom: 19,
            subdomains: 'abc',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          }).addTo(map);
        }
      });

      const createCustomIcon = () => L.divIcon({
        className: 'custom-solar-pin',
        html: `
          <div class="pin-marker">
            <div class="pin-pulse"></div>
            <div class="pin-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="M20 12h2"></path><path d="m19.07 4.93-1.41 1.41"></path><path d="M15.95 10.05a4 4 0 1 0-7.9 0"></path><path d="M12 18v4"></path><path d="m4.93 19.07 1.41-1.41"></path><path d="m19.07 19.07-1.41-1.41"></path>
              </svg>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -22]
      });

      const markers = {};
      Object.entries(offices).forEach(([key, office]) => {
        const marker = L.marker(office.coords, { icon: createCustomIcon() }).addTo(map);
        marker.bindPopup(`
          <div style="font-family:inherit">
            <strong>${office.name}</strong>
            <p style="margin:4px 0 6px;color:#555;font-size:.75rem">${office.address}</p>
            <a href="https://www.google.com/maps/search/?api=1&query=${office.coords[0]},${office.coords[1]}" target="_blank" rel="noopener noreferrer" style="color:#2f9631;font-weight:700;font-size:.75rem">Open Google Maps &rarr;</a>
          </div>
        `);
        marker.on('click', () => {
          document.querySelectorAll('[data-map-location]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mapLocation === key);
            btn.setAttribute('aria-selected', String(btn.dataset.mapLocation === key));
          });
          updateInfoCard(key);
        });
        markers[key] = marker;
      });

      document.querySelectorAll('[data-map-location]').forEach(btn => {
        btn.addEventListener('click', () => {
          const locKey = btn.dataset.mapLocation;
          const office = offices[locKey];
          if (!office) return;

          document.querySelectorAll('[data-map-location]').forEach(b => {
            b.classList.toggle('active', b === btn);
            b.setAttribute('aria-selected', String(b === btn));
          });

          map.flyTo(office.coords, office.zoom, { duration: 1.2 });
          markers[locKey]?.openPopup();
          updateInfoCard(locKey);
        });
      });
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initMap);
    } else {
      initMap();
    }
  }

  // Project Case Study Modal Popup System
  const initProjectModals = () => {
    const isPagesSubdir = window.location.pathname.includes('/pages/');
    const assetPrefix = isPagesSubdir ? '../' : '';
    const pagesPrefix = isPagesSubdir ? '' : 'pages/';

    const projectCatalog = {
      'bengaluru': {
        title: '5 kW On-Grid Rooftop Solar Installation',
        propertyType: 'Private 2-Storey Villa (RCC Flat Roof)',
        location: 'Bengaluru, Karnataka',
        capacity: '5 kW',
        category: 'Residential Home',
        image: 'assets/images/project-bengaluru.png',
        monthlySavings: '₹6,000+',
        annualSavings: '₹72,000+',
        monthlyOutput: '630 kWh/month',
        co2Reduced: '3.8 Tons/Year',
        payback: '3.2 Years',
        commissioned: 'March 2026',
        specs: {
          'Solar Modules': '10x 540W Mono PERC Bifacial Tier-1',
          'Inverter': '5 kW Dual-MPPT Grid-Tied Inverter',
          'Mounting Structure': 'Elevated Hot-Dip Galvanized GI',
          'Monitoring': 'Integrated WiFi App Telemetry 24/7',
          'Grid Tie': 'BESCOM Net Metering (Bi-directional)'
        },
        story: 'The Sharma family eliminated daytime grid electricity consumption while running two inverter air conditioners continuously throughout peak summer hours.'
      },
      'pune': {
        title: '3 kW On-Grid Rooftop Solar Installation',
        propertyType: 'Heritage Tiled Roof Bungalow',
        location: 'Pune, Maharashtra',
        capacity: '3 kW',
        category: 'Residential Home',
        image: 'assets/images/project-pune.png',
        monthlySavings: '₹3,600+',
        annualSavings: '₹43,200+',
        monthlyOutput: '380 kWh/month',
        co2Reduced: '2.3 Tons/Year',
        payback: '3.0 Years',
        commissioned: 'January 2026',
        specs: {
          'Solar Modules': '6x 540W High-Efficiency Monocrystalline',
          'Inverter': '3 kW Single-Phase Smart Inverter',
          'Mounting Structure': 'Custom Non-Penetrating Tile Clamps',
          'Monitoring': 'Smart Mobile Energy Dashboard',
          'Grid Tie': 'MSEDCL Approved Net-Metered Setup'
        },
        story: 'Installed with non-penetrating stainless steel clamps to preserve the original 40-year-old Mangalore clay roof tiles with zero water leakage risk.'
      },
      'hyderabad': {
        title: '10 kW On-Grid Solar & EV Charger Setup',
        propertyType: 'Luxury 3-Floor Residence with EV Port',
        location: 'Hyderabad, Telangana',
        capacity: '10 kW',
        category: 'Residential Home',
        image: 'assets/images/project-hyderabad.png',
        monthlySavings: '₹12,500+',
        annualSavings: '₹1,50,000+',
        monthlyOutput: '1,260 kWh/month',
        co2Reduced: '7.6 Tons/Year',
        payback: '2.8 Years',
        commissioned: 'April 2026',
        specs: {
          'Solar Modules': '18x 550W TOPCon N-Type Bifacial Panels',
          'Inverter': '10 kW Three-Phase Hybrid-Ready Inverter',
          'Mounting Structure': 'Anodized Aluminum High-Wind Mount',
          'Monitoring': 'Real-Time Phase & EV Load Management',
          'Grid Tie': 'TSSPDCL Net Metering with Feed-In'
        },
        story: 'Directly powers a dedicated 7.4 kW Level 2 home EV charger and whole-house climate system, achieving 85% full grid independence.'
      },
      'mysuru': {
        title: '2 kW On-Grid Rooftop Solar Installation',
        propertyType: 'Single-Family Independent House',
        location: 'Mysuru, Karnataka',
        capacity: '2 kW',
        category: 'Residential Home',
        image: 'assets/images/project-mysuru.png',
        monthlySavings: '₹2,300+',
        annualSavings: '₹27,600+',
        monthlyOutput: '255 kWh/month',
        co2Reduced: '1.5 Tons/Year',
        payback: '3.2 Years',
        commissioned: 'February 2026',
        specs: {
          'Solar Modules': '4x 540W Mono PERC Solar Panels',
          'Inverter': '2 kW Compact High-Efficiency String Inverter',
          'Mounting Structure': 'Standard Rust-Proof Rooftop Rig',
          'Monitoring': 'Bluetooth & WiFi App Monitoring',
          'Grid Tie': 'CHESCOM Subsidized Net Metering'
        },
        story: 'Completely eliminated high-tier grid unit tariffs, delivering clean rooftop power under the central PM Surya Ghar Muft Bijli scheme.'
      },
      'chennai': {
        title: '15 kW Small-Office Solar Power System',
        propertyType: 'Architectural Firm Office & Studio',
        location: 'Chennai, Tamil Nadu',
        capacity: '15 kW',
        category: 'Commercial / Small Office',
        image: 'assets/images/project-chennai.png',
        monthlySavings: '₹18,000+',
        annualSavings: '₹2,16,000+',
        monthlyOutput: '1,900 kWh/month',
        co2Reduced: '10.9 Tons/Year',
        payback: '2.6 Years',
        commissioned: 'May 2026',
        specs: {
          'Solar Modules': '28x 540W Salt-Mist Anti-Corrosion Modules',
          'Inverter': '15 kW Three-Phase Commercial Inverter',
          'Mounting Structure': 'Marine-Grade 6063 Aluminum Frames',
          'Monitoring': 'Cloud Sub-Meter Telemetry for 30 Desks',
          'Grid Tie': 'TANGEDCO Commercial Net-Metering'
        },
        story: 'Engineered with coastal anti-corrosion materials to power 30 design workstations, server racks, and central HVAC with 0 daytime grid reliance.'
      },
      'coimbatore': {
        title: '5 kW Canopy-Mounted Solar Array',
        propertyType: 'Modern Villa with Terrace Living Space',
        location: 'Coimbatore, Tamil Nadu',
        capacity: '5 kW',
        category: 'Residential Home',
        image: 'assets/images/project-coimbatore.png',
        monthlySavings: '₹6,200+',
        annualSavings: '₹74,400+',
        monthlyOutput: '640 kWh/month',
        co2Reduced: '3.9 Tons/Year',
        payback: '3.1 Years',
        commissioned: 'June 2026',
        specs: {
          'Solar Modules': '10x 540W High-Efficiency Monocrystalline',
          'Inverter': '5 kW Smart Solar Inverter with App Sync',
          'Mounting Structure': 'Elevated Gazebo Canopy Structure (8ft)',
          'Monitoring': 'Live IoT Mobile Monitoring Suite',
          'Grid Tie': 'TANGEDCO Residential Bi-directional Grid'
        },
        story: 'Constructed as an elevated 8-foot rooftop canopy, turning an unused terrace into a shaded open-air seating lounge while generating clean solar power.'
      },
      'hubballi': {
        title: '1 kW Compact On-Grid Solar Installation',
        propertyType: 'Compact Urban Residence',
        location: 'Hubballi, Karnataka',
        capacity: '1 kW',
        category: 'Residential Home',
        image: 'assets/images/project-hubballi.png',
        monthlySavings: '₹1,200+',
        annualSavings: '₹14,400+',
        monthlyOutput: '130 kWh/month',
        co2Reduced: '0.8 Tons/Year',
        payback: '3.7 Years',
        commissioned: 'July 2026',
        specs: {
          'Solar Modules': '2x 540W Tier-1 Mono PERC Panels',
          'Inverter': '1 kW Panel-Level Micro-Inverter',
          'Mounting Structure': 'Modular Rail-Less Mounting Clips',
          'Monitoring': 'Smartphone Performance App',
          'Grid Tie': 'HESCOM Net Meter Connection'
        },
        story: 'An ideal low-investment starter solar setup covering refrigerator, lighting, and fan loads with maximum central capital subsidy.'
      },
      'ahmedabad': {
        title: '7.5 kW High-Yield Rooftop Solar System',
        propertyType: '3-Storey Independent Row House',
        location: 'Ahmedabad, Gujarat',
        capacity: '7.5 kW',
        category: 'Residential Home',
        image: 'assets/images/project-ahmedabad.png',
        monthlySavings: '₹9,000+',
        annualSavings: '₹1,08,000+',
        monthlyOutput: '980 kWh/month',
        co2Reduced: '5.4 Tons/Year',
        payback: '3.0 Years',
        commissioned: 'August 2026',
        specs: {
          'Solar Modules': '14x 540W High-Temperature Resistant Modules',
          'Inverter': '8 kW Dual-MPPT High-Yield String Inverter',
          'Mounting Structure': 'Aerodynamic Reinforced GI Framing',
          'Monitoring': 'Cloud Weather & Yield Telemetry',
          'Grid Tie': 'UGVCL High-Export Net Metering'
        },
        story: 'Custom optimized tilt orientation designed to harvest peak solar irradiation during dry summer months when household air conditioning demand peaks.'
      },
      'bengaluru-large': {
        title: '20 kW Commercial Small-Office Solar Array',
        propertyType: 'Tech Startup Hub & Innovation Center',
        location: 'Bengaluru, Karnataka',
        capacity: '20 kW',
        category: 'Commercial / Small Office',
        image: 'assets/images/project-bengaluru-large.png',
        monthlySavings: '₹24,000+',
        annualSavings: '₹2,88,000+',
        monthlyOutput: '2,550 kWh/month',
        co2Reduced: '14.5 Tons/Year',
        payback: '2.5 Years',
        commissioned: 'August 2026',
        specs: {
          'Solar Modules': '36x 550W N-Type Ultra-High Output Panels',
          'Inverter': '20 kW Commercial Cloud-Connected String Inverter',
          'Mounting Structure': 'Heavy-Duty Structural Steel Columns',
          'Monitoring': 'Enterprise Power Quality & Load Balancing',
          'Grid Tie': 'BESCOM High-Tension Solar Net Meter'
        },
        story: 'Covers over 92% of the innovation facility’s computing workstations, server room cooling, and cafeteria loads, drastically reducing operating overhead.'
      }
    };

    // Create Modal Backdrop if not exists
    let modalBackdrop = document.querySelector('#project-modal-backdrop');
    if (!modalBackdrop) {
      modalBackdrop = document.createElement('div');
      modalBackdrop.id = 'project-modal-backdrop';
      modalBackdrop.className = 'project-modal-backdrop';
      modalBackdrop.setAttribute('role', 'dialog');
      modalBackdrop.setAttribute('aria-modal', 'true');
      modalBackdrop.setAttribute('aria-hidden', 'true');
      document.body.appendChild(modalBackdrop);
    }

    let activeTrigger = null;

    const closeModal = () => {
      modalBackdrop.classList.remove('open');
      modalBackdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (activeTrigger) {
        activeTrigger.focus();
        activeTrigger = null;
      }
    };

    const openModal = (projectKey, triggerElement) => {
      const data = projectCatalog[projectKey];
      if (!data) return;

      activeTrigger = triggerElement;
      const imgSrc = assetPrefix + data.image;
      const calcLink = pagesPrefix + 'calculator.html';
      const contactLink = pagesPrefix + 'contact.html#booking';

      let specsHtml = '';
      Object.entries(data.specs).forEach(([k, v]) => {
        specsHtml += `<li><span>${k}</span><strong>${v}</strong></li>`;
      });

      modalBackdrop.innerHTML = `
        <div class="project-modal" role="document">
          <button type="button" class="project-modal-close" aria-label="Close project details window">&times;</button>
          <div class="project-modal-hero">
            <img src="${imgSrc}" alt="${data.title}">
            <div class="project-modal-hero-gradient"></div>
            <div class="project-modal-hero-info">
              <div class="badges">
                <span class="capacity-badge" style="position:static">${data.capacity}</span>
                <span class="location-badge" style="position:static">${data.location}</span>
                <span class="status-badge" style="margin:0">${data.category}</span>
              </div>
              <h2>${data.title}</h2>
              <p>${data.propertyType}</p>
            </div>
          </div>
          <div class="project-modal-body">
            <div class="project-modal-stats">
              <div class="modal-stat-tile">
                <span>Monthly Bill Savings</span>
                <strong>${data.monthlySavings}</strong>
              </div>
              <div class="modal-stat-tile">
                <span>Estimated Annual Savings</span>
                <strong>${data.annualSavings}</strong>
              </div>
              <div class="modal-stat-tile">
                <span>Generation Output</span>
                <strong>${data.monthlyOutput}</strong>
              </div>
              <div class="modal-stat-tile">
                <span>CO₂ Offset</span>
                <strong>${data.co2Reduced}</strong>
              </div>
            </div>

            <div class="project-modal-grid">
              <div class="modal-spec-card">
                <h4><i data-lucide="cpu"></i> System Technical Specs</h4>
                <ul>${specsHtml}</ul>
              </div>
              <div class="modal-spec-card">
                <h4><i data-lucide="shield-check"></i> Project Economics & Warranty</h4>
                <ul>
                  <li><span>Payback Horizon</span><strong>${data.payback}</strong></li>
                  <li><span>Commissioned</span><strong>${data.commissioned}</strong></li>
                  <li><span>Performance Warranty</span><strong>25 Years (Linear)</strong></li>
                  <li><span>Inverter Warranty</span><strong>10 Years Comprehensive</strong></li>
                  <li><span>Subsidy Status</span><strong>Central Grant Disbursed</strong></li>
                </ul>
              </div>
            </div>

            <div class="project-modal-story">
              <strong><i data-lucide="quote"></i> Project Impact & Customer Story:</strong>
              <p>"${data.story}"</p>
            </div>

            <div class="project-modal-footer">
              <button type="button" class="btn btn-outline modal-cancel-btn">Close</button>
              <a href="${calcLink}" class="btn btn-outline"><i data-lucide="calculator"></i> Estimate Similar Savings</a>
              <a href="${contactLink}" class="btn"><i data-lucide="calendar-check"></i> Book Site Assessment</a>
            </div>
          </div>
        </div>
      `;

      modalBackdrop.classList.add('open');
      modalBackdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Re-initialize Lucide icons inside modal
      refreshIcons();

      // Focus close button for accessibility
      const closeBtn = modalBackdrop.querySelector('.project-modal-close');
      const cancelBtn = modalBackdrop.querySelector('.modal-cancel-btn');
      closeBtn?.addEventListener('click', closeModal);
      cancelBtn?.addEventListener('click', closeModal);
      closeBtn?.focus();
    };

    // Attach click and keydown triggers to all project cards
    document.querySelectorAll('.project-card').forEach(card => {
      const getCardKey = () => {
        if (card.dataset.projectId) return card.dataset.projectId;
        const img = card.querySelector('img');
        if (img) {
          const match = img.src.match(/project-([a-z0-9-]+)\.png/);
          if (match && match[1]) return match[1];
        }
        return 'bengaluru';
      };

      card.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(getCardKey(), card);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(getCardKey(), card);
        }
      });
    });

    // Close on backdrop click outside dialog
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
        closeModal();
      }
    });
  };

  // Home 2: Energy Flow Mode Switcher
  const initEnergyFlowSwitcher = () => {
    const flowButtons = document.querySelectorAll('.flow-mode-btn');
    const nodes = document.querySelectorAll('.arch-node-card');
    if (!flowButtons.length || !nodes.length) return;

    const modes = {
      day: {
        solar: { metric: '5.4 kW', status: 'Harvesting clean photons', active: true },
        inverter: { metric: '98.6%', status: 'Smart routing active', active: true },
        battery: { metric: '10.2 kWh', status: 'Charging at 2.4 kW', active: false },
        loads: { metric: '₹0 / km', status: 'Powering home circuits', active: true }
      },
      evening: {
        solar: { metric: '0.0 kW', status: 'Dormant (Night hours)', active: false },
        inverter: { metric: '98.4%', status: 'Discharging battery', active: true },
        battery: { metric: '8.6 kWh', status: 'Supplying 2.2 kW loads', active: true },
        loads: { metric: '₹0 / kWh', status: '100% off-grid battery power', active: true }
      },
      outage: {
        solar: { metric: '3.8 kW', status: 'Islanded generation', active: true },
        inverter: { metric: '<10ms', status: 'Micro-grid UPS active', active: true },
        battery: { metric: 'Full UPS', status: 'Essential backup circuits', active: true },
        loads: { metric: 'Protected', status: 'Zero-flicker power', active: true }
      }
    };

    flowButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const modeKey = btn.dataset.flowMode;
        if (!modeKey || !modes[modeKey]) return;

        flowButtons.forEach(b => {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
        });

        const config = modes[modeKey];
        nodes.forEach(node => {
          const nodeType = node.dataset.node;
          if (config[nodeType]) {
            const data = config[nodeType];
            node.classList.toggle('active', data.active);
            const metricEl = node.querySelector('.arch-node-metric');
            const statusEl = node.querySelector('.arch-status-text');
            if (metricEl) metricEl.textContent = data.metric;
            if (statusEl) statusEl.textContent = data.status;
          }
        });
      });
    });
  };

  // Products Page: Hardware Specs Category Filter
  const initSpecsFilter = () => {
    const specPills = document.querySelectorAll('.spec-pill');
    const specCards = document.querySelectorAll('.spec-card');
    if (!specPills.length || !specCards.length) return;

    specPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const targetTab = pill.dataset.specTab;
        specPills.forEach(p => {
          p.classList.toggle('active', p === pill);
          p.setAttribute('aria-selected', p === pill ? 'true' : 'false');
        });

        specCards.forEach(card => {
          const cat = card.dataset.category;
          if (targetTab === 'all' || cat === targetTab) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  };

  // Solar Savings Calculator Page: Interactive Subsidy & Green EMI Options
  const initSubsidyOptionsSwitcher = () => {
    const tierCards = document.querySelectorAll('.subsidy-tier-card');
    const cashflowCard = document.querySelector('.cashflow-card');
    if (!tierCards.length || !cashflowCard) return;

    const subSizePills = document.querySelectorAll('.tier-size-pill');
    const partnerPills = document.querySelectorAll('.partner-pill');
    const partnerNoteEl = document.querySelector('[data-partner-note]');

    const titleEl = cashflowCard.querySelector('[data-cashflow-title]');
    const descEl = cashflowCard.querySelector('[data-cashflow-desc]');
    const billEl = cashflowCard.querySelector('[data-cashflow-bill]');
    const billNoteEl = cashflowCard.querySelector('[data-cashflow-bill-note]');
    const emiLabelEl = cashflowCard.querySelector('[data-cashflow-emi-label]');
    const emiEl = cashflowCard.querySelector('[data-cashflow-emi]');
    const emiNoteEl = cashflowCard.querySelector('[data-cashflow-emi-note]');
    const surplusEl = cashflowCard.querySelector('[data-cashflow-surplus]');
    const surplusNoteEl = cashflowCard.querySelector('[data-cashflow-surplus-note]');
    const ctaBtn = cashflowCard.querySelector('[data-cashflow-cta]');

    const partners = {
      sbi: {
        name: 'SBI Surya Ghar',
        rate: 7.00,
        rateText: '7.00% p.a.',
        note: '<strong>SBI Surya Ghar Scheme:</strong> Collateral-free concessional green loan at 7.00% p.a., up to 10-year flexible tenure with direct PM Surya Ghar portal disbursal.'
      },
      canara: {
        name: 'Canara Bank Green',
        rate: 7.00,
        rateText: '7.00% p.a.',
        note: '<strong>Canara Bank Green Scheme:</strong> Special concessional solar loan at 7.00% p.a. with zero processing fee and swift DISCOM inspection tie-up.'
      },
      hdfc: {
        name: 'HDFC Clean Energy',
        rate: 7.25,
        rateText: '7.25% p.a.',
        note: '<strong>HDFC Clean Energy Scheme:</strong> Paperless digital pre-approval in 15 minutes for existing account holders, 7.25% p.a. with flexible doorstep documentation.'
      }
    };

    const tierData = {
      '1kw': {
        name: '1 kW',
        title: 'Your 1 kW Monthly Electricity Savings Exceed The Loan EMI',
        bill: '~₹1,600 / mo',
        billNote: 'Typical 1 BHK bill, rising tariff',
        baseEmi: 725,
        emiLabel: '5-Yr Green Loan EMI (1 kW)',
        surplusText: '+₹875 / mo',
        surplusNote: 'Net profit into your pocket from Month 1',
        ctaText: 'Check 1 kW Subsidy Eligibility',
        ctaUrl: 'contact.html?system=1kw&subject=subsidy#booking'
      },
      '2kw': {
        name: '2 kW',
        title: 'Your 2 kW Monthly Electricity Savings Exceed The Loan EMI',
        bill: '~₹2,700 / mo',
        billNote: 'Typical 2 BHK bill, rising tariff',
        baseEmi: 1450,
        emiLabel: '5-Yr Green Loan EMI (2 kW)',
        surplusText: '+₹1,250 / mo',
        surplusNote: 'Net profit into your pocket from Month 1',
        ctaText: 'Check 2 kW Subsidy Eligibility',
        ctaUrl: 'contact.html?system=2kw&subject=subsidy#booking'
      },
      '3kw': {
        name: '3 kW',
        title: 'Your 3 kW Monthly Electricity Savings Exceed The Loan EMI',
        bill: '~₹3,800 / mo',
        billNote: 'Typical 3 BHK bill with ACs',
        baseEmi: 2175,
        emiLabel: '5-Yr Green Loan EMI (3 kW)',
        surplusText: '+₹1,625 / mo',
        surplusNote: 'Net profit into your pocket from Month 1',
        ctaText: 'Check 3 kW Subsidy Eligibility',
        ctaUrl: 'contact.html?system=3kw&subject=subsidy#booking'
      },
      '5kw': {
        name: '5 kW',
        title: 'Your 5 kW Monthly Electricity Savings Exceed The Loan EMI',
        bill: '~₹6,200 / mo',
        billNote: 'Typical villa / 4 BHK with EV charging',
        baseEmi: 4100,
        emiLabel: '5-Yr Green Loan EMI (5 kW)',
        surplusText: '+₹2,100 / mo',
        surplusNote: 'Net profit into your pocket from Month 1',
        ctaText: 'Check 5 kW Subsidy Eligibility',
        ctaUrl: 'contact.html?system=5kw&subject=subsidy#booking'
      },
      '10kw': {
        name: '10 kW',
        title: 'Your 10 kW Monthly Electricity Savings Exceed The Loan EMI',
        bill: '~₹12,500 / mo',
        billNote: 'Large luxury bungalow or small commercial',
        baseEmi: 8960,
        emiLabel: '5-Yr Green Loan EMI (10 kW)',
        surplusText: '+₹3,540 / mo',
        surplusNote: 'Net profit into your pocket from Month 1',
        ctaText: 'Check 10 kW Subsidy Eligibility',
        ctaUrl: 'contact.html?system=10kw&subject=subsidy#booking'
      }
    };

    let currentTier = '2kw';
    let currentPartner = 'sbi';

    const updateView = (selectedKey) => {
      currentTier = selectedKey;
      const data = tierData[selectedKey];
      const partner = partners[currentPartner] || partners.sbi;
      if (!data) return;

      tierCards.forEach(card => {
        const cardTier = card.dataset.subsidyTier;
        const isMatched = (selectedKey === '3kw' || selectedKey === '5kw' || selectedKey === '10kw') 
          ? cardTier === '3kw' 
          : cardTier === selectedKey;

        card.classList.toggle('selected', isMatched);
        card.classList.toggle('highlight', isMatched);
        card.setAttribute('aria-checked', isMatched ? 'true' : 'false');

        const statusPill = card.querySelector('.tier-status-pill');
        if (statusPill) {
          statusPill.classList.toggle('active', isMatched);
          statusPill.innerHTML = isMatched 
            ? '<i data-lucide="check-circle-2"></i> Selected Option'
            : '<i data-lucide="circle"></i> Click to select';
        }

        const btn = card.querySelector('.tier-select-btn');
        if (btn) {
          if (cardTier === '3kw') {
            btn.innerHTML = isMatched 
              ? `<i data-lucide="check-circle-2"></i> Selected ${data.name}`
              : '<i data-lucide="check-circle-2"></i> Select 3–10 kW';
          } else {
            const sizeName = cardTier === '1kw' ? '1 kW' : '2 kW';
            btn.innerHTML = isMatched 
              ? `<i data-lucide="check-circle-2"></i> Selected ${sizeName}`
              : `<i data-lucide="check-circle-2"></i> Select ${sizeName}`;
          }
        }
      });

      subSizePills.forEach(pill => {
        const sub = pill.dataset.subSize;
        const isActive = (selectedKey === sub);
        pill.classList.toggle('active', isActive);
      });

      if (titleEl) titleEl.textContent = data.title;
      if (descEl) descEl.textContent = `With approved ${partner.name} green loans at ~${partner.rateText}, you never pay out of pocket. Your utility bill savings fund the installation.`;
      if (billEl) billEl.textContent = data.bill;
      if (billNoteEl) billNoteEl.textContent = data.billNote;
      if (emiLabelEl) emiLabelEl.textContent = data.emiLabel;
      
      let emiVal = data.baseEmi;
      if (partner.rate === 7.25) {
        emiVal = Math.round(emiVal * 1.012);
      }
      if (emiEl) emiEl.textContent = `~₹${emiVal.toLocaleString('en-IN')} / mo`;
      if (emiNoteEl) emiNoteEl.textContent = `Fixed 60 months @ ${partner.rateText}, then ₹0`;
      
      if (surplusEl) surplusEl.textContent = data.surplusText;
      if (surplusNoteEl) surplusNoteEl.textContent = data.surplusNote;

      if (ctaBtn) {
        ctaBtn.innerHTML = `<i data-lucide="file-check"></i> ${data.ctaText}`;
        ctaBtn.setAttribute('href', data.ctaUrl);
      }

      if (window.lucide) {
        window.lucide.createIcons();
      }
    };

    tierCards.forEach(card => {
      const tierKey = card.dataset.subsidyTier;
      
      const handleSelect = (e) => {
        if (e.target.closest('.tier-size-pill')) return;
        
        let targetKey = tierKey;
        if (tierKey === '3kw') {
          const activeSub = card.querySelector('.tier-size-pill.active');
          targetKey = activeSub ? activeSub.dataset.subSize : '3kw';
        }
        updateView(targetKey);
      };

      card.addEventListener('click', handleSelect);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect(e);
        }
      });

      const selectBtn = card.querySelector('.tier-select-btn');
      if (selectBtn) {
        selectBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          handleSelect(e);
        });
      }
    });

    subSizePills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        const subKey = pill.dataset.subSize;
        updateView(subKey);
      });
    });

    partnerPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const partnerKey = pill.dataset.partner;
        if (!partners[partnerKey]) return;
        currentPartner = partnerKey;

        partnerPills.forEach(p => {
          const isCurrent = (p === pill);
          p.classList.toggle('active', isCurrent);
          p.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
        });

        if (partnerNoteEl && partners[partnerKey]) {
          partnerNoteEl.innerHTML = `<i data-lucide="info" style="width:13px;height:13px;vertical-align:middle;margin-right:4px;"></i> ${partners[partnerKey].note}`;
        }

        updateView(currentTier);
      });
    });

    updateView('2kw');
  };

  initProjectModals();
  initEnergyFlowSwitcher();
  initSpecsFilter();
  initSubsidyOptionsSwitcher();
})();

