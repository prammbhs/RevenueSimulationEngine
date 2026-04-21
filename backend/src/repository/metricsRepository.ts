import db from '../utils/db';

export const getBaseMetrics = () => {
  return db.prepare(`
    SELECT
      CAST(SUM(CASE WHEN stage = 'Closed Won' THEN 1 ELSE 0 END) AS REAL) / COUNT(*) as conversion,
      AVG(CASE WHEN stage = 'Closed Won' THEN deal_value ELSE NULL END) as avgDealSize,
      AVG(
        CASE 
          WHEN stage = 'Closed Won' AND closed_date IS NOT NULL 
          THEN julianday(closed_date) - julianday(created_date)
        END
      ) as salesCycle
    FROM deals
    WHERE quarter IN ('Q1', 'Q2') AND stage IN ('Closed Won', 'Closed Lost')
  `).get() as { conversion: number; avgDealSize: number; salesCycle: number };
};

export const getRegionMetrics = () => {
  return db.prepare(`
    SELECT
      region,
      CAST(SUM(CASE WHEN stage = 'Closed Won' THEN 1 ELSE 0 END) AS REAL) / COUNT(*) as conversion
    FROM deals
    WHERE quarter IN ('Q1', 'Q2') AND stage IN ('Closed Won', 'Closed Lost')
    GROUP BY region
  `).all() as { region: string; conversion: number }[];
};

export const getSourceMetrics = () => {
  return db.prepare(`
    SELECT
      source,
      CAST(SUM(CASE WHEN stage = 'Closed Won' THEN 1 ELSE 0 END) AS REAL) / COUNT(*) as conversion
    FROM deals
    WHERE quarter IN ('Q1', 'Q2') AND stage IN ('Closed Won', 'Closed Lost')
    GROUP BY source
  `).all() as { source: string; conversion: number }[];
};

export const getPriceCategoryMetrics = () => {
  return db.prepare(`
    SELECT
      price_category as category,
      CAST(SUM(CASE WHEN stage = 'Closed Won' THEN 1 ELSE 0 END) AS REAL) / COUNT(*) as conversion,
      AVG(
        CASE 
          WHEN closed_date IS NOT NULL 
          THEN julianday(closed_date) - julianday(created_date)
        END
      ) as salesCycle
    FROM deals
    WHERE quarter IN ('Q1', 'Q2') AND stage IN ('Closed Won', 'Closed Lost')
    GROUP BY price_category
  `).all() as { category: string; conversion: number; salesCycle: number }[];
};
