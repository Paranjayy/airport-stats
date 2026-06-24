"use client";

import { useState, useMemo } from "react";
import { formatPassengers, formatCargo } from "@/lib/map-utils";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

interface AirportRow {
  iata: string;
  name: string;
  city: string;
  state: string;
  type: string;
  passengers: number;
  cargo: number;
  movements: number;
  domestic: number;
  international: number;
}

function toRow(a: any): AirportRow {
  return {
    iata: a.iata_code,
    name: a.name,
    city: a.city,
    state: a.state || '',
    type: a.airport_type || 'domestic',
    passengers: a.annual_passengers || 0,
    cargo: a.annual_cargo_tonnes || 0,
    movements: a.annual_movements || 0,
    domestic: a.domestic_passengers || 0,
    international: a.international_passengers || 0,
  };
}

interface AirportTableProps {
  airports: AirportRow[];
}

type SortKey = "passengers" | "cargo" | "movements" | "name" | "iata";
type SortDir = "asc" | "desc";

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

const TYPE_COLORS: Record<string, string> = {
  international: "var(--color-airport-international)",
  domestic: "var(--color-airport-domestic)",
  civil: "var(--color-airport-neutral)",
};

const TYPE_LABELS: Record<string, string> = {
  international: "International",
  domestic: "Domestic",
  civil: "Civil",
};

function BarChart({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="w-full h-1.5 rounded-full bg-black/[.04] overflow-hidden">
      <div
        className="h-full rounded-full bg-ink/15"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export default function AirportTable({ airports }: AirportTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("passengers");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filter, setFilter] = useState("");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "desc" ? "asc" : "desc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = useMemo(() => {
    let list = [...airports];

    // Filter
    if (filter) {
      const q = filter.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q) ||
          a.iata.toLowerCase().includes(q) ||
          a.state.toLowerCase().includes(q),
      );
    }

    // Sort
    list.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "passengers":
          cmp = a.passengers - b.passengers;
          break;
        case "cargo":
          cmp = a.cargo - b.cargo;
          break;
        case "movements":
          cmp = a.movements - b.movements;
          break;
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "iata":
          cmp = a.iata.localeCompare(b.iata);
          break;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });

    return list;
  }, [airports, sortKey, sortDir, filter]);

  const maxPassengers = Math.max(...airports.map((a) => a.passengers));

  const SortHeader = ({
    label,
    sortKeyName,
    className,
  }: {
    label: string;
    sortKeyName: SortKey;
    className?: string;
  }) => (
    <th
      className={`px-4 py-3 text-left text-[13px] font-medium text-muted tracking-tight cursor-pointer select-none hover:text-ink transition-colors ${className ?? ""}`}
      onClick={() => handleSort(sortKeyName)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {sortKey === sortKeyName && (
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            className={`text-muted ${sortDir === "asc" ? "rotate-180" : ""}`}
          >
            <path
              d="M5 2L8 6H2L5 2Z"
              fill="currentColor"
            />
          </svg>
        )}
      </span>
    </th>
  );

  return (
    <div>
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search airports by name, city, IATA code, or state…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-black/[.06] bg-bg px-4 py-2.5 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-ink/15 focus:bg-white transition-colors"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-8 px-8 md:mx-0 md:px-0">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-black/[.06]">
              <SortHeader label="Airport" sortKeyName="name" className="w-[30%]" />
              <SortHeader label="IATA" sortKeyName="iata" />
              <SortHeader label="City" sortKeyName="name" />
              <th className="px-4 py-3 text-left text-[13px] font-medium text-muted tracking-tight">
                Type
              </th>
              <SortHeader label="Passengers" sortKeyName="passengers" className="text-right" />
              <SortHeader label="Cargo" sortKeyName="cargo" className="text-right" />
              <th className="px-4 py-3 text-left text-[13px] font-medium text-muted tracking-tight">
                Volume
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((airport) => (
              <tr
                key={airport.iata}
                className="border-b border-black/[.04] hover:bg-bg/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-ink tracking-tight">
                    {airport.name}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-mono font-medium text-ink">
                    {airport.iata}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-muted">{airport.city}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor:
                          TYPE_COLORS[airport.type] || TYPE_COLORS.domestic,
                      }}
                    />
                    {TYPE_LABELS[airport.type] || airport.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-medium text-ink">
                    {formatPassengers(airport.passengers)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm text-muted">
                    {formatCargo(airport.cargo)}
                  </span>
                </td>
                <td className="px-4 py-3 w-24">
                  <BarChart
                    value={airport.passengers}
                    max={maxPassengers}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Result count */}
      <div className="mt-4 text-xs text-muted">
        Showing {sorted.length} of {airports.length} airports
        {filter && (
          <button
            onClick={() => setFilter("")}
            className="ml-2 underline decoration-muted/40 decoration-[0.5px] underline-offset-4 hover:text-ink transition-colors"
          >
            Clear search
          </button>
        )}
      </div>
    </div>
  );
}
