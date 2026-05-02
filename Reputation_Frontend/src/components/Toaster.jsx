import React, { useEffect, useState, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const TOAST_DURATION = 4500;

const iconMap = {
  success: <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />,
  error: <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />,
  info: <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />,
};

const bgMap = {
  success: 'bg-emerald-500/15 border-emerald-500/30',
  error: 'bg-red-500/15 border-red-500/30',
  info: 'bg-blue-500/15 border-blue-500/30',
};

const Toast = ({ message, type = 'info', onClose, id }) => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = useCallback(() => {
    setExiting(true);
    setTimeout(() => onClose(id), 300);
  }, [id, onClose]);

  // Auto-dismiss
  useEffect(() => {
    const timer = setTimeout(handleClose, TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [handleClose]);

  return (
    <div
      className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 min-w-[280px] max-w-[400px] ${bgMap[type] || bgMap.info} ${
        visible && !exiting
          ? 'translate-x-0 opacity-100'
          : 'translate-x-8 opacity-0'
      }`}
    >
      {iconMap[type] || iconMap.info}
      <span className="text-sm text-white font-medium flex-1">{message}</span>
      <button
        onClick={handleClose}
        className="text-gray-400 hover:text-white transition-colors p-0.5 rounded-md hover:bg-white/10"
      >
        <X className="w-3.5 h-3.5" />
      </button>
      {/* Auto-dismiss progress bar */}
      <div className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full overflow-hidden bg-white/5">
        <div
          className="h-full rounded-full bg-white/20"
          style={{
            animation: `toastProgress ${TOAST_DURATION}ms linear forwards`,
          }}
        />
      </div>
      <style>{`
        @keyframes toastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

const Toaster = () => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((s) => s.filter((x) => x.id !== id));
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const id = Date.now() + Math.random();
      const t = {
        id,
        message: e.detail?.message || '...',
        type: e.detail?.type || 'info',
      };
      setToasts((s) => [...s, t]);
    };
    window.addEventListener('r3-toast', handler);
    return () => window.removeEventListener('r3-toast', handler);
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="fixed right-6 bottom-6 z-[100] flex flex-col gap-3 pointer-events-auto">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          id={t.id}
          message={t.message}
          type={t.type}
          onClose={removeToast}
        />
      ))}
    </div>
  );
};

export default Toaster;
