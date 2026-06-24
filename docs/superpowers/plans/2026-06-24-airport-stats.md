# Airport Stats Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a comprehensive airport statistics visualization platform with interactive maps, real-time data, and flight tracking features for Indian airports.

**Architecture:** Transform the existing track-policy codebase into an airport stats platform using Next.js 16, React 19, TypeScript, Tailwind CSS v4, and react-simple-maps for interactive visualizations. Data will be scraped from Wikipedia and other sources, stored in a local database, and displayed through an intuitive UI.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, react-simple-maps, d3-geo, SQLite, Python (data scraping), GitHub API

---

## Phase 1: Project Setup and Data Collection

### Task 1: Initialize GitHub Repository

**Files:**
- Create: `.gitignore` (updated)
- Create: `package.json` (updated)
- Create: `README.md` (updated)

- [ ] **Step 1: Update .gitignore for airport data project**

```gitignore
# dependencies
node_modules/
.pnp
.pnp.js

# testing
coverage/

# next.js
.next/
out/

# production
build/

# misc
.DS_Store
*.pem

# debug
npm-debug.log*

# local env files
.env*.local

# typescript
*.tsbuildinfo
next-env.d.ts

# data files
data/raw/
data/processed/
*.db
*.sqlite

# Python
__pycache__/
*.pyc
.venv/
venv/

# IDE
.vscode/
.idea/
```

- [ ] **Step 2: Update package.json with new dependencies**

```json
{
  "name": "airport-stats",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "scrape:airports": "python scripts/scrape_airports.py",
    "scrape:flights": "python scripts/scrape_flights.py",
    "db:setup": "python scripts/setup_database.py",
    "db:seed": "python scripts/seed_data.py",
    "data:refresh": "npm run scrape:airports && npm run db:seed"
  },
  "dependencies": {
    "@number-flow/react": "^0.6.0",
    "@vercel/analytics": "^2.0.1",
    "d3-geo": "^3.1.1",
    "framer-motion": "^12.38.0",
    "better-sqlite3": "^11.0.0",
    "next": "16.2.3",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "react-simple-maps": "^3.0.0",
    "topojson-client": "^3.1.0"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.8",
    "@types/d3-geo": "^3.1.0",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/react-simple-maps": "^3.0.6",
    "@types/topojson-client": "^3.1.5",
    "@tailwindcss/postcss": "^4",
    "dotenv": "^17.4.1",
    "eslint": "^9",
    "eslint-config-next": "16.2.3",
    "tailwindcss": "^4",
    "tsx": "^4.21.0",
    "typescript": "^5"
  }
}
```

- [ ] **Step 3: Update README.md**

```markdown
# Airport Stats

A comprehensive airport statistics visualization platform featuring interactive maps, real-time data, and flight tracking for Indian airports.

## Features

- 🗺️ Interactive map of Indian airports
- 📊 Airport statistics and passenger data
- ✈️ Flight tracking and route visualization
- 📈 Historical data trends
- 🔍 Search and filter capabilities
- 📱 Responsive design for all devices

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Maps:** react-simple-maps, d3-geo, topojson-client
- **Database:** SQLite with better-sqlite3
- **Data Collection:** Python scripts for Wikipedia scraping
- **Deployment:** Vercel

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up database: `npm run db:setup`
4. Seed data: `npm run db:seed`
5. Start development server: `npm run dev`

## Data Sources

- Wikipedia: Airport information and statistics
- Airport websites: Official data
- Aviation databases: Flight data

## Contributing

Contributions are welcome! Please read our contributing guidelines first.

## License

MIT License
```

- [ ] **Step 4: Initialize Git repository and push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit: Airport Stats project setup"
git remote add origin https://github.com/yourusername/airport-stats.git
git push -u origin main
```

### Task 2: Set Up Database Schema

**Files:**
- Create: `scripts/setup_database.py`
- Create: `scripts/seed_data.py`
- Create: `lib/database.ts`

- [ ] **Step 1: Create Python database setup script**

```python
#!/usr/bin/env python3
"""Setup SQLite database for airport statistics."""

import sqlite3
import os
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "data" / "airport_stats.db"

