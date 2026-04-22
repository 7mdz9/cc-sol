# Soléa Backend Handoff

This project is ready for backend integration. The frontend is already split into clear flows and is currently using local browser state and mocked services where a backend should take over.

## Scope

Frontend surfaces already built:

- `index.html` marketing site
- `order.html` QR-gated ordering flow
- `checkout.html` payment-selection and order-confirmation flow
- `admin-login.html` fake local login
- `admin.html` analytics dashboard

## Replace These Frontend-Only Pieces

### 1. Branch + Table Validation

Current frontend source:
- `scripts/branch-context.js`
- `data/branches.json`

Current behavior:
- validates `?branch={slug}&table={n}` in the browser
- table is accepted if it is an integer `1–999`

Backend target:
- validate branch slug against backend branch records
- validate table against real branch/table inventory if needed

Suggested endpoint:

```http
GET /api/branches/{branchSlug}/tables/{tableNumber}
```

Suggested response:

```json
{
  "valid": true,
  "branch": {
    "slug": "yas-bay",
    "name": "Yas Bay"
  },
  "table": 7
}
```

### 2. Cart Persistence

Current frontend source:
- `scripts/cart.js`

Current behavior:
- cart stored in `localStorage`
- key format: `solea_cart_{branch}_{table}`
- 2-hour expiry
- cross-tab sync through `storage`

Backend target:
- optional session/cart API if persistent carts are needed
- otherwise frontend cart can remain local until checkout submission

Suggested endpoint if server-backed carts are desired:

```http
GET    /api/cart?branch=yas-bay&table=7
PUT    /api/cart
DELETE /api/cart?branch=yas-bay&table=7
```

### 3. Payment Processing

Current frontend source:
- `scripts/payment-stub.js`
- `scripts/checkout.js`

Current behavior:
- card and Apple Pay are mocked
- cash skips payment and continues directly

Backend target:
- replace `mockCreatePayment()` with real payment intent/session creation
- frontend expects async success/failure and a returned payment object

Current frontend payment object shape:

```ts
{
  paymentId: string;
  method: string;
  amount: number;
  currency: string;
  paidAt: string;
}
```

Suggested endpoints:

```http
POST /api/payments/card
POST /api/payments/apple-pay
```

Suggested success response:

```json
{
  "success": true,
  "paymentId": "pay_123",
  "method": "card",
  "amount": 126,
  "currency": "AED",
  "paidAt": "2026-04-22T10:15:00.000Z"
}
```

Cash flow:
- no external processor required
- backend should still mark payment mode as `cash`

### 4. Order Submission

Current frontend source:
- `scripts/order-submit.js`

Current behavior:
- builds order payload
- logs it to console
- stores it in `localStorage["solea_orders"]`
- shows confirmation UI

This is the main backend contract.

Current order payload shape:

```ts
type Order = {
  orderNumber: string;
  branch: string;
  branchName: string;
  table: number;
  customer: { name: string; phone: string };
  items: Array<{
    id: string;
    name: string;
    category: string;
    priceAed: number;
    quantity: number;
  }>;
  subtotal: number;
  paymentMethod: "card" | "apple-pay" | "cash";
  payment: null | {
    paymentId: string;
    method: string;
    amount: number;
    currency: string;
    paidAt: string;
  };
  submittedAt: string;
};
```

Suggested endpoint:

```http
POST /api/orders
```

Suggested request body:
- exactly the shape above, minus optional backend-generated values if you prefer to generate `orderNumber` server-side

Suggested response:

```json
{
  "success": true,
  "orderNumber": "SLA-123456",
  "submittedAt": "2026-04-22T10:16:00.000Z"
}
```

### 5. Admin Authentication

Current frontend source:
- `scripts/admin-config.js`
- `scripts/admin-auth.js`

Current behavior:
- hardcoded credentials in frontend
- session flag stored in `localStorage["solea_admin_session"]`

Backend target:
- replace with real login/session/token flow

Suggested endpoints:

```http
POST /api/admin/login
POST /api/admin/logout
GET  /api/admin/session
```

### 6. Admin Dashboard Data

Current frontend source:
- `scripts/admin-data.js`
- all admin analytics modules

Current behavior:
- dashboard reads `localStorage["solea_orders"]`
- live updates via browser `storage` event

Backend target:
- replace localStorage reads with backend analytics/order endpoints

Suggested endpoints:

```http
GET /api/admin/orders
GET /api/admin/orders/{orderNumber}
GET /api/admin/analytics/overview
GET /api/admin/analytics/sales
GET /api/admin/analytics/products
GET /api/admin/analytics/payments
GET /api/admin/analytics/branches
GET /api/admin/export/orders
GET /api/admin/export/revenue
GET /api/admin/export/branches
```

Current frontend filters expected globally:

```ts
{
  from: Date | null;
  to: Date | null;
  branch: string | null;
  paymentMethod: "card" | "apple-pay" | "cash" | null;
}
```

Equivalent query params:

```http
?from=2026-04-01&to=2026-04-22&branch=yas-bay&paymentMethod=card
```

## Frontend Files the Backend Developer Should Read First

- `README.md`
- `PROJECT_GUIDE.md`
- `scripts/branch-context.js`
- `scripts/cart.js`
- `scripts/checkout.js`
- `scripts/payment-stub.js`
- `scripts/order-submit.js`
- `scripts/admin-data.js`
- `scripts/admin-filters.js`

## Integration Priority

Recommended backend implementation order:

1. `POST /api/orders`
2. real payment endpoints
3. real admin login/session
4. admin order feed endpoint
5. admin aggregated analytics endpoints
6. export endpoints

## Deployment Note

As it stands, this repo is suitable for:
- frontend demo deployment
- backend handoff
- API integration work

It is not yet a production system until:
- fake auth is removed
- mocked payments are replaced
- localStorage order persistence is replaced
- admin analytics come from the backend instead of browser-local state
