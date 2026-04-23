import { requireSession, logout } from "./admin-auth.js";
import { renderFilterBar } from "./admin-filters.js";
import { initCursor } from "./cursor.js";
import { initNav } from "./nav.js";
import { initOverview } from "./admin-overview.js";
import { initOrders } from "./admin-orders.js";
import { initSales } from "./admin-sales.js";
import { initProducts } from "./admin-products.js";
import { initPayments } from "./admin-payments.js";
import { initBranches } from "./admin-branches.js";
import { initExport } from "./admin-export.js";

const SECTIONS = ["overview", "orders", "sales", "products", "payments", "branches", "export"];
const SECTION_TITLES = {
  overview: "Overview",
  orders: "Orders",
  sales: "Sales Analytics",
  products: "Product Analytics",
  payments: "Payment Analytics",
  branches: "Branch Comparison",
  export: "Export Reports"
};
const SECTION_SUBTITLES = {
  overview: "A premium operating snapshot designed for quick founder check-ins.",
  orders: "Inspect every live order with clean structure and fast scanability.",
  sales: "Follow revenue rhythm, branch strength, and category contribution.",
  products: "Surface your strongest sellers and the items that need attention.",
  payments: "Understand how guests prefer to settle their table orders.",
  branches: "Compare locations side by side with a clear commercial ranking.",
  export: "Prepare structured CSV handoffs for finance, ops, and reporting."
};

document.addEventListener("DOMContentLoaded", () => {
  initCursor();
  initNav();

  const session = requireSession();
  if (!session) return;

  document.getElementById("btnLogout")?.addEventListener("click", logout);
  document.getElementById("mobileAdminLogout")?.addEventListener("click", logout);
  renderSectionPlaceholders();
  renderFilterBar();
  initOverview();
  initOrders();
  initSales();
  initProducts();
  initPayments();
  initBranches();
  initExport();
  window.addEventListener("hashchange", handleRoute);
  handleRoute();
});

export function initAdminMain() {}

function handleRoute() {
  const hash = window.location.hash.replace("#", "") || "overview";
  const section = SECTIONS.includes(hash) ? hash : "overview";

  SECTIONS.forEach(name => {
    const sectionEl = document.getElementById(`section-${name}`);
    if (sectionEl) sectionEl.hidden = name !== section;
  });

  document.querySelectorAll(".sidebar-nav a").forEach(link => {
    link.classList.toggle("active", link.dataset.section === section);
  });

  const title = document.getElementById("adminTitle");
  if (title) title.textContent = SECTION_TITLES[section];
  const subtitle = document.getElementById("adminSubtitle");
  if (subtitle) subtitle.textContent = SECTION_SUBTITLES[section];
}

function renderSectionPlaceholders() {
  renderOverviewShell();
  renderOrdersShell();
  renderSalesShell();
  renderProductsShell();
  renderPaymentsShell();
  renderBranchesShell();
  renderExportShell();
}

function renderOverviewShell() {
  const section = document.getElementById("section-overview");
  if (!section) return;

  section.innerHTML = `
    <div class="admin-kpi-grid">
      ${renderKpiCard("Total Revenue", "0 AED", "No orders yet")}
      ${renderKpiCard("Total Orders", "0", "Awaiting first completed table order")}
      ${renderKpiCard("Avg Order Value", "0 AED", "Calculated once orders begin flowing")}
      ${renderKpiCard("Top Branch", "No orders yet", "Live ranking appears automatically")}
    </div>
    <div class="admin-content-grid admin-content-grid-overview">
      <section class="admin-panel">
        <div class="admin-panel-head">
          <div>
            <p class="admin-panel-kicker">Recent Activity</p>
            <h2>Orders will appear here in real time</h2>
          </div>
          <span class="admin-panel-badge">Live</span>
        </div>
        <p class="admin-panel-copy">As soon as a table order is confirmed, this feed becomes the founder's quickest pulse check.</p>
        <div class="admin-feed-empty">
          <div class="admin-feed-line">
            <span class="admin-feed-label">No orders yet</span>
            <span class="admin-feed-note">Place an order in another tab to activate the dashboard.</span>
          </div>
        </div>
      </section>
      <section class="admin-panel admin-panel-accent">
        <div class="admin-panel-head">
          <div>
            <p class="admin-panel-kicker">Founder Focus</p>
            <h2>What this surface is built to answer</h2>
          </div>
        </div>
        <ul class="admin-bullet-list">
          <li>Which branch is converting the strongest table demand right now?</li>
          <li>Are order sizes trending higher or softer across the day?</li>
          <li>Which products and payment methods are shaping revenue quality?</li>
        </ul>
      </section>
    </div>
  `;
}

