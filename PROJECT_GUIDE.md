# Soléa Project Guide

## 1. Overview
Soléa is a pre-launch marketing homepage built as a static HTML/CSS/JS site. The repo now contains only the landing page and its supporting assets, content data, and frontend modules.

Core stack:
- HTML5
- CSS custom properties and modular partials
- ES modules with no bundler
- Runtime JSON fetches for content
- Google Fonts: `Cormorant Garamond` and `Montserrat`

## 2. Running Locally
Serve the repo over HTTP so ES modules and JSON requests work:

```bash
python3 -m http.server 8000
```

or

```bash
npx serve .
```

Open `http://localhost:8000`.

Quick smoke test:
1. The hero logo and canvas appear.
2. The marquee renders and scrolls.
3. The countdown updates.
4. The menu accordion opens and updates the preview.
5. Branches, merch, support, and footer all render populated content.

## 3. Folder Structure
```text
Proj/
├── index.html
├── README.md
├── PROJECT_GUIDE.md
├── favicon.ico
├── vercel.json
├── public/
│   └── assets/
├── styles/
│   ├── main.css
│   ├── 01-tokens.css
│   ├── 02-reset.css
│   ├── 03-cursor.css
│   ├── 04-nav.css
│   ├── 05-hero.css
│   ├── 06-marquee.css
│   ├── 07-menu.css
│   ├── 08-branches.css
│   ├── 09-merch.css
│   ├── 10-support.css
│   ├── 11-footer.css
│   ├── 12-utilities.css
│   ├── 13-animations.css
│   ├── 14-responsive.css
│   └── 20-countdown.css
├── scripts/
│   ├── main.js
│   ├── branches.js
│   ├── countdown.js
│   ├── cursor.js
│   ├── hero-canvas.js
│   ├── marquee.js
│   ├── menu.js
│   ├── merch.js
│   ├── nav.js
│   ├── reveal.js
│   └── support.js
├── data/
│   ├── branches.json
│   ├── contact.json
│   ├── marquee.json
│   ├── menu.json
│   └── merch.json
└── components/
    └── merch-svgs/
```

## 4. Runtime Flow
1. `index.html` loads the page shell.
2. `styles/main.css` imports the landing-page CSS stack.
3. `scripts/main.js` runs on `DOMContentLoaded`.
4. `main.js` initializes:
   1. `initCursor()`
   2. `initNav()`
   3. `initCountdown()`
   4. `initMarquee()`
   5. `initBranches()`
   6. `initMenu()`
   7. `initMerch()`
   8. `initSupport()`
   9. `initReveal()`
   10. `initHeroCanvas()`

## 5. Key Files

### `index.html`
- Static homepage structure for nav, hero, marquee, countdown, menu, branches, merch, support, and footer.
- Contains the mobile nav overlay markup and the `scripts/main.js` entry point.

### `styles/main.css`
- Imports only the CSS partials used by the landing page.

### `scripts/main.js`
- Entry point for the homepage.
- Initializes the landing-page modules only.

### `data/*.json`
- Runtime content sources for homepage sections.

### `public/assets/`
- Soléa logos and other static image assets.

## 6. CSS Architecture
- `01-tokens.css`: colors, typography, spacing variables
- `02-reset.css`: base reset and shared text styling
- `03-cursor.css`: custom cursor visuals
- `04-nav.css`: fixed nav and mobile overlay
- `05-hero.css`: hero layout and canvas styling
- `06-marquee.css`: marquee bar
- `07-menu.css`: menu accordion and preview
- `08-branches.css`: branch cards and grid
- `09-merch.css`: merch cards and art treatment
- `10-support.css`: support section
- `11-footer.css`: footer layout
- `12-utilities.css`: reveal helpers
- `13-animations.css`: shared keyframes
- `14-responsive.css`: responsive behavior
- `20-countdown.css`: countdown section styling

## 7. JavaScript Architecture
- `cursor.js`: desktop-only custom cursor behavior
- `nav.js`: sticky nav state, mobile overlay open/close, focus management, and scroll lock
- `countdown.js`: pre-order countdown logic
- `marquee.js`: marquee item rendering
- `branches.js`: branch card rendering
- `menu.js`: menu categories, items, calorie toggle, and preview
- `merch.js`: merch rendering and SVG loading
- `support.js`: support card and hours rendering
- `reveal.js`: intersection-based reveal animations
- `hero-canvas.js`: hero background animation

## 8. Content Updates
- Update menu content in `data/menu.json`
- Update branch content in `data/branches.json`
- Update merch content in `data/merch.json`
- Update support content in `data/contact.json`
- Update marquee labels in `data/marquee.json`

## 9. Conventions
- Keep CSS partials numbered in import order.
- Keep homepage functionality isolated to single-purpose modules.
- Serve locally over HTTP, not `file://`.
- Maintain landing-page-only scope unless requirements explicitly expand again.
