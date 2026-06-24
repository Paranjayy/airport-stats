"use client";

import { useState, useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

interface RouteRow {
  from: string;
  to: string;
  distance: number;
  carriers: string;
  frequency: string;
}

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

interface RouteOverviewProps {
  routes: RouteRow[];
  airports: AirportRow[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function parseFrequency(freq: string): number {
  const match = freq.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function AirportDot({ iata, airports }: { iata: string; airports: AirportRow[] }) {
  const airport = airports.find((a) => a.iata === iata);
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="font-mono text-sm font-medium text-ink">{iata}</span>
      {airport && (
        <span className="text-xs text-muted hidden sm:inline">
          {airport.city}
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Route card                                                          */
/* ------------------------------------------------------------------ */

function RouteCard({
  route,
  airports,
  rank,
  maxFreq,
}: {
  route: RouteRow;
  airports: AirportRow[];
  rank: number;
  maxFreq: number;
}) {
  const freq = parseFrequency(route.frequency);
  const pct = maxFreq > 0 ? (freq / maxFreq) * 100 : 0;

  return (
    <div className="flex items-center gap-4 py-3 border-b border-black/[.04] last:border-b-0">
      {/* Rank */}
      <div className="w-6 text-center text-xs font-mono text-muted">
        {rank}
      </div>

      {/* Route pair */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <AirportDot iata={route.from} airports={airports} />
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            className="text-muted/40 flex-shrink-0"
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <AirportDot iata={route.to} airports={airports} />
        </div>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted">
          <span>{route.distance.toLocaleString()} km</span>
          <span className="w-px h-3 bg-black/8" />
          <span className="truncate">{route.carriers}</span>
        </div>
      </div>

      {/* Frequency bar */}
      <div className="w-32 hidden md:block">
        <div className="flex items-center justify-between text-xs text-muted mb-1">
          <span>{route.frequency}</span>
        </div>
        <div className="h-1.5 rounded-full bg-black/[.04] overflow-hidden">
          <div
            className="h-full rounded-full bg-ink/15"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export default function RouteOverview({ routes, airports }: RouteOverviewProps) {
  const [sortBy, setSortBy] = useState<"frequency" | "distance">("frequency");

  const sorted = useMemo(() => {
    const list = [...routes];
    if (sortBy === "frequency") {
      list.sort(
        (a, b) => parseFrequency(b.frequency) - parseFrequency(a.frequency),
      );
    } else {
      list.sort((a, b) => b.distance - a.distance);
    }
    return list;
  }, [routes, sortBy]);

  const maxFreq = Math.max(...routes.map((r) => parseFrequency(r.frequency)));

  return (
    <div>
      {/* Sort toggle */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs text-muted">Sort by</span>
        <div className="flex rounded-lg border border-black/[.06] overflow-hidden">
          <button
            onClick={() => setSortBy("frequency")}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              sortBy === "frequency"
                ? "bg-ink text-white"
                : "bg-bg text-muted hover:text-ink"
            }`}
          >
            Frequency
          </button>
          <button
            onClick={() => setSortBy("distance")}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              sortBy === "distance"
                ? "bg-ink text-white"
                : "bg-bg text-muted hover:text-ink"
            }`}
          >
            Distance
          </button>
        </div>
      </div>

      {/* Route list */}
      <div className="rounded-xl border border-black/[.06] bg-card overflow-hidden">
        <div className="px-4 pt-3 pb-1 border-b border-black/[.04]">
          <div className="flex items-center gap-4 text-[11px] font-medium text-muted/60 uppercase tracking-wider">
            <div className="w-6 text-center">#</div>
            <div className="flex-1">Route</div>
            <div className="w-32 hidden md:block">Frequency</div>
          </div>
        </div>
        {sorted.map((route, i) => (
          <RouteCard
            key={`${route.from}-${route.to}`}
            route={route}
            airports={airports}
            rank={i + 1}
            maxFreq={maxFreq}
          />
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 text-xs text-muted">
        {routes.length} routes tracked · IndiGo operates on all corridors
      </div>
    </div>
  );
}
