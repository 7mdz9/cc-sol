import { initAtmosphere } from "./atmosphere.js";
import { initCountdown } from "./countdown.js";
import { initCursor } from "./cursor.js";
import { initGoodsInteractions } from "./goods.js";
import { initHeroCanvas } from "./hero-canvas.js";
import { initNav } from "./nav.js";
import { initReveal } from "./reveal.js";

document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  initNav();
  initAtmosphere();
  initReveal();
  initHeroCanvas();
  initCursor();
  initGoodsInteractions();
});
