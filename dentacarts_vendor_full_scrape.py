# filename: dentacarts_to_my_schema.py
"""
Scrape any Dentacarts vendor listing and output:
  1) raw_<vendorId>_<vendorName>.json   (raw enriched product data from site)
  2) schema_<vendorId>_<vendorName>.json (mapped to your Product schema)

HOW TO USE
---------
1) Set LISTING_URL to the vendor page you want.
2) Set FIREBASE_VENDOR_ID to your vendor's Firebase doc ID.
3) Fill CATEGORY_MAP with keys as breadcrumb paths (e.g. "Dental > Consumables")
   and values as your Firebase category IDs. Unknown paths fall back to DEFAULT_CATEGORY_ID.
4) Run:
   pip install requests beautifulsoup4
   python dentacarts_to_my_schema.py
"""

import csv, json, re, time, random, sys, hashlib, unicodedata
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urljoin, urlparse, parse_qs, urlencode
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timezone

# -------------------- CONFIG (EDIT THESE) --------------------
LISTING_URL = "https://dentacarts.com/products?vendors=61&sort=bestsellingRank%2Cdesc&vendorName=Denta+Carts"
FIREBASE_VENDOR_ID = "vendors/Denta-Carts"      # <-- your Firebase doc ID
DEFAULT_CATEGORY_ID = "categories/uncategorized"  # fallback category
CATEGORY_MAP = {
    # "Category > Subcategory > Leaf": "categories/<your-id>",
    # Example(s) — replace with your taxonomy:
    # "Dental > Instruments": "categories/instruments",
    # "Dental > Consumables > Gloves": "categories/consumables-gloves",
}

# Scraping politeness
MAX_WORKERS = 5
BASE = "https://dentacarts.com"
HEADERS = {
    "User-Agent": ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                   "AppleWebKit/537.36 (KHTML, like Gecko) "
                   "Chrome/120.0.0.0 Safari/537.36"),
    "Accept-Language": "en-US,en;q=0.9,ar;q=0.8",
    "Cache-Control": "no-cache",
}

# -------------------- UTILITIES --------------------
def sleep_jitter(a=0.4, b=0.9):
    time.sleep(a + random.random() * b)

def clean_text(t: str) -> str:
    return re.sub(r"\s+", " ", (t or "").replace("\xa0", " ")).strip()

def slugify(text: str) -> str:
    if not text:
        return ""
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text).strip("-").lower()
    return text

def with_page(url: str, page: int) -> str:
    parsed = urlparse(url)
    q = parse_qs(parsed.query)
    q["page"] = [str(page)]
    new_query = urlencode({k: v[0] if len(v)==1 else v for k,v in q.items()}, doseq=True)
    return parsed._replace(query=new_query).geturl()

def get_soup(session: requests.Session, url: str, max_tries=5) -> BeautifulSoup:
    backoff = 1.2
    for _ in range(max_tries):
        resp = session.get(url, headers=HEADERS, timeout=35)
        if resp.status_code == 200:
            return BeautifulSoup(resp.text, "html.parser")
        if resp.status_code in (429, 503, 502):
            time.sleep(backoff); backoff *= 1.8; continue
        resp.raise_for_status()
    raise RuntimeError(f"Failed to fetch {url} after {max_tries} tries")

def parse_price_num(text: str):
    if not text: return None
    m = re.search(r"(\d[\d,\.]*)", text)
    if not m: return None
    try:
        return float(m.group(1).replace(",", ""))
    except:
        return None

def detect_total_pages(soup: BeautifulSoup) -> int:
    candidates = set()
    for sel in [".pagination a", "nav[aria-label*='pagination'] a", "ul.pagination a", "a.page-link", "a[rel='next'], a[rel='prev']"]:
        for a in soup.select(sel):
            txt = clean_text(a.get_text())
            if txt.isdigit():
                candidates.add(int(txt))
    for a in soup.find_all("a", href=True):
        m = re.search(r"[?&]page=(\d+)", a["href"])
        if m:
            candidates.add(int(m.group(1)))
    return max(candidates) if candidates else 1

