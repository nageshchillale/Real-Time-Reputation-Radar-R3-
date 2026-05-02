import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Zap, Filter, Search, Lightbulb, Activity, ChevronRight } from 'lucide-react';

const pipelineSteps = [
  { icon: Database, label: "Data Streams", detail: "Twitter, Reddit, News", stage: "ingestion" },
  { icon: Zap, label: "Streaming Engine", detail: "Real-time intake", stage: "ingestion" },
  { icon: Filter, label: "Sentiment Analysis", detail: "NLP Classification", stage: "sentiment" },
  { icon: Search, label: "Anomaly Detection", detail: "Spike identification", stage: "detection" },
  { icon: Lightbulb, label: "AI Response", detail: "LLM + RAG", stage: "response" },
  { icon: Activity, label: "Alerts Dashboard", detail: "Live analytics", stage: "output" }
];

// Active/highlighted stages
const activeStages = new Set(["sentiment", "detection"]);

const ArrowConnector = ({ index }) => (
  <div className="hidden lg:flex items-center justify-center absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-8">
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 + 0.3, duration: 0.4 }}
      className="flex items-center"
    >
      <div className="w-4 h-[2px] bg-gradient-to-r from-primary/80 to-accent-neon/80" />
      <ChevronRight className="w-4 h-4 text-accent-neon/80 -ml-1.5" />
    </motion.div>
  </div>
);

const MobileArrow = () => (
  <div className="flex lg:hidden items-center justify-center py-2">
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center gap-0.5"
    >
      <div className="w-[2px] h-4 bg-gradient-to-b from-primary/60 to-accent-neon/60" />
      <ChevronRight className="w-4 h-4 text-accent-neon/60 rotate-90 -mt-1" />
    </motion.div>
  </div>
);

const Pipeline = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section id="pipeline" className="py-24 relative px-6 bg-dark-800/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-accent-neon tracking-widest uppercase mb-3">How It Works</h2>
          <h3 className="text-3xl md:text-5xl font-bold mb-6">Processing <span className="text-gradient">Pipeline</span></h3>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            From raw social data to actionable AI-driven intelligence in milliseconds.
          </p>
        </div>

        <div className="relative">
          {/* Animated flow line (desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-[8%] right-[8%] h-[2px] -translate-y-1/2 z-0">
            <div className="h-full w-full rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, #0ea5a4, #7c3aed, #06b6d4, transparent)',
                  backgroundSize: '200% 100%',
                  animation: 'pipelineFlow 4s linear infinite',
                }}
              />
            </div>
          </div>

          {/* Pipeline glow particles (desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-[8%] right-[8%] h-1 -translate-y-1/2 z-0 overflow-hidden">
            <div
              className="absolute w-12 h-[3px] rounded-full blur-[2px]"
              style={{
                background: 'linear-gradient(90deg, transparent, #00f0ff, transparent)',
                animation: 'pipelineParticle 3s ease-in-out infinite',
              }}
            />
          </div>

          {/* Desktop grid layout */}
          <div className="hidden lg:grid grid-cols-6 gap-6 relative z-10">
            {pipelineSteps.map((step, index) => {
              const isActive = activeStages.has(step.stage);
              const isHovered = hoveredIndex === index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
                  className="relative flex flex-col items-center"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Node circle */}
                  <div
                    className={`w-16 h-16 rounded-full border flex items-center justify-center mb-4 relative group transition-all duration-500 ${
                      isActive
                        ? 'border-accent-neon/50 bg-accent-neon/10 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                        : 'glass-card border-white/20 shadow-[0_0_15px_rgba(0,0,0,0.5)]'
                    } ${isHovered ? 'scale-110' : ''}`}
                  >
                    {/* Hover glow ring */}
                    <div
                      className={`absolute inset-0 rounded-full transition-opacity duration-500 ${
                        isHovered
                          ? 'opacity-100'
                          : isActive
                          ? 'opacity-60'
                          : 'opacity-0'
                      }`}
                      style={{
                        background: isActive
                          ? 'radial-gradient(circle, rgba(0,240,255,0.15) 0%, transparent 70%)'
                          : 'radial-gradient(circle, rgba(155,48,255,0.15) 0%, transparent 70%)',
                        filter: 'blur(8px)',
                      }}
                    />

                    {/* Active pulse ring */}
                    {isActive && (
                      <div
                        className="absolute inset-[-4px] rounded-full border border-accent-neon/30"
                        style={{
                          animation: 'pipelinePulse 2.5s ease-in-out infinite',
                        }}
                      />
                    )}

                    <step.icon
                      className={`w-6 h-6 relative z-10 transition-colors duration-300 ${
                        isActive
                          ? 'text-accent-neon'
                          : isHovered
                          ? 'text-accent-neon'
                          : 'text-white'
                      }`}
                    />
                  </div>

                  {/* Label */}
                  <h4 className="text-sm font-bold text-white text-center mb-1">
                    <span className={`mr-1 ${isActive ? 'text-accent-neon' : 'text-primary-light'}`}>
                      {index + 1}.
                    </span>
                    {step.label}
                  </h4>
                  <p className="text-xs text-gray-500 text-center">{step.detail}</p>

                  {/* Active badge */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 px-2 py-0.5 rounded-full bg-accent-neon/10 border border-accent-neon/20"
                    >
                      <span className="text-[10px] font-semibold text-accent-neon uppercase tracking-wider">Active</span>
                    </motion.div>
                  )}

                  {/* Arrow connector to next step */}
                  {index < pipelineSteps.length - 1 && (
                    <ArrowConnector index={index} />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Mobile / Tablet layout (vertical) */}
          <div className="flex flex-col lg:hidden relative z-10">
            {pipelineSteps.map((step, index) => {
              const isActive = activeStages.has(step.stage);

              return (
                <React.Fragment key={index}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                    className="flex items-center gap-4"
                  >
                    <div
                      className={`w-14 h-14 rounded-full border flex items-center justify-center flex-shrink-0 relative transition-all duration-500 ${
                        isActive
                          ? 'border-accent-neon/50 bg-accent-neon/10 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                          : 'glass-card border-white/20'
                      }`}
                    >
                      {isActive && (
                        <div
                          className="absolute inset-[-3px] rounded-full border border-accent-neon/30"
                          style={{ animation: 'pipelinePulse 2.5s ease-in-out infinite' }}
                        />
                      )}
                      <step.icon
                        className={`w-5 h-5 relative z-10 ${isActive ? 'text-accent-neon' : 'text-white'}`}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-white">
                        <span className={`mr-1 ${isActive ? 'text-accent-neon' : 'text-primary-light'}`}>
                          {index + 1}.
                        </span>
                        {step.label}
                        {isActive && (
                          <span className="ml-2 text-[10px] font-semibold text-accent-neon bg-accent-neon/10 border border-accent-neon/20 px-1.5 py-0.5 rounded-full uppercase">
                            Active
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">{step.detail}</p>
                    </div>
                  </motion.div>
                  {index < pipelineSteps.length - 1 && <MobileArrow />}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pipeline-specific keyframe animations */}
      <style>{`
        @keyframes pipelineFlow {
          0% { background-position: 200% 0%; }
          100% { background-position: -200% 0%; }
        }
        @keyframes pipelineParticle {
          0% { left: -10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 110%; opacity: 0; }
        }
        @keyframes pipelinePulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.08); }
        }
      `}</style>
    </section>
  );
};

export default Pipeline;
