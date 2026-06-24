"use client";

import { useState } from "react";
import { formatPassengers } from "@/lib/map-utils";

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

interface StateGroup {
  state: string;
  count: number;
  totalPax: number;
  airports: AirportRow[];
}

interface StatsOverviewProps {
  airports: Array<{
    iata_code: string;
    name: string;
    city: string;
    state: string | null;
    airport_type: string;
    annual_passengers?: number;
    annual_cargo_tonnes?: number;
    annual_movements?: number;
    domestic_passengers?: number;
    international_passengers?: number;
  }>;
}

/* ------------------------------------------------------------------ */
/*  State card                                                          */
/* ------------------------------------------------------------------ */

function StateCard({
  group,
  rank,
  maxPax,
  expanded,
  onToggle,
}: {
  group: StateGroup;
  rank: number;
  maxPax: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const pct = maxPax > 0 ? (group.totalPax / maxPax) * 100 : 0;

  return (
    <div className="border-b border-black/[.04] last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 py-3.5 text-left hover:bg-bg/50 transition-colors px-1"
      >
        {/* Rank */}
        <div className="w-6 text-center text-xs font-mono text-muted flex-shrink-0">
          {rank}
        </div>

        {/* State info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-ink tracking-tight">
              {group.state}
            </span>
            <span className="text-xs text-muted">
              {group.count} airport{group.count !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Total passengers */}
        <div className="text-right flex-shrink-0">
          <span className="text-sm font-medium text-ink">
            {formatPassengers(group.totalPax)}
          </span>
        </div>

        {/* Bar */}
        <div className="w-24 hidden sm:block flex-shrink-0">
          <div className="h-1.5 rounded-full bg-black/[.04] overflow-hidden">
            <div
              className="h-full rounded-full bg-ink/15"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Chevron */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          className={`text-muted/40 transition-transform duration-200 flex-shrink-0 ${expanded ? "rotate-90" : ""}`}
        >
          <path
            d="M4 2l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="pb-3 pl-10 pr-1">
          <div className="rounded-lg bg-bg/60 p-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {group.airports.map((a) => (
                <div
                  key={a.iata}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono font-medium text-ink">
                      {a.iata}
                    </span>
                    <span className="text-muted truncate">{a.city}</span>
                  </div>
                  <span className="text-ink font-medium ml-2 flex-shrink-0">
                    {formatPassengers(a.passengers)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

function groupByState(airports: StatsOverviewProps['airports']): StateGroup[] {
  const map = new Map<string, any[]>();
  for (const a of airports) {
    const key = a.state || 'Unknown';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(a);
  }
  return [...map.entries()]
    .map(([state, list]) => ({
      state,
      count: list.length,
      totalPax: list.reduce((s: number, a: any) => s + (a.annual_passengers || 0), 0),
      airports: list.map((a: any) => ({
        iata: a.iata_code, name: a.name, city: a.city, state: a.state || '',
        type: a.airport_type, passengers: a.annual_passengers || 0,
        cargo: a.annual_cargo_tonnes || 0, movements: a.annual_movements || 0,
        domestic: a.domestic_passengers || 0, international: a.international_passengers || 0,
      })),
    }))
    .sort((a, b) => b.totalPax - a.totalPax);
}

export default function StatsOverview({ airports }: StatsOverviewProps) {
  const stateGroups = groupByState(airports);
  const [expanded, setExpanded] = useState<string | null>(null);

  const maxPax = Math.max(...stateGroups.map((g) => g.totalPax));

  // Compute some summary stats
  const topState = stateGroups[0];
  const singleAirportStates = stateGroups.filter((g) => g.count === 1);
  const multiAirportStates = stateGroups.filter((g) => g.count > 1);

  return (
    <div>
      {/* Summary row */}
      <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted">
        <div>
          <span className="font-semibold text-ink">{stateGroups.length}</span>{" "}
          states & union territories
        </div>
        <div className="w-px h-4 bg-black/10" />
        <div>
          <span className="font-semibold text-ink">{multiAirportStates.length}</span>{" "}
          with 2+ airports
        </div>
        <div className="w-px h-4 bg-black/10" />
        <div>
          Leader:{" "}
          <span className="font-semibold text-ink">{topState.state}</span> —{" "}
          {formatPassengers(topState.totalPax)}
        </div>
      </div>

      {/* State list */}
      <div className="rounded-xl border border-black/[.06] bg-card overflow-hidden">
        {/* Header */}
        <div className="px-4 pt-3 pb-1 border-b border-black/[.04]">
          <div className="flex items-center gap-4 text-[11px] font-medium text-muted/60 uppercase tracking-wider">
            <div className="w-6 text-center">#</div>
            <div className="flex-1">State / UT</div>
            <div className="text-right">Passengers</div>
            <div className="w-24 hidden sm:block">Share</div>
            <div className="w-3" />
          </div>
        </div>

        {stateGroups.map((group, i) => (
          <StateCard
            key={group.state}
            group={group}
            rank={i + 1}
            maxPax={maxPax}
            expanded={expanded === group.state}
            onToggle={() =>
              setExpanded(expanded === group.state ? null : group.state)
            }
          />
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-4 text-xs text-muted">
        Passenger figures are 2023 annual totals from AIS India / DGCA.
        Click a state to see individual airport breakdown.
      </div>
    </div>
  );
}
