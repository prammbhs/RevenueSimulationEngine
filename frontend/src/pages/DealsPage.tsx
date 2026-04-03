import { useState, useEffect, useCallback, useMemo } from 'react';
import type { DealRecord } from '../types/deals';

const BASE_URL = 'http://localhost:8000/api/v1';

/* ── Status badge ───────────────────────────────────────── */
function StageBadge({ stage }: { stage: string }) {
  const map: Record<string, string> = {
    'Closed Won':  'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    'Closed Lost': 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
    'Proposal':    'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
    'Negotiation': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    'Qualified':   'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400',
  };
  const cls = map[stage] ?? 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cls}`}>
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
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${cls}`}>
      {cat}
    </span>
  );
}

const PAGE_SIZE = 15;

/* ── Main Component ─────────────────────────────────────── */
export default function DealsPage() {
  const [deals,   setDeals]   = useState<DealRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [search,  setSearch]  = useState('');
  const [quarter, setQuarter] = useState('All');
  const [stage,   setStage]   = useState('All');
  const [page,    setPage]    = useState(1);
  const [sort, setSort]       = useState<{ col: keyof DealRecord; dir: 'asc' | 'desc' }>({
    col: 'created_date', dir: 'desc',
  });

  /* fetch once */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/deals`);
        if (!res.ok) throw new Error('Failed to fetch deals');
        const json = await res.json();
        setDeals(json.data ?? []);
      } catch (e: any) {
        setError(e.message ?? 'Network error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* derived filter options */
  const quarters = useMemo(() => ['All', ...Array.from(new Set(deals.map(d => d.quarter))).sort()], [deals]);
  const stages   = useMemo(() => ['All', ...Array.from(new Set(deals.map(d => d.stage))).sort()], [deals]);

  /* filtered + sorted */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return deals
      .filter(d =>
        (quarter === 'All' || d.quarter === quarter) &&
        (stage   === 'All' || d.stage   === stage) &&
        (q === '' ||
          d.deal_id.toLowerCase().includes(q) ||
          d.region.toLowerCase().includes(q)  ||
          d.source.toLowerCase().includes(q)  ||
          d.stage.toLowerCase().includes(q))
      )
      .sort((a, b) => {
        const av = a[sort.col] ?? '';
        const bv = b[sort.col] ?? '';
        const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
        return sort.dir === 'asc' ? cmp : -cmp;
      });
  }, [deals, search, quarter, stage, sort]);

  /* pagination */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = useCallback((col: keyof DealRecord) => {
    setSort(s => s.col === col ? { col, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { col, dir: 'asc' });
    setPage(1);
  }, []);

  const handleFilter = (fn: () => void) => { fn(); setPage(1); };

  /* sort arrow */
  const Arrow = ({ col }: { col: keyof DealRecord }) =>
    sort.col === col
      ? <span className="ml-1 text-indigo-500">{sort.dir === 'asc' ? '↑' : '↓'}</span>
      : <span className="ml-1 text-slate-300 dark:text-slate-600">↕</span>;

  /* summary stats */
  const totalValue   = filtered.reduce((s, d) => s + d.deal_value, 0);
  const wonDeals     = filtered.filter(d => d.stage === 'Closed Won');
  const wonValue     = wonDeals.reduce((s, d) => s + d.deal_value, 0);

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <div className="w-full max-w-screen-xl mx-auto p-4 sm:p-6 space-y-5">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Deal Database</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            All deals from the SQLite pipeline — Q3 simulation dataset
          </p>
        </div>

        {/* Summary chips */}
        {!loading && !error && (
          <div className="flex flex-wrap gap-2">
            <div className="rounded-xl bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-slate-700/50 px-4 py-2 text-center shadow-sm">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total</p>
              <p className="text-base font-bold text-slate-900 dark:text-slate-100">{filtered.length.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-slate-700/50 px-4 py-2 text-center shadow-sm">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">Pipeline</p>
              <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                ₹{(totalValue / 100_000).toFixed(1)}L
              </p>
            </div>
            <div className="rounded-xl bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-slate-700/50 px-4 py-2 text-center shadow-sm">
              <p className="text-[10px] text-emerald-500 uppercase tracking-widest">Won</p>
              <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                ₹{(wonValue / 100_000).toFixed(1)}L
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            placeholder="Search deals…"
            value={search}
            onChange={e => handleFilter(() => setSearch(e.target.value))}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1d27] pl-9 pr-4 py-2 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 focus:border-indigo-400 transition-all shadow-sm"
          />
        </div>

        {/* Quarter filter */}
        <select
          value={quarter}
          onChange={e => handleFilter(() => setQuarter(e.target.value))}
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1d27] px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 shadow-sm cursor-pointer"
        >
          {quarters.map(q => <option key={q}>{q}</option>)}
        </select>

        {/* Stage filter */}
        <select
          value={stage}
          onChange={e => handleFilter(() => setStage(e.target.value))}
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1d27] px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 shadow-sm cursor-pointer"
        >
          {stages.map(s => <option key={s}>{s}</option>)}
        </select>

        {/* Clear */}
        {(search || quarter !== 'All' || stage !== 'All') && (
          <button
            onClick={() => { setSearch(''); setQuarter('All'); setStage('All'); setPage(1); }}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 underline transition-colors cursor-pointer"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1a1d27] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin h-7 w-7 text-indigo-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span className="text-sm text-slate-400">Loading deals…</span>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-24">
            <p className="text-sm text-rose-500">⚠ {error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700/50">
                  {([
                    ['deal_id',        'Deal ID'],
                    ['created_date',   'Created'],
                    ['closed_date',    'Closed'],
                    ['stage',          'Stage'],
                    ['deal_value',     'Value'],
                    ['region',         'Region'],
                    ['source',         'Source'],
                    ['quarter',        'Quarter'],
                    ['price_category', 'Category'],
                  ] as [keyof DealRecord, string][]).map(([col, label]) => (
                    <th
                      key={col}
                      onClick={() => handleSort(col)}
                      className="px-4 py-3 text-left text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200 whitespace-nowrap transition-colors"
                    >
                      {label}<Arrow col={col} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700/30">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-16 text-center text-sm text-slate-400 dark:text-slate-500">
                      No deals match your filters.
                    </td>
                  </tr>
                ) : paginated.map((deal, i) => (
                  <tr
                    key={deal.deal_id}
                    className={`transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                      i % 2 === 0 ? '' : 'bg-slate-50/40 dark:bg-slate-800/10'
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {deal.deal_id}
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {deal.created_date ? deal.created_date.slice(0, 10) : '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {deal.closed_date ? deal.closed_date.slice(0, 10) : <span className="text-slate-400 dark:text-slate-600">—</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StageBadge stage={deal.stage} />
                    </td>
                    <td className="px-4 py-3 tabular-nums font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      ₹{deal.deal_value.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {deal.region}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {deal.source}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {deal.quarter}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <PriceBadge cat={deal.price_category} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              ← Prev
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const n = totalPages <= 7 ? i + 1
                : page <= 4 ? i + 1
                : page >= totalPages - 3 ? totalPages - 6 + i
                : page - 3 + i;
              return (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    n === page
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-indigo-900'
                      : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {n}
                </button>
              );
            })}
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
