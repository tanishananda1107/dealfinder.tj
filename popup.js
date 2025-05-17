document.addEventListener('DOMContentLoaded', async () => {
    const dealsDiv = document.getElementById('deals');
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab?.url?.includes("google.com/search")) {
        dealsDiv.className = "error";
        dealsDiv.innerHTML = `
          <div>Please visit:</div>
          <div style="margin-top: 8px;">
            <a href="https://www.google.com/search?q=example" target="_blank">
              Google Search
            </a>
          </div>
          <div style="margin-top: 8px; font-size: 12px; color: #666;">
            Then click the extension again
          </div>
        `;
        return;
      }
  
      const query = new URLSearchParams(new URL(tab.url).search).get("q");
      if (!query) {
        dealsDiv.className = "error";
        dealsDiv.textContent = "No search query found";
        return;
      }
  
      // Replace with your actual data source
      const stores = await mockFetchStores(query); 
      
      if (!stores.length) {
        dealsDiv.className = "error";
        dealsDiv.textContent = "No stores found for this product";
        return;
      }
  
      dealsDiv.innerHTML = stores.map(store => `
        <div class="store">
          <a href="${store.url}" target="_blank" rel="noopener noreferrer">
            ${store.name}
          </a>
        </div>
      `).join('');
  
    } catch (error) {
      dealsDiv.className = "error";
      dealsDiv.textContent = "Error loading stores";
      console.error("Extension error:", error);
    }
  });
  
  // Mock function - replace with real implementation
  async function mockFetchStores(product) {
    return [
      { name: "Flipkart", url: `https://www.flipkart.com/search?q=${product}` },
      { name: "Amazon", url: `https://www.amazon.in/s?k=${product}` }
    ];
  }