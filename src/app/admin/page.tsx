"use client";

import { useState, useEffect } from "react";
import {
  Users,
  CalendarDays,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  Sparkles,
  Search,
  ChevronRight,
  Building2,
  RefreshCw,
  PlusCircle,
} from "lucide-react";

interface DashboardData {
  summary: {
    totalSessions: number;
    totalCandidates: number;
    completedAttempts: number;
    averagePercentageScore: number;
    cutOffDistribution: {
      notBelowCutoff: number;
      belowCutoff: number;
    };
  };
  recentAttempts: {
    attemptId: string;
    candidateName: string;
    whatsapp: string;
    position: string;
    platform: string;
    status: string;
    rawScore: number | null;
    percentageScore: number | null;
    scoreBand: string | null;
    completedAt: string | null;
  }[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard");
      const json = await res.json();
      if (json.status === "success") {
        setData(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const totalEvaluated =
    (data?.summary.cutOffDistribution.notBelowCutoff || 0) +
    (data?.summary.cutOffDistribution.belowCutoff || 0);

  const notBelowPercent =
    totalEvaluated > 0
      ? Math.round(
          ((data?.summary.cutOffDistribution.notBelowCutoff || 0) / totalEvaluated) * 100
        )
      : 0;

  return (
    <div className="space-y-8">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="text-xs uppercase tracking-wider font-bold text-purple-600 dark:text-purple-400">
            Overview & Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Dashboard Rekrutmen & Asesmen
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitoring progres asesmen kandidat dengan instrumen WHO-5 Well-Being Index secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-2 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <a
            href="/admin/sessions"
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm shadow-purple-600/30 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Buat Sesi Baru</span>
          </a>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Sesi Rekrutmen</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {data?.summary.totalSessions || 0}
          </div>
          <div className="text-[11px] text-slate-400">Sesi asesmen yang dibuat</div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Kandidat Terdaftar</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {data?.summary.totalCandidates || 0}
          </div>
          <div className="text-[11px] text-slate-400">Peserta yang membuka asesmen</div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Asesmen Selesai</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {data?.summary.completedAttempts || 0}
          </div>
          <div className="text-[11px] text-slate-400">Telah submit dan dihitung skor</div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Rata-Rata Skor WHO-5</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {data?.summary.averagePercentageScore || 0}%
          </div>
          <div className="text-[11px] text-slate-400">Skala persentase 0 - 100%</div>
        </div>
      </div>

      {/* Well-Being Distribution Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Distribusi Status Ambang Batas WHO-5 (Cut-off ≥ 50%)
            </h3>
            <p className="text-xs text-slate-500">
              Evaluasi kesejahteraan psikologis berdasarkan ambang batas resmi WHO-5 (2024).
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-500">
            Total Dievaluasi: <span className="text-slate-900 dark:text-slate-100 font-bold">{totalEvaluated}</span> Kandidat
          </div>
        </div>

        {/* Progress Ratio Bar */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${notBelowPercent}%` }}
              title={`Memadai (≥ 50%): ${data?.summary.cutOffDistribution.notBelowCutoff} (${notBelowPercent}%)`}
            />
            <div
              className="h-full bg-amber-500 transition-all duration-500"
              style={{ width: `${100 - notBelowPercent}%` }}
              title={`Di Bawah Cut-off (< 50%): ${data?.summary.cutOffDistribution.belowCutoff} (${100 - notBelowPercent}%)`}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Di Atas / Sesuai Ambang Batas (≥ 50%):{" "}
                <strong>{data?.summary.cutOffDistribution.notBelowCutoff || 0}</strong> ({notBelowPercent}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Di Bawah Batas Saran (&lt; 50%):{" "}
                <strong>{data?.summary.cutOffDistribution.belowCutoff || 0}</strong> ({100 - notBelowPercent}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Candidates Submissions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Aktivitas Asesmen Kandidat Terbaru
            </h3>
            <p className="text-xs text-slate-500">
              Daftar kandidat yang baru saja menyelesaikan asesmen WHO-5.
            </p>
          </div>
          <a
            href="/admin/results"
            className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            <span>Lihat Semua Hasil</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Nama Kandidat</th>
                <th className="py-3 px-4">Posisi & Sumber</th>
                <th className="py-3 px-4">Raw Score (0-25)</th>
                <th className="py-3 px-4">Persentase (0-100%)</th>
                <th className="py-3 px-4">Status Ambang Batas</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data?.recentAttempts?.map((att) => {
                const isBelow = att.scoreBand === "BELOW_SUGGESTED_CUTOFF";

                return (
                  <tr
                    key={att.attemptId}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {att.candidateName}
                      </div>
                      <div className="text-[11px] text-slate-400">{att.whatsapp}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 dark:text-slate-200 font-medium">
                        {att.position}
                      </div>
                      <div className="text-[11px] text-slate-400">{att.platform}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {att.rawScore !== null ? `${att.rawScore} / 25` : "-"}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {att.percentageScore !== null ? `${att.percentageScore}%` : "-"}
                    </td>
                    <td className="py-3.5 px-4">
                      {att.scoreBand ? (
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            isBelow
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900"
                              : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isBelow ? "bg-amber-500" : "bg-emerald-500"
                            }`}
                          />
                          {isBelow ? "Perlu Skrining Lanjutan (<50%)" : "Memadai (≥50%)"}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={`/admin/results/${att.attemptId}`}
                        className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 font-semibold text-xs"
                      >
                        <span>Detail</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
