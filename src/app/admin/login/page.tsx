"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, Building2, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@gapai.id");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.status === "success") {
        router.push("/admin");
      } else {
        setError(data.message || "Gagal masuk. Periksa email & kata sandi.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-purple-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-600/30 border border-purple-500/40 text-purple-300 shadow-inner">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Portal Admin HR
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/70 mt-1">
              Mental Health Assessment Management System
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-purple-100 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-300" />
                Email Administrator / HR
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gapai.id"
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/20 bg-black/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-purple-100 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-300" />
                Kata Sandi
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/20 bg-black/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                "Memverifikasi..."
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Preset */}
          <div className="pt-2 border-t border-white/10 space-y-2.5">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-purple-300/80 text-center">
              Akses Cepat Pengujian (1-Click Demo)
            </div>
            <button
              type="button"
              onClick={() => handleQuickLogin("admin@gapai.id", "admin123")}
              className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-purple-200 transition flex items-center justify-between"
            >
              <span className="font-mono">admin@gapai.id</span>
              <span className="text-[10px] bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full">
                Use Preset
              </span>
            </button>
          </div>
        </div>

        {/* Security Footer Notice */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-purple-300/60">
          <ShieldCheck className="w-4 h-4" />
          <span>Sesi Terenkripsi & Terproteksi</span>
        </div>
      </div>
    </div>
  );
}
