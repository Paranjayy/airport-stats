#!/usr/bin/env python3
"""
Wikipedia scraper for Indian airport data.

Fetches airport details from Wikipedia pages and stores them in the SQLite
database. Requires the `requests` and `beautifulsoup4` packages.

Usage:
    python scripts/scrape_airports.py              # scrape all known airports
    python scripts/scrape_airports.py DEL BOM BLR  # scrape specific airports only
"""

import json
import re
import sqlite3
import sys
import time
from pathlib import Path
from typing import Any

# ── Optional imports (graceful fallback) ──────────────────────────────────────
try:
    import requests
except ImportError:
    print("Missing dependency: requests")
    print("  → pip install requests")
    sys.exit(1)

try:
    from bs4 import BeautifulSoup, Tag
except ImportError:
    print("Missing dependency: beautifulsoup4")
    print("  → pip install beautifulsoup4")
    sys.exit(1)

sys.path.insert(0, str(Path(__file__).resolve().parent))
from setup_database import DB_PATH, get_connection

# ── Wikipedia page mapping ────────────────────────────────────────────────────
# Maps IATA codes to their Wikipedia article slug.
WIKIPEDIA_PAGES: dict[str, str] = {
    "DEL": "Indira_Gandhi_International_Airport",
    "BOM": "Chhatrapati_Shivaji_Maharaj_International_Airport",
    "BLR": "Kempegowda_International_Airport",
    "MAA": "Chennai_International_Airport",
    "CCU": "Netaji_Subhas_Chandra_Bose_International_Airport",
    "HYD": "Rajiv_Gandhi_International_Airport",
    "GOI": "Goa_International_Airport",
    "COK": "Cochin_International_Airport",
    "PNQ": "Pune_Airport",
    "JAI": "Jaipur_International_Airport",
    "AMD": "Sardar_Vallabhbhai_Patel_International_Airport",
    "LKO": "Chaudhary_Charan_Singh_International_Airport",
    "CXR": "Chandigarh_International_Airport",
    "VTZ": "Visakhapatnam_Airport",
    "PAT": "Lok_Nayak_Jayaprakash_Airport",
    "GAU": "Lokpriya_Gopinath_Bordoloi_International_Airport",
    "IMF": "Imphal_Airport",
    "IXR": "Birsa_Munda_Airport",
    "TRV": "Trivandrum_International_Airport",
    "IXM": "Madurai_Airport",
    "IXB": "Bagdogra_Airport",
    "IDR": "Devi_Ahilyabai_Holkar_Airport",
    "BBI": "Biju_Patnaik_International_Airport",
    "IXA": "Maharaja_Bir_Bikram_Airport",
    "IXZ": "Veer_Savarkar_International_Airport",
    "DMU": "Dimapur_Airport",
    "SHL": "Shillong_Airport",
    "SLM": "Salem_Airport_(India)",
}

WIKI_API = "https://en.wikipedia.org/w/api.php"
HEADERS = {
    "User-Agent": "AirportDataBot/1.0 (educational project; contact: github.com/paranjay)",
}


# ── Parsing helpers ───────────────────────────────────────────────────────────


def _clean(text: str | None) -> str | None:
    """Strip whitespace and collapse newlines."""
    if text is None:
        return None
    cleaned = re.sub(r"\s+", " ", text).strip()
    return cleaned or None


def _parse_int(text: str | None) -> int | None:
    """Extract the first integer from a string."""
    if not text:
        return None
    m = re.search(r"[\d,]+", text.replace(",", ""))
    return int(m.group()) if m else None


def _parse_float(text: str | None) -> float | None:
    """Extract the first float or integer from a string."""
    if not text:
        return None
    m = re.search(r"[\d,.]+", text.replace(",", ""))
    return float(m.group()) if m else None


def _infobox_value(soup: BeautifulSoup, label: str) -> str | None:
    """Get a value from the Wikipedia infobox by label text."""
    for th in soup.find_all("th"):
        if label.lower() in th.get_text().lower():
            td = th.find_next_sibling("td")
            if td:
                return _clean(td.get_text())
    return None


def _infobox_row(soup: BeautifulSoup, label: str) -> str | None:
    """Alias for _infobox_value."""
    return _infobox_value(soup, label)


def _h2_section(soup: BeautifulSoup, heading: str) -> Tag | None:
    """Find a section by its H2 heading text."""
    for h2 in soup.find_all("h2"):
        if heading.lower() in h2.get_text().lower():
            # Collect siblings until next h2
            content = []
            for sib in h2.find_next_siblings():
                if sib.name == "h2":
                    break
                content.append(sib)
            wrapper = soup.new_tag("div")
            for c in content:
                wrapper.append(c)
            return wrapper
    return None


# ── Core scraper ──────────────────────────────────────────────────────────────


