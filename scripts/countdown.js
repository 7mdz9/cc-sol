// Target: May 1, 2026, 00:00:00 Gulf Standard Time (UTC+4)
// That is: April 30, 2026, 20:00:00 UTC
const TARGET_UTC_MS = Date.UTC(2026, 3, 30, 20, 0, 0);

let lastRendered = { d: null, h: null, m: null, s: null };
let tickHandle = null;

export function initCountdown() {
  const timer = document.getElementById("cdTimer");
  const live = document.getElementById("cdLive");
  if (!timer || !live) return;

  function pad(n, width) {
    return String(n).padStart(width, "0");
  }

  function tick() {
    const now = Date.now();
    const diff = TARGET_UTC_MS - now;

    if (diff <= 0) {
      timer.hidden = true;
      live.hidden = false;
      if (tickHandle) clearInterval(tickHandle);
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    if (d !== lastRendered.d) { document.getElementById("cdDays").textContent = pad(d, d >= 100 ? 3 : 2); lastRendered.d = d; }
    if (h !== lastRendered.h) { document.getElementById("cdHours").textContent = pad(h, 2); lastRendered.h = h; }
    if (m !== lastRendered.m) { document.getElementById("cdMinutes").textContent = pad(m, 2); lastRendered.m = m; }
    if (s !== lastRendered.s) { document.getElementById("cdSeconds").textContent = pad(s, 2); lastRendered.s = s; }
  }

  tick();
  tickHandle = setInterval(tick, 1000);
}
