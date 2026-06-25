"use client";
import { downloadCSV } from "@/lib/export";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DEDUPED_FINAL as AIRPORTS, STATS_FINAL as FULL_STATS } from "@/lib/all-airports";
import { INDIAN_AIRLINES, AIRPORT_ECONOMICS } from "@/lib/aviation-data";
import type { IndianAirport } from "@/lib/all-airports";

type ViewMode = "table" | "grid" | "compact";
type SortKey = keyof IndianAirport;
type SortDir = "asc" | "desc";

const TYPE_COLORS: Record<string, string> = {
  international: "#007AFF",
  domestic: "#34C759",
  "joint-use": "#FF9500",
  customs: "#AF52DE",
  defence: "#FF3B30",
  private: "#8E8E93",
};

function formatNum(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return String(n);
}

export default function DatabasePage() {
  const [view, setView] = useState<ViewMode>("table");
  const [sortKey, setSortKey] = useState<SortKey>("passengers");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterState, setFilterState] = useState<string>("all");
  const [filterMinPax, setFilterMinPax] = useState<number>(0);
  const [selected, setSelected] = useState<IndianAirport | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [columns, setColumns] = useState<string[]>(["iata", "name", "city", "state", "type", "passengers", "cargo", "runways", "avgDailyFlights"]);

  const allStates = useMemo(() => [...new Set(AIRPORTS.map(a => a.state))].sort(), []);
  const allTypes = [...new Set(AIRPORTS.map(a => a.type))].sort();

  const filtered = useMemo(() => {
    let list = [...AIRPORTS];

    // Search
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.iata.toLowerCase().includes(q) ||
        a.icao.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.state.toLowerCase().includes(q) ||
        a.operator.toLowerCase().includes(q) ||
        a.airlines.some(l => l.toLowerCase().includes(q)) ||
        a.hubFor.some(h => h.toLowerCase().includes(q)) ||
        a.notables.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (filterType !== "all") list = list.filter(a => a.type === filterType);

    // State filter
    if (filterState !== "all") list = list.filter(a => a.state === filterState);

    // Min passengers
    if (filterMinPax > 0) list = list.filter(a => a.passengers >= filterMinPax);

    // Sort
    list.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
      if (typeof av === "boolean") return sortDir === "asc" ? (av ? 1 : 0) - (bv ? 1 : 0) : (bv ? 1 : 0) - (av ? 1 : 0);
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });

    return list;
  }, [search, filterType, filterState, filterMinPax, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const hasActiveFilters = search || filterType !== "all" || filterState !== "all" || filterMinPax > 0;

  const exportCSV = () => {
    const exportData = filtered.map(a => ({
      IATA: a.iata,
      ICAO: a.icao,
      Name: a.name,
      City: a.city,
      State: a.state,
      Type: a.type,
      Passengers: a.passengers,
      Cargo: a.cargo,
      Movements: a.movements,
      Runways: a.runways,
      "Runway Length (ft)": a.longestRunwayFt,
      Elevation: a.elevationFt,
      Terminals: a.terminals,
      "Parking Bays": a.parkingBays,
      "Daily Flights": a.avgDailyFlights,
      "Intl %": a.internationalShare,
      "Cargo %": a.cargoShare,
      Operator: a.operator,
      Opened: a.opened,
      Airlines: a.airlines.join("; "),
      "Hub For": a.hubFor.join("; "),
      Notables: a.notables,
    }));
    downloadCSV(exportData, `airport-stats-${filtered.length}-airports.csv`);
  };

  const toggleColumn = (col: string) => {
    setColumns(prev => prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]);
  };

  const availableColumns = [
    { key: "iata", label: "IATA" },
    { key: "icao", label: "ICAO" },
    { key: "name", label: "Name" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "type", label: "Type" },
    { key: "passengers", label: "Passengers" },
    { key: "cargo", label: "Cargo" },
    { key: "movements", label: "Movements" },
    { key: "runways", label: "Runways" },
    { key: "longestRunwayFt", label: "Runway Length" },
    { key: "elevationFt", label: "Elevation" },
    { key: "terminals", label: "Terminals" },
    { key: "parkingBays", label: "Parking Bays" },
    { key: "avgDailyFlights", label: "Daily Flights" },
    { key: "internationalShare", label: "Intl %" },
    { key: "opened", label: "Opened" },
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="border-b border-black/[.06] bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="text-sm text-muted hover:text-ink transition-colors">← Back</Link>
            <div>
              <h1 className="text-2xl font-semibold text-ink tracking-tight">Airport Database</h1>
              <p className="text-sm text-muted mt-1">{filtered.length} airports · {FULL_STATS.statesCovered} states · {formatNum(FULL_STATS.totalPassengers)} passengers</p>
            </div>
          </div>

          {/* Search + View Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                placeholder="Search by name, IATA, ICAO, city, state, airline, operator..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-bg border border-black/[.06] rounded-lg text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-ink/15"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>

            {/* View toggle */}
            <div className="flex rounded-lg border border-black/[.06] overflow-hidden">
              {(["table", "grid", "compact"] as const).map(v => (
                <button key={v} onClick={() => setView(v)} className={`px-3 py-2 text-xs font-medium capitalize transition-colors ${view === v ? "bg-ink text-white" : "bg-bg text-muted hover:text-ink"}`}>
                  {v}
                </button>
              ))}
            </div>

            {/* Filter toggle */}
            <button onClick={() => setShowFilters(!showFilters)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${showFilters ? "bg-ink text-white" : "bg-bg text-muted hover:text-ink border border-black/[.06] flex items-center gap-1.5"}`}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              Filters {hasActiveFilters && `(${[search, filterType !== "all", filterState !== "all", filterMinPax > 0].filter(Boolean).length})`}
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="border-b border-black/[.06] bg-white">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Type */}
              <div>
                <label className="text-[11px] font-medium text-muted uppercase tracking-wider block mb-1.5">Type</label>
                <select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-full px-3 py-2 bg-bg border border-black/[.06] rounded-lg text-sm text-ink focus:outline-none focus:border-ink/15">
                  <option value="all">All types</option>
                  {allTypes.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                </select>
              </div>

              {/* State */}
              <div>
                <label className="text-[11px] font-medium text-muted uppercase tracking-wider block mb-1.5">State</label>
                <select value={filterState} onChange={e => setFilterState(e.target.value)} className="w-full px-3 py-2 bg-bg border border-black/[.06] rounded-lg text-sm text-ink focus:outline-none focus:border-ink/15">
                  <option value="all">All states</option>
                  {allStates.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Min passengers */}
              <div>
                <label className="text-[11px] font-medium text-muted uppercase tracking-wider block mb-1.5">Min passengers</label>
                <select value={filterMinPax} onChange={e => setFilterMinPax(Number(e.target.value))} className="w-full px-3 py-2 bg-bg border border-black/[.06] rounded-lg text-sm text-ink focus:outline-none focus:border-ink/15">
                  <option value={0}>Any</option>
                  <option value={500000}>500K+</option>
                  <option value={1000000}>1M+</option>
                  <option value={5000000}>5M+</option>
                  <option value={10000000}>10M+</option>
                  <option value={20000000}>20M+</option>
                  <option value={50000000}>50M+</option>
                </select>
              </div>

              {/* Column picker */}
              <div>
                <label className="text-[11px] font-medium text-muted uppercase tracking-wider block mb-1.5">Columns</label>
                <div className="flex flex-wrap gap-1">
                  {availableColumns.slice(0, 6).map(c => (
                    <button key={c.key} onClick={() => toggleColumn(c.key)} className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${columns.includes(c.key) ? "bg-ink text-white" : "bg-bg text-muted"}`}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-3 flex items-center gap-2">
                <button onClick={() => { setSearch(""); setFilterType("all"); setFilterState("all"); setFilterMinPax(0); }} className="text-xs text-muted hover:text-ink underline transition-colors">Clear all filters</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { label: "Airports", value: String(filtered.length) },
            { label: "States", value: String(new Set(filtered.map(a => a.state)).size) },
            { label: "Passengers", value: formatNum(filtered.reduce((s, a) => s + a.passengers, 0)) },
            { label: "Cargo", value: formatNum(filtered.reduce((s, a) => s + a.cargo, 0)) },
            { label: "Daily Flights", value: formatNum(filtered.reduce((s, a) => s + a.avgDailyFlights, 0)) },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-black/[.06] px-4 py-3">
              <div className="text-[11px] text-muted">{s.label}</div>
              <div className="text-lg font-semibold text-ink tabular-nums">{s.value}</div>
            </div>
          ))}
        </div>

        {/* TABLE VIEW */}
        {view === "table" && (
          <div className="rounded-xl border border-black/[.06] bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/[.06]">
                    {columns.map(col => {
                      const c = availableColumns.find(x => x.key === col);
                      if (!c) return null;
                      return (
                        <th key={col} onClick={() => toggleSort(col as SortKey)} className="text-left text-[11px] font-medium text-muted uppercase tracking-wider px-3 py-2.5 cursor-pointer select-none hover:text-ink transition-colors whitespace-nowrap">
                          {c.label} {sortKey === col ? (sortDir === "desc" ? "↓" : "↑") : ""}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(a => (
                    <tr key={a.iata} onClick={() => setSelected(selected?.iata === a.iata ? null : a)} className={`border-b border-black/[.04] last:border-0 cursor-pointer transition-colors ${selected?.iata === a.iata ? "bg-ink/[.03]" : "hover:bg-bg/50"}`}>
                      {columns.map(col => (
                        <td key={col} className="px-3 py-2.5 whitespace-nowrap">
                          {col === "iata" && <span className="font-mono font-medium text-ink">{a.iata}</span>}
                          {col === "icao" && <span className="font-mono text-muted text-xs">{a.icao}</span>}
                          {col === "name" && <span className="text-ink truncate max-w-[200px] block">{a.name}</span>}
                          {col === "city" && <span className="text-muted">{a.city}</span>}
                          {col === "state" && <span className="text-muted">{a.state}</span>}
                          {col === "type" && (
                            <span className="flex items-center gap-1.5 text-xs capitalize">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: TYPE_COLORS[a.type] || "#8E8E93" }} />
                              {a.type}
                            </span>
                          )}
                          {col === "passengers" && <span className="font-medium text-ink tabular-nums">{formatNum(a.passengers)}</span>}
                          {col === "cargo" && <span className="text-muted tabular-nums">{formatNum(a.cargo)}t</span>}
                          {col === "movements" && <span className="text-muted tabular-nums">{formatNum(a.movements)}</span>}
                          {col === "runways" && <span className="text-ink tabular-nums">{a.runways}</span>}
                          {col === "longestRunwayFt" && <span className="text-muted tabular-nums">{a.longestRunwayFt.toLocaleString()} ft</span>}
                          {col === "elevationFt" && <span className="text-muted tabular-nums">{a.elevationFt.toLocaleString()} ft</span>}
                          {col === "terminals" && <span className="text-ink tabular-nums">{a.terminals}</span>}
                          {col === "parkingBays" && <span className="text-muted tabular-nums">{a.parkingBays}</span>}
                          {col === "avgDailyFlights" && <span className="text-ink tabular-nums">~{a.avgDailyFlights}</span>}
                          {col === "internationalShare" && <span className="text-muted tabular-nums">{a.internationalShare}%</span>}
                          {col === "opened" && <span className="text-muted">{a.opened}</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2.5 text-[11px] text-muted border-t border-black/[.06]">
              {filtered.length} airports · Click row for details
            </div>
          </div>
        )}

        {/* GRID VIEW */}
        {view === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(a => (
              <div key={a.iata} onClick={() => setSelected(selected?.iata === a.iata ? null : a)} className={`rounded-xl border bg-white p-4 cursor-pointer transition-all hover:shadow-md ${selected?.iata === a.iata ? "border-ink/15 shadow-md" : "border-black/[.06]"}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-ink">{a.iata}</span>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: TYPE_COLORS[a.type] }} />
                      <span className="text-[10px] text-muted capitalize">{a.type}</span>
                    </div>
                    <div className="text-xs text-muted mt-0.5 truncate max-w-[250px]">{a.name}</div>
                  </div>
                  <span className="text-[10px] text-muted font-mono">{a.icao}</span>
                </div>
                <div className="text-xs text-muted mb-2">{a.city}, {a.state}</div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-bg rounded-lg px-2 py-1.5">
                    <div className="text-xs font-medium text-ink tabular-nums">{formatNum(a.passengers)}</div>
                    <div className="text-[10px] text-muted">pax</div>
                  </div>
                  <div className="bg-bg rounded-lg px-2 py-1.5">
                    <div className="text-xs font-medium text-ink tabular-nums">{formatNum(a.cargo)}t</div>
                    <div className="text-[10px] text-muted">cargo</div>
                  </div>
                  <div className="bg-bg rounded-lg px-2 py-1.5">
                    <div className="text-xs font-medium text-ink tabular-nums">~{a.avgDailyFlights}</div>
                    <div className="text-[10px] text-muted">flights/day</div>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {a.airlines.slice(0, 3).map(l => (
                    <span key={l} className="px-1.5 py-0.5 bg-bg rounded text-[10px] text-muted">{l}</span>
                  ))}
                  {a.airlines.length > 3 && <span className="px-1.5 py-0.5 bg-bg rounded text-[10px] text-muted">+{a.airlines.length - 3}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* COMPACT VIEW */}
        {view === "compact" && (
          <div className="rounded-xl border border-black/[.06] bg-white overflow-hidden">
            <div className="divide-y divide-black/[.04]">
              {filtered.map(a => (
                <div key={a.iata} onClick={() => setSelected(selected?.iata === a.iata ? null : a)} className={`flex items-center gap-4 px-4 py-2.5 cursor-pointer transition-colors ${selected?.iata === a.iata ? "bg-ink/[.03]" : "hover:bg-bg/50"}`}>
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: TYPE_COLORS[a.type] }} />
                  <span className="font-mono font-medium text-ink w-10">{a.iata}</span>
                  <span className="flex-1 text-sm text-ink truncate">{a.name}</span>
                  <span className="text-xs text-muted w-24 truncate">{a.city}</span>
                  <span className="text-xs text-muted w-20 truncate hidden md:block">{a.state}</span>
                  <span className="text-xs font-medium text-ink tabular-nums w-16 text-right">{formatNum(a.passengers)}</span>
                  <span className="text-xs text-muted tabular-nums w-12 text-right hidden md:block">{formatNum(a.cargo)}t</span>
                  <span className="text-xs text-ink tabular-nums w-16 text-right">~{a.avgDailyFlights}</span>
                </div>
              ))}
            </div>
            <div className="px-4 py-2 text-[11px] text-muted border-t border-black/[.06]">
              {filtered.length} airports · Compact view
            </div>
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🛫</div>
            <div className="text-sm text-muted">No airports match your filters</div>
            <button onClick={() => { setSearch(""); setFilterType("all"); setFilterState("all"); setFilterMinPax(0); }} className="mt-3 text-xs text-ink underline">Clear filters</button>
          </div>
        )}
      </div>

      {/* DETAIL PANEL */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl animate-slide-in" onClick={e => e.stopPropagation()}>
            {/* Close button */}
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-muted hover:text-ink z-10">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Header */}
            <div className="p-6 border-b border-black/[.06]">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: TYPE_COLORS[selected.type] }} />
                <span className="font-mono text-lg font-semibold text-ink">{selected.iata}</span>
                <span className="font-mono text-sm text-muted">{selected.icao}</span>
                <span className="text-xs text-muted capitalize px-2 py-0.5 rounded bg-bg">{selected.type}</span>
              </div>
              <h2 className="text-xl font-semibold text-ink">{selected.name}</h2>
              <p className="text-sm text-muted mt-1">{selected.city}, {selected.state}</p>
            </div>

            {/* Quick Stats */}
            <div className="p-6 border-b border-black/[.06]">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Passengers", value: formatNum(selected.passengers), sub: "annual" },
                  { label: "Cargo", value: `${formatNum(selected.cargo)}t`, sub: "annual" },
                  { label: "Daily Flights", value: `~${selected.avgDailyFlights}`, sub: "average" },
                  { label: "Runways", value: String(selected.runways), sub: `longest ${selected.longestRunwayFt.toLocaleString()} ft` },
                  { label: "Terminals", value: String(selected.terminals), sub: `${selected.parkingBays} parking bays` },
                  { label: "Elevation", value: `${selected.elevationFt.toLocaleString()} ft`, sub: "above sea level" },
                ].map(s => (
                  <div key={s.label} className="text-center p-2 rounded-lg bg-bg">
                    <div className="text-sm font-semibold text-ink">{s.value}</div>
                    <div className="text-[10px] text-muted">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="p-6 border-b border-black/[.06] space-y-4">
              <h3 className="text-xs font-medium text-muted uppercase tracking-wider">Details</h3>
              {[
                { label: "Operator", value: selected.operator },
                { label: "Opened", value: String(selected.opened) },
                { label: "Fuel Type", value: selected.fuelType },
                { label: "International Share", value: `${selected.internationalShare}%` },
                { label: "Cargo Share", value: `${selected.cargoShare}%` },
              ].map(d => (
                <div key={d.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted">{d.label}</span>
                  <span className="text-ink font-medium">{d.value}</span>
                </div>
              ))}
            </div>

            {/* Airlines */}
            <div className="p-6 border-b border-black/[.06]">
              <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Airlines Operating</h3>
              <div className="flex flex-wrap gap-1.5">
                {selected.airlines.map(l => (
                  <span key={l} className="px-2 py-1 bg-bg rounded-lg text-xs text-ink font-medium">{l}</span>
                ))}
              </div>
            </div>

            {/* Hub Airlines */}
            {selected.hubFor.length > 0 && (
              <div className="p-6 border-b border-black/[.06]">
                <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Hub For</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selected.hubFor.map(h => (
                    <span key={h} className="px-2 py-1 bg-ink/5 rounded-lg text-xs text-ink font-medium border border-ink/10">{h}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Top Routes */}
            <div className="p-6 border-b border-black/[.06]">
              <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Top Routes</h3>
              <div className="flex flex-wrap gap-1.5">
                {selected.topRoutes.map(r => (
                  <span key={r} className="px-2 py-1 bg-bg rounded-lg text-xs font-mono text-ink">{r}</span>
                ))}
              </div>
            </div>

            {/* Notables */}
            <div className="p-6">
              <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-2">Notable Facts</h3>
              <p className="text-sm text-muted leading-relaxed">{selected.notables}</p>
            </div>
          </div>
        </div>
      )}

      {/* Slide-in animation */}
      <style jsx>{`
        @keyframes slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-in { animation: slide-in 0.2s ease-out; }
      `}</style>
    </div>
  );
}
