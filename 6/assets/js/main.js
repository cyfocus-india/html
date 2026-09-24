(() => {
  "use strict";

  const body = document.body;
  const root = body.dataset.root || "";
  const activePage = body.dataset.page || "home";
  const html = document.documentElement;

  const routes = {
    home: `${root}index.html`,
    home1: `${root}index.html`,
    home2: `${root}index1.html`,
    services: `${root}pages/services.html`,
    brands: `${root}pages/brands.html`,
    pricing: `${root}pages/pricing.html`,
    reviews: `${root}pages/reviews.html`,
    contact: `${root}pages/contact.html`,
    book: `${root}pages/contact.html#book`,
    about: `${root}pages/about.html`,
    comingSoon: `${root}pages/coming-soon.html`,
    notFound: `${root}pages/404.html`,
    privacy: `${root}pages/privacy.html`,
    terms: `${root}pages/terms.html`,
    signin: `${root}pages/signin.html`,
    signup: `${root}pages/signup.html`
  };

  const navItems = [
    ["about", "About"],
    ["services", "Services"],
    ["brands", "Brands"],
    ["pricing", "Pricing"],
    ["reviews", "Reviews"],
    ["contact", "Contact"]
  ];

  const pagesItems = [
    { key: "coming-soon", label: "Coming Soon", href: routes.comingSoon },
    { key: "404", label: "404", href: routes.notFound },
    { key: "privacy", label: "Privacy Policy", href: routes.privacy },
    { key: "terms", label: "Terms &amp; Conditions", href: routes.terms }
  ];

  const brandMarkup = `
    <span class="brand-mark" aria-hidden="true">I</span>
    <span class="brand-copy"><strong>Ironlane</strong><small>Moto Works<span class="brand-sub-extra"> · Service Center</span></small></span>`;

  function injectChrome() {
    const noChromePages = ["signin", "signup", "coming-soon", "404"];
    const headerHost = document.querySelector("[data-site-header]");
    const footerHost = document.querySelector("[data-site-footer]");

    if (noChromePages.includes(activePage)) {
      if (headerHost) headerHost.remove();
      if (footerHost) footerHost.remove();
      return;
    }

    const isHomeActive = activePage === "home" || activePage === "home1" || activePage === "home2";
    const isHome1Active = activePage === "home" || activePage === "home1";
    const isHome2Active = activePage === "home2";
    const isPagesActive = pagesItems.some((item) => item.key === activePage);

    if (headerHost) {
      headerHost.innerHTML = `
        <a class="skip-link" href="#main-content">Skip to main content</a>
        <header class="site-header" data-header>
          <div class="container header-inner">
            <a class="brand" href="${routes.home}" aria-label="Ironlane Moto Works home">${brandMarkup}</a>
            <nav class="site-nav" id="site-navigation" data-nav aria-label="Primary navigation">
              <ul class="nav-list">
                <li class="nav-item nav-item-dropdown" data-dropdown>
                  <button class="nav-link dropdown-toggle" type="button" aria-expanded="false" aria-haspopup="true" ${isHomeActive ? 'aria-current="page"' : ""}>
                    <span>Home</span>
                    <i class="dropdown-chevron" data-lucide="chevron-down" aria-hidden="true"></i>
                  </button>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-link" href="${routes.home1}" ${isHome1Active ? 'aria-current="page"' : ""}>Home 1</a></li>
                    <li><a class="dropdown-link" href="${routes.home2}" ${isHome2Active ? 'aria-current="page"' : ""}>Home 2</a></li>
                  </ul>
                </li>
                ${navItems.map(([key, label]) => `<li><a class="nav-link" href="${routes[key]}" ${key === activePage ? 'aria-current="page"' : ""}>${label}</a></li>`).join("")}
                <li class="nav-item nav-item-dropdown" data-dropdown>
                  <button class="nav-link dropdown-toggle" type="button" aria-expanded="false" aria-haspopup="true" ${isPagesActive ? 'aria-current="page"' : ""}>
                    <span>Pages</span>
                    <i class="dropdown-chevron" data-lucide="chevron-down" aria-hidden="true"></i>
                  </button>
                  <ul class="dropdown-menu">
                    ${pagesItems.map((item) => `<li><a class="dropdown-link" href="${item.href}" ${item.key === activePage ? 'aria-current="page"' : ""}>${item.label}</a></li>`).join("")}
                  </ul>
                </li>
                <li class="mobile-only-cta"><a class="btn" style="width:100%;margin-top:0.5rem" href="${routes.book}">Book a Service</a></li>
              </ul>
            </nav>
            <div class="header-actions">
              <button class="icon-button" type="button" data-theme-toggle aria-label="Switch color theme" aria-pressed="false">
                <i class="theme-icon-moon" data-lucide="moon" aria-hidden="true"></i>
                <i class="theme-icon-sun" data-lucide="sun" aria-hidden="true"></i>
              </button>
              <button class="icon-button dir-toggle" type="button" data-rtl-toggle aria-label="Switch to RTL layout" title="Switch text direction">
                <span class="dir-toggle-text">RTL</span>
              </button>
              <a class="btn header-cta" href="${routes.book}">Book a Service</a>
              <button class="icon-button menu-toggle" type="button" data-menu-toggle aria-controls="site-navigation" aria-expanded="false" aria-label="Open navigation menu">
                <i class="menu-open" data-lucide="menu" aria-hidden="true"></i>
                <i class="menu-close" data-lucide="x" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </header>`;
    }

    if (footerHost) {
      footerHost.innerHTML = `
        <footer class="site-footer">
          <div class="container">
            <div class="footer-grid">
              <div>
                <a class="brand" href="${routes.home}" aria-label="Ironlane Moto Works home">${brandMarkup}</a>
                <p>Honest motorcycle care for the road ahead. Clear advice, careful workmanship, no workshop theatre.</p>
                <div class="social-links" aria-label="Social media">
                  <a href="https://www.instagram.com/" aria-label="Instagram"><i data-lucide="instagram" aria-hidden="true"></i></a>
                  <a href="https://www.facebook.com/" aria-label="Facebook"><i data-lucide="facebook" aria-hidden="true"></i></a>
                  <a href="https://www.youtube.com/" aria-label="YouTube"><i data-lucide="youtube" aria-hidden="true"></i></a>
                </div>
              </div>
              <div>
                <h3>Main Pages</h3>
                <ul class="footer-links">
                  <li><a href="${routes.home1}">Home 1</a></li>
                  <li><a href="${routes.home2}">Home 2</a></li>
                  <li><a href="${routes.about}">About Us</a></li>
                  <li><a href="${routes.services}">Services</a></li>
                  <li><a href="${routes.brands}">Brands</a></li>
                  <li><a href="${routes.pricing}">Pricing</a></li>
                  <li><a href="${routes.reviews}">Reviews</a></li>
                  <li><a href="${routes.contact}">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3>Workshop &amp; Service</h3>
                <ul class="footer-links">
                  <li><a href="${routes.services}#bike-services">Bike Repair &amp; Service</a></li>
                  <li><a href="${routes.pricing}#service-packages">Workshop Packages</a></li>
                  <li><a href="${routes.book}">Book a Service</a></li>
                  <li><a href="${routes.comingSoon}">Coming Soon</a></li>
                  <li><a href="${routes.notFound}">404 Page</a></li>
                </ul>
              </div>
              <div>
                <h3>Legal &amp; Info</h3>
                <ul class="footer-links">
                  <li><a href="${routes.privacy}">Privacy Policy</a></li>
                  <li><a href="${routes.terms}">Terms &amp; Conditions</a></li>
                  <li style="margin-top:0.4rem;color:var(--text-muted)">24 Workshop Lane, Indiranagar</li>
                  <li><a href="tel:+919876543210">+91 98765 43210</a></li>
                  <li><a href="mailto:hello@ironlanemoto.in">hello@ironlanemoto.in</a></li>
                </ul>
              </div>
            </div>
            <div class="footer-bottom">
              <span>© <span data-year></span> Ironlane Moto Works. All rights reserved.</span>
              <span><a href="${routes.privacy}">Privacy Policy</a> · <a href="${routes.terms}">Terms &amp; Conditions</a></span>
            </div>
          </div>
        </footer>`;
    }
  }

  function initTheme() {
    const stored = localStorage.getItem("ironlane-theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = stored || (systemDark ? "dark" : "light");
    html.dataset.theme = theme;

    const buttons = document.querySelectorAll("[data-theme-toggle]");
    if (!buttons.length) return;
    const sync = () => {
      const isDark = html.dataset.theme === "dark";
      buttons.forEach((button) => {
        button.setAttribute("aria-pressed", String(isDark));
        button.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);
      });
    };
    sync();
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        html.dataset.theme = html.dataset.theme === "dark" ? "light" : "dark";
        localStorage.setItem("ironlane-theme", html.dataset.theme);
        sync();
      });
    });

    if (!stored) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
        html.dataset.theme = event.matches ? "dark" : "light";
        sync();
      });
    }
  }

  function initRTL() {
    const stored = localStorage.getItem("ironlane-direction");
    if (stored === "rtl") html.dir = "rtl";

    const buttons = document.querySelectorAll("[data-rtl-toggle]");
    if (!buttons.length) return;
    const sync = () => {
      const isRTL = html.dir === "rtl";
      buttons.forEach((button) => {
        const label = button.querySelector(".dir-toggle-text");
        button.setAttribute("aria-pressed", String(isRTL));
        button.setAttribute("aria-label", `Switch to ${isRTL ? "LTR" : "RTL"} layout`);
        button.setAttribute("title", `Switch to ${isRTL ? "LTR" : "RTL"} layout`);
        if (label) label.textContent = isRTL ? "LTR" : "RTL";
      });
    };
    sync();
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        html.dir = html.dir === "rtl" ? "ltr" : "rtl";
        localStorage.setItem("ironlane-direction", html.dir);
        sync();
      });
    });
  }

  function initDropdowns() {
    const dropdowns = document.querySelectorAll("[data-dropdown]");
    dropdowns.forEach((dropdown) => {
      const toggle = dropdown.querySelector(".dropdown-toggle");
      if (!toggle) return;

      const setOpen = (open) => {
        dropdown.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
      };

      toggle.addEventListener("click", (event) => {
        event.stopPropagation();
        const isOpen = dropdown.classList.contains("is-open");
        setOpen(!isOpen);
      });

      dropdown.addEventListener("mouseenter", () => {
        if (window.innerWidth >= 1024) setOpen(true);
      });

      dropdown.addEventListener("mouseleave", () => {
        if (window.innerWidth >= 1024) setOpen(false);
      });

      dropdown.addEventListener("focusout", (event) => {
        if (!dropdown.contains(event.relatedTarget)) {
          setOpen(false);
        }
      });
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest("[data-dropdown]")) {
        dropdowns.forEach((dropdown) => {
          dropdown.classList.remove("is-open");
          dropdown.querySelector(".dropdown-toggle")?.setAttribute("aria-expanded", "false");
        });
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        dropdowns.forEach((dropdown) => {
          dropdown.classList.remove("is-open");
          dropdown.querySelector(".dropdown-toggle")?.setAttribute("aria-expanded", "false");
        });
      }
    });

    // Arrow-key navigation within open dropdowns
    document.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      const active = document.activeElement;
      const dropdown = active?.closest("[data-dropdown]");
      if (!dropdown) return;
      const links = [...dropdown.querySelectorAll(".dropdown-link, .dropdown-toggle")];
      if (links.length < 2) return;
      event.preventDefault();
      const idx = links.indexOf(active);
      const next = event.key === "ArrowDown"
        ? links[(idx + 1) % links.length]
        : links[(idx - 1 + links.length) % links.length];
      next.focus();
      // Auto-open dropdown when navigating into it
      if (!dropdown.classList.contains("is-open")) {
        dropdown.classList.add("is-open");
        dropdown.querySelector(".dropdown-toggle")?.setAttribute("aria-expanded", "true");
      }
    });
  }

  function initMenu() {
    const button = document.querySelector("[data-menu-toggle]");
    const nav = document.querySelector("[data-nav]");
    const header = document.querySelector("[data-header]");
    if (!button || !nav) return;
    const close = () => {
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Open navigation menu");
      nav.classList.remove("is-open");
      header?.classList.remove("menu-open");
      document.body.classList.remove("menu-open");
    };
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", `${open ? "Close" : "Open"} navigation menu`);
      nav.classList.toggle("is-open", open);
      header?.classList.toggle("menu-open", open);
      document.body.classList.toggle("menu-open", open);
    });
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024) close();
    });
  }

  function initHeader() {
    const header = document.querySelector("[data-header]");
    if (!header) return;
    const sync = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
  }

  function initScrollProgress() {
    let bar = document.querySelector(".scroll-progress-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "scroll-progress-bar";
      document.body.prepend(bar);
    }
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
      bar.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function initBackToTop() {
    let btn = document.querySelector(".back-to-top");
    if (!btn) {
      btn = document.createElement("button");
      btn.className = "back-to-top";
      btn.setAttribute("type", "button");
      btn.setAttribute("aria-label", "Scroll back to top");
      btn.innerHTML = `<i data-lucide="chevron-up" aria-hidden="true"></i>`;
      document.body.appendChild(btn);
      if (window.lucide) window.lucide.createIcons({ root: btn });
    }
    const sync = () => {
      btn.classList.toggle("is-active", window.scrollY > 350);
    };
    window.addEventListener("scroll", sync, { passive: true });
    sync();
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function initCounters() {
    const counters = document.querySelectorAll(".stat strong, [data-counter]");
    if (!counters.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        observer.unobserve(el);

        const rawText = el.textContent.trim();
        const match = rawText.match(/^([0-9.]+)(.*)$/);
        if (!match) return;
        if (/^0\d+$/.test(rawText)) return; // Preserve step markers like 01, 02

        const targetVal = parseFloat(match[1]);
        const suffix = match[2] || "";
        const isDecimal = match[1].includes(".");
        const duration = 1200;
        const startTime = performance.now();

        function step(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // smooth easeOutExpo
          const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const current = targetVal * ease;
          el.textContent = (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = (isDecimal ? targetVal.toFixed(1) : targetVal) + suffix;
          }
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.15 });

    counters.forEach((c) => observer.observe(c));
  }

  function initReveal() {
    const nodes = [...document.querySelectorAll(".reveal")];
    if (!nodes.length) return;
    nodes.forEach((node, index) => {
      const parentGrid = node.closest(".grid-2, .grid-3, .grid-4, .stats-grid, .photo-grid");
      if (parentGrid) {
        const siblings = [...parentGrid.children];
        const gridIndex = siblings.indexOf(node);
        node.style.setProperty("--delay", `${(gridIndex >= 0 ? gridIndex % 4 : index % 4) * 90}ms`);
      } else {
        node.style.setProperty("--delay", `${Math.min(index % 4, 3) * 80}ms`);
      }
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -6%", threshold: 0.08 });
    nodes.forEach((node) => observer.observe(node));
  }

  function initValidation() {
    const forms = document.querySelectorAll("form[data-validate]");
    const messages = {
      valueMissing: "Please complete this field.",
      typeMismatch: "Please enter a valid value.",
      patternMismatch: "Please use the requested format.",
      tooShort: "Please provide a little more detail.",
      rangeUnderflow: "Please choose a later date."
    };

    const messageFor = (field) => {
      if (field.validity.valueMissing) return messages.valueMissing;
      if (field.validity.typeMismatch) return messages.typeMismatch;
      if (field.validity.patternMismatch) return field.dataset.patternMessage || messages.patternMismatch;
      if (field.validity.tooShort) return messages.tooShort;
      if (field.validity.rangeUnderflow) return messages.rangeUnderflow;
      return "Please check this field.";
    };

    forms.forEach((form) => {
      const fields = [...form.querySelectorAll("input, select, textarea")].filter((field) => field.type !== "submit");
      const validateField = (field) => {
        const error = form.querySelector(`#${field.id}-error`);
        if (field.checkValidity()) {
          field.removeAttribute("aria-invalid");
          if (error) error.textContent = "";
          return true;
        }
        field.setAttribute("aria-invalid", "true");
        if (error) error.textContent = messageFor(field);
        return false;
      };

      fields.forEach((field) => {
        field.addEventListener("blur", () => validateField(field));
        field.addEventListener("input", () => {
          if (field.hasAttribute("aria-invalid")) validateField(field);
        });
      });

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const results = fields.map(validateField);
        if (results.includes(false)) {
          const firstInvalid = fields.find((field) => field.getAttribute("aria-invalid") === "true");
          firstInvalid?.focus();
          return;
        }
        const status = form.querySelector("[data-form-status]");
        if (status) {
          status.textContent = form.dataset.success || "Thanks — your request has been recorded for this demo.";
          status.classList.add("is-visible");
          status.focus();
        }
        form.reset();
      });
    });
  }

  function initDateFields() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const value = tomorrow.toISOString().split("T")[0];
    document.querySelectorAll('input[type="date"]').forEach((field) => field.min = value);

    const applyServiceFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const rawService = params.get("service");
      if (!rawService) return;

      const requestedService = rawService.toLowerCase().trim();
      const serviceSelect = document.querySelector("#service");
      if (!serviceSelect) return;

      const aliasMap = {
        "essential": "essential",
        "essential-care": "essential",
        "essential_care": "essential",
        "master": "master",
        "master-care": "master",
        "master_care": "master",
        "master-42-point": "master",
        "master-42-point-care": "master",
        "42-point": "master",
        "tour": "tour",
        "tour-track": "tour",
        "tour-and-track": "tour",
        "tour_track": "tour",
        "track": "tour",
        "overhaul": "tour",
        "tour-overhaul": "tour",
        "diagnostics": "diagnostics",
        "engine": "diagnostics",
        "bay-inspection": "diagnostics",
        "inspection": "diagnostics",
        "brake": "brake",
        "brakes": "brake",
        "brake-overhaul": "brake",
        "chain": "chain",
        "drivetrain": "chain",
        "drivetrain-check": "chain",
        "routine": "routine",
        "handover": "routine",
        "full-handover": "routine",
        "oil": "oil",
        "tyre": "tyre",
        "tyres": "tyre",
        "tire": "tyre",
        "tires": "tyre",
        "battery": "battery",
        "car": "car"
      };

      const targetValue = aliasMap[requestedService] || requestedService;
      const option = [...serviceSelect.options].find((item) => item.value === targetValue);
      if (option) {
        serviceSelect.value = targetValue;
        serviceSelect.dispatchEvent(new Event("change", { bubbles: true }));
        serviceSelect.classList.add("field-preselected");
        setTimeout(() => {
          serviceSelect.classList.remove("field-preselected");
        }, 3000);
      }
    };

    applyServiceFromUrl();
    window.addEventListener("hashchange", applyServiceFromUrl);
    window.addEventListener("popstate", applyServiceFromUrl);
  }

  function initCalculator() {
    const form = document.querySelector("[data-estimate-form]");
    if (!form) return;
    const services = {
      routine: [800, 1200],
      oil: [400, 800],
      tyre: [1200, 2500],
      brake: [600, 1000],
      chain: [300, 600],
      battery: [1000, 2500],
      diagnostics: [500, 1200]
    };
    const multipliers = { commuter: 1, mid: 1.18, premium: 1.4 };
    const result = form.querySelector("[data-estimate-result]");
    const update = () => {
      const range = services[form.service.value];
      const multiplier = multipliers[form.bike.value];
      if (!range || !multiplier) return;
      const low = Math.round((range[0] * multiplier) / 50) * 50;
      const high = Math.round((range[1] * multiplier) / 50) * 50;
      result.innerHTML = `<span>Working estimate</span><strong style="animation:numberPop 320ms cubic-bezier(0.2,0.75,0.25,1)">₹${low.toLocaleString("en-IN")}–₹${high.toLocaleString("en-IN")}</strong><small>Final pricing follows inspection and parts approval.</small>`;
    };
    form.addEventListener("change", update);
    update();
  }

  function initSlider() {
    document.querySelectorAll("[data-slider]").forEach((slider) => {
      const slides = [...slider.querySelectorAll(".review-card")];
      const prev = slider.parentElement.querySelector("[data-slide-prev]");
      const next = slider.parentElement.querySelector("[data-slide-next]");
      let index = 0;
      const show = (newIndex) => {
        index = (newIndex + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
          const active = slideIndex === index;
          slide.classList.toggle("is-active", active);
          slide.setAttribute("aria-hidden", String(!active));
        });
      };
      prev?.addEventListener("click", () => show(index - 1));
      next?.addEventListener("click", () => show(index + 1));
      show(0);
    });
  }

  function initServiceModal() {
    const serviceData = {
      routine: {
        key: "routine",
        image: `${root}assets/images/unique/services-routine.webp`,
        alt: "Technician performing 42-point motorcycle service and fastener torque check",
        icon: "wrench",
        title: "Routine Servicing",
        kicker: "Comprehensive Preventive Care",
        price: "From ₹800",
        duration: "2–3 Hours",
        interval: "Every 3,000 – 5,000 km",
        lead: "Condition-led maintenance across fluids, filters, fasteners, chain, brakes, controls and tyres, finished with a complete 42-point road-readiness check.",
        included: [
          "Full 42-point safety & road-readiness multi-point inspection",
          "Spark plug inspection, cleaning and electrode gap adjustment",
          "Air filter inspection, cleaning or OEM replacement check",
          "Clutch & throttle cable lubrication and free-play calibration",
          "Brake pad friction measurement and hydraulic fluid check",
          "Drive chain tensioning, laser alignment and high-cling wax lubrication",
          "Critical chassis, axle and steering head bolt torque inspection",
          "Technician post-service test ride and handover report"
        ],
        tip: "Recommended before long road trips or every 6 months to catch subtle wear early and preserve engine reliability.",
        actionText: "Book Routine Service"
      },
      oil: {
        key: "oil",
        image: `${root}assets/images/unique/services-oil.webp`,
        alt: "Refilling motorcycle engine oil after filter replacement",
        icon: "droplets",
        title: "Engine Oil & Filter Service",
        kicker: "Thermal Protection & Smooth Shifting",
        price: "From ₹400 (Labour)",
        duration: "45–60 Minutes",
        interval: "Every 2,500 – 4,000 km",
        lead: "Warm drain, filter replacement and refill with the exact manufacturer-specified viscosity grade, followed by warm level and sump leak checks.",
        included: [
          "Complete warm engine oil drain and sump inspection",
          "OEM or high-performance oil filter replacement",
          "New crush washer and calibrated torque on drain bolt",
          "Refill with genuine grade oil (Mineral / Semi-Synthetic / Full Synthetic)",
          "Magnetic drain plug metal particle assessment",
          "Warm engine idle test and sight glass level verification",
          "Eco-friendly recycling of contaminated fluids"
        ],
        tip: "Fresh oil prevents clutch slipping, reduces engine operating temperature, and keeps gearbox shifts crisp and positive.",
        actionText: "Book Oil Change"
      },
      tyre: {
        key: "tyre",
        image: `${root}assets/images/unique/services-tyre.webp`,
        alt: "Motorcycle wheel balancing and tyre replacement with precision machine",
        icon: "circle-dot",
        title: "Tyre Replacement & Balancing",
        kicker: "Grip, Safety & Highway Stability",
        price: "From ₹1,200 / Tyre",
        duration: "60–90 Minutes",
        interval: "Tread < 2mm or compound > 4 yrs",
        lead: "Tread and age assessment, scratch-free rim removal, bead seating, high-speed dynamic balancing and pressure setup for your bike and riding load.",
        included: [
          "Tread depth, dry rot and tyre age safety assessment",
          "Scratch-free pneumatic mounting and dismounting",
          "New high-pressure rubber or angled alloy valve stems",
          "High-speed precision wheel balancing with lead-free weights",
          "Rim runout inspection for bends or spoke tension issues",
          "Exact cold tyre pressure calibration (solo or pillion)",
          "Axle shaft cleaning, greasing and torque to factory spec"
        ],
        tip: "Properly balanced wheels eliminate high-speed handlebar wobble and prevent uneven scalloping on highway rides.",
        actionText: "Book Tyre Service"
      },
      brake: {
        key: "brake",
        image: `${root}assets/images/unique/services-brake.webp`,
        alt: "Brake caliper disassembly, pad cleaning and hydraulic fluid bleed",
        icon: "disc-3",
        title: "Brake Servicing & Fluid Bleed",
        kicker: "Immediate Stopping Power & Lever Feel",
        price: "From ₹600",
        duration: "1–2 Hours",
        interval: "Every 6,000 km / Bleed every 2 yrs",
        lead: "Pad, rotor, caliper and fluid inspection with ultrasonic pin cleaning, high-temp slider lubrication and complete bubble-free hydraulic bleeding.",
        included: [
          "Brake pad friction material thickness & rotor runout measurement",
          "Caliper piston degreasing and ultrasonic slider pin cleaning",
          "Application of high-temperature silicone grease on sliders",
          "DOT 4 / DOT 5.1 high-boiling-point hydraulic fluid flush",
          "Pressure bleeding to eliminate spongy lever feel",
          "Master cylinder reservoir diaphragm check",
          "Controlled progressive emergency bite test"
        ],
        tip: "Brake fluid absorbs ambient humidity over time. Flushing every 2 years prevents dangerous vapor lock and brake fade on descents.",
        actionText: "Book Brake Service"
      },
      chain: {
        key: "chain",
        image: `${root}assets/images/unique/services-chain.webp`,
        alt: "Motorcycle drive chain cleaning, laser alignment and tensioning",
        icon: "link-2",
        title: "Chain Adjustment & Deep Clean",
        kicker: "Smooth Power Delivery & Drivetrain Life",
        price: "From ₹300",
        duration: "30–45 Minutes",
        interval: "Every 500 – 1,000 km",
        lead: "Chain slack, sprocket wear and rear-wheel alignment checked, then cleaned with O-ring safe solvent, adjusted to spec and lubricated with high-cling wax.",
        included: [
          "O-ring / X-ring safe solvent degreasing and heavy grime removal",
          "Laser-guided front-to-rear sprocket alignment check",
          "Slack measurement according to swingarm manufacturer spec",
          "Application of hydrophobic anti-fling synthetic chain wax",
          "Front countershaft sprocket & rear sprocket tooth wear assessment",
          "Rear axle nut torque to manufacturer specification"
        ],
        tip: "A clean, correctly aligned and waxed chain can extend drivetrain lifespan from 12,000 km to over 25,000 km.",
        actionText: "Book Chain Service"
      },
      diagnostics: {
        key: "diagnostics",
        image: `${root}assets/images/unique/services-diagnostics.webp`,
        alt: "Technician connecting digital diagnostic scanner to motorcycle port",
        icon: "scan-line",
        title: "Engine & Electrical Diagnostics",
        kicker: "Structured Testing Before Parts Are Replaced",
        price: "From ₹500",
        duration: "60–90 Minutes",
        interval: "Check engine light or rough idling",
        lead: "Scan data, mechanical compression checks and targeted electrical testing to pinpoint warning lights, rough running and intermittent sensor faults.",
        included: [
          "OBD-II and OEM-level scanner digital fault code extraction",
          "Live sensor stream analysis (O2, TPS, MAP, Coolant temp)",
          "Stator, regulator/rectifier & ignition coil load testing",
          "Fuel pump pressure and injector pulse duration check",
          "Cylinder compression & valve clearance check",
          "Full diagnostic report with photo evidence before any work"
        ],
        tip: "We measure and diagnose before swapping parts, saving you unnecessary component replacement expenses.",
        actionText: "Book Diagnostics"
      },
      battery: {
        key: "battery",
        image: `${root}assets/images/unique/services-battery.webp`,
        alt: "Battery cold-crank load testing and charging system check",
        icon: "battery-charging",
        title: "Battery & Charging System Service",
        kicker: "Instant Cold Cranks & Electrical Reliability",
        price: "From ₹1,000",
        duration: "30–60 Minutes",
        interval: "Every 2–3 Years",
        lead: "Charging-system health check, battery load test, terminal de-oxidation and precision installation of factory-spec AGM or Gel batteries.",
        included: [
          "Cold Cranking Amps (CCA) digital battery load test",
          "Stator charging output & regulator/rectifier load test",
          "Terminal corrosion removal & dielectric grease seal",
          "Fresh OEM-grade sealed maintenance-free battery installation",
          "Key-off parasitic current drain test to prevent discharge"
        ],
        tip: "A weak battery can overwork your starter motor and ignition coils. Always test before monsoon and winter seasons.",
        actionText: "Book Battery Service"
      }
    };

    let modal = document.getElementById("service-modal");
    if (!modal) {
      modal = document.createElement("dialog");
      modal.id = "service-modal";
      modal.className = "service-modal";
      modal.setAttribute("aria-labelledby", "modal-service-title");
      modal.innerHTML = `
        <div class="modal-dialog-inner">
          <button type="button" class="modal-close-btn" aria-label="Close dialog" data-close-modal>
            <i data-lucide="x" aria-hidden="true"></i>
          </button>
          <div class="modal-media-banner">
            <img id="modal-service-img" src="" alt="" width="600" height="240" class="modal-service-photo">
            <div class="modal-media-badge"><i data-lucide="shield-check" aria-hidden="true"></i> Verified Service Bay</div>
          </div>
          <div class="modal-header">
            <div>
              <span class="section-kicker" id="modal-service-kicker">Comprehensive Preventive Care</span>
              <h2 id="modal-service-title" class="modal-title">Routine Servicing</h2>
            </div>
          </div>
          
          <div class="modal-badges">
            <span class="modal-pill"><i data-lucide="tag" aria-hidden="true"></i> <strong id="modal-service-price">From ₹800</strong></span>
            <span class="modal-pill"><i data-lucide="clock" aria-hidden="true"></i> <strong id="modal-service-duration">2–3 Hours</strong></span>
            <span class="modal-pill"><i data-lucide="calendar" aria-hidden="true"></i> <span id="modal-service-interval">Every 3,000 – 5,000 km</span></span>
          </div>

          <p class="modal-lead" id="modal-service-lead"></p>

          <div class="modal-section">
            <h3 class="modal-section-heading"><i data-lucide="check-circle-2" aria-hidden="true"></i> What's Included in This Service</h3>
            <ul class="modal-checklist" id="modal-service-checklist"></ul>
          </div>

          <div class="modal-tip-box">
            <i data-lucide="lightbulb" class="modal-tip-icon" aria-hidden="true"></i>
            <div class="modal-tip-content">
              <strong>Workshop Tip</strong>
              <p id="modal-service-tip"></p>
            </div>
          </div>

          <div class="modal-actions">
            <a href="#" id="modal-service-book-btn" class="btn">Book This Service <i data-lucide="arrow-right" aria-hidden="true"></i></a>
            <button type="button" class="btn btn-outline" data-close-modal>Close</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      // Close on backdrop click
      modal.addEventListener("click", (e) => {
        const rect = modal.getBoundingClientRect();
        const isInDialog = (
          rect.top <= e.clientY &&
          e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX &&
          e.clientX <= rect.left + rect.width
        );
        if (!isInDialog) modal.close();
      });

      // Close button clicks
      modal.querySelectorAll("[data-close-modal]").forEach((btn) => {
        btn.addEventListener("click", () => modal.close());
      });

      // Restore back-to-top button when modal closes
      modal.addEventListener("close", () => {
        const btt = document.querySelector(".back-to-top");
        if (btt) btt.style.visibility = "";
      });
    }

    const openService = (key) => {
      const data = serviceData[key];
      if (!data) return;

      const imgEl = modal.querySelector("#modal-service-img");
      if (imgEl && data.image) {
        imgEl.src = data.image;
        imgEl.alt = data.alt || data.title;
      }

      modal.querySelector("#modal-service-kicker").textContent = data.kicker;
      modal.querySelector("#modal-service-title").textContent = data.title;
      modal.querySelector("#modal-service-price").textContent = data.price;
      modal.querySelector("#modal-service-duration").textContent = data.duration;
      modal.querySelector("#modal-service-interval").textContent = data.interval;
      modal.querySelector("#modal-service-lead").textContent = data.lead;
      modal.querySelector("#modal-service-tip").textContent = data.tip;

      const checklist = modal.querySelector("#modal-service-checklist");
      checklist.innerHTML = data.included.map((item) => `<li>${item}</li>`).join("");

      const bookBtn = modal.querySelector("#modal-service-book-btn");
      const contactPath = root ? "contact.html" : "pages/contact.html";
      bookBtn.href = `${contactPath}?service=${data.key}#book`;
      bookBtn.innerHTML = `${data.actionText} <i data-lucide="arrow-right" aria-hidden="true"></i>`;

      if (window.lucide) window.lucide.createIcons({ root: modal, attrs: { "stroke-width": 1.8 } });

      // Hide back-to-top button behind modal
      const btt = document.querySelector(".back-to-top");
      if (btt) btt.style.visibility = "hidden";
      if (typeof modal.showModal === "function") {
        modal.showModal();
      } else {
        modal.setAttribute("open", "");
      }
    };

    // Attach click listeners to cards and trigger buttons
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-service], [data-service-key], .service-modal-trigger");
      if (!trigger) return;

      // If clicking directly on a book service link, let the user decide or open modal if requested
      const key = trigger.dataset.service || trigger.dataset.serviceKey || trigger.closest("[data-service-key]")?.dataset.serviceKey;
      if (key && serviceData[key]) {
        e.preventDefault();
        openService(key);
      }
    });
  }

  function initDiagnosticHub() {
    const hub = document.querySelector(".diagnostic-hub-wrapper");
    if (!hub) return;

    const tabs = [...hub.querySelectorAll(".hub-tab")];
    const panels = [...hub.querySelectorAll(".hub-panel")];
    const symptomPills = [...document.querySelectorAll(".symptom-pill")];

    const activateStation = (stationId, shouldFocusTab = false) => {
      // Update tabs
      tabs.forEach((tab) => {
        const isMatch = tab.dataset.station === stationId;
        tab.classList.toggle("active", isMatch);
        tab.setAttribute("aria-selected", String(isMatch));
        tab.setAttribute("tabindex", isMatch ? "0" : "-1");
        if (isMatch && shouldFocusTab) {
          tab.focus();
        }
      });

      // Update panels
      panels.forEach((panel) => {
        const isMatch = panel.id === `panel-${stationId}`;
        panel.classList.toggle("active", isMatch);
        panel.hidden = !isMatch;
      });

      // Update symptom pills
      symptomPills.forEach((pill) => {
        const isMatch = pill.dataset.targetStation === stationId;
        pill.classList.toggle("active", isMatch);
      });

      // Refresh Lucide icons inside active panel if needed
      if (window.lucide) {
        window.lucide.createIcons({
          root: hub,
          attrs: { "stroke-width": 1.8 }
        });
      }
    };

    // Tab click & keyboard navigation
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        activateStation(tab.dataset.station, false);
      });

      tab.addEventListener("keydown", (e) => {
        let targetIndex = -1;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          targetIndex = (index + 1) % tabs.length;
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          targetIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (e.key === "Home") {
          targetIndex = 0;
        } else if (e.key === "End") {
          targetIndex = tabs.length - 1;
        }

        if (targetIndex !== -1) {
          e.preventDefault();
          activateStation(tabs[targetIndex].dataset.station, true);
        }
      });
    });

    // Symptom pills click
    symptomPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        const station = pill.dataset.targetStation;
        if (station) {
          activateStation(station, false);
        }
      });
    });
  }

  function initForgotPasswordModal() {
    const modal = document.querySelector("#forgot-password-modal");
    if (!modal) return;

    const openTriggers = document.querySelectorAll("#forgot-password-trigger, [data-modal-open='forgot-password-modal']");
    const closeBtn = modal.querySelector("#forgot-modal-close");
    const backBtn = modal.querySelector("#forgot-modal-back");

    const openModal = () => {
      if (typeof modal.showModal === "function") {
        modal.showModal();
      } else {
        modal.setAttribute("open", "");
      }
      if (window.lucide) window.lucide.createIcons({ root: modal, attrs: { "stroke-width": 1.8 } });
      const emailInput = modal.querySelector("#reset-email");
      if (emailInput) {
        const signinEmail = document.querySelector("#signin-email")?.value;
        if (signinEmail && !emailInput.value) {
          emailInput.value = signinEmail;
        }
        setTimeout(() => emailInput.focus(), 50);
      }
    };

    const closeModal = () => {
      if (typeof modal.close === "function") {
        modal.close();
      } else {
        modal.removeAttribute("open");
      }
    };

    openTriggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
      });
    });

    closeBtn?.addEventListener("click", closeModal);
    backBtn?.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  injectChrome();
  initTheme();
  initRTL();
  initMenu();
  initDropdowns();
  initHeader();
  initScrollProgress();
  initBackToTop();
  initCounters();
  initReveal();
  initValidation();
  initDateFields();
  initCalculator();
  initSlider();
  initServiceModal();
  initDiagnosticHub();
  initForgotPasswordModal();

  document.querySelectorAll("[data-year]").forEach((node) => node.textContent = new Date().getFullYear());
  if (window.lucide) window.lucide.createIcons({ attrs: { "stroke-width": 1.8 } });
})();
