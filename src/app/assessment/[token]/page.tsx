"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  Clock,
  ShieldCheck,
  User,
  Phone,
  Briefcase,
  Globe,
  ArrowRight,
  AlertCircle,
  Sparkles,
  HeartHandshake,
  ShieldAlert,
} from "lucide-react";

interface SessionInfo {
  session: {
    id: string;
    name: string;
    publicToken: string;
    appliedPosition: string;
    durationMinutes: number;
    allowRetake: boolean;
  };
  company: {
    name: string;
    logoUrl: string | null;
    primaryColor: string;
  };
  assessment: {
    title: string;
    description: string;
    recallPeriod: string;
    instructions: string;
  };
  availablePlatforms: string[];
}

export default function AssessmentWelcomePage() {
  const params = useParams();
  const router = useRouter();
  const token = (params.token as string) || "demo-who5-session";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<SessionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [appliedPosition, setAppliedPosition] = useState("");
  const [platform, setPlatform] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch(`/api/public/assessment-sessions/${token}`);
        const json = await res.json();
        if (json.status === "success") {
          setData(json.data);
          setAppliedPosition(json.data.session.appliedPosition);
          if (json.data.availablePlatforms?.length > 0) {
            setPlatform(json.data.availablePlatforms[0]);
          }
        } else {
          setError(json.message || "Sesi tidak ditemukan");
        }
      } catch (err: any) {
        setError(err.message || "Gagal memuat sesi");
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [token]);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!fullName.trim()) errors.fullName = "Nama lengkap wajib diisi";
    if (!whatsappNumber.trim()) errors.whatsappNumber = "Nomor WhatsApp aktif wajib diisi";
    if (!platform.trim()) errors.platform = "Pilih sumber informasi lowongan";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setSubmitting(true);
    setValidationErrors({});

    try {
      const res = await fetch("/api/assessment/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          whatsappNumber: whatsappNumber.trim(),
          appliedPosition: appliedPosition.trim() || data?.session.appliedPosition,
          platform,
          publicToken: token,
        }),
      });

      const result = await res.json();
      if (res.ok && result.status === "success") {
        router.push(`/assessment/${token}/take`);
      } else {
        setError(result.message || "Gagal memulai sesi asesmen");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan jaringan");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Memuat sesi asesmen...</p>
        </div>
      </div>
    );
  }

  // Jika Sesi Tidak Dapat Diakses / Ditutup / Dihapus
  if (error && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="text-xs uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400">
              Akses Ditutup
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              Sesi Asesmen Tidak Tersedia
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {error}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-500 text-left space-y-1.5">
            <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Informasi Penting:</span>
            </div>
            <p>
              Tautan asesmen ini sudah tidak aktif atau telah dinonaktifkan oleh tim HR. Jika Anda adalah kandidat yang seharusnya mengikuti tes ini, silakan hubungi tim rekrutmen perusahaan terkait untuk mendapatkan tautan sesi aktif yang baru.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Company Header */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
          <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400">
                Portal Asesmen Rekrutmen
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {data?.company.name || "PT Gapai Cita Raharjo"}
              </h1>
            </div>
          </div>

          {/* Assessment Overview */}
          <div className="pt-6 space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {data?.assessment.title || "WHO-5 Well-Being Assessment"}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {data?.assessment.description}
              </p>
            </div>

            {/* Quick Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>Durasi: {data?.session.durationMinutes || 15} Menit</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Periode: 2 Minggu Terakhir</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Kerahasiaan Terjaga</span>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions Alert */}
        <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 flex items-start gap-3">
          <HeartHandshake className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
            <strong>Petunjuk Pengisian:</strong> {data?.assessment.instructions} Jawablah dengan jujur sesuai kondisi aktual yang Anda alami.
          </div>
        </div>

        {/* Candidate Registration Form */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Informasi Kandidat
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Lengkapi data diri Anda sebelum memulai sesi asesmen.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleStart} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                Nama Lengkap
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Budi Pratama"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />
              {validationErrors.fullName && (
                <p className="text-xs text-red-600">{validationErrors.fullName}</p>
              )}
            </div>

            {/* WhatsApp */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                Nomor WhatsApp Aktif
              </label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />
              {validationErrors.whatsappNumber && (
                <p className="text-xs text-red-600">{validationErrors.whatsappNumber}</p>
              )}
            </div>

            {/* Applied Position (Read-only as per PRD) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                Posisi yang Dilamar
              </label>
              <input
                type="text"
                value={appliedPosition}
                onChange={(e) => setAppliedPosition(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-sm focus:outline-none"
              />
            </div>

            {/* Application Platform */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                Platform / Sumber Informasi Lowongan
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              >
                {data?.availablePlatforms?.map((plat) => (
                  <option key={plat} value={plat}>
                    {plat}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: data?.company.primaryColor || "var(--brand-primary)" }}
              >
                {submitting ? (
                  "Menyiapkan Asesmen..."
                ) : (
                  <>
                    <span>Mulai Asesmen Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
