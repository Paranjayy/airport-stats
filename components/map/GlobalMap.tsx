"use client";

import { useState, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { geoMercator } from "d3-geo";
import { GLOBAL_AIRPORTS, COUNTRY_COMPARISON } from "@/lib/global-airports";

const WORLD_GEO = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const worldProjection = geoMercator()
  .scale(150)
  .translate([480, 300]);

const REGION_COLORS: Record<string, string> = {
  "Asia": "#007AFF",
  "Europe": "#34C759",
  "North America": "#FF9500",
  "Middle East": "#AF52DE",
  "Southeast Asia": "#FF3B30",
  "Africa": "#8E8E93",
  "South America": "#5856D6",
  "Oceania": "#00C7BE",
};

function formatNum(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return String(n);
}

export default function GlobalMap() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [hoveredAirport, setHoveredAirport] = useState<any>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const filteredAirports = useMemo(() => {
    if (!selectedRegion) return GLOBAL_AIRPORTS;
    return GLOBAL_AIRPORTS.filter(a => a.region === selectedRegion);
  }, [selectedRegion]);

  const regions = [...new Set(GLOBAL_AIRPORTS.map(a => a.region))];

  return (
    <div className="space-y-6">
      {/* Region filters */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSelectedRegion(null)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!selectedRegion ? "bg-ink text-white" : "bg-bg text-muted hover:text-ink border border-black/[.06]"}`}>
          All ({GLOBAL_AIRPORTS.length})
        </button>
        {regions.map(r => (
          <button key={r} onClick={() => setSelectedRegion(r)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${selectedRegion === r ? "bg-ink text-white" : "bg-bg text-muted hover:text-ink border border-black/[.06]"}`}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: REGION_COLORS[r] }} />
            {r}
          </button>
        ))}
      </div>

      {/* World map */}
      <div className="rounded-xl border border-black/[.06] bg-white overflow-hidden relative">
        <ComposableMap
          width={960}
          height={500}
          projection={worldProjection as any}
          style={{ width: "100%", height: "auto" }}
          onMouseMove={(e: any) => setTooltipPos({ x: e.clientX, y: e.clientY })}
        >
          <Geographies geography={WORLD_GEO}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { fill: "#F5F5F5", stroke: "#E0E0E0", strokeWidth: 0.5, outline: "none" },
                    hover: { fill: "#EEEEEE", stroke: "#D0D0D0", strokeWidth: 0.5, outline: "none" },
                    pressed: { fill: "#E0E0E0", stroke: "#D0D0D0", strokeWidth: 0.5, outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Airport markers */}
          {filteredAirports.map((airport) => {
            const pos = worldProjection([airport.lon, airport.lat]);
            if (!pos) return null;
            const [x, y] = pos;
            const color = REGION_COLORS[airport.region] || "#8E8E93";
            const size = airport.type === "hub" ? 6 : airport.type === "major" ? 4 : 3;

            return (
              <g key={airport.iata}>
                <circle
                  cx={x}
                  cy={y}
                  r={size}
                  fill={color}
                  stroke="white"
                  strokeWidth={1}
                  style={{ cursor: "pointer", transition: "all 150ms ease" }}
                  onMouseEnter={(e: any) => {
                    setHoveredAirport(airport);
                    setTooltipPos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => setHoveredAirport(null)}
                />
              </g>
            );
          })}
        </ComposableMap>

        {/* Tooltip */}
        {hoveredAirport && (
          <div className="fixed z-50 pointer-events-none" style={{ left: tooltipPos.x + 12, top: tooltipPos.y - 10 }}>
            <div className="bg-white rounded-xl shadow-lg border border-black/[.08] px-4 py-3 max-w-[280px]">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-semibold text-ink">{hoveredAirport.iata}</span>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: REGION_COLORS[hoveredAirport.region] }} />
                <span className="text-[10px] text-muted">{hoveredAirport.region}</span>
              </div>
              <div className="text-sm font-semibold text-ink leading-tight">{hoveredAirport.name}</div>
              <div className="text-xs text-muted mt-1">{hoveredAirport.city}, {hoveredAirport.country}</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs">
                <span className="text-muted">Passengers</span>
                <span className="text-ink font-medium text-right">{formatNum(hoveredAirport.passengers)}</span>
                <span className="text-muted">Cargo</span>
                <span className="text-ink font-medium text-right">{formatNum(hoveredAirport.cargo)}t</span>
                <span className="text-muted">Runways</span>
                <span className="text-ink font-medium text-right">{hoveredAirport.runways}</span>
                <span className="text-muted">Type</span>
                <span className="text-ink font-medium text-right capitalize">{hoveredAirport.type}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Country comparison table */}
      <div className="rounded-xl border border-black/[.06] bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-black/[.06]">
          <h3 className="text-sm font-semibold text-ink">Country Comparison — 2023</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-black/[.06]">
                <th className="text-left text-muted py-3 px-5">Country</th>
                <th className="text-right text-muted py-3 px-3">Airports</th>
                <th className="text-right text-muted py-3 px-3">Passengers</th>
                <th className="text-right text-muted py-3 px-3">Cargo</th>
                <th className="text-right text-muted py-3 px-3">Airlines</th>
                <th className="text-right text-muted py-3 px-3">Fleet</th>
                <th className="text-right text-muted py-3 px-3">Growth</th>
              </tr>
            </thead>
            <tbody>
              {COUNTRY_COMPARISON.sort((a, b) => b.annualPassengers - a.annualPassengers).map((c) => (
                <tr key={c.country} className={`border-b border-black/[.04] ${c.country === "India" ? "bg-blue-50/50" : ""}`}>
                  <td className="py-3 px-5 font-medium text-ink">{c.flag} {c.country}</td>
                  <td className="py-3 px-3 text-right text-muted tabular-nums">{c.totalAirports.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right text-ink font-medium tabular-nums">{formatNum(c.annualPassengers)}</td>
                  <td className="py-3 px-3 text-right text-muted tabular-nums">{formatNum(c.annualCargo)}t</td>
                  <td className="py-3 px-3 text-right text-muted tabular-nums">{c.airlines}</td>
                  <td className="py-3 px-3 text-right text-muted tabular-nums">{c.fleet.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right text-green-600 tabular-nums">+{c.growthRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
