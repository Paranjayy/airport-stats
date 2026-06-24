// Indian aviation industry data — airlines, economics, pilot training

export interface Airline {
  code: string;
  name: string;
  type: "full-service" | "low-cost" | "regional" | "charter";
  founded: number;
  hubs: string[];
  fleet: number;
  destinations: number;
  passengers: number; // annual 2023
  marketShare: number; // percentage
  logo: string; // emoji flag
  parentCompany: string;
  headquarters: string;
  slogan: string;
}

export interface PilotSchool {
  name: string;
  location: string;
  state: string;
  type: "flying" | "ground" | "type-rating" | "dgca-approved";
  courses: string[];
  duration: string;
  fees: string; // approximate
  rating: number; // 1-5
  established: number;
  website: string;
  notables: string;
}

export interface AirportEconomics {
  iata: string;
  revenue: number; // crores INR
  profitLoss: number;
  concessionPeriod: string;
  operator: string;
  aipCharges: number; // per passenger
  landingFee: number; // per kg
  parkingFee: number; // per hour
  fuelSurcharge: number;
  dutyFree: number; // revenue
  retailRevenue: number;
  parkingRevenue: number;
  advertisingRevenue: number;
  yearData: number;
}

// === MAJOR INDIAN AIRLINES ===
export const INDIAN_AIRLINES: Airline[] = [
  { code:"6E", name:"IndiGo", type:"low-cost", founded:2006, hubs:["DEL","BOM","BLR","HYD","CCU"], fleet:380, destinations:120, passengers:100000000, marketShare:62, logo:"✈️", parentCompany:"InterGlobe Aviation", headquarters:"Gurugram", slogan:"On time. Every time." },
  { code:"AI", name:"Air India", type:"full-service", founded:1932, hubs:["DEL","BOM","BLR"], fleet:140, destinations:90, passengers:35000000, marketShare:12, logo:"🪷", parentCompany:"Tata Group", headquarters:"New Delhi", slogan:"Air India. Truly Indian." },
  { code:"SG", name:"SpiceJet", type:"low-cost", founded:2005, hubs:["DEL","CCU"], fleet:55, destinations:65, passengers:15000000, marketShare:5, logo:"🌶️", parentCompany:"SpiceJet Ltd", headquarters:"Gurugram", slogan:"With Spice, you fly high." },
  { code:"UK", name:"Vistara", type:"full-service", founded:2015, hubs:["DEL","BOM"], fleet:70, destinations:50, passengers:20000000, marketShare:8, logo:"⭐", parentCompany:"Tata Group / Singapore Airlines", headquarters:"Gurugram", slogan:"Fly the new feeling." },
  { code:"QP", name:"Akasa Air", type:"low-cost", founded:2022, hubs:["BOM"], fleet:25, destinations:30, passengers:5000000, marketShare:2, logo:"☀️", parentCompany:"Akasa Air", headquarters:"Mumbai", slogan:"Airline for everyone." },
  { code:"G8", name:"GoFirst", type:"low-cost", founded:2005, hubs:["DEL","BOM"], fleet:35, destinations:50, passengers:8000000, marketShare:3, logo:"🟢", parentCompany:"Wadia Group", headquarters:"Mumbai", slogan:"Fly smart. Fly GoFirst." },
  { code:"I5", name:"Air India Express", type:"low-cost", founded:2005, hubs:["COK","TRV","CCJ"], fleet:25, destinations:40, passengers:6000000, marketShare:3, logo:"✈️", parentCompany:"Tata Group", headquarters:"Kochi", slogan:"Always low fares." },
  { code:"S5", name:"Alliance Air", type:"regional", founded:1996, hubs:["DEL"], fleet:18, destinations:30, passengers:3000000, marketShare:1, logo:"🤝", parentCompany:"Air India", headquarters:"New Delhi", slogan:"Connecting India." },
  { code:"RD", name:"Star Air", type:"regional", founded:2019, hubs:["BLR"], fleet:6, destinations:15, passengers:500000, marketShare:0.2, logo:"⭐", parentCompany:"Star Air", headquarters:"Bengaluru", slogan:"Fly the stars." },
  { code:"2S", name:"Starlight Airline", type:"regional", founded:2022, hubs:["DEL"], fleet:3, destinations:10, passengers:100000, marketShare:0.05, logo:"✨", parentCompany:"Starlight", headquarters:"New Delhi", slogan:"Your wings." },
];

