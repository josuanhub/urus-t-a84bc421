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
  InboxIcon,
} from "lucide-react";

const API_BASE = "https://www.urusverify.com/v1/client/a84bc421-28d0-4551-81af-7aec26e13526/api";
const UPLOAD_URL = "https://www.urusverify.com/v1/factory/project/a84bc421-28d0-4551-81af-7aec26e13526/upload-data";
const HEADERS = { "x-factory-key": "factory2026" };
const TABLE = "configuracion";
const PAGE_SIZE = 20;

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ toasts, remove }) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-sm transition-all duration-300 ${
            t.type === "success"
              ? "bg-[#00D4AA]/10 border-[#00D4AA]/30 text-[#00D4AA]"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {t.type === "success" ? (
            <Check size={18} className="mt-0.5 shrink-0" />
          ) : (
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          )}
          <span className="text-sm flex-1 text-white/90">{t.message}</span>
          <button onClick={() => remove(t.id)} className="text-white/40 hover:text-white/80">
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
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);
  const remove = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);
  return { toasts, add, remove };
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-white/5">
      {[...Array(4)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-white/5 rounded animate-pulse" style={{ width: `${60 + i * 10}%` }} />
        </td>
      ))}
      <td className="px-4 py-3">
        <div className="flex gap-2 justify-end">
          <div className="h-8 w-8 bg-white/5 rounded-lg animate-pulse" />
          <div className="h-8 w-8 bg-white/5 rounded-lg animate-pulse" />
        </div>
      </td>
    </tr>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, children }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg">{children}</div>
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({ open, onClose, onConfirm, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-[#1A1A2E] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500/10 rounded-xl">
            <AlertTriangle size={22} className="text-red-400" />
          </div>
          <h3 className="text-white font-semibold text-lg">Confirmar eliminación</h3>
        </div>
        <p className="text-white/60 text-sm mb-6">
          Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar este registro?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 transition-colors text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-red-500/80 hover:bg-red-500 text-white font-medium transition-colors text-sm flex items-center gap-2 disabled:opacity-60"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Helper: get field keys from a record ────────────────────────────────────
function getFieldKeys(record) {
  if (!record) return [];
  return Object.keys(record).filter((k) => k !== "id" && k !== "_id" && k !== "__v");
}

function getRecordId(record) {
  return record?.id ?? record?._id ?? null;
}

// ─── Form ─────────────────────────────────────────────────────────────────────
function RecordForm({ fields, values, onChange, errors }) {
  return (
    <div className="grid gap-4">
      {fields.map((field) => (
        <div key={field}>
          <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-1.5">
            {field.replace(/_/g, " ")}
          </label>
          <input
            type="text"
            value={values[field] ?? ""}
            onChange={(e) => onChange(field, e.target.value)}
            className={`w-full bg-white/5 border rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:ring-2 transition-all ${
              errors[field]
                ? "border-red-500/50 focus:ring-red-500/30"
                : "border-white/10 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF]/50"
            }`}
            placeholder={`Ingresa ${field.replace(/_/g, " ")}...`}
          />
          {errors[field] && (
            <p className="mt-1 text-xs text-red-400">{errors[field]}</p>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Configuracion() {
  const { toasts, add: addToast, remove: removeToast } = useToast();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fields, setFields] = useState([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ─── Fetch ─────────────────────────────────────────────────────────────────
  const fetchRecords = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch(`${API_BASE}/${TABLE}`, { headers: HEADERS });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.data ?? data?.records ?? [];
      setRecords(list);
      if (list.length > 0) setFields(getFieldKeys(list[0]));
    } catch (err) {
      addToast("Error al cargar los registros", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [addToast]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  // ─── Filter / Paginate ─────────────────────────────────────────────────────
  const filtered = records.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return Object.values(r).some((v) => String(v).toLowerCase().includes(q));
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search]);

  // ─── Modal helpers ─────────────────────────────────────────────────────────
  const openNew = () => {
    setEditRecord(null);
    const initVals = {};
    fields.forEach((f) => { initVals[f] = ""; });
    setFormValues(initVals);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditRecord(record);
    const vals = {};
    fields.forEach((f) => { vals[f] = record[f] ?? ""; });
    setFormValues(vals);
    setFormErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditRecord(null);
    setFormErrors({});
  };

  const handleFieldChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // ─── Validate ──────────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    fields.forEach((f) => {
      if (!String(formValues[f] ?? "").trim()) {
        errs[f] = "Este campo es requerido";
      }
    });
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ─── Save (Create / Update) ────────────────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const isEdit = !!editRecord;
      const id = isEdit ? getRecordId(editRecord) : null;

      const payload = { table: TABLE, data: { ...formValues } };
      if (isEdit && id) payload.data.id = id;

      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `${API_BASE}/${TABLE}/${id}` : `${API_BASE}/${TABLE}`;

      // Try direct API first
      let res = await fetch(url, {
        method,
        headers: { ...HEADERS, "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      // Fallback to upload endpoint
      if (!res.ok) {
        const formData = new FormData();
        formData.append("table", TABLE);
        formData.append("data", JSON.stringify(isEdit ? { ...formValues, id } : formValues));
        if (isEdit) formData.append("method", "PUT");
        res = await fetch(UPLOAD_URL, { method: "POST", headers: HEADERS, body: formData });
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      addToast(isEdit ? "Registro actualizado correctamente" : "Registro creado correctamente", "success");
      closeModal();
      fetchRecords(true);
    } catch {
      addToast("Error al guardar el registro", "error");
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete ────────────────────────────────────────────────────────────────
  const confirmDelete = (record) => {
    setDeleteTarget(record);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const id = getRecordId(deleteTarget);
      const res = await fetch(`${API_BASE}/${TABLE}/${id}`, {
        method: "DELETE",
        headers: HEADERS,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      addToast("Registro eliminado correctamente", "success");
      setConfirmOpen(false);
      setDeleteTarget(null);
      fetchRecords(true);
    } catch {
      addToast("Error al eliminar el registro", "error");
    } finally {
      setDeleting(false);
    }
  };

  // ─── Display columns (max 4 for readability) ───────────────────────────────
  const displayFields = fields.slice(0, 4);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <Toast toasts={toasts} remove={removeToast} />

      {/* Header */}
      <div className="border-b border-white/5 bg-[#0A0A0F]/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#6C63FF]/10 border border-[#6C63FF]/20">
              <Settings size={20} className="text-[#6C63FF]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Configuración del sistema</h1>
              <p className="text-xs text-white/40">Sistema t · Módulo Configuracion</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchRecords(true)}
              disabled={refreshing}
              className="p-2 rounded-xl border border-white/10 hover:bg-white/5 text-white/50 hover:text-white transition-all"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            </button>
            <button
              onClick={openNew}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6C63FF] hover:bg-[#6C63FF]/80 text-white font-medium text-sm transition-all shadow-lg shadow-[#6C63FF]/20"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Nuevo</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar en configuraciones..."
            className="w-full bg-[#1A1A2E] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF]/40 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-between text-xs text-white/40">
          <span>
            {loading ? "Cargando..." : `${filtered.length} registro${filtered.length !== 1 ? "s" : ""}${search ? " encontrado" + (filtered.length !== 1 ? "s" : "") : ""}`}
          </span>
          {filtered.length > PAGE_SIZE && (
            <span>Página {page} de {totalPages}</span>
          )}
        </div>

        {/* Table */}
        <div className="bg-[#1A1A2E] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {displayFields.map((f) => (
                    <th key={f} className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap">
                      {f.replace(/_/g, " ")}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-xs font-semibold text-white/40 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={displayFields.length + 1} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-white/5 rounded-2xl">
                          <InboxIcon size={32} className="text-white/20" />
                        </div>
                        <div>
                          <p className="text-white/50 font-medium">
                            {search ? "Sin resultados para tu búsqueda" : "No hay registros aún"}
                          </p>
                          <p className="text-white/30 text-xs mt-1">
                            {search ? "Intenta con otro término" : "Crea el primer registro de configuración"}
                          </p>
                        </div>
                        {!search && (
                          <button
                            onClick={openNew}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6C63FF]/20 hover:bg-[#6C63FF]/30 border border-[#6C63FF]/30 text-[#6C63FF] text-sm font-medium transition-all"
                          >
                            <Plus size={14} />
                            Crear configuración
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((record, idx) => (
                    <tr
                      key={getRecordId(record) ?? idx}
                      className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group"
                    >
                      {displayFields.map((f) => (
                        <td key={f} className="px-4 py-3 text-white/70 max-w-[200px]">
                          <span className="block truncate" title={String(record[f] ?? "—")}>
                            {record[f] != null && record[f] !== "" ? String(record[f]) : (
                              <span className="text-white/20 italic">—</span>
                            )}
                          </span>
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(record)}
                            className="p-2 rounded-lg bg-[#6C63FF]/10 hover:bg-[#6C63FF]/20 border border-[#6C63FF]/20 text-[#6C63FF] transition-all"
                            title="Editar"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => confirmDelete(record)}
                            className="p-2 rounded-lg bg