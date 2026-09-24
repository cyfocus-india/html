/**
 * CareWell Home Nursing & Patient Care Agency
 * Core JavaScript: Navigation, Layout, Themes, Interactivity & Forms
 */

// Theme & Direction Initialization
const savedTheme = localStorage.getItem("carewell-theme") || "light";
const savedDirection = localStorage.getItem("carewell-direction") || "ltr";
document.documentElement.dataset.theme = savedTheme;
document.documentElement.dir = savedDirection;

// Path & Routing Resolution
const pathSegments = window.location.pathname.replace(/\\/g, "/").split("/");
const currentFile = pathSegments.pop() || "index.html";
const isInsidePages = pathSegments.includes("pages") || window.location.pathname.replace(/\\/g, "/").includes("/pages/");
const rootPrefix = isInsidePages ? "../" : "./";
const pagesPrefix = isInsidePages ? "./" : "pages/";
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function navAnchor(href, label, activeFile = href.split("/").pop()) {
  const active = currentFile === activeFile ? " active" : "";
  return `<a class="nav-link page-link${active}" href="${href}">${label}</a>`;
}

function ensureSvgSprite() {
  if (document.querySelector(".svg-sprite")) return;
  const sprite = document.createElement("div");
  sprite.innerHTML = `
    <svg class="svg-sprite" style="display:none" aria-hidden="true">
      <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
      <symbol id="i-phone" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
      <symbol id="i-heart" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.5 12h2l1-2.3 2 4.6 1.1-2.3h1.9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
      <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="m9 12 2 2 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
      <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
      <symbol id="i-user" viewBox="0 0 24 24"><path d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
      <symbol id="i-users" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
      <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
      <symbol id="i-bag" viewBox="0 0 24 24"><path d="M5 8h14l1 13H4L5 8zM9 8V5a3 3 0 0 1 6 0v3M12 11v6M9 14h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
      <symbol id="i-walk" viewBox="0 0 24 24"><circle cx="14" cy="4" r="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="m10 21 2-6-3-3 2-5 4 3 3 1M14 12l-2 3 5 6M8 8 5 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
      <symbol id="i-bandage" viewBox="0 0 24 24"><path d="m8.5 3.5 12 12a3.54 3.54 0 0 1-5 5l-12-12a3.54 3.54 0 0 1 5-5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="m14 9-5 5M9.5 7.5h.01M16.5 14.5h.01" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
      <symbol id="i-pill" viewBox="0 0 24 24"><path d="m10.5 20.5-7-7a4.95 4.95 0 0 1 7-7l7 7a4.95 4.95 0 0 1-7 7zM7 17l10-10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
      <symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="m3 7 9 6 9-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
      <symbol id="i-pin" viewBox="0 0 24 24"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="10" r="2" fill="none" stroke="currentColor" stroke-width="2"/></symbol>
      <symbol id="i-headset" viewBox="0 0 24 24"><path d="M4 14a8 8 0 0 1 16 0M18 19c0 2-2 3-5 3M4 14v4a2 2 0 0 0 2 2h1v-8H6a2 2 0 0 0-2 2zM20 14v4a2 2 0 0 1-2 2h-1v-8h1a2 2 0 0 1 2 2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
      <symbol id="i-send" viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4 20-7zM22 2 11 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>
      <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
      <symbol id="i-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
    </svg>`;
  document.body.prepend(sprite.firstElementChild);
}

const noChromePages = ["signin.html", "signup.html", "404.html", "coming-soon.html"];

