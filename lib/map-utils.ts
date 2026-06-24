export type AirportType =
  | "international"
  | "domestic"
  | "joint-use"
  | "custom"
  | "defence";

export const AIRPORT_DEFAULT_COLOR = "#8E8E93";

export const AIRPORT_TYPE_COLOR: Record<AirportType, string> = {
  international: "#007AFF",
  domestic: "#34C759",
  "joint-use": "#FF9500",
  custom: "#AF52DE",
  defence: "#FF3B30",
};

export const AIRPORT_SIZE_BANDS = [
  { max: 5_000_000, r: 4 },
  { max: 20_000_000, r: 7 },
  { max: 50_000_000, r: 11 },
  { max: Infinity, r: 16 },
];

export function airportDotRadius(passengers: number): number {
  for (const band of AIRPORT_SIZE_BANDS) {
    if (passengers <= band.max) return band.r;
  }
  return 16;
}

export const NEUTRAL_FILL = "#ECECEC";
export const NEUTRAL_STROKE = "#D2D2D2";
export const INK = "#1D1D1F";
export const MUTED = "#86868B";

export type SetGenericTooltip<T> = React.Dispatch<
  React.SetStateAction<T | null>
>;

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
