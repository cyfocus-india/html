# Customization guide

## Colors and typography

Edit the CSS variables at the start of `assets/css/style.css`: `--navy`, `--blue`, `--text`, `--muted`, `--soft` and `--line`. Dark-mode equivalents are in `dark-mode.css`. The reference image guided the navy/blue palette, spacing, fine card borders, buttons, and bold sans-serif hierarchy. Roboto is the selected close visual match; exact font identification cannot be guaranteed from a raster reference alone. The full variable font is local at `assets/fonts/roboto.ttf`.

## HTML content

Each page contains its complete markup. No JavaScript is required to insert headers, footers, or primary content. Shared header/footer edits should be applied to every regular page. Sign-in, signup, coming-soon and 404 pages intentionally omit those elements. Dashboard has a dedicated compact portal bar.

The two home pages intentionally have different structures. Keep the main results/testimonial sections on Home 1 and the pathways/week rhythm on Home 2 to preserve that distinction.

## Images

Replace WebP files in `assets/images/` and preserve filenames, or update the relevant HTML paths and alt text. Each generated image is used in one unique content location; the favicon is a shared brand mark. The 11 generated images depict fictional people. The original generation prompts and tool are documented in `image-prompts.json`.

## Interactions

`assets/js/main.js` controls theme/direction preferences, mobile and More menus, keyboard tabs, dialogs, validation, courses, fee calculation, tutor details, articles and the countdown. Fee arrays are in `pricing`. Edit those arrays to change plans and savings consistently. The selected plan pre-fills the contact form.

`assets/js/dashboard.js` contains clearly marked fictional timetable, attendance and test interactions. The dashboard's date is fixed for reproducible demo content. HTML contains the material links and test tables. Replace TXT files in `assets/materials/` with your own notes, updating labels and extensions when using PDFs.

## Forms and authentication

Forms provide inline errors and honest preview confirmations. They do not submit data or create accounts. The sign-in comparison is a demo, not a security boundary. Connect a real service before using real student information. Never put real credentials or sensitive data into browser code.

## Motion and accessibility

CSS provides gentle entrances, scroll reveals, hover movement, and floating hero cards. `prefers-reduced-motion` disables these. The JavaScript observer reveals content once. Main content remains visible without JavaScript. Focus rings, semantic headings, labelled fields, escape-to-close dialogs, status announcements and text attendance markers are included. Preserve them when editing.

## RTL and themes

Theme follows system preferences until the user makes a choice. The moon/sun and language-direction controls persist settings locally. Set `dir=rtl` on the document to inspect RTL; use logical margin/padding properties in new styles. RTL mode mirrors layout only. A translated version requires translated text and an appropriate document `lang` attribute.

## Launch checklist

Replace demo content, centre location/contact information, pricing and legal notices. Configure real form delivery and account security if needed. Review your final changes with keyboard and screen-reader checks and test the browsers your students use.
