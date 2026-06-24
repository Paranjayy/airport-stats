"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import FadeInOnView from "@/components/ui/FadeInOnView";
import SummaryBar from "@/components/sections/SummaryBar";
import AirportTable from "@/components/sections/AirportTable";
import RouteOverview from "@/components/sections/RouteOverview";
import StatsOverview from "@/components/sections/StatsOverview";
import type { Airport } from "@/lib/database";

const IndiaMap = dynamic(() => import("@/components/map/IndiaMap"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-bg" aria-hidden />,
});

/* ------------------------------------------------------------------ */
/*  28 Indian airports — 2023 data from AAI annual reports              */
/* ------------------------------------------------------------------ */

const AIRPORTS: Airport[] = [
  {
    id: 1,
    iata_code: "DEL",
    icao_code: "VIDP",
    name: "Indira Gandhi International Airport",
    city: "New Delhi",
    state: "Delhi",
    country: "India",
    latitude: 28.5562,
    longitude: 77.1,
    elevation_ft: 237,
    airport_type: "international",
    runway_count: 3,
    runway_length_ft: 14534,
    annual_passengers: 73000000,
    annual_cargo_tonnes: 970000,
    annual_movements: 460000,
    domestic_passengers: 52000000,
    international_passengers: 21000000,
  },
  {
    id: 2,
    iata_code: "BOM",
    icao_code: "VABB",
    name: "Chhatrapati Shivaji Maharaj International Airport",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    latitude: 19.0896,
    longitude: 72.8656,
    elevation_ft: 4,
    airport_type: "international",
    runway_count: 2,
    runway_length_ft: 12008,
    annual_passengers: 52000000,
    annual_cargo_tonnes: 850000,
    annual_movements: 380000,
    domestic_passengers: 42000000,
    international_passengers: 10000000,
  },
  {
    id: 3,
    iata_code: "BLR",
    icao_code: "VOBL",
    name: "Kempegowda International Airport",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    latitude: 13.1986,
    longitude: 77.7066,
    elevation_ft: 3005,
    airport_type: "international",
    runway_count: 2,
    runway_length_ft: 13002,
    annual_passengers: 37000000,
    annual_cargo_tonnes: 410000,
    annual_movements: 260000,
    domestic_passengers: 31000000,
    international_passengers: 6000000,
  },
  {
    id: 4,
    iata_code: "HYD",
    icao_code: "VOHS",
    name: "Rajiv Gandhi International Airport",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    latitude: 17.2403,
    longitude: 78.4294,
    elevation_ft: 2024,
    airport_type: "international",
    runway_count: 2,
    runway_length_ft: 13980,
    annual_passengers: 25000000,
    annual_cargo_tonnes: 120000,
    annual_movements: 220000,
    domestic_passengers: 21000000,
    international_passengers: 4000000,
  },
  {
    id: 5,
    iata_code: "MAA",
    icao_code: "VOMM",
    name: "Chennai International Airport",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    latitude: 12.9941,
    longitude: 80.1709,
    elevation_ft: 52,
    airport_type: "international",
    runway_count: 2,
    runway_length_ft: 10050,
    annual_passengers: 22000000,
    annual_cargo_tonnes: 350000,
    annual_movements: 200000,
    domestic_passengers: 18000000,
    international_passengers: 4000000,
  },
  {
    id: 6,
    iata_code: "CCU",
    icao_code: "VECC",
    name: "Netaji Subhas Chandra Bose International Airport",
    city: "Kolkata",
    state: "West Bengal",
    country: "India",
    latitude: 22.6547,
    longitude: 88.4467,
    elevation_ft: 16,
    airport_type: "international",
    runway_count: 2,
    runway_length_ft: 11900,
    annual_passengers: 20000000,
    annual_cargo_tonnes: 160000,
    annual_movements: 180000,
    domestic_passengers: 17000000,
    international_passengers: 3000000,
  },
  {
    id: 7,
    iata_code: "AMD",
    icao_code: "VAAH",
    name: "Sardar Vallabhbhai Patel International Airport",
    city: "Ahmedabad",
    state: "Gujarat",
    country: "India",
    latitude: 23.0773,
    longitude: 72.6347,
    elevation_ft: 189,
    airport_type: "international",
    runway_count: 2,
    runway_length_ft: 11811,
    annual_passengers: 14000000,
    annual_cargo_tonnes: 90000,
    annual_movements: 120000,
    domestic_passengers: 13500000,
    international_passengers: 500000,
  },
  {
    id: 8,
    iata_code: "COK",
    icao_code: "VOCI",
    name: "Cochin International Airport",
    city: "Kochi",
    state: "Kerala",
    country: "India",
    latitude: 9.9471,
    longitude: 76.2733,
    elevation_ft: 30,
    airport_type: "international",
    runway_count: 2,
    runway_length_ft: 11154,
    annual_passengers: 11000000,
    annual_cargo_tonnes: 65000,
    annual_movements: 95000,
    domestic_passengers: 9500000,
    international_passengers: 1500000,
  },
  {
    id: 9,
    iata_code: "GOI",
    icao_code: "VOGO",
    name: "Goa International Airport",
    city: "Vasco da Gama",
    state: "Goa",
    country: "India",
    latitude: 15.3809,
    longitude: 73.8314,
    elevation_ft: 184,
    airport_type: "international",
    runway_count: 1,
    runway_length_ft: 11345,
    annual_passengers: 9500000,
    annual_cargo_tonnes: 25000,
    annual_movements: 75000,
    domestic_passengers: 9000000,
    international_passengers: 500000,
  },
  {
    id: 10,
    iata_code: "JAI",
    icao_code: "VIJP",
    name: "Jaipur International Airport",
    city: "Jaipur",
    state: "Rajasthan",
    country: "India",
    latitude: 26.8242,
    longitude: 75.8122,
    elevation_ft: 1263,
    airport_type: "international",
    runway_count: 2,
    runway_length_ft: 11483,
    annual_passengers: 9500000,
    annual_cargo_tonnes: 18000,
    annual_movements: 85000,
    domestic_passengers: 9000000,
    international_passengers: 500000,
  },
  {
    id: 11,
    iata_code: "PNQ",
    icao_code: "VAPO",
    name: "Pune Airport",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    latitude: 18.5821,
    longitude: 73.9197,
    elevation_ft: 1942,
    airport_type: "domestic",
    runway_count: 1,
    runway_length_ft: 8465,
    annual_passengers: 9000000,
    annual_cargo_tonnes: 40000,
    annual_movements: 80000,
    domestic_passengers: 8800000,
    international_passengers: 200000,
  },
  {
    id: 12,
    iata_code: "GAU",
    icao_code: "VEGT",
    name: "Lokpriya Gopinath Bordoloi International Airport",
    city: "Guwahati",
    state: "Assam",
    country: "India",
    latitude: 26.1061,
    longitude: 91.5859,
    elevation_ft: 162,
    airport_type: "international",
    runway_count: 1,
    runway_length_ft: 10050,
    annual_passengers: 8500000,
    annual_cargo_tonnes: 22000,
    annual_movements: 78000,
    domestic_passengers: 7800000,
    international_passengers: 700000,
  },
  {
    id: 13,
    iata_code: "LKO",
    icao_code: "VILK",
    name: "Chaudhary Charan Singh International Airport",
    city: "Lucknow",
    state: "Uttar Pradesh",
    country: "India",
    latitude: 26.7606,
    longitude: 80.8893,
    elevation_ft: 410,
    airport_type: "international",
    runway_count: 2,
    runway_length_ft: 11200,
    annual_passengers: 8000000,
    annual_cargo_tonnes: 12000,
    annual_movements: 75000,
    domestic_passengers: 7800000,
    international_passengers: 200000,
  },
  {
    id: 14,
    iata_code: "TRV",
    icao_code: "VOTV",
    name: "Trivandrum International Airport",
    city: "Thiruvananthapuram",
    state: "Kerala",
    country: "India",
    latitude: 8.4821,
    longitude: 76.9199,
    elevation_ft: 15,
    airport_type: "international",
    runway_count: 2,
    runway_length_ft: 11000,
    annual_passengers: 5500000,
    annual_cargo_tonnes: 20000,
    annual_movements: 55000,
    domestic_passengers: 5000000,
    international_passengers: 500000,
  },
  {
    id: 15,
    iata_code: "PAT",
    icao_code: "VEPT",
    name: "Lok Nayak Jayaprakash Airport",
    city: "Patna",
    state: "Bihar",
    country: "India",
    latitude: 25.5913,
    longitude: 85.088,
    elevation_ft: 170,
    airport_type: "domestic",
    runway_count: 1,
    runway_length_ft: 7200,
    annual_passengers: 6000000,
    annual_cargo_tonnes: 5000,
    annual_movements: 60000,
    domestic_passengers: 5900000,
    international_passengers: 100000,
  },
  {
    id: 16,
    iata_code: "IXB",
    icao_code: "VEBD",
    name: "Bagdogra International Airport",
    city: "Siliguri",
    state: "West Bengal",
    country: "India",
    latitude: 26.6812,
    longitude: 88.3286,
    elevation_ft: 412,
    airport_type: "international",
    runway_count: 1,
    runway_length_ft: 10050,
    annual_passengers: 3800000,
    annual_cargo_tonnes: 2000,
    annual_movements: 40000,
    domestic_passengers: 3700000,
    international_passengers: 100000,
  },
  {
    id: 17,
    iata_code: "VTZ",
    icao_code: "VOVZ",
    name: "Visakhapatnam Airport",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    country: "India",
    latitude: 17.7215,
    longitude: 83.2245,
    elevation_ft: 15,
    airport_type: "domestic",
    runway_count: 1,
    runway_length_ft: 10050,
    annual_passengers: 3500000,
    annual_cargo_tonnes: 15000,
    annual_movements: 38000,
    domestic_passengers: 3400000,
    international_passengers: 100000,
  },
  {
    id: 18,
    iata_code: "BBI",
    icao_code: "VEBS",
    name: "Biju Patnaik International Airport",
    city: "Bhubaneswar",
    state: "Odisha",
    country: "India",
    latitude: 20.2444,
    longitude: 85.8178,
    elevation_ft: 151,
    airport_type: "international",
    runway_count: 1,
    runway_length_ft: 9000,
    annual_passengers: 4200000,
    annual_cargo_tonnes: 8000,
    annual_movements: 45000,
    domestic_passengers: 4100000,
    international_passengers: 100000,
  },
  {
    id: 19,
    iata_code: "CXR",
    icao_code: "VICG",
    name: "Chandigarh International Airport",
    city: "Chandigarh",
    state: "Chandigarh",
    country: "India",
    latitude: 30.6735,
    longitude: 76.7885,
    elevation_ft: 1012,
    airport_type: "domestic",
    runway_count: 1,
    runway_length_ft: 10050,
    annual_passengers: 5000000,
    annual_cargo_tonnes: 8000,
    annual_movements: 50000,
    domestic_passengers: 4900000,
    international_passengers: 100000,
  },
  {
    id: 20,
    iata_code: "IMF",
    icao_code: "VEIM",
    name: "Imphal Airport",
    city: "Imphal",
    state: "Manipur",
    country: "India",
    latitude: 24.76,
    longitude: 93.8967,
    elevation_ft: 2542,
    airport_type: "domestic",
    runway_count: 1,
    runway_length_ft: 8000,
    annual_passengers: 3200000,
    annual_cargo_tonnes: 3000,
    annual_movements: 35000,
    domestic_passengers: 3150000,
    international_passengers: 50000,
  },
  {
    id: 21,
    iata_code: "IXR",
    icao_code: "VERC",
    name: "Birsa Munda Airport",
    city: "Ranchi",
    state: "Jharkhand",
    country: "India",
    latitude: 23.3144,
    longitude: 85.3217,
    elevation_ft: 1012,
    airport_type: "domestic",
    runway_count: 1,
    runway_length_ft: 8400,
    annual_passengers: 3500000,
    annual_cargo_tonnes: 2000,
    annual_movements: 38000,
    domestic_passengers: 3450000,
    international_passengers: 50000,
  },
  {
    id: 22,
    iata_code: "IDR",
    icao_code: "VAID",
    name: "Devi Ahilyabai Holkar Airport",
    city: "Indore",
    state: "Madhya Pradesh",
    country: "India",
    latitude: 22.7217,
    longitude: 75.8011,
    elevation_ft: 1850,
    airport_type: "domestic",
    runway_count: 1,
    runway_length_ft: 9000,
    annual_passengers: 3000000,
    annual_cargo_tonnes: 3000,
    annual_movements: 32000,
    domestic_passengers: 2980000,
    international_passengers: 20000,
  },
  {
    id: 23,
    iata_code: "IXM",
    icao_code: "VOMD",
    name: "Madurai Airport",
    city: "Madurai",
    state: "Tamil Nadu",
    country: "India",
    latitude: 9.8345,
    longitude: 78.0934,
    elevation_ft: 328,
    airport_type: "domestic",
    runway_count: 1,
    runway_length_ft: 7500,
    annual_passengers: 2200000,
    annual_cargo_tonnes: 1500,
    annual_movements: 25000,
    domestic_passengers: 2200000,
    international_passengers: 0,
  },
  {
    id: 24,
    iata_code: "IXA",
    icao_code: "VEAT",
    name: "Maharaja Bir Bikram Airport",
    city: "Agartala",
    state: "Tripura",
    country: "India",
    latitude: 23.8867,
    longitude: 91.2396,
    elevation_ft: 108,
    airport_type: "domestic",
    runway_count: 1,
    runway_length_ft: 7500,
    annual_passengers: 1800000,
    annual_cargo_tonnes: 500,
    annual_movements: 22000,
    domestic_passengers: 1800000,
    international_passengers: 0,
  },
  {
    id: 25,
    iata_code: "IXZ",
    icao_code: "VOPB",
    name: "Vir Savarkar International Airport",
    city: "Port Blair",
    state: "Andaman & Nicobar",
    country: "India",
    latitude: 11.6412,
    longitude: 92.7297,
    elevation_ft: 14,
    airport_type: "domestic",
    runway_count: 1,
    runway_length_ft: 10700,
    annual_passengers: 1200000,
    annual_cargo_tonnes: 200,
    annual_movements: 15000,
    domestic_passengers: 1200000,
    international_passengers: 0,
  },
  {
    id: 26,
    iata_code: "DMU",
    icao_code: "VEMR",
    name: "Dimapur Airport",
    city: "Dimapur",
    state: "Nagaland",
    country: "India",
    latitude: 25.8839,
    longitude: 93.7711,
    elevation_ft: 330,
    airport_type: "domestic",
    runway_count: 1,
    runway_length_ft: 7500,
    annual_passengers: 800000,
    annual_cargo_tonnes: 0,
    annual_movements: 10000,
    domestic_passengers: 800000,
    international_passengers: 0,
  },
  {
    id: 27,
    iata_code: "SHL",
    icao_code: "VEBI",
    name: "Shillong Airport",
    city: "Shillong",
    state: "Meghalaya",
    country: "India",
    latitude: 25.7036,
    longitude: 91.9787,
    elevation_ft: 3156,
    airport_type: "domestic",
    runway_count: 1,
    runway_length_ft: 6000,
    annual_passengers: 500000,
    annual_cargo_tonnes: 0,
    annual_movements: 8000,
    domestic_passengers: 500000,
    international_passengers: 0,
  },
  {
    id: 28,
    iata_code: "SLM",
    icao_code: "VOSM",
    name: "Salem Airport",
    city: "Salem",
    state: "Tamil Nadu",
    country: "India",
    latitude: 11.7833,
    longitude: 78.0656,
    elevation_ft: 1004,
    airport_type: "domestic",
    runway_count: 1,
    runway_length_ft: 5940,
    annual_passengers: 300000,
    annual_cargo_tonnes: 0,
    annual_movements: 5000,
    domestic_passengers: 300000,
    international_passengers: 0,
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function smoothScrollToMap(duration = 1200) {
  if (typeof window === "undefined") return;
  const targetY = window.innerHeight * 2.2;
  const startY = window.scrollY;
  if (startY >= targetY - 1) return;
  const distance = targetY - startY;
  const startTime = performance.now();
  const ease = (t: number) => 1 - Math.pow(1 - t, 4);
  const step = (now: number) => {
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / duration);
    window.scrollTo(0, startY + distance * ease(t));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function Page() {
  const [progress, setProgress] = useState(0);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    airport: Airport;
  } | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      setProgress(Math.min(1, scrollY / (vh * 2)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Idle bounce
  useEffect(() => {
    let userScrolled = false;
    let bouncing = false;
    const onScroll = () => {
      if (!bouncing) userScrolled = true;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const timer = window.setTimeout(() => {
      if (userScrolled) return;
      bouncing = true;
      window.scrollTo({
        top: Math.round(window.innerHeight * 0.12),
        behavior: "smooth",
      });
      window.setTimeout(
        () => window.scrollTo({ top: 0, behavior: "smooth" }),
        700,
      );
    }, 2800);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleSelectAirport = useCallback((airport: Airport) => {
    setSelectedAirport(airport);
    smoothScrollToMap();
  }, []);

  // Hero animations
  const clamp = (n: number, min: number, max: number) =>
    Math.max(min, Math.min(max, n));
  const headlineOpacity = clamp(1 - progress / 0.22, 0, 1);
  const headlineY = -progress * 44;
  const mapOpacity = clamp((progress - 0.08) / 0.22, 0, 1);
  const mapScale = 0.92 + clamp((progress - 0.08) / 0.35, 0, 1) * 0.08;
  const hintOpacity = clamp(1 - (progress - 0.45) / 0.15, 0, 1);
  const hintProgress = Math.min(100, (progress / 0.55) * 100);
  const heroInactive = progress > 0.88;
  const heroBgOpacity = 1 - clamp(progress / 0.6, 0, 1);

  return (
    <>
      {/* ── Map Shell (fixed behind hero) ── */}
      <div
        className="fixed inset-0 z-0 bg-bg"
        style={{
          opacity: mapOpacity,
          transform: `scale(${mapScale})`,
          transformOrigin: "center center",
          willChange: "transform, opacity",
        }}
      >
        <IndiaMap
          airports={AIRPORTS}
          selectedAirportId={selectedAirport?.id ?? null}
          onSelectAirport={handleSelectAirport}
          setTooltip={setTooltip as any}
        />
      </div>

      {/* ── Hero ── */}
      <section
        className="fixed inset-0 z-20 overflow-hidden"
        style={{ pointerEvents: heroInactive ? "none" : "auto" }}
        aria-hidden={heroInactive}
      >
        <div
          className="absolute inset-0 bg-bg"
          style={{ opacity: heroBgOpacity }}
        />

        {/* Headline */}
        <div
          className="absolute inset-x-0 top-[22vh] md:top-[16vh] z-10 px-6 text-center pointer-events-none"
          style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            willChange: "transform, opacity",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-4 md:mb-6 w-10 h-10 md:w-14 md:h-14 text-ink"
            aria-hidden
          >
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
          </svg>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-ink leading-[1.1] md:leading-[1.05]">
            India&rsquo;s airport
            <br />
            network
          </h1>
          <p className="mt-3 md:mt-5 text-sm md:text-base text-muted max-w-md mx-auto leading-relaxed">
            {AIRPORTS.length} airports across the subcontinent — from Indira
            Gandhi International to Salem.
          </p>
        </div>

        {/* Scroll hint */}
        <div
          className="absolute inset-x-0 bottom-[5.5vh] z-20 flex flex-col items-center gap-2.5 pointer-events-none"
          style={{ opacity: hintOpacity }}
          aria-hidden
        >
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-ink tracking-tight">
              Scroll to explore
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="text-ink"
              style={{ animation: "scroll-hint 1.8s ease-in-out infinite" }}
            >
              <path
                d="M3 4.5l3 3 3-3"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="relative w-40 h-[2px] rounded-full bg-ink/10 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-ink"
              style={{ width: `${hintProgress}%` }}
            />
          </div>
        </div>
      </section>

      {/* ── Scroll spacer ── */}
      <div className="h-[400vh]" aria-hidden />

      {/* Section 01 — At a glance */}
      <section className="relative z-10 bg-white border-t border-black/[.06]">
        <div className="max-w-5xl mx-auto px-8 pt-20 pb-16">
          <div className="text-[13px] font-medium text-muted tracking-tight mb-2">
            01 · At a glance
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-ink tracking-tight leading-[1.1] mb-10">
            India&rsquo;s aviation at a glance
          </h2>
          <FadeInOnView>
            <SummaryBar airports={AIRPORTS} />
          </FadeInOnView>
        </div>
      </section>

      {/* Section 02 — Airport rankings */}
      <section className="relative z-10 bg-bg border-t border-black/[.06]">
        <div className="max-w-5xl mx-auto px-8 py-20">
          <div className="text-[13px] font-medium text-muted tracking-tight mb-2">
            02 · Rankings
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-ink tracking-tight leading-[1.1] mb-10">
            Every airport we&rsquo;re tracking
          </h2>
          <FadeInOnView>
            <AirportTable airports={AIRPORTS} />
          </FadeInOnView>
        </div>
      </section>

      {/* Section 03 — Popular routes */}
      <section className="relative z-10 bg-white border-t border-black/[.06]">
        <div className="max-w-5xl mx-auto px-8 pt-20 pb-24">
          <div className="text-[13px] font-medium text-muted tracking-tight mb-2">
            03 · Connections
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-ink tracking-tight leading-[1.1] mb-10">
            Most connected city pairs
          </h2>
          <FadeInOnView>
            <RouteOverview />
          </FadeInOnView>
        </div>
      </section>

      {/* Section 04 — Statistics by state */}
      <section className="relative z-10 bg-bg border-t border-black/[.06]">
        <div className="max-w-5xl mx-auto px-8 pt-20 pb-24">
          <div className="text-[13px] font-medium text-muted tracking-tight mb-2">
            04 · State breakdown
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-ink tracking-tight leading-[1.1] mb-3">
            State-by-state breakdown
          </h2>
          <p className="text-[15px] text-muted leading-relaxed max-w-[42rem] mb-10">
            Maharashtra leads with two major airports handling over 61M
            passengers. Delhi alone handles 73M — more than any other state.
          </p>
          <FadeInOnView>
            <StatsOverview airports={AIRPORTS} />
          </FadeInOnView>
        </div>
      </section>

      {/* Footer */}
      <section className="relative z-10 bg-white border-t border-black/[.06]">
        <div className="max-w-5xl mx-auto px-8 py-10 flex flex-wrap items-center justify-between gap-4 text-xs text-muted">
          <span>Airport Stats</span>
          <div className="flex gap-6">
            <Link href="/compare" className="hover:text-ink transition-colors">
              Compare
            </Link>
            <span>Methodology</span>
            <span>Contact</span>
          </div>
          <span>Built with data from Wikipedia & AAI</span>
        </div>
      </section>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none animate-popup-enter"
          style={{ left: tooltip.x + 12, top: tooltip.y - 10 }}
        >
          <div className="bg-white rounded-xl shadow-lg border border-black/[.08] px-4 py-3 max-w-[260px]">
            <div className="text-[11px] font-mono text-muted mb-0.5">
              {tooltip.airport.iata_code}
            </div>
            <div className="text-sm font-semibold text-ink leading-tight">
              {tooltip.airport.name}
            </div>
            <div className="text-xs text-muted mt-1">
              {tooltip.airport.city}, {tooltip.airport.state}
            </div>
            <div className="flex gap-3 mt-2 text-xs text-muted">
              <span>
                {(tooltip.airport.annual_passengers / 1e6).toFixed(0)}M pax
              </span>
              <span>
                {(tooltip.airport.annual_cargo_tonnes / 1e3).toFixed(0)}Kt cargo
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
