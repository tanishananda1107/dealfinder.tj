const list = document.getElementById("product-list");
const freeDelivery = document.getElementById("freeDelivery");
const fastDelivery = document.getElementById("fastDelivery");
const sort = document.getElementById("sort");
const query = decodeURIComponent(document.getElementById("shopping-sidebar").getAttribute("data-query"));

async function fetchProducts() {
  const apiKey = "fed0ed6acaf907adff083ed48fcc13d5c1c3cd5a741d49ad432c9e8364e2a114"; // replace with your actual SerpAPI key
  const response = await fetch(`https://serpapi.com/search.json?engine=google_shopping&q=${query}&api_key=${apiKey}`);
  const data = await response.json();
  
  if (!data.shopping_results) return [];

  const items = data.shopping_results.slice(0, 10).map(item => ({
    name: item.title,
    price: parseFloat(item.extracted_price) || 0,
    freeDelivery: Math.random() > 0.5,
    fastDelivery: Math.random() > 0.5,
    link: item.link,
    image: item.thumbnail
  }));

  return items;
}


let products = [];

function render() {
  let filtered = [...products];
  if (freeDelivery.checked) filtered = filtered.filter(p => p.freeDelivery);
  if (fastDelivery.checked) filtered = filtered.filter(p => p.fastDelivery);

  if (sort.value === "price-asc") filtered.sort((a, b) => a.price - b.price);
  else if (sort.value === "price-desc") filtered.sort((a, b) => b.price - a.price);

  list.innerHTML = "";
  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" />
      <div class="info">
        <h4>${p.name}</h4>
        <p>₹${p.price}</p>
        <a href="${p.link}" target="_blank">View Product</a>
      </div>
    `;
    list.appendChild(card);
  });
}

freeDelivery.addEventListener("change", render);
fastDelivery.addEventListener("change", render);
sort.addEventListener("change", render);

fetchProducts().then(fetched => {
  products = fetched;
  render();
});
