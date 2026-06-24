"use client";

const ROUTES = [
  {
    from: "DEL",
    to: "BOM",
    fromCity: "New Delhi",
    toCity: "Mumbai",
    distance: 1150,
    carriers: "IndiGo, Air India, Vistara, SpiceJet",
    frequency: "300+/week",
  },
  {
    from: "DEL",
    to: "BLR",
    fromCity: "New Delhi",
    toCity: "Bengaluru",
    distance: 1740,
    carriers: "IndiGo, Air India, Vistara, Akasa",
    frequency: "200+/week",
  },
  {
    from: "BOM",
    to: "BLR",
    fromCity: "Mumbai",
    toCity: "Bengaluru",
    distance: 840,
    carriers: "IndiGo, Air India, Vistara, Akasa",
    frequency: "200+/week",
  },
  {
    from: "DEL",
    to: "HYD",
    fromCity: "New Delhi",
    toCity: "Hyderabad",
    distance: 1260,
    carriers: "IndiGo, Air India, Vistara, Akasa",
    frequency: "180+/week",
  },
  {
    from: "BOM",
    to: "HYD",
    fromCity: "Mumbai",
    toCity: "Hyderabad",
    distance: 710,
    carriers: "IndiGo, Air India, Vistara, Akasa",
    frequency: "150+/week",
  },
  {
    from: "DEL",
    to: "MAA",
    fromCity: "New Delhi",
    toCity: "Chennai",
    distance: 1760,
    carriers: "IndiGo, Air India, SpiceJet",
    frequency: "150+/week",
  },
  {
    from: "BOM",
    to: "MAA",
    fromCity: "Mumbai",
    toCity: "Chennai",
    distance: 1030,
    carriers: "IndiGo, Air India, Vistara, SpiceJet",
    frequency: "120+/week",
  },
  {
    from: "DEL",
    to: "CCU",
    fromCity: "New Delhi",
    toCity: "Kolkata",
    distance: 1300,
    carriers: "IndiGo, Air India, Vistara",
    frequency: "120+/week",
  },
  {
    from: "BOM",
    to: "CCU",
    fromCity: "Mumbai",
    toCity: "Kolkata",
    distance: 1660,
    carriers: "IndiGo, Air India, Vistara",
    frequency: "80+/week",
  },
  {
    from: "BLR",
    to: "HYD",
    fromCity: "Bengaluru",
    toCity: "Hyderabad",
    distance: 500,
    carriers: "IndiGo, Air India, Akasa",
    frequency: "100+/week",
  },
  {
    from: "DEL",
    to: "JAI",
    fromCity: "New Delhi",
    toCity: "Jaipur",
    distance: 470,
    carriers: "IndiGo, Air India, SpiceJet",
    frequency: "100+/week",
  },
  {
    from: "BOM",
    to: "AMD",
    fromCity: "Mumbai",
    toCity: "Ahmedabad",
    distance: 520,
    carriers: "IndiGo, Air India, Akasa",
    frequency: "80+/week",
  },
  {
    from: "DEL",
    to: "AMD",
    fromCity: "New Delhi",
    toCity: "Ahmedabad",
    distance: 930,
    carriers: "IndiGo, Air India, Vistara",
    frequency: "80+/week",
  },
  {
    from: "BLR",
    to: "MAA",
    fromCity: "Bengaluru",
    toCity: "Chennai",
    distance: 275,
    carriers: "IndiGo, Air India, Akasa",
    frequency: "80+/week",
  },
  {
    from: "DEL",
    to: "COK",
    fromCity: "New Delhi",
    toCity: "Kochi",
    distance: 2050,
    carriers: "IndiGo, Air India, Vistara",
    frequency: "70+/week",
  },
];

export default function RouteOverview() {
  const maxDist = Math.max(...ROUTES.map((r) => r.distance));

  return (
    <div className="space-y-2">
      {ROUTES.map((r, i) => (
        <div
          key={`${r.from}-${r.to}`}
          className="flex items-center gap-4 px-5 py-3 rounded-xl border border-black/[.06] bg-white hover:bg-bg/50 transition-colors"
        >
          <span className="text-xs text-muted w-6 text-right">{i + 1}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-mono font-medium text-ink">{r.from}</span>
              <span className="text-muted">→</span>
              <span className="font-mono font-medium text-ink">{r.to}</span>
            </div>
            <div className="text-xs text-muted mt-0.5">
              {r.fromCity} – {r.toCity}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-sm font-medium text-ink">{r.frequency}</div>
            <div className="text-xs text-muted">{r.distance} km</div>
          </div>
          <div className="w-32 hidden sm:block flex-shrink-0">
            <div className="h-1.5 rounded-full bg-ink/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-ink/15"
                style={{ width: `${(r.distance / maxDist) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
      <div className="text-xs text-muted mt-4">
        Top 15 busiest domestic routes by weekly frequency. Data from DGCA 2023.
      </div>
    </div>
  );
}
