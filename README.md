# 🔍 Smart Dealfinder - Convenient Shopping Extension

**Smart Dealfinder** is a browser extension designed to help users find the best deals based on their personal shopping preferences. Whether you're looking for the lowest price or the highest-rated product, DealFinder fetches and compares data in real-time across major e-commerce platforms like Amazon, Flipkart, and Snapdeal — all within your browser.

What started as a simple idea turned into a hands-on learning journey — from long nights of debugging to countless iterations. We've come a long way in developing the core functionality, and while this version is a working prototype, there's still plenty of room for improvement and exciting features ahead.

This project gave us the opportunity to combine web scraping, API development with FastAPI, browser automation using Playwright, and building a Chrome extension from the ground up. DealFinder is still evolving — and we’re just getting started.



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

- Python 3.8+
- FastAPI
- Uvicorn
- Playwright

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/tanishananda1107/dealfinder.tj.git
cd dealfinder
```

---

### 2. Start the FastAPI Server

```bash
cd Background
pip install -r requirements.txt
playwright install
python server.py
```

> Make sure port `5000` is free. The server runs on `http://localhost:5000`.

---

### 3. Load the Extension in Chrome

1. Go to `chrome://extensions/` in your Chrome browser.
2. Enable **Developer Mode** (top-right toggle).
3. Click **"Load unpacked"**.
4. Select the project folder named `Front`.

Once loaded, click the extension icon in the toolbar to open the Smart Dealfinder sidebar.

---


## 🧑‍💻 Contributors

- Jerin Cherian
- Tanisha Nanda 

---

## 📃 License

MIT License
