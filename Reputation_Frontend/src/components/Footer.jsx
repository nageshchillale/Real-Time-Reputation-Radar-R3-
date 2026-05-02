import React from 'react';
import { Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    // If we're on the home page, scroll to the section
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Navigate home first, then scroll after render
      navigate('/');
      setTimeout(() => {
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  };

  return (
    <footer className="bg-dark-900 py-12 px-6 border-t border-white/5 root-footer">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent-violet flex items-center justify-center p-0.5">
              <div className="w-full h-full bg-dark-900 rounded-[6px] flex items-center justify-center">
                <Activity className="text-accent-neon w-4 h-4" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-wider text-white">R<span className="text-primary-light">3</span></span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Next-generation real-time reputation monitoring powered by predictive AI.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">System</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><button onClick={() => scrollTo('features')} className="hover:text-primary-light transition-colors text-left">Features</button></li>
            <li><button onClick={() => scrollTo('pipeline')} className="hover:text-primary-light transition-colors text-left">Pipeline</button></li>
            <li><button onClick={() => navigate('/dashboard')} className="hover:text-primary-light transition-colors text-left">Dashboard</button></li>
            <li><span className="text-gray-600">Status: <span className="text-green-500">100% Core</span></span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><button onClick={() => scrollTo('home')} className="hover:text-primary-light transition-colors text-left">Home</button></li>
            <li><button onClick={() => scrollTo('use-cases')} className="hover:text-primary-light transition-colors text-left">Use Cases</button></li>
            <li><button onClick={() => scrollTo('value-prop')} className="hover:text-primary-light transition-colors text-left">Why R3</button></li>
            <li><button onClick={() => navigate('/dashboard')} className="hover:text-primary-light transition-colors text-left">Get Started</button></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="#" className="hover:text-primary-light transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary-light transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-primary-light transition-colors">Data Processing Addendum</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 text-center flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
        <p>&copy; {new Date().getFullYear()} R3 Reputation Radar. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Twitter (X)</a>
          <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
