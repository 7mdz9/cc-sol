import { filterOrders, subscribeOrders } from "./admin-data.js";
import { subscribeFilters } from "./admin-filters.js";

let lastOrders = [];
let lastFilters = null;

export function initOverview() {
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
  const section = document.getElementById("section-overview");
  if (!section || !lastFilters) return;

  const orders = filterOrders(lastOrders, lastFilters);
  const totalRevenue = orders.reduce((sum, order) => sum + order.subtotal, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
  const totalItems = orders.reduce((sum, order) => sum + order.itemCount, 0);
  const topBranch = getTopBranch(orders);
  const recentOrders = orders
    .slice()
    .sort((a, b) => b.submittedAtDate.getTime() - a.submittedAtDate.getTime())
    .slice(0, 10);

  section.innerHTML = `
    <div class="admin-kpi-grid">
      ${renderKpiCard("Total Revenue", formatAed(totalRevenue), totalOrders ? `${totalOrders} completed table orders in range` : "No orders yet")}
      ${renderKpiCard("Total Orders", `${totalOrders}`, totalOrders ? `${totalItems} items sold across the current view` : "Awaiting first completed table order")}
      ${renderKpiCard("Avg Order Value", formatAed(avgOrderValue), totalOrders ? "Calculated from current filtered orders" : "Calculated once orders begin flowing")}
      ${renderKpiCard("Top Branch", topBranch.label, topBranch.meta)}
    </div>
    <div class="admin-content-grid admin-content-grid-overview">
      <section class="admin-panel">
        <div class="admin-panel-head">
          <div>
            <p class="admin-panel-kicker">Recent Activity</p>
            <h2>Latest table orders</h2>
          </div>
          <span class="admin-panel-badge">Live</span>
        </div>
        <p class="admin-panel-copy">A real-time read on the most recent completed orders in the current filter window.</p>
        ${recentOrders.length === 0 ? `
          <div class="admin-feed-empty">
            <div class="admin-feed-line">
              <span class="admin-feed-label">No orders yet</span>
              <span class="admin-feed-note">Place an order in another tab to activate the dashboard.</span>
            </div>
          </div>
        ` : `
          <ul class="recent-list">
            ${recentOrders.map(renderOrderRow).join("")}
          </ul>
        `}
      </section>
      <section class="admin-panel admin-panel-accent">
        <div class="admin-panel-head">
          <div>
            <p class="admin-panel-kicker">Founder Focus</p>
            <h2>What this surface is answering right now</h2>
          </div>
          <span class="admin-panel-badge">${totalOrders ? "Live data" : "Awaiting flow"}</span>
        </div>
        <ul class="admin-bullet-list">
          <li>${topBranchInsight(topBranch, totalOrders)}</li>
          <li>${avgValueInsight(avgOrderValue, totalOrders)}</li>
          <li>${paymentMixInsight(orders, totalOrders)}</li>
        </ul>
      </section>
    </div>
  `;
}

function renderKpiCard(label, value, meta) {
  return `
    <article class="admin-kpi-card">
      <span class="admin-kpi-label">${label}</span>
      <strong class="admin-kpi-value">${value}</strong>
      <span class="admin-kpi-meta">${meta}</span>
    </article>
  `;
}

function renderOrderRow(order) {
  return `
    <li class="recent-row">
      <div class="recent-row-main">
        <div class="recent-row-top">
          <span class="recent-num">${order.orderNumber}</span>
          <span class="recent-method">${paymentLabel(order.paymentMethod)}</span>
        </div>
        <span class="recent-branch">${order.branchName} · Table ${order.table}</span>
      </div>
      <div class="recent-row-side">
        <span class="recent-amount">${formatAed(order.subtotal)}</span>
        <span class="recent-time">${relativeTime(order.submittedAtDate)}</span>
      </div>
    </li>
  `;
}

function getTopBranch(orders) {
  if (!orders.length) {
    return { label: "No orders yet", meta: "Live ranking appears automatically" };
  }

  const byBranch = new Map();
  orders.forEach(order => {
    const current = byBranch.get(order.branch) || { branchName: order.branchName, revenue: 0, orderCount: 0 };
    current.revenue += order.subtotal;
    current.orderCount += 1;
    byBranch.set(order.branch, current);
  });

  const top = Array.from(byBranch.values()).sort((a, b) => b.revenue - a.revenue)[0];
  return {
    label: top.branchName,
    meta: `${formatAed(top.revenue)} across ${top.orderCount} orders`
  };
}

function topBranchInsight(topBranch, totalOrders) {
  if (!totalOrders) {
    return "Branch leadership will appear once the first live orders arrive.";
  }
  return `${topBranch.label} is currently leading the filtered view, with ${topBranch.meta.toLowerCase()}.`;
}

function avgValueInsight(avgOrderValue, totalOrders) {
  if (!totalOrders) {
    return "Average order value will begin updating as soon as the first payment lands.";
  }
  return `Average order value is ${formatAed(avgOrderValue)}, giving a quick read on table spend quality.`;
}

function paymentMixInsight(orders, totalOrders) {
  if (!totalOrders) {
    return "Payment preference trends will show whether guests lean toward card, Apple Pay, or cash.";
  }

  const paymentCounts = orders.reduce((map, order) => {
    map[order.paymentMethod] = (map[order.paymentMethod] || 0) + 1;
    return map;
  }, {});
  const topPayment = Object.entries(paymentCounts).sort((a, b) => b[1] - a[1])[0];
  return `${paymentLabel(topPayment[0])} is the most used method in the current slice, appearing on ${topPayment[1]} orders.`;
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
