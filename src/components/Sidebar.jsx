import { Link, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Building2,
} from "lucide-react";

const navItems = [];

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
            className="flex-shrink-0 flex items-center justify-center rounded-xl"
            style={{
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)",
              boxShadow: "0 0 16px rgba(108,99,255,0.45)",
            }}
          >
            <Zap size={18} color="#fff" strokeWidth={2.5} />
          </div>

          {/* Logo text */}
          <span
            className="font-bold text-base whitespace-nowrap transition-all duration-300 overflow-hidden"
            style={{
              color: "#ffffff",
              maxWidth: collapsed ? "0px" : "160px",
              opacity: collapsed ? 0 : 1,
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
          className="flex-shrink-0 flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            width: "28px",
            height: "28px",
            background: "rgba(108,99,255,0.12)",
            border: "1px solid rgba(108,99,255,0.25)",
            color: "#6C63FF",
            cursor: "pointer",
          }}
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {collapsed ? (
            <ChevronRight size={14} strokeWidth={2.5} />
          ) : (
            <ChevronLeft size={14} strokeWidth={2.5} />
          )}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 flex flex-col gap-1">
        {navItems.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-8 gap-2"
            style={{ opacity: 0.35 }}
          >
            {!collapsed && (
              <span
                className="text-xs text-center"
                style={{ color: "#6C63FF" }}
              >
                Sin secciones configuradas
              </span>
            )}
          </div>
        )}

        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 group relative overflow-hidden"
              style={{
                background: isActive
                  ? "linear-gradient(135deg, rgba(108,99,255,0.22) 0%, rgba(0,212,170,0.10) 100%)"
                  : "transparent",
                border: isActive
                  ? "1px solid rgba(108,99,255,0.35)"
                  : "1px solid transparent",
                color: isActive ? "#ffffff" : "rgba(255,255,255,0.55)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background =
                    "rgba(108,99,255,0.08)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                }
              }}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
                  style={{
                    width: "3px",
                    height: "60%",
                    background:
                      "linear-gradient(180deg, #6C63FF 0%, #00D4AA 100%)",
                    boxShadow: "0 0 8px rgba(108,99,255,0.6)",
                  }}
                />
              )}

              {/* Icon */}
              <span className="flex-shrink-0 flex items-center justify-center">
                {Icon && (
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    style={{
                      color: isActive ? "#6C63FF" : "inherit",
                      filter: isActive
                        ? "drop-shadow(0 0 6px rgba(108,99,255,0.7))"
                        : "none",
                      transition: "all 0.2s",
                    }}
                  />
                )}
              </span>

              {/* Label */}
              <span
                className="text-sm font-medium whitespace-nowrap transition-all duration-300 overflow-hidden"
                style={{
                  maxWidth: collapsed ? "0px" : "160px",
                  opacity: collapsed ? 0 : 1,
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Company name */}
      <div
        className="px-4 py-4 flex items-center gap-3 overflow-hidden"
        style={{ borderTop: "1px solid rgba(108,99,255,0.12)" }}
      >
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-lg"
          style={{
            width: "32px",
            height: "32px",
            background: "rgba(26,26,46,0.8)",
            border: "1px solid rgba(108,99,255,0.2)",
          }}
        >
          <Building2 size={15} style={{ color: "#00D4AA" }} strokeWidth={1.8} />
        </div>

        <div
          className="overflow-hidden transition-all duration-300 flex flex-col justify-center"
          style={{
            maxWidth: collapsed ? "0px" : "160px",
            opacity: collapsed ? 0 : 1,
          }}
        >
          <span
            className="text-xs font-semibold whitespace-nowrap"
            style={{ color: "rgba(255,255,255,0.85)", letterSpacing: "0.03em" }}
          >
            t
          </span>
          <span
            className="text-xs whitespace-nowrap"
            style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px" }}
          >
            Sistema t
          </span>
        </div>
      </div>
    </aside>
  );
}