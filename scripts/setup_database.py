#!/usr/bin/env python3
"""
SQLite database setup for Indian airports data.

Creates tables for:
  - airports: Core airport information (IATA/ICAO codes, coordinates, terminals)
  - flights:  Flight routes between airports
  - statistics: Passenger counts, cargo tonnage, movements
  - routes:    Detailed route information with frequency and carriers
"""

import os
import sqlite3
from pathlib import Path

DB_DIR = Path(__file__).resolve().parent.parent / "data"
DB_PATH = DB_DIR / "airports.db"


def get_connection(db_path: Path | str | None = None) -> sqlite3.Connection:
    """Return a new connection to the SQLite database."""
    path = db_path or DB_PATH
    conn = sqlite3.connect(str(path))
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    conn.row_factory = sqlite3.Row
    return conn


def create_tables(conn: sqlite3.Connection) -> None:
    """Create all tables and indexes."""
    cursor = conn.cursor()

    # ── Airports ──────────────────────────────────────────────────────
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS airports (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            iata_code       TEXT    NOT NULL UNIQUE,
            icao_code       TEXT    UNIQUE,
            name            TEXT    NOT NULL,
            city            TEXT    NOT NULL,
            state           TEXT,
            country         TEXT    NOT NULL DEFAULT 'India',
            latitude        REAL    NOT NULL,
            longitude       REAL    NOT NULL,
            elevation_ft    INTEGER,
            timezone        TEXT    DEFAULT 'Asia/Kolkata',
            airport_type    TEXT    DEFAULT 'international',
            owner           TEXT,
            operator        TEXT,
            terminal_count  INTEGER,
            gate_count      INTEGER,
            runway_count    INTEGER,
            runway_length_ft INTEGER,
            runway_surface  TEXT,
            website         TEXT,
            wikipedia_url   TEXT,
            created_at      TEXT    DEFAULT (datetime('now')),
            updated_at      TEXT    DEFAULT (datetime('now'))
        )
    """)

    # ── Statistics ────────────────────────────────────────────────────
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS statistics (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            airport_id      INTEGER NOT NULL,
            year            INTEGER NOT NULL,
            passengers      INTEGER DEFAULT 0,
            cargo_tonnes    REAL    DEFAULT 0,
            aircraft_movements INTEGER DEFAULT 0,
            domestic_passengers INTEGER DEFAULT 0,
            international_passengers INTEGER DEFAULT 0,
            source          TEXT,
            created_at      TEXT    DEFAULT (datetime('now')),
            FOREIGN KEY (airport_id) REFERENCES airports(id) ON DELETE CASCADE,
            UNIQUE(airport_id, year)
        )
    """)

    # ── Flights ───────────────────────────────────────────────────────
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS flights (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            origin_airport_id   INTEGER NOT NULL,
            dest_airport_id     INTEGER NOT NULL,
            airline         TEXT,
            flight_number   TEXT,
            aircraft_type   TEXT,
            frequency_per_week INTEGER,
            is_domestic      INTEGER DEFAULT 1,
            created_at      TEXT    DEFAULT (datetime('now')),
            FOREIGN KEY (origin_airport_id) REFERENCES airports(id) ON DELETE CASCADE,
            FOREIGN KEY (dest_airport_id)   REFERENCES airports(id) ON DELETE CASCADE
        )
    """)

    # ── Routes ────────────────────────────────────────────────────────
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS routes (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            origin_airport_id   INTEGER NOT NULL,
            dest_airport_id     INTEGER NOT NULL,
            distance_km     INTEGER,
            flight_time_min INTEGER,
            carriers        TEXT,
            frequency       TEXT,
            aircraft_used   TEXT,
            is_active       INTEGER DEFAULT 1,
            source          TEXT,
            created_at      TEXT    DEFAULT (datetime('now')),
            FOREIGN KEY (origin_airport_id) REFERENCES airports(id) ON DELETE CASCADE,
            FOREIGN KEY (dest_airport_id)   REFERENCES airports(id) ON DELETE CASCADE,
            UNIQUE(origin_airport_id, dest_airport_id)
        )
    """)

    # ── Indexes ───────────────────────────────────────────────────────
    indexes = [
        "CREATE INDEX IF NOT EXISTS idx_airports_iata      ON airports(iata_code)",
        "CREATE INDEX IF NOT EXISTS idx_airports_icao      ON airports(icao_code)",
        "CREATE INDEX IF NOT EXISTS idx_airports_city      ON airports(city)",
        "CREATE INDEX IF NOT EXISTS idx_airports_state     ON airports(state)",
        "CREATE INDEX IF NOT EXISTS idx_airports_coords    ON airports(latitude, longitude)",
        "CREATE INDEX IF NOT EXISTS idx_airports_type      ON airports(airport_type)",
        "CREATE INDEX IF NOT EXISTS idx_stats_airport      ON statistics(airport_id)",
        "CREATE INDEX IF NOT EXISTS idx_stats_year         ON statistics(year)",
        "CREATE INDEX IF NOT EXISTS idx_stats_passengers   ON statistics(passengers DESC)",
        "CREATE INDEX IF NOT EXISTS idx_flights_origin     ON flights(origin_airport_id)",
        "CREATE INDEX IF NOT EXISTS idx_flights_dest       ON flights(dest_airport_id)",
        "CREATE INDEX IF NOT EXISTS idx_flights_airline    ON flights(airline)",
        "CREATE INDEX IF NOT EXISTS idx_routes_origin      ON routes(origin_airport_id)",
        "CREATE INDEX IF NOT EXISTS idx_routes_dest        ON routes(dest_airport_id)",
        "CREATE INDEX IF NOT EXISTS idx_routes_active      ON routes(is_active)",
    ]

    for stmt in indexes:
        cursor.execute(stmt)

    conn.commit()
    print(f"✓ Database created at {conn.execute('PRAGMA database_list').fetchone()[2]}")
    print("  Tables: airports, statistics, flights, routes")
    print(f"  Indexes: {len(indexes)}")


def print_schema(conn: sqlite3.Connection) -> None:
    """Print a summary of created tables."""
    cursor = conn.cursor()
    tables = cursor.execute(
        "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    ).fetchall()
    print(f"\nTables ({len(tables)}):")
    for (table,) in tables:
        count = cursor.execute(f"SELECT COUNT(*) FROM [{table}]").fetchone()[0]
        print(f"  • {table}: {count} rows")


if __name__ == "__main__":
    DB_DIR.mkdir(parents=True, exist_ok=True)
    conn = get_connection()
    create_tables(conn)
    print_schema(conn)
    conn.close()
