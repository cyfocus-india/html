<div align="center">

# 🚗 DriveWay Driving School &amp; License Training

**A modern, responsive, accessible multi-page driving school web platform and interactive student portal.**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Leaflet](https://img.shields.io/badge/Leaflet-19.4-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Lucide Icons](https://img.shields.io/badge/Lucide-Icons-F4512A?style=for-the-badge)](https://lucide.dev/)
[![Accessibility](https://img.shields.io/badge/WCAG-2.1%20AA-16a34a?style=for-the-badge)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Dark Mode](https://img.shields.io/badge/Theme-Light%20%2F%20Dark-08263f?style=for-the-badge)](#-theming--customization)
[![RTL Ready](https://img.shields.io/badge/Layout-LTR%20%26%20RTL-7c3aed?style=for-the-badge)](#-accessibility--internationalization)

<br/>

[Live Demo](#-quick-start) • [Features](#-key-features) • [Pages & Sitemap](#-pages--sitemap) • [Interactive Map](#-live-interactive-map) • [Student Dashboard](#-student-dashboard-portal) • [Documentation](#-documentation)

</div>

---

## 🌟 Overview

**DriveWay** is a complete, production-ready web application built for modern driving schools, automotive training academies, and license coaching centers. Engineered with high-performance vanilla JavaScript and modern CSS, it features a public marketing site, interactive course catalogs, instructor booking, a full student dashboard, and a live interactive training track map.

---

## ✨ Key Features

### 🎨 Design & Experience
- 🌓 **Instant Dark & Light Modes**: System-aware with persistent user preference storage.
- 🔄 **Bidirectional Layout (LTR &amp; RTL)**: Full right-to-left layout switch for global accessibility.
- 📱 **100% Mobile Responsive**: Fluid typography and grid systems across mobile, tablet, and 4K displays.
- ⚡ **Zero Framework Overhead**: Fast, lightweight vanilla JS and native CSS variables without heavy bundles.

### 🗺️ Live Interactive Map
- 📍 **OpenStreetMap &amp; Leaflet Integration**: High-speed interactive map without API keys.
- 🏢 **Multi-Campus Training Selector**: Switch between Central HQ &amp; Track, North City Hub, and South Highway Grounds.
- 🎯 **"Find Nearest Campus" Geolocation**: Calculates real-time Haversine driving distances and auto-centers the closest branch.
- 🧭 **Turn-by-Turn Navigation**: One-click Google Maps directions and clipboard address copying.
- 🌙 **Dark-Mode Calibrated Map Tiles**: Custom invert/hue filters seamlessly match the dark theme palette.

### 📊 Interactive Student Dashboard
- 📈 **Training Progress Rings &amp; Analytics**: Visual progress breakdown across 40 hours of required practical lessons.
- 📅 **Interactive Lesson Booking Engine**: Select instructors, dates, and dynamic morning/evening time slots.
- 💬 **Instructor Feedback &amp; Lesson Notes**: Filter feedback by coach, review strengths and focus areas, and ask questions with the sticky note form.
- 🧾 **Official Tax Invoices &amp; PDF Export**: View itemized tuition invoices and print or save official student training records.
- 🗂️ **Digital Document Vault**: Upload and verify learner licenses, medical fitness records, and RTO forms.

### 🛡️ Forms & Accessibility
- 🔒 **Client-Side Form Validation**: Real-time validation with ARIA live feedback and inline error messaging.
- ♿ **WCAG 2.1 AA Compliant**: Keyboard navigation focus states, skip-to-content links, and semantic landmark tags.
- 🏎️ **Reduced Motion Support**: Automatically disables intense animations for users with motion sensitivity.

---

## 🚀 Quick Start

### Option 1: Direct Browser
Simply double-click `index.html` to open it in any modern browser.

### Option 2: Local HTTP Server (Recommended)

#### Using Python 3:
```bash
python3 -m http.server 8080
```
Then open your browser at **`http://localhost:8080`**.

#### Using Node.js (npx serve):
```bash
npx serve . -p 8080
```

#### Using VS Code Live Server:
Right-click on `index.html` and select **"Open with Live Server"**.

---

## 📄 Pages &amp; Sitemap

| Page | File Path | Description &amp; Highlights |
|:-----|:----------|:-----------------------------|
| **Home (Landing 1)** | [`index.html`](index.html) | Primary landing page with animated hero, pass statistics, course highlights, and student testimonials. |
| **Home (Landing 2)** | [`index1.html`](index1.html) | Alternate home variant focusing on the 4-stage learning journey and student portal preview. |
| **Courses &amp; Training** | [`pages/courses.html`](pages/courses.html) | Two-wheeler, four-wheeler, and refresher course programs with interactive syllabus modals. |
| **Instructors** | [`pages/instructors.html`](pages/instructors.html) | Certified instructor profiles, ratings, vehicle specialties, and direct lesson booking. |
| **Fleet &amp; Vehicles** | [`pages/vehicles.html`](pages/vehicles.html) | Dual-control car fleet (Manual/Automatic), safety ratings, and maintenance specs. |
| **Fee Plans &amp; Pricing** | [`pages/fees.html`](pages/fees.html) | Transparent tuition packages, installment split options, and fee breakdown dialogs. |
| **Contact &amp; Map** | [`pages/contact.html`](pages/contact.html) | Contact inquiry form, support channels, and the **Live Interactive Campus Map**. |
| **Student Dashboard** | [`pages/dashboard.html`](pages/dashboard.html) | Interactive student portal: Overview, Bookings, Progress, Feedback, and Documents. |
| **Student Profile** | [`pages/profile.html`](pages/profile.html) | Profile management, emergency contacts, learning goals, and password controls. |
| **Sign In** | [`pages/signin.html`](pages/signin.html) | Student login portal with client validation and demo account credentials. |
| **Sign Up** | [`pages/signup.html`](pages/signup.html) | New student enrollment form with license category selector and safety terms. |
| **About Us** | [`pages/about.html`](pages/about.html) | Driving school background, safety philosophy, milestones, and accreditation. |
| **Coming Soon** | [`pages/coming-soon.html`](pages/coming-soon.html) | Pre-launch countdown page for advanced EV driving and simulator courses. |
| **404 Page** | [`pages/404.html`](pages/404.html) | Custom branded page-not-found route with quick recovery navigation links. |
| **Privacy Policy** | [`pages/privacy.html`](pages/privacy.html) | Data protection standards, student records management, and privacy rights. |
| **Terms of Service** | [`pages/terms.html`](pages/terms.html) | Enrollment policies, attendance rules, vehicle damage liability, and refunds. |

---

## 🎨 Design System &amp; Color Palette

| Token | Light Theme | Dark Theme | Purpose / Usage |
|:------|:------------|:-----------|:----------------|
| `--navy-950` | `#061f35` | `#041829` | Headers, brand mark, solid buttons, dark accents |
| `--navy-900` | `#08263f` | `#082842` | Hero backgrounds, badges, and deep layout borders |
| `--blue` | `#0d5db8` | `#3b82f6` | Primary brand accent, active tabs, links, focus rings |
| `--orange` | `#f4512a` | `#f4512a` | Primary CTA buttons, action highlights, active states |
| `--green` | `#1da55b` | `#22c55e` | Pass rate badges, positive status, success feedback |
| `--surface` | `#ffffff` | `#071f33` | Card backgrounds, modals, input containers |
| `--soft` | `#f6f8fb` | `#0b2941` | Secondary backgrounds, subtle pill highlights |
| `--line` | `#dfe4ea` | `#29465c` | Card borders, dividers, table row outlines |

---

## 📁 Project Architecture

```
DriveWay/
├── assets/
│   ├── css/
│   │   ├── style.css          # Core design system, components, and public styles
│   │   ├── dashboard.css      # Student portal grid, charts, booking, and documents
│   │   ├── dark-mode.css      # Comprehensive dark theme overrides and map tile filters
│   │   └── rtl.css            # Right-to-left layout bidirectional overrides
│   ├── images/
│   │   ├── driveway-hero.png  # Hero graphics and report illustration
│   │   ├── driveway-hero.webp # Next-gen WebP compressed asset
│   │   ├── instructor-1.png   # Rajesh Kumar profile avatar
│   │   ├── instructor-2.png   # Anita Rao profile avatar
│   │   └── instructor-3.png   # Vikram Singh profile avatar
│   └── js/
│       ├── main.js            # Global header/footer, animations, modals, and Leaflet map
│       └── dashboard.js       # Booking engine, feedback filters, invoices, and progress metrics
├── documentation/
│   ├── changelog.md           # Version release notes and update history
│   ├── credits.md             # Third-party assets and licensing details
│   ├── customization.md       # Guide for modifying courses, prices, and branding
│   ├── installation.md        # Deployment and hosting setup walkthrough
│   ├── page-structure.md      # Page catalog and layout architecture
│   └── support.md             # Technical support and maintenance guidelines
├── pages/                     # Sub-pages catalog (dashboard, courses, contact, etc.)
├── index.html                 # Primary public landing page
├── index1.html                # Alternate home page
├── robots.txt                 # Search engine crawler permissions
├── sitemap.xml                # SEO index sitemap
└── README.md                  # Project documentation (this file)
```

---

## 🛠️ Technology Stack

- **Core**: Semantic HTML5, Modern CSS3 (CSS Grid, Flexbox, Custom Properties), Vanilla ES6+ JavaScript.
- **Mapping &amp; GIS**: [Leaflet.js](https://leafletjs.com/) + [OpenStreetMap](https://www.openstreetmap.org/) Carto Tiles.
- **Icons**: [Lucide Icons](https://lucide.dev/) (UMD v0.468.0).
- **Typography**: Inter / System UI Font Stack.
- **Zero Build Tools Required**: Runs directly in the browser or on static CDNs (Vercel, Netlify, GitHub Pages, Firebase Hosting).

---

## 📚 Detailed Documentation

For advanced setup, extending the course catalog, or changing business details:
- 📖 [Installation &amp; Deployment Guide](documentation/installation.md)
- 🎨 [Customization &amp; Theming Guide](documentation/customization.md)
- 📑 [Page Architecture &amp; Component System](documentation/page-structure.md)
- 📜 [Changelog &amp; Release History](documentation/changelog.md)
- 🤝 [Credits &amp; Third-Party Licenses](documentation/credits.md)
- 💬 [Support &amp; Maintenance](documentation/support.md)

---

## ⚖️ License

Distributed under the **MIT License**. Third-party libraries (Lucide Icons, Leaflet) are used under their respective open-source licenses. See [`documentation/credits.md`](documentation/credits.md) for details.

<div align="center">
  <sub>Built with ❤️ for professional driver education. © DriveWay Driving School. All rights reserved.</sub>
</div>

