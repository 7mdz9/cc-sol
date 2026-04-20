# Soléa — Frontend Mockup

A premium UAE juice & dessert brand marketing site. Single-page, plain HTML/CSS/JS, no build step.

## Running locally

ES modules require HTTP, so open via a static server, not file://:

```
python3 -m http.server 8000
```

or

```
npx serve .
```

Then open http://localhost:8000.

## Folder structure

- **`index.html`** — HTML shell. Section scaffolds only; content is rendered from JSON at runtime.
- **`public/assets/`** — static binary assets (logo.png, etc.). Add images here.
- **`styles/`** — CSS split into 14 numbered partials by concern + `main.css` that imports them in cascade order. To change a color token, edit `01-tokens.css`. To adjust menu styling, edit `07-menu.css`. To add a breakpoint, edit `14-responsive.css`.
- **`scripts/`** — JS split into feature modules (`cursor.js`, `nav.js`, `menu.js`, etc.) plus `main.js` that imports them. Each module exports an `init…()` function.
- **`data/`** — site content as JSON. Edit menu items in `menu.json`, branch details in `branches.json`, merch pricing in `merch.json`, contact info in `contact.json`, marquee strip in `marquee.json`.
- **`components/merch-svgs/`** — 8 standalone SVG product illustrations, one per merch card. Loaded by `scripts/merch.js` at runtime.

## Editing content

- **Menu:** edit `data/menu.json`. Item shape: `{ id, name, subtitle, calories, priceAed, image }`.
- **Branches:** edit `data/branches.json`. 5 entries max (or adjust CSS grid in `08-branches.css`).
- **Merch:** edit `data/merch.json` + drop the new SVG in `components/merch-svgs/`.
- **Contact:** edit `data/contact.json` channels and hours.
- **Marquee:** edit `data/marquee.json`.

## Editing visuals

All color and typography tokens live in `styles/01-tokens.css`. Change `--gold`, `--cream`, etc. to rebrand.

## Conventions

- CSS partials are numbered by cascade order. Do not renumber without updating `main.css` imports.
- JS modules each own one concern and export one `init…()` function called by `main.js`.
- JSON files have no comments (standard JSON). Document shape changes here in the README.
