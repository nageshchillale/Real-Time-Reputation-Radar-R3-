import React, { useState, useEffect, useCallback } from 'react';
import PostComposer from './PostComposer';
import StatsCards from './StatsCards';
import ResultsTable from './ResultsTable';
import InsightsPanel from './InsightsPanel';
import SentimentAnalytics from './SentimentAnalytics';
import { motion } from 'framer-motion';
import { RefreshCw, Loader2, AlertTriangle } from 'lucide-react';
import { getPosts, getStats, getCrisis, getDashboardSummary, setAutoRefresh } from '../api';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ totalPosts: 0, positivePosts: 0, negativePosts: 0 });
  const [crisis, setCrisis] = useState({ crisisLevel: 'NORMAL', negativeCounatLast5Minutes: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // ─── NEW: Dashboard summary state ──────────────────────────────
  const [dashboardSummary, setDashboardSummary] = useState(null);

  // ─── NEW: Auto-refresh toggle state ────────────────────────────
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(30);
  const [autoRefreshSyncing, setAutoRefreshSyncing] = useState(false);

  const fetchAll = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const [postsData, statsData, crisisData] = await Promise.all([
        getPosts(),
        getStats(),
        getCrisis(),
      ]);
      setPosts(Array.isArray(postsData) ? postsData : []);
      setStats(statsData || { totalPosts: 0, positivePosts: 0, negativePosts: 0 });
      setCrisis(crisisData || { crisisLevel: 'NORMAL', negativeCounatLast5Minutes: 0 });
      setLastUpdated(new Date());

      // ─── NEW: Also fetch dashboard summary ─────────────────────
      try {
        const summary = await getDashboardSummary();
        if (summary) {
          setDashboardSummary(summary);
          // If summary provides these fields, use them as overrides
          if (summary.totalPosts != null) setStats(prev => ({ ...prev, totalPosts: summary.totalPosts }));
          if (summary.lastUpdated) setLastUpdated(new Date(summary.lastUpdated));
        }
      } catch (_) {
        // Dashboard summary endpoint is optional — don't block if unavailable
      }
    } catch (err) {
      setError('Could not connect to the backend. Make sure the Spring Boot server is running on port 8080.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Auto-refresh — controlled by toggle
  useEffect(() => {
    if (!autoRefreshEnabled) return;
    const interval = setInterval(() => fetchAll(true), autoRefreshInterval * 1000);
    return () => clearInterval(interval);
  }, [fetchAll, autoRefreshEnabled, autoRefreshInterval]);

  // ─── NEW: Toggle auto-refresh with backend sync ────────────────
  const handleToggleAutoRefresh = async () => {
    const newEnabled = !autoRefreshEnabled;
    setAutoRefreshSyncing(true);
    try {
      await setAutoRefresh({ enabled: newEnabled, intervalSeconds: autoRefreshInterval });
      setAutoRefreshEnabled(newEnabled);
    } catch (_) {
      // Still toggle locally even if backend sync fails
      setAutoRefreshEnabled(newEnabled);
    } finally {
      setAutoRefreshSyncing(false);
    }
  };

  const handlePostCreated = useCallback(() => {
    // Refresh all data after a new post
    setTimeout(() => fetchAll(true), 500);
  }, [fetchAll]);

  // Normalize posts for child components (backend uses sentimentLabel, score etc.)
  const normalizedPosts = posts.map(p => ({
    ...p,
    sentiment: (p.sentimentLabel || 'NEUTRAL').toLowerCase(),
    score: p.sentimentScore != null ? Math.round(p.sentimentScore * 100) : 0,
    time: p.timestamp ? new Date(p.timestamp).toLocaleTimeString() : '—',
  }));

  const statsForCards = {
    total: stats.totalPosts || 0,
    positive: stats.positivePosts || 0,
    negative: stats.negativePosts || 0,
    crisisLevel: crisis.crisisLevel || 'NORMAL',
  };

  return (
    <section id="bulk-dashboard" className="py-16 px-6 relative">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-sm font-semibold text-accent-neon tracking-widest uppercase mb-3">Live Dashboard</h2>
            <h3 className="text-3xl md:text-5xl font-bold">Real-Time AI Analyzer</h3>
            <p className="text-gray-400 mt-2">Submit posts and watch AI-powered sentiment & crisis detection in action.</p>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm"
            >
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Refresh Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
              <span className="text-xs text-gray-400">
                {error ? 'Backend offline' : lastUpdated ? `Last updated ${lastUpdated.toLocaleTimeString()}` : 'Loading…'}
              </span>
            </div>
            <button
              id="refresh-dashboard-btn"
              onClick={() => fetchAll(true)}
              disabled={loading || refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-300 hover:text-white transition-all disabled:opacity-40"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Main Layout */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-gray-400 text-sm">Connecting to backend…</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                  <PostComposer onPostCreated={handlePostCreated} />
                </div>

                <div className="flex flex-col gap-4">
                  {/* Crisis Status Panel */}
                  <div className={`glass-card p-5 rounded-2xl border transition-all duration-500 ${
                    crisis.crisisLevel === 'NORMAL'
                      ? 'border-green-500/20 bg-green-500/5'
                      : crisis.crisisLevel === 'WARNING'
                      ? 'border-yellow-500/30 bg-yellow-500/8'
                      : crisis.crisisLevel === 'CRITICAL'
                      ? 'border-orange-500/40 bg-orange-500/10'
                      : 'border-red-500/50 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.1)]'
                  }`}>
                    <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Crisis Monitor</div>
                    <div className={`text-xl font-bold mb-1 ${
                      crisis.crisisLevel === 'NORMAL' ? 'text-green-400'
                      : crisis.crisisLevel === 'WARNING' ? 'text-yellow-400'
                      : crisis.crisisLevel === 'CRITICAL' ? 'text-orange-400'
                      : 'text-red-400'
                    }`}>
                      {crisis.crisisLevel === 'SEVERE' ? '🚨' : crisis.crisisLevel === 'CRITICAL' ? '⚠️' : crisis.crisisLevel === 'WARNING' ? '⚡' : '✅'} {crisis.crisisLevel}
                    </div>
                    <div className="text-xs text-gray-400">
                      {crisis.negativeCounatLast5Minutes} negative signals in last 5 min
                    </div>
                  </div>

                  {/* Status Card — Auto-Refresh Toggle */}
                  <div className="glass-card p-4 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">Auto-Refresh</div>
                      <button
                        id="auto-refresh-toggle-btn"
                        onClick={handleToggleAutoRefresh}
                        disabled={autoRefreshSyncing}
                        className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${
                          autoRefreshEnabled ? 'bg-primary' : 'bg-gray-700'
                        } ${autoRefreshSyncing ? 'opacity-50' : ''}`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                            autoRefreshEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="mt-2 font-bold text-white text-sm">
                      {autoRefreshEnabled ? `Every ${autoRefreshInterval} seconds` : 'Disabled'}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Or click Refresh manually</div>
                    {dashboardSummary && dashboardSummary.averageSentiment != null && (
                      <div className="mt-2 text-xs text-gray-400">
                        Avg Sentiment: <span className="text-white font-semibold">{(dashboardSummary.averageSentiment * 100).toFixed(1)}%</span>
                        {dashboardSummary.crisisCount != null && (
                          <> · Crises: <span className="text-red-400 font-semibold">{dashboardSummary.crisisCount}</span></>
                        )}
                      </div>
                    )}
                    {refreshing && (
                      <div className="mt-3 h-1.5 rounded-full bg-gradient-to-r from-accent-neon to-primary animate-pulse" />
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mb-6">
                <StatsCards stats={statsForCards} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ResultsTable data={normalizedPosts} />
                  <SentimentAnalytics data={normalizedPosts} />
                </div>
                <div className="flex flex-col gap-4">
                  <InsightsPanel data={normalizedPosts} crisis={crisis} />
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default Dashboard;
