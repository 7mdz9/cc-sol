import { getCart, getSubtotal } from "./cart.js";

let selectedMethod = null;

export function initCheckout() {
  const modal = document.getElementById("checkoutModal");
  const openBtnContainer = document.getElementById("orderCart");
  const closeBtn = document.getElementById("btnCheckoutClose");
  const backdrop = modal.querySelector(".checkout-backdrop");
  const payBtn = document.getElementById("btnPay");
  const nameInput = document.getElementById("customerName");
  const phoneInput = document.getElementById("customerPhone");

  if (!modal || !openBtnContainer || !closeBtn || !backdrop || !payBtn || !nameInput || !phoneInput) {
    return;
  }

  openBtnContainer.addEventListener("click", e => {
    if (e.target.id === "btnCheckout") openModal();
  });

  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  [nameInput, phoneInput].forEach(input => {
    input.addEventListener("input", updatePayState);
  });

  modal.querySelectorAll(".payment-tile").forEach(tile => {
    tile.addEventListener("click", () => {
      modal.querySelectorAll(".payment-tile").forEach(t => t.classList.remove("selected"));
      tile.classList.add("selected");
      selectedMethod = tile.dataset.method;
      updatePayState();
    });
  });

  function openModal() {
    if (getCart().length === 0) return;
    renderSummary();
    updatePayState();
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    selectedMethod = null;
    modal.querySelectorAll(".payment-tile").forEach(t => t.classList.remove("selected"));
    payBtn.disabled = true;
    payBtn.textContent = "Select Payment Method";
  }

  function renderSummary() {
    const el = document.getElementById("checkoutSummary");
    const cart = getCart();
    el.innerHTML = `
      <ul class="summary-lines">
        ${cart.map(l => `<li>${l.name} × ${l.quantity}<span>${l.priceAed * l.quantity} AED</span></li>`).join("")}
      </ul>
      <div class="summary-total">
        <span>Total</span>
        <strong>${getSubtotal()} AED</strong>
      </div>
    `;
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

function methodLabel(m) {
  return m === "cash" ? "Confirm Cash Order" : m === "apple-pay" ? "Pay with Apple Pay" : "Pay with Card";
}
