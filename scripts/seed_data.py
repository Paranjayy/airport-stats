#!/usr/bin/env python3
"""
Seed the SQLite database with 20+ major Indian airports and realistic statistics.

Run after setup_database.py:
    python scripts/setup_database.py
    python scripts/seed_data.py
"""

import sqlite3
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from setup_database import DB_PATH, get_connection

# ── Airport data ─────────────────────────────────────────────────────────────
# Coordinates are approximate WGS-84 values from public sources.
AIRPORTS = [
    # (iata, icao,   name,                                 city,           state,                  lat,       lon,        elev, type,       terminals, runways, rwy_len, operator)
    (
        "DEL",
        "VIDP",
        "Indira Gandhi International Airport",
        "New Delhi",
        "Delhi",
        28.5562,
        77.1000,
        777,
        "international",
        3,
        3,
        14534,
        "Delhi International Airport Ltd (DIAL)",
    ),
    (
        "BOM",
        "VABB",
        "Chhatrapati Shivaji Maharaj Intl",
        "Mumbai",
        "Maharashtra",
        19.0896,
        72.8656,
        39,
        "international",
        2,
        2,
        12007,
        "Mumbai International Airport Ltd (MIAL)",
    ),
    (
        "BLR",
        "VOBL",
        "Kempegowda International Airport",
        "Bengaluru",
        "Karnataka",
        13.1986,
        77.7066,
        3000,
        "international",
        1,
        2,
        12000,
        "Bangalore International Airport Ltd (BIAL)",
    ),
    (
        "MAA",
        "VOMM",
        "Chennai International Airport",
        "Chennai",
        "Tamil Nadu",
        12.9941,
        80.1709,
        52,
        "international",
        2,
        2,
        10050,
        "Chennai Airport Ltd",
    ),
    (
        "CCU",
        "VECC",
        "Netaji Subhas Chandra Bose Intl",
        "Kolkata",
        "West Bengal",
        22.6547,
        88.4467,
        16,
        "international",
        2,
        2,
        11900,
        "Airports Authority of India",
    ),
    (
        "HYD",
        "VOHS",
        "Rajiv Gandhi International Airport",
        "Hyderabad",
        "Telangana",
        17.2403,
        78.4294,
        2024,
        "international",
        1,
        2,
        13801,
        "GMR Hyderabad International Airport Ltd",
    ),
    (
        "GOI",
        "VOGO",
        "Goa International Airport (Dabolim)",
        "Vasco da Gama",
        "Goa",
        15.3809,
        73.8314,
        151,
        "international",
        1,
        1,
        11350,
        "Airports Authority of India",
    ),
    (
        "COK",
        "VOCL",
        "Cochin International Airport",
        "Kochi",
        "Kerala",
        10.1520,
        76.4019,
        30,
        "international",
        1,
        2,
        11150,
        "Cochin International Airport Ltd",
    ),
    (
        "PNQ",
        "VOPO",
        "Pune Airport (Lohegaon)",
        "Pune",
        "Maharashtra",
        18.5821,
        73.9197,
        1924,
        "domestic",
        1,
        1,
        8320,
        "Airports Authority of India",
    ),
    (
        "JAI",
        "VIJP",
        "Jaipur International Airport",
        "Jaipur",
        "Rajasthan",
        26.8242,
        75.8122,
        1387,
        "international",
        1,
        2,
        11168,
        "Rajasthan Airports Development Ltd",
    ),
    (
        "AMD",
        "VAAH",
        "Sardar Vallabhbhai Patel Intl",
        "Ahmedabad",
        "Gujarat",
        23.0770,
        72.6347,
        189,
        "international",
        1,
        2,
        11811,
        "Ahmedabad Airport Ltd",
    ),
    (
        "LKO",
        "VILK",
        "Chaudhary Charan Singh Intl",
        "Lucknow",
        "Uttar Pradesh",
        26.7606,
        80.8893,
        410,
        "international",
        1,
        2,
        11800,
        "Airports Authority of India",
    ),
    (
        "CXR",
        "VOCX",
        "Chandigarh International Airport",
        "Chandigarh",
        "Chandigarh",
        30.6735,
        76.7885,
        1012,
        "domestic",
        1,
        1,
        10400,
        "Airports Authority of India",
    ),
    (
        "VTZ",
        "VOVZ",
        "Visakhapatnam Airport (Gannavaram)",
        "Visakhapatnam",
        "Andhra Pradesh",
        17.7215,
        83.2245,
        159,
        "domestic",
        1,
        1,
        10500,
        "Airports Authority of India",
    ),
    (
        "PAT",
        "VEPT",
        "Lok Nayak Jayaprakash Airport",
        "Patna",
        "Bihar",
        25.5913,
        85.0880,
        170,
        "domestic",
        1,
        1,
        7500,
        "Airports Authority of India",
    ),
    (
        "GAU",
        "VEGT",
        "Lokpriya Gopinath Bordoloi Intl",
        "Guwahati",
        "Assam",
        26.1061,
        91.5859,
        162,
        "international",
        1,
        2,
        11200,
        "Airports Authority of India",
    ),
    (
        "IMF",
        "VEIM",
        "Imphal Airport (Tulihal)",
        "Imphal",
        "Manipur",
        24.7600,
        93.8967,
        2540,
        "domestic",
        1,
        1,
        9400,
        "Airports Authority of India",
    ),
    (
        "IXR",
        "VERC",
        "Ranchi Airport (Birsa Munda)",
        "Ranchi",
        "Jharkhand",
        23.3144,
        85.3217,
        2148,
        "domestic",
        1,
        1,
        8900,
        "Airports Authority of India",
    ),
    (
        "TRV",
        "VOTV",
        "Trivandrum International Airport",
        "Thiruvananthapuram",
        "Kerala",
        8.4821,
        76.9199,
        16,
        "international",
        1,
        2,
        11500,
        "Airports Authority of India",
    ),
    (
        "IXM",
        "VOMD",
        "Madurai Airport",
        "Madurai",
        "Tamil Nadu",
        9.8346,
        78.0934,
        328,
        "domestic",
        1,
        1,
        7500,
        "Airports Authority of India",
    ),
    (
        "IXB",
        "VEBD",
        "Bagdogra International Airport",
        "Siliguri",
        "West Bengal",
        26.6812,
        88.3286,
        412,
        "international",
        1,
        1,
        9000,
        "Airports Authority of India",
    ),
    (
        "IDR",
        "VANR",
        "Devi Ahilyabai Holkar Airport",
        "Indore",
        "Madhya Pradesh",
        22.7217,
        75.8011,
        1850,
        "domestic",
        1,
        1,
        9000,
        "Airports Authority of India",
    ),
    (
        "BBI",
        "VEBS",
        "Biju Patnaik International Airport",
        "Bhubaneswar",
        "Odisha",
        20.2444,
        85.8178,
        146,
        "international",
        1,
        1,
        9000,
        "Airports Authority of India",
    ),
    (
        "IXA",
        "VEAT",
        "Maharaja Bir Bikram Airport",
        "Agartala",
        "Tripura",
        23.8867,
        91.2396,
        46,
        "domestic",
        1,
        1,
        7500,
        "Airports Authority of India",
    ),
    (
        "IXZ",
        "VOPB",
        "Vir Savarkar International Airport",
        "Port Blair",
        "Andaman & Nicobar",
        11.6412,
        92.7297,
        16,
        "domestic",
        1,
        1,
        10700,
        "Airports Authority of India",
    ),
    (
        "DMU",
        "VEDM",
        "Dimapur Airport",
        "Dimapur",
        "Nagaland",
        25.8830,
        93.7711,
        488,
        "domestic",
        1,
        1,
        7500,
        "Airports Authority of India",
    ),
    (
        "SHL",
        "VEBI",
        "Shillong Airport (Umroi)",
        "Shillong",
        "Meghalaya",
        25.7037,
        91.9787,
        3316,
        "domestic",
        1,
        1,
        6000,
        "Airports Authority of India",
    ),
    (
        "SLM",
        "VOVO",
        "Salem Airport",
        "Salem",
        "Tamil Nadu",
        11.7833,
        78.0653,
        1004,
        "domestic",
        1,
        1,
        6500,
        "Airports Authority of India",
    ),
]

