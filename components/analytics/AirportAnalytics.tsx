"use client";

import { useState, useMemo } from "react";
import { getAirportAnalytics, getAllAirports, formatNumber, type AirportAnalyticsData } from "@/lib/analytics";
import PassengerChart from "@/components/charts/PassengerChart";
import CargoChart from "@/components/charts/CargoChart";
import TrendChart from "@/components/charts/TrendChart";

/**
 * Analytics dashboard with airport selector and multiple charts.
 * Shows monthly breakdowns, yearly trends, and growth metrics.
 */
interface AirportAnalyticsProps {
  className?: string;
}

export default function AirportAnalytics({ className }: AirportAnalyticsProps) {
  const [selectedIata, setSelectedIata] = useState("DEL");
  const airports = useMemo(() => getAllAirports(), []);

  const data = useMemo(
    () => getAirportAnalytics(selectedIata),
    [selectedIata],
  );

  if (!data) {
    return (
      <div className={className}>
        <div className="rounded-xl border border-black/[.06] bg-card p-12 text-center">
          <div className="text-muted text-sm">Airport not found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Airport selector */}
      <div className="mb-6">
        <label className="block text-xs font-medium text-muted mb-1.5">
          Select airport
        </label>
        <select
          value={selectedIata}
          onChange={(e) => setSelectedIata(e.target.value)}
          className="rounded-lg border border-black/[.08] bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-ink/20 focus:ring-1 focus:ring-ink/10 transition-colors"
        >
          {airports.map((a) => (
            <option key={a.iata} value={a.iata}>
              {a.iata} — {a.city} ({a.name})
            </option>
          ))}
        </select>
      </div>

      {/* Airport header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-lg font-semibold text-ink">{data.name}</h3>
        </div>
        <div className="text-sm text-muted">
          {data.city}, {data.state} — {data.iata}
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <MetricCard label="Passengers" value={formatNumber(data.totals.passengers)} accent />
        <MetricCard label="Cargo" value={formatNumber(data.totals.cargo) + " t"} />
        <MetricCard label="Movements" value={formatNumber(data.totals.movements)} />
        <MetricCard
          label="Growth"
          value={`${data.growth.passengerGrowth >= 0 ? "+" : ""}${data.growth.passengerGrowth}%`}
          positive={data.growth.passengerGrowth >= 0}
        />
      </div>

      {/* Domestic vs International split */}
      <div className="rounded-xl border border-black/[.06] bg-card p-5 mb-8">
        <div className="text-xs font-medium text-muted mb-3">
          Passenger Split
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 h-3 rounded-full bg-black/[.04] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#34c759]"
              style={{ width: `${data.growth.domesticShare}%` }}
            />
          </div>
          <span className="text-xs font-medium text-ink tabular-nums w-14 text-right">
            {data.growth.domesticShare}%
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-3 rounded-full bg-black/[.04] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#0a84ff]"
              style={{ width: `${data.growth.internationalShare}%` }}
            />
          </div>
          <span className="text-xs font-medium text-ink tabular-nums w-14 text-right">
            {data.growth.internationalShare}%
          </span>
        </div>
        <div className="flex justify-between mt-2 text-[11px] text-muted">
          <span>Domestic ({formatNumber(data.totals.domesticPax)})</span>
          <span>International ({formatNumber(data.totals.internationalPax)})</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border border-black/[.06] bg-card p-5">
          <PassengerChart data={data.monthly} />
        </div>
        <div className="rounded-xl border border-black/[.06] bg-card p-5">
          <CargoChart data={data.monthly} />
        </div>
      </div>

      {/* Trend */}
      <div className="rounded-xl border border-black/[.06] bg-card p-5 mb-8">
        <TrendChart data={data.yearly} metric="passengers" />
      </div>

      {/* Year-over-year table */}
      <div className="rounded-xl border border-black/[.06] bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-black/[.04]">
          <h3 className="text-sm font-semibold text-ink">Year-over-Year</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/[.04]">
                <th className="text-left px-5 py-2.5 text-xs font-medium text-muted">Year</th>
                <th className="text-right px-5 py-2.5 text-xs font-medium text-muted">Passengers</th>
                <th className="text-right px-5 py-2.5 text-xs font-medium text-muted">Cargo (t)</th>
                <th className="text-right px-5 py-2.5 text-xs font-medium text-muted">Movements</th>
                <th className="text-right px-5 py-2.5 text-xs font-medium text-muted">Pax Growth</th>
              </tr>
            </thead>
            <tbody>
              {data.yearly.map((y) => (
                <tr key={y.year} className="border-b border-black/[.02] last:border-0">
                  <td className="px-5 py-2.5 text-ink font-medium">{y.year}</td>
                  <td className="px-5 py-2.5 text-right text-ink tabular-nums">{formatNumber(y.passengers)}</td>
                  <td className="px-5 py-2.5 text-right text-ink tabular-nums">{formatNumber(y.cargo)}</td>
                  <td className="px-5 py-2.5 text-right text-ink tabular-nums">{formatNumber(y.movements)}</td>
                  <td className={`px-5 py-2.5 text-right tabular-nums font-medium ${y.growthRate >= 0 ? "text-[#34c759]" : "text-[#ff375f]"}`}>
                    {y.growthRate >= 0 ? "+" : ""}{y.growthRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  accent,
  positive,
}: {
  label: string;
  value: string;
  accent?: boolean;
  positive?: boolean;
}) {
  return (
    <div className="rounded-xl border border-black/[.06] bg-card p-4">
      <div className="text-[11px] text-muted mb-1">{label}</div>
      <div
        className={`text-lg font-semibold tabular-nums ${
          accent
            ? "text-ink"
            : positive === true
              ? "text-[#34c759]"
              : positive === false
                ? "text-[#ff375f]"
                : "text-ink"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
