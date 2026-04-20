import { initCursor } from "./cursor.js";
import { initNav } from "./nav.js";
import { initReveal } from "./reveal.js";
import { initMenu } from "./menu.js";
import { initHeroCanvas } from "./hero-canvas.js";

document.addEventListener("DOMContentLoaded", () => {
  initCursor();
  initNav();
  initReveal();
  initMenu();
  initHeroCanvas();
});
