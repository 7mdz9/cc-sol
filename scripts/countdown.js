export function initCountdown() {
  const target = new Date("2026-05-01T00:00:00+04:00").getTime();
  const grid = document.getElementById("cd-grid");
  const launched = document.getElementById("cd-launched");
  if (!grid || !launched) return;

  const nodes = {
    days: grid.querySelector('[data-unit="days"]'),
    hours: grid.querySelector('[data-unit="hours"]'),
    minutes: grid.querySelector('[data-unit="minutes"]'),
    seconds: grid.querySelector('[data-unit="seconds"]'),
  };

  const last = {};
  let intervalId = 0;

  const formatValue = (key, value) => key === "days" ? String(value) : String(value).padStart(2, "0");

  const setValue = (key, value) => {
    const node = nodes[key];
    if (!node) return;

    const text = formatValue(key, value);
    if (last[key] === text) return;

    node.textContent = text;
    node.classList.remove("ticked");
    void node.offsetWidth;
    node.classList.add("ticked");
    last[key] = text;
  };

  const update = () => {
    const diff = target - Date.now();

    if (diff <= 0) {
      window.clearInterval(intervalId);
      grid.hidden = true;
      launched.hidden = false;
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    setValue("days", Math.floor(totalSeconds / 86400));
    setValue("hours", Math.floor((totalSeconds % 86400) / 3600));
    setValue("minutes", Math.floor((totalSeconds % 3600) / 60));
    setValue("seconds", totalSeconds % 60);
  };

  update();
  intervalId = window.setInterval(update, 1000);
}
