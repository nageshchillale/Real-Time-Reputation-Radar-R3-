import React from 'react';
import { motion } from 'framer-motion';
import { Landmark, ShoppingCart, Antenna, Building2 } from 'lucide-react';

const cases = [
  {
    icon: Landmark,
    title: "Fintech Outage Detection",
    desc: "Detect user frustration spikes instantly when payment gateways or banking apps experience downtime.",
    tags: ["High Velocity", "Critical Risk"]
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Crisis Monitoring",
    desc: "Track viral complaints about product defects or shipping failures during peak holiday seasons.",
    tags: ["Brand Health", "Revenue Protection"]
  },
  {
    icon: Antenna,
    title: "Telecom Service Alerts",
    desc: "Geolocalize network outages based on real-time social media chatter before official monitoring flags.",
    tags: ["Geo-targeting", "Support Deflection"]
  },
  {
    icon: Building2,
    title: "SaaS Reputation Tracking",
    desc: "Monitor developer sentiment following API changes, pricing updates, or security disclosures.",
    tags: ["Developer Relations", "Trust Management"]
  }
];

const UseCases = () => {
  return (
    <section id="use-cases" className="py-24 px-6 bg-dark-800/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Industry <span className="text-gradient">Impact</span></h2>
            <p className="text-gray-400 text-lg">
              Tailored detection algorithms designed for high-stakes environments where minutes matter.
            </p>
          </div>
          <button className="text-accent-neon hover:text-white transition-colors border-b border-accent-neon hover:border-white pb-1 font-medium">
            View All Industries 
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="glass-card p-8 rounded-2xl group hover:border-primary/40 transition-colors"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 rounded-xl bg-dark-900 border border-white/5 text-primary-light">
                  <item.icon className="w-8 h-8" />
                </div>
                <div className="flex gap-2">
                  {item.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary-light transition-colors">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
