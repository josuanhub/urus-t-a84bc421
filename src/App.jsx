import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import ImportarDatos from "./pages/ImportarDatos";
import Configuracion from "./pages/Configuracion";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/importar-datos", label: "Importar Datos", icon: Upload },
  { path: "/configuracion", label: "Configuración", icon: Settings },
];

function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo / Header */}
      <div
        className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6C63FF, #00D4AA)" }}>
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-white font-semibold text-base tracking-wide">
              Sistema t
            </span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6C63FF, #00D4AA)" }}>
            <span className="text-white font-bold text-sm">T</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => handleNav(path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              } ${collapsed ? "justify-center" : ""}`}
              style={
                isActive
                  ? {
                      background:
                        "linear-gradient(135deg, rgba(108,99,255,0.25), rgba(0,212,170,0.15))",
                      boxShadow: "inset 0 0 0 1px rgba(108,99,255,0.4)",
                    }
                  : {}
              }
              title={collapsed ? label : undefined}
            >
              <Icon
                size={18}
                className={`flex-shrink-0 transition-colors duration-200 ${
                  isActive ? "text-[#6C63FF]" : "text-white/40 group-hover:text-white/70"
                }`}
              />
              {!collapsed && (
                <span className="truncate">{label}</span>
              )}
              {isActive && !collapsed && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: "#00D4AA" }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10">
        {!collapsed ? (
          <div className="px-3 py-2 rounded-xl bg-white/5">
            <p className="text-white/30 text-xs">API conectada</p>
            <p className="text-[#00D4AA] text-xs font-medium mt-0.5 truncate">
              urusverify.com
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: "#00D4AA" }}
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 h-full z-50 lg:hidden transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "260px", backgroundColor: "#1A1A2E", borderRight: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setMobileOpen(false)}
            className="text-white/50 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex flex-col flex-shrink-0 h-full transition-all duration-300 ease-in-out`}
        style={{
          width: collapsed ? "72px" : "240px",
          backgroundColor: "#1A1A2E",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <SidebarContent />
      </div>
    </>
  );
}

function TopBar({ setMobileOpen }) {
  const location = useLocation();

  const currentItem = NAV_ITEMS.find((item) => item.pathname === location.pathname) ||
    NAV_ITEMS.find((item) => location.pathname.startsWith(item.path));

  return (
    <header
      className="flex items-center gap-4 px-4 sm:px-6 py-4 border-b border-white/10 flex-shrink-0"
      style={{ backgroundColor: "rgba(26,26,46,0.5)", backdropFilter: "blur(12px)" }}
    >
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden text-white/50 hover:text-white transition-colors"
      >
        <Menu size={22} />
      </button>
      <div className="flex-1">
        <h1 className="text-white font-semibold text-lg">
          {currentItem?.label || "Sistema t"}
        </h1>
        <p className="text-white/30 text-xs mt-0.5">
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: "#00D4AA" }}
        />
        <span className="text-white/30 text-xs hidden sm:block">En línea</span>
      </div>
    </header>
  );
}

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ backgroundColor: "#0A0A0F", fontFamily: "'Inter', sans-serif" }}
    >
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar setMobileOpen={setMobileOpen} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 min-h-full">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/importar-datos" element={<ImportarDatos />} />
              <Route path="/configuracion" element={<Configuracion />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}