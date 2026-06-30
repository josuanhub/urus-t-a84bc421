import { useState, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Users,
  Database,
  Clock,
  RefreshCw,
  CheckCircle,
  XCircle,
  Minus,
} from "lucide-react";

const API_BASE = "https://www.urusverify.com/v1/client/a84bc421-28d0-4551-81af-7aec26e13526/api";
const HEADERS = { "x-factory-key": "factory2026" };

const TABLES = [
  { key: "usuarios", label: "Usuarios", icon: Users, color: "#6C63FF" },
  { key: "registros", label: "Registros", icon: Database, color: "#00D4AA" },
  { key: "actividades", label: "Actividades", icon: Activity, color: "#6C63FF" },
  { key: "reportes", label: "Reportes", icon: CheckCircle, color: "#00D4AA" },
];

function SkeletonCard() {
  return (
    <div className="rounded-2xl p-6 animate-pulse" style={{ background: "#1A1A2E" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl" style={{ background: "#0A0A0F" }} />
        <div className="w-16 h-5 rounded-full" style={{ background: "#0A0A0F" }} />
      </div>
      <div className="w-20 h-8 rounded-lg mb-2" style={{ background: "#0A0A0F" }} />
      <div className="w-28 h-4 rounded" style={{ background: "#0A0A0F" }} />
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[...Array(4)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded" style={{ background: "#1A1A2E", width: i === 0 ? "60%" : i === 1 ? "80%" : i === 2 ? "50%" : "40%" }} />
        </td>
      ))}
    </tr>
  );
}

function KpiCard({ table, count, loading, error }) {
  const Icon = table.icon;
  const trend = count > 10 ? "up" : count > 5 ? "neutral" : "down";

  return (
    <div
      className="rounded-2xl p-6 transition-all duration-300 hover:scale-105 cursor-default"
      style={{
        background: "#1A1A2E",
        border: `1px solid ${table.color}22`,
        boxShadow: `0 0 20px ${table.color}11`,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: `${table.color}22` }}
        >
          <Icon size={20} style={{ color: table.color }} />
        </div>
        <span
          className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
          style={{
            background:
              trend === "up"
                ? "#00D4AA22"
                : trend === "down"
                ? "#FF6B6B22"
                : "#6C63FF22",
            color:
              trend === "up"
                ? "#00D4AA"
                : trend === "down"
                ? "#FF6B6B"
                : "#6C63FF",
          }}
        >
          {trend === "up" ? (
            <TrendingUp size={12} />
          ) : trend === "down" ? (
            <TrendingDown size={12} />
          ) : (
            <Minus size={12} />
          )}
          {trend === "up" ? "+12%" : trend === "down" ? "-3%" : "0%"}
        </span>
      </div>

      {loading ? (
        <>
          <div className="w-20 h-8 rounded-lg mb-2 animate-pulse" style={{ background: "#0A0A0F" }} />
          <div className="w-28 h-4 rounded animate-pulse" style={{ background: "#0A0A0F" }} />
        </>
      ) : error ? (
        <div className="flex items-center gap-2" style={{ color: "#FF6B6B" }}>
          <XCircle size={16} />
          <span className="text-sm">Error al cargar</span>
        </div>
      ) : (
        <>
          <p className="text-3xl font-bold text-white mb-1">
            {count?.toLocaleString() ?? "—"}
          </p>
          <p className="text-sm" style={{ color: "#6C63FF99" }}>
            Total {table.label}
          </p>
        </>
      )}
    </div>
  );
}

