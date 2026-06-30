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
        backgroundColor: "#0A0A0F",
        borderRight: "1px solid rgba(108,99,255,0.15)",
      }}
    >
      {/* Header / Logo */}
      <div
        className="flex items-center justify-between px-4 py-5"
        style={{ borderBottom: "1px solid rgba(108,99,255,0.12)" }}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)",
            }}
          >
            <Zap size={16} className="text-white" />
          </div>
          <span
            className="font-bold text-base whitespace-nowrap transition-all duration-300"
            style={{
              color: "#ffffff",
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : "auto",
              overflow: "hidden",
            }}
          >
            Sistema{" "}
            <span style={{ color: "#6C63FF" }}>t</span>
          </span>
        </div>

        {/* Toggle button */}
        <button
          onClick={onToggle}
          className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200"
          style={{
            backgroundColor: "rgba(108,99,255,0.12)",
            color: "#6C63FF",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(108,99,255,0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(108,99,255,0.12)";
          }}
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-1">
        {NAV_ITEMS.length === 0 && (
          <div
            className="text-center py-8 transition-all duration-300"
            style={{
              opacity: collapsed ? 0 : 0.4,
              color: "#ffffff",
              fontSize: "12px",
            }}
          >
            {!collapsed && "Sin elementos"}
          </div>
        )}

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 group relative"
              style={{
                backgroundColor: isActive
                  ? "rgba(108,99,255,0.18)"
                  : "transparent",
                color: isActive ? "#6C63FF" : "rgba(255,255,255,0.6)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor =
                    "rgba(108,99,255,0.08)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                }
              }}
            >
              {/* Active indicator */}
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                  style={{ backgroundColor: "#6C63FF" }}
                />
              )}

              <Icon
                size={18}
                className="flex-shrink-0"
                style={{ color: isActive ? "#6C63FF" : "inherit" }}
              />

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
                    backgroundColor: "#1A1A2E",
                    color: "#ffffff",
                    border: "1px solid rgba(108,99,255,0.3)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                  }}
                >
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Company name */}
      <div
        className="px-4 py-4 flex items-center gap-3"
        style={{ borderTop: "1px solid rgba(108,99,255,0.12)" }}
      >
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: "rgba(0,212,170,0.12)",
            border: "1px solid rgba(0,212,170,0.25)",
          }}
        >
          <Building2 size={14} style={{ color: "#00D4AA" }} />
        </div>
        <div
          className="overflow-hidden transition-all duration-300"
          style={{
            opacity: collapsed ? 0 : 1,
            width: collapsed ? 0 : "auto",
          }}
        >
          <p
            className="text-xs font-semibold whitespace-nowrap"
            style={{ color: "#ffffff" }}
          >
            t
          </p>
          <p
            className="text-xs whitespace-nowrap"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Sistema t
          </p>
        </div>
      </div>
    </aside>
  );
}