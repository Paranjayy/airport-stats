import {
  formatPassengers,
  formatCargo,
  formatRunwayLength,
  airportTypeLabel,
  filterAirports,
  filterRoutes,
  sortByPassengers,
  haversineDistance,
  type Airport,
  type Route,
  type AirportWithStats,
} from "@/lib/database";

describe("Database Utility Functions", () => {
  describe("formatPassengers", () => {
    it("formats billions correctly", () => {
      expect(formatPassengers(1_500_000_000)).toBe("1.5B");
      expect(formatPassengers(2_000_000_000)).toBe("2.0B");
      expect(formatPassengers(10_000_000_000)).toBe("10.0B");
    });

    it("formats millions correctly", () => {
      expect(formatPassengers(73_000_000)).toBe("73.0M");
      expect(formatPassengers(1_500_000)).toBe("1.5M");
      expect(formatPassengers(10_000_000)).toBe("10.0M");
    });

    it("formats thousands correctly", () => {
      expect(formatPassengers(500_000)).toBe("500.0K");
      expect(formatPassengers(1_000)).toBe("1.0K");
      expect(formatPassengers(999_999)).toBe("1000.0K");
    });

    it("formats small numbers correctly", () => {
      expect(formatPassengers(500)).toBe("500");
      expect(formatPassengers(100)).toBe("100");
      expect(formatPassengers(0)).toBe("0");
    });
  });

  describe("formatCargo", () => {
    it("formats millions correctly", () => {
      expect(formatCargo(2_500_000)).toBe("2.5M t");
      expect(formatCargo(1_000_000)).toBe("1.0M t");
    });

    it("formats thousands correctly", () => {
      expect(formatCargo(970_000)).toBe("970.0K t");
      expect(formatCargo(1_000)).toBe("1.0K t");
    });

    it("formats small numbers correctly", () => {
      expect(formatCargo(500)).toBe("500 t");
      expect(formatCargo(100)).toBe("100 t");
      expect(formatCargo(0)).toBe("0 t");
    });
  });

  describe("formatRunwayLength", () => {
    it("formats feet with meters conversion", () => {
      expect(formatRunwayLength(10_000)).toBe("10,000 ft (3,048 m)");
      expect(formatRunwayLength(3_000)).toBe("3,000 ft (914 m)");
    });

    it("returns null for null input", () => {
      expect(formatRunwayLength(null)).toBeNull();
    });

    it("returns null for zero", () => {
      expect(formatRunwayLength(0)).toBeNull();
    });
  });

  describe("airportTypeLabel", () => {
    it("returns correct labels for known types", () => {
      expect(airportTypeLabel("international")).toBe("International Airport");
      expect(airportTypeLabel("domestic")).toBe("Domestic Airport");
      expect(airportTypeLabel("civil")).toBe("Civil Airport");
    });

    it("returns the type itself for unknown types", () => {
      expect(airportTypeLabel("military" as any)).toBe("military");
    });
  });

  describe("filterAirports", () => {
    const testAirports: Airport[] = [
      {
        id: 1,
        iata_code: "DEL",
        icao_code: "VIDP",
        name: "Indira Gandhi International Airport",
        city: "New Delhi",
        state: "Delhi",
        country: "India",
        latitude: 28.5562,
        longitude: 77.1,
        elevation_ft: 777,
        timezone: "Asia/Kolkata",
        airport_type: "international",
        owner: "Airports Authority of India",
        operator: "Delhi International Airport Limited",
        terminal_count: 3,
        gate_count: 153,
        runway_count: 3,
        runway_length_ft: 14_534,
        runway_surface: "Asphalt",
        website: "https://www.delhiairport.com",
        wikipedia_url: "https://en.wikipedia.org/wiki/Indira_Gandhi_International_Airport",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
      {
        id: 2,
        iata_code: "BOM",
        icao_code: "VABB",
        name: "Chhatrapati Shivaji Maharaj International Airport",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        latitude: 19.0896,
        longitude: 72.8656,
        elevation_ft: 39,
        timezone: "Asia/Kolkata",
        airport_type: "international",
        owner: "Airports Authority of India",
        operator: "Chhatrapati Shivaji International Airport Limited",
        terminal_count: 2,
        gate_count: 82,
        runway_count: 2,
        runway_length_ft: 12_007,
        runway_surface: "Asphalt",
        website: "https://www.csiairport.com",
        wikipedia_url: "https://en.wikipedia.org/wiki/Chhatrapati_Shivaji_Maharaj_International_Airport",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
      {
        id: 3,
        iata_code: "GOI",
        icao_code: "VOGO",
        name: "Goa International Airport",
        city: "Goa",
        state: "Goa",
        country: "India",
        latitude: 15.3809,
        longitude: 73.8314,
        elevation_ft: 184,
        timezone: "Asia/Kolkata",
        airport_type: "domestic",
        owner: "Airports Authority of India",
        operator: null,
        terminal_count: 1,
        gate_count: 10,
        runway_count: 1,
        runway_length_ft: 11_155,
        runway_surface: "Asphalt",
        website: null,
        wikipedia_url: "https://en.wikipedia.org/wiki/Goa_International_Airport",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
    ];

    it("returns all airports when no filter is applied", () => {
      expect(filterAirports(testAirports, {})).toHaveLength(3);
    });

    it("filters by city", () => {
      const result = filterAirports(testAirports, { city: "Mumbai" });
      expect(result).toHaveLength(1);
      expect(result[0].iata_code).toBe("BOM");
    });

    it("filters by city case-insensitive", () => {
      const result = filterAirports(testAirports, { city: "mumbai" });
      expect(result).toHaveLength(1);
      expect(result[0].iata_code).toBe("BOM");
    });

    it("filters by state", () => {
      const result = filterAirports(testAirports, { state: "Goa" });
      expect(result).toHaveLength(1);
      expect(result[0].iata_code).toBe("GOI");
    });

    it("filters by airport_type", () => {
      const result = filterAirports(testAirports, { airport_type: "domestic" });
      expect(result).toHaveLength(1);
      expect(result[0].iata_code).toBe("GOI");
    });

    it("filters by search term in name", () => {
      const result = filterAirports(testAirports, { search: "Indira" });
      expect(result).toHaveLength(1);
      expect(result[0].iata_code).toBe("DEL");
    });

    it("filters by search term in city", () => {
      const result = filterAirports(testAirports, { search: "Goa" });
      expect(result).toHaveLength(1);
      expect(result[0].iata_code).toBe("GOI");
    });

    it("filters by search term in IATA code", () => {
      const result = filterAirports(testAirports, { search: "BOM" });
      expect(result).toHaveLength(1);
      expect(result[0].iata_code).toBe("BOM");
    });

    it("filters by search term in ICAO code", () => {
      const result = filterAirports(testAirports, { search: "VIDP" });
      expect(result).toHaveLength(1);
      expect(result[0].iata_code).toBe("DEL");
    });

    it("combines multiple filters", () => {
      const result = filterAirports(testAirports, {
        airport_type: "international",
        state: "Delhi",
      });
      expect(result).toHaveLength(1);
      expect(result[0].iata_code).toBe("DEL");
    });

    it("returns empty array when no matches", () => {
      const result = filterAirports(testAirports, { city: "Chennai" });
      expect(result).toHaveLength(0);
    });
  });

  describe("filterRoutes", () => {
    const testAirports: Airport[] = [
      {
        id: 1,
        iata_code: "DEL",
        icao_code: "VIDP",
        name: "Delhi Airport",
        city: "New Delhi",
        state: "Delhi",
        country: "India",
        latitude: 28.5562,
        longitude: 77.1,
        elevation_ft: 777,
        timezone: "Asia/Kolkata",
        airport_type: "international",
        owner: null,
        operator: null,
        terminal_count: null,
        gate_count: null,
        runway_count: null,
        runway_length_ft: null,
        runway_surface: null,
        website: null,
        wikipedia_url: null,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
      {
        id: 2,
        iata_code: "BOM",
        icao_code: "VABB",
        name: "Mumbai Airport",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        latitude: 19.0896,
        longitude: 72.8656,
        elevation_ft: 39,
        timezone: "Asia/Kolkata",
        airport_type: "international",
        owner: null,
        operator: null,
        terminal_count: null,
        gate_count: null,
        runway_count: null,
        runway_length_ft: null,
        runway_surface: null,
        website: null,
        wikipedia_url: null,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
    ];

    const testRoutes: Route[] = [
      {
        id: 1,
        origin_airport_id: 1,
        dest_airport_id: 2,
        distance_km: 1150,
        flight_time_min: 120,
        carriers: "IndiGo, Air India",
        frequency: "Daily",
        aircraft_used: "A320, B737",
        is_active: 1,
        source: "DGCA",
        created_at: "2024-01-01T00:00:00Z",
      },
      {
        id: 2,
        origin_airport_id: 2,
        dest_airport_id: 1,
        distance_km: 1150,
        flight_time_min: 125,
        carriers: "IndiGo, SpiceJet",
        frequency: "Daily",
        aircraft_used: "A320, B737",
        is_active: 1,
        source: "DGCA",
        created_at: "2024-01-01T00:00:00Z",
      },
      {
        id: 3,
        origin_airport_id: 1,
        dest_airport_id: 2,
        distance_km: 1150,
        flight_time_min: 120,
        carriers: "Air India",
        frequency: "Daily",
        aircraft_used: "B787",
        is_active: 0,
        source: "DGCA",
        created_at: "2024-01-01T00:00:00Z",
      },
    ];

    it("returns all routes when no filter is applied", () => {
      expect(filterRoutes(testRoutes, testAirports, {})).toHaveLength(3);
    });

    it("filters by origin IATA", () => {
      const result = filterRoutes(testRoutes, testAirports, { origin_iata: "DEL" });
      expect(result).toHaveLength(2);
      expect(result.every((r) => r.origin_airport_id === 1)).toBe(true);
    });

    it("filters by destination IATA", () => {
      const result = filterRoutes(testRoutes, testAirports, { dest_iata: "BOM" });
      expect(result).toHaveLength(3);
      expect(result.every((r) => r.dest_airport_id === 2)).toBe(true);
    });

    it("filters by active status", () => {
      const result = filterRoutes(testRoutes, testAirports, { is_active: true });
      expect(result).toHaveLength(2);
      expect(result.every((r) => r.is_active === 1)).toBe(true);
    });

    it("filters by inactive status", () => {
      const result = filterRoutes(testRoutes, testAirports, { is_active: false });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(3);
    });

    it("filters by minimum distance", () => {
      const result = filterRoutes(testRoutes, testAirports, { min_distance_km: 1200 });
      expect(result).toHaveLength(0);
    });

    it("filters by maximum distance", () => {
      const result = filterRoutes(testRoutes, testAirports, { max_distance_km: 1000 });
      expect(result).toHaveLength(0);
    });

    it("combines multiple filters", () => {
      const result = filterRoutes(testRoutes, testAirports, {
        origin_iata: "DEL",
        is_active: true,
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });
  });

  describe("sortByPassengers", () => {
    it("sorts airports by passenger count descending", () => {
      const airports: AirportWithStats[] = [
        {
          id: 1,
          iata_code: "GOI",
          icao_code: null,
          name: "Goa Airport",
          city: "Goa",
          state: "Goa",
          country: "India",
          latitude: 0,
          longitude: 0,
          elevation_ft: null,
          timezone: "Asia/Kolkata",
          airport_type: "domestic",
          owner: null,
          operator: null,
          terminal_count: null,
          gate_count: null,
          runway_count: null,
          runway_length_ft: null,
          runway_surface: null,
          website: null,
          wikipedia_url: null,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          stats: {
            id: 1,
            airport_id: 1,
            year: 2023,
            passengers: 5_000_000,
            cargo_tonnes: 10_000,
            aircraft_movements: 40_000,
            domestic_passengers: 4_500_000,
            international_passengers: 500_000,
            source: "DGCA",
            created_at: "2024-01-01T00:00:00Z",
          },
        },
        {
          id: 2,
          iata_code: "DEL",
          icao_code: "VIDP",
          name: "Delhi Airport",
          city: "New Delhi",
          state: "Delhi",
          country: "India",
          latitude: 0,
          longitude: 0,
          elevation_ft: null,
          timezone: "Asia/Kolkata",
          airport_type: "international",
          owner: null,
          operator: null,
          terminal_count: null,
          gate_count: null,
          runway_count: null,
          runway_length_ft: null,
          runway_surface: null,
          website: null,
          wikipedia_url: null,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          stats: {
            id: 2,
            airport_id: 2,
            year: 2023,
            passengers: 73_000_000,
            cargo_tonnes: 970_000,
            aircraft_movements: 450_000,
            domestic_passengers: 60_000_000,
            international_passengers: 13_000_000,
            source: "DGCA",
            created_at: "2024-01-01T00:00:00Z",
          },
        },
      ];

      const sorted = sortByPassengers(airports);
      expect(sorted[0].iata_code).toBe("DEL");
      expect(sorted[1].iata_code).toBe("GOI");
    });

    it("handles airports with null stats", () => {
      const airports: AirportWithStats[] = [
        {
          id: 1,
          iata_code: "GOI",
          icao_code: null,
          name: "Goa Airport",
          city: "Goa",
          state: "Goa",
          country: "India",
          latitude: 0,
          longitude: 0,
          elevation_ft: null,
          timezone: "Asia/Kolkata",
          airport_type: "domestic",
          owner: null,
          operator: null,
          terminal_count: null,
          gate_count: null,
          runway_count: null,
          runway_length_ft: null,
          runway_surface: null,
          website: null,
          wikipedia_url: null,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          stats: null,
        },
        {
          id: 2,
          iata_code: "DEL",
          icao_code: "VIDP",
          name: "Delhi Airport",
          city: "New Delhi",
          state: "Delhi",
          country: "India",
          latitude: 0,
          longitude: 0,
          elevation_ft: null,
          timezone: "Asia/Kolkata",
          airport_type: "international",
          owner: null,
          operator: null,
          terminal_count: null,
          gate_count: null,
          runway_count: null,
          runway_length_ft: null,
          runway_surface: null,
          website: null,
          wikipedia_url: null,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          stats: {
            id: 2,
            airport_id: 2,
            year: 2023,
            passengers: 73_000_000,
            cargo_tonnes: 970_000,
            aircraft_movements: 450_000,
            domestic_passengers: 60_000_000,
            international_passengers: 13_000_000,
            source: "DGCA",
            created_at: "2024-01-01T00:00:00Z",
          },
        },
      ];

      const sorted = sortByPassengers(airports);
      expect(sorted[0].iata_code).toBe("DEL");
      expect(sorted[1].iata_code).toBe("GOI");
    });

    it("does not mutate the original array", () => {
      const airports: AirportWithStats[] = [
        {
          id: 1,
          iata_code: "GOI",
          icao_code: null,
          name: "Goa Airport",
          city: "Goa",
          state: "Goa",
          country: "India",
          latitude: 0,
          longitude: 0,
          elevation_ft: null,
          timezone: "Asia/Kolkata",
          airport_type: "domestic",
          owner: null,
          operator: null,
          terminal_count: null,
          gate_count: null,
          runway_count: null,
          runway_length_ft: null,
          runway_surface: null,
          website: null,
          wikipedia_url: null,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          stats: {
            id: 1,
            airport_id: 1,
            year: 2023,
            passengers: 5_000_000,
            cargo_tonnes: 10_000,
            aircraft_movements: 40_000,
            domestic_passengers: 4_500_000,
            international_passengers: 500_000,
            source: "DGCA",
            created_at: "2024-01-01T00:00:00Z",
          },
        },
      ];

      const original = [...airports];
      sortByPassengers(airports);
      expect(airports).toEqual(original);
    });
  });

  describe("haversineDistance", () => {
    it("calculates distance between Delhi and Mumbai", () => {
      // Delhi: 28.5562°N, 77.1°E
      // Mumbai: 19.0896°N, 72.8656°E
      const distance = haversineDistance(28.5562, 77.1, 19.0896, 72.8656);
      // Expected: ~1150 km
      expect(distance).toBeGreaterThan(1100);
      expect(distance).toBeLessThan(1200);
    });

    it("returns 0 for same coordinates", () => {
      const distance = haversineDistance(28.5562, 77.1, 28.5562, 77.1);
      expect(distance).toBe(0);
    });

    it("calculates distance between distant points", () => {
      // Delhi to London: ~6700 km
      const distance = haversineDistance(28.5562, 77.1, 51.5074, -0.1278);
      expect(distance).toBeGreaterThan(6500);
      expect(distance).toBeLessThan(7000);
    });

    it("handles antipodal points", () => {
      // Opposite sides of the earth
      const distance = haversineDistance(0, 0, 0, 180);
      // Should be half circumference: ~20015 km
      expect(distance).toBeGreaterThan(20000);
      expect(distance).toBeLessThan(20100);
    });
  });
});
