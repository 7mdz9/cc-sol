import { ORDERS_STORAGE_KEY } from "./admin-config.js";

let cachedOrders = null;
const listeners = [];

export function initAdminData() {}

export function loadOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidOrder).map(enrich);
  } catch {
    return [];
  }
}

export function subscribeOrders(fn) {
  listeners.push(fn);
  fn(loadOrders());
}

export function filterOrders(orders, filters) {
  return orders.filter(order => {
    if (filters.from && order.submittedAtDate < filters.from) return false;
    if (filters.to && order.submittedAtDate > filters.to) return false;
    if (filters.branch && order.branch !== filters.branch) return false;
    if (filters.paymentMethod && order.paymentMethod !== filters.paymentMethod) return false;
    return true;
  });
}

export function aggregateByBranch(orders) {
  const map = {};
  orders.forEach(order => {
    if (!map[order.branch]) {
      map[order.branch] = {
        branch: order.branch,
        branchName: order.branchName,
        orderCount: 0,
        revenue: 0,
        itemCount: 0
      };
    }
    map[order.branch].orderCount += 1;
    map[order.branch].revenue += order.subtotal;
    map[order.branch].itemCount += order.itemCount;
  });
  return Object.values(map);
}

export function aggregateByItem(orders) {
  const map = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!map[item.id]) {
        map[item.id] = {
          id: item.id,
          name: item.name,
          category: item.category,
          quantity: 0,
          revenue: 0
        };
      }
      map[item.id].quantity += item.quantity;
      map[item.id].revenue += item.priceAed * item.quantity;
    });
  });
  return Object.values(map);
}

export function aggregateByCategory(orders) {
  const map = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!map[item.category]) {
        map[item.category] = { category: item.category, quantity: 0, revenue: 0 };
      }
      map[item.category].quantity += item.quantity;
      map[item.category].revenue += item.priceAed * item.quantity;
    });
  });
  return Object.values(map);
}

export function aggregateByPayment(orders) {
  const map = {};
  orders.forEach(order => {
    const method = order.paymentMethod;
    if (!map[method]) {
      map[method] = { method, orderCount: 0, revenue: 0 };
    }
    map[method].orderCount += 1;
    map[method].revenue += order.subtotal;
  });
  return Object.values(map);
}

export function aggregateByDay(orders) {
  const map = {};
  orders.forEach(order => {
    const key = order.submittedAtDate.toISOString().slice(0, 10);
    if (!map[key]) {
      map[key] = { date: key, orderCount: 0, revenue: 0 };
    }
    map[key].orderCount += 1;
    map[key].revenue += order.subtotal;
  });
  return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
}

export function aggregateByHour(orders) {
  const byHour = Array.from({ length: 24 }, (_, hour) => ({ hour, orderCount: 0, revenue: 0 }));
  orders.forEach(order => {
    const hour = order.submittedAtDate.getHours();
    byHour[hour].orderCount += 1;
    byHour[hour].revenue += order.subtotal;
  });
  return byHour;
}

window.addEventListener("storage", event => {
  if (event.key === ORDERS_STORAGE_KEY) {
    broadcast();
  }
});

function broadcast() {
  cachedOrders = loadOrders();
  listeners.forEach(fn => fn(cachedOrders));
}

function isValidOrder(order) {
  return order &&
    typeof order.orderNumber === "string" &&
    typeof order.branch === "string" &&
    typeof order.branchName === "string" &&
    typeof order.submittedAt === "string" &&
    Array.isArray(order.items) &&
    typeof order.subtotal === "number" &&
    typeof order.paymentMethod === "string";
}

function enrich(order) {
  const submittedAtDate = new Date(order.submittedAt);
  return {
    ...order,
    submittedAtDate,
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0)
  };
}
