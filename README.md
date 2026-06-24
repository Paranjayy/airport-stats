# 🛫 Airport Data Project

A comprehensive, interactive visualization of India's airport network, featuring real-time statistics, interactive maps, and detailed airport information.

## 🌟 Features

### Core Features

- **Interactive Map Visualization** - Explore 28+ airports across India with an interactive SVG map
- **Real-time Statistics** - View passenger counts, cargo volumes, and aircraft movements
- **Airport Search & Filter** - Find airports by name, city, IATA code, or state
- **Sorting Capabilities** - Sort airports by various metrics (passengers, cargo, name)
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices

### Data Visualization

- **Passenger Statistics** - Annual passenger counts with trend analysis
- **Cargo Volume** - Freight and mail tonnage data
- **Aircraft Movements** - Takeoff and landing statistics
- **Domestic vs International Split** - Visual breakdown of passenger types
- **Airport Size Bands** - Color-coded dots based on passenger volume

### Technical Features

- **Next.js 16** - Built on the latest Next.js framework
- **TypeScript** - Full type safety throughout the codebase
- **Tailwind CSS** - Modern, utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **SQLite Database** - Local data storage with query utilities

## 📋 Prerequisites

- **Node.js** 18.0 or later
- **npm** 9.0 or later
- **Git** for version control

## 🚀 Getting Started

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/airport-data.git
   cd airport-data
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   ```
   http://localhost:3000
   ```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |

## 📁 Project Structure

```
airport-data/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main page
│   ├── layout.tsx         # Root layout
│   └── api/               # API routes
├── components/            # React components
│   ├── hero/              # Hero section components
│   ├── sections/          # Page sections
│   ├── map/               # Map visualizations
│   ├── charts/            # Chart components
│   ├── ui/                # Reusable UI components
│   └── analytics/         # Analytics components
├── lib/                   # Utility functions
│   ├── database.ts        # Database utilities
│   ├── map-utils.ts       # Map helper functions
│   └── ...               # Other utilities
├── data/                  # Static data files
├── types/                 # TypeScript type definitions
├── __tests__/             # Test files
│   ├── components/        # Component tests
│   └── lib/               # Utility function tests
├── public/                # Static assets
└── scripts/               # Build and utility scripts
```

## 🗺️ Key Components

### SummaryBar
Displays key statistics with interactive cards:
- Total airports
- Annual passengers
- Cargo volume
- Aircraft movements
- States covered

### AirportTable
Interactive table with:
- Search functionality
- Sortable columns
- Type indicators
- Volume bar charts
- Result count display

### Interactive Map
SVG-based map with:
- Airport dots sized by passenger volume
- Color-coded by airport type
- Tooltip information
- Zoom and pan capabilities

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

Tests are organized in `__tests__/` directory:
- `__tests__/components/` - Component tests using React Testing Library
- `__tests__/lib/` - Utility function tests

### Writing Tests

```typescript
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Component from "@/components/Component";

describe("Component", () => {
  it("renders correctly", () => {
    render(<Component />);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });
});
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy** - Automatic on every push to main

### Manual Deployment

```bash
# Build the project
npm run build

# Start production server
npm start
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` | Vercel Analytics ID | No |
| `DATABASE_URL` | SQLite database path | Yes |

## 🎨 Design System

### Colors

The project uses CSS variables for theming:
- `--color-airport-international` - Blue (#0A84FF)
- `--color-airport-domestic` - Green (#34C759)
- `--color-airport-joint-use` - Orange (#FF9F0A)
- `--color-airport-custom` - Purple (#BF5AF2)
- `--color-airport-defence` - Red (#FF375F)

### Typography

- **Headings** - Inter font family
- **Body** - Inter font family
- **Code** - Monospace font

### Spacing

Uses Tailwind CSS spacing scale:
- `p-4` = 1rem (16px)
- `p-6` = 1.5rem (24px)
- `p-8` = 2rem (32px)

## 📊 Data Sources

- **DGCA** - Directorate General of Civil Aviation
- **Airports Authority of India** - Official airport data
- **Flight Information** - Real-time flight data

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:
- Code style
- Testing requirements
- Pull request process
- Branch naming conventions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **DGCA** for aviation data
- **Airports Authority of India** for airport information
- **Open Source Community** for amazing tools and libraries

## 📞 Support

- **Issues** - GitHub Issues
- **Discussions** - GitHub Discussions
- **Email** - support@airportdata.dev

## 🔗 Links

- [Live Demo](https://airport-data.vercel.app)
- [Documentation](https://docs.airportdata.dev)
- [API Reference](https://api.airportdata.dev)

---

Made with ❤️ for India's aviation community
