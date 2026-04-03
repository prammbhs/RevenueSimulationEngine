import type { SimulationResponse } from '../types/simulation';
import { formatUSD, buildSummary } from '../utils/format';

interface Props {
  data: SimulationResponse | null;
}

function KpiCard({ label, value, sub, large, color, icon }: {
  label: string; value: string; sub?: string; large?: boolean; color?: string; icon?: React.ReactNode;
}) {
  return (
    <div className="flex-1 min-w-[180px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a1d27] p-4 flex flex-col justify-between shadow-sm hover:border-indigo-500/30 transition-all group">
      <div>
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">{label}</p>
        <div className="flex items-center gap-2">
          {icon}
          <span
            className={`tabular-nums font-black ${large ? 'text-3xl' : 'text-xl text-slate-800 dark:text-slate-100'}`}
            style={{ color: color || 'inherit' }}
          >
            {value}
          </span>
        </div>
      </div>
      {sub && <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-tight">{sub}</p>}
    </div>
  );
}

export default function ImpactSummary({ data }: Props) {
  const isPositive   = (data?.impact.absolute ?? 0) >= 0;
  const scenColor    = '#10b981'; // Neon green for projection as per screenshot
  const diffColor    = isPositive ? '#10b981' : '#f43f5e';
  
  const summary = data
    ? buildSummary(
        data.baseline.total_revenue, data.scenario.total_revenue,
        data.impact.absolute, data.impact.percentage,
      )
    : null;

  if (!data) return (
    <div className="animate-pulse-soft space-y-4">
       <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(n => <div key={n} className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-800" />)}
       </div>
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
          Dynamic Performance Insights
        </p>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
           <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
           <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Live Analysis</span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-1 no-scrollbar">
        <KpiCard 
          label="Baseline Revenue" 
          value={formatUSD(data.baseline.total_revenue)} 
        />
        <KpiCard 
          label="Scenario Projection" 
          value={formatUSD(data.scenario.total_revenue)} 
          color={scenColor}
          large
        />
        <KpiCard 
          label="Absolute Shift" 
          value={`${isPositive ? '+' : ''}${formatUSD(data.impact.absolute)}`} 
          color={diffColor}
        />
        <KpiCard 
          label="Performance Impact" 
          value={`${data.impact.percentage >= 0 ? '+' : ''}${data.impact.percentage.toFixed(1)}%`} 
          color={diffColor}
          icon={
            <svg className={`w-5 h-5 ${isPositive ? 'rotate-0' : 'rotate-180'}`} viewBox="0 0 20 20" fill="currentColor" style={{ color: diffColor }}>
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
          }
        />
      </div>

      {/* Expanded Insight Text Section (No Scroll) */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#1a1d27]/50 p-6 shadow-sm">
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
             <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Current Scenario Analysis</p>
             <p className="text-[15px] font-black text-slate-900 dark:text-white leading-relaxed border-l-4 border-indigo-500 pl-4">
                {summary}
             </p>
          </div>
          
          <div className="space-y-4">
             <div className="flex flex-col gap-1.5">
               <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                 Performance Analysis
               </p>
               <p className="text-[15px] font-black text-slate-900 dark:text-white">
                 {isPositive ? 'This growth is primarily driven by:' : 'This decline is primarily driven by:'}
               </p>
             </div>
             
             <ul className="grid grid-cols-1 gap-y-3.5">
                {data.drivers.map((d, i) => (
                  <li key={i} className="flex items-start gap-4 group">
                    <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.6)] group-hover:scale-125 transition-transform" />
                    <span className="text-[14px] font-black text-slate-800 dark:text-slate-100 leading-relaxed uppercase tracking-tight">
                      {d}
                    </span>
                  </li>
                ))}
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
