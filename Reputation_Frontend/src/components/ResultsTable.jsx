import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react';
import { getPostsPaginated, exportPostsCsv } from '../api';

const sentimentIcon = (s) => {
  if (s === 'positive') return <TrendingUp className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />;
  if (s === 'negative') return <TrendingDown className="w-3.5 h-3.5 text-red-400 inline mr-1" />;
  return <Minus className="w-3.5 h-3.5 text-blue-400 inline mr-1" />;
};

const sentimentColor = (s) => {
  if (s === 'positive') return 'text-emerald-400';
  if (s === 'negative') return 'text-red-400';
  return 'text-blue-400';
};

const crisisLevelColor = (level) => {
  if (level === 'SEVERE')   return 'text-red-400 bg-red-500/10';
  if (level === 'CRITICAL') return 'text-orange-400 bg-orange-500/10';
  if (level === 'WARNING')  return 'text-yellow-400 bg-yellow-500/10';
  return 'text-green-400 bg-green-500/10';
};

const Row = ({ item, idx }) => {
  const isCrisis = item.crisis === true || (item.crisisLevel && item.crisisLevel !== 'NORMAL');
  const sentimentRaw = item.sentiment || (item.sentimentLabel ? item.sentimentLabel.toLowerCase() : 'neutral');
  const scoreDisplay = item.score != null ? `${item.score}%` : item.sentimentScore != null ? `${(item.sentimentScore * 100).toFixed(1)}%` : '—';
  const crisisLevel = item.crisisLevel || 'NORMAL';
  const timestamp = item.time || (item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : '—');

  return (
    <motion.tr
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.03 }}
      className={`border-b border-white/5 last:border-0 ${isCrisis ? 'border-l-2 border-l-red-500/60' : ''} hover:bg-white/3 transition-colors`}
    >
      <td className="px-4 py-3 max-w-xs">
        <p className="text-sm text-gray-200 truncate" title={item.text}>{item.text}</p>
      </td>
      <td className={`px-4 py-3 text-sm font-semibold ${sentimentColor(sentimentRaw)}`}>
        {sentimentIcon(sentimentRaw)}
        {sentimentRaw.toUpperCase()}
      </td>
      <td className="px-4 py-3 text-sm text-gray-300 font-medium">{scoreDisplay}</td>
      <td className="px-4 py-3">
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${crisisLevelColor(crisisLevel)}`}>
          {crisisLevel}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">{timestamp}</td>
    </motion.tr>
  );
};

const ResultsTable = ({ data = [] }) => {
  // ─── NEW: Pagination state ─────────────────────────────────────
  const [paginatedData, setPaginatedData] = useState(null);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState(null);

  // ─── NEW: Export CSV state ─────────────────────────────────────
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState(null);

  // Fetch paginated data
  const fetchPage = useCallback(async (pageNum) => {
    setPageLoading(true);
    setPageError(null);
    try {
      const result = await getPostsPaginated(pageNum, size);
      // Handle Spring Boot Page response shape
      if (result && result.content) {
        const normalizedContent = result.content.map(p => ({
          ...p,
          sentiment: (p.sentimentLabel || 'NEUTRAL').toLowerCase(),
          score: p.sentimentScore != null ? Math.round(p.sentimentScore * 100) : 0,
          time: p.timestamp ? new Date(p.timestamp).toLocaleTimeString() : '—',
        }));
        setPaginatedData(normalizedContent);
        setTotalPages(result.totalPages || 0);
        setTotalElements(result.totalElements || 0);
      } else if (Array.isArray(result)) {
        // Fallback: API returns plain array
        const normalizedContent = result.map(p => ({
          ...p,
          sentiment: (p.sentimentLabel || 'NEUTRAL').toLowerCase(),
          score: p.sentimentScore != null ? Math.round(p.sentimentScore * 100) : 0,
          time: p.timestamp ? new Date(p.timestamp).toLocaleTimeString() : '—',
        }));
        setPaginatedData(normalizedContent);
        setTotalPages(1);
        setTotalElements(normalizedContent.length);
      }
    } catch (err) {
      setPageError('Failed to load paginated posts.');
      setPaginatedData(null);
    } finally {
      setPageLoading(false);
    }
  }, [size]);

  // Initial paginated fetch
  useEffect(() => {
    fetchPage(page);
  }, [page, fetchPage]);

  // Decide which data to display: paginated API results or prop data as fallback
  const displayData = paginatedData || data;
  const recordCount = paginatedData ? totalElements : data.length;

  // Handle page navigation
  const goToPage = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  // ─── NEW: Export CSV handler ───────────────────────────────────
  const handleExportCsv = async () => {
    setExportLoading(true);
    setExportError(null);
    try {
      const blob = await exportPostsCsv(page, size);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `posts_page${page + 1}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      window.dispatchEvent(new CustomEvent('r3-toast', { detail: { message: 'CSV exported successfully', type: 'success' } }));
    } catch (err) {
      setExportError('Failed to export CSV.');
      window.dispatchEvent(new CustomEvent('r3-toast', { detail: { message: 'Failed to export CSV', type: 'error' } }));
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-xl border border-white/5 overflow-hidden">
      <div className="p-4 border-b border-white/5 bg-dark-900/50 flex items-center justify-between">
        <h4 className="font-semibold text-white">Posts & Sentiment</h4>
        <div className="flex items-center gap-3">
          {/* Export CSV Button */}
          <button
            id="export-csv-btn"
            onClick={handleExportCsv}
            disabled={exportLoading || displayData.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-all disabled:opacity-40"
          >
            {exportLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
            Export CSV
          </button>
          <span className="text-xs text-gray-500">{recordCount} records</span>
        </div>
      </div>

      {/* Export Error */}
      {exportError && (
        <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/30 text-red-300 text-xs">
          {exportError}
        </div>
      )}

      {/* Page Error */}
      {pageError && (
        <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/30 text-red-300 text-xs">
          {pageError}
        </div>
      )}

      <div className="overflow-auto max-h-72">
        {pageLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-sm">Loading posts...</p>
          </div>
        ) : displayData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500 gap-2">
            <span className="text-2xl">📭</span>
            <p className="text-sm">No posts yet. Submit one above!</p>
          </div>
        ) : (
          <table className="min-w-full table-auto">
            <thead className="text-xs text-gray-400 uppercase bg-dark-900/60 sticky top-0">
              <tr>
                <th className="text-left px-4 py-3">Message</th>
                <th className="text-left px-4 py-3">Sentiment</th>
                <th className="text-left px-4 py-3">Score</th>
                <th className="text-left px-4 py-3">Crisis Level</th>
                <th className="text-left px-4 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((d, i) => (
                <Row key={d.id || i} item={d} idx={i} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ─── NEW: Pagination Controls ───────────────────────────── */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-white/5 bg-dark-900/50 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              id="pagination-prev-btn"
              onClick={() => goToPage(page - 1)}
              disabled={page === 0 || pageLoading}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Prev
            </button>
            <button
              id="pagination-next-btn"
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages - 1 || pageLoading}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsTable;
