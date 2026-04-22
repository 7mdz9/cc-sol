export function initCountdown() {
  const timer = document.getElementById("cdTimer");
  const openState = document.getElementById("cdOpen");
  if (!timer || !openState) return;

  const target = new Date("2026-05-01T00:00:00+04:00").getTime();
  const values = {
    days: timer.querySelector('[data-unit="days"]'),
    hours: timer.querySelector('[data-unit="hours"]'),
    minutes: timer.querySelector('[data-unit="minutes"]'),
    seconds: timer.querySelector('[data-unit="seconds"]'),
  };

  let tickId = 0;
  let previous = {};

  const format = {
    days: (value) => String(value),
    hours: (value) => String(value).padStart(2, "0"),
    minutes: (value) => String(value).padStart(2, "0"),
    seconds: (value) => String(value).padStart(2, "0"),
  };

  const animateValue = (el, nextValue, key) => {
    if (!el) return;
    if (previous[key] === nextValue) return;
    el.classList.remove("cd-tick");
    void el.offsetWidth;
    el.textContent = format[key](nextValue);
    el.classList.add("cd-tick");
    previous[key] = nextValue;
  };

  const showOpenState = () => {
    timer.hidden = true;
    openState.hidden = false;
  };

  const update = () => {
    const diff = target - Date.now();

    if (diff <= 0) {
      window.clearInterval(tickId);
      showOpenState();
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    animateValue(values.days, days, "days");
    animateValue(values.hours, hours, "hours");
    animateValue(values.minutes, minutes, "minutes");
    animateValue(values.seconds, seconds, "seconds");
  };

  update();
  tickId = window.setInterval(update, 1000);
}
