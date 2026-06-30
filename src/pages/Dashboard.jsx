import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Activity,
  Users,
  Database,
  Clock,
  RefreshCw,
  ChevronRight,
  Zap,
} from "lucide-react";

const API_BASE = "https://www.urusverify.com/v1/client/a84bc421-28d0-4551-81af-7aec26e13526/api";
const HEADERS = { "x-factory-key": "factory2026" };

const TABLES = ["usuarios", "transacciones", "pedidos", "productos"];

function SkeletonCard() {
  return (
    <div className="bg-[#1A1A2E] rounded-2xl p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 bg-[#2a2a4a] rounded-xl" />
        <div className="w-16 h-5 bg-[#2a2a4a] rounded-full" />
      </div>
      <div className="w-20 h-8 bg-[#2a2a4a] rounded mb-2" />
      <div className="w-28 h-4 bg-[#2a2a4a] rounded" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-[#2a2a4a] animate-pulse">
      {[...Array(4)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-[#2a2a4a] rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

function KPICard({ title, value, trend, trendValue, icon: Icon, color, loading }) {
  if (loading) return <SkeletonCard />;

  const isPositive = trend === "up";
  const colorMap = {
    purple: { bg: "bg-[#6C63FF]/10", text: "text-[#6C63FF]", border: "border-[#6C63FF]/20" },
    teal: { bg: "bg-[#00D4AA]/10", text: "text-[#00D4AA]", border: "border-[#00D4AA]/20" },
    orange: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
    blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  };
  const c = colorMap[color] || colorMap.purple;

  return (
    <div className={`bg-[#1A1A2E] border ${c.border} rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 cursor-default`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`w-11 h-11 ${c.bg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${c.text}`} />
        </div>
        <span
          className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            isPositive
              ? "bg-[#00D4AA]/10 text-[#00D4AA]"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {trendValue}
        </span>
      </div>
      <p className="text-3xl font-bold text-white mb-1">
        {value?.toLocaleString() ?? "—"}
      </p>
      <p className="text-sm text-gray-400 font-medium">{title}</p>
    </div>
  );
}

function AlertBanner({ alerts }) {
  if (!alerts || alerts.length === 0) return null;
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-red-400 font-semibold text-sm mb-1">
          {alerts.length} alerta{alerts.length > 1 ? "s" : ""} crítica{alerts.length > 1 ? "s" : ""} detectada{alerts.length > 1 ? "s" : ""}
        </p>
        <ul className="space-y-1">
          {alerts.slice(0, 3).map((a, i) => (
            <li key={i} className="text-red-300/80 text-xs">
              • {a.nombre || a.descripcion || a.id || JSON.stringify(a)}
            </li>
          ))}
          {alerts.length > 3 && (
            <li className="text-red-300/60 text-xs">
              +{alerts.length - 3} más...
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    urgente: "bg-red-500/20 text-red-400 border border-red-500/30",
    activo: "bg-[#00D4AA]/10 text-[#00D4AA] border border-[#00D4AA]/20",
    pendiente: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    completado: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    inactivo: "bg-gray-500/10 text-gray-400 border border-gray-500/20",
  };
  const cls = map[status?.toLowerCase()] || "bg-gray-500/10 text-gray-400 border border-gray-500/20";
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>
      {status || "—"}
    </span>
  );
}

export default function Dashboard() {
  const [kpis, setKpis] = useState({ usuarios: 0, transacciones: 0, pedidos: 0, productos: 0 });
  const [alerts, setAlerts] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = async () => {
    setError(null);
    try {
      // KPIs: fetch all tables in parallel
      const results = await Promise.allSettled(
        TABLES.map((t) =>
          fetch(`${API_BASE}/${t}`, { headers: HEADERS }).then((r) => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.json();
          })
        )
      );

      const counts = {};
      let allAlerts = [];
      let allRecent = [];

      results.forEach((res, i) => {
        const table = TABLES[i];
        if (res.status === "fulfilled") {
          const data = Array.isArray(res.value)
            ? res.value
            : res.value?.data ?? res.value?.results ?? [];
          counts[table] = data.length;

          // Collect urgent alerts
          const urgente = data.filter(
            (r) => r.estado?.toLowerCase() === "urgente"
          );
          allAlerts.push(...urgente.map((a) => ({ ...a, _table: table })));

          // Collect recent activity
          allRecent.push(
            ...data.map((r) => ({ ...r, _table: table }))
          );
        } else {
          counts[table] = 0;
        }
      });

      setKpis(counts);
      setAlerts(allAlerts);

      // Sort by id desc or created_at desc, take 10
      allRecent.sort((a, b) => {
        const dateA = new Date(a.created_at || a.fecha || 0);
        const dateB = new Date(b.created_at || b.fecha || 0);
        if (dateB - dateA !== 0) return dateB - dateA;
        return (b.id || 0) - (a.id || 0);
      });
      setRecent(allRecent.slice(0, 10));
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || "Error desconocido al cargar datos.");
    } finally {
      setLoading(false);
      setLoadingRecent(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setLoading(true);
    setLoadingRecent(true);
    fetchAll();
  };

  const kpiConfig = [
    {
      key: "usuarios",
      title: "Total Usuarios",
      icon: Users,
      color: "purple",
      trend: "up",
      trendValue: "+12%",
    },
    {
      key: "transacciones",
      title: "Transacciones",
      icon: Zap,
      color: "teal",
      trend: "up",
      trendValue: "+8%",
    },
    {
      key: "pedidos",
      title: "Pedidos Activos",
      icon: Activity,
      color: "orange",
      trend: "down",
      trendValue: "-3%",
    },
    {
      key: "productos",
      title: "Productos",
      icon: Database,
      color: "blue",
      trend: "up",
      trendValue: "+5%",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse" />
              <span className="text-[#00D4AA] text-xs font-semibold tracking-widest uppercase">
                Sistema t
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">
              Vista general del sistema en tiempo real
            </p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-gray-500 text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-[#1A1A2E] border border-[#6C63FF]/30 text-[#6C63FF] rounded-xl text-sm font-semibold hover:bg-[#6C63FF]/10 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              Actualizar
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm font-medium">
              Error al cargar datos: {error}
            </p>
            <button
              onClick={handleRefresh}
              className="ml-auto text-red-400 hover:text-red-300 text-xs underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpiConfig.map((cfg) => (
            <KPICard
              key={cfg.key}
              title={cfg.title}
              value={kpis[cfg.key]}
              trend={cfg.trend}
              trendValue={cfg.trendValue}
              icon={cfg.icon}
              color={cfg.color}
              loading={loading}
            />
          ))}
        </div>

        {/* Alerts */}
        {!loading && alerts.length > 0 && (
          <div className="mb-6">
            <AlertBanner alerts={alerts} />
          </div>
        )}

        {/* Recent Activity Table */}
        <div className="bg-[#1A1A2E] border border-[#2a2a4a] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a4a]">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#6C63FF]" />
              <h2 className="text-white font-semibold">Actividad Reciente</h2>
              <span className="text-xs text-gray-500 bg-[#0A0A0F] px-2 py-0.5 rounded-full">
                Últimos 10 registros
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a4a]">
                  {["ID", "Tabla", "Descripción", "Estado"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loadingRecent ? (
                  [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                ) : recent.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-gray-500 text-sm">
                      No hay registros disponibles
                    </td>
                  </tr>
                ) : (
                  recent.map((row, idx) => {
                    const description =
                      row.nombre ||
                      row.descripcion ||
                      row.titulo ||
                      row.name ||
                      row.title ||
                      row.concepto ||
                      "—";
                    return (
                      <tr
                        key={idx}
                        className="border-b border-[#2a2a4a]/50 hover:bg-[#6C63FF]/5 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-300 font-mono">
                          #{row.id || idx + 1}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-semibold px-2 py-0.5 bg-[#6C63FF]/10 text-[#6C63FF] rounded-full border border-[#6C63FF]/20">
                            {row._table}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-300 max-w-xs truncate">
                          {description}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={row.estado} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!loadingRecent && recent.length > 0 && (
            <div className="px-6 py-3 border-t border-[#2a2a4a] flex justify-between items-center">
              <span className="text-xs text-gray-500">
                Mostrando {recent.length} registros de múltiples tablas
              </span>
              <span className="text-xs text-[#6C63FF] font-medium cursor-pointer hover:underline flex items-center gap-1">
                Ver todo <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-600">
          Sistema t — Dashboard v1.0 · Datos en vivo desde API
        </div>
      </div>
    </div>
  );
}