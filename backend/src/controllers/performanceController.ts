import { Request, Response } from 'express';
import { getOrCreateBaselineQ3Performance } from '../services/baselineQ3PerformanceService';
import { calculateSimulatedQ3Performance } from '../services/simulatedQ3PerformanceService';
import { SimulationPayload, SimulationResponse } from '../types';

const generateDriversList = (payload: SimulationPayload): string[] => {
  const drivers: string[] = [];
  
  if (payload.conversionChange !== 0) {
    const p = Math.abs(payload.conversionChange * 100).toFixed(1);
    const d = payload.conversionChange > 0 ? "increase" : "decrease";
    const v = payload.conversionChange > 0 ? "positively impacted probability" : "negatively impacted probability";
    drivers.push(`A ${p}% ${d} in conversion rate ${v}.`);
  }

  if (payload.dealSizeChange !== 0) {
    const p = Math.abs(payload.dealSizeChange * 100).toFixed(1);
    const d = payload.dealSizeChange > 0 ? "increase" : "decrease";
    const v = payload.dealSizeChange > 0 ? "drove higher expected deal values" : "reduced expected deal values";
    drivers.push(`A ${p}% ${d} in average deal size ${v}.`);
  }

  if (payload.cycleChange !== 0) {
    const d = Math.abs(payload.cycleChange);
    if (payload.cycleChange > 0) {
      drivers.push(`A ${d} day increase in sales cycle delayed revenue realization.`);
    } else {
      drivers.push(`A ${d} day faster sales cycle accelerated revenue realization.`);
    }
  }

  if (drivers.length === 0) {
    drivers.push("No performance drivers were modified.");
  }
  
  return drivers;
};

export const postSimulatedQ3Performance = (req: Request, res: Response): void => {
  try {
    const payload: SimulationPayload = {
      conversionChange: req.body.conversionChange,
      dealSizeChange: req.body.dealSizeChange,
      cycleChange: req.body.cycleChange
    };
    
    const baseline = getOrCreateBaselineQ3Performance();
    const scenario = calculateSimulatedQ3Performance(payload);
    
    const absolute = Number((scenario.total_revenue - baseline.total_revenue).toFixed(2));
    // Safe divide by zero check just in case
    const percentage = baseline.total_revenue === 0 ? 0 : Number(((absolute / baseline.total_revenue) * 100).toFixed(2));
    
    const drivers = generateDriversList(payload);
    
    const response: SimulationResponse = {
      baseline,
      scenario,
      impact: {
        absolute,
        percentage
      },
      drivers
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error calculating simulated Q3 performance:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};
