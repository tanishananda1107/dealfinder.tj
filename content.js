// Put this near the top of your content.js
async function fetchRealPrices(product) {
    try {
      const response = await fetch(
        `https://api.priceapi.com/v2/india/search?token=YOUR_API_KEY&query=${encodeURIComponent(product)}`
      );
      if (!response.ok) throw new Error("API request failed");
      const data = await response.json();
      return data.stores.sort((a, b) => a.price - b.price); // Cheapest first
    } catch (error) {
      console.error("Price API error:", error);
      return []; // Return empty array if API fails
    }
  }
  
  // Usage example (put where you handle Google search results):
  if (location.host.includes("google.com")) {
    const query = new URLSearchParams(location.search).get("q");
    if (query) {
      const stores = await fetchRealPrices(query);
      if (stores.length > 0) {
        // Display the sorted stores
        stores.forEach(store => {
          console.log(`${store.name}: ₹${store.price}`); // For debugging
        });
      }
    }
  }
  async function fetchRealPrices(product) {
    // Get key from storage
    const { apiKey } = await chrome.storage.sync.get(['apiKey']);
    if (!apiKey) throw new Error("No API key found");
    
    const response = await fetch(
      `https://api.priceapi.com/v2/india/search?token=${apiKey}&query=${product}`
    );
    return await response.json();
  }