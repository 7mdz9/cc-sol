import { readBranchContext, validateBranch, validateTable } from "./branch-context.js";
import { initCursor } from "./cursor.js";
import { initNav } from "./nav.js";
import { initOrderMenu } from "./order-menu.js";
import { initOrderPreview } from "./order-preview.js";

document.addEventListener("DOMContentLoaded", async () => {
  initCursor();
  initNav();

  const { branch, table } = readBranchContext();
  const branchData = await validateBranch(branch);
  const tableNum = validateTable(table);

  const guard = document.getElementById("orderGuard");
  const app = document.getElementById("orderApp");

  if (!branchData || !tableNum) {
    guard.hidden = false;
    return;
  }

  // Valid context: show context label, reveal app
  document.getElementById("orderContext").textContent = `${branchData.name} · Table ${tableNum}`;
  app.hidden = false;

  // Single fetch — data passed to both menu and preview modules
  const menuData = await fetch("./data/menu.json").then(r => r.json());
  initOrderMenu(menuData.categories);
  initOrderPreview(menuData);
});
