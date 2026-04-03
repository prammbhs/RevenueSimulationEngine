import type { SimulationResponse } from '../types/simulation';
import { formatLakhs, buildSummary } from '../utils/format';

interface Props {
  data: SimulationResponse | null;
}

function RevenueRow({ label, value, large, color }: {
  label: string; value: number; large?: boolean; color?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
      <span
        className={`tabular-nums font-bold ${large ? 'text-2xl' : 'text-base text-slate-800 dark:text-slate-200'}`}
        style={color ? { color } : undefined}
      >
        {formatLakhs(value)}
      </span>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse-soft">
      <div className="h-2.5 w-28 rounded-full bg-slate-100 dark:bg-slate-700/60" />
      <div className="h-5 w-20 rounded-full bg-slate-100 dark:bg-slate-700/60 ml-auto" />
      <div className="h-8 w-24 rounded-full bg-slate-100 dark:bg-slate-700/60 ml-auto mt-1" />
      <div className="h-10 rounded-xl bg-slate-100 dark:bg-slate-700/60 mt-2" />
      <div className="h-16 rounded-xl bg-slate-100 dark:bg-slate-700/40 mt-2" />
      <div className="space-y-2 mt-2">
        <div className="h-2.5 w-16 rounded-full bg-slate-100 dark:bg-slate-700/60" />
        <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-700/40" />
        <div className="h-2.5 w-5/6 rounded-full bg-slate-100 dark:bg-slate-700/40" />
        <div className="h-2.5 w-4/6 rounded-full bg-slate-100 dark:bg-slate-700/40" />
      </div>
    </div>
  );
}

export default function ImpactSummary({ data }: Props) {
  const isPositive   = (data?.impact.absolute ?? 0) >= 0;
  const scenColor    = isPositive ? '#10b981' : '#f43f5e';
  const diffBg       = isPositive
    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50'
    : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/50';
  const diffText     = isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400';
  const arrow        = isPositive ? '↑' : '↓';

  const summary = data
    ? buildSummary(
        data.baseline.total_revenue, data.scenario.total_revenue,
        data.impact.absolute, data.impact.percentage,
      )
    : null;

  return (
    <div className="bg-white dark:bg-[#1a1d27] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 p-5 space-y-5">
      <p className="text-[10px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
        Simulation Insights
      </p>

      {!data ? <Skeleton /> : (
        <div className="space-y-5 animate-fade-in">

          {/* Revenue totals */}
          <div className="space-y-2.5">
            <p className="text-[10px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
              Total Revenue Projection
            </p>
            <RevenueRow label="Baseline" value={data.baseline.total_revenue} />
            <RevenueRow label="Scenario" value={data.scenario.total_revenue} large color={scenColor} />
          </div>

          {/* Difference badge */}
          <div className={`flex items-center justify-between rounded-xl border px-4 py-2.5 ${diffBg}`}>
            <div className="flex items-center gap-1.5">
              <span className={`text-sm font-bold ${diffText}`}>{arrow}</span>
              <span className={`text-sm font-semibold tabular-nums ${diffText}`}>
                {isPositive ? '+' : ''}{formatLakhs(data.impact.absolute)}
              </span>
            </div>
            <span className={`text-sm font-semibold tabular-nums ${diffText}`}>
              {data.impact.percentage >= 0 ? '+' : ''}{data.impact.percentage.toFixed(1)}%
            </span>
          </div>

          {/* Summary */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 px-4 py-3">
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 italic">{summary}</p>
          </div>

          {/* Drivers */}
          <div className="space-y-2">
            <p className="text-[10px] font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
              Impact Drivers
            </p>
            <ul className="space-y-1.5">
              {data.drivers.length > 0
                ? data.drivers.map((d, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: scenColor }} />
                      <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{d}</span>
                    </li>
                  ))
                : (
                  <li className="text-xs text-slate-400 dark:text-slate-500 italic">No significant drivers detected.</li>
                )
              }
            </ul>
          </div>

        </div>
      )}
    </div>
  );
}
