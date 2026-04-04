# RevSim – What-If Revenue Simulation Engine

Interactive modeling for sales growth projections through deal-level behavioral simulation.

## Screenshots

*Caption: Main simulation interface with active revenue projection.*

## Demo Video
## Quickstart

### Option 1: Standard NPM Setup (Simplest)
```bash
# Clone the repository
git clone https://github.com/prammbhs/RevenueSimulationEngine.git
cd RevenueSimulationEngine

# Set up Backend
cd backend && npm install && npm run dev &
# Set up Frontend
# start a new terminal tab
cd RevenueSimulationEngine/frontend && npm install && npm run dev
```

 Access at: **[http://localhost:5173](http://localhost:5173)**

---

### Option 2: Docker Setup
```bash
git clone https://github.com/prammbhs/RevenueSimulationEngine.git
cd RevenueSimulationEngine
docker-compose up --build
```
Access at: **[http://localhost:5173](http://localhost:5173)**

---

## Problem Statement

Traditional sales dashboards are inherently retrospective. While they excel at reporting historical performance (actuals), they lack the predictive flexibility required for strategic planning. Sales leaders often ask "What-If" questions:
- *What if our conversion rate increases by 15% due to a new training program?*
- *What if the sales cycle lengthens by 5 days because of new compliance requirements?*

Static reports cannot answer these questions. RevSim bridges this gap by providing a sandbox environment where users can simulate future outcomes based on historical behavioral patterns.


## Solution Overview

RevSim is a full-stack simulation engine that transforms historical sales data into a forward-looking projection tool. It allows users to:
- **Establish Baselines**: Automatically compute historical performance metrics from Q1 and Q2 data.
- **Model Scenarios**: Use interactive controls to adjust conversion rates, deal sizes, and cycle durations.
- **Project Outcomes**: Generate weekly revenue forecasts for Q3.
- **Visualize Impact**: Compare the baseline projection against the simulated scenario in a high-fidelity chart.
- **Derive Insights**: Understand the primary drivers behind revenue shifts through automated variance analysis.

## Key Features

- **Interactive Simulation Controls**: Real-time adjustment of core sales drivers.
- **Scenario Comparison**: Side-by-side analysis of baseline vs. simulated projections.
- **Weekly Revenue Projection**: Granular 13-week forecast for the upcoming quarter (Q3).
- **Single Overlay Visualization**: High-impact area chart showing the delta between scenarios.
- **Insight Generation**: Automated identification of impact magnitude and performance drivers.

## Approach & Methodology

### Core Metric Calculation
The system analyzes historical deals to establish:
- **Conversion Rate**: Percentage of deals traditionally won.
- **Average Deal Size**: Mean value of closed-won opportunities.
- **Sales Cycle**: Mean duration from creation to closing.

### Deal-Level Simulation
Unlike aggregate models that apply multipliers to total revenue, RevSim operates at the **individual deal level**:
- **Probability Determination**: A unique probability is calculated for every deal in the pipeline:
  `Probability = Base Conversion × Region Factor × Source Factor × Price Factor`
- **Expected Revenue**:
  `Expected Revenue = Calculated Probability × Adjusted Deal Value`

### Scenario Adjustments
User inputs scale the underlying model:
- **Conversion Scaling**: Adjusts the global base probability.
- **Deal Size Scaling**: Multiplies the value of every deal in the simulation.
- **Cycle Adjustment**: Shifts the expected close date of each deal, affecting weekly aggregation.

### Weekly Aggregation Logic
Deals are bucketed into discrete weekly intervals based on their `Expected Close Date`. This transforms static deal values into a temporal revenue stream.

## Example Calculation

Consider a single deal in the pipeline:
- **Deal Value**: 1,00,000
- **Base Conversion**: 20%
- **Regional Factor**: 1.1 (High performance)
- **Calculated Probability**: 22%
- **Expected Revenue**: 22,000

**User Scenario: +10% Conversion Increase**
- **New Base Conversion**: 22%
- **New Probability**: 24.2%
- **New Expected Revenue**: 24,200
- **Net Gain**: +2,200 for this single opportunity.

## Insights Generation

The engine automatically generates business-centric insights by comparing the two models:
- **Total Revenue Impact**: The absolute difference in projected collections.
- **Performance Drivers**: Identifying whether the change is primarily volume-driven (conversion) or value-driven (deal size).
- **Variance Analysis**: Descriptive summaries of the "why" behind the projected shift.

## UI Overview

- **Simulation Controls**: Sidebar with sliders and precise input fields for model parameters.
- **Revenue Projection Chart**: Responsive area chart comparing Baseline vs. Scenario over 13 weeks.
- **Impact Summary**: KPI cards showing Baseline Revenue, Scenario Projection, Absolute Shift (₹), and Performance Impact (%).
- **Deals Table**: A detailed view of the raw data powering the simulation.


## API Design

The backend exposes a optimized single endpoint:
- **POST `/api/v1/simulate`**
- **Payload**: `conversionChange`, `dealSizeChange`, `cycleChange`.

**Design Rationale**: A single comprehensive endpoint was chosen over multiple GET requests to ensure atomicity. By sending all parameters at once, the engine can perform a unified calculation pass, reducing network overhead and ensuring the frontend receives a consistent, pre-computed comparison object (Baseline + Scenario).

## Project Structure

```text
/revsim
├── /backend     # Express + TypeScript, SQLite database
└── /frontend    # React + Vite, Recharts, TailwindCSS
```

## Assumptions

- **Baseline Period**: Q1 and Q2 represent the steady-state performance used for benchmarking.
- **Probability Clamping**: Probabilities are capped (e.g., 95%) to maintain realism (no deal is ever a 100% certainty).
- **Deterministic Model**: To ensure consistent insights for recruiters/reviewers, the current model uses expected values rather than random sampling.
- **Pipeline Snapshot**: All deals without a close date are treated as active Q3 pipeline opportunities.

## Design Decisions

- **Deal-Level Modeling**: We chose deal-level behavior over aggregate multipliers to allow for future granularity (e.g., adjusting specific regions independently).
- **Deterministic vs. Monte Carlo**: A deterministic approach was selected for reproducibility and performance, ensuring that the same slider settings always yield the same insights.
- **Single Chart Constraints**: To maximize user focus, we utilized a single overlay chart rather than multiple dashboards, prioritizing "direct comparison" as the primary user goal.
- **In-Memory Caching**: Baseline calculations and parsed CSV data are cached in-memory after the initial server start to ensure sub-100ms simulation responses.

## Performance

- **Computational Complexity**: O(n) where n is the number of deals.
- **Efficiency**: The engine is designed to handle datasets exceeding 10,000+ records with millisecond response times by leveraging vectorized-style processing in Node.js.
