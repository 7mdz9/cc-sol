import { readBranchContext, validateBranch, validateTable } from "./branch-context.js";
import { initCursor } from "./cursor.js";
import { initNav } from "./nav.js";
import { initOrderMenu } from "./order-menu.js";
import { initOrderPreview } from "./order-preview.js";
import { initCart } from "./cart.js";
import { initCartUI } from "./order-cart-ui.js";

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

  // initOrderMenu fetches its own data; fetch separately for preview + cart
  const [menuData] = await Promise.all([
    fetch("./data/menu.json").then(r => r.json()),
    initOrderMenu()
  ]);

  initCart({ branch, table });
  initOrderPreview(menuData);
  initCartUI();
});
