interface Props {
  search:   string;
  setSearch: (val: string) => void;
  quarter:  string;
  setQuarter: (val: string) => void;
  quarters: string[];
  stage:    string;
  setStage:   (val: string) => void;
  stages:   string[];
  onClear:  () => void;
}

export default function DealsFilters({
  search, setSearch,
  quarter, setQuarter, quarters,
  stage, setStage, stages,
  onClear
}: Props) {
  const isFiltered = search || quarter !== 'All' || stage !== 'All';

  return (
    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
      {/* Search - Grows and shrinks, full width on mobile */}
      <div className="relative flex-1">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
        <input
          type="text"
          placeholder="Search by Deal ID, Region, or Source…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1d27] pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 focus:border-indigo-500 transition-all shadow-sm outline-none"
        />
      </div>

      <div className="flex flex-row gap-2">
        {/* Quarter dropdown */}
        <div className="flex-1 md:flex-initial">
          <select
            value={quarter}
            onChange={e => setQuarter(e.target.value)}
            className="w-full md:w-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1d27] px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors outline-none"
          >
            {quarters.map(q => <option key={q} value={q}>{q === 'All' ? 'All Quarters' : q}</option>)}
          </select>
        </div>

        {/* Stage dropdown */}
        <div className="flex-1 md:flex-initial">
          <select
            value={stage}
            onChange={e => setStage(e.target.value)}
            className="w-full md:w-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1d27] px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors outline-none"
          >
            {stages.map(s => <option key={s} value={s}>{s === 'All' ? 'All Stages' : s}</option>)}
          </select>
        </div>
      </div>

      {/* Clear Filters Button - Mobile friendly */}
      {isFiltered && (
        <button
          onClick={onClear}
          className="md:ml-auto px-4 py-2 text-xs font-semibold text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 transition-colors flex items-center justify-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear All
        </button>
      )}
    </div>
  );
}
