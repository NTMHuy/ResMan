import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-primary text-on-primary px-4 py-3 rounded-xl shadow-xl flex items-center justify-between gap-3 border border-surface-container-high/20 animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <div className="flex items-center gap-2.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-secondary-fixed shrink-0" />}
              {isError && <AlertCircle className="w-5 h-5 text-error shrink-0" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-secondary shrink-0" />}
              
              <div className="flex flex-col">
                {toast.title && (
                  <span className="font-semibold text-xs text-secondary-fixed">
                    {toast.title}
                  </span>
                )}
                <span className="text-xs text-on-primary">
                  {toast.message}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-on-primary-container hover:text-on-primary p-0.5 rounded transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
