<div align="center">

# 📦 MoveMate — Home Shifting & Packing Service

### Modern, High-Performance Multi-Page Website & Moving Management Portal

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Dark Mode](https://img.shields.io/badge/Dark%20Mode-Supported-075fd7?style=for-the-badge&logo=ghostery&logoColor=white)](#)
[![RTL Ready](https://img.shields.io/badge/RTL%20Layout-Supported-10b981?style=for-the-badge)](#)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero%20Build-8b5cf6?style=for-the-badge)](#)
[![Accessibility](https://img.shields.io/badge/WCAG-2.1%20AA%20Compliant-3b82f6?style=for-the-badge)](#)

<br/>

<p align="center">
  <strong>MoveMate</strong> is a production-ready, ultra-fast static multi-page web platform designed for professional relocation, logistics, and packing services. Engineered with zero external runtime dependencies, full dark mode, bidirectional RTL support, accessible semantic HTML5, and rich interactive features.
</p>

</div>

---

## 🌟 Key Highlights & Features

| Feature | Description |
| :--- | :--- |
| ⚡ **Zero Build Step** | Works out-of-the-box via any static HTTP server. No Node, React, Vite, or bundlers needed. |
| 🎨 **Dual Theme Engine** | Instant seamless toggle between Light Mode and Dark Mode with auto-persistence in `localStorage`. |
| 📸 **Real Photography** | Every hero, service card and feature block uses licensed photographs, served as WebP with JPEG fallbacks. |
| 📐 **One Hero Geometry** | A single `--hero-h` token drives the hero on every page, so the layout reads the same from Home to Terms. |
| 🔤 **One Type Scale** | Self-hosted Inter variable font; headings at 600, running text in the 400–550 band, site-wide. |
| 🌐 **Complete RTL Support** | Built-in Right-to-Left (RTL) layout switcher with mirrored grids and directional icons — non-directional icons stay put. |
| 🗺️ **Live Maps** | Leaflet office locator on Contact and a Pan-India coverage map on Service Areas, on keyless Esri World Street Map tiles. |
| 🧮 **Instant Price Calculator** | Dynamic shifting cost estimator based on move type, apartment size, distance, and custom add-on services. |
| 📍 **Smart Route Finder** | Live route & distance computation, instant vehicle dispatch estimation, and Indian city autocomplete. |
| 📊 **Customer Dashboard** | Interactive customer management panel with booking timeline, GPS tracker, and status cards. |
| 🧾 **Digital Invoice Generator** | Live client-side GST-compliant downloadable text invoice (`.txt`) with custom breakdown. |
| 🔐 **Complete Auth Demo** | Fully validated Sign In, Sign Up, and dedicated Password Recovery (`forgot-password.html`) flows. |
| ♿ **Accessibility First** | ARIA landmarks, live validation error regions, skip-to-content links, and WCAG AA contrast compliance. |
| 🖼️ **Optimized Artwork** | Modern responsive `<picture>` tags with lightweight WebP formats and PNG fallbacks. |

---

## 🧭 Page Catalog & Navigation

```
├── 🏠 Homepages
│   ├── index.html                   ── Standard Marketing Landing Page (Hero, Trust, Services, Process, Testimonials)
│   └── index1.html                  ── Express Relocation & Instant Estimator Homepage
│
├── 🚚 Core Relocation Pages
│   ├── pages/services.html          ── Six-Service Catalog, Move-Day Breakdown, Add-Ons, Selector & FAQs
│   ├── pages/pricing.html           ── Interactive Instant Pricing Calculator & Tier Comparison
│   ├── pages/how-it-works.html      ── Visual 6-Step Customer Moving Journey & Safety Guarantees
│   └── pages/service-areas.html     ── Interactive India Map & Tier-1/2/3 Regional Coverage Browser
│
├── 👤 Customer Portal & Authentication
│   ├── pages/dashboard.html         ── Live Moving Dashboard, Tracking, Invoices & Settings
│   ├── pages/signin.html            ── Accessible Customer Login Page
│   ├── pages/signup.html            ── Customer Account Registration Form
│   └── pages/forgot-password.html   ── Account Security & Password Recovery Flow
│
├── 🏢 Company & Support
│   ├── pages/about.html             ── Company Story Timeline, Principles, Leadership & Impact Stats
│   └── pages/contact.html           ── Inquiry Form, Live Office Locator Map, Direct Support & FAQ Accordion
│
└── ⚖️ Legal & Utility
    ├── pages/privacy.html           ── Data Protection & Privacy Rights
    ├── pages/terms.html             ── Relocation Terms of Service & Service Level Agreement
    ├── pages/coming-soon.html       ── Feature Under Construction Utility Page
    └── pages/404.html               ── Error Page with Helpful Navigation Return
```

---

## 🚀 Quick Start & Installation

### Serve over HTTP (recommended)
Open the site through a local server rather than double-clicking the file.
Chrome refuses cross-origin font requests on `file://`, so the self-hosted Inter
falls back to a system font and the type scale shifts. Run any of the following
in the project root:

#### Python 3:
```bash
python3 -m http.server 8000
# Open http://localhost:8000 in your browser
```

#### Node.js / NPX:
```bash
npx serve .
# Or: npx http-server -p 8000
```

#### PHP:
```bash
php -S localhost:8000
```

---

## 🛠️ Technology Stack & Architecture

```
MoveMate/
├── index.html                       # Primary Landing Page
├── index1.html                      # Alternative Express Landing Page
├── assets/
│   ├── css/
│   │   ├── style.css                # Core Design Tokens, Typography, Layouts & Components
│   │   ├── dark-mode.css            # Dark Theme Color Variables & Component Overrides
│   │   └── rtl.css                  # Right-to-Left (RTL) Layout Flips & Icon Alignments
│   ├── fonts/
│   │   └── inter-*.woff2            # Self-hosted Inter variable font (400–700 axis)
│   ├── js/
│   │   ├── main.js                  # Global Nav, Header/Footer Injection, Modals, Forms, Maps & Theme Engine
│   │   └── dashboard.js             # Pricing Engine, Authentication, Dashboard Tabs & Invoice Generator
│   └── images/
│       ├── favicon.svg              # MoveMate SVG Brand Icon
│       ├── photo-*.webp             # Photography (WebP, served first)
│       └── photo-*.jpg              # Photography (JPEG fallback)
└── pages/                           # Subpages directory
```

---

## 🎨 Customization Guide

### 1. Design Tokens & Branding
Global CSS custom properties are located at the top of [`assets/css/style.css`](assets/css/style.css):

```css
:root {
  --brand: #075fd7;         /* Brand accent used as a FILL (buttons, pins) */
  --brand-ink: #075fd7;     /* Brand accent used as TEXT — lightened in dark mode */
  --brand-light: #f0f7ff;   /* Soft background tint */
  --navy: #062344;          /* Deep brand shade */
  --text: #3f5068;          /* Body copy text color */
  --surface: #ffffff;       /* Card and modal backgrounds */
  --radius: 18px;           /* Standard card corner radius */

  --gutter: clamp(20px, 4vw, 56px);  /* The single page gutter — see below */
  --hero-h: 520px;                   /* The single hero height — see below */

  --fw-body: 400;           /* Running text */
  --fw-body-medium: 500;    /* Secondary / small text */
  --fw-body-strong: 550;    /* Emphasis inside running text */
  --fw-heading: 600;        /* All headings and UI chrome */
}
```

**Two tokens govern site-wide consistency and should be changed rather than
overridden per page:**

- `--gutter` — the only source of the left/right page margin. `.container`
  derives its width from it, so every page keeps identical, symmetric gutters.
  The phone breakpoint narrows the token, not `.container`.
- `--hero-h` — the shared hero height. Every hero (`.hero`, `.hero-home2` and
  the `.subhero` / `.process-hero` aliases) resolves to it, so the hero block
  measures the same on every page.

### 2. Typography
Weights come from four tokens only: headings are `600`, running text stays in
the `400`–`550` band. `Inter` is self-hosted as a variable font so `550` renders
exactly rather than rounding to the nearest static weight. Avoid introducing new
numeric weights — use the tokens.

### 3. Dark Mode Palette
Modify dark theme colors in [`assets/css/dark-mode.css`](assets/css/dark-mode.css) under `html[data-theme="dark"]`.

> When adding a component with a hard-coded light background (a pale status
> panel, a chip over a photo), add a matching `html[data-theme="dark"]` rule at
> the same time — a light plate inheriting dark-theme text is the most common
> way contrast breaks here.

### 4. Dynamic Header & Footer
The site header and footer are rendered dynamically via [`assets/js/main.js`](assets/js/main.js). Modifying navigation links or contact information in `main.js` automatically updates all 16 pages across the entire website.

The header is `position: sticky`. Its wrapper (`[data-site-header]`) is
`display: contents` so that `<body>` is the sticky containing block — without
that the header has nowhere to stick. For the same reason `<html>` and `<body>`
use `overflow-x: clip`, never `hidden`.

### 5. Cache Busting on Deploy
CSS and JS are referenced with a `?v=` query string. After changing anything in
`assets/css` or `assets/js`, re-stamp every page so returning visitors do not
get a stale file from cache:

```bash
python3 .claude/bump-assets.py
```

---

## ♿ Accessibility & Performance Standards

- **Semantic Landmarks**: Strict `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, and `<footer>` tagging.
- **Keyboard Friendly**: Skip-to-content links on every page, visible focus rings (`:focus-visible`), and accessible modal traps.
- **Accessible Forms**: `aria-live="polite"` feedback containers, live client-side validation, and accessible labels.
- **Optimized Performance**: Zero third-party trackers or heavy JavaScript libraries. Core bundle loads in under 100ms.
- **Reduced Motion**: Full support for `@media (prefers-reduced-motion: reduce)`.

---

## 📄 License & Credits

- **License**: Provided under the [MIT License](LICENSE).
- **Artwork**: Generated original MoveMate vectors and illustrations optimized for high-density displays.
- **Icons**: Inline scalable SVG icon set (No external icon font CDNs required).

---

<div align="center">
  <sub>MoveMate • We Move With Care • Designed & Built with Modern Vanilla Web Technologies</sub>
</div>
