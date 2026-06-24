# Contributing to Airport Data Project

Thank you for your interest in contributing to the Airport Data Project! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm 9.0 or later
- Git

### Setup

1. Fork the repository on GitHub

2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/airport-data.git
   cd airport-data
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming

Use descriptive branch names:
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation changes
- `test/description` - Test additions or improvements

### Commit Messages

Write clear, concise commit messages:
- Use imperative mood ("Add feature" not "Added feature")
- Keep the subject line under 72 characters
- Reference issue numbers when applicable

Example:
```
Add airport search functionality

- Implement search by name, city, IATA code
- Add debounced input for performance
- Include accessibility attributes

Closes #123
```

## Code Style

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use named exports over default exports when practical

### React

- Use functional components with hooks
- Keep components small and focused
- Use descriptive component and variable names
- Add JSDoc comments for complex logic

### CSS

- Use Tailwind CSS for styling
- Follow the existing design system
- Use CSS variables for theme colors
- Ensure responsive design for all screen sizes

### Linting

Run the linter before committing:
```bash
npm run lint
```

Fix any linting errors before submitting your PR.

## Testing

### Writing Tests

- Write tests for new features and bug fixes
- Use React Testing Library for component tests
- Mock external dependencies appropriately
- Aim for meaningful test coverage, not just numbers

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

```typescript
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Component from "./Component";

describe("Component", () => {
  it("renders correctly", () => {
    render(<Component />);
    expect(screen.getByText("Expected text")).toBeInTheDocument();
  });

  it("handles user interaction", async () => {
    const user = userEvent.setup();
    render(<Component />);
    
    await user.click(screen.getByRole("button"));
    expect(screen.getByText("Updated text")).toBeInTheDocument();
  });
});
```

## Pull Request Process

1. **Update documentation** if your changes affect public APIs or user-facing features

2. **Add tests** for new functionality

3. **Ensure all tests pass**:
   ```bash
   npm test
   ```

4. **Run the linter**:
   ```bash
   npm run lint
   ```

5. **Build the project** to catch any build errors:
   ```bash
   npm run build
   ```

6. **Submit your PR** with:
   - Clear title and description
   - Reference to related issues
   - Screenshots for UI changes
   - Testing steps

### PR Review

- All PRs require at least one approval
- Address review feedback promptly
- Keep PRs focused and reasonably sized

## Reporting Issues

### Bug Reports

Include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser and OS information
- Screenshots if applicable

### Feature Requests

Include:
- Clear description of the feature
- Use case and motivation
- Any design ideas or mockups

## Questions?

Feel free to open an issue with the "question" label or reach out to the maintainers.

Thank you for contributing! 🛫
