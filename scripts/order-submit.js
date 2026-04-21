import { readBranchContext } from "./branch-context.js";
import { getCart, getSubtotal, clearCart } from "./cart.js";
import { ORDERS_STORAGE_KEY } from "./admin-config.js";

export async function submitOrder({ customer, paymentMethod, payment }) {
  const { branch, table } = readBranchContext();
  const orderNumber = `SLA-${Date.now().toString().slice(-6)}`;
  const [branchName, categoryByItemId] = await Promise.all([
    lookupBranchName(branch),
    buildCategoryMap()
  ]);

  const orderPayload = {
    orderNumber,
    branch,
    branchName,
    table: parseInt(table, 10),
    customer,
    items: getCart().map(line => ({
      id: line.id,
      name: line.name,
      category: categoryByItemId[line.id] || "Unknown",
      priceAed: line.priceAed,
      quantity: line.quantity
    })),
    subtotal: getSubtotal(),
    paymentMethod,
    payment,
    submittedAt: new Date().toISOString()
  };

  console.log("ORDER SUBMITTED:", orderPayload);
  await persistOrder(orderPayload);
  await sleep(500);

  clearCart();
  showConfirmation(orderNumber, orderPayload);

  return { orderNumber, orderPayload };
}

async function buildCategoryMap() {
  const menu = await fetch("./data/menu.json").then(response => response.json());
  const categoryByItemId = {};

  menu.categories.forEach(category => {
    category.items.forEach(item => {
      categoryByItemId[item.id] = category.name;
    });
  });

  return categoryByItemId;
}

async function lookupBranchName(branchSlug) {
  const branches = await fetch("./data/branches.json").then(response => response.json());
  const branch = branches.find(entry => entry.slug === branchSlug);
  return branch?.name || branchSlug;
}

async function persistOrder(order) {
  let orders = readStoredOrders();

  try {
    orders.push(order);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    if (!isQuotaExceeded(error)) {
      throw error;
    }

    orders = orders.slice(50);
    orders.push(order);

    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (retryError) {
      console.warn("Unable to persist order history to localStorage.", retryError);
    }
  }
}

function readStoredOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function isQuotaExceeded(error) {
  return error instanceof DOMException && (
    error.name === "QuotaExceededError" ||
    error.name === "NS_ERROR_DOM_QUOTA_REACHED"
  );
}

function showConfirmation(orderNumber, payload) {
  const app = document.getElementById("checkoutApp");
  if (!app) return;
  const greeting = payload.customer.name && payload.customer.name !== "Guest"
    ? `Thank you, ${escapeHtml(payload.customer.name)}`
    : "Order confirmed";

  app.innerHTML = `
    <div class="checkout-confirmation-shell">
      <section class="confirmation-card">
        <div class="conf-glyph">✦</div>
        <p class="confirmation-eyebrow">Order Confirmed</p>
        <h2>${greeting}</h2>
        <p class="conf-number">Order #${orderNumber}</p>
        <p class="conf-msg">Your order has been sent to the kitchen and service team.</p>
        <p class="conf-sub">Please keep this screen available if a server asks to verify your table order.</p>
        <ul class="conf-summary">
          ${payload.items.map(item => `
            <li>
              <span>${escapeHtml(item.name)} × ${item.quantity}</span>
              <strong>${item.priceAed * item.quantity} AED</strong>
            </li>
          `).join("")}
        </ul>
        <p class="conf-total"><strong>${payload.subtotal} AED</strong> · ${paymentLabel(payload.paymentMethod)}</p>
        <button class="btn-pay confirmation-btn" onclick="window.location.href='./order.html?branch=${encodeURIComponent(payload.branch)}&table=${payload.table}'">New Order</button>
      </section>
    </div>
  `;
}

function paymentLabel(method) {
  return method === "cash"
    ? "To be paid at table"
    : method === "apple-pay"
      ? "Paid via Apple Pay"
      : "Paid via Card";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
