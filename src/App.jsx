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
  Zap,
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
      {/* Logo / Brand */}
      <div
        className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #6C63FF, #00D4AA)" }}>
          <Zap size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <span className="text-white font-bold text-lg tracking-tight">Sistema t</span>
            <span className="block text-xs text-white/40 leading-none">t platform</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => handleNav(path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                active
                  ? "text-white shadow-lg"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              } ${collapsed ? "justify-center" : ""}`}
              style={
                active
                  ? {
                      background:
                        "linear-gradient(135deg, rgba(108,99,255,0.25), rgba(0,212,170,0.15))",
                      borderLeft: "3px solid #6C63FF",
                    }
                  : {}
              }
              title={collapsed ? label : undefined}
            >
              <Icon
                size={20}
                className={`flex-shrink-0 transition-colors ${
                  active ? "text-[#6C63FF]" : "group-hover:text-[#6C63FF]"
                }`}
              />
              {!collapsed && (
                <span className="text-sm font-medium truncate">{label}</span>
              )}
              {active && !collapsed && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "#00D4AA" }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle (desktop) */}
      <div className="px-3 py-4 border-t border-white/10 hidden md:block">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all duration-200 text-sm ${
            collapsed ? "justify-center" : ""
          }`}
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <>
              <ChevronLeft size={18} />
              <span>Colapsar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col flex-shrink-0 h-full transition-all duration-300 ease-in-out border-r border-white/10`}
        style={{
          width: collapsed ? "72px" : "240px",
          background: "#1A1A2E",
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 flex flex-col transition-transform duration-300 ease-in-out md:hidden border-r border-white/10 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "#1A1A2E" }}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        <SidebarContent />
      </aside>
    </>
  );
}

function TopBar({ setMobileOpen }) {
  const location = useLocation();
  const current = NAV_ITEMS.find((n) => n.path === location.pathname);

  return (
    <header
      className="flex-shrink-0 flex items-center gap-4 px-4 md:px-6 py-4 border-b border-white/10"
      style={{ background: "#0A0A0F" }}
    >
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden text-white/50 hover:text-white transition-colors"
      >
        <Menu size={22} />
      </button>
      <div className="flex items-center gap-2">
        {current && (
          <>
            <current.icon size={18} className="text-[#6C63FF]" />
            <h1 className="text-white font-semibold text-base md:text-lg">
              {current.label}
            </h1>
          </>
        )}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <span
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
          style={{ background: "rgba(0,212,170,0.1)", color: "#00D4AA" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
          Sistema activo
        </span>
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
      style={{ background: "#0A0A0F", fontFamily: "'Inter', sans-serif" }}
    >
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <TopBar setMobileOpen={setMobileOpen} />

        <main className="flex-1 overflow-y-auto" style={{ background: "#0A0A0F" }}>
          <div className="p-4 md:p-6 min-h-full">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
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