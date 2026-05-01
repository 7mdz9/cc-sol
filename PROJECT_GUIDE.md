# Solea Project Guide

## Overview

Solea is a sun-inspired cafe in Abu Dhabi. The site is a static pre-order landing page for the May 1, 2026 launch.

This project was structurally rebranded from the old Soléa site to the new Solea identity. It is not a refresh of the previous gold-and-cream design. The current site uses the new Porcelain, Stone Moss, Olive, Earth, Oak, Seafoam, Terracotta, and Lemon Rind palette with DM Serif Display and Inter typography.

The project remains a multi-file static site:

- `index.html`
- `styles/` partials loaded directly from `index.html`
- `scripts/` ES modules imported by `scripts/main.js`

There is no build step and no framework.

## Running

Open `index.html` in a browser.

If the browser blocks ES modules from local files, run a static server from the repo root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploying

Deploy the repo as static files to any static host. No build command is required.

`vercel.json` is currently a simple static-host config with clean URLs and no trailing slash behavior.

## Brand System

### Name

Use `Solea`, without the accent.

### Palette

The current palette is defined in `styles/01-tokens.css`:

- Porcelain: `#EEE9E4`
- Oak: `#C0AE94`
- Stone Moss: `#6D705A`
- Olive: `#4D4738`
- Earth: `#755F4A`
- Seafoam: `#BAB9A7`
- Terracotta: `#B56A4E`
- Lemon Rind: `#D9B86C`

### Typography

The current fonts are:

- `DM Serif Display` for wordmark, headlines, quotes, and editorial text
- `Inter` for navigation, labels, countdown numbers, and utility text

Font preconnects and the Google Fonts stylesheet live in `index.html`.

## Current Page Structure

The homepage sections, in order:

1. Hero
2. Brand
3. Locations
4. Goods
5. Contact
6. Footer

There are three quiet divider elements between major editorial sections.

## Removed Old Sections And Concepts

The rebrand removed the old Soléa structure and naming:

- Marquee section removed
- Six Pillars section is not active in the current page
- Old Branches naming replaced by Locations
- Old Merch naming replaced by Goods
- Old Support naming replaced by Contact
- Old custom cursor removed
- Old hero canvas removed
- Old PNG/WebP logo assets removed from the active page
- Old JSON-driven rendering removed from the active page

Locations, goods, and contact content now live inline in `index.html`.

## CSS Architecture

CSS partials are loaded directly from `index.html`. Current cascade order:

1. `01-tokens.css`
2. `02-reset.css`
3. `03-typography.css`
4. `04-nav.css`
5. `05-hero.css`
6. `06-atmosphere.css`
7. `08-locations.css`
8. `09-goods.css`
9. `10-reach.css`
10. `12-brand.css`
11. `12-utilities.css`
12. `13-divider.css`
13. `13-animations.css`
14. `14-responsive.css`
15. `20-countdown.css`

Keep this import order intentional. Later files can override earlier shared rules.

## JavaScript Architecture

`scripts/main.js` imports only the modules needed by the new design:

- `scripts/countdown.js`
- `scripts/nav.js`
- `scripts/atmosphere.js`
- `scripts/reveal.js`
- `scripts/hero-canvas.js`
- `scripts/cursor.js`
- `scripts/goods.js`

### Countdown

`scripts/countdown.js` targets May 1, 2026 at midnight UAE time:

```text
2026-05-01T00:00:00+04:00
```

It updates `[data-unit]` values inside `#cd-grid`, adds the `.ticked` class on changes, and swaps to `#cd-launched` when the target time has passed.

### Navigation

`scripts/nav.js` handles:

- transparent fixed nav
- `.scrolled` hairline state after scrolling
- mobile overlay open/close
- Escape-to-close behavior

### Reveal

`scripts/reveal.js` handles `.rv` reveal-on-scroll behavior using `IntersectionObserver`.

It includes:

- fallback behavior when `IntersectionObserver` is unavailable
- unobserve after reveal
- above-the-fold hardening on the next animation frame

## Assets

The new page uses inline SVG marks and inline SVG goods icons. It does not depend on external logo PNG/WebP files or external goods SVG files.

`favicon.ico` is still present as the browser favicon.

## Source Reference

`_rebrand-source.html` is preserved as the complete target reference used for the rebrand migration. Do not treat it as the runtime entry point; the runtime entry point is `index.html`.

## Editing Guide

- Change color tokens in `styles/01-tokens.css`.
- Change base layout, body atmosphere, section primitives, and eyebrows in `styles/02-reset.css`.
- Change nav behavior styles in `styles/04-nav.css`.
- Change hero and CTA composition in `styles/05-hero.css`.
- Change Locations in `styles/08-locations.css`.
- Change Goods in `styles/09-goods.css`.
- Change Contact in `styles/10-contact.css`.
- Change Footer in `styles/11-footer.css`.
- Change Brand in `styles/12-brand.css`.
- Change reveal classes in `styles/12-utilities.css`.
- Change dividers in `styles/13-divider.css`.
- Change keyframes and reduced-motion behavior in `styles/13-animations.css`.
- Change breakpoints in `styles/14-responsive.css`.
- Change countdown presentation in `styles/20-countdown.css`.

## Gotchas

- Do not reintroduce the old Soléa accent unless intentionally reverting the brand.
- Do not add the old Marquee, Branches, Merch, or Support section names back into navigation.
- Do not restore the custom cursor or hero canvas unless the design direction changes.
- `package.json` may still contain historical metadata or scripts; the site itself does not need a build command.
