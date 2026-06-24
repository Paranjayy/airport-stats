// Historical aviation data and weather information

export interface YearlyData {
  year: number;
  passengers: number;
  cargo: number;
  movements: number;
  domesticPax: number;
  internationalPax: number;
  growthRate: number;
}

export interface AirportWeather {
  iata: string;
  avgTempC: number;
  avgRainfallMm: number;
  rainyDays: number;
  humidDays: number;
  foggyDays: number;
  bestMonths: string[];
  worstMonths: string[];
  climate: string;
  runwayFooting: string;
  challenges: string[];
}

export interface HistoricalTrend {
  year: number;
  india: { passengers: number; cargo: number; airports: number };
  china: { passengers: number; cargo: number; airports: number };
  usa: { passengers: number; cargo: number; airports: number };
}

// === INDIA AVIATION YEARLY DATA ===
export const INDIA_YEARLY: YearlyData[] = [
  { year: 2015, passengers: 204000000, cargo: 2500000, movements: 1600000, domesticPax: 175000000, internationalPax: 29000000, growthRate: 18.7 },
  { year: 2016, passengers: 245000000, cargo: 2700000, movements: 1800000, domesticPax: 210000000, internationalPax: 35000000, growthRate: 20.1 },
  { year: 2017, passengers: 298000000, cargo: 2900000, movements: 2100000, domesticPax: 255000000, internationalPax: 43000000, growthRate: 21.6 },
  { year: 2018, passengers: 344000000, cargo: 3100000, movements: 2400000, domesticPax: 295000000, internationalPax: 49000000, growthRate: 15.4 },
  { year: 2019, passengers: 398000000, cargo: 3300000, movements: 2700000, domesticPax: 340000000, internationalPax: 58000000, growthRate: 15.7 },
  { year: 2020, passengers: 120000000, cargo: 2800000, movements: 800000, domesticPax: 105000000, internationalPax: 15000000, growthRate: -69.8 },
  { year: 2021, passengers: 185000000, cargo: 3200000, movements: 1200000, domesticPax: 170000000, internationalPax: 15000000, growthRate: 54.2 },
  { year: 2022, passengers: 310000000, cargo: 3500000, movements: 2200000, domesticPax: 270000000, internationalPax: 40000000, growthRate: 67.6 },
  { year: 2023, passengers: 363000000, cargo: 3700000, movements: 2800000, domesticPax: 310000000, internationalPax: 53000000, growthRate: 17.1 },
  { year: 2024, passengers: 410000000, cargo: 4000000, movements: 3100000, domesticPax: 350000000, internationalPax: 60000000, growthRate: 12.9 },
];

