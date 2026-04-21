import { getCart, getSubtotal, setQuantity, removeItem, onChange, consumeLastAdded } from "./cart.js";

const MAX_QTY = 20;

export function initCartUI() {
  const container = document.getElementById("orderCart");
  if (!container) return;
  render();
  onChange(render);

  function render() {
    const cart = getCart();
    const subtotal = getSubtotal();
    const addedId = consumeLastAdded();

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <h3 class="cart-title">Your Order</h3>
          <div class="cart-empty-glyph">✦</div>
          <p class="cart-hint">Select any item and tap <b>+ Add to Cart</b> to begin your order.</p>
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
                <button class="qty-btn qty-inc" data-id="${line.id}"${line.quantity >= MAX_QTY ? " disabled" : ""}>+</button>
                <button class="qty-remove" data-id="${line.id}">✕</button>
              </div>
            </li>
          `).join("")}
        </ul>
        <div class="cart-total">
          <span>Total</span>
          <span class="cart-total-value">${subtotal} AED</span>
        </div>
        <a class="btn-checkout" id="btnCheckout" href="./checkout.html${window.location.search}">Proceed to Checkout</a>
      </div>
    `;

    // Flash newly-added line
    if (addedId) {
      const line = container.querySelector(`.cart-line[data-id="${addedId}"]`);
      if (line) {
        // rAF ensures class is added after paint so animation triggers
        requestAnimationFrame(() => line.classList.add("cart-line-flash"));
        line.addEventListener("animationend", () => line.classList.remove("cart-line-flash"), { once: true });
      }
    }

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
