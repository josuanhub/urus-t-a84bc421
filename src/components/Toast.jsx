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
    borderColor: "border-l-[#00D4AA]",
    iconColor: "text-[#00D4AA]",
    bgGlow: "shadow-[0_0_20px_rgba(0,212,170,0.15)]",
    label: "Éxito",
  },
  error: {
    icon: XCircle,
    borderColor: "border-l-red-500",
    iconColor: "text-red-500",
    bgGlow: "shadow-[0_0_20px_rgba(239,68,68,0.15)]",
    label: "Error",
  },
  warning: {
    icon: AlertCircle,
    borderColor: "border-l-amber-400",
    iconColor: "text-amber-400",
    bgGlow: "shadow-[0_0_20px_rgba(251,191,36,0.15)]",
    label: "Advertencia",
  },
  info: {
    icon: Info,
    borderColor: "border-l-[#6C63FF]",
    iconColor: "text-[#6C63FF]",
    bgGlow: "shadow-[0_0_20px_rgba(108,99,255,0.15)]",
    label: "Información",
  },
};

const MAX_TOASTS = 3;
const AUTO_DISMISS_MS = 4000;

function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timerRef = useRef(null);
  const config = TOAST_TYPES[toast.type] || TOAST_TYPES.info;
  const Icon = config.icon;

  const dismiss = useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 350);
  }, [leaving, onRemove, toast.id]);

  useEffect(() => {
    const enterTimer = setTimeout(() => setVisible(true), 10);
    timerRef.current = setTimeout(() => {
      dismiss();
    }, AUTO_DISMISS_MS);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(timerRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    clearTimeout(timerRef.current);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      dismiss();
    }, AUTO_DISMISS_MS);
  };

  const translateClass = leaving
    ? "translate-x-full opacity-0"
    : visible
    ? "translate-x-0 opacity-100"
    : "translate-x-full opacity-0";

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        relative flex items-start gap-3 w-full max-w-sm
        bg-[#1A1A2E] border border-white/10 border-l-4
        ${config.borderColor} ${config.bgGlow}
        rounded-xl px-4 py-3
        transition-all duration-350 ease-in-out
        ${translateClass}
        cursor-default select-none
      `}
      style={{ willChange: "transform, opacity" }}
      role="alert"
      aria-live="assertive"
    >
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-xl overflow-hidden">
        <div
          className={`h-full ${config.iconColor.replace("text-", "bg-")} opacity-60`}
          style={{
            animation: leaving ? "none" : `shrink ${AUTO_DISMISS_MS}ms linear forwards`,
          }}
        />
      </div>

      {/* Icon */}
      <div className={`mt-0.5 flex-shrink-0 ${config.iconColor}`}>
        <Icon size={18} strokeWidth={2} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-0.5">
          {config.label}
        </p>
        <p className="text-sm text-white/90 leading-snug break-words">
          {toast.message}
        </p>
      </div>

      {/* Close button */}
      <button
        onClick={dismiss}
        className="
          flex-shrink-0 mt-0.5 p-1 rounded-lg
          text-white/40 hover:text-white/80
          hover:bg-white/10
          transition-colors duration-150
          focus:outline-none focus:ring-1 focus:ring-white/20
        "
        aria-label="Cerrar notificación"
      >
        <X size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => {
      const updated = [...prev, { id, message, type }];
      return updated.length > MAX_TOASTS
        ? updated.slice(updated.length - MAX_TOASTS)
        : updated;
    });
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg) => addToast(msg, "success"),
    error: (msg) => addToast(msg, "error"),
    warning: (msg) => addToast(msg, "warning"),
    info: (msg) => addToast(msg, "info"),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Toast container */}
      <div
        className="
          fixed bottom-4 right-4 z-[9999]
          flex flex-col gap-2 items-end
          pointer-events-none
          sm:bottom-6 sm:right-6
        "
        aria-label="Notificaciones"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto w-full max-w-sm">
            <ToastItem toast={t} onRemove={removeToast} />
          </div>
        ))}
      </div>

      {/* Keyframe injection */}
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%;   }
        }
        .duration-350 {
          transition-duration: 350ms;
        }
      `}</style>
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