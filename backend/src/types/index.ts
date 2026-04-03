

export interface SimulationPayload {
  conversionChange: number;
  dealSizeChange: number;
  cycleChange: number;
}


export interface DealRecord {
  deal_id: string;
  created_date: string;
  closed_date: string | null;
  stage: string;
  deal_value: number;
  region: string;
  source: string;
  quarter: string;
  price_category: 'small' | 'medium' | 'large';
}

export type SalesMetrics = {
  coreMetrics: {
    conversionRate: number;
    avgDealSize: number;
    salesCycle: number;
  };
  advancedFactors: {
    regionFactor: Record<string, number>;
    sourceFactor: Record<string, number>;
    priceFactor: Record<string, number>;
    salesCycleByCategory: Record<string, number>;
  };
};

export interface BaselineQ3Result {
  weekly_revenue: number[];
  total_revenue: number;
}

export interface SimulationResponse {
  baseline: BaselineQ3Result;
  scenario: BaselineQ3Result;
  impact: {
    absolute: number;
    percentage: number;
  };
  drivers: string[];
}

