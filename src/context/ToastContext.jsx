import { createContext, useCallback, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const COLORS = {
  success: 'border-l-green-600 bg-[var(--color-shiro)]',
  error: 'border-l-red-500 bg-[var(--color-shiro)]',
  info: 'border-l-[var(--color-kaki)] bg-[var(--color-shiro)]',
  warning: 'border-l-orange-400 bg-[var(--color-shiro)]',
};

const ICON_COLORS = {
  success: 'text-green-600',
  error: 'text-red-500',
  info: 'text-[var(--color-kaki)]',
  warning: 'text-orange-400',
};

function ToastItem({ toast, onRemove }) {
  const Icon = ICONS[toast.type] || Info;
  return (
    <div
      className={`flex items-start gap-3 w-80 p-4 shadow-lg border-l-4 animate-scale-in rounded-sm ${COLORS[toast.type]}`}
    >
      <Icon size={18} className={`flex-shrink-0 mt-0.5 ${ICON_COLORS[toast.type]}`} />
      <p className="flex-1 text-sm text-[var(--color-sumi)] leading-relaxed">{toast.message}</p>
      <button onClick={() => onRemove(toast.id)} className="text-[var(--color-hai)] hover:text-[var(--color-sumi)]">
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onRemove={removeToast} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
