import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import SwipeToast from '../components/react-bits/SwipeToast';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastType = 'info', title?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type, title }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getToastConfig = (toast: ToastMessage) => {
    switch (toast.type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
          fuseColor: '#10b981',
          background: 'rgba(15, 23, 42, 0.95)',
          color: '#f8fafc',
          title: toast.title || 'Success',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5 text-rose-400" />,
          fuseColor: '#f43f5e',
          background: 'rgba(15, 23, 42, 0.95)',
          color: '#f8fafc',
          title: toast.title || 'Error',
        };
      default:
        return {
          icon: <Info className="w-5 h-5 text-teal-400" />,
          fuseColor: '#14b8a6',
          background: 'rgba(15, 23, 42, 0.95)',
          color: '#f8fafc',
          title: toast.title || 'Notification',
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const cfg = getToastConfig(toast);
          return (
            <div key={toast.id} className="pointer-events-auto">
              <SwipeToast
                open={true}
                inline={true}
                title={cfg.title}
                description={toast.message}
                icon={cfg.icon}
                fuseColor={cfg.fuseColor}
                background={cfg.background}
                color={cfg.color}
                closeButton={true}
                duration={4000}
                onClose={() => removeToast(toast.id)}
              />
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
