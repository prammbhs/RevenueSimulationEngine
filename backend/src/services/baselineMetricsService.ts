import {
  getBaseMetrics,
  getRegionMetrics,
  getSourceMetrics,
  getPriceCategoryMetrics,
} from '../repository/metricsRepository';
import { SalesMetrics } from '../types';



export let salesMetrics: SalesMetrics | null = null;

// Helper to avoid float precision issues up to 5 decimal places
const precise = (val: number) => Math.round(val * 100000) / 100000;

const clamp = (val: number, min = 0.5, max = 1.5) =>
  Math.max(min, Math.min(max, val));

const scale = (factor: number, alpha = 1.5) =>
  1 + (factor - 1) * alpha;

export const calculateAndStoreBaselines = () => {
  try {
    const base = getBaseMetrics();
    const regionData = getRegionMetrics();
    const sourceData = getSourceMetrics();
    const categoryData = getPriceCategoryMetrics();

    if (!base.conversion || base.conversion === 0) {
      throw new Error("Invalid base conversion (0). Check dataset.");
    }
    const baseConv = base.conversion;

    const regionFactors: Record<string, number> = {};
    for (const r of regionData) {
      regionFactors[r.region] = precise(clamp(scale(r.conversion / baseConv)));
    }

    const sourceFactors: Record<string, number> = {};
    for (const s of sourceData) {
      sourceFactors[s.source] = precise(clamp(scale(s.conversion / baseConv)));
    }

    const priceFactors: Record<string, number> = {};
    const categoryCycles: Record<string, number> = {};
    for (const c of categoryData) {
      priceFactors[c.category] = precise(clamp(scale(c.conversion / baseConv)));
      categoryCycles[c.category] = precise(c.salesCycle || base.salesCycle);
    }

    salesMetrics = {
      coreMetrics: {
        conversionRate: precise(base.conversion),
        avgDealSize: precise(base.avgDealSize),
        salesCycle: precise(base.salesCycle),
      },
      advancedFactors: {
        regionFactor: regionFactors,
        sourceFactor: sourceFactors,
        priceFactor: priceFactors,
        salesCycleByCategory: categoryCycles,
      },
    };

    console.log('Successfully calculated and cached salesMetrics in-memory.');
    return salesMetrics;
  } catch (err) {
    console.error('Failed to calculate cohort baselines:', err);
    throw err;
  }
};
