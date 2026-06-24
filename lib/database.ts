export type AirportType = "international" | "domestic" | "joint-use" | "custom" | "defence";

export interface Airport {
  id: number;
  iata_code: string;
  icao_code: string | null;
  name: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  elevation_ft: number | null;
  airport_type: AirportType;
  runway_count: number;
  runway_length_ft: number;
  annual_passengers: number;
  annual_cargo_tonnes: number;
  annual_movements: number;
  domestic_passengers: number;
  international_passengers: number;
}

export function formatPassengers(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return String(n);
}

export function formatCargo(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}Mt`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}Kt`;
  return `${n}t`;
}
