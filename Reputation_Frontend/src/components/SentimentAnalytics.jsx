import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Search, Eye, X } from 'lucide-react';
import { analyzeSentimentByPostId, getSentimentDetails } from '../api';

const Pie = ({ positive, negative }) => {
  const total = positive + negative || 1;
  const targetP = Math.round((positive / total) * 100);
  const n = 100 - targetP;
  const r = 40;
  const circ = 2 * Math.PI * r;
  const [animP, setAnimP] = useState(0);

  useEffect(() => {
    let raf = null;
    const start = performance.now();
    const dur = 900;
    const step = (t) => {
      const progress = Math.min((t - start) / dur, 1);
      setAnimP(Math.round(progress * targetP));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => raf && cancelAnimationFrame(raf);
  }, [targetP]);

  return (
    <svg width="120" height="120" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="g1_analytic" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#00f0ff" />
        </linearGradient>
      </defs>
      <g transform="translate(50,50)">
        <circle r={r} fill="#0b1020" />
        <circle r={r} fill="transparent" stroke="#ef4444" strokeWidth="10"
          strokeDasharray={`${(n / 100) * circ} ${circ}`} transform="rotate(-90)"
          strokeLinecap="round" opacity={0.9} />
        <circle r={r} fill="transparent" stroke="url(#g1_analytic)" strokeWidth="10"
          strokeDasharray={`${(animP / 100) * circ} ${circ}`}
          transform={`rotate(${(n / 100) * 360 - 90})`} strokeLinecap="round" />
        <text x="0" y="4" textAnchor="middle" style={{ fontSize: 10 }} fill="#fff" fontWeight="bold">
          {animP}%
        </text>
      </g>
    </svg>
  );
};

const SentimentAnalytics = ({ data = [] }) => {
  // ─── Existing stats logic (PRESERVED) ──────────────────────────
  const stats = useMemo(() => {
    const total = data.length || 0;
    // Support both normalized (.sentiment) and raw backend (.sentimentLabel) formats
    const positive = data.filter(d =>
      d.sentiment === 'positive' || d.sentimentLabel === 'POSITIVE'
    ).length;
    const negative = data.filter(d =>
      d.sentiment === 'negative' || d.sentimentLabel === 'NEGATIVE'
    ).length;
    const neutral = data.filter(d =>
      d.sentiment === 'neutral' || d.sentimentLabel === 'NEUTRAL'
    ).length;
    const ratio = total ? Math.round((positive / total) * 100) : 0;
    const negRatio = total ? Math.round((negative / total) * 100) : 0;
    const avgScore = total
      ? Math.round(
          data.reduce((acc, d) => acc + (d.sentimentScore != null ? d.sentimentScore * 100 : (d.score || 0)), 0) / total
        )
      : 0;
    return { total, positive, negative, neutral, ratio, negRatio, avgScore };
  }, [data]);

  // ─── NEW: Analyze by Post ID ───────────────────────────────────
  const [analyzePostId, setAnalyzePostId] = useState('');
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState(null);
  const [analyzeError, setAnalyzeError] = useState(null);

  const handleAnalyze = async () => {
    if (!analyzePostId.trim() || analyzeLoading) return;
    setAnalyzeLoading(true);
    setAnalyzeError(null);
    setAnalyzeResult(null);
    setDetailsResult(null);
    try {
      const result = await analyzeSentimentByPostId(analyzePostId.trim());
      setAnalyzeResult(result);
    } catch (err) {
      setAnalyzeError('Failed to analyze sentiment. Check if post ID is valid and backend is running.');
    } finally {
      setAnalyzeLoading(false);
    }
  };

  // ─── NEW: View Sentiment Details ───────────────────────────────
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsResult, setDetailsResult] = useState(null);
  const [detailsError, setDetailsError] = useState(null);

  const handleViewDetails = async (postId) => {
    if (!postId || detailsLoading) return;
    setDetailsLoading(true);
    setDetailsError(null);
    setDetailsResult(null);
    try {
      const result = await getSentimentDetails(postId);
      setDetailsResult(result);
    } catch (err) {
      setDetailsError('Failed to load sentiment details.');
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-6 rounded-2xl glass-card border border-white/10 bg-white/5 shadow-[0_0_50px_rgba(124,58,237,0.05)] overflow-hidden"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left */}
        <div className="text-center md:text-left min-w-[180px]">
          <h5 className="font-bold text-white mb-2 text-lg tracking-wide">Sentiment Overview</h5>
          <p className="text-sm text-gray-400">
            AI-driven analysis of <span className="text-white font-semibold">{stats.total}</span> posts
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(124,58,237,0.5)]" />
              <span className="text-xs text-gray-400">Pos: {stats.positive}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <span className="text-xs text-gray-400">Neu: {stats.neutral}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              <span className="text-xs text-gray-400">Neg: {stats.negative}</span>
            </div>
          </div>
        </div>

        {/* Center: Donut */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full pointer-events-none scale-150" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 120 }}
            className="relative z-10"
          >
            <Pie positive={stats.positive} negative={stats.negative} />
          </motion.div>
        </div>

        {/* Right: Key Stats */}
        <div className="flex-1 w-full max-w-sm">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
              <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest font-bold">Avg Score</div>
              <div className="text-xl font-bold text-white">{stats.avgScore}%</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
              <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest font-bold">Positivity Ratio</div>
              <div className="text-xl font-bold text-accent-neon">{stats.ratio}%</div>
            </div>
          </div>

          {stats.negRatio > 40 ? (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Warning: Negative sentiment trending upwards ({stats.negRatio}%)
            </motion.div>
          ) : (
            <div className="px-4 py-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Sentiment metrics within normal parameters
            </div>
          )}
        </div>
      </div>

      {/* ─── NEW: Analyze by Post ID ─────────────────────────────── */}
      <div className="mt-6 pt-6 border-t border-white/5">
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-4 h-4 text-accent-neon" />
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Analyze Post Sentiment</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            id="sentiment-post-id-input"
            type="text"
            value={analyzePostId}
            onChange={(e) => setAnalyzePostId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            placeholder="Enter Post ID..."
            className="flex-1 bg-dark-800/60 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 text-sm transition-all duration-300"
          />
          <button
            id="analyze-sentiment-btn"
            onClick={handleAnalyze}
            disabled={!analyzePostId.trim() || analyzeLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-accent-violet text-white text-sm font-semibold hover:shadow-[0_0_20px_rgba(155,48,255,0.3)] transition-all duration-300 disabled:opacity-40"
          >
            {analyzeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Analyze
          </button>
        </div>

        {/* Analyze Error */}
        <AnimatePresence>
          {analyzeError && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs"
            >
              {analyzeError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analyze Result */}
        <AnimatePresence>
          {analyzeResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-3 p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-medium">Analysis Result</span>
                <button
                  id="view-sentiment-details-btn"
                  onClick={() => handleViewDetails(analyzePostId.trim())}
                  disabled={detailsLoading}
                  className="flex items-center gap-1.5 text-xs text-accent-neon hover:text-white transition-colors disabled:opacity-40"
                >
                  {detailsLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Eye className="w-3 h-3" />}
                  View Details
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-dark-900/40 border border-white/5">
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Sentiment</div>
                  <div className={`font-bold text-sm ${
                    analyzeResult.sentimentLabel === 'POSITIVE' ? 'text-emerald-400'
                    : analyzeResult.sentimentLabel === 'NEGATIVE' ? 'text-red-400'
                    : 'text-blue-400'
                  }`}>
                    {analyzeResult.sentimentLabel || 'N/A'}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-dark-900/40 border border-white/5">
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Score</div>
                  <div className="text-white font-bold text-sm">
                    {analyzeResult.sentimentScore != null ? `${(analyzeResult.sentimentScore * 100).toFixed(1)}%` : 'N/A'}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Details Error */}
        <AnimatePresence>
          {detailsError && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs"
            >
              {detailsError}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sentiment Details Panel */}
        <AnimatePresence>
          {detailsResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-3 p-4 rounded-xl bg-dark-900/60 border border-primary/20"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Token Breakdown</span>
                <button
                  onClick={() => setDetailsResult(null)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Token breakdown */}
              {detailsResult.tokens && detailsResult.tokens.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {detailsResult.tokens.map((token, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                      <span className="text-xs text-gray-300 font-mono">{token.token || token.word || token.text || '—'}</span>
                      <span className={`text-xs font-bold ${
                        (token.score || 0) > 0 ? 'text-emerald-400' : (token.score || 0) < 0 ? 'text-red-400' : 'text-blue-400'
                      }`}>
                        {token.score != null ? token.score.toFixed(3) : '—'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-500 text-center py-3">No token breakdown available</div>
              )}

              {/* Sentiment scores summary */}
              {detailsResult.sentimentScores && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {Object.entries(detailsResult.sentimentScores).map(([label, score]) => (
                    <div key={label} className="p-2 rounded-lg bg-white/5 text-center">
                      <div className="text-[10px] text-gray-500 uppercase font-bold">{label}</div>
                      <div className="text-sm font-bold text-white">{typeof score === 'number' ? `${(score * 100).toFixed(1)}%` : score}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SentimentAnalytics;
