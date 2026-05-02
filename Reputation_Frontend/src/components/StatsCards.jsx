import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, TrendingUp, TrendingDown, ShieldAlert, Loader2 } from 'lucide-react';
import { getStatsByRange } from '../api';

const useCount = (target, duration = 1200) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let raf = null;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => raf && cancelAnimationFrame(raf);
  }, [target, duration]);
  return count;
};

const crisisStyles = {
  SEVERE:   { border: 'border-red-500/60',    badge: 'bg-red-500/15 text-red-400',    dot: 'bg-red-500'    },
  CRITICAL: { border: 'border-orange-500/50', badge: 'bg-orange-500/15 text-orange-400', dot: 'bg-orange-500' },
  WARNING:  { border: 'border-yellow-500/40', badge: 'bg-yellow-500/15 text-yellow-400', dot: 'bg-yellow-500' },
  NORMAL:   { border: 'border-green-500/30',  badge: 'bg-green-500/10 text-green-400',  dot: 'bg-green-500'  },
};

const StatCard = ({ label, value, borderColor, icon, suffix = '' }) => {
  const count = useCount(value, 1000);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(124,58,237,0.12)' }}
      className={`p-5 rounded-xl glass-card border ${borderColor} transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold">{label}</div>
          <div className="text-2xl font-bold mt-2 text-white">{count}{suffix}</div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

const CrisisCard = ({ level }) => {
  const style = crisisStyles[level] || crisisStyles.NORMAL;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`p-5 rounded-xl glass-card border ${style.border} transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Crisis Level</div>
          <div className={`inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full text-sm font-bold ${style.badge}`}>
            <div className={`w-2 h-2 rounded-full ${style.dot} ${level !== 'NORMAL' ? 'animate-pulse' : ''}`} />
            {level}
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
          <ShieldAlert className={`w-5 h-5 ${level === 'NORMAL' ? 'text-green-400' : 'text-red-400'}`} />
        </div>
      </div>
    </motion.div>
  );
};

const StatsCards = ({ stats }) => {
  const [range, setRange] = useState('all');
  const [filteredStats, setFilteredStats] = useState(null);
  const [filterLoading, setFilterLoading] = useState(false);
  const [filterError, setFilterError] = useState(null);

  // Use filtered stats if available, otherwise fall back to props
  const displayStats = filteredStats || stats;
  const total    = displayStats?.total    ?? displayStats?.totalPosts    ?? 0;
  const positive = displayStats?.positive ?? displayStats?.positivePosts ?? 0;
  const negative = displayStats?.negative ?? displayStats?.negativePosts ?? 0;
  const crisis   = displayStats?.crisisLevel || stats?.crisisLevel || 'NORMAL';

  const handleRangeChange = async (newRange) => {
    setRange(newRange);
    if (newRange === 'all') {
      setFilteredStats(null);
      setFilterError(null);
      return;
    }
    setFilterLoading(true);
    setFilterError(null);
    try {
      const data = await getStatsByRange(newRange);
      setFilteredStats(data);
    } catch (err) {
      setFilterError('Failed to load stats for selected range.');
      setFilteredStats(null);
    } finally {
      setFilterLoading(false);
    }
  };

  return (
    <div>
      {/* Filter Row */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Statistics</h4>
        <div className="flex items-center gap-2">
          {filterLoading && <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />}
          <select
            id="stats-range-filter"
            value={range}
            onChange={(e) => handleRangeChange(e.target.value)}
            className="bg-dark-800/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-primary/50 transition-all cursor-pointer appearance-none"
          >
            <option value="all">All Time</option>
            <option value="1h">Last 1 Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      {filterError && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
          {filterError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Posts"
          value={total}
          borderColor="border-white/10"
          icon={<MessageSquare className="w-5 h-5 text-gray-400" />}
        />
        <StatCard
          label="Positive"
          value={positive}
          borderColor="border-green-500/30"
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
        />
        <StatCard
          label="Negative"
          value={negative}
          borderColor="border-red-500/30"
          icon={<TrendingDown className="w-5 h-5 text-red-400" />}
        />
        <CrisisCard level={crisis} />
      </div>
    </div>
  );
};

export default StatsCards;
