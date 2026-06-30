import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";

// ─── Context ────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

// ─── Hook ───────────────────────────────────────────────────────────────────
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
};

// ─── Config per type ─────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  success: {
    icon: CheckCircle2,
    bar: "bg-[#00D4AA]",
    iconColor: "text-[#00D4AA]",
    border: "border-[#00D4AA]/30",
    label: "Éxito",
  },
  error: {
    icon: AlertCircle,
    bar: "bg-red-500",
    iconColor: "text-red-400",
    border: "border-red-500/30",
    label: "Error",
  },
  warning: {
    icon: AlertTriangle,
    bar: "bg-amber-400",
    iconColor: "text-amber-400",
    border: "border-amber-400/30",
    label: "Advertencia",
  },
  info: {
    icon: Info,
    bar: "bg-[#6C63FF]",
    iconColor: "text-[#6C63FF]",
    border: "border-[#6C63FF]/30",
    label: "Información",
  },
};

// ─── Single Toast Item ────────────────────────────────────────────────────────
const DURATION = 4000;

const ToastItem = ({ toast, onRemove }) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(100);
  const startRef = useRef(null);
  const rafRef = useRef(null);
  const timerRef = useRef(null);

  const dismiss = useCallback(() => {
    setLeaving(true);
    cancelAnimationFrame(rafRef.current);
    clearTimeout(timerRef.current);
    setTimeout(() => onRemove(toast.id), 320);
  }, [toast.id, onRemove]);

  // Entrada
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Progress bar + auto-dismiss
  useEffect(() => {
    startRef.current = performance.now();

    const tick = (now) => {
      const elapsed = now - startRef.current;
      const remaining = Math.max(0, 100 - (elapsed / DURATION) * 100);
      setProgress(remaining);
      if (remaining > 0) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    timerRef.current = setTimeout(dismiss, DURATION);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timerRef.current);
    };
  }, [dismiss]);

  const cfg = TYPE_CONFIG[toast.type] || TYPE_CONFIG.info;
  const Icon = cfg.icon;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`
        relative flex items-start gap-3 w-full max-w-sm
        bg-[#1A1A2E] border ${cfg.border}
        rounded-xl shadow-2xl shadow-black/60
        overflow-hidden p-4
        transition-all duration-300 ease-out
        ${visible && !leaving
          ? "opacity-100 translate-x-0 scale-100"
          : "opacity-0 translate-x-8 scale-95"}
      `}
    >
      {/* Barra lateral de color */}
      <span
        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${cfg.bar}`}
      />

      {/* Ícono */}
      <Icon
        size={20}
        className={`${cfg.iconColor} flex-shrink-0 mt-0.5`}
        aria-hidden="true"
      />

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-semibold text-white leading-tight mb-0.5 truncate">
            {toast.title}
          </p>
        )}
        {toast.message && (
          <p className="text-xs text-gray-400 leading-snug break-words">
            {toast.message}
          </p>
        )}
      </div>

      {/* Botón cerrar */}
      <button
        onClick={dismiss}
        aria-label="Cerrar notificación"
        className="
          flex-shrink-0 p-1 rounded-lg
          text-gray-500 hover:text-white
          hover:bg-white/10
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/60
        "
      >
        <X size={14} />
      </button>

      {/* Barra de progreso */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-white/10 w-full"
        aria-hidden="true"
      >
        <div
          className={`h-full ${cfg.bar} transition-none`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// ─── Provider ─────────────────────────────────────────────────────────────────
const MAX_TOASTS = 3;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type = "info", title = "", message = "" }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => {
        const next = [...prev, { id, type, title, message }];
        return next.length > MAX_TOASTS ? next.slice(next.length - MAX_TOASTS) : next;
      });
      return id;
    },
    []
  );

  const success = useCallback(
    (message, title = TYPE_CONFIG.success.label) =>
      addToast({ type: "success", title, message }),
    [addToast]
  );

  const error = useCallback(
    (message, title = TYPE_CONFIG.error.label) =>
      addToast({ type: "error", title, message }),
    [addToast]
  );

  const info = useCallback(
    (message, title = TYPE_CONFIG.info.label) =>
      addToast({ type: "info", title, message }),
    [addToast]
  );

  const warning = useCallback(
    (message, title = TYPE_CONFIG.warning.label) =>
      addToast({ type: "warning", title, message }),
    [addToast]
  );

  const dismiss = useCallback((id) => removeToast(id), [removeToast]);

  const dismissAll = useCallback(() => setToasts([]), []);

  return (
    <ToastContext.Provider
      value={{ addToast, success, error, info, warning, dismiss, dismissAll }}
    >
      {children}

      {/* Portal-like container — fixed bottom-right */}
      <div
        aria-label="Notificaciones"
        className="
          fixed z-[9999]
          bottom-4 right-4
          flex flex-col-reverse gap-2
          w-[calc(100vw-2rem)] max-w-sm
          pointer-events-none
        "
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto w-full">
            <ToastItem toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;