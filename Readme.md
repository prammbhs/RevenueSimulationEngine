# RevSim – What-If Revenue Simulation Engine

Interactive modeling for sales growth projections through deal-level behavioral simulation.

## Screenshots
<img width="2880" height="1800" alt="Screenshot 2026-04-04 234730" src="https://github.com/user-attachments/assets/892e8a7c-e970-4c7d-b0e2-1ca9081ccce8" />
<img width="2880" height="1800" alt="Screenshot 2026-04-04 234753" src="https://github.com/user-attachments/assets/4574d867-02ce-40cb-808c-8a33a60398dd" />
<img width="2880" height="1800" alt="Screenshot 2026-04-04 234805" src="https://github.com/user-attachments/assets/9f587660-9ac3-4db2-b7e9-ceeb1f09766a" />
<img width="2880" height="1800" alt="Screenshot 2026-04-04 234847" src="https://github.com/user-attachments/assets/79b75936-d526-42bc-a87a-da05782f1260" />


## Demo Video
https://github.com/user-attachments/assets/7324c412-5e92-4157-9144-f0c5d521afd9

## Quickstart

### Option 1: Run using NPM Setup
```bash
# Clone the repository
git clone https://github.com/prammbhs/RevenueSimulationEngine.git
cd RevenueSimulationEngine
```
Backend:

```bash
cd backend
npm install
npm run dev
```

Open a new terminal:

Frontend:

```bash
cd ../RevenueSimulationEngine/frontend
npm install
npm run dev
```

Frontend: [http://localhost:5173](http://localhost:5173)
Backend: [http://localhost:5000](http://localhost:5000)

### Option 2: Run using Docker Setup
```bash
git clone https://github.com/prammbhs/RevenueSimulationEngine.git
cd RevenueSimulationEngine
docker-compose up --build
```
Access at: **[http://localhost:5173](http://localhost:5173)**

---

## Problem Statement

Traditional sales dashboards are retrospective and limited to reporting historical performance. They do not provide the ability to simulate future outcomes under changing conditions.

Sales leaders often need to answer questions such as:

* What happens if conversion improves?
* What is the impact of changing deal sizes?
* How does sales cycle duration affect revenue timing?

RevSim addresses this gap by enabling forward-looking simulation based on historical patterns.

## Solution Overview

RevSim transforms historical sales data into a simulation engine that allows users to:

* Compute baseline performance using Q1 and Q2 data
* Adjust key drivers such as conversion rate, deal size, and cycle duration
* Simulate Q3 revenue outcomes
* Compare baseline vs scenario results
* Understand the drivers behind revenue changes

## Key Features

- **Interactive Simulation Controls**: Real-time adjustment of core sales drivers.
- **Scenario Comparison**: Side-by-side analysis of baseline vs. simulated projections.
- **Weekly Revenue Projection**: Granular 13-week forecast for the upcoming quarter (Q3).
- **Single Overlay Visualization**: High-impact area chart showing the delta between scenarios.
- **Insight Generation**: Automated identification of impact magnitude and performance drivers.

## Approach & Methodology

### Core Metric Calculation
Baseline metrics are computed from Q1 and Q2:

* Conversion Rate = Closed Won / (Closed Won + Closed Lost)
* Average Deal Size = Average(deal_value for Closed Won)
* Sales Cycle = Average(closed_date - created_date)

---

### Deal-Level Simulation

The model operates at the individual deal level instead of using aggregate formulas.

For each deal:

* Probability is computed as:

  Probability = Base Conversion × Region Factor × Source Factor × Price Factor

* Expected Revenue:

  Expected Revenue = Probability × Deal Value

This approach ensures heterogeneity across deals and avoids inaccuracies of aggregate models.

---
### Scenario Adjustments
User inputs are applied per deal:
* Conversion Change:

  Adjusts probability multiplicatively:

  New Probability = Base Probability × (1 + conversionChange)

* Deal Size Change:

  Adjusts value per deal:

  New Value = deal_value × (1 + dealSizeChange)

* Cycle Change:

  Adjusts expected close timing:

  New Cycle = Base Cycle + cycleChange

---
### Weekly Aggregation Logic

* Expected close date is calculated per deal
* Revenue is grouped into weekly buckets (Week 1–13 of Q3)
* Produces time-based revenue projection

---

## Example Calculation

For a single deal:

* Deal Value = 100,000
* Base Conversion = 20%
* Factors (combined) = 1.1

Base Probability = 0.22
Expected Revenue = 22,000

With +10% conversion:

* New Probability = 0.242
* New Expected Revenue = 24,200

---
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
- **Payload**: 
```json
{
  "conversionChange": number,
  "dealSizeChange": number,
  "cycleChange": number
}
```


### Sample Output
```json
{
  "baseline": {
    "weekly_revenue": [0,0,0,116980.26,148393.31,111048.04,167296.84,108208.43,74907.05,135881.44,145541.8,179732.72,250784.24],
    "total_revenue": 1438774.13
  },
  "scenario": {
    "weekly_revenue": [0,0,0,143885.72,182523.78,136589.09,205775.11,133096.37,92135.67,167134.17,179016.41,221071.24,308464.61],
    "total_revenue": 1769692.17
  },
  "impact": {
    "absolute": 330918.04,
    "percentage": 23
  },
  "drivers": ["A 23.0% increase in conversion rate positively impacted probability."]
}
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