def parse_json_ld(soup: BeautifulSoup):
    for tag in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(tag.string or tag.text or "{}")
        except Exception:
            continue
        candidates = data if isinstance(data, list) else [data]
        for obj in candidates:
            typ = obj.get("@type")
            if isinstance(typ, list):
                if any(str(t).lower() == "product" for t in typ): return obj
            elif isinstance(typ, str) and typ.lower() == "product":
                return obj
    return None

def extract_breadcrumbs(soup: BeautifulSoup):
    crumbs = []
    for sel in [
        "nav.breadcrumb a, .breadcrumb a, ul.breadcrumbs a, .breadcrumbs a",
        '[aria-label="breadcrumb"] a',
    ]:
        nodes = soup.select(sel)
        if nodes:
            crumbs = [clean_text(n.get_text()) for n in nodes if clean_text(n.get_text())]
            if crumbs: break
    # remove "Home"
    crumbs = [c for c in crumbs if c and c.lower() != "home"]
    return " > ".join(crumbs)

def extract_images(soup: BeautifulSoup):
    imgs = set()
    for sel in [
        'img[src*="/products/"]',
        '.product-gallery img',
        'img[data-zoom-image]',
        'img[src*="/uploads/"]',
        'img[src*="cdn"]'
    ]:
        for im in soup.select(sel):
            src = im.get("src") or im.get("data-src") or im.get("data-zoom-image")
            if src:
                if src.startswith("//"): src = "https:" + src
                imgs.add(urljoin(BASE, src))
    og = soup.find("meta", property="og:image")
    if og and og.get("content"):
        imgs.add(urljoin(BASE, og["content"]))
    return list(imgs)

def extract_specs_table(soup: BeautifulSoup):
    """Return key-value pairs from spec/attributes tables if present."""
    specs = {}
    for table in soup.select("table"):
        rows = table.find_all("tr")
        kv_pairs = 0
        for r in rows:
            cells = r.find_all(["th", "td"])
            if len(cells) >= 2:
                key = clean_text(cells[0].get_text())
                val = clean_text(cells[1].get_text())
                if len(key) <= 40 and key and val:
                    specs[key] = val
                    kv_pairs += 1
        # heuristic: keep the first table that actually looked like specs
        if kv_pairs >= 2:
            break
    return specs

def extract_listing_urls(soup: BeautifulSoup):
    urls = []
    for a in soup.select('a[href^="/products/"]'):
        href = a.get("href")
        if href and href.startswith("/products/"):
            urls.append(urljoin(BASE, href.split("?")[0]))
    return urls

# -------------------- SCRAPE STEPS --------------------
def gather_all_product_urls(listing_url: str):
    s = requests.Session()
    all_urls = set()

    soup0 = get_soup(s, listing_url)
    total_pages = detect_total_pages(soup0)
    print(f"[LIST] Total pages: {total_pages}")

    all_urls.update(extract_listing_urls(soup0))
    sleep_jitter(0.5, 0.8)

    for page in range(2, total_pages + 1):
        url = with_page(listing_url, page)
        print(f"[LIST] {page}/{total_pages} -> {url}")
        soup = get_soup(s, url)
        all_urls.update(extract_listing_urls(soup))
        sleep_jitter(0.5, 0.8)

    urls = sorted(all_urls)
    print(f"[LIST] Found ~{len(urls)} unique product URLs.")
    return urls, total_pages

