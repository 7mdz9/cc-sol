export function initGoodsInteractions() {
  const items = Array.from(document.querySelectorAll(".merch-item"));
  if (items.length === 0) return;

  const closeAll = except => {
    items.forEach(item => {
      if (item !== except) item.classList.remove("is-active");
    });
  };

  items.forEach(item => {
    const name = item.querySelector(".merch-name")?.textContent?.trim() || "Solea goods item";
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", `${name}: Coming Soon`);

    item.addEventListener("click", event => {
      event.stopPropagation();
      const willOpen = !item.classList.contains("is-active");
      closeAll(item);
      item.classList.toggle("is-active", willOpen);
    });

    item.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      const willOpen = !item.classList.contains("is-active");
      closeAll(item);
      item.classList.toggle("is-active", willOpen);
    });
  });

  document.addEventListener("click", () => closeAll());
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeAll();
  });
}
