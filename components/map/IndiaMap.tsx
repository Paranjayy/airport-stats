"use client";

import { useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { indiaProjection } from "@/lib/projections";
import {
  AIRPORT_TYPE_COLOR,
  AIRPORT_DEFAULT_COLOR,
  airportDotRadius,
  type SetGenericTooltip,
} from "@/lib/map-utils";
import type { Airport } from "@/lib/database";

const INDIA_GEO = "/india-states.json";

interface AirportTooltip {
  x: number;
  y: number;
  airport: Airport;
}

interface IndiaMapProps {
  airports: Airport[];
  selectedAirportId: number | null;
  onSelectAirport?: (airport: Airport) => void;
  setTooltip: SetGenericTooltip<AirportTooltip>;
}

export default function IndiaMap({
  airports,
  selectedAirportId,
  onSelectAirport,
  setTooltip,
}: IndiaMapProps) {
  const sorted = useMemo(
    () =>
      [...airports].sort((a, b) => a.annual_passengers - b.annual_passengers),
    [airports],
  );

  return (
    <div
      className="relative w-full h-full bg-[#FAFAF8]"
      onMouseMove={(e) =>
        setTooltip((c) => (c ? { ...c, x: e.clientX, y: e.clientY } : c))
      }
      onMouseLeave={() => setTooltip(null)}
    >
      <ComposableMap
        width={960}
        height={600}
        projection={indiaProjection as any}
        style={{
          width: "100%",
          height: "100%",
          shapeRendering: "geometricPrecision",
        }}
      >
        <Geographies geography={INDIA_GEO}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: {
                    fill: "#ECECEC",
                    stroke: "#D2D2D2",
                    strokeWidth: 0.5,
                    outline: "none",
                  },
                  hover: {
                    fill: "#E0E0E0",
                    stroke: "#D2D2D2",
                    strokeWidth: 0.5,
                    outline: "none",
                  },
                  pressed: {
                    fill: "#D8D8D8",
                    stroke: "#D2D2D2",
                    strokeWidth: 0.5,
                    outline: "none",
                  },
                }}
              />
            ))
          }
        </Geographies>

        {/* Airport markers */}
        {sorted.map((airport) => {
          const pos = indiaProjection([airport.longitude, airport.latitude]);
          if (!pos) return null;
          const [x, y] = pos;
          const r = airportDotRadius(airport.annual_passengers);
          const color =
            AIRPORT_TYPE_COLOR[
              airport.airport_type as keyof typeof AIRPORT_TYPE_COLOR
            ] ?? AIRPORT_DEFAULT_COLOR;
          const isSelected = selectedAirportId === airport.id;
          const showLabel = airport.annual_passengers >= 20_000_000;

          return (
            <g key={airport.iata_code}>
              {/* Glow for selected */}
              {isSelected && (
                <circle cx={x} cy={y} r={r + 6} fill={color} opacity={0.15} />
              )}
              {/* Main dot */}
              <circle
                cx={x}
                cy={y}
                r={r}
                fill={isSelected ? color : color}
                stroke="white"
                strokeWidth={isSelected ? 2.5 : 1.5}
                style={{ cursor: "pointer", transition: "all 150ms ease" }}
                onMouseEnter={(e: any) =>
                  setTooltip({ x: e.clientX, y: e.clientY, airport })
                }
                onMouseLeave={() => setTooltip(null)}
                onClick={() => onSelectAirport?.(airport)}
              />
              {/* IATA label for major airports */}
              {showLabel && (
                <text
                  x={x}
                  y={y - r - 5}
                  textAnchor="middle"
                  style={{
                    fontSize: "9px",
                    fontWeight: 600,
                    fontFamily: "inherit",
                    fill: "#1D1D1F",
                    pointerEvents: "none",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {airport.iata_code}
                </text>
              )}
            </g>
          );
        })}
      </ComposableMap>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg border border-black/[.06] px-3 py-2 text-[11px] text-muted">
        <div className="font-medium text-ink mb-1">Airport type</div>
        {Object.entries(AIRPORT_TYPE_COLOR).map(([type, c]) => (
          <div key={type} className="flex items-center gap-1.5 capitalize">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: c }}
            />
            {type}
          </div>
        ))}
      </div>

      {/* Size legend */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg border border-black/[.06] px-3 py-2 text-[11px] text-muted">
        <div className="font-medium text-ink mb-1">Passengers</div>
        {[
          { label: "< 5M", r: 4 },
          { label: "5M – 20M", r: 7 },
          { label: "20M – 50M", r: 11 },
          { label: "50M+", r: 16 },
        ].map((b) => (
          <div key={b.label} className="flex items-center gap-2">
            <svg width={b.r * 2 + 4} height={b.r * 2 + 4}>
              <circle
                cx={b.r + 2}
                cy={b.r + 2}
                r={b.r}
                fill="#8E8E93"
                opacity={0.4}
              />
            </svg>
            {b.label}
          </div>
        ))}
      </div>
    </div>
  );
}
