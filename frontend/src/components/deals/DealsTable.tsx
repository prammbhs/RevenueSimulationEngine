import { formatINR_K } from '../../utils/format';
import type { DealRecord } from '../../types/deals';

interface Props {
  deals:    DealRecord[];
  loading:  boolean;
  error:    string | null;
  sort:     { col: keyof DealRecord; dir: 'asc' | 'desc' };
  onSort:   (col: keyof DealRecord) => void;
}

/* ── Status badge ───────────────────────────────────────── */
function StageBadge({ stage }: { stage: string }) {
  const map: Record<string, string> = {
    'Closed Won':  'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
    'Closed Lost': 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400',
    'Proposal':    'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400',
    'Negotiation': 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
    'Qualified':   'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-400',
  };
  const cls = map[stage] ?? 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-tight shadow-sm ${cls}`}>
      {stage}
    </span>
  );
}

/* ── Price category badge ───────────────────────────────── */
function PriceBadge({ cat }: { cat: string }) {
  const map: Record<string, string> = {
    small:  'bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400',
    medium: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    large:  'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  };
  const cls = map[cat] ?? 'bg-slate-100 dark:bg-slate-700 text-slate-500';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-tight capitalize ${cls}`}>
      {cat}
    </span>
  );
}

const tableHeaders: [keyof DealRecord, string][] = [
  ['deal_id',        'ID'],
  ['created_date',   'Created'],
  ['closed_date',    'Closed'],
  ['stage',          'Stage'],
  ['deal_value',     'Value'],
  ['region',         'Region'],
  ['source',         'Source'],
  ['quarter',        'Qtr'],
  ['price_category', 'Category'],
];

export default function DealsTable({ deals, loading, error, sort, onSort }: Props) {
  const Arrow = ({ col }: { col: keyof DealRecord }) => {
    if (sort.col !== col) return <span className="ml-1 text-slate-300 dark:text-slate-700 group-hover:text-slate-400">↕</span>;
    return <span className="ml-1 text-indigo-500 font-bold">{sort.dir === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="bg-white dark:bg-[#1a1d27] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800/50 overflow-hidden">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 animate-pulse">
           <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
           <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Fetching…</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
           <span className="text-2xl">⚠</span>
           <p className="text-sm font-medium text-rose-500">{error}</p>
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          <table className="w-full text-left border-collapse min-w-[900px]">
             <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/20">
                   {tableHeaders.map(([col, label]) => (
                      <th
                         key={col}
                         onClick={() => onSort(col)}
                         className="group px-4 py-3.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest cursor-pointer select-none hover:bg-slate-100/50 dark:hover:bg-slate-700/30 transition-all"
                      >
                         <div className="flex items-center">
                            {label} <Arrow col={col} />
                         </div>
                      </th>
                   ))}
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40">
                {deals.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-20 text-center">
                       <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">No results found matching your criteria.</p>
                    </td>
                  </tr>
                ) : deals.map((deal, idx) => (
                  <tr
                    key={deal.deal_id}
                    className={`group transition-all hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 ${
                      idx % 2 === 0 ? '' : 'bg-slate-50/30 dark:bg-slate-800/10'
                    }`}
                  >
                    <td className="px-4 py-3.5 font-mono text-[11px] font-bold text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors">
                      {deal.deal_id}
                    </td>
                    <td className="px-4 py-3.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {deal.created_date?.slice(0, 10)}
                    </td>
                    <td className="px-4 py-3.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {deal.closed_date ? deal.closed_date.slice(0, 10) : <span className="text-slate-300 dark:text-slate-600">—</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      <StageBadge stage={deal.stage} />
                    </td>
                    <td className="px-4 py-3.5 tabular-nums font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {formatINR_K(deal.deal_value)}
                    </td>
                    <td className="px-4 py-3.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                      {deal.region}
                    </td>
                    <td className="px-4 py-3.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                      {deal.source}
                    </td>
                    <td className="px-4 py-3.5 text-[11px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-tight">
                      {deal.quarter}
                    </td>
                    <td className="px-4 py-3.5">
                      <PriceBadge cat={deal.price_category} />
                    </td>
                  </tr>
                ))}
             </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
