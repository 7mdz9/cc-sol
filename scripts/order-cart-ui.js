import { getCart, getSubtotal, setQuantity, removeItem, onChange } from "./cart.js";

export function initCartUI() {
  const container = document.getElementById("orderCart");
  if (!container) return;
  render();
  onChange(render);

  function render() {
    const cart = getCart();
    const subtotal = getSubtotal();

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <h3 class="cart-title">Your Order</h3>
          <p class="cart-hint">Your cart is empty. Tap <b>+ Add to Cart</b> on any item to begin.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="cart-populated">
        <h3 class="cart-title">Your Order</h3>
        <ul class="cart-lines">
          ${cart.map(line => `
            <li class="cart-line" data-id="${line.id}">
              <div class="cart-line-main">
                <span class="cart-line-name">${line.name}</span>
                <span class="cart-line-price">${line.priceAed * line.quantity} AED</span>
              </div>
              <div class="cart-line-qty">
                <button class="qty-btn qty-dec" data-id="${line.id}">−</button>
                <span class="qty-value">${line.quantity}</span>
                <button class="qty-btn qty-inc" data-id="${line.id}">+</button>
                <button class="qty-remove" data-id="${line.id}">✕</button>
              </div>
            </li>
          `).join("")}
        </ul>
        <div class="cart-total">
          <span>Total</span>
          <span class="cart-total-value">${subtotal} AED</span>
        </div>
        <button class="btn-checkout" id="btnCheckout">Proceed to Checkout</button>
      </div>
    `;

    // Wire quantity controls
    container.querySelectorAll(".qty-inc").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const line = getCart().find(l => l.id === id);
        if (line) setQuantity(id, line.quantity + 1);
      });
    });
    container.querySelectorAll(".qty-dec").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const line = getCart().find(l => l.id === id);
        if (line) setQuantity(id, line.quantity - 1);
      });
    });
    container.querySelectorAll(".qty-remove").forEach(btn => {
      btn.addEventListener("click", () => removeItem(btn.dataset.id));
    });
  }
}
