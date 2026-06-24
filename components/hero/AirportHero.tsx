"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

// IndiaMap uses d3-geo projections that produce different SSR vs client
// paths — load client-only to avoid hydration mismatches.
const IndiaMap = dynamic(() => import("@/components/map/IndiaMap"), {
  ssr: false,
  loading: () => <div className="absolute inset-0" aria-hidden />,
});

import type { AirportData, AirportTooltip } from "@/components/map/IndiaMap";
import { AirportTooltipCard } from "@/components/map/IndiaMap";
import type { SetGenericTooltip } from "@/lib/map-utils";
import { AIRPORT_SIZE_BANDS, AIRPORT_TYPE_COLOR } from "@/lib/map-utils";

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

/* ------------------------------------------------------------------ */
/*  Props                                                               */
/* ------------------------------------------------------------------ */

interface AirportHeroProps {
  progress: number;
  airports: AirportData[];
  tooltip: AirportTooltip | null;
  setTooltip: SetGenericTooltip<AirportTooltip>;
  onSelectAirport?: (airport: AirportData) => void;
  selectedAirportId?: number | null;
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export default function AirportHero({
  progress,
  airports,
  tooltip,
  setTooltip,
  onSelectAirport,
  selectedAirportId,
}: AirportHeroProps) {
  // Scroll-driven reveal — same easing model as the track-policy Hero.
  // Headline fades in first, map follows, scroll hint leads the eye.
  const headlineOpacity = clamp(1 - progress / 0.22, 0, 1);
  const headlineY = -progress * 44;

  // Map starts fading in once headline is mostly settled.
  const mapOpacity = clamp((progress - 0.08) / 0.22, 0, 1);
  const mapScale = 0.92 + clamp((progress - 0.08) / 0.35, 0, 1) * 0.08;

  // Scroll hint stays visible until the user is well into the map.
  const hintOpacity = clamp(1 - (progress - 0.45) / 0.15, 0, 1);
  const hintProgress = Math.min(100, (progress / 0.55) * 100);

  // Page bounce on idle — same pattern as track-policy Hero.
  useEffect(() => {
    let userScrolled = false;
    let bouncing = false;
    const onScroll = () => {
      if (!bouncing) userScrolled = true;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const startTimer = window.setTimeout(() => {
      if (userScrolled) return;
      bouncing = true;
      window.scrollTo({
        top: Math.round(window.innerHeight * 0.12),
        behavior: "smooth",
      });
      window.setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 700);
    }, 2800);
    return () => {
      window.clearTimeout(startTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Once the scroll is deep enough the hero is purely decorative — kill
  // pointer events so clicks fall through to the map below.
  const inactive = progress > 0.88;

  return (
    <section
      className="fixed inset-0 z-20 overflow-hidden"
      style={{ pointerEvents: inactive ? "none" : "auto" }}
      aria-hidden={inactive}
    >
      {/* Background — fades to reveal the map layer underneath. */}
      <div
        className="absolute inset-0 bg-bg"
        style={{ opacity: 1 - clamp(progress / 0.6, 0, 1) }}
      />

      {/* -------- Headline -------- */}
      <div
        className="absolute inset-x-0 top-[22vh] md:top-[16vh] z-10 px-6 text-center pointer-events-none"
        style={{
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
          willChange: "transform, opacity",
        }}
      >
        {/* Plane icon — simple, clean SVG */}
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
          India&rsquo;s airport
          <br />
          network
        </h1>
        <p className="mt-3 md:mt-5 text-sm md:text-base text-muted max-w-md mx-auto leading-relaxed">
          28 airports across the subcontinent — from Indira Gandhi International
          to Salem.
        </p>
      </div>

      {/* -------- Map -------- */}
      <div
        className="absolute inset-x-0 top-[44vh] md:top-[38vh] z-0 flex justify-center"
        style={{
          opacity: mapOpacity,
          transform: `scale(${mapScale})`,
          transformOrigin: "center top",
          willChange: "transform, opacity",
        }}
      >
        <div className="w-[92vw] md:w-[72vw] max-w-[960px] aspect-[960/560]">
          <IndiaMap
            airports={airports}
            setTooltip={setTooltip}
            onSelectAirport={onSelectAirport}
            selectedAirportId={selectedAirportId}
          />
        </div>
      </div>

      {/* -------- Scroll hint -------- */}
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

      {/* -------- Floating tooltip -------- */}
      {tooltip && <AirportTooltipCard tooltip={tooltip} />}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Legend — render below the hero or inline in a section.              */
/* ------------------------------------------------------------------ */

export function AirportLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-[12px] text-muted">
      {/* Type colours */}
      <div className="flex items-center gap-3">
        {(Object.entries(AIRPORT_TYPE_COLOR) as [string, string][]).map(
          ([type, color]) => (
            <div key={type} className="flex items-center gap-1.5">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="capitalize">{type}</span>
            </div>
          ),
        )}
      </div>

      {/* Separator */}
      <div className="w-px h-3 bg-black/10" />

      {/* Size legend */}
      <div className="flex items-center gap-3">
        {AIRPORT_SIZE_BANDS.map((band) => (
          <div key={band.r} className="flex items-center gap-1.5">
            <span
              className="inline-block rounded-full bg-ink/20"
              style={{
                width: band.r * 2,
                height: band.r * 2,
              }}
            />
            <span>{`${band.r}px`}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
