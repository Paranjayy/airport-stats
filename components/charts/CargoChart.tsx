"use client";

import { useState } from "react";
import type { MonthlyData } from "@/lib/analytics";
import { formatNumber } from "@/lib/analytics";

/**
 * Monthly cargo tonnage bar chart — pure CSS, no chart library.
 * Uses the project's airport-international blue for visual variety.
 */
interface CargoChartProps {
  data: MonthlyData[];
  className?: string;
}

export default function CargoChart({ data, className }: CargoChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const maxCargo = Math.max(...data.map((d) => d.cargo));

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-sm font-semibold text-ink">Monthly Cargo</h3>
        <span className="text-xs text-muted">2023 (tonnes)</span>
      </div>

      <div className="flex items-end gap-1.5 h-40">
        {data.map((d, i) => {
          const height = maxCargo > 0 ? (d.cargo / maxCargo) * 100 : 0;
          const isHovered = hoveredIdx === i;
          return (
            <div
              key={d.month}
              className="flex-1 flex flex-col items-center gap-1 group relative"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink text-white text-[11px] font-medium px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {formatNumber(d.cargo)} t
              </div>

              {/* Bar */}
              <div className="w-full flex-1 flex items-end">
                <div
                  className="w-full rounded-t-[3px] transition-all duration-500"
                  style={{
                    height: `${height}%`,
                    backgroundColor: isHovered
                      ? "#0a84ff"
                      : "#0a84ff",
                    opacity: isHovered ? 1 : 0.55,
                  }}
                />
              </div>

              {/* Label */}
              <span
                className="text-[10px] tabular-nums leading-none transition-colors"
                style={{
                  color: isHovered
                    ? "var(--color-ink)"
                    : "var(--color-muted)",
                }}
              >
                {d.monthShort}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
