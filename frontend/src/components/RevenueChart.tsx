import {
  ComposedChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { SimulationResponse } from '../types/simulation';
import { formatLakhs, formatYAxisTick } from '../utils/format';
import { useTheme } from '../context/ThemeContext';

interface Props {
  data:    SimulationResponse | null;
  loading: boolean;
}

/* ── Custom Tooltip ─────────────────────────────────────── */
function CustomTooltip({ active, payload, label, scenarioColor }: any) {
  if (!active || !payload?.length) return null;
  const base = payload.find((p: any) => p.dataKey === 'Baseline')?.value ?? 0;
  const scen = payload.find((p: any) => p.dataKey === 'Scenario')?.value ?? 0;
  const diff = scen - base;

  return (
    <div className="bg-white dark:bg-[#1e2130] rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-3 min-w-[190px]">
      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">{label}</p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500" />
            Baseline
          </span>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{formatLakhs(base)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full" style={{ background: scenarioColor }} />
            Scenario
          </span>
          <span className="text-xs font-semibold" style={{ color: scenarioColor }}>{formatLakhs(scen)}</span>
        </div>
        {Math.abs(diff) > 0 && (
          <div className="mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-700 flex justify-between">
            <span className="text-xs text-slate-400 dark:text-slate-500">Δ</span>
            <span className="text-xs font-semibold" style={{ color: scenarioColor }}>
              {diff >= 0 ? '+' : ''}{formatLakhs(diff)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Legend ─────────────────────────────────────────────── */
function ChartLegend({ scenarioColor }: { scenarioColor: string }) {
  return (
    <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 flex-shrink-0">
      <span className="flex items-center gap-1.5">
        <svg width="18" height="6"><line x1="0" y1="3" x2="18" y2="3" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 2" /></svg>
        Baseline
      </span>
      <span className="flex items-center gap-1.5">
        <svg width="18" height="6"><line x1="0" y1="3" x2="18" y2="3" stroke={scenarioColor} strokeWidth="2" /></svg>
        Scenario
      </span>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────── */
export default function RevenueChart({ data, loading }: Props) {
  const { isDark } = useTheme();
  const isPositive   = (data?.impact.absolute ?? 0) >= 0;
  const scenColor    = isPositive ? '#10b981' : '#f43f5e';
  const gridColor    = isDark ? '#1e293b' : '#f1f5f9';
  const axisColor    = isDark ? '#475569' : '#94a3b8';

  const chartData = data
    ? data.baseline.weekly_revenue.map((base, i) => ({
        week:     `W${i + 1}`,
        Baseline: Math.round(base * 100) / 100,
        Scenario: Math.round(data.scenario.weekly_revenue[i] * 100) / 100,
      }))
    : Array.from({ length: 13 }, (_, i) => ({ week: `W${i + 1}`, Baseline: 0, Scenario: 0 }));

  return (
    <div className="bg-white dark:bg-[#1a1d27] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Revenue Projection Comparison
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Q3 · Week 1–13</p>
        </div>
        <ChartLegend scenarioColor={scenColor} />
      </div>

      {/* Chart area */}
      <div className="relative" style={{ height: 280 }}>
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 rounded-xl bg-white/80 dark:bg-[#1a1d27]/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <svg className="animate-spin h-6 w-6 text-indigo-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span className="text-xs text-slate-400 dark:text-slate-500">Simulating…</span>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!data && !loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-slate-400 dark:text-slate-500 text-center px-4">
              Adjust the controls and click{' '}
              <span className="font-medium text-indigo-500">Run Simulation</span>
            </p>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="scenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={scenColor} stopOpacity={0.18} />
                <stop offset="95%" stopColor={scenColor} stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#94a3b8" stopOpacity={0.08} />
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 11, fill: axisColor }}
              tickLine={false}
              axisLine={false}
              interval={1}
            />
            <YAxis
              tickFormatter={formatYAxisTick}
              tick={{ fontSize: 11, fill: axisColor }}
              tickLine={false}
              axisLine={false}
              width={36}
            />
            <Tooltip
              content={<CustomTooltip scenarioColor={scenColor} />}
              cursor={{ stroke: isDark ? '#334155' : '#e2e8f0', strokeWidth: 1 }}
            />

            <Area
              type="monotone" dataKey="Baseline"
              stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 3"
              fill="url(#baseGrad)" dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: '#94a3b8' }}
            />
            <Area
              type="monotone" dataKey="Scenario"
              stroke={scenColor} strokeWidth={2.5}
              fill="url(#scenGrad)" dot={false}
              activeDot={{ r: 5, strokeWidth: 2, stroke: isDark ? '#1a1d27' : '#fff', fill: scenColor }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
