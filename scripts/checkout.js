import { readBranchContext, validateBranch, validateTable } from "./branch-context.js";
import { initCursor } from "./cursor.js";
import { initNav } from "./nav.js";
import { consumeCartNotice, initCart, getCart, getSubtotal, onChange } from "./cart.js";
import { mockCreatePayment } from "./payment-stub.js";
import { submitOrder } from "./order-submit.js";

let selectedMethod = null;
let isProcessing = false;
let suppressEmptyCartGuard = false;
const cardDraft = {
  cardholderName: "",
  cardNumber: "",
  expiryDate: "",
  cvv: ""
};

document.addEventListener("DOMContentLoaded", async () => {
  initCursor();
  initNav();
  selectedMethod = null;
  isProcessing = false;
  suppressEmptyCartGuard = false;

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

  const cartNotice = consumeCartNotice();
  const cart = getCart();
  if (cart.length === 0) {
    showCheckoutGuard(cartNotice || "Your cart is currently empty. Please add items before continuing to checkout.", backToOrder.href);
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
  clearError();

  onChange(() => {
    const cart = getCart();
    if (cart.length === 0) {
      if (suppressEmptyCartGuard) return;
      showCheckoutGuard("Your cart is empty. Return to the menu to start fresh.", document.getElementById("checkoutBackToOrder")?.href || "./order.html");
      return;
    }
    renderSummary();
  });

  document.querySelectorAll(".payment-tile").forEach(tile => {
    tile.addEventListener("click", () => {
      selectedMethod = tile.dataset.method;
      clearError();

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

    if (target.id === "cardholderName") {
      cardDraft.cardholderName = target.value;
    }

    if (target.id === "cardNumber") {
      const digits = target.value.replace(/\D/g, "").slice(0, 16);
      cardDraft.cardNumber = digits;
      target.value = formatCardNumber(digits);
    }

    if (target.id === "cardExpiry") {
      const digits = target.value.replace(/\D/g, "").slice(0, 4);
      cardDraft.expiryDate = digits;
      target.value = formatExpiry(digits);
    }

    if (target.id === "cardCvv") {
      const digits = target.value.replace(/\D/g, "").slice(0, 4);
      cardDraft.cvv = digits;
      target.value = digits;
    }

    clearError();
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
    suppressEmptyCartGuard = true;
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
      suppressEmptyCartGuard = false;
      updateMethodButtonState();
      showError(err.message);
    }
  });
}

function renderSummary() {
  const el = document.getElementById("checkoutSummary");
  const totalPill = document.getElementById("checkoutSummaryTotalPill");
  const cart = getCart();
  const subtotal = getSubtotal();

  if (totalPill) {
    totalPill.innerHTML = `<span class="checkout-summary-total-pill-num">${subtotal}</span><span class="checkout-summary-total-pill-unit">AED</span>`;
  }

  el.innerHTML = `
    <ul class="summary-lines">
      ${cart.map(line => `
        <li>
          <div class="summary-line-copy">
            <strong>${line.name}</strong>
            <span><span class="checkout-summary-count-num">${line.quantity}</span> <span class="checkout-summary-count-unit">${line.quantity === 1 ? "item" : "items"}</span></span>
          </div>
          <span class="checkout-summary-line-price"><span class="checkout-summary-line-price-num">${line.priceAed * line.quantity}</span><span class="checkout-summary-line-price-unit">AED</span></span>
        </li>
      `).join("")}
    </ul>
    <div class="summary-total">
      <span>Total</span>
      <strong><span class="checkout-summary-total-num">${subtotal}</span><span class="checkout-summary-total-unit">AED</span></strong>
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
            <span>Cardholder Name</span>
            <input type="text" id="cardholderName" maxlength="60" value="${escapeAttribute(cardDraft.cardholderName)}" autocomplete="cc-name">
          </label>
          <label class="checkout-label">
            <span>Card Number</span>
            <input type="text" id="cardNumber" inputmode="numeric" placeholder="1234 5678 9012 3456" value="${escapeAttribute(formatCardNumber(cardDraft.cardNumber))}" autocomplete="cc-number">
          </label>
          <label class="checkout-label checkout-label-half">
            <span>Expiry Date</span>
            <input type="text" id="cardExpiry" inputmode="numeric" placeholder="MM/YY" value="${escapeAttribute(formatExpiry(cardDraft.expiryDate))}" autocomplete="cc-exp">
          </label>
          <label class="checkout-label checkout-label-half">
            <span>CVV</span>
            <input type="password" id="cardCvv" inputmode="numeric" placeholder="123" value="${escapeAttribute(cardDraft.cvv)}" autocomplete="cc-csc">
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
  const expiryOk = isExpiryValid(cardDraft.expiryDate);
  return (
    cardDraft.cardholderName.trim().length > 1 &&
    cardDraft.cardNumber.length >= 14 &&
    expiryOk &&
    cardDraft.cvv.length >= 3
  );
}

function customerPayloadForMethod(method) {
  if (method === "card") {
    return {
      name: cardDraft.cardholderName.trim(),
      phone: ""
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

function showError(message) {
  const error = document.getElementById("checkoutError");
  if (!error) return;

  error.textContent = message;
  error.hidden = false;
}

function clearError() {
  const error = document.getElementById("checkoutError");
  if (!error) return;

  error.hidden = true;
  error.textContent = "";
}

function showCheckoutGuard(message, backHref) {
  const guard = document.getElementById("checkoutGuard");
  const app = document.getElementById("checkoutApp");
  const guardMessage = document.getElementById("checkoutGuardMessage");
  const guardInner = guard?.querySelector(".checkout-guard-inner");
  const backLink = guardInner?.querySelector(".checkout-back-link");

  if (guardMessage) {
    guardMessage.textContent = message;
  }

  if (backLink) {
    backLink.href = backHref || "./order.html";
    backLink.textContent = "Return to Order";
  }

  if (app) {
    app.hidden = true;
  }

  if (guard) {
    guard.hidden = false;
  }
}

function escapeAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function formatCardNumber(value) {
  return String(value)
    .replace(/\D/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value) {
  const digits = String(value).replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function isExpiryValid(value) {
  const digits = String(value).replace(/\D/g, "");
  if (digits.length !== 4) return false;

  const month = Number.parseInt(digits.slice(0, 2), 10);
  const year = Number.parseInt(digits.slice(2), 10);

  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;

  return true;
}
