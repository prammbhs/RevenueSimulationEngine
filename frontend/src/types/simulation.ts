export interface WeeklyResult {
  weekly_revenue: number[]; // Always length 13
  total_revenue: number;
}

export interface SimulationImpact {
  absolute: number;   // scenario.total - baseline.total
  percentage: number; // Relative change (%)
}

export interface SimulationResponse {
  baseline: WeeklyResult;
  scenario: WeeklyResult;
  impact: SimulationImpact;
  drivers: string[];
}

export interface SimulationPayload {
  conversionChange?: number; // -1 to 1
  dealSizeChange?: number;   // -1 to 5
  cycleChange?: number;      // > -baseCycle (dynamic)
}
