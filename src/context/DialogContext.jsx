import { createContext, useCallback, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Trash2, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const DialogContext = createContext(null);

const TYPE_CONFIG = {
  confirm: {
    icon: AlertTriangle,
    iconClass: 'text-orange-400',
    confirmClass: 'bg-[#1a1a1a] hover:bg-red-600 text-white',
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
    iconClass: 'text-green-500',
    confirmClass: 'bg-[#d4a84b] hover:bg-[#c49a3d] text-white',
    confirmLabel: 'OK',
  },
  error: {
    icon: AlertCircle,
    iconClass: 'text-red-500',
    confirmClass: 'bg-[#1a1a1a] hover:bg-[#333] text-white',
    confirmLabel: 'OK',
  },
  info: {
    icon: Info,
    iconClass: 'text-[#d4a84b]',
    confirmClass: 'bg-[#d4a84b] hover:bg-[#c49a3d] text-white',
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
      className="fixed inset-0 bg-black/60 z-[9998] flex items-center justify-center p-4 animate-fade-in"
      onClick={handleCancel}
    >
      <div
        className="bg-white w-full max-w-md p-8 relative animate-scale-in shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-[#aaa] hover:text-[#1a1a1a]"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-[#f5f5f5] flex items-center justify-center mb-5">
            <Icon size={26} className={cfg.iconClass} />
          </div>

          {dialog.title && (
            <h3 className="font-serif text-xl text-[#1a1a1a] mb-3">{dialog.title}</h3>
          )}
          {dialog.message && (
            <p className="text-[#626262] text-sm leading-relaxed mb-8">{dialog.message}</p>
          )}

          <div className="flex gap-3 w-full">
            {dialog.showCancel !== false && dialog.type !== 'success' && dialog.type !== 'info' && dialog.type !== 'error' && (
              <button
                onClick={handleCancel}
                className="flex-1 py-2.5 border border-[#ddd] text-[#626262] text-sm uppercase tracking-wider font-bold hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors"
              >
                {dialog.cancelLabel || 'Cancel'}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className={`flex-1 py-2.5 text-sm uppercase tracking-wider font-bold transition-colors ${cfg.confirmClass}`}
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
