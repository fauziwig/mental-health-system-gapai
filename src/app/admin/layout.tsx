"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  FileCheck2,
  Settings,
  LogOut,
  Building2,
  Menu,
  X,
  User,
  HeartHandshake,
} from "lucide-react";
import { useBrand } from "@/components/branding/BrandProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { brand } = useBrand();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Jika di halaman login admin, render tanpa sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    {
      label: "Dashboard & Metrik",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      label: "Sesi Asesmen",
      href: "/admin/sessions",
      icon: CalendarDays,
      active: pathname.startsWith("/admin/sessions"),
    },
    {
      label: "Hasil & Skor Kandidat",
      href: "/admin/results",
      icon: FileCheck2,
      active: pathname.startsWith("/admin/results"),
    },
    {
      label: "Pengaturan & Branding",
      href: "/admin/settings",
      icon: Settings,
      active: pathname.startsWith("/admin/settings"),
    },
  ];

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold text-sm"
            style={{ backgroundColor: brand.primaryColor || "var(--brand-primary)" }}
          >
            <Building2 className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate max-w-[200px]">
            {brand.name}
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-slate-900 text-white border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
              style={{ backgroundColor: brand.primaryColor || "var(--brand-primary)" }}
            >
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div
                className="text-xs uppercase tracking-wider font-bold truncate"
                style={{ color: brand.primaryColor || "var(--brand-primary)" }}
              >
                Portal HR
              </div>
              <div className="text-sm font-bold text-slate-100 truncate">{brand.name}</div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 px-3 py-2">
            Menu Utama
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  item.active
                    ? "text-white shadow-md font-bold"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
                style={
                  item.active
                    ? {
                        backgroundColor: brand.primaryColor || "var(--brand-primary)",
                      }
                    : {}
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </a>
            );
          })}

          <div className="pt-6">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 px-3 py-2">
              Instrumen Aktif
            </div>
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/40 text-xs space-y-1">
              <div
                className="font-semibold flex items-center gap-1.5"
                style={{ color: brand.primaryColor || "var(--brand-primary)" }}
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>WHO-5 Well-Being</span>
              </div>
              <p className="text-[11px] text-slate-400">Version 2024 (5 Items, 0-5 scale)</p>
            </div>
          </div>
        </div>

        {/* User Profile & Logout Bottom */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center gap-3 px-2 py-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white"
              style={{ backgroundColor: brand.primaryColor || "var(--brand-primary)" }}
            >
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-200 truncate">HR Admin Lead</div>
              <div className="text-[10px] text-slate-400 truncate">admin@gapai.id</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-red-950/40 hover:text-red-300 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{loggingOut ? "Keluar..." : "Keluar Sesi"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