def fetch_wiki_page(slug: str) -> BeautifulSoup:
    """Fetch and parse a Wikipedia page."""
    params = {
        "action": "parse",
        "page": slug,
        "prop": "wikitext",
        "format": "json",
        "disabletoc": 1,
    }
    resp = requests.get(WIKI_API, params=params, headers=HEADERS, timeout=30)
    resp.raise_for_status()
    data = resp.json()
    wikitext = data.get("parse", {}).get("wikitext", {}).get("*", "")
    # Render to HTML via the API for easier parsing
    params_html = {
        "action": "parse",
        "page": slug,
        "prop": "text",
        "format": "json",
        "disabletoc": 1,
    }
    resp2 = requests.get(WIKI_API, params=params_html, headers=HEADERS, timeout=30)
    resp2.raise_for_status()
    html = resp2.json().get("parse", {}).get("text", {}).get("*", "")
    return BeautifulSoup(html, "html.parser")


def scrape_airport(iata: str) -> dict[str, Any] | None:
    """Scrape a single airport's data from Wikipedia."""
    slug = WIKIPEDIA_PAGES.get(iata)
    if not slug:
        print(f"  ⚠ No Wikipedia page mapped for {iata}")
        return None

    print(f"  Fetching {iata} ({slug})...")
    try:
        soup = fetch_wiki_page(slug)
    except Exception as e:
        print(f"  ✗ Failed to fetch {iata}: {e}")
        return None

    record: dict[str, Any] = {
        "iata_code": iata,
        "wikipedia_url": f"https://en.wikipedia.org/wiki/{slug}",
    }

    # Infobox fields
    field_map = {
        "name": ["airport name", "name"],
        "city": ["city served", "city", "location"],
        "state": ["state", "province"],
        "elevation_ft": ["elevation", "elevation ft"],
        "runway_length_ft": ["runway length", "length of runway"],
        "runway_count": ["runways"],
        "terminal_count": ["terminals"],
        "website": ["website", "website url"],
    }
    for key, labels in field_map.items():
        for label in labels:
            val = _infobox_row(soup, label)
            if val:
                if key in ("elevation_ft", "runway_length_ft"):
                    record[key] = _parse_int(val)
                elif key == "runway_count":
                    record[key] = _parse_int(val)
                elif key == "terminal_count":
                    record[key] = _parse_int(val)
                else:
                    record[key] = val
                break

    # Try to extract statistics from the article body
    stats_section = _h2_section(soup, "statistics") or _h2_section(soup, "traffic")
    if stats_section:
        pax_match = re.search(
            r"([\d,]+)\s*(?:passengers|pax)", stats_section.get_text(), re.I
        )
        if pax_match:
            record["passengers_note"] = pax_match.group(0)

    return record


def update_database(conn: sqlite3.Connection, records: list[dict[str, Any]]) -> None:
    """Merge scraped data into the airports table."""
    cursor = conn.cursor()
    updated = 0
    for rec in records:
        iata = rec.get("iata_code")
        if not iata:
            continue
        existing = cursor.execute(
            "SELECT id FROM airports WHERE iata_code = ?", (iata,)
        ).fetchone()
        if not existing:
            print(f"  ⚠ {iata} not in database — skipping update")
            continue

        sets = []
        params: list[Any] = []
        for key in (
            "name",
            "city",
            "state",
            "elevation_ft",
            "runway_count",
            "terminal_count",
            "runway_length_ft",
            "website",
            "wikipedia_url",
        ):
            if key in rec and rec[key] is not None:
                sets.append(f"{key} = ?")
                params.append(rec[key])
        if sets:
            sets.append("updated_at = datetime('now')")
            params.append(iata)
            sql = f"UPDATE airports SET {', '.join(sets)} WHERE iata_code = ?"
            cursor.execute(sql, params)
            updated += 1
    conn.commit()
    print(f"\n✓ Database updated: {updated} airports enriched")


# ── CLI ───────────────────────────────────────────────────────────────────────


def main() -> None:
    target_codes = (
        [c.upper() for c in sys.argv[1:]]
        if len(sys.argv) > 1
        else list(WIKIPEDIA_PAGES.keys())
    )

    if not DB_PATH.exists():
        print(f"Database not found at {DB_PATH}. Run setup_database.py first.")
        sys.exit(1)

    conn = get_connection()
    records: list[dict[str, Any]] = []

    print(f"Scraping {len(target_codes)} airports from Wikipedia...")
    for i, iata in enumerate(target_codes, 1):
        print(f"[{i}/{len(target_codes)}]", end="")
        rec = scrape_airport(iata)
        if rec:
            records.append(rec)
        if i < len(target_codes):
            time.sleep(1)  # polite rate-limit

    if records:
        # Save raw JSON alongside the database
        json_path = DB_DIR = DB_PATH.parent / "airports_scraped.json"
        with open(json_path, "w") as f:
            json.dump(records, f, indent=2)
        print(f"\n✓ Raw data saved to {json_path}")

        update_database(conn, records)
    else:
        print("\n⚠ No data scraped")

    conn.close()


if __name__ == "__main__":
    main()
