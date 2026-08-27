"use client";

import { useState, useEffect } from "react";
import {
  CalendarDays,
  PlusCircle,
  Copy,
  Check,
  ExternalLink,
  Clock,
  Lock,
  RefreshCw,
  AlertCircle,
  X,
  Building2,
  Sparkles,
} from "lucide-react";

interface AssessmentSessionItem {
  id: string;
  publicToken: string;
  appliedPosition: string;
  durationMinutes: number;
  allowRetake: boolean;
  status: string;
  expiresAt: string;
  createdAt: string;
  attemptCount?: number;
}

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<AssessmentSessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [positionInput, setPositionInput] = useState("");
  const [durationInput, setDurationInput] = useState(15);
  const [expireDaysInput, setExpireDaysInput] = useState(30);
  const [allowRetakeInput, setAllowRetakeInput] = useState(false);
  const [creating, setCreating] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sessions");
      const json = await res.json();
      if (json.status === "success") {
        setSessions(json.data);
      }
    } catch (err) {
      console.error("Failed to load sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleCopyLink = (token: string, id: string) => {
    const origin = window.location.origin;
    const url = `${origin}/assessment/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!positionInput.trim()) {
      setModalError("Nama posisi lowongan wajib diisi");
      return;
    }

    setCreating(true);
    setModalError(null);

    try {
      const res = await fetch("/api/admin/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appliedPosition: positionInput.trim(),
          durationMinutes: Number(durationInput),
          expireDays: Number(expireDaysInput),
          allowRetake: allowRetakeInput,
        }),
      });

      const json = await res.json();
      if (res.ok && json.status === "success") {
        setShowModal(false);
        setPositionInput("");
        fetchSessions();
      } else {
        setModalError(json.message || "Gagal membuat sesi.");
      }
    } catch (err: any) {
      setModalError(err.message || "Terjadi kesalahan jaringan.");
    } finally {
      setCreating(false);
    }
  };

  const handleCloseSession = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menutup sesi asesmen ini? Kandidat tidak akan dapat mengaksesnya lagi.")) return;

    try {
      await fetch(`/api/admin/sessions/${id}/close`, { method: "POST" });
      fetchSessions();
    } catch (err) {
      console.error("Failed to close session:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="text-xs uppercase tracking-wider font-bold text-purple-600 dark:text-purple-400">
            Sesi Rekrutmen & Token
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Manajemen Sesi Asesmen
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Buat tautan unik untuk dibagikan kepada kandidat sesuai dengan posisi lowongan yang dibuka.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSessions}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-2 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm shadow-purple-600/30 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Buat Sesi Asesmen Baru</span>
          </button>
        </div>
      </div>

      {/* Sessions List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Posisi Lowongan</th>
                <th className="py-3.5 px-4">Durasi Pengerjaan</th>
                <th className="py-3.5 px-4">Status Sesi</th>
                <th className="py-3.5 px-4">Batas Waktu Akses</th>
                <th className="py-3.5 px-4">Tautan Kandidat</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sessions.map((ses) => {
                const isCopied = copiedId === ses.id;
                const isActive = ses.status === "ACTIVE";

                return (
                  <tr
                    key={ses.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="py-4 px-4">
                      <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {ses.appliedPosition}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Token: {ses.publicToken}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        <span>{ses.durationMinutes} Menit</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {ses.allowRetake ? "Boleh Retake" : "1x Kesempatan"}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        {isActive ? "Aktif" : "Ditutup"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                      {new Date(ses.expiresAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleCopyLink(ses.publicToken, ses.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                          isCopied
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60"
                            : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin Tautan</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <a
                        href={`/assessment/${ses.publicToken}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-purple-600 text-xs font-semibold p-1"
                        title="Buka Halaman Ujian"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      {isActive && (
                        <button
                          onClick={() => handleCloseSession(ses.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-semibold p-1"
                          title="Tutup Sesi"
                        >
                          Tutup
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Buat Sesi Baru */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Buat Sesi Asesmen Baru
                  </h3>
                  <p className="text-xs text-slate-500">WHO-5 Well-Being Index (2024)</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSession} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Nama Posisi yang Dilamar *
                </label>
                <input
                  type="text"
                  required
                  value={positionInput}
                  onChange={(e) => setPositionInput(e.target.value)}
                  placeholder="Contoh: Senior Backend Engineer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Durasi Pengerjaan
                  </label>
                  <select
                    value={durationInput}
                    onChange={(e) => setDurationInput(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value={10}>10 Menit</option>
                    <option value={15}>15 Menit (Standar)</option>
                    <option value={30}>30 Menit</option>
                    <option value={60}>60 Menit</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Masa Berlaku Sesi
                  </label>
                  <select
                    value={expireDaysInput}
                    onChange={(e) => setExpireDaysInput(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value={7}>7 Hari</option>
                    <option value={14}>14 Hari</option>
                    <option value={30}>30 Hari (1 Bulan)</option>
                    <option value={90}>90 Hari</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-purple-600/30 transition disabled:opacity-50"
                >
                  {creating ? "Membuat..." : "Buat & Dapatkan Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
