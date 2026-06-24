/**
 * Analytics utility functions for airport data.
 *
 * Provides growth rates, monthly breakdowns, year-over-year comparisons,
 * and trend data — all derived from the static airport dataset.
 */

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface MonthlyData {
  month: string;
  monthShort: string;
  passengers: number;
  cargo: number;
  movements: number;
}

export interface YearlyData {
  year: number;
  passengers: number;
  cargo: number;
  movements: number;
  growthRate: number; // % vs previous year
}

export interface AirportAnalyticsData {
  iata: string;
  name: string;
  city: string;
  state: string;
  monthly: MonthlyData[];
  yearly: YearlyData[];
  totals: {
    passengers: number;
    cargo: number;
    movements: number;
    domesticPax: number;
    internationalPax: number;
  };
  growth: {
    passengerGrowth: number;
    cargoGrowth: number;
    movementGrowth: number;
    domesticShare: number;
    internationalShare: number;
  };
}

export interface ComparisonData {
  airports: AirportAnalyticsData[];
  metrics: ComparisonMetric[];
}

export type ComparisonMetric =
  | "passengers"
  | "cargo"
  | "movements"
  | "domesticPax"
  | "internationalPax"
  | "passengerGrowth"
  | "cargoGrowth";

/* ------------------------------------------------------------------ */
/*  Static airport data with annual stats                              */
/* ------------------------------------------------------------------ */

interface AirportBase {
  iata: string;
  name: string;
  city: string;
  state: string;
  type: string;
  passengers: number;
  cargo: number;
  movements: number;
  domestic: number;
  international: number;
}