function renderOrdersShell() {
  renderStandardShell("orders", "Orders Archive", "A live operational ledger with search, detail views, and clean handoff-ready structure.");
}

function renderSalesShell() {
  const section = document.getElementById("section-sales");
  if (!section) return;

  section.innerHTML = `
    <div class="admin-analytics-grid">
      ${renderAnalyticsCard("Revenue Trend", "Line chart for daily revenue momentum will appear here.")}
      ${renderAnalyticsCard("Revenue by Branch", "A branch ranking view will help you spot performance gaps immediately.")}
      ${renderAnalyticsCard("Revenue by Category", "See how drinks, desserts, and other categories contribute to the mix.")}
    </div>
  `;
}

function renderProductsShell() {
  renderStandardShell("products", "Product Signals", "Best sellers, weakest sellers, and category strength will surface here with a clean decision-first layout.");
}

function renderPaymentsShell() {
  renderStandardShell("payments", "Payment Mix", "Understand card, Apple Pay, and cash adoption without leaving the main dashboard rhythm.");
}

function renderBranchesShell() {
  renderStandardShell("branches", "Branch Ranking", "Compare every Soléa location side by side by revenue, orders, AOV, and items sold.");
}

function renderExportShell() {
  const section = document.getElementById("section-export");
  if (!section) return;

  section.innerHTML = `
    <div class="admin-export-grid">
      ${renderExportCard("Orders Export", "A clean order-level CSV for finance reviews, reconciliation, and operational audits.", "Download CSV", "◎")}
      ${renderExportCard("Revenue Export", "A day-level revenue export for quick founder reporting and monthly rollups.", "Download CSV", "◌")}
      ${renderExportCard("Branch Performance", "A branch comparison export designed for performance reviews and leadership snapshots.", "Download CSV", "◇")}
    </div>
  `;
}

function renderStandardShell(sectionName, panelTitle, copy) {
  const section = document.getElementById(`section-${sectionName}`);
  if (!section) return;

  section.innerHTML = `
    <section class="admin-panel admin-panel-large">
      <div class="admin-panel-head">
        <div>
          <p class="admin-panel-kicker">Coming Next</p>
          <h2>${panelTitle}</h2>
        </div>
        <span class="admin-panel-badge">Structured</span>
      </div>
      <p class="admin-panel-copy">${copy}</p>
    </section>
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

function renderAnalyticsCard(title, copy) {
  return `
    <section class="admin-panel admin-chart-shell">
      <div class="admin-panel-head">
        <div>
          <p class="admin-panel-kicker">Analytics</p>
          <h2>${title}</h2>
        </div>
      </div>
      <p class="admin-panel-copy">${copy}</p>
      <div class="admin-chart-placeholder"></div>
    </section>
  `;
}

function renderExportCard(title, copy, cta, icon) {
  return `
    <article class="admin-export-card">
      <div class="admin-export-icon">${icon}</div>
      <div class="admin-export-copy">
        <h2>${title}</h2>
        <p>${copy}</p>
      </div>
      <button class="admin-export-button" type="button" disabled>${cta}</button>
    </article>
  `;
}
