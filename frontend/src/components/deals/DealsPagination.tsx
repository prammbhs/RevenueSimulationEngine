interface Props {
  page:       number;
  setPage:    (p: number) => void;
  totalPages: number;
  totalFiltered: number;
  pageSize:   number;
}

export default function DealsPagination({ page, setPage, totalPages, totalFiltered, pageSize }: Props) {
  if (totalPages <= 1) return null;

  const startIdx = (page - 1) * pageSize + 1;
  const endIdx   = Math.min(page * pageSize, totalFiltered);

  // Generate page numbers to show, limited on mobile
  const getPageNumbers = () => {
    const isMobile = window.innerWidth < 640;
    const maxVisible = isMobile ? 3 : 7;
    
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Logic to show a window around current page
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end   = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 border-t border-slate-100 dark:border-slate-800/40 mt-4">
      <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
        Showing <span className="text-slate-900 dark:text-slate-200">{startIdx}</span>
        <span className="mx-1.5 opacity-30">/</span>
        <span className="text-slate-900 dark:text-slate-200">{endIdx}</span>
        <span className="mx-2 opacity-10">|</span>
        <span className="text-slate-400 dark:text-slate-600">Total {totalFiltered.toLocaleString()}</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="group px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 scroll-auto"
        >
          <svg className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none no-scrollbar">
          {pages.map(n => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all active:scale-90 border-2 select-none ${
                n === page
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40'
                  : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="group px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 scroll-auto"
        >
          <svg className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
