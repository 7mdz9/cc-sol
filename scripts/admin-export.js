import { aggregateByBranch, aggregateByDay, filterOrders, subscribeOrders } from "./admin-data.js";
import { subscribeFilters } from "./admin-filters.js";

let lastOrders = [];
let lastFilters = null;

export function initExport() {
  subscribeOrders(orders => {
    lastOrders = orders;
    render();
  });

  subscribeFilters(filters => {
    lastFilters = filters;
    render();
  });
}

function render() {
  const section = document.getElementById("section-export");
  if (!section || !lastFilters) return;

  const orders = filterOrders(lastOrders, lastFilters);
  const daily = aggregateByDay(orders);
  const branches = aggregateByBranch(orders)
    .map(row => ({
      branch_name: row.branchName,
      revenue_aed: row.revenue,
      order_count: row.orderCount,
      item_count: row.itemCount,
      avg_order_value_aed: row.orderCount ? Math.round(row.revenue / row.orderCount) : 0
    }))
    .sort((a, b) => b.revenue_aed - a.revenue_aed);

  section.innerHTML = `
    <div class="admin-export-grid">
      ${renderExportCard("Orders Export", "A complete order-level CSV for reconciliation, finance reviews, and operational audits.", "btnExportOrders", orders.length)}
      ${renderExportCard("Revenue Export", "A day-level revenue rollup for quick leadership reporting and performance snapshots.", "btnExportDaily", daily.length)}
      ${renderExportCard("Branch Performance", "A branch ranking CSV with revenue, order count, items sold, and average order value.", "btnExportBranch", branches.length)}
    </div>
    <div class="admin-export-status" id="adminExportStatus">${orders.length ? `${orders.length} filtered orders ready to export.` : "No data to export for the current filter."}</div>
  `;

  document.getElementById("btnExportOrders")?.addEventListener("click", () => {
    const rows = orders.map(order => ({
      order_number: order.orderNumber,
      submitted_at: order.submittedAt,
      branch: order.branchName,
      table: order.table,
      customer_name: order.customer?.name || "",
      customer_phone: order.customer?.phone || "",
      items: order.items.map(item => `${item.name} x${item.quantity}`).join(" | "),
      item_count: order.itemCount,
      subtotal_aed: order.subtotal,
      payment_method: order.paymentMethod
    }));
    downloadCsv(rows, `solea-orders-${today()}.csv`);
  });

  document.getElementById("btnExportDaily")?.addEventListener("click", () => {
    const rows = daily.map(day => ({
      date: day.date,
      order_count: day.orderCount,
      revenue_aed: day.revenue
    }));
    downloadCsv(rows, `solea-revenue-${today()}.csv`);
  });

  document.getElementById("btnExportBranch")?.addEventListener("click", () => {
    downloadCsv(branches, `solea-branch-performance-${today()}.csv`);
  });
}

function renderExportCard(title, description, buttonId, count) {
  return `
    <article class="admin-export-card">
      <div class="admin-export-icon">◎</div>
      <div class="admin-export-copy">
        <h2>${title}</h2>
        <p>${description}</p>
      </div>
      <button class="admin-export-button" id="${buttonId}" type="button"${count ? "" : " disabled"}>Download CSV</button>
    </article>
  `;
}

function downloadCsv(rows, filename) {
  const status = document.getElementById("adminExportStatus");
  if (!rows.length) {
    if (status) status.textContent = "No data to export for the current filter.";
    return;
  }

  const headers = Object.keys(rows[0]);
  const csv = [headers.join(",")]
    .concat(rows.map(row => headers.map(header => escapeCsv(row[header])).join(",")))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  if (status) status.textContent = `${rows.length} rows exported from the current filter.`;
}

function escapeCsv(value) {
  if (value == null) return "";
  const stringValue = String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, "\"\"")}"`;
  }
  return stringValue;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}
