import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  X,
} from "lucide-react";

const ToastContext = createContext(null);

const TOAST_TYPES = {
  success: {
    icon: CheckCircle,
    bg: "bg-[#0A0A0F]",
    border: "border-[#00D4AA]",
    iconColor: "text-[#00D4AA]",
    bar: "bg-[#00D4AA]",
    label: "Éxito",
  },
  error: {
    icon: XCircle,
    bg: "bg-[#0A0A0F]",
    border: "border-red-500",
    iconColor: "text-red-500",
    bar: "bg-red-500",
    label: "Error",
  },
  warning: {
    icon: AlertCircle,
    bg: "bg-[#0A0A0F]",
    border: "border-yellow-400",
    iconColor: "text-yellow-400",
    bar: "bg-yellow-400",
    label: "Aviso",
  },
  info: {
    icon: Info,
    bg: "bg-[#0A0A0F]",
    border: "border-[#6C63FF]",
    iconColor: "text-[#6C63FF]",
    bar: "bg-[#6C63FF]",
    label: "Info",
  },
};

const AUTO_DISMISS_MS = 4000;
const MAX_TOASTS = 3;

let toastCounter = 0;

function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(100);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const startTimeRef = useRef(null);
  const remainingRef = useRef(AUTO_DISMISS_MS);

  const config = TOAST_TYPES[toast.type] || TOAST_TYPES.info;
  const Icon = config.icon;

  const startDismiss = useCallback(() => {
    startTimeRef.current = Date.now();

    timerRef.current = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => onRemove(toast.id), 350);
    }, remainingRef.current);

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.max(
        0,
        ((remainingRef.current - elapsed) / AUTO_DISMISS_MS) * 100
      );
      setProgress(pct);
    }, 30);
  }, [toast.id, onRemove]);

  const pauseDismiss = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      clearInterval(progressRef.current);
      remainingRef.current -= Date.now() - startTimeRef.current;
    }
  }, []);

  useEffect(() => {
    const enterTimer = requestAnimationFrame(() => {
      setTimeout(() => setVisible(true), 20);
    });
    startDismiss();
    return () => {
      cancelAnimationFrame(enterTimer);
      clearTimeout(timerRef.current);
      clearInterval(progressRef.current);
    };
  }, [startDismiss]);

  const handleClose = () => {
    clearTimeout(timerRef.current);
    clearInterval(progressRef.current);
    setLeaving(true);
    setTimeout(() => onRemove(toast.id), 350);
  };

  return (
    <div
      onMouseEnter={pauseDismiss}
      onMouseLeave={startDismiss}
      className={`
        relative w-full max-w-sm overflow-hidden rounded-xl border
        ${config.bg} ${config.border}
        shadow-2xl shadow-black/60
        transition-all duration-350 ease-in-out
        ${visible && !leaving
          ? "opacity-100 translate-x-0 scale-100"
          : leaving
          ? "opacity-0 translate-x-8 scale-95"
          : "opacity-0 translate-x-8 scale-95"
        }
      `}
      style={{ transitionDuration: "350ms" }}
      role="alert"
      aria-live="assertive"
    >
      {/* Glassmorphism inner */}
      <div className="absolute inset-0 bg-[#1A1A2E]/60 rounded-xl pointer-events-none" />

      <div className="relative flex items-start gap-3 px-4 pt-4 pb-5">
        {/* Icon */}
        <div className={`mt-0.5 shrink-0 ${config.iconColor}`}>
          <Icon size={20} strokeWidth={2.2} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className="text-sm font-semibold text-white leading-tight mb-0.5">
              {toast.title}
            </p>
          )}
          {toast.message && (
            <p className="text-xs text-white/70 leading-relaxed break-words">
              {toast.message}
            </p>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="shrink-0 mt-0.5 p-1 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors duration-150"
          aria-label="Cerrar notificación"
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 rounded-b-xl overflow-hidden">
        <div
          className={`h-full ${config.bar} transition-none rounded-b-xl`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ type = "info", title, message }) => {
    const id = ++toastCounter;
    setToasts((prev) => {
      const next = [...prev, { id, type, title, message }];
      return next.length > MAX_TOASTS ? next.slice(next.length - MAX_TOASTS) : next;
    });
    return id;
  }, []);

  const toast = useCallback(
    {
      success: (msg, title) => addToast({ type: "success", message: msg, title }),
      error: (msg, title) => addToast({ type: "error", message: msg, title }),
      warning: (msg, title) => addToast({ type: "warning", message: msg, title }),
      info: (msg, title) => addToast({ type: "info", message: msg, title }),
      show: (opts) => addToast(opts),
    },
    [addToast]
  );

  // Wrap all methods into a single stable object
  const api = React.useMemo(
    () => ({
      success: (msg, title) => addToast({ type: "success", message: msg, title }),
      error: (msg, title) => addToast({ type: "error", message: msg, title }),
      warning: (msg, title) => addToast({ type: "warning", message: msg, title }),
      info: (msg, title) => addToast({ type: "info", message: msg, title }),
      show: (opts) => addToast(opts),
      remove: removeToast,
    }),
    [addToast, removeToast]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}

      {/* Portal-like container */}
      <div
        aria-label="Notificaciones"
        className="fixed bottom-4 right-4 z-[9999] flex flex-col-reverse gap-3 w-[calc(100vw-2rem)] max-w-sm pointer-events-none"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto w-full">
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
    throw new Error("useToast debe usarse dentro de <ToastProvider>");
  }
  return ctx;
}

export default ToastProvider;