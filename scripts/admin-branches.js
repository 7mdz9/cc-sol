import { aggregateByBranch, filterOrders, subscribeOrders } from "./admin-data.js";
import { subscribeFilters } from "./admin-filters.js";

let lastOrders = [];
let lastFilters = null;
let sortState = { key: "revenue", dir: "desc" };

export function initBranches() {
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
  const section = document.getElementById("section-branches");
  if (!section || !lastFilters) return;

  const orders = filterOrders(lastOrders, lastFilters);
  if (!orders.length) {
    section.innerHTML = `
      <section class="admin-panel admin-chart-panel">
        <div class="admin-panel-head">
          <div>
            <p class="admin-panel-kicker">Branch comparison</p>
            <h2>No branch data yet</h2>
          </div>
          <span class="admin-panel-badge">Awaiting orders</span>
        </div>
        <p class="admin-panel-copy">Branch ranking will activate once matching orders exist for the selected filter range.</p>
        <div class="admin-feed-empty">
          <div class="admin-feed-line">
            <span class="admin-feed-label">No data for this period</span>
            <span class="admin-feed-note">Revenue, order count, and AOV by branch appear automatically once orders arrive.</span>
          </div>
        </div>
      </section>
    `;
    return;
  }

  const rows = aggregateByBranch(orders)
    .map(row => ({
      ...row,
      avgOrderValue: row.orderCount ? row.revenue / row.orderCount : 0
    }))
    .sort(compareRows);

  const best = rows[0];
  const weakest = rows[rows.length - 1];

  section.innerHTML = `
    <div class="admin-branch-callouts">
      <section class="admin-panel admin-branch-callout admin-branch-callout-best">
        <p class="admin-panel-kicker">Best performer</p>
        <h2>${best.branchName}</h2>
        <p class="admin-panel-copy">${formatAed(best.revenue)} · ${best.orderCount} orders · ${formatAed(best.avgOrderValue)} AOV</p>
      </section>
      <section class="admin-panel admin-branch-callout">
        <p class="admin-panel-kicker">Weakest performer</p>
        <h2>${weakest.branchName}</h2>
        <p class="admin-panel-copy">${formatAed(weakest.revenue)} · ${weakest.orderCount} orders · ${formatAed(weakest.avgOrderValue)} AOV</p>
      </section>
    </div>
    <section class="admin-panel">
      <div class="admin-panel-head">
        <div>
          <p class="admin-panel-kicker">Ranking</p>
          <h2>Branch table</h2>
        </div>
        <span class="admin-panel-badge">${rows.length} branches</span>
      </div>
      <div class="admin-table-shell admin-table-shell-compact">
        <table class="admin-table admin-table-compact">
          <thead>
            <tr>
              <th>Rank</th>
              <th>${renderSortButton("branchName", "Branch")}</th>
              <th>${renderSortButton("revenue", "Revenue")}</th>
              <th>${renderSortButton("orderCount", "Orders")}</th>
              <th>${renderSortButton("avgOrderValue", "AOV")}</th>
              <th>${renderSortButton("itemCount", "Items")}</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map((row, index) => `
              <tr>
                <td class="admin-rank-badge">${index + 1}</td>
                <td class="admin-product-name">${row.branchName}</td>
                <td>${formatAed(row.revenue)}</td>
                <td>${row.orderCount}</td>
                <td>${formatAed(row.avgOrderValue)}</td>
                <td>${row.itemCount}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;

  section.querySelectorAll(".admin-sort").forEach(button => {
    button.addEventListener("click", () => {
      const key = button.dataset.sortKey;
      if (!key) return;
      if (sortState.key === key) {
        sortState = { key, dir: sortState.dir === "asc" ? "desc" : "asc" };
      } else {
        sortState = { key, dir: key === "branchName" ? "asc" : "desc" };
      }
      render();
    });
  });
}

function compareRows(a, b) {
  const dir = sortState.dir === "asc" ? 1 : -1;
  if (sortState.key === "branchName") {
    return a.branchName.localeCompare(b.branchName) * dir;
  }
  return (a[sortState.key] - b[sortState.key]) * dir;
}

function renderSortButton(key, label) {
  const active = sortState.key === key;
  const direction = active && sortState.dir === "asc" ? "↑" : "↓";
  return `
    <button class="admin-sort${active ? " active" : ""}" type="button" data-sort-key="${key}">
      <span>${label}</span>
      <span class="admin-sort-indicator">${active ? direction : "·"}</span>
    </button>
  `;
}

function formatAed(value) {
  return `${Math.round(value).toLocaleString()} AED`;
}