# ── Passenger statistics (2023) ──────────────────────────────────────────────
# Values are approximate annual figures in millions.
STATS_2023 = {
    "DEL": (73_000_000, 970_000, 460_000, 52_000_000, 21_000_000),
    "BOM": (52_000_000, 850_000, 380_000, 42_000_000, 10_000_000),
    "BLR": (37_000_000, 410_000, 260_000, 31_000_000, 6_000_000),
    "MAA": (22_000_000, 350_000, 200_000, 18_000_000, 4_000_000),
    "CCU": (20_000_000, 160_000, 180_000, 17_000_000, 3_000_000),
    "HYD": (25_000_000, 120_000, 220_000, 21_000_000, 4_000_000),
    "GOI": (9_500_000, 25_000, 75_000, 9_000_000, 500_000),
    "COK": (11_000_000, 65_000, 95_000, 9_500_000, 1_500_000),
    "PNQ": (9_000_000, 40_000, 80_000, 8_800_000, 200_000),
    "JAI": (9_500_000, 18_000, 85_000, 9_000_000, 500_000),
    "AMD": (14_000_000, 90_000, 120_000, 13_500_000, 500_000),
    "LKO": (8_000_000, 12_000, 75_000, 7_800_000, 200_000),
    "CXR": (5_000_000, 8_000, 50_000, 4_900_000, 100_000),
    "VTZ": (3_500_000, 15_000, 38_000, 3_400_000, 100_000),
    "PAT": (6_000_000, 5_000, 60_000, 5_900_000, 100_000),
    "GAU": (8_500_000, 22_000, 78_000, 7_800_000, 700_000),
    "IMF": (3_200_000, 3_000, 35_000, 3_150_000, 50_000),
    "IXR": (3_500_000, 2_000, 38_000, 3_450_000, 50_000),
    "TRV": (5_500_000, 20_000, 55_000, 5_000_000, 500_000),
    "IXM": (2_200_000, 1_500, 25_000, 2_200_000, 0),
    "IXB": (3_800_000, 2_000, 40_000, 3_700_000, 100_000),
    "IDR": (3_000_000, 3_000, 32_000, 2_980_000, 20_000),
    "BBI": (4_200_000, 8_000, 45_000, 4_100_000, 100_000),
    "IXA": (1_800_000, 500, 22_000, 1_800_000, 0),
    "IXZ": (1_200_000, 200, 15_000, 1_200_000, 0),
    "DMU": (800_000, 0, 10_000, 800_000, 0),
    "SHL": (500_000, 0, 8_000, 500_000, 0),
    "SLM": (300_000, 0, 5_000, 300_000, 0),
}

