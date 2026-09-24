<div align="center">

# 🌿 Glowé — Skincare & Beauty Store

**A modern, multipage, high-performance skincare e-commerce storefront.**  
Built with pure semantic HTML5, modern CSS3, and lightweight Vanilla JavaScript. Zero build steps, zero dependencies, and 100% offline-ready.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Dark Mode](https://img.shields.io/badge/Dark%20Mode-Supported-211a18?style=for-the-badge&logoColor=white)](assets/css/dark-mode.css)
[![RTL Support](https://img.shields.io/badge/RTL-Ready-7a9155?style=for-the-badge&logoColor=white)](assets/css/rtl.css)
[![Zero Build](https://img.shields.io/badge/Build%20Step-None%20(Pure%20Local)-eb7378?style=for-the-badge)](index.html)

[✨ Live Features](#-key-features) • [🚀 Quick Start](#-quick-start) • [📑 Page Directory](#-page-directory) • [🎨 Design Tokens](#-customization--design-tokens) • [♿ Accessibility](#-accessibility--performance)

---

</div>

## 🌟 Overview

**Glowé** is a clean, responsive, multi-page beauty and skincare website created with bespoke aesthetic layouts, smooth intersection animations, and rich interactive e-commerce features. Designed from the ground up to deliver a production-grade user experience with zero npm packages or build pipelines required.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| 🌓 **Dual Theme (Light & Dark)** | Instant system-aware theme toggle with local storage persistence and smooth color transitions. |
| 🌐 **Complete RTL Support** | One-click Right-to-Left (RTL) mode for Arabic and Hebrew locales with mirrored layouts and typography. |
| 🛍️ **Interactive Shopping Bag** | Slide-out cart drawer with dynamic item additions, qty updates, subtotal calculations, and animated toast feedback. |
| 🧴 **Custom Skin Type Quiz** | Interactive multi-step consultation quiz providing personalized skincare routine recommendations. |
| 🔍 **Live Search & Filter** | Instant client-side product search overlay and category/concern filters on shop pages. |
| 🧪 **Ingredient Transparency** | Interactive ingredient filter tabs with scientific actives, benefits, and clean formulation standards. |
| 📱 **100% Mobile Optimized** | Carefully crafted responsive layouts across mobile (320px+), tablet, desktop, and ultrawide viewports. |
| 🔒 **Form Validation & Auth** | Accessible client-side validation with feedback for Sign In, Sign Up, and Password Reset. |

---

## 🚀 Quick Start

Everything runs locally straight out of the box. No `npm install`, Node.js, or bundlers needed.

### Option 1: Direct File Opening
Double-click `index.html` in any modern browser (Chrome, Safari, Firefox, Edge).

### Option 2: Local HTTP Server (Recommended)
Run a local Python server for the closest production-like routing experience:

```bash
# Start a local web server on port 8000
python3 -m http.server 8000
```

Then visit [`http://localhost:8000`](http://localhost:8000) in your browser.

---

## 📑 Page Directory

| File | Page Title | Key Content & Modules |
| :--- | :--- | :--- |
| [`index.html`](index.html) | **Home (Default)** | Hero section, skin quiz teaser, bestsellers slider, honesty promise, category grid. |
| [`index1.html`](index1.html) | **Home (Editorial)** | Alternate magazine-style hero layout with curated editorial product spotlights. |
| [`pages/shop.html`](pages/shop.html) | **Shop Catalog** | Filterable by category/concern, price sorting, interactive product cards. |
| [`pages/bundles.html`](pages/bundles.html) | **Curated Bundles** | Skincare routine sets with discount savings badges and complete care packs. |
| [`pages/ingredients.html`](pages/ingredients.html) | **Ingredients** | Actives index, filterable by concern (Hydration, Soothing, Anti-Aging, etc.). |
| [`pages/skin-type-guide.html`](pages/skin-type-guide.html) | **Skin Type Guide** | Bare-faced test guide, skin-type characteristics, and step-by-step routines. |
| [`pages/about.html`](pages/about.html) | **About Us** | Brand philosophy, impact metrics, sourcing standards, and team story. |
| [`pages/contact.html`](pages/contact.html) | **Contact & Studios** | Interactive store locator map, skin consultation booking, FAQs, and contact form. |
| [`pages/signin.html`](pages/signin.html) | **Sign In** | Account authentication form with password visibility toggle and remember me. |
| [`pages/signup.html`](pages/signup.html) | **Sign Up** | User registration with terms agreement and validated inputs. |
| [`pages/forgot-password.html`](pages/forgot-password.html) | **Password Recovery** | Dedicated password reset instructions with validated email dispatch. |
| [`pages/privacy.html`](pages/privacy.html) | **Privacy Policy** | Comprehensive data protection and privacy disclosure. |
| [`pages/terms.html`](pages/terms.html) | **Terms & Conditions** | Store policies, shipping terms, and return procedures. |
| [`pages/coming-soon.html`](pages/coming-soon.html) | **Coming Soon** | Pre-launch announcement and email notification subscription. |
| [`pages/404.html`](pages/404.html) | **404 Not Found** | Custom error page with quick links back to the catalog. |

---

## 🎨 Customization & Design Tokens

Global design tokens are defined in [`assets/css/style.css`](assets/css/style.css). You can easily customize branding, colors, and fonts:

```css
:root {
  /* Brand Color Palette */
  --coral: #eb7378;       /* Primary Accent */
  --coral-dark: #cf5b62;  /* Hover / Active */
  --sage: #7a9155;        /* Botanical / Natural Highlights */
  --gold: #d99a34;        /* Ratings & Badges */
  
  /* Surfaces & Backgrounds */
  --paper: #fffdfc;       /* Main Canvas Background */
  --paper-2: #fff8f6;     /* Secondary Soft Tint */
  --surface: #ffffff;     /* Card / Component Background */
  --blush: #fdf0ed;       /* Accent Tint */
  --blush-2: #f8ddda;     /* Subtle Highlight */
  --ink: #151311;         /* Primary Text */
  --muted: #6e6661;       /* Secondary Text */
  --line: #eadfda;        /* Borders & Dividers */

  /* Typography */
  --serif: Georgia, "Times New Roman", serif;
  --sans: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  
  /* Geometry & Motion */
  --radius: 18px;
  --radius-sm: 12px;
  --ease: cubic-bezier(.16, 1, .3, 1);
}
```

* **Dark Theme Overrides**: Located in [`assets/css/dark-mode.css`](assets/css/dark-mode.css).
* **RTL Layout Rules**: Located in [`assets/css/rtl.css`](assets/css/rtl.css).
* **Global Navigation & Modules**: Rendered dynamically via [`assets/js/main.js`](assets/js/main.js).

---

## 🖼️ Media & Image Assets

All imagery is bundled locally in [`assets/images/`](assets/images/):
* **Hero Scenes**: Crisp standalone page scene banners for Shop, Skin Guide, Ingredients, and Bundles.
* **Product Sprites & High-Res Cuts**: Isolated PNGs in `assets/images/shop/` and optimized sprite sheets.
* **Icons**: Offline [Lucide Icons](https://lucide.dev) library bundled in `assets/js/lucide.min.js`.

---

## ♿ Accessibility & Performance

* **WCAG Compliance**: High contrast ratios in both light and dark themes.
* **Keyboard Navigation**: Focus visible rings, skip-to-content links, and fully tab-accessible modals and accordions.
* **Motion Preferences**: Respects `prefers-reduced-motion` to disable transforms and transitions for sensitive users.
* **Zero Dependencies**: Sub-millisecond script load times with zero third-party tracking scripts or external CDN dependencies.

---

## 📝 License

Distributed under the **MIT License**. See `LICENSE.txt` for more information.  
Lucide Icons are licensed under the **ISC License**.

<div align="center">
  <sub>Crafted with care for clean, radiant skincare experiences.</sub>
</div>
