import { addItem } from "./cart.js";

let currentItemId = null;
let itemsById = {};

export function initOrderPreview(menuData) {
  const menu = document.getElementById("orderMenu");
  const empty = document.querySelector(".preview-empty");
  const populated = document.querySelector(".preview-populated");
  const webpSource = document.getElementById("previewWebp");
  const img = document.getElementById("previewImg");
  const nameEl = document.getElementById("previewName");
  const calEl = document.getElementById("previewCal");
  const priceEl = document.getElementById("previewPrice");
  const btnAdd = document.getElementById("btnAddCart");

  const items = menuData.categories.flatMap(c => c.items);
  itemsById = Object.fromEntries(items.map(i => [i.id, i]));

  function showPreview() {
    empty.hidden = true;
    populated.hidden = false;
  }

  function selectItem(btn) {
    const id = btn.dataset.itemId;
    const item = itemsById[id];
    if (!item) return;
    currentItemId = id;

    showPreview();

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

    menu.querySelectorAll(".item").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  }

  menu.addEventListener("click", e => {
    const btn = e.target.closest(".item");
    if (!btn) return;
    selectItem(btn);
  });

  const firstItem = menu.querySelector(".item");
  if (firstItem) selectItem(firstItem);

  // Add to Cart
  btnAdd.addEventListener("click", () => {
    if (!currentItemId) return;
    const item = itemsById[currentItemId];
    if (item) addItem(item);
  });
}

export function getCurrentItemId() {
  return currentItemId;
}
