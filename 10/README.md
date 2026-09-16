<div align="center">

# 🎓 Elevate Learning
### Corporate Training & Skill Development Center

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Responsive](https://img.shields.io/badge/Design-Fully%20Responsive-brightgreen?style=for-the-badge)](#)
[![Theme](https://img.shields.io/badge/Theme-Dark%20%2F%20Light%20%2F%20RTL-blueviolet?style=for-the-badge)](#)

<p align="center">
  <strong>A premium, modern, and production-ready enterprise corporate training portal and learning management platform.</strong>
</p>

<p align="center">
  <a href="#-key-features">Key Features</a> •
  <a href="#-pages-overview">Pages Overview</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-interactive-dashboard-features">HR Portal</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-customization">Customization</a>
</p>

---

</div>

## 🌟 Key Features

| Feature | Description |
| :--- | :--- |
| **🎨 2 Distinct Homepages** | Tailored landing experiences for corporate clients and institutional learning leaders. |
| **📊 Interactive HR Portal** | Complete analytics dashboard with enrollment tracking, live attendance rates, and progress metrics. |
| **⚙️ Animated Method Wheel** | Signature concentric, continuous-rotation learning journey wheel with responsive counter-rotation. |
| **🗺️ Interactive Center Maps** | Leaflet-powered global training campus selector with custom map markers and details card. |
| **📜 Certificate Generator** | In-browser dynamic certificate modal generator with printable and exportable layout. |
| **🌓 Dynamic Dark / Light Mode** | System-aware and persistent theme toggle across all pages. |
| **🌍 Full RTL Support** | Complete Right-to-Left layout adaptation for Arabic and Hebrew languages. |
| **📱 Mobile-First Responsive** | Flawlessly optimized across mobile devices (320px+), tablets, laptops, and ultra-wide desktops. |
| **⚡ Zero Dependencies** | Built with pure Vanilla HTML5, modern CSS3 custom properties, and modular Vanilla JS. |

---

## 📑 Pages Overview

```
📁 Elevate Learning Center
├── 🌐 index.html                     # Corporate Training Center Homepage (Hero 1)
├── 🌐 index1.html                    # Skill Development & Capability Center (Hero 2)
└── 📁 pages/
    ├── 📚 programs.html              # Programs Catalog with Filters & Quick View Modals
    ├── 🔄 methodology.html           # 5-Stage Learning Framework & Interactive Wheel
    ├── 🏢 in-house-training.html     # Bespoke Corporate & Custom Enterprise Training
    ├── 🏢 about.html                 # Leadership, Values, Mission & Center Legacy
    ├── 🤝 clients.html               # Enterprise Partners, Client Testimonials & ROI Impact
    ├── 📍 contact.html               # Multi-Campus Contact & Interactive Leaflet Map
    ├── 📊 dashboard.html             # HR Manager Learning Analytics Portal
    ├── 🔐 signin.html                # Secure HR Manager Login with Validation
    ├── ✍️ signup.html                # HR Workspace Registration & Strength Meter
    ├── 🔑 forgot-password.html       # Account Recovery & Email Verification Flow
    ├── ⏳ coming-soon.html           # Launch Countdown & Newsletter Subscribe
    ├── 🚫 404.html                   # Customized Error Page with Quick Nav
    ├── 🔒 privacy.html               # Enterprise Data Protection Policy
    └── 📜 terms.html                 # Corporate Service Agreement Terms
```

---

## 📊 Interactive Dashboard (HR Portal)

The HR Learning Portal (`pages/dashboard.html`) is a full-featured management suite designed for enterprise people managers:

- **Live KPI Counter Cards**: Total enrollments, completion rates, active training hours, and at-risk metrics.
- **Attendance & Progress Charts**: Pure CSS / SVG responsive donut breakdown and progress distribution meters.
- **Employee Roster Table**:
  - Live search filter by learner name, email, department, or status.
  - Interactive certificate viewer & generation modal.
  - Responsive table container with horizontal scroll protection on small screens.
- **Session & Cohort Batch Filter**: Filter attendance and progress by specific cohort dates and programs.
- **Batch Enrollment Modal**: Add and enroll team members with automated validation.
- **Notifications Panel**: Real-time alerts dropdown with read states and badge indicators.
- **Multi-Tab View Switcher**: Single-page switching between Overview, Batches, Reports, and Settings.

---

## 🛠️ Technology Stack

- **Markup**: Semantic HTML5 with ARIA landmark roles and accessibility best practices (`a11y`).
- **Styling**: Modern CSS3:
  - CSS Custom Properties (Design Tokens for colors, fonts, shadows, and radii).
  - Modern CSS Grid & Flexbox layouts with `minmax(0, 1fr)` defensive design.
  - Glassmorphism effects with backdrop filters and custom CSS keyframe animations.
- **Scripting**: Pure Vanilla JavaScript (ES6+):
  - Form validation with real-time feedback (`forms.js`).
  - Interactive UI controllers, theme persistence, and smooth animations (`main.js`).
  - Analytics calculations, chart rendering, and search indexing (`dashboard.js`).
- **Icons & Map**: [Lucide Icons](https://lucide.dev/) (CDN) & [Leaflet.js](https://leafletjs.com/) for interactive maps.
- **Typography**: [Google Fonts](https://fonts.google.com/) — *Manrope* (Headings & Bold Displays) & *DM Sans* (Body & UI).

---

## 📁 Project Structure

```bash
.
├── assets/
│   ├── css/
│   │   ├── style.css           # Global core styles, variables, typography & reset
│   │   ├── pages.css           # Public page templates & specialized components
│   │   ├── dashboard.css       # HR portal, charts, tables & widget styles
│   │   ├── auth.css            # Sign in, Sign up & Forgot password styling
│   │   ├── dark-mode.css       # Comprehensive Dark theme color overrides
│   │   └── rtl.css             # Right-to-Left bidirectional layout rules
│   ├── js/
│   │   ├── main.js             # Navigation, theme switcher, RTL toggle, scroll reveals
│   │   ├── forms.js            # Input validation, strength meters, success alerts
│   │   └── dashboard.js        # Dynamic tables, analytics, search, modals & charts
│   └── images/                 # Optimized responsive WebP/PNG photography & assets
├── pages/                      # All secondary pages (Programs, HR Portal, Auth, Legal)
├── index.html                  # Homepage Variation 1
├── index1.html                 # Homepage Variation 2
└── README.md                   # Project Documentation
```

---

## 🚀 Getting Started

No build step or Node.js server is required. You can preview and run the website immediately:

### Option 1: Direct File Open
Simply double-click `index.html` or open any `.html` file directly in any modern browser (Chrome, Firefox, Safari, Edge).

### Option 2: Local HTTP Server (Recommended)
Using Python's built-in server:
```bash
# Python 3.x
python3 -m http.server 8000
```
Then visit [`http://localhost:8000`](http://localhost:8000) in your browser.

Using VS Code / IDE:
- Install the **Live Server** extension.
- Click **Go Live** at the bottom status bar.

---

## 🎨 Theme & Customization Guide

All design tokens are centralized in [`assets/css/style.css`](file:///Users/viki/Viki/Viki/CyFocus/Website%20Files/2026/September/10%20Corporate%20Training%20&%20Skill%20Development%20Center/assets/css/style.css):

```css
:root {
  --blue: #075bea;            /* Primary brand color */
  --blue-2: #0548b8;          /* Primary dark hover */
  --ink: #0a182d;             /* Primary text */
  --muted: #53647d;           /* Secondary text */
  --line: rgba(7, 91, 234, 0.12); /* Subtle borders */
  --panel: rgba(255, 255, 255, 0.85); /* Glass surface */
  --font-head: "Manrope", sans-serif;
  --font-body: "DM Sans", sans-serif;
}
```

### Dark Mode
Switch theme programmatically or via HTML attribute:
```javascript
// Enable Dark Theme
document.documentElement.dataset.theme = "dark";

// Enable Light Theme
document.documentElement.dataset.theme = "light";
```

### RTL Layout
Toggle Right-to-Left orientation for internationalization:
```javascript
// Enable RTL
document.documentElement.dir = "rtl";

// Enable LTR
document.documentElement.dir = "ltr";
```

---

## 📱 Browser Compatibility

- ✅ Google Chrome (Latest)
- ✅ Apple Safari (Desktop & iOS)
- ✅ Mozilla Firefox (Latest)
- ✅ Microsoft Edge (Latest)
- ✅ Android & iOS Mobile Browsers

---

## 📄 License & Attribution

© 2026 **Elevate Learning**. All rights reserved. Built for corporate skill development and workforce enablement.
