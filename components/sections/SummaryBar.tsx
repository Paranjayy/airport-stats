"use client";

import { useState } from "react";
import type { Airport } from "@/lib/database";
import { formatPassengers, formatCargo } from "@/lib/map-utils";

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
      className={`text-left rounded-xl border px-5 py-4 transition-all duration-200 ${
        active
          ? "border-ink/15 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
          : "border-black/[.06] bg-bg hover:bg-white hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
      }`}
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

export default function SummaryBar({ airports }: { airports: Airport[] }) {
  const [hovered, setHovered] = useState<string | null>(null);

  const totalPassengers = airports.reduce((s, a) => s + a.annual_passengers, 0);
  const totalCargo = airports.reduce((s, a) => s + a.annual_cargo_tonnes, 0);
  const totalMovements = airports.reduce((s, a) => s + a.annual_movements, 0);
  const totalDomestic = airports.reduce((s, a) => s + a.domestic_passengers, 0);
  const totalInternational = airports.reduce(
    (s, a) => s + a.international_passengers,
    0,
  );

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
      value: String(new Set(airports.map((a) => a.state)).size),
      sublabel: "Covered across India",
      color: "var(--color-airport-defence)",
    },
  ];

  const domesticPct =
    totalPassengers > 0
      ? Math.round((totalDomestic / totalPassengers) * 100)
      : 85;
  const internationalPct = 100 - domesticPct;

  return (
    <div>
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {stats.map((s) => (
          <StatCard
            key={s.key}
            label={s.label}
            value={s.value}
            sublabel={s.sublabel}
            color={s.color}
            active={hovered === s.key}
            onClick={() => setHovered(hovered === s.key ? null : s.key)}
          />
        ))}
      </div>

      {/* Domestic vs International split */}
      <div className="mt-8">
        <div className="text-[13px] text-muted tracking-tight mb-3">
          Domestic vs. international split
        </div>
        <div className="relative h-8 rounded-full overflow-hidden flex">
          <div
            className="bg-[var(--color-airport-domestic)] flex items-center justify-center text-white text-xs font-medium transition-all duration-500"
            style={{ width: `${domesticPct}%` }}
          >
            ~{domesticPct}%
          </div>
          <div
            className="bg-[var(--color-airport-international)] flex items-center justify-center text-white text-xs font-medium transition-all duration-500"
            style={{ width: `${internationalPct}%` }}
          >
            ~{internationalPct}%
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--color-airport-domestic)]" />
            Domestic (~{domesticPct}%)
          </span>
          <span className="flex items-center gap-1.5">
            International (~{internationalPct}%)
            <span className="w-2 h-2 rounded-full bg-[var(--color-airport-international)]" />
          </span>
        </div>
      </div>
    </div>
  );
}
