export function initHeroCanvas() {
  const cv = document.getElementById("hCanvas");
  if (!cv) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const hero = cv.closest("#hero");
  const ctx = cv.getContext("2d");
  if (!ctx) return;

  let W = 1;
  let H = 1;
  let pts = [];
  let rafId = 0;
  let running = false;
  let resizeTimer = 0;

  const targetCount = () => window.innerWidth < 640 ? 18 : 40;

  const queueResize = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      resize();
      syncPts();
    }, 150);
  };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = Math.max(Math.round(cv.clientWidth || cv.getBoundingClientRect().width || 0), 1);
    const cssH = Math.max(Math.round(cv.clientHeight || cv.getBoundingClientRect().height || 0), 1);
    cv.width = Math.floor(cssW * dpr);
    cv.height = Math.floor(cssH * dpr);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    W = cssW;
    H = cssH;
  }

  function syncPts() {
    const count = targetCount();
    if (pts.length !== count) {
      makePts();
      return;
    }
    pts.forEach(p => {
      p.x = Math.min(Math.max(p.x, 0), Math.max(W, 1));
      p.y = Math.min(Math.max(p.y, 0), Math.max(H, 1));
    });
  }

  function makePts() {
    pts = [];
    const count = targetCount();
    for (let i = 0; i < count; i += 1) {
      pts.push({
        x: Math.random() * Math.max(W, 1),
        y: Math.random() * Math.max(H, 1),
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * 1.2 + 0.25,
        o: Math.random() * 0.28 + 0.05,
        p: Math.random() * Math.PI * 2,
      });
    }
  }

  function draw() {
    if (!running) return;

    const nextW = Math.max(Math.round(cv.clientWidth || cv.getBoundingClientRect().width || 0), 1);
    const nextH = Math.max(Math.round(cv.clientHeight || cv.getBoundingClientRect().height || 0), 1);
    if (nextW !== W || nextH !== H) {
      resize();
      syncPts();
    }

    ctx.clearRect(0, 0, W, H);
    pts.forEach((p, i) => {
      p.p += 0.005;
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      const a = p.o * (0.55 + 0.45 * Math.sin(p.p));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(109, 112, 90, ${a})`;
      ctx.fill();

      for (let j = i + 1; j < pts.length; j += 1) {
        const q = pts[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 12100) {
          const d = Math.sqrt(d2);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(109, 112, 90, ${(1 - d / 110) * 0.055})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });
    rafId = requestAnimationFrame(draw);
  }

  function start() {
    if (running) return;
    running = true;
    rafId = requestAnimationFrame(draw);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  resize();
  makePts();
  window.addEventListener("resize", queueResize);
  if (window.ResizeObserver && hero) {
    const ro = new ResizeObserver(() => queueResize());
    ro.observe(hero);
  }
  new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting) start();
    else stop();
  }).observe(cv);
}
