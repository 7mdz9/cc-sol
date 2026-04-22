export function initCountdown() {
  const timer = document.getElementById("cdTimer");
  const openState = document.getElementById("cdOpen");
  if (!timer || !openState) return;

  const target = new Date("2026-05-01T00:00:00+04:00").getTime();
  const nodes = {
    days: timer.querySelector('[data-unit="days"]'),
    hours: timer.querySelector('[data-unit="hours"]'),
    minutes: timer.querySelector('[data-unit="minutes"]'),
    seconds: timer.querySelector('[data-unit="seconds"]'),
  };

  const lastValues = new Map();
  let intervalId = 0;

  const formatValue = (key, value) => {
    if (key === "days") return String(value);
    return String(value).padStart(2, "0");
  };

  const setValue = (key, value) => {
    const node = nodes[key];
    if (!node) return;
    const text = formatValue(key, value);
    if (lastValues.get(key) === text) return;
    node.classList.remove("cd-tick");
    void node.offsetWidth;
    node.textContent = text;
    node.classList.add("cd-tick");
    lastValues.set(key, text);
  };

  const showOpenState = () => {
    timer.hidden = true;
    openState.hidden = false;
  };

  const update = () => {
    const diff = target - Date.now();

    if (diff <= 0) {
      window.clearInterval(intervalId);
      showOpenState();
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    setValue("days", days);
    setValue("hours", hours);
    setValue("minutes", minutes);
    setValue("seconds", seconds);
  };

  update();
  intervalId = window.setInterval(update, 1000);
}
