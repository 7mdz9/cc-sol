# Soléa Project Guide

## Table of Contents
- [1. Project Overview](#1-project-overview)
- [2. Running the Project](#2-running-the-project)
- [3. Folder Structure — Visual Tree](#3-folder-structure--visual-tree)
- [4. How the Site Loads — Runtime Flow](#4-how-the-site-loads--runtime-flow)
- [5. File-by-File Reference](#5-file-by-file-reference)
- [6. Data Schemas](#6-data-schemas)
- [7. CSS Architecture](#7-css-architecture)
- [8. JavaScript Architecture](#8-javascript-architecture)
- [9. Common Developer Tasks](#9-common-developer-tasks)
- [10. Conventions & Gotchas](#10-conventions--gotchas)
- [11. Version History](#11-version-history)
- [12. Next Steps / Roadmap](#12-next-steps--roadmap)
- [13. Order Flow Addendum](#13-order-flow-addendum)

## 1. Project Overview
Soléa is a premium UAE juice and dessert brand marketing site. This repository contains the frontend mockup as a plain HTML/CSS/JS project with no build step. It now includes both the marketing site (`index.html`) and a QR-gated dine-in ordering flow (`order.html` + `checkout.html`). It is not a Next.js app, not a backend service, and not a CMS integration.

Tech stack:
- HTML5
- CSS3 with CSS custom properties
- ES modules with no bundler
- JSON for content
- `fetch()` for runtime data loading
- Google Fonts: `Cormorant Garamond` and `Montserrat`

Browser support expectation:
- Modern evergreen browsers
- ES modules required
- CSS custom properties required

## 2. Running the Project
Why a static server is required:
- ES modules are loaded from `<script type="module">`
- JSON and SVG content is loaded with `fetch()`
- Both patterns require HTTP; `file://` will break loading

Ways to run locally:

```bash
python3 -m http.server 8000
```

```bash
npx serve .
```

VS Code:
1. Install the Live Server extension.
2. Open the project folder.
3. Run "Open with Live Server".

Open:
- `http://localhost:8000`

30-second verification checklist:
1. The hero canvas animates in the background.
2. The custom cursor follows the mouse and enlarges on hover targets.
3. The marquee strip auto-scrolls.
4. The menu accordion opens categories and item clicks update the preview panel.
5. The branches, merch, and support sections render populated content instead of empty placeholders.

## 3. Folder Structure — Visual Tree
```text
Proj/
├── index.html                          # HTML shell; static layout plus empty runtime mount points
├── order.html                          # QR-gated dine-in ordering entry point
├── checkout.html                       # dedicated checkout page for table orders
├── README.md                           # quick-start guide
├── PROJECT_GUIDE.md                    # deep project reference
├── favicon.ico                         # root favicon used by browsers during local/static serving
├── public/
│   └── assets/
│       └── logo.png                    # Soléa wordmark used in nav, hero, support, and footer
├── styles/
│   ├── main.css                        # imports all CSS partials in cascade order
│   ├── 01-tokens.css                   # color tokens and other CSS custom properties
│   ├── 02-reset.css                    # reset, body defaults, shared section/header typography
│   ├── 03-cursor.css                   # custom cursor visuals
│   ├── 04-nav.css                      # fixed navigation styles
│   ├── 05-hero.css                     # hero section, canvas, rings, buttons, scroll hint
│   ├── 06-marquee.css                  # marquee strip layout and animation
│   ├── 07-menu.css                     # menu accordion, calorie toggle, preview panel
│   ├── 08-branches.css                 # branches grid and hover states
│   ├── 09-merch.css                    # merch cards, SVG scaling, overlay hover state
│   ├── 10-support.css                  # support section layout, cards, decorative rings
│   ├── 11-footer.css                   # footer layout and link styling
│   ├── 12-utilities.css                # reveal helper classes and stagger delay helpers
│   ├── 13-animations.css               # shared keyframes
│   ├── 14-responsive.css               # shared marketing-site responsive behavior
│   ├── 15-order-page.css               # order-page layout, preview, cart, mobile bar, toast
│   └── 16-checkout.css                 # checkout page styling, payment tiles, confirmation state
├── scripts/
│   ├── main.js                         # entry point; runs all init functions
│   ├── cursor.js                       # custom cursor movement and hover enlargement
│   ├── nav.js                          # nav scroll-state toggle
│   ├── reveal.js                       # IntersectionObserver reveal behavior
│   ├── menu.js                         # menu JSON fetch, render, accordion, preview, calorie toggle
│   ├── hero-canvas.js                  # hero particle animation
│   ├── marquee.js                      # marquee JSON fetch and duplicated strip render
│   ├── branches.js                     # branches JSON fetch and card render
│   ├── support.js                      # support JSON fetch and channels/hours render
│   ├── merch.js                        # merch JSON fetch, SVG fetch, card render
│   ├── branch-context.js               # reads and validates branch/table URL context
│   ├── order-main.js                   # order-page entry point and QR guard
│   ├── order-menu.js                   # order-page menu accordion renderer
│   ├── order-preview.js                # order-page preview panel + add-to-cart hook
│   ├── cart.js                         # localStorage-backed cart state scoped by branch+table
│   ├── order-cart-ui.js                # cart rendering, totals, mobile cart bar wiring
│   ├── checkout.js                     # checkout page state, payment method flow, inline errors
│   ├── payment-stub.js                 # mock payment processor contract for card/apple-pay
│   └── order-submit.js                 # mock order submission + confirmation screen
├── data/
│   ├── menu.json                       # 6 menu categories and 33 items
│   ├── branches.json                   # 5 branch records, each with a slug for QR URLs
│   ├── marquee.json                    # 6 marquee labels
│   ├── contact.json                    # 4 support channels and 3 support-hour lines
│   └── merch.json                      # 8 merch entries plus SVG filenames and reveal classes
└── components/
    └── merch-svgs/
        ├── signature-bottle.svg        # merch illustration: bottle
        ├── gold-tote-bag.svg           # merch illustration: tote bag
        ├── solea-slides.svg            # merch illustration: slides
        ├── sun-cap.svg                 # merch illustration: cap
        ├── solea-shades.svg            # merch illustration: sunglasses
        ├── beach-towel.svg             # merch illustration: towel
        ├── candle-set.svg              # merch illustration: candle set
        └── linen-tee.svg               # merch illustration: t-shirt
```

## 4. How the Site Loads — Runtime Flow
Runtime sequence:
1. `index.html` parses and builds the static shell.
2. The browser loads `styles/main.css`.
3. `styles/main.css` loads all 14 CSS partials in numbered order.
4. The browser loads `scripts/main.js` as an ES module.
5. `main.js` waits for `DOMContentLoaded`.
6. `main.js` runs init functions in this order:
   1. `initCursor()`
   2. `initNav()`
   3. `await initMarquee()`
   4. `await initBranches()`
   5. `await initMenu()`
   6. `await initMerch()`
   7. `await initSupport()`
   8. `initReveal()`
   9. `initHeroCanvas()`
7. Async section modules fetch JSON or SVG text, render DOM into placeholder containers, then attach feature-specific event listeners where needed.
8. `initReveal()` runs after async rendering so it can observe newly inserted `.rv`, `.rl`, and `.rr` elements.

Flow:

```text
index.html
  -> styles/main.css
      -> 14 numbered CSS partials
  -> scripts/main.js
      -> DOMContentLoaded
          -> cursor/nav
          -> fetch + render marquee
          -> fetch + render branches
          -> fetch + render menu
          -> fetch + render merch (+ fetch 8 SVG files)
          -> fetch + render support
          -> attach reveal observer
          -> start hero canvas animation
```

## 5. File-by-File Reference

### Root files

### `index.html`
- **Purpose:** Defines the page shell and all static markup that runtime modules fill with data.
- **What's inside:**
  - `<head>` with title, Google Fonts, and `styles/main.css`
  - custom cursor elements `#C` and `#CR`
  - static sections: nav, hero, marquee shell, menu shell, branches shell, merch shell, support shell, footer
  - the one preserved inline handler on `.scroll-hint`
  - one module script tag for `scripts/main.js`
- **Depends on:** `styles/main.css`, `scripts/main.js`, `public/assets/logo.png`
- **Referenced by:** browser entry point; JS modules query its IDs and classes
- **Edit this file when:** changing static copy like the hero headline or footer text; adding a new section shell or a new mount point

### `order.html`
- **Purpose:** QR-gated dine-in ordering entry point.
- **What's inside:**
  - order nav with shared Soléa logo and branch/table context
  - invalid-context guard state
  - order layout with menu, preview, cart, mobile cart bar, and toast
  - one module script tag for `scripts/order-main.js`
- **Depends on:** `styles/main.css`, `styles/15-order-page.css`, `scripts/order-main.js`, `data/menu.json`, `data/branches.json`
- **Referenced by:** QR links and manual local test URLs
- **Edit this file when:** changing order-shell layout, guard copy, or mobile cart/toast mount points

### `checkout.html`
- **Purpose:** Dedicated checkout page for the dine-in order flow.
- **What's inside:**
  - shared top bar with branch/table context
  - invalid-context / empty-cart guard state
  - payment method tiles, dynamic payment panel, and order summary
  - one module script tag for `scripts/checkout.js`
- **Depends on:** `styles/main.css`, `styles/16-checkout.css`, `scripts/checkout.js`, `scripts/cart.js`
- **Referenced by:** `scripts/order-cart-ui.js` checkout CTA
- **Edit this file when:** changing checkout layout, payment-panel mount points, or confirmation-shell structure

### `README.md`
- **Purpose:** Quick-start reference for running the site and locating major folders.
- **What's inside:**
  - short project description
  - local run commands
  - brief folder summaries
  - brief editing guidance
- **Depends on:** actual repo structure
- **Referenced by:** developers onboarding to the project
- **Edit this file when:** the run command changes; a new top-level folder or major data file is added

### `PROJECT_GUIDE.md`
- **Purpose:** Deep project reference for developers.
- **What's inside:**
  - project architecture, runtime flow, file reference, schemas, tasks, and gotchas
- **Depends on:** every runtime file in the repo
- **Referenced by:** developers needing more than the quick-start
- **Edit this file when:** the architecture, file layout, or data shapes change

### `favicon.ico`
- **Purpose:** Root favicon served automatically by browsers.
- **What's inside:**
  - one `64x64` icon resource with PNG payload
- **Depends on:** nothing at runtime beyond normal browser favicon lookup
- **Referenced by:** browsers requesting `/favicon.ico`
- **Edit this file when:** the favicon art needs to change

### `public/assets/`

### `public/assets/logo.png`
- **Purpose:** Soléa wordmark image used in multiple static locations.
- **What's inside:**
  - a `806x552` RGBA PNG
- **Depends on:** nothing
- **Referenced by:** `index.html` nav, hero, support, footer
- **Edit this file when:** the brand wordmark asset changes

### `styles/`

### `styles/main.css`
- **Purpose:** Central CSS entry point.
- **What's inside:**
  - 14 `@import` statements, one per partial
- **Depends on:** every numbered CSS partial
- **Referenced by:** `index.html`
- **Edit this file when:** adding, removing, or reordering a CSS partial

### `styles/01-tokens.css`
- **Purpose:** Stores CSS custom properties.
- **What's inside:**
  - `:root` tokens for `--gold`, `--cream`, `--dark`, `--text`, `--muted`, `--border`, and related shades
- **Depends on:** nothing
- **Referenced by:** all other CSS partials
- **Edit this file when:** changing brand colors or shared token values

### `styles/02-reset.css`
- **Purpose:** Sets global reset and shared section-level primitives.
- **What's inside:**
  - universal reset
  - `html` and `body` defaults
  - `.sec`, `.sec-in`, `.ey`, `.hd`, `.st`
- **Depends on:** token variables from `01-tokens.css`
- **Referenced by:** `styles/main.css`; class names used in `index.html`
- **Edit this file when:** adjusting global spacing or shared section-heading typography

### `styles/03-cursor.css`
- **Purpose:** Styles the custom cursor and hover size states.
- **What's inside:**
  - `.cur`, `.cur-r`
  - `.big` hover-size behavior
  - `body:has(a:hover)` cursor expansion rules
- **Depends on:** token variables; `#C` and `#CR` in `index.html`
- **Referenced by:** `scripts/cursor.js`
- **Edit this file when:** changing cursor size, color, or hover expansion visuals

### `styles/04-nav.css`
- **Purpose:** Styles the fixed nav and its scrolled state.
- **What's inside:**
  - `nav`, `nav.scrolled`
  - `.nav-logo`, `.nav-links`, `.nav-cta`
- **Depends on:** `#mainNav` markup in `index.html`; `nav.scrolled` toggle from `scripts/nav.js`
- **Referenced by:** `index.html`, `scripts/nav.js`
- **Edit this file when:** changing nav spacing, link styling, or scroll-state visuals

### `styles/05-hero.css`
- **Purpose:** Styles the hero section and its moving/decorative elements.
- **What's inside:**
  - `#hero`
  - `.hero-bg`, `.hero-canvas`, `.hero-rings`, `.hr*`
  - `.hero-logo`, `.hero-eyebrow`, `.hero-title`, `.hero-actions`
  - `.btn-p`, `.btn-g`, `.scroll-hint`, `.scroll-ln`
- **Depends on:** hero markup in `index.html`; keyframes in `13-animations.css`
- **Referenced by:** `index.html`, `scripts/hero-canvas.js`
- **Edit this file when:** changing hero layout, button styling, or ring/canvas presentation

### `styles/06-marquee.css`
- **Purpose:** Styles the marquee strip and its looping animation.
- **What's inside:**
  - `.marquee`, `.marquee-track`
  - `.mi`, `.md`
  - pause-on-hover behavior
- **Depends on:** marquee markup from `index.html` and `scripts/marquee.js`; `marqueeScroll` keyframe
- **Referenced by:** `index.html`, `scripts/marquee.js`
- **Edit this file when:** changing marquee speed, spacing, or label style

### `styles/07-menu.css`
- **Purpose:** Styles the menu accordion, toggle, item list, and sticky preview panel.
- **What's inside:**
  - `#menu`, `.menu-wrap`
  - calorie toggle selectors `.cal-row`, `.sw*`
  - category and item selectors `.cat*`, `.item*`
  - preview panel selectors `.menu-vis`, `.img-wrap`, `.img-ph`, `.img-ov`, `.ov-*`, `.cal-*`
  - `.ic` corner brackets
- **Depends on:** `index.html` menu shell and generated menu item DOM from `scripts/menu.js`
- **Referenced by:** `index.html`, `scripts/menu.js`
- **Edit this file when:** changing accordion spacing, item hover behavior, or preview panel visuals

### `styles/08-branches.css`
- **Purpose:** Styles the branch header and branch cards.
- **What's inside:**
  - `#branches`, `.br-hd`, `.br-hint`, `.br-grid`
  - `.br-card`, `.br-num`, `.br-name`, `.br-area`, `.br-info`
- **Depends on:** branch shell in `index.html` and card markup generated by `scripts/branches.js`
- **Referenced by:** `index.html`, `scripts/branches.js`
- **Edit this file when:** changing branch grid columns, card hover motion, or branch typography

### `styles/09-merch.css`
- **Purpose:** Styles merch cards and hover-sensitive inline SVG behavior.
- **What's inside:**
  - `#merch`, `.merch-hd`, `.merch-note`, `.merch-grid`
  - `.mc`, `.mc-img`, `.mc-layer`, `.mc-name`, `.mc-price`
  - hover selector `.mc:hover .mc-img svg`
  - unused `.mc-icon` selectors still present in CSS
- **Depends on:** merch shell in `index.html` and inline SVG card DOM generated by `scripts/merch.js`
- **Referenced by:** `index.html`, `scripts/merch.js`
- **Edit this file when:** changing merch grid layout, overlay behavior, or SVG hover scale

### `styles/10-support.css`
- **Purpose:** Styles the support section, support cards, and decorative logo/rings.
- **What's inside:**
  - `#support`, `.sup-grid`
  - `.sup-ey`, `.sup-title`, `.sup-sub`
  - `.sup-btn*`, `.sb-*`
  - `.sup-hrs*`
  - `.sup-deco`, `.deco-logo`, `.dr*`
- **Depends on:** support shell in `index.html` and runtime content from `scripts/support.js`
- **Referenced by:** `index.html`, `scripts/support.js`
- **Edit this file when:** changing support card hover behavior or decorative ring sizing

### `styles/11-footer.css`
- **Purpose:** Styles the footer layout and links.
- **What's inside:**
  - `footer`, `.foot-in`, `.foot-logo`, `.foot-links`, `.foot-copy`
- **Depends on:** footer markup in `index.html`
- **Referenced by:** `index.html`
- **Edit this file when:** changing footer spacing, logo treatment, or footer link styling

### `styles/12-utilities.css`
- **Purpose:** Defines reveal animation helper classes and stagger delays.
- **What's inside:**
  - `.rv`, `.rl`, `.rr`
  - `.in` state rules
  - `.d1` through `.d5`
- **Depends on:** `scripts/reveal.js` to add `.in`
- **Referenced by:** `index.html` and runtime-generated cards with reveal classes
- **Edit this file when:** changing reveal offsets, duration, or stagger timing

### `styles/13-animations.css`
- **Purpose:** Stores shared keyframes.
- **What's inside:**
  - `logoIn`
  - `fadeUp`
  - `spin`
  - `scrollPulse`
  - `marqueeScroll`
  - `decoFloat`
  - `phFloat`
- **Depends on:** nothing
- **Referenced by:** hero, marquee, support, and menu styles
- **Edit this file when:** adding or changing a reusable animation keyframe

### `styles/14-responsive.css`
- **Purpose:** Handles responsive layout changes at `1024px`.
- **What's inside:**
  - one `@media(max-width:1024px)` block
  - layout changes for nav padding, menu, branches, merch, support, footer
- **Depends on:** base class names across the layout
- **Referenced by:** `styles/main.css`
- **Edit this file when:** changing tablet/mobile behavior or adding responsive layout overrides

### `styles/15-order-page.css`
- **Purpose:** Styles the dine-in ordering page.
- **What's inside:**
  - order layout grid
  - order nav treatment
  - preview panel and add-to-cart CTA
  - cart panel styling, mobile cart bar, and order toast
  - order-page-specific breakpoints for stacked mobile layouts
- **Depends on:** shared tokens and shared menu styles
- **Referenced by:** `order.html`
- **Edit this file when:** changing order-page layout, mobile behavior, or cart/preview presentation

### `styles/16-checkout.css`
- **Purpose:** Styles the dedicated checkout page.
- **What's inside:**
  - checkout page shell and summary card
  - payment tile selection states
  - dynamic payment method panel
  - inline error banner and confirmation screen
  - mobile full-height checkout adjustments
- **Depends on:** shared tokens and nav/logo styles
- **Referenced by:** `checkout.html`
- **Edit this file when:** changing checkout UX, payment panel treatment, or confirmation styling

### `scripts/`

### `scripts/main.js`
- **Purpose:** Coordinates startup.
- **What's inside:**
  - imports for every feature module
  - one `DOMContentLoaded` listener
  - ordered init calls, with async renders awaited before `initReveal()`
- **Depends on:** every JS feature module
- **Referenced by:** `index.html`
- **Edit this file when:** adding a new module or changing startup order

### `scripts/cursor.js`
- **Purpose:** Runs the custom cursor and hover enlargement behavior.
- **What's inside:**
  - `export function initCursor()`
  - module-scoped cursor position variables
  - `mousemove` handler
  - trailing ring RAF loop
  - hover handlers for `a,.sup-btn,.item,.cat-hd,.mc,.br-card`
- **Depends on:** `#C`, `#CR`, and matching hover-target selectors in the DOM
- **Referenced by:** `scripts/main.js`
- **Edit this file when:** changing which elements trigger cursor enlargement or changing cursor behavior logic

### `scripts/nav.js`
- **Purpose:** Toggles nav scroll state.
- **What's inside:**
  - `export function initNav()`
  - one `scroll` listener that toggles `.scrolled` on `#mainNav`
- **Depends on:** `#mainNav`
- **Referenced by:** `scripts/main.js`
- **Edit this file when:** changing the scroll threshold or nav state logic

### `scripts/reveal.js`
- **Purpose:** Applies reveal animation classes when elements enter view.
- **What's inside:**
  - `export function initReveal()`
  - one `IntersectionObserver`
  - observation of `.rv`, `.rl`, `.rr`
- **Depends on:** reveal classes in markup and styles from `12-utilities.css`
- **Referenced by:** `scripts/main.js`
- **Edit this file when:** changing reveal threshold or what classes are observed

### `scripts/menu.js`
- **Purpose:** Fetches menu data, renders categories/items, and wires menu interactions.
- **What's inside:**
  - `export async function initMenu()`
  - `fetch('./data/menu.json')`
  - menu HTML generation into `#menuCats`
  - category accordion click handlers
  - menu item preview panel update logic
  - calorie toggle logic
- **Depends on:** `data/menu.json`; menu shell selectors in `index.html`
- **Referenced by:** `scripts/main.js`
- **Edit this file when:** changing menu render markup or preview update behavior

### `scripts/hero-canvas.js`
- **Purpose:** Runs the hero particle canvas animation.
- **What's inside:**
  - `export function initHeroCanvas()`
  - canvas resize helper
  - particle array initialization
  - draw loop with particle connections
- **Depends on:** `#hCanvas`
- **Referenced by:** `scripts/main.js`
- **Edit this file when:** changing particle count, motion, or connection behavior

### `scripts/marquee.js`
- **Purpose:** Renders the marquee labels from JSON.
- **What's inside:**
  - `export async function initMarquee()`
  - `fetch('./data/marquee.json')`
  - duplication of the six labels so the strip contains twelve entries
- **Depends on:** `data/marquee.json`; `.marquee-track`
- **Referenced by:** `scripts/main.js`
- **Edit this file when:** changing how marquee labels are duplicated or rendered

### `scripts/branches.js`
- **Purpose:** Renders the branches grid from JSON.
- **What's inside:**
  - `export async function initBranches()`
  - `fetch('./data/branches.json')`
  - branch card HTML generation into `.br-grid`
- **Depends on:** `data/branches.json`; `.br-grid`
- **Referenced by:** `scripts/main.js`
- **Edit this file when:** changing branch card markup or reveal class assignment

### `scripts/support.js`
- **Purpose:** Renders support contact cards and support hours from JSON.
- **What's inside:**
  - `export async function initSupport()`
  - `fetch('./data/contact.json')`
  - support channel card generation into `.sup-btns`
  - support hours generation into `.sup-hrs-tx`
- **Depends on:** `data/contact.json`; `.sup-btns`; `.sup-hrs-tx`
- **Referenced by:** `scripts/main.js`
- **Edit this file when:** changing support card markup or hours render format

### `scripts/merch.js`
- **Purpose:** Renders merch cards from JSON and inlines SVG illustrations fetched at runtime.
- **What's inside:**
  - `export async function initMerch()`
  - `fetch('./data/merch.json')`
  - per-item `fetch('./components/merch-svgs/...')`
  - merch card HTML generation into `.merch-grid`
- **Depends on:** `data/merch.json`; all eight SVG files; `.merch-grid`
- **Referenced by:** `scripts/main.js`
- **Edit this file when:** changing merch card markup or how SVG files are inlined

### `scripts/branch-context.js`
- **Purpose:** Reads `branch` and `table` from the URL and validates them.
- **What's inside:**
  - `readBranchContext()`
  - `validateBranch()`
  - `validateTable()`
- **Depends on:** `data/branches.json`
- **Referenced by:** `scripts/order-main.js`, `scripts/checkout.js`, `scripts/order-submit.js`
- **Edit this file when:** changing QR URL rules or table validation rules

### `scripts/order-main.js`
- **Purpose:** Boots `order.html`.
- **What's inside:**
  - QR guard logic
  - branch/table context label rendering
  - one `menu.json` fetch shared between menu and preview
  - cart initialization and expiry-toast trigger
- **Depends on:** `scripts/order-menu.js`, `scripts/order-preview.js`, `scripts/cart.js`, `data/branches.json`, `data/menu.json`
- **Referenced by:** `order.html`
- **Edit this file when:** changing order boot order or URL-guard behavior

### `scripts/order-menu.js`
- **Purpose:** Renders the order-page category accordion.
- **What's inside:**
  - calorie toggle row
  - six categories and thirty-three items
  - accordion behavior scoped to `#orderMenu`
- **Depends on:** `data/menu.json` shape and order-menu shell selectors
- **Referenced by:** `scripts/order-main.js`
- **Edit this file when:** changing order-page menu markup or accordion behavior

### `scripts/order-preview.js`
- **Purpose:** Updates the selected item preview and add-to-cart action.
- **What's inside:**
  - preview image/name/calorie/price updates
  - active item highlighting
  - add-to-cart button wiring
- **Depends on:** order-page menu item markup, preview shell selectors, local optimized menu assets
- **Referenced by:** `scripts/order-main.js`
- **Edit this file when:** changing preview rendering or item-selection behavior

### `scripts/cart.js`
- **Purpose:** Stores and synchronizes cart state for the dine-in flow.
- **What's inside:**
  - localStorage-backed cart per branch/table
  - 2-hour expiry logic
  - quantity cap of 20
  - cross-tab sync via `storage` event
  - cart notice consumption for expiry messaging
- **Depends on:** browser localStorage
- **Referenced by:** `scripts/order-main.js`, `scripts/order-preview.js`, `scripts/order-cart-ui.js`, `scripts/checkout.js`, `scripts/order-submit.js`
- **Edit this file when:** changing cart persistence, expiry, or synchronization behavior

### `scripts/order-cart-ui.js`
- **Purpose:** Renders the cart UI on the order page.
- **What's inside:**
  - empty and populated cart states
  - quantity controls and subtotal
  - checkout CTA link
  - mobile fixed cart summary bar
- **Depends on:** `scripts/cart.js` and `order.html` cart/mobile bar selectors
- **Referenced by:** `scripts/order-main.js`
- **Edit this file when:** changing cart rendering, mobile cart behavior, or checkout-link treatment

### `scripts/checkout.js`
- **Purpose:** Boots the dedicated checkout page.
- **What's inside:**
  - QR/context guard for checkout
  - order summary render
  - payment tile selection and dynamic method panels
  - inline error handling
  - cash/card/apple-pay submission wiring
- **Depends on:** `scripts/cart.js`, `scripts/payment-stub.js`, `scripts/order-submit.js`
- **Referenced by:** `checkout.html`
- **Edit this file when:** changing checkout flow, payment-form behavior, or error handling

### `scripts/payment-stub.js`
- **Purpose:** Simulates payment processor behavior for the demo flow.
- **What's inside:**
  - `mockCreatePayment()` with artificial latency and a small failure rate
- **Depends on:** nothing external at runtime
- **Referenced by:** `scripts/checkout.js`
- **Edit this file when:** changing the mocked payment contract for demo/testing purposes

### `scripts/order-submit.js`
- **Purpose:** Simulates order submission and renders confirmation.
- **What's inside:**
  - order payload assembly
  - console logging of the mock backend payload
  - order-number generation
  - confirmation screen rendering and cart clearing
- **Depends on:** `scripts/cart.js`, `scripts/branch-context.js`
- **Referenced by:** `scripts/checkout.js`
- **Edit this file when:** changing the mock order payload or confirmation screen behavior

### `data/`

### `data/menu.json`
- **Purpose:** Stores menu categories and menu items.
- **What's inside:**
  - top-level object with `categories`
  - six category records
  - thirty-three item records
  - item fields: `id`, `name`, `subtitle`, `calories`, `priceAed`, `image`
- **Depends on:** nothing
- **Referenced by:** `scripts/menu.js`
- **Edit this file when:** adding/removing menu items or updating menu copy, calories, pricing, or image URLs

### `data/branches.json`
- **Purpose:** Stores branch records.
- **What's inside:**
  - array of five branch objects
  - fields: `index`, `name`, `region`, `district`, `address`, `hours`
- **Depends on:** nothing
- **Referenced by:** `scripts/branches.js`
- **Edit this file when:** changing branch addresses, regions, or operating hours

### `data/marquee.json`
- **Purpose:** Stores the marquee label set.
- **What's inside:**
  - array of six strings
- **Depends on:** nothing
- **Referenced by:** `scripts/marquee.js`
- **Edit this file when:** changing the marquee text sequence

### `data/contact.json`
- **Purpose:** Stores support channel data and support hours.
- **What's inside:**
  - object with `channels` and `hours`
  - four channel records
  - three support-hour records
- **Depends on:** nothing
- **Referenced by:** `scripts/support.js`
- **Edit this file when:** updating phone/email/WhatsApp data or support-hour lines

### `data/merch.json`
- **Purpose:** Stores merch card metadata and the SVG filename each card loads.
- **What's inside:**
  - array of eight merch objects
  - fields present in current repo: `id`, `name`, `priceAed`, `svg`, `revealClass`
- **Depends on:** nothing
- **Referenced by:** `scripts/merch.js`
- **Edit this file when:** changing merch names, prices, reveal staggering, or which SVG file a card uses

### `components/merch-svgs/`

### `components/merch-svgs/signature-bottle.svg`
- **Purpose:** Inlineable merch illustration for the signature bottle card.
- **What's inside:**
  - one `200x200` standalone SVG
  - bottle body, neck, cap, label, reflection
- **Depends on:** nothing
- **Referenced by:** `data/merch.json` via `scripts/merch.js`
- **Edit this file when:** changing the bottle illustration artwork

### `components/merch-svgs/gold-tote-bag.svg`
- **Purpose:** Inlineable merch illustration for the tote bag card.
- **What's inside:**
  - one standalone SVG with bag body, handles, circles, logo text, texture lines
- **Depends on:** nothing
- **Referenced by:** `data/merch.json` via `scripts/merch.js`
- **Edit this file when:** changing the tote bag illustration

### `components/merch-svgs/solea-slides.svg`
- **Purpose:** Inlineable merch illustration for the slides card.
- **What's inside:**
  - one standalone SVG with sole, strap, logo text, and shadow
- **Depends on:** nothing
- **Referenced by:** `data/merch.json` via `scripts/merch.js`
- **Edit this file when:** changing the slides illustration

### `components/merch-svgs/sun-cap.svg`
- **Purpose:** Inlineable merch illustration for the sun cap card.
- **What's inside:**
  - one standalone SVG with cap dome, brim, seams, embroidery, and shadow
- **Depends on:** nothing
- **Referenced by:** `data/merch.json` via `scripts/merch.js`
- **Edit this file when:** changing the cap illustration

### `components/merch-svgs/solea-shades.svg`
- **Purpose:** Inlineable merch illustration for the sunglasses card.
- **What's inside:**
  - one standalone SVG with lenses, arms, bridge, highlights, hinges, and engraving
- **Depends on:** nothing
- **Referenced by:** `data/merch.json` via `scripts/merch.js`
- **Edit this file when:** changing the sunglasses illustration

### `components/merch-svgs/beach-towel.svg`
- **Purpose:** Inlineable merch illustration for the beach towel card.
- **What's inside:**
  - one standalone SVG with towel body, stripes, fringe, logo, and center details
- **Depends on:** nothing
- **Referenced by:** `data/merch.json` via `scripts/merch.js`
- **Edit this file when:** changing the towel illustration

### `components/merch-svgs/candle-set.svg`
- **Purpose:** Inlineable merch illustration for the candle set card.
- **What's inside:**
  - one standalone SVG with three candle jars, flames, labels, and shadows
- **Depends on:** nothing
- **Referenced by:** `data/merch.json` via `scripts/merch.js`
- **Edit this file when:** changing the candle set illustration

### `components/merch-svgs/linen-tee.svg`
- **Purpose:** Inlineable merch illustration for the linen tee card.
- **What's inside:**
  - one standalone SVG with shirt body, sleeves, collar, texture lines, stitching, and shadow
- **Depends on:** nothing
- **Referenced by:** `data/merch.json` via `scripts/merch.js`
- **Edit this file when:** changing the t-shirt illustration

## 6. Data Schemas

### `data/menu.json`
```ts
{
  categories: Array<{
    id: string;
    name: string;
    items: Array<{
      id: string;
      name: string;
      subtitle: string | null;
      calories: number;
      priceAed: number;
      image: string;
    }>;
  }>;
}
```

### `data/branches.json`
```ts
Array<{
  index: string;
  name: string;
  slug: string;
  region: string;
  district: string;
  address: string;
  hours: string;
}>
```

### `data/marquee.json`
```ts
string[]
```

### `data/contact.json`
```ts
{
  channels: Array<{
    id: string;
    emoji: string;
    label: string;
    value: string;
    href: string;
  }>;
  hours: Array<{
    days: string;
    time: string;
  }>;
}
```

### `data/merch.json`
```ts
Array<{
  id: string;
  name: string;
  priceAed: number;
  svg: string;
  revealClass: string;
}>
```

## 7. CSS Architecture
Cascade order:
- Partials are numbered because `styles/main.css` imports them in a fixed sequence.
- Later files can override earlier ones without increasing selector complexity.
- Current order:
  1. `01-tokens.css`
  2. `02-reset.css`
  3. `03-cursor.css`
  4. `04-nav.css`
  5. `05-hero.css`
  6. `06-marquee.css`
  7. `07-menu.css`
  8. `08-branches.css`
  9. `09-merch.css`
  10. `10-support.css`
  11. `11-footer.css`
  12. `12-utilities.css`
  13. `13-animations.css`
  14. `14-responsive.css`

Where to find things:

| Change you want | File to edit |
|---|---|
| Change brand gold color | `styles/01-tokens.css` (`--gold`, related gold shades) |
| Change default body font or background | `styles/02-reset.css` |
| Change custom cursor size or border | `styles/03-cursor.css` |
| Change nav spacing or scrolled look | `styles/04-nav.css` |
| Change hero layout or CTA buttons | `styles/05-hero.css` |
| Change marquee speed or spacing | `styles/06-marquee.css` and `styles/13-animations.css` |
| Change menu accordion/item layout | `styles/07-menu.css` |
| Change branches card layout | `styles/08-branches.css` |
| Change merch hover effect | `styles/09-merch.css` |
| Change support card hover effect | `styles/10-support.css` |
| Change footer links | `styles/11-footer.css` |
| Change reveal transitions | `styles/12-utilities.css` |
| Change keyframes | `styles/13-animations.css` |
| Change responsive breakpoint behavior | `styles/14-responsive.css` |

Observed naming patterns:
- Short utility-style names: `rv`, `rl`, `rr`, `d1` to `d5`
- Short component abbreviations: `mc`, `mi`, `md`, `sb-*`, `sw-*`, `ov-*`, `ph-*`, `ic`
- Longer semantic names: `br-card`, `nav-links`, `hero-actions`, `sup-btn`, `merch-grid`

Known reveal pattern:
- Elements start with `.rv`, `.rl`, or `.rr`
- `scripts/reveal.js` adds `.in`
- `styles/12-utilities.css` defines the before/after state

## 8. JavaScript Architecture
Module pattern:
- Each feature file exports one `init...()` function.
- `scripts/main.js` is the only place that imports all modules together.

Initialization order in `main.js`:
1. `initCursor()`
2. `initNav()`
3. `await initMarquee()`
4. `await initBranches()`
5. `await initMenu()`
6. `await initMerch()`
7. `await initSupport()`
8. `initReveal()`
9. `initHeroCanvas()`

Why this order matches the current code:
- Cursor and nav only need static DOM.
- Data-driven sections render next so their DOM exists.
- Reveal attaches after runtime-rendered `.rv` elements are in the document.
- Hero canvas starts after the rest of startup work is queued.

State handling:
- No global store
- No shared app state object
- Each module keeps its own module-scoped variables and reads/writes directly against DOM state

Event handling:
- Direct `addEventListener()` calls in each module
- No framework or event delegation layer
- One inline handler remains in `index.html` on the hero “Discover” scroll hint

Magic numbers currently hard-coded:
- Cursor easing: `0.1` in `scripts/cursor.js`
- Reveal threshold: `0.08` in `scripts/reveal.js`
- Menu image swap delay: `300ms` in `scripts/menu.js`
- Hero particle count: `60` in `scripts/hero-canvas.js`
- Hero particle line distance: `130` in `scripts/hero-canvas.js`

## 9. Common Developer Tasks

### Add a new menu item
1. Open `data/menu.json`.
2. Find the target category under `categories`.
3. Add a new item object with `id`, `name`, `subtitle`, `calories`, `priceAed`, and `image`.
4. Save and reload the page over HTTP.
5. Verify the category count updates, the new row renders, and clicking it updates the preview panel.

### Change a menu item price
1. Open `data/menu.json`.
2. Find the matching item record.
3. Change `priceAed`.
4. Reload the page.
5. Verify the row price and preview price both show the new value.

### Add a new branch
1. Open `data/branches.json`.
2. Add a new branch object with `index`, `name`, `region`, `district`, `address`, and `hours`.
3. Reload the page.
4. Check the new card in the branches grid.
5. If the grid layout feels cramped, adjust `styles/08-branches.css`.

### Change the brand color palette
1. Open `styles/01-tokens.css`.
2. Change the relevant variables such as `--gold`, `--cream`, `--dark`, or `--muted`.
3. Reload the page.
4. Spot-check nav, hero, menu, merch, and support sections since they all consume these tokens.

### Update contact information
1. Open `data/contact.json`.
2. Update `channels` values and `href`s.
3. Update `hours` if needed.
4. Reload the page.
5. Verify support cards render the new content and links still open the expected target.

### Add a new merch item
1. Create a new SVG file in `components/merch-svgs/`.
2. Open `data/merch.json`.
3. Add a new object with `id`, `name`, `priceAed`, `svg`, and `revealClass`.
4. Reload the page.
5. Verify the card renders, the SVG inlines correctly, and the hover effect still targets the SVG.
6. If the grid needs room, adjust `styles/09-merch.css`.

### Change a font
1. If it is a different font family already loaded, update the relevant CSS selectors.
2. If a new Google Font is needed, update the `<link>` in `index.html`.
3. Change the selectors in `styles/02-reset.css`, `styles/05-hero.css`, `styles/08-branches.css`, `styles/09-merch.css`, `styles/10-support.css`, or `styles/11-footer.css` depending on where the font is used.
4. Reload and compare typography across the page.

### Change the marquee content
1. Open `data/marquee.json`.
2. Edit the six strings in order.
3. Reload the page.
4. Verify the strip still loops cleanly and still duplicates the content set.

### Adjust the hero headline
1. Open `index.html`.
2. Edit the `.hero-title` text.
3. Reload the page.
4. Verify line breaks and spacing still look correct.

### Add a new CSS animation
1. Open `styles/13-animations.css`.
2. Add a new `@keyframes` block.
3. Apply it from the relevant partial, such as `05-hero.css` or `10-support.css`.
4. Reload the page.
5. Verify the animated selector still behaves as expected at desktop and at the `1024px` breakpoint.

### Fix a hover effect
1. Identify which section owns the hover state.
2. Open the corresponding CSS partial:
   - nav: `04-nav.css`
   - menu: `07-menu.css`
   - branches: `08-branches.css`
   - merch: `09-merch.css`
   - support: `10-support.css`
   - footer: `11-footer.css`
3. Adjust the hover selectors there.
4. Reload the page and compare normal and hover states.

## 10. Conventions & Gotchas
- ES modules and `fetch()` require HTTP. `file://` will not work.
- `styles/main.css` import order is the cascade order. Reordering imports changes behavior.
- `initReveal()` runs after async section renders. If you add a new runtime-rendered section that uses `.rv`, initialize it before `initReveal()`.
- Merch SVGs are fetched and inlined as DOM, not shown through `<img>`, because merch hover CSS targets the nested `svg`.
- The custom cursor hides the native cursor globally with `body { cursor: none; }`.
- There are no ARIA attributes, keyboard handlers, or `prefers-reduced-motion` rules in the current codebase.
- There is no build step. The files you edit are the files the browser runs.
- Two Unsplash URLs are reused in `data/menu.json`:
  - `photo-1488900128323-21503983a07e` for `Strawberry Greek Yogurt Ice Cream` and `Frozen Yogurt Bites`
  - `photo-1490474418585-ba9bad8fd0ea` for `Fruit Skewers` and `Pineapple Coconut Dessert`
- `index.html` keeps one inline handler intentionally:

```html
<div class="scroll-hint" onclick="document.getElementById('menu').scrollIntoView({behavior:'smooth'})">
```

## 11. Version History
- `split-v1.0.0` — initial split from the original single-file mockup into a multi-file structure with CSS partials, JS modules, JSON content files, extracted merch SVG files, runtime rendering, README quick-start, and this deeper reference guide.

## 12. Next Steps / Roadmap
No roadmap items captured in code. Future direction is tracked separately.

## 13. Order Flow Addendum
Order entry:
- Primary order entry pattern: `order.html?branch={slug}&table={n}`
- Example: `order.html?branch=yas-bay&table=7`
- Invalid or missing `branch` / `table` params show the guard state instead of the menu

Order runtime:
1. `order.html` loads `scripts/order-main.js`
2. `order-main.js` validates `branch` and `table` through `scripts/branch-context.js`
3. `order-main.js` fetches `data/menu.json` once, then initializes:
   - `initOrderMenu(menuData)`
   - `initCart(...)`
   - `initOrderPreview(menuData)`
   - `initCartUI()`
4. `order-cart-ui.js` links to `checkout.html` with the same `branch` / `table` query params
5. `checkout.js` reads the same context, renders the summary, and runs the selected mock payment path
6. `order-submit.js` logs the payload and swaps in the confirmation screen

Cart persistence:
- localStorage key format: `solea_cart_{branch}_{table}`
- Example: `solea_cart_yas-bay_7`
- Cart expires after 2 hours
- Cross-tab updates are synchronized through the browser `storage` event

Payment note:
- `payment-stub.js` is intentionally a mock backend contract
- Card and Apple Pay are simulated only
- Real Stripe/Telr integration is a separate future project
