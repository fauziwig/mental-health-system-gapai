"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  User,
  Phone,
  Briefcase,
  Globe,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Building2,
  HeartHandshake,
  HelpCircle,
  Sparkles,
} from "lucide-react";

interface AttemptDetail {
  candidate: {
    name: string;
    whatsapp: string;
    position: string;
    platform: string;
  };
  attempt: {
    attemptId: string;
    status: string;
    startedAt: string;
    completedAt: string;
  };
  result: {
    rawScore: number;
    percentageScore: number;
    scoreBand: string;
    interpretationSummary: string;
    hasItemScoreUnderTwo: boolean;
    isValid: boolean;
  };
  itemsBreakdown: {
    orderIndex: number;
    itemCode: string;
    questionTextEn: string;
    questionTextId: string;
    selectedOptionLabelEn: string;
    selectedOptionLabelId: string;
    scoreValue: number;
  }[];
}

export default function AdminCandidateResultDetailPage() {
  const params = useParams();
  const attemptId = (params.attemptId as string) || "";

  const [data, setData] = useState<AttemptDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetail() {
      try {
        const res = await fetch(`/api/admin/results/${attemptId}`);
        const json = await res.json();
        if (json.status === "success") {
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to load result detail:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Memuat laporan hasil kandidat...</p>
        </div>
      </div>
    );
  }

  const isBelow = data?.result.scoreBand === "BELOW_SUGGESTED_CUTOFF";

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <a
          href="/admin/results"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-300 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Hasil</span>
        </a>

        <div className="text-xs text-slate-400 font-mono">
          ID: {data?.attempt.attemptId}
        </div>
      </div>

      {/* Header Info */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wider font-bold text-purple-600 dark:text-purple-400">
              Laporan Evaluasi Psikologis WHO-5 (2024)
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {data?.candidate.name}
            </h1>
            <p className="text-xs text-slate-500">
              Posisi yang Dilamar: <strong className="text-slate-700 dark:text-slate-300">{data?.candidate.position}</strong>
            </p>
          </div>

          {/* Status Badge */}
          <div
            className={`px-4 py-2.5 rounded-2xl border flex items-center gap-2 self-start sm:self-auto ${
              isBelow
                ? "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200"
                : "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200"
            }`}
          >
            {isBelow ? (
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            )}
            <div>
              <div className="text-xs font-bold">
                {isBelow ? "Di Bawah Batas Saran (< 50%)" : "Memadai / Normal (≥ 50%)"}
              </div>
              <div className="text-[10px] opacity-80">
                {isBelow ? "Perlu Evaluasi / Skrining Lanjutan" : "Tingkat Well-Being Cukup"}
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Profile Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="text-slate-400 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </div>
            <div className="font-bold text-slate-900 dark:text-slate-100 font-mono">
              {data?.candidate.whatsapp}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="text-slate-400 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              <span>Sumber Lowongan</span>
            </div>
            <div className="font-bold text-slate-900 dark:text-slate-100">
              {data?.candidate.platform}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Waktu Selesai</span>
            </div>
            <div className="font-bold text-slate-900 dark:text-slate-100">
              {data?.attempt.completedAt
                ? new Date(data.attempt.completedAt).toLocaleString("id-ID", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-"}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Status Pengerjaan</span>
            </div>
            <div className="font-bold text-emerald-600 dark:text-emerald-400">
              {data?.attempt.status}
            </div>
          </div>
        </div>

        {/* Score Highlights Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Raw Score */}
          <div className="p-5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-900/40 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-purple-700 dark:text-purple-300">
                Raw Score (Penjumlahan Q1 - Q5)
              </div>
              <p className="text-[11px] text-purple-600/80 dark:text-purple-300/70 mt-0.5">
                Skala 0 (terburuk) sampai 25 (terbaik)
              </p>
            </div>
            <div className="text-3xl font-extrabold text-purple-800 dark:text-purple-200 font-mono">
              {data?.result.rawScore} <span className="text-sm font-normal text-purple-500">/ 25</span>
            </div>
          </div>

          {/* Percentage Score */}
          <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-blue-700 dark:text-blue-300">
                Percentage Score (Raw × 4)
              </div>
              <p className="text-[11px] text-blue-600/80 dark:text-blue-300/70 mt-0.5">
                Skala persentase kesejahteraan 0 - 100%
              </p>
            </div>
            <div className="text-3xl font-extrabold text-blue-800 dark:text-blue-200 font-mono">
              {data?.result.percentageScore}%
            </div>
          </div>
        </div>

        {/* Interpretation Summary */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <HeartHandshake className="w-4 h-4 text-purple-600" />
            <span>Interpretasi Resmi WHO-5 & Catatan Kebijakan</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {data?.result.interpretationSummary}
          </p>
          {data?.result.hasItemScoreUnderTwo && (
            <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>Kandidat memiliki setidaknya 1 butir pertanyaan dengan skor rendah (0 atau 1).</span>
            </div>
          )}
        </div>
      </div>

      {/* Questions Breakdown Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Rincian Jawaban Per Butir Pertanyaan (WHO-5)
          </h3>
          <p className="text-xs text-slate-500">
            Pilihan respons yang dipilih oleh kandidat untuk setiap pernyataan (periode 2 minggu terakhir).
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {data?.itemsBreakdown?.map((item) => (
            <div
              key={item.itemCode}
              className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center justify-center">
                    {item.orderIndex}
                  </span>
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    {item.questionTextId}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 italic pl-7">
                  &ldquo;{item.questionTextEn}&rdquo;
                </div>
              </div>

              {/* Selected Choice Badge */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="text-right">
                  <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                    {item.selectedOptionLabelId}
                  </div>
                  <div className="text-[10px] text-slate-400 italic">
                    {item.selectedOptionLabelEn}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow-sm">
                  {item.scoreValue}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
