# Validation record

Completed 12 September 2026.

## Passed

- All 18 HTML entrypoints (17 page designs plus a root 404 copy) contain one H1, unique IDs, a title, description, local styles/scripts and favicon.
- Every local page link, fragment, stylesheet, script, image, font and material reference resolves.
- No header or footer on sign-in, signup, coming-soon or either 404 entrypoint.
- Corrected heading hierarchy, labelled ratings/countdown, and ARIA tab-to-panel associations pass local structural checks.
- Browser checks found no page-level horizontal overflow at 390px across all distinct pages; key layouts also checked at 320px, 768px and 1440px.
- Custom images and local Roboto font load successfully; 11 generated content images are each used once.
- Light/dark and RTL controls work and persist between pages. Dark selected-tab contrast was corrected.
- Mobile menu includes student login. Supplied demo credentials open the dashboard.
- Grade filters update course durations and grade-specific curricula, including the grade passed from Home 2.
- Fee selection for Classes 9–10 / three subjects displays INR 4,800 with INR 600 monthly savings, and pre-fills the enquiry.
- Empty contact form displays field-level errors; a valid fictional submission displays the honest demo confirmation.
- Dashboard section changes, calendar month navigation, subject filtering, timetable and displayed results were exercised. Attendance percentage derives from the calendar records.
- Six original TXT learning files exist and are linked with download attributes.
- Dialogs support close buttons and Escape. Tabs include arrow-key handling.
- JavaScript syntax checks passed. No browser console errors were observed during tested flows.
- WebMCP dashboard tool registered, changed the visible panel on a valid request, and rejected an invalid section without changing state.

## Validation limits

An initial W3C Nu validation found heading, label and tab-panel issues. These were corrected and rechecked locally. A repeat external upload was blocked by automatic approval review, so a final W3C certification is not claimed.

Visual/interaction testing used the available in-app Chromium browser. Firefox, Safari and Edge were not separately executed. Screen-reader certification and a complete WCAG conformance audit were not performed. Reduced-motion rules were inspected in source; no automated accessibility score is claimed.

The site is a static front-end template. Forms and accounts are explicitly demonstrated, with no live mail delivery, account creation, enrolment, database or secure authentication. No real student data is included.
