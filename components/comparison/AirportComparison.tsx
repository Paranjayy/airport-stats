"use client";

import { useState, useMemo } from "react";
import {
  getComparisonData,
  getAllAirports,
  metricLabel,
  formatNumber,
  getMaxMetric,
  getMetricValue,
  type ComparisonMetric,
  type AirportAnalyticsData,
} from "@/lib/analytics";

/**
 * Airport comparison tool.
 * Select 2-4 airports and compare them across multiple metrics
 * with animated visual bars.
 */
interface AirportComparisonProps {
  className?: string;
  initialAirports?: string[];
}

const AIRPORT_COLORS = [
  "#1d1d1f", // ink
  "#0a84ff", // blue
  "#34c759", // green
  "#ff9f0a", // orange
];

const AVAILABLE_METRICS: ComparisonMetric[] = [
  "passengers",
  "cargo",
  "movements",
  "domesticPax",
  "internationalPax",
  "passengerGrowth",
  "cargoGrowth",
];

export default function AirportComparison({
  className,
  initialAirports = ["DEL", "BOM", "BLR"],
}: AirportComparisonProps) {
  const [selected, setSelected] = useState<string[]>(initialAirports);
  const [activeMetric, setActiveMetric] = useState<ComparisonMetric>("passengers");
  const allAirports = useMemo(() => getAllAirports(), []);

  const data = useMemo(() => getComparisonData(selected), [selected]);

  const addAirport = (code: string) => {
    if (selected.length >= 4 || selected.includes(code)) return;
    setSelected([...selected, code]);
  };

  const removeAirport = (code: string) => {
    if (selected.length <= 2) return;
    setSelected(selected.filter((c) => c !== code));
  };

  return (
    <div className={className}>
      {/* Airport selector chips */}
      <div className="mb-6">
        <div className="text-xs font-medium text-muted mb-2">
          Select airports to compare (2–4)
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {allAirports.map((a) => {
            const isSelected = selected.includes(a.iata);
            const idx = selected.indexOf(a.iata);
            return (
              <button
                key={a.iata}
                onClick={() =>
                  isSelected
                    ? removeAirport(a.iata)
                    : addAirport(a.iata)
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  isSelected
                    ? "bg-ink text-white border-ink"
                    : "bg-white text-muted border-black/[.06] hover:text-ink hover:border-black/[.12]"
                } ${!isSelected && selected.length >= 4 ? "opacity-40 cursor-not-allowed" : ""}`}
                disabled={!isSelected && selected.length >= 4}
                style={
                  isSelected
                    ? { backgroundColor: AIRPORT_COLORS[idx] ?? "#1d1d1f", borderColor: AIRPORT_COLORS[idx] ?? "#1d1d1f" }
                    : undefined
                }
              >
                {a.iata}
                <span className="ml-1 opacity-70">{a.city}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Metric tabs */}
      <div className="flex gap-1 overflow-x-auto mb-6 pb-1 -mx-1 px-1">
        {AVAILABLE_METRICS.map((m) => (
          <button
            key={m}
            onClick={() => setActiveMetric(m)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeMetric === m
                ? "bg-ink text-white"
                : "bg-bg text-muted hover:text-ink"
            }`}
          >
            {metricLabel(m)}
          </button>
        ))}
      </div>

      {/* Comparison bars */}
      {data.airports.length === 0 ? (
        <div className="rounded-xl border border-black/[.06] bg-card p-12 text-center">
          <div className="text-muted text-sm">
            Select at least 2 airports to compare.
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-black/[.06] bg-card p-5">
            <div className="text-sm font-semibold text-ink mb-5">
              {metricLabel(activeMetric)}
            </div>
            <div className="space-y-4">
              {data.airports.map((airport, i) => {
                const maxVal = getMaxMetric(data.airports, activeMetric);
                const val = getMetricValue(airport, activeMetric);
                const pct = maxVal > 0 ? (val / maxVal) * 100 : 0;
                const color = AIRPORT_COLORS[i] ?? "#1d1d1f";
                return (
                  <div key={airport.iata}>
                    <div className="flex items-baseline justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-sm"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-sm font-medium text-ink">
                          {airport.iata}
                        </span>
                        <span className="text-xs text-muted">
                          {airport.city}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-ink tabular-nums">
                        {formatMetricValue(val, activeMetric)}
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-black/[.04] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: color,
                          opacity: 0.8,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Side-by-side cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {data.airports.map((airport, i) => (
              <div
                key={airport.iata}
                className="rounded-xl border border-black/[.06] bg-card p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: AIRPORT_COLORS[i] }}
                  />
                  <span className="text-sm font-semibold text-ink">{airport.iata}</span>
                </div>
                <div className="space-y-2 text-xs">
                  <StatRow label="Passengers" value={formatNumber(airport.totals.passengers)} />
                  <StatRow label="Cargo" value={formatNumber(airport.totals.cargo) + " t"} />
                  <StatRow label="Movements" value={formatNumber(airport.totals.movements)} />
                  <StatRow
                    label="Growth"
                    value={`${airport.growth.passengerGrowth >= 0 ? "+" : ""}${airport.growth.passengerGrowth}%`}
                    highlight={airport.growth.passengerGrowth >= 0}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-muted">{label}</span>
      <span
        className={`font-medium tabular-nums ${
          highlight === true
            ? "text-[#34c759]"
            : highlight === false
              ? "text-[#ff375f]"
              : "text-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function formatMetricValue(val: number, metric: ComparisonMetric): string {
  if (metric === "passengerGrowth" || metric === "cargoGrowth") {
    return `${val >= 0 ? "+" : ""}${val}%`;
  }
  return formatNumber(val);
}
