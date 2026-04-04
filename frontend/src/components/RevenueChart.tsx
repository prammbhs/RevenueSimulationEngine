import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import type { WeeklyData } from '../types/simulation';
import { formatINR, formatYAxisTick } from '../utils/format';

interface Props {
  data: WeeklyData[];
  loading: boolean;
}

export default function RevenueChart({ data, loading }: Props) {
  if (loading) return (
    <div className="bg-white dark:bg-[#1a1d27] rounded-2zl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center min-h-[380px] animate-pulse">
       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recalculating Projections…</p>
    </div>
  );

  return (
    <div className="bg-white dark:bg-[#1a1d27] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 p-6 flex flex-col min-h-[380px] animate-fade-in relative overflow-hidden">
      
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
           <p className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">Revenue Projection Comparison</p>
           <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Q3 · Week 1–13</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">Baseline</span>
           </div>
           <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
              <span className="text-[10px] font-black text-emerald-500 uppercase">Scenario</span>
           </div>
        </div>
      </div>

      <div className="h-[280px] w-full mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScenario" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.01}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="4 4" 
              vertical={false} 
              stroke="#cbd5e1" 
              opacity={0.15} 
              className="dark:stroke-slate-700"
            />
            
            <XAxis 
              dataKey="week" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 800, fill: '#64748b' }}
              dy={10}
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tickFormatter={formatYAxisTick}
              tick={{ fontSize: 10, fontWeight: 800, fill: '#64748b' }}
            />
            
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#1a1d27', 
                border: '1px solid #334155', 
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)'
              }}
              labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              formatter={(value: any) => {
                const num = typeof value === 'number' ? value : 0;
                return [formatINR(num), ''];
              }}
            />
            
            <Area
              type="monotone"
              dataKey="baseline"
              stroke="#94a3b8"
              strokeWidth={3}
              strokeDasharray="6 6"
              fill="transparent"
              animationDuration={1000}
            />
            
            <Area
              type="monotone"
              dataKey="scenario"
              stroke="#10b981"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorScenario)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
