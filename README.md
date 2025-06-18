# 🔍 DealFinder - Smart Shopping Extension

**DealFinder** is a browser extension that lets users search for products across top Indian e-commerce platforms like **Amazon**, **Flipkart**, and **Snapdeal**. It scrapes real-time product listings based on user queries, displays them neatly in a sidebar, and offers options to sort by price or rating, all with a dark/light mode toggle.

---

## 📦 Features

- Parallel scraping using FastAPI and Playwright  
- Lightweight Chrome extension sidebar UI  
- Sort by price and rating  
- Dark mode / Light mode toggle  
- Instant product preview with image, price, and rating  
- Works on any webpage

---

## 🛠️ Dependencies

Install the following Python packages (in a virtual environment is recommended):

```bash
pip install -r requirements.txt
```

**Requirements:**

- Python 3.8+
- FastAPI
- Uvicorn
- Playwright

Also install browser dependencies for Playwright:

```bash
playwright install
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/dealfinder.git
cd dealfinder
```

---

### 2. Start the FastAPI Server

```bash
cd Backend
python server.py
```

> Make sure port `5000` is free. The server runs on `http://localhost:5000`.

---

### 3. Load the Extension in Chrome

1. Go to `chrome://extensions/` in your Chrome browser.
2. Enable **Developer Mode** (top-right toggle).
3. Click **"Load unpacked"**.
4. Select the project folder named `Ext`.

Once loaded, click the extension icon in the toolbar to open the DealFinder sidebar.

---


## 🧑‍💻 Contributors

- Jerin Cherian
- Tanisha Nanda 

---

## 📃 License

MIT License
