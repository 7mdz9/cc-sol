export function initReveal() {
  const els = Array.from(document.querySelectorAll(".rv, .divider"));

  if (!("IntersectionObserver" in window) || els.length === 0) {
    els.forEach(el => el.classList.add("in"));
    return;
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  els.forEach(el => obs.observe(el));

  window.requestAnimationFrame(() => {
    els.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("in");
      }
    });
  });
}
