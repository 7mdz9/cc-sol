import { requireSession, logout } from "./admin-auth.js";
import { renderFilterBar } from "./admin-filters.js";

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
const SECTION_MESSAGES = {
  overview: "Overview cards and recent activity land in Step 6.",
  orders: "Orders list and detail drawer land in Step 7.",
  sales: "Sales charts land in Step 8.",
  products: "Product analytics land in Step 9.",
  payments: "Payment analytics land in Step 10.",
  branches: "Branch comparison lands in Step 11.",
  export: "CSV export tools land in Step 12."
};

document.addEventListener("DOMContentLoaded", () => {
  const session = requireSession();
  if (!session) return;

  document.getElementById("btnLogout")?.addEventListener("click", logout);
  renderSectionPlaceholders();
  renderFilterBar();
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
}

function renderSectionPlaceholders() {
  SECTIONS.forEach(name => {
    const section = document.getElementById(`section-${name}`);
    if (!section) return;
    section.innerHTML = `
      <div class="admin-placeholder">
        <p class="admin-placeholder-kicker">Soléa Admin</p>
        <h2>${SECTION_TITLES[name]}</h2>
        <p>${SECTION_MESSAGES[name]}</p>
      </div>
    `;
  });
}
