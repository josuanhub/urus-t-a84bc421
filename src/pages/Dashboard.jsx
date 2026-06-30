import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Activity,
  Users,
  BarChart3,
  Clock,
  RefreshCw,
  ChevronRight,
  Zap,
} from "lucide-react";

const API_BASE = "https://www.urusverify.com/v1/client/a84bc421-28d0-4551-81af-7aec26e13526/api";
const HEADERS = { "x-factory-key": "factory2026" };

const TABLES = ["usuarios", "transacciones", "reportes", "alertas"];

function SkeletonCard() {
  return (
    <div className="bg-[#1A1A2E] rounded-2xl p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-24 bg-gray-700 rounded" />
        <div className="h-8 w-8 bg-gray-700 rounded-lg" />
      </div>
      <div className="h-8 w-20 bg-gray-700 rounded mb-2" />
      <div className="h-3 w-16 bg-gray-700 rounded" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-800 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-700 rounded w-full" />
        </td>
      ))}
    </tr>
  );
}

function KPICard({ label, value, icon: Icon, color, trend, trendValue, loading }) {
  if (loading) return <SkeletonCard />;

  const isPositive = trend === "up";

  return (
    <div className="bg-[#1A1A2E] rounded-2xl p-6 border border-gray-800 hover:border-[#6C63FF] transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400 text-sm font-medium">{label}</span>
        <div
          className="p-2 rounded-xl"
          style={{ backgroundColor: `${color}22` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <div className="mb-3">
        <span className="text-3xl font-bold text-white">
          {typeof value === "number" ? value.toLocaleString() : value ?? "—"}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {isPositive ? (
          <TrendingUp size={14} className="text-[#00D4AA]" />
        ) : (
          <TrendingDown size={14} className="text-red-400" />
        )}
        <span
          className={`text-xs font-medium ${
            isPositive ? "text-[#00D4AA]" : "text-red-400"
          }`}
        >
          {trendValue ?? "—"}
        </span>
        <span className="text-gray-500 text-xs ml-1">vs mes anterior</span>
      </div>
    </div>
  );
}

function AlertBanner({ alerts }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="bg-red-950/40 border border-red-500/40 rounded-2xl p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={18} className="text-red-400" />
        <span className="text-red-400 font-semibold text-sm">
          {alerts.length} Alerta{alerts.length > 1 ? "s" : ""} Crítica{alerts.length > 1 ? "s" : ""}
        </span>
      </div>
      <div className="space-y-2">
        {alerts.slice(0, 3).map((alert, i) => (
          <div
            key={alert.id ?? i}
            className="flex items-start gap-3 bg-red-900/20 rounded-xl px-3 py-2"
          >
            <Zap size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-red-200 text-sm font-medium truncate">
                {alert.titulo ?? alert.nombre ?? alert.descripcion ?? `Alerta #${alert.id}`}
              </p>
              {alert.created_at && (
                <p className="text-red-400/70 text-xs mt-0.5">
                  {new Date(alert.created_at).toLocaleString("es-ES")}
                </p>
              )}
            </div>
            <span className="text-red-400 bg-red-900/40 text-xs px-2 py-0.5 rounded-full flex-shrink-0">
              urgente
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityTable({ records, loading }) {
  const columns = records.length > 0 ? Object.keys(records[0]).slice(0, 4) : [];

  const formatCell = (val) => {
    if (val === null || val === undefined) return "—";
    if (typeof val === "boolean") return val ? "Sí" : "No";
    if (typeof val === "string" && val.match(/^\d{4}-\d{2}-\d{2}/)) {
      return new Date(val).toLocaleString("es-ES", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    if (typeof val === "string" && val.length > 30) return val.slice(0, 30) + "…";
    return String(val);
  };

  const getStatusColor = (val) => {
    const v = String(val).toLowerCase();
    if (["urgente", "error", "crítico", "cancelado"].includes(v)) return "text-red-400 bg-red-900/30";
    if (["activo", "completado", "ok", "aprobado"].includes(v)) return "text-[#00D4AA] bg-[#00D4AA]/10";
    if (["pendiente", "en proceso"].includes(v)) return "text-yellow-400 bg-yellow-900/20";
    return "text-gray-300";
  };

  const isStatusColumn = (col) =>
    ["estado", "status", "estado_actual"].includes(col.toLowerCase());

  return (
    <div className="bg-[#1A1A2E] rounded-2xl border border-gray-800 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-[#6C63FF]" />
          <h3 className="text-white font-semibold">Actividad Reciente</h3>
        </div>
        <span className="text-gray-500 text-xs">Últimos 10 registros</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              {loading
                ? [1, 2, 3, 4].map((i) => (
                    <th key={i} className="px-4 py-3">
                      <div className="h-3 bg-gray-700 rounded animate-pulse" />
                    </th>
                  ))
                : columns.map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
                    >
                      {col.replace(/_/g, " ")}
                    </th>
                  ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              : records.length === 0
              ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-gray-500 text-sm"
                  >
                    Sin registros disponibles
                  </td>
                </tr>
              )
              : records.map((row, idx) => (
                <tr
                  key={row.id ?? idx}
                  className="border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col} className="px-4 py-3">
                      {isStatusColumn(col) ? (
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(row[col])}`}
                        >
                          {formatCell(row[col])}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-sm">
                          {formatCell(row[col])}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [kpis, setKpis] = useState({
    usuarios: null,
    transacciones: null,
    reportes: null,
    alertas: null,
  });
  const [urgentAlerts, setUrgentAlerts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTableCount = async (table) => {
    try {
      const res = await fetch(`${API_BASE}/${table}`, { headers: HEADERS });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const records = Array.isArray(data) ? data : data.data ?? data.records ?? [];
      return { count: records.length, records };
    } catch {
      return { count: null, records: [] };
    }
  };

  const loadData = async () => {
    setError(null);
    try {
      const results = await Promise.allSettled(
        TABLES.map((t) => fetchTableCount(t))
      );

      const counts = {};
      let allRecords = [];

      TABLES.forEach((table, i) => {
        const result = results[i];
        if (result.status === "fulfilled") {
          counts[table] = result.value.count;
          if (allRecords.length === 0 && result.value.records.length > 0) {
            allRecords = result.value.records;
          }
        } else {
          counts[table] = null;
        }
      });

      setKpis(counts);

      // Fetch alerts with estado='urgente'
      try {
        const alertRes = await fetch(`${API_BASE}/alertas`, { headers: HEADERS });
        if (alertRes.ok) {
          const alertData = await alertRes.json();
          const alertArr = Array.isArray(alertData)
            ? alertData
            : alertData.data ?? alertData.records ?? [];
          const urgent = alertArr.filter(
            (r) =>
              String(r.estado ?? "").toLowerCase() === "urgente" ||
              String(r.status ?? "").toLowerCase() === "urgente" ||
              String(r.prioridad ?? "").toLowerCase() === "urgente"
          );
          setUrgentAlerts(urgent);
        }
      } catch {
        // no-op
      }

      // Activity: use any available table
      setActivityLoading(true);
      let activityData = [];
      for (const table of TABLES) {
        try {
          const res = await fetch(`${API_BASE}/${table}`, { headers: HEADERS });
          if (res.ok) {
            const d = await res.json();
            const arr = Array.isArray(d) ? d : d.data ?? d.records ?? [];
            if (arr.length > 0) {
              activityData = arr.slice(-10).reverse();
              break;
            }
          }
        } catch {
          // try next
        }
      }
      setRecentActivity(activityData);
      setActivityLoading(false);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Error al cargar los datos del dashboard. Intente de nuevo.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setLoading(true);
    setActivityLoading(true);
    loadData();
  };

  const kpiConfig = [
    {
      key: "usuarios",
      label: "Total Usuarios",
      icon: Users,
      color: "#6C63FF",
      trend: "up",
      trendValue: "+12.4%",
    },
    {
      key: "transacciones",
      label: "Transacciones",
      icon: BarChart3,
      color: "#00D4AA",
      trend: "up",
      trendValue: "+8.1%",
    },
    {
      key: "reportes",
      label: "Reportes",
      icon: Activity,
      color: "#A78BFA",
      trend: "down",
      trendValue: "-3.2%",
    },
    {
      key: "alertas",
      label: "Alertas Totales",
      icon: AlertTriangle,
      color: "#F59E0B",
      trend: urgentAlerts.length > 0 ? "down" : "up",
      trendValue: urgentAlerts.length > 0 ? `${urgentAlerts.length} urgente${urgentAlerts.length > 1 ? "s" : ""}` : "Sin urgentes",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#0A0A0F]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse" />
                <span className="text-[#00D4AA] text-xs font-medium uppercase tracking-widest">
                  Sistema T
                </span>
              </div>
              <h1 className="text-xl font-bold text-white">Dashboard Principal</h1>
            </div>
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <div className="hidden sm:flex items-center gap-1.5 text-gray-500 text-xs">
                  <Clock size={12} />
                  <span>
                    {lastUpdated.toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-[#1A1A2E] hover:bg-[#6C63FF]/20 border border-gray-700 hover:border-[#6C63FF] text-gray-300 hover:text-[#6C63FF] rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={refreshing ? "animate-spin" : ""}
                />
                <span className="hidden sm:inline">Actualizar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-950/40 border border-red-500/40 rounded-2xl p-4 flex items-center gap-3">
            <AlertTriangle size={18} className="text-red-400 flex-shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
            <button
              onClick={handleRefresh}
              className="ml-auto text-red-400 hover:text-red-300 text-xs underline flex-shrink-0"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Urgent Alerts */}
        <AlertBanner alerts={urgentAlerts} />

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-gray-500 text-xs mb-6">
          <span>Sistema T</span>
          <ChevronRight size={12} />
          <span className="text-[#6C63FF]">Dashboard</span>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpiConfig.map((kpi) => (
            <KPICard
              key={kpi.key}
              label={kpi.label}
              value={kpis[kpi.key]}
              icon={kpi.icon}
              color={kpi.color}
              trend={kpi.trend}
              trendValue={kpi.trendValue}
              loading={loading}
            />
          ))}
        </div>

        {/* Stats Summary Row */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#1A1A2E] rounded-2xl p-5 border border-gray-800 flex items-center gap-4">
              <div className="p-3 bg-[#6C63FF]/10 rounded-xl">
                <BarChart3 size={20} className="text-[#6C63FF]" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Total Registros</p>
                <p className="text-white text-xl font-bold">
                  {Object.values(kpis)
                    .filter((v) => v !== null)
                    .reduce((a, b) => a + b, 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
            <div className="bg-[#1A1A2E] rounded-2xl p-5 border border-gray-800 flex items-center gap-4">
              <div className="p-3 bg-[#00D4AA]/10 rounded-xl">
                <Activity size={20} className="text-[#00D4AA]" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Tablas Activas</p>
                <p className="text-white text-xl font-bold">
                  {Object.values(kpis).filter((v) => v !== null).length} /{" "}
                  {TABLES.length}
                </p>
              </div>
            </div>
            <div className="bg-[#1A1A2E] rounded-2xl p-5 border border-gray-800 flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-xl">
                <AlertTriangle size={20} className="text-red-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Alertas Urgentes</p>
                <p
                  className={`text-xl font-bold ${
                    urgentAlerts.length > 0 ? "text-red-400" : "text-[#00D4AA]"
                  }`}
                >
                  {urgentAlerts.length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Activity Table */}
        <ActivityTable records={recentActivity} loading={activityLoading} />

        {/* Footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-gray-600 text-xs">
          <div className="w-1.5 h-1.5 rounded-full bg-[#6C63FF]" />
          <span>Sistema T · Dashboard v1.0</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]" />
        </div>
      </div>
    </div>
  );
}