import { ORDERS_STORAGE_KEY } from "./admin-config.js";

const DEMO_BASE = {
  branches: [
    { slug: "bluewaters-island", name: "Bluewaters Island" },
    { slug: "mamsha-al-saadiyat", name: "Mamsha Al Saadiyat" },
    { slug: "kite-beach", name: "Kite Beach" },
    { slug: "yas-bay", name: "Yas Bay" },
    { slug: "al-bateen-ladies-club", name: "Al Bateen Ladies Club" }
  ],
  items: [
    { id: "sparkling-fruit-drink", name: "Sparkling Fruit Drink", category: "Drinks", priceAed: 35 },
    { id: "iced-fruit-tea", name: "Iced Fruit Tea", category: "Drinks", priceAed: 32 },
    { id: "acai-smoothie", name: "Açaí Smoothie", category: "Drinks", priceAed: 45 },
    { id: "mango-passion-fruit-juice", name: "Mango Passion Fruit Juice", category: "Tropical", priceAed: 42 },
    { id: "tropical-sunset-juice", name: "Tropical Sunset Juice", category: "Tropical", priceAed: 46 },
    { id: "banana-date-smoothie", name: "Banana Date Smoothie", category: "Smoothies", priceAed: 42 },
    { id: "avocado-honey-smoothie", name: "Avocado Honey Smoothie", category: "Smoothies", priceAed: 48 },
    { id: "mango-coconut-ice-cream", name: "Mango Coconut Ice Cream", category: "Ice Cream & Sorbet", priceAed: 45 },
    { id: "fruit-sushi", name: "Fruit Sushi", category: "Desserts", priceAed: 55 },
    { id: "watermelon-pizza", name: "Watermelon Pizza", category: "Desserts", priceAed: 60 }
  ],
  customers: [
    { name: "Noor Al Mazrouei", phone: "+971 50 318 4421" },
    { name: "Mariam Al Suwaidi", phone: "+971 56 214 9810" },
    { name: "Omar Al Kaabi", phone: "+971 52 995 1470" },
    { name: "Salma Al Marzooqi", phone: "+971 54 628 7119" },
    { name: "Khalid Al Nuaimi", phone: "+971 50 774 2305" },
    { name: "Hessa Al Mansoori", phone: "+971 58 402 6618" }
  ],
  methods: ["card", "apple-pay", "cash"]
};

export function seedDemoOrders() {
  const now = Date.now();
  const orders = Array.from({ length: 22 }, (_, index) => buildOrder(index, now));
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  window.dispatchEvent(new StorageEvent("storage", {
    key: ORDERS_STORAGE_KEY,
    newValue: JSON.stringify(orders)
  }));
  return orders.length;
}

export function clearDemoOrders() {
  localStorage.removeItem(ORDERS_STORAGE_KEY);
  window.dispatchEvent(new StorageEvent("storage", {
    key: ORDERS_STORAGE_KEY,
    newValue: null
  }));
}

function buildOrder(index, now) {
  const branch = DEMO_BASE.branches[index % DEMO_BASE.branches.length];
  const customer = DEMO_BASE.customers[index % DEMO_BASE.customers.length];
  const paymentMethod = DEMO_BASE.methods[index % DEMO_BASE.methods.length];
  const submittedAt = new Date(now - (index * 7.5 * 60 * 60 * 1000) - ((index % 4) * 24 * 60 * 60 * 1000));
  const lineItems = [
    DEMO_BASE.items[index % DEMO_BASE.items.length],
    DEMO_BASE.items[(index + 3) % DEMO_BASE.items.length]
  ].map((item, lineIndex) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    priceAed: item.priceAed,
    quantity: lineIndex === 0 ? ((index % 3) + 1) : ((index + 1) % 2) + 1
  }));

  const subtotal = lineItems.reduce((sum, item) => sum + (item.priceAed * item.quantity), 0);
  const payment = paymentMethod === "cash" ? null : {
    paymentId: `mock_demo_${index + 1}`,
    method: paymentMethod,
    amount: subtotal,
    currency: "AED",
    paidAt: new Date(submittedAt.getTime() + 2 * 60 * 1000).toISOString()
  };

  return {
    orderNumber: `SLA-${String(410000 + index).slice(-6)}`,
    branch: branch.slug,
    branchName: branch.name,
    table: (index % 12) + 1,
    customer,
    items: lineItems,
    subtotal,
    paymentMethod,
    payment,
    submittedAt: submittedAt.toISOString()
  };
}