# Stats tuple: (passengers, cargo_tonnes, aircraft_movements, domestic, international)


def seed_airports(conn: sqlite3.Connection) -> None:
    """Insert airport records."""
    cursor = conn.cursor()
    inserted = 0
    for (
        iata,
        icao,
        name,
        city,
        state,
        lat,
        lon,
        elev,
        atype,
        terminals,
        runways,
        rwy_len,
        operator,
    ) in AIRPORTS:
        try:
            cursor.execute(
                """
                INSERT OR IGNORE INTO airports
                    (iata_code, icao_code, name, city, state, country,
                     latitude, longitude, elevation_ft, airport_type,
                     terminal_count, runway_count, runway_length_ft, operator)
                VALUES (?, ?, ?, ?, ?, 'India', ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    iata,
                    icao,
                    name,
                    city,
                    state,
                    lat,
                    lon,
                    elev,
                    atype,
                    terminals,
                    runways,
                    rwy_len,
                    operator,
                ),
            )
            if cursor.rowcount:
                inserted += 1
        except sqlite3.IntegrityError:
            pass
    conn.commit()
    print(f"✓ Airports seeded: {inserted} inserted ({len(AIRPORTS)} total)")


def seed_statistics(conn: sqlite3.Connection) -> None:
    """Insert 2023 passenger / cargo statistics."""
    cursor = conn.cursor()
    inserted = 0
    for iata, (pax, cargo, movements, dom, intl) in STATS_2023.items():
        row = cursor.execute(
            "SELECT id FROM airports WHERE iata_code = ?", (iata,)
        ).fetchone()
        if not row:
            continue
        airport_id = row["id"]
        try:
            cursor.execute(
                """
                INSERT OR IGNORE INTO statistics
                    (airport_id, year, passengers, cargo_tonnes,
                     aircraft_movements, domestic_passengers,
                     international_passengers, source)
                VALUES (?, 2023, ?, ?, ?, ?, ?, 'AIS India / DGCA')
                """,
                (airport_id, pax, cargo, movements, dom, intl),
            )
            if cursor.rowcount:
                inserted += 1
        except sqlite3.IntegrityError:
            pass
    conn.commit()
    print(f"✓ Statistics seeded: {inserted} records (2023)")


def seed_routes(conn: sqlite3.Connection) -> None:
    """Seed a representative set of domestic routes between the airports."""
    cursor = conn.cursor()
    routes_data = [
        # (origin_iata, dest_iata, distance_km, flight_min, carriers, frequency, aircraft)
        (
            "DEL",
            "BOM",
            1150,
            120,
            "IndiGo,Air India,Vistara,SpiceJet",
            "300+/week",
            "A320,B737",
        ),
        (
            "DEL",
            "BLR",
            1740,
            150,
            "IndiGo,Air India,Vistara,Akasa",
            "200+/week",
            "A320,B737",
        ),
        (
            "DEL",
            "MAA",
            1760,
            155,
            "IndiGo,Air India,SpiceJet",
            "150+/week",
            "A320,B737",
        ),
        ("DEL", "CCU", 1300, 130, "IndiGo,Air India,Vistara", "120+/week", "A320,B737"),
        (
            "DEL",
            "HYD",
            1260,
            125,
            "IndiGo,Air India,Vistara,Akasa",
            "180+/week",
            "A320,B737",
        ),
        ("DEL", "GOI", 1580, 145, "IndiGo,SpiceJet,Vistara", "60+/week", "A320,B737"),
        ("DEL", "COK", 2050, 170, "IndiGo,Air India,Vistara", "70+/week", "A320,B737"),
        ("DEL", "PNQ", 1180, 115, "IndiGo,Air India,SpiceJet", "80+/week", "A320,B737"),
        ("DEL", "JAI", 470, 70, "IndiGo,Air India,SpiceJet", "100+/week", "A320,B737"),
        ("DEL", "AMD", 930, 100, "IndiGo,Air India,Vistara", "80+/week", "A320,B737"),
        (
            "DEL",
            "LKO",
            490,
            75,
            "IndiGo,Air India,SpiceJet,Vistara",
            "90+/week",
            "A320,B737",
        ),
        (
            "BOM",
            "BLR",
            840,
            95,
            "IndiGo,Air India,Vistara,Akasa",
            "200+/week",
            "A320,B737",
        ),
        (
            "BOM",
            "MAA",
            1030,
            105,
            "IndiGo,Air India,Vistara,SpiceJet",
            "120+/week",
            "A320,B737",
        ),
        ("BOM", "CCU", 1660, 145, "IndiGo,Air India,Vistara", "80+/week", "A320,B737"),
        (
            "BOM",
            "HYD",
            710,
            85,
            "IndiGo,Air India,Vistara,Akasa",
            "150+/week",
            "A320,B737",
        ),
        ("BOM", "GOI", 580, 70, "IndiGo,SpiceJet,Vistara", "50+/week", "A320,B737"),
        ("BOM", "COK", 1090, 110, "IndiGo,Air India,Vistara", "70+/week", "A320,B737"),
        ("BOM", "PNQ", 240, 45, "IndiGo,SpiceJet,Akasa", "40+/week", "ATR72,A320"),
        ("BOM", "JAI", 1070, 110, "IndiGo,SpiceJet", "40+/week", "A320,B737"),
        ("BOM", "AMD", 520, 65, "IndiGo,Air India,Akasa", "80+/week", "A320,B737"),
        ("BOM", "LKO", 1220, 120, "IndiGo,Air India", "40+/week", "A320,B737"),
        ("BLR", "MAA", 275, 50, "IndiGo,Air India,Akasa", "80+/week", "A320,ATR72"),
        ("BLR", "HYD", 500, 65, "IndiGo,Air India,Akasa", "100+/week", "A320,B737"),
        ("BLR", "CCU", 1550, 135, "IndiGo,Air India", "50+/week", "A320,B737"),
        ("BLR", "COK", 340, 55, "IndiGo,Air India,Akasa", "60+/week", "A320,ATR72"),
        ("BLR", "GOI", 550, 70, "IndiGo,SpiceJet", "30+/week", "A320,B737"),
        ("BLR", "PNQ", 730, 85, "IndiGo,Air India", "30+/week", "A320,B737"),
        ("BLR", "TRV", 680, 80, "IndiGo,Air India", "30+/week", "A320,B737"),
        ("MAA", "CCU", 1350, 125, "IndiGo,Air India", "60+/week", "A320,B737"),
        ("MAA", "HYD", 610, 75, "IndiGo,Air India,Akasa", "80+/week", "A320,B737"),
        ("MAA", "COK", 690, 80, "IndiGo,Air India", "40+/week", "A320,B737"),
        ("MAA", "TRV", 620, 75, "IndiGo,Air India", "30+/week", "A320,B737"),
        ("CCU", "HYD", 1210, 115, "IndiGo,Air India", "40+/week", "A320,B737"),
        ("CCU", "GAU", 970, 95, "IndiGo,Air India,IndiGo", "60+/week", "A320,B737"),
        ("CCU", "PAT", 540, 65, "IndiGo,Air India,SpiceJet", "40+/week", "A320,B737"),
        ("CCU", "IXB", 580, 70, "IndiGo,Air India", "20+/week", "A320,B737"),
        ("HYD", "COK", 790, 90, "IndiGo,Air India", "40+/week", "A320,B737"),
        ("HYD", "AMD", 850, 95, "IndiGo,Air India", "30+/week", "A320,B737"),
        ("HYD", "TRV", 920, 100, "IndiGo,Air India", "20+/week", "A320,B737"),
        ("COK", "TRV", 200, 40, "IndiGo,Air India", "40+/week", "ATR72,A320"),
        ("GAU", "IMF", 480, 60, "IndiGo,Air India", "14+/week", "A320,B737"),
        ("JAI", "AMD", 540, 65, "IndiGo,SpiceJet", "14+/week", "A320,B737"),
        ("JAI", "BBI", 1340, 125, "IndiGo", "7+/week", "A320"),
        ("LKO", "AMD", 790, 90, "IndiGo", "14+/week", "A320"),
        ("LKO", "BLR", 1550, 135, "IndiGo,Air India", "20+/week", "A320,B737"),
    ]

    inserted = 0
    for orig, dest, dist, flight_min, carriers, freq, aircraft in routes_data:
        o = cursor.execute(
            "SELECT id FROM airports WHERE iata_code = ?", (orig,)
        ).fetchone()
        d = cursor.execute(
            "SELECT id FROM airports WHERE iata_code = ?", (dest,)
        ).fetchone()
        if not o or not d:
            continue
        try:
            cursor.execute(
                """
                INSERT OR IGNORE INTO routes
                    (origin_airport_id, dest_airport_id, distance_km,
                     flight_time_min, carriers, frequency, aircraft_used)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (o["id"], d["id"], dist, flight_min, carriers, freq, aircraft),
            )
            if cursor.rowcount:
                inserted += 1
        except sqlite3.IntegrityError:
            pass
    conn.commit()
    print(f"✓ Routes seeded: {inserted} routes")


def main() -> None:
    if not DB_PATH.exists():
        print(f"Database not found at {DB_PATH}. Run setup_database.py first.")
        sys.exit(1)

    conn = get_connection()
    seed_airports(conn)
    seed_statistics(conn)
    seed_routes(conn)

    # Summary
    counts = {
        t: conn.execute(f"SELECT COUNT(*) FROM [{t}]").fetchone()[0]
        for t in ("airports", "statistics", "routes")
    }
    print("\nDatabase summary:")
    for table, count in counts.items():
        print(f"  • {table}: {count} rows")
    conn.close()


if __name__ == "__main__":
    main()
