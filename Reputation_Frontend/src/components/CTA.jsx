import React, { useState } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { deploySystem } from '../api';

const CTA = () => {
  const [loading, setLoading] = useState(false);
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-dark-900 border-t border-b border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-gradient-to-r from-primary/10 via-accent-neon/10 to-primary/10 blur-[80px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <div className="mb-6 inline-flex p-4 rounded-full bg-white/5 border border-white/10 text-primary-light">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
          Start Protecting Your Brand <span className="text-gradient hover:animate-pulse transition-all">Today</span>
        </h2>
        <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
          Don't wait for a crisis to make headlines. Integrate R3 into your workflow and stay one step ahead of the narrative.
        </p>
        
        <button onClick={async () => {
          setLoading(true);
          try {
            const res = await deploySystem();
            // If deploySystem returns a fetch Response, parse JSON if possible
            let json = null;
            try { json = await res.json(); } catch (_) { }
            window.dispatchEvent(new CustomEvent('r3-toast', { detail: { message: (json && json.message) || 'Deployment started', type: 'success' } }));
          } catch (err) {
            window.dispatchEvent(new CustomEvent('r3-toast', { detail: { message: 'Deployment failed', type: 'error' } }));
          } finally {
            setLoading(false);
          }
        }} className="glow-button px-10 py-5 rounded-xl bg-gradient-to-r from-primary to-accent-neon text-white text-lg font-bold shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all" disabled={loading}>
          {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2"/> Deploying…</> : 'Deploy R3 System Now'}
        </button>
        <p className="mt-6 text-sm text-gray-500">
          14-day free trial • No credit card required • GDPR Compliant
        </p>
      </div>
    </section>
  );
};

export default CTA;
