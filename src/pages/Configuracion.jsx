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
  ServerCrash,
  RefreshCw,
} from "lucide-react";

const API_BASE = "https://www.urusverify.com/v1/client/a84bc421-28d0-4551-81af-7aec26e13526/api";
const UPLOAD_URL = "https://www.urusverify.com/v1/factory/project/a84bc421-28d0-4551-81af-7aec26e13526/upload-data";
const FACTORY_KEY = "factory2026";
const PAGE_SIZE = 20;

const TABLA = "configuracion";

const headers = { "x-factory-key": FACTORY_KEY };
const jsonHeaders = { "x-factory-key": FACTORY_KEY, "Content-Type": "application/json" };

// ── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toasts, remove }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl border text-sm font-medium transition-all duration-300 ${
            t.type === "success"
              ? "bg-[#00D4AA]/10 border-[#00D4AA]/40 text-[#00D4AA]"
              : "bg-red-500/10 border-red-500/40 text-red-400"
          }`}
        >
          {t.type === "success" ? <Check size={16} className="mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="mt-0.5 shrink-0" />}
          <span className="flex-1">{t.msg}</span>
          <button onClick={() => remove(t.id)} className="opacity-60 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  }, []);
  const remove = useCallback((id) => setToasts((p) => p.filter((t) => t.id !== id)), []);
  return { toasts, add, remove };
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonRow({ cols }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded bg-white/5 animate-pulse" style={{ width: `${60 + (i * 17) % 40}%` }} />
        </td>
      ))}
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <div className="h-7 w-7 rounded bg-white/5 animate-pulse" />
          <div className="h-7 w-7 rounded bg-white/5 animate-pulse" />
        </div>
      </td>
    </tr>
  );
}

// ── Confirm Modal ─────────────────────────────────────────────────────────────
function ConfirmModal({ open, onCancel, onConfirm, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1A1A2E] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <h3 className="text-white font-semibold text-lg">Confirmar eliminación</h3>
        </div>
        <p className="text-white/60 text-sm mb-6">Esta acción no se puede deshacer. ¿Deseas continuar?</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all text-sm font-medium flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Form Modal ────────────────────────────────────────────────────────────────
function FormModal({ open, onClose, onSave, editData, fields, loading }) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      const initial = {};
      fields.forEach((f) => { initial[f] = editData ? editData[f] ?? "" : ""; });
      setForm(initial);
      setErrors({});
    }
  }, [open, editData, fields]);

  const validate = () => {
    const e = {};
    fields.forEach((f) => {
      if (!form[f] && form[f] !== 0) e[f] = "Campo requerido";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handle = (f, v) => {
    setForm((p) => ({ ...p, [f]: v }));
    if (errors[f]) setErrors((p) => ({ ...p, [f]: "" }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (validate()) onSave(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1A1A2E] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#6C63FF]/10 border border-[#6C63FF]/20">
              <Settings size={18} className="text-[#6C63FF]" />
            </div>
            <h2 className="text-white font-semibold text-lg">
              {editData ? "Editar registro" : "Nuevo registro"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/5 text-white/50 hover:text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={submit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {fields.map((f) => (
              <div key={f}>
                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">
                  {f.replace(/_/g, " ")}
                </label>
                <input
                  value={form[f] ?? ""}
                  onChange={(e) => handle(f, e.target.value)}
                  placeholder={`Ingresa ${f.replace(/_/g, " ")}`}
                  className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-white placeholder-white/25 text-sm outline-none transition-all focus:bg-white/8 ${
                    errors[f]
                      ? "border-red-500/60 focus:border-red-500"
                      : "border-white/10 focus:border-[#6C63FF]/60"
                  }`}
                />
                {errors[f] && <p className="mt-1 text-xs text-red-400">{errors[f]}</p>}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-white/10 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              style={{ background: "linear-gradient(135deg, #6C63FF, #00D4AA)" }}
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {editData ? "Guardar cambios" : "Crear registro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Configuracion() {
  const { toasts, add: addToast, remove: removeToast } = useToast();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [fields, setFields] = useState([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);

  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const res = await fetch(`${API_BASE}/${TABLA}`, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const rows = Array.isArray(json) ? json : json.data ?? json.items ?? json.results ?? [];
      setData(rows);
      if (rows.length > 0) {
        const systemKeys = ["id", "_id", "createdAt", "updatedAt", "__v"];
        const f = Object.keys(rows[0]).filter((k) => !systemKeys.includes(k));
        setFields(f.length ? f : Object.keys(rows[0]).filter((k) => k !== "id" && k !== "_id"));
      }
    } catch {
      setFetchError(true);
      addToast("Error al cargar los datos", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Filter & Paginate ──────────────────────────────────────────────────────
  const filtered = data.filter((row) =>
    search
      ? Object.values(row).some((v) =>
          String(v).toLowerCase().includes(search.toLowerCase())
        )
      : true
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search]);

  const getId = (row) => row.id ?? row._id;

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const handleSave = async (form) => {
    setSaving(true);
    const isEdit = !!editData;
    const url = isEdit
      ? `${API_BASE}/${TABLA}/${getId(editData)}`
      : UPLOAD_URL;

    try {
      let res;
      if (isEdit) {
        res = await fetch(url, {
          method: "PUT",
          headers: jsonHeaders,
          body: JSON.stringify(form),
        });
      } else {
        const body = new FormData();
        body.append("tabla", TABLA);
        body.append("data", JSON.stringify([form]));
        res = await fetch(url, {
          method: "POST",
          headers: { "x-factory-key": FACTORY_KEY },
          body,
        });
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      addToast(isEdit ? "Registro actualizado correctamente" : "Registro creado correctamente");
      setModalOpen(false);
      setEditData(null);
      await fetchData();
    } catch {
      addToast(isEdit ? "Error al actualizar el registro" : "Error al crear el registro", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/${TABLA}/${confirmId}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      addToast("Registro eliminado correctamente");
      setConfirmId(null);
      await fetchData();
    } catch {
      addToast("Error al eliminar el registro", "error");
    } finally {
      setDeleting(false);
    }
  };

  const openNew = () => { setEditData(null); setModalOpen(true); };
  const openEdit = (row) => { setEditData(row); setModalOpen(true); };

  const displayFields = fields.length ? fields : [];
  const colCount = displayFields.length;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <Toast toasts={toasts} remove={removeToast} />
      <ConfirmModal
        open={!!confirmId}
        onCancel={() => setConfirmId(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
      <FormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditData(null); }}
        onSave={handleSave}
        editData={editData}
        fields={displayFields}
        loading={saving}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-2xl border border-[#6C63FF]/20"
              style={{ background: "linear-gradient(135deg, #6C63FF22, #00D4AA11)" }}
            >
              <Settings size={24} className="text-[#6C63FF]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Configuración del sistema</h1>
              <p className="text-white/40 text-sm mt-0.5">
                Gestiona los parámetros de <span className="text-[#6C63FF]">t</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-white/50 hover:text-white transition-all"
              title="Recargar"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={openNew}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg shadow-[#6C63FF]/20 transition-all hover:shadow-[#6C63FF]/40 hover:scale-105"
              style={{ background: "linear-gradient(135deg, #6C63FF, #00D4AA)" }}
            >
              <Plus size={16} />
              Nuevo
            </button>
          </div>
        </div>

        {/* ── Search ── */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar registros..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm outline-none focus:border-[#6C63FF]/50 focus:bg-white/8 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"
              >
                <X size={14} />
              </button>
            )}
          </div>
          {search && !loading && (
            <p className="mt-2 text-xs text-white/40">
              {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} para "{search}"
            </p>
          )}
        </div>

        {/* ── Table Card ── */}
        <div className="bg-[#1A1A2E] border border-white/8 rounded-2xl overflow-hidden shadow-xl">
          {/* Error */}
          {fetchError && !loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                <ServerCrash size={32} className="text-red-400" />
              </div>
              <div className="text-center">
                <p className="text-white font-medium">Error al cargar datos</p>
                <p className="text-white/40 text-sm mt-1">No se pudo conectar con el servidor</p>
              </div>
              <button
                onClick={fetchData}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#5a52e0] text-white text-sm font-medium transition-all"
              >
                <RefreshCw size={14} /> Reintentar
              </button>
            </div>
          )}

          {/* Table */}
          {!fetchError && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8">
                    {loading ? (
                      <>
                        {[...Array(3)].map((_, i) => (
                          <th key={i} className="px-4 py-3 text-left">
                            <div className="h-3 w-20 rounded bg-white/5 animate-pulse" />
                          </th>
                        ))}
                        <th className="px-4 py-3" />
                      </>
                    ) : displayFields.length > 0 ? (
                      <>
                        {displayFields.map((f) => (
                          <th
                            key={f}
                            className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap"
                          >
                            {f.replace(/_/g, " ")}
                          </th>
                        ))}
                        <th className="px-4 py-3 text-right text-xs font-semibold text-white/40 uppercase tracking-wider">
                          Acciones
                        </th>
                      </>
                    ) : null}
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {/* Skeleton rows */}
                  {loading &&
                    [...Array(6)].map((_, i) => (
                      <SkeletonRow key={i} cols={3} />
                    ))}

                  {/* Empty state */}
                  {!loading && !fetchError && filtered.length === 0 && (
                    <tr>
                      <td colSpan={colCount + 1} className="text-center py-20">
                        <div className="flex flex-col items-center gap-4">
                          <div
                            className="p-5 rounded-2xl border border-[#6C63FF]/20"
                            style={{ background: "linear-gradient(135deg, #