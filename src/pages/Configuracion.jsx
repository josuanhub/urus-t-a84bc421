import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  AlertTriangle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";

const API_BASE = "https://www.urusverify.com/v1/client/a84bc421-28d0-4551-81af-7aec26e13526/api";
const TABLA = "configuracion";
const HEADERS = { "x-factory-key": "factory2026", "Content-Type": "application/json" };
const PAGE_SIZE = 20;

// ── Toast ──────────────────────────────────────────────────────────────────
function Toast({ toasts, remove }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl border text-sm font-medium transition-all duration-300 ${
            t.type === "success"
              ? "bg-[#0A0A0F] border-[#00D4AA] text-[#00D4AA]"
              : "bg-[#0A0A0F] border-red-500 text-red-400"
          }`}
        >
          {t.type === "success" ? (
            <Check size={16} className="mt-0.5 shrink-0" />
          ) : (
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          )}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => remove(t.id)} className="opacity-60 hover:opacity-100 transition">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-white/5">
      {[...Array(5)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-white/5 rounded animate-pulse" style={{ width: `${60 + i * 10}%` }} />
        </td>
      ))}
    </tr>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#1A1A2E] border border-white/10 rounded-2xl shadow-2xl z-10 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-white font-semibold text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition rounded-lg p-1 hover:bg-white/5"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ── Confirm Dialog ─────────────────────────────────────────────────────────
function ConfirmDialog({ open, onClose, onConfirm, loading, itemName }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#1A1A2E] border border-red-500/30 rounded-2xl shadow-2xl z-10 p-6 text-center">
        <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-red-400" />
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">Eliminar registro</h3>
        <p className="text-white/50 text-sm mb-6">
          ¿Estás seguro de que deseas eliminar{" "}
          <span className="text-white/80 font-medium">"{itemName}"</span>? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Form ───────────────────────────────────────────────────────────────────
function ConfigForm({ initial, onSubmit, onCancel, loading }) {
  const empty = { clave: "", valor: "", descripcion: "", tipo: "texto", activo: true };
  const [form, setForm] = useState(initial || empty);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.clave?.trim()) e.clave = "La clave es requerida";
    if (!form.valor?.trim()) e.valor = "El valor es requerido";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    onSubmit(form);
  };

  const field = (key, label, type = "text", required = false) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-white/60 text-xs font-medium uppercase tracking-wide">
        {label} {required && <span className="text-[#6C63FF]">*</span>}
      </label>
      <input
        type={type}
        value={form[key] ?? ""}
        onChange={(e) => { setForm((p) => ({ ...p, [key]: e.target.value })); setErrors((p) => ({ ...p, [key]: "" })); }}
        className={`bg-[#0A0A0F] border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 transition ${
          errors[key] ? "border-red-500 focus:ring-red-500/20" : "border-white/10 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF]/50"
        }`}
        placeholder={`Ingresa ${label.toLowerCase()}`}
      />
      {errors[key] && <p className="text-red-400 text-xs">{errors[key]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {field("clave", "Clave", "text", true)}
      {field("valor", "Valor", "text", true)}

      <div className="flex flex-col gap-1.5">
        <label className="text-white/60 text-xs font-medium uppercase tracking-wide">Descripción</label>
        <textarea
          value={form.descripcion ?? ""}
          onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
          rows={3}
          className="bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF]/50 transition resize-none"
          placeholder="Descripción del parámetro"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-white/60 text-xs font-medium uppercase tracking-wide">Tipo</label>
        <select
          value={form.tipo ?? "texto"}
          onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value }))}
          className="bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF]/50 transition"
        >
          {["texto", "número", "booleano", "json", "url"].map((t) => (
            <option key={t} value={t} className="bg-[#1A1A2E]">{t}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setForm((p) => ({ ...p, activo: !p.activo }))}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.activo ? "bg-[#6C63FF]" : "bg-white/10"}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${form.activo ? "translate-x-5" : ""}`} />
        </button>
        <span className="text-white/60 text-sm">Activo</span>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition text-sm font-medium"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#5a52e0] text-white transition text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          {initial ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function Configuracion() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [page, setPage] = useState(1);
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState(null); // null | "create" | "edit"
  const [editItem, setEditItem] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Toast helpers
  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  }, []);
  const removeToast = useCallback((id) => setToasts((p) => p.filter((t) => t.id !== id)), []);

  // Fetch
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`${API_BASE}/${TABLA}`, { headers: HEADERS })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        const rows = Array.isArray(json) ? json : json.data ?? json.results ?? json.items ?? [];
        setData(rows);
      })
      .catch(() => { if (!cancelled) addToast("Error al cargar los datos", "error"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [refreshKey, addToast]);

  // Filter & search
  const tipos = [...new Set(data.map((d) => d.tipo).filter(Boolean))];
  const filtered = data.filter((row) => {
    const term = search.toLowerCase();
    const matchSearch =
      !term ||
      Object.values(row).some((v) => String(v ?? "").toLowerCase().includes(term));
    const matchTipo = !filterTipo || row.tipo === filterTipo;
    return matchSearch && matchTipo;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getLabel = (row) =>
    row.clave || row.nombre || row.name || row.titulo || row.title || String(row.id || "registro");

  const getDisplayKeys = () => {
    if (!data.length) return [];
    const sample = data[0];
    const priority = ["id", "clave", "valor", "descripcion", "tipo", "activo", "nombre", "valor", "estado"];
    const keys = Object.keys(sample);
    const ordered = priority.filter((k) => keys.includes(k));
    const rest = keys.filter((k) => !ordered.includes(k));
    return [...ordered, ...rest].slice(0, 6);
  };
  const displayKeys = getDisplayKeys();

  // CRUD
  const handleCreate = async (form) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/${TABLA}`, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      addToast("Registro creado exitosamente");
      setModal(null);
      setRefreshKey((k) => k + 1);
    } catch {
      addToast("Error al crear el registro", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (form) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/${TABLA}/${editItem.id}`, {
        method: "PUT",
        headers: HEADERS,
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      addToast("Registro actualizado exitosamente");
      setModal(null);
      setEditItem(null);
      setRefreshKey((k) => k + 1);
    } catch {
      addToast("Error al actualizar el registro", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/${TABLA}/${confirmDelete.id}`, {
        method: "DELETE",
        headers: HEADERS,
      });
      if (!res.ok) throw new Error();
      addToast("Registro eliminado exitosamente");
      setConfirmDelete(null);
      setRefreshKey((k) => k + 1);
    } catch {
      addToast("Error al eliminar el registro", "error");
    } finally {
      setDeleting(false);
    }
  };

  const renderCell = (key, val) => {
    if (val === null || val === undefined) return <span className="text-white/20">—</span>;
    if (typeof val === "boolean")
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${val ? "bg-[#00D4AA]/10 text-[#00D4AA]" : "bg-white/5 text-white/30"}`}>
          {val ? "Activo" : "Inactivo"}
        </span>
      );
    if (key === "activo")
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${val ? "bg-[#00D4AA]/10 text-[#00D4AA]" : "bg-white/5 text-white/30"}`}>
          {val ? "Activo" : "Inactivo"}
        </span>
      );
    if (key === "tipo")
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#6C63FF]/10 text-[#6C63FF] border border-[#6C63FF]/20">
          {val}
        </span>
      );
    const str = String(val);
    return <span className="text-white/70 truncate max-w-[180px] block" title={str}>{str}</span>;
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <Toast toasts={toasts} remove={removeToast} />

      {/* Header */}
      <div className="border-b border-white/5 bg-[#0A0A0F]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#6C63FF]/10 border border-[#6C63FF]/20 flex items-center justify-center">
              <Settings size={18} className="text-[#6C63FF]" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-base leading-none">Configuración del sistema</h1>
              <p className="text-white/40 text-xs mt-0.5">Gestión de parámetros</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              className="p-2 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition"
              title="Actualizar"
            >
              <RefreshCw size={15} />
            </button>
            <button
              onClick={() => { setEditItem(null); setModal("create"); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6C63FF] hover:bg-[#5a52e0] text-white text-sm font-medium transition shadow-lg shadow-[#6C63FF]/20"
            >
              <Plus size={15} />
              <span className="hidden sm:inline">Nuevo</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar en configuraciones..."
              className="w-full bg-[#1A1A2E] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF]/40 transition"
            />
          </div>
          {tipos.length > 0 && (
            <div className="relative">
              <SlidersHorizontal size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              <select
                value={filterTipo}
                onChange={(e) => { setFilterTipo(e.target.value); setPage(1); }}
                className="bg-[#1A1A2E] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF]/40 transition appearance-none min-w-[140px]"
              >
                <option value="" className="bg-[#1A1A2E]">Todos los tipos</option>
                {tipos.map((t) => <option key={t} value={t} className="bg-[#1A1A2E]">{t}</option>)}
              </select>
            </div>
          )}
        </div>