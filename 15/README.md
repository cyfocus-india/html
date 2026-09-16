<div align="center">

# ☀️ SolarNest — Residential Solar Installation Platform

<p align="center">
  <strong>A premium, ultra-responsive, zero-dependency multi-page web platform designed for residential and small-office rooftop solar solutions.</strong>
</p>

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/Vanilla%20JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Responsive](https://img.shields.io/badge/Responsive-Design-2f9631?style=for-the-badge&logo=googlechrome&logoColor=white)](#)
[![Dark Mode](https://img.shields.io/badge/Dark%20Mode-Supported-0e1a2a?style=for-the-badge&logo=affinity&logoColor=white)](#)
[![RTL Supported](https://img.shields.io/badge/RTL-Ready-78bb3d?style=for-the-badge&logo=translate&logoColor=white)](#)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-success?style=for-the-badge&logo=w3c&logoColor=white)](#)

<br>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-key-features">Key Features</a> •
  <a href="#-page-directory">Pages & Routes</a> •
  <a href="#-interactive-systems">Interactive Systems</a> •
  <a href="#-design-system--tokens">Design System</a> •
  <a href="#-accessibility--performance">Accessibility</a>
</p>

---

</div>

## 🌟 Highlights & Overview

**SolarNest** delivers an end-to-end solar discovery, estimation, and booking experience for homeowners and small businesses. Built exclusively with standards-based **HTML5**, **CSS3 (Modern Variables & Flex/Grid)**, and **Vanilla JavaScript (ES6+)**, it delivers lightning-fast load times with **zero build step**, **zero runtime dependencies**, and instant setup.

| Feature | Description |
|:---|:---|
| ⚡ **Zero Build Step** | Open `index.html` or run any static server — no `npm install`, Node.js, or bundlers needed. |
| 🌓 **Adaptive Theme Engine** | Light and Dark mode with auto-system detection and saved `localStorage` preferences. |
| 🔄 **Full Bi-directional RTL Support** | Right-to-Left layout toggle (`dir="rtl"`) with mirrored icons, grids, and navigation. |
| 📊 **25-Year Savings Calculator** | Interactive ROI modeling, tariff escalation, lifetime net savings, and carbon offset calculations. |
| 🗺️ **Interactive Solar Map** | Integrated multi-city regional hub explorer with custom Leaflet markers and office info cards. |
| 🗂️ **Case Study Modal System** | Accessible modal dialogs showcasing system specs, client testimonials, and generated metrics. |
| 🛡️ **WCAG 2.1 AA Compliant** | Keyboard navigation, ARIA landmarks, visible focus rings, and `prefers-reduced-motion` respect. |

---

## 🚀 Quick Start

Run SolarNest instantly without compiling or downloading npm packages.

### Option 1: Instant Python Static Server (Recommended)

```bash
# Navigate to the project directory and start a local server
python3 -m http.server 4173
```

Open your browser and navigate to: **`http://localhost:4173`**

### Option 2: Node.js `npx serve`

```bash
npx serve . -p 4173
```

### Option 3: Direct File Execution
Double-click `index.html` to open it directly in any modern web browser (Chrome, Safari, Firefox, Edge).

---

## 🧭 Page Directory & Sitemap

```
├── index.html                     # Primary Home Page (Hero, Quick Calc, Products, Process, Testimonials)
├── index1.html                    # Alternate Home Page composition
└── pages/
    ├── products.html              # 1 kW to 10 kW system comparison with audience filtering
    ├── calculator.html            # 25-Year Solar Savings Calculator with visual comparison chart
    ├── how-it-works.html          # Step-by-step 6-stage engineering and installation journey
    ├── projects.html              # Filterable 9-project installation gallery & case study modal
    ├── faq.html                   # Categorized FAQ accordions with animated solar visual card
    ├── contact.html               # Multi-location interactive map & prefilled booking form
    ├── about.html                 # Brand story, tier-1 engineering guarantees, and values
    ├── signin.html                # Client portal sign-in with live validation & forgot password link
    ├── signup.html                # Customer account registration form
    ├── forgot-password.html       # Password reset recovery workflow
    ├── coming-soon.html           # Feature preview and email subscription launch state
    ├── 404.html                   # Custom error page with fallback recovery links
    ├── privacy.html               # Customer data privacy policy
    └── terms.html                 # Terms and conditions of service
```

---

## 🧩 Interactive Systems

### 1. 🧮 25-Year Solar Financial Calculator
- **Dynamic Energy Economics**: Computes daytime solar self-consumption, monthly grid bill reduction, annual yield, simple payback period, and 25-year lifetime savings based on user monthly bills and roof capacity.
- **Visual Bill Comparison**: Real-time CSS-driven bar chart rendering year-over-year tariff inflation against lower solar generation costs.
- **CO₂ Offset Metric**: Translates generated clean kilowatt-hours into metric tons of carbon reduction per year.

### 2. 🔍 Multi-Filter Project Gallery & Case Study Modals
- **Instant Dual-Filter Filtering**: Filter projects seamlessly across multiple dimensions:
  - **Category**: *All Projects*, *Homes*, *Small Offices*
  - **Capacity**: *1–3 kW*, *5–10 kW*, *Above 10 kW*
  - **Location**: *South India*, *West India*
- **Rich Modal Dialogs**: Click any project card to inspect inverter specs, panel count, yearly savings, and homeowner review. Built with keyboard focus trapping, `Escape` key listeners, and backdrop click dismiss.

### 3. 🗺️ Multi-City Location Hub & Interactive Map
- Custom Leaflet.js interactive map pins for SolarNest engineering hubs (Bengaluru, Pune, Hyderabad, Chennai, Ahmedabad).
- Dynamic location tabs with address details, operational hours, and direct booking links.
- Filtered dark-mode map tiles tailored to match the navy theme palette.

### 4. 🌗 Theme & RTL Engine
- **Dark Mode**: Persistent dark theme via `html[data-theme="dark"]` with custom radial glows, high-contrast typography, and tailored SVG icons.
- **RTL Support**: Seamless RTL flipping via `html[dir="rtl"]` with automatic transforms for process arrows, cards, badges, and dropdown icons.

---

## 🎨 Design System & Tokens

SolarNest follows a cohesive visual design system declared in [`assets/css/style.css`](file:///Users/viki/Viki/Viki/CyFocus/Website%20Files/2026/September/15%20Residential%20Solar%20Panel%20Installation%20Company/assets/css/style.css):

### Color Palette

| Token | Light Theme | Dark Theme | Purpose |
|:---|:---:|:---:|:---|
| `--green` | `#2f9631` | `#5bc75c` | Primary brand accent & active states |
| `--green-dark` | `#217522` | `#8bde85` | Hover states & emphasized data points |
| `--green-soft` | `#eef8ed` | `#173522` | Soft pill backgrounds & badges |
| `--lime` | `#78bb3d` | `#78bb3d` | Secondary solar accent & orbit accents |
| `--ink` | `#10223f` | `#edf5ff` | Primary headline and body typography |
| `--ink-soft` | `#46536a` | `#aab9ca` | Secondary subtitles and metadata |
| `--paper` | `#ffffff` | `#0e1a2a` | Card surfaces & container background |
| `--canvas` | `#f7faf8` | `#111f30` | Section backgrounds & muted areas |
| `--line` | `#dfe8e2` | `#293a4f` | Borders, dividers, and outlines |

### Typography
- **Primary Typeface**: [Manrope](https://fonts.google.com/specimen/Manrope) (Weights: `400`, `500`, `600`, `700`, `800`) via Google Fonts with system font fallbacks (`Inter`, `system-ui`, `-apple-system`, `sans-serif`).
- **Icons**: [Lucide Icons](https://lucide.dev/) (v0.468.0) loaded asynchronously via CDN.

---

## 📂 Project Architecture

```
15 Residential Solar Panel Installation Company/
│
├── index.html                     # Primary landing page
├── index1.html                    # Secondary landing page variation
├── README.md                      # Platform documentation
│
├── assets/
│   ├── css/
│   │   ├── style.css              # Core shared design tokens, components & responsive layout
│   │   ├── dark-mode.css          # Dark theme overrides and palette mapping
│   │   └── rtl.css                # Right-to-left directional adaptations
│   │
│   ├── js/
│   │   └── main.js                # Core JS: Nav mounting, theme toggle, RTL, calculator, filters, modals
│   │
│   └── images/                    # High-resolution optimized project, product, and hero images
│       ├── hero-home.png
│       ├── hero-products.png
│       ├── hero-calculator.png
│       ├── hero-projects.png
│       ├── system-1kw.png ... system-10kw.png
│       └── project-bengaluru.png ... project-ahmedabad.png
│
└── pages/                         # Multi-page views (13 distinct route pages)
```

---

## ♿ Accessibility & Performance

SolarNest has been built from the ground up for high performance and strict accessibility:

- ✅ **Skip-to-Content Link**: `#main-content` skip link present on every page.
- ✅ **ARIA Attributes**: Live `role="status"` announcements on calculators and forms, `aria-expanded` on accordions and menus, `aria-haspopup` on modal triggers.
- ✅ **Keyboard Friendly**: Complete tabindex management with visible `:focus-visible` styling (`outline: 2.5px solid var(--green)`).
- ✅ **Prefers-Reduced-Motion**: Automatically disables all non-essential keyframe spins, floats, and transitions for users requesting reduced motion.
- ✅ **SEO & Social**: Comprehensive Open Graph and meta descriptions on all subpages.

---

## 🛠️ Customization Guide

1. **Change Brand Colors**: Modify `--green`, `--green-dark`, and `--lime` in `:root` of `assets/css/style.css`.
2. **Update Company Contact Info**: Replace phone numbers, email addresses, and office addresses in `pages/contact.html` and the footer template in `assets/js/main.js`.
3. **Add New Projects**: Add new project articles in `pages/projects.html` and register their case study story in `projectCaseStudies` object inside `assets/js/main.js`.
4. **Change Subsidies & Tariff Formula**: Adjust subsidy calculation percentages and standard unit generation constants in `calculateSavings()` in `assets/js/main.js`.

---

<div align="center">

**Built with 💚 for clean energy homeowners.**

</div>
