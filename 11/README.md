# AQUORA — Aquarium & Aquatic Supplies

A complete, local-first website in plain HTML, CSS, and JavaScript. No React, Vite, package installation, build step, or archive is required.

## Open the website

Double-click `index.html`, or open it in a browser. All images, icons, styles, scripts, and fonts are included locally. External reference and map links naturally require an internet connection. For consistent cross-page browser storage, use a local HTTP server; some browsers isolate storage for `file:` URLs.

An optional preview is available with `python3 -m http.server 8111` from this folder, then open `http://localhost:8111`.

## Included pages

- `index.html`: freshwater homepage with an immersive hero, collection categories, new finds, planting feature, care steps, and journal.
- `index1.html`: a distinct ocean homepage with editorial reef imagery, interest paths, an interactive setup planner, equipment feature, marine questions, and store introduction.
- `pages/fish-catalog.html`: searchable catalog, environment and care filters, species dialogs, and local shortlist.
- `pages/aquatic-plants.html`: plant collection, placement table, planting guidance, and questions.
- `pages/equipment.html`: filterable tanks, filters, lighting, and food categories; comparison and planning guidance.
- `pages/about.html`: the store concept and its principles.
- `pages/contact.html`: sample location and hours, validated special-order enquiry, and downloadable enquiry copy.
- `pages/care-guides.html`: the care journal hub.
- `pages/aquarium-basics.html`, `pages/plant-care.html`, `pages/feeding-guide.html`: three complete guides with linked sources.
- `pages/signin.html`, `pages/signup.html`: clearly identified local account form previews.
- `pages/coming-soon.html`, `pages/404.html`: standalone utility pages without the normal header.
- `pages/privacy.html`, `pages/terms.html`: plain descriptions of this local concept and how it behaves.

## Design and interactions

Glass panels, deep ocean colors, original imagery, self-hosted Manrope and DM Sans fonts, local Lucide icons, responsive layouts, scroll reveals, subtle hero movement, hover transitions, and smooth anchor navigation. The system color preference is detected automatically, and the theme and RTL buttons save a local preference. Reduced-motion settings disable animated effects. RTL changes layout direction; it is not a language translation.

Keyboard users have a skip link, visible focus, native dialogs and disclosures, named controls, and associated validation errors. Browser storage is best-effort: if unavailable, current-page interactions continue in memory.

## Local behavior and sample content

The brand, inventory, prices, showroom, and hours are illustrative. The 12 original generated images are concepts, not actual stock photographs. Replace and verify business details before launch.

The shortlist stays in this browser. It does not reserve livestock or place an order. The contact form validates and prepares a downloadable text file; it does not send email. No account, payment, or notification service is connected. Passwords are not stored or transmitted. No backend or dashboard is included.

The privacy and terms pages describe this delivered concept. They should be adapted for the real business and any services later connected.

## Edit the website

- Text and layout: edit the corresponding HTML file.
- Main design and breakpoints: `assets/css/style.css`.
- Light theme: `assets/css/dark-mode.css`.
- Direction support: `assets/css/rtl.css`.
- Theme initialization: `assets/js/theme.js`.
- Interactions: `assets/js/main.js`.
- Images: `assets/images/`; generation prompts and asset names: `IMAGE-PROMPTS.md`.
- Brand colors: variables at the top of `style.css`.

Navigation and footers are included in each HTML file so pages remain independently readable without runtime HTML fetching. Update repeated navigation consistently when adding pages. No build generator is required or included.

Browsers supporting the optional WebMCP API can read the displayed fish and stage items in the same local shortlist. Unsupported browsers ignore that enhancement.

## Verification

All 17 HTML files passed local standards validation with `html-validate:standard`. Local asset paths, internal page links and fragments, unique IDs, primary headings, and image alternative text were checked. Authored JavaScript passed syntax checking. Browser verification covered desktop/mobile layouts, dark/light themes, RTL, catalog filters and empty results, species dialogs, shortlist persistence, and form validation.

The public W3C online validator was not used: automatic approval review blocked uploading project source. Validation was completed locally. Cross-browser certification and a formal WCAG audit have not been performed.

## Credits

Original raster assets were generated with the built-in imagegen tool and optimized to WebP. `IMAGE-PROMPTS.md` contains the exact prompt set. Lucide icons are MIT licensed. Manrope and DM Sans are distributed under the SIL Open Font License; see bundled license files.
