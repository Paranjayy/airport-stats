"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  type ProjectionFunction,
} from "react-simple-maps";
import { indiaProjection } from "@/lib/projections";
import {
  NEUTRAL_STROKE,
  INK,
  AIRPORT_TYPE_COLOR,
  AIRPORT_DEFAULT_COLOR,
  airportDotRadius,
  formatPassengers,
  formatCargo,
  type AirportType,
  type SetGenericTooltip,
} from "@/lib/map-utils";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

export interface AirportData {
  id: number;
  iata_code: string;
  icao_code: string | null;
  name: string;
  city: string;
  state: string | null;
  country: string;
  latitude: number;
  longitude: number;
  elevation_ft: number | null;
  airport_type: string;
  runway_count: number | null;
  runway_length_ft: number | null;
  annual_passengers?: number;
  annual_cargo_tonnes?: number;
  annual_movements?: number;
  domestic_passengers?: number;
  international_passengers?: number;
}

/* ------------------------------------------------------------------ */
/*  Tooltip state                                                      */
/* ------------------------------------------------------------------ */

export interface AirportTooltip {
  x: number;
  y: number;
  airport: AirportData;
}

/* ------------------------------------------------------------------ */
/*  India ISO numeric code                                              */
/* ------------------------------------------------------------------ */

const INDIA_CODE = 356;

const WORLD_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/* ------------------------------------------------------------------ */
/*  Styles                                                              */
/* ------------------------------------------------------------------ */

const indiaProj = indiaProjection as unknown as ProjectionFunction;

/* ------------------------------------------------------------------ */
/*  Props                                                               */
/* ------------------------------------------------------------------ */

