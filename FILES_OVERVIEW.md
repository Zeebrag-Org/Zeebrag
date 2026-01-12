FILES_OVERVIEW.md

Purpose: A short map of the project files and how they interact. Keep this file updated when you change files.

Root files
- about.html: About page content and "Get Started" modal. References `style.css` and `index.js`.
- contact.html: Contact page with contact form. References `style.css` and `index.js`. Forms are handled client-side and saved to `localStorage` under key `zeebrag_submissions`.
- index.html: Home page. References `style.css` and `index.js`.
- services.html: Services content page. References `style.css` and `index.js`.
- style.css: Main site stylesheet used by all HTML pages in the root and `public/styles`.
- index.js: Consolidated, minimal client-side script. Handles mobile menu toggle, scroll-to-top button, "Get Started" modal open/close, and local form submission (no server calls). Saves submissions to `localStorage`.
- sitemap.xml: Sitemap listing pages for search engines.
- favicon.ico.png, Zeebrag_logo.jpg: Static assets used in headers/branding.
- public/: (removed) previously held duplicate images and CSS. Duplicates were merged into the project root.

Removed / deprecated files (deleted or neutralized)
- submit-form.php: Server-side form handler removed (no server sending to Google Forms). Form handling is client-side only.
- verify_recaptcha.php: reCAPTCHA verification removed.
- GOOGLE_FORMS_SETUP.md: Integration docs removed.
- google25a1526d6927ae9e.html: Google site verification removed.
- index (1).js: Duplicate JS removed; consolidated into `index.js`.

How forms work now
- All forms (`#contact-form`, `#get-started-form`, `#newsletter-form`) are validated client-side in `index.js`.
- On submit, valid data is appended to an array stored in `localStorage` at key `zeebrag_submissions`.
- No server calls or external integrations are performed by default.

If you want server-side forwarding later
- Restore `submit-form.php` and `verify_recaptcha.php` from your backups or version control, then update the HTML forms to submit to `submit-form.php` (or implement a new API endpoint).

Notes
- This cleanup removed comments and removed external/unused integration code to make the project lighter and self-contained.
- Keep backups or version control to restore integrations if needed.
