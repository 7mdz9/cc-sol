import { initCursor } from "./cursor.js";
import { initNav } from "./nav.js";
import { initCountdown } from "./countdown.js";
import { initReveal } from "./reveal.js";
import { initMenu } from "./menu.js";
import { initMarquee } from "./marquee.js";
import { initBranches } from "./branches.js";
import { initSupport } from "./support.js";
import { initMerch } from "./merch.js";

document.addEventListener("DOMContentLoaded", async () => {
  initCursor();
  initNav();
  initCountdown();
  await initMarquee();
  await initBranches();
  await initMenu();
  await initMerch();
  await initSupport();
  initReveal();
});
