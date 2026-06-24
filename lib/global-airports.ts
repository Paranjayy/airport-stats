// Global airport data for future country comparison
// Top airports by continent/region

export interface GlobalAirport {
  iata: string;
  icao: string;
  name: string;
  city: string;
  country: string;
  region: "Asia" | "Europe" | "North America" | "Middle East" | "Southeast Asia" | "Africa" | "South America" | "Oceania";
  passengers: number;
  cargo: number;
  runways: number;
  longestRunwayFt: number;
  lat: number;
  lon: number;
  type: "hub" | "major" | "regional";
}

export const GLOBAL_AIRPORTS: GlobalAirport[] = [
  // === ASIA ===
  { iata:"PEK", icao:"ZBAA", name:"Beijing Capital International Airport", city:"Beijing", country:"China", region:"Asia", passengers:100000000, cargo:2000000, runways:3, longestRunwayFt:12467, lat:40.0801, lon:116.5846, type:"hub" },
  { iata:"DXB", icao:"OMDB", name:"Dubai International Airport", city:"Dubai", country:"UAE", region:"Middle East", passengers:89000000, cargo:2900000, runways:2, longestRunwayFt:14039, lat:25.2532, lon:55.3657, type:"hub" },
  { iata:"HND", icao:"RJTT", name:"Haneda Airport", city:"Tokyo", country:"Japan", region:"Asia", passengers:87000000, cargo:1400000, runways:4, longestRunwayFt:11024, lat:35.5494, lon:139.7798, type:"hub" },
  { iata:"HKG", icao:"VHHH", name:"Hong Kong International Airport", city:"Hong Kong", country:"China", region:"Asia", passengers:72000000, cargo:5000000, runways:2, longestRunwayFt:12467, lat:22.308, lon:113.9185, type:"hub" },
  { iata:"SIN", icao:"WSSS", name:"Singapore Changi Airport", city:"Singapore", country:"Singapore", region:"Southeast Asia", passengers:68000000, cargo:2100000, runways:2, longestRunwayFt:13123, lat:1.3644, lon:103.9915, type:"hub" },
  { iata:"BKK", icao:"VTBS", name:"Suvarnabhumi Airport", city:"Bangkok", country:"Thailand", region:"Southeast Asia", passengers:65000000, cargo:1500000, runways:2, longestRunwayFt:13123, lat:13.6900, lon:100.7501, type:"hub" },
  { iata:"ICN", icao:"RKSI", name:"Incheon International Airport", city:"Seoul", country:"South Korea", region:"Asia", passengers:62000000, cargo:2800000, runways:2, longestRunwayFt:13123, lat:37.4602, lon:126.4407, type:"hub" },
  { iata:"KUL", icao:"WMKK", name:"Kuala Lumpur International Airport", city:"Kuala Lumpur", country:"Malaysia", region:"Southeast Asia", passengers:48000000, cargo:1200000, runways:2, longestRunwayFt:13307, lat:2.7456, lon:101.7099, type:"hub" },
  { iata:"CAN", icao:"ZGGG", name:"Guangzhou Baiyun International Airport", city:"Guangzhou", country:"China", region:"Asia", passengers:63000000, cargo:2000000, runways:3, longestRunwayFt:12467, lat:23.3924, lon:113.2988, type:"major" },
  { iata:"DEL", icao:"VIDP", name:"Indira Gandhi International Airport", city:"New Delhi", country:"India", region:"Asia", passengers:73000000, cargo:970000, runways:3, longestRunwayFt:14534, lat:28.5562, lon:77.1000, type:"hub" },

  // === EUROPE ===
  { iata:"LHR", icao:"EGLL", name:"London Heathrow Airport", city:"London", country:"UK", region:"Europe", passengers:79000000, cargo:1800000, runways:2, longestRunwayFt:12799, lat:51.4700, lon:-0.4543, type:"hub" },
  { iata:"CDG", icao:"LFPG", name:"Paris Charles de Gaulle Airport", city:"Paris", country:"France", region:"Europe", passengers:76000000, cargo:2400000, runways:4, longestRunwayFt:13829, lat:49.0097, lon:2.5479, type:"hub" },
  { iata:"FRA", icao:"EDDF", name:"Frankfurt Airport", city:"Frankfurt", country:"Germany", region:"Europe", passengers:69000000, cargo:2300000, runways:4, longestRunwayFt:13123, lat:50.0379, lon:8.5622, type:"hub" },
  { iata:"AMS", icao:"EHAM", name:"Amsterdam Schiphol Airport", city:"Amsterdam", country:"Netherlands", region:"Europe", passengers:72000000, cargo:1800000, runways:6, longestRunwayFt:12467, lat:52.3105, lon:4.7683, type:"hub" },
  { iata:"IST", icao:"LTFM", name:"Istanbul Airport", city:"Istanbul", country:"Turkey", region:"Europe", passengers:76000000, cargo:1500000, runways:3, longestRunwayFt:13451, lat:41.2753, lon:28.7519, type:"hub" },

  // === NORTH AMERICA ===
  { iata:"ATL", icao:"KATL", name:"Hartsfield-Jackson Atlanta International Airport", city:"Atlanta", country:"USA", region:"North America", passengers:93000000, cargo:730000, runways:5, longestRunwayFt:12390, lat:33.6407, lon:-84.4277, type:"hub" },
  { iata:"LAX", icao:"KLAX", name:"Los Angeles International Airport", city:"Los Angeles", country:"USA", region:"North America", passengers:88000000, cargo:2600000, runways:4, longestRunwayFt:12091, lat:33.9425, lon:-118.4081, type:"hub" },
  { iata:"ORD", icao:"KORD", name:"O'Hare International Airport", city:"Chicago", country:"USA", region:"North America", passengers:83000000, cargo:2100000, runways:8, longestRunwayFt:13000, lat:41.9742, lon:-87.9073, type:"hub" },
  { iata:"DFW", icao:"KDFW", name:"Dallas/Fort Worth International Airport", city:"Dallas", country:"USA", region:"North America", passengers:73000000, cargo:950000, runways:7, longestRunwayFt:13401, lat:32.8998, lon:-97.0403, type:"hub" },
  { iata:"YYZ", icao:"CYYZ", name:"Toronto Pearson International Airport", city:"Toronto", country:"Canada", region:"North America", passengers:50000000, cargo:500000, runways:5, longestRunwayFt:11120, lat:43.6777, lon:-79.6248, type:"hub" },

  // === MIDDLE EAST ===
  { iata:"DOH", icao:"OTHH", name:"Hamad International Airport", city:"Doha", country:"Qatar", region:"Middle East", passengers:46000000, cargo:2800000, runways:2, longestRunwayFt:15000, lat:25.2731, lon:51.6081, type:"hub" },
  { iata:"AUH", icao:"OMAA", name:"Abu Dhabi International Airport", city:"Abu Dhabi", country:"UAE", region:"Middle East", passengers:24000000, cargo:1200000, runways:2, longestRunwayFt:13451, lat:24.4330, lon:54.6511, type:"hub" },
  { iata:"JED", icao:"OEJN", name:"King Abdulaziz International Airport", city:"Jeddah", country:"Saudi Arabia", region:"Middle East", passengers:41000000, cargo:300000, runways:2, longestRunwayFt:12467, lat:21.6796, lon:39.1565, type:"hub" },

  // === OCEANIA ===
  { iata:"SYD", icao:"YSSY", name:"Sydney Kingsford Smith Airport", city:"Sydney", country:"Australia", region:"Oceania", passengers:44000000, cargo:500000, runways:3, longestRunwayFt:13000, lat:-33.9461, lon:151.1772, type:"hub" },
  { iata:"MEL", icao:"YMML", name:"Melbourne Airport", city:"Melbourne", country:"Australia", region:"Oceania", passengers:38000000, cargo:400000, runways:2, longestRunwayFt:12000, lat:-37.6690, lon:144.8410, type:"major" },
];

