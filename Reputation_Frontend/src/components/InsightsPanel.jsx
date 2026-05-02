import React, { useMemo, useState } from 'react';
import { Bell, Zap, Wrench, MessageSquare, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function computeInsightsFromData(data, crisis) {
  const total = data.length || 0;
  // Support both normalized and raw backend format
  const positive = data.filter(d => d.sentiment === 'positive' || d.sentimentLabel === 'POSITIVE').length;
  const negative = data.filter(d => d.sentiment === 'negative' || d.sentimentLabel === 'NEGATIVE').length;
  const crisisItems = data.filter(d => d.crisis === true).length;
  const negativeRatio = total ? negative / total : 0;
  const recent = data.slice(-6);
  const recentNeg = recent.filter(d => d.sentiment === 'negative' || d.sentimentLabel === 'NEGATIVE').length;

  const crisisLevel = crisis?.crisisLevel || 'NORMAL';
  const negLast5 = crisis?.negativeCounatLast5Minutes || 0;

  const insights = [];

  // Crisis from live backend
  if (crisisLevel === 'SEVERE' || crisisLevel === 'CRITICAL') {
    insights.push({
      id: 'backend_crisis',
      icon: <Bell />,
      title: `${crisisLevel} crisis level detected`,
      desc: `${negLast5} negative signals in the last 5 minutes — immediate action required`,
      priority: 100,
      confidence: 98,
    });
  } else if (crisisLevel === 'WARNING') {
    insights.push({
      id: 'backend_warning',
      icon: <Megaphone />,
      title: 'Warning threshold reached',
      desc: `${negLast5} negative signals in the last 5 min — monitor closely`,
      priority: 80,
      confidence: 85,
    });
  }

  if (crisisItems > 0) {
    insights.push({
      id: 'crisis_posts',
      icon: <Bell />,
      title: 'Crisis-flagged posts detected',
      desc: `${crisisItems} posts flagged as crisis events by the AI model`,
      priority: 95,
      confidence: Math.min(100, 50 + crisisItems * 15),
    });
  }

  if (recentNeg >= 3 || negativeRatio > 0.45) {
    const conf = Math.round(Math.min(95, (recentNeg / 6) * 60 + negativeRatio * 80));
    insights.push({
      id: 'neg_spike',
      icon: <Megaphone />,
      title: 'Spike in negative sentiment',
      desc: `Recent negative posts: ${recentNeg} — trending upwards`,
      priority: 90,
      confidence: conf,
    });
  }

  const crashReports = data.filter(d => /crash|error|failed|exception|down|outage/i.test(d.text)).length;
  if (crashReports >= 2) {
    insights.push({
      id: 'crash',
      icon: <MessageSquare />,
      title: 'Users reporting incidents',
      desc: `${crashReports} posts contain error/crash keywords`,
      priority: 85,
      confidence: Math.min(95, 40 + crashReports * 20),
    });
  }

  if (negativeRatio > 0.7) {
    insights.push({
      id: 'outage',
      icon: <Zap />,
      title: 'Potential outage scenario',
      desc: 'High negative ratio across all traffic — consider failover',
      priority: 98,
      confidence: Math.round(negativeRatio * 100),
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: 'nominal',
      icon: <Wrench />,
      title: 'System nominal',
      desc: 'No major patterns detected — sentiment within normal parameters',
      priority: 10,
      confidence: 60,
    });
  }

  insights.sort((a, b) => b.priority - a.priority);
  return { insights, stats: { total, positive, negative, crisis: crisisItems } };
}

const InsightsPanel = ({ data, crisis }) => {
  const [actionMsg, setActionMsg] = useState(null);
  const { insights, stats } = useMemo(() => computeInsightsFromData(data || [], crisis), [data, crisis]);
  const negativeRatio = stats.total ? Math.round((stats.negative / stats.total) * 100) : 0;
  const hasCrisis = stats.crisis > 0 || (crisis?.crisisLevel && crisis.crisisLevel !== 'NORMAL');

  const handleAction = (label) => {
    setActionMsg(`${label} queued`);
    setTimeout(() => setActionMsg(null), 2200);
  };

  return (
    <div className="glass-card rounded-2xl border border-white/10 p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-white">AI Insights</h4>
        <div className="text-xs text-gray-400">Live analysis</div>
      </div>

      {/* CRISIS HERO CARD */}
      {hasCrisis && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-rose-500 text-white shadow-[0_0_40px_rgba(239,68,68,0.15)] ring-1 ring-red-500/30"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl">🚨</div>
            <div>
              <div className="text-base font-bold leading-tight">
                {crisis?.crisisLevel || 'CRITICAL'} CRISIS DETECTED
              </div>
              <div className="text-xs text-red-100/90">
                {crisis?.negativeCounatLast5Minutes || 0} negatives in last 5 min
              </div>
            </div>
          </div>
          <div className="text-sm text-red-50/90 mb-3">
            {stats.crisis} flagged posts • {negativeRatio}% negative overall
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAction('Take Action')}
              className="flex-1 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 transition text-sm text-center"
            >
              Take Action
            </button>
            <button
              onClick={() => handleAction('View Details')}
              className="flex-1 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 transition text-sm text-center"
            >
              View Details
            </button>
          </div>
        </motion.div>
      )}

      {/* AI INSIGHTS */}
      <div className="space-y-3 mb-8">
        <AnimatePresence>
          {insights.map((ins, i) => {
            const color = ins.priority >= 95 ? 'bg-red-600' : ins.priority >= 85 ? 'bg-amber-500' : 'bg-sky-500';
            return (
              <motion.div
                key={ins.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ delay: i * 0.04 }}
                className="p-3 rounded-lg bg-dark-900/40 border border-white/5 flex items-center gap-3"
                title={ins.desc}
              >
                <div className={`w-1 h-14 rounded-full ${color} mr-1 flex-shrink-0`} />
                <div className="text-accent-neon flex-shrink-0">{ins.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-200 font-medium truncate">{ins.title}</div>
                    <div className="ml-auto flex items-center gap-2 flex-shrink-0">
                      <div className="text-xs text-gray-500">Conf <span className="text-white font-semibold">{ins.confidence}%</span></div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 truncate">{ins.desc}</div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* RECOMMENDED ACTIONS */}
      <div>
        <h5 className="font-semibold text-xs text-gray-400 mb-3 uppercase tracking-widest">Recommended Actions</h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: <Zap />, title: 'Investigate', desc: 'Run backend diagnostics', action: 'Investigate services' },
            { icon: <Bell />, title: 'Scale infra', desc: 'Add cluster capacity', action: 'Scale infra' },
            { icon: <MessageSquare />, title: 'Notify users', desc: 'Prepare status updates', action: 'Notify users' },
            { icon: <Wrench />, title: 'Deploy hotfix', desc: 'Quick patch for critical paths', action: 'Deploy hotfix' },
          ].map(({ icon, title, desc, action }) => (
            <motion.div
              key={action}
              whileHover={{ y: -3, boxShadow: '0 10px 30px rgba(124,58,237,0.10)' }}
              className="p-4 rounded-xl glass-card border border-white/5 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-accent-neon flex-shrink-0">
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{title}</div>
                  <div className="text-xs text-gray-400">{desc}</div>
                </div>
                <button
                  onClick={() => handleAction(action)}
                  className="ml-1 px-2 py-1 bg-accent-neon/10 text-accent-neon rounded-md text-xs flex-shrink-0"
                >
                  Run
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {actionMsg && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="mt-4 inline-block px-3 py-2 rounded-lg bg-accent-neon/10 text-accent-neon text-sm"
          >
            ✓ {actionMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InsightsPanel;
