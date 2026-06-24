"use client";

import { useState, useMemo } from "react";
import type { IndianAirport as Airport } from "@/lib/all-airports";
import { formatPassengers, formatCargo } from "@/lib/map-utils";

type SortKey =
  | "passengers"
  | "cargo"
  | "name"
  | "iata";
type SortDir = "asc" | "desc";

const TYPE_COLORS: Record<string, string> = {
  international: "#007AFF",
  domestic: "#34C759",
  "joint-use": "#FF9500",
};

export default function AirportTable({ airports }: { airports: Airport[] }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("passengers");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const list = q
      ? airports.filter(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            a.city.toLowerCase().includes(q) ||
            a.iata.toLowerCase().includes(q) ||
            a.state.toLowerCase().includes(q),
        )
      : airports;
    return [...list].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string")
        return sortDir === "asc"
          ? av.localeCompare(bv as string)
          : (bv as string).localeCompare(av);
      return sortDir === "asc"
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number);
    });
  }, [airports, search, sortKey, sortDir]);

  const maxPax = Math.max(...airports.map((a) => a.passengers));

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <th
      className="text-left text-[11px] font-medium text-muted uppercase tracking-wider px-3 py-2 cursor-pointer select-none"
      onClick={() => toggleSort(field)}
    >
      {label} {sortKey === field ? (sortDir === "desc" ? "↓" : "↑") : ""}
    </th>
  );

  return (
    <div className="rounded-xl border border-black/[.06] bg-white overflow-hidden">
      {/* Search */}
      <div className="px-4 py-3 border-b border-black/[.06]">
        <input
          type="text"
          placeholder="Search airports by name, city, IATA code, or state…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm bg-transparent placeholder:text-muted/50 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/[.06]">
              <SortHeader label="Airport" field="name" />
              <th className="text-left text-[11px] font-medium text-muted uppercase tracking-wider px-3 py-2">
                IATA
              </th>
              <th className="text-left text-[11px] font-medium text-muted uppercase tracking-wider px-3 py-2">
                City
              </th>
              <th className="text-left text-[11px] font-medium text-muted uppercase tracking-wider px-3 py-2">
                Type
              </th>
              <SortHeader label="Passengers" field="passengers" />
              <SortHeader label="Cargo" field="cargo" />
              <th className="text-left text-[11px] font-medium text-muted uppercase tracking-wider px-3 py-2">
                Volume
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr
                key={a.iata}
                className="border-b border-black/[.04] last:border-0 hover:bg-bg/50 transition-colors"
              >
                <td className="px-3 py-3 font-medium text-ink">{a.name}</td>
                <td className="px-3 py-3 font-mono text-[13px] text-muted">
                  {a.iata}
                </td>
                <td className="px-3 py-3 text-muted">{a.city}</td>
                <td className="px-3 py-3">
                  <span className="flex items-center gap-1.5 text-xs text-muted capitalize">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          TYPE_COLORS[a.type] || "#8E8E93",
                      }}
                    />
                    {a.type}
                  </span>
                </td>
                <td className="px-3 py-3 font-medium text-ink tabular-nums">
                  {formatPassengers(a.passengers)}
                </td>
                <td className="px-3 py-3 text-muted tabular-nums">
                  {formatCargo(a.cargo)}
                </td>
                <td className="px-3 py-3 w-32">
                  <div className="h-1.5 rounded-full bg-ink/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-ink/20"
                      style={{
                        width: `${(a.passengers / maxPax) * 100}%`,
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-2 text-[11px] text-muted border-t border-black/[.06]">
        Showing {filtered.length} of {airports.length} airports
      </div>
    </div>
  );
}
