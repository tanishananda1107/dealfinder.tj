document.getElementById('save').addEventListener('click', async () => {
    const key = document.getElementById('apiKey').value;
    await chrome.storage.sync.set({ apiKey: key });
    alert('API Key Saved!');
  });
  
  // Load saved key
  chrome.storage.sync.get(['apiKey'], ({ apiKey }) => {
    if (apiKey) document.getElementById('apiKey').value = apiKey;
  });