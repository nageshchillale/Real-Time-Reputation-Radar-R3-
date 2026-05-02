import React, { useState, useEffect } from 'react';
import { Menu, X, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { pingBackend } from '../api';
import { requestDemo } from '../api';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isBackendUp, setIsBackendUp] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoForm, setDemoForm] = useState({ name: '', email: '', company: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Ping backend on load and every 60 seconds
    const checkHealth = async () => {
      const isUp = await pingBackend();
      setIsBackendUp(isUp);
    };
    checkHealth();
    const interval = setInterval(checkHealth, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-dark-900/80 backdrop-blur-lg border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo & Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <motion.div 
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent-violet flex items-center justify-center p-0.5"
            >
              <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
                <Activity className="text-accent-neon w-6 h-6" />
              </div>
            </motion.div>
            <span className="text-xl font-bold tracking-wider">
              R<span className="text-primary-light">3</span>
            </span>
          </div>

          {/* Backend Health Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <div className={`w-2 h-2 rounded-full ${isBackendUp ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`} />
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
              {isBackendUp ? 'API Online' : 'API Offline'}
            </span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
          <a href="#home" className="hover:text-white transition-colors">Home</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#bulk-dashboard" className="hover:text-white transition-colors">Dashboard</a>
          <a href="#use-cases" className="hover:text-white transition-colors">Use Cases</a>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <button onClick={() => setShowDemoModal(true)} className="px-5 py-2.5 rounded-lg border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-colors">
            Request Demo
          </button>
          <button onClick={() => navigate('/dashboard')} className="glow-button px-5 py-2.5 rounded-lg bg-gradient-to-r from-primary to-accent-violet text-white text-sm font-semibold">
            Get Started
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-dark-800 border-b border-white/10 py-4 px-6 flex flex-col space-y-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
            <div className={`w-2 h-2 rounded-full ${isBackendUp ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs font-medium text-gray-400 uppercase">
              {isBackendUp ? 'API Online' : 'API Offline'}
            </span>
          </div>
          <a href="#home" className="text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>Home</a>
          <a href="#features" className="text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>Features</a>
          <a href="#bulk-dashboard" className="text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>Dashboard</a>
          <a href="#use-cases" className="text-gray-300 hover:text-white" onClick={() => setIsOpen(false)}>Use Cases</a>
          <div className="flex flex-col space-y-3 pt-4 border-t border-white/10">
            <button onClick={() => { setShowDemoModal(true); setIsOpen(false); }} className="w-full px-5 py-2.5 rounded-lg border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-colors">
              Request Demo
            </button>
            <button onClick={() => { navigate('/dashboard'); setIsOpen(false); }} className="w-full px-5 py-2.5 rounded-lg bg-gradient-to-r from-primary to-accent-violet text-white text-sm font-semibold">
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowDemoModal(false)} />
          <div className="relative z-10 w-full max-w-md p-6 bg-dark-900 rounded-2xl border border-white/10">
            <h3 className="text-lg font-bold mb-2">Request a Demo</h3>
            <p className="text-sm text-gray-400 mb-4">We'll reach out to schedule your personalized demo.</p>
            <div className="flex flex-col gap-3">
              <input value={demoForm.name} onChange={(e) => setDemoForm(s => ({...s, name: e.target.value}))} placeholder="Name" className="px-3 py-2 rounded-lg bg-dark-800 border border-white/5 text-white" />
              <input value={demoForm.email} onChange={(e) => setDemoForm(s => ({...s, email: e.target.value}))} placeholder="Email" className="px-3 py-2 rounded-lg bg-dark-800 border border-white/5 text-white" />
              <input value={demoForm.company} onChange={(e) => setDemoForm(s => ({...s, company: e.target.value}))} placeholder="Company" className="px-3 py-2 rounded-lg bg-dark-800 border border-white/5 text-white" />
            </div>
            <div className="flex items-center justify-end gap-3 mt-4">
              <button onClick={() => setShowDemoModal(false)} className="px-4 py-2 rounded-lg border border-white/10 text-sm">Cancel</button>
              <button disabled={demoLoading} onClick={async () => {
                setDemoLoading(true);
                try {
                  await requestDemo(demoForm);
                  window.dispatchEvent(new CustomEvent('r3-toast', { detail: { message: 'Demo request sent', type: 'success' } }));
                  setShowDemoModal(false);
                  setDemoForm({ name: '', email: '', company: '' });
                } catch (err) {
                  window.dispatchEvent(new CustomEvent('r3-toast', { detail: { message: 'Failed to send demo request', type: 'error' } }));
                } finally {
                  setDemoLoading(false);
                }
              }} className="px-4 py-2 rounded-lg bg-primary text-white font-semibold text-sm disabled:opacity-50">
                {demoLoading ? 'Sending…' : 'Request Demo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
