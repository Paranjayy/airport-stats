import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import AirportTable from "@/components/sections/AirportTable";

// Mock the map-utils functions
jest.mock("@/lib/map-utils", () => ({
  formatPassengers: jest.fn((n: number) => {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return String(n);
  }),
  formatCargo: jest.fn((t: number) => {
    if (t >= 1_000_000) return `${(t / 1_000_000).toFixed(1)}M t`;
    if (t >= 1_000) return `${(t / 1_000).toFixed(0)}K t`;
    return `${t} t`;
  }),
}));

const mockAirports = [
  {
    iata: "DEL",
    name: "Indira Gandhi International Airport",
    city: "New Delhi",
    state: "Delhi",
    type: "international",
    passengers: 73_000_000,
    cargo: 970_000,
    movements: 450_000,
    domestic: 60_000_000,
    international: 13_000_000,
  },
  {
    iata: "BOM",
    name: "Chhatrapati Shivaji Maharaj International Airport",
    city: "Mumbai",
    state: "Maharashtra",
    type: "international",
    passengers: 52_000_000,
    cargo: 850_000,
    movements: 380_000,
    domestic: 42_000_000,
    international: 10_000_000,
  },
  {
    iata: "BLR",
    name: "Kempegowda International Airport",
    city: "Bengaluru",
    state: "Karnataka",
    type: "international",
    passengers: 38_000_000,
    cargo: 420_000,
    movements: 290_000,
    domestic: 30_000_000,
    international: 8_000_000,
  },
  {
    iata: "MAA",
    name: "Chennai International Airport",
    city: "Chennai",
    state: "Tamil Nadu",
    type: "international",
    passengers: 22_000_000,
    cargo: 380_000,
    movements: 180_000,
    domestic: 18_000_000,
    international: 4_000_000,
  },
  {
    iata: "CCU",
    name: "Netaji Subhas Chandra Bose International Airport",
    city: "Kolkata",
    state: "West Bengal",
    type: "international",
    passengers: 18_000_000,
    cargo: 290_000,
    movements: 150_000,
    domestic: 15_000_000,
    international: 3_000_000,
  },
];

