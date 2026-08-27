"use client";

import { useState, useEffect } from "react";
import {
  FileCheck2,
  Search,
  Filter,
  ArrowUpRight,
  RefreshCw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Building2,
  Phone,
  Briefcase,
} from "lucide-react";

interface ResultRow {
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
}

export default function AdminResultsPage() {
  const [results, setResults] = useState<ResultRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBand, setFilterBand] = useState<string>("ALL");

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/results");
      const json = await res.json();
      if (json.status === "success") {
        setResults(json.data);
      }
    } catch (err) {
      console.error("Failed to load results:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const filteredResults = results.filter((row) => {
    const matchesSearch =
      row.candidateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.whatsapp?.includes(searchQuery) ||
      row.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.platform?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBand =
      filterBand === "ALL"
        ? true
        : filterBand === "BELOW"
        ? row.scoreBand === "BELOW_SUGGESTED_CUTOFF"
        : row.scoreBand === "NOT_BELOW_SUGGESTED_CUTOFF";

    return matchesSearch && matchesBand;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="text-xs uppercase tracking-wider font-bold text-purple-600 dark:text-purple-400">
            Penilaian & Evaluasi
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Hasil & Skor Kandidat
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Daftar seluruh kandidat yang telah menyelesaikan tes evaluasi kesejahteraan psikologis WHO-5.
          </p>
        </div>

        <button
          onClick={fetchResults}
          disabled={loading}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-2 transition self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, WhatsApp, posisi..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs text-slate-500 font-medium">Status Cut-off:</span>
          <select
            value={filterBand}
            onChange={(e) => setFilterBand(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="NOT_BELOW">Memadai (≥ 50%)</option>
            <option value="BELOW">Perlu Skrining Lanjutan (&lt; 50%)</option>
          </select>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Nama Kandidat</th>
                <th className="py-3.5 px-4">Posisi & Sumber</th>
                <th className="py-3.5 px-4">Raw Score (0-25)</th>
                <th className="py-3.5 px-4">Persentase (0-100%)</th>
                <th className="py-3.5 px-4">Status Ambang Batas</th>
                <th className="py-3.5 px-4">Waktu Submit</th>
                <th className="py-3.5 px-4 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada data kandidat yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredResults.map((att) => {
                  const isBelow = att.scoreBand === "BELOW_SUGGESTED_CUTOFF";

                  return (
                    <tr
                      key={att.attemptId}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="py-4 px-4">
                        <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {att.candidateName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {att.whatsapp}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-slate-800 dark:text-slate-200 font-medium">
                          {att.position}
                        </div>
                        <div className="text-[11px] text-slate-400">{att.platform}</div>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
                        {att.rawScore !== null ? `${att.rawScore} / 25` : "-"}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {att.percentageScore !== null ? `${att.percentageScore}%` : "-"}
                      </td>
                      <td className="py-4 px-4">
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
                            {isBelow ? "Perlu Skrining (<50%)" : "Memadai (≥50%)"}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-slate-500">
                        {att.completedAt
                          ? new Date(att.completedAt).toLocaleString("id-ID", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <a
                          href={`/admin/results/${att.attemptId}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:hover:bg-purple-900/60 dark:text-purple-300 font-semibold text-xs transition"
                        >
                          <span>Lihat Laporan</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
