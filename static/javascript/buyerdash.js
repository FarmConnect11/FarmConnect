/*const products = [
  { name: 'Tomatoes', price: 20, category: 'Vegetables', image: '/static/images/tomato.jpg' },
  { name: 'Banana', price: 40, category: 'Fruits', image: '/static/images/banana.jpg' },
  { name: 'Milk', price: 45, category: 'Dairy', image: '/static/images/milk.jpg' },
  { name: 'Honey', price: 250, category: 'Honey', image: '/static/images/honey.jpg' },
];

let selectedCategory = "All";
let cart = JSON.parse(localStorage.getItem("cart")) || {};
let filtered = [...products];

function displayProducts(productList) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  if (productList.length === 0) {
    grid.innerHTML = '<p style="padding:1rem;">No products match your filters.</p>';
    return;
  }

  productList.forEach(product => {
    const qty = cart[product.name] || 0;

    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="price">₹${product.price}</p>
        <div class="product-controls">
          <div class="qty-box">
            <button onclick="updateQty('${product.name}', -1)">−</button>
            <span id="qty-${product.name}">${qty}</span>
            <button onclick="updateQty('${product.name}', 1)">+</button>
          </div>
          <button class="add-cart-btn" onclick="addToCart('${product.name}')">Add to Cart</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}
*/
/*
window.addEventListener("DOMContentLoaded", () => {
  updateCartBadge(0);  // force cart to zero if redirected after checkout
});
*/
// ─── Clear local cart when landing on dashboard ─────────────────────────
// ─── Clear cart on dashboard load ──────────────────────────────────────
if (window.location.pathname === "/buyerdash") {
  localStorage.removeItem("cart"); // optional cleanup
}

// ─── State Variables ───────────────────────────────────────────────────
let selectedCategory = "all";
let allProductCards = [];

// ─── DOM Ready ─────────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  allProductCards = Array.from(document.querySelectorAll(".product-card"));
  renderCards(allProductCards);

  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");

  if (searchInput) searchInput.addEventListener("input", applyFilters);
  if (sortSelect) sortSelect.addEventListener("change", applyFilters);

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedCategory = btn.textContent.replace("✔", "").trim().toLowerCase();
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilters();
    });
  });

  updateCartBadge();
  setupAddToCartForms();
});

// ─── Render Filtered Cards ─────────────────────────────────────────────
function renderCards(cards) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  if (!cards.length) {
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#777;">
      No products match your filters.</p>`;
    return;
  }

  cards.forEach(card => grid.appendChild(card));
}

// ─── Apply Filters and Sort ────────────────────────────────────────────
function applyFilters() {
  const query = (document.getElementById("searchInput")?.value || "").toLowerCase();
  const sort = document.getElementById("sortSelect")?.value;

  let filtered = allProductCards.filter(card => {
    const name = card.dataset.name.toLowerCase();
    const category = card.dataset.category.toLowerCase();
    return name.includes(query) && (selectedCategory === "all" || category === selectedCategory);
  });

  if (sort === "low-high") {
    filtered.sort((a, b) => +a.dataset.price - +b.dataset.price);
  } else if (sort === "high-low") {
    filtered.sort((a, b) => +b.dataset.price - +a.dataset.price);
  }

  renderCards(filtered);
}

// ─── Update Quantity Buttons ───────────────────────────────────────────
function updateQty(productId, delta) {
  const qtySpan = document.getElementById(`qty-${productId}`);
  const input = document.getElementById(`qty-input-${productId}`);
  let qty = parseInt(qtySpan.innerText) || 1;

  qty += delta;
  if (qty < 1) qty = 1;

  qtySpan.innerText = qty;
  input.value = qty;
}

// ─── Update Cart Badge ─────────────────────────────────────────────────
function updateCartBadge(countFromServer = null) {
  const badge = document.getElementById("cartBadge");
  const cartLink = document.getElementById("cart-link");

  if (!badge) return;

  const count = countFromServer !== null ? countFromServer : 0;
  badge.textContent = count;
  badge.style.display = count > 0 ? "inline-block" : "none";

  if (cartLink) cartLink.classList.remove("disabled");
}

// ─── Toast Message ─────────────────────────────────────────────────────
function showToast(message) {
  const container = document.getElementById("js-toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}

// ─── Setup Add to Cart Form AJAX Submission ────────────────────────────
function setupAddToCartForms() {
  document.querySelectorAll(".add-to-cart-form").forEach(form => {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const productId = form.dataset.productId;
      const qtyInput = document.getElementById(`qty-input-${productId}`);
      const quantity = qtyInput ? qtyInput.value : 1;

      try {
        const response = await fetch(`/add-to-cart/${productId}`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ quantity })
        });

        const data = await response.json();

        if (data.error) {
          showToast(data.error);
          return;
        }

        showToast(data.message);
        qtyInput.value = 1;
        updateCartBadge(data.cart_count);
      } catch (err) {
        console.error("Add to cart failed:", err);
        showToast("Something went wrong. Try again.");
      }
    });
  });
}
