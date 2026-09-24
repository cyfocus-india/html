<div align="center">

# 🎲 Meeple & Marrow
### *Play well. Belong here.*

**A modern, editorial multipage storefront & community hub for independent hobby and board games.**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-success?style=for-the-badge)](#)
[![Accessibility](https://img.shields.io/badge/a11y-WCAG%202.1%20AA-blueviolet?style=for-the-badge)](#-accessibility--motion)
[![Theme](https://img.shields.io/badge/Theme-Dark%20%7C%20Light%20%7C%20RTL-orange?style=for-the-badge)](#-key-features)

<br>

[Explore Pages](#-pages--routing) • [Quick Start](#-quick-start) • [Features](#-key-features) • [Design Tokens](#-design-system--tokens) • [Customization](#-customization-guide)

---

</div>

## 📖 Overview

**Meeple & Marrow** is an artisanal, production-ready website template crafted for boutique board game stores, hobby cafés, and tabletop communities. Built entirely with **vanilla HTML5, CSS3, and JavaScript**, it delivers a warm editorial aesthetic, instantaneous loading performance, seamless dark/light modes, full RTL layout support, and rich interactive features without requiring any build tools or external dependencies.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| 🌙 **Dual Theme Engine** | Instant Dark / Light theme toggle with `localStorage` persistence and automatic system preference detection (`prefers-color-scheme`). |
| 🔄 **Complete RTL Support** | True Bidirectional layout (LTR / RTL) with flipped alignments, mirroring animations, and dedicated icon handling. |
| 🛍️ **Interactive Shopping Bag** | Slide-out cart drawer with live quantity adjustments, subtotal computation, interactive toast feedback, and empty states. |
| 🔍 **Global Quick Search** | Accessible search dialog with instant keyword matching across games, categories, events, and quick-filter tag chips. |
| 🎯 **Game Recommendation Matcher** | 3-step interactive recommendation wizard guiding players to their ideal game based on group size, vibe, and complexity. |
| 📅 **Event Showcase & RSVP** | Community game night calendar with an accessible modal dialog, live seat tracking, and client-validated registration. |
| 📱 **Mobile & Tablet Optimized** | Fluid responsive layouts with custom accordion dropdown navigation, smooth touch scrolling, and optimized tap targets. |
| ♿ **Accessibility First** | Semantic landmarks, visible focus rings, ARIA dialogs/menus, live announcement regions, and `prefers-reduced-motion` compliance. |
| 🚀 **Zero Dependencies & Fast** | 100% self-contained — no external frameworks, CDN stylesheets, or tracking scripts. Packaged with optimized local WebP assets. |

---

## 🗂️ Pages & Routing

```
├── 🏠 index.html                 # Editorial Retail Home (Hero, Curated Editions, Values, Arrivals)
├── 🎲 index1.html                # Alternate Home (Community-First, Orbit Animation, Game Hub)
└── 📄 pages/
    ├── 🛍️ products.html          # Catalog Overview, Category Grid, Specs Dialog & Filters
    ├── 🧭 recommendations.html   # 3-Step Interactive Game Matcher & Table Guides
    ├── 🗓️ events.html            # Community Calendar, Host Info & Accessible RSVP Modal
    ├── 📖 about.html             # Brand Story, Philosophy & Store Principles
    ├── 📍 contact.html           # Store Hours, Interactive Map, Contact Info & Inquiry Form
    ├── 🔑 signin.html            # Client-Validated Member Login Screen
    ├── ✍️ signup.html            # Client-Validated Membership Registration Screen
    ├── 🔒 privacy.html           # Privacy Policy & Local Storage Practices
    ├── 📜 terms.html             # Terms of Use & Storefront Demonstration Notice
    ├── ⏳ coming-soon.html       # Newsletter Subscription & Feature Teaser
    └── 🚫 404.html               # Custom Not Found Error Page with Return Routes
```

---

## 🚀 Quick Start

No build steps, node modules, or bundlers are required.

### 1. Clone or Download
Ensure the folder structure remains intact.

### 2. Run Locally
Start any static local server from the root directory:

```bash
# Python 3
python3 -m http.server 8000

# Node.js (npx)
npx serve .

# PHP
php -S localhost:8000
```

### 3. Open in Browser
Visit [`http://localhost:8000`](http://localhost:8000) in your browser.

> **Note**: You can also open `index.html` directly in your web browser for quick testing, though running through a local web server ensures optimal asset loading.

---

## 🎨 Design System & Tokens

All core design tokens are defined as CSS Custom Properties in [`assets/css/style.css`](assets/css/style.css), with dark mode variants in [`assets/css/dark-mode.css`](assets/css/dark-mode.css).

### Color Palette

| Token | Light Theme | Dark Theme | Purpose |
| :--- | :---: | :---: | :--- |
| `--paper` | `#f5f0e7` | `#171815` | Main page background |
| `--paper-2` | `#ece4d6` | `#22231f` | Secondary surface / subtle cards |
| `--surface-solid` | `#fbf8f2` | `#242520` | Modal drawers & menu panels |
| `--ink` | `#24211d` | `#f1ebdf` | Primary high-contrast text |
| `--ink-soft` | `#6a645b` | `#b9b2a5` | Secondary text & meta descriptions |
| `--rust` | `#c76641` | `#d77b59` | Primary brand accent & callouts |
| `--sage` | `#77816d` | `#9da287` | Complementary foliage green |
| `--gold` | `#b8893d` | `#d3aa68` | Editorial highlight & ratings |

### Typography
- **Headings & Display**: Editorial Serif Stack (`"Iowan Old Style"`, `"Palatino Linotype"`, `Palatino`, `Georgia`, serif)
- **Body & Controls**: Clean Geometric Sans Stack (`"Avenir Next"`, `"Segoe UI"`, `system-ui`, sans-serif)

---

## 🛠️ Customization Guide

### 1. Store Details & Navigation
- **Global Header & Footer**: Managed dynamically in [`assets/js/main.js`](assets/js/main.js) under the `shell()` function.
- **Social & Contact Links**: Update the phone, email, and social handles in `assets/js/main.js` and `pages/contact.html`.

### 2. Catalog & Recommendation Engine
- **Product Details**: Modify catalog items directly in [`pages/products.html`](pages/products.html).
- **Recommendation Logic**: Custom matching rules and game pairings live inside the `choices` map in [`assets/js/main.js`](assets/js/main.js).

### 3. Visual Assets
All site imagery is real board game photography in [assets/images/photos/](assets/images/photos/): 52 photos from [Pexels](https://www.pexels.com/license/) (free for commercial use, no attribution required). Sources for every file are listed in [assets/images/photos/CREDITS.md](assets/images/photos/CREDITS.md).

- Each image slot has its own photo matched to the content around it. No photo repeats within a page.
- The only cross-page reuse is the eight products that appear on both Home 1 and Products, so each product looks the same wherever it is sold.
- Every photo ships as WebP at 480, 800 and 1600px. HTML uses descriptive alt text, explicit dimensions, srcset, and lazy loading below the hero.
- Crop focal points and the dark-theme photo filter live in [assets/css/imagery.css](assets/css/imagery.css).
- The logo and favicon are in [assets/images/brand/](assets/images/brand/).

Product photos are representative: the catalogue titles (Eclipse Valley, Verdant Paths and the rest) are house products, so each card shows a real game that matches the product's theme rather than its actual box. Swap in your own product shots under the same filenames when you have them.

---

## ♿ Accessibility & Motion

- **Keyboard Traps & Modals**: Search dialog, RSVP modal, and cart drawer trap focus correctly and close via `Escape` key or backdrop clicks.
- **Reduced Motion**: Full `@media (prefers-reduced-motion: reduce)` support cleanly disables parallax transforms, orbit animations, and reveals for sensitive users.
- **Color Contrast**: Complies with WCAG 2.1 AA contrast ratios across both light and dark color schemes.
- **Form Diagnostics**: Accessible error announcements with `aria-invalid`, `aria-describedby`, and dedicated live regions.

---

## 📁 File Structure

```
├── index.html                   # Primary Home page
├── index1.html                  # Alternate Home page
├── README.md                    # Project documentation
├── assets/
│   ├── css/
│   │   ├── style.css            # Base styles, typography, layout & components
│   │   ├── dark-mode.css        # Dark theme palette & component overrides
│   │   └── rtl.css              # Bidirectional RTL layout adjustments
│   ├── js/
│   │   └── main.js              # State management, cart, search, matcher, dialogs
│   └── images/                  # High-resolution optimized WebP assets
└── pages/
    ├── about.html               # About & Brand story
    ├── products.html            # Products & Filterable Catalog
    ├── recommendations.html     # Interactive Recommendation Matcher
    ├── events.html              # Event Schedule & RSVP Dialog
    ├── contact.html             # Contact, Store Info & Location
    ├── signin.html              # Account Sign-In
    ├── signup.html              # Account Registration
    ├── privacy.html             # Privacy Policy
    ├── terms.html               # Terms of Service
    ├── coming-soon.html         # Coming Soon / Launch Teaser
    └── 404.html                 # 404 Page Not Found
```

---

## 📄 License & Credits

- **Icons**: Embedded SVG subset based on [Lucide Icons](https://lucide.dev/) (ISC License).
- **Artwork & Imagery**: Custom generated visual assets, optimized for responsive web distribution.
- **Code**: Clean, handcrafted vanilla frontend stack designed for easy white-labeling and deployment.

---

<div align="center">
Made with care for board game lovers and welcoming game tables everywhere. 🎲
</div>
