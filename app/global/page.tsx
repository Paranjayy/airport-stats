"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import FadeInOnView from "@/components/ui/FadeInOnView";

const GlobalMap = dynamic(() => import("@/components/map/GlobalMap"), {
  ssr: false,
  loading: () => <div className="h-96 bg-bg rounded-xl animate-pulse" />,
});

export default function GlobalPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="border-b border-black/[.06] bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-muted hover:text-ink transition-colors">← Back</Link>
            <div>
              <h1 className="text-2xl font-semibold text-ink tracking-tight">Global Aviation</h1>
              <p className="text-sm text-muted mt-1">World airports, airlines, and country comparison</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <FadeInOnView><GlobalMap /></FadeInOnView>
      </div>
    </div>
  );
}
