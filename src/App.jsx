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
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Importar Datos", path: "/importar-datos", icon: Upload },
  { label: "Configuración", path: "/configuracion", icon: Settings },
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
      {/* Logo */}
      <div
        className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #6C63FF, #00D4AA)" }}>
          <Zap size={16} className="text-white" />
        </div>
        {!collapsed && (
          <span className="text-white font-bold text-lg tracking-tight">
            Sistema <span style={{ color: "#6C63FF" }}>t</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => handleNav(path)}
              title={collapsed ? label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                active
                  ? "text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              } ${collapsed ? "justify-center" : ""}`}
              style={
                active
                  ? {
                      background:
                        "linear-gradient(135deg, rgba(108,99,255,0.25), rgba(0,212,170,0.15))",
                      boxShadow: "inset 0 0 0 1px rgba(108,99,255,0.4)",
                    }
                  : {}
              }
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                  style={{ background: "#6C63FF" }}
                />
              )}
              <Icon
                size={18}
                style={active ? { color: "#6C63FF" } : {}}
                className="flex-shrink-0"
              />
              {!collapsed && <span>{label}</span>}

              {/* Tooltip on collapsed */}
              {collapsed && (
                <span className="absolute left-full ml-3 px-2 py-1 rounded-md text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
                  style={{ background: "#1A1A2E", border: "1px solid rgba(108,99,255,0.3)" }}>
                  {label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle — desktop only */}
      <div className="hidden md:flex border-t border-white/10 p-2 justify-end">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0 transition-all duration-300 border-r border-white/10 ${
          collapsed ? "w-16" : "w-56"
        }`}
        style={{ background: "#1A1A2E" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 w-64 flex flex-col md:hidden transition-transform duration-300 border-r border-white/10 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "#1A1A2E" }}
      >
        {/* Mobile close */}
        <div className="absolute top-4 right-3">
          <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={16} />
          </button>
        </div>
        <SidebarContent />
      </aside>
    </>
  );
}

function TopBar({ setMobileOpen }) {
  const location = useLocation();
  const currentPage = NAV_ITEMS.find((i) => i.path === location.pathname);

  return (
    <header
      className="flex-shrink-0 h-14 flex items-center gap-4 px-4 md:px-6 border-b border-white/10"
      style={{ background: "rgba(26,26,46,0.6)", backdropFilter: "blur(12px)" }}
    >
      {/* Hamburger mobile */}
      <button
        className="md:hidden w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-2">
        {currentPage && (
          <currentPage.icon size={16} style={{ color: "#6C63FF" }} />
        )}
        <span className="text-white/80 text-sm font-medium">
          {currentPage?.label ?? ""}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div
          className="text-xs px-2 py-1 rounded-full font-medium"
          style={{
            background: "rgba(0,212,170,0.15)",
            color: "#00D4AA",
            border: "1px solid rgba(0,212,170,0.3)",
          }}
        >
          Sistema t
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#0A0A0F", color: "#ffffff" }}
    >
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar setMobileOpen={setMobileOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/importar-datos" element={<ImportarDatos />} />
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}