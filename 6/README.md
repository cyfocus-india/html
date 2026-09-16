<div align="center">

# 🏍️ IRONLANE MOTO WORKS

### **Premium Multipage Motorcycle Service & Workshop Website Template**

*A modern, accessible, zero-build static website crafted with semantic HTML5, modern CSS3, and vanilla JavaScript.*

---

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Responsive](https://img.shields.io/badge/Responsive-Design-success?style=for-the-badge&logo=responsive)](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
[![Dark Mode](https://img.shields.io/badge/Theme-Light%20%7C%20Dark-orange?style=for-the-badge&logo=sun)](assets/css/dark-mode.css)
[![RTL Ready](https://img.shields.io/badge/RTL-Supported-blueviolet?style=for-the-badge)](assets/css/rtl.css)
[![A11y WCAG 2.1 AA](https://img.shields.io/badge/A11y-WCAG%202.1%20AA-blue?style=for-the-badge&logo=w3c)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![Zero Dependencies](https://img.shields.io/badge/Build%20Step-Zero%20Config-brightgreen?style=for-the-badge)](#quick-start)

<br>

[Explore Pages](#-page-directory--sitemap) • [Key Features](#-key-features) • [Quick Start](#-quick-start) • [Customization](#-customization-guide) • [Architecture](#-project-structure) • [Brand Coverage](#-brand-coverage) • [Production Checklist](#-production-checklist)

</div>

---

## 📖 Overview

**Ironlane Moto Works** is an all-inclusive, responsive multipage website template tailored specifically for motorcycle workshops, custom garages, mechanic centers, and bike service specialists.

Engineered without frameworks or complex build pipelines, it offers instant loading speeds, high SEO readiness, complete dark/light theme switching, full right-to-left (RTL) language support, and strict WCAG accessibility compliance.

### 🌟 Why This Template?

- ⚡ **Zero Build Step / Pure Vanilla:** Open `index.html` directly in any modern browser. No Node.js, Webpack, or npm dependencies required.
- 🎨 **Two Distinct Homepage Directions:** Choose between an immersive, cinematic image-led hero (`index.html`) or a technical inspection-first view (`index1.html`).
- 🧮 **Interactive Pricing Calculator:** Live estimating tool dynamically calculating quotes based on bike displacement, service level, and pickup options.
- 🌓 **Instant Theme & RTL Toggles:** Built-in Light/Dark theme switching with system detection and persistence (`localStorage`), plus one-click RTL bidirectional support.
- 📱 **Adaptive Responsive Design:** Tailored layouts across mobile (<640px), tablet (640px–1023px), desktop (1024px–1279px), and ultrawide (1280px+) screens.
- ♿ **Accessibility First:** Semantic HTML landmarks, keyboard-friendly navigation, ARIA live regions, skip links, high contrast ratios, and `prefers-reduced-motion` optimizations.

---

## 🚀 Key Features

<table>
  <tr>
    <td width="50%">
      <h3>🛠️ Complete Service Suite</h3>
      <ul>
        <li>7 Core workshop services detailed with high-res WebP imagery</li>
        <li>Dynamic accordion breakdowns & diagnostic scopes</li>
        <li>Turnaround estimates and service warranty indicators</li>
      </ul>
    </td>
    <td width="50%">
      <h3>💰 Interactive Price Guide & Calculator</h3>
      <ul>
        <li>Transparent tiered pricing (Standard, Full, Track/Custom)</li>
        <li>Real-time interactive cost estimator with dynamic breakdown</li>
        <li>Downloadable quote summary capability</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>📅 Validated Booking Workflow</h3>
      <ul>
        <li>Multi-step validated service booking request form</li>
        <li>Live client-side error states and accessible feedback</li>
        <li>Interactive OpenStreetMap location embed & hours</li>
      </ul>
    </td>
    <td width="50%">
      <h3>🏍️ Multi-Brand Compatibility Hub</h3>
      <ul>
        <li>Support matrix for 12+ international & regional bike makers</li>
        <li>Vector SVG brand insignia and compatibility indicators</li>
        <li>Enquiry mechanism for vintage and bespoke custom bikes</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>⭐ Rider Reviews & Social Proof</h3>
      <ul>
        <li>Realistic, rider-oriented testimonial showcase</li>
        <li>Review category filtering (General Service, Electrical, Engine)</li>
        <li>Verified customer proof points and satisfaction ratings</li>
      </ul>
    </td>
    <td width="50%">
      <h3>🛡️ Utility & Auth Demo Pages</h3>
      <ul>
        <li>Modern customer sign-in & sign-up account templates</li>
        <li>Pre-built Legal Pages (Privacy Policy, Terms of Service)</li>
        <li>Custom branded 404 Error and Coming Soon landing pages</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🗺️ Page Directory & Sitemap

The website contains **12 complete HTML pages** organized cleanly across core workflows:

```
├── 🏠 Main Entrypoints
│   ├── index.html                   # Cinematic Hero Homepage
│   └── index1.html                  # Inspection & Diagnostic Homepage
│
├── 📑 Workshop Pages (/pages)
│   ├── services.html                # Full Service Catalogue & Scopes
│   ├── brands.html                  # Supported Brands & Compatibility
│   ├── pricing.html                 # Tiered Rates & Live Cost Calculator
│   ├── reviews.html                 # Testimonials, Feedback & Ratings
│   ├── about.html                   # Garage Story, Mechanics & Timeline
│   └── contact.html                 # Appointment Booking Form & OSM Map
│
├── 🔐 Auth & Account Demo (/pages)
│   ├── signin.html                  # Front-End Sign-In Demonstration
│   └── signup.html                  # Front-End Rider Registration
│
└── ⚙️ Utility & Legal (/pages)
    ├── privacy.html                 # GDPR/Privacy Policy Template
    ├── terms.html                   # Workshop Terms of Service
    ├── 404.html                     # Custom 404 Not Found Page
    └── coming-soon.html             # Maintenance & Launch Teaser
```

### Detailed Page Breakdown

| Page | File | Key Components & Purpose |
| :--- | :--- | :--- |
| **Home (Cinematic)** | [`index.html`](index.html) | Workshop hero photo, trust strip, core highlights, featured services, booking CTA |
| **Home (Inspection)** | [`index1.html`](index1.html) | Technical diagnostic banner, quick-schedule widget, mechanic inspection process |
| **Services** | [`pages/services.html`](pages/services.html) | 7 in-depth service packages, turnaround times, component checks, booking triggers |
| **Brands** | [`pages/brands.html`](pages/brands.html) | 12 brand badges (Royal Enfield, KTM, Yamaha, etc.), compatibility scope, custom notes |
| **Pricing** | [`pages/pricing.html`](pages/pricing.html) | Price tier comparison, interactive dynamic estimate calculator, add-on costs |
| **Reviews** | [`pages/reviews.html`](pages/reviews.html) | Rider testimonials, rating stars, bike models, workshop turnaround feedback |
| **About Us** | [`pages/about.html`](pages/about.html) | Workshop story, master technician bios, garage milestones, quality philosophy |
| **Contact & Booking**| [`pages/contact.html`](pages/contact.html) | Booking form, service selection, OpenStreetMap Bengaluru embed, opening hours |
| **Sign In** | [`pages/signin.html`](pages/signin.html) | Rider portal login UI with client-side validation and password toggle |
| **Sign Up** | [`pages/signup.html`](pages/signup.html) | Rider registration UI with password strength indicator and terms checkbox |
| **Privacy Policy** | [`pages/privacy.html`](pages/privacy.html) | Clean legal typography covering data collection, cookies, and rider records |
| **Terms of Service**| [`pages/terms.html`](pages/terms.html) | Clear workshop liability, estimation policies, part warranties, and billing terms |
| **404 Not Found** | [`pages/404.html`](pages/404.html) | Branded error screen with quick navigation back to home or services |
| **Coming Soon** | [`pages/coming-soon.html`](pages/coming-soon.html) | Newsletter notification capture for garage expansions and dyno-tuning launches |

---

## ⚡ Quick Start

### 1. Direct Preview (No Installation Needed)
Simply clone or download this repository, navigate to the folder, and double-click `index.html` to open it in your default web browser.

### 2. Local HTTP Server
For the optimal preview experience (simulating a production web environment):

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (npx)
npx serve .

# Using PHP
php -S localhost:8000
```

Once running, visit `http://localhost:8000` in your browser.

---

## 📁 Project Structure

```bash
.
├── README.md                      # Comprehensive project documentation
├── favicon.ico                    # Browser tab icon
├── index.html                     # Primary cinematic homepage
├── index1.html                    # Secondary inspection-first homepage
├── assets/
│   ├── css/
│   │   ├── style.css              # Main design system, typography & components
│   │   ├── dark-mode.css          # Dark theme color variable overrides
│   │   └── rtl.css                # Right-to-left layout adjustments
│   ├── js/
│   │   └── main.js                # Core JS: nav, themes, RTL, validation, calculator
│   ├── fonts/                     # Local typography assets (if using custom webfonts)
│   └── images/
│       ├── favicon.svg            # Vector branding icon
│       ├── hero-workshop.webp     # Hero background (1672x941 WebP)
│       ├── mechanic-inspection.webp # Diagnostic inspection photo
│       ├── engine-diagnostics.webp # Engine rebuild & tuning photo
│       ├── oil-change.webp        # Fluid service photo
│       ├── tyre-service.webp      # Wheel & tyre balancing photo
│       ├── chain-adjustment.webp  # Drivetrain maintenance photo
│       └── brands/                # Vector brand logos
│           ├── aprilia.svg
│           ├── bajaj.svg
│           ├── bmw.svg
│           ├── honda.svg
│           ├── husqvarna.svg
│           ├── kawasaki.svg
│           ├── ktm.svg
│           ├── royal-enfield.svg
│           ├── suzuki.svg
│           ├── triumph.svg
│           ├── tvs.svg
│           └── yamaha.svg
└── pages/                         # Sub-pages and utility routes
    ├── 404.html
    ├── about.html
    ├── brands.html
    ├── coming-soon.html
    ├── contact.html
    ├── pricing.html
    ├── privacy.html
    ├── reviews.html
    ├── services.html
    ├── signin.html
    ├── signup.html
    └── terms.html
```

---

## 🎨 Customization Guide

### 1. Color Palette & Theme Tokens
All colors are centralized using CSS Custom Properties in [`assets/css/style.css`](assets/css/style.css) and [`assets/css/dark-mode.css`](assets/css/dark-mode.css).

```css
/* assets/css/style.css */
:root {
  --bg: #f2eee6;             /* Warm vintage background */
  --bg-soft: #e6e0d5;        /* Secondary container fill */
  --surface: #fffaf2;        /* Card & surface background */
  --surface-strong: #171817; /* Dark container background */
  --text: #171817;           /* High-contrast body text */
  --text-muted: #66625d;     /* Subtitle and helper text */
  --accent: #e74f17;         /* Ironlane Racing Orange */
  --accent-strong: #b83409;  /* Hover / Active accent state */
  --accent-soft: #ffd8c5;    /* Subtle highlight badge background */
}
```

### 2. Global Header, Navigation & Footer
The shared site header, navigation links, and footer markup are centrally managed via [`assets/js/main.js`](assets/js/main.js). Modifying the contact information, opening hours, or social links in `main.js` automatically propagates across all 12 pages.

```javascript
// assets/js/main.js
const SITE_CONFIG = {
  brandName: 'Ironlane Moto Works',
  phone: '+91 98765 43210',
  email: 'service@ironlanemoto.com',
  address: 'Indiranagar 100ft Road, Bengaluru, KA 560038',
  hours: 'Mon – Sat: 8:00 AM – 7:30 PM | Sun: Closed'
};
```

### 3. Typography
The template uses a modern zero-download system font stack with high legibility:
- **Body Font (`--font-body`):** `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- **Display Font (`--font-display`):** `"Arial Narrow", "Roboto Condensed", Impact, sans-serif`

To switch to Google Fonts or custom font files, link your stylesheet in the `<head>` and override `--font-body` / `--font-display`.

---

## 🏍️ Brand Coverage

Ironlane Moto Works features built-in vector badge support and compatibility categorization for popular manufacturers:

<div align="center">

| European | Japanese | Indian Domestic |
| :---: | :---: | :---: |
| **KTM** · **Husqvarna** · **BMW Motorrad** · **Triumph** · **Aprilia** | **Honda** · **Yamaha** · **Kawasaki** · **Suzuki** | **Royal Enfield** · **Bajaj Auto** · **TVS Motor** |

</div>

Custom brands or vintage motorcycles can be added directly to [`pages/brands.html`](pages/brands.html) with corresponding SVG assets in [`assets/images/brands/`](assets/images/brands/).

---

## ♿ Accessibility & Performance

Ironlane Moto Works is designed following modern accessibility guidelines:

- ✅ **Semantic Hierarchy:** Logical use of `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>` elements.
- ✅ **Keyboard Navigable:** Fully operable via <kbd>Tab</kbd>, <kbd>Enter</kbd>, and <kbd>Space</kbd> with clear `:focus-visible` focus rings.
- ✅ **Screen Reader Friendly:** Descriptive ARIA attributes (`aria-expanded`, `aria-controls`, `aria-live`, `aria-label`).
- ✅ **Contrast Compliance:** Meets WCAG 2.1 AA standard color contrast ratios across light and dark modes.
- ✅ **Motion Preferences:** Respects user operating system settings for `@media (prefers-reduced-motion: reduce)`.
- ✅ **Optimized Assets:** WebP compressed images with explicit `width`, `height`, and `loading="lazy"` attributes for high Lighthouse scores.

---

## 📋 Production Checklist

Before launching Ironlane Moto Works for a real business, ensure you complete the following steps:

- [ ] **Business Information:** Update business name, phone numbers, email addresses, and physical address in `assets/js/main.js` and `pages/contact.html`.
- [ ] **Interactive Map:** Update the OpenStreetMap embed URL coordinates in `pages/contact.html` to your exact garage location.
- [ ] **Form Backend:** Connect the booking and contact forms in `pages/contact.html` to your secure form endpoint (e.g. Formspree, Formkeep, Netlify Forms, or custom backend API).
- [ ] **Pricing Matrix:** Review and update standard labor rates and service packages in `pages/pricing.html` and `assets/js/main.js`.
- [ ] **Legal Documents:** Customize `pages/privacy.html` and `pages/terms.html` with your registered company name and jurisdiction.
- [ ] **Meta & OpenGraph:** Update `<title>`, `<meta name="description">`, and `og:image` tags in each HTML file for local SEO.
- [ ] **Favicon & Icons:** Replace `favicon.ico` and `assets/images/favicon.svg` with your custom workshop emblem if desired.

---

## 🌐 Tech Stack & Credits

| Layer | Technology / Resource | Usage |
| :--- | :--- | :--- |
| **Markup** | HTML5 Semantic Standard | Structural markup, landmarks & SEO tags |
| **Styling** | Vanilla CSS3 (Custom Properties) | Design system, responsive grid/flexbox, animations |
| **Scripting** | Vanilla ES6+ JavaScript | Theme switching, RTL toggle, calculator, form validation |
| **Icons** | [Lucide Icons](https://lucide.dev/) | Clean, lightweight UI icons (ISC License) |
| **Maps** | [OpenStreetMap](https://www.openstreetmap.org/) | Embedded open-source location map |
| **Images** | Custom WebP Workshop Imagery | High-definition, lightweight service photography |

---

<div align="center">

**Crafted for motorcycle workshops, custom builders, and mechanics worldwide.**

*Designed with precision · Built to ride*

</div>


## September 2026 visual update

All 14 pages now include relevant hero imagery. Both homepages have illustrated service content; non-home content headings are centered through `assets/css/visual-updates.css`. The Services page has separate bike and car sections, and car enquiries open the existing booking form with the car option selected. The motorcycle calculator retains its original ranges.

The About page includes an expanded demonstration brand story, illustrative work examples and specialist services. Privacy Policy and Terms & Conditions share one reading width and heading rhythm. Brand assets keep their original colors in both themes; source information is recorded in `assets/images/ASSET_SOURCES.md`.

The three new workshop images are generated illustrations, not photographs of actual Ironlane work or customers. Existing demonstration notices and unconnected form behavior remain in place.

## Unique images — 12 September 2026

Added 41 content-specific workshop illustrations so all 50 photo placements use distinct images and every one of the 14 pages has a unique hero. The new library covers bike and car services, individual repair processes, pricing factors, customer handover, workshop experience, and each utility/legal page.

The images are local WebP assets with responsive 640-pixel alternatives, meaningful alt text and explicit dimensions. Wide hero images retain their complete composition on mobile. Exact prompts, generation mode, source files and final asset paths are documented in `assets/images/unique/generation-manifest.json`. Existing original-color logos, centered non-home headings, legal reading columns and separate bike/car service details remain in place.
