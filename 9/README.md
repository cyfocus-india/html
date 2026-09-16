<div align="center">

# 🩺 CareWell — Home Nursing & Patient Care Agency

<p align="center">
  <strong>A modern, compassionate, fully responsive multi-page web platform designed for premium in-home healthcare, clinical nursing, and companion care services.</strong>
</p>

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Responsive Design](https://img.shields.io/badge/Design-Responsive%20%26%20Fluid-4CAF50?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
[![Dark Mode & RTL](https://img.shields.io/badge/Feature-Dark%20Mode%20%2B%20RTL-7952B3?style=for-the-badge)](https://github.com)
[![WCAG Accessible](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-008080?style=for-the-badge)](https://www.w3.org/WAI/standards-guidelines/wcag/)

<br />

---

</div>

## 📖 Overview

**CareWell** is a patient-centric, high-performance website crafted for home nursing agencies, assisted living providers, rehabilitation therapists, and post-surgery care teams. It combines clinical credibility with an inviting, modern aesthetic built on **Glassmorphism UI**, smooth micro-animations, and full multi-lingual / bi-directional accessibility.

---

## ✨ Core Features & Highlights

```
 ┌──────────────────────┐   ┌──────────────────────┐   ┌──────────────────────┐
 │   🎨 Modern Glass UI │   │  🌓 Dark Mode + RTL  │   │  ⚡ Interactive Popups│
 │   Layered glassmorphic│   │  Instant toggle with │   │  Rich clinical data  │
 │   cards, depth tokens│   │  localStorage cache  │   │  modal & booking cta │
 └──────────────────────┘   └──────────────────────┘   └──────────────────────┘
 ┌──────────────────────┐   ┌──────────────────────┐   ┌──────────────────────┐
 │  🔍 Caregiver Finder │   │  💳 Pricing Engine   │   │  📱 Universal Mobile │
 │  Filter by specialty,│   │  Interactive tiers & │   │  Adaptive navigation │
 │  experience & rating │   │  frequency calculator│   │  & touch-first drawer│
 └──────────────────────┘   └──────────────────────┘   └──────────────────────┘
```

### 🌟 Key Capabilities

- 🏥 **Multi-Page Complete Architecture**: 14 distinct, polished HTML templates covering every operational touchpoint.
- 🌓 **Instant Theme Switching**: Seamless toggle between crisp **Light Mode** and high-contrast **Dark Mode** with persistent browser memory.
- 🌐 **Full RTL (Right-to-Left) Localization**: Native support for RTL languages (Arabic, Hebrew, Urdu) with intelligent layout and alignment flipping.
- 🩺 **Service Details Popover System**: Dynamic popover modals delivering clinical protocols, specialist assignments, equipment lists, and 1-click booking routing.
- 🧮 **Interactive Pricing Engine**: Switchable frequency views (Hourly, Daily, 24/7 Live-In) with transparent breakdowns.
- 👩‍⚕️ **Caregiver Directory**: Searchable specialist database with verified credentials, ratings, and instant inquiry pre-fill.
- 📋 **Integrated Booking & Contact Flow**: Auto-populates service queries directly into consultation inquiry forms.
- ♿ **Accessible & SEO-Optimized**: Semantic HTML5 markup, ARIA compliance, structured meta tags, and keyboard navigation support.
- 🚀 **Zero Dependency Build**: Pure Vanilla HTML5, CSS3, and ES6 JavaScript — no bloated frameworks or build steps required.

---

## 🗂️ Page Directory & Sitemap

| Page | File | Description |
| :--- | :--- | :--- |
| **Home (Classic Hero)** | [`index.html`](index.html) | Primary landing page featuring hero metrics, trust badges, core services, and interactive cards. |
| **Home (Alternative Layout)** | [`index1.html`](index1.html) | Split-hero layout optimized for direct booking and caregiver highlights. |
| **About Us** | [`pages/about.html`](pages/about.html) | Company mission, leadership, clinical standards, and agency history. |
| **Services** | [`pages/services.html`](pages/services.html) | Comprehensive list of clinical nursing, therapy, and companion care packages. |
| **Caregivers** | [`pages/caregivers.html`](pages/caregivers.html) | Certified caregiver profiles with specialty badges, bios, and ratings. |
| **Pricing** | [`pages/pricing.html`](pages/pricing.html) | Transparent pricing calculator, tier comparisons, and FAQ integrations. |
| **Testimonials** | [`pages/testimonials.html`](pages/testimonials.html) | Verified patient and family reviews, success stories, and trust scores. |
| **FAQ** | [`pages/faq.html`](pages/faq.html) | Interactive accordion FAQ addressing common home care and insurance questions. |
| **Contact & Booking** | [`pages/contact.html`](pages/contact.html) | Interactive consultation form, Google Maps container, and emergency contact pills. |
| **Sign In** | [`pages/signin.html`](pages/signin.html) | Client portal login interface with form validation. |
| **Sign Up** | [`pages/signup.html`](pages/signup.html) | New family / patient onboarding interface with input feedback. |
| **Coming Soon** | [`pages/coming-soon.html`](pages/coming-soon.html) | Elegant placeholder page for upcoming portal features with newsletter signup. |
| **404 Not Found** | [`pages/404.html`](pages/404.html) | Friendly custom error page with quick recovery navigation links. |
| **Privacy Policy** | [`pages/privacy.html`](pages/privacy.html) | HIPAA-compliant legal disclosure and data privacy terms. |
| **Terms & Conditions** | [`pages/terms.html`](pages/terms.html) | Terms of service and clinical inquiry disclaimers. |

---

## 📂 Project Architecture

```plaintext
CareWell/
├── index.html                  # Main Landing Page (Home 1)
├── index1.html                 # Secondary Landing Page (Home 2)
├── README.md                   # Visual Project Documentation
├── assets/
│   ├── css/
│   │   ├── styles.css          # Primary design system, typography, and base layout
│   │   ├── pages.css           # Subpage-specific layouts, forms, and tables
│   │   ├── refinement.css      # Micro-tuning, crisp font rendering & elevation
│   │   └── enhancements.css    # Interactive animations, dark mode & RTL overrides
│   ├── js/
│   │   └── script.js           # Core JS: Routing, theme/RTL toggles, modal dialogs, forms
│   ├── icons.svg               # Optimized SVG icon symbol sprite
│   └── images/
│       ├── carewell-favicon.svg # Vector favicon and brand mark
│       ├── carewell-hero.png    # Primary hero photo asset
│       └── carewell-caregiver.png # Certified caregiver feature photo
└── pages/                      # Multi-page HTML templates
    ├── 404.html
    ├── about.html
    ├── caregivers.html
    ├── coming-soon.html
    ├── contact.html
    ├── faq.html
    ├── pricing.html
    ├── privacy.html
    ├── services.html
    ├── signin.html
    ├── signup.html
    ├── terms.html
    └── testimonials.html
```

---

## 🎨 Design System & Color Palette

The visual identity uses clean medical blues paired with soft glassmorphism tints and vibrant status accents:

```
  Primary Blue          Deep Navy           Soft Background       Card Tint (Light)     Dark Canvas
  #2D78FF               #0E2340             #F4F9FF               #FFFFFF (92% Glass)   #081220
  ┌─────────────────┐   ┌─────────────────┐ ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
  │                 │   │                 │ │                 │   │                 │   │                 │
  └─────────────────┘   └─────────────────┘ └─────────────────┘   └─────────────────┘   └─────────────────┘
```

| Token | Light Theme | Dark Theme | Purpose |
| :--- | :--- | :--- | :--- |
| `--blue` | `#2D78FF` | `#4A90E2` | Primary brand color, CTA buttons, active links |
| `--navy` | `#0E2340` | `#F0F6FF` | Primary headings, prominent body titles |
| `--bg-main` | `#F4F9FF` | `#081220` | Canvas and body background gradient base |
| `--card-bg` | `rgba(255, 255, 255, 0.88)` | `rgba(18, 36, 68, 0.88)` | Glassmorphism cards and dialog panels |
| `--border-glass`| `rgba(255, 255, 255, 0.95)` | `rgba(110, 165, 240, 0.25)` | Translucent borders for high-depth layering |
| `--green` | `#25A55F` | `#34D399` | Success badges, verification checks, physiotherapy tag |
| `--purple` | `#7355DF` | `#A78BFA` | Companion care highlights & secondary badges |

---

## 🚀 Quick Start & Usage

This project is completely static and has **no build tool or package dependencies**.

### Option 1: Live Server (VS Code / Cursor / Windsurf)
1. Open the project folder in your editor.
2. Right-click [`index.html`](index.html) and select **"Open with Live Server"**.

### Option 2: Python Simple HTTP Server
Open your terminal in the project root directory and run:
```bash
# Python 3.x
python3 -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.

### Option 3: Node.js `npx serve`
```bash
npx serve .
```

---

## ♿ Accessibility & Browser Support

- **Keyboard Accessible**: All dialogs, accordions, and dropdown menus feature full `Tab`, `Enter`, and `Escape` key listeners.
- **Screen Reader Friendly**: Includes semantic elements (`<header>`, `<main>`, `<nav>`, `<article>`, `<section>`), `aria-expanded`, `aria-label`, and `role="dialog"` attributes.
- **Motion Sensitive**: Respects `prefers-reduced-motion: reduce` by disabling intensive parallax and float animations.
- **Browser Compatibility**: Fully tested across Chrome, Safari, Edge, Firefox, and mobile Safari/Chrome.

---

<div align="center">

**CareWell Home Nursing & Patient Care Agency** &nbsp;•&nbsp; *Compassionate Healthcare Where You Belong*

</div>