function buildSiteChrome() {
  ensureSvgSprite();
  if (noChromePages.includes(currentFile)) {
    document.querySelector(".site-header")?.remove();
    document.querySelector("footer")?.remove();
    return;
  }
  const desktopNav = document.querySelector(".desktop-nav");
  if (desktopNav) {
    const homeActive = ["index.html", "index1.html", "home-2.html"].includes(currentFile) ? " active" : "";
    const pagesActive = ["testimonials.html", "faq.html", "coming-soon.html", "404.html", "privacy.html", "terms.html"].includes(currentFile) ? " active" : "";
    desktopNav.innerHTML = `
      <div class="nav-dropdown${homeActive}">
        <button class="nav-link dropdown-toggle" type="button" aria-expanded="false">Home <span aria-hidden="true">⌄</span></button>
        <div class="dropdown-menu">
          <a class="page-link" href="${rootPrefix}index.html">Home 1</a>
          <a class="page-link" href="${rootPrefix}index1.html">Home 2</a>
        </div>
      </div>
      ${navAnchor(`${pagesPrefix}about.html`, "About Us")}
      ${navAnchor(`${pagesPrefix}services.html`, "Services")}
      ${navAnchor(`${pagesPrefix}caregivers.html`, "Caregivers")}
      ${navAnchor(`${pagesPrefix}pricing.html`, "Pricing")}
      ${navAnchor(`${pagesPrefix}contact.html`, "Contact")}
      <div class="nav-dropdown${pagesActive}">
        <button class="nav-link dropdown-toggle" type="button" aria-expanded="false">Pages <span aria-hidden="true">⌄</span></button>
        <div class="dropdown-menu">
          <a class="page-link" href="${pagesPrefix}testimonials.html">Testimonials</a>
          <a class="page-link" href="${pagesPrefix}faq.html">FAQ</a>
          <a class="page-link" href="${pagesPrefix}coming-soon.html">Coming Soon</a>
          <a class="page-link" href="${pagesPrefix}404.html">404</a>
          <a class="page-link" href="${pagesPrefix}privacy.html">Privacy Policy</a>
          <a class="page-link" href="${pagesPrefix}terms.html">Terms &amp; Conditions</a>
        </div>
      </div>`;
  }

  const oldPhone = document.querySelector(".phone-pill");
  const headerTools = document.createElement("div");
  headerTools.className = "header-tools";
  headerTools.innerHTML = `
    <button class="utility-button theme-toggle" type="button" aria-label="Switch color theme"><span class="theme-icon" aria-hidden="true">☾</span></button>
    <button class="utility-button direction-toggle" type="button" aria-label="Switch text direction">RTL</button>
    <a class="signin-button page-link" href="${pagesPrefix}signin.html">Sign In <span aria-hidden="true">→</span></a>`;
  if (oldPhone) oldPhone.replaceWith(headerTools);
  else document.querySelector(".nav-shell")?.insertBefore(headerTools, document.querySelector(".menu-toggle"));

  const mobileNav = document.querySelector(".mobile-nav");
  if (mobileNav) {
    mobileNav.innerHTML = `
      <a class="button button-primary mobile-signin-link page-link" href="${pagesPrefix}signin.html">Sign In <span aria-hidden="true">→</span></a>
      <details class="mobile-dropdown"><summary>Home ⌄</summary><a class="page-link" href="${rootPrefix}index.html">Home 1</a><a class="page-link" href="${rootPrefix}index1.html">Home 2</a></details>
      <a class="page-link" href="${pagesPrefix}about.html">About Us</a>
      <a class="page-link" href="${pagesPrefix}services.html">Services</a>
      <a class="page-link" href="${pagesPrefix}caregivers.html">Caregivers</a>
      <a class="page-link" href="${pagesPrefix}pricing.html">Pricing</a>
      <a class="page-link" href="${pagesPrefix}contact.html">Contact</a>
      <details class="mobile-dropdown"><summary>Pages ⌄</summary><a class="page-link" href="${pagesPrefix}testimonials.html">Testimonials</a><a class="page-link" href="${pagesPrefix}faq.html">FAQ</a><a class="page-link" href="${pagesPrefix}coming-soon.html">Coming Soon</a><a class="page-link" href="${pagesPrefix}404.html">404</a><a class="page-link" href="${pagesPrefix}privacy.html">Privacy Policy</a><a class="page-link" href="${pagesPrefix}terms.html">Terms &amp; Conditions</a></details>`;
  }

  let footer = document.querySelector("footer");
  if (!footer) {
    footer = document.createElement("footer");
    document.body.appendChild(footer);
  }
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="footer-shell glass">
      <div class="footer-grid">
        <div class="footer-brand-column">
          <a class="brand page-link" href="${rootPrefix}index.html">
            <span class="brand-mark">
              <svg viewBox="0 0 42 38"><path d="M21 35C14 29 3 21 3 11.6 3 4.2 12.3.2 18 6.8L21 10l3-3.2C29.7.2 39 4.2 39 11.6 39 21 28 29 21 35Z"/><path class="brand-line" d="M12.5 12c3-3.3 6.2-.8 6.2 2.1 0 4.4-1.6 7.7 2.3 12.2 3.8-4.4 2.2-7.8 2.2-12.2 0-3 3.3-5.4 6.3-2.1"/><circle class="brand-dot" cx="21" cy="9" r="2.3"/></svg>
            </span>
            <span><strong>CareWell</strong><small>HOME NURSING</small></span>
          </a>
          <p>Compassionate, professional home nursing that helps every patient feel safe, respected, and comfortable at home.</p>
          <div class="footer-badge">24/7 care coordination</div>
        </div>
        <div>
          <h3>Navigation</h3>
          <a class="page-link" href="${rootPrefix}index.html">Home 1</a>
          <a class="page-link" href="${rootPrefix}index1.html">Home 2</a>
          <a class="page-link" href="${pagesPrefix}about.html">About Us</a>
          <a class="page-link" href="${pagesPrefix}services.html">Services</a>
          <a class="page-link" href="${pagesPrefix}caregivers.html">Caregivers</a>
        </div>
        <div>
          <h3>Care &amp; Pricing</h3>
          <a class="page-link" href="${pagesPrefix}pricing.html">Pricing</a>
          <a class="page-link" href="${pagesPrefix}testimonials.html">Testimonials</a>
          <a class="page-link" href="${pagesPrefix}faq.html">FAQ</a>
          <a class="page-link" href="${pagesPrefix}contact.html">Contact</a>
        </div>
        <div>
          <h3>Account &amp; Other</h3>
          <a class="page-link" href="${pagesPrefix}signin.html">Sign In</a>
          <a class="page-link" href="${pagesPrefix}signup.html">Sign Up</a>
          <a class="page-link" href="${pagesPrefix}coming-soon.html">Coming Soon</a>
          <a class="page-link" href="${pagesPrefix}404.html">404</a>
          <a class="page-link" href="${pagesPrefix}privacy.html">Privacy Policy</a>
          <a class="page-link" href="${pagesPrefix}terms.html">Terms &amp; Conditions</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© <span class="current-year"></span> CareWell Home Nursing. All rights reserved.</span>
        <span>
          <a class="page-link" href="${pagesPrefix}privacy.html">Privacy Policy</a>
          <a class="page-link" href="${pagesPrefix}terms.html">Terms &amp; Conditions</a>
          <a class="page-link" href="${pagesPrefix}contact.html">Contact</a>
        </span>
      </div>
    </div>`;
}

function injectSupportingSections() {
  if (noChromePages.includes(currentFile)) return;
  const main = document.querySelector(".subpage-main");
  if (!main || document.querySelector(".support-section")) return;
  const templates = {
    "services.html": `<section class="support-section glass reveal"><div class="support-heading"><span>How care begins</span><h2>A simple path to better support</h2><p>From the first call to ongoing reviews, every detail is coordinated around your family.</p></div><div class="process-grid"><article><b>01</b><h3>Care consultation</h3><p>We listen, understand routines, and identify the right level of support.</p></article><article><b>02</b><h3>Caregiver matching</h3><p>We match experience, availability, language, and personality.</p></article><article><b>03</b><h3>Personal care plan</h3><p>Your plan is documented clearly and adjusted whenever needs change.</p></article><article><b>04</b><h3>Ongoing follow-up</h3><p>Our care coordinators stay connected and review quality regularly.</p></article></div></section>`,
    "caregivers.html": `<section class="support-section glass reveal"><div class="support-heading"><span>Carefully selected</span><h2>People chosen for skill and character</h2><p>Clinical ability matters. Kindness, reliability, communication, and respect matter just as much.</p></div><div class="feature-row"><article><strong>6-step</strong><span>Screening &amp; reference verification</span></article><article><strong>100%</strong><span>Identity &amp; background verified</span></article><article><strong>Monthly</strong><span>Quality &amp; care-plan reviews</span></article><article><strong>24/7</strong><span>Family care support line</span></article></div></section>`,
    "pricing.html": `<section class="support-section glass reveal"><div class="support-heading"><span>Every plan includes</span><h2>Clear care, without surprise charges</h2><p>Change hours, upgrade support, or pause care with straightforward coordination.</p></div><div class="feature-row"><article><strong>No</strong><span>Hidden joining or matching fees</span></article><article><strong>Flexible</strong><span>Hours &amp; care schedules</span></article><article><strong>Included</strong><span>Family progress updates</span></article><article><strong>Free</strong><span>Initial care consultation</span></article></div></section>`,
    "contact.html": `<section class="support-section glass reveal"><div class="support-heading"><span>Always responsive</span><h2>What happens after you contact us?</h2><p>A care coordinator reviews your request, calls to understand your needs, and recommends a practical next step.</p></div><div class="process-grid compact"><article><b>1</b><h3>Response</h3><p>Within minutes during support hours.</p></article><article><b>2</b><h3>Consultation</h3><p>A private, no-pressure care discussion.</p></article><article><b>3</b><h3>Care start</h3><p>Often available within 24–48 hours.</p></article></div></section>`
  };
  if (templates[currentFile]) main.insertAdjacentHTML("beforeend", templates[currentFile]);
}

buildSiteChrome();
injectSupportingSections();

const menuButton = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section-anchor");
const serviceSelect = document.querySelector("#service-select");

document.querySelectorAll("#year, .current-year").forEach((year) => {
  year.textContent = new Date().getFullYear();
});
requestAnimationFrame(() => document.body.classList.add("page-ready"));

function syncUtilityControls() {
  const isDark = document.documentElement.dataset.theme === "dark";
  const isRtl = document.documentElement.dir === "rtl";
  document.querySelectorAll(".theme-icon").forEach((icon) => {
    icon.textContent = isDark ? "☀" : "☾";
  });
  document.querySelectorAll(".direction-toggle").forEach((button) => {
    button.textContent = isRtl ? "LTR" : "RTL";
  });
}

document.querySelectorAll(".theme-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("carewell-theme", nextTheme);
    syncUtilityControls();
  });
});

document.querySelectorAll(".direction-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const nextDirection = document.documentElement.dir === "rtl" ? "ltr" : "rtl";
    document.documentElement.dir = nextDirection;
    localStorage.setItem("carewell-direction", nextDirection);
    syncUtilityControls();
  });
});
syncUtilityControls();

// Desktop Dropdowns
document.querySelectorAll(".dropdown-toggle").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const dropdown = button.closest(".nav-dropdown");
    const open = dropdown.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
    document.querySelectorAll(".nav-dropdown.open").forEach((other) => {
      if (other === dropdown) return;
      other.classList.remove("open");
      other.querySelector(".dropdown-toggle")?.setAttribute("aria-expanded", "false");
    });
  });
});

document.addEventListener("click", () => {
  document.querySelectorAll(".nav-dropdown.open").forEach((dropdown) => {
    dropdown.classList.remove("open");
    dropdown.querySelector(".dropdown-toggle")?.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  document.querySelectorAll(".nav-dropdown.open").forEach((dropdown) => {
    dropdown.classList.remove("open");
    dropdown.querySelector(".dropdown-toggle")?.setAttribute("aria-expanded", "false");
  });
});

// Mobile Navigation
function closeMenu() {
  if (!menuButton || !mobileNav) return;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open menu");
  mobileNav.classList.remove("open");
}

if (menuButton && mobileNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
    mobileNav.classList.toggle("open", !isOpen);
  });

  mobileNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => event.key === "Escape" && closeMenu());
}

// Reveal on Scroll
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -30px" }
);

document.querySelectorAll(".reveal").forEach((element) => {
  if (reducedMotion) element.classList.add("revealed");
  else revealObserver.observe(element);
});

// Section Observer for Single-Page anchors
const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    const matchingLink = [...navLinks].find((link) => link.hash === `#${visible.target.id}`);
    navLinks.forEach((link) => {
      const staysHomeActive = !matchingLink && link.hash === "#home";
      link.classList.toggle("active", link === matchingLink || staysHomeActive);
    });
  },
  { rootMargin: "-20% 0px -60%", threshold: [0.05, 0.2, 0.5] }
);

if (!document.body.classList.contains("inner-body")) {
  sections.forEach((section) => sectionObserver.observe(section));
}

