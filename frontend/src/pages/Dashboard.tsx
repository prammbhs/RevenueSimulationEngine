import { useState, useEffect, useMemo } from 'react';
import SimulationControls, { type ControlValues } from '../components/SimulationControls';
import RevenueChart          from '../components/RevenueChart';
import ImpactSummary         from '../components/ImpactSummary';
import ApiError              from '../components/ApiError';
import { useSimulation }     from '../hooks/useSimulation';
import type { WeeklyData }   from '../types/simulation';

const DEFAULT: ControlValues = { conversion: 23, dealSize: 0, cycle: 0 };

export default function Dashboard() {
  const { data, loading, error, runSimulation } = useSimulation();
  const [controls, setControls] = useState<ControlValues>(DEFAULT);

  /* Auto-run with +23% conversion on mount as requested */
  useEffect(() => {
    runSimulation({ conversionChange: 0.23, dealSizeChange: 0, cycleChange: 0 });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReset = () => {
    setControls(DEFAULT);
    runSimulation({ conversionChange: 0.23, dealSizeChange: 0, cycleChange: 0 });
  };

  /** Transform flat arrays from API into Recharts-friendly object array */
  const chartData = useMemo<WeeklyData[]>(() => {
    if (!data) return [];
    return data.baseline.weekly_revenue.map((val, i) => ({
      week: `W${i + 1}`,
      baseline: val,
      scenario: data.scenario.weekly_revenue[i],
    }));
  }, [data]);

  return (
    <div className="animate-fade-in py-6">
      {error && <ApiError message={error} />}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          <div className="md:col-span-1">
            <SimulationControls
              values={controls}
              onChange={setControls}
              onRun={runSimulation}
              onReset={handleReset}
              loading={loading}
            />
          </div>
          <div className="md:col-span-2">
            <RevenueChart data={chartData} loading={loading} />
          </div>
          <div className="md:col-span-3">
            <ImpactSummary data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
