import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

const CrisisAlert = ({ crisis }) => {
  const [visible, setVisible] = useState(true);

  // Re-show alert if crisis level changes to something serious
  useEffect(() => {
    if (crisis && crisis.crisisLevel !== 'NORMAL') {
      setVisible(true);
    }
  }, [crisis]);

  if (!crisis || crisis.crisisLevel === 'NORMAL') return null;

  const isSevere = crisis.crisisLevel === 'SEVERE' || crisis.crisisLevel === 'CRITICAL';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
          className="fixed top-0 left-0 right-0 z-[100] pointer-events-none flex justify-center mt-4 px-4"
        >
          <div
            className={`
              pointer-events-auto max-w-xl w-full px-5 py-3 rounded-xl backdrop-blur-xl border
              flex items-start gap-4 shadow-2xl transition-all duration-300
              ${
                isSevere
                  ? 'bg-red-500/20 border-red-500/60 shadow-[0_10px_40px_rgba(239,68,68,0.3)]'
                  : 'bg-yellow-500/20 border-yellow-500/50 shadow-[0_10px_30px_rgba(234,179,8,0.2)]'
              }
            `}
          >
            <div className={`mt-0.5 ${isSevere ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}>
              {isSevere ? <ShieldAlert className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className={`font-bold text-sm tracking-wide uppercase ${isSevere ? 'text-red-300' : 'text-yellow-300'}`}>
                  {crisis.crisisLevel} Crisis Detected
                </p>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  isSevere ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                }`}>
                  LIVE ALERT
                </span>
              </div>
              <p className={`text-xs mt-1 leading-relaxed ${isSevere ? 'text-red-200/80' : 'text-yellow-200/80'}`}>
                System has detected {crisis.negativeCounatLast5Minutes} negative signals in the last 5 minutes. 
                {isSevere ? ' Immediate intervention is strongly recommended.' : ' Monitoring is advised.'}
              </p>
            </div>
            
            <button
              onClick={() => setVisible(false)}
              className="text-white/40 hover:text-white transition-colors flex-shrink-0 mt-0.5"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CrisisAlert;
