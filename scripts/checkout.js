import { readBranchContext, validateBranch, validateTable } from "./branch-context.js";
import { initCursor } from "./cursor.js";
import { initCart, getCart, getSubtotal } from "./cart.js";

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

  renderSummary();
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
