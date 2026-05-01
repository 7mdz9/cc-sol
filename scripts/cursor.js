export function initCursor() {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  if ("ontouchstart" in window || (navigator.maxTouchPoints || 0) > 0) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const dot = document.createElement("div");
  dot.className = "cur";
  const ring = document.createElement("div");
  ring.className = "cur-r";
  document.body.appendChild(dot);
  document.body.appendChild(ring);
  document.body.classList.add("has-cursor");

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx;
  let ry = my;

  window.addEventListener("mousemove", event => {
    mx = event.clientX;
    my = event.clientY;
    dot.style.left = `${mx}px`;
    dot.style.top = `${my}px`;
  });

  const tick = () => {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = `${rx}px`;
    ring.style.top = `${ry}px`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  const hoverTargets = "a,button,input,select,textarea,label,.merch-item,.location";
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener("mouseenter", () => {
      dot.classList.add("hover");
      ring.classList.add("hover");
    });
    el.addEventListener("mouseleave", () => {
      dot.classList.remove("hover");
      ring.classList.remove("hover");
    });
  });
}
