import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, ChevronUp, Bell, CheckCircle2, TrendingUp } from 'lucide-react';

const DashboardPreview = ({ posts = [], stats = null, crisis = null }) => {
  // Get recent 5 posts
  const recentPosts = useMemo(() => {
    if (!Array.isArray(posts)) return [];
    return posts.slice(0, 5);
  }, [posts]);

  // Calculate sentiment distribution
  const sentimentStats = useMemo(() => {
    if (!Array.isArray(posts) || posts.length === 0) {
      return { positive: 0, negative: 0, neutral: 0 };
    }
    return {
      positive: posts.filter(p => p.sentiment === 'positive').length,
      negative: posts.filter(p => p.sentiment === 'negative').length,
      neutral: posts.filter(p => p.sentiment === 'neutral').length
    };
  }, [posts]);

  const negativePercentage = posts.length > 0
    ? Math.round((sentimentStats.negative / posts.length) * 100)
    : 0;

  const hasCrisis = crisis?.crisis_detected || false;

  // Generate sentiment visualization data
  const sentimentData = useMemo(() => {
    const data = Array(20).fill(50);
    if (sentimentStats.negative > 0) {
      data.forEach((_, i) => {
        data[i] = Math.max(10, Math.min(90, 50 + (Math.random() - 0.5) * 40 + (sentimentStats.negative / posts.length) * 40));
      });
    }
    return data;
  }, [sentimentStats, posts.length]);

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <section id="dashboard" className="py-24 px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-accent-neon tracking-widest uppercase mb-3">System Preview</h2>
          <h3 className="text-3xl md:text-5xl font-bold mb-6">Mission Control for <span className="text-gradient">Brand Health</span></h3>
        </div>

        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative">
          {/* Dashboard Header */}
          <div className="h-14 border-b border-white/10 bg-dark-900/50 flex items-center px-6 justify-between">
            <div className="flex gap-2">
              <div className={`w-3 h-3 rounded-full ${hasCrisis ? 'bg-red-500/80' : 'bg-green-500/80'}`} />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400 font-medium">
              <span className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${hasCrisis ? 'bg-red-500 animate-pulse' : 'bg-green-500 animate-pulse'}`} />
                {hasCrisis ? 'Crisis Detected' : 'System Nominal'}
              </span>
              <Bell className="w-4 h-4 ml-2 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          <div className="p-6 md:p-8 bg-dark-900/80 backdrop-blur-xl grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Live Graph & Recent Posts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Sentiment Graph */}
              <div className="glass-card p-6 rounded-xl border border-white/5 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6 text-white">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-accent-neon" /> Sentiment Distribution ({posts.length} posts)
                  </h4>
                  <div className="text-xs bg-dark-800 px-3 py-1 rounded-full border border-white/10 text-gray-400">
                    Real-time
                  </div>
                </div>

                {/* The Graph */}
                <div className="h-48 flex items-end gap-1 mb-4 relative z-10 w-full overflow-hidden">
                  {sentimentData.map((val, i) => (
                    <motion.div
                      key={i}
                      layout
                      className={`flex-1 rounded-t-sm transition-all duration-300 ${
                        val > 70
                          ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                          : val < 30
                          ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                          : 'bg-primary shadow-[0_0_10px_rgba(155,48,255,0.3)]'
                      }`}
                      style={{ height: `${val}%` }}
                    />
                  ))}
                  {/* Hazard Line */}
                  <div className="absolute top-[20%] w-full border-t border-dashed border-red-500/50 z-0 flex items-center">
                    <span className="text-[10px] text-red-500 bg-dark-900 pr-2 absolute left-0 -top-[7px]">CRITICAL THRESHOLD</span>
                  </div>
                </div>

                <div className="flex gap-6 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500" />
                    <span className="text-gray-400">Positive: {sentimentStats.positive}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-primary" />
                    <span className="text-gray-400">Neutral: {sentimentStats.neutral}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-500" />
                    <span className="text-gray-400">Negative: {sentimentStats.negative}</span>
                  </div>
                </div>
              </div>

              {/* Recent Posts Feed */}
              <div className="glass-card p-6 rounded-xl border border-white/5">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent-neon" /> Recent Posts
                </h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {recentPosts.length > 0 ? (
                    recentPosts.map((post, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-3 rounded-lg border-l-4 ${
                          post.sentiment === 'positive'
                            ? 'bg-green-500/10 border-green-500/50'
                            : post.sentiment === 'negative'
                            ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                            : 'bg-blue-500/10 border-blue-500/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-300 break-words">{post.text}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                post.sentiment === 'positive'
                                  ? 'bg-green-500/20 text-green-300'
                                  : post.sentiment === 'negative'
                                  ? 'bg-red-500/20 text-red-300'
                                  : 'bg-blue-500/20 text-blue-300'
                              }`}>
                                {post.sentiment?.charAt(0).toUpperCase() + post.sentiment?.slice(1)}
                              </span>
                              <span className="text-xs text-gray-500">{formatTime(post.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-sm">No posts yet. Start monitoring to see posts here.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Crisis Alert & Metrics */}
            <div className="flex flex-col gap-6">
              
              {/* Crisis Status */}
              <div className={`p-5 rounded-xl border transition-colors duration-500 ${
                hasCrisis
                  ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                  : 'bg-white/5 border-white/5'
              }`}>
                <div className="flex items-start gap-3">
                  {hasCrisis ? (
                    <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 animate-bounce" />
                  ) : (
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  )}
                  <div>
                    <h5 className={`font-bold text-sm mb-1 ${
                      hasCrisis ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {hasCrisis ? 'CRISIS DETECTED' : 'No Current Anomalies'}
                    </h5>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {hasCrisis
                        ? 'Critical sentiment spike detected. Immediate escalation recommended.'
                        : 'Sentiment metrics within normal parameters.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Severity Metrics */}
              <div className="glass-card flex-1 p-5 rounded-xl border border-white/5">
                <h5 className="font-semibold text-sm text-white mb-4">Metrics</h5>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Negative Sentiment</span>
                      <span className="text-white font-medium">{negativePercentage}%</span>
                    </div>
                    <div className="w-full bg-dark-800 rounded-full h-1.5">
                      <motion.div
                        className="bg-gradient-to-r from-orange-400 to-red-500 h-1.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${negativePercentage}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Total Posts</span>
                      <span className="text-accent-neon font-medium flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" /> {posts.length}
                      </span>
                    </div>
                    <div className="w-full bg-dark-800 rounded-full h-1.5">
                      <motion.div
                        className="bg-accent-neon h-1.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (posts.length / 100) * 100)}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
