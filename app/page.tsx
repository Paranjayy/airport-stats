"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import AirportHero from "@/components/hero/AirportHero";
import IndiaMap from "@/components/map/IndiaMap";
import FadeInOnView from "@/components/ui/FadeInOnView";
import SummaryBar from "@/components/sections/SummaryBar";
import AirportTable from "@/components/sections/AirportTable";
import RouteOverview from "@/components/sections/RouteOverview";
import StatsOverview from "@/components/sections/StatsOverview";
import type { Airport } from "@/lib/database";

// --- Static airport data (from seed_data.py) ---
const AIRPORTS: Airport[] = [
  { id: 1, iata_code: "DEL", icao_code: "VIDP", name: "Indira Gandhi International Airport", city: "New Delhi", state: "Delhi", country: "India", latitude: 28.5562, longitude: 77.1, elevation_ft: 237, timezone: "Asia/Kolkata", airport_type: "international", owner: null, operator: "DIAL", terminal_count: 3, gate_count: null, runway_count: 3, runway_length_ft: 14534, runway_surface: null, website: null, wikipedia_url: null, created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: 2, iata_code: "BOM", icao_code: "VABB", name: "Chhatrapati Shivaji Maharaj International Airport", city: "Mumbai", state: "Maharashtra", country: "India", latitude: 19.0896, longitude: 72.8656, elevation_ft: 4, timezone: "Asia/Kolkata", airport_type: "international", owner: null, operator: "Adani", terminal_count: 2, gate_count: null, runway_count: 2, runway_length_ft: 12008, runway_surface: null, website: null, wikipedia_url: null, created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: 3, iata_code: "BLR", icao_code: "VOBL", name: "Kempegowda International Airport", city: "Bengaluru", state: "Karnataka", country: "India", latitude: 13.1986, longitude: 77.7066, elevation_ft: 3005, timezone: "Asia/Kolkata", airport_type: "international", owner: null, operator: "BIAL", terminal_count: 2, gate_count: null, runway_count: 2, runway_length_ft: 13002, runway_surface: null, website: null, wikipedia_url: null, created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: 4, iata_code: "MAA", icao_code: "VOMM", name: "Chennai International Airport", city: "Chennai", state: "Tamil Nadu", country: "India", latitude: 12.9941, longitude: 80.1709, elevation_ft: 52, timezone: "Asia/Kolkata", airport_type: "international", owner: null, operator: "AAI", terminal_count: 2, gate_count: null, runway_count: 2, runway_length_ft: 10050, runway_surface: null, website: null, wikipedia_url: null, created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: 5, iata_code: "HYD", icao_code: "VOHS", name: "Rajiv Gandhi International Airport", city: "Hyderabad", state: "Telangana", country: "India", latitude: 17.2403, longitude: 78.4294, elevation_ft: 2024, timezone: "Asia/Kolkata", airport_type: "international", owner: null, operator: "GMR", terminal_count: 1, gate_count: null, runway_count: 2, runway_length_ft: 13980, runway_surface: null, website: null, wikipedia_url: null, created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: 6, iata_code: "CCU", icao_code: "VECC", name: "Netaji Subhas Chandra Bose International Airport", city: "Kolkata", state: "West Bengal", country: "India", latitude: 22.6547, longitude: 88.4467, elevation_ft: 16, timezone: "Asia/Kolkata", airport_type: "international", owner: null, operator: "AAI", terminal_count: 2, gate_count: null, runway_count: 2, runway_length_ft: 11900, runway_surface: null, website: null, wikipedia_url: null, created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: 7, iata_code: "COK", icao_code: "VOCI", name: "Cochin International Airport", city: "Kochi", state: "Kerala", country: "India", latitude: 9.9471, longitude: 76.2733, elevation_ft: 30, timezone: "Asia/Kolkata", airport_type: "international", owner: null, operator: "CIAL", terminal_count: 1, gate_count: null, runway_count: 2, runway_length_ft: 11154, runway_surface: null, website: null, wikipedia_url: null, created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: 8, iata_code: "GOI", icao_code: "VOGO", name: "Goa International Airport", city: "Goa", state: "Goa", country: "India", latitude: 15.3809, longitude: 73.8314, elevation_ft: 184, timezone: "Asia/Kolkata", airport_type: "international", owner: null, operator: "GMR", terminal_count: 1, gate_count: null, runway_count: 1, runway_length_ft: 11345, runway_surface: null, website: null, wikipedia_url: null, created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: 9, iata_code: "PNQ", icao_code: "VAPO", name: "Pune Airport", city: "Pune", state: "Maharashtra", country: "India", latitude: 18.5821, longitude: 73.9197, elevation_ft: 1942, timezone: "Asia/Kolkata", airport_type: "domestic", owner: null, operator: "AAI", terminal_count: 1, gate_count: null, runway_count: 1, runway_length_ft: 8465, runway_surface: null, website: null, wikipedia_url: null, created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: 10, iata_code: "JAI", icao_code: "VIJP", name: "Jaipur International Airport", city: "Jaipur", state: "Rajasthan", country: "India", latitude: 26.8242, longitude: 75.8122, elevation_ft: 1263, timezone: "Asia/Kolkata", airport_type: "international", owner: null, operator: "AAI", terminal_count: 1, gate_count: null, runway_count: 2, runway_length_ft: 11483, runway_surface: null, website: null, wikipedia_url: null, created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: 11, iata_code: "AMD", icao_code: "VAAH", name: "Sardar Vallabhbhai Patel International Airport", city: "Ahmedabad", state: "Gujarat", country: "India", latitude: 23.0773, longitude: 72.6347, elevation_ft: 189, timezone: "Asia/Kolkata", airport_type: "international", owner: null, operator: "Adani", terminal_count: 2, gate_count: null, runway_count: 2, runway_length_ft: 11811, runway_surface: null, website: null, wikipedia_url: null, created_at: "2024-01-01", updated_at: "2024-01-01" },
  { id: 12, iata_code: "LKO", icao_code: "VILK", name: "Chaudhary Charan Singh International Airport", city: "Lucknow", state: "Uttar Pradesh", country: "India", latitude: 26.7606, longitude: 80.8893, elevation_ft: 410, timezone: "Asia/Kolkata", airport_type: "international", owner: null, operator: "Adani", terminal_count: 2, gate_count: null, runway_count: 2, runway_length_ft: 11200, runway_surface: null, website: null, wikipedia_url: null, created_at: "2024-01-01", updated_at: "2024-01-01" },
];