// Country comparison data
export interface CountryAviation {
  country: string;
  region: string;
  totalAirports: number;
  majorAirports: number;
  annualPassengers: number;
  annualCargo: number;
  airlines: number;
  fleet: number;
  pilotSchools: number;
  aviationGDP: number; // billion USD
  growthRate: number; // percentage
  flag: string;
}

export const COUNTRY_COMPARISON: CountryAviation[] = [
  { country:"India", region:"Asia", totalAirports:486, majorAirports:35, annualPassengers:363000000, annualCargo:3100000, airlines:10, fleet:800, pilotSchools:50, aviationGDP:12, growthRate:12, flag:"🇮🇳" },
  { country:"USA", region:"North America", totalAirports:19600, majorAirports:30, annualPassengers:930000000, annualCargo:25000000, airlines:100, fleet:7500, pilotSchools:3000, aviationGDP:280, growthRate:4, flag:"🇺🇸" },
  { country:"China", region:"Asia", totalAirports:254, majorAirports:40, annualPassengers:620000000, annualCargo:18000000, airlines:60, fleet:4200, pilotSchools:200, aviationGDP:85, growthRate:8, flag:"🇨🇳" },
  { country:"UAE", region:"Middle East", totalAirports:10, majorAirports:5, annualPassengers:120000000, annualCargo:4500000, airlines:15, fleet:500, pilotSchools:20, aviationGDP:35, growthRate:10, flag:"🇦🇪" },
  { country:"UK", region:"Europe", totalAirports:40, majorAirports:10, annualPassengers:280000000, annualCargo:3200000, airlines:50, fleet:1200, pilotSchools:150, aviationGDP:65, growthRate:5, flag:"🇬🇧" },
  { country:"Germany", region:"Europe", totalAirports:35, majorAirports:8, annualPassengers:220000000, annualCargo:4500000, airlines:40, fleet:900, pilotSchools:120, aviationGDP:55, growthRate:4, flag:"🇩🇪" },
  { country:"Singapore", region:"Southeast Asia", totalAirports:5, majorAirports:2, annualPassengers:68000000, annualCargo:2100000, airlines:8, fleet:350, pilotSchools:15, aviationGDP:18, growthRate:7, flag:"🇸🇬" },
  { country:"Japan", region:"Asia", totalAirports:90, majorAirports:15, annualPassengers:230000000, annualCargo:4200000, airlines:25, fleet:1100, pilotSchools:80, aviationGDP:75, growthRate:3, flag:"🇯🇵" },
];
