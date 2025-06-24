/// Dummy data with images
const dummyProduce = [
  { _id: '662f123456abcdef123401', name: 'Tomatoes', price: 20, location: 'Pune', imageUrl: '/static/images/tomato.jpg' },
  { _id: '662f123456abcdef123402', name: 'Onions', price: 15, location: 'Nashik', imageUrl: '/static/images/onion.jpg' },
  { _id: '662f123456abcdef123403', name: 'Strawberries', price: 50, location: 'Mahabaleshwar', imageUrl: '/static/images/strawberry.jpg' },
  { _id: '662f123456abcdef123404', name: 'Mango', price: 60, location: 'Ratnagiri', imageUrl: '/static/images/mango.jpg' },
  { _id: '662f123456abcdef123405', name: 'Carrot', price: 25, location: 'Ooty', imageUrl: '/static/images/carrot.jpg' },
  { _id: '662f123456abcdef123406', name: 'Eggs', price: 5, location: 'Hyderabad', imageUrl: '/static/images/eggs.jpg' },
  { _id: '662f123456abcdef123407', name: 'Bananas', price: 30, location: 'Chennai', imageUrl: '/static/images/banana.jpg' },
  { _id: '662f123456abcdef123408', name: 'Potatoes', price: 18, location: 'Agra', imageUrl: '/static/images/potato.jpg' },
  { _id: '662f123456abcdef123409', name: 'Apples', price: 80, location: 'Shimla', imageUrl: '/static/images/apple.jpg' },
  { _id: '662f123456abcdef12340a', name: 'Cabbage', price: 22, location: 'Bengaluru', imageUrl: '/static/images/cabbage.jpg' }
];




// Load products for homepage (index.html)
function loadHomeProduce() {
  const container = document.getElementById('produce-container');
  if (!container) return;
  container.innerHTML = '';

  dummyProduce.slice(0, 10).forEach(item => {
    const card = document.createElement('div');
    card.className = 'produce-card';
    card.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}">
      <div class="produce-info">
        <h3>${item.name}</h3>
        <p>₹${item.price}/kg</p>
        <p>${item.location}</p>
        <a href="/signup" class="view-details-btn">View Details</a>

      </div>
    `;
    container.appendChild(card);
  });
}



// Load all products for all_products.html
function loadAllProduce() {
    const container = document.getElementById('all-produce-container');
    if (!container) return; // Safety check
    container.innerHTML = '';

    dummyProduce.forEach(item => {
        const card = document.createElement('div');
        card.className = 'produce-card';
        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}">
            <div class="produce-info">
                <h3>${item.name}</h3>
                <p>₹${item.price}/kg</p>
                <p>${item.location}</p>
                <button class="buy-btn">Buy Now</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Form submission - locally add new produce
document.addEventListener('DOMContentLoaded', () => {
    const produceForm = document.getElementById('produceForm');
    if (produceForm) {
        produceForm.addEventListener('submit', (e) => {
            e.preventDefault();
    
            const name = document.getElementById('name').value;
            const price = document.getElementById('price').value;
            const location = document.getElementById('location').value;
    
            dummyProduce.push({ 
                name, 
                price, 
                location, 
                imageUrl: 'images/default-produce.jpg' // default image
            });
    
            alert('Produce listed successfully!');
            closeListingForm();
            loadHomeProduce(); // reload home produce
        });
    }

    // Check which page we are on
    if (document.getElementById('produce-container')) {
        loadHomeProduce();
    } else if (document.getElementById('all-produce-container')) {
        loadAllProduce();
    }
});

// Modal open and close functions
function openListingForm() {
    document.getElementById('listing-form').style.display = 'block';
}

function closeListingForm() {
    document.getElementById('listing-form').style.display = 'none';
}

// Dummy Farmers Data (Indian Version)
const dummyFarmers = [
    {
      name: "Sundaram Organic Farms",
      location: "Nashik, Maharashtra",
      description: "Organic fruits and vegetables grown with sustainable practices.",
      productsAvailable: 32,
      imageUrl: "/static/images/farmer1.jpg"
    },
    {
      name: "Amrit Dairy Farm",
      location: "Ludhiana, Punjab",
      description: "Fresh desi cow milk and dairy products delivered daily.",
      productsAvailable: 18,
      imageUrl: "/static/images/farmer2.jpg"
    },
    {
      name: "Green Harvest Plantations",
      location: "Ooty, Tamil Nadu",
      description: "Premium tea leaves, carrots, and fresh produce straight from the hills.",
      productsAvailable: 25,
      imageUrl: "/static/images/farmer3.jpg"
    },
    {
      name: "Mango Valley Orchards",
      location: "Ratnagiri, Maharashtra",
      description: "Authentic Alphonso mangoes and farm-fresh cashews.",
      productsAvailable: 15,
      imageUrl: "/static/images/farmer4.jpg"
    }
  ];
  
  // Function to load farmers dynamically
  function loadFarmers() {
    const container = document.getElementById('farmers-container');
    if (!container) return;
  
    container.innerHTML = '';
  
    dummyFarmers.forEach(farmer => {
      const card = document.createElement('div');
      card.className = 'farmer-card';
      card.innerHTML = `
        <img src="${farmer.imageUrl}" alt="${farmer.name}">
        <div class="farmer-info">
          <h3>${farmer.name}</h3>
          <p class="location">${farmer.location}</p>
          <p class="description">${farmer.description}</p>
          <p class="products-available">${farmer.productsAvailable} Products Available</p>
        </div>
      `;
      container.appendChild(card);
    });
  }
  
  // Load farmers on page load
  window.addEventListener('DOMContentLoaded', loadFarmers);
  
// Dummy Customer Reviews
const dummyCustomers = [
    {
      name: "Robert Downey Jr",
      review: "FarmConnect brings the farm to my table. Super fresh and very affordable!",
      imageUrl: "/static/images/customer1.jpg"
    },
    {
      name: "Shradha Kapoor",
      review: "Loved the mangoes from Ratnagiri! Thanks to the farmers and FarmConnect!",
      imageUrl: "/static/images/customer2.jpg"
    },
    {
      name: "MS Dhoni",
      review: "Easy to order, transparent process, and fresh vegetables every week!",
      imageUrl: "/static/images/customer3.jpg"
    },
    {
      name: "Virat Kohli",
      review: "Highly recommend FarmConnect for authentic organic produce from Indian farms.",
      imageUrl: "/static/images/customer4.jpg"
    }
  ];
  
  // Function to load customers dynamically
  function loadCustomers() {
    const container = document.getElementById('customers-container');
    if (!container) return;
  
    container.innerHTML = '';
  
    dummyCustomers.forEach(customer => {
      const card = document.createElement('div');
      card.className = 'customer-card';
      card.innerHTML = `
        <img src="${customer.imageUrl}" alt="${customer.name}" class="customer-photo">
        <h3 class="customer-name">${customer.name}</h3>
        <p class="customer-review">"${customer.review}"</p>
      `;
      container.appendChild(card);
    });
  }
  
  // Load customers on page load
  window.addEventListener('DOMContentLoaded', () => {
    loadFarmers();
    loadCustomers();
  });
  