<div align="center">

  <img src="assets/images/oven-bloom-mark.svg" alt="Oven & Bloom Logo" width="96" height="96" />

  # 🍰 Oven & Bloom
  ### Artisan Bakery & Custom Cake Studio Website Template

  <p align="center">
    <em>A modern, elegant, fully-responsive multipage website template crafted for boutique bakeries, artisanal patisseries, and bespoke cake studios.</em>
  </p>

  <p align="center">
    <a href="#-quick-start"><strong>Quick Start »</strong></a> ·
    <a href="#-page-directory"><strong>Explore Pages »</strong></a> ·
    <a href="#-interactive-features"><strong>Interactive Features »</strong></a> ·
    <a href="#-design-system"><strong>Design System »</strong></a> ·
    <a href="documentation/guide.md"><strong>Full Guide »</strong></a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
    <img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP Animation" />
    <img src="https://img.shields.io/badge/Theme-Dark%20%7C%20Light-521b32?style=for-the-badge" alt="Dark/Light Mode" />
    <img src="https://img.shields.io/badge/Direction-LTR%20%7C%20RTL-c89a53?style=for-the-badge" alt="LTR/RTL Ready" />
    <img src="https://img.shields.io/badge/Zero%20Build-No%20Framework-brightgreen?style=for-the-badge" alt="Zero Build" />
  </p>

</div>

---

## ✨ Highlights & Key Features

<table>
  <tr>
    <td width="50%">
      <h3>🏪 Dual Home Page Experiences</h3>
      <ul>
        <li><strong>Retail-Led (Home 1):</strong> Focuses on daily bake drops, neighbourhood takeaway, same-day counter pickups, and quick discovery.</li>
        <li><strong>Atelier-Led (Home 2):</strong> High-end editorial aesthetic showcasing bespoke wedding cakes, private tastings, and bespoke commissions.</li>
      </ul>
    </td>
    <td width="50%">
      <h3>🌓 Complete Theme & RTL Engine</h3>
      <ul>
        <li><strong>Dark / Light Mode:</strong> Native system detection with seamless manual toggle, persistent via <code>localStorage</code>.</li>
        <li><strong>RTL Ready:</strong> Full bidirectional styling for Arabic, Hebrew, and Persian scripts out-of-the-box.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🎛️ Interactive Customer Tools</h3>
      <ul>
        <li><strong>Live Cake Cost Estimator:</strong> Real-time pricing calculator based on tiers, flavours, dietary options, and delivery speed.</li>
        <li><strong>Custom Cake Brief Builder:</strong> Multi-step interactive custom order configurator with instant breakdown.</li>
        <li><strong>Delivery Zone Lookup:</strong> Instant postcode checker with mapped operational zones.</li>
      </ul>
    </td>
    <td width="50%">
      <h3>⚡ Performance & Accessibility</h3>
      <ul>
        <li><strong>Zero Framework Overhead:</strong> Blazing fast vanilla HTML/CSS/JS with zero build steps or compilation needed.</li>
        <li><strong>WCAG AA Accessible:</strong> Keyboard navigation, high-contrast tokens, accessible focus rings, semantic tags, and ARIA live regions.</li>
        <li><strong>Smooth Micro-interactions:</strong> GSAP &amp; ScrollTrigger animations with full <code>prefers-reduced-motion</code> support.</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🚀 Quick Start

No Node.js, Webpack, or Vite required! Run with any static file server:

