const products = [
  { name: 'Tomatoes', price: 20, category: 'Vegetables', image: '/static/images/tomato.jpg' },
  { name: 'Onions', price: 18, category: 'Vegetables', image: '/static/images/onion.jpg' },
  { name: 'Potato', price: 22, category: 'Vegetables', image: '/static/images/potato.jpg' },
  { name: 'Cabbage', price: 25, category: 'Vegetables', image: '/static/images/cabbage.jpg' },
  { name: 'Carrot', price: 30, category: 'Vegetables', image: '/static/images/carrot.jpg' },
  { name: 'Strawberries', price: 60, category: 'Fruits', image: '/static/images/strawberry.jpg' },
  { name: 'Apples', price: 50, category: 'Fruits', image: '/static/images/apple.jpg' },
  { name: 'Banana', price: 40, category: 'Fruits', image: '/static/images/banana.jpg' },
  { name: 'Oranges', price: 45, category: 'Fruits', image: '/static/images/oranges.jpg' },
  { name: 'Pears', price: 65, category: 'Fruits', image: '/static/images/pears.jpg' },
  { name: 'Milk', price: 45, category: 'Dairy', image: '/static/images/milk.jpg' },
  { name: 'Paneer', price: 80, category: 'Dairy', image: '/static/images/paneer.jpg' },
  { name: 'Wheat', price: 40, category: 'Grains', image: '/static/images/wheat.jpg' },
  { name: 'Rice', price: 50, category: 'Grains', image: '/static/images/rice.jpg' },
  { name: 'Barley', price: 35, category: 'Grains', image: '/static/images/barley.jpg' },
  { name: 'Honey', price: 250, category: 'Honey', image: '/static/images/honey.jpg' },
  { name: 'Eggs', price: 70, category: 'Eggs', image: '/static/images/eggs.jpg' },
  { name: 'Chicken', price: 160, category: 'Meat', image: '/static/images/meat.jpg' },
  { name: 'Basil', price: 30, category: 'Herbs', image: '/static/images/herbs.jpg' },
  { name: 'Avocado', price: 120, category: 'Imported', image: '/static/images/avocado.jpg' }
];

let filtered = [...products];
let selectedCategory = "All";
let cart = JSON.parse(localStorage.getItem("cart")) || {};

function displayProducts(productList) {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';

  if (productList.length === 0) {
    grid.innerHTML = '<p style="padding:1rem;">No products match your filters.</p>';
    return;
  }

  productList.forEach(product => {
    const quantity = cart[product.name] || 0;

    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="price">₹${product.price}</p>

        <div class="product-controls">
          <div class="qty-box">
            <button onclick="updateQty('${product.name}', -1)">−</button>
            <span id="qty-${product.name}">${quantity}</span>
            <button onclick="updateQty('${product.name}', 1)">+</button>
          </div>
          <button class="add-cart-btn" onclick="addToCart('${product.name}')">Add to Cart</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function updateQty(productName, change) {
  if (!cart[productName]) cart[productName] = 0;
  cart[productName] = Math.max(0, cart[productName] + change);
  document.getElementById(`qty-${productName}`).textContent = cart[productName];
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(productName) {
  if (!cart[productName]) {
    cart[productName] = 1;
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${productName} added to cart (Qty: ${cart[productName]})`);
}

function selectCategory(cat) {
  selectedCategory = cat;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.includes(cat)) btn.classList.add('active');
  });
  applyFilters();
}

function updatePriceLabel() {
  const price = document.getElementById('priceRange').value;
  document.getElementById('maxPrice').textContent = price;
}

function applyFilters() {
  const maxPrice = 100000; // set a large value since range slider is disabled

  const search = document.getElementById('searchInput').value.toLowerCase();
document.getElementById('sortSelect')?.addEventListener('change', applyFilters);

  filtered = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesPrice = p.price <= maxPrice;
    const matchesSearch = p.name.toLowerCase().includes(search);
    return matchesCategory && matchesPrice && matchesSearch;
  });

  sortProducts(); // reapply sort after filter
  displayProducts(filtered);
}

function sortProducts() {
  const sortType = document.getElementById("sortSelect")?.value || "";
  if (sortType === "low-high") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortType === "high-low") {
    filtered.sort((a, b) => b.price - a.price);
  }
  console.log("Sorting:", sortType, filtered.map(p => p.price));

}


document.addEventListener('DOMContentLoaded', () => {
  displayProducts(filtered);
  document.getElementById('searchInput').addEventListener('input', applyFilters);
  document.getElementById('sortSelect')?.addEventListener('change', applyFilters);
});
