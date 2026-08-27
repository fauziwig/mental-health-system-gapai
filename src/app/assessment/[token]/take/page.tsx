"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Send,
  HelpCircle,
  ShieldAlert,
} from "lucide-react";

interface QuestionItem {
  id: string;
  orderIndex: number;
  itemCode: string;
  textEn: string;
  textId: string;
}

interface OptionItem {
  id: string;
  orderIndex: number;
  labelEn: string;
  labelId: string;
  scoreValue: number;
}

export default function AssessmentTakePage() {
  const params = useParams();
  const router = useRouter();
  const token = (params.token as string) || "demo-who5-session";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [items, setItems] = useState<QuestionItem[]>([]);
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [remainingSeconds, setRemainingSeconds] = useState<number>(15 * 60);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Attempt & Questions
  useEffect(() => {
    async function loadAttempt() {
      try {
        const res = await fetch("/api/assessment/attempt");
        const json = await res.json();
        if (json.status === "success") {
          setItems(json.data.items);
          setOptions(json.data.options);
          setRemainingSeconds(json.data.remainingSeconds || 15 * 60);
        } else {
          setError(json.message || "Gagal memuat pertanyaan");
        }
      } catch (err: any) {
        setError(err.message || "Gagal memuat pertanyaan");
      } finally {
        setLoading(false);
      }
    }
    loadAttempt();
  }, []);

  // Timer Countdown Effect
  useEffect(() => {
    if (loading || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, remainingSeconds]);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (itemCode: string, scoreValue: number) => {
    setAnswers((prev) => ({
      ...prev,
      [itemCode]: scoreValue,
    }));
  };

  const answeredCount = Object.keys(answers).length;
  const totalCount = items.length || 5;
  const isAllAnswered = answeredCount === totalCount;
  const isTimeCritical = remainingSeconds < 120; // Kurang dari 2 menit

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const formattedAnswers = items.map((item) => ({
      itemId: item.itemCode,
      orderIndex: item.orderIndex,
      scoreValue: answers[item.itemCode] ?? 0,
    }));

    try {
      const res = await fetch("/api/assessment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: formattedAnswers,
        }),
      });

      const result = await res.json();
      if (res.ok && result.status === "success") {
        router.push(`/assessment/${token}/completed`);
      } else {
        setError(result.message || "Gagal mengirimkan jawaban");
        setSubmitting(false);
        setShowConfirmModal(false);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan jaringan");
      setSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  const handleAutoSubmit = () => {
    handleSubmit();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Memuat lembar asesmen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Sticky Header with Timer & Progress */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              WHO-5 Well-Being Index
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Progres: {answeredCount} dari {totalCount} Terjawab
            </div>
          </div>

          {/* Real-time Countdown Timer */}
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono font-bold text-sm transition-colors ${
              isTimeCritical
                ? "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 animate-pulse border border-red-300"
                : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTime(remainingSeconds)}</span>
          </div>
        </div>

        {/* Progress Bar Line */}
        <div className="max-w-4xl mx-auto mt-2 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${(answeredCount / totalCount) * 100}%`,
              backgroundColor: "var(--brand-primary, #890DD3)",
            }}
          />
        </div>
      </header>

      {/* Main Questionnaire Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Instruction Banner */}
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--brand-primary, #890DD3)" }} />
          <div>
            <strong>Pertanyaan Evaluasi (2 Minggu Terakhir):</strong> Silakan tentukan seberapa sering Anda merasakan kondisi-kondisi di bawah ini selama 14 hari terakhir.
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Question Cards */}
        <div className="space-y-6">
          {items.map((item) => {
            const currentSelected = answers[item.itemCode];
            const isAnswered = currentSelected !== undefined;

            return (
              <div
                key={item.itemCode}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border transition-all shadow-sm border-slate-200 dark:border-slate-800"
              >
                {/* Question Header */}
                <div className="flex items-start gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                      isAnswered
                        ? "text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                    style={isAnswered ? { backgroundColor: "var(--brand-primary, #890DD3)" } : {}}
                  >
                    {item.orderIndex}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {item.textId}
                    </h3>
                    <p className="text-xs text-slate-500 italic mt-0.5">
                      &ldquo;{item.textEn}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Response Options (Scale 5 to 0) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-4">
                  {options.map((opt) => {
                    const isSelected = currentSelected === opt.scoreValue;

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(item.itemCode, opt.scoreValue)}
                        className={`p-3.5 rounded-xl text-left border text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-2 ${
                          isSelected
                            ? "shadow-sm"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                        }`}
                        style={
                          isSelected
                            ? {
                                borderColor: "var(--brand-primary, #890DD3)",
                                backgroundColor: "var(--brand-primary)15",
                              }
                            : {}
                        }
                      >
                        <div className="space-y-0.5">
                          <div className="font-semibold">{opt.labelId}</div>
                          <div className="text-[11px] text-slate-500 italic">{opt.labelEn}</div>
                        </div>
                        <div
                          className="w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0"
                          style={
                            isSelected
                              ? {
                                  borderColor: "var(--brand-primary, #890DD3)",
                                  backgroundColor: "var(--brand-primary, #890DD3)",
                                }
                              : { borderColor: "#cbd5e1" }
                          }
                        >
                          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Actions Area */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500">
            {isAllAnswered ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Semua 5 pertanyaan telah dijawab lengkap.
              </span>
            ) : (
              <span>Harap lengkapi semua pertanyaan sebelum mengirimkan asesmen.</span>
            )}
          </div>

          <button
            type="button"
            disabled={!isAllAnswered || submitting}
            onClick={() => setShowConfirmModal(true)}
            className="w-full sm:w-auto px-6 py-3 text-white font-semibold text-sm rounded-xl shadow-md transition disabled:opacity-40 flex items-center justify-center gap-2"
            style={{ backgroundColor: "var(--brand-primary, #890DD3)" }}
          >
            <Send className="w-4 h-4" />
            <span>Kirim Jawaban Asesmen</span>
          </button>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Kirim Jawaban Asesmen?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Jawaban yang telah dikirimkan tidak dapat diubah kembali. Pastikan Anda telah menjawab seluruh 5 pertanyaan dengan jujur.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                Periksa Kembali
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {submitting ? "Mengirim..." : "Ya, Kirim Sekarang"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
