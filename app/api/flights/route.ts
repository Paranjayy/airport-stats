import { NextResponse } from "next/server";
import { searchFlights } from "@/lib/flights";

/**
 * API route for flight data.
 *
 * GET /api/flights?origin=DEL&destination=BOM
 * GET /api/flights?origin=DEL
 * GET /api/flights
 *
 * Returns simulated flight data. In production, replace with a real
 * aviation data provider (AeroDataBox, FlightAware, etc.).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = searchParams.get("origin") ?? undefined;
  const destination = searchParams.get("destination") ?? undefined;

  // Validate IATA codes if provided
  const iataPattern = /^[A-Z]{3}$/;
  if (origin && !iataPattern.test(origin)) {
    return NextResponse.json(
      { error: "Invalid origin airport code. Must be a 3-letter IATA code." },
      { status: 400 },
    );
  }
  if (destination && !iataPattern.test(destination)) {
    return NextResponse.json(
      { error: "Invalid destination airport code. Must be a 3-letter IATA code." },
      { status: 400 },
    );
  }

  const result = searchFlights(origin, destination);

  return NextResponse.json({
    ...result,
    timestamp: new Date().toISOString(),
    disclaimer:
      "Simulated data for demonstration. In production, this would connect to a live flight data API.",
  });
}
