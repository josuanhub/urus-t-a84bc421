import { Link, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Building2,
} from "lucide-react";

const NAV_ITEMS = [];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 z-40 transition-all duration-300 ease-in-out"
      style={{
        width: collapsed ? "72px" : "240px",
        background: "#0A0A0F",
        borderRight: "1px solid rgba(108,99,255,0.15)",
      }}
    >
      {/* Header / Logo */}
      <div
        className="flex items-center justify-between px-4 py-5"
        style={{ borderBottom: "1px solid rgba(108,99,255,0.12)" }}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Logo icon */}
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-lg w-8 h-8"
            style={{ background: "linear-gradient(135deg,#6C63FF,#00D4AA)" }}
          >
            <Zap size={16} color="#fff" strokeWidth={2.5} />
          </div>

          {/* Brand name */}
          <span
            className="font-bold text-base whitespace-nowrap transition-all duration-300"
            style={{
              color: "#fff",
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : "auto",
              overflow: "hidden",
              letterSpacing: "0.02em",
            }}
          >
            Sistema{" "}
            <span style={{ color: "#6C63FF" }}>t</span>
          </span>
        </div>

        {/* Toggle button */}
        <button
          onClick={onToggle}
          className="flex-shrink-0 flex items-center justify-center rounded-md w-7 h-7 transition-colors duration-200"
          style={{
            background: "rgba(108,99,255,0.1)",
            border: "1px solid rgba(108,99,255,0.25)",
            color: "#6C63FF",
            cursor: "pointer",
          }}
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2">
        {NAV_ITEMS.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-2 mt-8 transition-all duration-300"
            style={{ opacity: collapsed ? 0 : 0.4 }}
          >
            <span
              className="text-xs text-center px-2"
              style={{ color: "#6C63FF" }}
            >
              Sin ítems de navegación
            </span>
          </div>
        ) : (
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/" &&
                  location.pathname.startsWith(item.path));
              const Icon = item.icon;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 group relative"
                    style={{
                      background: isActive
                        ? "linear-gradient(90deg,rgba(108,99,255,0.18),rgba(0,212,170,0.08))"
                        : "transparent",
                      border: isActive
                        ? "1px solid rgba(108,99,255,0.3)"
                        : "1px solid transparent",
                      color: isActive ? "#6C63FF" : "rgba(255,255,255,0.6)",
                      textDecoration: "none",
                    }}
                    title={collapsed ? item.label : undefined}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full"
                        style={{
                          width: "3px",
                          height: "60%",
                          background:
                            "linear-gradient(180deg,#6C63FF,#00D4AA)",
                        }}
                      />
                    )}

                    {/* Icon */}
                    <span className="flex-shrink-0 ml-1">
                      {Icon && (
                        <Icon
                          size={18}
                          strokeWidth={isActive ? 2.2 : 1.8}
                          style={{
                            color: isActive ? "#6C63FF" : "rgba(255,255,255,0.5)",
                            transition: "color 0.2s",
                          }}
                        />
                      )}
                    </span>

                    {/* Label */}
                    <span
                      className="text-sm font-medium whitespace-nowrap transition-all duration-300"
                      style={{
                        opacity: collapsed ? 0 : 1,
                        width: collapsed ? 0 : "auto",
                        overflow: "hidden",
                      }}
                    >
                      {item.label}
                    </span>

                    {/* Tooltip when collapsed */}
                    {collapsed && (
                      <span
                        className="absolute left-full ml-3 px-2 py-1 rounded-md text-xs font-medium pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50"
                        style={{
                          background: "#1A1A2E",
                          color: "#fff",
                          border: "1px solid rgba(108,99,255,0.3)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                        }}
                      >
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>

      {/* Footer / Company name */}
      <div
        className="px-4 py-4 flex items-center gap-3 overflow-hidden"
        style={{ borderTop: "1px solid rgba(108,99,255,0.12)" }}
      >
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-lg w-8 h-8"
          style={{
            background: "rgba(26,26,46,1)",
            border: "1px solid rgba(108,99,255,0.2)",
          }}
        >
          <Building2 size={15} style={{ color: "#00D4AA" }} strokeWidth={1.8} />
        </div>

        <div
          className="flex flex-col transition-all duration-300 overflow-hidden"
          style={{
            opacity: collapsed ? 0 : 1,
            width: collapsed ? 0 : "auto",
          }}
        >
          <span
            className="text-xs font-semibold whitespace-nowrap"
            style={{ color: "#fff" }}
          >
            t
          </span>
          <span
            className="text-xs whitespace-nowrap"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Empresa
          </span>
        </div>
      </div>
    </aside>
  );
}