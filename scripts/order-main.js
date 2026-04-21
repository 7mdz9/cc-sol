import { readBranchContext, validateBranch, validateTable } from "./branch-context.js";
import { initCursor } from "./cursor.js";
import { initNav } from "./nav.js";

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

  // Subsequent step modules will import and run here
  // (Step 1 adds menu render, etc.)
});
