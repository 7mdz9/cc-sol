export function initCountdown() {
  const target = new Date("2026-05-01T00:00:00+04:00");
  const timer = document.getElementById("cdTimer");
  const post  = document.getElementById("cdPost");
  if (!timer) return;

  const valueEls = {
    days:    timer.querySelector('[data-unit="days"]'),
    hours:   timer.querySelector('[data-unit="hours"]'),
    minutes: timer.querySelector('[data-unit="minutes"]'),
    seconds: timer.querySelector('[data-unit="seconds"]'),
  };

  let previous = { days: null, hours: null, minutes: null, seconds: null };

  function update() {
    const now  = new Date();
    const diff = target - now;

    if (diff <= 0) {
      timer.hidden = true;
      post.hidden  = false;
      return false;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const values = { days, hours, minutes, seconds };

    Object.entries(values).forEach(([unit, v]) => {
      const el        = valueEls[unit];
      const formatted = unit === "days" ? String(v) : String(v).padStart(2, "0");
      if (el.textContent !== formatted) {
        el.textContent = formatted;
        if (previous[unit] !== null) {
          el.classList.remove("cd-value-tick");
          void el.offsetWidth;
          el.classList.add("cd-value-tick");
        }
        previous[unit] = v;
      }
    });

    return true;
  }

  if (!update()) return;

  const interval = setInterval(() => {
    if (!update()) clearInterval(interval);
  }, 1000);

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) update();
  });
}
