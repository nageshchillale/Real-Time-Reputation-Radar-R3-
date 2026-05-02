import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, ShieldCheck, Zap, Bot } from 'lucide-react';

const AnimatedCounter = ({ value, duration = 1 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setDisplayValue(Math.floor(progress * value));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return displayValue;
};

const TrustBar = ({ stats, posts }) => {
  const totalPosts = Array.isArray(posts) ? posts.length : 0;
  const positiveCount = Array.isArray(posts)
    ? posts.filter(p => p.sentiment === 'positive').length
    : 0;
  const negativeCount = Array.isArray(posts)
    ? posts.filter(p => p.sentiment === 'negative').length
    : 0;

  const metrics = [
    {
      icon: Database,
      label: "Messages Analyzed",
      value: stats?.totalPosts || totalPosts,
      suffix: "+"
    },
    {
      icon: ShieldCheck,
      label: "Detection Accuracy",
      value: 99.2,
      suffix: "%",
      static: true
    },
    {
      icon: Zap,
      label: "Positive Sentiment",
      value: positiveCount,
      suffix: ""
    },
    {
      icon: Bot,
      label: "Negative Sentiment",
      value: negativeCount,
      suffix: ""
    }
  ];

  return (
    <section className="relative -mt-32 z-30 px-6">
      <div className="max-w-6xl mx-auto glass-card border border-white/20 rounded-2xl p-8 relative overflow-hidden shadow-2xl shadow-primary/10">
        {/* Subtle glow behind card */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary-light to-transparent opacity-50" />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
          {metrics.map((metric, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center justify-center text-center px-4"
            >
              <div className="mb-4 p-3 rounded-full bg-white/5 border border-white/5 flex items-center justify-center relative group">
                <div className="absolute inset-0 bg-primary/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <metric.icon className="w-6 h-6 text-accent-neon relative z-10" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight">
                {metric.static ? (
                  metric.value.toFixed(1)
                ) : (
                  <AnimatedCounter value={metric.value} duration={1.5} />
                )}
                {metric.suffix}
              </h3>
              <p className="text-sm text-gray-400 font-medium">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
