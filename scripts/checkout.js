import { readBranchContext, validateBranch, validateTable } from "./branch-context.js";
import { initCursor } from "./cursor.js";
import { initCart, getCart, getSubtotal } from "./cart.js";
import { mockCreatePayment } from "./payment-stub.js";
import { submitOrder } from "./order-submit.js";

let selectedMethod = null;

document.addEventListener("DOMContentLoaded", async () => {
  initCursor();
  selectedMethod = null;

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
  const payBtn = document.getElementById("btnPay");
  const nameInput = document.getElementById("customerName");
  const phoneInput = document.getElementById("customerPhone");
  const appleTile = document.querySelector('.payment-tile[data-method="apple-pay"]');

  renderSummary();
  syncApplePayAvailability();
  updatePayState();

  [nameInput, phoneInput].forEach(input => {
    input.addEventListener("input", updatePayState);
  });

  document.querySelectorAll(".payment-tile").forEach(tile => {
    tile.addEventListener("click", () => {
      document.querySelectorAll(".payment-tile").forEach(t => t.classList.remove("selected"));
      tile.classList.add("selected");
      selectedMethod = tile.dataset.method;
      updatePayState();
    });
  });

  payBtn.addEventListener("click", async () => {
    if (!selectedMethod) return;

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const phoneDigits = phone.replace(/\D/g, "");
    if (!name || phoneDigits.length < 7) return;

    payBtn.disabled = true;
    payBtn.textContent = "Processing…";

    try {
      let payment = null;

      if (selectedMethod !== "cash") {
        payment = await mockCreatePayment({
          method: selectedMethod,
          amount: getSubtotal(),
          currency: "AED",
          metadata: { name, phone }
        });
      }

      await submitOrder({
        customer: { name, phone },
        paymentMethod: selectedMethod,
        payment
      });
    } catch (err) {
      payBtn.disabled = false;
      payBtn.textContent = methodLabel(selectedMethod);
      alert(err.message);
    }
  });

  function syncApplePayAvailability() {
    if (!appleTile) return;

    const supportsApplePay =
      typeof window.ApplePaySession !== "undefined" &&
      typeof window.ApplePaySession.canMakePayments === "function" &&
      window.ApplePaySession.canMakePayments();

    if (supportsApplePay) return;

    if (selectedMethod === "apple-pay") {
      selectedMethod = null;
    }

    appleTile.hidden = true;
    appleTile.disabled = true;
    appleTile.setAttribute("aria-hidden", "true");

    const paymentSection = appleTile.closest(".checkout-payment-section");
    if (!paymentSection || paymentSection.querySelector(".apple-pay-note")) return;

    paymentSection.insertAdjacentHTML(
      "beforeend",
      '<p class="apple-pay-note">Apple Pay requires Safari on iOS/macOS.</p>'
    );
  }

  function updatePayState() {
    const nameOk = nameInput.value.trim().length > 0;
    const phoneDigits = phoneInput.value.replace(/\D/g, "");
    const phoneOk = phoneDigits.length >= 7;
    const canPay = Boolean(selectedMethod) && nameOk && phoneOk;
    payBtn.disabled = !canPay;
    payBtn.textContent = canPay ? methodLabel(selectedMethod) : "Select Payment Method";
  }
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
      ${cart.map(l => `
        <li>
          <div class="summary-line-copy">
            <strong>${l.name}</strong>
            <span>${l.quantity} ${l.quantity === 1 ? "item" : "items"}</span>
          </div>
          <span>${l.priceAed * l.quantity} AED</span>
        </li>
      `).join("")}
    </ul>
    <div class="summary-total">
      <span>Total</span>
      <strong>${subtotal} AED</strong>
    </div>
  `;
}

function methodLabel(method) {
  return method === "cash" ? "Confirm Cash Order" : method === "apple-pay" ? "Pay with Apple Pay" : "Pay with Card";
}
