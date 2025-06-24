// Dummy Dashboard Stats
document.getElementById('productsCount').textContent = 5;
document.getElementById('ordersCount').textContent = 3;
document.getElementById('messagesCount').textContent = 2;

// Modal Logic
const modal = document.getElementById('productModal');
const form = document.getElementById('productForm');

function openForm() {
  modal.style.display = 'flex';
}

function closeForm() {
  modal.style.display = 'none';
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const [nameInput, priceInput, categoryInput] = form.querySelectorAll('input');
  const product = {
    name: nameInput.value,
    price: priceInput.value,
    category: categoryInput.value
  };

  console.log('New product submitted:', product);
  alert(`✅ "${product.name}" added successfully!`);

  form.reset();
  closeForm();
});

window.addEventListener('click', function (e) {
  if (e.target === modal) closeForm();
});
