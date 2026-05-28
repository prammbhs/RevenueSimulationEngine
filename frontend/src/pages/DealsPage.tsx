import { useState, useEffect, useMemo } from 'react';
import type { DealRecord } from '../types/deals';
import DealsHeader from '../components/deals/DealsHeader';
import DealsFilters from '../components/deals/DealsFilters';
import DealsTable from '../components/deals/DealsTable';
import DealsPagination from '../components/deals/DealsPagination';

const BASE_URL = 'https://app-revsim-backend-gvc7fffpcjehbdgd.koreacentral-01.azurewebsites.net/api/v1';
const PAGE_SIZE = 15;

export default function DealsPage() {
  const [deals, setDeals] = useState<DealRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter/Sort state
  const [search, setSearch] = useState('');
  const [quarter, setQuarter] = useState('All');
  const [stage, setStage] = useState('All');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{ col: keyof DealRecord; dir: 'asc' | 'desc' }>({
    col: 'created_date', dir: 'desc',
  });

  /* fetch deals from backend */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/deals`);
        if (!res.ok) throw new Error('API server returned an error');
        const json = await res.json();
        setDeals(json.data ?? []);
      } catch (e: any) {
        setError(e.message ?? 'Unknown connectivity error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* Filter options derived from underlying data */
  const quarters = useMemo(() => ['All', ...Array.from(new Set(deals.map(d => d.quarter))).sort()], [deals]);
  const stages = useMemo(() => ['All', ...Array.from(new Set(deals.map(d => d.stage))).sort()], [deals]);

  /* Core filtered + sorted list */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return deals
      .filter(d =>
        (quarter === 'All' || d.quarter === quarter) &&
        (stage === 'All' || d.stage === stage) &&
        (q === '' ||
          d.deal_id.toLowerCase().includes(q) ||
          d.region.toLowerCase().includes(q) ||
          d.source.toLowerCase().includes(q) ||
          d.stage.toLowerCase().includes(q))
      )
      .sort((a, b) => {
        const av = a[sort.col] ?? '';
        const bv = b[sort.col] ?? '';
        const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
        return sort.dir === 'asc' ? cmp : -cmp;
      });
  }, [deals, search, quarter, stage, sort]);

  /* Handle pagination logic */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (col: keyof DealRecord) => {
    setSort(s => s.col === col ? { col, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { col, dir: 'asc' });
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setQuarter('All');
    setStage('All');
    setPage(1);
  };

  /* Stats calculation for header */
  const totalValue = filtered.reduce((s, d) => s + d.deal_value, 0);
  const wonDeals = filtered.filter(d => d.stage === 'Closed Won');
  const wonValue = wonDeals.reduce((s, d) => s + d.deal_value, 0);

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8 animate-fade-in">

      {/* 1. Header (Title + KPI Summary) */}
      <DealsHeader
        totalCount={filtered.length}
        totalValue={totalValue}
        wonValue={wonValue}
        loading={loading}
      />

      {/* 2. Filters (Search + Selects) */}
      <DealsFilters
        search={search} setSearch={v => { setSearch(v); setPage(1); }}
        quarter={quarter} setQuarter={v => { setQuarter(v); setPage(1); }}
        quarters={quarters}
        stage={stage} setStage={v => { setStage(v); setPage(1); }}
        stages={stages}
        onClear={handleClearFilters}
      />

      {/* 3. The Table itself (Responsive container) */}
      <DealsTable
        deals={paginated}
        loading={loading}
        error={error}
        sort={sort}
        onSort={handleSort}
      />

      {/* 4. Pagination (Intelligent responsive buttons) */}
      {!loading && !error && (
        <DealsPagination
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          totalFiltered={filtered.length}
          pageSize={PAGE_SIZE}
        />
      )}
    </div>
  );
}
