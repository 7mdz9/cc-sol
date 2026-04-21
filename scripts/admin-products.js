import { aggregateByCategory, aggregateByItem, filterOrders, subscribeOrders } from "./admin-data.js";
import { subscribeFilters } from "./admin-filters.js";

let categoryChart = null;
let lastOrders = [];
let lastFilters = null;

export function initProducts() {
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
  const section = document.getElementById("section-products");
  if (!section || !lastFilters) return;

  const orders = filterOrders(lastOrders, lastFilters);
  destroyChart();

  if (!orders.length) {
    section.innerHTML = `
      <section class="admin-panel admin-chart-panel">
        <div class="admin-panel-head">
          <div>
            <p class="admin-panel-kicker">Product analytics</p>
            <h2>No product data yet</h2>
          </div>
          <span class="admin-panel-badge">Awaiting orders</span>
        </div>
        <p class="admin-panel-copy">Complete a few orders to see which menu items and categories are driving demand.</p>
        <div class="admin-feed-empty">
          <div class="admin-feed-line">
            <span class="admin-feed-label">No data for this period</span>
            <span class="admin-feed-note">Product rankings and category mix appear automatically once matching orders exist.</span>
          </div>
        </div>
      </section>
    `;
    return;
  }

  const items = aggregateByItem(orders).sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue);
  const topItems = items.slice(0, 10);
  const bottomItems = items.slice().sort((a, b) => a.quantity - b.quantity || a.revenue - b.revenue).slice(0, 10);
  const categories = aggregateByCategory(orders).sort((a, b) => b.quantity - a.quantity);

  section.innerHTML = `
    <div class="admin-products-grid">
      <section class="admin-panel">
        <div class="admin-panel-head">
          <div>
            <p class="admin-panel-kicker">Best sellers</p>
            <h2>Top 10 items</h2>
          </div>
          <span class="admin-panel-badge">${topItems.length} ranked</span>
        </div>
        ${renderProductTable(topItems)}
      </section>
      <section class="admin-panel">
        <div class="admin-panel-head">
          <div>
            <p class="admin-panel-kicker">Needs attention</p>
            <h2>Bottom 10 items</h2>
          </div>
          <span class="admin-panel-badge">${bottomItems.length} ranked</span>
        </div>
        ${renderProductTable(bottomItems, true)}
      </section>
      <section class="admin-panel admin-chart-panel admin-chart-panel-wide">
        <div class="admin-panel-head">
          <div>
            <p class="admin-panel-kicker">Category mix</p>
            <h2>Quantity by category</h2>
          </div>
          <span class="admin-panel-badge">${categories.length} categories</span>
        </div>
        <p class="admin-panel-copy">See which menu families are carrying the volume in the current filtered slice.</p>
        <div class="admin-chart-canvas-wrap">
          <canvas id="productsCategoryChart"></canvas>
        </div>
      </section>
    </div>
  `;

  createCategoryChart(categories);
}

function renderProductTable(rows, inverse = false) {
  return `
    <div class="admin-table-shell admin-table-shell-compact">
      <table class="admin-table admin-table-compact">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Item</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row, index) => `
            <tr>
              <td class="admin-rank-cell">${inverse ? `#${index + 1}` : `#${index + 1}`}</td>
              <td class="admin-product-name">${row.name}</td>
              <td>${row.category}</td>
              <td>${row.quantity}</td>
              <td>${formatAed(row.revenue)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function createCategoryChart(categories) {
  if (!window.Chart) return;
  const canvas = document.getElementById("productsCategoryChart");
  if (!canvas) return;

  categoryChart = new window.Chart(canvas, {
    type: "bar",
    data: {
      labels: categories.map(category => category.category),
      datasets: [{
        data: categories.map(category => category.quantity),
        backgroundColor: "rgba(201, 168, 76, 0.76)",
        borderRadius: 12,
        borderSkipped: false
      }]
    },
    options: {
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(26, 22, 15, 0.92)",
          titleColor: "#fff",
          bodyColor: "#f7edd2",
          displayColors: false,
          padding: 12,
          callbacks: {
            label: context => `${context.raw} sold`
          }
        }
      },
      scales: {
        x: quantityAxis(),
        y: labelAxis()
      }
    }
  });
}

function destroyChart() {
  if (categoryChart) {
    categoryChart.destroy();
    categoryChart = null;
  }
}

function quantityAxis() {
  return {
    grid: {
      color: "rgba(201, 168, 76, 0.10)",
      drawBorder: false
    },
    ticks: {
      color: "rgba(116, 101, 72, 0.9)",
      font: {
        family: "Montserrat",
        size: 11
      }
    },
    border: { display: false }
  };
}

function labelAxis() {
  return {
    grid: { display: false, drawBorder: false },
    ticks: {
      color: "rgba(116, 101, 72, 0.9)",
      font: {
        family: "Montserrat",
        size: 11
      }
    },
    border: { display: false }
  };
}

function formatAed(value) {
  return `${Math.round(value).toLocaleString()} AED`;
}
