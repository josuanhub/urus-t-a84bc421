import { Link, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Building2,
} from "lucide-react";

const navItems = [];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();

  return (
    <aside
      style={{ backgroundColor: "#0A0A0F", borderRightColor: "#1A1A2E" }}
      className={`
        relative flex flex-col border-r transition-all duration-300 ease-in-out
        ${collapsed ? "w-16" : "w-64"}
        min-h-screen
      `}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        style={{ backgroundColor: "#1A1A2E", color: "#6C63FF" }}
        className="
          absolute -right-3 top-6 z-10
          flex items-center justify-center
          w-6 h-6 rounded-full
          border border-[#6C63FF]/30
          hover:bg-[#6C63FF] hover:text-white
          transition-all duration-200
          shadow-lg
        "
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>

      {/* Logo / Header */}
      <div
        style={{ borderBottomColor: "#1A1A2E" }}
        className="flex items-center gap-3 px-4 py-5 border-b overflow-hidden"
      >
        {/* Logo Icon */}
        <div
          style={{
            background: "linear-gradient(135deg, #6C63FF, #00D4AA)",
          }}
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
        >
          <LayoutDashboard className="w-4 h-4 text-white" />
        </div>

        {/* Logo Text */}
        <span
          className={`
            font-bold text-base tracking-wide whitespace-nowrap
            transition-all duration-300 ease-in-out
            ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}
          `}
          style={{
            background: "linear-gradient(90deg, #6C63FF, #00D4AA)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Sistema t
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.length === 0 ? (
          <div
            className={`
              transition-all duration-300
              ${collapsed ? "opacity-0" : "opacity-100"}
            `}
          >
            <p className="text-xs text-center px-2 py-4" style={{ color: "#6C63FF" + "60" }}>
              Sin elementos de navegación
            </p>
          </div>
        ) : (
          navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-all duration-200 ease-in-out
                  overflow-hidden whitespace-nowrap
                  ${
                    isActive
                      ? "shadow-md"
                      : "hover:bg-[#1A1A2E]"
                  }
                `}
                style={
                  isActive
                    ? {
                        background:
                          "linear-gradient(90deg, #6C63FF22, #00D4AA11)",
                        borderLeft: "3px solid #6C63FF",
                      }
                    : { borderLeft: "3px solid transparent" }
                }
              >
                {/* Icon */}
                <span className="flex-shrink-0">
                  <Icon
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isActive
                        ? "text-[#6C63FF]"
                        : "text-gray-500 group-hover:text-[#00D4AA]"
                    }`}
                  />
                </span>

                {/* Label */}
                <span
                  className={`
                    text-sm font-medium
                    transition-all duration-300 ease-in-out
                    ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}
                    ${isActive ? "text-white" : "text-gray-400 group-hover:text-white"}
                  `}
                >
                  {item.label}
                </span>
              </Link>
            );
          })
        )}
      </nav>

      {/* Footer — Company Name */}
      <div
        style={{ borderTopColor: "#1A1A2E" }}
        className="border-t px-3 py-4 overflow-hidden"
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            style={{
              background: "linear-gradient(135deg, #1A1A2E, #6C63FF33)",
              border: "1px solid #6C63FF44",
            }}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          >
            <Building2 className="w-4 h-4" style={{ color: "#00D4AA" }} />
          </div>

          {/* Company Info */}
          <div
            className={`
              transition-all duration-300 ease-in-out overflow-hidden
              ${collapsed ? "opacity-0 w-0" : "opacity-100 flex-1"}
            `}
          >
            <p className="text-xs font-semibold text-white whitespace-nowrap truncate">
              t
            </p>
            <p className="text-[10px] whitespace-nowrap" style={{ color: "#6C63FF" }}>
              Sistema t
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}