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
  SlidersHorizontal,
  RefreshCw,
} from "lucide-react";

const API_BASE = "https://www.urusverify.com/v1/client/a84bc421-28d0-4551-81af-7aec26e13526/api";
const TABLA = "configuracion";
const HEADERS = { "x-factory-key": "factory2026", "Content-Type": "application/json" };
const PAGE_SIZE = 20;

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toasts, remove }) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl border transition-all duration-300 ${
            t.type === "success"
              ? "bg-[#1A1A2E] border-[#00D4AA]/40 text-[#00D4AA]"
              : "bg-[#1A1A2E] border-red-500/40 text-red-400"
          }`}
        >
          {t.type === "success" ? (
            <Check size={18} className="mt-0.5 shrink-0" />
          ) : (
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          )}
          <p className="text-sm flex-1 text-white/90">{t.message}</p>
          <button onClick={() => remove(t.id)} className="text-white/40 hover:text-white/80 transition">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  }, []);
  const remove = useCallback((id) => setToasts((p) => p.filter((t) => t.id !== id)), []);
  return { toasts, add, remove };
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-white/5">
      {[...Array(5)].map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 rounded bg-white/5 animate-pulse" style={{ width: `${60 + i * 10}%` }} />
        </td>
      ))}
    </tr>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ open, title, children, onClose }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-[#1A1A2E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Settings size={18} className="text-[#6C63FF]" />
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({ open, message, onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm bg-[#1A1A2E] border border-red-500/30 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <p className="text-white/90 text-sm">{message}</p>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/40 transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ search, onNew }) {
  return (
    <tr>
      <td colSpan={99}>
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-16 h-16 rounded-2xl bg-[#6C63FF]/10 border border-[#6C63FF]/20 flex items-center justify-center mb-4">
            <Settings size={28} className="text-[#6C63FF]" />
          </div>
          <h3 className="text-white font-medium mb-2">
            {search ? "Sin resultados" : "Sin configuraciones"}
          </h3>
          <p className="text-white/40 text-sm text-center max-w-xs mb-6">
            {search
              ? `No encontramos registros para "${search}".`
              : "Aún no hay configuraciones. Crea la primera para comenzar."}
          </p>
          {!search && (
            <button
              onClick={onNew}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#6C63FF]/80 text-white text-sm font-medium transition"
            >
              <Plus size={16} />
              Nueva Configuración
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Form ─────────────────────────────────────────────────────────────────────
function ConfigForm({ initial, onSubmit, loading, onClose }) {
  const [form, setForm] = useState(initial || {});
  const [errors, setErrors] = useState({});

  const fields = initial ? Object.keys(initial) : [];

  const validate = () => {
    const e = {};
    fields.forEach((k) => {
      if (k === "id") return;
      if (!form[k] && form[k] !== 0) e[k] = "Campo requerido";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handle = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: null }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  const editableFields = fields.filter((k) => k !== "id" && k !== "createdAt" && k !== "updatedAt");

  return (
    <form onSubmit={submit} className="space-y-4">
      {editableFields.length === 0 ? (
        <div className="space-y-4">
          {[
            { key: "clave", label: "Clave" },
            { key: "valor", label: "Valor" },
            { key: "descripcion", label: "Descripción" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wide">
                {label}
              </label>
              <input
                type="text"
                value={form[key] || ""}
                onChange={(e) => handle(key, e.target.value)}
                placeholder={`Ingresa ${label.toLowerCase()}`}
                className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-[#6C63FF]/60 focus:bg-white/8 ${
                  errors[key] ? "border-red-500/50" : "border-white/10"
                }`}
              />
              {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
            </div>
          ))}
        </div>
      ) : (
        editableFields.map((k) => (
          <div key={k}>
            <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wide">
              {k}
            </label>
            <input
              type="text"
              value={form[k] ?? ""}
              onChange={(e) => handle(k, e.target.value)}
              placeholder={`Ingresa ${k}`}
              className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition focus:border-[#6C63FF]/60 focus:bg-white/8 ${
                errors[k] ? "border-red-500/50" : "border-white/10"
              }`}
            />
            {errors[k] && <p className="text-red-400 text-xs mt-1">{errors[k]}</p>}
          </div>
        ))
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-sm transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#6C63FF]/80 text-white text-sm font-medium transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Configuracion() {
  const { toasts, add: addToast, remove: removeToast } = useToast();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${TABLA}`, {
        headers: { "x-factory-key": "factory2026" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const data = Array.isArray(json) ? json : json.data ?? json.results ?? json.items ?? [];
      setRows(data);
    } catch (err) {
      addToast(`Error al cargar datos: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Filter / Paginate ──────────────────────────────────────────────────────
  const filtered = rows.filter((r) => {
    if (!search) return true;
    return Object.values(r).some((v) =>
      String(v).toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search]);

  // ── Column headers ─────────────────────────────────────────────────────────
  const columns = rows.length > 0 ? Object.keys(rows[0]) : ["clave", "valor", "descripcion"];

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const handleCreate = async (form) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/${TABLA}`, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      addToast("Configuración creada exitosamente");
      setModalOpen(false);
      fetchData();
    } catch (err) {
      addToast(`Error al crear: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (form) => {
    setSaving(true);
    try {
      const id = form.id ?? editItem?.id;
      const res = await fetch(`${API_BASE}/${TABLA}/${id}`, {
        method: "PUT",
        headers: HEADERS,
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      addToast("Configuración actualizada");
      setModalOpen(false);
      setEditItem(null);
      fetchData();
    } catch (err) {
      addToast(`Error al actualizar: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const id = deleteTarget?.id;
      const res = await fetch(`${API_BASE}/${TABLA}/${id}`, {
        method: "DELETE",
        headers: { "x-factory-key": "factory2026" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      addToast("Configuración eliminada");
      setConfirmOpen(false);
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      addToast(`Error al eliminar: ${err.message}`, "error");
    } finally {
      setDeleting(false);
    }
  };

  const openNew = () => { setEditItem(null); setModalOpen(true); };
  const openEdit = (row) => { setEditItem(row); setModalOpen(true); };
  const openDelete = (row) => { setDeleteTarget(row); setConfirmOpen(true); };

  const closeModal = () => { setModalOpen(false); setEditItem(null); };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white p-4 md:p-8">
      <Toast toasts={toasts} remove={removeToast} />
      <ConfirmDialog
        open={confirmOpen}
        message={`¿Eliminar esta configuración? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => { setConfirmOpen(false); setDeleteTarget(null); }}
        loading={deleting}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#6C63FF]/20 border border-[#6C63FF]/30 flex items-center justify-center">
            <Settings size={20} className="text-[#6C63FF]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Configuración del Sistema</h1>
            <p className="text-white/40 text-sm">Gestiona los parámetros y configuraciones globales</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar configuraciones..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#6C63FF]/50 transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl border border-white/10 text-white/40 hover:text-white hover:bg-white/5 transition"
            title="Actualizar"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={openNew}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#6C63FF]/80 text-white text-sm font-medium transition shadow-lg shadow-[#6C63FF]/20"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Nueva Configuración</span>
            <span className="sm:hidden">Nuevo</span>
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2 text-xs text-white/40">
          <SlidersHorizontal size={13} />
          <span>
            {loading ? "Cargando..." : `${filtered.length} registro${filtered.length !== 1 ? "s" : ""}`}
            {search && ` para "${search}"`}
          </span>
        </div>
        {!loading && filtered.length > PAGE_SIZE && (
          <span className="text-xs text-white/30">
            Página {page} de {totalPages}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="bg-[#1A1A2E]/60 border border-white/8 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-white/8">
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3.5 text-left text-xs font-semibold text-white/40 uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-white/40 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
              ) : paginated.length === 0 ? (
                <EmptyState search={search} onNew={openNew} />
              ) : (
                paginated.map((row, idx) => (
                  <tr
                    key={row.id ?? idx}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors group"
                  >
                    {