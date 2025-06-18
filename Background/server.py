from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from playwright.async_api import async_playwright
import uvicorn
import re
import asyncio
import logging

app = FastAPI()
logging.basicConfig(level=logging.INFO)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

async def scrape_amazon(query, p):
    browser = await p.chromium.launch(headless=True)
    page = await browser.new_page()
    await page.set_extra_http_headers({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/119.0.0.0 Safari/537.36"
    })
    await page.goto(f'https://www.amazon.in/s?k={query}', timeout=60000)
    await page.wait_for_selector('div[data-component-type="s-search-result"]', timeout=15000)

    items = await page.query_selector_all('div[data-component-type="s-search-result"]')
    products = []

    for item in items[:10]:
        try:
            asin = await item.get_attribute('data-asin')
            if not asin:
                continue
            name_el = await item.query_selector('h2 span')
            price_el = await item.query_selector('.a-price .a-offscreen')
            image_el = await item.query_selector('img.s-image')
            rating_el = await item.query_selector('.a-icon-alt')

            name = await name_el.inner_text() if name_el else ''
            price = await price_el.inner_text() if price_el else ''
            image = await image_el.get_attribute('src') if image_el else ''
            rating = (await rating_el.inner_text()).split()[0] if rating_el else ''

            products.append({
                'name': name.strip(),
                'price': price.strip(),
                'image': image,
                'rating': rating,
                'url': f"https://www.amazon.in/dp/{asin}",
                'source': 'Amazon'
            })
        except Exception:
            continue
    await browser.close()
    return products


async def scrape_flipkart(query, p):
    browser = await p.chromium.launch(headless=True)
    context = await browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/119.0.0.0 Safari/537.36")

    page = await context.new_page()
    await page.goto(f'https://www.flipkart.com/search?q={query}', timeout=60000)

    try:
        await page.click("button._2KpZ6l._2doB4z", timeout=5000)
    except:
        pass

    await page.wait_for_selector("div[data-id]", timeout=15000)
    items = await page.query_selector_all("div[data-id]")
    products = []

    for item in items[:10]:
        try:
            full_text = await item.inner_text()
            lines = [line.strip() for line in full_text.split('\n') if line.strip()]

            name = price = rating = ""
            found_price = found_rating = False

            for line in lines:
                if not found_rating and re.search(r"\d\.\d\s?[★(]", line):
                    match = re.search(r"\d\.\d", line)
                    if match:
                        rating = match.group(0)
                        found_rating = True
                if not found_price and re.search(r"₹[\d,]+", line):
                    price = re.search(r"₹[\d,]+", line).group(0)
                    found_price = True

            for line in lines:
                if name:
                    break
                if rating in line or price in line or "delivery" in line.lower():
                    continue
                if len(line) > 8 and not line.startswith("₹"):
                    name = line

            link_el = await item.query_selector('a[href^="/"]')
            href = await link_el.get_attribute('href') if link_el else None
            product_url = "https://www.flipkart.com" + href if href else ""

            image_el = await item.query_selector('img')
            image = await image_el.get_attribute('src') if image_el else ""

            if not name or not product_url:
                continue

            products.append({
                "name": name,
                "price": price,
                "image": image,
                "rating": rating,
                "url": product_url,
                "source": "Flipkart"
            })
        except Exception:
            continue

    await browser.close()
    return products


async def scrape_snapdeal(query, p):
    try:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        await page.goto(f"https://www.snapdeal.com/search?keyword={query}&sort=plrty", timeout=60000)
        await page.wait_for_selector(".product-tuple-listing", timeout=15000)
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await asyncio.sleep(2)

        cards = await page.query_selector_all(".product-tuple-listing")
        products = []

        for card in cards[:10]:
            try:
                name_el = await card.query_selector(".product-title")
                name = await name_el.inner_text() if name_el else "No Title"

                link_el = await card.query_selector("a")
                link = await link_el.get_attribute("href") if link_el else ""

                img = await card.query_selector("img")
                image = await img.get_attribute("data-src") or await img.get_attribute("src") if img else ""

                # Price extraction
                price = ""
                price_el = await card.query_selector(".lfloat.product-price")
                if price_el:
                    raw_price = await price_el.inner_text()
                    match = re.search(r"[\d,]+", raw_price.strip())
                    if match:
                        price = f"₹{match.group(0)}"

                # ✅ Clean and reliable rating extraction
                rating = ""
                rating_wrap = await card.query_selector('[ratings]')
                if rating_wrap:
                    rating = await rating_wrap.get_attribute('ratings')

                products.append({
                    "name": name.strip(),
                    "price": price,
                    "image": image,
                    "rating": rating,
                    "url": link,
                    "source": "Snapdeal"
                })

            except Exception as e:
                logging.warning(f"Snapdeal product parse error: {e}")
                continue

        await browser.close()
        return products

    except Exception as e:
        logging.error(f"Snapdeal scrape error: {e}")
        return []


@app.get("/scrape")
async def unified_scrape(request: Request):
    query = request.query_params.get("q", "").strip()
    if not query:
        return {"error": "Missing ?q= parameter"}

    try:
        async with async_playwright() as p:
            results = await asyncio.gather(
                scrape_amazon(query, p),
                scrape_flipkart(query, p),
                scrape_snapdeal(query, p)
            )
        all_products = [item for sublist in results for item in sublist]
        return {"products": all_products}
    except Exception as e:
        logging.error(f"Scraping failed: {e}")
        return {"error": "Scraping failed", "details": str(e)}


if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=5000)
