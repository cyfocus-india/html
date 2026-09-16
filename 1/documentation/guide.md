# Oven & Bloom Template Guide

## Installation

1. Copy the full folder to your web root.
2. Preview through a static server. No dependency installation is required.
3. Upload to any static host such as Netlify, Cloudflare Pages, GitHub Pages, shared hosting, or an existing web server.
4. Point the production domain at the host and replace all `https://example.com` canonical and sitemap URLs.

## Customization

### Brand and content

Search for `Oven & Bloom`, `18 Lavender Lane`, `+91 98765 43210`, and `.example` to replace demo business content. The main logo is text plus a Phosphor cake icon, so no image editor is needed.

### Colours

Edit the custom properties at the top of `assets/css/style.css`. Important tokens include `--cream`, `--paper`, `--ink`, `--berry`, `--cherry`, `--sage`, and `--gold`. Dark-theme overrides live in `assets/css/dark-mode.css`.

### Typography

The template uses Geist for interface/body text and DM Serif Display for editorial headings. Change the Google Fonts import and the `--body` / `--display` variables together.

### Images

Demo images use Unsplash URLs with automatic format negotiation. For production, download appropriately licensed images, export responsive WebP and AVIF sizes, place them in `assets/images`, and update every `src`, social image, and structured-data image. Preserve descriptive alt text.

### Forms and integrations

Forms intentionally use `action="#"`; demo submissions never leave the browser. Search for `data-integration` and `TODO`.

- Replace custom-order and contact form actions with a verified Formspree endpoint or enable Netlify Forms.
- Connect newsletter forms to a verified Mailchimp or ConvertKit action.
- Replace the disabled payment placeholder with a verified Stripe Payment Link or PayPal checkout.
- Connect the account screens to your authentication provider or remove them.
- Replace the map query/embed with the production location or Google Maps API integration.
- Add a booking/calendar widget only after confirming its privacy and loading impact.

Do not collect real customer information until the receiving endpoint, privacy notice, retention policy, and access controls have been verified.

## Page structure

All main pages share:

1. Skip link and loading state
2. Floating responsive navigation
3. One semantic `main` element and one `h1`
4. AIDA-style content sequence
5. High-contrast action section
6. Shared footer and scripts

The two home pages provide different market positions without changing the underlying brand. `index.html` prioritizes neighbourhood retail and same-day discovery; `index1.html` positions the business as an editorial cake atelier.

## JavaScript behaviour

`assets/js/main.js` contains:

- System-aware theme switching with saved preference
- LTR/RTL switching with saved preference
- Responsive menu and Escape-key handling
- Product filtering
- Client-side validation and accessible inline errors
- Review carousel
- Delivery-zone demo lookup
- Pricing estimator
- Custom-order live summary
- GSAP/ScrollTrigger motion with reduced-motion fallback
- Dynamic copyright year

No production console logging is included.

## Accessibility

- Keyboard-visible focus states
- 44px minimum interactive controls
- Semantic headings, landmarks, labels, and alt text
- Inline validation messages and live status regions
- `prefers-reduced-motion` support
- Strong light/dark contrast and a skip link
- Mobile navigation controls with expanded state

Before launch, test with keyboard-only navigation, VoiceOver or NVDA, automated WCAG tooling, 200% zoom, and real form endpoints.

## SEO and performance

- Each public page has a unique title and meta description.
- The primary home page includes Bakery JSON-LD and social metadata.
- `sitemap.xml` and `robots.txt` are included as editable templates.
- Images below the fold use lazy loading.
- CSS and JavaScript are separated and reusable.

For production, self-host and subset fonts/icons where practical, replace remote images with responsive local sources, minify assets, configure long-lived caching, and validate final Core Web Vitals.

## Credits

- Demo photography: Unsplash photographers via `images.unsplash.com`
- Icons: Phosphor Icons Web 2.1.1
- Motion: GSAP 3.13.0 with ScrollTrigger
- Fonts: Geist and DM Serif Display via Google Fonts

Check and comply with current licences and attribution terms before redistribution.

## Changelog

### 1.0.0 — 2026-08-27

- Initial multipage bakery template
- Two home-page variants
- Dark mode, RTL, responsive navigation, validation, and reduced motion
- Product filtering, pricing estimator, delivery checker, and carousel
- SEO, legal, utility, account, and documentation templates

## Support

This is a static template. For support, document the issue with the page URL, browser/version, viewport size, steps to reproduce, and a screenshot. Replace this section with the template seller or agency's real support channel before distribution.
