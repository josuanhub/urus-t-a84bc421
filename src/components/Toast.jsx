import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

const TOAST_TYPES = {
  success: {
    icon: CheckCircle,
    bg: 'bg-[#0A0A0F]',
    border: 'border-[#00D4AA]',
    iconColor: 'text-[#00D4AA]',
    title: 'Éxito',
    glow: 'shadow-[0_0_20px_rgba(0,212,170,0.15)]',
  },
  error: {
    icon: XCircle,
    bg: 'bg-[#0A0A0F]',
    border: 'border-red-500',
    iconColor: 'text-red-500',
    title: 'Error',
    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]',
  },
  info: {
    icon: Info,
    bg: 'bg-[#0A0A0F]',
    border: 'border-[#6C63FF]',
    iconColor: 'text-[#6C63FF]',
    title: 'Información',
    glow: 'shadow-[0_0_20px_rgba(108,99,255,0.15)]',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-[#0A0A0F]',
    border: 'border-yellow-400',
    iconColor: 'text-yellow-400',
    title: 'Advertencia',
    glow: 'shadow-[0_0_20px_rgba(250,204,21,0.15)]',
  },
};

const AUTO_DISMISS_MS = 4000;
const MAX_TOASTS = 3;

let toastIdCounter = 0;

function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timerRef = useRef(null);
  const config = TOAST_TYPES[toast.type] || TOAST_TYPES.info;
  const Icon = config.icon;

  const dismiss = useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    clearTimeout(timerRef.current);
    setTimeout(() => {
      onRemove(toast.id);
    }, 350);
  }, [leaving, onRemove, toast.id]);

  useEffect(() => {
    const enterTimer = setTimeout(() => setVisible(true), 10);
    timerRef.current = setTimeout(dismiss, AUTO_DISMISS_MS);
    return () => {
      clearTimeout(enterTimer);
      clearTimeout(timerRef.current);
    };
  }, []);

  const progressDuration = `${AUTO_DISMISS_MS}ms`;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`
        relative flex items-start gap-3 w-full max-w-sm
        ${config.bg} border ${config.border} ${config.glow}
        rounded-xl p-4 overflow-hidden
        transition-all duration-350 ease-out
        ${visible && !leaving
          ? 'opacity-100 translate-x-0 scale-100'
          : leaving
          ? 'opacity-0 translate-x-8 scale-95'
          : 'opacity-0 translate-x-8 scale-95'
        }
      `}
      style={{ transition: 'opacity 350ms ease, transform 350ms ease' }}
    >
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full ${config.border.replace('border-', 'bg-')}`}
          style={{
            animation: `shrink ${progressDuration} linear forwards`,
          }}
        />
      </div>

      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        <Icon size={20} className={config.iconColor} strokeWidth={2} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-semibold text-white leading-tight mb-0.5">
            {toast.title}
          </p>
        )}
        {toast.message && (
          <p className="text-xs text-white/60 leading-relaxed break-words">
            {toast.message}
          </p>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={dismiss}
        aria-label="Cerrar notificación"
        className="
          flex-shrink-0 mt-0.5 p-1 rounded-lg
          text-white/30 hover:text-white/70
          hover:bg-white/10
          transition-colors duration-150
          focus:outline-none focus:ring-1 focus:ring-white/20
        "
      >
        <X size={14} strokeWidth={2.5} />
      </button>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', title, message }) => {
    setToasts((prev) => {
      const limited = prev.length >= MAX_TOASTS ? prev.slice(prev.length - MAX_TOASTS + 1) : prev;
      return [
        ...limited,
        { id: ++toastIdCounter, type, title, message },
      ];
    });
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message, type = 'info', title) => {
      addToast({ type, title: title || TOAST_TYPES[type]?.title, message });
    },
    [addToast]
  );

  toast.success = (message, title) => addToast({ type: 'success', title: title || TOAST_TYPES.success.title, message });
  toast.error   = (message, title) => addToast({ type: 'error',   title: title || TOAST_TYPES.error.title,   message });
  toast.info    = (message, title) => addToast({ type: 'info',    title: title || TOAST_TYPES.info.title,    message });
  toast.warning = (message, title) => addToast({ type: 'warning', title: title || TOAST_TYPES.warning.title, message });

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}

      {/* Toast container — bottom-right */}
      <div
        aria-label="Notificaciones"
        className="
          fixed z-[9999]
          bottom-4 right-4
          sm:bottom-6 sm:right-6
          flex flex-col-reverse gap-3
          w-[calc(100vw-2rem)] max-w-sm
          pointer-events-none
        "
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast debe usarse dentro de <ToastProvider>');
  }
  return ctx.toast;
}

export default ToastProvider;