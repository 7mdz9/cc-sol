export async function initOrderMenu(menuData) {
  const container = document.getElementById("orderMenu");
  if (!container) return;
  const data = menuData || await fetch("./data/menu.json").then(res => res.json());
  const { categories } = data;

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
          <span class="cat-ct"><span class="cat-ct-num">${cat.items.length}</span><span class="cat-ct-unit">items</span></span>
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
                <span class="item-kcal"><span class="item-kcal-num">${item.calories}</span><span class="item-kcal-unit">kcal</span></span>
                <span class="item-price"><span class="item-price-num">${item.priceAed}</span><span class="item-price-unit">AED</span></span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `).join("")}
  `;

  // Accordion — scoped to this container
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