def extract_detail_fields(session: requests.Session, url: str):
    soup = get_soup(session, url)
    data = {
        "url": url,
        "title": "",
        "brand": "",
        "sku": "",
        "mpn": "",
        "price": None,
        "original_price": None,
        "currency": "",
        "availability": "",
        "rating_value": "",
        "rating_count": "",
        "category_path": "",
        "description": "",
        "short_description": "",
        "images": [],
        "specifications": {},
        "features": [],
        "variants": [],  # placeholder if detected later
    }

    j = parse_json_ld(soup)
    if j:
        data["title"] = clean_text(j.get("name"))
        brand = j.get("brand")
        if isinstance(brand, dict):
            data["brand"] = clean_text(brand.get("name"))
        elif isinstance(brand, str):
            data["brand"] = clean_text(brand)

        data["sku"] = clean_text(j.get("sku"))
        data["mpn"] = clean_text(j.get("mpn") or j.get("gtin") or "")

        offers = j.get("offers") or {}
        if isinstance(offers, list) and offers:
            offers = offers[0]
        if isinstance(offers, dict):
            # Prefer price + priceCurrency; try "highPrice" (range) for original
            price = offers.get("price") or (offers.get("priceSpecification", {}) or {}).get("price")
            data["price"] = parse_price_num(str(price)) if price else None
            data["currency"] = clean_text(
                offers.get("priceCurrency") or (offers.get("priceSpecification", {}) or {}).get("priceCurrency") or ""
            )
            # sometimes original price is encoded as "highPrice" / "lowPrice"
            for k in ("highPrice","lowPrice","listPrice","msrp"):
                if offers.get(k):
                    op = parse_price_num(str(offers.get(k)))
                    if op and (not data["original_price"] or op > (data["original_price"] or 0)):
                        data["original_price"] = op
            av = clean_text(offers.get("availability") or "")
            data["availability"] = av.split("/")[-1] if av.lower().startswith("http") else av

        agg = j.get("aggregateRating") or {}
        if isinstance(agg, dict):
            data["rating_value"] = clean_text(str(agg.get("ratingValue") or ""))
            data["rating_count"] = clean_text(str(agg.get("reviewCount") or agg.get("ratingCount") or ""))

        images = []
        if isinstance(j.get("image"), list): images = j["image"]
        elif isinstance(j.get("image"), str): images = [j["image"]]
        data["images"] = [urljoin(BASE, im) for im in images if im]

        data["description"] = clean_text(j.get("description"))

    # HTML fallbacks
    if not data["title"]:
        h1 = soup.find("h1") or soup.select_one(".product-title, .title, .product_name")
        data["title"] = clean_text(h1.get_text()) if h1 else ""

    if data["price"] is None:
        price_el = soup.select_one(".price, .product-price, .money, .amount, [class*='price']")
        data["price"] = parse_price_num(clean_text(price_el.get_text())) if price_el else None

    # try original/strikethrough price
    if data["original_price"] is None:
        strike = soup.select_one("del, .old-price, .compare-at")
        if strike:
            data["original_price"] = parse_price_num(clean_text(strike.get_text()))

    if not data["currency"]:
        meta_curr = soup.find("meta", attrs={"itemprop":"priceCurrency"}) or soup.find("meta", property="product:price:currency")
        if meta_curr and meta_curr.get("content"):
            data["currency"] = meta_curr["content"]
        else:
            txt = soup.get_text(" ")
            if " EGP" in txt or "EGP" in txt: data["currency"] = "EGP"
            elif " SAR" in txt or "SAR" in txt: data["currency"] = "SAR"

    if not data["availability"]:
        txt = soup.get_text(" ")
        m = re.search(r"(In Stock|Out of Stock|Unavailable|Preorder|Pre-order)", txt, re.I)
        if m:
            data["availability"] = m.group(1).title()

    # Short description / features
    short = soup.select_one(".short-description, .summary, .product-excerpt")
    if short:
        data["short_description"] = clean_text(short.get_text())

    # Full description fallback
    if not data["description"]:
        desc = soup.select_one(".description, .product-description, #description, [itemprop='description']")
        if desc:
            data["description"] = clean_text(desc.get_text())

    data["images"] = data["images"] or extract_images(soup)
    data["category_path"] = extract_breadcrumbs(soup)
    data["specifications"] = extract_specs_table(soup) or {}

    # (Optional) rudimentary feature bullets from description paragraphs
    if not data["features"] and data["description"]:
        bullets = re.findall(r"(?:^|\n)[\-\•\*]\s*(.+)", data["description"])
        data["features"] = [clean_text(b) for b in bullets][:10]

    return data

