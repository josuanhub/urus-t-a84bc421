import { useState, useEffect, useCallback } from "react";
import {
  Settings,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  SlidersHorizontal,
  RefreshCw,
} from "lucide-react";

const API_BASE = "https://www.urusverify.com/v1/client/a84bc421-28d0-4551-81af-7aec26e13526/api";
const UPLOAD_URL = "https://www.urusverify.com/v1/factory/project/a84bc421-28d0-4551-81af-7aec26e13526/upload-data";
const HEADERS = { "x-factory-key": "factory2026" };
const PAGE_SIZE = 20;

// ── Toast ──────────────────────────────────────────────────────────────────
function Toast({ toasts, remove }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-sm transition-all duration-300
            ${t.type === "success"
              ? "bg-[#00D4AA]/10 border-[#00D4AA]/40 text-[#00D4AA]"
              : "bg-red-500/10 border-red-500/40 text-red-400"
            }`}
        >
          {t.type === "success" ? (
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
          )}
          <span className="text-sm flex-1">{t.message}</span>
          <button onClick={() => remove(t.id)} className="opacity-60 hover:opacity-100">
            <X className="w-4 h-4" />
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

// ── Skeleton ───────────────────────────────────────────────────────────────
function SkeletonRow({ cols }) {
  return (
    <tr className="border-b border-white/5">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-white/10 rounded animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
        </td>
      ))}
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <div className="h-7 w-7 bg-white/10 rounded-lg animate-pulse" />
          <div className="h-7 w-7 bg-white/10 rounded-lg animate-pulse" />
        </div>
      </td>
    </tr>
  );
}

// ── Delete Confirm Modal ───────────────────────────────────────────────────
function ConfirmModal({ item, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-[#1A1A2E] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Eliminar registro</h3>
            <p className="text-gray-400 text-sm mt-1">
              Esta acción no se puede deshacer. ¿Confirmas la eliminación?
            </p>
          </div>
          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Form Modal ─────────────────────────────────────────────────────────────
function FormModal({ schema, initial, onSave, onClose, loading }) {
  const [form, setForm] = useState(initial || {});
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    schema.forEach((f) => {
      if (f.required && !form[f.key]?.toString().trim()) {
        e[f.key] = "Campo requerido";
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (validate()) onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1A1A2E] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#6C63FF]/20 border border-[#6C63FF]/30 flex items-center justify-center">
              <Settings className="w-4 h-4 text-[#6C63FF]" />
            </div>
            <h2 className="text-white font-semibold">
              {initial?.id ? "Editar registro" : "Nuevo registro"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
            {schema.map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  {f.label}
                  {f.required && <span className="text-[#6C63FF] ml-1">*</span>}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    rows={3}
                    value={form[f.key] || ""}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/50 resize-none transition-all
                      ${errors[f.key] ? "border-red-500/60" : "border-white/10 hover:border-white/20"}`}
                    placeholder={f.placeholder || ""}
                  />
                ) : f.type === "select" ? (
                  <select
                    value={form[f.key] || ""}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl bg-[#0A0A0F] border text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/50 transition-all
                      ${errors[f.key] ? "border-red-500/60" : "border-white/10 hover:border-white/20"}`}
                  >
                    <option value="">Seleccionar...</option>
                    {f.options?.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type || "text"}
                    value={form[f.key] || ""}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/50 transition-all
                      ${errors[f.key] ? "border-red-500/60" : "border-white/10 hover:border-white/20"}`}
                    placeholder={f.placeholder || ""}
                  />
                )}
                {errors[f.key] && (
                  <p className="text-red-400 text-xs mt-1">{errors[f.key]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#5a52d5] text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {initial?.id ? "Guardar cambios" : "Crear registro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────
function EmptyState({ onNew, search }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5">
      <div className="w-20 h-20 rounded-2xl bg-[#6C63FF]/10 border border-[#6C63FF]/20 flex items-center justify-center">
        <Settings className="w-9 h-9 text-[#6C63FF]/60" />
      </div>
      <div className="text-center">
        <h3 className="text-white font-semibold text-lg">
          {search ? "Sin resultados" : "Sin configuraciones"}
        </h3>
        <p className="text-gray-500 text-sm mt-1 max-w-xs">
          {search
            ? `No se encontraron registros para "${search}".`
            : "Aún no hay configuraciones. Crea la primera para comenzar."}
        </p>
      </div>
      {!search && (
        <button
          onClick={onNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#5a52d5] text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva configuración
        </button>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function Configuracion() {
  const { toasts, add: addToast, remove: removeToast } = useToast();

  const [tabla, setTabla] = useState(null);
  const [schema, setSchema] = useState([]);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [modal, setModal] = useState(null); // null | { mode: 'create'|'edit', data: {} }
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Discover table ─────────────────────────────────────────────────────
  useEffect(() => {
    const tables = ["configuracion", "config", "settings", "parametros", "sistema"];
    let found = false;
    (async () => {
      for (const t of tables) {
        try {
          const r = await fetch(`${API_BASE}/${t}`, { headers: HEADERS });
          if (r.ok) {
            const json = await r.json();
            if (json && (Array.isArray(json) || Array.isArray(json.data) || typeof json === "object")) {
              setTabla(t);
              found = true;
              break;
            }
          }
        } catch (_) {}
      }
      if (!found) setTabla("configuracion");
    })();
  }, []);

  // ── Fetch data ─────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    if (!tabla) return;
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/${tabla}`, { headers: HEADERS });
      if (!r.ok) throw new Error("Error al cargar");
      const json = await r.json();
      const data = Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : [];

      setRows(data);

      if (data.length > 0) {
        const sample = data[0];
        const ignoredKeys = ["id", "__v", "createdAt", "updatedAt", "created_at", "updated_at"];
        const keys = Object.keys(sample).filter((k) => !ignoredKeys.includes(k));

        setColumns(keys);
        setSchema(
          keys.map((k) => ({
            key: k,
            label: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            type: typeof sample[k] === "number" ? "number" : "text",
            required: true,
            placeholder: `Ingresa ${k.replace(/_/g, " ")}`,
          }))
        );
      } else {
        setColumns(["nombre", "valor", "descripcion"]);
        setSchema([
          { key: "nombre", label: "Nombre", type: "text", required: true, placeholder: "Nombre de la configuración" },
          { key: "valor", label: "Valor", type: "text", required: true, placeholder: "Valor" },
          { key: "descripcion", label: "Descripción", type: "textarea", required: false, placeholder: "Descripción opcional" },
        ]);
      }
    } catch (err) {
      addToast("Error al cargar los datos", "error");
    } finally {
      setLoading(false);
    }
  }, [tabla, addToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Filter & Paginate ──────────────────────────────────────────────────
  const filtered = rows.filter((row) =>
    Object.values(row).some((v) =>
      String(v ?? "").toLowerCase().includes(search.toLowerCase())
    )
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search]);

  // ── CRUD ───────────────────────────────────────────────────────────────
  const handleSave = async (formData) => {
    setSaving(true);
    const isEdit = !!modal?.data?.id;
    try {
      const payload = new FormData();
      payload.append("table", tabla);
      payload.append("data", JSON.stringify(isEdit ? { ...formData, id: modal.data.id } : formData));
      if (isEdit) payload.append("id", modal.data.id);

      const r = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: HEADERS,
        body: payload,
      });
      if (!r.ok) throw new Error();
      addToast(isEdit ? "Registro actualizado correctamente" : "Registro creado correctamente", "success");
      setModal(null);
      fetchData();
    } catch {
      addToast("Error al guardar el registro", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const r = await fetch(`${API_BASE}/${tabla}/${deleteTarget.id}`, {
        method: "DELETE",
        headers: HEADERS,
      });
      if (!r.ok) throw new Error();
      addToast("Registro eliminado correctamente", "success");
      setDeleteTarget(null);
      fetchData();
    } catch {
      addToast("Error al eliminar el registro", "error");
    } finally {
      setDeleting(false);
    }
  };

  const displayColumns = columns.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <Toast toasts={toasts} remove={removeToast} />

      {deleteTarget && (
        <ConfirmModal
          item={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}

      {modal && (
        <FormModal
          schema={schema}
          initial={modal.data}
          onSave={handleSave}
          onClose={() => setModal(null)}
          loading={saving}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-[#6C63FF]/20 border border-[#6C63FF]/30 flex items-center justify-center">
              <Settings className="w-5 h-5 text-[#6C63FF]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Configuración del sistema</h1>
              <p className="text-gray-500 text-sm">
                {tabla ? `Tabla: ${tabla}` : "Detectando tabla..."}
                {!loading && ` · ${rows.length} registros`}
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar configuraciones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/50 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchData}
              className="px-3 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
              title="Recargar"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setModal({