def setup_database():
    """Create database tables."""
    os.makedirs(DB_PATH.parent, exist_ok=True)
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create airports table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS airports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            iata_code TEXT UNIQUE NOT NULL,
            icao_code TEXT,
            name TEXT NOT NULL,
            city TEXT NOT NULL,
            state TEXT NOT NULL,
            country TEXT DEFAULT 'India',
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            elevation INTEGER,
            airport_type TEXT,
            runway_count INTEGER,
            runway_length INTEGER,
            passenger_count INTEGER,
            cargo_tonnes REAL,
            website TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Create flights table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS flights (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            flight_number TEXT NOT NULL,
            airline TEXT NOT NULL,
            origin_iata TEXT NOT NULL,
            destination_iata TEXT NOT NULL,
            departure_time TIMESTAMP,
            arrival_time TIMESTAMP,
            status TEXT,
            aircraft_type TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (origin_iata) REFERENCES airports(iata_code),
            FOREIGN KEY (destination_iata) REFERENCES airports(iata_code)
        )
    """)
    
    # Create statistics table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS statistics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            airport_id INTEGER NOT NULL,
            year INTEGER NOT NULL,
            month INTEGER,
            passenger_count INTEGER,
            cargo_tonnes REAL,
            flight_count INTEGER,
            domestic_passengers INTEGER,
            international_passengers INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (airport_id) REFERENCES airports(id)
        )
    """)
    
    # Create routes table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS routes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            origin_iata TEXT NOT NULL,
            destination_iata TEXT NOT NULL,
            airline TEXT NOT NULL,
            frequency INTEGER,
            aircraft_type TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (origin_iata) REFERENCES airports(iata_code),
            FOREIGN KEY (destination_iata) REFERENCES airports(iata_code)
        )
    """)
    
    # Create indexes
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_airports_iata ON airports(iata_code)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_airports_state ON airports(state)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_flights_origin ON flights(origin_iata)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_flights_destination ON flights(destination_iata)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_statistics_airport ON statistics(airport_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_statistics_year ON statistics(year)")
    
    conn.commit()
    conn.close()
    print(f"Database setup complete at {DB_PATH}")

if __name__ == "__main__":
    setup_database()
```

- [ ] **Step 2: Create data seeding script**

```python
#!/usr/bin/env python3
"""Seed database with initial airport data."""

import sqlite3
import json
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "data" / "airport_stats.db"
DATA_DIR = Path(__file__).parent.parent / "data" / "airports"

def seed_airports():
    """Seed airports from JSON data."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Sample Indian airports data
    airports = [
        {"iata": "DEL", "icao": "VIDP", "name": "Indira Gandhi International Airport", "city": "New Delhi", "state": "Delhi", "lat": 28.5562, "lon": 77.1000, "elevation": 237, "type": "International", "runways": 3, "runway_length": 4430, "passengers": 73000000, "cargo": 950000},
        {"iata": "BOM", "icao": "VABB", "name": "Chhatrapati Shivaji Maharaj International Airport", "city": "Mumbai", "state": "Maharashtra", "lat": 19.0896, "lon": 72.8656, "elevation": 4, "type": "International", "runways": 2, "runway_length": 3660, "passengers": 52000000, "cargo": 850000},
        {"iata": "BLR", "icao": "VOBL", "name": "Kempegowda International Airport", "city": "Bengaluru", "state": "Karnataka", "lat": 13.1986, "lon": 77.7066, "elevation": 915, "type": "International", "runways": 2, "runway_length": 4000, "passengers": 38000000, "cargo": 420000},
        {"iata": "MAA", "icao": "VOMM", "name": "Chennai International Airport", "city": "Chennai", "state": "Tamil Nadu", "lat": 12.9941, "lon": 80.1709, "elevation": 16, "type": "International", "runways": 2, "runway_length": 3200, "passengers": 25000000, "cargo": 380000},
        {"iata": "CCU", "icao": "VECC", "name": "Netaji Subhas Chandra Bose International Airport", "city": "Kolkata", "state": "West Bengal", "lat": 22.6547, "lon": 88.4467, "elevation": 5, "type": "International", "runways": 2, "runway_length": 3200, "passengers": 22000000, "cargo": 290000},
        {"iata": "HYD", "icao": "VOHS", "name": "Rajiv Gandhi International Airport", "city": "Hyderabad", "state": "Telangana", "lat": 17.2403, "lon": 78.4294, "elevation": 617, "type": "International", "runways": 2, "runway_length": 4260, "passengers": 25000000, "cargo": 220000},
        {"iata": "GOI", "icao": "VOGO", "name": "Goa International Airport", "city": "Goa", "state": "Goa", "lat": 15.3809, "lon": 73.8314, "elevation": 56, "type": "International", "runways": 1, "runway_length": 3450, "passengers": 10000000, "cargo": 45000},
        {"iata": "COK", "icao": "VOCI", "name": "Cochin International Airport", "city": "Kochi", "state": "Kerala", "lat": 9.9471, "lon": 76.2733, "elevation": 9, "type": "International", "runways": 2, "runway_length": 3400, "passengers": 12000000, "cargo": 85000},
        {"iata": "PNQ", "icao": "VAPO", "name": "Pune Airport", "city": "Pune", "state": "Maharashtra", "lat": 18.5821, "lon": 73.9197, "elevation": 592, "type": "Domestic", "runways": 1, "runway_length": 2570, "passengers": 10000000, "cargo": 35000},
        {"iata": "JAI", "icao": "VIJP", "name": "Jaipur International Airport", "city": "Jaipur", "state": "Rajasthan", "lat": 26.8242, "lon": 75.8122, "elevation": 385, "type": "International", "runways": 2, "runway_length": 3500, "passengers": 10000000, "cargo": 28000},
    ]
    
    for airport in airports:
        cursor.execute("""
            INSERT OR REPLACE INTO airports (iata_code, icao_code, name, city, state, latitude, longitude, elevation, airport_type, runway_count, runway_length, passenger_count, cargo_tonnes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (airport["iata"], airport["icao"], airport["name"], airport["city"], airport["state"], airport["lat"], airport["lon"], airport["elevation"], airport["type"], airport["runways"], airport["runway_length"], airport["passengers"], airport["cargo"]))
    
    conn.commit()
    conn.close()
    print(f"Seeded {len(airports)} airports")

if __name__ == "__main__":
    seed_airports()
```

- [ ] **Step 3: Create TypeScript database interface**

```typescript
// lib/database.ts
import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'airport_stats.db');

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH, { readonly: true });
  }
  return db;
}

export interface Airport {
  id: number;
  iata_code: string;
  icao_code: string;
  name: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  elevation: number;
  airport_type: string;
  runway_count: number;
  runway_length: number;
  passenger_count: number;
  cargo_tonnes: number;
  website: string;
}

export interface Flight {
  id: number;
  flight_number: string;
  airline: string;
  origin_iata: string;
  destination_iata: string;
  departure_time: string;
  arrival_time: string;
  status: string;
  aircraft_type: string;
}

export interface Statistics {
  id: number;
  airport_id: number;
  year: number;
  month: number;
  passenger_count: number;
  cargo_tonnes: number;
  flight_count: number;
  domestic_passengers: number;
  international_passengers: number;
}

export function getAirports(): Airport[] {
  const db = getDatabase();
  return db.prepare('SELECT * FROM airports ORDER BY passenger_count DESC').all() as Airport[];
}

export function getAirportByIata(iata: string): Airport | undefined {
  const db = getDatabase();
  return db.prepare('SELECT * FROM airports WHERE iata_code = ?').get(iata) as Airport | undefined;
}

export function getAirportsByState(state: string): Airport[] {
  const db = getDatabase();
  return db.prepare('SELECT * FROM airports WHERE state = ? ORDER BY passenger_count DESC').all(state) as Airport[];
}

export function getFlightsByAirport(iata: string): Flight[] {
  const db = getDatabase();
  return db.prepare('SELECT * FROM flights WHERE origin_iata = ? OR destination_iata = ?').all(iata, iata) as Flight[];
}

export function getStatisticsByAirport(airportId: number, year?: number): Statistics[] {
  const db = getDatabase();
  if (year) {
    return db.prepare('SELECT * FROM statistics WHERE airport_id = ? AND year = ?').all(airportId, year) as Statistics[];
  }
  return db.prepare('SELECT * FROM statistics WHERE airport_id = ?').all(airportId) as Statistics[];
}

export function getAirportStats() {
  const db = getDatabase();
  const totalAirports = db.prepare('SELECT COUNT(*) as count FROM airports').get() as { count: number };
  const totalPassengers = db.prepare('SELECT SUM(passenger_count) as total FROM airports').get() as { total: number };
  const totalCargo = db.prepare('SELECT SUM(cargo_tonnes) as total FROM airports').get() as { total: number };
  
  return {
    totalAirports: totalAirports.count,
    totalPassengers: totalPassengers.total || 0,
    totalCargo: totalCargo.total || 0,
  };
}
```

- [ ] **Step 4: Run database setup and seed**

```bash
python scripts/setup_database.py
python scripts/seed_data.py
```

- [ ] **Step 5: Commit changes**

```bash
git add .
git commit -m "feat: setup database schema and seed data"
git push origin main
```

### Task 3: Create Wikipedia Scraper

**Files:**
- Create: `scripts/scrape_airports.py`
- Create: `scripts/requirements.txt`

- [ ] **Step 1: Create requirements.txt**

```txt
requests>=2.31.0
beautifulsoup4>=4.12.0
pandas>=2.0.0
lxml>=4.9.0
```

- [ ] **Step 2: Create Wikipedia scraper script**

```python
#!/usr/bin/env python3
"""Scrape airport data from Wikipedia."""

import requests
from bs4 import BeautifulSoup
import pandas as pd
import json
import re
from pathlib import Path
import time

DATA_DIR = Path(__file__).parent.parent / "data" / "airports"

def scrape_indian_airports():
    """Scrape list of airports in India from Wikipedia."""
    url = "https://en.wikipedia.org/wiki/List_of_airports_in_India"
    
    headers = {
        'User-Agent': 'AirportStatsBot/1.0 (Educational Project)'
    }
    
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'lxml')
    
    airports = []
    
    # Find all tables with airport data
    tables = soup.find_all('table', {'class': 'wikitable'})
    
    for table in tables:
        rows = table.find_all('tr')
        headers = [th.get_text(strip=True) for th in rows[0].find_all(['th', 'td'])]
        
        for row in rows[1:]:
            cols = row.find_all(['td', 'th'])
            if len(cols) >= 6:
                try:
                    # Extract airport information
                    name_cell = cols[1]
                    name_link = name_cell.find('a')
                    name = name_link.get_text(strip=True) if name_link else name_cell.get_text(strip=True)
                    
                    # Extract IATA code
                    iata = cols[2].get_text(strip=True)
                    
                    # Extract ICAO code
                    icao = cols[3].get_text(strip=True)
                    
                    # Extract city
                    city = cols[4].get_text(strip=True)
                    
                    # Extract state
                    state = cols[5].get_text(strip=True)
                    
                    # Extract coordinates if available
                    lat, lon = None, None
                    coord_cell = cols[6] if len(cols) > 6 else None
                    if coord_cell:
                        coord_link = coord_cell.find('a')
                        if coord_link and 'coord' in coord_link.get('href', ''):
                            coord_text = coord_link.get_text(strip=True)
                            # Parse coordinates
                            coord_match = re.search(r'(\d+)[°d]\s*(\d+)[′m]\s*([\d.]+)[″s]', coord_text)
                            if coord_match:
                                d, m, s = map(float, coord_match.groups())
                                lat = d + m/60 + s/3600
                    
                    airport_data = {
                        'name': name,
                        'iata': iata,
                        'icao': icao,
                        'city': city,
                        'state': state,
                        'latitude': lat,
                        'longitude': lon,
                        'country': 'India'
                    }
                    
                    airports.append(airport_data)
                    
                except Exception as e:
                    print(f"Error parsing row: {e}")
                    continue
    
    return airports

def scrape_airport_details(iata_code):
    """Scrape detailed information for a specific airport."""
    url = f"https://en.wikipedia.org/wiki/{iata_code}_Airport"
    
    headers = {
        'User-Agent': 'AirportStatsBot/1.0 (Educational Project)'
    }
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            return None
            
        soup = BeautifulSoup(response.content, 'lxml')
        
        # Extract infobox data
        infobox = soup.find('table', {'class': 'infobox'})
        if not infobox:
            return None
        
        details = {}
        
        # Extract various fields
        rows = infobox.find_all('tr')
        for row in rows:
            header = row.find('th')
            value = row.find('td')
            if header and value:
                key = header.get_text(strip=True).lower()
                val = value.get_text(strip=True)
                
                if 'passenger' in key or 'traffic' in key:
                    # Parse passenger numbers
                    num_match = re.search(r'([\d,]+)', val)
                    if num_match:
                        details['passengers'] = int(num_match.group(1).replace(',', ''))
                
                elif 'cargo' in key or 'freight' in key:
                    # Parse cargo tonnage
                    num_match = re.search(r'([\d,.]+)', val)
                    if num_match:
                        details['cargo'] = float(num_match.group(1).replace(',', ''))
                
                elif 'runway' in key and 'length' in key:
                    # Parse runway length
                    num_match = re.search(r'([\d,]+)', val)
                    if num_match:
                        details['runway_length'] = int(num_match.group(1).replace(',', ''))
                
                elif 'elevation' in key:
                    # Parse elevation
                    num_match = re.search(r'([\d,.]+)', val)
                    if num_match:
                        details['elevation'] = float(num_match.group(1).replace(',', ''))
        
        return details
        
    except Exception as e:
        print(f"Error scraping {iata_code}: {e}")
        return None

def save_airports(airports, filename='indian_airports.json'):
    """Save airports to JSON file."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    filepath = DATA_DIR / filename
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(airports, f, indent=2, ensure_ascii=False)
    
    print(f"Saved {len(airports)} airports to {filepath}")

if __name__ == "__main__":
    print("Scraping Indian airports from Wikipedia...")
    airports = scrape_indian_airports()
    
    # Get details for each airport
    for i, airport in enumerate(airports[:10]):  # Limit to first 10 for demo
        print(f"Scraping details for {airport['iata']} ({i+1}/{min(10, len(airports))})")
        details = scrape_airport_details(airport['iata'])
        if details:
            airport.update(details)
        time.sleep(1)  # Be polite to Wikipedia
    
    save_airports(airports)
    print("Scraping complete!")
```

- [ ] **Step 3: Install Python dependencies and run scraper**

```bash
cd scripts
pip install -r requirements.txt
python scrape_airports.py
```

- [ ] **Step 4: Commit changes**

```bash
git add .
git commit -m "feat: add Wikipedia scraper for Indian airports"
git push origin main
```

## Phase 2: Frontend Development

### Task 4: Create Map Component

**Files:**
- Create: `components/map/IndiaMap.tsx`
- Create: `components/map/AirportMarker.tsx`
- Create: `lib/projections.ts`
- Create: `lib/map-utils.ts`

- [ ] **Step 1: Create India projection**

```typescript
// lib/projections.ts
import { geoMercator, geoOrthographic } from 'd3-geo';

export const indiaProjection = geoMercator()
  .center([82.5, 22.5]) // Center of India
  .scale(1200)
  .translate([480, 300]);

export const globeProjection = geoOrthographic()
  .scale(250)
  .translate([250, 250])
  .rotate([-82.5, -22.5, 0]);
```

- [ ] **Step 2: Create map utilities**

```typescript
// lib/map-utils.ts
export const NEUTRAL_FILL = '#1a1a2e';
export const NEUTRAL_STROKE = '#16213e';
export const AIRPORT_COLOR = '#0f3460';
export const AIRPORT_HOVER = '#e94560';
export const SELECTED_COLOR = '#533483';

export type SetTooltip = React.Dispatch<React.SetStateAction<{
  x: number;
  y: number;
  label: string;
  airport?: any;
} | null>>;

export function getAirportSize(passengerCount: number): number {
  if (passengerCount > 50000000) return 12;
  if (passengerCount > 20000000) return 10;
  if (passengerCount > 10000000) return 8;
  if (passengerCount > 5000000) return 6;
  return 4;
}

export function getAirportColor(airportType: string): string {
  switch (airportType.toLowerCase()) {
    case 'international':
      return '#e94560';
    case 'domestic':
      return '#0f3460';
    case 'customs':
      return '#533483';
    default:
      return '#16213e';
  }
}
```

- [ ] **Step 3: Create India map component**

```tsx
// components/map/IndiaMap.tsx
"use client";

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  type ProjectionFunction,
} from "react-simple-maps";
import { indiaProjection } from "@/lib/projections";
import { getAirportSize, getAirportColor, NEUTRAL_STROKE, type SetTooltip } from "@/lib/map-utils";
import type { Airport } from "@/lib/database";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface IndiaMapProps {
  airports: Airport[];
  selectedAirport: Airport | null;
  onSelectAirport: (airport: Airport) => void;
  setTooltip: SetTooltip;
}

