import { readBranchContext, validateBranch, validateTable } from "./branch-context.js";
import { initCursor } from "./cursor.js";
import { initCart, getCart, getSubtotal } from "./cart.js";
import { mockCreatePayment } from "./payment-stub.js";
import { submitOrder } from "./order-submit.js";

let selectedMethod = null;
let isProcessing = false;
const cardDraft = {
  name: "",
  phone: ""
};

document.addEventListener("DOMContentLoaded", async () => {
  initCursor();
  selectedMethod = null;
  isProcessing = false;

  const { branch, table } = readBranchContext();
  const branchData = await validateBranch(branch);
  const tableNum = validateTable(table);

  const guard = document.getElementById("checkoutGuard");
  const app = document.getElementById("checkoutApp");
  const guardMessage = document.getElementById("checkoutGuardMessage");
  const context = document.getElementById("checkoutContext");
  const contextPill = document.getElementById("checkoutContextPill");
  const backToOrder = document.getElementById("checkoutBackToOrder");

  if (!branchData || !tableNum) {
    guardMessage.textContent = "This checkout page is only available through an active in-store order.";
    guard.hidden = false;
    return;
  }

  initCart({ branch, table });
  context.textContent = `${branchData.name} · Table ${tableNum}`;
  if (contextPill) contextPill.textContent = `${branchData.name} · Table ${tableNum}`;
  backToOrder.href = `./order.html?branch=${branch}&table=${tableNum}`;

  const cart = getCart();
  if (cart.length === 0) {
    guardMessage.textContent = "Your cart is currently empty. Please add items before continuing to checkout.";
    guard.hidden = false;
    const guardInner = guard.querySelector(".checkout-guard-inner");
    guardInner.querySelector(".checkout-back-link").href = backToOrder.href;
    guardInner.querySelector(".checkout-back-link").textContent = "Return to Order";
    return;
  }

  app.hidden = false;
  initCheckoutPage();
});

function initCheckoutPage() {
  const paymentTiles = document.querySelector(".payment-tiles");
  const methodPanel = document.getElementById("checkoutMethodPanel");

  renderSummary();
  renderMethodPanel();

  document.querySelectorAll(".payment-tile").forEach(tile => {
    tile.addEventListener("click", () => {
      selectedMethod = tile.dataset.method;

      document.querySelectorAll(".payment-tile").forEach(t => {
        t.classList.toggle("selected", t === tile);
      });

      if (paymentTiles) paymentTiles.classList.add("has-selection");
      renderMethodPanel();
    });
  });

  methodPanel?.addEventListener("input", event => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;

    if (target.id === "customerName") {
      cardDraft.name = target.value;
    }

    if (target.id === "customerPhone") {
      cardDraft.phone = target.value;
    }

    updateMethodButtonState();
  });

  methodPanel?.addEventListener("click", async event => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const actionButton = target.closest("[data-payment-action]");
    if (!(actionButton instanceof HTMLButtonElement)) return;
    if (!selectedMethod || isProcessing) return;

    if (selectedMethod === "card" && !isCardDetailsValid()) {
      updateMethodButtonState();
      return;
    }

    isProcessing = true;
    updateMethodButtonState();

    try {
      let payment = null;

      if (selectedMethod !== "cash") {
        payment = await mockCreatePayment({
          method: selectedMethod,
          amount: getSubtotal(),
          currency: "AED",
          metadata: customerPayloadForMethod(selectedMethod)
        });
      }

      await submitOrder({
        customer: customerPayloadForMethod(selectedMethod),
        paymentMethod: selectedMethod,
        payment
      });
    } catch (err) {
      isProcessing = false;
      updateMethodButtonState();
      alert(err.message);
    }
  });
}

function renderSummary() {
  const el = document.getElementById("checkoutSummary");
  const totalPill = document.getElementById("checkoutSummaryTotalPill");
  const cart = getCart();
  const subtotal = getSubtotal();

  if (totalPill) {
    totalPill.textContent = `${subtotal} AED`;
  }

  el.innerHTML = `
    <ul class="summary-lines">
      ${cart.map(line => `
        <li>
          <div class="summary-line-copy">
            <strong>${line.name}</strong>
            <span>${line.quantity} ${line.quantity === 1 ? "item" : "items"}</span>
          </div>
          <span>${line.priceAed * line.quantity} AED</span>
        </li>
      `).join("")}
    </ul>
    <div class="summary-total">
      <span>Total</span>
      <strong>${subtotal} AED</strong>
    </div>
  `;
}

