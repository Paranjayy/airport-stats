"use client";

import { useState } from "react";
import { AIRPORT_WEATHER } from "@/lib/historical-data";

const CHALLENGE_COLORS: Record<string, string> = {
  "Heavy monsoon": "bg-blue-100 text-blue-700",
  "Extreme cold": "bg-cyan-100 text-cyan-700",
  "Extreme heat": "bg-red-100 text-red-700",
  "Fog": "bg-gray-100 text-gray-700",
  "Snow": "bg-blue-100 text-blue-700",
  "Cyclone": "bg-purple-100 text-purple-700",
  "Flooding": "bg-blue-100 text-blue-700",
  "Bird strikes": "bg-orange-100 text-orange-700",
};

export default function WeatherOverview() {
  const [selected, setSelected] = useState<string | null>(null);

  const sorted = [...AIRPORT_WEATHER].sort((a, b) => b.rainyDays - a.rainyDays);

  return (
    <div className="space-y-6">
      {/* Climate map legend */}
      <div className="rounded-xl border border-black/[.06] bg-white p-6">
        <h3 className="text-sm font-semibold text-ink mb-3">Climate Zones Across India</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
            <div className="font-medium text-amber-800">Semi-Arid</div>
            <div className="text-amber-600 mt-0.5">Delhi, Jaipur, Jodhpur</div>
            <div className="text-amber-500 mt-0.5">Hot summers, mild winters, low rain</div>
          </div>
          <div className="p-3 rounded-lg bg-green-50 border border-green-200">
            <div className="font-medium text-green-800">Tropical</div>
            <div className="text-green-600 mt-0.5">Mumbai, Chennai, Kochi</div>
            <div className="text-green-500 mt-0.5">Hot & humid, heavy monsoon</div>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <div className="font-medium text-blue-800">Subtropical</div>
            <div className="text-blue-600 mt-0.5">Srinagar, Kolkata</div>
            <div className="text-blue-500 mt-0.5">Moderate, seasonal variation</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-medium text-slate-800">Cold Desert</div>
            <div className="text-slate-600 mt-0.5">Leh</div>
            <div className="text-slate-500 mt-0.5">Extreme cold, thin air</div>
          </div>
        </div>
      </div>

      {/* Airport weather cards */}
      <div>
        <h3 className="text-sm font-semibold text-ink mb-3">Airport Weather & Challenges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sorted.map(w => {
            const isOpen = selected === w.iata;
            return (
              <div key={w.iata} className={`rounded-xl border bg-white overflow-hidden transition-all ${isOpen ? "border-ink/15 shadow-md" : "border-black/[.06]"}`}>
                <button onClick={() => setSelected(isOpen ? null : w.iata)} className="w-full p-4 text-left hover:bg-bg/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-ink">{w.iata}</span>
                      <span className="text-xs text-muted">{w.climate}</span>
                    </div>
                    <span className="text-lg tabular-nums">{w.avgTempC}°C</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted">
                    <span>🌧️ {w.rainyDays} rainy days</span>
                    <span>💧 {w.humidDays} humid days</span>
                    {w.foggyDays > 0 && <span>🌫️ {w.foggyDays} foggy days</span>}
                  </div>
                  {/* Rainfall bar */}
                  <div className="mt-2 h-1.5 bg-bg rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-blue-300 rounded-full" style={{ width: `${Math.min(100, (w.avgRainfallMm / 3500) * 100)}%` }} />
                  </div>
                  <div className="text-[10px] text-muted mt-1">Rainfall: {w.avgRainfallMm}mm/year</div>
                </button>

                {isOpen && (
                  <div className="border-t border-black/[.06] px-4 py-3 bg-bg/30">
                    <div className="grid grid-cols-2 gap-4 text-xs mb-3">
                      <div>
                        <div className="text-muted font-medium mb-1">Best Months</div>
                        <div className="flex flex-wrap gap-1">
                          {w.bestMonths.map(m => (
                            <span key={m} className="px-2 py-0.5 bg-green-100 text-green-700 rounded">{m}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted font-medium mb-1">Worst Months</div>
                        <div className="flex flex-wrap gap-1">
                          {w.worstMonths.map(m => (
                            <span key={m} className="px-2 py-0.5 bg-red-100 text-red-700 rounded">{m}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs mb-2">
                      <span className="text-muted">Runway: </span>
                      <span className="text-ink">{w.runwayFooting}</span>
                    </div>
                    <div>
                      <div className="text-xs text-muted font-medium mb-1">Challenges</div>
                      <div className="flex flex-wrap gap-1">
                        {w.challenges.map((c, i) => {
                          const colorKey = Object.keys(CHALLENGE_COLORS).find(k => c.includes(k));
                          const colorClass = colorKey ? CHALLENGE_COLORS[colorKey] : "bg-gray-100 text-gray-700";
                          return (
                            <span key={i} className={`px-2 py-0.5 rounded text-[10px] ${colorClass}`}>{c}</span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
