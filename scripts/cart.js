// Cart is scoped to branch+table via localStorage key
let cartKey = null;
let cart = []; // [{ id, name, priceAed, quantity }]
const listeners = [];

export function initCart({ branch, table }) {
  cartKey = `solea_cart_${branch}_${table}`;
  cart = [];
  const saved = localStorage.getItem(cartKey);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) cart = parsed;
    } catch {}
  }
  notify();
}

export function addItem(item) {
  const existing = cart.find(l => l.id === item.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      priceAed: item.priceAed,
      quantity: 1
    });
  }
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

export function onChange(fn) {
  listeners.push(fn);
}

function persist() {
  if (!cartKey) return;
  localStorage.setItem(cartKey, JSON.stringify(cart));
}
function notify() {
  listeners.forEach(fn => fn());
}
