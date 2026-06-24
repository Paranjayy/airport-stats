"use client";

import { useState } from "react";
import { AIRPORT_ECONOMICS, AVIATION_ECONOMICS } from "@/lib/aviation-data";

function formatCr(n: number): string {
  if (n >= 10000) return `₹${(n / 1000).toFixed(1)}K Cr`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K Cr`;
  return `₹${n} Cr`;
}

export default function EconomicsOverview() {
  const [selected, setSelected] = useState<string | null>(null);
  const stats = AVIATION_ECONOMICS;

  return (
    <div className="space-y-8">
      {/* Industry overview */}
      <div className="rounded-xl border border-black/[.06] bg-white p-6">
        <h3 className="text-sm font-semibold text-ink mb-4">Industry at a Glance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-lg bg-bg">
            <div className="text-2xl font-semibold text-ink">{formatCr(stats.industrySize.value)}</div>
            <div className="text-xs text-muted mt-1">{stats.industrySize.description}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-bg">
            <div className="text-2xl font-semibold text-ink">{stats.gdpContribution.value}{stats.gdpContribution.unit}</div>
            <div className="text-xs text-muted mt-1">{stats.gdpContribution.description}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-bg">
            <div className="text-2xl font-semibold text-ink">{(stats.employmentDirect.value / 1000).toFixed(0)}K</div>
            <div className="text-xs text-muted mt-1">{stats.employmentDirect.description}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-bg">
            <div className="text-2xl font-semibold text-ink">{stats.aircraftOrders.value.toLocaleString()}</div>
            <div className="text-xs text-muted mt-1">{stats.aircraftOrders.description}</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-bg">
            <div className="text-muted">Avg Ticket Price</div>
            <div className="text-ink font-semibold mt-0.5">₹{stats.avgTicketPrice.value.toLocaleString()}</div>
          </div>
          <div className="p-3 rounded-lg bg-bg">
            <div className="text-muted">Load Factor</div>
            <div className="text-ink font-semibold mt-0.5">{stats.loadFactor.value}%</div>
          </div>
          <div className="p-3 rounded-lg bg-bg">
            <div className="text-muted">Fuel Cost Share</div>
            <div className="text-ink font-semibold mt-0.5">{stats.fuelCostShare.value}%</div>
          </div>
          <div className="p-3 rounded-lg bg-bg">
            <div className="text-muted">Growth Rate</div>
            <div className="text-ink font-semibold mt-0.5">{stats.growthRate.value}% YoY</div>
          </div>
        </div>
      </div>

      {/* Airport economics */}
      <div>
        <h3 className="text-sm font-semibold text-ink mb-3">Airport Revenue (2023)</h3>
        <div className="space-y-2">
          {[...AIRPORT_ECONOMICS].sort((a, b) => b.revenue - a.revenue).map((econ) => {
            const isOpen = selected === econ.iata;
            const maxRev = Math.max(...AIRPORT_ECONOMICS.map((e) => e.revenue));
            return (
              <div key={econ.iata} className="rounded-xl border border-black/[.06] bg-white overflow-hidden">
                <button onClick={() => setSelected(isOpen ? null : econ.iata)} className="w-full flex items-center gap-4 px-5 py-3 text-left hover:bg-bg/50 transition-colors">
                  <span className="font-mono text-xs font-medium text-ink">{econ.iata}</span>
                  <div className="flex-1 min-w-0">
                    <div className="w-full h-1.5 rounded-full bg-ink/5 overflow-hidden">
                      <div className="h-full rounded-full bg-ink/20" style={{ width: `${(econ.revenue / maxRev) * 100}%` }} />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-medium text-ink">{formatCr(econ.revenue)}</div>
                    <div className={`text-xs ${econ.profitLoss >= 0 ? "text-green-600" : "text-red-500"}`}>{econ.profitLoss >= 0 ? "+" : ""}{formatCr(econ.profitLoss)}</div>
                  </div>
                  <svg width="12" height="12" viewBox="0 0 12 12" className={`text-muted transition-transform ${isOpen ? "rotate-90" : ""}`}>
                    <path d="M4.5 2.5l3.5 3.5-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="border-t border-black/[.06] px-5 py-3 bg-bg/30 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div><div className="text-muted">Operator</div><div className="text-ink font-medium mt-0.5">{econ.operator}</div></div>
                    <div><div className="text-muted">Concession</div><div className="text-ink font-medium mt-0.5">{econ.concessionPeriod}</div></div>
                    <div><div className="text-muted">AIP Charge</div><div className="text-ink font-medium mt-0.5">₹{econ.aipCharges}/pax</div></div>
                    <div><div className="text-muted">Landing Fee</div><div className="text-ink font-medium mt-0.5">₹{econ.landingFee}/kg</div></div>
                    <div><div className="text-muted">Duty Free</div><div className="text-ink font-medium mt-0.5">{formatCr(econ.dutyFree)}</div></div>
                    <div><div className="text-muted">Retail</div><div className="text-ink font-medium mt-0.5">{formatCr(econ.retailRevenue)}</div></div>
                    <div><div className="text-muted">Parking</div><div className="text-ink font-medium mt-0.5">{formatCr(econ.parkingRevenue)}</div></div>
                    <div><div className="text-muted">Advertising</div><div className="text-ink font-medium mt-0.5">{formatCr(econ.advertisingRevenue)}</div></div>
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
