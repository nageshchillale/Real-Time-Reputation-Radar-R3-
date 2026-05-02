import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldAlert, Cpu, Layers } from 'lucide-react';

const valueProps = [
  {
    icon: Zap,
    title: "Faster than batch systems",
    desc: "Process data instantaneously rather than waiting for nightly ETL jobs."
  },
  {
    icon: ShieldAlert,
    title: "Proactive crisis detection",
    desc: "Identify brewing storms before they reach critical mass."
  },
  {
    icon: Cpu,
    title: "AI-generated response suggestions",
    desc: "Deploy mitigation strategies instantly with RAG-backed LLMs."
  },
  {
    icon: Layers,
    title: "Scalable streaming architecture",
    desc: "Effortlessly handle traffic spikes during major viral events."
  }
];

const ValueProposition = () => {
  return (
    <section id="value-prop" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for <span className="text-gradient">Real-Time Intelligence</span></h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Traditional listening tools look backwards. R3 looks forward, processing streams continuously to give you the ultimate tactical advantage during critical moments.
            </p>
            
            <div className="space-y-6">
              {valueProps.map((prop, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                  <div className="p-3 rounded-lg bg-dark-800 text-primary-light">
                    <prop.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">{prop.title}</h4>
                    <p className="text-gray-500">{prop.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[600px] w-full rounded-2xl glass-card overflow-hidden flex items-center justify-center border-primary/20"
          >
            {/* Abstract Tech Visual */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-dark-900 to-dark-900" />
            <div className="absolute w-64 h-64 bg-accent-neon/10 rounded-full blur-[80px] animate-pulse" />
            
            <div className="relative z-10 w-3/4 aspect-square border border-white/10 rounded-full flex items-center justify-center animate-[spin_60s_linear_infinite]">
              <div className="w-3/4 aspect-square border border-dashed border-white/20 rounded-full flex items-center justify-center animation-delay-1000">
                <div className="w-1/2 aspect-square border border-primary/30 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite_reverse]">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent-violet glow-button" />
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
