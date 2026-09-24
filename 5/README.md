# Northstar Tutoring — For school students

A responsive, multi-page website made with plain HTML, CSS and JavaScript. No framework, build tool, package installation or compilation is required. The folder is the complete, unzipped deliverable.

## Open the website

1. Keep this folder structure intact.
2. Open `index.html` in a modern browser for Home 1, or `index1.html` for the distinct Home 2.
3. For a local HTTP preview, run `python3 -m http.server 8080` inside this folder, then open `http://localhost:8080`.
4. To publish with an ordinary static host, upload the folder contents and configure `404.html` as the error page. No server-side runtime is needed.

All fonts, icons, images and learning materials are local. The website makes no third-party resource requests. No Vite, React or ZIP is used.

Photography is a mix of the original generated portraits and 33 Pexels stock photographs (Pexels License, free for commercial use, no attribution required). See `documentation/image-credits.json` for the file-to-source mapping. The stock photographs show real people and are illustrative only — replace them with photographs of your own centre before going live.

## Pages

- `index.html`: Reference-inspired home, results teaser, testimonials and a single CTA.
- `index1.html`: A different dark editorial home, classroom image, grade pathways, learning rhythm and first-visit story.
- `pages/courses.html`: Grade tabs and subject programme dialogs.
- `pages/tutors.html`: Four individual tutor portraits, qualifications and profile dialogs.
- `pages/fees.html`: Grade and subject selection, accurate savings and enquiry prefill.
- `pages/results.html`: Achievement categories, portrait podium and progress records.
- `pages/dashboard.html`: A compact student portal with four content views.
- `pages/about.html`: Centre philosophy and parent partnership.
- `pages/services.html`: A four-step teaching approach.
- `pages/blog.html`: Three complete short articles in accessible dialogs.
- `pages/contact.html`: Validated counselling enquiry preview.
- `pages/signin.html`: Standalone student login; no header or footer.
- `pages/signup.html`: Standalone validated signup; no header or footer.
- `pages/coming-soon.html`: Standalone countdown and email-validation preview; no header or footer.
- `pages/404.html`: Standalone error screen; no header or footer. Root `404.html` supports static hosts.
- `pages/privacy.html` and `pages/terms.html`: Accurate preview notices to replace before operating a real centre.

## Student portal

Use `student@brightminds.demo` / `Bright123!` or select **Explore demo dashboard**. The portal is a front-end demonstration, with publicly accessible fictional records, not secure authentication. Passwords, contact enquiries, registrations and email subscriptions are never stored or submitted. Do not add real student data without a proper backend and access control.

The dashboard includes weekly batch timings, month navigation for attendance, present/absent labels, six downloadable original TXT notes, subject filtering, two upcoming tests, and recent results. The demo date is 11 September 2026. September attendance is calculated from the same records as the calendar (90%). Week navigation illustrates the recurring timetable; it is not a live calendar integration.

## Customisation

See `documentation/CUSTOMIZATION.md` for colors, typography, content, images, motion, RTL and dashboard data. `documentation/CREDITS.md` includes asset provenance and licences. Exact built-in image generation prompts are in `documentation/image-prompts.json`.

## Validation and scope

See `documentation/VALIDATION.md` for performed checks and practical testing limits. Desktop, tablet and mobile layouts use 640, 900, 1100 and 1280px refinement points. Light/dark follows system preference until changed; direction and theme are device-local preferences. RTL mirrors the English layout; it is not a translation.

## Support

For edits, identify the page filename and describe the desired change. There is no external support service bundled with this template. Before production use, replace the fictional centre details and legal notices and connect genuine enquiry/authentication services as needed.

## Changelog

### 1.1.0 — 23 September 2026
- Home 1 rebuilt around photography: how tutoring works, online vs in-centre, subjects and class bands, tutor line-up, success stories, campus, and an Enquire/Book band.
- Home 2 expanded with class-band cards, an "inside a session" breakdown, a photo strip and a closing enquiry band; hero image no longer sits flush against the section edge.
- Hero portrait background removed (transparent WebP), so the square block behind the student is gone in both themes.
- 33 Pexels photographs added across Courses, Services, About, Contact, Results, Tutors, Fees and Blog.
- Services promoted from the Pages dropdown to the main navigation.
- Page gutters normalised: every `.container` now shares one symmetric left/right margin at all widths.
- Removed the blank band between the last section and the footer on every page.
- Fixed a JavaScript error that aborted `main.js` on the standalone pages (dashboard, sign-in, sign-up, forgot password, coming soon, 404).

### 1.0.0 — 11 September 2026
- 17 distinct page designs plus a root error route.
- 11 original AI-generated images, all optimized as WebP; local Roboto and Lucide assets.
- Two different home compositions and a simpler dashboard.
- Responsive layouts, motion with reduced-motion support, dark mode, RTL, keyboard navigation and validation.
- Original downloadable learning notes and complete documentation.
