import { readBranchContext } from "./branch-context.js";
import { getCart, getSubtotal, clearCart } from "./cart.js";

export async function submitOrder({ customer, paymentMethod, payment }) {
  const { branch, table } = readBranchContext();
  const orderPayload = {
    branch,
    table: parseInt(table, 10),
    customer,
    items: getCart().map(line => ({
      id: line.id,
      name: line.name,
      priceAed: line.priceAed,
      quantity: line.quantity
    })),
    subtotal: getSubtotal(),
    paymentMethod,
    payment,
    submittedAt: new Date().toISOString()
  };

  console.log("ORDER SUBMITTED:", orderPayload);
  await sleep(500);

  const orderNumber = `SLA-${Date.now().toString().slice(-6)}`;
  clearCart();
  showConfirmation(orderNumber, orderPayload);

  return { orderNumber, orderPayload };
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
