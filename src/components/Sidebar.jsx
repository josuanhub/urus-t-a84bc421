import { Link, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";

const NAV_ITEMS = [];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();

  return (
    <aside
      style={{ backgroundColor: "#0A0A0F", borderColor: "#1A1A2E" }}
      className={`
        relative flex flex-col h-screen border-r transition-all duration-300 ease-in-out
        ${collapsed ? "w-16" : "w-64"}
      `}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        style={{ backgroundColor: "#1A1A2E", color: "#6C63FF" }}
        className="absolute -right-3 top-6 z-10 rounded-full p-1 shadow-lg hover:scale-110 transition-transform duration-200"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight size={14} />
        ) : (
          <ChevronLeft size={14} />
        )}
      </button>

      {/* Logo */}
      <div
        style={{ borderColor: "#1A1A2E" }}
        className="flex items-center gap-3 px-4 py-5 border-b overflow-hidden"
      >
        <div
          style={{ backgroundColor: "#6C63FF" }}
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
        >
          <Zap size={16} color="#fff" />
        </div>
        <span
          style={{ color: "#00D4AA" }}
          className={`font-bold text-lg tracking-wide whitespace-nowrap transition-all duration-300 ${
            collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
          }`}
        >
          Sistema t
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 space-y-1">
        {NAV_ITEMS.length === 0 && (
          <p
            className={`text-xs text-center transition-all duration-300 ${
              collapsed ? "opacity-0" : "opacity-50"
            }`}
            style={{ color: "#6C63FF" }}
          >
            Sin secciones
          </p>
        )}

        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              style={{
                backgroundColor: isActive ? "#6C63FF22" : "transparent",
                color: isActive ? "#6C63FF" : "#a0aec0",
                borderLeft: isActive
                  ? "3px solid #6C63FF"
                  : "3px solid transparent",
              }}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg
                transition-all duration-200 ease-in-out
                hover:bg-opacity-10 group
                ${collapsed ? "justify-center" : ""}
              `}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "#1A1A2E";
                  e.currentTarget.style.color = "#00D4AA";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#a0aec0";
                }
              }}
            >
              <Icon
                size={18}
                className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
              />
              <span
                className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Company Name Footer */}
      <div
        style={{ borderColor: "#1A1A2E" }}
        className="border-t px-4 py-4 overflow-hidden"
      >
        <div className="flex items-center gap-3">
          <div
            style={{ backgroundColor: "#1A1A2E", borderColor: "#6C63FF33" }}
            className="flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center"
          >
            <span style={{ color: "#00D4AA" }} className="text-xs font-bold">
              t
            </span>
          </div>
          <div
            className={`flex flex-col transition-all duration-300 ${
              collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
            }`}
          >
            <span className="text-xs font-semibold text-white whitespace-nowrap">
              t
            </span>
            <span className="text-xs whitespace-nowrap" style={{ color: "#6C63FF" }}>
              Empresa
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}