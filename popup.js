// Close sidebar functionality
document.getElementById("closeBtn").addEventListener("click", () => {
  window.parent.postMessage({ type: 'CLOSE_SIDEBAR' }, '*');
});
// On load, check local storage for theme
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  const isDark = savedTheme === "dark";
  document.getElementById("themeToggle").checked = isDark;
  document.body.classList.toggle("dark-mode", isDark);
});

document.getElementById("themeToggle").addEventListener("change", (e) => {
  const isDark = e.target.checked;
  document.body.classList.toggle("dark-mode", isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Search when button is clicked or Enter is pressed
document.getElementById("scrapeBtn").addEventListener("click", performSearch);
document.getElementById("searchInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") performSearch();
});

// Sorting + filter change handlers
document.getElementById("sortPriceSelect").addEventListener("change", () => {
  if (window._lastFetchedProducts) displayResults(window._lastFetchedProducts);
});
document.getElementById("sortRating").addEventListener("change", () => {
  if (window._lastFetchedProducts) displayResults(window._lastFetchedProducts);
});
document.getElementById("themeToggle").addEventListener("change", (e) => {
  const darkMode = e.target.checked;
  document.body.classList.toggle("dark-mode", darkMode);
});

// document.getElementById("freeDelivery").addEventListener("change", () => {
//   if (window._lastFetchedProducts) displayResults(window._lastFetchedProducts);
// });

// Perform Amazon product search
async function performSearch() {
  const query = document.getElementById("searchInput").value.trim();
  const container = document.getElementById("results");

  container.innerHTML = `
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Searching for "${query}"...</p>
    </div>
  `;

  if (!query) {
    container.innerHTML = '<div class="error-state">Please enter a search term</div>';
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/scrape?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error(`Amazon returned status ${response.status}`);
    }

    const data = await response.json();
    window._lastFetchedProducts = data.products;

    if (data.products?.length > 0) {
      displayResults(data.products);
    } else {
      container.innerHTML = '<div class="error-state">No products found</div>';
    }
  } catch (error) {
    console.error("Search failed:", error);
    container.innerHTML = `
      <div class="error-state">
        <strong>Error:</strong> ${error.message}<br>
        ${error.message.includes('Failed to fetch') ? 
          'Make sure your local server is running (http://localhost:5000)' : ''}
      </div>
    `;
  }
}

// Display product results
function displayResults(products) {
  const container = document.getElementById("results");
  const priceSort = document.getElementById("sortPriceSelect").value;
  const sortRating = document.getElementById("sortRating").checked;
  // const freeDelivery = document.getElementById("freeDelivery").checked;

  let filteredProducts = [...products];

  // if (freeDelivery) {
  //   filteredProducts = filteredProducts.filter(p => p.freeDelivery);
  // }

  if (priceSort === "asc") {
    filteredProducts.sort((a, b) => {
      const priceA = parseFloat(a.price?.replace(/[^0-9.]/g, '') || 0);
      const priceB = parseFloat(b.price?.replace(/[^0-9.]/g, '') || 0);
      return priceA - priceB;
    });
  } else if (priceSort === "desc") {
    filteredProducts.sort((a, b) => {
      const priceA = parseFloat(a.price?.replace(/[^0-9.]/g, '') || 0);
      const priceB = parseFloat(b.price?.replace(/[^0-9.]/g, '') || 0);
      return priceB - priceA;
    });
  }

  if (sortRating) {
    filteredProducts.sort((a, b) => {
      const ratingA = parseFloat(a.rating || 0);
      const ratingB = parseFloat(b.rating || 0);
      return ratingB - ratingA;
    });
  }

  container.innerHTML = filteredProducts.map(product => `
    <a href="${product.url || '#'}"
       target="_blank"
       class="product-card"
       rel="noopener noreferrer">
      <img src="${product.image || 'placeholder.jpg'}"
           alt="${product.name}"
           onerror="this.src='placeholder.jpg'">
      <div class="product-info">
        <h3 class="product-title">${truncate(product.name, 60)}</h3>
        <div class="product-price">${product.price || 'N/A'}</div>
        ${product.rating ? `
        <div class="product-rating">
          <span class="rating-value">${product.rating}</span>
          <span class="star-icon">★</span>
        </div>` : ''}
        ${product.source ? `<div class="source-tag">${product.source}</div>` : ''}

      </div>
    </a>
  `).join('');
}

// Truncate long product names
function truncate(str, n) {
  return str.length > n ? str.substring(0, n - 1) + '...' : str;
}

// Handle broken images
document.addEventListener('error', function (e) {
  if (e.target.tagName === 'IMG' && e.target.classList.contains('product-img')) {
    e.target.src = 'placeholder.jpg';
  }
}, true);
