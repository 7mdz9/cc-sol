export function initNav() {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("nav-toggle");
  const overlay = document.getElementById("nav-overlay");

  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if (!(toggle instanceof HTMLButtonElement) || !overlay) return;

  const setOpen = open => {
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    overlay.classList.toggle("is-open", open);
    overlay.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.style.overflow = open ? "hidden" : "";
  };

  toggle.addEventListener("click", () => {
    setOpen(!overlay.classList.contains("is-open"));
  });

  overlay.querySelectorAll("[data-nav-close]").forEach(el => {
    el.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && overlay.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
}
