import { getQ3DealsCached } from './q3CacheService';
import { salesMetrics } from './baselineMetricsService';
import { BaselineQ3Result, SimulationPayload } from '../types';

const Q3_START = new Date('2025-07-01T00:00:00Z');

export const calculateSimulatedQ3Performance = (payload: SimulationPayload): BaselineQ3Result => {
  if (!salesMetrics) {
    throw new Error('Sales metrics are not initialized.');
  }

  const { conversionChange = 0, dealSizeChange = 0, cycleChange = 0 } = payload;
  const deals = getQ3DealsCached();
  const weeklyRevenueArray = new Array(13).fill(0);

  const { coreMetrics, advancedFactors } = salesMetrics;
  
  // Apply our global conversion increase correctly out-of-loop as requested
  const newBaseConversion = coreMetrics.conversionRate * (1 + conversionChange);
  const baseSalesCycle = coreMetrics.salesCycle;

  for (const deal of deals) {
    // 1. Compute probability globally modified via base, then calculate per-deal against factors
    const rFactor = advancedFactors.regionFactor[deal.region] ?? 1;
    const sFactor = advancedFactors.sourceFactor[deal.source] ?? 1;
    const pFactor = advancedFactors.priceFactor[deal.price_category] ?? 1;

    let prob = newBaseConversion * rFactor * sFactor * pFactor;
    // Bound the probability
    prob = Math.max(0, Math.min(prob, 0.95));

    // 2. Compute expected deal value modification
    let value = deal.deal_value * (1 + dealSizeChange);
    value = Math.max(0, value);
    
    // Total aggregate expected revenue
    const expectedRevenue = value * prob;

    // 3. Compute expected close date
    const historicalCycleCategory = advancedFactors.salesCycleByCategory[deal.price_category] ?? baseSalesCycle;
    
    if (cycleChange < -historicalCycleCategory) {
      throw new Error(`Invalid cycleChange: The cycle change stringently results in negative overall cycle duration for the deal.`);
    }

    let cycle = historicalCycleCategory + cycleChange;
    cycle = Math.max(1, cycle); // Floor at exactly 1 day duration so deals don't close instantly
    
    // Construct absolute UTC
    const createdDateUTC = new Date(`${deal.created_date}T00:00:00Z`);
    
    const expectedCloseDateUTC = new Date(createdDateUTC.getTime());
    expectedCloseDateUTC.setUTCDate(expectedCloseDateUTC.getUTCDate() + cycle);

    // 4. Time offset / Aggregation bucket mapping
    const diffMs = expectedCloseDateUTC.getTime() - Q3_START.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    const weekIndex = Math.floor(diffDays / 7);

    // 5. Apply
    if (weekIndex >= 0 && weekIndex < 13) {
      weeklyRevenueArray[weekIndex] += expectedRevenue;
    }
  }

  const roundedWeeklyRevenue = weeklyRevenueArray.map(val => Number(val.toFixed(2)));
  const totalRevenue = roundedWeeklyRevenue.reduce((sum, val) => sum + val, 0);

  return {
    weekly_revenue: roundedWeeklyRevenue,
    total_revenue: Number(totalRevenue.toFixed(2)),
  };
};
