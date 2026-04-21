import { filterOrders, subscribeOrders } from "./admin-data.js";
import { subscribeFilters } from "./admin-filters.js";

let lastOrders = [];
let lastFilters = null;
let searchTerm = "";
let sortState = { key: "submittedAt", dir: "desc" };
let selectedOrderNumber = null;

export function initOrders() {
  subscribeOrders(orders => {
    lastOrders = orders;
    syncSelectedOrder();
    render();
  });

  subscribeFilters(filters => {
    lastFilters = filters;
    syncSelectedOrder();
    render();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeDrawer();
  });
}

function render() {
  const section = document.getElementById("section-orders");
  if (!section || !lastFilters) return;

  const rows = getVisibleOrders();
  const selectedOrder = rows.find(order => order.orderNumber === selectedOrderNumber) || null;

  section.innerHTML = `
    <section class="admin-panel admin-orders-panel">
      <div class="admin-panel-head admin-orders-head">
        <div>
          <p class="admin-panel-kicker">Live ledger</p>
          <h2>Completed orders</h2>
        </div>
        <div class="admin-orders-tools">
          <label class="admin-search">
            <span>Search order number</span>
            <input type="search" id="ordersSearch" placeholder="SLA-123456" value="${escapeAttr(searchTerm)}">
          </label>
        </div>
      </div>
      ${rows.length === 0 ? `
        <div class="admin-feed-empty admin-orders-empty">
          <div class="admin-feed-line">
            <span class="admin-feed-label">No orders match your filters</span>
            <span class="admin-feed-note">Adjust the date, branch, payment, or search term to widen the view.</span>
          </div>
        </div>
      ` : `
        <div class="admin-table-shell">
          <table class="admin-table">
            <thead>
              <tr>
                ${renderSortHeader("orderNumber", "Order #")}
                ${renderSortHeader("branchName", "Branch")}
                ${renderSortHeader("table", "Table")}
                ${renderSortHeader("itemCount", "Items")}
                ${renderSortHeader("subtotal", "Total")}
                ${renderSortHeader("paymentMethod", "Payment")}
                ${renderSortHeader("submittedAt", "Time")}
                <th class="admin-table-arrow">Open</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map(renderTableRow).join("")}
            </tbody>
          </table>
        </div>
      `}
    </section>
    <div class="admin-drawer-layer${selectedOrder ? " open" : ""}" id="ordersDrawerLayer">
      <button class="admin-drawer-backdrop" id="ordersDrawerBackdrop" type="button"></button>
      <aside class="admin-drawer${selectedOrder ? " open" : ""}" id="ordersDrawer">
        ${selectedOrder ? renderDrawer(selectedOrder) : ""}
      </aside>
    </div>
  `;

  wireEvents(section);
}

function wireEvents(section) {
  const searchInput = section.querySelector("#ordersSearch");
  if (searchInput) {
    searchInput.addEventListener("input", event => {
      searchTerm = event.target.value.trim();
      syncSelectedOrder();
      render();
    });
  }

  section.querySelectorAll(".admin-sort").forEach(button => {
    button.addEventListener("click", () => {
      const key = button.dataset.sortKey;
      if (!key) return;
      if (sortState.key === key) {
        sortState = { key, dir: sortState.dir === "asc" ? "desc" : "asc" };
      } else {
        sortState = { key, dir: defaultDirection(key) };
      }
      render();
    });
  });

  section.querySelectorAll(".admin-order-row").forEach(row => {
    row.addEventListener("click", () => {
      selectedOrderNumber = row.dataset.orderNumber || null;
      render();
    });
  });

  document.getElementById("ordersDrawerBackdrop")?.addEventListener("click", closeDrawer);
  document.getElementById("btnCloseOrderDrawer")?.addEventListener("click", closeDrawer);
}

