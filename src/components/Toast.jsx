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
    ring: "ring-[#00D4AA]/20",
    label: "Éxito",
  },
  error: {
    icon: AlertCircle,
    bar: "bg-red-500",
    iconColor: "text-red-400",
    ring: "ring-red-500/20",
    label: "Error",
  },
  warning: {
    icon: AlertTriangle,
    bar: "bg-amber-400",
    iconColor: "text-amber-400",
    ring: "ring-amber-400/20",
    label: "Advertencia",
  },
  info: {
    icon: Info,
    bar: "bg-[#6C63FF]",
    iconColor: "text-[#6C63FF]",
    ring: "ring-[#6C63FF]/20",
    label: "Info",
  },
};

const AUTO_DISMISS_MS = 4000;
const MAX_TOASTS = 3;

// ─── Single Toast Item ────────────────────────────────────────────────────────
const ToastItem = ({ toast, onRemove }) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const progressRef = useRef(null);
  const timerRef = useRef(null);
  const config = TYPE_CONFIG[toast.type] ?? TYPE_CONFIG.info;
  const Icon = config.icon;

  // Animate in
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const dismiss = useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    setVisible(false);
    clearTimeout(timerRef.current);
    setTimeout(() => onRemove(toast.id), 350);
  }, [leaving, onRemove, toast.id]);

  // Auto-dismiss
  useEffect(() => {
    timerRef.current = setTimeout(dismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timerRef.current);
  }, [dismiss]);

  // Progress bar animation via CSS custom property
  useEffect(() => {
    if (!progressRef.current) return;
    progressRef.current.style.transition = `width ${AUTO_DISMISS_MS}ms linear`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (progressRef.current) progressRef.current.style.width = "0%";
      });
    });
  }, []);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={[
        "relative flex items-start gap-3 w-full max-w-sm",
        "bg-[#1A1A2E] border border-white/[0.06]",
        `ring-1 ${config.ring}`,
        "rounded-xl px-4 pt-4 pb-5 shadow-2xl",
        "transition-all duration-350 ease-out",
        visible && !leaving
          ? "opacity-100 translate-x-0 scale-100"
          : "opacity-0 translate-x-12 scale-95",
      ].join(" ")}
      style={{ transitionDuration: "350ms" }}
    >
      {/* Left accent bar */}
      <span
        className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full ${config.bar}`}
      />

      {/* Icon */}
      <Icon
        size={20}
        className={`${config.iconColor} mt-0.5 shrink-0`}
        strokeWidth={2}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-0.5">
          {config.label}
        </p>
        <p className="text-sm text-white/90 leading-snug break-words">
          {toast.message}
        </p>
      </div>

      {/* Close */}
      <button
        onClick={dismiss}
        aria-label="Cerrar notificación"
        className="shrink-0 mt-0.5 p-1 rounded-lg text-white/30 hover:text-white/80 hover:bg-white/10 transition-colors"
      >
        <X size={14} strokeWidth={2.5} />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-white/[0.06]">
        <div
          ref={progressRef}
          className={`h-full rounded-full ${config.bar} opacity-60`}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  const addToast = useCallback((message, type = "info") => {
    const id = ++counterRef.current;
    setToasts((prev) => {
      const next = [...prev, { id, message, type }];
      // Keep only the last MAX_TOASTS
      return next.length > MAX_TOASTS ? next.slice(next.length - MAX_TOASTS) : next;
    });
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Convenience helpers
  const toast = {
    success: (msg) => addToast(msg, "success"),
    error: (msg) => addToast(msg, "error"),
    info: (msg) => addToast(msg, "info"),
    warning: (msg) => addToast(msg, "warning"),
    show: addToast,
    dismiss: removeToast,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Portal-like container — fixed bottom-right */}
      <div
        aria-label="Notificaciones"
        className={[
          "fixed z-[9999] bottom-4 right-4",
          "flex flex-col-reverse gap-2 items-end",
          "pointer-events-none",
          "w-[calc(100vw-2rem)] sm:w-auto",
        ].join(" ")}
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto w-full sm:w-auto">
            <ToastItem toast={t} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;