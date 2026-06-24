import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SummaryBar from "@/components/sections/SummaryBar";

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

describe("SummaryBar", () => {
  const defaultProps = {
    totalPassengers: 73_000_000,
    totalCargo: 970_000,
    totalMovements: 450_000,
    airportCount: 28,
    stateCount: 15,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all stat cards with correct labels", () => {
    render(<SummaryBar {...defaultProps} />);

    expect(screen.getByText("Airports")).toBeInTheDocument();
    expect(screen.getByText("Annual passengers")).toBeInTheDocument();
    expect(screen.getByText("Cargo volume")).toBeInTheDocument();
    expect(screen.getByText("Aircraft movements")).toBeInTheDocument();
    expect(screen.getByText("States & UTs")).toBeInTheDocument();
  });

  it("displays formatted values correctly", () => {
    render(<SummaryBar {...defaultProps} />);

    expect(screen.getByText("28")).toBeInTheDocument();
    expect(screen.getByText("73.0M")).toBeInTheDocument();
    expect(screen.getByText("970K t")).toBeInTheDocument();
    expect(screen.getByText("450K")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
  });

  it("shows sublabels for each stat", () => {
    render(<SummaryBar {...defaultProps} />);

    expect(screen.getByText("International & domestic")).toBeInTheDocument();
    expect(screen.getByText("2023 total across network")).toBeInTheDocument();
    expect(screen.getByText("Freight & mail tonnage")).toBeInTheDocument();
    expect(screen.getByText("Takeoffs & landings")).toBeInTheDocument();
    expect(screen.getByText("Covered across India")).toBeInTheDocument();
  });

  it("renders the domestic vs international split bar", () => {
    render(<SummaryBar {...defaultProps} />);

    expect(screen.getByText("Domestic vs. international split")).toBeInTheDocument();
    expect(screen.getByText("~85%")).toBeInTheDocument();
    expect(screen.getByText("~15%")).toBeInTheDocument();
  });

  it("shows split labels", () => {
    render(<SummaryBar {...defaultProps} />);

    expect(screen.getByText("Domestic (~85%)")).toBeInTheDocument();
    expect(screen.getByText("International (~15%)")).toBeInTheDocument();
  });

  it("handles card click interaction", () => {
    render(<SummaryBar {...defaultProps} />);

    const airportsCard = screen.getByText("Airports").closest("button");
    expect(airportsCard).toBeInTheDocument();

    // Click to activate
    fireEvent.click(airportsCard!);
    expect(airportsCard).toHaveClass("border-ink/15", "bg-white");

    // Click again to deactivate
    fireEvent.click(airportsCard!);
    expect(airportsCard).not.toHaveClass("border-ink/15", "bg-white");
  });

  it("only one card can be active at a time", () => {
    render(<SummaryBar {...defaultProps} />);

    const airportsCard = screen.getByText("Airports").closest("button");
    const passengersCard = screen.getByText("Annual passengers").closest("button");

    // Click airports card
    fireEvent.click(airportsCard!);
    expect(airportsCard).toHaveClass("border-ink/15", "bg-white");
    expect(passengersCard).not.toHaveClass("border-ink/15", "bg-white");

    // Click passengers card - airports should deactivate
    fireEvent.click(passengersCard!);
    expect(passengersCard).toHaveClass("border-ink/15", "bg-white");
    expect(airportsCard).not.toHaveClass("border-ink/15", "bg-white");
  });

  it("formats large passenger numbers correctly", () => {
    render(
      <SummaryBar
        {...defaultProps}
        totalPassengers={1_500_000_000}
      />
    );

    expect(screen.getByText("1.5B")).toBeInTheDocument();
  });

  it("formats small passenger numbers correctly", () => {
    render(
      <SummaryBar
        {...defaultProps}
        totalPassengers={500}
      />
    );

    expect(screen.getByText("500")).toBeInTheDocument();
  });

  it("formats large cargo numbers correctly", () => {
    render(
      <SummaryBar
        {...defaultProps}
        totalCargo={2_500_000}
      />
    );

    expect(screen.getByText("2.5M t")).toBeInTheDocument();
  });

  it("formats small cargo numbers correctly", () => {
    render(
      <SummaryBar
        {...defaultProps}
        totalCargo={500}
      />
    );

    expect(screen.getByText("500 t")).toBeInTheDocument();
  });

  it("renders with zero values", () => {
    render(
      <SummaryBar
        totalPassengers={0}
        totalCargo={0}
        totalMovements={0}
        airportCount={0}
        stateCount={0}
      />
    );

    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("0K")).toBeInTheDocument();
    expect(screen.getByText("0 t")).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    render(<SummaryBar {...defaultProps} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(5);

    buttons.forEach((button) => {
      expect(button).toHaveAttribute("type", "button");
    });
  });
});
