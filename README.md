# Soléa Landing Page

Pre-launch marketing site for Soléa, built as a plain HTML/CSS/JS static site with no build step.

## Running locally

Serve the repo over HTTP so ES modules and JSON fetches work correctly:

```bash
python3 -m http.server 8000
```

or

```bash
npx serve .
```

Then open `http://localhost:8000`.

## Project scope

This repo now contains only the Soléa landing page:

- `index.html` — marketing homepage shell
- `styles/` — shared landing-page CSS partials
- `scripts/` — landing-page JavaScript modules
- `data/` — JSON content for menu, branches, merch, support, and marquee
- `public/assets/` — logo and image assets
- `components/merch-svgs/` — merch artwork loaded at runtime

## Content editing

- `data/menu.json` — menu categories and items
- `data/branches.json` — branch cards and hours
- `data/merch.json` — merch cards and SVG filenames
- `data/contact.json` — support channels and hours
- `data/marquee.json` — marquee labels

## Visual editing

- `styles/01-tokens.css` — color, spacing, and typography tokens
- `styles/main.css` — import order for the landing-page CSS stack
- `public/assets/` — Soléa logo assets and favicon-adjacent imagery

## Conventions

- CSS partials are numbered in cascade order; keep `styles/main.css` aligned with the files that actually exist.
- `scripts/main.js` is the landing-page entry point and initializes each homepage feature module.
- JSON files are plain JSON with no comments.
