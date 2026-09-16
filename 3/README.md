<div align="center">

# 🌸 Rosewood Florals

**Artisanal Flower Shop & Same-Day Bouquet Delivery Web Experience**

*Handcrafted with modern semantic HTML5, fluid CSS3 design tokens, and lightweight vanilla JavaScript.*

<br />

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero%20Build%20Step-brightgreen?style=for-the-badge)](#)
[![Light / Dark](https://img.shields.io/badge/Theme-Light%20%7C%20Dark-661f3f?style=for-the-badge)](#)
[![LTR / RTL](https://img.shields.io/badge/Layout-LTR%20%7C%20RTL-e78ba6?style=for-the-badge)](#)
[![WCAG Compliant](https://img.shields.io/badge/Accessibility-WCAG%20AA%2FAAA-788b69?style=for-the-badge)](#)

<br />

[✨ Features](#-key-features) • [🚀 Quick Start](#-quick-start) • [🗺️ Sitemap & Pages](#%EF%B8%8F-sitemap--pages) • [🎨 Design System](#-design-system--tokens) • [🛠️ Customization](#%EF%B8%8F-customization-guide)

---

</div>

## 🌿 Overview

**Rosewood Florals** is a responsive, multi-page storefront and delivery experience tailored for artisanal florists, luxury bouquet shops, and same-day flower delivery services. Built without frameworks or heavy build tooling, it delivers performance, typography, and accessibility out of the box.

```
🌹 "Season-led bouquets composed by hand, wrapped with intention, and delivered across the city the very same day."
```

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **🛍️ Dynamic Shopping Experience** | Interactive slide-out shopping drawer with real-time subtotal, quantity stepper, free delivery progress tracker, handwritten gift card notes, and a modal checkout flow. |
| **🌓 Dual Theme Engine** | Automatic OS preference detection with a persistent **Light & Dark mode** toggle, with contrast ratios (WCAG AAA). |
| **🌐 Bi-Directional Layout (LTR / RTL)** | Native **Right-to-Left (RTL)** and **Left-to-Right (LTR)** support with mirrored animations, chevrons, and layout grids. |
| **🗺️ Live Delivery Zone Map** | Embedded interactive Bengaluru delivery zone navigator with instant postal code lookup (Indiranagar, Koramangala, Whitefield, Jayanagar, HSR Layout). |
| **💐 Multi-Occasion Filtering** | Instant client-side filtering for Birthday, Anniversary, Wedding, Sympathy, and Congratulations arrangements with URL hash sync. |
| **📱 100% Fluid & Mobile-Ready** | Responsive layouts across mobile, tablet, desktop, and ultra-wide screens with 0px horizontal overflow and touch-friendly targets. |
| **⚡ Micro-Interactions & Motion** | Scroll reveals, image rise animations, floating floral petal drifts, animated milestone counters, and full `prefers-reduced-motion` compliance. |
| **📝 Validated Customer Forms** | Custom floral arrangement request builder with interactive budget slider, corporate bulk inquiries, and contact forms. |

---

## 🚀 Quick Start

No Node.js, npm, bundler, or build pipeline is required. Simply serve the static files with any local server:

### Option 1: Python HTTP Server (Recommended)
```bash
# Navigate to the project directory
cd "3 Flower Shop & Bouquet Delivery"

# Start local server
python3 -m http.server 4173
```
👉 Open **`http://localhost:4173`** in your browser.

### Option 2: Node.js `npx serve`
```bash
npx serve .
```

### Option 3: VS Code Live Server
Right-click `index.html` and select **"Open with Live Server"**.

---

## 🗺️ Sitemap & Pages

The template consists of **14 structured HTML pages**:

```
.
├── 📄 index.html                  # Home 1 — Classic Editorial Flower Studio
├── 📄 index1.html                 # Home 2 — Campaign & Seasonal Edit Experience
│
└── 📁 pages/
    ├── 🛍️ products.html           # Catalogue & Occasion-based Bouquet Filter
    ├── 🚚 same-day-delivery.html   # Same-Day Info, Cutoffs & Live Zone Map
    ├── 🎨 custom-arrangement.html # Custom Floral Brief & Interactive Budget Slider
    ├── 🏢 bulk-orders.html        # Corporate Events, Subscriptions & Workplace Gifting
    ├── 📖 about.html              # Studio Philosophy, Founders & Sourcing Values
    ├── ✉️ contact.html            # Studio Inquiries, Map & Direct Contact
    ├── 🔐 signin.html             # Client Sign-In Portal (Demo)
    ├── 📝 signup.html             # Client Account Registration (Demo)
    ├── 📜 privacy.html            # Privacy Policy Template
    ├── ⚖️ terms.html              # Terms of Service & Cancellation Policy
    ├── ⏳ coming-soon.html        # Preview & Launch Announcement State
    └── 🔍 404.html                # Custom 404 Error State with Return CTA
```

---

## 🎨 Design System & Tokens

All typography, spacing, radii, and color tokens are managed via CSS Custom Properties in [`assets/css/style.css`](assets/css/style.css):

### Color Palette

| Token | Light Theme | Dark Theme | Role |
| :--- | :--- | :--- | :--- |
| `--plum` | `#661f3f` | `#e7a1b6` | Primary Brand & Buttons |
| `--plum-deep` | `#431129` | `#3f1429` | Dark Container & Banner Surface |
| `--paper` | `#fffaf5` | `#1c1117` | Canvas / Page Background |
| `--paper-deep` | `#f6ede5` | `#281720` | Subtle Section Tint Background |
| `--surface` | `#ffffff` | `#25161e` | Card & Modal Surface |
| `--ink` | `#2f1724` | `#fff2f2` | Primary Headings & Dark Text |
| `--ink-soft` | `#5e4953` | `#c9b7bd` | High-contrast Body Copy |
| `--rose` | `#cf6888` | `#ef8fae` | Decorative Numbers & Accents |
| `--blush` | `#f7d8df` | `#633147` | Pill Badges & Highlighting |
| `--sage` | `#5f7450` | `#a9bd9b` | Greenery Accents & Success States |

### Typography

- **Headings & Display**: `Georgia, "Times New Roman", serif` — *Editorial, warm, artisanal.*
- **Interface & Body**: `Inter, ui-sans-serif, system-ui, sans-serif` — *Clean, highly legible.*

---

## 📂 Project Architecture

```bash
3 Flower Shop & Bouquet Delivery/
├── index.html                      # Primary landing page
├── index1.html                     # Alternate campaign homepage
├── favicon.ico                     # Bespoke brand mark multi-resolution favicon
├── apple-touch-icon.png            # Apple touch icon (180x180)
├── assets/
│   ├── css/
│   │   ├── style.css               # Core styles, design tokens & responsive rules
│   │   ├── dark-mode.css           # Dark theme palette & component overrides
│   │   ├── rtl.css                 # Right-to-left layout transformations
│   │   └── floral.css              # Floral theme layout, standalone auth & utility rules
│   ├── js/
│   │   └── main.js                 # Cart state, modals, theme/RTL toggles, auth workflows, validation
│   └── images/
│       ├── favicon-16x16.png       # 16x16 crisp brand mark icon
│       ├── favicon-32x32.png       # 32x32 high-DPI brand mark icon
│       ├── apple-touch-icon.png    # 180x180 iOS touch icon
│       ├── florist-hero.webp       # Homepage hero visual (Home 1 & Home 2)
│       ├── about-hero.webp         # Unique hero visual: Floral craft & flatlay
│       ├── shop-hero.webp          # Unique hero visual: Artisanal blooming bouquet
│       ├── contact-hero.webp       # Unique hero visual: European boutique storefront
│       ├── delivery-hero.webp      # Unique hero visual: Hand-wrapped tulip armful
│       ├── bulk-hero.webp          # Unique hero visual: Banquet centerpiece runner
│       ├── custom-hero.webp        # Unique hero visual: Bespoke bridal arrangement
│       ├── signin-hero.webp        # Unique hero visual: Blush ranunculus arrangement
│       ├── signup-hero.webp        # Unique hero visual: Natural light spring tulips
│       ├── coming-soon-hero.webp   # Unique hero visual: Emerging water lily bloom
│       ├── 404-hero.webp           # Unique hero visual: Wild meadow blooms
│       ├── product-afterglow.webp  # Bestselling bouquet
│       ├── product-peach-theory.webp
│       ├── product-meadow-light.webp
│       ├── product-quiet-vow.webp  # Bridal collection
│       ├── product-still-garden.webp
│       ├── product-good-news.webp  # Celebration edit
│       ├── wedding-collection.webp
│       ├── corporate-events.webp
│       └── sympathy-collection.webp
├── pages/                          # Multi-page sub-routes
│   ├── 404.html                    # Standalone utility page (no header/footer, 100svh)
│   ├── about.html
│   ├── bulk-orders.html
│   ├── coming-soon.html            # Standalone utility page (no header/footer, 100svh)
│   ├── contact.html
│   ├── custom-arrangement.html
│   ├── privacy.html
│   ├── products.html
│   ├── same-day-delivery.html
│   ├── signin.html                 # Standalone auth page (forgot password, no header/footer, 100svh)
│   ├── signup.html                 # Standalone auth page (no header/footer, 100svh)
│   └── terms.html
├── documentation/
│   ├── GUIDE.md                    # Detailed integration & customization guide
│   ├── IMAGE_PROMPTS.md            # AI photography generation prompts
│   ├── SHOP_IMAGE_PROMPTS.md       # Product visual specifications
│   └── audit.py                    # Automated HTML structure & link validation script
├── LICENSE.txt                     # License details
└── README.md                       # Visual documentation
```

---

## 🛠️ Customization Guide

### 1. Modifying Products & Pricing
Update the `CATALOG` dictionary in [`assets/js/main.js`](assets/js/main.js):
```javascript
const CATALOG = {
  'Afterglow': {
    id: 'afterglow',
    name: 'Afterglow',
    price: 2450,
    stems: 'Rose · Ranunculus · Stock',
    imageFile: 'product-afterglow.webp'
  },
  // Add new bouquets here...
};
```

### 2. Free Delivery Threshold
Adjust the threshold in [`assets/js/main.js`](assets/js/main.js):
```javascript
const FREE_DELIVERY_THRESHOLD = 3000; // e.g. Free shipping above ₹3,000
const STANDARD_DELIVERY_FEE = 150;
```

### 3. Adding New Pages
When creating a new HTML page inside `pages/`:
1. Include `data-root=".."` on the `<body>` element.
2. Link CSS via `<link rel="stylesheet" href="../assets/css/style.css">`.
3. Add placeholders `<div data-site-header></div>` and `<div data-site-footer></div>` for automatic navigation mounting.

---

## 🧪 Quality & Audit Verification

Run the built-in structural test script to verify heading structures, image alt attributes, label associations, and internal links:

```bash
python3 documentation/audit.py
```
```text
Output:
Structural audit passed for 14 HTML pages.
```

---

## 📜 Credits & Attributions

- **Iconography**: [Lucide Icons](https://lucide.dev/) (ISC License).
- **Typography**: System Fonts + Web Safe Georgia Serif Stack.
- **Imagery**: Original WebP photography created specifically for Rosewood Florals.

---

<div align="center">
  <sub>Designed with care & passion for floral aesthetics. © 2026 Rosewood Florals.</sub>
</div>
