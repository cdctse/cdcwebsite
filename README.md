# CDC Website – Editor Notes

This document summarizes how the `cdcwebsite` project is structured and how to safely edit content, layout and languages.

## 1. Structure & Shared Partials

- **Pages**
  - `index.html` – main one-page site (hero, about, services, portfolio, contact).
  - `apps.html` – detailed presentation of CDC apps (NameCard, Befitting, TaskTicket, Web Creator).
- **Shared header/footer**
  - `header.html` and `footer.html` are injected into each page by `script.js` using `data-shared-header` and `data-shared-footer` placeholders.
  - Do **not** duplicate header/footer markup inside pages; always edit the partials.

## 2. Internationalization (i18n)

- All user-facing texts should be attached to a `data-i18n` key in HTML, for example:
  ```html
  <h2 data-i18n="about.title">Who We Are</h2>
  ```
- Translations live in `script.js` in the `translations` object, with 3 language blocks:
  - `en` – English
  - `fr` – French
  - `zh` – Simplified Chinese
- **When adding new text**:
  1. Choose a key name like `section.key`, e.g. `services.newPoint`.
  2. Use it in HTML: `data-i18n="services.newPoint"`.
  3. Add the same key under `translations.en`, `translations.fr`, and `translations.zh` in `script.js`.
- Language buttons in the header (`EN`, `FR`, `简`) call `applyLanguage(lang)` and update all `[data-i18n]` nodes, plus the document `<title>` and `lang` attribute.

## 3. Navigation & Scroll Behaviour

- The header is fixed at the top; section anchors must compensate for its height.
- Sections that are used as scroll targets have `class="scroll-target"` and an `id`, for example:
  ```html
  <section class="section neutral-section">
    <div id="about" class="container split-layout scroll-target">
      ...
    </div>
  </section>
  ```
- Scroll offset is controlled in `styles.css`:
  ```css
  .scroll-target {
    scroll-margin-top: 7rem;
  }

  /* About section slightly lower so the title is never hidden */
  #about.scroll-target {
    scroll-margin-top: 8.2rem;
  }
  ```
- On `index.html`, navigation links in `header.html` use `index.html#section`. On the home page, `script.js` rewrites these to `#section` so smooth in-page scrolling works.

## 4. Apps Page Layout

- `apps.html` uses the same design system as the main site.
- App cards layout:
  - Container: `.services-grid.apps-grid`.
  - Each app: `<div class="service-column app-card">`.
- This ensures all four apps have consistent card styling (background, border, hover) controlled in `styles.css` (`.app-card`, `.apps-grid`).
- Texts for app titles, descriptions, benefits and status lines use `apps.*` keys in `data-i18n` and are translated in `script.js` under each language.

## 5. Styling Guidelines

- Global styles live in `styles.css`.
- Reuse existing utility classes and patterns:
  - Sections: `.section`, `.neutral-section`, `.container`.
  - Layouts: `.split-layout`, `.services-grid`, `.portfolio-grid`, `.contact-layout`.
  - Components: `.hero-card`, `.portfolio-card`, `.app-card`, `.contact-form`, etc.
- Avoid inline styles; prefer updating or extending CSS rules.
- Keep the visual style consistent (colors, typography, spacing) with existing design.

## 6. Editing Workflow & Testing Checklist

When you change content or layout:

1. **Translations**
   - Make sure any new text has `data-i18n` and entries in `translations.en`, `translations.fr`, `translations.zh`.
   - Hard refresh with cache disabled (DevTools → Network → "Disable cache" + Ctrl+F5) to see script and partial updates.

2. **Language switching**
   - On `index.html` and `apps.html`, click `EN`, `FR`, `简`.
   - Verify header nav, hero/about/services, portfolio/apps, contact and footer all switch language correctly.

3. **Navigation & scroll**
   - From each language, click nav links (HOME, ABOUT, SERVICES, PORTFOLIO, CONTACT).
   - Confirm section titles are fully visible under the fixed header and not cut off.

4. **Apps page** (`apps.html`)
   - Check that all four app blocks use the same card layout and spacing.
   - Verify links (e.g. to the NameCard app) still work.

5. **Regression checks**
   - Ensure header and footer remain identical across pages.
   - Confirm there is no extra vertical gap above the footer and that background colors look continuous.

This README is meant to keep future edits consistent and safe while preserving the existing design and language behaviour.
