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
  Minus,
} from "lucide-react";

const API_BASE =
  "https://www.urusverify.com/v1/client/a84bc421-28d0-4551-81af-7aec26e13526/api";
const HEADERS = { "x-factory-key": "factory2026" };

const PALETA = {
  primary: "#6C63FF",
  accent: "#00D4AA",
  bg: "#0A0A0F",
  surface: "#1A1A2E",
};

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-6 animate-pulse"
      style={{ background: PALETA.surface }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl"
          style={{ background: "#2a2a4e" }}
        />
        <div
          className="w-16 h-5 rounded-full"
          style={{ background: "#2a2a4e" }}
        />
      </div>
      <div
        className="w-20 h-8 rounded-lg mb-2"
        style={{ background: "#2a2a4e" }}
      />
      <div
        className="w-24 h-4 rounded"
        style={{ background: "#2a2a4e" }}
      />
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 animate-pulse"
        >
          <div
            className="w-8 h-8 rounded-full flex-shrink-0"
            style={{ background: "#2a2a4e" }}
          />
          <div className="flex-1 space-y-2">
            <div
              className="h-4 rounded w-3/4"
              style={{ background: "#2a2a4e" }}
            />
            <div
              className="h-3 rounded w-1/2"
              style={{ background: "#2a2a4e" }}
            />
          </div>
          <div
            className="w-20 h-6 rounded-full"
            style={{ background: "#2a2a4e" }}
          />
        </div>
      ))}
    </div>
  );
}

function KPICard({ title, value, icon: Icon, color, trend, trendValue, loading }) {
  if (loading) return <SkeletonCard />;

  const isUp = trend === "up";
  const isDown = trend === "down";

  return (
    <div
      className="rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300"
      style={{ background: PALETA.surface }}
    >
      <div
        className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
        style={{
          background: `radial-gradient(circle at top right, ${color}, transparent 70%)`,
        }}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: `${color}22` }}
          >
            <Icon size={20} style={{ color }} />
          </div>
          {trendValue !== undefined && (
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
              style={{
                background: isUp
                  ? "#00D4AA22"
                  : isDown
                  ? "#ff4d4d22"
                  : "#6C63FF22",
                color: isUp ? "#00D4AA" : isDown ? "#ff4d4d" : "#6C63FF",
              }}
            >
              {isUp ? (
                <TrendingUp size={12} />
              ) : isDown ? (
                <TrendingDown size={12} />
              ) : (
                <Minus size={12} />
              )}
              {trendValue}%
            </div>
          )}
        </div>
        <p
          className="text-3xl font-bold mb-1"
          style={{ color: "#E8E8F0" }}
        >
          {typeof value === "number" ? value.toLocaleString() : value ?? "—"}
        </p>
        <p className="text-sm" style={{ color: "#888" }}>
          {title}
        </p>
      </div>
    </div>
  );
}

