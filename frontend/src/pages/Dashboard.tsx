import { useState, useEffect } from 'react';
import SimulationControls, { type ControlValues } from '../components/SimulationControls';
import RevenueChart          from '../components/RevenueChart';
import ImpactSummary         from '../components/ImpactSummary';
import ApiError              from '../components/ApiError';
import { useSimulation }     from '../hooks/useSimulation';

const DEFAULT: ControlValues = { conversion: 20, dealSize: 0, cycle: 0 };

export default function Dashboard() {
  const { data, loading, error, runSimulation } = useSimulation();
  const [controls, setControls] = useState<ControlValues>(DEFAULT);

  /* Auto-run optimistic +20% conversion on mount */
  useEffect(() => {
    runSimulation({ conversionChange: 0.2, dealSizeChange: 0, cycleChange: 0 });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReset = () => {
    setControls(DEFAULT);
    runSimulation({ conversionChange: 0.2, dealSizeChange: 0, cycleChange: 0 });
  };

  return (
    <div className="animate-fade-in">
      {error && <ApiError message={error} />}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-5">
        <div className="grid grid-cols-1 lg:grid-cols-[288px_1fr_272px] gap-4 lg:gap-5 items-start">
          <SimulationControls
            values={controls}
            onChange={setControls}
            onRun={runSimulation}
            onReset={handleReset}
            loading={loading}
          />
          <RevenueChart  data={data} loading={loading} />
          <ImpactSummary data={data} />
        </div>
      </div>
    </div>
  );
}
