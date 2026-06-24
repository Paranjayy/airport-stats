"use client";

import { useState } from "react";
import type { MonthlyData } from "@/lib/analytics";
import { formatNumber } from "@/lib/analytics";

/**
 * Monthly passenger bar chart — pure CSS, no chart library.
 * Hover reveals exact value. Animated bar widths on mount.
 */
interface PassengerChartProps {
  data: MonthlyData[];
  className?: string;
}

export default function PassengerChart({ data, className }: PassengerChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const maxPax = Math.max(...data.map((d) => d.passengers));

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-sm font-semibold text-ink">Monthly Passengers</h3>
        <span className="text-xs text-muted">2023</span>
      </div>

      <div className="flex items-end gap-1.5 h-40">
        {data.map((d, i) => {
          const height = maxPax > 0 ? (d.passengers / maxPax) * 100 : 0;
          const isHovered = hoveredIdx === i;
          return (
            <div
              key={d.month}
              className="flex-1 flex flex-col items-center gap-1 group relative"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              <div
                className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink text-white text-[11px] font-medium px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
              >
                {formatNumber(d.passengers)}
              </div>

              {/* Bar */}
              <div className="w-full flex-1 flex items-end">
                <div
                  className="w-full rounded-t-[3px] transition-all duration-500"
                  style={{
                    height: `${height}%`,
                    backgroundColor: isHovered
                      ? "var(--color-ink)"
                      : "var(--color-ink)",
                    opacity: isHovered ? 1 : 0.65,
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