# -------------------- MAPPING TO YOUR SCHEMA --------------------
def pick_category_id(category_path: str) -> str:
    if not category_path:
        return DEFAULT_CATEGORY_ID
    # Try exact match, else try progressive shortenings
    if category_path in CATEGORY_MAP:
        return CATEGORY_MAP[category_path]
    # Try leaf-only (last segment)
    parts = [p.strip() for p in category_path.split(">") if p.strip()]
    if parts:
        leaf = parts[-1]
        for k, v in CATEGORY_MAP.items():
            if k.endswith(leaf):
                return v
    return DEFAULT_CATEGORY_ID

def ensure_sku(raw_sku: str, url: str, vendor_id: str) -> str:
    """
    Your schema requires sku (unique). If the site has none,
    synthesize a stable SKU from URL + vendor, e.g., 'misr-sinai-<hash6>'.
    """
    if raw_sku:
        return raw_sku
    slug = urlparse(url).path.rstrip("/").split("/")[-1]
    h = hashlib.sha1(url.encode("utf-8")).hexdigest()[:6]
    base = f"{vendor_id.split('/')[-1]}-{slug or 'item'}-{h}"
    return base.lower()

def to_my_schema(raw: dict, vendor_doc_id: str):
    """
    Convert one raw product (our enriched scrape dict) to your schema.
    """
    now = datetime.now(timezone.utc).isoformat()
    name = raw.get("title") or "Unnamed Product"
    slug = slugify(name)

    price = raw.get("price")
    original = raw.get("original_price")
    if original and price and original < price:
        # swap if they came flipped
        original, price = price, original

    sale_pct = None
    if original and price and original > 0 and price < original:
        sale_pct = round((original - price) * 100.0 / original, 2)

    # Build images[]
    images_list = raw.get("images") or []
    images_struct = []
    for idx, im in enumerate(images_list):
        images_struct.append({
            "url": im,
            "alt": name,
            "isPrimary": idx == 0,
            "order": idx
        })

    # Specs as Map<string,string>
    specifications = raw.get("specifications") or {}

    # Stock heuristic:
    # If availability explicitly says InStock, set 10 (you can adjust).
    # Otherwise default 0. (Required by your schema.)
    avail = (raw.get("availability") or "").lower()
    stock = 10 if "instock" in avail or "in stock" in avail else 0

    sku = ensure_sku(raw.get("sku",""), raw.get("url",""), vendor_doc_id)

    # Category map from breadcrumb path
    category_id = pick_category_id(raw.get("category_path") or "")

    # SEO
    meta_title = name[:60]
    meta_desc = (raw.get("short_description") or raw.get("description") or name)[:160]

    # Build final doc
    doc = {
      # Basic Product Information
      "name": name,
      "nameAr": "",  # If you have Arabic source fields, map here
      "description": raw.get("description") or "",
      "shortDescription": raw.get("short_description") or "",

      # Pricing
      "price": float(price) if price is not None else 0.0,
      "originalPrice": float(original) if original is not None else None,
      "currency": raw.get("currency") or "EGP",

      # Product Identification
      "sku": sku,
      "vendorSku": raw.get("sku") or "",   # keep original in vendorSku too
      "brand": raw.get("brand") or "",
      "model": raw.get("mpn") or "",

      # Relationships (Firebase Document References)
      "categoryId": category_id,
      "vendorId": vendor_doc_id,

      # Inventory
      "stock": stock,
      "minStockLevel": 5,
      "maxStockLevel": 1000,

      # Media
      "images": images_struct,

      # Product Details
      "specifications": specifications,
      "features": raw.get("features") or [],
      "tags": [],

      # Physical Properties (no reliable weight/dims on site; leave defaults)
      "weight": {"value": None, "unit": "g"},
      "dimensions": {"length": None, "width": None, "height": None, "unit": "cm"},

      # Product Status
      "isActive": True,
      "isFeatured": False,
      "isOnSale": bool(sale_pct is not None and sale_pct > 0),
      "salePercentage": sale_pct,

      # SEO & Marketing
      "slug": slug,
      "metaTitle": meta_title,
      "metaDescription": meta_desc,

      # Analytics & Performance
      "averageRating": float(raw.get("rating_value") or 0) if str(raw.get("rating_value") or "").strip() else 0,
      "totalReviews": int(raw.get("rating_count") or 0) if str(raw.get("rating_count") or "").strip().isdigit() else 0,
      "totalSold": 0,
      "views": 0,

      # Search & Discovery
      "searchKeywords": list({k for k in slug.split("-") if k})[:15],

      # Vendor-Specific Data
      "vendorData": {
        "sourceUrl": raw.get("url"),
        "lastScraped": now,
        "scrapedData": {}  # you can copy raw fields here if you want
      },

      # Product Variants (not reliably available; keep empty unless you extend)
      "variants": raw.get("variants") or [],

      # Bundle
      "isBundle": False,
      "bundleItems": [],

      # Timestamps
      "createdAt": now,
      "updatedAt": now,
      "lastScrapedAt": now
    }

    # Required field guards
    if not doc["description"]:
        doc["description"] = doc["shortDescription"] or doc["name"]

    return doc