function renderMethodPanel() {
  const panel = document.getElementById("checkoutMethodPanel");
  if (!panel) return;

  if (!selectedMethod) {
    panel.hidden = true;
    panel.innerHTML = "";
    return;
  }

  panel.hidden = false;

  if (selectedMethod === "card") {
    panel.innerHTML = `
      <div class="method-panel method-panel-card">
        <div class="method-panel-head">
          <span class="method-panel-kicker">Card Checkout</span>
          <h3>Enter your details and pay</h3>
          <p>Everything happens in one refined step for this demo flow.</p>
        </div>
        <div class="checkout-form-grid method-panel-grid">
          <label class="checkout-label">
            <span>Your Name</span>
            <input type="text" id="customerName" maxlength="50" value="${escapeAttribute(cardDraft.name)}" autocomplete="name">
          </label>
          <label class="checkout-label">
            <span>Phone Number</span>
            <input type="tel" id="customerPhone" placeholder="+971 50 123 4567" value="${escapeAttribute(cardDraft.phone)}" autocomplete="tel">
          </label>
        </div>
        <div class="method-panel-note">
          <span class="method-note-dot"></span>
          <p>A secure mock authorization will be simulated before your order is confirmed.</p>
        </div>
        <button class="btn-pay" type="button" data-payment-action="card">Pay with Card</button>
      </div>
    `;
  } else if (selectedMethod === "apple-pay") {
    panel.innerHTML = `
      <div class="method-panel method-panel-inline method-panel-apple">
        <div class="method-panel-head">
          <span class="method-panel-kicker">Apple Pay</span>
          <h3>Fastest way to complete your table order</h3>
          <p>For this demo, Apple Pay remains available on every browser so the flow stays easy to test.</p>
        </div>
        <div class="method-inline-actions">
          <div class="method-panel-note">
            <span class="method-note-dot"></span>
            <p>Your mock Apple Pay authorization will appear instantly after confirmation.</p>
          </div>
          <button class="btn-pay" type="button" data-payment-action="apple-pay">Pay with Apple Pay</button>
        </div>
      </div>
    `;
  } else {
    panel.innerHTML = `
      <div class="method-panel method-panel-inline method-panel-cash">
        <div class="method-panel-head">
          <span class="method-panel-kicker">Cash at Table</span>
          <h3>Confirm your order and pay when served</h3>
          <p>Your order will go straight to the team, and payment will be collected at your table.</p>
        </div>
        <div class="method-inline-actions">
          <div class="method-panel-note">
            <span class="method-note-dot"></span>
            <p>No extra details needed for this demo. One tap is enough.</p>
          </div>
          <button class="btn-pay" type="button" data-payment-action="cash">Confirm Cash Order</button>
        </div>
      </div>
    `;
  }

  updateMethodButtonState();
}

function updateMethodButtonState() {
  const actionButton = document.querySelector("#checkoutMethodPanel [data-payment-action]");
  if (!(actionButton instanceof HTMLButtonElement) || !selectedMethod) return;

  const isCard = selectedMethod === "card";
  const canSubmit = isCard ? isCardDetailsValid() : true;

  actionButton.disabled = isProcessing || !canSubmit;
  actionButton.textContent = isProcessing ? "Processing…" : methodLabel(selectedMethod);
}

function isCardDetailsValid() {
  return cardDraft.name.trim().length > 0 && cardDraft.phone.replace(/\D/g, "").length >= 7;
}

function customerPayloadForMethod(method) {
  if (method === "card") {
    return {
      name: cardDraft.name.trim(),
      phone: cardDraft.phone.trim()
    };
  }

  return {
    name: "Guest",
    phone: ""
  };
}

function methodLabel(method) {
  return method === "cash"
    ? "Confirm Cash Order"
    : method === "apple-pay"
      ? "Pay with Apple Pay"
      : "Pay with Card";
}

function escapeAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
