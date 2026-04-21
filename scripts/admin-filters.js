let state = { range: "all", from: null, to: null, branch: null, paymentMethod: null };
const listeners = [];
const KEY = "solea_admin_filters";

try {
  const raw = localStorage.getItem(KEY);
  if (raw) {
    state = { ...state, ...JSON.parse(raw) };
  }
} catch {}

export function initAdminFilters() {}

export function getFilters() {
  return computeDateBounds(state);
}

export function setFilter(partial) {
  state = { ...state, ...partial };
  if (partial.range) {
    const bounds = rangeToBounds(partial.range);
    state.from = bounds.from;
    state.to = bounds.to;
  }
  persist();
  notify();
}

export function subscribeFilters(fn) {
  listeners.push(fn);
  fn(getFilters());
}

export function renderFilterBar() {
  const slot = document.getElementById("adminFilterSlot");
  if (!slot) return;

  slot.innerHTML = `
    <div class="filter-bar">
      <select id="filterRange" class="filter-select">
        <option value="today">Today</option>
        <option value="yesterday">Yesterday</option>
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
        <option value="this-month">This month</option>
        <option value="last-month">Last month</option>
        <option value="this-year">This year</option>
        <option value="all">All time</option>
      </select>
      <select id="filterBranch" class="filter-select">
        <option value="">All branches</option>
      </select>
      <select id="filterPayment" class="filter-select">
        <option value="">All payments</option>
        <option value="card">Card</option>
        <option value="apple-pay">Apple Pay</option>
        <option value="cash">Cash</option>
      </select>
    </div>
  `;

  fetch("./data/branches.json")
    .then(response => response.json())
    .then(branches => {
      const branchSelect = document.getElementById("filterBranch");
      branches.forEach(branch => {
        const option = document.createElement("option");
        option.value = branch.slug;
        option.textContent = branch.name;
        branchSelect.appendChild(option);
      });
      branchSelect.value = state.branch || "";
    });

  document.getElementById("filterRange").value = state.range || "all";
  document.getElementById("filterPayment").value = state.paymentMethod || "";

  document.getElementById("filterRange").addEventListener("change", event => {
    setFilter({ range: event.target.value });
  });
  document.getElementById("filterBranch").addEventListener("change", event => {
    setFilter({ branch: event.target.value || null });
  });
  document.getElementById("filterPayment").addEventListener("change", event => {
    setFilter({ paymentMethod: event.target.value || null });
  });
}

function persist() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function notify() {
  listeners.forEach(fn => fn(getFilters()));
}

function rangeToBounds(range) {
  const now = new Date();
  const today = startOfDay(now);

  switch (range) {
    case "today":
      return { from: today, to: endOfDay(now) };
    case "yesterday": {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return { from: yesterday, to: endOfDay(yesterday) };
    }
    case "7d":
      return { from: daysAgo(7), to: now };
    case "30d":
      return { from: daysAgo(30), to: now };
    case "this-month":
      return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now };
    case "last-month": {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      return { from: lastMonth, to: end };
    }
    case "this-year":
      return { from: new Date(now.getFullYear(), 0, 1), to: now };
    case "all":
    default:
      return { from: null, to: null };
  }
}

function startOfDay(date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function endOfDay(date) {
  const value = new Date(date);
  value.setHours(23, 59, 59, 999);
  return value;
}

function daysAgo(days) {
  const value = new Date();
  value.setDate(value.getDate() - days);
  value.setHours(0, 0, 0, 0);
  return value;
}

function computeDateBounds(currentState) {
  return {
    ...currentState,
    from: currentState.from ? new Date(currentState.from) : null,
    to: currentState.to ? new Date(currentState.to) : null
  };
}
