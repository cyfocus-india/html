<div align="center">

# 🎪 PLAY ZONE — Kids Play Zone & Indoor Play Area

<p align="center">
  <strong>A modern, responsive, multipurpose multi-page web platform engineered for indoor playgrounds, family entertainment centers, and soft play arenas.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Responsive-Mobile%20%7C%20Tablet%20%7C%20Desktop-4CAF50?style=for-the-badge" alt="Responsive" />
  <img src="https://img.shields.io/badge/Theme-Dark%20%26%20Light-9333EA?style=for-the-badge" alt="Dark Mode" />
  <img src="https://img.shields.io/badge/Layout-LTR%20%26%20RTL-FF9800?style=for-the-badge" alt="RTL Support" />
  <img src="https://img.shields.io/badge/WCAG-2.1%20AA%20Compliant-0D5BE1?style=for-the-badge" alt="Accessibility" />
</p>

---

[🚀 Explore Features](#-key-features-showcase) •
[📱 Pages Overview](#-pages--sitemap) •
[🎨 Design System](#-design-system--tokens) •
[⚡ Quick Start](#-quick-start) •
[💻 Interactive Portal](#-interactive-parent-portal-dashboard) •
[📁 File Structure](#-project-structure)

---

</div>

<br>

## 🌟 Executive Overview

**PLAY ZONE** is an enterprise-grade, lightweight, dependency-free frontend website crafted specifically for modern indoor play centers. Styled after vibrant **geometric Bauhaus playground aesthetics**, the site pairs bold visual design (arch cutouts, contrasting color blocks, and vector illustrations) with robust interactive utility including real-time slot bookings, digital safety waiver verification, printable invoices, and membership tier management.

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                          │
│   🔵 Royal Blue (#0D5BE1)  •  🔴 Energetic Red (#E52E2E)  •  🟡 Sunny Yellow (#F5B300)    │
│                                                                                          │
│   ✨ 13 Handcrafted Multi-Page HTML Views                                                 │
│   ✨ Real-Time Parent Portal & Slot Availability Engine                                   │
│   ✨ Full Dark Mode & RTL (Right-to-Left) Language Mirroring                             │
│   ✨ Zero Frameworks • Pure Native Vanilla Web Tech (Fast, Portable & SEO-Ready)          │
│                                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Features Showcase

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>🎟️ Live Slot Engine & Booking</h3>
      <ul>
        <li>Real-time capacity tracking across all 4 play zones.</li>
        <li>Dynamic multi-child pass calculator with grip socks add-ons.</li>
        <li>Instant checkout with modal QR Pass generation for fast gate entry.</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>💳 Digital Membership Management</h3>
      <ul>
        <li>Interactive Gold Explorer & Platinum VIP membership tracker.</li>
        <li>Live session usage meter bar (e.g. <em>8 of 12 visits remaining</em>).</li>
        <li>One-click in-place tier renewal and upgrade workflow.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>📝 Official Digital Safety Waiver</h3>
      <ul>
        <li>Legally binding digital safety release modal with 2FA verification.</li>
        <li>Multi-child coverage selector and verified digital signature box.</li>
        <li>Integrated browser printing & PDF export engine (<code>window.print()</code>).</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>🎂 Birthday Party Customizer</h3>
      <ul>
        <li>Live party quotation calculator with guest slider (10–40 kids).</li>
        <li>Interactive theme switcher (Cosmic Glow, Superhero, Safari Jungle).</li>
        <li>Custom add-ons: balloon arches, 2-tier themed cake, mascot appearances.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>🌓 Complete Dark & Light Theme</h3>
      <ul>
        <li>Instant toggle with smooth transition and persistent state.</li>
        <li>Dark mode palette optimized for battery efficiency and night viewing.</li>
        <li>Automatic fallback to user's OS color scheme preference.</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>🌍 Global RTL (Right-to-Left) Support</h3>
      <ul>
        <li>1-click LTR/RTL layout direction switcher.</li>
        <li>Full horizontal mirroring for Arabic, Hebrew, and Urdu layouts.</li>
        <li>Comprehensive CSS directional rules with mirrored typography and icons.</li>
      </ul>
    </td>
  </tr>
</table>

---

## 📱 Pages & Sitemap

| # | Page File | Route | Description |
|---|---|---|---|
| 1 | **Home 1** | `index.html` | Flagship Bauhaus hero, highlight pills, detailed age-zone cards (games + pricing), a Games & Attractions grid, safety panel and a "Planning your first visit" walkthrough. |
| 2 | **Home 2** | `index1.html` | Opens by introducing the venue (what it is, who it is for, what is inside) and the four age zones, *then* presents the live slot-booking band. Also carries the attraction map, daily schedule, gallery and reviews. |
| 3 | **Play Zones** | `pages/play-zones.html` | Each of the 4 zones gets its own photo **and** its own layout diagram, plus session facts, an activity breakdown and the rules that apply everywhere. |
| 4 | **Birthday Parties** | `pages/birthday-parties.html` | Photographed hero suite, 3 package tiers, 4 illustrated themed suites, a facilities grid (what comes with the room), a two-hour run sheet and an FAQ. |
| 5 | **Membership Plans** | `pages/membership-plans.html` | Each tier has its own illustration and a per-session value line, plus a 4-step "how membership works" explainer and the full comparison matrix. |
| 6 | **Safety Standards** | `pages/safety-standards.html` | Four illustrated safety pillars (equipment, sanitization, first aid, controlled entry), the daily routine timeline, the grip-socks policy and what we ask of parents. |
| 7 | **Parent Dashboard** | `pages/dashboard.html` | Central hub for bookings, digital member passes, invoice history, child profiles, and signed safety waivers. |
| 8 | **Contact & Location** | `pages/contact.html` | Interactive stylized SVG location map, live operation hours, transit/parking guide, and validated contact form. |
| 9 | **Sign In** | `pages/signin.html` | Secure parent portal authentication with 1-click Demo credentials auto-fill and password show/hide toggles. |
| 10 | **Sign Up** | `pages/signup.html` | Streamlined family registration form with child profile setup and integrated digital waiver check. |
| 11 | **Coming Soon** | `pages/coming-soon.html` | Glow Laser Arena expansion announcement with real-time countdown timer and VIP early-access email form. |
| 12 | **404 Not Found** | `pages/404.html` | Playful Bauhaus 404 error page with navigation shortcuts and search quick-links. |
| 13 | **Privacy Policy** | `pages/privacy.html` | Child data protection (COPPA compliance), 24/7 CCTV storage rules, and data handling standards. |
| 14 | **Terms & Conditions** | `pages/terms.html` | Facility admission policy, socks requirement, booking cancellation, and parent supervision rules. |

---

## 🎨 Design System & Tokens

### Color Palette

| Token | Hex Code | Visual Preview | Usage |
|---|---|---|---|
| `--primary-blue` | `#0D5BE1` | ![#0D5BE1](https://via.placeholder.com/15/0D5BE1/000000?text=+) | Primary Brand Buttons, Active States, Key Accents |
| `--accent-red` | `#E52E2E` | ![#E52E2E](https://via.placeholder.com/15/E52E2E/000000?text=+) | Geometric Dots, Decorative Shapes, Brand Identity |
| `--accent-red-btn` | `#D51F1F` | ![#D51F1F](https://via.placeholder.com/15/D51F1F/000000?text=+) | Filled red buttons — white label clears AA at 5.0:1 |
| `--accent-red-text` | `#C81E1E` | ![#C81E1E](https://via.placeholder.com/15/C81E1E/000000?text=+) | Red **text** on light surfaces, outline buttons, active nav |
| `--accent-yellow` | `#F5B300` | ![#F5B300](https://via.placeholder.com/15/F5B300/000000?text=+) | Gold Explorer Pass, Toddler Badges, Geometric Shapes |
| `--accent-yellow-text` | `#8A6200` | ![#8A6200](https://via.placeholder.com/15/8A6200/000000?text=+) | Amber **text** on light surfaces (yellow never passes AA) |
| `--accent-green` | `#047857` | ![#047857](https://via.placeholder.com/15/047857/000000?text=+) | Verified Status, Active Waivers, Safe Badges |
| `--bg-body` (Light) | `#F8FAFC` | ![#F8FAFC](https://via.placeholder.com/15/F8FAFC/000000?text=+) | Primary Canvas Background |
| `--bg-surface` (Dark) | `#161F30` | ![#161F30](https://via.placeholder.com/15/161F30/000000?text=+) | Dark Mode Elevated Cards & Modals |

> **Text-colour rule:** `--accent-red`, `--accent-yellow` and `--primary-blue` are *brand* colours
> reserved for fills, shapes and solid buttons. Any colour applied to **text** must use the
> `-text` variant (or a `.tone-*` utility), which is contrast-checked in both themes.

### Typography
- **Headings**: `Outfit`, system sans-serif (Weights: `800`, `900`) — Bold, energetic, modern geometric rhythm.
- **Body & Controls**: `Plus Jakarta Sans`, system-ui (Weights: `400`, `500`, `600`, `700`) — Clean legibility and high contrast.

---

## 💻 Interactive Parent Portal (Dashboard)

The Parent Portal (`pages/dashboard.html` + `assets/js/dashboard.js`) is an interactive single-page application (SPA-like experience) built completely with Vanilla JS:

```mermaid
graph TD
    A[Parent Portal] --> B[1. Quick Book Slot]
    A --> C[2. Active Membership Pass]
    A --> D[3. Visit Log & Invoices]
    A --> E[4. Party Planner]
    A --> F[5. Child Profiles & Digital Waiver]

    B --> B1[Live Zone Capacity Calculator]
    B --> B2[Printable Fast-Pass QR Code Modal]

    C --> C1[Visual Remaining Visits Meter]
    C --> C2[Gold & Platinum Tier Upgrades]

    D --> D1[Itemized Tax Invoices]
    D --> D2[Printable Receipts Engine]

    F --> F1[Add / Edit Registered Minors]
    F --> F2[Full Signed Safety Waiver PDF View]
```

---

## 📁 Project Structure

```
7 Kids Play Zone & Indoor Play Area/
├── index.html                  # Homepage 1 (Flagship Hero Layout)
├── index1.html                 # Homepage 2 (Interactive Slot Search Layout)
├── README.md                   # Project Documentation
├── assets/
│   ├── css/
│   │   ├── style.css           # Core Design Tokens, Typography, Layouts & Modals
│   │   ├── dark-mode.css       # Complete Dark Theme Palette & High-Contrast Overrides
│   │   └── rtl.css             # Right-to-Left Layout Direction & Mirroring Rules
│   ├── js/
│   │   ├── main.js             # Theme & RTL Switches, Mobile Drawer, Forms, Toasts
│   │   └── dashboard.js        # Slot Booking Engine, Pass Upgrades, Waiver System
│   └── images/                 # Photography only (JPG, with PNG masters) — no SVG artwork
│       ├── baby-zone.jpg           # Zone photography (also .png masters)
│       ├── explorer-zone.jpg
│       ├── adventure-zone.jpg
│       ├── challenge-zone.jpg      # Also the grip-socks hero on Safety
│       ├── hero-boy-slide.jpg      # Home 1 arch hero
│       ├── hero-home2.jpg          # Home 2 hero; facility overview on About
│       ├── ballpit-slide.jpg       # Mega ball pit
│       ├── party-suite-*.jpg       # Cosmic / Royal / Super suite photography
│       ├── zone-*-layout.jpg       # Play Zones page: one layout photo per zone
│       ├── attraction-*.jpg        # Home attractions; reused on Safety, About and Parties
│       ├── parents-lounge-cafe.jpg # Home 2 facility explorer
│       ├── membership-starter.jpg      # ─┐ One photographic showcase per
│       ├── membership-gold.jpg         #  │ membership tier (Starter + Gold
│       └── membership-platinum.jpg     # ─┘ also used on Safety)
└── pages/
    ├── play-zones.html         # 4 Specialized Age Zones
    ├── birthday-parties.html   # Party Packages & Theme Selector
    ├── membership-plans.html   # Monthly/Annual Pricing Tiers
    ├── safety-standards.html   # Sanitization & Grip Socks Rules
    ├── dashboard.html          # Full Parent Portal Dashboard
    ├── contact.html            # Working Hours, Interactive Map & Form
    ├── signin.html             # Parent Sign In (Demo Credentials Ready)
    ├── signup.html             # Family Registration & Child Profiles
    ├── 404.html                # Custom Animated 404 Not Found
    ├── coming-soon.html        # Glow Laser Arena with Live Countdown
    ├── privacy.html            # COPPA & CCTV Data Policy
    └── terms.html              # Facility Rules & Entry Agreement
```

---

## ⚡ Quick Start

No Node.js build process, bundler, or dependencies required! 

### Option 1: Direct File Launch
Simply open `index.html` or `index1.html` in any modern web browser.

> **Redeploying over an existing host?** All local CSS/JS links carry a `?v=20260912` cache-busting
> query. Bump that value (search-and-replace across the HTML files) whenever you change
> `style.css`, `dark-mode.css`, `rtl.css`, `main.js` or `dashboard.js`, otherwise returning visitors
> keep the cached stylesheet and see a half-updated site.

### Option 2: Local HTTP Server

```bash
# Using Python 3
python3 -m http.server 8080

# Using Node npx
npx serve .

# Using PHP
php -S localhost:8080
```

Once running, navigate to `http://localhost:8080` in your browser.

---

## 🌐 Responsive Breakpoints

| Device Category | Viewport Width | Behavior |
|---|---|---|
| **Large Desktop** | `> 1280px` | Full multi-column Bauhaus grids, spacious hero section, sticky header. |
| **Standard Desktop** | `1024px – 1280px` | Optimized desktop layout with responsive container widths. |
| **Tablet View** | `641px – 1024px` | Hamburger drawer active; top navigation retains key action buttons. |
| **Mobile Devices** | `≤ 640px` | Fully fluid single-column layout, compact headers, touch-friendly modals. |

---

## ♿ Accessibility & Standards

- **Semantic HTML5**: Native elements (`<main>`, `<header>`, `<nav>`, `<aside>`, `<section>`, `<article>`, `<dialog>/modal`).
- **ARIA Best Practices**: `aria-expanded`, `aria-controls`, `aria-label`, `role="dialog"`, and `aria-modal="true"`.
- **Keyboard Friendly**: Full tab navigation order with distinct `:focus-visible` focus rings.
- **Color Contrast**: Every text node on all 15 pages was measured against its resolved background in
  **both** themes; all normal text clears `4.5:1` and all large text clears `3:1` (WCAG 2.1 AA).

### How the two themes stay readable

The neutral scale (`--neutral-400` … `--neutral-950`) is used almost exclusively for **text**.
`dark-mode.css` therefore **inverts that ramp** rather than patching individual components:

```css
[data-theme="dark"] {
  --neutral-600: #C6D0DE;  /* body copy      — 10.2:1 on --bg-surface */
  --neutral-500: #AEBBCC;  /* subtext / meta —  7.8:1 */
  --neutral-400: #93A2B5;  /* inactive marks —  5.6:1 */
}
```

Two rules keep this working:

1. **Never use a `--neutral-*` token for a background or border.** They flip in dark mode.
2. **Pale tint + saturated brand colour pairs** (a `#EEF4FF` chip with `#0D5BE1` text) collapse on a
   dark surface. Use the `.tone-blue` / `.tone-red` / `.tone-yellow` / `.tone-green` / `.tone-purple`
   utilities instead — each owns both its background and its foreground, and `dark-mode.css`
   re-pairs all five in one place.

Anything sitting on a **fixed** colour that does not change with the theme (the white QR-pass card,
the coloured avatar swatches, a gradient CTA band) uses literal hex values, not theme tokens.

---

## 📜 Credits & Attributions

- **Typography**: [Outfit](https://fonts.google.com/specimen/Outfit) & [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) via Google Fonts (Open Font License).
- **Icons**: [Font Awesome 6 Free](https://fontawesome.com/) (CC BY 4.0).
- **Artwork**: Custom vector illustrations designed with geometric Bauhaus principles.

---

<div align="center">
  <sub>&copy; 2026 PLAY ZONE Indoor Play Area. Built for modern family entertainment centers.</sub>
</div>
