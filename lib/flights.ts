/**
 * Flight tracking utility functions.
 *
 * Generates simulated flight data based on real Indian airport/route data.
 * In production, replace with a live API (e.g. AeroDataBox, FlightAware).
 */

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type FlightStatus =
  | "scheduled"
  | "boarding"
  | "departed"
  | "en-route"
  | "arriving"
  | "landed"
  | "delayed"
  | "cancelled";

export interface TrackedFlight {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  durationMinutes: number;
  status: FlightStatus;
  aircraft: string;
  gate: string;
  terminal: number;
  delay?: number; // minutes
}

export interface FlightSearchResult {
  flights: TrackedFlight[];
  route: string;
  totalFlights: number;
}

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const AIRLINES = [
  { code: "6E", name: "IndiGo" },
  { code: "AI", name: "Air India" },
  { code: "SG", name: "SpiceJet" },
  { code: "QP", name: "Akasa Air" },
  { code: "UK", name: "Vistara" },
  { code: "G8", name: "Go First" },
];

const AIRCRAFT = [
  "Airbus A320neo",
  "Boeing 737-800",
  "Airbus A321neo",
  "Boeing 787-8",
  "Airbus A350-900",
  "Boeing 737 MAX 8",
  "ATR 72-600",
  "Embraer E190",
];

const AIRPORT_DATA: Record<
  string,
  { city: string; timezone: string; terminals: number }
