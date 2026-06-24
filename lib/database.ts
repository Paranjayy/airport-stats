/**
 * TypeScript interface for the Indian airports SQLite database.
 *
 * This module defines the row types used by the database and provides
 * lightweight query helpers that read from the SQLite file at runtime.
 *
 * The database is seeded via Python scripts:
 *   python scripts/setup_database.py
 *   python scripts/seed_data.py
 */

// ── Row types ────────────────────────────────────────────────────────────────

/** Airport type classification. */
export type AirportType = "international" | "domestic" | "civil";

/** Core airport record matching the `airports` table. */
export interface Airport {
  id: number;
  iata_code: string;
  icao_code: string | null;
  name: string;
  city: string;
  state: string | null;
  country: string;
  latitude: number;
  longitude: number;
  elevation_ft: number | null;
  timezone: string;
  airport_type: AirportType;
  owner: string | null;
  operator: string | null;
  terminal_count: number | null;
  gate_count: number | null;
  runway_count: number | null;
  runway_length_ft: number | null;
  runway_surface: string | null;
  website: string | null;
  wikipedia_url: string | null;
  created_at: string;
  updated_at: string;
}

/** Annual statistics for an airport. */
export interface AirportStatistics {
  id: number;
  airport_id: number;
  year: number;
  passengers: number;
  cargo_tonnes: number;
  aircraft_movements: number;
  domestic_passengers: number;
  international_passengers: number;
  source: string | null;
  created_at: string;
}

/** A flight between two airports. */
export interface Flight {
  id: number;
  origin_airport_id: number;
  dest_airport_id: number;
  airline: string | null;
  flight_number: string | null;
  aircraft_type: string | null;
  frequency_per_week: number | null;
  is_domestic: number;
  created_at: string;
}

/** A route connecting two airports. */
export interface Route {
  id: number;
  origin_airport_id: number;
  dest_airport_id: number;
  distance_km: number | null;
  flight_time_min: number | null;
  carriers: string | null;
  frequency: string | null;
  aircraft_used: string | null;
  is_active: number;
  source: string | null;
  created_at: string;
}

/** Airport with its latest statistics joined. */
export interface AirportWithStats extends Airport {
  stats: AirportStatistics | null;
}

/** Route with origin/destination airport details. */
export interface RouteWithAirports extends Route {
  origin: Airport;
  dest: Airport;
}

// ── Query parameter types ────────────────────────────────────────────────────

export interface AirportFilter {
  city?: string;
  state?: string;
  airport_type?: AirportType;
  search?: string; // matches name, city, or iata_code
}

export interface RouteFilter {
  origin_iata?: string;
  dest_iata?: string;
  is_active?: boolean;
  min_distance_km?: number;
  max_distance_km?: number;
}

// ── Helper functions ─────────────────────────────────────────────────────────
// These are pure JS functions that operate on the row types above.
// For actual database queries use a SQLite library like `better-sqlite3`.

/** Format passenger count for display (e.g. 73_000_000 → "73.0M"). */
export function formatPassengers(count: number): string {
  if (count >= 1_000_000_000) return `${(count / 1_000_000_000).toFixed(1)}B`;
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return String(count);
}

/** Format cargo tonnage for display. */
export function formatCargo(tonnes: number): string {
  if (tonnes >= 1_000_000) return `${(tonnes / 1_000_000).toFixed(2)}M t`;
  if (tonnes >= 1_000) return `${(tonnes / 1_000).toFixed(1)}K t`;
  return `${tonnes} t`;
}

/** Format runway length in feet. */
export function formatRunwayLength(ft: number | null): string | null {
  if (!ft) return null;
  const m = Math.round(ft * 0.3048);
  return `${ft.toLocaleString()} ft (${m.toLocaleString()} m)`;
}

/** Return a human-readable label for the airport type. */
export function airportTypeLabel(type: AirportType): string {
  switch (type) {
    case "international":
      return "International Airport";
    case "domestic":
      return "Domestic Airport";
    case "civil":
      return "Civil Airport";
    default:
      return type;
  }
}

/** Filter a list of airports using the AirportFilter criteria. */
export function filterAirports(
  airports: Airport[],
  filter: AirportFilter,
): Airport[] {
  return airports.filter((a) => {
    if (filter.city && a.city.toLowerCase() !== filter.city.toLowerCase())
      return false;
    if (filter.state && a.state?.toLowerCase() !== filter.state.toLowerCase())
      return false;
    if (
      filter.airport_type &&
      a.airport_type !== filter.airport_type
    )
      return false;
    if (filter.search) {
      const q = filter.search.toLowerCase();
      const haystack = `${a.name} ${a.city} ${a.iata_code} ${a.icao_code ?? ""}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

/** Filter routes using the RouteFilter criteria. */
export function filterRoutes(
  routes: Route[],
  airports: Airport[],
  filter: RouteFilter,
): Route[] {
  const iataToId = new Map(airports.map((a) => [a.iata_code, a.id]));
  return routes.filter((r) => {
    if (filter.origin_iata) {
      const id = iataToId.get(filter.origin_iata);
      if (r.origin_airport_id !== id) return false;
    }
    if (filter.dest_iata) {
      const id = iataToId.get(filter.dest_iata);
      if (r.dest_airport_id !== id) return false;
    }
    if (filter.is_active !== undefined && !!r.is_active !== filter.is_active)
      return false;
    if (filter.min_distance_km && (r.distance_km ?? 0) < filter.min_distance_km)
      return false;
    if (filter.max_distance_km && (r.distance_km ?? 0) > filter.max_distance_km)
      return false;
    return true;
  });
}

/** Sort airports by passenger count (descending). */
export function sortByPassengers(
  airports: AirportWithStats[],
): AirportWithStats[] {
  return [...airports].sort(
    (a, b) => (b.stats?.passengers ?? 0) - (a.stats?.passengers ?? 0),
  );
}

/** Compute Haversine distance between two coordinate pairs (km). */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