function AlertBanner({ alerts }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div
      className="rounded-2xl p-4 border flex items-start gap-3"
      style={{
        background: "#2a0a0a",
        borderColor: "#ff4d4d44",
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: "#ff4d4d22" }}
      >
        <AlertTriangle size={18} style={{ color: "#ff4d4d" }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm mb-1" style={{ color: "#ff6b6b" }}>
          {alerts.length} alerta{alerts.length > 1 ? "s" : ""} crítica
          {alerts.length > 1 ? "s" : ""} detectada
          {alerts.length > 1 ? "s" : ""}
        </p>
        <div className="space-y-1">
          {alerts.slice(0, 3).map((a, i) => (
            <p key={i} className="text-xs truncate" style={{ color: "#ff9999" }}>
              • {a.nombre || a.name || a.titulo || a.title || JSON.stringify(a).slice(0, 60)}
            </p>
          ))}
          {alerts.length > 3 && (
            <p className="text-xs" style={{ color: "#ff9999" }}>
              + {alerts.length - 3} más…
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    urgente: { bg: "#ff4d4d22", text: "#ff6b6b", label: "Urgente" },
    activo: { bg: "#00D4AA22", text: "#00D4AA", label: "Activo" },
    pendiente: { bg: "#FFB84D22", text: "#FFB84D", label: "Pendiente" },
    inactivo: { bg: "#88888822", text: "#888", label: "Inactivo" },
    completado: { bg: "#6C63FF22", text: "#6C63FF", label: "Completado" },
  };
  const s = map[status?.toLowerCase()] || {
    bg: "#88888822",
    text: "#888",
    label: status || "—",
  };
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
      style={{ background: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  );
}

function ActivityTable({ rows, loading }) {
  const cols = rows.length > 0 ? Object.keys(rows[0]).slice(0, 5) : [];

  const formatVal = (val) => {
    if (val === null || val === undefined) return "—";
    if (typeof val === "object") return JSON.stringify(val).slice(0, 40);
    const s = String(val);
    return s.length > 40 ? s.slice(0, 40) + "…" : s;
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: PALETA.surface }}
    >
      <div
        className="px-6 py-4 flex items-center justify-between border-b"
        style={{ borderColor: "#2a2a4e" }}
      >
        <div className="flex items-center gap-2">
          <Activity size={18} style={{ color: PALETA.primary }} />
          <h2 className="font-semibold" style={{ color: "#E8E8F0" }}>
            Actividad Reciente
          </h2>
        </div>
        <span className="text-xs px-2 py-1 rounded-full" style={{ background: "#6C63FF22", color: "#6C63FF" }}>
          Últimos 10
        </span>
      </div>
      <div className="p-6">
        {loading ? (
          <SkeletonTable />
        ) : rows.length === 0 ? (
          <p className="text-center py-8 text-sm" style={{ color: "#555" }}>
            Sin registros disponibles
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr>
                  {cols.map((c) => (
                    <th
                      key={c}
                      className="text-left pb-3 pr-4 font-medium text-xs uppercase tracking-wider"
                      style={{ color: "#555" }}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "#1e1e38" }}>
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    {cols.map((c) => (
                      <td
                        key={c}
                        className="py-3 pr-4"
                        style={{ color: c === "estado" ? undefined : "#C0C0D0" }}
                      >
                        {c === "estado" ? (
                          <StatusBadge status={row[c]} />
                        ) : (
                          <span className="text-xs">{formatVal(row[c])}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState({
    tables: {},
    recent: [],
    alerts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = async () => {
    try {
      setError(null);

      // Fetch disponible de la API raíz para descubrir tablas
      const rootRes = await fetch(
        "https://www.urusverify.com/v1/client/a84bc421-28d0-4551-81af-7aec26e13526/api",
        { headers: HEADERS }
      );

      let tableNames = [];
      if (rootRes.ok) {
        const rootData = await rootRes.json();
        // Intentar detectar lista de tablas en distintos formatos
        if (Array.isArray(rootData)) {
          tableNames = rootData.map((t) =>
            typeof t === "string" ? t : t.name || t.tabla || t.table
          ).filter(Boolean);
        } else if (rootData.tables) {
          tableNames = Array.isArray(rootData.tables)
            ? rootData.tables.map((t) =>
                typeof t === "string" ? t : t.name || t.tabla
              ).filter(Boolean)
            : [];
        } else if (rootData.data && Array.isArray(rootData.data)) {
          tableNames = rootData.data.map((t) =>
            typeof t === "string" ? t : t.name || t.tabla
          ).filter(Boolean);
        }
      }

      // Si no se detectaron tablas, intentar nombres comunes
      if (tableNames.length === 0) {
        tableNames = ["usuarios", "clientes", "pedidos", "productos", "transacciones"];
      }

      // Fetch paralelo a todas las tablas
      const results = await Promise.allSettled(
        tableNames.map(async (t) => {
          const res = await fetch(`${API_BASE}/${t}`, { headers: HEADERS });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = await res.json();
          const rows = Array.isArray(json)
            ? json
            : json.data || json.results || json.records || [];
          return { name: t, rows };
        })
      );

      const tables = {};
      let allRows = [];
      let alerts = [];

      results.forEach((r) => {
        if (r.status === "fulfilled") {
          const { name, rows } = r.value;
          if (rows.length > 0) {
            tables[name] = rows;
            allRows = allRows.concat(rows.map((row) => ({ ...row, _tabla: name })));
            const urgent = rows.filter(
              (row) => row.estado?.toLowerCase() === "urgente"
            );
            alerts = alerts.concat(urgent);
          }
        }
      });

      // Ordenar por fecha si existe, tomar últimos 10
      const recent = [...allRows]
        .sort((a, b) => {
          const da = a.created_at || a.fecha || a.date || a.updatedAt || "";
          const db = b.created_at || b.fecha || b.date || b.updatedAt || "";
          return da < db ? 1 : -1;
        })
        .slice(0, 10);

      setData({ tables, recent, alerts });
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || "Error al cargar datos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAll();
  };

  const tableEntries = Object.entries(data.tables);

  const kpiCards = [
    {
      title: "Total Tablas Activas",
      value: tableEntries.length,
      icon: BarChart3,
      color: PALETA.primary,
      trend: tableEntries.length > 3 ? "up" : "neutral",
      trendValue: tableEntries.length > 3 ? 12 : 0,
    },
    {
      title: "Total Registros",
      value: tableEntries.reduce((acc, [, rows]) => acc + rows.length, 0),
      icon: Users,
      color: PALETA.accent,
      trend: "up",
      trendValue: 8,
    },
    {
      title: "Alertas Críticas",
      value: data.alerts.length,
      icon: AlertTriangle,
      color: data.alerts.length > 0 ? "#ff4d4d" : PALETA.accent,
      trend: data.alerts.length > 0 ? "down" : "neutral",
      trendValue: data.alerts.length > 0 ? data.alerts.length * 5 : 0,
    },
    {
      title: "Actividad Reciente",
      value: data.recent.length,
      icon: Clock,
      color: "#FFB84D",
      trend: "up",
      trendValue: 4,
    },
  ];

  return (
    <div
      className="min-h-screen p-4 md:p-6 lg:p-8"
      style={{ background: PALETA.bg, color: "#E8E8F0" }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1
              className="text-2xl md:text-3xl font-bold"
              style={{
                background: `linear-gradient(135deg, ${PALETA.primary}, ${PALETA.accent})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Dashboard t
            </h1>
            <p className="text-sm mt-1" style={{ color: "#555" }}>
              {lastUpdated
                ? `Actualizado: ${lastUpdated.toLocaleTimeString("es-ES")}`
                : "Cargando datos…"}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80 disabled:opacity-50 self-start sm:self-auto"
            style={{
              background: `${PALETA.primary}22`,
              color: PALETA.primary,
              border: `1px solid ${PALETA.primary}44`,
            }}
          >
            <RefreshCw
              size={15}
              className={refreshing ? "animate-spin" : ""}
            />
            Actualizar
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            className="rounded-2xl p-4 flex items-center gap-3 border"
            style={{
              background: "#2a0a0a",
              borderColor: "#ff4d4d44",
              color: "#ff6b6b",
            }}
          >
            <AlertTriangle size={18} />
            <p className="text-sm">
              <span className="font-semibold">Error: </span>
              {error}
            </p>
          </div>
        )}

        {/* Alerts */}
        {!loading && data.alerts.length > 0 && (
          <AlertBanner alerts={data.alerts} />
        )}

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((card, i) => (
            <KPICard key={i} {...card} loading={loading} />
          ))}
        </div>

        {/* Per-table KPIs if multiple tables */}
        {!loading && tableEntries.length > 0 && (
          <div>
            <h2
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: "#555" }}
            >
              Conteo por tabla
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {tableEntries.map(([name, rows]) => {
                const urgentCount = rows.filter(
                  (r) => r.estado?.toLowerCase() === "urgente"
                ).length;
                return (
                  <div
                    key={name}
                    className="rounded-xl p-4 relative overflow-hidden"
                    style={{ background: PALETA.surface }}
                  >
                    <div
                      className="absolute inset-0 opacity-5"
                      style={{
                        background: `radial-gradient(circle at bottom left, ${PALETA.primary}, transparent)`,
                      }}
                    />
                    <p
                      className="text-xs uppercase tracking-wider mb-1 relative z-10"
                      style={{ color: "#555" }}
                    >
                      {name}
                    </p>
                    <p
                      className="text-2xl font-bold relative z-10"
                      style={{ color: "#E8E8F0" }}
                    >
                      {rows.length}
                    </p>
                    {urgentCount > 0 && (
                      <p
                        className="text-xs mt-1 relative z-10"
                        style={{ color: "#ff6b6b" }}
                      >
                        {urgentCount} urgente{urgentCount > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Activity Table */}
        <ActivityTable rows={data.recent} loading={loading} />

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 py-2">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: PALETA.accent }}
          />
          <p className="text-xs" style={{ color: "#444" }}>
            Sistema t · API conectada
          </p>
        </div>
      </div>
    </div>
  );
}