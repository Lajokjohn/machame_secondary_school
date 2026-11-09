const products = [
  {
    id: 1,
    name: "Garden Tomatoes",
    category: "Vegetables",
    price: 4500,
    unit: "per basket",
    tag: "Fresh harvest",
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 2,
    name: "Sweet Bell Peppers",
    category: "Vegetables",
    price: 2500,
    unit: "per basket",
    tag: "Student picked",
    image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 3,
    name: "Fresh Spinach",
    category: "Vegetables",
    price: 1500,
    unit: "per bunch",
    tag: "Organic",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 4,
    name: "Seasonal Avocados",
    category: "Fruits",
    price: 5200,
    unit: "per basket",
    tag: "In season",
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 5,
    name: "Garden Carrots",
    category: "Vegetables",
    price: 2000,
    unit: "per bundle",
    tag: "Crisp",
    image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 6,
    name: "School Herb Mix",
    category: "Garden goods",
    price: 10000,
    unit: "per bunch",
    tag: "Home grown",
    image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 7,
    name: "Red Onions",
    category: "Vegetables",
    price: 4000,
    unit: "per basket",
    tag: "Local",
    image: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 8,
    name: "Seedling Kit",
    category: "Garden goods",
    price: 5000,
    unit: "per pack",
    tag: "Beginner kit",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80"
  }
];

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const filterRow = document.getElementById("filterRow");
const productCount = document.getElementById("productCount");
const emptyMessage = document.getElementById("emptyMessage");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartFooter = document.getElementById("cartFooter");
const cartTotal = document.getElementById("cartTotal");
const cartHeadingCount = document.getElementById("cartHeadingCount");
const toast = document.getElementById("toast");

let activeCategory = "All";
let cart = {};

function activateImageFallbacks(container = document) {
  container.querySelectorAll("img[data-fallback]").forEach((image) => {
    image.addEventListener("error", () => {
      image.src = image.dataset.fallback;
      image.classList.add("image-fallback");
    }, { once: true });
  });
}

function money(value) {
  return `TZS ${value.toLocaleString("en-TZ")}`;
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = products.filter((product) => {
    const categoryMatch = activeCategory === "All" || product.category === activeCategory;
    const searchMatch =
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query);

    return categoryMatch && searchMatch;
  });

  productGrid.innerHTML = filtered
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-image-wrap">
            <img src="${product.image}" data-fallback="images/garden.jpg" alt="${product.name}" loading="lazy" />
            <span class="product-tag">${product.tag}</span>
          </div>
          <div class="product-info">
            <span class="product-category">${product.category}</span>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-bottom">
              <div>
                <span class="product-price">${money(product.price)}</span>
                <span class="product-unit">${product.unit}</span>
              </div>
              <button type="button" class="add-button" data-id="${product.id}" aria-label="Add ${product.name} to cart">+</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  activateImageFallbacks(productGrid);
  productCount.textContent = `${filtered.length} products`;
  emptyMessage.hidden = filtered.length !== 0;
}

function renderCart() {
  const entries = Object.entries(cart);
  const itemCount = entries.reduce((sum, [, qty]) => sum + qty, 0);
  const total = entries.reduce((sum, [id, qty]) => {
    const product = products.find((p) => p.id === Number(id));
    return sum + product.price * qty;
  }, 0);

  cartCount.textContent = itemCount;
  cartHeadingCount.textContent = `(${itemCount})`;
  cartEmpty.hidden = itemCount > 0;
  cartFooter.hidden = itemCount === 0;
  cartTotal.textContent = money(total);

  cartItems.innerHTML = entries
    .map(([id, qty]) => {
      const product = products.find((p) => p.id === Number(id));
      return `
        <div class="cart-row">
          <img src="${product.image}" data-fallback="images/garden.jpg" alt="${product.name}" />
          <div>
            <h3>${product.name}</h3>
            <p>${money(product.price)} • ${product.unit}</p>
            <div class="quantity-controls">
              <button type="button" data-change="${product.id}" data-delta="-1" aria-label="Decrease quantity">−</button>
              <span>${qty}</span>
              <button type="button" data-change="${product.id}" data-delta="1" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <span class="cart-row-price">${money(product.price * qty)}</span>
        </div>
      `;
    })
    .join("");

  activateImageFallbacks(cartItems);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function openCart() {
  document.body.classList.add("cart-open");
  document.getElementById("cartPanel").setAttribute("aria-hidden", "false");
}

function closeCart() {
  document.body.classList.remove("cart-open");
  document.getElementById("cartPanel").setAttribute("aria-hidden", "true");
}

filterRow.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;
  document.querySelectorAll(".filter-button").forEach((item) => {
    item.classList.toggle("active", item === button);
  });

  renderProducts();
});

searchInput.addEventListener("input", renderProducts);

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-id]");
  if (!addButton) return;

  const id = Number(addButton.dataset.id);
  const product = products.find((item) => item.id === id);

  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  showToast(`${product.name} added to cart`);
});

cartItems.addEventListener("click", (event) => {
  const changeButton = event.target.closest("[data-change]");
  if (!changeButton) return;

  const id = Number(changeButton.dataset.change);
  const delta = Number(changeButton.dataset.delta);
  const current = cart[id] || 0;
  const next = current + delta;

  if (next <= 0) {
    delete cart[id];
  } else {
    cart[id] = next;
  }

  renderCart();
});

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("cartBackdrop").addEventListener("click", closeCart);
document.getElementById("browseShop").addEventListener("click", closeCart);

document.getElementById("checkoutButton").addEventListener("click", () => {
  const order = Object.entries(cart).map(([id, quantity]) => {
    const product = products.find((item) => item.id === Number(id));
    return {
      name: product.name,
      price: product.price,
      unit: product.unit,
      quantity
    };
  });

  sessionStorage.setItem("machameOrder", JSON.stringify(order));
  window.location.href = "form.html";
});

document.getElementById("year").textContent = new Date().getFullYear();

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body.classList.contains("cart-open")) {
    closeCart();
  }
});

activateImageFallbacks();
renderProducts();
renderCart();