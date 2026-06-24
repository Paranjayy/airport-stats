"use client";

import { useState } from "react";
import { PILOT_SCHOOLS, DGCA_INFO } from "@/lib/aviation-data";

export default function PilotSchoolsOverview() {
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<string | null>(null);

  const types = ["all", ...new Set(PILOT_SCHOOLS.map((s) => s.type))];
  const filtered = filter === "all" ? PILOT_SCHOOLS : PILOT_SCHOOLS.filter((s) => s.type === filter);

  return (
    <div className="space-y-8">
      {/* DGCA Info */}
      <div className="rounded-xl border border-black/[.06] bg-white p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">DGCA</div>
          <div>
            <div className="text-sm font-semibold text-ink">Directorate General of Civil Aviation</div>
            <div className="text-xs text-muted">Est. {DGCA_INFO.established} · {DGCA_INFO.headquarters}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* License types */}
          <div>
            <div className="text-xs font-medium text-muted mb-2">Pilot License Types</div>
            <div className="space-y-2">
              {DGCA_INFO.pilotLicenseTypes.map((lic) => (
                <div key={lic.type} className="flex items-center gap-3 p-2 rounded-lg bg-bg text-xs">
                  <span className="font-mono font-medium text-ink w-12">{lic.type}</span>
                  <div>
                    <div className="text-ink font-medium">{lic.name}</div>
                    <div className="text-muted">{lic.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div>
            <div className="text-xs font-medium text-muted mb-2">Medical Requirements</div>
            <div className="space-y-2">
              {DGCA_INFO.medicalRequirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-bg text-xs text-ink">
                  <svg width="12" height="12" viewBox="0 0 12 12" className="text-green-500 flex-shrink-0">
                    <path d="M2 6l3 3 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {req}
                </div>
              ))}
            </div>

            <div className="mt-4 text-xs font-medium text-muted mb-2">Key Regulations</div>
            <div className="space-y-1">
              {DGCA_INFO.responsibilities.slice(0, 4).map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-muted">
                  <span className="w-1 h-1 rounded-full bg-ink/30" />
                  {r}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Training Schools */}
      <div>
        <h3 className="text-sm font-semibold text-ink mb-3">DGCA-Approved Training Schools</h3>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-4">
          {types.map((t) => (
            <button key={t} onClick={() => setFilter(t)} className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${filter === t ? "bg-ink text-white" : "bg-bg text-muted hover:text-ink"}`}>
              {t === "all" ? "All" : t.replace("-", " ")}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map((school) => {
            const isOpen = selected === school.name;
            return (
              <div key={school.name} className="rounded-xl border border-black/[.06] bg-white overflow-hidden">
                <button onClick={() => setSelected(isOpen ? null : school.name)} className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-bg/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-ink">{school.name}</div>
                    <div className="text-xs text-muted mt-0.5">{school.location}, {school.state} · Est. {school.established}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <svg key={i} width="12" height="12" viewBox="0 0 12 12" className={i < school.rating ? "text-amber-400" : "text-ink/10"}>
                        <path d="M6 1l1.545 3.13L11 4.635 8.5 7.175l.59 3.44L6 8.885 2.91 10.615l.59-3.44L1 4.635l3.455-.505L6 1z" fill="currentColor" />
                      </svg>
                    ))}
                  </div>
                  <svg width="12" height="12" viewBox="0 0 12 12" className={`text-muted transition-transform ${isOpen ? "rotate-90" : ""}`}>
                    <path d="M4.5 2.5l3.5 3.5-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="border-t border-black/[.06] px-5 py-3 bg-bg/30">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
                      <div><div className="text-muted">Type</div><div className="text-ink font-medium capitalize mt-0.5">{school.type}</div></div>
                      <div><div className="text-muted">Courses</div><div className="text-ink font-medium mt-0.5">{school.courses.join(", ")}</div></div>
                      <div><div className="text-muted">Duration</div><div className="text-ink font-medium mt-0.5">{school.duration}</div></div>
                      <div><div className="text-muted">Fees</div><div className="text-ink font-medium mt-0.5">{school.fees}</div></div>
                    </div>
                    <div className="text-xs text-muted italic">{school.notables}</div>
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
