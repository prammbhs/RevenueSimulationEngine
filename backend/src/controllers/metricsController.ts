import { Request, Response } from 'express';
import { salesMetrics } from '../services/baselineMetricsService';

export const getMetrics = (req: Request, res: Response): void => {
  if (!salesMetrics) {
    res.status(503).json({ error: 'Metrics are not initialized yet.' });
    return;
  }
  res.status(200).json(salesMetrics);
};
