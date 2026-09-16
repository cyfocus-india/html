# Rosewood Florals Website Guide

## 1. Installation

1. Copy the complete project folder to your web server or static hosting service.
2. Keep the existing relative folder structure intact.
3. For local preview, run `python3 -m http.server 4173` in the project folder.
4. Open `http://localhost:4173/`.
5. Before launch, replace all demo business, policy, product, and delivery content.

The project has no npm packages, compilation step, database, or backend dependency.

## 2. Customization

### Colours

Edit the design tokens at the top of `assets/css/style.css`:

- `--plum` and `--plum-deep`: primary brand colour
- `--rose`, `--blush`, and `--peach`: floral accent palette
- `--sage` and `--sage-soft`: supporting green palette
- `--paper`, `--paper-deep`, and `--surface`: page backgrounds

Dark-theme values are in `assets/css/dark-mode.css`. Direction-specific adjustments are in `assets/css/rtl.css`.

### Fonts

The site uses a system sans-serif stack and Georgia for editorial display typography, so it works without a font download. Change `--sans` and `--serif` in `assets/css/style.css` to use brand fonts.

### Content

Each page is a standalone HTML file. Shared header, mobile navigation, footer, theme, direction, cart, filtering, accordion, counter, reveal, and form behavior live in `assets/js/main.js`.

When adding a page inside `pages/`, use `data-root=".."` on the body and link assets with `../assets/...`. Root pages use `data-root="."` and `assets/...`.

### Images

Replace a WebP file in `assets/images/` and preserve its filename to update an image without editing markup. When using a different ratio, verify `object-position` and the relevant card height at mobile and desktop sizes. Keep descriptive `alt` text current.

## 3. Page structure

- `index.html`: primary editorial commerce home
- `index1.html`: alternate campaign-focused home
- `pages/products.html`: occasion filters, bouquet catalogue, wedding and sympathy features
- `pages/same-day-delivery.html`: cutoff times, coverage map, delivery process, FAQ
- `pages/custom-arrangement.html`: personal floral request form
- `pages/bulk-orders.html`: events, workplace flowers, and corporate gifting
- `pages/contact.html`: studio details, map, and enquiry form
- `pages/about.html`: brand story, sourcing, and values
- `pages/signin.html` / `pages/signup.html`: front-end account demonstrations
- `pages/privacy.html` / `pages/terms.html`: sample legal content requiring professional review
- `pages/404.html` / `pages/coming-soon.html`: utility states

## 4. Credits

- Icons: [Lucide](https://lucide.dev/), loaded from a pinned UMD build on unpkg; ISC License.
- Original floral photography: generated for this project with OpenAI's built-in image generation tool. The production prompts are recorded in `documentation/IMAGE_PROMPTS.md`.
- No stock-photo library, external font, CSS framework, or JavaScript framework is used.

## 5. Changelog

### 1.0.0 — 28 August 2026

- Initial multipage release
- Added original optimized flower imagery
- Added responsive light/dark and LTR/RTL systems
- Added accessible motion, reduced-motion handling, form validation, filtering, FAQ, counters, and demo cart
- Added documentation and utility pages

## 6. Support

For template maintenance:

1. Confirm the affected page and viewport width.
2. Check the browser console for JavaScript errors.
3. Verify that relative asset paths use `assets/` on root pages and `../assets/` inside `pages/`.
4. If an icon is missing, confirm the Lucide CDN is reachable or host the pinned library locally.
5. If saved theme, direction, or cart values appear stale, clear the site’s local storage.

Run `python3 documentation/audit.py` after changing page markup to check local links, heading structure, label associations, image text/dimensions, IDs, and balanced tags.

For a production launch, engage a developer to connect forms, authentication, checkout, inventory, taxes, payments, transactional email, and delivery scheduling to secure services.
