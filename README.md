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

## Order Flow

The repo now also includes a QR-gated table-ordering flow.

- Valid entry pattern: `http://localhost:8000/order.html?branch={slug}&table={n}`
- Example happy-path URL: `http://localhost:8000/order.html?branch=yas-bay&table=7`
- Invalid or missing `branch` / `table` params show a friendly guard instead of the order UI
- Checkout lives on a separate `checkout.html` page and keeps the same `branch` / `table` context
- Payment methods in this project are mocked: `Card`, `Apple Pay`, and `Cash`
- Cart persistence is stored in localStorage as `solea_cart_{branch}_{table}` with a 2-hour expiry

Local order-flow test:

1. Open `order.html?branch=yas-bay&table=7`
2. Browse categories and add items to cart
3. Use `Proceed to Checkout`
4. Test `Card`, `Apple Pay`, and `Cash`
5. Confirm the order and verify the confirmation screen appears

Useful URLs:

- Valid order: `http://localhost:8000/order.html?branch=yas-bay&table=7`
- Invalid branch: `http://localhost:8000/order.html?branch=fake&table=1`
- Missing params: `http://localhost:8000/order.html`

## Folder structure

- **`index.html`** — HTML shell. Section scaffolds only; content is rendered from JSON at runtime.
- **`public/assets/`** — static binary assets (logo.png, etc.). Add images here.
- **`styles/`** — CSS split into 14 numbered partials by concern + `main.css` that imports them in cascade order. To change a color token, edit `01-tokens.css`. To adjust menu styling, edit `07-menu.css`. To add a breakpoint, edit `14-responsive.css`.
- **`scripts/`** — JS split into feature modules (`cursor.js`, `nav.js`, `menu.js`, etc.) plus `main.js` and the order-flow modules (`order-main.js`, `order-menu.js`, `order-preview.js`, `cart.js`, `order-cart-ui.js`, `checkout.js`, `payment-stub.js`, `order-submit.js`, `branch-context.js`).
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
