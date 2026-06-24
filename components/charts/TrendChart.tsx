"use client";

import { useState } from "react";
import type { YearlyData } from "@/lib/analytics";
import { formatNumber } from "@/lib/analytics";

/**
 * Yearly trend line chart — pure SVG, no chart library.
 * Renders a smooth line with data points and labels.
 */
interface TrendChartProps {
  data: YearlyData[];
  metric?: "passengers" | "cargo" | "movements";
  className?: string;
}

export default function TrendChart({
  data,
  metric = "passengers",
  className,
}: TrendChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const values = data.map((d) => {
    switch (metric) {
      case "cargo": return d.cargo;
      case "movements": return d.movements;
      default: return d.passengers;
    }
  });

  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const range = maxVal - minVal || 1;

  const padding = { top: 24, right: 16, bottom: 32, left: 0 };
  const width = 480;
  const height = 180;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Build points
  const points = values.map((v, i) => ({
    x: padding.left + (i / (values.length - 1)) * chartW,
    y: padding.top + chartH - ((v - minVal) / range) * chartH,
    value: v,
    year: data[i].year,
    growth: data[i].growthRate,
  }));

  // Build smooth path using Catmull-Rom → cubic bezier
  const buildPath = () => {
    if (points.length < 2) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];

      const tension = 0.3;
      const cp1x = p1.x + (p2.x - p0.x) * tension;
      const cp1y = p1.y + (p2.y - p0.y) * tension;
      const cp2x = p2.x - (p3.x - p1.x) * tension;
      const cp2y = p2.y - (p3.y - p1.y) * tension;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  // Build area fill path
  const buildAreaPath = () => {
    const linePath = buildPath();
    if (!linePath) return "";
    const last = points[points.length - 1];
    const first = points[0];
    return `${linePath} L ${last.x} ${padding.top + chartH} L ${first.x} ${padding.top + chartH} Z`;
  };

  const metricLabel = {
    passengers: "Passengers",
    cargo: "Cargo (tonnes)",
    movements: "Movements",
  }[metric];

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-sm font-semibold text-ink">
          Yearly Trend — {metricLabel}
        </h3>
        <span className="text-xs text-muted">2019–2023</span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        role="img"
        aria-label={`Yearly ${metricLabel} trend chart`}
      >
        {/* Area fill */}
        <path
          d={buildAreaPath()}
          fill="var(--color-ink)"
          opacity={0.06}
        />

        {/* Line */}
        <path
          d={buildPath()}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.7}
        />

        {/* Data points + labels */}
        {points.map((p, i) => {
          const isHovered = hoveredIdx === i;
          return (
            <g
              key={p.year}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="cursor-default"
            >
              {/* Hover area */}
              <rect
                x={p.x - 20}
                y={padding.top - 4}
                width={40}
                height={chartH + 8}
                fill="transparent"
              />

              {/* Point */}
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? 5 : 3}
                fill="white"
                stroke="var(--color-ink)"
                strokeWidth={2}
                className="transition-all duration-200"
              />

              {/* Year label */}
              <text
                x={p.x}
                y={height - 8}
                textAnchor="middle"
                fill="var(--color-muted)"
                fontSize={11}
                fontFamily="var(--font-inter)"
              >
                {p.year}
              </text>

              {/* Value tooltip on hover */}
              {isHovered && (
                <g>
                  <rect
                    x={p.x - 36}
                    y={p.y - 36}
                    width={72}
                    height={26}
                    rx={6}
                    fill="var(--color-ink)"
                  />
                  <text
                    x={p.x}
                    y={p.y - 19}
                    textAnchor="middle"
                    fill="white"
                    fontSize={11}
                    fontFamily="var(--font-inter)"
                    fontWeight={500}
                  >
                    {formatNumber(p.value)}
                  </text>
                  {i > 0 && (
                    <text
                      x={p.x}
                      y={p.y - 52}
                      textAnchor="middle"
                      fill={
                        p.growth >= 0
                          ? "#34c759"
                          : "#ff375f"
                      }
                      fontSize={10}
                      fontFamily="var(--font-inter)"
                      fontWeight={500}
                    >
                      {p.growth >= 0 ? "+" : ""}
                      {p.growth}%
                    </text>
                  )}
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
