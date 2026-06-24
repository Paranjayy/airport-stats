"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import FadeInOnView from "@/components/ui/FadeInOnView";
import SummaryBar from "@/components/sections/SummaryBar";
import AirportTable from "@/components/sections/AirportTable";
import RouteOverview from "@/components/sections/RouteOverview";
import StatsOverview from "@/components/sections/StatsOverview";
import AirlinesOverview from "@/components/sections/AirlinesOverview";
import EconomicsOverview from "@/components/sections/EconomicsOverview";
import PilotSchoolsOverview from "@/components/sections/PilotSchoolsOverview";
import {
  ALL_INDIAN_AIRPORTS as AIRPORTS,
  AIRPORT_STATS,
} from "@/lib/all-airports";
import type { IndianAirport as Airport } from "@/lib/all-airports";

const IndiaMap = dynamic(() => import("@/components/map/IndiaMap"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-bg" aria-hidden />,
});

function smoothScrollToMap(duration = 1200) {
  if (typeof window === "undefined") return;
  const targetY = window.innerHeight * 2.2;
  const startY = window.scrollY;
  if (startY >= targetY - 1) return;
  const distance = targetY - startY;
  const startTime = performance.now();
  const ease = (t: number) => 1 - Math.pow(1 - t, 4);
  const step = (now: number) => {
    const t = Math.min(1, (now - startTime) / duration);
    window.scrollTo(0, startY + distance * ease(t));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function formatNum(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return String(n);
}

export default function Page() {
  const [progress, setProgress] = useState(0);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    airport: Airport;
  } | null>(null);

  useEffect(() => {
    const onScroll = () =>
      setProgress(Math.min(1, window.scrollY / (window.innerHeight * 2)));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let userScrolled = false,
      bouncing = false;
    const onScroll = () => {
      if (!bouncing) userScrolled = true;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const timer = window.setTimeout(() => {
      if (userScrolled) return;
      bouncing = true;
      window.scrollTo({
        top: Math.round(window.innerHeight * 0.12),
        behavior: "smooth",
      });
      window.setTimeout(
        () => window.scrollTo({ top: 0, behavior: "smooth" }),
        700,
      );
    }, 2800);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleSelectAirport = useCallback((airport: Airport) => {
    setSelectedAirport(airport);
    smoothScrollToMap();
  }, []);

  const clamp = (n: number, min: number, max: number) =>
    Math.max(min, Math.min(max, n));
  const headlineOpacity = clamp(1 - progress / 0.22, 0, 1);
  const headlineY = -progress * 44;
  const mapOpacity = clamp((progress - 0.08) / 0.22, 0, 1);
  const mapScale = 0.92 + clamp((progress - 0.08) / 0.35, 0, 1) * 0.08;
  const hintOpacity = clamp(1 - (progress - 0.45) / 0.15, 0, 1);
  const hintProgress = Math.min(100, (progress / 0.55) * 100);
  const heroInactive = progress > 0.88;
  const heroBgOpacity = 1 - clamp(progress / 0.6, 0, 1);

  return (
    <>
      {/* Map Shell */}
      <div
        className="fixed inset-0 z-0 bg-bg"
        style={{
          opacity: mapOpacity,
          transform: `scale(${mapScale})`,
          transformOrigin: "center center",
          willChange: "transform, opacity",
        }}
      >
        <IndiaMap
          airports={AIRPORTS}
          selectedAirportId={selectedAirport?.iata ?? null}
          onSelectAirport={handleSelectAirport}
          setTooltip={setTooltip as any}
        />
      </div>

      {/* Hero */}
      <section
        className="fixed inset-0 z-20 overflow-hidden"
        style={{ pointerEvents: heroInactive ? "none" : "auto" }}
        aria-hidden={heroInactive}
      >
        <div
          className="absolute inset-0 bg-bg"
          style={{ opacity: heroBgOpacity }}
        />
        <div
          className="absolute inset-x-0 top-[22vh] md:top-[16vh] z-10 px-6 text-center pointer-events-none"
          style={{
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
            willChange: "transform, opacity",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-4 md:mb-6 w-10 h-10 md:w-14 md:h-14 text-ink"
            aria-hidden
          >
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
          </svg>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-ink leading-[1.1] md:leading-[1.05]">
            Every airport
            <br />
            in India
          </h1>
          <p className="mt-3 md:mt-5 text-sm md:text-base text-muted max-w-md mx-auto leading-relaxed">
            {AIRPORTS.length} airports across {AIRPORT_STATS.statesCovered}{" "}
            states & union territories —{" "}
            {formatNum(AIRPORT_STATS.totalPassengers)} passengers annually.
          </p>
        </div>
        <div
          className="absolute inset-x-0 bottom-[5.5vh] z-20 flex flex-col items-center gap-2.5 pointer-events-none"
          style={{ opacity: hintOpacity }}
          aria-hidden
        >
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-ink tracking-tight">
              Scroll to explore
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="text-ink"
              style={{ animation: "scroll-hint 1.8s ease-in-out infinite" }}
            >
              <path
                d="M3 4.5l3 3 3-3"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="relative w-40 h-[2px] rounded-full bg-ink/10 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-ink"
              style={{ width: `${hintProgress}%` }}
            />
          </div>
        </div>
      </section>

      <div className="h-[400vh]" aria-hidden />

      {/* Section 01 */}
      <section className="relative z-10 bg-white border-t border-black/[.06]">
        <div className="max-w-5xl mx-auto px-8 pt-20 pb-16">
          <div className="text-[13px] font-medium text-muted tracking-tight mb-2">
            01 · At a glance
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-ink tracking-tight leading-[1.1] mb-10">
            India&rsquo;s aviation at a glance
          </h2>
          <FadeInOnView>
            <SummaryBar airports={AIRPORTS} />
          </FadeInOnView>
        </div>
      </section>

      {/* Section 02 */}
      <section className="relative z-10 bg-bg border-t border-black/[.06]">
        <div className="max-w-5xl mx-auto px-8 py-20">
          <div className="text-[13px] font-medium text-muted tracking-tight mb-2">
            02 · Rankings
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-ink tracking-tight leading-[1.1] mb-10">
            Every airport we&rsquo;re tracking
          </h2>
          <FadeInOnView>
            <AirportTable airports={AIRPORTS} />
          </FadeInOnView>
        </div>
      </section>

      {/* Section 03 */}
      <section className="relative z-10 bg-white border-t border-black/[.06]">
        <div className="max-w-5xl mx-auto px-8 pt-20 pb-24">
          <div className="text-[13px] font-medium text-muted tracking-tight mb-2">
            03 · Connections
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-ink tracking-tight leading-[1.1] mb-10">
            Most connected city pairs
          </h2>
          <FadeInOnView>
            <RouteOverview />
          </FadeInOnView>
        </div>
      </section>

      {/* Section 04 */}
      <section className="relative z-10 bg-bg border-t border-black/[.06]">
        <div className="max-w-5xl mx-auto px-8 pt-20 pb-24">
          <div className="text-[13px] font-medium text-muted tracking-tight mb-2">
            04 · State breakdown
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-ink tracking-tight leading-[1.1] mb-3">
            State-by-state
          </h2>
          <FadeInOnView>
            <StatsOverview airports={AIRPORTS} />
          </FadeInOnView>
        </div>
      </section>

      {/* Section 05 — Airlines */}
      <section className="relative z-10 bg-white border-t border-black/[.06]">
        <div className="max-w-5xl mx-auto px-8 pt-20 pb-24">
          <div className="text-[13px] font-medium text-muted tracking-tight mb-2">
            05 · Airlines
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-ink tracking-tight leading-[1.1] mb-10">
            Indian carriers
          </h2>
          <FadeInOnView>
            <AirlinesOverview />
          </FadeInOnView>
        </div>
      </section>

      {/* Section 06 — Economics */}
      <section className="relative z-10 bg-bg border-t border-black/[.06]">
        <div className="max-w-5xl mx-auto px-8 pt-20 pb-24">
          <div className="text-[13px] font-medium text-muted tracking-tight mb-2">
            06 · Economics
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-ink tracking-tight leading-[1.1] mb-10">
            The business of flying
          </h2>
          <FadeInOnView>
            <EconomicsOverview />
          </FadeInOnView>
        </div>
      </section>

      {/* Section 07 — Pilot Training */}
      <section className="relative z-10 bg-white border-t border-black/[.06]">
        <div className="max-w-5xl mx-auto px-8 pt-20 pb-24">
          <div className="text-[13px] font-medium text-muted tracking-tight mb-2">
            07 · Pilot Training
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-ink tracking-tight leading-[1.1] mb-10">
            How to become a pilot in India
          </h2>
          <FadeInOnView>
            <PilotSchoolsOverview />
          </FadeInOnView>
        </div>
      </section>

      {/* Footer */}
      <section className="relative z-10 bg-bg border-t border-black/[.06]">
        <div className="max-w-5xl mx-auto px-8 py-10">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted">
            <span>Airport Stats</span>
            <div className="flex gap-6">
              <Link
                href="/compare"
                className="hover:text-ink transition-colors"
              >
                Compare
              </Link>
              <span>Methodology</span>
              <span>Contact</span>
            </div>
            <span>Data from Wikipedia, AAI, DGCA, OpenSky Network</span>
          </div>
          <div className="mt-4 pt-4 border-t border-black/[.06] text-[11px] text-muted/60">
            Built with Next.js, React, Tailwind CSS, react-simple-maps ·
            Aviation data from AAI Annual Reports, DGCA, Wikipedia
          </div>
        </div>
      </section>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none animate-popup-enter"
          style={{ left: tooltip.x + 12, top: tooltip.y - 10 }}
        >
          <div className="bg-white rounded-xl shadow-lg border border-black/[.08] px-4 py-3 max-w-[280px]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono text-muted">
                {tooltip.airport.iata}
              </span>
              <span className="text-[10px] text-muted capitalize px-1.5 py-0.5 rounded bg-black/[.04]">
                {tooltip.airport.type}
              </span>
            </div>
            <div className="text-sm font-semibold text-ink leading-tight">
              {tooltip.airport.name}
            </div>
            <div className="text-xs text-muted mt-1">
              {tooltip.airport.city}, {tooltip.airport.state}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs">
              <span className="text-muted">Passengers</span>
              <span className="text-ink font-medium text-right">
                {formatNum(tooltip.airport.passengers)}
              </span>
              <span className="text-muted">Cargo</span>
              <span className="text-ink font-medium text-right">
                {formatNum(tooltip.airport.cargo)}t
              </span>
              <span className="text-muted">Runways</span>
              <span className="text-ink font-medium text-right">
                {tooltip.airport.runways}
              </span>
              <span className="text-muted">Daily flights</span>
              <span className="text-ink font-medium text-right">
                ~{tooltip.airport.avgDailyFlights}
              </span>
            </div>
            {tooltip.airport.notables && (
              <div className="mt-2 pt-2 border-t border-black/[.04] text-[11px] text-muted leading-snug">
                {tooltip.airport.notables}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