> = {
  DEL: { city: "New Delhi", timezone: "Asia/Kolkata", terminals: 3 },
  BOM: { city: "Mumbai", timezone: "Asia/Kolkata", terminals: 2 },
  BLR: { city: "Bengaluru", timezone: "Asia/Kolkata", terminals: 2 },
  HYD: { city: "Hyderabad", timezone: "Asia/Kolkata", terminals: 1 },
  MAA: { city: "Chennai", timezone: "Asia/Kolkata", terminals: 2 },
  CCU: { city: "Kolkata", timezone: "Asia/Kolkata", terminals: 1 },
  GOI: { city: "Goa", timezone: "Asia/Kolkata", terminals: 1 },
  COK: { city: "Kochi", timezone: "Asia/Kolkata", terminals: 1 },
  JAI: { city: "Jaipur", timezone: "Asia/Kolkata", terminals: 1 },
  LKO: { city: "Lucknow", timezone: "Asia/Kolkata", terminals: 1 },
  AMD: { city: "Ahmedabad", timezone: "Asia/Kolkata", terminals: 1 },
  PAT: { city: "Patna", timezone: "Asia/Kolkata", terminals: 1 },
  IXB: { city: "Bagdogra", timezone: "Asia/Kolkata", terminals: 1 },
  PNQ: { city: "Pune", timezone: "Asia/Kolkata", terminals: 1 },
  GAU: { city: "Guwahati", timezone: "Asia/Kolkata", terminals: 1 },
  TRV: { city: "Thiruvananthapuram", timezone: "Asia/Kolkata", terminals: 1 },
  IXM: { city: "Madurai", timezone: "Asia/Kolkata", terminals: 1 },
  JDH: { city: "Jodhpur", timezone: "Asia/Kolkata", terminals: 1 },
  UDR: { city: "Udaipur", timezone: "Asia/Kolkata", terminals: 1 },
  VTZ: { city: "Visakhapatnam", timezone: "Asia/Kolkata", terminals: 1 },
  IMF: { city: "Imphal", timezone: "Asia/Kolkata", terminals: 1 },
  IDR: { city: "Indore", timezone: "Asia/Kolkata", terminals: 1 },
  NAG: { city: "Nagpur", timezone: "Asia/Kolkata", terminals: 1 },
  COH: { city: "Coimbatore", timezone: "Asia/Kolkata", terminals: 1 },
  BBI: { city: "Bhubaneswar", timezone: "Asia/Kolkata", terminals: 1 },
  RPR: { city: "Raipur", timezone: "Asia/Kolkata", terminals: 1 },
  IXR: { city: "Ranchi", timezone: "Asia/Kolkata", terminals: 1 },
  SLV: { city: "Salem", timezone: "Asia/Kolkata", terminals: 1 },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Deterministic pseudo-random from a seed string. */
function seededRandom(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  const x = Math.sin(h) * 10000;
  return x - Math.floor(x);
}

function seededIndex<T>(arr: T[], seed: string): T {
  return arr[Math.floor(seededRandom(seed) * arr.length)];
}

function padTime(n: number): string {
  return n.toString().padStart(2, "0");
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

function generateTimeSlot(
  seed: string,
  baseHour: number,
): { hour: number; minute: number } {
  const r = seededRandom(seed);
  const hour = (baseHour + Math.floor(r * 4)) % 24;
  const minute = Math.floor(seededRandom(seed + "min") * 4) * 15;
  return { hour, minute };
}

/* ------------------------------------------------------------------ */
/*  Status simulation                                                  */
/* ------------------------------------------------------------------ */

const ALL_STATUSES: FlightStatus[] = [
  "scheduled",
  "boarding",
  "departed",
  "en-route",
  "arriving",
  "landed",
  "delayed",
  "cancelled",
];

function deriveStatus(seed: string): FlightStatus {
  const weights = [0.2, 0.08, 0.15, 0.25, 0.12, 0.1, 0.08, 0.02];
  let r = seededRandom(seed);
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return ALL_STATUSES[i];
  }
  return "scheduled";
}

function deriveDelay(status: FlightStatus, seed: string): number | undefined {
  if (status === "delayed") return Math.floor(seededRandom(seed) * 120) + 15;
  if (status === "cancelled") return undefined;
  if (seededRandom(seed + "dl") < 0.15) return Math.floor(seededRandom(seed) * 45) + 5;
  return undefined;
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/** All airport IATA codes we support for search. */
export function getAllAirportCodes(): string[] {
  return Object.keys(AIRPORT_DATA);
}

/** Lookup city for an IATA code. */
export function getCityForAirport(code: string): string | undefined {
  return AIRPORT_DATA[code]?.city;
}

/** Estimate flight distance between two airports (km). */
export function estimateDistance(origin: string, dest: string): number {
  const distances: Record<string, number> = {
    "DEL-BOM": 1150,
    "DEL-BLR": 1740,
    "BOM-BLR": 840,
    "DEL-HYD": 1260,
    "BOM-HYD": 710,
    "DEL-MAA": 1760,
    "BOM-MAA": 1030,
    "DEL-CCU": 1300,
    "BOM-CCU": 1660,
    "BLR-HYD": 500,
    "DEL-JAI": 470,
    "BOM-AMD": 520,
    "DEL-AMD": 930,
    "BLR-MAA": 275,
    "DEL-COK": 2050,
    "BOM-COK": 1090,
    "DEL-LKO": 490,
    "DEL-GOI": 1580,
    "BOM-GOI": 580,
    "BOM-LKO": 1220,
  };
  const key = `${origin}-${dest}`;
  const keyRev = `${dest}-${origin}`;
  return distances[key] ?? distances[keyRev] ?? 800;
}

/** Estimate flight duration from distance (km). */
export function estimateDuration(distanceKm: number): number {
  const cruiseSpeed = 820; // km/h average
  const taxiTime = 20; // minutes
  return Math.round((distanceKm / cruiseSpeed) * 60 + taxiTime);
}

/**
 * Search flights between two airports, or all flights from/to an airport.
 * Returns deterministic simulated data.
 */
export function searchFlights(
  origin?: string,
  destination?: string,
): FlightSearchResult {
  const originCode = origin?.toUpperCase();
  const destCode = destination?.toUpperCase();

  const flights: TrackedFlight[] = [];
  const codes = getAllAirportCodes();

  // Build a list of routes to generate flights for
  const routes: Array<{ from: string; to: string }> = [];

  if (originCode && destCode) {
    // Specific route
    routes.push({ from: originCode, to: destCode });
    routes.push({ from: destCode, to: originCode });
  } else if (originCode) {
    // All flights from this airport
    for (const code of codes) {
      if (code !== originCode) routes.push({ from: originCode, to: code });
    }
  } else if (destCode) {
    // All flights to this airport
    for (const code of codes) {
      if (code !== destCode) routes.push({ from: code, to: destCode });
    }
  } else {
    // Sample of popular routes
    routes.push(
      { from: "DEL", to: "BOM" },
      { from: "DEL", to: "BLR" },
      { from: "BOM", to: "BLR" },
      { from: "DEL", to: "HYD" },
      { from: "BOM", to: "HYD" },
      { from: "DEL", to: "MAA" },
      { from: "BLR", to: "MAA" },
      { from: "DEL", to: "CCU" },
      { from: "BOM", to: "CCU" },
      { from: "DEL", to: "GOI" },
    );
  }

  for (const route of routes) {
    const fromCity = AIRPORT_DATA[route.from]?.city ?? route.from;
    const toCity = AIRPORT_DATA[route.to]?.city ?? route.to;
    const dist = estimateDistance(route.from, route.to);
    const dur = estimateDuration(dist);

    // Generate 3-6 flights per route
    const numFlights = 3 + Math.floor(seededRandom(`nf-${route.from}-${route.to}`) * 4);

    for (let i = 0; i < numFlights; i++) {
      const seed = `flight-${route.from}-${route.to}-${i}`;
      const airline = seededIndex(AIRLINES, seed + "airline");
      const aircraft = seededIndex(AIRCRAFT, seed + "aircraft");
      const status = deriveStatus(seed + "status");
      const delay = deriveDelay(status, seed + "delay");
      const dep = generateTimeSlot(seed + "dep", 5 + i * 3);
      const arrMinute = dep.hour * 60 + dep.minute + dur;
      const arrHour = Math.floor(arrMinute / 60) % 24;
      const arrMinuteInHour = arrMinute % 60;
      const flightNum = `${airline.code}${100 + Math.floor(seededRandom(seed + "num") * 900)}`;

      flights.push({
        id: seed,
        flightNumber: flightNum,
        airline: airline.name,
        origin: route.from,
        originCity: fromCity,
        destination: route.to,
        destinationCity: toCity,
        departureTime: `${padTime(dep.hour)}:${padTime(dep.minute)}`,
        arrivalTime: `${padTime(arrHour)}:${padTime(arrMinuteInHour)}`,
        duration: formatDuration(dur),
        durationMinutes: dur,
        status,
        aircraft,
        gate: `${String.fromCharCode(65 + Math.floor(seededRandom(seed + "gate") * 6))}${Math.floor(seededRandom(seed + "gnum") * 20) + 1}`,
        terminal: Math.floor(seededRandom(seed + "term") * 2) + 1,
        delay,
      });
    }
  }

  // Sort by departure time
  flights.sort((a, b) => a.departureTime.localeCompare(b.departureTime));

  const routeLabel =
    originCode && destCode
      ? `${originCode} → ${destCode}`
      : originCode
        ? `From ${originCode}`
        : destCode
          ? `To ${destCode}`
          : "All routes";

  return {
    flights,
    route: routeLabel,
    totalFlights: flights.length,
  };
}

/** Format status for display with color hint. */
export function statusColor(status: FlightStatus): string {
  switch (status) {
    case "en-route":
      return "text-[#0a84ff]";
    case "departed":
    case "boarding":
      return "text-[#34c759]";
    case "arriving":
    case "landed":
      return "text-[#34c759]";
    case "delayed":
      return "text-[#ff9f0a]";
    case "cancelled":
      return "text-[#ff375f]";
    default:
      return "text-muted";
  }
}
