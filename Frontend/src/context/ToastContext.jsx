import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, X, Info, Bell } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Automatically dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Portal/Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          let bgColor = 'bg-white border-slate-100 text-slate-800';
          let icon = <Info className="text-blue-500" size={18} />;
          
          if (toast.type === 'success') {
            bgColor = 'bg-emerald-50 border-emerald-100 text-emerald-900';
            icon = <CheckCircle2 className="text-emerald-500" size={18} />;
          } else if (toast.type === 'error') {
            bgColor = 'bg-rose-50 border-rose-100 text-rose-900';
            icon = <AlertCircle className="text-rose-500" size={18} />;
          } else if (toast.type === 'warning') {
            bgColor = 'bg-amber-50 border-amber-100 text-amber-900';
            icon = <AlertCircle className="text-amber-500" size={18} />;
          } else if (toast.type === 'broadcast') {
            bgColor = 'bg-[#8B1A1A]/10 border-[#8B1A1A]/20 text-[#8B1A1A]';
            icon = <Bell className="text-[#8B1A1A]" size={18} />;
          }

          return (
            <div
              key={toast.id}
              className={`flex items-start gap-3 p-4 rounded-2xl border shadow-lg pointer-events-auto transition-all duration-300 transform translate-y-0 scale-100 animate-in slide-in-from-bottom-5 fade-in duration-300 ${bgColor}`}
            >
              <div className="shrink-0 mt-0.5">{icon}</div>
              <div className="flex-1 text-xs font-black tracking-tight leading-normal uppercase">
                {toast.message}
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
