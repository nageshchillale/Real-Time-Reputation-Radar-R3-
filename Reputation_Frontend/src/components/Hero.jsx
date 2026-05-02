import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Send, Loader2 } from 'lucide-react';
import { createPost } from '../api';
import { useNavigate } from 'react-router-dom';

// Minimal composer in hero to submit a single post and notify parent
const HeroComposer = ({ onPostCreated }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const post = await createPost(text.trim());
      setText('');
      if (onPostCreated) onPostCreated(post);
    } catch (err) {
      setError('Failed to submit. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 max-w-xl mx-auto w-full">
      <div className="flex gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Quickly submit a message to analyze..."
          className="flex-1 bg-dark-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none text-sm"
        />
        <button
          onClick={submit}
          disabled={!text.trim() || loading}
          className="px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-accent-violet text-white font-semibold disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {loading ? 'Submitting' : 'Submit'}
        </button>
      </div>
      {error && <div className="mt-2 text-sm text-red-400">{error}</div>}
    </div>
  );
};

const Hero = (props) => {
  const navigate = useNavigate();
  return (
    <section id="home" className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-40 overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent-neon/20 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 border-primary/30">
            <span className="w-2 h-2 rounded-full bg-accent-neon animate-pulse" />
            <span className="text-sm font-medium text-gray-300">R3 System is Live</span>
          </div>
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Detect Crises Before <br className="hidden md:block" />
          They Go <span className="text-gradient">Viral</span>
        </motion.h1>

        <motion.p 
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          AI-powered real-time reputation monitoring across social media streams. 
          Identify sentiment spikes, detect anomalies, and generate intelligent responses instantly.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <button
            onClick={() => {
              const el = typeof document !== 'undefined' ? document.getElementById('bulk-dashboard') : null;
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } else {
                navigate('/dashboard');
              }
            }}
            className="glow-button w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent-violet text-white font-semibold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(155,48,255,0.4)]"
          >
            Start Monitoring <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl glass-card text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
          >
            <Play className="w-5 h-5 text-accent-neon" /> View Dashboard
          </button>
        </motion.div>
        {/* Hero quick composer */}
        <HeroComposer onPostCreated={(post) => {
          if (props && props.onPostCreated) props.onPostCreated(post);
        }} />
      </div>
      
      {/* Grid Lines Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
    </section>
  );
};

export default Hero;
