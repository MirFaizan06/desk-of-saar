import { createContext, useCallback, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Trash2, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const DialogContext = createContext(null);

const TYPE_CONFIG = {
  confirm: {
    icon: AlertTriangle,
    iconClass: 'text-orange-400',
    confirmClass: 'bg-[var(--color-sumi)] hover:bg-[var(--color-kaki)] text-white',
    confirmLabel: 'Confirm',
  },
  delete: {
    icon: Trash2,
    iconClass: 'text-red-500',
    confirmClass: 'bg-red-600 hover:bg-red-700 text-white',
    confirmLabel: 'Delete',
  },
  success: {
    icon: CheckCircle,
    iconClass: 'text-green-600',
    confirmClass: 'bg-[var(--color-kaki)] hover:bg-[var(--color-kaki-deep)] text-white',
    confirmLabel: 'OK',
  },
  error: {
    icon: AlertCircle,
    iconClass: 'text-red-500',
    confirmClass: 'bg-[var(--color-sumi)] hover:bg-[var(--color-sumi-soft)] text-white',
    confirmLabel: 'OK',
  },
  info: {
    icon: Info,
    iconClass: 'text-[var(--color-kaki)]',
    confirmClass: 'bg-[var(--color-kaki)] hover:bg-[var(--color-kaki-deep)] text-white',
    confirmLabel: 'OK',
  },
};

function DialogModal({ dialog, onClose }) {
  const cfg = TYPE_CONFIG[dialog.type] || TYPE_CONFIG.info;
  const Icon = cfg.icon;

  const handleConfirm = () => {
    dialog.onConfirm?.();
    onClose();
  };

  const handleCancel = () => {
    dialog.onCancel?.();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[9998] flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm"
      onClick={handleCancel}
    >
      <div
        className="bg-[var(--color-shiro)] w-full max-w-md p-8 relative animate-scale-in shadow-2xl rounded-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-[var(--color-hai)] hover:text-[var(--color-sumi)] transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-[var(--color-kami)] flex items-center justify-center mb-5">
            <Icon size={26} className={cfg.iconClass} />
          </div>

          {dialog.title && (
            <h3 className="text-xl text-[var(--color-sumi)] mb-3 font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              {dialog.title}
            </h3>
          )}
          {dialog.message && (
            <p className="text-[var(--color-hai)] text-sm leading-relaxed mb-8">{dialog.message}</p>
          )}

          <div className="flex gap-3 w-full">
            {dialog.showCancel !== false && dialog.type !== 'success' && dialog.type !== 'info' && dialog.type !== 'error' && (
              <button
                onClick={handleCancel}
                className="flex-1 py-2.5 border border-[var(--color-kinu)] text-[var(--color-hai)] text-sm uppercase tracking-wider font-bold hover:border-[var(--color-sumi)] hover:text-[var(--color-sumi)] transition-colors rounded-sm"
              >
                {dialog.cancelLabel || 'Cancel'}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className={`flex-1 py-2.5 text-sm uppercase tracking-wider font-bold transition-colors rounded-sm ${cfg.confirmClass}`}
            >
              {dialog.confirmLabel || cfg.confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DialogProvider({ children }) {
  const [dialog, setDialog] = useState(null);

  const closeDialog = useCallback(() => setDialog(null), []);

  const showDialog = useCallback((options) => {
    setDialog(options);
  }, []);

  return (
    <DialogContext.Provider value={{ showDialog }}>
      {children}
      {dialog && createPortal(
        <DialogModal dialog={dialog} onClose={closeDialog} />,
        document.body
      )}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  return useContext(DialogContext);
}
