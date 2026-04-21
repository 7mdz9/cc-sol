export function initNav() {
  const nav = document.getElementById("mainNav");
  if (!nav) return;

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", scrollY > 50);
  });
}