### Option 1: Python (Recommended)
```bash
# Python 3.x
python3 -m http.server 8000
```
Then open [http://localhost:8000](http://localhost:8000) in your browser.

### Option 2: Node.js (npx)
```bash
npx serve .
```

### Option 3: VS Code Live Server
Right-click `index.html` in VS Code and select **"Open with Live Server"**.

> [!TIP]
> Opening HTML files directly via `file://` also works for most features, but running a local HTTP server is recommended for flawless navigation, SVG handling, and browser testing.

---

## 📑 Page Directory

The template contains **14 fully designed, cohesive pages** covering the complete customer journey:

| Page | File | Description | Key Modules |
| :--- | :--- | :--- | :--- |
| **Home (Retail)** | [`index.html`](index.html) | Warm neighbourhood bakery focus | Daily bake roster, fresh drops, reviews, quick ordering |
| **Home (Atelier)** | [`index1.html`](index1.html) | High-fashion editorial cake studio | Bespoke collections, consultation booking, tasting tiers |
| **Products** | [`pages/products.html`](pages/products.html) | Full bakery catalogue & filters | Category tabs, dietary filters (GF, Vegan), modal quick-views |
| **Custom Orders** | [`pages/custom-orders.html`](pages/custom-orders.html) | Interactive bespoke cake designer | Live design preview, portion sizing, moodboard upload UI |
| **Pricing & Calculator** | [`pages/pricing.html`](pages/pricing.html) | Transparent pricing & live calculator | Interactive tier estimator, add-on costs, corporate packages |
| **Delivery & Zones** | [`pages/delivery.html`](pages/delivery.html) | Delivery schedule & coverage checker | Postcode lookup tool, delivery zones breakdown, courier FAQs |
| **Services & Events** | [`pages/services.html`](pages/services.html) | Catering, weddings, & workshops | Tasting sessions, corporate gifting, masterclass booking |
| **About Us** | [`pages/about.html`](pages/about.html) | Brand story & artisanal philosophy | Flour sourcing, team profiles, sustainability commitments |
| **Contact & Location** | [`pages/contact.html`](pages/contact.html) | Bakery visit & same-day queries | Interactive map embed, opening hours, quick inquiry form |
| **Journal / Blog** | [`pages/blog.html`](pages/blog.html) | Recipes, baking tips & announcements | Grid listing, search tag filters, reading time indicators |
| **Sign In** | [`pages/signin.html`](pages/signin.html) | Customer account login | Email/Password validation, social auth placeholders |
| **Sign Up** | [`pages/signup.html`](pages/signup.html) | Customer registration | Reward club opt-in, terms agreement, responsive card |
| **404 Not Found** | [`pages/404.html`](pages/404.html) | Playful custom error page | Warm bakery illustration, search suggestions, home shortcut |
| **Coming Soon** | [`pages/coming-soon.html`](pages/coming-soon.html) | Pre-launch & seasonal countdown | Launch timer, email notification collector |

---

## 🎨 Design System & Brand Palette

Crafted with a warm, pastry-inspired aesthetic balancing editorial sophistication with inviting warmth.

### Color Tokens

```css
/* Light Theme Palette */
--cream:   #fbf4e8;  /* Base background - soft warm vanilla */
--paper:   #fffaf2;  /* Elevated surface - fresh parchment */
--ink:     #2b1b17;  /* Primary typography - dark espresso */
--berry:   #521b32;  /* Primary brand & hero - deep blackberry */
--cherry:  #d75353;  /* Accent & CTA highlight - ripe cherry */
--sage:    #6e8071;  /* Secondary accent - aromatic botanical */
--gold:    #c89a53;  /* Premium highlights - golden crust */
```

### Typography

| Role | Font Family | Source | Purpose |
| :--- | :--- | :--- | :--- |
| **Display / Headings** | `DM Serif Display` | Google Fonts | Warm, editorial serif with distinct artisanal personality |
| **Interface / Body** | `Geist` | Google Fonts | Ultra-clean, modern geometric sans for high legibility |
| **Icons** | `Phosphor Icons (v2.1.1)` | CDN | Lightweight, crisp iconography in regular and fill styles |

---

## 🧩 Interactive Features & JavaScript

All dynamic behaviours are organized inside [`assets/js/main.js`](assets/js/main.js) without third-party framework dependencies:

```
 assets/js/main.js
 ├── 🌓 Theme Controller (Light / Dark mode persistence with system match)
 ├── 🔄 Direction Switcher (LTR / RTL toggle with persistent state)
 ├── 📱 Responsive Navigation (Mobile sheet menu, ARIA attributes, Esc trap)
 ├── 🔍 Product Category & Dietary Filtering (Instant client-side filter)
 ├── 🧮 Live Cake Pricing Estimator (Dynamic total calculation)
 ├── 📝 Custom Order Live Summary (Real-time form breakdown)
 ├── 📍 Postcode Delivery Validator (Zone lookup demo with alerts)
 ├── 💬 Testimonial & Review Carousel (Touch-friendly pagination)
 └── 🎭 GSAP Scroll Animations (Reveal effects + reduced-motion safety)
```

---

## 📁 File Structure

```text
1-local-bakery-cake-shop/
├── index.html                  # Retail-focused Home Page
├── index1.html                 # Editorial Cake Studio Home Page
├── favicon.svg                 # SVG brand favicon
├── robots.txt                  # Search engine crawler instructions
├── sitemap.xml                 # XML sitemap template
├── assets/
│   ├── css/
│   │   ├── style.css           # Core styling, variables & layout
│   │   ├── dark-mode.css       # Dark theme color overrides
│   │   └── rtl.css             # Right-to-Left bidirectional rules
│   ├── js/
│   │   └── main.js             # All UI interactions, calculators & theme logic
│   └── images/
│       ├── oven-bloom-mark.svg # Scalable vector brand emblem
│       └── README.md           # Image sourcing & optimization instructions
├── pages/
│   ├── 404.html                # Custom 404 error page
│   ├── about.html              # Story, values & chef team
│   ├── blog.html               # Bakery journal & recipe stories
│   ├── coming-soon.html        # Launch countdown & newsletter capture
│   ├── contact.html            # Contact info, map embed & inquiry form
│   ├── custom-orders.html      # Bespoke cake order configurator
│   ├── delivery.html           # Delivery zones, schedule & postcode tool
│   ├── pricing.html            # Tiered packages & live price estimator
│   ├── privacy.html            # Privacy policy template
│   ├── products.html           # Product showcase with category filters
│   ├── services.html           # Catering, masterclasses & wedding services
│   ├── signin.html             # Client login portal
│   ├── signup.html             # Client registration portal
│   └── terms.html              # Terms of service template
└── documentation/
    └── guide.md                # Comprehensive technical & launch guide
```

---

## 🛠️ Customization & Deployment Checklist

Before deploying to production (Netlify, Vercel, Cloudflare Pages, GitHub Pages, or cPanel):

- [ ] **Brand Identity:** Update business name, phone (`+91 98765 43210`), address (`18 Lavender Lane`), and email (`hello@ovenandbloom.example`).
- [ ] **Form Endpoints:** Replace `action="#"` in contact and custom order forms with [Formspree](https://formspree.io), Netlify Forms, or your custom API endpoint.
- [ ] **Newsletter Integration:** Connect newsletter signups to Mailchimp, ConvertKit, or Klaviyo.
- [ ] **Payment Checkout:** Link ordering CTA buttons with Stripe Payment Links, Square, or PayPal.
- [ ] **Map Location:** Replace Google Maps placeholder embed with your actual bakery location.
- [ ] **Photography:** Replace Unsplash placeholder images with high-resolution, compressed WebP/AVIF images of your actual creations.
- [ ] **SEO & Metadata:** Update domain URL in canonical tags, `sitemap.xml`, `robots.txt`, and Open Graph tags.

---

## 🌐 Browser Compatibility

| Chrome | Firefox | Safari | Edge | iOS Safari | Android Chrome |
| :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ Latest | ✅ Latest | ✅ Latest | ✅ Latest | ✅ Latest | ✅ Latest |

---

## 📜 License & Credits

- **Fonts:** [Geist](https://fonts.google.com/specimen/Geist) & [DM Serif Display](https://fonts.google.com/specimen/DM+Serif+Display) via Google Fonts (SIL Open Font License)
- **Icons:** [Phosphor Icons](https://phosphoricons.com/) (MIT License)
- **Motion:** [GSAP & ScrollTrigger](https://greensock.com/gsap/) (Standard License)
- **Photography:** Curated demo photography from [Unsplash](https://unsplash.com)

---

<div align="center">
  <sub>Crafted with precision & passion for artisanal bakers worldwide.</sub>
</div>