interface IndiaMapProps {
  airports: AirportData[];
  setTooltip: SetGenericTooltip<AirportTooltip>;
  onSelectAirport?: (airport: AirportData) => void;
  selectedAirportId?: number | null;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export default function IndiaMap({
  airports,
  setTooltip,
  onSelectAirport,
  selectedAirportId,
  className,
}: IndiaMapProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Pre-sort airports by passengers so the largest dots render on top.
  const sortedAirports = useMemo(
    () => [...airports].sort((a, b) => (a.annual_passengers ?? 0) - (b.annual_passengers ?? 0)),
    [airports],
  );

  return (
    <div
      className={`relative w-full h-full ${className ?? ""}`}
      onMouseMove={(e) =>
        setTooltip((current) =>
          current ? { ...current, x: e.clientX, y: e.clientY } : current,
        )
      }
      onMouseLeave={() => setTooltip(null)}
    >
      <ComposableMap
        width={960}
        height={560}
        projection={indiaProj}
        style={{
          width: "100%",
          height: "100%",
          shapeRendering: "geometricPrecision",
        }}
      >
        <Geographies geography={WORLD_URL}>
          {({ geographies }) =>
            geographies
              .filter((g) => parseInt(g.id, 10) === INDIA_CODE)
              .map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: "#E8E6E1",
                      stroke: NEUTRAL_STROKE,
                      strokeWidth: 1.2,
                      outline: "none",
                      cursor: "default",
                      transition: "fill 200ms",
                    },
                    hover: {
                      fill: "#E0DED8",
                      stroke: NEUTRAL_STROKE,
                      strokeWidth: 1.2,
                      outline: "none",
                    },
                    pressed: {
                      fill: "#E8E6E1",
                      stroke: NEUTRAL_STROKE,
                      strokeWidth: 1.2,
                      outline: "none",
                    },
                  }}
                />
              ))
          }
        </Geographies>

        {/* Airport markers */}
        {mounted && (
          <g shapeRendering="geometricPrecision">
            {sortedAirports.map((airport) => {
              let projected: [number, number] | null | undefined;
              try {
                projected = indiaProjection([
                  airport.longitude,
                  airport.latitude,
                ]);
              } catch {
                return null;
              }
              if (
                !projected ||
                !Array.isArray(projected) ||
                projected.length < 2
              ) {
                return null;
              }
              const [x, y] = projected;
              if (!Number.isFinite(x) || !Number.isFinite(y)) return null;

              const r = airportDotRadius(airport.annual_passengers ?? 0);
              const color =
                AIRPORT_TYPE_COLOR[airport.airport_type as AirportType] ??
                AIRPORT_DEFAULT_COLOR;
              const isSelected = selectedAirportId === airport.id;

              return (
                <g key={airport.id}>
                  {/* Halo */}
                  <circle
                    cx={x}
                    cy={y}
                    r={r + 2.5}
                    fill={color}
                    opacity={isSelected ? 0.3 : 0.15}
                    style={{ pointerEvents: "none" }}
                  />
                  {/* Body */}
                  <circle
                    cx={x}
                    cy={y}
                    r={r}
                    fill={color}
                    stroke="#FFFFFF"
                    strokeWidth={isSelected ? 2.5 : 1.2}
                    style={{
                      cursor: onSelectAirport ? "pointer" : "default",
                      pointerEvents: "all",
                      transition: "stroke-width 150ms, filter 150ms",
                      filter: isSelected
                        ? `drop-shadow(0 2px 8px ${color}66)`
                        : undefined,
                    }}
                    onMouseEnter={(e) =>
                      setTooltip({
                        x: e.clientX,
                        y: e.clientY,
                        airport,
                      })
                    }
                    onMouseMove={(e) =>
                      setTooltip({
                        x: e.clientX,
                        y: e.clientY,
                        airport,
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() => onSelectAirport?.(airport)}
                  />
                  {/* IATA code for large airports (≥ 20M pax) */}
                  {(airport.annual_passengers ?? 0) >= 20_000_000 && (
                    <text
                      x={x}
                      y={y - r - 4}
                      textAnchor="middle"
                      style={{
                        fontSize: "9px",
                        fontWeight: 600,
                        fontFamily: "inherit",
                        fill: INK,
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
          </g>
        )}
      </ComposableMap>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tooltip renderer — render outside the SVG so it sits on top.        */
/* ------------------------------------------------------------------ */

export function AirportTooltipCard({ tooltip }: { tooltip: AirportTooltip }) {
  const { airport, x, y } = tooltip;
  const color =
    AIRPORT_TYPE_COLOR[airport.airport_type as AirportType] ?? AIRPORT_DEFAULT_COLOR;
  const typeLabel =
    airport.airport_type.charAt(0).toUpperCase() + airport.airport_type.slice(1);

  return (
    <div
      className="fixed z-50 pointer-events-none animate-popup-enter"
      style={{
        left: x + 12,
        top: y - 8,
        transformOrigin: "top left",
        maxWidth: 320,
      }}
    >
      <div className="bg-white rounded-xl shadow-lg border border-black/[.06] px-4 py-3">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="inline-block w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="text-[13px] font-semibold text-ink tracking-tight">
            {airport.iata_code}
          </span>
          <span className="text-[11px] text-muted">{airport.name}</span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[12px]">
          <div className="text-muted">City</div>
          <div className="text-ink font-medium text-right">{airport.city}</div>
          <div className="text-muted">Passengers</div>
          <div className="text-ink font-medium text-right">
            {formatPassengers(airport.annual_passengers ?? 0)}
          </div>
          <div className="text-muted">Cargo</div>
          <div className="text-ink font-medium text-right">
            {formatCargo(airport.annual_cargo_tonnes ?? 0)}
          </div>
          <div className="text-muted">Type</div>
          <div className="text-right font-medium" style={{ color }}>
            {typeLabel}
          </div>
          {airport.runway_count && (
            <>
              <div className="text-muted">Runways</div>
              <div className="text-ink font-medium text-right">
                {airport.runway_count}
              </div>
            </>
          )}
        </div>

        {/* State tag */}
        <div className="mt-2 pt-2 border-t border-black/[.04] text-[11px] text-muted">
          {airport.state} · {airport.icao_code}
        </div>
      </div>
    </div>
  );
}
