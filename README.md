
# Project 46: Debt Payoff Calculator

This is a modern, responsive ReactJS application designed to help users create a strategy for paying off their debts. It compares two popular methods: the Debt Snowball and the Debt Avalanche, providing clear visualizations and summaries to empower users to make informed financial decisions.

## Features

- **Dynamic Debt Management**: Add, edit, and remove multiple debt accounts (credit cards, loans, etc.).
- **Dual Strategy Comparison**: Instantly calculates and compares the **Debt Snowball** (paying off smallest balances first) and **Debt Avalanche** (paying off highest interest rates first) methods.
- **Detailed Projections**: Shows the debt-free date and total interest paid for each strategy.
- **Visual Analysis**: A comparative chart visualizes the debt reduction over time for both strategies.
- **Extra Payment Simulation**: Factor in extra monthly payments to see how it accelerates debt freedom.
- **Stunning UI/UX**: A clean, financial dashboard interface with an animated galaxy background.
- **Fully Responsive**: Optimized for a seamless experience on desktops, tablets, and mobile devices.
- **SEO Optimized**: Includes a comprehensive article on debt management strategies with structured data for search engines.

## Architecture

- **Frontend**: ReactJS 18+ (Functional Components & Hooks) with TypeScript.
- **Styling**: Tailwind CSS for a utility-first, responsive design.
- **Charting**: Recharts for data visualization.
- **Core Logic**: All financial calculations are handled by pure, dependency-free TypeScript functions in `src/utils/DebtMath.ts`. This ensures accuracy and maintainability.

## File Structure

- `public/`: Contains the main `index.html`, static assets like `favicon.svg`, `robots.txt`, and `sitemap.xml`.
- `src/`: The main application source code.
  - `index.tsx`: The application entry point.
  - `App.tsx`: The root component that assembles the layout and views.
  - `types.ts`: Defines shared TypeScript types and interfaces.
  - `components/`:
    - `ThemeLayout.tsx`: Provides the overall page structure, including the animated background, header, footer, and modals.
    - `DebtCalculatorTool.tsx`: The main interactive calculator component.
  - `utils/`:
    - `DebtMath.ts`: Contains all the core financial calculation logic for amortization and payoff strategies.
    - `SeoArticle.tsx`: A component containing a 3500+ word article on debt management for SEO purposes.

## Getting Started

### Prerequisites

- Node.js and npm (or yarn) installed.

### Installation & Running

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd debt-payoff-calculator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`.

## Branding

The footer proudly displays "Powered by HSINI MOHAMED" in gold, linking to the creator's GitHub profile.
