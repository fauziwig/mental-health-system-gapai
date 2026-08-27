"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  Activity,
  Database,
  Server,
  Layout,
  ShieldCheck,
  RefreshCw,
  Layers,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface HealthData {
  status: string;
  database: string;
  latencyMs?: number;
  data?: {
    db_time: string;
    db_name: string;
  };
  error?: string;
  hint?: string;
  serverTime: string;
}

export default function HomePage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setHealth(data);
    } catch (err: any) {
      setHealth({
        status: "error",
        database: "unreachable",
        error: err.message,
        serverTime: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const isDbConnected = health?.database === "connected";

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Baseline MVP Prototype
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
            Mental Health Assessment System
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Platform asesmen kesehatan mental berbasis instrumen resmi{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">WHO-5 Well-Being Index</span> dengan pemisahan arsitektur modular, validasi server-side, dan Drizzle ORM.
          </p>
        </div>

        {/* Live Status Overview Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Live System & Infrastructure Status
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Memverifikasi kesiapan Next.js, API runtime, dan koneksi Supabase PostgreSQL.
              </p>
            </div>
            <button
              onClick={checkHealth}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Memeriksa..." : "Uji Koneksi Ulang"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            {/* Frontend Status */}
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold text-sm">
                  <Layout className="w-4 h-4 text-blue-500" />
                  Frontend Layer
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-xs text-slate-500">Next.js 14 (App Router), React, Tailwind CSS, TypeScript</p>
              <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded w-fit">
                Online & Rendered
              </div>
            </div>

            {/* Backend API Status */}
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold text-sm">
                  <Server className="w-4 h-4 text-purple-500" />
                  API Handlers
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-xs text-slate-500">Route Handlers, Zod Validation, Assessment Engine</p>
              <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded w-fit">
                /api/health [200 OK]
              </div>
            </div>

            {/* Supabase Database Status */}
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold text-sm">
                  <Database className="w-4 h-4 text-emerald-500" />
                  Supabase PostgreSQL
                </div>
                {isDbConnected ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-amber-500" />
                )}
              </div>
              <p className="text-xs text-slate-500">Drizzle ORM + Postgres Pooler Connection</p>
              <div
                className={`text-xs font-mono px-2 py-0.5 rounded w-fit ${
                  isDbConnected
                    ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50"
                    : "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50"
                }`}
              >
                {isDbConnected ? `Connected (${health?.latencyMs}ms)` : "Belum Terhubung"}
              </div>
            </div>
          </div>

          {/* Database Diagnostics Details */}
          {health && (
            <div className="mt-6 p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
              <div className="text-slate-400 mb-1">// API Response Diagnostics:</div>
              <pre>{JSON.stringify(health, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Architecture & Tech Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Core Principles */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              Prinsip Arsitektur WHO-5
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Modular Scoring Strategy:</strong> Logika penilaian WHO-5 (skala 0-5, pengali x4, skor $\le 50$) terisolasi di domain engine.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Server-Side Timer Enforcement:</strong> Waktu kedaluwarsa divalidasi di server untuk mencegah manipulasi client.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Anti-Retake Protection:</strong> Pembatasan pengulangan tes berdasarkan konfigurasi HR dan nomor kontak kandidat.</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Next Steps */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Komponen Siap Implementasi
            </h3>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                <span>1. Form Registrasi & Lembar Ujian Kandidat</span>
                <span className="text-xs font-semibold text-blue-600">Fase 2</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                <span>2. Engine Perhitungan Skor & Interpretasi WHO-5</span>
                <span className="text-xs font-semibold text-blue-600">Fase 2</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                <span>3. Dashboard HR & Manajemen Sesi Asesmen</span>
                <span className="text-xs font-semibold text-blue-600">Fase 3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-400 pt-6">
          Mental Health Assessment Platform • Built with Next.js, Drizzle ORM, Supabase & Tailwind CSS
        </footer>
      </div>
    </main>
  );
}
