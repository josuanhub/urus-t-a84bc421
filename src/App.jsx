import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
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

const navItems = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    path: "/importar-datos",
    label: "Importar Datos",
    icon: Upload,
  },
  {
    path: "/configuracion",
    label: "Configuración",
    icon: Settings,
  },
];

function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className={`flex items-center h-16 px-4 border-b border-white/10 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-white font-semibold text-lg tracking-wide">
              Sistema t
            </span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center justify-center w-7 h-7 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? "bg-gradient-to-r from-[#6C63FF]/20 to-[#00D4AA]/10 text-white border border-[#6C63FF]/30"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <div
                className={`flex-shrink-0 ${
                  isActive ? "text-[#6C63FF]" : "text-white/50 group-hover:text-[#00D4AA]"
                } transition-colors duration-200`}
              >
                <Icon size={20} />
              </div>
              {!collapsed && (
                <span className="font-medium text-sm truncate">{label}</span>
              )}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-[#6C63FF] to-[#00D4AA] rounded-r-full" />
              )}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2 py-1 bg-[#1A1A2E] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap border border-white/10 z-50 transition-opacity duration-150">
                  {label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <div
          className={`flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">t</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-white text-xs font-medium truncate">
                Sistema t
              </span>
              <span className="text-white/30 text-xs truncate">v1.0.0</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col flex-shrink-0 bg-[#0D0D16] border-r border-white/10 transition-all duration-300 ease-in-out ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#0D0D16] border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}

function Topbar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const currentPage = navItems.find((n) => n.path === location.pathname);

  return (
    <header className="h-16 flex items-center px-4 md:px-6 border-b border-white/10 bg-[#0A0A0F]/80 backdrop-blur-md flex-shrink-0">
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 mr-3"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className="flex items-center gap-2">
        {currentPage && (
          <>
            <currentPage.icon size={18} className="text-[#6C63FF]" />
            <h1 className="text-white font-semibold text-base md:text-lg">
              {currentPage.label}
            </h1>
          </>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00D4AA]/10 border border-[#00D4AA]/20">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
          <span className="text-[#00D4AA] text-xs font-medium hidden sm:block">
            Conectado
          </span>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0A0A0F] text-white overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full p-4 md:p-6">
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