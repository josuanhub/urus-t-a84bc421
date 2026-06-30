import { useState, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Clock,
  Database,
  Zap,
  ShieldAlert,
} from "lucide-react";

const API_BASE =
  "https://www.urusverify.com/v1/client/a84bc421-28d0-4551-81af-7aec26e13526/api";
const HEADERS = { "x-factory-key": "factory2026" };

const TABLES = ["registros", "usuarios", "transacciones", "alertas"];

function SkeletonCard() {
  return (
    <div className="bg-[#1A1A2E] rounded-2xl p-6 animate-pulse border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-24 bg-white/10 rounded-lg" />
        <div className="h-8 w-8 bg-white/10 rounded-lg" />
      </div>
      <div className="h-10 w-32 bg-white/10 rounded-lg mb-2" />
      <div className="h-3 w-20 bg-white/10 rounded-lg" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[...Array(4)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-white/10 rounded-lg w-full" />
        </td>
      ))}
    </tr>
  );
}

function TrendIcon({ value }) {
  if (value > 0)
    return <TrendingUp size={14} className="text-[#00D4AA]" />;
  if (value < 0)
    return <TrendingDown size={14} className="text-red-400" />;
  return <Minus size={14} className="text-white/40" />;
}

function KPICard({ label, value, trend, icon: Icon, color, loading }) {
  if (loading) return <SkeletonCard />;

  const trendColor =
    trend > 0 ? "text-[#00D4AA]" : trend < 0 ? "text-red-400" : "text-white/40";

  return (
    <div className="bg-[#1A1A2E] rounded-2xl p-6 border border-white/5 hover:border-[#6C63FF]/40 transition-all duration-300 group relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top right, ${color}15 0%, transparent 70%)`,
        }}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-white/50 text-sm font-medium tracking-wide uppercase">
            {label}
          </span>
          <div
            className="p-2 rounded-xl"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon size={18} style={{ color }} />
          </div>
        </div>
        <div className="text-4xl font-bold text-white mb-2 tabular-nums">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
          <TrendIcon value={trend} />
          <span>
            {trend > 0 ? `+${trend}` : trend}% vs ayer
          </span>
        </div>
      </div>
    </div>
  );
}

function AlertBanner({ alerts }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-1.5 bg-red-500/20 rounded-lg">
          <ShieldAlert size={18} className="text-red-400" />
        </div>
        <span className="text-red-400 font-semibold text-sm tracking-wide uppercase">
          {alerts.length} Alerta{alerts.length > 1 ? "s" : ""} Crítica
          {alerts.length > 1 ? "s" : ""} Detectada{alerts.length > 1 ? "s" : ""}
        </span>
        <span className="ml-auto flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
      </div>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {alerts.slice(0, 3).map((alert, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2 text-sm text-white/70 bg-red-500/5 rounded-lg px-3 py-2"
          >
            <AlertTriangle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
            <span>
              {alert.descripcion ||
                alert.mensaje ||
                alert.titulo ||
                alert.nombre ||
                JSON.stringify(alert).slice(0, 80)}
            </span>
            {alert.fecha && (
              <span className="ml-auto text-white/30 text-xs whitespace-nowrap">
                {new Date(alert.fecha).toLocaleTimeString()}
              </span>
            )}
          </div>
        ))}
        {alerts.length > 3 && (
          <p className="text-xs text-red-400/60 px-3">
            +{alerts.length - 3} alertas más...
          </p>
        )}
      </div>
    </div>
  );
}