function getVisibleOrders() {
  const filtered = filterOrders(lastOrders, lastFilters);
  const searched = searchTerm
    ? filtered.filter(order => order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    : filtered;

  return searched.sort(compareOrders);
}

function compareOrders(a, b) {
  const dir = sortState.dir === "asc" ? 1 : -1;
  const key = sortState.key;

  if (key === "submittedAt") {
    return (a.submittedAtDate.getTime() - b.submittedAtDate.getTime()) * dir;
  }

  if (key === "paymentMethod" || key === "branchName" || key === "orderNumber") {
    return a[key].localeCompare(b[key]) * dir;
  }

  return ((a[key] || 0) - (b[key] || 0)) * dir;
}

function renderSortHeader(key, label) {
  const active = sortState.key === key;
  const direction = active && sortState.dir === "asc" ? "↑" : "↓";
  return `
    <th>
      <button class="admin-sort${active ? " active" : ""}" type="button" data-sort-key="${key}">
        <span>${label}</span>
        <span class="admin-sort-indicator">${active ? direction : "·"}</span>
      </button>
    </th>
  `;
}

function renderTableRow(order) {
  return `
    <tr class="admin-order-row" data-order-number="${order.orderNumber}">
      <td class="admin-table-order">${order.orderNumber}</td>
      <td>${order.branchName}</td>
      <td>Table ${order.table}</td>
      <td>${order.itemCount}</td>
      <td>${formatAed(order.subtotal)}</td>
      <td>${paymentLabel(order.paymentMethod)}</td>
      <td>${relativeTime(order.submittedAtDate)}</td>
      <td class="admin-table-arrow">→</td>
    </tr>
  `;
}

function renderDrawer(order) {
  const paidAt = order.payment?.paidAt ? new Date(order.payment.paidAt) : null;
  return `
    <div class="admin-drawer-head">
      <div>
        <p class="admin-panel-kicker">Order detail</p>
        <h2>${order.orderNumber}</h2>
      </div>
      <button class="admin-drawer-close" id="btnCloseOrderDrawer" type="button">✕</button>
    </div>
    <div class="admin-drawer-block">
      <span class="admin-drawer-label">Branch</span>
      <strong>${order.branchName} · Table ${order.table}</strong>
    </div>
    <div class="admin-drawer-block">
      <span class="admin-drawer-label">Guest</span>
      <strong>${order.customer?.name || "Guest"}</strong>
      <span class="admin-drawer-meta">${order.customer?.phone || "No phone captured"}</span>
    </div>
    <div class="admin-drawer-block">
      <span class="admin-drawer-label">Items</span>
      <ul class="admin-line-items">
        ${order.items.map(item => `
          <li class="admin-line-item">
            <div>
              <strong>${item.name}</strong>
              <span>${item.category}</span>
            </div>
            <div class="admin-line-item-side">
              <strong>x${item.quantity}</strong>
              <span>${formatAed(item.priceAed * item.quantity)}</span>
            </div>
          </li>
        `).join("")}
      </ul>
    </div>
    <div class="admin-drawer-block admin-drawer-split">
      <div>
        <span class="admin-drawer-label">Payment</span>
        <strong>${paymentLabel(order.paymentMethod)}</strong>
        <span class="admin-drawer-meta">${order.payment?.paymentId || "Payment captured offline"}</span>
      </div>
      <div>
        <span class="admin-drawer-label">Submitted</span>
        <strong>${formatTimestamp(order.submittedAtDate)}</strong>
        <span class="admin-drawer-meta">${paidAt ? `Paid ${formatTimestamp(paidAt)}` : "Awaiting in-person settlement"}</span>
      </div>
    </div>
    <div class="admin-drawer-total">
      <span>Total</span>
      <strong>${formatAed(order.subtotal)}</strong>
    </div>
  `;
}

function syncSelectedOrder() {
  if (!selectedOrderNumber) return;
  const found = getVisibleOrders().some(order => order.orderNumber === selectedOrderNumber);
  if (!found) selectedOrderNumber = null;
}

function closeDrawer() {
  if (!selectedOrderNumber) return;
  selectedOrderNumber = null;
  render();
}

function defaultDirection(key) {
  return key === "orderNumber" || key === "branchName" || key === "paymentMethod" ? "asc" : "desc";
}

function formatAed(value) {
  return `${Math.round(value).toLocaleString()} AED`;
}

function paymentLabel(method) {
  return method === "apple-pay" ? "Apple Pay" : method === "card" ? "Card" : "Cash";
}

function relativeTime(date) {
  const diff = Math.max(0, Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}

function formatTimestamp(date) {
  return `${date.toLocaleDateString()} · ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
}

function escapeAttr(value) {
  return value.replace(/"/g, "&quot;");
}