// Universal Smooth Number Counter Animation Engine for All Pages
function initAnimatedCounters() {
  const counterElements = document.querySelectorAll(
    ".count, [data-target], .feature-row article strong, .mini-proof div strong, .mini-stat strong, .stats-grid strong, .caregiver-stats strong, .rating-card strong, .support-card strong"
  );

  const parsedCounters = [];

  counterElements.forEach((el) => {
    if (el.dataset.counterInitialized) return;
    el.dataset.counterInitialized = "true";

    const fullText = el.textContent.trim();
    let target = el.dataset.target !== undefined ? parseFloat(el.dataset.target) : null;
    let prefix = el.dataset.prefix || "";
    let suffix = el.dataset.suffix || "";
    let decimals = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;
    let useCommas = true;

    // Parse target from existing text if data-target is omitted
    if (target === null || isNaN(target)) {
      const match = fullText.match(/^([^\d.]*)(\d+(?:,\d+)*(?:\.\d+)?)(.*)$/);
      if (match) {
        prefix = match[1];
        const numStr = match[2].replace(/,/g, "");
        target = parseFloat(numStr);
        suffix = match[3];
        if (match[2].includes(".")) {
          decimals = match[2].split(".")[1].length;
        }
      } else {
        return; // Ignore text words like "Flexible" or "Personal"
      }
    }

    if (isNaN(target)) return;

    // Set initial text representation
    const initialFormatted = (0).toFixed(decimals);
    el.textContent = `${prefix}${initialFormatted}${suffix}`;

    parsedCounters.push({
      el,
      target,
      prefix,
      suffix,
      decimals,
      useCommas
    });
  });

  if (!parsedCounters.length) return;

  function runCounterAnimation(item) {
    const { el, target, prefix, suffix, decimals, useCommas } = item;
    const startTime = performance.now();
    const duration = Math.min(1800, Math.max(900, target > 100 ? 1400 : 1000));

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Quintic ease-out curve for natural deceleration
      const ease = 1 - Math.pow(1 - progress, 4);
      const currentVal = target * ease;

      let formattedNumber;
      if (decimals > 0) {
        formattedNumber = currentVal.toFixed(decimals);
      } else {
        const intVal = Math.round(currentVal);
        formattedNumber = useCommas ? intVal.toLocaleString("en-US") : String(intVal);
      }

      el.textContent = `${prefix}${formattedNumber}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        let finalFormatted;
        if (decimals > 0) {
          finalFormatted = target.toFixed(decimals);
        } else {
          finalFormatted = useCommas ? Math.round(target).toLocaleString("en-US") : String(Math.round(target));
        }
        el.textContent = `${prefix}${finalFormatted}${suffix}`;
      }
    }

    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const item = parsedCounters.find((c) => c.el === entry.target);
          if (item) {
            runCounterAnimation(item);
            counterObserver.unobserve(entry.target);
          }
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  parsedCounters.forEach((item) => {
    if (reducedMotion) {
      const finalFormatted = item.decimals > 0 
        ? item.target.toFixed(item.decimals) 
        : (item.useCommas ? Math.round(item.target).toLocaleString("en-US") : String(Math.round(item.target)));
      item.el.textContent = `${item.prefix}${finalFormatted}${item.suffix}`;
    } else {
      counterObserver.observe(item.el);
    }
  });
}

initAnimatedCounters();

// Separate Smart Service & Pricing Selection Engines
function selectServiceOption(query) {
  const serviceSelect = document.querySelector("#service-select");
  if (!serviceSelect || !query) return;
  const decoded = decodeURIComponent(query);
  const normalized = decoded.toLowerCase().replace(/[-_/]/g, " ").trim();
  const raw = decoded.toLowerCase().trim();
  
  let match = [...serviceSelect.options].find((opt) => {
    if (!opt.value) return false;
    const val = opt.value.toLowerCase();
    const txt = opt.text.toLowerCase();
    return val === raw || txt === raw || val.replace(/[-_/]/g, " ") === normalized || txt.replace(/[-_/]/g, " ") === normalized;
  });

  if (!match) {
    match = [...serviceSelect.options].find((opt) => {
      if (!opt.value) return false;
      const valNorm = opt.value.toLowerCase().replace(/[-_/]/g, " ");
      const txtNorm = opt.text.toLowerCase().replace(/[-_/]/g, " ");
      return valNorm.includes(normalized) || normalized.includes(valNorm) || txtNorm.includes(normalized);
    });
  }

  if (!match) {
    if (normalized.includes("24 7") || normalized.includes("247") || normalized.includes("live in") || normalized.includes("livein") || normalized.includes("respite")) {
      match = [...serviceSelect.options].find((opt) => opt.value.includes("24/7") || opt.value.includes("Live-In"));
    } else if (normalized.includes("surg") || normalized.includes("post")) {
      match = [...serviceSelect.options].find((opt) => opt.value.includes("Surgery"));
    } else if (normalized.includes("companion") || normalized.includes("elderly") || normalized.includes("daily")) {
      match = [...serviceSelect.options].find((opt) => opt.value.includes("Companion"));
    } else if (normalized.includes("physio") || normalized.includes("therap") || normalized.includes("rehab")) {
      match = [...serviceSelect.options].find((opt) => opt.value.includes("Physiotherapy"));
    } else if (normalized.includes("wound") || normalized.includes("dress") || normalized.includes("sterile")) {
      match = [...serviceSelect.options].find((opt) => opt.value.includes("Wound"));
    } else if (normalized.includes("medic") || normalized.includes("pill") || normalized.includes("vital")) {
      match = [...serviceSelect.options].find((opt) => opt.value.includes("Medication"));
    } else if (normalized.includes("dementia") || normalized.includes("memory") || normalized.includes("alzheimer")) {
      match = [...serviceSelect.options].find((opt) => opt.value.includes("Memory"));
    } else if (normalized.includes("palliative") || normalized.includes("hospice")) {
      match = [...serviceSelect.options].find((opt) => opt.value.includes("Palliative"));
    } else if (normalized.includes("hospital") || normalized.includes("transit")) {
      match = [...serviceSelect.options].find((opt) => opt.value.includes("Hospital"));
    }
  }

  if (match) {
    serviceSelect.value = match.value;
    serviceSelect.classList.remove("auto-selected");
    void serviceSelect.offsetWidth; // force DOM reflow
    serviceSelect.classList.add("auto-selected");
    setTimeout(() => serviceSelect.classList.remove("auto-selected"), 2500);

    // If 24/7 was selected, also auto-select 24/7 pricing plan if pricing is not set
    if (match.value.includes("24/7") || match.value.includes("Live-In")) {
      const pricingSelect = document.querySelector("#pricing-select");
      if (pricingSelect && (!pricingSelect.value || !pricingSelect.value.includes("24/7"))) {
        const planMatch = [...pricingSelect.options].find((opt) => opt.value.includes("24/7") || opt.value.includes("Live-In"));
        if (planMatch) {
          pricingSelect.value = planMatch.value;
          pricingSelect.classList.remove("auto-selected");
          void pricingSelect.offsetWidth;
          pricingSelect.classList.add("auto-selected");
          setTimeout(() => pricingSelect.classList.remove("auto-selected"), 2500);
        }
      }
    }
  }
}

function selectPricingOption(query) {
  const pricingSelect = document.querySelector("#pricing-select");
  if (!pricingSelect || !query) return;
  const decoded = decodeURIComponent(query);
  const normalized = decoded.toLowerCase().replace(/[-_/]/g, " ").trim();
  const raw = decoded.toLowerCase().trim();
  
  let match = [...pricingSelect.options].find((opt) => {
    if (!opt.value) return false;
    const val = opt.value.toLowerCase();
    const txt = opt.text.toLowerCase();
    return val === raw || txt === raw || val.replace(/[-_/]/g, " ") === normalized || txt.replace(/[-_/]/g, " ") === normalized;
  });

  if (!match) {
    match = [...pricingSelect.options].find((opt) => {
      if (!opt.value) return false;
      const valNorm = opt.value.toLowerCase().replace(/[-_/]/g, " ");
      const txtNorm = opt.text.toLowerCase().replace(/[-_/]/g, " ");
      return valNorm.includes(normalized) || normalized.includes(valNorm) || txtNorm.includes(normalized);
    });
  }

  if (!match) {
    if (normalized.includes("24 7") || normalized.includes("247") || normalized.includes("live in") || normalized.includes("livein") || normalized.includes("respite")) {
      match = [...pricingSelect.options].find((opt) => opt.value.includes("24/7") || opt.value.includes("Live-In"));
    } else if (normalized.includes("hour")) {
      match = [...pricingSelect.options].find((opt) => opt.value.includes("Hourly"));
    } else if (normalized.includes("dai")) {
      match = [...pricingSelect.options].find((opt) => opt.value.includes("Daily"));
    } else if (normalized.includes("week")) {
      match = [...pricingSelect.options].find((opt) => opt.value.includes("Weekly"));
    } else if (normalized.includes("custom") || normalized.includes("plan")) {
      match = [...pricingSelect.options].find((opt) => opt.value.includes("Custom"));
    }
  }

  if (match) {
    pricingSelect.value = match.value;
    pricingSelect.classList.remove("auto-selected");
    void pricingSelect.offsetWidth; // force DOM reflow
    pricingSelect.classList.add("auto-selected");
    setTimeout(() => pricingSelect.classList.remove("auto-selected"), 2500);

    // If 24/7 was selected, also auto-select 24/7 service if service is not set
    if (match.value.includes("24/7") || match.value.includes("Live-In")) {
      const serviceSelect = document.querySelector("#service-select");
      if (serviceSelect && (!serviceSelect.value || !serviceSelect.value.includes("24/7"))) {
        const servMatch = [...serviceSelect.options].find((opt) => opt.value.includes("24/7") || opt.value.includes("Live-In"));
        if (servMatch) {
          serviceSelect.value = servMatch.value;
          serviceSelect.classList.remove("auto-selected");
          void serviceSelect.offsetWidth;
          serviceSelect.classList.add("auto-selected");
          setTimeout(() => serviceSelect.classList.remove("auto-selected"), 2500);
        }
      }
    }
  }
}

function selectSpecialistOption(query) {
  const specialistSelect = document.querySelector("#specialist-select");
  if (!specialistSelect || !query) return;
  const raw = decodeURIComponent(query).toLowerCase().trim().replace(/[-_]/g, " ");

  let match = [...specialistSelect.options].find(
    (opt) => opt.value && (opt.value.toLowerCase() === raw || opt.text.toLowerCase() === raw)
  );

  if (!match) {
    match = [...specialistSelect.options].find(
      (opt) => opt.value && (opt.value.toLowerCase().includes(raw) || raw.includes(opt.value.toLowerCase()) || opt.text.toLowerCase().includes(raw))
    );
  }

  if (!match) {
    if (raw.includes("evelyn") || raw.includes("vance")) match = [...specialistSelect.options].find((opt) => opt.value.includes("Evelyn"));
    else if (raw.includes("david") || raw.includes("sterling")) match = [...specialistSelect.options].find((opt) => opt.value.includes("David"));
    else if (raw.includes("elena") || raw.includes("rostova") || raw.includes("dpt")) match = [...specialistSelect.options].find((opt) => opt.value.includes("Elena"));
    else if (raw.includes("marcus") || raw.includes("chen")) match = [...specialistSelect.options].find((opt) => opt.value.includes("Marcus"));
    else if (raw.includes("priya") || raw.includes("sharma")) match = [...specialistSelect.options].find((opt) => opt.value.includes("Priya"));
    else if (raw.includes("sarah") || raw.includes("jenkins")) match = [...specialistSelect.options].find((opt) => opt.value.includes("Sarah"));
  }

  if (match) {
    specialistSelect.value = match.value;
    specialistSelect.classList.remove("auto-selected");
    void specialistSelect.offsetWidth; // force DOM reflow
    specialistSelect.classList.add("auto-selected");
    setTimeout(() => specialistSelect.classList.remove("auto-selected"), 2500);

    // Auto-select corresponding service if service-select has no value
    const serviceSelect = document.querySelector("#service-select");
    if (serviceSelect && !serviceSelect.value) {
      if (match.value.includes("Evelyn") || match.value.includes("David")) {
        selectServiceOption("Post-Surgery Care");
      } else if (match.value.includes("Elena")) {
        selectServiceOption("Physiotherapy Assistance");
      } else if (match.value.includes("Marcus")) {
        selectServiceOption("Medication Management");
      } else if (match.value.includes("Priya")) {
        selectServiceOption("Elderly Companion Care");
      } else if (match.value.includes("Sarah")) {
        selectServiceOption("Wound Dressing & Clinical Care");
      }
    }

    // Smooth-scroll to the inquiry form on page load so the user sees the pre-selected specialist
    const contactSection = document.querySelector("#contact") || document.querySelector("#inquiry-form");
    if (contactSection) {
      setTimeout(() => {
        contactSection.scrollIntoView({ behavior: "smooth", block: "center" });
        const nameInput = document.querySelector('input[name="name"]');
        if (nameInput && !nameInput.value) {
          nameInput.focus({ preventScroll: true });
        }
      }, 350);
    }
  }
}

function autoSelectFormOption(query) {
  if (!query) return;
  const raw = decodeURIComponent(query).toLowerCase().replace(/[-_/]/g, " ").trim();
  const is247 = raw.includes("24 7") || raw.includes("247") || raw.includes("live in") || raw.includes("livein") || raw.includes("respite");
  const isPricing = is247 || raw.includes("hour") || raw.includes("dai") || raw.includes("week") || raw.includes("custom") || raw.includes("plan") || raw.includes("package") || raw.includes("$");
  
  if (is247) {
    selectPricingOption(query);
    selectServiceOption(query);
  } else if (isPricing) {
    selectPricingOption(query);
  } else {
    selectServiceOption(query);
  }
}

// Check URL query parameters for auto-selection on page load
const urlParams = new URLSearchParams(window.location.search);
const reqServiceParam = urlParams.get("service");
const reqPlanParam = urlParams.get("plan") || urlParams.get("pricing");
const reqSpecialistParam = urlParams.get("specialist") || urlParams.get("caregiver");

if (reqServiceParam) autoSelectFormOption(reqServiceParam);
if (reqPlanParam) selectPricingOption(reqPlanParam);
if (reqSpecialistParam) selectSpecialistOption(reqSpecialistParam);

// If any parameter was provided on contact.html, ensure smooth scroll to inquiry form and focus name
if (window.location.pathname.includes("contact.html") && (reqServiceParam || reqPlanParam || reqSpecialistParam || window.location.hash.includes("inquiry"))) {
  const formTarget = document.querySelector("#inquiry-form") || document.querySelector("#contact");
  if (formTarget) {
    setTimeout(() => {
      formTarget.scrollIntoView({ behavior: "smooth", block: "center" });
      const nameInput = document.querySelector('input[name="name"]');
      if (nameInput && !nameInput.value) {
        nameInput.focus({ preventScroll: true });
      }
    }, 350);
  }
}

// Handle in-page Pricing & Service CTA button clicks to auto-select and smooth-scroll
document.querySelectorAll('a[href="#contact"], a[data-service], a[data-plan], .price-card .button, .inner-price-card .button, .custom-mini .button, .custom-plan .button').forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const isPlan = btn.dataset.plan || btn.closest(".price-card") || btn.closest(".inner-price-card") || btn.closest(".custom-mini") || btn.closest(".custom-plan");
    const name = btn.dataset.plan || btn.dataset.service || btn.closest("article")?.querySelector("h3")?.textContent || btn.textContent.replace(/[→\s]+/g, " ").trim();
    if (!name) return;

    const contactSection = document.querySelector("#contact");
    const href = btn.getAttribute("href") || "";
    if (contactSection && (href === "#contact" || href.includes("#contact") || !href)) {
      e.preventDefault();
      if (isPlan) {
        selectPricingOption(name);
      } else {
        selectServiceOption(name);
      }
      contactSection.scrollIntoView({ behavior: "smooth" });
      const nameInput = document.querySelector('input[name="name"]');
      nameInput?.focus({ preventScroll: true });
    }
  });
});

// Interactive Inquiry Form Submit Handler
const form = document.querySelector("#inquiry-form");
if (form) {
  const successMessage = form.querySelector(".form-success");
  const submitButton = form.querySelector(".submit-button");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const labelSpan = submitButton.querySelector("span");
    const originalLabel = labelSpan ? labelSpan.textContent : "Send Inquiry";
    const selectedSpecialist = form.querySelector("#specialist-select")?.value;
    submitButton.disabled = true;
    if (labelSpan) labelSpan.textContent = "Inquiry Sent ✓";
    if (successMessage) {
      if (selectedSpecialist) {
        successMessage.innerHTML = `<svg><use href="#i-check"/></svg> Thank you! Your inquiry for <strong>${selectedSpecialist.split("—")[0].trim()}</strong> is received and our care coordinator will reach out shortly.`;
      } else {
        successMessage.innerHTML = `<svg><use href="#i-check"/></svg> Thank you! Your inquiry is ready and our care team will be in touch shortly.`;
      }
      successMessage.classList.add("visible");
    }
    form.reset();

    window.setTimeout(() => {
      submitButton.disabled = false;
      if (labelSpan) labelSpan.textContent = originalLabel;
    }, 3200);
  });
}

// FAQ Accordion
document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const willOpen = !item.classList.contains("open");
    document.querySelectorAll(".faq-item.open").forEach((openItem) => {
      if (openItem === item) return;
      openItem.classList.remove("open");
      openItem.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
    });
    item.classList.toggle("open", willOpen);
    button.setAttribute("aria-expanded", String(willOpen));
  });
});

// FAQ Category Filter
const faqFilterPills = document.querySelectorAll(".faq-filter-pill");
if (faqFilterPills.length > 0) {
  faqFilterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      faqFilterPills.forEach((p) => {
        p.classList.remove("active");
        p.setAttribute("aria-selected", "false");
      });
      pill.classList.add("active");
      pill.setAttribute("aria-selected", "true");

      const filterVal = pill.getAttribute("data-filter");
      const faqItems = document.querySelectorAll(".faq-item");
      
      faqItems.forEach((item) => {
        const itemCategories = (item.getAttribute("data-category") || "").split(" ");
        if (filterVal === "all" || itemCategories.includes(filterVal)) {
          item.style.display = "";
          item.classList.add("reveal-visible");
        } else {
          item.style.display = "none";
          item.classList.remove("open");
          item.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
        }
      });
    });
  });
}

// Sign-In & Password Reset
const signinForm = document.querySelector("#signin-form");
const forgotPasswordForm = document.querySelector("#forgot-password-form");
const forgotPwLink = document.querySelector("#forgot-password-link");
const backToSigninLink = document.querySelector("#back-to-signin-link");
const signinVisual = document.querySelector(".signin-visual");

function showForgotPasswordView(prefillEmail = "") {
  if (!signinForm || !forgotPasswordForm) return;
  signinForm.style.display = "none";
  forgotPasswordForm.style.display = "block";
  forgotPasswordForm.classList.add("fade-in");

  const resetEmailInput = forgotPasswordForm.querySelector("#reset-email-input");
  const signinEmailInput = signinForm.querySelector("input[name='email']");
  const emailToUse = prefillEmail || (signinEmailInput ? signinEmailInput.value.trim() : "");
  if (resetEmailInput && emailToUse) {
    resetEmailInput.value = emailToUse;
  }

  if (signinVisual) {
    const visualH1 = signinVisual.querySelector("h1");
    const visualP = signinVisual.querySelector("p");
    if (visualH1) visualH1.textContent = "Account Recovery";
    if (visualP) visualP.textContent = "Enter your verified family email to receive security verification credentials or reset instructions.";
  }

  const resetStatus = forgotPasswordForm.querySelector(".reset-status");
  if (resetStatus) {
    resetStatus.textContent = "";
    resetStatus.classList.remove("visible");
  }

  setTimeout(() => {
    resetEmailInput?.focus();
  }, 60);
}

function showSignInView() {
  if (!signinForm || !forgotPasswordForm) return;
  forgotPasswordForm.style.display = "none";
  signinForm.style.display = "block";
  signinForm.classList.add("fade-in");

  const resetEmailInput = forgotPasswordForm.querySelector("#reset-email-input");
  const signinEmailInput = signinForm.querySelector("input[name='email']");
  if (resetEmailInput && signinEmailInput && resetEmailInput.value.trim()) {
    signinEmailInput.value = resetEmailInput.value.trim();
  }

  if (signinVisual) {
    const visualH1 = signinVisual.querySelector("h1");
    const visualP = signinVisual.querySelector("p");
    if (visualH1) visualH1.textContent = "Welcome Back";
    if (visualP) visualP.textContent = "View daily care notes, vitals logs, upcoming specialist schedules, and direct coordinator messages in one secure place.";
  }

  const signinStatus = signinForm.querySelector(".signin-status");
  if (signinStatus) {
    signinStatus.textContent = "";
    signinStatus.classList.remove("visible");
  }

  setTimeout(() => {
    signinEmailInput?.focus();
  }, 60);
}

if (signinForm) {
  const signinStatus = signinForm.querySelector(".signin-status");
  signinForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!signinForm.reportValidity()) return;
    if (signinStatus) {
      signinStatus.style.color = "var(--secondary)";
      signinStatus.textContent = "Family portal access verified. Connecting securely...";
      signinStatus.classList.add("visible");
    }
  });

  if (forgotPwLink) {
    forgotPwLink.addEventListener("click", (e) => {
      e.preventDefault();
      showForgotPasswordView();
    });
  }

  if (backToSigninLink) {
    backToSigninLink.addEventListener("click", (e) => {
      e.preventDefault();
      showSignInView();
    });
  }

  if (forgotPasswordForm) {
    const resetStatus = forgotPasswordForm.querySelector(".reset-status");
    const resetSubmitBtn = forgotPasswordForm.querySelector("#reset-submit-btn");

    forgotPasswordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!forgotPasswordForm.reportValidity()) return;

      const emailInput = forgotPasswordForm.querySelector("#reset-email-input");
      const email = emailInput ? emailInput.value.trim() : "";

      if (resetSubmitBtn) {
        resetSubmitBtn.disabled = true;
        resetSubmitBtn.innerHTML = `Sending link...`;
      }

      setTimeout(() => {
        if (resetStatus) {
          resetStatus.style.color = "var(--secondary)";
          resetStatus.style.fontSize = "12.5px";
          resetStatus.style.lineHeight = "1.5";
          resetStatus.innerHTML = `✓ A secure password reset link has been dispatched to <strong>${email}</strong>. Please check your inbox and spam folder.`;
          resetStatus.classList.add("visible");
        }
        if (resetSubmitBtn) {
          resetSubmitBtn.disabled = false;
          resetSubmitBtn.innerHTML = `Resend Reset Link <span>→</span>`;
        }
      }, 400);
    });
  }

  // Handle direct hash navigation
  if (window.location.hash === "#forgot-password" || window.location.search.includes("action=forgot-password")) {
    showForgotPasswordView();
  }
}

// Sign-Up Form Demo
const signupForm = document.querySelector("#signup-form");
if (signupForm) {
  const signupStatus = signupForm.querySelector(".signin-status");
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!signupForm.reportValidity()) return;
    const pwd = signupForm.querySelector("input[name='password']").value;
    const confirmPwd = signupForm.querySelector("input[name='confirm_password']").value;
    if (pwd !== confirmPwd) {
      if (signupStatus) {
        signupStatus.style.color = "var(--coral)";
        signupStatus.textContent = "Passwords do not match. Please try again.";
        signupStatus.classList.add("visible");
      }
      return;
    }
    if (signupStatus) {
      signupStatus.style.color = "var(--green)";
      signupStatus.textContent = "Account created successfully! Redirecting to Sign In...";
      signupStatus.classList.add("visible");
      window.setTimeout(() => {
        window.location.href = "signin.html";
      }, 1500);
    }
  });
}

// ----------------------------------------------------
// 100% UNIQUE SERVICE DETAILS POPOVER MODAL SYSTEM
// ----------------------------------------------------
const serviceDetailsData = {
  "post-surgery": {
    badge: "Clinical Post-Operative Support",
    title: "Post-Surgery Care",
    tagline: "Specialized Clinical Recovery & Healing Assistance at Home",
    image: "assets/images/service-post-surgery.jpg",
    icon: `<svg viewBox="0 0 24 24"><path d="M9 3h6v4H9zM4 7h16v14H4zM10 12h4m-2-2v4" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round"/></svg>`,
    color: "#2465e8",
    bgTint: "#eaf3ff",
    description: "Recovering from surgery requires meticulous incision care, pain management, safe mobility, and strict adherence to physician discharge orders. Our licensed nurses provide customized in-home post-operative support to prevent complications, reduce hospital readmissions, and promote gentle, steady healing.",
    protocolsTitle: "Clinical Recovery Protocols",
    inclusions: [
      "Surgical incision monitoring, aseptic cleaning & sterile dressing changes",
      "Prescribed medication administration & vital signs observation",
      "Safe bed transfers, supervised walking & fall prevention support",
      "Assistance with gentle personal hygiene, sponge bathing & grooming",
      "Routine clinical documentation & direct coordination with your surgeon"
    ],
    specialist: "Registered Nurse (RN) / Licensed Practical Nurse (LPN)",
    tools: "Digital Vitals Kit, Sterile Dressing Supplies & Gait Belts",
    idealFor: "Patients recovering from orthopedic, cardiac, abdominal, spinal, or plastic surgery.",
    schedule: "4 to 12 hours daily, or 24/7 dedicated coverage during initial post-op weeks."
  },
  "elderly-companion": {
    badge: "Daily Living & Social Enrichment",
    title: "Elderly Companion Care",
    tagline: "Heartfelt Daily Living Support, Safety & Meaningful Connection",
    image: "assets/images/service-companion.jpg",
    icon: `<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 10v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round"/></svg>`,
    color: "#0d9488",
    bgTint: "#e6f7f6",
    description: "Independence, emotional well-being, and safe everyday routines make a profound difference for seniors living at home. Our warm, attentive caregivers provide comforting companionship, assist with daily activities, and ensure a secure, joyful home environment.",
    protocolsTitle: "Daily Enrichment & Living Assistance",
    inclusions: [
      "Engaging conversations, reading, board games & cognitive stimulation",
      "Nutritious meal planning, fresh cooking & hydration tracking",
      "Light housekeeping, linen changes, laundry & tidy living spaces",
      "Escort to medical appointments, church, walks & family visits",
      "Continuous peace-of-mind updates and daily care notes for family members"
    ],
    specialist: "Certified Nursing Assistant (CNA) / Dedicated Companion",
    tools: "Cognitive Activity Sets, Dietary Logs & Safety Checklists",
    idealFor: "Seniors living independently who value companionship, routine assistance, or supervision.",
    schedule: "3 to 7 days per week, 3 to 8 hours per visit, or live-in arrangements."
  },
  "personal-care": {
    badge: "Dignified Personal Care & Hygiene",
    title: "Dignified Personal Care",
    tagline: "Respectful Assistance with Daily Hygiene, Grooming & Safe Transfers",
    image: "assets/images/service-companion.jpg",
    icon: `<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round"/><path d="M8.5 12h2l1-2.3 2 4.6 1.1-2.3h1.9" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round"/></svg>`,
    color: "#0d9488",
    bgTint: "#e6f7f6",
    description: "Maintaining personal hygiene, comfort, and morning routines is essential for physical well-being and personal dignity. Our certified aides assist seniors with morning and evening grooming, bathing, dressing, and safe bathroom transfers with total discretion, respect, and gentle warmth.",
    protocolsTitle: "Personal Care & Hygiene Protocols",
    inclusions: [
      "Respectful assistance with safe showers, walk-in tubs, or bed sponge baths",
      "Gentle skin hydration, pressure point monitoring & non-slip bath safety",
      "Morning hair brushing, oral hygiene, denture care & cosmetic shaving",
      "Assistance with daytime clothing selection, dressing & footwear fastenings",
      "Safe bedside, wheelchair & commode transfers using certified transfer techniques"
    ],
    specialist: "Certified Home Health Aide (CHHA) / Certified Nursing Assistant (CNA)",
    tools: "Transfer Gait Belts, Shower Chairs, Non-Slip Bath Steps & Hypoallergenic Toiletries",
    idealFor: "Seniors with limited physical flexibility, balance challenges, Parkinson's, or arthritis.",
    schedule: "Flexible daily shifts: 2 to 6 hours morning/evening, or integrated with full-day care."
  },
  "nutrition-errands": {
    badge: "Dietary Wellness & Household Support",
    title: "Fresh Nutrition & Errands",
    tagline: "Wholesome Home-Cooked Meals, Dietary Adherence & Essential Errands",
    image: "assets/images/home2-hero.jpg",
    icon: `<svg viewBox="0 0 24 24"><path d="M5 8h14l1 13H4L5 8zM9 8V5a3 3 0 0 1 6 0v3M12 11v6M9 14h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    color: "#2465e8",
    bgTint: "#eaf3ff",
    description: "Proper nutrition, regular hydration, and a well-kept home are cornerstones of longevity and vitality. Our caregivers prepare fresh, delicious meals tailored to dietary guidelines (low-sodium, diabetic-friendly, renal, or soft diet) and manage everyday shopping and pharmacy runs.",
    protocolsTitle: "Nutrition & Daily Errands Protocols",
    inclusions: [
      "Personalized meal planning based on physician or dietitian recommendations",
      "Fresh daily home cooking, portioning, and scheduled hydration tracking",
      "Grocery shopping, fresh produce restocking & pantry organization",
      "Prescription pickup from local pharmacies and medical supply runs",
      "Post-meal clean-up, dish sanitization & refrigerator rotation"
    ],
    specialist: "Culinary & Daily Living Caregiver / CNA",
    tools: "Dietary Compliance Logs, Hydration Timer & Fresh Storage Organizers",
    idealFor: "Seniors who struggle with cooking, grocery lifting, or following specialized diets.",
    schedule: "Daily visits, 2 to 4 hours per meal prep session, or part of companion care."
  },
  "physiotherapy": {
    badge: "Physical Rehabilitation & Strength",
    title: "Physiotherapy Assistance",
    tagline: "Restoring Mobility, Balance & Physical Strength in Comfort",
    image: "assets/images/service-physiotherapy.jpg",
    icon: `<svg viewBox="0 0 24 24"><path d="M13 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-2 5l-3 4 3 3-1 6m3-13l3 4-2 4 4 5" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round"/></svg>`,
    color: "#2465e8",
    bgTint: "#eaf3ff",
    description: "Rebuilding strength and movement after an injury, joint replacement, or stroke requires consistent, guided practice. Working in close harmony with your physical therapist's directives, our assistants safely guide therapeutic exercises and monitor progress.",
    protocolsTitle: "Rehabilitation & Mobility Protocols",
    inclusions: [
      "Guided therapeutic exercise & range-of-motion routines",
      "Gait retraining, posture alignment & walking support",
      "Balance enhancement & home fall-risk reduction",
      "Joint mobility preservation & muscle reconditioning",
      "Exercise compliance logging & physical therapist communication"
    ],
    specialist: "Physical Therapy Aide / Rehabilitation Specialist",
    tools: "Therabands, Stability Foam Pads, Walking Canes & Step Trackers",
    idealFor: "Individuals recovering from orthopedic surgery, strokes, fractures, or age-related mobility decline.",
    schedule: "2 to 5 targeted sessions weekly, 1 to 2 hours per session."
  },
  "wound-dressing": {
    badge: "Aseptic Wound Management",
    title: "Wound Dressing & Clinical Care",
    tagline: "Aseptic, Professional Wound Management for Safe Healing",
    image: "assets/images/service-wound-dressing.jpg",
    icon: `<svg viewBox="0 0 24 24"><path d="M18 6L6 18M14 4l6 6-12 12-6-6L14 4z" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round"/></svg>`,
    color: "#0d9488",
    bgTint: "#e6f7f6",
    description: "Chronic wounds, surgical incisions, pressure injuries, and diabetic ulcers demand strict aseptic hygiene and expert clinical observation. Our certified nurses deliver meticulous wound care at home to prevent infection and accelerate tissue recovery.",
    protocolsTitle: "Wound Management & Infection Control",
    inclusions: [
      "Aseptic wound cleansing, debridement check & sterile dressing",
      "Early infection symptom detection & exudate monitoring",
      "Diabetic foot ulcer & pressure injury staging care",
      "Negative pressure wound therapy & specialized bandaging",
      "Digital wound healing photo logs shared directly with your physician"
    ],
    specialist: "Wound Care Certified Registered Nurse (WCC RN)",
    tools: "Hydrocolloid, Alginate & Silver Dressings, Sterile Irrigation",
    idealFor: "Patients with post-operative incisions, slow-healing wounds, or diabetic ulcerations.",
    schedule: "Daily or alternate-day visits as prescribed by your doctor."
  },
  "medication-management": {
    badge: "Precision Pharmacology & Vitals",
    title: "Medication Management",
    tagline: "Timely, Error-Free Administration & Health Monitoring",
    image: "assets/images/service-medication.jpg",
    icon: `<svg viewBox="0 0 24 24"><path d="M10.5 13.5L14 10a4.95 4.95 0 1 0-7-7L3.5 6.5a4.95 4.95 0 0 0 7 7zm-3.5-3.5l7 7" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round"/></svg>`,
    color: "#2465e8",
    bgTint: "#eaf3ff",
    description: "Managing multiple prescriptions, varied dosage timings, and potential drug interactions can be stressful. Our nurses ensure medications are organized, administered on time, and monitored closely for side effects or vital changes.",
    protocolsTitle: "Safety & Medication Administration",
    inclusions: [
      "Timely medication administration & compliance verification",
      "Dosette/pill organizer sorting & prescription refill tracking",
      "Vital signs monitoring (Blood Pressure, Blood Glucose, SpO2, Heart Rate)",
      "Adverse reaction observation & physician notification",
      "Pharmacy coordination & medication schedule reviews"
    ],
    specialist: "Licensed Medication Technician / Registered Nurse",
    tools: "Smart Med-Dispenser, Glucometer, Pulse Oximeter & BP Monitor",
    idealFor: "Seniors and individuals managing multiple chronic conditions, diabetes, or hypertension.",
    schedule: "Daily scheduled visits (morning/evening) or integrated with routine home care."
  },
  "dementia-care": {
    badge: "Memory & Cognitive Care",
    title: "Specialized Dementia Care",
    tagline: "Dignified, Patient-Centered Memory Support in Familiar Surroundings",
    image: "assets/images/service-dementia.jpg",
    icon: `<svg viewBox="0 0 24 24"><path d="M12 2a9 9 0 0 0-9 9c0 3.5 2 6.5 5 8v3h8v-3c3-1.5 5-4.5 5-8a9 9 0 0 0-9-9z" stroke="currentColor" fill="none" stroke-width="2"/></svg>`,
    color: "#0d9488",
    bgTint: "#e6f7f6",
    description: "Caring for a loved one with Alzheimer's or dementia requires specialized patience, calming routines, and empathetic engagement. Our memory care specialists create secure, structured routines that preserve cognitive abilities and dignity.",
    protocolsTitle: "Cognitive Support & Safety Routines",
    inclusions: [
      "Structured daily routines tailored to cognitive stage & personality",
      "Gentle reminiscence therapy, sensory engagement & brain activities",
      "Wandering prevention, home safety sweeps & orientation cues",
      "Dignified bathing, dressing, and nutritional meal assistance",
      "Compassionate family respite support and regular behavioral updates"
    ],
    specialist: "Certified Dementia Care Specialist (CDCS) / CNA",
    tools: "Sensory Activity Kits, Memory Books, Door Safety Monitors",
    idealFor: "Individuals experiencing mild cognitive impairment, Alzheimer's disease, or vascular dementia.",
    schedule: "4 to 12 hours daily, or 24/7 continuous oversight for advanced care."
  },
  "live-in-care": {
    badge: "24/7 Continuous Care",
    title: "24/7 Live-In Nursing Care",
    tagline: "Continuous Around-the-Clock Clinical Support & Compassionate Comfort",
    image: "assets/images/service-livein.jpg",
    icon: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="currentColor" fill="none" stroke-width="2"/><path d="M12 7v5l3 2" stroke="currentColor" fill="none" stroke-width="2"/></svg>`,
    color: "#2465e8",
    bgTint: "#eaf3ff",
    description: "When continuous supervision, acute clinical needs, or comprehensive hospice and palliative assistance are required, our dedicated 24/7 live-in nursing team provides uninterrupted care in the familiar comfort of home.",
    protocolsTitle: "Round-the-Clock Clinical Oversight",
    inclusions: [
      "Continuous vitals observation, catheter care, and IV hydration",
      "Nighttime repositioning, safety monitoring, and toileting help",
      "Comprehensive medication schedule administration & pain control",
      "Nutritious dietary management, hydration, and personal grooming",
      "Dedicated nurse manager coordinator with direct family hotline"
    ],
    specialist: "Dedicated Rotating RN / LPN Team & Clinical Supervisor",
    tools: "Hospital Bed Accessories, Transfer Hoists, Emergency Vitals Station",
    idealFor: "Patients needing round-the-clock recovery, palliative care, or total assistance.",
    schedule: "24 hours per day, 7 days per week continuous residential coverage."
  }
};

function getServiceData(serviceQuery) {
  if (!serviceQuery) return serviceDetailsData["post-surgery"];
  const raw = serviceQuery.toLowerCase().trim().replace(/[\n\r]+/g, " ");
  
  if (raw === "personal-care" || raw.includes("personal") || raw.includes("bathing") || raw.includes("grooming") || raw.includes("hygiene")) {
    return serviceDetailsData["personal-care"];
  }
  if (raw === "nutrition-errands" || raw.includes("nutrition") || raw.includes("errand") || raw.includes("meal") || raw.includes("cooking")) {
    return serviceDetailsData["nutrition-errands"];
  }
  if (raw.includes("dementia") || raw.includes("memory") || raw.includes("alzheimer")) {
    return serviceDetailsData["dementia-care"];
  }
  if (raw.includes("live-in") || raw.includes("24/7") || raw.includes("livein") || raw.includes("continuous")) {
    return serviceDetailsData["live-in-care"];
  }
  if (raw === "post-surgery" || raw.includes("post-surgery") || raw.includes("surgery") || raw.includes("post surgery")) {
    return serviceDetailsData["post-surgery"];
  }
  if (raw === "elderly-companion" || raw.includes("companion") || raw.includes("elderly") || raw.includes("companionship")) {
    return serviceDetailsData["elderly-companion"];
  }
  if (raw === "physiotherapy" || raw.includes("physio") || raw.includes("therapy") || raw.includes("mobility")) {
    return serviceDetailsData["physiotherapy"];
  }
  if (raw === "wound-dressing" || raw.includes("wound") || raw.includes("dressing") || raw.includes("bandage")) {
    return serviceDetailsData["wound-dressing"];
  }
  if (raw === "medication-management" || raw.includes("medication") || raw.includes("pill") || raw.includes("drug")) {
    return serviceDetailsData["medication-management"];
  }
  return serviceDetailsData["post-surgery"];
}

let popoverBackdrop = null;
let lastFocusedServiceElement = null;

function createServicePopoverMarkup() {
  if (document.querySelector(".service-popover-backdrop")) {
    popoverBackdrop = document.querySelector(".service-popover-backdrop");
    return;
  }
  const backdrop = document.createElement("div");
  backdrop.className = "service-popover-backdrop";
  backdrop.setAttribute("role", "dialog");
  backdrop.setAttribute("aria-modal", "true");
  backdrop.setAttribute("aria-hidden", "true");
  backdrop.innerHTML = `
    <div class="service-popover-dialog">
      <button class="popover-close" type="button" aria-label="Close details popup">&times;</button>
      <div class="popover-content"></div>
    </div>`;
  document.body.appendChild(backdrop);
  popoverBackdrop = backdrop;

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop || e.target.closest(".popover-close") || e.target.closest(".popover-dismiss")) {
      closeServicePopover();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popoverBackdrop?.classList.contains("active")) {
      closeServicePopover();
    }
  });
}

function openServicePopover(serviceQuery, triggeringEl) {
  createServicePopoverMarkup();
  const data = getServiceData(serviceQuery);
  if (!data) return;

  lastFocusedServiceElement = triggeringEl || document.activeElement;
  const contentContainer = popoverBackdrop.querySelector(".popover-content");
  
  const inclusionsHtml = data.inclusions.map((item) => `
    <li>
      <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="${data.color}" fill-opacity="0.15"/><path d="M6 10.5l2.5 2.5L14 7" stroke="${data.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span>${item}</span>
    </li>
  `).join("");

  const contactLink = isInsidePages ? `contact.html?service=${encodeURIComponent(data.title)}` : `pages/contact.html?service=${encodeURIComponent(data.title)}`;

  contentContainer.innerHTML = `
    <div class="popover-media-header">
      <img src="${rootPrefix}${data.image}" alt="${data.title}" />
      <span class="popover-badge">${data.badge}</span>
    </div>
    <div class="popover-header">
      <div class="popover-icon" style="background: ${data.bgTint}; color: ${data.color}; border-color: ${data.color}33;">
        ${data.icon}
      </div>
      <div class="popover-title-group">
        <h2>${data.title}</h2>
        <span class="popover-tagline" style="color: ${data.color}; font-weight:700;">${data.tagline}</span>
      </div>
    </div>
    <p class="popover-description">${data.description}</p>
    
    <div class="popover-section-title" style="color: var(--navy);">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${data.color}" stroke-width="2.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
      ${data.protocolsTitle}
    </div>
    <ul class="popover-inclusions">
      ${inclusionsHtml}
    </ul>

    <div class="popover-meta-grid">
      <div class="popover-meta-card">
        <strong>Assigned Specialist</strong>
        <p>${data.specialist}</p>
      </div>
      <div class="popover-meta-card">
        <strong>Equipment &amp; Supplies</strong>
        <p>${data.tools}</p>
      </div>
      <div class="popover-meta-card">
        <strong>Target Patient Profile</strong>
        <p>${data.idealFor}</p>
      </div>
      <div class="popover-meta-card">
        <strong>Recommended Frequency</strong>
        <p>${data.schedule}</p>
      </div>
    </div>

    <div class="popover-actions">
      <a class="button button-primary page-link popover-cta" href="${contactLink}">Book This Care <span>→</span></a>
      ${!window.location.pathname.includes("services.html") ? `<a class="button button-ghost page-link popover-services-btn" href="${isInsidePages ? `services.html?service=${encodeURIComponent(serviceQuery)}#service-${serviceQuery}` : `pages/services.html?service=${encodeURIComponent(serviceQuery)}#service-${serviceQuery}`}">View on Services Page <svg><use href="#i-arrow"/></svg></a>` : ""}
      <button class="button button-secondary popover-dismiss" type="button">Close Details</button>
    </div>
  `;

  popoverBackdrop.classList.add("active");
  popoverBackdrop.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  const closeBtn = popoverBackdrop.querySelector(".popover-close");
  closeBtn?.focus();

  // Close popover when clicking View on Services Page
  const servicesPageBtn = contentContainer.querySelector(".popover-services-btn");
  if (servicesPageBtn) {
    servicesPageBtn.addEventListener("click", () => {
      closeServicePopover();
    });
  }

  // If on home page and clicking inquire, smooth scroll to contact form and pre-fill
  const ctaBtn = contentContainer.querySelector(".popover-cta");
  if (ctaBtn && !isInsidePages && document.querySelector("#contact")) {
    ctaBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closeServicePopover();
      const targetContact = document.querySelector("#contact");
      if (targetContact) {
        selectServiceOption(data.title);
        targetContact.scrollIntoView({ behavior: "smooth" });
        const nameInput = document.querySelector('input[name="name"]');
        nameInput?.focus({ preventScroll: true });
      }
    });
  }
}

function closeServicePopover() {
  if (!popoverBackdrop) return;
  popoverBackdrop.classList.remove("active");
  popoverBackdrop.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastFocusedServiceElement) {
    lastFocusedServiceElement.focus();
  }
}

// Bind popover listeners to service cards
function initServicePopovers() {
  document.querySelectorAll(".service-card").forEach((card) => {
    const serviceKey = card.dataset.service || card.querySelector("h3")?.textContent || "";
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `View detailed information for ${serviceKey}`);
    
    card.addEventListener("click", (e) => {
      e.preventDefault();
      openServicePopover(serviceKey, card);
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openServicePopover(serviceKey, card);
      }
    });
  });

  document.querySelectorAll(".detail-card.service-detail:not(.why-card)").forEach((card) => {
    const serviceKey = card.dataset.service || card.querySelector("h3")?.textContent || "";
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `View detailed information for ${serviceKey}`);
    card.addEventListener("click", (e) => {
      e.preventDefault();
      openServicePopover(serviceKey, card);
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openServicePopover(serviceKey, card);
      }
    });
  });
}

createServicePopoverMarkup();
initServicePopovers();

// Smooth Page Transitions
document.querySelectorAll("a.page-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (reducedMotion || event.metaKey || event.ctrlKey || event.shiftKey || link.target === "_blank") return;
    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin) return;
    if (destination.pathname === window.location.pathname && destination.hash) return;
    event.preventDefault();
    document.body.classList.add("page-leaving");
    window.setTimeout(() => { window.location.href = destination.href; }, 220);
  });
});

// Subtle Parallax on Desktop
if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
  const parallaxItems = document.querySelectorAll("[data-parallax]");
  let mouseX = 0;
  let mouseY = 0;
  let ticking = false;

  window.addEventListener("pointermove", (event) => {
    mouseX = event.clientX - window.innerWidth / 2;
    mouseY = event.clientY - window.innerHeight / 2;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      parallaxItems.forEach((item) => {
        const strength = Number(item.dataset.parallax || 0.02);
        item.style.transform = `translate3d(${mouseX * strength}px, ${mouseY * strength}px, 0)`;
      });
      ticking = false;
    });
  }, { passive: true });
}

// Interactive Click Ripple Effect for Buttons
document.addEventListener("pointerdown", (e) => {
  const target = e.target.closest(".button, .signin-button, .utility-button, .menu-toggle, .mobile-signin-link");
  if (!target || reducedMotion) return;

  const rect = target.getBoundingClientRect();
  const ripple = document.createElement("span");
  ripple.className = "click-ripple";
  const size = Math.max(rect.width, rect.height) * 1.6;
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  target.appendChild(ripple);
  window.setTimeout(() => ripple.remove(), 600);
});

// Caregiver Specialty Filter Handler
function applyCaregiverFilter(filterKey, smoothScroll = false) {
  if (!filterKey) return;
  const raw = decodeURIComponent(filterKey).toLowerCase().trim().replace(/[-_]/g, " ");
  const filterBtns = document.querySelectorAll(".caregiver-filter-bar .filter-btn");
  if (!filterBtns.length) return;

  let targetBtn = [...filterBtns].find((btn) => {
    const f = (btn.dataset.filter || "").toLowerCase();
    const txt = btn.textContent.toLowerCase();
    return f === raw || txt === raw || raw.includes(f) || f.includes(raw);
  });

  if (!targetBtn) {
    if (raw.includes("companion") || raw.includes("daily") || raw.includes("personal") || raw.includes("living")) {
      targetBtn = [...filterBtns].find((btn) => btn.dataset.filter === "companion");
    } else if (raw.includes("surg") || raw.includes("post")) {
      targetBtn = [...filterBtns].find((btn) => btn.dataset.filter === "post-surgery");
    } else if (raw.includes("physio") || raw.includes("rehab") || raw.includes("pt")) {
      targetBtn = [...filterBtns].find((btn) => btn.dataset.filter === "physiotherapy");
    } else if (raw.includes("wound") || raw.includes("ostomy")) {
      targetBtn = [...filterBtns].find((btn) => btn.dataset.filter === "wound-care");
    } else if (raw.includes("medic") || raw.includes("vital")) {
      targetBtn = [...filterBtns].find((btn) => btn.dataset.filter === "medication");
    }
  }

  if (targetBtn) {
    filterBtns.forEach((b) => b.classList.remove("active"));
    targetBtn.classList.add("active");
    const activeFilter = targetBtn.dataset.filter || "all";

    document.querySelectorAll(".caregiver-profile-card").forEach((card) => {
      const specialty = card.dataset.specialty || "";
      if (activeFilter === "all" || specialty.includes(activeFilter)) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });

    if (smoothScroll) {
      setTimeout(() => {
        const filterBar = document.querySelector(".caregiver-filter-bar");
        if (filterBar) {
          filterBar.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
    }
  }
}

function initCaregiverFilter() {
  const filterBtns = document.querySelectorAll(".caregiver-filter-bar .filter-btn");
  if (!filterBtns.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      applyCaregiverFilter(btn.dataset.filter || "all", false);
    });
  });

  // Check URL query parameters or hash on page load
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get("filter") || urlParams.get("specialty") || urlParams.get("category");

  if (filterParam) {
    applyCaregiverFilter(filterParam, true);
  } else if (window.location.hash) {
    const hash = window.location.hash.replace("#", "").toLowerCase();
    if (hash === "companion" || hash.includes("companion") || hash.startsWith("filter-") || hash.startsWith("specialty-")) {
      applyCaregiverFilter(hash.replace(/^(filter|specialty)-/, ""), true);
    }
  }
}

// Caregiver Card Link Handler
function initCaregiverLinkCards() {
  document.querySelectorAll(".caregiver-link-card, [data-caregiver-url]").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return; // Let <a> tag handle itself
      const url = card.dataset.caregiverUrl || card.querySelector("a[href*='caregivers.html']")?.getAttribute("href");
      if (url) {
        document.body.classList.add("page-leaving");
        setTimeout(() => { window.location.href = url; }, 200);
      }
    });
  });
}

// Enhanced Service Catalog Trigger Handler
function initEnhancedServiceTriggers() {
  document.querySelectorAll(".open-service-card[data-service], .service-catalog-card, .service-card[data-service], .value-card[data-service], .service-popover-trigger").forEach((el) => {
    el.addEventListener("click", (e) => {
      // Allow new-tab clicks (Cmd/Ctrl/Shift/middle-click)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;

      const serviceKey = el.dataset.service || el.closest("[data-service]")?.dataset.service;
      if (!serviceKey) return;

      // Allow clicking specific other links inside unless it's a trigger link or the card itself
      if (e.target.closest("a") && !e.target.closest(".service-popover-trigger, .service-trigger-btn, .service-arrow, .service-card-action, .text-link")) return;

      e.preventDefault();
      openServicePopover(serviceKey, el);
    });
  });
}

// URL Hash & Query Param Service Deep Linking Handler
function handleServiceDeepLinking() {
  if (!window.location.pathname.includes("services.html")) return;

  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get("service");
  const hash = window.location.hash ? window.location.hash.replace("#", "") : "";

  const targetKey = serviceParam || hash;
  if (!targetKey) return;

  window.setTimeout(() => {
    let targetEl = null;

    if (hash) {
      targetEl = document.getElementById(hash);
    }
    if (!targetEl && serviceParam) {
      targetEl = document.querySelector(`[data-service="${serviceParam}"]`) || document.getElementById(`service-${serviceParam}`);
    }
    if (!targetEl && targetKey) {
      const lower = targetKey.toLowerCase();
      if (lower.includes("companion") || lower.includes("personal") || lower.includes("nutrition")) {
        targetEl = document.getElementById("service-companion") || document.querySelector('[data-service="elderly-companion"]');
      } else if (lower.includes("surgery") || lower.includes("post-surgery")) {
        targetEl = document.getElementById("service-post-surgery") || document.querySelector('[data-service="post-surgery"]');
      } else if (lower.includes("physio") || lower.includes("mobility")) {
        targetEl = document.getElementById("service-physiotherapy") || document.querySelector('[data-service="physiotherapy"]');
      } else if (lower.includes("wound")) {
        targetEl = document.getElementById("service-wound-dressing") || document.querySelector('[data-service="wound-dressing"]');
      } else if (lower.includes("medication")) {
        targetEl = document.getElementById("service-medication-management") || document.querySelector('[data-service="medication-management"]');
      } else if (lower.includes("dementia") || lower.includes("memory")) {
        targetEl = document.getElementById("service-dementia-care") || document.querySelector('[data-service="dementia-care"]');
      } else if (lower.includes("live-in") || lower.includes("24/7")) {
        targetEl = document.getElementById("service-live-in-care") || document.querySelector('[data-service="live-in-care"]');
      }
    }

    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
      targetEl.classList.add("service-card-highlighted");
      
      // Only pop open modal if explicitly requested via ?modal=true or ?open=true;
      // otherwise, let the user view the highlighted service card in context on the services page
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("modal") === "true" || urlParams.get("open") === "true") {
        const serviceDataKey = targetEl.dataset.service || targetKey;
        openServicePopover(serviceDataKey, targetEl);
      }
    }
  }, 400);
}

// Home 2 Assessment Booking Form & Success State Handler
function initHome2AssessmentBooking() {
  const form = document.querySelector("#home2-hero-form");
  const bookedMsg = document.querySelector("#home2-booked-message");
  const rebookBtn = document.querySelector("#home2-rebook-btn");

  if (!form || !bookedMsg) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const careType = form.careType ? form.careType.value : "In-Home Assessment";
    const userName = form.userName ? form.userName.value.trim() : "Valued Family";
    const userPhone = form.userPhone ? form.userPhone.value.trim() : "";

    const submitBtn = form.querySelector("button[type='submit']");
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : "";

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Scheduling Assessment...`;
    }

    window.setTimeout(() => {
      // Populate booked card elements
      const bookedCare = bookedMsg.querySelector("#booked-care-type");
      const bookedName = bookedMsg.querySelector("#booked-contact-name");
      const bookedPhone = bookedMsg.querySelector("#booked-contact-phone");
      const bookedSalutation = bookedMsg.querySelector("#booked-salutation-name");
      const bookedPhoneCall = bookedMsg.querySelector("#booked-phone-call");

      if (bookedCare) bookedCare.textContent = careType;
      if (bookedName) bookedName.textContent = userName;
      if (bookedPhone) bookedPhone.textContent = userPhone || "Not provided";
      if (bookedSalutation) bookedSalutation.textContent = userName;
      if (bookedPhoneCall) bookedPhoneCall.textContent = userPhone ? userPhone : "your number";

      form.style.display = "none";
      bookedMsg.style.display = "block";

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }, 380);
  });

  if (rebookBtn) {
    rebookBtn.addEventListener("click", () => {
      form.reset();
      bookedMsg.style.display = "none";
      form.style.display = "grid";
      const nameInput = form.querySelector("#home2-user-name");
      if (nameInput) nameInput.focus();
    });
  }
}

initCaregiverFilter();
initCaregiverLinkCards();
initEnhancedServiceTriggers();
initHome2AssessmentBooking();
handleServiceDeepLinking();


