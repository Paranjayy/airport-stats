"use client";

import { useState, useMemo } from "react";
import {
  searchFlights,
  getAllAirportCodes,
  getCityForAirport,
  statusColor,
  type TrackedFlight,
  type FlightStatus,
} from "@/lib/flights";

/**
 * Flight tracker with route search.
 * Search by origin, destination, or route. Results show status, duration,
 * aircraft, and gate — all with the Apple-style neutral design.
 */
interface FlightTrackerProps {
  className?: string;
}

export default function FlightTracker({ className }: FlightTrackerProps) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [searched, setSearched] = useState(false);
  const [expandedFlight, setExpandedFlight] = useState<string | null>(null);

  const airports = useMemo(() => getAllAirportCodes(), []);

  const results = useMemo(() => {
    if (!searched) return null;
    return searchFlights(origin || undefined, destination || undefined);
  }, [origin, destination, searched]);

  const handleSearch = () => {
    setSearched(true);
    setExpandedFlight(null);
  };

  const handleClear = () => {
    setOrigin("");
    setDestination("");
    setSearched(false);
    setExpandedFlight(null);
  };

  return (
    <div className={className}>
      {/* Search controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <label className="block text-xs font-medium text-muted mb-1.5">
            Origin airport
          </label>
          <div className="relative">
            <input
              type="text"
              value={origin}
              onChange={(e) => {
                setOrigin(e.target.value.toUpperCase());
                setSearched(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g. DEL"
              maxLength={3}
              className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2.5 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-ink/20 focus:ring-1 focus:ring-ink/10 transition-colors font-mono tracking-wider uppercase"
            />
          </div>
        </div>

        <div className="flex items-end justify-center pb-2.5">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-muted"
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex-1">
          <label className="block text-xs font-medium text-muted mb-1.5">
            Destination airport
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value.toUpperCase());
              setSearched(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="e.g. BOM"
            maxLength={3}
            className="w-full rounded-lg border border-black/[.08] bg-white px-3 py-2.5 text-sm text-ink placeholder:text-muted/50 focus:outline-none focus:border-ink/20 focus:ring-1 focus:ring-ink/10 transition-colors font-mono tracking-wider uppercase"
          />
        </div>

        <div className="flex gap-2 sm:items-end">
          <button
            onClick={handleSearch}
            className="rounded-lg bg-ink text-white px-5 py-2.5 text-sm font-medium hover:bg-ink/90 transition-colors"
          >
            Search
          </button>
          <button
            onClick={handleClear}
            className="rounded-lg border border-black/[.08] bg-white text-muted px-4 py-2.5 text-sm font-medium hover:text-ink hover:border-black/[.12] transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Quick airport chips */}
      {!searched && (
        <div className="mb-6">
          <div className="text-xs text-muted mb-2">Popular airports</div>
          <div className="flex flex-wrap gap-1.5">
            {["DEL", "BOM", "BLR", "HYD", "MAA", "CCU", "GOI", "COK", "JAI", "LKO"].map(
              (code) => (
                <button
                  key={code}
                  onClick={() => {
                    setOrigin(code);
                    setSearched(true);
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-bg border border-black/[.06] text-muted hover:text-ink hover:border-black/[.12] transition-colors"
                >
                  {code}
                </button>
              ),
            )}
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div>
          {/* Summary bar */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-ink">
                {results.route}
              </span>
              <span className="text-xs text-muted">
                {results.totalFlights} flights found
              </span>
            </div>
            <StatusLegend />
          </div>

          {/* Flight list */}
          {results.flights.length === 0 ? (
            <div className="rounded-xl border border-black/[.06] bg-card p-12 text-center">
              <div className="text-muted text-sm">
                No flights found for this route.
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {results.flights.map((flight) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  expanded={expandedFlight === flight.id}
                  onToggle={() =>
                    setExpandedFlight(
                      expandedFlight === flight.id ? null : flight.id,
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!searched && (
        <div className="rounded-xl border border-black/[.06] bg-card p-12 text-center">
          <div className="text-3xl mb-3">✈</div>
          <div className="text-sm font-medium text-ink mb-1">
            Search for flights
          </div>
          <div className="text-xs text-muted">
            Enter an origin, destination, or both to find flights
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function FlightCard({
  flight,
  expanded,
  onToggle,
}: {
  flight: TrackedFlight;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-xl border border-black/[.06] bg-card overflow-hidden transition-all duration-200 hover:border-black/[.1]">
      {/* Main row — clickable */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3.5 flex items-center gap-4 text-left"
      >
        {/* Status dot */}
        <StatusDot status={flight.status} />

        {/* Flight number + airline */}
        <div className="w-24 shrink-0">
          <div className="text-sm font-semibold text-ink font-mono">
            {flight.flightNumber}
          </div>
          <div className="text-[11px] text-muted">{flight.airline}</div>
        </div>

        {/* Route */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <div className="text-right min-w-0">
            <div className="text-sm font-medium text-ink tabular-nums">
              {flight.departureTime}
            </div>
            <div className="text-[11px] text-muted truncate">
              {flight.origin}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex-1 flex items-center justify-center gap-1 shrink-0">
            <div className="h-px flex-1 bg-black/10" />
            <div className="text-[11px] text-muted tabular-nums shrink-0">
              {flight.duration}
            </div>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="text-muted shrink-0"
            >
              <path
                d="M2 6h8M7 3l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="h-px flex-1 bg-black/10" />
          </div>

          <div className="text-left min-w-0">
            <div className="text-sm font-medium text-ink tabular-nums">
              {flight.arrivalTime}
            </div>
            <div className="text-[11px] text-muted truncate">
              {flight.destination}
            </div>
          </div>
        </div>

        {/* Status badge */}
        <div
          className={`text-xs font-medium capitalize shrink-0 ${statusColor(flight.status)}`}
        >
          {flight.status.replace("-", " ")}
        </div>

        {/* Chevron */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="text-muted/60 shrink-0 transition-transform duration-200"
          style={{ transform: expanded ? "rotate(90deg)" : undefined }}
        >
          <path
            d="M5 3l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-black/[.04]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
            <Detail label="Aircraft" value={flight.aircraft} />
            <Detail label="Gate" value={flight.gate} />
            <Detail label="Terminal" value={`T${flight.terminal}`} />
            <Detail
              label="Delay"
              value={
                flight.delay
                  ? `${flight.delay} min`
                  : "On time"
              }
              highlight={!!flight.delay}
            />
          </div>
          <div className="mt-3 flex items-center gap-3 text-[11px] text-muted">
            <span>
              {getCityForAirport(flight.origin) ?? flight.origin}
            </span>
            <span className="text-muted/40">→</span>
            <span>
              {getCityForAirport(flight.destination) ?? flight.destination}
            </span>
            {flight.delay && (
              <span className="text-[#ff9f0a] font-medium">
                +{flight.delay} min delay
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <div className="text-[11px] text-muted mb-0.5">{label}</div>
      <div
        className={`text-sm font-medium ${highlight ? "text-[#ff9f0a]" : "text-ink"}`}
      >
        {value}
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: FlightStatus }) {
  const color =
    status === "en-route"
      ? "#0a84ff"
      : status === "delayed"
        ? "#ff9f0a"
        : status === "cancelled"
          ? "#ff375f"
          : status === "landed"
            ? "#34c759"
            : "var(--color-muted)";

  return (
    <div
      className="w-2 h-2 rounded-full shrink-0"
      style={{ backgroundColor: color }}
    />
  );
}

function StatusLegend() {
  const items: Array<{ label: string; color: string }> = [
    { label: "On time", color: "var(--color-muted)" },
    { label: "En route", color: "#0a84ff" },
    { label: "Delayed", color: "#ff9f0a" },
    { label: "Cancelled", color: "#ff375f" },
  ];
  return (
    <div className="hidden sm:flex items-center gap-3 text-[11px] text-muted">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </div>
      ))}
    </div>
  );
}
