"use client";

import Link from "next/link";
import { CheckCircle2, ShieldCheck, HeartHandshake, ArrowLeft, Building2 } from "lucide-react";

export default function AssessmentCompletedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 sm:p-10 text-center space-y-6">
        {/* Success Animated Icon */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Asesmen Berhasil Dikirimkan!
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            Terima kasih telah meluangkan waktu untuk menyelesaikan asesmen kesehatan mental (WHO-5 Well-Being Index).
          </p>
        </div>

        {/* Confidentiality Notice Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-left space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Kerahasiaan & Proses Selanjutnya</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Data dan hasil respons Anda telah tersimpan secara aman dan terenkripsi. Tim HR / Rekrutmen perusahaan akan meninjau hasil evaluasi ini sebagai bagian dari proses seleksi. Anda dapat menutup halaman ini sekarang.
          </p>
        </div>

        {/* Home Button */}
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
