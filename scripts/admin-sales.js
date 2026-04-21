import { aggregateByBranch, aggregateByCategory, aggregateByDay, filterOrders, subscribeOrders } from "./admin-data.js";
import { subscribeFilters } from "./admin-filters.js";

let chartRefs = [];
let lastOrders = [];
let lastFilters = null;

export function initSales() {
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
  const section = document.getElementById("section-sales");
  if (!section || !lastFilters) return;

  const orders = filterOrders(lastOrders, lastFilters);
  destroyCharts();

  if (!orders.length) {
    section.innerHTML = `
      <section class="admin-panel admin-chart-panel">
        <div class="admin-panel-head">
          <div>
            <p class="admin-panel-kicker">Analytics</p>
            <h2>No data for this period</h2>
          </div>
          <span class="admin-panel-badge">Awaiting orders</span>
        </div>
        <p class="admin-panel-copy">Adjust the filter or complete a live order to populate revenue analytics.</p>
        <div class="admin-feed-empty">
          <div class="admin-feed-line">
            <span class="admin-feed-label">No data for this period</span>
            <span class="admin-feed-note">Charts activate automatically once matching orders exist.</span>
          </div>
        </div>
      </section>
    `;
    return;
  }

  section.innerHTML = `
    <div class="admin-sales-grid">
      <section class="admin-panel admin-chart-panel admin-chart-panel-wide">
        <div class="admin-panel-head">
          <div>
            <p class="admin-panel-kicker">Revenue trend</p>
            <h2>Daily revenue rhythm</h2>
          </div>
          <span class="admin-panel-badge">${orders.length} orders</span>
        </div>
        <p class="admin-panel-copy">Follow how table demand is converting into revenue over time.</p>
        <div class="admin-chart-canvas-wrap">
          <canvas id="salesTrendChart"></canvas>
        </div>
      </section>
      <section class="admin-panel admin-chart-panel">
        <div class="admin-panel-head">
          <div>
            <p class="admin-panel-kicker">Revenue by branch</p>
            <h2>Location contribution</h2>
          </div>
        </div>
        <p class="admin-panel-copy">A fast ranking of which branches are currently carrying the commercial load.</p>
        <div class="admin-chart-canvas-wrap">
          <canvas id="salesBranchChart"></canvas>
        </div>
      </section>
      <section class="admin-panel admin-chart-panel">
        <div class="admin-panel-head">
          <div>
            <p class="admin-panel-kicker">Revenue by category</p>
            <h2>Menu mix</h2>
          </div>
        </div>
        <p class="admin-panel-copy">See how the current filter window is distributed across the menu categories.</p>
        <div class="admin-chart-canvas-wrap">
          <canvas id="salesCategoryChart"></canvas>
        </div>
      </section>
    </div>
  `;

  const daily = aggregateByDay(orders);
  const byBranch = aggregateByBranch(orders).sort((a, b) => b.revenue - a.revenue);
  const byCategory = aggregateByCategory(orders).sort((a, b) => b.revenue - a.revenue);

  createLineChart("salesTrendChart", {
    labels: daily.map(day => formatDay(day.date)),
    datasets: [{
      label: "Revenue",
      data: daily.map(day => day.revenue),
      borderColor: "rgba(201, 168, 76, 0.95)",
      backgroundColor: "rgba(201, 168, 76, 0.12)",
      tension: 0.35,
      fill: true,
      borderWidth: 2
    }]
  });

  createBarChart("salesBranchChart", {
    labels: byBranch.map(branch => branch.branchName),
    datasets: [{
      label: "Revenue",
      data: byBranch.map(branch => branch.revenue),
      backgroundColor: "rgba(201, 168, 76, 0.72)",
      borderRadius: 12,
      borderSkipped: false
    }]
  });

  createBarChart("salesCategoryChart", {
    labels: byCategory.map(category => category.category),
    datasets: [{
      label: "Revenue",
      data: byCategory.map(category => category.revenue),
      backgroundColor: "rgba(156, 121, 33, 0.74)",
      borderRadius: 12,
      borderSkipped: false
    }]
  });
}

function createLineChart(id, data) {
  if (!window.Chart) return;
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const chart = new window.Chart(canvas, {
    type: "line",
    data,
    options: baseOptions({
      scales: {
        x: axisConfig(false),
        y: axisConfig(true)
      }
    })
  });
  chartRefs.push(chart);
}

function createBarChart(id, data) {
  if (!window.Chart) return;
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const chart = new window.Chart(canvas, {
    type: "bar",
    data,
    options: baseOptions({
      indexAxis: "y",
      scales: {
        x: axisConfig(true),
        y: axisConfig(false)
      }
    })
  });
  chartRefs.push(chart);
}

function baseOptions(extra) {
  return {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
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
    },
    layout: {
      padding: { top: 8, right: 8, bottom: 4, left: 4 }
    },
    ...extra
  };
}

function axisConfig(currency) {
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
      },
      ...(currency ? { callback: value => `${Math.round(value).toLocaleString()} AED` } : {})
    },
    border: {
      display: false
    }
  };
}

function destroyCharts() {
  chartRefs.forEach(chart => chart.destroy());
  chartRefs = [];
}

function formatDay(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}