// === MAJOR INDIAN AIRPORTS BY ECONOMICS ===
export const AIRPORT_ECONOMICS: AirportEconomics[] = [
  { iata:"DEL", revenue:12500, profitLoss:3200, concessionPeriod:"2006-2036", operator:"DIAL (Adani)", aipCharges:185, landingFee:45, parkingFee:5000, fuelSurcharge:12, dutyFree:850, retailRevenue:1200, parkingRevenue:350, advertisingRevenue:200, yearData:2023 },
  { iata:"BOM", revenue:10200, profitLoss:2800, concessionPeriod:"2007-2037", operator:"Adani Group", aipCharges:195, landingFee:48, parkingFee:5200, fuelSurcharge:13, dutyFree:750, retailRevenue:1100, parkingRevenue:300, advertisingRevenue:180, yearData:2023 },
  { iata:"BLR", revenue:5800, profitLoss:1800, concessionPeriod:"2009-2039", operator:"BIAL Consortium", aipCharges:165, landingFee:40, parkingFee:4800, fuelSurcharge:10, dutyFree:450, retailRevenue:650, parkingRevenue:180, advertisingRevenue:120, yearData:2023 },
  { iata:"HYD", revenue:4200, profitLoss:1200, concessionPeriod:"2008-2038", operator:"GMR Hyderabad", aipCharges:155, landingFee:38, parkingFee:4500, fuelSurcharge:9, dutyFree:350, retailRevenue:500, parkingRevenue:150, advertisingRevenue:100, yearData:2023 },
  { iata:"MAA", revenue:3100, profitLoss:800, concessionPeriod:"2000-2030", operator:"AAI", aipCharges:145, landingFee:35, parkingFee:4200, fuelSurcharge:8, dutyFree:280, retailRevenue:400, parkingRevenue:120, advertisingRevenue:80, yearData:2023 },
  { iata:"CCU", revenue:2800, profitLoss:650, concessionPeriod:"2000-2030", operator:"AAI", aipCharges:140, landingFee:34, parkingFee:4000, fuelSurcharge:8, dutyFree:250, retailRevenue:350, parkingRevenue:110, advertisingRevenue:75, yearData:2023 },
  { iata:"COK", revenue:1800, profitLoss:450, concessionPeriod:"2000-2030", operator:"CIAL", aipCharges:130, landingFee:30, parkingFee:3500, fuelSurcharge:7, dutyFree:200, retailRevenue:300, parkingRevenue:80, advertisingRevenue:60, yearData:2023 },
  { iata:"AMD", revenue:2200, profitLoss:550, concessionPeriod:"2017-2047", operator:"Adani Group", aipCharges:150, landingFee:36, parkingFee:4000, fuelSurcharge:9, dutyFree:180, retailRevenue:280, parkingRevenue:90, advertisingRevenue:65, yearData:2023 },
];

// === PILOT TRAINING SCHOOLS IN INDIA ===
export const PILOT_SCHOOLS: PilotSchool[] = [
  { name:"Indira Gandhi Rashtriya Uran Akademi", location:"Rae Bareli", state:"Uttar Pradesh", type:"flying", courses:["CPL","ATPL","Type Rating"], duration:"18-24 months", fees:"₹80-90 Lakhs", rating:5, established:1986, website:"https://igrua.gov.in", notables:"Government-run. Premier pilot training academy." },
  { name:"Bombay Flying Club", location:"Mumbai", state:"Maharashtra", type:"flying", courses:["CPL","PPL"], duration:"12-18 months", fees:"₹70-80 Lakhs", rating:4, established:1928, website:"https://bombayflyingclub.com", notables:"Oldest flying club in India. Historic institution." },
  { name:"National Aviation Academy", location:"Chennai", state:"Tamil Nadu", type:"flying", courses:["CPL","ATPL"], duration:"18-24 months", fees:"₹75-85 Lakhs", rating:4, established:1985, website:"https://naa.edu.in", notables:"One of top private academies in South India." },
  { name:"Hindustan Aviation Academy", location:"Bengaluru", state:"Karnataka", type:"flying", courses:["CPL","PPL"], duration:"12-18 months", fees:"₹65-75 Lakhs", rating:4, established:1974, website:"https://hindustanaviationacademy.com", notables:"Affiliated with Hindustan University." },
  { name:"Rajiv Gandhi Academy of Aviation Technology", location:"Bengaluru", state:"Karnataka", type:"flying", courses:["CPL","ATPL"], duration:"18-24 months", fees:"₹70-80 Lakhs", rating:4, established:1998, website:"https://rgaat.edu.in", notables:"Government-approved training academy." },
  { name:"Ahmedabad Aviation & Aeronautics", location:"Ahmedabad", state:"Gujarat", type:"flying", courses:["CPL","PPL"], duration:"12-18 months", fees:"₹60-70 Lakhs", rating:3, established:1994, website:"https://aaal.in", notables:"One of few academies in Western India." },
  { name:"FTII (Flight Training Institute)", location:"Hyderabad", state:"Telangana", type:"flying", courses:["CPL","ATPL"], duration:"18-24 months", fees:"₹75-85 Lakhs", rating:4, established:2005, website:"https://ftii.edu.in", notables:"Modern training facilities." },
  { name:"Indian Aviation Academy", location:"Delhi", state:"Delhi", type:"ground", courses:["ATPL Ground","Meteorology","Navigation"], duration:"6-12 months", fees:"₹3-5 Lakhs", rating:4, established:1995, website:"https://indianaviationacademy.com", notables:"Premier ground school for theory exams." },
  { name:"Capt. Gopinath Aviation Academy", location:"Bengaluru", state:"Karnataka", type:"flying", courses:["CPL","PPL"], duration:"12-18 months", fees:"₹65-75 Lakhs", rating:4, established:2003, website:"https://captgopinath.com", notables:"Founded by Captain Gopinath (Deccan Aviation)." },
  { name:"Jet Airways Training Academy", location:"Mumbai", state:"Maharashtra", type:"type-rating", courses:["B737 Type Rating","A320 Type Rating"], duration:"6-8 weeks", fees:"₹15-25 Lakhs", rating:5, established:2000, website:"https://jetairways.com", notables:"Official training academy. Now merged with Air India." },
  { name:"Air India Training Academy", location:"Hyderabad", state:"Telangana", type:"type-rating", courses:["B787 Type Rating","B777 Type Rating"], duration:"6-12 weeks", fees:"₹20-30 Lakhs", rating:5, established:2010, website:"https://airindia.com", notables:"State-of-the-art simulators for wide-body aircraft." },
  { name:"SpiceJet Training Academy", location:"Delhi", state:"Delhi", type:"type-rating", courses:["B737 Type Rating"], duration:"6-8 weeks", fees:"₹15-20 Lakhs", rating:4, established:2005, website:"https://spicejet.com", notables:"Focused on B737 MAX training." },
];