describe("AirportTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the table with all airports", () => {
    render(<AirportTable airports={mockAirports} />);

    expect(screen.getByText("Indira Gandhi International Airport")).toBeInTheDocument();
    expect(screen.getByText("Chhatrapati Shivaji Maharaj International Airport")).toBeInTheDocument();
    expect(screen.getByText("Kempegowda International Airport")).toBeInTheDocument();
    expect(screen.getByText("Chennai International Airport")).toBeInTheDocument();
    expect(screen.getByText("Netaji Subhas Chandra Bose International Airport")).toBeInTheDocument();
  });

  it("displays IATA codes", () => {
    render(<AirportTable airports={mockAirports} />);

    expect(screen.getByText("DEL")).toBeInTheDocument();
    expect(screen.getByText("BOM")).toBeInTheDocument();
    expect(screen.getByText("BLR")).toBeInTheDocument();
    expect(screen.getByText("MAA")).toBeInTheDocument();
    expect(screen.getByText("CCU")).toBeInTheDocument();
  });

  it("displays city names", () => {
    render(<AirportTable airports={mockAirports} />);

    expect(screen.getByText("New Delhi")).toBeInTheDocument();
    expect(screen.getByText("Mumbai")).toBeInTheDocument();
    expect(screen.getByText("Bengaluru")).toBeInTheDocument();
    expect(screen.getByText("Chennai")).toBeInTheDocument();
    expect(screen.getByText("Kolkata")).toBeInTheDocument();
  });

  it("displays airport types with labels", () => {
    render(<AirportTable airports={mockAirports} />);

    const internationalLabels = screen.getAllByText("International");
    expect(internationalLabels.length).toBe(5);
  });

  it("displays formatted passenger counts", () => {
    render(<AirportTable airports={mockAirports} />);

    expect(screen.getByText("73.0M")).toBeInTheDocument();
    expect(screen.getByText("52.0M")).toBeInTheDocument();
    expect(screen.getByText("38.0M")).toBeInTheDocument();
    expect(screen.getByText("22.0M")).toBeInTheDocument();
    expect(screen.getByText("18.0M")).toBeInTheDocument();
  });

  it("displays formatted cargo volumes", () => {
    render(<AirportTable airports={mockAirports} />);

    expect(screen.getByText("970K t")).toBeInTheDocument();
    expect(screen.getByText("850K t")).toBeInTheDocument();
    expect(screen.getByText("420K t")).toBeInTheDocument();
    expect(screen.getByText("380K t")).toBeInTheDocument();
    expect(screen.getByText("290K t")).toBeInTheDocument();
  });

  it("shows result count", () => {
    render(<AirportTable airports={mockAirports} />);

    expect(screen.getByText("Showing 5 of 5 airports")).toBeInTheDocument();
  });

  it("provides search input", () => {
    render(<AirportTable airports={mockAirports} />);

    const searchInput = screen.getByPlaceholderText(
      "Search airports by name, city, IATA code, or state…"
    );
    expect(searchInput).toBeInTheDocument();
  });

  it("filters airports by name", async () => {
    const user = userEvent.setup();
    render(<AirportTable airports={mockAirports} />);

    const searchInput = screen.getByPlaceholderText(
      "Search airports by name, city, IATA code, or state…"
    );

    await user.type(searchInput, "Indira");

    expect(screen.getByText("Showing 1 of 5 airports")).toBeInTheDocument();
    expect(screen.getByText("Indira Gandhi International Airport")).toBeInTheDocument();
    expect(screen.queryByText("Chhatrapati Shivaji Maharaj International Airport")).not.toBeInTheDocument();
  });

  it("filters airports by city", async () => {
    const user = userEvent.setup();
    render(<AirportTable airports={mockAirports} />);

    const searchInput = screen.getByPlaceholderText(
      "Search airports by name, city, IATA code, or state…"
    );

    await user.type(searchInput, "Mumbai");

    expect(screen.getByText("Showing 1 of 5 airports")).toBeInTheDocument();
    expect(screen.getByText("Chhatrapati Shivaji Maharaj International Airport")).toBeInTheDocument();
  });

  it("filters airports by IATA code", async () => {
    const user = userEvent.setup();
    render(<AirportTable airports={mockAirports} />);

    const searchInput = screen.getByPlaceholderText(
      "Search airports by name, city, IATA code, or state…"
    );

    await user.type(searchInput, "BLR");

    expect(screen.getByText("Showing 1 of 5 airports")).toBeInTheDocument();
    expect(screen.getByText("Kempegowda International Airport")).toBeInTheDocument();
  });

  it("filters airports by state", async () => {
    const user = userEvent.setup();
    render(<AirportTable airports={mockAirports} />);

    const searchInput = screen.getByPlaceholderText(
      "Search airports by name, city, IATA code, or state…"
    );

    await user.type(searchInput, "Karnataka");

    expect(screen.getByText("Showing 1 of 5 airports")).toBeInTheDocument();
    expect(screen.getByText("Kempegowda International Airport")).toBeInTheDocument();
  });

  it("shows clear search button when filter is active", async () => {
    const user = userEvent.setup();
    render(<AirportTable airports={mockAirports} />);

    const searchInput = screen.getByPlaceholderText(
      "Search airports by name, city, IATA code, or state…"
    );

    await user.type(searchInput, "Delhi");

    const clearButton = screen.getByText("Clear search");
    expect(clearButton).toBeInTheDocument();

    await user.click(clearButton);

    expect(searchInput).toHaveValue("");
    expect(screen.getByText("Showing 5 of 5 airports")).toBeInTheDocument();
  });

  it("clears filter when clear button is clicked", async () => {
    const user = userEvent.setup();
    render(<AirportTable airports={mockAirports} />);

    const searchInput = screen.getByPlaceholderText(
      "Search airports by name, city, IATA code, or state…"
    );

    await user.type(searchInput, "Delhi");
    expect(screen.getByText("Showing 1 of 5 airports")).toBeInTheDocument();

    const clearButton = screen.getByText("Clear search");
    await user.click(clearButton);

    expect(screen.getByText("Showing 5 of 5 airports")).toBeInTheDocument();
  });

  it("sorts by passengers by default (descending)", () => {
    render(<AirportTable airports={mockAirports} />);

    const rows = screen.getAllByRole("row");
    // First row is header
    expect(rows[1]).toHaveTextContent("Indira Gandhi International Airport");
    expect(rows[2]).toHaveTextContent("Chhatrapati Shivaji Maharaj International Airport");
    expect(rows[3]).toHaveTextContent("Kempegowda International Airport");
  });

  it("toggles sort direction when clicking same column", async () => {
    const user = userEvent.setup();
    render(<AirportTable airports={mockAirports} />);

    // Find the Passengers header
    const passengersHeader = screen.getByText("Passengers");
    await user.click(passengersHeader);

    // Now should be ascending
    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Netaji Subhas Chandra Bose International Airport");
    expect(rows[2]).toHaveTextContent("Chennai International Airport");
  });

  it("sorts by name when clicking name column", async () => {
    const user = userEvent.setup();
    render(<AirportTable airports={mockAirports} />);

    const airportHeader = screen.getByText("Airport");
    await user.click(airportHeader);

    const rows = screen.getAllByRole("row");
    // Should be alphabetical descending
    expect(rows[1]).toHaveTextContent("Netaji Subhas Chandra Bose International Airport");
    expect(rows[2]).toHaveTextContent("Kempegowda International Airport");
  });

  it("sorts by IATA code", async () => {
    const user = userEvent.setup();
    render(<AirportTable airports={mockAirports} />);

    const iataHeader = screen.getByText("IATA");
    await user.click(iataHeader);

    const rows = screen.getAllByRole("row");
    // Should be alphabetical descending
    expect(rows[1]).toHaveTextContent("MAA");
    expect(rows[2]).toHaveTextContent("DEL");
  });

  it("handles empty airports array", () => {
    render(<AirportTable airports={[]} />);

    expect(screen.getByText("Showing 0 of 0 airports")).toBeInTheDocument();
  });

  it("renders table headers", () => {
    render(<AirportTable airports={mockAirports} />);

    expect(screen.getByText("Airport")).toBeInTheDocument();
    expect(screen.getByText("IATA")).toBeInTheDocument();
    expect(screen.getByText("City")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Passengers")).toBeInTheDocument();
    expect(screen.getByText("Cargo")).toBeInTheDocument();
    expect(screen.getByText("Volume")).toBeInTheDocument();
  });

  it("renders bar charts for volume column", () => {
    const { container } = render(<AirportTable airports={mockAirports} />);

    // Bar charts should be rendered
    const barCharts = container.querySelectorAll(".h-1\\.5.rounded-full");
    expect(barCharts.length).toBeGreaterThan(0);
  });

  it("handles case-insensitive search", async () => {
    const user = userEvent.setup();
    render(<AirportTable airports={mockAirports} />);

    const searchInput = screen.getByPlaceholderText(
      "Search airports by name, city, IATA code, or state…"
    );

    await user.type(searchInput, "indira");

    expect(screen.getByText("Showing 1 of 5 airports")).toBeInTheDocument();
    expect(screen.getByText("Indira Gandhi International Airport")).toBeInTheDocument();
  });

  it("handles partial search terms", async () => {
    const user = userEvent.setup();
    render(<AirportTable airports={mockAirports} />);

    const searchInput = screen.getByPlaceholderText(
      "Search airports by name, city, IATA code, or state…"
    );

    await user.type(searchInput, "del");

    expect(screen.getByText("Showing 1 of 5 airports")).toBeInTheDocument();
  });

  it("handles multiple search results", async () => {
    const user = userEvent.setup();
    render(<AirportTable airports={mockAirports} />);

    const searchInput = screen.getByPlaceholderText(
      "Search airports by name, city, IATA code, or state…"
    );

    await user.type(searchInput, "International");

    expect(screen.getByText("Showing 5 of 5 airports")).toBeInTheDocument();
  });

  it("handles search with no results", async () => {
    const user = userEvent.setup();
    render(<AirportTable airports={mockAirports} />);

    const searchInput = screen.getByPlaceholderText(
      "Search airports by name, city, IATA code, or state…"
    );

    await user.type(searchInput, "NonExistentAirport");

    expect(screen.getByText("Showing 0 of 5 airports")).toBeInTheDocument();
  });
});
