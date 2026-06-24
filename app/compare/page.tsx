"use client";

import Link from "next/link";
import FadeInOnView from "@/components/ui/FadeInOnView";
import AirportComparison from "@/components/comparison/AirportComparison";

/**
 * Airport comparison page — compare multiple airports side by side.
 * Uses the same section design pattern as the main page.
 */
export default function ComparePage() {
  return (
    <>
      {/* Header */}
      <header className="h-12 bg-white/70 backdrop-blur-xl border-b border-black/[.06] px-6 flex items-center justify-between fixed top-0 left-0 right-0 z-40">
        <Link href="/" className="text-sm font-semibold text-ink">
          AIRPORT DATA
        </Link>
        <nav className="flex items-center gap-6 text-xs text-muted">
          <Link href="/" className="hover:text-ink transition-colors">
            Home
          </Link>
          <Link href="/compare" className="text-ink font-medium">
            Compare
          </Link>
          <Link href="/about" className="hover:text-ink transition-colors">
            About
          </Link>
        </nav>
      </header>

      {/* Main content */}
      <main className="pt-12">
        <section className="relative z-10 bg-bg">
          <div className="max-w-5xl mx-auto px-8 pt-20 pb-24">
            <div className="text-[13px] font-medium text-muted tracking-tight mb-2">
              Airport Comparison
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-ink tracking-tight leading-[1.1] mb-3">
              Compare airports
            </h1>
            <p className="text-[15px] text-muted leading-relaxed max-w-[42rem] mb-10">
              Select 2–4 airports and compare their passenger volumes, cargo
              tonnage, aircraft movements, and growth rates side by side.
            </p>
            <FadeInOnView>
              <AirportComparison />
            </FadeInOnView>
          </div>
        </section>

        {/* Footer */}
        <section className="relative z-10 bg-white border-t border-black/[.06]">
          <div className="max-w-5xl mx-auto px-8 py-10 flex flex-wrap items-center justify-between gap-4 text-xs text-muted">
            <span>Airport Data</span>
            <div className="flex gap-6">
              <Link href="/" className="hover:text-ink transition-colors">
                Home
              </Link>
              <Link href="/about" className="hover:text-ink transition-colors">
                About
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