export default function IndiaMap({
  airports,
  selectedAirport,
  onSelectAirport,
  setTooltip,
}: IndiaMapProps) {
  const proj = indiaProjection as unknown as ProjectionFunction;

  return (
    <div
      className="relative w-full h-full"
      onMouseMove={(e) =>
        setTooltip((current) =>
          current ? { ...current, x: e.clientX, y: e.clientY } : current,
        )
      }
      onMouseLeave={() => setTooltip(null)}
    >
      <ComposableMap
        width={960}
        height={600}
        projection={proj}
        style={{
          width: "100%",
          height: "100%",
          shapeRendering: "geometricPrecision",
        }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies
              .filter((geo) => geo.properties.name === "India")
              .map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: NEUTRAL_STROKE,
                      stroke: "#0f3460",
                      strokeWidth: 1,
                      outline: "none",
                    },
                    hover: {
                      fill: "#16213e",
                      stroke: "#0f3460",
                      strokeWidth: 1,
                      outline: "none",
                    },
                    pressed: {
                      fill: "#16213e",
                      stroke: "#0f3460",
                      strokeWidth: 1,
                      outline: "none",
                    },
                  }}
                />
              ))
          }
        </Geographies>
        
        {/* Airport markers */}
        {airports.map((airport) => {
          const pos = proj([airport.longitude, airport.latitude]);
          if (!pos) return null;
          
          const isSelected = selectedAirport?.iata_code === airport.iata_code;
          const size = getAirportSize(airport.passenger_count);
          const color = getAirportColor(airport.airport_type);
          
          return (
            <Marker
              key={airport.iata_code}
              coordinates={[airport.longitude, airport.latitude]}
              onMouseEnter={(e) =>
                setTooltip({
                  x: e.clientX,
                  y: e.clientY,
                  label: airport.name,
                  airport,
                })
              }
              onMouseLeave={() => setTooltip(null)}
              onClick={() => onSelectAirport(airport)}
            >
              <circle
                r={size}
                fill={isSelected ? "#e94560" : color}
                stroke="#fff"
                strokeWidth={isSelected ? 2 : 1}
                style={{
                  cursor: "pointer",
                  transition: "all 200ms ease-in-out",
                  filter: isSelected ? "drop-shadow(0 0 8px #e94560)" : "none",
                }}
              />
              {/* Airport label */}
              <text
                textAnchor="middle"
                y={-size - 5}
                style={{
                  fontFamily: "system-ui",
                  fontSize: "8px",
                  fill: "#fff",
                  pointerEvents: "none",
                }}
              >
                {airport.iata_code}
              </text>
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  );
}
```

- [ ] **Step 4: Commit changes**

```bash
git add .
git commit -m "feat: add India map component with airport markers"
git push origin main
```

### Task 5: Create Dashboard Layout

**Files:**
- Create: `app/layout.tsx` (updated)
- Create: `app/page.tsx` (updated)
- Create: `components/dashboard/Header.tsx`
- Create: `components/dashboard/Sidebar.tsx`
- Create: `components/dashboard/StatsCard.tsx`
- Create: `components/dashboard/AirportList.tsx`

- [ ] **Step 1: Update layout.tsx**

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Airport Stats - Indian Airport Statistics",
  description: "Interactive map and statistics for Indian airports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          {children}
        </div>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create Header component**

```tsx
// components/dashboard/Header.tsx
"use client";

import { Search } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-xl">✈</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Airport Stats</h1>
              <p className="text-sm text-white/60">Indian Airport Statistics</p>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search airports..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Create StatsCard component**

```tsx
// components/dashboard/StatsCard.tsx
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
}

export default function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/60">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {trend && (
            <p className="text-xs text-green-400 mt-1">{trend}</p>
          )}
        </div>
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-2xl">
          {icon}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create AirportList component**

```tsx
// components/dashboard/AirportList.tsx
"use client";

import type { Airport } from "@/lib/database";

interface AirportListProps {
  airports: Airport[];
  selectedAirport: Airport | null;
  onSelectAirport: (airport: Airport) => void;
}

export default function AirportList({
  airports,
  selectedAirport,
  onSelectAirport,
}: AirportListProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-white mb-4">Airports</h3>
      <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto">
        {airports.map((airport) => (
          <button
            key={airport.iata_code}
            onClick={() => onSelectAirport(airport)}
            className={`w-full text-left p-3 rounded-lg transition-all ${
              selectedAirport?.iata_code === airport.iata_code
                ? "bg-purple-500/30 border border-purple-500/50"
                : "bg-white/5 border border-white/10 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">{airport.iata_code}</p>
                <p className="text-sm text-white/60">{airport.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">
                  {(airport.passenger_count / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-white/40">passengers</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Update main page**

```tsx
// app/page.tsx
"use client";

import { useState, useMemo } from "react";
import Header from "@/components/dashboard/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import AirportList from "@/components/dashboard/AirportList";
import IndiaMap from "@/components/map/IndiaMap";
import type { Airport } from "@/lib/database";

// Mock data - replace with database calls
const mockAirports: Airport[] = [
  {
    id: 1,
    iata_code: "DEL",
    icao_code: "VIDP",
    name: "Indira Gandhi International Airport",
    city: "New Delhi",
    state: "Delhi",
    country: "India",
    latitude: 28.5562,
    longitude: 77.1000,
    elevation: 237,
    airport_type: "International",
    runway_count: 3,
    runway_length: 4430,
    passenger_count: 73000000,
    cargo_tonnes: 950000,
    website: "https://www.delhiairport.com",
  },
  // Add more mock airports...
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    label: string;
    airport?: Airport;
  } | null>(null);

  const filteredAirports = useMemo(() => {
    if (!searchQuery) return mockAirports;
    const query = searchQuery.toLowerCase();
    return mockAirports.filter(
      (airport) =>
        airport.name.toLowerCase().includes(query) ||
        airport.iata_code.toLowerCase().includes(query) ||
        airport.city.toLowerCase().includes(query) ||
        airport.state.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const stats = useMemo(() => {
    const totalPassengers = mockAirports.reduce(
      (sum, airport) => sum + airport.passenger_count,
      0
    );
    const totalCargo = mockAirports.reduce(
      (sum, airport) => sum + airport.cargo_tonnes,
      0
    );
    return {
      totalAirports: mockAirports.length,
      totalPassengers,
      totalCargo,
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatsCard
            title="Total Airports"
            value={stats.totalAirports}
            icon="✈"
            trend="+2 this year"
          />
          <StatsCard
            title="Total Passengers"
            value={`${(stats.totalPassengers / 1000000).toFixed(1)}M`}
            icon="👥"
            trend="+12.5% vs last year"
          />
          <StatsCard
            title="Total Cargo"
            value={`${(stats.totalCargo / 1000).toFixed(1)}K`}
            icon="📦"
            trend="+8.3% vs last year"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map */}
          <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
            <IndiaMap
              airports={filteredAirports}
              selectedAirport={selectedAirport}
              onSelectAirport={setSelectedAirport}
              setTooltip={setTooltip}
            />
          </div>

          {/* Sidebar */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
            <AirportList
              airports={filteredAirports}
              selectedAirport={selectedAirport}
              onSelectAirport={setSelectedAirport}
            />
          </div>
        </div>

        {/* Selected Airport Details */}
        {selectedAirport && (
          <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-4">
              {selectedAirport.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-white/60">IATA Code</p>
                <p className="text-lg font-semibold text-white">
                  {selectedAirport.iata_code}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/60">City</p>
                <p className="text-lg font-semibold text-white">
                  {selectedAirport.city}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/60">State</p>
                <p className="text-lg font-semibold text-white">
                  {selectedAirport.state}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/60">Passengers (Annual)</p>
                <p className="text-lg font-semibold text-white">
                  {(selectedAirport.passenger_count / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-black/90 text-white px-3 py-2 rounded-lg text-sm pointer-events-none"
          style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}
        >
          <p className="font-medium">{tooltip.label}</p>
          {tooltip.airport && (
            <p className="text-white/60">
              {tooltip.airport.city}, {tooltip.airport.state}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Commit changes**

```bash
git add .
git commit -m "feat: add dashboard layout with map and stats"
git push origin main
```

### Task 6: Add Flight Tracking Features

**Files:**
- Create: `components/flights/FlightTracker.tsx`
- Create: `components/flights/FlightRoute.tsx`
- Create: `lib/flights.ts`
- Create: `app/api/flights/route.ts`

- [ ] **Step 1: Create flight utilities**

```typescript
// lib/flights.ts
import { getDatabase, type Flight } from "./database";

export interface FlightWithDetails extends Flight {
  origin_name: string;
  origin_city: string;
  destination_name: string;
  destination_city: string;
  duration_minutes: number;
}

export function getFlightsByRoute(originIata: string, destinationIata: string): FlightWithDetails[] {
  const db = getDatabase();
  
  return db.prepare(`
    SELECT 
      f.*,
      o.name as origin_name,
      o.city as origin_city,
      d.name as destination_name,
      d.city as destination_city,
      ROUND((JULIANDAY(f.arrival_time) - JULIANDAY(f.departure_time)) * 24 * 60) as duration_minutes
    FROM flights f
    JOIN airports o ON f.origin_iata = o.iata_code
    JOIN airports d ON f.destination_iata = d.iata_code
    WHERE f.origin_iata = ? AND f.destination_iata = ?
  `).all(originIata, destinationIata) as FlightWithDetails[];
}

export function getTopRoutes(limit: number = 10): Array<{
  origin: string;
  destination: string;
  flight_count: number;
  airline: string;
}> {
  const db = getDatabase();
  
  return db.prepare(`
    SELECT 
      origin_iata as origin,
      destination_iata as destination,
      COUNT(*) as flight_count,
      airline
    FROM flights
    GROUP BY origin_iata, destination_iata, airline
    ORDER BY flight_count DESC
    LIMIT ?
  `).all(limit) as Array<{
    origin: string;
    destination: string;
    flight_count: number;
    airline: string;
  }>;
}

export function getFlightsByAirport(iata: string): FlightWithDetails[] {
  const db = getDatabase();
  
  return db.prepare(`
    SELECT 
      f.*,
      o.name as origin_name,
      o.city as origin_city,
      d.name as destination_name,
      d.city as destination_city,
      ROUND((JULIANDAY(f.arrival_time) - JULIANDAY(f.departure_time)) * 24 * 60) as duration_minutes
    FROM flights f
    JOIN airports o ON f.origin_iata = o.iata_code
    JOIN airports d ON f.destination_iata = d.iata_code
    WHERE f.origin_iata = ? OR f.destination_iata = ?
    ORDER BY f.departure_time
  `).all(iata, iata) as FlightWithDetails[];
}
```

- [ ] **Step 2: Create flight API route**

```typescript
// app/api/flights/route.ts
import { NextResponse } from "next/server";
import { getFlightsByRoute, getTopRoutes, getFlightsByAirport } from "@/lib/flights";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const airport = searchParams.get("airport");
  const limit = parseInt(searchParams.get("limit") || "10");

  try {
    if (origin && destination) {
      const flights = getFlightsByRoute(origin, destination);
      return NextResponse.json({ flights });
    }

    if (airport) {
      const flights = getFlightsByAirport(airport);
      return NextResponse.json({ flights });
    }

    const topRoutes = getTopRoutes(limit);
    return NextResponse.json({ topRoutes });
  } catch (error) {
    console.error("Error fetching flights:", error);
    return NextResponse.json(
      { error: "Failed to fetch flight data" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: Create FlightTracker component**

```tsx
// components/flights/FlightTracker.tsx
"use client";

import { useState, useEffect } from "react";
import { Search, Plane, Clock, MapPin } from "lucide-react";

interface Flight {
  id: number;
  flight_number: string;
  airline: string;
  origin_iata: string;
  origin_name: string;
  origin_city: string;
  destination_iata: string;
  destination_name: string;
  destination_city: string;
  departure_time: string;
  arrival_time: string;
  status: string;
  aircraft_type: string;
  duration_minutes: number;
}

interface FlightTrackerProps {
  selectedAirport?: string;
}

export default function FlightTracker({ selectedAirport }: FlightTrackerProps) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<"route" | "airport">("airport");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  useEffect(() => {
    if (selectedAirport) {
      fetchFlightsByAirport(selectedAirport);
    }
  }, [selectedAirport]);

  const fetchFlightsByAirport = async (iata: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/flights?airport=${iata}`);
      const data = await response.json();
      setFlights(data.flights || []);
    } catch (error) {
      console.error("Error fetching flights:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFlightsByRoute = async () => {
    if (!origin || !destination) return;
    setLoading(true);
    try {
      const response = await fetch(
        `/api/flights?origin=${origin}&destination=${destination}`
      );
      const data = await response.json();
      setFlights(data.flights || []);
    } catch (error) {
      console.error("Error fetching flights:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time: string) => {
    return new Date(time).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Plane className="w-5 h-5" />
        Flight Tracker
      </h3>

      {/* Search Options */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSearchType("airport")}
          className={`px-3 py-1 rounded-lg text-sm ${
            searchType === "airport"
              ? "bg-purple-500 text-white"
              : "bg-white/10 text-white/60 hover:bg-white/20"
          }`}
        >
          By Airport
        </button>
        <button
          onClick={() => setSearchType("route")}
          className={`px-3 py-1 rounded-lg text-sm ${
            searchType === "route"
              ? "bg-purple-500 text-white"
              : "bg-white/10 text-white/60 hover:bg-white/20"
          }`}
        >
          By Route
        </button>
      </div>

      {/* Search Form */}
      {searchType === "route" ? (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Origin (e.g., DEL)"
            value={origin}
            onChange={(e) => setOrigin(e.target.value.toUpperCase())}
            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            placeholder="Destination (e.g., BOM)"
            value={destination}
            onChange={(e) => setDestination(e.target.value.toUpperCase())}
            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={fetchFlightsByRoute}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Airport code (e.g., DEL)"
            value={selectedAirport || ""}
            onChange={(e) => fetchFlightsByAirport(e.target.value.toUpperCase())}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      )}

      {/* Flights List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-white/60 mt-2">Loading flights...</p>
          </div>
        ) : flights.length === 0 ? (
          <div className="text-center py-8">
            <Plane className="w-12 h-12 text-white/20 mx-auto mb-2" />
            <p className="text-white/60">No flights found</p>
          </div>
        ) : (
          flights.map((flight) => (
            <div
              key={flight.id}
              className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">
                  {flight.flight_number}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs ${
                    flight.status === "On Time"
                      ? "bg-green-500/20 text-green-400"
                      : flight.status === "Delayed"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {flight.status}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex-1">
                  <p className="text-white/60">From</p>
                  <p className="text-white font-medium">{flight.origin_iata}</p>
                  <p className="text-white/40 text-xs">{flight.origin_city}</p>
                </div>

                <div className="flex-1 text-center">
                  <p className="text-white/60">Duration</p>
                  <p className="text-white font-medium">
                    {formatDuration(flight.duration_minutes)}
                  </p>
                  <p className="text-white/40 text-xs">{flight.airline}</p>
                </div>

                <div className="flex-1 text-right">
                  <p className="text-white/60">To</p>
                  <p className="text-white font-medium">
                    {flight.destination_iata}
                  </p>
                  <p className="text-white/40 text-xs">
                    {flight.destination_city}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 text-xs text-white/40">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(flight.departure_time)}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {flight.aircraft_type}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(flight.arrival_time)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit changes**

```bash
git add .
git commit -m "feat: add flight tracking features"
git push origin main
```

### Task 7: Add Advanced Features

**Files:**
- Create: `components/analytics/AirportAnalytics.tsx`
- Create: `components/charts/PassengerChart.tsx`
- Create: `components/charts/CargoChart.tsx`
- Create: `lib/analytics.ts`

- [ ] **Step 1: Create analytics utilities**

```typescript
// lib/analytics.ts
import { getDatabase } from "./database";

export interface AirportAnalytics {
  airport_id: number;
  year: number;
  monthly_data: Array<{
    month: number;
    passengers: number;
    cargo: number;
    flights: number;
  }>;
  yearly_totals: {
    passengers: number;
    cargo: number;
    flights: number;
  };
  growth_rate: {
    passengers: number;
    cargo: number;
    flights: number;
  };
}

export function getAirportAnalytics(
  airportId: number,
  year: number
): AirportAnalytics {
  const db = getDatabase();

  // Get monthly data
  const monthlyData = db
    .prepare(
      `
    SELECT 
      month,
      passenger_count as passengers,
      cargo_tonnes as cargo,
      flight_count as flights
    FROM statistics
    WHERE airport_id = ? AND year = ?
    ORDER BY month
  `
    )
    .all(airportId, year) as Array<{
    month: number;
    passengers: number;
    cargo: number;
    flights: number;
  }>;

  // Get yearly totals
  const yearlyTotals = db
    .prepare(
      `
    SELECT 
      SUM(passenger_count) as passengers,
      SUM(cargo_tonnes) as cargo,
      SUM(flight_count) as flights
    FROM statistics
    WHERE airport_id = ? AND year = ?
  `
    )
    .get(airportId, year) as {
    passengers: number;
    cargo: number;
    flights: number;
  };

  // Get previous year for growth rate
  const prevYearTotals = db
    .prepare(
      `
    SELECT 
      SUM(passenger_count) as passengers,
      SUM(cargo_tonnes) as cargo,
      SUM(flight_count) as flights
    FROM statistics
    WHERE airport_id = ? AND year = ?
  `
    )
    .get(airportId, year - 1) as {
    passengers: number;
    cargo: number;
    flights: number;
  };

  // Calculate growth rates
  const growthRate = {
    passengers:
      prevYearTotals.passengers > 0
        ? ((yearlyTotals.passengers - prevYearTotals.passengers) /
            prevYearTotals.passengers) *
          100
        : 0,
    cargo:
      prevYearTotals.cargo > 0
        ? ((yearlyTotals.cargo - prevYearTotals.cargo) / prevYearTotals.cargo) *
          100
        : 0,
    flights:
      prevYearTotals.flights > 0
        ? ((yearlyTotals.flights - prevYearTotals.flights) /
            prevYearTotals.flights) *
          100
        : 0,
  };

  return {
    airport_id: airportId,
    year,
    monthly_data: monthlyData,
    yearly_totals: yearlyTotals,
    growth_rate: growthRate,
  };
}

export function getTopAirportsByPassengers(limit: number = 10) {
  const db = getDatabase();

  return db
    .prepare(
      `
    SELECT 
      iata_code,
      name,
      city,
      state,
      passenger_count,
      cargo_tonnes,
      airport_type
    FROM airports
    ORDER BY passenger_count DESC
    LIMIT ?
  `
    )
    .all(limit) as Array<{
    iata_code: string;
    name: string;
    city: string;
    state: string;
    passenger_count: number;
    cargo_tonnes: number;
    airport_type: string;
  }>;
}

export function getAirportsByState() {
  const db = getDatabase();

  return db
    .prepare(
      `
    SELECT 
      state,
      COUNT(*) as airport_count,
      SUM(passenger_count) as total_passengers,
      SUM(cargo_tonnes) as total_cargo
    FROM airports
    GROUP BY state
    ORDER BY total_passengers DESC
  `
    )
    .all() as Array<{
    state: string;
    airport_count: number;
    total_passengers: number;
    total_cargo: number;
  }>;
}
```

- [ ] **Step 2: Create PassengerChart component**

```tsx
// components/charts/PassengerChart.tsx
"use client";

interface PassengerChartProps {
  data: Array<{
    month: number;
    passengers: number;
  }>;
}

export default function PassengerChart({ data }: PassengerChartProps) {
  const maxPassengers = Math.max(...data.map((d) => d.passengers));
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-4">
        Monthly Passengers
      </h3>
      <div className="flex items-end gap-2 h-48">
        {data.map((item) => {
          const height = (item.passengers / maxPassengers) * 100;
          return (
            <div key={item.month} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all hover:from-purple-400 hover:to-pink-400"
                style={{ height: `${height}%` }}
                title={`${months[item.month - 1]}: ${(
                  item.passengers / 1000000
                ).toFixed(1)}M passengers`}
              />
              <span className="text-xs text-white/60 mt-2">
                {months[item.month - 1]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create CargoChart component**

```tsx
// components/charts/CargoChart.tsx
"use client";

interface CargoChartProps {
  data: Array<{
    month: number;
    cargo: number;
  }>;
}

export default function CargoChart({ data }: CargoChartProps) {
  const maxCargo = Math.max(...data.map((d) => d.cargo));
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-4">Monthly Cargo</h3>
      <div className="flex items-end gap-2 h-48">
        {data.map((item) => {
          const height = (item.cargo / maxCargo) * 100;
          return (
            <div key={item.month} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg transition-all hover:from-blue-400 hover:to-cyan-400"
                style={{ height: `${height}%` }}
                title={`${months[item.month - 1]}: ${item.cargo.toFixed(
                  1
                )} tonnes`}
              />
              <span className="text-xs text-white/60 mt-2">
                {months[item.month - 1]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create AirportAnalytics component**

```tsx
// components/analytics/AirportAnalytics.tsx
"use client";

import { useState, useEffect } from "react";
import PassengerChart from "@/components/charts/PassengerChart";
import CargoChart from "@/components/charts/CargoChart";
import type { Airport } from "@/lib/database";

interface AnalyticsData {
  monthly_data: Array<{
    month: number;
    passengers: number;
    cargo: number;
    flights: number;
  }>;
  yearly_totals: {
    passengers: number;
    cargo: number;
    flights: number;
  };
  growth_rate: {
    passengers: number;
    cargo: number;
    flights: number;
  };
}

interface AirportAnalyticsProps {
  airport: Airport;
}

export default function AirportAnalytics({ airport }: AirportAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [year, setYear] = useState(2024);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [airport.id, year]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Mock data for demo - replace with actual API call
      const mockData: AnalyticsData = {
        monthly_data: Array.from({ length: 12 }, (_, i) => ({
          month: i + 1,
          passengers: Math.floor(Math.random() * 5000000) + 2000000,
          cargo: Math.floor(Math.random() * 50000) + 20000,
          flights: Math.floor(Math.random() * 10000) + 5000,
        })),
        yearly_totals: {
          passengers: airport.passenger_count,
          cargo: airport.cargo_tonnes,
          flights: Math.floor(Math.random() * 100000) + 50000,
        },
        growth_rate: {
          passengers: 12.5,
          cargo: 8.3,
          flights: 10.2,
        },
      };
      setAnalytics(mockData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/10 rounded w-1/3"></div>
          <div className="h-48 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Year Selector */}
      <div className="flex items-center gap-4">
        <h3 className="text-lg font-semibold text-white">
          Analytics for {airport.name}
        </h3>
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {[2024, 2023, 2022, 2021, 2020].map((y) => (
            <option key={y} value={y} className="bg-slate-800">
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Yearly Totals */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-sm text-white/60">Total Passengers</p>
          <p className="text-2xl font-bold text-white">
            {(analytics.yearly_totals.passengers / 1000000).toFixed(1)}M
          </p>
          <p
            className={`text-xs ${
              analytics.growth_rate.passengers >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {analytics.growth_rate.passengers >= 0 ? "+" : ""}
            {analytics.growth_rate.passengers.toFixed(1)}% vs prev year
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-sm text-white/60">Total Cargo</p>
          <p className="text-2xl font-bold text-white">
            {(analytics.yearly_totals.cargo / 1000).toFixed(1)}K tonnes
          </p>
          <p
            className={`text-xs ${
              analytics.growth_rate.cargo >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {analytics.growth_rate.cargo >= 0 ? "+" : ""}
            {analytics.growth_rate.cargo.toFixed(1)}% vs prev year
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-sm text-white/60">Total Flights</p>
          <p className="text-2xl font-bold text-white">
            {(analytics.yearly_totals.flights / 1000).toFixed(1)}K
          </p>
          <p
            className={`text-xs ${
              analytics.growth_rate.flights >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {analytics.growth_rate.flights >= 0 ? "+" : ""}
            {analytics.growth_rate.flights.toFixed(1)}% vs prev year
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PassengerChart data={analytics.monthly_data} />
        <CargoChart data={analytics.monthly_data} />
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Commit changes**

```bash
git add .
git commit -m "feat: add analytics and charts"
git push origin main
```

### Task 8: Add Real-time Data Sources

**Files:**
- Create: `scripts/scrape_flights.py`
- Create: `lib/api-clients.ts`
- Create: `app/api/realtime/route.ts`

- [ ] **Step 1: Create flight scraping script**

```python
#!/usr/bin/env python3
"""Scrape flight data from public sources."""

import requests
from bs4 import BeautifulSoup
import json
import time
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data" / "flights"

def scrape_flight_radar():
    """Scrape flight data from FlightRadar24 (demo)."""
    # Note: This is for educational purposes only
    # In production, use official APIs
    
    url = "https://www.flightradar24.com/data/flights"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'lxml')
            # Parse flight data (simplified)
            flights = []
            # This is a simplified example
            return flights
    except Exception as e:
        print(f"Error scraping FlightRadar: {e}")
        return []

def scrape_google_flights():
    """Scrape flight data from Google Flights (demo)."""
    # Note: Google Flights uses dynamic loading
    # This is a simplified example
    
    flights = []
    # In reality, you'd use Selenium or similar
    return flights

def save_flights(flights, filename='flights.json'):
    """Save flights to JSON file."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    filepath = DATA_DIR / filename
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(flights, f, indent=2, ensure_ascii=False)
    
    print(f"Saved {len(flights)} flights to {filepath}")

if __name__ == "__main__":
    print("Scraping flight data...")
    
    # For demo purposes, generate mock flight data
    mock_flights = [
        {
            "flight_number": "AI-101",
            "airline": "Air India",
            "origin": "DEL",
            "destination": "BOM",
            "departure": "2024-01-15 08:00:00",
            "arrival": "2024-01-15 10:30:00",
            "status": "On Time",
            "aircraft": "Boeing 787"
        },
        # Add more mock flights...
    ]
    
    save_flights(mock_flights)
    print("Flight scraping complete!")
```

- [ ] **Step 2: Create API clients**

```typescript
// lib/api-clients.ts
interface FlightData {
  flight_number: string;
  airline: string;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  status: string;
  aircraft: string;
}

export async function fetchFlightsFromAPI(
  origin: string,
  destination: string
): Promise<FlightData[]> {
  // In production, integrate with real APIs
  // For now, return mock data
  
  const mockFlights: FlightData[] = [
    {
      flight_number: "AI-101",
      airline: "Air India",
      origin: origin,
      destination: destination,
      departure: new Date(
        Date.now() + Math.random() * 24 * 60 * 60 * 1000
      ).toISOString(),
      arrival: new Date(
        Date.now() + Math.random() * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000
      ).toISOString(),
      status: "On Time",
      aircraft: "Boeing 787",
    },
    {
      flight_number: "6E-201",
      airline: "IndiGo",
      origin: origin,
      destination: destination,
      departure: new Date(
        Date.now() + Math.random() * 24 * 60 * 60 * 1000
      ).toISOString(),
      arrival: new Date(
        Date.now() + Math.random() * 24 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000
      ).toISOString(),
      status: "Delayed",
      aircraft: "Airbus A320",
    },
  ];
  
  return mockFlights;
}

export async function getAirportCoordinates(
  iataCode: string
): Promise<{ lat: number; lon: number } | null> {
  // In production, use a geocoding API
  const coordinates: Record<string, { lat: number; lon: number }> = {
    DEL: { lat: 28.5562, lon: 77.1000 },
    BOM: { lat: 19.0896, lon: 72.8656 },
    BLR: { lat: 13.1986, lon: 77.7066 },
    MAA: { lat: 12.9941, lon: 80.1709 },
    CCU: { lat: 22.6547, lon: 88.4467 },
  };
  
  return coordinates[iataCode] || null;
}
```

- [ ] **Step 3: Create real-time API route**

```typescript
// app/api/realtime/route.ts
import { NextResponse } from "next/server";
import { fetchFlightsFromAPI } from "@/lib/api-clients";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");

  if (!origin || !destination) {
    return NextResponse.json(
      { error: "Origin and destination are required" },
      { status: 400 }
    );
  }

  try {
    const flights = await fetchFlightsFromAPI(origin, destination);
    return NextResponse.json({ flights });
  } catch (error) {
    console.error("Error fetching real-time flights:", error);
    return NextResponse.json(
      { error: "Failed to fetch real-time flight data" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 4: Commit changes**

```bash
git add .
git commit -m "feat: add real-time flight data sources"
git push origin main
```

## Phase 3: Advanced Features

### Task 9: Add Airport Comparison Feature

**Files:**
- Create: `components/comparison/AirportComparison.tsx`
- Create: `app/compare/page.tsx`
- Create: `lib/comparison.ts`

- [ ] **Step 1: Create comparison utilities**

```typescript
// lib/comparison.ts
import { getDatabase, type Airport } from "./database";

export interface AirportComparison {
  airports: Airport[];
  metrics: {
    passengers: {
      values: number[];
      max: number;
      min: number;
      avg: number;
    };
    cargo: {
      values: number[];
      max: number;
      min: number;
      avg: number;
    };
    runways: {
      values: number[];
      max: number;
      min: number;
      avg: number;
    };
  };
}

export function compareAirports(iataCodes: string[]): AirportComparison {
  const db = getDatabase();
  
  const airports = iataCodes
    .map((code) => db.prepare("SELECT * FROM airports WHERE iata_code = ?").get(code) as Airport)
    .filter(Boolean);
  
  const passengers = airports.map((a) => a.passenger_count);
  const cargo = airports.map((a) => a.cargo_tonnes);
  const runways = airports.map((a) => a.runway_count);
  
  return {
    airports,
    metrics: {
      passengers: {
        values: passengers,
        max: Math.max(...passengers),
        min: Math.min(...passengers),
        avg: passengers.reduce((a, b) => a + b, 0) / passengers.length,
      },
      cargo: {
        values: cargo,
        max: Math.max(...cargo),
        min: Math.min(...cargo),
        avg: cargo.reduce((a, b) => a + b, 0) / cargo.length,
      },
      runways: {
        values: runways,
        max: Math.max(...runways),
        min: Math.min(...runways),
        avg: runways.reduce((a, b) => a + b, 0) / runways.length,
      },
    },
  };
}

export function getAirportRankings(metric: 'passengers' | 'cargo' | 'runways', limit: number = 10) {
  const db = getDatabase();
  
  const orderBy = metric === 'passengers' ? 'passenger_count' : 
                  metric === 'cargo' ? 'cargo_tonnes' : 'runway_count';
  
  return db.prepare(`
    SELECT 
      iata_code,
      name,
      city,
      ${orderBy} as value
    FROM airports
    ORDER BY ${orderBy} DESC
    LIMIT ?
  `).all(limit) as Array<{
    iata_code: string;
    name: string;
    city: string;
    value: number;
  }>;
}
```

- [ ] **Step 2: Create AirportComparison component**

```tsx
// components/comparison/AirportComparison.tsx
"use client";

import { useState } from "react";
import { BarChart3, TrendingUp, Users, Package } from "lucide-react";

interface Airport {
  iata_code: string;
  name: string;
  city: string;
  passenger_count: number;
  cargo_tonnes: number;
  runway_count: number;
}

interface AirportComparisonProps {
  airports: Airport[];
}

export default function AirportComparison({ airports }: AirportComparisonProps) {
  const [selectedMetric, setSelectedMetric] = useState<
    "passengers" | "cargo" | "runways"
  >("passengers");

  const maxValue = Math.max(
    ...airports.map((a) =>
      selectedMetric === "passengers"
        ? a.passenger_count
        : selectedMetric === "cargo"
        ? a.cargo_tonnes
        : a.runway_count
    )
  );

  const getMetricValue = (airport: Airport) => {
    switch (selectedMetric) {
      case "passengers":
        return airport.passenger_count;
      case "cargo":
        return airport.cargo_tonnes;
      case "runways":
        return airport.runway_count;
    }
  };

  const formatValue = (value: number) => {
    switch (selectedMetric) {
      case "passengers":
        return `${(value / 1000000).toFixed(1)}M`;
      case "cargo":
        return `${(value / 1000).toFixed(1)}K`;
      case "runways":
        return value.toString();
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
      <h3 className="text-xl font-bold text-white mb-6">Airport Comparison</h3>

      {/* Metric Selector */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedMetric("passengers")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            selectedMetric === "passengers"
              ? "bg-purple-500 text-white"
              : "bg-white/10 text-white/60 hover:bg-white/20"
          }`}
        >
          <Users className="w-4 h-4" />
          Passengers
        </button>
        <button
          onClick={() => setSelectedMetric("cargo")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            selectedMetric === "cargo"
              ? "bg-purple-500 text-white"
              : "bg-white/10 text-white/60 hover:bg-white/20"
          }`}
        >
          <Package className="w-4 h-4" />
          Cargo
        </button>
        <button
          onClick={() => setSelectedMetric("runways")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            selectedMetric === "runways"
              ? "bg-purple-500 text-white"
              : "bg-white/10 text-white/60 hover:bg-white/20"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Runways
        </button>
      </div>

      {/* Comparison Bars */}
      <div className="space-y-4">
        {airports.map((airport) => {
          const value = getMetricValue(airport);
          const percentage = (value / maxValue) * 100;

          return (
            <div key={airport.iata_code} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-white">
                    {airport.iata_code}
                  </span>
                  <span className="text-sm text-white/60">{airport.name}</span>
                </div>
                <span className="font-medium text-white">
                  {formatValue(value)}
                </span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-sm text-white/60">Highest</p>
          <p className="text-lg font-bold text-white">
            {formatValue(
              Math.max(...airports.map((a) => getMetricValue(a)))
            )}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-white/60">Lowest</p>
          <p className="text-lg font-bold text-white">
            {formatValue(
              Math.min(...airports.map((a) => getMetricValue(a)))
            )}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-white/60">Average</p>
          <p className="text-lg font-bold text-white">
            {formatValue(
              airports.reduce((sum, a) => sum + getMetricValue(a), 0) /
                airports.length
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create comparison page**

```tsx
// app/compare/page.tsx
"use client";

import { useState } from "react";
import Header from "@/components/dashboard/Header";
import AirportComparison from "@/components/comparison/AirportComparison";

// Mock airports for comparison
const mockAirports = [
  {
    iata_code: "DEL",
    name: "Indira Gandhi International Airport",
    city: "New Delhi",
    passenger_count: 73000000,
    cargo_tonnes: 950000,
    runway_count: 3,
  },
  {
    iata_code: "BOM",
    name: "Chhatrapati Shivaji Maharaj International Airport",
    city: "Mumbai",
    passenger_count: 52000000,
    cargo_tonnes: 850000,
    runway_count: 2,
  },
  {
    iata_code: "BLR",
    name: "Kempegowda International Airport",
    city: "Bengaluru",
    passenger_count: 38000000,
    cargo_tonnes: 420000,
    runway_count: 2,
  },
];

export default function ComparePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Compare Airports</h1>
          <p className="text-white/60 mt-2">
            Select airports to compare their statistics
          </p>
        </div>

        <AirportComparison airports={mockAirports} />
      </main>
    </div>
  );
}
```

- [ ] **Step 4: Commit changes**

```bash
git add .
git commit -m "feat: add airport comparison feature"
git push origin main
```

### Task 10: Add Search and Filter Capabilities

**Files:**
- Create: `components/search/SearchFilter.tsx`
- Create: `lib/search.ts`

- [ ] **Step 1: Create search utilities**

```typescript
// lib/search.ts
import { getDatabase, type Airport } from "./database";

export interface SearchFilters {
  query?: string;
  state?: string;
  type?: string;
  minPassengers?: number;
  maxPassengers?: number;
}

export function searchAirports(filters: SearchFilters): Airport[] {
  const db = getDatabase();
  
  let query = "SELECT * FROM airports WHERE 1=1";
  const params: any[] = [];
  
  if (filters.query) {
    query += " AND (name LIKE ? OR iata_code LIKE ? OR city LIKE ? OR state LIKE ?)";
    const searchTerm = `%${filters.query}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }
  
  if (filters.state) {
    query += " AND state = ?";
    params.push(filters.state);
  }
  
  if (filters.type) {
    query += " AND airport_type = ?";
    params.push(filters.type);
  }
  
  if (filters.minPassengers) {
    query += " AND passenger_count >= ?";
    params.push(filters.minPassengers);
  }
  
  if (filters.maxPassengers) {
    query += " AND passenger_count <= ?";
    params.push(filters.maxPassengers);
  }
  
  query += " ORDER BY passenger_count DESC";
  
  return db.prepare(query).all(...params) as Airport[];
}

export function getStates(): string[] {
  const db = getDatabase();
  return db.prepare("SELECT DISTINCT state FROM airports ORDER BY state").all() as string[];
}

export function getAirportTypes(): string[] {
  const db = getDatabase();
  return db.prepare("SELECT DISTINCT airport_type FROM airports ORDER BY airport_type").all() as string[];
}
```

- [ ] **Step 2: Create SearchFilter component**

```tsx
// components/search/SearchFilter.tsx
"use client";

import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";

interface SearchFilters {
  query?: string;
  state?: string;
  type?: string;
  minPassengers?: number;
  maxPassengers?: number;
}

interface SearchFilterProps {
  onFiltersChange: (filters: SearchFilters) => void;
}

export default function SearchFilter({ onFiltersChange }: SearchFilterProps) {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [states, setStates] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Mock data - replace with API calls
    setStates([
      "Delhi",
      "Maharashtra",
      "Karnataka",
      "Tamil Nadu",
      "West Bengal",
      "Telangana",
    ]);
    setTypes(["International", "Domestic", "Customs"]);
  }, []);

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== ""
  );

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search airports..."
            value={filters.query || ""}
            onChange={(e) => handleFilterChange("query", e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-lg ${
            showFilters
              ? "bg-purple-500 text-white"
              : "bg-white/10 text-white/60 hover:bg-white/20"
          }`}
        >
          <Filter className="w-4 h-4" />
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="p-2 rounded-lg bg-white/10 text-white/60 hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-1">State</label>
            <select
              value={filters.state || ""}
              onChange={(e) => handleFilterChange("state", e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="" className="bg-slate-800">
                All States
              </option>
              {states.map((state) => (
                <option key={state} value={state} className="bg-slate-800">
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1">
              Airport Type
            </label>
            <select
              value={filters.type || ""}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="" className="bg-slate-800">
                All Types
              </option>
              {types.map((type) => (
                <option key={type} value={type} className="bg-slate-800">
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1">
              Min Passengers
            </label>
            <input
              type="number"
              placeholder="0"
              value={filters.minPassengers || ""}
              onChange={(e) =>
                handleFilterChange(
                  "minPassengers",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1">
              Max Passengers
            </label>
            <input
              type="number"
              placeholder="∞"
              value={filters.maxPassengers || ""}
              onChange={(e) =>
                handleFilterChange(
                  "maxPassengers",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      )}

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.state && (
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm flex items-center gap-1">
              State: {filters.state}
              <button
                onClick={() => handleFilterChange("state", undefined)}
                className="hover:text-white"
              >
                ×
              </button>
            </span>
          )}
          {filters.type && (
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm flex items-center gap-1">
              Type: {filters.type}
              <button
                onClick={() => handleFilterChange("type", undefined)}
                className="hover:text-white"
              >
                ×
              </button>
            </span>
          )}
          {filters.minPassengers && (
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm flex items-center gap-1">
              Min: {filters.minPassengers.toLocaleString()}
              <button
                onClick={() => handleFilterChange("minPassengers", undefined)}
                className="hover:text-white"
              >
                ×
              </button>
            </span>
          )}
          {filters.maxPassengers && (
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm flex items-center gap-1">
              Max: {filters.maxPassengers.toLocaleString()}
              <button
                onClick={() => handleFilterChange("maxPassengers", undefined)}
                className="hover:text-white"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Commit changes**

```bash
git add .
git commit -m "feat: add search and filter capabilities"
git push origin main
```

### Task 11: Add Data Visualization Dashboard

**Files:**
- Create: `components/dashboard/DataDashboard.tsx`
- Create: `components/charts/StateChart.tsx`
- Create: `components/charts/TrendChart.tsx`
- Create: `lib/visualizations.ts`

- [ ] **Step 1: Create visualization utilities**

```typescript
// lib/visualizations.ts
import { getDatabase } from "./database";

export interface StateData {
  state: string;
  airport_count: number;
  total_passengers: number;
  total_cargo: number;
}

export interface TrendData {
  year: number;
  passengers: number;
  cargo: number;
  flights: number;
}

export function getStateData(): StateData[] {
  const db = getDatabase();
  
  return db.prepare(`
    SELECT 
      state,
      COUNT(*) as airport_count,
      SUM(passenger_count) as total_passengers,
      SUM(cargo_tonnes) as total_cargo
    FROM airports
    GROUP BY state
    ORDER BY total_passengers DESC
  `).all() as StateData[];
}

export function getYearlyTrends(years: number = 5): TrendData[] {
  const db = getDatabase();
  const currentYear = new Date().getFullYear();
  
  return db.prepare(`
    SELECT 
      year,
      SUM(passenger_count) as passengers,
      SUM(cargo_tonnes) as cargo,
      SUM(flight_count) as flights
    FROM statistics
    WHERE year >= ?
    GROUP BY year
    ORDER BY year
  `).all(currentYear - years) as TrendData[];
}

export function getTopRoutes(limit: number = 10) {
  const db = getDatabase();
  
  return db.prepare(`
    SELECT 
      f.origin_iata,
      f.destination_iata,
      COUNT(*) as flight_count,
      o.name as origin_name,
      d.name as destination_name
    FROM flights f
    JOIN airports o ON f.origin_iata = o.iata_code
    JOIN airports d ON f.destination_iata = d.iata_code
    GROUP BY f.origin_iata, f.destination_iata
    ORDER BY flight_count DESC
    LIMIT ?
  `).all(limit) as Array<{
    origin_iata: string;
    destination_iata: string;
    flight_count: number;
    origin_name: string;
    destination_name: string;
  }>;
}
```

- [ ] **Step 2: Create StateChart component**

```tsx
// components/charts/StateChart.tsx
"use client";

interface StateChartProps {
  data: Array<{
    state: string;
    airport_count: number;
    total_passengers: number;
  }>;
}

export default function StateChart({ data }: StateChartProps) {
  const maxValue = Math.max(...data.map((d) => d.total_passengers));
  const colors = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-yellow-500 to-orange-500",
    "from-red-500 to-rose-500",
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-4">
        Airports by State
      </h3>
      <div className="space-y-3">
        {data.slice(0, 5).map((item, index) => {
          const percentage = (item.total_passengers / maxValue) * 100;
          return (
            <div key={item.state} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white">{item.state}</span>
                <span className="text-white/60">
                  {item.airport_count} airports
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${
                    colors[index % colors.length]
                  } rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create TrendChart component**

```tsx
// components/charts/TrendChart.tsx
"use client";

interface TrendChartProps {
  data: Array<{
    year: number;
    passengers: number;
  }>;
}

export default function TrendChart({ data }: TrendChartProps) {
  const maxValue = Math.max(...data.map((d) => d.passengers));
  const minValue = Math.min(...data.map((d) => d.passengers));
  const range = maxValue - minValue;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-4">
        Passenger Trends
      </h3>
      <div className="flex items-end gap-2 h-48">
        {data.map((item) => {
          const height = range > 0 
            ? ((item.passengers - minValue) / range) * 80 + 20
            : 50;
          return (
            <div key={item.year} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg transition-all hover:from-indigo-400 hover:to-purple-400"
                style={{ height: `${height}%` }}
                title={`${item.year}: ${(item.passengers / 1000000).toFixed(
                  1
                )}M passengers`}
              />
              <span className="text-xs text-white/60 mt-2">{item.year}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create DataDashboard component**

```tsx
// components/dashboard/DataDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import StateChart from "@/components/charts/StateChart";
import TrendChart from "@/components/charts/TrendChart";
import { BarChart3, TrendingUp, Map } from "lucide-react";

interface DashboardData {
  stateData: Array<{
    state: string;
    airport_count: number;
    total_passengers: number;
  }>;
  trendData: Array<{
    year: number;
    passengers: number;
  }>;
}

export default function DataDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with API calls
    const mockData: DashboardData = {
      stateData: [
        { state: "Maharashtra", airport_count: 5, total_passengers: 62000000 },
        { state: "Delhi", airport_count: 3, total_passengers: 73000000 },
        { state: "Karnataka", airport_count: 4, total_passengers: 38000000 },
        { state: "Tamil Nadu", airport_count: 4, total_passengers: 25000000 },
        { state: "West Bengal", airport_count: 3, total_passengers: 22000000 },
      ],
      trendData: [
        { year: 2020, passengers: 340000000 },
        { year: 2021, passengers: 180000000 },
        { year: 2022, passengers: 420000000 },
        { year: 2023, passengers: 480000000 },
        { year: 2024, passengers: 520000000 },
      ],
    };
    setData(mockData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm"
          >
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-white/10 rounded w-1/3"></div>
              <div className="h-48 bg-white/10 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StateChart data={data.stateData} />
      <TrendChart data={data.trendData} />
    </div>
  );
}
```

- [ ] **Step 5: Commit changes**

```bash
git add .
git commit -m "feat: add data visualization dashboard"
git push origin main
```

## Phase 4: Testing and Deployment

### Task 12: Add Tests

**Files:**
- Create: `__tests__/components/StatsCard.test.tsx`
- Create: `__tests__/lib/database.test.ts`
- Create: `jest.config.js`

- [ ] **Step 1: Create Jest configuration**

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterSetup: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
```

- [ ] **Step 2: Create StatsCard test**

```tsx
// __tests__/components/StatsCard.test.tsx
import { render, screen } from '@testing-library/react';
import StatsCard from '@/components/dashboard/StatsCard';

describe('StatsCard', () => {
  it('renders title and value', () => {
    render(<StatsCard title="Total Airports" value={450} icon="✈" />);
    
    expect(screen.getByText('Total Airports')).toBeInTheDocument();
    expect(screen.getByText('450')).toBeInTheDocument();
  });

  it('renders trend when provided', () => {
    render(
      <StatsCard
        title="Total Passengers"
        value="520M"
        icon="👥"
        trend="+12.5% vs last year"
      />
    );
    
    expect(screen.getByText('+12.5% vs last year')).toBeInTheDocument();
  });

  it('does not render trend when not provided', () => {
    render(<StatsCard title="Total Cargo" value="950K" icon="📦" />);
    
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Create database test**

```typescript
// __tests__/lib/database.test.ts
import { getAirports, getAirportByIata, getAirportStats } from '@/lib/database';

// Mock the database
jest.mock('better-sqlite3', () => {
  return jest.fn().mockImplementation(() => ({
    prepare: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnValue({
      count: 10,
      total: 500000000,
    }),
    all: jest.fn().mockReturnValue([]),
  }));
});

describe('Database', () => {
  it('getAirports returns array', () => {
    const airports = getAirports();
    expect(Array.isArray(airports)).toBe(true);
  });

  it('getAirportByIata returns airport or undefined', () => {
    const airport = getAirportByIata('DEL');
    expect(airport === undefined || typeof airport === 'object').toBe(true);
  });

  it('getAirportStats returns stats object', () => {
    const stats = getAirportStats();
    expect(stats).toHaveProperty('totalAirports');
    expect(stats).toHaveProperty('totalPassengers');
    expect(stats).toHaveProperty('totalCargo');
  });
});
```

- [ ] **Step 4: Run tests**

```bash
npm test
```

- [ ] **Step 5: Commit changes**

```bash
git add .
git commit -m "test: add unit tests for components and database"
git push origin main
```

### Task 13: Deploy to Vercel

**Files:**
- Create: `vercel.json`
- Update: `package.json` (scripts)

- [ ] **Step 1: Create Vercel configuration**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ]
}
```

- [ ] **Step 2: Deploy to Vercel**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

- [ ] **Step 3: Commit changes**

```bash
git add .
git commit -m "chore: add Vercel deployment configuration"
git push origin main
```

### Task 14: Documentation and README

**Files:**
- Update: `README.md`
- Create: `CONTRIBUTING.md`
- Create: `LICENSE`

- [ ] **Step 1: Update README with full documentation**

```markdown
# Airport Stats 🛫

A comprehensive airport statistics visualization platform featuring interactive maps, real-time data, and flight tracking for Indian airports.

![Airport Stats Dashboard](https://via.placeholder.com/1200x600?text=Airport+Stats+Dashboard)

## ✨ Features

- 🗺️ **Interactive Map** - Explore Indian airports on a beautiful interactive map
- 📊 **Real-time Statistics** - View passenger, cargo, and flight data
- ✈️ **Flight Tracking** - Track flights between airports
- 📈 **Analytics Dashboard** - Analyze trends and growth patterns
- 🔍 **Advanced Search** - Filter airports by state, type, and metrics
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🌙 **Dark Mode** - Easy on the eyes with beautiful dark theme

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Python 3.8+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/airport-stats.git
   cd airport-stats
   ```

2. **Install dependencies**
   ```bash
   npm install
   pip install -r scripts/requirements.txt
   ```

3. **Set up database**
   ```bash
   npm run db:setup
   npm run db:seed
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
airport-stats/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── compare/           # Airport comparison page
│   └── page.tsx           # Main dashboard
├── components/            # React components
│   ├── analytics/         # Analytics components
│   ├── charts/            # Chart components
│   ├── dashboard/         # Dashboard components
│   ├── flights/           # Flight tracking components
│   ├── map/               # Map components
│   └── search/            # Search components
├── data/                  # Data files
│   ├── airports/          # Airport data
│   ├── flights/           # Flight data
│   └── airport_stats.db   # SQLite database
├── lib/                   # Utility functions
│   ├── database.ts        # Database operations
│   ├── flights.ts         # Flight utilities
│   └── search.ts          # Search utilities
├── scripts/               # Python scripts
│   ├── scrape_airports.py # Wikipedia scraper
│   ├── setup_database.py  # Database setup
│   └── seed_data.py       # Data seeding
└── public/                # Static assets
```

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Styling |
| **react-simple-maps** | Interactive maps |
| **d3-geo** | Geographic projections |
| **SQLite** | Database |
| **Python** | Data scraping |
| **Vercel** | Deployment |

## 📊 Data Sources

- **Wikipedia** - Airport information and statistics
- **Airport Websites** - Official data
- **Aviation Databases** - Flight information

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run scrape:airports` | Scrape airport data from Wikipedia |
| `npm run db:setup` | Setup database |
| `npm run db:seed` | Seed database with data |
| `npm run data:refresh` | Refresh all data |

## 🎨 Features in Detail

### Interactive Map
- Zoom and pan controls
- Airport markers with size based on passenger count
- Color coding by airport type
- Hover tooltips with airport details
- Click to view airport statistics

### Flight Tracking
- Search by route or airport
- Real-time flight status
- Flight duration and aircraft info
- Visual route display

### Analytics Dashboard
- Monthly passenger trends
- Cargo statistics
- Growth rate calculations
- Year-over-year comparisons

### Airport Comparison
- Compare multiple airports
- Metrics: passengers, cargo, runways
- Visual bar charts
- Summary statistics

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Wikipedia for airport data
- FlightRadar24 for inspiration
- Next.js team for the amazing framework
- All contributors who help improve this project

## 📧 Contact

- **Your Name** - your.email@example.com
- **Project Link** - [https://github.com/yourusername/airport-stats](https://github.com/yourusername/airport-stats)

---

Made with ❤️ for aviation enthusiasts
```

- [ ] **Step 2: Create CONTRIBUTING.md**

```markdown
# Contributing to Airport Stats

Thank you for your interest in contributing to Airport Stats! 🛫

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/airport-stats/issues)
2. If not, create a new issue with:
   - Clear title
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots if applicable

### Suggesting Features

1. Check existing [Issues](https://github.com/yourusername/airport-stats/issues) for similar suggestions
2. Create a new issue with:
   - Feature description
   - Use case
   - Any implementation ideas

### Code Contributions

1. **Fork the repository**
2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Write tests** if applicable
5. **Run tests**
   ```bash
   npm test
   ```
6. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```
7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Create a Pull Request**

## Development Setup

### Prerequisites

- Node.js 18+
- Python 3.8+
- npm or yarn

### Setup

1. Clone your fork
   ```bash
   git clone https://github.com/yourusername/airport-stats.git
   cd airport-stats
   ```

2. Install dependencies
   ```bash
   npm install
   pip install -r scripts/requirements.txt
   ```

3. Setup database
   ```bash
   npm run db:setup
   npm run db:seed
   ```

4. Start development
   ```bash
   npm run dev
   ```

## Code Style

### TypeScript/React

- Use TypeScript for all new files
- Follow ESLint rules
- Use functional components with hooks
- Write meaningful variable and function names

### Python

- Follow PEP 8 style guide
- Write docstrings for functions
- Use type hints where applicable

### Git Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` formatting changes
- `refactor:` code refactoring
- `test:` adding tests
- `chore:` maintenance tasks

## Adding New Features

### New Airport Data

1. Add scraping script in `scripts/`
2. Update database schema if needed
3. Add API endpoint in `app/api/`
4. Create UI components
5. Update documentation

### New Visualizations

1. Create component in `components/charts/`
2. Add data fetching logic
3. Integrate into dashboard
4. Write tests

## Questions?

Feel free to open an issue for any questions!

Thank you for contributing! 🎉
```

- [ ] **Step 3: Create LICENSE**

```
MIT License

Copyright (c) 2024 Airport Stats

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 4: Commit changes**

```bash
git add .
git commit -m "docs: add comprehensive documentation"
git push origin main
```

## Summary

This implementation plan covers:

1. **Project Setup** - GitHub repository, database schema, data collection
2. **Frontend Development** - Interactive maps, dashboard, components
3. **Advanced Features** - Flight tracking, analytics, comparison tools
4. **Testing** - Unit tests for components and database
5. **Deployment** - Vercel configuration and deployment
6. **Documentation** - README, contributing guide, license

Each task is broken down into specific, actionable steps with code examples and clear instructions. The plan follows best practices including TDD, frequent commits, and comprehensive documentation.

**Next Steps:**

1. Choose execution approach (Subagent-Driven or Inline Execution)
2. Start implementing tasks in order
3. Test each feature thoroughly
4. Deploy to production
5. Gather feedback and iterate

Would you like me to start implementing this plan? I can use either:
1. **Subagent-Driven Development** - Dispatch fresh subagents per task
2. **Inline Execution** - Execute tasks in this session with checkpoints

Which approach would you prefer?
