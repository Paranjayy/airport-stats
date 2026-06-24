"use client";

import { useState } from "react";
import { INDIA_YEARLY, GLOBAL_TRENDS, AIRLINE_HISTORY } from "@/lib/historical-data";

function formatNum(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return String(n);
}

export default function TrendsOverview() {
  const [tab, setTab] = useState<"india" | "global" | "airlines">("india");
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const maxPax = Math.max(...INDIA_YEARLY.map(y => y.passengers));
  const maxGlobalPax = Math.max(...GLOBAL_TRENDS.map(y => Math.max(y.india.passengers, y.usa.passengers, y.china.passengers)));

  return (
    <div className="space-y-6">
      {/* Tab selector */}
      <div className="flex gap-2">
        {(["india", "global", "airlines"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${tab === t ? "bg-ink text-white" : "bg-bg text-muted hover:text-ink border border-black/[.06]"}`}>
            {t === "india" ? "🇮🇳 India Trends" : t === "global" ? "🌍 Global Comparison" : "✈️ Airlines Share"}
          </button>
        ))}
      </div>

      {/* INDIA TRENDS */}
      {tab === "india" && (
        <div className="space-y-6">
          {/* Passenger growth chart */}
          <div className="rounded-xl border border-black/[.06] bg-white p-6">
            <h3 className="text-sm font-semibold text-ink mb-1">Passenger Growth</h3>
            <p className="text-xs text-muted mb-4">Annual domestic + international passengers (millions)</p>
            <div className="flex items-end gap-1.5 h-48">
              {INDIA_YEARLY.map(y => {
                const height = (y.passengers / maxPax) * 100;
                const isHovered = hoveredYear === y.year;
                const isCovid = y.year === 2020 || y.year === 2021;
                return (
                  <div key={y.year} className="flex-1 flex flex-col items-center" onMouseEnter={() => setHoveredYear(y.year)} onMouseLeave={() => setHoveredYear(null)}>
                    <div className="text-[10px] text-muted mb-1 opacity-0 group-hover:opacity-100">{formatNum(y.passengers)}</div>
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 cursor-pointer ${isCovid ? "bg-gradient-to-t from-red-400 to-red-300" : "bg-gradient-to-t from-ink/80 to-ink/60"}`}
                      style={{ height: `${height}%`, opacity: isHovered ? 1 : 0.8 }}
                      title={`${y.year}: ${formatNum(y.passengers)} passengers (${y.growthRate > 0 ? "+" : ""}${y.growthRate}%)`}
                    />
                    <span className="text-[10px] text-muted mt-1">{y.year.toString().slice(2)}</span>
                  </div>
                );
              })}
            </div>
            {/* Hovered year detail */}
            {hoveredYear && (
              <div className="mt-4 p-3 bg-bg rounded-lg text-xs">
                {(() => {
                  const y = INDIA_YEARLY.find(x => x.year === hoveredYear)!;
                  return (
                    <div className="grid grid-cols-4 gap-3">
                      <div><span className="text-muted">Passengers:</span> <span className="text-ink font-medium">{formatNum(y.passengers)}</span></div>
                      <div><span className="text-muted">Cargo:</span> <span className="text-ink font-medium">{formatNum(y.cargo)}t</span></div>
                      <div><span className="text-muted">Domestic:</span> <span className="text-ink font-medium">{formatNum(y.domesticPax)}</span></div>
                      <div><span className="text-muted">Growth:</span> <span className={`font-medium ${y.growthRate >= 0 ? "text-green-600" : "text-red-500"}`}>{y.growthRate > 0 ? "+" : ""}{y.growthRate}%</span></div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Key milestones */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "2015-2019 CAGR", value: "18.7%", desc: "Pre-COVID growth" },
              { label: "COVID Impact", value: "-69.8%", desc: "2020 vs 2019" },
              { label: "Recovery", value: "91%", desc: "Of 2019 levels by 2023" },
              { label: "2025 Projection", value: "500M+", desc: "Annual passengers" },
            ].map(m => (
              <div key={m.label} className="bg-white rounded-xl border border-black/[.06] p-4 text-center">
                <div className="text-lg font-semibold text-ink">{m.value}</div>
                <div className="text-xs text-muted mt-1">{m.label}</div>
                <div className="text-[10px] text-muted/60 mt-0.5">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GLOBAL COMPARISON */}
      {tab === "global" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-black/[.06] bg-white p-6">
            <h3 className="text-sm font-semibold text-ink mb-1">India vs China vs USA</h3>
            <p className="text-xs text-muted mb-4">Annual passengers (millions)</p>
            <div className="flex items-end gap-2 h-48">
              {GLOBAL_TRENDS.map(y => (
                <div key={y.year} className="flex-1 flex flex-col items-center gap-1">
                  {/* Stacked bars */}
                  <div className="flex gap-0.5 items-end w-full" style={{ height: "100%" }}>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gradient-to-t from-amber-500 to-amber-400 rounded-t" style={{ height: `${(y.usa.passengers / maxGlobalPax) * 100}%` }} title={`USA: ${formatNum(y.usa.passengers)}`} />
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gradient-to-t from-red-500 to-red-400 rounded-t" style={{ height: `${(y.china.passengers / maxGlobalPax) * 100}%` }} title={`China: ${formatNum(y.china.passengers)}`} />
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t" style={{ height: `${(y.india.passengers / maxGlobalPax) * 100}%` }} title={`India: ${formatNum(y.india.passengers)}`} />
                    </div>
                  </div>
                  <span className="text-[10px] text-muted">{y.year}</span>
                </div>
              ))}
            </div>
            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-400" /> USA</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-400" /> China</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-400" /> India</span>
            </div>
          </div>

          {/* Country metrics */}
          <div className="rounded-xl border border-black/[.06] bg-white p-6">
            <h3 className="text-sm font-semibold text-ink mb-3">2023 Snapshot</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-black/[.06]">
                    <th className="text-left text-muted py-2 pr-4">Country</th>
                    <th className="text-right text-muted py-2 px-2">Airports</th>
                    <th className="text-right text-muted py-2 px-2">Passengers</th>
                    <th className="text-right text-muted py-2 px-2">Cargo</th>
                    <th className="text-right text-muted py-2">Airline %</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { flag: "🇺🇸", name: "USA", airports: "19,600", pax: "930M", cargo: "26Mt", share: "100%" },
                    { flag: "🇨🇳", name: "China", airports: "254", pax: "620M", cargo: "18Mt", share: "67%" },
                    { flag: "🇮🇳", name: "India", airports: "486", pax: "363M", cargo: "3.7Mt", share: "39%" },
                    { flag: "🇬🇧", name: "UK", airports: "40", pax: "280M", cargo: "3.2Mt", share: "30%" },
                    { flag: "🇯🇵", name: "Japan", airports: "90", pax: "230M", cargo: "4.2Mt", share: "25%" },
                  ].map((c, i) => (
                    <tr key={c.name} className={`border-b border-black/[.04] ${c.name === "India" ? "bg-blue-50" : ""}`}>
                      <td className="py-2 pr-4 font-medium text-ink">{c.flag} {c.name}</td>
                      <td className="py-2 px-2 text-right text-muted tabular-nums">{c.airports}</td>
                      <td className="py-2 px-2 text-right text-ink font-medium tabular-nums">{c.pax}</td>
                      <td className="py-2 px-2 text-right text-muted tabular-nums">{c.cargo}</td>
                      <td className="py-2 text-right text-muted tabular-nums">{c.share}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* AIRLINES SHARE */}
      {tab === "airlines" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-black/[.06] bg-white p-6">
            <h3 className="text-sm font-semibold text-ink mb-1">Market Share by Year</h3>
            <p className="text-xs text-muted mb-4">Domestic market share (%)</p>
            <div className="flex items-end gap-2 h-48">
              {AIRLINE_HISTORY.map(y => {
                const airlines = [
                  { name: "IndiGo", color: "bg-blue-500", value: y.indigo },
                  { name: "Air India", color: "bg-red-400", value: y.airIndia },
                  { name: "SpiceJet", color: "bg-orange-400", value: y.spiceJet },
                  { name: "Vistara", color: "bg-purple-400", value: y.vistara },
                  { name: "GoFirst", color: "bg-green-400", value: y.goFirst },
                  { name: "Others", color: "bg-gray-300", value: y.others },
                ];
                return (
                  <div key={y.year} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col-reverse" style={{ height: "100%" }}>
                      {airlines.map(a => (
                        <div key={a.name} className={`w-full ${a.color} transition-all`} style={{ height: `${a.value}%` }} title={`${a.name}: ${a.value}%`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted mt-1">{y.year}</span>
                  </div>
                );
              })}
            </div>
            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs">
              {[
                { name: "IndiGo", color: "bg-blue-500" },
                { name: "Air India", color: "bg-red-400" },
                { name: "SpiceJet", color: "bg-orange-400" },
                { name: "Vistara", color: "bg-purple-400" },
                { name: "GoFirst", color: "bg-green-400" },
                { name: "Others", color: "bg-gray-300" },
              ].map(a => (
                <span key={a.name} className="flex items-center gap-1.5">
                  <span className={`w-3 h-3 rounded ${a.color}`} />
                  {a.name}
                </span>
              ))}
            </div>
          </div>

          {/* Key insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-black/[.06] p-5">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-semibold text-ink">IndiGo Dominance</div>
              <div className="text-xs text-muted mt-1">Grew from 48% (2019) to 62% (2023) market share. The largest single-airline market share in any major aviation market.</div>
            </div>
            <div className="bg-white rounded-xl border border-black/[.06] p-5">
              <div className="text-2xl mb-2">🔄</div>
              <div className="text-sm font-semibold text-ink">Tata Consolidation</div>
              <div className="text-xs text-muted mt-1">Tata Group now owns Air India, Vistara (merged), Air India Express, and Akasa stake. Controls ~25% of market.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
