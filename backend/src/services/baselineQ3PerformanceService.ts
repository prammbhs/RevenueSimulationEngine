import { getQ3DealsCached } from './q3CacheService';
import { salesMetrics } from './baselineMetricsService';
import { BaselineQ3Result } from '../types';

const Q3_START = new Date('2025-07-01T00:00:00Z');

export const calculateBaselineQ3Performance = (): BaselineQ3Result => {
  if (!salesMetrics) {
    throw new Error('Sales metrics are not initialized. Please ensure calculateAndStoreBaselines has been called.');
  }

  const deals = getQ3DealsCached();
  const weeklyRevenueArray = new Array(13).fill(0);

  const { coreMetrics, advancedFactors } = salesMetrics;
  const baseConversion = coreMetrics.conversionRate;
  const baseSalesCycle = coreMetrics.salesCycle;

  for (const deal of deals) {
    // 1. Compute probability
    const rFactor = advancedFactors.regionFactor[deal.region] ?? 1;
    const sFactor = advancedFactors.sourceFactor[deal.source] ?? 1;
    const pFactor = advancedFactors.priceFactor[deal.price_category] ?? 1;

    let prob = baseConversion * rFactor * sFactor * pFactor;
    prob = Math.min(prob, 0.95);

    // 2. Compute expected revenue
    const expectedRevenue = deal.deal_value * prob;

    // 3. Compute expected close date
    const cycleDays = advancedFactors.salesCycleByCategory[deal.price_category] ?? baseSalesCycle;
    
    // Convert created_date to a UTC Date to prevent arbitrary timezone shifts
    const createdDateUTC = new Date(`${deal.created_date}T00:00:00Z`);
    
    // Add cycleDays
    const expectedCloseDateUTC = new Date(createdDateUTC.getTime());
    expectedCloseDateUTC.setUTCDate(expectedCloseDateUTC.getUTCDate() + cycleDays);

    // 4. Compute week index
    const diffMs = expectedCloseDateUTC.getTime() - Q3_START.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    const weekIndex = Math.floor(diffDays / 7);

    // 5. Add to weekly bucket
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

let cachedBaselineResult: BaselineQ3Result | null = null;

export const getOrCreateBaselineQ3Performance = (): BaselineQ3Result => {
  if (!cachedBaselineResult) {
    cachedBaselineResult = calculateBaselineQ3Performance();
  }
  return cachedBaselineResult;
};
