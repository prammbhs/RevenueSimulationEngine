import { getDealsByQuarter } from '../repository/dealsRepository';
import { DealRecord } from '../types';

let q3DealsCache: DealRecord[] | null = null;

export const getQ3DealsCached = (): DealRecord[] => {
  if (!q3DealsCache) {
    q3DealsCache = getDealsByQuarter('Q3');
    console.log(`Cached ${q3DealsCache.length} Q3 deals in memory.`);
  }
  return q3DealsCache;
};

export const invalidateQ3Cache = (): void => {
  q3DealsCache = null;
};
