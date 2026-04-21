// Cart is scoped to branch+table via localStorage key
let cartKey = null;
let cart = []; // [{ id, name, priceAed, quantity }]
const listeners = [];
let lastAddedId = null;

const MAX_QTY = 20;
const EXPIRY_MS = 2 * 60 * 60 * 1000; // 2 hours

export function initCart({ branch, table }) {
  cartKey = `solea_cart_${branch}_${table}`;
  cart = [];
  const saved = localStorage.getItem(cartKey);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Support both legacy plain array and new { items, updatedAt } shape
      if (Array.isArray(parsed)) {
        // Legacy format — treat as expired (no timestamp)
        localStorage.removeItem(cartKey);
      } else if (parsed && Array.isArray(parsed.items)) {
        const age = Date.now() - (parsed.updatedAt || 0);
        if (age < EXPIRY_MS) {
          cart = parsed.items;
        } else {
          localStorage.removeItem(cartKey);
        }
      }
    } catch {}
  }
  notify();
}

export function addItem(item) {
  const existing = cart.find(l => l.id === item.id);
  if (existing) {
    if (existing.quantity >= MAX_QTY) return; // cap reached, silent
    existing.quantity += 1;
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      priceAed: item.priceAed,
      quantity: 1
    });
  }
  lastAddedId = item.id;
  persist();
  notify();
}

export function removeItem(id) {
  cart = cart.filter(l => l.id !== id);
  persist();
  notify();
}

export function setQuantity(id, qty) {
  if (qty <= 0) return removeItem(id);
  if (qty > MAX_QTY) qty = MAX_QTY; // silently cap
  const line = cart.find(l => l.id === id);
  if (line) {
    line.quantity = qty;
    persist();
    notify();
  }
}

export function getCart() {
  return cart.map(l => ({ ...l }));
}

export function getSubtotal() {
  return cart.reduce((sum, l) => sum + l.priceAed * l.quantity, 0);
}

export function clearCart() {
  cart = [];
  persist();
  notify();
}

// Read-once: returns the last-added item id and clears it
export function consumeLastAdded() {
  const id = lastAddedId;
  lastAddedId = null;
  return id;
}

export function onChange(fn) {
  listeners.push(fn);
}

function persist() {
  if (!cartKey) return;
  localStorage.setItem(cartKey, JSON.stringify({ items: cart, updatedAt: Date.now() }));
}
function notify() {
  listeners.forEach(fn => fn());
}
