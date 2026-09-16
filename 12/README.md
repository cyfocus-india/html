<div align="center">

# 🎓 ExamSuccess — Online Coaching & Exam Prep Platform

**A premier, modern, responsive multi-page web platform for competitive exam coaching.**  
*Engineered with pure vanilla HTML5, CSS3, and JavaScript — zero external dependencies, zero build steps.*

---

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Dark Mode](https://img.shields.io/badge/Dark%20Mode-Supported-60a5fa?style=for-the-badge&logo=google-cloud&logoColor=white)](#-theme--internationalization)
[![RTL Ready](https://img.shields.io/badge/RTL-Ready-10b981?style=for-the-badge)](#-theme--internationalization)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

[**Explore Pages**](#-page-architecture) • [**Key Features**](#-key-features) • [**Quick Start**](#-quick-start) • [**Customization**](#-customization-guide) • [**Directory Tree**](#-project-structure)

---

</div>

## 🌟 Overview

**ExamSuccess** is a comprehensive educational web portal designed for competitive exam aspirants across Banking, SSC, Railways, Engineering, Teaching, State PSC, and Defence categories.

Built from the ground up prioritizing **performance, accessibility, mobile responsiveness, and clean component modularity**, this platform works straight out of the box with no npm dependencies, no heavy frameworks, and offline-friendly assets.

---

## ✨ Key Features

| Category | Features & Highlights |
| :--- | :--- |
| **🎨 2 Distinct Home Layouts** | • **Home 1 (`index.html`)**: Dynamic hero, 360° preparation ecosystem, interactive study strategy & score booster calculator, comparison matrix, daily high-yield speed drill & current affairs hub, live exam notification radar, results showcase, and quick CTAs.<br>• **Home 2 (`index1.html`)**: Top notification banner, feature ribbon, interactive testimonials, and course explorer. |
| **📚 Dynamic Course Catalog** | Multi-category live filtering (Banking, SSC, Railways, Engineering, etc.), search-as-you-type, sort by popularity/price, responsive drawer toggle, and live match counters. |
| **🧑‍🏫 Faculty Showcase** | Subject-wise categorized educator lineup with interactive biography modals, experience metrics, and ratings. |
| **🧪 Interactive Mock Test Simulator** | Built-in interactive test engine with countdown timer, real-time question navigation, instant scoring, and detailed step-by-step explanations. |
| **📊 Student Analytics Dashboard** | Full-fledged student portal featuring performance analytics donuts, test score history, weak area breakdowns, schedule calendar, and quick-download notes. |
| **🔐 Form Validation & Auth** | Real-time client-side validated Sign In, Sign Up with password strength meter, Forgot Password modal recovery flow, and contact support forms. |
| **🌗 Theme & Internationalization** | Instant **Light / Dark Mode** toggle + bidirectional **LTR / RTL** layout support, both persisted automatically via `localStorage`. |
| **♿ Accessibility & Performance** | WCAG-compliant color contrast, keyboard navigation (`:focus-visible`), skip links, ARIA dialogs/labels, and optimized WebP images with PNG fallbacks. |

---

## 🧭 Page Architecture

```
ExamSuccess Platform
├── 🏠 index.html                 # Primary Homepage (Classic Showcase)
├── 🏠 index1.html                # Alternate Homepage (Modern Portal Layout)
└── 📄 pages/
    ├── 📖 courses.html           # Searchable & Filterable Course Catalog
    ├── 👨‍🏫 faculty.html           # 12+ Expert Profiles with Filter Tabs & Modal Bio
    ├── 🏆 results.html           # All-India Rankers, Statistics & Success Stories
    ├── 💳 fees.html              # Segmented Pricing Calculator (3/12/18 Mo) + Coupon Code
    ├── 📅 live-classes.html      # Interactive Weekly Schedule & Upcoming Live Sessions
    ├── 📥 study-materials.html   # Downloadable Free & Premium PDF Capsules / Notes
    ├── 📊 dashboard.html         # Complete Student Dashboard & Performance Metrics
    ├── 🔑 signin.html            # Login Interface + Forgot Password Reset Dialog
    ├── 📝 signup.html            # Learner Registration + Password Strength Engine
    ├── ℹ️ about.html             # Academy Mission, Pedagogy & Story
    ├── ✉️ contact.html           # Contact Information, FAQ & Feedback Form
    ├── 🛡️ privacy.html           # Student Data & Privacy Terms
    ├── 📜 terms.html             # Terms of Service & Educational Guidelines
    ├── ⏳ coming-soon.html       # Mobile App Launch Countdown State
    └── 🚫 404.html               # Custom Error Page with Navigation Recovery
```

---

## 🚀 Quick Start

Because ExamSuccess is crafted with standard Web APIs, you can run it immediately without any build step or package installations.

### Option 1: Python Local Server (Recommended)
```bash
# Navigate to the project root directory
cd "12 Online Coaching Platform for Competitive Exams"

# Launch lightweight HTTP server
python3 -m http.server 8000
```
Open **`http://localhost:8000`** in your browser.

### Option 2: Node / NPX
```bash
npx serve .
# or
npx http-server -p 8000
```

### Option 3: Direct File Execution
You can double-click **`index.html`** or open it directly in Google Chrome, Mozilla Firefox, Apple Safari, or Microsoft Edge.

---

## 🎨 Customization Guide

### 1. Color Palette & Theming (`assets/css/style.css` & `assets/css/dark-mode.css`)
Easily customize brand colors via CSS Custom Properties located in the `:root` scope:

```css
:root {
  --blue-950: #02102c;   /* Deep Navy */
  --blue-700: #0a3ea8;   /* Primary Brand Blue */
  --blue-600: #0b5de7;   /* Accent Blue */
  --blue-500: #2563eb;   /* Interactive Highlight */
  --blue-50:  #f0f5ff;   /* Soft Ice Background */
  --surface:  #ffffff;   /* Card Surface */
  --text:     #2c3e55;   /* Body Copy */
  --ink:      #081735;   /* Headings */
  --green:    #16a34a;   /* Success & Badges */
  --red:      #ef2b36;   /* Alerts & Errors */
}
```

### 2. Typography
The platform utilizes a modern system font stack (`system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`) for crisp rendering and zero external font network requests. Custom web fonts can be plugged into `style.css` as needed.

### 3. SVG Vector Icon Sprite (`assets/js/main.js`)
All UI icons (over 30+ icons including search, filters, badges, stars, calendars, eye-toggle, checks, etc.) are bundled into an inline, zero-CORS SVG sprite definition inside `assets/js/main.js`, ensuring zero broken assets when running on `file://` or custom servers.

---

## 📱 Responsive Design & Breakpoints

| Breakpoint | Target Devices | Layout Behavior |
| :--- | :--- | :--- |
| **`< 480px`** | Mobile Phones | Full-width vertical stacks, centered filter bars, compact touch controls, full-screen nav drawer. |
| **`480px – 759px`** | Large Phones / Phablets | 2-column stat grids, segmented 3-tier fee toggles, adapted banner padding. |
| **`760px – 1023px`** | Tablets & Small Laptops | 2-column course catalog, inline pricing badges, expanded navigation. |
| **`≥ 1024px`** | Desktops & Ultra-wide | Multi-column grid architectures, sticky sidebars, dual-pane student dashboard. |

---

## 📂 Project Structure

```
.
├── index.html                   # Primary Homepage (Home 1)
├── index1.html                  # Secondary Homepage (Home 2)
├── README.md                    # Project Documentation
├── assets/
│   ├── css/
│   │   ├── style.css            # Primary Master Stylesheet & Variables
│   │   ├── dark-mode.css        # Comprehensive Dark Theme Overrides
│   │   └── rtl.css              # Right-to-Left (RTL) Layout Adaptations
│   ├── js/
│   │   ├── main.js              # Global Navigation, Modals, Sprites, Forms & Mock Test
│   │   └── dashboard.js         # Student Dashboard Controls & Analytics Visualizer
│   └── images/
│       ├── logo.svg             # Primary Vector Brand Logo
│       ├── logo-white.svg       # Dark Mode / Footer Contrast Logo
│       ├── favicon.svg          # Browser Favicon
│       ├── icons.svg            # Fallback Standalone Sprite
│       ├── hero-students.png    # Hero Showcase Image (PNG)
│       ├── faculty-lineup.png   # Faculty Lineup Banner
│       ├── faculty-lineup.webp  # Optimized WebP Banner
│       ├── faculty-sprite.png   # High-Res Faculty Avatar Sprite Sheet
│       └── faculty-sprite.webp  # Optimized WebP Faculty Avatar Sprite Sheet
└── pages/
    ├── 404.html                 # Error Page
    ├── about.html               # About Us & Mission
    ├── coming-soon.html         # Mobile App Teaser
    ├── contact.html             # Contact Form & Help Desk
    ├── courses.html             # Searchable Course Explorer
    ├── dashboard.html           # Student Learning Dashboard
    ├── faculty.html             # Educator Profiles & Bio Modals
    ├── fees.html                # Pricing & Fee Plans
    ├── live-classes.html        # Live Class Schedule Calendar
    ├── privacy.html             # Privacy Policy
    ├── results.html             # Rankers & Exam Results
    ├── signin.html              # Sign In & Forgot Password Modal
    ├── signup.html              # Registration Page
    ├── study-materials.html     # Notes & PDF Resources
    └── terms.html               # Terms of Service
```

---

## 🔒 Browser Compatibility

| Browser | Status |
| :--- | :--- |
| **Google Chrome / Chromium** | ✅ Fully Supported (Latest) |
| **Mozilla Firefox** | ✅ Fully Supported (Latest) |
| **Apple Safari / iOS Safari** | ✅ Fully Supported (Latest) |
| **Microsoft Edge** | ✅ Fully Supported (Latest) |
| **Opera / Brave** | ✅ Fully Supported (Latest) |

---

## 📄 License & Attribution

- **Code & Design**: Provided under the **MIT License**.
- **Images & Visuals**: Project-specific generated assets with WebP optimizations.
- **Zero Third-Party CDNs**: Fully self-contained for offline resilience, fast load times, and GDPR/privacy compliance.

<div align="center">

**ExamSuccess EduTech** • *Empowering Learners Nationwide*

</div>
