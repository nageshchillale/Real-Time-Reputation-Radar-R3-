import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap, Loader2, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import { createPost, submitPost, analyzeSentiment } from '../api';

const sentimentConfig = {
  POSITIVE: {
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    glow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]',
    icon: <TrendingUp className="w-5 h-5" />,
    label: 'Positive',
  },
  NEGATIVE: {
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    glow: 'shadow-[0_0_30px_rgba(239,68,68,0.15)]',
    icon: <TrendingDown className="w-5 h-5" />,
    label: 'Negative',
  },
  NEUTRAL: {
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    glow: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]',
    icon: <Minus className="w-5 h-5" />,
    label: 'Neutral',
  },
};

const crisisConfig = {
  SEVERE: { color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/40', label: '🚨 SEVERE' },
  CRITICAL: { color: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/40', label: '⚠️ CRITICAL' },
  WARNING: { color: 'text-yellow-400', bg: 'bg-yellow-500/15', border: 'border-yellow-500/40', label: '⚡ WARNING' },
  NORMAL: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', label: '✅ NORMAL' },
};

const PostComposer = ({ onPostCreated }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [analyzeResult, setAnalyzeResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmitPost = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError(null);
    setAnalyzeResult(null);
    try {
      const post = await submitPost({ content: text.trim() });
      setResult(post);
      setText('');
      if (onPostCreated) onPostCreated(post);
    } catch (err) {
      setError('Failed to create post. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAnalyze = async () => {
    if (!text.trim() || analyzeLoading) return;
    setAnalyzeLoading(true);
    setError(null);
    setResult(null);
    try {
      const sentiment = await analyzeSentiment(text.trim());
      setAnalyzeResult(sentiment);
    } catch (err) {
      setError('Failed to analyze sentiment. Make sure the backend is running.');
    } finally {
      setAnalyzeLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmitPost();
    }
  };

  const sConfig = result ? sentimentConfig[result.sentimentLabel] || sentimentConfig.NEUTRAL : null;
  const cConfig = result ? crisisConfig[result.crisisLevel] || crisisConfig.NORMAL : null;
  const aConfig = analyzeResult ? sentimentConfig[analyzeResult.label] || sentimentConfig.NEUTRAL : null;

  return (
    <div className="space-y-4">
      {/* Input Card */}
      <div className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden">
        {/* Subtle animated gradient border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-accent-neon/10 to-accent-violet/20 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent-violet flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-semibold text-white">AI Post Analyzer</h4>
            <span className="ml-auto text-xs text-gray-500">Ctrl+Enter to submit</span>
          </div>

          <textarea
            id="post-composer-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message to analyze sentiment and detect crises..."
            rows={3}
            className="w-full bg-dark-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_20px_rgba(155,48,255,0.1)] resize-none transition-all duration-300 text-sm"
          />

          <div className="flex items-center gap-3 mt-4">
            <button
              id="submit-post-btn"
              onClick={handleSubmitPost}
              disabled={!text.trim() || loading}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-accent-violet text-white font-semibold shadow-[0_0_20px_rgba(155,48,255,0.3)] hover:shadow-[0_0_30px_rgba(155,48,255,0.5)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {loading ? 'Submitting…' : 'Submit Post'}
            </button>

            <button
              id="quick-analyze-btn"
              onClick={handleQuickAnalyze}
              disabled={!text.trim() || analyzeLoading}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 hover:border-accent-neon/30 transition-all duration-300 disabled:opacity-40"
            >
              {analyzeLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 text-accent-neon" />
              )}
              {analyzeLoading ? 'Analyzing…' : 'Quick Analyze'}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Result Card */}
      <AnimatePresence mode="wait">
        {result && sConfig && (
          <motion.div
            key="post-result"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className={`p-5 rounded-2xl ${sConfig.bg} border ${sConfig.border} ${sConfig.glow} relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400 font-medium">Post Created Successfully</span>
                </div>
                <span className="text-xs text-gray-500">ID: #{result.id}</span>
              </div>

              <p className="text-sm text-gray-300 mb-4 leading-relaxed">"{result.text}"</p>

              <div className="grid grid-cols-3 gap-3">
                {/* Sentiment */}
                <div className="p-3 rounded-xl bg-dark-900/40 border border-white/5">
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Sentiment</div>
                  <div className={`flex items-center gap-1.5 font-bold text-sm ${sConfig.color}`}>
                    {sConfig.icon}
                    {sConfig.label}
                  </div>
                </div>

                {/* Score */}
                <div className="p-3 rounded-xl bg-dark-900/40 border border-white/5">
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Score</div>
                  <div className="text-white font-bold text-sm">
                    {(result.sentimentScore * 100).toFixed(1)}%
                  </div>
                </div>

                {/* Crisis */}
                <div className={`p-3 rounded-xl ${cConfig.bg} border ${cConfig.border}`}>
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Crisis</div>
                  <div className={`font-bold text-sm ${cConfig.color}`}>
                    {cConfig.label}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Analyze Result Card */}
      <AnimatePresence mode="wait">
        {analyzeResult && aConfig && (
          <motion.div
            key="analyze-result"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className={`p-5 rounded-2xl ${aConfig.bg} border ${aConfig.border} ${aConfig.glow}`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-accent-neon" />
              <span className="text-xs text-gray-400 font-medium">Quick Sentiment Analysis</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-dark-900/40 border border-white/5">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Label</div>
                <div className={`flex items-center gap-1.5 font-bold text-sm ${aConfig.color}`}>
                  {aConfig.icon}
                  {aConfig.label}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-dark-900/40 border border-white/5">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Confidence</div>
                <div className="text-white font-bold text-sm">
                  {(analyzeResult.score * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostComposer;