const AIRPORTS: AirportBase[] = [
  { iata: "DEL", name: "Indira Gandhi International", city: "New Delhi", state: "Delhi", type: "international", passengers: 73_000_000, cargo: 970_000, movements: 460_000, domestic: 52_000_000, international: 21_000_000 },
  { iata: "BOM", name: "Chhatrapati Shivaji Maharaj Intl", city: "Mumbai", state: "Maharashtra", type: "international", passengers: 52_000_000, cargo: 850_000, movements: 380_000, domestic: 42_000_000, international: 10_000_000 },
  { iata: "BLR", name: "Kempegowda International", city: "Bengaluru", state: "Karnataka", type: "international", passengers: 37_000_000, cargo: 410_000, movements: 260_000, domestic: 31_000_000, international: 6_000_000 },
  { iata: "HYD", name: "Rajiv Gandhi International", city: "Hyderabad", state: "Telangana", type: "international", passengers: 25_000_000, cargo: 120_000, movements: 220_000, domestic: 21_000_000, international: 4_000_000 },
  { iata: "MAA", name: "Chennai International", city: "Chennai", state: "Tamil Nadu", type: "international", passengers: 22_000_000, cargo: 350_000, movements: 200_000, domestic: 18_000_000, international: 4_000_000 },
  { iata: "CCU", name: "Netaji Subhas Chandra Bose Intl", city: "Kolkata", state: "West Bengal", type: "international", passengers: 20_000_000, cargo: 180_000, movements: 160_000, domestic: 17_000_000, international: 3_000_000 },
  { iata: "GOI", name: "Goa International", city: "Goa", state: "Goa", type: "international", passengers: 9_500_000, cargo: 28_000, movements: 72_000, domestic: 8_500_000, international: 1_000_000 },
  { iata: "COK", name: "Cochin International", city: "Kochi", state: "Kerala", type: "international", passengers: 12_500_000, cargo: 85_000, movements: 88_000, domestic: 10_000_000, international: 2_500_000 },
  { iata: "JAI", name: "Jaipur International", city: "Jaipur", state: "Rajasthan", type: "international", passengers: 9_800_000, cargo: 18_000, movements: 74_000, domestic: 9_000_000, international: 800_000 },
  { iata: "LKO", name: "Chaudhary Charan Singh Intl", city: "Lucknow", state: "Uttar Pradesh", type: "international", passengers: 8_500_000, cargo: 15_000, movements: 68_000, domestic: 8_000_000, international: 500_000 },
  { iata: "AMD", name: "Sardar Vallabhbhai Patel Intl", city: "Ahmedabad", state: "Gujarat", type: "international", passengers: 14_000_000, cargo: 95_000, movements: 110_000, domestic: 12_500_000, international: 1_500_000 },
  { iata: "PAT", name: "Lok Nayak Jayaprakash Airport", city: "Patna", state: "Bihar", type: "domestic", passengers: 5_200_000, cargo: 8_000, movements: 44_000, domestic: 5_200_000, international: 0 },
  { iata: "IXB", name: "Bagdogra Airport", city: "Siliguri", state: "West Bengal", type: "domestic", passengers: 3_800_000, cargo: 5_000, movements: 32_000, domestic: 3_800_000, international: 0 },
  { iata: "PNQ", name: "Pune Airport", city: "Pune", state: "Maharashtra", type: "domestic", passengers: 9_500_000, cargo: 32_000, movements: 78_000, domestic: 9_200_000, international: 300_000 },
  { iata: "GAU", name: "Lokpriya Gopinath Bordoloi Intl", city: "Guwahati", state: "Assam", type: "international", passengers: 5_800_000, cargo: 12_000, movements: 48_000, domestic: 5_500_000, international: 300_000 },
  { iata: "TRV", name: "Trivandrum International", city: "Thiruvananthapuram", state: "Kerala", type: "international", passengers: 5_200_000, cargo: 25_000, movements: 42_000, domestic: 3_800_000, international: 1_400_000 },
  { iata: "IXM", name: "Madurai Airport", city: "Madurai", state: "Tamil Nadu", type: "domestic", passengers: 1_800_000, cargo: 3_000, movements: 16_000, domestic: 1_800_000, international: 0 },
  { iata: "JDH", name: "Jodhpur Airport", city: "Jodhpur", state: "Rajasthan", type: "domestic", passengers: 1_500_000, cargo: 2_000, movements: 14_000, domestic: 1_500_000, international: 0 },
  { iata: "UDR", name: "Maharana Pratap Airport", city: "Udaipur", state: "Rajasthan", type: "domestic", passengers: 1_200_000, cargo: 1_500, movements: 11_000, domestic: 1_200_000, international: 0 },
  { iata: "VTZ", name: "Visakhapatnam Airport", city: "Visakhapatnam", state: "Andhra Pradesh", type: "domestic", passengers: 3_200_000, cargo: 8_000, movements: 28_000, domestic: 3_200_000, international: 0 },
  { iata: "IMF", name: "Imphal Airport", city: "Imphal", state: "Manipur", type: "domestic", passengers: 1_400_000, cargo: 2_000, movements: 12_000, domestic: 1_400_000, international: 0 },
  { iata: "IDR", name: "Devi Ahilya Bai Holkar Intl", city: "Indore", state: "Madhya Pradesh", type: "international", passengers: 3_500_000, cargo: 8_000, movements: 30_000, domestic: 3_300_000, international: 200_000 },
  { iata: "NAG", name: "Dr. Babasaheb Ambedkar Intl", city: "Nagpur", state: "Maharashtra", type: "international", passengers: 4_000_000, cargo: 15_000, movements: 34_000, domestic: 3_800_000, international: 200_000 },
  { iata: "COH", name: "Coimbatore Airport", city: "Coimbatore", state: "Tamil Nadu", type: "domestic", passengers: 3_800_000, cargo: 12_000, movements: 32_000, domestic: 3_700_000, international: 100_000 },
  { iata: "BBI", name: "Biju Patnaik International", city: "Bhubaneswar", state: "Odisha", type: "international", passengers: 4_200_000, cargo: 10_000, movements: 36_000, domestic: 4_000_000, international: 200_000 },
  { iata: "RPR", name: "Swami Vivekananda Airport", city: "Raipur", state: "Chhattisgarh", type: "domestic", passengers: 2_200_000, cargo: 4_000, movements: 20_000, domestic: 2_200_000, international: 0 },
  { iata: "IXR", name: "Birsa Munda Airport", city: "Ranchi", state: "Jharkhand", type: "domestic", passengers: 2_500_000, cargo: 5_000, movements: 22_000, domestic: 2_500_000, international: 0 },
  { iata: "SLV", name: "Salem Airport", city: "Salem", state: "Tamil Nadu", type: "domestic", passengers: 200_000, cargo: 500, movements: 2_000, domestic: 200_000, international: 0 },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Seasonal distribution weights (Indian aviation pattern).
 * Peak: Oct-Mar (festive + winter travel), low: Apr-Jun (summer heat).
 */
const SEASONAL_WEIGHTS = [
  0.095, 0.085, 0.08, 0.07, 0.065, 0.065, // Jan-Jun
  0.07, 0.075, 0.085, 0.1, 0.105, 0.105,   // Jul-Dec
];

/** Deterministic pseudo-random from a seed string. */
function seededRandom(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  const x = Math.sin(h) * 10000;
  return x - Math.floor(x);
}

/** Generate monthly breakdown from an annual total. */
function generateMonthly(
  annualTotal: number,
  iata: string,
  metric: "pax" | "cargo" | "mov",
): MonthlyData[] {
  return MONTHS.map((month, i) => {
    const seed = `${iata}-${metric}-${i}`;
    const variance = 0.9 + seededRandom(seed) * 0.2; // 0.9–1.1 noise
    const base = annualTotal * SEASONAL_WEIGHTS[i] * variance;
    return {
      month,
      monthShort: MONTH_SHORT[i],
      passengers: metric === "pax" ? Math.round(base) : 0,
      cargo: metric === "cargo" ? Math.round(base) : 0,
      movements: metric === "mov" ? Math.round(base) : 0,
    };
  });
}

/** Build yearly data with simulated growth history. */
function generateYearly(
  current: AirportBase,
): YearlyData[] {
  const years: YearlyData[] = [];
  const basePax = current.passengers;
  const baseCargo = current.cargo;
  const baseMov = current.movements;

  // Simulate 2019–2023 with realistic growth + COVID dip
  const factors = [
    { year: 2019, pax: 0.72, cargo: 0.82, mov: 0.78 }, // pre-COVID
    { year: 2020, pax: 0.28, cargo: 0.70, mov: 0.30 }, // COVID
    { year: 2021, pax: 0.42, cargo: 0.85, mov: 0.44 }, // partial recovery
    { year: 2022, pax: 0.82, cargo: 0.95, mov: 0.85 }, // near-full recovery
    { year: 2023, pax: 1.0, cargo: 1.0, mov: 1.0 },   // current
  ];

  for (let i = 0; i < factors.length; i++) {
    const f = factors[i];
    const passengers = Math.round(basePax * f.pax);
    const cargo = Math.round(baseCargo * f.cargo);
    const movements = Math.round(baseMov * f.mov);
    const prevPax = i > 0 ? years[i - 1].passengers : passengers;
    const growthRate = prevPax > 0
      ? Math.round(((passengers - prevPax) / prevPax) * 1000) / 10
      : 0;

    years.push({ year: f.year, passengers, cargo, movements, growthRate });
  }

  return years;
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/** Get analytics for a specific airport. */
export function getAirportAnalytics(iata: string): AirportAnalyticsData | null {
  const airport = AIRPORTS.find((a) => a.iata === iata);
  if (!airport) return null;

  const paxMonthly = generateMonthly(airport.passengers, iata, "pax");
  const cargoMonthly = generateMonthly(airport.cargo, iata, "cargo");
  const movMonthly = generateMonthly(airport.movements, iata, "mov");

  const monthly: MonthlyData[] = MONTHS.map((month, i) => ({
    month,
    monthShort: MONTH_SHORT[i],
    passengers: paxMonthly[i].passengers,
    cargo: cargoMonthly[i].cargo,
    movements: movMonthly[i].movements,
  }));

  const yearly = generateYearly(airport);

  // Growth rates (2023 vs 2022)
  const prevYear = yearly[yearly.length - 2];
  const currentYear = yearly[yearly.length - 1];
  const passengerGrowth = prevYear
    ? Math.round(((currentYear.passengers - prevYear.passengers) / prevYear.passengers) * 1000) / 10
    : 0;
  const cargoGrowth = prevYear
    ? Math.round(((currentYear.cargo - prevYear.cargo) / prevYear.cargo) * 1000) / 10
    : 0;
  const movementGrowth = prevYear
    ? Math.round(((currentYear.movements - prevYear.movements) / prevYear.movements) * 1000) / 10
    : 0;

  return {
    iata: airport.iata,
    name: airport.name,
    city: airport.city,
    state: airport.state,
    monthly,
    yearly,
    totals: {
      passengers: airport.passengers,
      cargo: airport.cargo,
      movements: airport.movements,
      domesticPax: airport.domestic,
      internationalPax: airport.international,
    },
    growth: {
      passengerGrowth,
      cargoGrowth,
      movementGrowth,
      domesticShare: Math.round((airport.domestic / airport.passengers) * 1000) / 10,
      internationalShare: Math.round((airport.international / airport.passengers) * 1000) / 10,
    },
  };
}

/** Get all airport codes with names for the selector. */
export function getAllAirports(): Array<{ iata: string; name: string; city: string }> {
  return AIRPORTS.map((a) => ({
    iata: a.iata,
    name: a.name,
    city: a.city,
  }));
}

/** Get analytics for multiple airports (for comparison). */
export function getComparisonData(
  iatas: string[],
): ComparisonData {
  const airports = iatas
    .map(getAirportAnalytics)
    .filter((a): a is AirportAnalyticsData => a !== null);

  return {
    airports,
    metrics: [
      "passengers",
      "cargo",
      "movements",
      "domesticPax",
      "internationalPax",
      "passengerGrowth",
      "cargoGrowth",
    ],
  };
}

/** Human-readable label for a comparison metric. */
export function metricLabel(metric: ComparisonMetric): string {
  const labels: Record<ComparisonMetric, string> = {
    passengers: "Annual Passengers",
    cargo: "Annual Cargo (tonnes)",
    movements: "Aircraft Movements",
    domesticPax: "Domestic Passengers",
    internationalPax: "International Passengers",
    passengerGrowth: "Passenger Growth (%)",
    cargoGrowth: "Cargo Growth (%)",
  };
  return labels[metric];
}

/** Format a large number for display. */
export function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/** Get the maximum value for a given metric across airports. */
export function getMaxMetric(
  airports: AirportAnalyticsData[],
  metric: ComparisonMetric,
): number {
  return Math.max(
    ...airports.map((a) => {
      switch (metric) {
        case "passengers": return a.totals.passengers;
        case "cargo": return a.totals.cargo;
        case "movements": return a.totals.movements;
        case "domesticPax": return a.totals.domesticPax;
        case "internationalPax": return a.totals.internationalPax;
        case "passengerGrowth": return a.growth.passengerGrowth;
        case "cargoGrowth": return a.growth.cargoGrowth;
        default: return 0;
      }
    }),
  );
}

/** Get the value for a metric on a specific airport. */
export function getMetricValue(
  airport: AirportAnalyticsData,
  metric: ComparisonMetric,
): number {
  switch (metric) {
    case "passengers": return airport.totals.passengers;
    case "cargo": return airport.totals.cargo;
    case "movements": return airport.totals.movements;
    case "domesticPax": return airport.totals.domesticPax;
    case "internationalPax": return airport.totals.internationalPax;
    case "passengerGrowth": return airport.growth.passengerGrowth;
    case "cargoGrowth": return airport.growth.cargoGrowth;
    default: return 0;
  }
}
