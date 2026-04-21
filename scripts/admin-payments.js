import { aggregateByPayment, filterOrders, subscribeOrders } from "./admin-data.js";
import { subscribeFilters } from "./admin-filters.js";

let paymentChart = null;
let lastOrders = [];
let lastFilters = null;

export function initPayments() {
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
  const section = document.getElementById("section-payments");
  if (!section || !lastFilters) return;

  const orders = filterOrders(lastOrders, lastFilters);
  destroyChart();

  if (!orders.length) {
    section.innerHTML = `
      <section class="admin-panel admin-chart-panel">
        <div class="admin-panel-head">
          <div>
            <p class="admin-panel-kicker">Payment analytics</p>
            <h2>No payment data yet</h2>
          </div>
          <span class="admin-panel-badge">Awaiting orders</span>
        </div>
        <p class="admin-panel-copy">Payment mix will begin updating as soon as matching orders are completed.</p>
        <div class="admin-feed-empty">
          <div class="admin-feed-line">
            <span class="admin-feed-label">No data for this period</span>
            <span class="admin-feed-note">Card, Apple Pay, and cash breakdowns appear automatically once the order stream is live.</span>
          </div>
        </div>
      </section>
    `;
    return;
  }

  const byPayment = aggregateByPayment(orders);
  const totalRevenue = byPayment.reduce((sum, item) => sum + item.revenue, 0);
  const paymentMap = new Map(byPayment.map(item => [item.method, item]));
  const methods = ["card", "apple-pay", "cash"];

  section.innerHTML = `
    <div class="admin-payments-grid">
      <section class="admin-panel admin-chart-panel">
        <div class="admin-panel-head">
          <div>
            <p class="admin-panel-kicker">Payment share</p>
            <h2>Revenue split</h2>
          </div>
          <span class="admin-panel-badge">${orders.length} orders</span>
        </div>
        <p class="admin-panel-copy">See how revenue is distributed across card, Apple Pay, and cash.</p>
        <div class="admin-chart-canvas-wrap admin-chart-canvas-wrap-donut">
          <canvas id="paymentsDonutChart"></canvas>
        </div>
      </section>
      <div class="admin-payment-cards">
        ${methods.map(method => renderPaymentCard(method, paymentMap.get(method), totalRevenue)).join("")}
      </div>
      <section class="admin-panel admin-chart-panel admin-chart-panel-wide">
        <div class="admin-panel-head">
          <div>
            <p class="admin-panel-kicker">By branch</p>
            <h2>Payment method by location</h2>
          </div>
        </div>
        ${renderPaymentBranchTable(orders)}
      </section>
    </div>
  `;

  createDonutChart(methods.map(method => paymentMap.get(method) || { method, revenue: 0 }));
}

function renderPaymentCard(method, data, totalRevenue) {
  const revenue = data?.revenue || 0;
  const orderCount = data?.orderCount || 0;
  const share = totalRevenue ? Math.round((revenue / totalRevenue) * 100) : 0;
  return `
    <article class="admin-kpi-card admin-payment-card">
      <span class="admin-kpi-label">${paymentLabel(method)}</span>
      <strong class="admin-kpi-value">${orderCount}</strong>
      <span class="admin-kpi-meta">${formatAed(revenue)} · ${share}% of revenue</span>
    </article>
  `;
}

function renderPaymentBranchTable(orders) {
  const branchMap = new Map();
  orders.forEach(order => {
    if (!branchMap.has(order.branch)) {
      branchMap.set(order.branch, {
        branchName: order.branchName,
        card: 0,
        applePay: 0,
        cash: 0,
        total: 0
      });
    }

    const row = branchMap.get(order.branch);
    row.total += order.subtotal;
    if (order.paymentMethod === "card") row.card += order.subtotal;
    if (order.paymentMethod === "apple-pay") row.applePay += order.subtotal;
    if (order.paymentMethod === "cash") row.cash += order.subtotal;
  });

  const rows = Array.from(branchMap.values()).sort((a, b) => b.total - a.total);
  return `
    <div class="admin-table-shell admin-table-shell-compact">
      <table class="admin-table admin-table-compact">
        <thead>
          <tr>
            <th>Branch</th>
            <th>Card</th>
            <th>Apple Pay</th>
            <th>Cash</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(row => `
            <tr>
              <td class="admin-product-name">${row.branchName}</td>
              <td>${formatAed(row.card)}</td>
              <td>${formatAed(row.applePay)}</td>
              <td>${formatAed(row.cash)}</td>
              <td>${formatAed(row.total)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function createDonutChart(rows) {
  if (!window.Chart) return;
  const canvas = document.getElementById("paymentsDonutChart");
  if (!canvas) return;

  paymentChart = new window.Chart(canvas, {
    type: "doughnut",
    data: {
      labels: rows.map(row => paymentLabel(row.method)),
      datasets: [{
        data: rows.map(row => row.revenue),
        backgroundColor: [
          "rgba(201, 168, 76, 0.86)",
          "rgba(164, 128, 44, 0.7)",
          "rgba(225, 208, 158, 0.92)"
        ],
        borderWidth: 0,
        hoverOffset: 6
      }]
    },
    options: {
      maintainAspectRatio: false,
      cutout: "68%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "rgba(116, 101, 72, 0.9)",
            usePointStyle: true,
            boxWidth: 10,
            boxHeight: 10,
            padding: 18,
            font: {
              family: "Montserrat",
              size: 11
            }
          }
        },
        tooltip: {
          backgroundColor: "rgba(26, 22, 15, 0.92)",
          titleColor: "#fff",
          bodyColor: "#f7edd2",
          displayColors: false,
          padding: 12,
          callbacks: {
            label: context => `${Math.round(context.raw).toLocaleString()} AED`
          }
        }
      }
    }
  });
}

function destroyChart() {
  if (paymentChart) {
    paymentChart.destroy();
    paymentChart = null;
  }
}

function paymentLabel(method) {
  return method === "apple-pay" ? "Apple Pay" : method === "card" ? "Card" : "Cash";
}

function formatAed(value) {
  return `${Math.round(value).toLocaleString()} AED`;
}
