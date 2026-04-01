export interface Deal {
  deal_id: string;
  created_date: string;
  closed_date: string;
  stage: string;
  deal_value: number;
  region: string;
  source: string;
}

export interface SimulationPayload {
  conversionChange: number;
  sizeChange: number;
  cycleChange: number;
}

export interface SimulationResult {
  projectedWeeklyRevenue: number[];
  baselineWeeklyRevenue: number[];
}
