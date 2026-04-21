export function readBranchContext() {
  const params = new URLSearchParams(window.location.search);
  const branch = params.get("branch");
  const table = params.get("table");
  return { branch, table };
}

export async function validateBranch(branchSlug) {
  if (!branchSlug) return null;
  const res = await fetch("./data/branches.json");
  const branches = await res.json();
  return branches.find(b => b.slug === branchSlug) || null;
}

export function validateTable(tableStr) {
  if (!tableStr) return null;
  const n = parseInt(tableStr, 10);
  if (Number.isNaN(n) || n < 1 || n > 999) return null;
  return n;
}
