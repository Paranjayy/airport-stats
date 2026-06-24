"use client";

import { useState } from "react";
import { formatPassengers, formatCargo } from "@/lib/map-utils";

/* ------------------------------------------------------------------ */
/*  Props                                                               */
/* ------------------------------------------------------------------ */

interface SummaryBarProps {
  airports: Array<{
    annual_passengers?: number;
    annual_cargo_tonnes?: number;
    annual_movements?: number;
    domestic_passengers?: number;
    international_passengers?: number;
  }>;
}

/* ------------------------------------------------------------------ */
/*  Stat card                                                           */
/* ------------------------------------------------------------------ */

interface StatCardProps {
  label: string;
  value: string;
  sublabel?: string;
  color?: string;
  active?: boolean;
  onClick?: () => void;
}

function StatCard({
  label,
  value,
  sublabel,
  color,
  active,
  onClick,
}: StatCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        text-left rounded-xl border px-5 py-4 transition-all duration-200
        ${
          active
            ? "border-ink/15 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
            : "border-black/[.06] bg-bg hover:bg-white hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
        }
      `}
    >
      <div className="text-[13px] text-muted tracking-tight mb-1.5">
        {label}
      </div>
      <div className="text-2xl md:text-3xl font-semibold text-ink tracking-tight leading-none">
        {value}
      </div>
      {sublabel && (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
          {color && (
            <span
              className="inline-block w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: color }}
            />
          )}
          {sublabel}
        </div>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Summary bar                                                         */
/* ------------------------------------------------------------------ */

export default function SummaryBar({ airports }: SummaryBarProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const totalPassengers = airports.reduce((s, a) => s + (a.annual_passengers ?? 0), 0);
  const totalCargo = airports.reduce((s, a) => s + (a.annual_cargo_tonnes ?? 0), 0);
  const totalMovements = airports.reduce((s, a) => s + (a.annual_movements ?? 0), 0);

  const stats = [

    {
      key: "airports",
      label: "Airports",
      value: String(airports.length),
      sublabel: "International & domestic",
      color: "var(--color-airport-international)",
    },
    {
      key: "passengers",
      label: "Annual passengers",
      value: formatPassengers(totalPassengers),
      sublabel: "2023 total across network",
      color: "var(--color-airport-domestic)",
    },
    {
      key: "cargo",
      label: "Cargo volume",
      value: formatCargo(totalCargo),
      sublabel: "Freight & mail tonnage",
      color: "var(--color-airport-joint-use)",
    },
    {
      key: "movements",
      label: "Aircraft movements",
      value: formatPassengers(totalMovements),
      sublabel: "Takeoffs & landings",
      color: "var(--color-airport-custom)",
    },
    {
      key: "states",
      label: "States & UTs",
      value: "28",
      sublabel: "Covered across India",
      color: "var(--color-airport-defence)",
    },
  ];

  return (
    <div>
      {/* Stat cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.key}
            label={stat.label}
            value={stat.value}
            sublabel={stat.sublabel}
            color={stat.color}
            active={hovered === stat.key}
            onClick={() => setHovered(hovered === stat.key ? null : stat.key)}
          />
        ))}
      </div>

      {/* Passenger split bar */}
      <div className="mt-8">
        <div className="text-[13px] font-medium text-muted tracking-tight mb-3">
          Domestic vs. international split
        </div>
        <div className="flex h-8 rounded-full overflow-hidden">
          <div
            className="flex items-center justify-center text-sm font-semibold transition-opacity duration-200"
            style={{
              flexGrow: 85,
              flexBasis: 0,
              backgroundColor: "var(--color-airport-domestic)",
              color: "#1D1D1F",
              opacity: hovered && hovered !== "passengers" ? 0.35 : 1,
            }}
          >
            ~85%
          </div>
          <div
            className="flex items-center justify-center text-sm font-semibold transition-opacity duration-200"
            style={{
              flexGrow: 15,
              flexBasis: 0,
              backgroundColor: "var(--color-airport-international)",
              color: "#1D1D1F",
              opacity: hovered && hovered !== "passengers" ? 0.35 : 1,
            }}
          >
            ~15%
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-[3px]"
              style={{ backgroundColor: "var(--color-airport-domestic)" }}
            />
            Domestic (~85%)
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-[3px]"
              style={{ backgroundColor: "var(--color-airport-international)" }}
            />
            International (~15%)
          </div>
        </div>
      </div>
    </div>
  );
}
