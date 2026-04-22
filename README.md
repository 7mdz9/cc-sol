# Soléa — Frontend Mockup

A premium UAE juice & dessert brand marketing site. Single-page, plain HTML/CSS/JS, no build step.

This repository is now organized as a clean frontend handoff package for backend integration:

- marketing site
- QR-gated dine-in ordering flow
- checkout flow
- local-demo admin dashboard
- documented frontend-to-backend handoff contract

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

Recommended handoff reading order:

1. `README.md`
2. `PROJECT_GUIDE.md`
3. `BACKEND_HANDOFF.md`

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

## Admin Dashboard

The repo also includes a local-only admin dashboard for reviewing real completed table orders from the same browser profile.

- Entry flow: `http://localhost:8000/admin-login.html` -> `http://localhost:8000/admin.html`
- Auth is fake local-demo auth only, with hardcoded credentials in `scripts/admin-config.js`
- Dashboard data comes from `localStorage["solea_orders"]`
- Cross-tab sync is live via the browser `storage` event
- Charting uses Chart.js via CDN on `admin.html` only

Admin demo credentials:

- Email: `admin@solea.ae`
- Password: `solea2026`

Local admin-flow test:

1. Open `order.html?branch=yas-bay&table=7` in one tab
2. Complete one or more orders with any mocked payment path
3. Open `admin-login.html` in another tab and sign in
4. Confirm Overview, Orders, Sales, Products, Payments, Branches, and Export all reflect the same real local order data
5. Change filters in the admin header and verify all sections update together

Important notes:

- This is local-only demo infrastructure, not production auth or production analytics
- Orders and sessions are browser-local, so admin and order tabs must be opened in the same browser profile
- Real backend storage, real auth, and real payment providers are separate future work

## Backend Handoff

The repo includes a dedicated backend handoff note:

- [BACKEND_HANDOFF.md](/Users/mohamed.alteneiji/Proj/BACKEND_HANDOFF.md)

It maps each mocked or browser-local behavior to the backend/API work needed next, including:

- branch/table validation
- cart persistence strategy
- payment endpoints
- order submission contract
- admin auth replacement
- admin analytics endpoints

## Folder structure

- **`index.html`** — HTML shell. Section scaffolds only; content is rendered from JSON at runtime.
- **`public/assets/`** — static binary assets (logo.png, etc.). Add images here.
- **`styles/`** — CSS split into shared numbered partials plus flow-specific partials. Shared marketing and base files run through `14-responsive.css`, the order flow uses `15-order-page.css` and `16-checkout.css`, and the admin dashboard uses `17-admin-base.css`, `18-admin-components.css`, and `19-admin-charts.css`.
- **`scripts/`** — JS split into feature modules (`cursor.js`, `nav.js`, `menu.js`, etc.), the order-flow modules (`order-main.js`, `order-menu.js`, `order-preview.js`, `cart.js`, `order-cart-ui.js`, `checkout.js`, `payment-stub.js`, `order-submit.js`, `branch-context.js`), and the admin modules (`admin-config.js`, `admin-auth.js`, `admin-data.js`, `admin-filters.js`, `admin-overview.js`, `admin-orders.js`, `admin-sales.js`, `admin-products.js`, `admin-payments.js`, `admin-branches.js`, `admin-export.js`, `admin-main.js`).
- **`data/`** — site content as JSON. Edit menu items in `menu.json`, branch details in `branches.json`, merch pricing in `merch.json`, contact info in `contact.json`, marquee strip in `marquee.json`.
- **`BACKEND_HANDOFF.md`** — backend integration note mapping local/mock frontend behavior to real API responsibilities.
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