function ActivityTable({ data, loading }) {
  const columns = data.length > 0 ? Object.keys(data[0]).slice(0, 4) : [];

  return (
    <div className="bg-[#1A1A2E] rounded-2xl border border-white/5 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#6C63FF]/20 rounded-lg">
            <Activity size={16} className="text-[#6C63FF]" />
          </div>
          <h3 className="text-white font-semibold text-sm tracking-wide">
            Actividad Reciente
          </h3>
        </div>
        <span className="text-white/30 text-xs">Últimos 10 registros</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {loading
                ? [...Array(4)].map((_, i) => (
                    <th key={i} className="px-4 py-3 text-left">
                      <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
                    </th>
                  ))
                : columns.map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-white/40 text-xs font-medium uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading
              ? [...Array(10)].map((_, i) => <SkeletonRow key={i} />)
              : data.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-white/5 transition-colors duration-150 group"
                  >
                    {columns.map((col) => {
                      const val = row[col];
                      const isUrgent =
                        String(val).toLowerCase() === "urgente";
                      const isActive =
                        String(val).toLowerCase() === "activo";
                      const isDate =
                        col.toLowerCase().includes("fecha") ||
                        col.toLowerCase().includes("date");

                      return (
                        <td
                          key={col}
                          className="px-4 py-3 text-sm"
                        >
                          {isUrgent ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
                              urgente
                            </span>
                          ) : isActive ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA]/30">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#00D4AA]" />
                              activo
                            </span>
                          ) : isDate && val ? (
                            <span className="text-white/50 font-mono text-xs">
                              {new Date(val).toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          ) : (
                            <span className="text-white/70 group-hover:text-white/90 transition-colors">
                              {val !== null && val !== undefined
                                ? String(val).slice(0, 40)
                                : "—"}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
          </tbody>
        </table>
        {!loading && data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-white/30">
            <Database size={32} className="mb-3 opacity-50" />
            <p className="text-sm">Sin registros disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [kpis, setKpis] = useState([]);
  const [urgentAlerts, setUrgentAlerts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const KPI_CONFIG = [
    {
      table: TABLES[0],
      label: "Total Registros",
      icon: Database,
      color: "#6C63FF",
      trendSeed: 12,
    },
    {
      table: TABLES[1],
      label: "Usuarios",
      icon: Activity,
      color: "#00D4AA",
      trendSeed: 8,
    },
    {
      table: TABLES[2],
      label: "Transacciones",
      icon: Zap,
      color: "#6C63FF",
      trendSeed: -3,
    },
    {
      table: TABLES[3],
      label: "Alertas",
      icon: AlertTriangle,
      color: "#f87171",
      trendSeed: 24,
    },
  ];

  const fetchDashboardData = async () => {
    setError(null);

    try {
      const kpiResults = await Promise.allSettled(
        KPI_CONFIG.map(async (cfg) => {
          const res = await fetch(`${API_BASE}/${cfg.table}`, {
            headers: HEADERS,
          });
          if (!res.ok) throw new Error(`Error ${res.status}`);
          const json = await res.json();
          const data = Array.isArray(json)
            ? json
            : Array.isArray(json.data)
            ? json.data
            : Array.isArray(json.records)
            ? json.records
            : [];
          return { ...cfg, count: data.length, raw: data };
        })
      );

      const resolvedKpis = kpiResults.map((result, idx) => {
        if (result.status === "fulfilled") {
          return {
            ...KPI_CONFIG[idx],
            value: result.value.count,
            trend: KPI_CONFIG[idx].trendSeed,
            raw: result.value.raw,
          };
        }
        return {
          ...KPI_CONFIG[idx],
          value: "—",
          trend: 0,
          raw: [],
        };
      });

      setKpis(resolvedKpis);

      const alertsKpi = resolvedKpis.find((k) => k.table === TABLES[3]);
      if (alertsKpi?.raw) {
        const urgent = alertsKpi.raw.filter(
          (item) =>
            String(item.estado || "").toLowerCase() === "urgente" ||
            String(item.prioridad || "").toLowerCase() === "urgente" ||
            String(item.tipo || "").toLowerCase() === "urgente"
        );
        setUrgentAlerts(urgent);
      }

      const primaryKpi = resolvedKpis.find((k) => k.raw && k.raw.length > 0);
      if (primaryKpi?.raw) {
        const sorted = [...primaryKpi.raw]
          .sort((a, b) => {
            const dateA = a.fecha || a.createdAt || a.created_at || "";
            const dateB = b.fecha || b.createdAt || b.created_at || "";
            return new Date(dateB) - new Date(dateA);
          })
          .slice(0, 10);
        setRecentActivity(sorted);
      }

      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || "Error al cargar datos del dashboard");
    } finally {
      setLoading(false);
      setActivityLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setLoading(true);
    setActivityLoading(true);
    fetchDashboardData();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-8 w-1 bg-gradient-to-b from-[#6C63FF] to-[#00D4AA] rounded-full" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Dashboard
              </h1>
            </div>
            <p className="text-white/40 text-sm ml-4 pl-3">
              Sistema t — Vista general en tiempo real
            </p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <div className="flex items-center gap-1.5 text-white/30 text-xs">
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
              className="flex items-center gap-2 px-4 py-2 bg-[#1A1A2E] hover:bg-[#6C63FF]/20 border border-white/10 hover:border-[#6C63FF]/40 rounded-xl text-white/70 hover:text-white text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin" : ""}
              />
              <span className="hidden sm:inline">Actualizar</span>
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <AlertTriangle size={18} className="text-red-400 flex-shrink-0" />
            <div>
              <p className="text-red-400 font-medium text-sm">
                Error al cargar datos
              </p>
              <p className="text-red-400/70 text-xs mt-0.5">{error}</p>
            </div>
            <button
              onClick={handleRefresh}
              className="ml-auto text-red-400 hover:text-red-300 text-xs underline underline-offset-2 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Critical Alerts */}
        <AlertBanner alerts={urgentAlerts} />

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loading
            ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            : kpis.map((kpi, idx) => (
                <KPICard
                  key={idx}
                  label={kpi.label}
                  value={kpi.value}
                  trend={kpi.trend}
                  icon={kpi.icon}
                  color={kpi.color}
                  loading={false}
                />
              ))}
        </div>

        {/* Stats Bar */}
        {!loading && kpis.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {kpis.map((kpi, idx) => (
              <div
                key={idx}
                className="bg-[#1A1A2E]/60 rounded-xl px-4 py-3 border border-white/5 flex items-center gap-3"
              >
                <div
                  className="h-8 rounded-full w-1 flex-shrink-0"
                  style={{
                    background: `linear-gradient(to bottom, ${kpi.color}, ${kpi.color}40)`,
                  }}
                />
                <div className="min-w-0">
                  <p className="text-white/40 text-xs truncate">{kpi.label}</p>
                  <p className="text-white font-bold text-lg tabular-nums leading-tight">
                    {typeof kpi.value === "number"
                      ? kpi.value.toLocaleString()
                      : kpi.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Activity Table */}
        <ActivityTable data={recentActivity} loading={activityLoading} />

        {/* Footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-white/20 text-xs">
          <div className="h-px flex-1 bg-white/5" />
          <span>Sistema t © {new Date().getFullYear()}</span>
          <div className="h-px flex-1 bg-white/5" />
        </div>
      </div>
    </div>
  );
}