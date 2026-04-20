import { initCursor } from "./cursor.js";
import { initNav } from "./nav.js";
import { initReveal } from "./reveal.js";
import { initMenu } from "./menu.js";
import { initHeroCanvas } from "./hero-canvas.js";
import { initMarquee } from "./marquee.js";
import { initBranches } from "./branches.js";
import { initSupport } from "./support.js";

document.addEventListener("DOMContentLoaded", async () => {
  initCursor();
  initNav();
  await initMarquee();
  await initBranches();
  await initMenu();
  await initSupport();
  initReveal();
  initHeroCanvas();
});
