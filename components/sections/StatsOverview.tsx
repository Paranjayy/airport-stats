"use client";

import { useState } from "react";
import type { Airport } from "@/lib/database";
import { formatPassengers } from "@/lib/map-utils";

interface StateGroup {
  state: string;
  count: number;
  totalPax: number;
  airports: Airport[];
}

function groupByState(airports: Airport[]): StateGroup[] {
  const map = new Map<string, Airport[]>();
  for (const a of airports) {
    const key = a.state || "Unknown";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(a);
  }
  return [...map.entries()]
    .map(([state, list]) => ({
      state,
      count: list.length,
      totalPax: list.reduce((s, a) => s + a.annual_passengers, 0),
      airports: list,
    }))
    .sort((a, b) => b.totalPax - a.totalPax);
}

export default function StatsOverview({ airports }: { airports: Airport[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const groups = groupByState(airports);
  const maxPax = Math.max(...groups.map((g) => g.totalPax));

  return (
    <div className="space-y-2">
      {groups.map((g, i) => {
        const isOpen = expanded === g.state;
        return (
          <div
            key={g.state}
            className="rounded-xl border border-black/[.06] bg-white overflow-hidden"
          >
            <button
              onClick={() => setExpanded(isOpen ? null : g.state)}
              className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-bg/50 transition-colors"
            >
              <span className="text-xs text-muted w-6 text-right">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-ink">{g.state}</div>
                <div className="text-xs text-muted">
                  {g.count} airport{g.count > 1 ? "s" : ""}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-ink tabular-nums">
                  {formatPassengers(g.totalPax)}
                </div>
                <div className="w-24 h-1.5 rounded-full bg-ink/5 mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-ink/15"
                    style={{ width: `${(g.totalPax / maxPax) * 100}%` }}
                  />
                </div>
              </div>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                className={`text-muted transition-transform ${isOpen ? "rotate-90" : ""}`}
              >
                <path
                  d="M4.5 2.5l3.5 3.5-3.5 3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {isOpen && (
              <div className="border-t border-black/[.06] px-5 py-3 bg-bg/30">
                {g.airports.map((a) => (
                  <div
                    key={a.iata_code}
                    className="flex items-center justify-between py-2 border-b border-black/[.04] last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted">
                        {a.iata_code}
                      </span>
                      <span className="text-sm text-ink">{a.name}</span>
                    </div>
                    <span className="text-sm text-muted tabular-nums">
                      {formatPassengers(a.annual_passengers)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