// === AVIATION ECONOMICS DATA ===
export const AVIATION_ECONOMICS = {
  industrySize: { value: 120000, unit: "crores", description: "Indian aviation industry size (2023)" },
  gdpContribution: { value: 1.2, unit: "%", description: "Aviation contribution to GDP" },
  employmentDirect: { value: 350000, description: "Direct jobs in aviation" },
  employmentIndirect: { value: 1500000, description: "Indirect/induced jobs" },
  avgTicketPrice: { value: 4500, unit: "INR", description: "Average domestic ticket price" },
  avgCASK: { value: 4.2, unit: "INR/ASK", description: "Cost per Available Seat Kilometer" },
  avgRASK: { value: 4.8, unit: "INR/ASK", description: "Revenue per Available Seat Kilometer" },
  loadFactor: { value: 85, unit: "%", description: "Average seat load factor" },
  fuelCostShare: { value: 40, unit: "%", description: "Fuel cost as percentage of operating cost" },
  airportChargesShare: { value: 15, unit: "%", description: "Airport charges as percentage" },
  growthRate: { value: 12, unit: "%", description: "Annual passenger growth rate" },
  projectedPassengers: { value: 400, unit: "million", year: 2025, description: "Projected annual passengers" },
  aircraftOrders: { value: 1100, description: "Pending aircraft orders by Indian carriers" },
  newAirports: { value: 70, description: "Airports under construction/planned by 2025" },
  udScheme: { value: 450, unit: "crores", description: "UDAN subsidy for regional connectivity" },
};

// === DGCA REGULATIONS ===
export const DGCA_INFO = {
  name: "Directorate General of Civil Aviation",
  established: 1927,
  headquarters: "New Delhi",
  parentMinistry: "Ministry of Civil Aviation",
  website: "https://www.dgca.gov.in",
  responsibilities: [
    "Airworthiness certification",
    "Pilot licensing",
    "Airport regulation",
    "Airline safety oversight",
    "Accident investigation",
    "Drone regulation",
  ],
  pilotLicenseTypes: [
    { type: "PPL", name: "Private Pilot License", description: "For personal/non-commercial flying" },
    { type: "CPL", name: "Commercial Pilot License", description: "For commercial airline operations" },
    { type: "ATPL", name: "Airline Transport Pilot License", description: "For captain/command positions" },
    { type: "Frozen ATPL", name: "Frozen ATPL", description: "CPL holders progressing to ATPL" },
  ],
  medicalRequirements: [
    "Class 1 Medical: Required for CPL/ATPL",
    "Class 2 Medical: Required for PPL",
    "Annual medical examination",
    "Age limit: 65 years for ATPL",
  ],
};