// === MAJOR AIRPORT WEATHER DATA ===
export const AIRPORT_WEATHER: AirportWeather[] = [
  { iata:"DEL", avgTempC:25.3, avgRainfallMm:714, rainyDays:42, humidDays:85, foggyDays:25, bestMonths:["Oct","Nov","Feb","Mar"], worstMonths:["Jun","Jul","Aug"], climate:"Semi-arid", runwayFooting:"Bituminous", challenges:["Dense fog in winter (Dec-Jan)", "Extreme summer heat (45°C+)", "Haze and pollution", "Thunderstorms in monsoon"] },
  { iata:"BOM", avgTempC:27.2, avgRainfallMm:2167, rainyDays:70, humidDays:180, foggyDays:0, bestMonths:["Nov","Feb","Mar"], worstMonths:["Jun","Jul","Aug","Sep"], climate:"Tropical wet-dry", runwayFooting:"Bituminous", challenges:["Heavy monsoon rain", "High humidity year-round", "Flooding risk", "Strong crosswinds"] },
  { iata:"BLR", avgTempC:24.8, avgRainfallMm:934, rainyDays:55, humidDays:60, foggyDays:0, bestMonths:["Oct","Nov","Feb","Mar"], worstMonths:["May","Jun"], climate:"Tropical savanna", runwayFooting:"Bituminous", challenges:["Evening thunderstorms (Apr-May)", "Reduced visibility in monsoon", "Hail risk"] },
  { iata:"HYD", avgTempC:26.4, avgRainfallMm:812, rainyDays:45, humidDays:70, foggyDays:0, bestMonths:["Oct","Nov","Feb","Mar"], worstMonths:["Apr","May"], climate:"Tropical wet-dry", runwayFooting:"Bituminous", challenges:["Extreme summer heat (44°C+)", "Dust storms", "Thunderstorms"] },
  { iata:"MAA", avgTempC:28.6, avgRainfallMm:1431, rainyDays:50, humidDays:150, foggyDays:0, bestMonths:["Dec","Jan","Feb"], worstMonths:["Oct","Nov"], climate:"Tropical wet-dry", runwayFooting:"Bituminous", challenges:["Cyclone risk (Oct-Dec)", "Heavy monsoon", "High humidity", "Heat"] },
  { iata:"CCU", avgTempC:26.8, avgRainfallMm:1650, rainyDays:65, humidDays:120, foggyDays:15, bestMonths:["Nov","Feb","Mar"], worstMonths:["Jun","Jul","Aug"], climate:"Tropical wet-dry", runwayFooting:"Bituminous", challenges:["Heavy monsoon flooding", "Fog in winter", "Thunderstorms"] },
  { iata:"COK", avgTempC:27.1, avgRainfallMm:3055, rainyDays:120, humidDays:200, foggyDays:0, bestMonths:["Dec","Jan","Feb"], worstMonths:["Jun","Jul","Aug"], climate:"Tropical monsoon", runwayFooting:"Bituminous", challenges:["Heavy monsoon (3000mm rain)", "Flooding", "High humidity"] },
  { iata:"GOI", avgTempC:27.4, avgRainfallMm:2940, rainyDays:110, humidDays:180, foggyDays:0, bestMonths:["Nov","Feb","Mar"], worstMonths:["Jun","Jul","Aug"], climate:"Tropical monsoon", runwayFooting:"Bituminous", challenges:["Extreme monsoon", "Coastal fog", "Bird strikes"] },
  { iata:"JAI", avgTempC:25.8, avgRainfallMm:650, rainyDays:35, humidDays:50, foggyDays:10, bestMonths:["Oct","Nov","Feb","Mar"], worstMonths:["May","Jun"], climate:"Semi-arid", runwayFooting:"Bituminous", challenges:["Extreme heat (48°C+)", "Sandstorms", "Fog in winter"] },
  { iata:"SXR", avgTempC:12.8, avgRainfallMm:694, rainyDays:60, humidDays:40, foggyDays:40, bestMonths:["May","Jun","Sep","Oct"], worstMonths:["Dec","Jan"], climate:"Humid subtropical", runwayFooting:"Bituminous", challenges:["Heavy snow (Dec-Feb)", "Dense fog", "Low visibility", "Cold temperatures (-5°C)"] },
  { iata:"IXL", avgTempC:3.2, avgRainfallMm:102, rainyDays:30, humidDays:10, foggyDays:20, bestMonths:["Jun","Jul","Aug","Sep"], worstMonths:["Dec","Jan","Feb"], climate:"Cold desert", runwayFooting:"Bituminous", challenges:["Extreme cold (-20°C)", "High density altitude", "Thin air at 10,682 ft", "Snow and ice", "Limited approach options"] },
  { iata:"PNQ", avgTempC:25.2, avgRainfallMm:722, rainyDays:45, humidDays:55, foggyDays:5, bestMonths:["Oct","Nov","Feb","Mar"], worstMonths:["Apr","May"], climate:"Tropical wet-dry", runwayFooting:"Bituminous", challenges:["Thunderstorms", "Fog in winter", "Joint civil-military restrictions"] },
];

// === GLOBAL COMPARISON DATA ===
export const GLOBAL_TRENDS: HistoricalTrend[] = [
  { year: 2019, india: { passengers: 398000000, cargo: 3300000, airports: 100 }, china: { passengers: 660000000, cargo: 18000000, airports: 238 }, usa: { passengers: 927000000, cargo: 25000000, airports: 19600 } },
  { year: 2020, india: { passengers: 120000000, cargo: 2800000, airports: 105 }, china: { passengers: 420000000, cargo: 16000000, airports: 242 }, usa: { passengers: 368000000, cargo: 22000000, airports: 19600 } },
  { year: 2021, india: { passengers: 185000000, cargo: 3200000, airports: 110 }, china: { passengers: 550000000, cargo: 17000000, airports: 248 }, usa: { passengers: 674000000, cargo: 24000000, airports: 19600 } },
  { year: 2022, india: { passengers: 310000000, cargo: 3500000, airports: 120 }, china: { passengers: 580000000, cargo: 18000000, airports: 254 }, usa: { passengers: 854000000, cargo: 25000000, airports: 19600 } },
  { year: 2023, india: { passengers: 363000000, cargo: 3700000, airports: 130 }, china: { passengers: 620000000, cargo: 18000000, airports: 254 }, usa: { passengers: 930000000, cargo: 26000000, airports: 19600 } },
];

// === TOP INDIAN AIRLINES HISTORICAL ===
export const AIRLINE_HISTORY = [
  { year: 2019, indigo: 48, airIndia: 12, spiceJet: 14, vistara: 8, goFirst: 10, others: 8 },
  { year: 2020, indigo: 55, airIndia: 10, spiceJet: 12, vistara: 10, goFirst: 8, others: 15 },
  { year: 2021, indigo: 56, airIndia: 10, spiceJet: 10, vistara: 12, goFirst: 8, others: 14 },
  { year: 2022, indigo: 58, airIndia: 11, spiceJet: 7, vistara: 11, goFirst: 8, others: 15 },
  { year: 2023, indigo: 62, airIndia: 12, spiceJet: 5, vistara: 8, goFirst: 3, others: 10 },
];