function AlertBanner({ alerts }) {
  if (!alerts || alerts.length === 0) return null;
  return (
    <div
      className="rounded-2xl p-4 flex items-start gap-3"
      style={{
        background: "#FF6B6B11",
        border: "1px solid #FF6B6B44",
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: "#FF6B6B22" }}
      >
        <AlertTriangle size={18} style={{ color: "#FF6B6B" }} />
      </div>
      <div>
        <p className="font-semibold text-sm mb-1" style={{ color: "#FF6B6B" }}>
          {alerts.length} Alerta{alerts.length > 1 ? "s" : ""} Crítica{alerts.length > 1 ? "s" : ""}
        </p>
        <ul className="space-y-1">
          {alerts.slice(0, 3).map((a, i) => (
            <li key={i} className="text-xs" style={{ color: "#FF6B6BAA" }}>
              • {a.nombre || a.titulo || a.descripcion || JSON.stringify(a).slice(0, 60)}
            </li>
          ))}
          {alerts.length > 3 && (
            <li className="text-xs" style={{ color: "#FF6B6B66" }}>
              + {alerts.length - 3} más...
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

function StatusBadge({ estado }) {
  const map = {
    urgente: { bg: "#FF6B6B22", color: "#FF6B6B", label: "Urgente" },
    activo: { bg: "#00D4AA22", color: "#00D4AA", label: "Activo" },
    pendiente: { bg: "#6C63FF22", color: "#6C63FF", label: "Pendiente" },
    inactivo: { bg: "#FFFFFF11", color: "#FFFFFF44", label: "Inactivo" },
  };
  const style = map[estado?.toLowerCase()] || { bg: "#FFFFFF11", color: "#FFFFFF44", label: estado || "—" };
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: style.bg, color: style.color }}
    >
      {style.label}
    </span>
  );
}

export default function Dashboard() {
  const [kpis, setKpis] = useState({});
  const [kpiLoading, setKpiLoading] = useState(true);
  const [kpiErrors, setKpiErrors] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [globalError, setGlobalError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchKpis = async () => {
    const results = {};
    const errors = {};

    await Promise.all(
      TABLES.map(async (table) => {
        try {
          const res = await fetch(`${API_BASE}/${table.key}`, { headers: HEADERS });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const arr = Array.isArray(data) ? data : data?.data ?? data?.results ?? [];
          results[table.key] = arr.length;

          const urgentes = arr.filter(
            (item) => item?.estado?.toLowerCase() === "urgente"
          );
          if (urgentes.length > 0) {
            setAlerts((prev) => {
              const ids = new Set(prev.map((a) => JSON.stringify(a)));
              const newOnes = urgentes.filter((u) => !ids.has(JSON.stringify(u)));
              return [...prev, ...newOnes];
            });
          }
        } catch (err) {
          errors[table.key] = err.message;
        }
      })
    );

    setKpis(results);
    setKpiErrors(errors);
  };

  const fetchActivity = async () => {
    const allRecords = [];

    await Promise.all(
      TABLES.map(async (table) => {
        try {
          const res = await fetch(`${API_BASE}/${table.key}`, { headers: HEADERS });
          if (!res.ok) return;
          const data = await res.json();
          const arr = Array.isArray(data) ? data : data?.data ?? data?.results ?? [];
          arr.slice(0, 5).forEach((item) => {
            allRecords.push({ ...item, _source: table.label, _color: table.color });
          });
        } catch (_) {}
      })
    );

    allRecords.sort((a, b) => {
      const da = new Date(a.created_at || a.updatedAt || a.fecha || 0);
      const db = new Date(b.created_at || b.updatedAt || b.fecha || 0);
      return db - da;
    });

    setRecentActivity(allRecords.slice(0, 10));
  };

  const loadAll = async () => {
    setGlobalError(null);
    setAlerts([]);
    try {
      setKpiLoading(true);
      setActivityLoading(true);
      await Promise.all([fetchKpis(), fetchActivity()]);
      setLastUpdated(new Date());
    } catch (err) {
      setGlobalError("Error al conectar con el servidor. Verifica tu conexión.");
    } finally {
      setKpiLoading(false);
      setActivityLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const formatDate = (val) => {
    if (!val) return "—";
    const d = new Date(val);
    if (isNaN(d)) return String(val).slice(0, 16);
    return d.toLocaleDateString("es-UY", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRecordLabel = (item) => {
    return (
      item.nombre ||
      item.titulo ||
      item.name ||
      item.title ||
      item.descripcion ||
      item.email ||
      (item.id ? `#${item.id}` : "Sin nombre")
    );
  };

  return (
    <div className="min-h-screen px-4 py-8 md:px-8" style={{ background: "#0A0A0F" }}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Dashboard{" "}
              <span style={{ color: "#6C63FF" }}>t</span>
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6C63FF99" }}>
              Vista general del sistema
            </p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs flex items-center gap-1.5" style={{ color: "#6C63FF66" }}>
                <Clock size={12} />
                {formatDate(lastUpdated)}
              </span>
            )}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
              style={{
                background: "#6C63FF22",
                color: "#6C63FF",
                border: "1px solid #6C63FF44",
              }}
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              Actualizar
            </button>
          </div>
        </div>

        {/* Global error */}
        {globalError && (
          <div
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: "#FF6B6B11", border: "1px solid #FF6B6B33" }}
          >
            <XCircle size={18} style={{ color: "#FF6B6B" }} />
            <p className="text-sm" style={{ color: "#FF6B6B" }}>{globalError}</p>
          </div>
        )}

        {/* Alerts */}
        {alerts.length > 0 && <AlertBanner alerts={alerts} />}

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {TABLES.map((table) =>
            kpiLoading ? (
              <SkeletonCard key={table.key} />
            ) : (
              <KpiCard
                key={table.key}
                table={table}
                count={kpis[table.key]}
                loading={false}
                error={kpiErrors[table.key]}
              />
            )
          )}
        </div>

        {/* Summary bar */}
        {!kpiLoading && (
          <div
            className="rounded-2xl p-4 flex flex-wrap gap-6 items-center"
            style={{ background: "#1A1A2E", border: "1px solid #6C63FF22" }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: "#00D4AA" }} />
              <span className="text-xs" style={{ color: "#00D4AA" }}>
                Sistema operativo
              </span>
            </div>
            <div className="text-xs" style={{ color: "#6C63FF66" }}>
              Total registros:{" "}
              <span className="font-bold text-white">
                {Object.values(kpis).reduce((a, b) => a + (b || 0), 0).toLocaleString()}
              </span>
            </div>
            <div className="text-xs" style={{ color: "#6C63FF66" }}>
              Tablas activas:{" "}
              <span className="font-bold text-white">
                {Object.keys(kpis).length}
              </span>
            </div>
            {alerts.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#FF6B6B" }} />
                <span className="text-xs" style={{ color: "#FF6B6B" }}>
                  {alerts.length} alerta{alerts.length > 1 ? "s" : ""} urgente{alerts.length > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Recent Activity Table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "#1A1A2E", border: "1px solid #6C63FF22" }}
        >
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid #6C63FF11" }}
          >
            <div className="flex items-center gap-2">
              <Activity size={16} style={{ color: "#6C63FF" }} />
              <h2 className="font-semibold text-white text-sm">
                Actividad Reciente
              </h2>
            </div>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: "#6C63FF22", color: "#6C63FF" }}>
              Últimos 10
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #6C63FF11" }}>
                  {["Registro", "Fuente", "Estado", "Fecha"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#6C63FF66" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activityLoading ? (
                  [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                ) : recentActivity.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm" style={{ color: "#6C63FF44" }}>
                      No hay actividad reciente
                    </td>
                  </tr>
                ) : (
                  recentActivity.map((item, idx) => (
                    <tr
                      key={idx}
                      className="transition-colors duration-150"
                      style={{
                        borderBottom: "1px solid #6C63FF08",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#6C63FF08")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm text-white font-medium truncate max-w-[180px] block">
                          {getRecordLabel(item)}
                        </span>
                        {item.id && (
                          <span className="text-xs" style={{ color: "#6C63FF55" }}>
                            ID: {item.id}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs font-medium px-2 py-1 rounded-full"
                          style={{
                            background: `${item._color}22`,
                            color: item._color,
                          }}
                        >
                          {item._source}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge estado={item.estado} />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs" style={{ color: "#6C63FF66" }}>
                          {formatDate(item.created_at || item.updatedAt || item.fecha)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}