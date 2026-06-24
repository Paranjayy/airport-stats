"use client";

import { useState } from "react";
import { INDIAN_AIRLINES } from "@/lib/aviation-data";
import type { Airline } from "@/lib/aviation-data";

function formatNum(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return String(n);
}

export default function AirlinesOverview() {
  const [sortBy, setSortBy] = useState<"marketShare" | "passengers" | "fleet">("marketShare");
  const [selected, setSelected] = useState<Airline | null>(null);

  const sorted = [...INDIAN_AIRLINES].sort((a, b) => b[sortBy] - a[sortBy]);
  const maxVal = Math.max(...sorted.map((a) => a[sortBy]));

  return (
    <div>
      {/* Sort toggle */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs text-muted">Sort by</span>
        <div className="flex rounded-lg border border-black/[.06] overflow-hidden">
          {(["marketShare", "passengers", "fleet"] as const).map((key) => (
            <button key={key} onClick={() => setSortBy(key)} className={`px-3 py-1.5 text-xs font-medium transition-colors ${sortBy === key ? "bg-ink text-white" : "bg-bg text-muted hover:text-ink"}`}>
              {key === "marketShare" ? "Market Share" : key === "passengers" ? "Passengers" : "Fleet"}
            </button>
          ))}
        </div>
      </div>

      {/* Airlines list */}
      <div className="space-y-2">
        {sorted.map((airline, i) => {
          const pct = (airline[sortBy] / maxVal) * 100;
          const isSelected = selected?.code === airline.code;
          return (
            <button key={airline.code} onClick={() => setSelected(isSelected ? null : airline)} className={`w-full text-left rounded-xl border px-5 py-4 transition-all ${isSelected ? "border-ink/15 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]" : "border-black/[.06] bg-white hover:bg-bg/50"}`}>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted w-6 text-right">{i + 1}</span>
                <span className="text-xl">{airline.logo}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-ink">{airline.name}</span>
                    <span className="text-[10px] text-muted font-mono bg-black/[.04] px-1.5 py-0.5 rounded">{airline.code}</span>
                    <span className="text-[10px] text-muted capitalize">{airline.type}</span>
                  </div>
                  <div className="text-xs text-muted mt-0.5">{airline.parentCompany} · {airline.hubs.length} hubs · Est. {airline.founded}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-medium text-ink tabular-nums">{sortBy === "marketShare" ? `${airline.marketShare}%` : sortBy === "passengers" ? formatNum(airline.passengers) : `${airline.fleet} aircraft`}</div>
                  <div className="w-24 h-1.5 rounded-full bg-ink/5 mt-1 overflow-hidden">
                    <div className="h-full rounded-full bg-ink/20" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {isSelected && (
                <div className="mt-4 pt-4 border-t border-black/[.06] grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <div className="text-muted">Hubs</div>
                    <div className="text-ink font-medium mt-0.5">{airline.hubs.join(", ")}</div>
                  </div>
                  <div>
                    <div className="text-muted">Destinations</div>
                    <div className="text-ink font-medium mt-0.5">{airline.destinations}</div>
                  </div>
                  <div>
                    <div className="text-muted">Headquarters</div>
                    <div className="text-ink font-medium mt-0.5">{airline.headquarters}</div>
                  </div>
                  <div>
                    <div className="text-muted">Slogan</div>
                    <div className="text-ink font-medium mt-0.5 italic">&ldquo;{airline.slogan}&rdquo;</div>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 text-xs text-muted">
        {INDIAN_AIRLINES.length} airlines tracked · IndiGo dominates with {INDIAN_AIRLINES[0].marketShare}% market share
      </div>
    </div>
  );
}
