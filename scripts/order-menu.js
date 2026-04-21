export async function initOrderMenu() {
  const container = document.getElementById("orderMenu");
  if (!container) return;

  const res = await fetch("./data/menu.json");
  const { categories } = await res.json();

  // Calorie toggle row + category list
  container.innerHTML = `
    <div class="cal-row">
      <span class="cal-lbl">Show Calories</span>
      <label class="sw">
        <input type="checkbox" id="orderCalSw"/>
        <div class="sw-track"></div>
        <div class="sw-thumb"></div>
      </label>
    </div>
    ${categories.map((cat, idx) => `
      <div class="cat${idx === 0 ? " open" : ""}" data-cat-id="${cat.id}">
        <div class="cat-hd">
          <span class="cat-nm">${cat.name}</span>
          <span class="cat-ct">${cat.items.length} items</span>
          <div class="cat-ic">+</div>
        </div>
        <div class="cat-body">
          ${cat.items.map(item => `
            <div class="item"
                 data-item-id="${item.id}"
                 data-name="${item.name}"
                 data-cal="${item.calories}"
                 data-price="${item.priceAed}"
                 data-image="${item.image}">
              <div class="item-dot"></div>
              <div class="item-info">
                <div class="item-nm">${item.name}</div>
                ${item.subtitle ? `<div class="item-note">${item.subtitle}</div>` : ""}
              </div>
              <div class="item-r">
                <span class="item-kcal"><strong>${item.calories}</strong> kcal</span>
                <span class="item-price">${item.priceAed} AED</span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `).join("")}
  `;

  // Accordion — scoped to this container so it doesn't affect main-site cats
  container.querySelectorAll(".cat-hd").forEach(hd => {
    hd.addEventListener("click", () => {
      const cat = hd.closest(".cat");
      const willOpen = !cat.classList.contains("open");
      container.querySelectorAll(".cat").forEach(c => c.classList.remove("open"));
      if (willOpen) cat.classList.add("open");
    });
  });

  // Calorie toggle — scoped to this container
  document.getElementById("orderCalSw").addEventListener("change", function() {
    container.querySelectorAll(".item-kcal").forEach(el => el.classList.toggle("show", this.checked));
  });
}
