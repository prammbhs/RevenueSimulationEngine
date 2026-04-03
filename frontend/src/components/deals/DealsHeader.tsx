import { formatUSD } from '../../utils/format';

interface Props {
  totalCount: number;
  totalValue: number;
  wonValue:   number;
  loading:    boolean;
}

export default function DealsHeader({ totalCount, totalValue, wonValue, loading }: Props) {
  if (loading) return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-h-[64px] animate-pulse">
      <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg" />
      <div className="flex gap-2">
        {[1,2,3].map(n => <div key={n} className="h-12 w-24 bg-slate-200 dark:bg-slate-700 rounded-xl" />)}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight">Deal Database</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          All deals from the SQLite pipeline — Q3 simulation dataset
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="flex-1 sm:flex-initial min-w-[80px] rounded-xl bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-slate-700/50 px-4 py-2.5 text-center shadow-sm transition-all hover:border-indigo-200 dark:hover:border-indigo-900/50">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Total</p>
          <p className="text-base font-bold text-slate-900 dark:text-slate-100">{totalCount.toLocaleString()}</p>
        </div>
        <div className="flex-1 sm:flex-initial min-w-[80px] rounded-xl bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-slate-700/50 px-4 py-2.5 text-center shadow-sm transition-all hover:border-indigo-200 dark:hover:border-indigo-900/50">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Pipeline</p>
          <p className="text-base font-bold text-slate-900 dark:text-slate-100">
            {formatUSD(totalValue)}
          </p>
        </div>
        <div className="flex-1 sm:flex-initial min-w-[80px] rounded-xl bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-slate-700/50 px-4 py-2.5 text-center shadow-sm transition-all hover:border-indigo-200 dark:hover:border-indigo-900/50">
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-0.5">Won</p>
          <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
            {formatUSD(wonValue)}
          </p>
        </div>
      </div>
    </div>
  );
}