# -------------------- MAIN --------------------
def vendor_from_url(url: str):
    parsed = urlparse(url)
    q = parse_qs(parsed.query)
    vendor_id = (q.get("vendors") or ["vendor"])[0]
    vendor_name = (q.get("vendorName") or ["vendor"])[0]
    safe_name = re.sub(r"[^A-Za-z0-9_-]+", "_", vendor_name.strip())
    return vendor_id, safe_name

def main():
    session = requests.Session()

    vendor_id_str, vendor_name_safe = vendor_from_url(LISTING_URL)
    raw_out = f"raw_{vendor_id_str}_{vendor_name_safe}.json"
    schema_out = f"schema_{vendor_id_str}_{vendor_name_safe}.json"

    # 1) collect product URLs
    product_urls, total_pages = gather_all_product_urls(LISTING_URL)
    if not product_urls:
        print("No product URLs found. Exiting.")
        sys.exit(1)

    # 2) scrape detail pages
    raw_results, errors = [], []
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as ex:
        futs = {ex.submit(extract_detail_fields, session, u): u for u in product_urls}
        for i, f in enumerate(as_completed(futs), 1):
            u = futs[f]
            try:
                item = f.result()
                raw_results.append(item)
                print(f"[DETAIL] {i}/{len(product_urls)} OK")
            except Exception as e:
                errors.append((u, str(e)))
                print(f"[DETAIL] {i}/{len(product_urls)} ERROR: {e}")
            sleep_jitter(0.05, 0.15)

    # 3) save raw
    with open(raw_out, "w", encoding="utf-8") as jf:
        json.dump(raw_results, jf, ensure_ascii=False, indent=2)

    # 4) map to your schema
    mapped = [to_my_schema(r, FIREBASE_VENDOR_ID) for r in raw_results]

    # 5) save mapped
    with open(schema_out, "w", encoding="utf-8") as jf:
        json.dump(mapped, jf, ensure_ascii=False, indent=2)

    print(f"\nSaved files:")
    print(f" - {raw_out}          (raw enriched data)")
    print(f" - {schema_out}   (your schema)")

    if errors:
        print(f"\n{len(errors)} pages had errors (first 10 shown):")
        for u, msg in errors[:10]:
            print(" -", u, "=>", msg)

if __name__ == "__main__":
    main()
