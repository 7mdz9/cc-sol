let currentItemId = null;

export function initOrderPreview(menuData) {
  const empty = document.querySelector(".preview-empty");
  const populated = document.querySelector(".preview-populated");
  const webpSource = document.getElementById("previewWebp");
  const img = document.getElementById("previewImg");
  const nameEl = document.getElementById("previewName");
  const calEl = document.getElementById("previewCal");
  const priceEl = document.getElementById("previewPrice");

  const items = menuData.categories.flatMap(c => c.items);
  const itemsById = Object.fromEntries(items.map(i => [i.id, i]));

  document.getElementById("orderMenu").addEventListener("click", e => {
    const btn = e.target.closest(".item");
    if (!btn) return;

    const id = btn.dataset.itemId;
    const item = itemsById[id];
    if (!item) return;
    currentItemId = id;

    // Swap empty → populated
    empty.hidden = true;
    populated.hidden = false;

    // Responsive images using local optimized variants
    const base = `public/assets/menu/optimized/${item.image}`;
    webpSource.srcset = `${base}-480.webp 480w, ${base}-800.webp 800w, ${base}-1200.webp 1200w`;
    webpSource.sizes = "(max-width: 640px) 480px, (max-width: 1024px) 600px, 800px";
    img.src = `${base}-800.jpg`;
    img.srcset = `${base}-480.jpg 480w, ${base}-800.jpg 800w, ${base}-1200.jpg 1200w`;
    img.sizes = webpSource.sizes;
    img.alt = item.name;

    nameEl.textContent = item.name;
    calEl.textContent = item.calories;
    priceEl.textContent = item.priceAed;

    // Highlight active item
    document.getElementById("orderMenu").querySelectorAll(".item").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
}

export function getCurrentItemId() {
  return currentItemId;
}
