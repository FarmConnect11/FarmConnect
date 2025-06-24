// Farmer data array
const dummyFarmers = [
    {
      name: "Ravi Kumar",
      location: "Andhra Pradesh",
      description: "Organic farmer growing fruits and vegetables.",
      productsAvailable: 12,
      imageUrl: "/static/images/farmer1.jpg"
    },
    {
      name: "Sita Reddy",
      location: "Telangana",
      description: "Specialist in dairy and poultry.",
      productsAvailable: 8,
      imageUrl: "/static/images/farmer2.jpg"
    },
    {
      name: "Mohan Das",
      location: "Tamil Nadu",
      description: "Exporter of grains and pulses.",
      productsAvailable: 15,
      imageUrl: "/static/images/farmer3.jpg"
    },
    {
      name: "Anjali Nair",
      location: "Kerala",
      description: "Eco-friendly spice cultivator.",
      productsAvailable: 10,
      imageUrl: "/static/images/farmer4.jpg"
    },
    {
      name: "Rajveer Singh",
      location: "Punjab",
      description: "Wheat and mustard farmer using drip irrigation.",
      productsAvailable: 7,
      imageUrl: "/static/images/farmer5.jpg"
    },
    {
      name: "Deepa Joshi",
      location: "Uttarakhand",
      description: "Mountain herbs and flowers grower.",
      productsAvailable: 5,
      imageUrl: "/static/images/farmer6.jpg"
    },
    {
      name: "Vikram Patel",
      location: "Gujarat",
      description: "Specializes in cotton and groundnut farming.",
      productsAvailable: 9,
      imageUrl: "/static/images/farmer7.jpg"
    },
    {
      name: "Lakshmi Menon",
      location: "Karnataka",
      description: "Produces organic coffee and pepper.",
      productsAvailable: 11,
      imageUrl: "/static/images/farmer8.jpg"
    },
    {
      name: "Surya Prakash",
      location: "Andhra Pradesh",
      description: "Renowned for premium mangoes and seasonal fruits.",
      productsAvailable: 14,
      imageUrl: "/static/images/farmer9.jpg"
    }
  ];
  
  // Load farmers into the grid
  function loadFarmers(containerId) {
    const container = document.getElementById(containerId);
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
  
  // Run after DOM is ready
  window.addEventListener('DOMContentLoaded', () => {
    loadFarmers('all-farmers-container');
  });
  