// --- Airport legend for the hero ---
const AIRPORT_LEGEND = [
  { label: "International", color: "#007AFF" },
  { label: "Domestic", color: "#34C759" },
  { label: "Joint Use", color: "#FF9500" },
];

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

export default function Page() {
  const mapRef = useRef<HTMLDivElement>(null);
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

  const handleSelectAirport = useCallback((airport: any) => {
    setSelectedAirport(airport);
    smoothScrollToMap();
  }, []);

  return (
    <>
      {/* Map layer behind hero */}
      <div
        ref={mapRef}
        className="fixed inset-0 z-0"
        style={{
          opacity: Math.max(0, (progress - 0.55) / 0.45),
          transform: `scale(${1 + Math.max(0, (progress - 0.55) / 0.45) * 0.8})`,
          transformOrigin: "center center",
          willChange: "transform, opacity",
        }}
      >
        <IndiaMap
          airports={AIRPORTS as any}
          selectedAirportId={selectedAirport?.id}
          setTooltip={setTooltip as any}
        />
      </div>

      {/* Hero overlay */}
      <AirportHero
        progress={progress}
        airports={AIRPORTS as any}
        tooltip={tooltip}
        setTooltip={setTooltip as any}
        selectedAirportId={selectedAirport?.id}
      />

      {/* Scroll spacer for the reveal */}
      <div className="h-[400vh]" aria-hidden />

      {/* Section 1 — At a glance */}
      <section className="relative z-10 bg-white border-t border-black/[.06]">
        <div className="max-w-5xl mx-auto px-8 pt-20 pb-16">
          <div className="text-[13px] font-medium text-muted tracking-tight mb-2">
            01 · At a glance
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-ink tracking-tight leading-[1.1] mb-10">
            India&apos;s aviation network
          </h2>
          <FadeInOnView>
            <SummaryBar airports={AIRPORTS as any} />
          </FadeInOnView>
        </div>
      </section>

      {/* Section 2 — Airport rankings */}
      <section className="relative z-10 bg-bg border-t border-black/[.06]">
        <div className="max-w-5xl mx-auto px-8 py-20">
          <div className="text-[13px] font-medium text-muted tracking-tight mb-2">
            02 · Rankings
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-ink tracking-tight leading-[1.1] mb-10">
            Every airport we&apos;re tracking
          </h2>
          <FadeInOnView>
            <AirportTable
              airports={AIRPORTS as any}
            />
          </FadeInOnView>
        </div>
      </section>

      {/* Section 3 — Popular routes */}
      <section className="relative z-10 bg-white border-t border-black/[.06]">
        <div className="max-w-5xl mx-auto px-8 pt-20 pb-24">
          <div className="text-[13px] font-medium text-muted tracking-tight mb-2">
            03 · Connections
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-ink tracking-tight leading-[1.1] mb-10">
            Most traveled routes
          </h2>
          <FadeInOnView>
            <RouteOverview airports={AIRPORTS as any} routes={[]} />
          </FadeInOnView>
        </div>
      </section>

      {/* Section 4 — Statistics by state */}
      <section className="relative z-10 bg-bg border-t border-black/[.06]">
        <div className="max-w-5xl mx-auto px-8 pt-20 pb-24">
          <div className="text-[13px] font-medium text-muted tracking-tight mb-2">
            04 · State breakdown
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-ink tracking-tight leading-[1.1] mb-3">
            Airports by state
          </h2>
          <p className="text-[15px] text-muted leading-relaxed max-w-[42rem] mb-10">
            India has over 150 operational airports across 28 states and 8 union
            territories. The top 5 airports handle over 60% of all passenger
            traffic.
          </p>
          <FadeInOnView>
            <StatsOverview airports={AIRPORTS as any} />
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
              <span>{tooltip.airport.runway_count ?? "?"} runways</span>
              <span>{tooltip.airport.airport_type}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
